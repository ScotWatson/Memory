/*
(c) 2022 Scot Watson  All Rights Reserved
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
          arrayBuffer: this.#arrayBuffer,
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
        if (args.byteOffset >= this.#arrayBuffer.byteLength) {
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
      if (Object.hasOwn(args, "from")) {
        throw "Argument \"from\" is required.";
      }
      if (args.from instanceof View) {
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
  const slicedView = args.memoryView.createSlicedCopy({
    start: args.start,
    end: args.end,
  });
  const newView = new View(newBlock);
  newView.set(args.memoryView);
  return newBlock;
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

export class Uint8 {
  #view;
  static get BYTE_LENGTH() {
    return 1;
  }
  constructor(args) {
    try {
      let thisView;
      if (args instanceof View) {
        thisView = args;
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "memoryView"))) {
          throw "Argument \"memoryView\" is required.";
        }
        thisView = args.memoryView;
      } else {
        throw "Invalid Arguments";
      }
      if (thisView.byteLength !== Uint8.BYTE_LENGTH) {
        throw "memoryView length is invalid.\n"
            + "  thisView.byteLength: " + thisView.byteLength + "\n"
            + "  Uint8.BYTE_LENGTH: " + Uint8.BYTE_LENGTH;
      }
      this.#view = thisView.toUint8Array();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Uint8 constructor",
        error: e,
      });
    }
  }
  set(args) {
    try {
      if (typeof args === "number") {
        this.#view[0] = args;
        return;
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "value"))) {
          throw "Argument \"value\" is required.";
        }
        if (!(Types.isInteger(args.value))) {
          throw "Argument \"value\" must be an integer.";
        }
        this.#view[0] = args.value;
        return;
      } else {
        throw "Invalid Arguments";
      }
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Uint8.set",
        error: e,
      });
    }
  }
  valueOf() {
    try {
      return this.#view[0];
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Uint8.valueOf",
        error: e,
      });
    }
  }
}
