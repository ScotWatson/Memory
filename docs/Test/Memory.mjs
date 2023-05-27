/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as ErrorLog from "https://scotwatson.github.io/Debug/Test/ErrorLog.mjs";
import * as Types from "https://scotwatson.github.io/Debug/Test/Types.mjs";

const ThisSharedArrayBuffer = (function () {
  if (typeof SharedArrayBuffer === "undefined") {
    return ArrayBuffer;
  }
  return SharedArrayBuffer;
})();

export class Block {
  #arrayBuffer;
  constructor(args) {
    try {
      if (args instanceof ArrayBuffer) {
        this.#arrayBuffer = args;
        return;
      } else if (args instanceof ThisSharedArrayBuffer) {
        this.#arrayBuffer = args;
        return;
      } else if (!(Types.isSimpleObject(args))) {
        throw "Argument must be a simple object, ArrayBuffer, or SharedArrayBuffer.";
      }
      let argsShared = false;
      if (Object.hasOwn(args, "shared")) {
        if (typeof args.shared !== "boolean") {
          throw "Argument \"shared\" requires a boolean.";
        }
        argsShared = args.shared;
      }
      if (Object.hasOwn(args, "arrayBuffer")) {
        let shared;
        if (args.arrayBuffer instanceof ArrayBuffer) {
          shared = false;
        } else if (args.arrayBuffer instanceof ThisSharedArrayBuffer) {
          shared = true;
        } else {
          throw "Argument \"arrayBuffer\" requires ArrayBuffer or SharedArrayBuffer.";
        }
        if (Object.hasOwn(args, "shared")) {
          if (shared !== args.shared) {
            throw "Argument \"shared\" does not match the class of argument \"arrayBuffer\".";
          }
        }
        this.#arrayBuffer = args.arrayBuffer;
        if (Object.hasOwn(args, "byteLength")) {
          if (this.#arrayBuffer !== args.byteLength) {
            throw "Argument \"byteLength\" does not match the length of argument \"arrayBuffer\".";
          }
        }
      } else {
        if (!(Object.hasOwn(args, "byteLength"))) {
          throw "Argument \"byteLength\" of Block constructor is required.";
        }
        if (argsShared) {
          if (!(self.crossOriginIsolated)) {
            throw "Creating a shared Block requires Cross-Origin Isolation.";
          }
          this.#arrayBuffer = new ThisSharedArrayBuffer(args.byteLength);
        } else {
          this.#arrayBuffer = new ArrayBuffer(args.byteLength);
        }
      }
      return;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Block constructor",
        error: e,
      });
    }
  }
  get byteLength() {
    try {
      return this.#arrayBuffer.byteLength;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Block.byteLength",
        error: e,
      });
    }
  }
  get shareable() {
    try {
      if (this.#arrayBuffer instanceof ArrayBuffer) {
        return false;
      } else if (this.#arrayBuffer instanceof ThisSharedArrayBuffer) {
        return true;
      } else {
        throw "Internal Logic Error: Internal buffer must be of type ArrayBuffer or SharedArrayBuffer.";
      }
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Block.sharable",
        error: e,
      });
    }
  }
  toArrayBuffer() {
    try {
      return this.#arrayBuffer;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Block.toSharedBuffer",
        error: e,
      });
    }
  }
};

export class View {
  #arrayBuffer;
  #byteOffset;
  #byteLength;
  constructor(args) {
    try {
      if (args instanceof Block) {
        this.#arrayBuffer = args.toArrayBuffer();
        this.#byteOffset = 0;
        this.#byteLength = args.byteLength;
        return;
      } else if (!(Types.isSimpleObject(args))) {
        throw "Argument must be a simple object.";
      }
      if (!(Object.hasOwn(args, "memoryBlock"))) {
        throw "Argument \"memoryBlock\" is required.";
      }
      this.#arrayBuffer = args.memoryBlock.toArrayBuffer();
      if (Object.hasOwn(args, "byteOffset")) {
        if (!(Types.isInteger(args.byteOffset))) {
          throw "Argument \"byteOffset\" must be an integer.";
        }
        if (args.byteOffset < 0) {
          throw "Argument \"byteOffset\" must be non-negative.";
        }
        if (args.byteOffset >= this.#arrayBuffer.byteLength) {
          throw "Argument \"byteOffset\" must not exceed length of the block.";
        }
        this.#byteOffset = args.byteOffset;
      } else {
        this.#byteOffset = 0;
      }
      if (Object.hasOwn(args, "byteLength")) {
        if (!(Types.isInteger(args.byteLength))) {
          throw "Argument \"byteLength\" must be an integer.";
        }
        if (args.byteLength < 0) {
          throw "Argument \"byteLength\" must be non-negative.";
        }
        if (this.#byteOffset + args.byteLength > this.#arrayBuffer.byteLength) {
          throw "Argument \"byteLength\" must not exceed length of the block.";
        }
        this.#byteLength = args.byteLength;
      } else {
        this.#byteLength = this.#arrayBuffer.byteLength - this.#byteOffset;
      }
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View constructor",
        error: e,
      });
    }
  }
  get byteLength() {
    try {
      return this.#byteLength;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get View.byteLength",
        error: e,
      });
    }
  }
  get shareable() {
    try {
      return (this.#arrayBuffer instanceof ThisSharedArrayBuffer);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get View.shareable",
        error: e,
      });
    }
  }
  createSlice(args) {
    try {
      if (args === undefined) {
        return new View({
          memoryBlock: new Block(this.#arrayBuffer),
          byteOffset: this.#byteOffset,
          byteLength: this.#byteLength,
        });
      } else if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      let byteOffset;
      if (Object.hasOwn(args, "byteOffset")) {
        if (!(Types.isInteger(args.byteOffset))) {
          throw "Argument \"byteOffset\" must be an integer.";
        }
        if (args.byteOffset < 0) {
          throw "Argument \"byteOffset\" must be non-negative.";
        }
        if (args.byteOffset >= this.#byteLength) {
          throw "Argument \"byteOffset\" must not exceed length of the block.";
        }
        byteOffset = args.byteOffset;
      } else {
        byteOffset = 0;
      }
      let byteLength;
      if (Object.hasOwn(args, "byteLength")) {
        if (!(Types.isInteger(args.byteLength))) {
          throw "Argument \"byteLength\" must be an integer.";
        }
        if (args.byteLength < 0) {
          throw "Argument \"byteLength\" must be non-negative.";
        }
        if (byteOffset + args.byteLength > this.#byteLength) {
          throw "Argument \"byteLength\" must not exceed length of the block.";
        }
        byteLength = args.byteLength;
      } else {
        byteLength = this.#byteLength - byteOffset;
      }
      return new View({
        memoryBlock: new Block(this.#arrayBuffer),
        byteOffset: this.#byteOffset + byteOffset,
        byteLength: byteLength,
      });
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.createSlice",
        error: e,
      });
    }
  }
  set(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "from"))) {
        throw "Argument \"from\" is required.";
      }
      if (!(args.from instanceof View)) {
        throw "Argument \"from\" must be of class View.";
      }
      if (args.from.byteLength !== this.#byteLength) {
        throw "byteLength must be equal.";
      }
      // Uint8Array is used here to allow the bytes to be copied, it does not mean the bytes represent unsigned integers
      const thisView = new Uint8Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
      const fromView = new Uint8Array(args.from.#arrayBuffer, args.from.#byteOffset, args.from.#byteLength);
      thisView.set(fromView);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.set",
        error: e,
      });
    }
  }
  copyWithin(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      let fromStart;
      let fromEnd;
      let toStart;
      let toEnd;
      let byteLength;
      if (Object.hasOwn(args, "fromStart")) {
        if (Types.isInteger(args.fromStart)) {
          throw "Argument \"fromStart\" must be an integer.";
        }
        fromStart = args.fromStart;
        if (fromStart < 0) {
          throw "Argument \"fromStart\" must be non-negative.";
        }
        if (fromStart >= this.#byteLength) {
          throw "Argument \"fromStart\" must be less than this.byteLength.";
        }
      }
      if (Object.hasOwn(args, "fromEnd")) {
        if (Types.isInteger(args.fromEnd)) {
          throw "Argument \"fromEnd\" must be an integer.";
        }
        fromEnd = args.fromEnd;
        if (fromEnd < 0) {
          throw "Argument \"fromEnd\" must be non-negative.";
        }
        if (fromEnd >= this.#byteLength) {
          throw "Argument \"fromEnd\" must be less than this.byteLength.";
        }
      }
      if (Object.hasOwn(args, "toStart")) {
        if (Types.isInteger(args.toStart)) {
          throw "Argument \"toStart\" must be an integer.";
        }
        toStart = args.toStart;
        if (toStart < 0) {
          throw "Argument \"toStart\" must be non-negative.";
        }
        if (toStart >= this.#byteLength) {
          throw "Argument \"toStart\" must be less than this.byteLength.";
        }
      }
      if (Object.hasOwn(args, "toEnd")) {
        if (Types.isInteger(args.toEnd)) {
          throw "Argument \"toEnd\" must be an integer.";
        }
        toEnd = args.toEnd;
        if (toEnd < 0) {
          throw "Argument \"toEnd\" must be non-negative.";
        }
        if (toEnd >= this.#byteLength) {
          throw "Argument \"toEnd\" must be less than this.byteLength.";
        }
      }
      if (Object.hasOwn(args, "byteLength")) {
        if (Types.isInteger(args.byteLength)) {
          throw "Argument \"byteLength\" must be an integer.";
        }
        byteLength = args.byteLength;
        if (byteLength < 0) {
          throw "Argument \"byteLength\" must be non-negative.";
        }
        if (byteLength >= this.#byteLength) {
          throw "Argument \"byteLength\" must be less than this.byteLength.";
        }
      }
      if (Types.isUndefined(byteLength)) {
        let fromByteLength = fromEnd - fromStart;
        let toByteLength = toEnd - toStart;
        if (Types.isUndefined(fromByteLength)) {
          if (Types.isUndefined(toByteLength)) {
            throw "Insufficient arguments to calculate byteLength";
          }
          byteLength = toByteLength;
        } else {
          if (!(Types.isUndefined(toByteLength))) {
            if (fromByteLength !== toByteLength) {
              throw "The byteLengths are not coherent.";
            }
          }
          byteLength = fromByteLength;
        }
      } else {
        if (Types.isUndefined(fromStart)) {
          if (Types.isUndefined(fromEnd)) {
            throw "At least two of the following must be provided: fromStart, fromEnd, byteLength";
          }
          fromStart = fromEnd - byteLength;
        } else {
          if (!(Types.isUndefined(fromEnd))) {
            if (fromStart + byteLength !== fromEnd) {
              throw "Arguments fromStart, fromEnd, byteLength are not coherent";
            }
          } else {
            fromEnd = fromStart + byteLength;
          }
        }
        if (Types.isUndefined(toStart)) {
          if (Types.isUndefined(toEnd)) {
            throw "At least two of the following must be provided: toStart, toEnd, byteLength";
          }
          toStart = toEnd - byteLength;
        } else {
          if (Types.isUndefined(toEnd)) {
            toEnd = toStart + byteLength;
          } else {
            if (toStart + byteLength !== toEnd) {
              throw "Arguments toStart, toEnd, byteLength are not coherent";
            }
          }
        }
      }
      // Uint8Array is used here to allow the bytes to be copied, it does not mean the bytes represent unsigned integers
      const thisView = new Uint8Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
      thisView.copyWithin(toStart, fromStart, fromEnd);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.copyWithin",
        error: e,
      });
    }
  }
  toInt8Array () {
    try {
      return new Int8Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.toInt8Array",
        error: e,
      });
    }
  }
  toUint8Array () {
    try {
      return new Uint8Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.toUint8Array",
        error: e,
      });
    }
  }
  toUint8ClampedArray () {
    try {
      return new Uint8ClampedArray(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.toUint8ClampedArray",
        error: e,
      });
    }
  }
  toInt16Array () {
    try {
      return new Int16Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.toInt16Array",
        error: e,
      });
    }
  }
  toUint16Array () {
    try {
      return new Uint16Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.toUint16Array",
        error: e,
      });
    }
  }
  toInt32Array () {
    try {
      return new Int32Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.toInt32Array",
        error: e,
      });
    }
  }
  toUint32Array () {
    try {
      return new Uint32Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.toUint32Array",
        error: e,
      });
    }
  }
  toFloat32Array () {
    try {
      return new Float32Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.toFloat32Array",
        error: e,
      });
    }
  }
  toFloat64Array () {
    try {
      return new Float64Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.toFloat64Array",
        error: e,
      });
    }
  }
  toBigInt64Array () {
    try {
      return new BigInt64Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.toBigInt64Array",
        error: e,
      });
    }
  }
  toBigUint64Array () {
    try {
      return new BigUint64Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.toBigUint64Array",
        error: e,
      });
    }
  }
  toDataView() {
    try {
      return new DataView(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "View.toDataView",
        error: e,
      });
    }
  }
}

export function createCopy(args) {
  const newBlock = new Block({
    byteLength: args.memoryView.byteLength,
  });
  const newView = new View(newBlock);
  newView.set(args.memoryView);
  return newBlock;
}

export function createSlicedCopy(args) {
  const newBlock = new Block({
    byteLength: args.end - args.start,
  });
  const slicedView = args.memoryView.createSlice({
    start: args.start,
    end: args.end,
  });
  const newView = new View(newBlock);
  newView.set(args.memoryView);
  return newBlock;
}

export class ViewArray {
  #memoryView;
  #elementByteLength;
  #length;
  constructor(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "memoryView"))) {
        throw "Argument \"memoryView\" is required.";
      }
      this.#memoryView = args.memoryView;
      if (!(Object.hasOwn(args, "elementByteLength"))) {
        throw "Argument \"elementByteLength\" is required.";
      }
      this.#elementByteLength = args.elementByteLength;
      this.#length = this.#memoryView.byteLength / this.#elementByteLength;
      if (!(Types.isInteger(this.#length))) {
        throw "memoryView.byteLength is not a multiple of elementByteLength.";
      }
      if (Object.hasOwn(args, "length")) {
        if (length !== args.length) {
          throw "Invalid Length";
        }
      }
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ViewArray constructor",
        error: e,
      });
    }
  }
  get BYTES_PER_ELEMENT() {
    try {
      return this.#elementByteLength;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get ViewArray.BYTES_PER_ELEMENT",
        error: e,
      });
    }
  }
  get length() {
    try {
      return this.#length;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get ViewArray.length",
        error: e,
      });
    }
  }
  get [Symbol.iterator]() {
    try {
      return (function* () {
        for (let i = 0; i < this.#length; ++i) {
          yield this.at(i);
        }
      });
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get ViewArray[Symbol.iterator]",
        error: e,
      });
    }
  }
  at(args) {
    try {
      let index;
      if (Types.isInteger(args)) {
        index = args;
      } else if (Types.isSimpleObject(args)) {
        if (!(args.hasOwnProperty("index"))) {
          throw "Argument \"index\" is required.";
        }
        if (!(Types.isInteger(args.index))) {
          throw "Argument \"index\" must be an integer.";
        }
        index = args.index;
      } else {
        throw "Invalid Argument";
      }
      const byteOffset = this.#elementByteLength * index;
      const slice = this.#memoryView.createSlice({
        byteOffset: byteOffset,
        byteLength: this.#elementByteLength,
      });
      return slice;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ViewArray.at",
        error: e,
      });
    }
  }
  copyWithin(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "toIndex"))) {
        throw "Argument \"toIndex\" is required.";
      }
      if (!(Types.isInteger(args.toIndex))) {
        throw "Argument \"toIndex\" must be an integer.";
      }
      if (!(Object.hasOwn(args, "fromIndex"))) {
        throw "Argument \"fromIndex\" is required.";
      }
      if (!(Types.isInteger(args.fromIndex))) {
        throw "Argument \"fromIndex\" must be an integer.";
      }
      if (!(Object.hasOwnProperty(args, "length"))) {
        throw "Argument \"length\" is required.";
      }
      if (!(Types.isInteger(args.length))) {
        throw "Argument \"length\" must be an integer.";
      }
      const byteLength = args.length * this.#elementByteLength;
      const fromSlice = this.#memoryView.createSlice({
        byteOffset: args.fromIndex,
        bytelength: byteLength,
      });
      const toSlice = this.#memoryView.createSlice({
        byteOffset: args.toIndex,
        bytelength: byteLength,
      });
      toSlice.set(fromSlice);
      return;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ViewArray.copyWithin",
        error: e,
      });
    }
  }
  fill(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "value"))) {
        throw "Argument \"value\" is required.";
      }
      if (!(Object.hasOwn(args, "startIndex"))) {
        throw "Argument \"startIndex\" is required.";
      }
      if (!(Types.isInteger(args.startIndex))) {
        throw "Argument \"startIndex\" must be an integer.";
      }
      if (!(Object.hasOwn(args, "endIndex"))) {
        throw "Argument \"endIndex\" is required.";
      }
      if (!(Types.isInteger(args.endIndex))) {
        throw "Argument \"endIndex\" must be an integer.";
      }
      for (let i = args.startIndex; i < args.endIndex; ++i) {
        this.at(i).set(args.value);
      }
      return;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ViewArray.fill",
        error: e,
      });
    }
  }
}

export class DataArray {
  #memoryView;
  #ElementClass;
  #length;
  constructor(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "memoryView"))) {
        throw "Argument \"memoryView\" is required.";
      }
      this.#memoryView = args.memoryView;
      if (!(Object.hasOwn(args, "ElementClass"))) {
        throw "Argument \"ElementClass\" is required.";
      }
      this.#ElementClass = args.ElementClass;
      this.#length = this.#memoryView.byteLength / this.#ElementClass.BYTE_LENGTH;
      if (!(Types.isInteger(this.#length))) {
        throw "memoryView.byteLength is not a multiple of ElementClass.BYTE_LENGTH.";
      }
      if (Object.hasOwn(args, "length")) {
        if (length !== args.length) {
          throw "Invalid Length";
        }
      }
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "DataArray constructor",
        error: e,
      });
    }
  }
  get ElementClass() {
    try {
      return this.#ElementClass;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get DataArray.ElementClass",
        error: e,
      });
    }
  }
  get BYTES_PER_ELEMENT() {
    try {
      return this.#ElementClass.BYTE_LENGTH;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get DataArray.BYTES_PER_ELEMENT",
        error: e,
      });
    }
  }
  get length() {
    try {
      return this.#length;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get DataArray.length",
        error: e,
      });
    }
  }
  get [Symbol.iterator]() {
    try {
      return (function* () {
        for (let i = 0; i < this.#length; ++i) {
          yield this.at(i);
        }
      });
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get DataArray[Symbol.iterator]",
        error: e,
      });
    }
  }
  at(args) {
    try {
      let index;
      if (Types.isInteger(args)) {
        index = args;
      } else if (Types.isSimpleObject(args)) {
        if (!(args.hasOwnProperty("index"))) {
          throw "Argument \"index\" is required.";
        }
        if (!(Types.isInteger(args.index))) {
          throw "Argument \"index\" must be an integer.";
        }
        index = args.index;
      } else {
        throw "Invalid Argument";
      }
      const byteOffset = this.#ElementClass.BYTE_LENGTH * index;
      const slice = this.#memoryView.createSlice({
        byteOffset: byteOffset,
        byteLength: this.#ElementClass.BYTE_LENGTH,
      });
      return new this.#ElementClass(slice);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "DataArray.at",
        error: e,
      });
    }
  }
  copyWithin(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "toIndex"))) {
        throw "Argument \"toIndex\" is required.";
      }
      if (!(Types.isInteger(args.toIndex))) {
        throw "Argument \"toIndex\" must be an integer.";
      }
      if (!(Object.hasOwn(args, "fromIndex"))) {
        throw "Argument \"fromIndex\" is required.";
      }
      if (!(Types.isInteger(args.fromIndex))) {
        throw "Argument \"fromIndex\" must be an integer.";
      }
      if (!(Object.hasOwnProperty(args, "length"))) {
        throw "Argument \"length\" is required.";
      }
      if (!(Types.isInteger(args.length))) {
        throw "Argument \"length\" must be an integer.";
      }
      const byteLength = args.length * this.#ElementClass.BYTE_LENGTH;
      const fromSlice = this.#memoryView.createSlice({
        byteOffset: args.fromIndex,
        bytelength: byteLength,
      });
      const toSlice = this.#memoryView.createSlice({
        byteOffset: args.toIndex,
        bytelength: byteLength,
      });
      toSlice.set(fromSlice);
      return;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "DataArray.copyWithin",
        error: e,
      });
    }
  }
  fill(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "value"))) {
        throw "Argument \"value\" is required.";
      }
      if (!(Object.hasOwn(args, "startIndex"))) {
        throw "Argument \"startIndex\" is required.";
      }
      if (!(Types.isInteger(args.startIndex))) {
        throw "Argument \"startIndex\" must be an integer.";
      }
      if (!(Object.hasOwn(args, "endIndex"))) {
        throw "Argument \"endIndex\" is required.";
      }
      if (!(Types.isInteger(args.endIndex))) {
        throw "Argument \"endIndex\" must be an integer.";
      }
      for (let i = args.startIndex; i < args.endIndex; ++i) {
        this.at(i).set(args.value);
      }
      return;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "DataArray.fill",
        error: e,
      });
    }
  }
}

function isView(args) {
    return (Object.hasOwn(args, "toDataView")
           && Types.isFunction(args.toDataView)
           && Object.hasOwn(args, "byteLength")
           && Types.isInteger(args.byteLength));
}

// Uint8.value = number
export class Uint8 {
  #dataView;
  static get BYTE_LENGTH() {
    return 1;
  }
  static set BYTE_LENGTH() {
    throw "Uint8.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Uint8 constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getUint8(0);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Uint8.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isInteger(newValue)
            && (0 <= newValue)
            && (newValue < (2 ** 8)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setUint8(0, newValue);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Uint8.value",
        error: e,
      });
    }
  }
};

// Sint8.value = number
export class Sint8 {
  #dataView;
  static get BYTE_LENGTH() {
    return 1;
  }
  static set BYTE_LENGTH() {
    throw "Sint8.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sint8 constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getInt8(0);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Sint8.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isInteger(newValue)
            && (-(2 ** 7) <= newValue)
            && (newValue < (2 ** 7)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setInt8(0, newValue);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Sint8.value",
        error: e,
      });
    }
  }
};

// Uint16BE.value = number
export class Uint16BE {
  #dataView;
  static get BYTE_LENGTH() {
    return 2;
  }
  static set BYTE_LENGTH() {
    throw "Uint16BE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Uint16BE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getUint16(0, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Uint16BE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isInteger(newValue)
            && (0 <= newValue)
            && (newValue < (2 ** 16)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setUint16(0, newValue, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Uint16BE.value",
        error: e,
      });
    }
  }
};

// Uint16LE.value = number
export class Uint16LE {
  #dataView;
  static get BYTE_LENGTH() {
    return 2;
  }
  static set BYTE_LENGTH() {
    throw "Uint16LE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Uint16LE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getUint16(0, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Uint16LE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isInteger(newValue)
            && (0 <= newValue)
            && (newValue < (2 ** 16)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setUint16(0, newValue, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Uint16LE.value",
        error: e,
      });
    }
  }
};

// Sint16BE.value = number
export class Sint16BE {
  #dataView;
  static get BYTE_LENGTH() {
    return 2;
  }
  static set BYTE_LENGTH() {
    throw "Sint16BE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sint16BE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getInt16(0, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Sint16BE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isInteger(newValue)
            && (-(2 ** 15) <= newValue)
            && (newValue < (2 ** 15)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setInt16(0, newValue, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Sint16BE.value",
        error: e,
      });
    }
  }
};

// Sint16LE.value = number
export class Sint16LE {
  #dataView;
  static get BYTE_LENGTH() {
    return 2;
  }
  static set BYTE_LENGTH() {
    throw "Sint16LE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sint16LE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getInt16(0, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Sint16LE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isInteger(newValue)
            && (-(2 ** 15) <= newValue)
            && (newValue < (2 ** 15)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setInt16(0, newValue, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Sint16LE.value",
        error: e,
      });
    }
  }
};

// Uint32BE.value = number
export class Uint32BE {
  #dataView;
  static get BYTE_LENGTH() {
    return 4;
  }
  static set BYTE_LENGTH() {
    throw "Uint32BE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Uint32BE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getUint32(0, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Uint32BE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isInteger(newValue)
            && (0 <= newValue)
            && (newValue < (2 ** 16)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setUint32(0, newValue, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Uint32BE.value",
        error: e,
      });
    }
  }
};

// Uint32LE.value = number
export class Uint32LE {
  #dataView;
  static get BYTE_LENGTH() {
    return 4;
  }
  static set BYTE_LENGTH() {
    throw "Uint32LE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Uint32LE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getUint32(0, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Uint32LE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isInteger(newValue)
            && (0 <= newValue)
            && (newValue < (2 ** 16)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setUint32(0, newValue, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Uint32LE.value",
        error: e,
      });
    }
  }
};

// Sint32BE.value = number
export class Sint32BE {
  #dataView;
  static get BYTE_LENGTH() {
    return 4;
  }
  static set BYTE_LENGTH() {
    throw "Sint32BE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sint32BE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getInt32(0, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Sint32BE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isInteger(newValue)
            && (-(2 ** 15) <= newValue)
            && (newValue < (2 ** 15)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setInt32(0, newValue, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Sint32BE.value",
        error: e,
      });
    }
  }
};

// Sint32LE.value = number
export class Sint32LE {
  #dataView;
  static get BYTE_LENGTH() {
    return 4;
  }
  static set BYTE_LENGTH() {
    throw "Sint32LE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sint32LE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getInt32(0, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Sint32LE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isInteger(newValue)
            && (-(2 ** 15) <= newValue)
            && (newValue < (2 ** 15)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setInt32(0, newValue, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Sint32LE.value",
        error: e,
      });
    }
  }
};

// Float32BE.value = number
export class Float32BE {
  #dataView;
  static get BYTE_LENGTH() {
    return 4;
  }
  static set BYTE_LENGTH() {
    throw "Float32BE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Float32BE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getFloat32(0, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Float32BE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isNumber(newValue))) {
        throw "Invalid new value.";
      }
      this.#dataView.setFloat32(0, newValue, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Float32BE.value",
        error: e,
      });
    }
  }
};

// Float32LE.value = number
export class Float32LE {
  #dataView;
  static get BYTE_LENGTH() {
    return 4;
  }
  static set BYTE_LENGTH() {
    throw "Float32LE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Float32LE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getFloat32(0, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Float32LE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isNumber(newValue))) {
        throw "Invalid new value.";
      }
      this.#dataView.setFloat32(0, newValue, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Float32LE.value",
        error: e,
      });
    }
  }
};

// Float64BE.value = number
export class Float64BE {
  #dataView;
  static get BYTE_LENGTH() {
    return 8;
  }
  static set BYTE_LENGTH() {
    throw "Float64BE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Float64BE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getFloat64(0, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Float64BE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isNumber(newValue))) {
        throw "Invalid new value.";
      }
      this.#dataView.setFloat64(0, newValue, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Float64BE.value",
        error: e,
      });
    }
  }
};

// Float64LE.value = number
export class Float64LE {
  #dataView;
  static get BYTE_LENGTH() {
    return 8;
  }
  static set BYTE_LENGTH() {
    throw "Float64LE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Float64LE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getFloat64(0, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Float64LE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isNumber(newValue))) {
        throw "Invalid new value.";
      }
      this.#dataView.setFloat64(0, newValue, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Float64LE.value",
        error: e,
      });
    }
  }
};

// Uint64BE.value = bigint
export class Uint64BE {
  #dataView;
  static get BYTE_LENGTH() {
    return 8;
  }
  static set BYTE_LENGTH() {
    throw "Uint64BE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Uint64BE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getBigUint64(0, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Uint64BE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isBigInt(newValue)
            && (newValue >= 0)
            && (newValue < (2n ** 64n)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setBigUint64(0, newValue, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Uint64BE.value",
        error: e,
      });
    }
  }
};

// Uint64LE.value = bigint
export class Uint64LE {
  #dataView;
  static get BYTE_LENGTH() {
    return 8;
  }
  static set BYTE_LENGTH() {
    throw "Uint64LE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Uint64LE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getBigUint64(0, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Uint64LE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isBigInt(newValue)
            && (newValue >= 0)
            && (newValue < (2n ** 64n)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setBigUint64(0, newValue, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Uint64LE.value",
        error: e,
      });
    }
  }
};

// Sint64BE.value = bigint
export class Sint64BE {
  #dataView;
  static get BYTE_LENGTH() {
    return 8;
  }
  static set BYTE_LENGTH() {
    throw "Sint64BE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Uint64BE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getBigInt64(0, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Sint64BE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isBigInt(newValue)
            && (newValue >= -(2n ** 63n))
            && (newValue < (2n ** 63n)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setBigInt64(0, newValue, false);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Sint64BE.value",
        error: e,
      });
    }
  }
};

// Sint64LE.value = bigint
export class Sint64LE {
  #dataView;
  static get BYTE_LENGTH() {
    return 8;
  }
  static set BYTE_LENGTH() {
    throw "Sint64LE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sint64LE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return this.#dataView.getBigInt64(0, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Sint64LE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      if (!(Types.isBigInt(newValue)
            && (newValue >= -(2n ** 63n))
            && (newValue < (2n ** 63n)))) {
        throw "Invalid new value.";
      }
      this.#dataView.setBigInt64(0, newValue, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Sint64LE.value",
        error: e,
      });
    }
  }
};

// Time_POSIX_S32LE = Date
export class Time_POSIX_S32LE {
  #dataView;
  static get BYTE_LENGTH() {
    return 4;
  }
  static set BYTE_LENGTH() {
    throw "Time_POSIX_S32LE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Time_POSIX_S32LE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return new Date(this.#dataView.getInt32(0, true) * 1000);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Time_POSIX_S32LE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      let ms_ticks = newValue.getTime();
      if (ms_ticks === NaN) {
        throw "Invalid date.";
      }
      let sec_ticks = ms_ticks / 1000;
      if (!(sec_ticks < (2 ** 32))) {
        throw "Invalid new value.";
      }
      this.#dataView.setInt32(0, sec_ticks, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Time_POSIX_S32LE.value",
        error: e,
      });
    }
  }
};

// Time_POSIX_S64LE = Date
export class Time_POSIX_S64LE {
  #dataView;
  static get BYTE_LENGTH() {
    return 8;
  }
  static set BYTE_LENGTH() {
    throw "Time_POSIX_S64LE.BYTE_LENGTH is a constant.";
  }
  constructor(args) {
    try {
      this.#dataView = (function () {
        let thisView;
        if (isView(args)) {
          thisView = args;
        } else if (Object.hasOwn(args, "memoryView")) {
          if (!(isView(args.memoryView))) {
            throw "Argument \"memoryView\" must be a Memory.View.";
          }
          thisView = args.memoryView;
        } else {
          throw "Invalid arguments.";
        }
        if (thisView.byteLength !== this.constructor.BYTE_LENGTH) {
          throw "Argument \"memoryView\" must be equal in length to the data type.";
        }
        return thisView.toDataView();
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Time_POSIX_S64LE constructor",
        error: e,
      });
    }
  }
  get value() {
    try {
      return new Date(this.#dataView.getInt64(0, true) * 1000);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Time_POSIX_S64LE.value",
        error: e,
      });
    }
  }
  set value(newValue) {
    try {
      let ms_ticks = newValue.getTime();
      if (ms_ticks === NaN) {
        throw "Invalid date.";
      }
      let sec_ticks = ms_ticks / 1000;
      this.#dataView.setInt64(0, sec_ticks, true);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set Time_POSIX_S64LE.value",
        error: e,
      });
    }
  }
};
