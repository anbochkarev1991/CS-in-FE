"use strict";
class Structure {
    constructor(schema) {
        let maxEncoding = 0;
        let maxDataLength = 0;
        this.fields = schema.reduce((acc, [field, type, maxLength = 1]) => {
            const bitsPerValue = +type.match(/\d+/)[0];
            maxEncoding = Math.max(maxEncoding, bitsPerValue);
            const resultAcc = Object.assign(acc, {
                [field]: {
                    encoding: bitsPerValue,
                    dataType: type.match(/utf/) ? 'string' : 'number',
                    maxLength,
                    offset: maxDataLength,
                }
            });
            maxDataLength += Number(maxLength);
            return resultAcc;
        }, {});
        this.data
            = new globalThis[`Uint${maxEncoding}Array`](maxDataLength);
    }
    validateData(value, type, maxLength, encoding) {
        if (typeof value !== type) {
            throw new Error(`Value ${value} of type ${type} doesn't match the schema`);
        }
        if (typeof value === 'string' && value.length > maxLength ||
            typeof value !== 'string' && value.toString(2).length > encoding) {
            throw new Error('This element exceeds memory limits set in the schema');
        }
    }
    createBitMask(bits) {
        return 2 ** 32 - 1 >>> (32 - bits);
    }
    write(value, encoding, offset, index) {
        const binaryValue = value & this.createBitMask(encoding);
        if (typeof index !== 'undefined') {
            this.data[index + offset] |= binaryValue;
        }
        else {
            this.data[offset] |= binaryValue;
        }
    }
    set(field, value) {
        if (!this.fields[field]) {
            throw new Error('No such field');
        }
        const { encoding, dataType, maxLength, offset } = this.fields[field];
        this.validateData(value, dataType, maxLength, encoding);
        if (dataType === 'string') {
            String(value).split('').forEach((char, index) => {
                this.write(char.charCodeAt(0), encoding, offset, index);
            });
        }
        else {
            this.write(Number(value), encoding, offset);
        }
    }
    get(field) {
        if (!this.fields[field]) {
            throw new Error('No such field');
        }
        const { dataType, maxLength, offset } = this.fields[field];
        let value;
        if (dataType === 'string') {
            value = '';
            for (let i = 0; i < maxLength + offset; i++) {
                value += String.fromCharCode(this.data[i]);
            }
        }
        else {
            value = this.data[offset];
        }
        return value;
    }
}
const jackBlack = new Structure([
    ['name', 'utf16', 10],
    ['lastName', 'utf16', 10],
    ['age', 'u16'] // uint16
]);
jackBlack.set('name', 'Jack');
jackBlack.set('lastName', 'Black');
jackBlack.set('age', 53);
console.log(jackBlack.get('age')); // 'Jack'
