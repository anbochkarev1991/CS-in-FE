import { BitGetter } from '../../first-lecture/bitGetter';

type SchemaElement = [number, string];
type Data =  (number | string | boolean)[];

export function throwTypeError(type: string, value: number | string | boolean): void {
  if (typeof value !== type && type !== 'ascii') {
    throw new Error(`Type of ${value} does not match with type ${type} from schema`);
  }
}

export function throwLengthError(length: number, value: number | string | boolean): void {
  let binary = '';
  if (typeof value === 'string') {
    binary = convertStringToBinaryAsAscii(value);
  } else if (typeof value === 'number') {
    binary = value.toString(2);
  }

  if (binary.length !== length) {
    throw new Error(`Binary length of ${value} does not match with length ${length} from schema`);
  }
}

export function convertStringToBinaryAsAscii(value: string): string {
  let binary = '';
  for (let i = 0; i < value.length; i++) {
    const asciiCode = value.charCodeAt(i);
    const currentCharInBinary = asciiCode.toString(2).padStart(8, '0');
    binary += currentCharInBinary;
  }

  return binary;
}

export function decodeAsciiChars(binaryString: string, bitsForString: number) {
  const charsCount = Math.ceil(bitsForString / 8);
  let decodedString = '';

  for (let i = 1; i <= charsCount; i++) {
    const binaryChar = binaryString.substring(
      binaryString.length - 8 * i,
      binaryString.length - 8 * (i - 1)
    );

    decodedString += String.fromCharCode(parseInt(binaryChar, 2));
  }

  return decodedString;
}

export function encodeElement(el: any, index: number, bits: number) {
  if (el.toString(2).length > bits) {
    throw new Error(`Bits length ${bits} for element ${el} does not match schema`);
  }

  const binary = el & (2 ** 32 - 1 >>> (32 - bits));
  return binary;
}

export function encode(data: Data, schema: SchemaElement[]): ArrayBuffer | void {
  
  try {
    if (data.length !== schema.length) {
      throw new Error('Data doesn not match the schema');
    }

    const length = schema.reduce((acc: number, el: SchemaElement) => acc + el[0], 0);
    const result = new Uint8Array(new ArrayBuffer(length));
    const bitGetter = new BitGetter(result);
    let encodedData = 0;
    let byteOffset = 0;

    for (let i = 0; i < data.length; i++) {
      const [bits, type] = schema[i];
      byteOffset += schema[i - 1] ? schema[i - 1][0] : 0;

      if (type === 'number') {
        throwTypeError('number', data[i]);
        throwLengthError(bits, data[i]);

        const encodedElement = encodeElement(data[i], i, bits);
        encodedData |= encodedElement << byteOffset;
      } else if (type === 'ascii') {
        throwTypeError('ascii', data[i]);
        throwLengthError(bits, data[i]);
        const chars = (data[i] as string).split('');

        for (let j = 0; j < chars.length; j++) {
          const encodedItem = encodeElement(chars[j].charCodeAt(0), j, bits / chars.length);
          encodedData |= encodedItem << (byteOffset + 8 * j);
        }

      } else if (type === 'boolean') {
        const encodedElement = encodeElement(data[i] ? 1 : 0, i, bits);
        encodedData |= encodedElement << byteOffset;
      }
    }

    const stringFromEncodedData = encodedData.toString(2).padStart(result.length, '0');

    for (let i = 0; i < stringFromEncodedData.length; i++) {
      const byteIndex = Math.floor(i / 8);
      const bitIndex = i % 8;
  
      bitGetter.set(byteIndex, bitIndex, parseInt(stringFromEncodedData[i]) as (0 | 1));
    }
  
    return result.buffer;
  } catch (error) {
    console.error(error);
  }
}

export function decode(data: ArrayBuffer, schema: SchemaElement[]): Data | void {
  try {
    const view = new Uint8Array(data);
    const bitGetter = new BitGetter(view);
    let encodedData = '';
    const result: Data = [];

    for (let i = 0; i < view.length; i++) {
      const byteIndex = Math.floor(i / 8);
      const bitIndex = i % 8;
  
      encodedData += bitGetter.get(byteIndex, bitIndex);
    }

    let byteOffset = 0;
    let previousItem = encodedData.length;
    
    for (let i = 0; i < schema.length; i++) {    
      const bitsForPrevItem = schema[i - 1] ? schema[i - 1][0] : 0;
      byteOffset += bitsForPrevItem;
      previousItem -= bitsForPrevItem;
  
      const item = encodedData.substring(encodedData.length - schema[i][0] - byteOffset, previousItem);
  
      if (schema[i][1] === 'ascii') {
        result.push(decodeAsciiChars(item, schema[i][0]));
      } else if (schema[i][1] === 'number') {
        result.push(parseInt(item, 2));
      } else if (schema[i][1] === 'boolean') {
        result.push(Boolean(parseInt(item)));
      }
    }
  
    return result;
  } catch (error) {
    console.error(error);
  }
}
const schema: SchemaElement[] = [
  [2, 'number'],
  [2, 'number'],
  [1, 'boolean'],
  [1, 'boolean'],
  [16, 'ascii'],
];

const encoded = encode(
  [2, 3, true, false, 'ab'], 
  schema
  );

console.log(encoded);

const decoded = decode(encoded as ArrayBuffer, schema);

console.log(decoded);