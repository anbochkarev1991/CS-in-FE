"use strict";
class Stack {
    constructor(typedArrayConstructor, size) {
        this.headIndex = -1;
        this.head = null;
        this.array = new typedArrayConstructor(size);
        this.maxLength = size;
    }
    push(value) {
        if (this.headIndex === this.maxLength - 1) {
            throw new Error('Maximum length exceeded');
        }
        if (!this.elementsType) {
            this.elementsType = typeof value;
        }
        else if (this.elementsType !== typeof value) {
            throw new Error(`This value ${value} type differs from other elements in the stack`);
        }
        if (typeof value === 'string' && value.length > 1) {
            throw new Error('Cannot add more than 1 string character');
        }
        this.headIndex++;
        this.head = value;
        this.array[this.headIndex]
            |= typeof value === 'string' ? value.charCodeAt(0) : value;
    }
    pop() {
        if (this.headIndex === -1) {
            throw new Error('No more elements in stack');
        }
        const deleted = (this.elementsType === 'string')
            ? String.fromCharCode(this.array[this.headIndex])
            : this.array[this.headIndex];
        this.headIndex--;
        if (this.headIndex === -1) {
            this.head = null;
        }
        else if (this.elementsType === 'string') {
            this.head = String.fromCharCode(this.array[this.headIndex]);
        }
        else {
            this.head = this.array[this.headIndex];
        }
        return deleted;
    }
}
const stack = new Stack(Int32Array, 10);
stack.push(10);
stack.push(11);
stack.push(12);
console.log(stack.head); // 12
console.log(stack.pop()); // 12
console.log(stack.head); // 11
console.log(stack.pop()); // 11
console.log(stack.pop()); // 10
console.log(stack.pop()); // Exception
