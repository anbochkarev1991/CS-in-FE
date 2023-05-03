"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = exports.encodeElement = exports.decodeAsciiChars = exports.convertStringToBinaryAsAscii = exports.throwLengthError = exports.throwTypeError = void 0;
const bitGetter_1 = require("../../first-lecture/bitGetter");
function throwTypeError(type, value) {
    if (typeof value !== type && type !== 'ascii') {
        throw new Error(`Type of ${value} does not match with type ${type} from schema`);
    }
}
exports.throwTypeError = throwTypeError;
function throwLengthError(length, value) {
    let binary = '';
    if (typeof value === 'string') {
        binary = convertStringToBinaryAsAscii(value);
    }
    else if (typeof value === 'number') {
        binary = value.toString(2);
    }
    if (binary.length !== length) {
        throw new Error(`Binary length of ${value} does not match with length ${length} from schema`);
    }
}
exports.throwLengthError = throwLengthError;
function convertStringToBinaryAsAscii(value) {
    let binary = '';
    for (let i = 0; i < value.length; i++) {
        const asciiCode = value.charCodeAt(i);
        const currentCharInBinary = asciiCode.toString(2).padStart(8, '0');
        binary += currentCharInBinary;
    }
    return binary;
}
exports.convertStringToBinaryAsAscii = convertStringToBinaryAsAscii;
function decodeAsciiChars(binaryString, bitsForString) {
    const charsCount = Math.ceil(bitsForString / 8);
    let decodedString = '';
    for (let i = 1; i <= charsCount; i++) {
        const binaryChar = binaryString.substring(binaryString.length - 8 * i, binaryString.length - 8 * (i - 1));
        decodedString += String.fromCharCode(parseInt(binaryChar, 2));
    }
    return decodedString;
}
exports.decodeAsciiChars = decodeAsciiChars;
function encodeElement(el, index, bits) {
    if (el.toString(2).length > bits) {
        throw new Error(`Bits length ${bits} for element ${el} does not match schema`);
    }
    const binary = el & (2 ** 32 - 1 >>> (32 - bits));
    return binary;
}
exports.encodeElement = encodeElement;
function encode(data, schema) {
    try {
        if (data.length !== schema.length) {
            throw new Error('Data doesn not match the schema');
        }
        const length = schema.reduce((acc, el) => acc + el[0], 0);
        const result = new Uint8Array(new ArrayBuffer(length));
        const bitGetter = new bitGetter_1.BitGetter(result);
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
            }
            else if (type === 'ascii') {
                throwTypeError('ascii', data[i]);
                throwLengthError(bits, data[i]);
                const chars = data[i].split('');
                for (let j = 0; j < chars.length; j++) {
                    const encodedItem = encodeElement(chars[j].charCodeAt(0), j, bits / chars.length);
                    encodedData |= encodedItem << (byteOffset + 8 * j);
                }
            }
            else if (type === 'boolean') {
                const encodedElement = encodeElement(data[i] ? 1 : 0, i, bits);
                encodedData |= encodedElement << byteOffset;
            }
        }
        const stringFromEncodedData = encodedData.toString(2).padStart(result.length, '0');
        for (let i = 0; i < stringFromEncodedData.length; i++) {
            const byteIndex = Math.floor(i / 8);
            const bitIndex = i % 8;
            bitGetter.set(byteIndex, bitIndex, parseInt(stringFromEncodedData[i]));
        }
        return result.buffer;
    }
    catch (error) {
        console.error(error);
    }
}
exports.encode = encode;
function decode(data, schema) {
    try {
        const view = new Uint8Array(data);
        const bitGetter = new bitGetter_1.BitGetter(view);
        let encodedData = '';
        const result = [];
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
            }
            else if (schema[i][1] === 'number') {
                result.push(parseInt(item, 2));
            }
            else if (schema[i][1] === 'boolean') {
                result.push(Boolean(parseInt(item)));
            }
        }
        return result;
    }
    catch (error) {
        console.error(error);
    }
}
exports.decode = decode;
const schema = [
    [2, 'number'],
    [2, 'number'],
    [1, 'boolean'],
    [1, 'boolean'],
    [16, 'ascii'],
];
const encoded = encode([2, 3, true, false, 'ab'], schema);
console.log(encoded);
const decoded = decode(encoded, schema);
console.log(decoded);
