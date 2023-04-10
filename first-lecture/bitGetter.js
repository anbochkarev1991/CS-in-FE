class BitGetter {
  constructor(uint8Array) {
    this.uint8Array = uint8Array;
  }

  get(index, order) {
    const byte = this.uint8Array[index];
    const bitMask = 1 << order;
    return (byte & bitMask) >> order;
  }

  set(index, bitIndex, value) {
    if (value === 0) {
      this.uint8Array[index] &= ~(1 << bitIndex);
    } else if (value === 1) {
      this.uint8Array[index] |= (1 << bitIndex);
    } else {
      throw new Error('Invalid value. Must be 0 or 1');
    }
  }
}


const bitGetter = new BitGetter(new Uint8Array([0b1110, 0b1101]));

console.log(bitGetter.get(0, 1)); // 1
console.log(bitGetter.get(1, 1)); // 0
console.log(bitGetter.set(0, 1, 0)); // 
console.log(bitGetter.get(0, 1));    // 0