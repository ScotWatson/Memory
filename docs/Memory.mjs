/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function isBareObject(o) {
  return (o instanceof Object && o.constructor === Object);
}

// cannot change length
// represents a single allocated block of memory
// automatically initialized to all zeros
// addressable as 8-bit (1-byte) entities, but unable to directly access
class MemoryBlock {
  #arrayBuffer;
  constructor(args) {
    if (isBareObject(args)) {
      if (Object.hasOwn(args, "arrayBuffer")) {
        this.#arrayBuffer = args.arrayBuffer;
        let shared;
        if (this.#arrayBuffer instanceof ArrayBuffer) {
          shared = false;
        } else if (this.#arrayBuffer instanceof SharedArrayBuffer) {
          shared = true;
        } else {
          throw new TypeError("Argument arrayBuffer must be a of type ArrayBuffer or SharedArrayBuffer.");
        }
        if (Object.hasOwn(args, "length")) {
          if (typeof args.length !== "number") {
            throw new TypeError("Argument arrayBuffer must be a of type ArrayBuffer or SharedArrayBuffer.");
          }
          if (args.length !== this.#arrayBuffer) {
            throw new Error("Argument length does not match.");
          }
        }
        if (Object.hasOwn(args, "shared")) {
          if (args.shared !== shared) {
            throw new Error("Argument shared does not match.");
          }
        }
      } else {
        if (!(Object.hasOwn(args, "length"))) {
          throw new Error("Argument length is required.");
        }
        this.#arrayBuffer = new ArrayBuffer(args.length);
      }
    } else {
      throw new TypeError("MemoryBlock constructor requires a bare object.");
    }
  }
  get length() {
    return this.#arrayBuffer.byteLength;
  }
  toArrayBuffer() {
    return this.#arrayBuffer;
  }
  static fromIterable(args) {
    if (isBareObject(args)) {
      if (!(Object.hasOwn(args, "iterable"))) {
        throw new Error("Argument iterable is required.");
      }
    } else if (args[Symbol.iterator] === undefined) {
      throw new Error("Invalid Arguments");
    }
    let totalLength = 0;
    for (const item of args) {
      if (!(item instanceof MemoryBlock)) {
        throw new Error("Only MemoryBlock items can be concatenated.");
      }
      totalLength += item.length;
    }
    const newBuffer = new ArrayBuffer(totalLength);
    const newView = new Uint8Array(newBuffer);
    let currentIndex = 0;
    for (const item of args) {
      const itemView = new Uint8Array(item.#arrayBuffer);
      newBuffer.set();
    }
    return new MemoryBlock(newBuffer);
  }
  copyWithin(args) {
    if (!(isBareObject(args))) {
      throw new Error("Invalid Arguments");
    }
    if (!(args.hasOwnProperty("target"))) {
      throw new Error("Invalid Arguments");
    }
    if (typeof args.target !== "Number") {
      throw new Error("Invalid Arguments");
    }
    if (!(Number.isInteger(args.target))) {
      throw new Error("Invalid Arguments: Target must be an integer");
    }
    if (!(args.hasOwnProperty("start"))) {
      throw new Error("Invalid Arguments");
    }
    if (typeof args.start !== "Number") {
      throw new Error("Invalid Arguments");
    }
    if (!(Number.isInteger(args.start))) {
      throw new Error("Invalid Arguments: Start must be an integer");
    }
    if (!(args.hasOwnProperty("end"))) {
      throw new Error("Invalid Arguments");
    }
    if (typeof args.end !== "Number") {
      throw new Error("Invalid Arguments");
    }
    if (!(Number.isInteger(args.end))) {
      throw new Error("Invalid Arguments: End must be an integer");
    }
    const view = new Uint8Array(this.#arrayBuffer);
    view.copyWithin(args.target, args.start, args.end);
    return this;
  }
  createReversed() {
    const newBuffer = new ArrayBuffer(this.#arrayBuffer);
    const view = new Uint8Array();
    view.reverse();
    return new MemoryBlock(newBuffer);
  }
  reverse() {
    const view = new Uint8Array(this.#arrayBuffer);
    view.reverse();
    return this;
  }
  createCopy(args) {
    return new MemoryBlock(new ArrayBuffer(this.#arrayBuffer));
  }
  createSlicedCopy(args) {
    if (!(args.hasOwnProperty("start"))) {
      throw new Error("Invalid Arguments");
    }
    if (typeof args.start !== "Number") {
      throw new Error("Invalid Arguments");
    }
    if (!(Number.isInteger(args.start))) {
      throw new Error("Invalid Arguments: start must be an integer");
    }
    if (!(args.hasOwnProperty("end"))) {
      throw new Error("Invalid Arguments");
    }
    if (typeof args.end !== "Number") {
      throw new Error("Invalid Arguments");
    }
    if (!(Number.isInteger(args.end))) {
      throw new Error("Invalid Arguments: end must be an integer");
    }
    const newLength = args.end - args.start;
    const newBuffer = new ArrayBuffer(newLength);
    const copyView = new Uint8Array(this.#arrayBuffer, args.start, args.end);
    newBuffer.set(copyView);
    return new MemoryBlock(newBuffer);
  }
}

class Uint8 {
  #view;
  constructor (args) {
    if (!(args.hasOwnProperty("memoryBlock"))) {
      throw new Error("memoryBlock is required.");
    }
    let byteOffset;
    if (args.hasOwnProperty("byteOffset")) {
      byteOffset = args.byteOffset;
    } else {
      byteOffset = 0;
    }
  }
  setValue(args) {
    if (typeof args === "number") {
    }
    this.#view[0] = args.newValue;
  }
  valueOf() {
    return this.#view[0];
  }
}

// cannot change length
// locked to a memory block
// interprets each byte as an unsigned 8-bit integer
// allows reading and writing of contents
class Uint8View {
  #memoryBlock;
  #view;
  static BYTES_PER_ELEMENT = 1;
  constructor(args) {
    if (!(args.hasOwnProperty("memoryBlock"))) {
      throw new Error("memoryBlock is required.");
    }
    let byteOffset;
    if (args.hasOwnProperty("byteOffset")) {
      byteOffset = args.byteOffset;
    } else {
      byteOffset = 0;
    }
    let length;
    if (args.hasOwnProperty("length")) {
      length = args.length;
    } else {
      length = args.buffer.byteLength;
    }
    this.#memoryBlock = args.memoryBlock;
    const arrayBuffer = this.#memoryBlock.toArrayBuffer();
    this.#view = new Uint8Array(arrayBuffer, byteOffset, length);
    let currentByteOffset = byteOffset;
    this.#array = new Array(length);
    for (let i = 0; i < length; ++i) {
      this.#array = new Uint8Array(arrayBuffer, currentByteOffset, Uint8View.BYTES_PER_ELEMENT);
      currentByteOffset += Uint8View.BYTES_PER_ELEMENT;
    }
  }
  get length() {
    return this.#view.length;
  }
  get [Symbol.iterator]() {
    return this.#view[Symbol.iterator];
  }
  at(args) {
    if (!(args.hasOwnProperty("index"))) {
      throw new Error("index is required.");
    }
    return this.#view[args.index];
  }
  copyWithin(args) {
    if (!(args.hasOwnProperty("toIndex"))) {
      throw new Error("target is required.");
    }
    if (!(args.hasOwnProperty("fromIndex"))) {
      throw new Error("start is required.");
    }
    if (!(args.hasOwnProperty("length"))) {
      throw new Error("end is required.");
    }
  }
  every(args) {
    // element, index, array
    if (!(args.hasOwnProperty("callbackFn"))) {
      throw new Error("callbackFn is required.");
    }
  }
  fill(args) {
    if (!(args.hasOwnProperty("value"))) {
      throw new Error("value is required.");
    }
    if (!(args.hasOwnProperty("startIndex"))) {
      throw new Error("start is required.");
    }
    if (!(args.hasOwnProperty("endIndex"))) {
      throw new Error("end is required.");
    }
  }
  filter(args) {
    // element, index, array
    if (!(args.hasOwnProperty("callbackFn"))) {
      throw new Error("callbackFn is required.");
    }
  }
  find(args) {
    // element, index, array
    if (!(args.hasOwnProperty("callbackFn"))) {
      throw new Error("callbackFn is required.");
    }
  }
  findIndex(args) {
    // element, index, array
    if (!(args.hasOwnProperty("callbackFn"))) {
      throw new Error("callbackFn is required.");
    }
  }
  findLast(args) {
    // element, index, array
    if (!(args.hasOwnProperty("callbackFn"))) {
      throw new Error("callbackFn is required.");
    }
  }
  findLastIndex(args) {
    // element, index, array
    if (!(args.hasOwnProperty("callbackFn"))) {
      throw new Error("callbackFn is required.");
    }
  }
  forEach(args) {
    // element, index, array
    if (!(args.hasOwnProperty("callbackFn"))) {
      throw new Error("callbackFn is required.");
    }
  }
  includes(args) {
    if (!(args.hasOwnProperty("searchElement"))) {
      throw new Error("searchElement is required.");
    }
    if (!(args.hasOwnProperty("fromIndex"))) {
      throw new Error("fromIndex is required.");
    }
  }
  indexOf(args) {
    if (!(args.hasOwnProperty("searchElement"))) {
      throw new Error("searchElement is required.");
    }
    if (!(args.hasOwnProperty("fromIndex"))) {
      throw new Error("fromIndex is required.");
    }
  }
  lastIndexOf(args) {
    if (!(args.hasOwnProperty("searchElement"))) {
      throw new Error("searchElement is required.");
    }
    if (!(args.hasOwnProperty("fromIndex"))) {
      throw new Error("fromIndex is required.");
    }
  }
  createMapped(args) {
    if (!(args.hasOwnProperty("callbackFn"))) {
      throw new Error("callbackFn is required.");
    }
  }
  reduce(args) {
    if (!(args.hasOwnProperty("callbackFn"))) {
      throw new Error("callbackFn is required.");
    }
    if (!(args.hasOwnProperty("initialValue"))) {
      throw new Error("initialValue is required.");
    }
  }
  reduceRight(args) {
    if (!(args.hasOwnProperty("callbackFn"))) {
      throw new Error("callbackFn is required.");
    }
    if (!(args.hasOwnProperty("initialValue"))) {
      throw new Error("initialValue is required.");
    }
  }
  reverse() {
    this.#view.reverse();
    return this;
  }
  set(args) {
    if (!(args.hasOwnProperty("typedarray"))) {
      throw new Error("typedarray is required.");
    }
    if (!(args.hasOwnProperty("targetOffset"))) {
      throw new Error("targetOffset is required.");
    }
  }
  createSlice(args) {
    if (!(args.hasOwnProperty("start"))) {
      throw new Error("start is required.");
    }
    if (!(args.hasOwnProperty("end"))) {
      throw new Error("end is required.");
    }
  }
  some(args) {
    if (!(args.hasOwnProperty("callbackFn"))) {
      throw new Error("callbackFn is required.");
    }
  }
  sort(args) {
    if (!(args.hasOwnProperty("compareFn"))) {
      throw new Error("compareFn is required.");
    }
  }
  isViewOf(args) {
  }
}

Int8
Uint8
Uint8Clamped
Int16
Uint16
Int32
Uint32
Float32
Float64
BigInt64
BigUint64
