/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as ErrorHandling from "https://scotwatson.github.io/ErrorHandling/ErrorHandling.mjs";

export class MemoryBlock {
  #arrayBuffer;
  constructor(args) {
    try {
      if (args instanceof self.ArrayBuffer) {
        this.#arrayBuffer = args;
        return;
      } else if (args instanceof self.SharedArrayBuffer) {
        this.#arrayBuffer = args;
        return;
      } else if (!(ErrorHandling.isBareObject(args))) {
        throw new ErrorHandling.InvalidInputError({
          functionName: "MemoryBlock constructor",
          argumentName: "",
          message: "requires a bare object, ArrayBuffer, or SharedArrayBuffer.",
        });
      }
      let argsShared = false;
      if (Object.hasOwn(args, "shared")) {
        if (typeof args.shared !== "boolean") {
          throw new ErrorHandling.InvalidInputError({
            functionName: "MemoryBlock constructor",
            argumentName: "shared",
            message: "requires a boolean.",
          });
        }
        argsShared = args.shared;
      }
      if (Object.hasOwn(args, "arrayBuffer")) {
        let shared;
        if (args.arrayBuffer instanceof ArrayBuffer) {
          shared = false;
        } else if (args.arrayBuffer instanceof SharedArrayBuffer) {
          shared = true;
        } else {
          throw new ErrorHandling.InvalidInputError({
            functionName: "MemoryBlock constructor",
            argumentName: "arrayBuffer",
            message: "requires ArrayBuffer or SharedArrayBuffer.",
          });
        }
        if (Object.hasOwn(args, "shared")) {
          if (shared !== args.shared) {
            throw new ErrorHandling.AnticipatedError({
              functionName: "MemoryBlock constructor",
              message: "Argument \"shared\" does not match the class of argument \"arrayBuffer\".",
            });
          }
        }
        this.#arrayBuffer = args.arrayBuffer;
        if (Object.hasOwn(args, "byteLength")) {
          if (this.#arrayBuffer !== args.byteLength) {
            throw new ErrorHandling.AnticipatedError({
              functionName: "MemoryBlock constructor",
              message: "Argument \"byteLength\" does not match the length of argument \"arrayBuffer\".",
            });
          }
        }
      } else {
        if (!(Object.hasOwn(args, "byteLength"))) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryBlock constructor",
            message: "Argument \"byteLength\" of MemoryBlock constructor is required."
          });
        }
        if (argsShared) {
          if (!(self.crossOriginIsolated)) {
            throw new ErrorHandling.AnticipatedError({
              functionName: "MemoryBlock constructor",
              message: "Creating a shared MemoryBlock requires Cross-Origin Isolation."
            });
          }
          this.#arrayBuffer = new SharedArrayBuffer(args.byteLength);
        } else {
          this.#arrayBuffer = new ArrayBuffer(args.byteLength);
        }
      }
      return;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryBlock constructor",
          cause: e,
        });
      }
    }
  }
  get byteLength() {
    try {
      return this.#arrayBuffer.byteLength;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "get MemoryBlock.byteLength",
          cause: e,
        });
      }
    }
  }
  get shareable() {
    try {
      if (this.#arrayBuffer instanceof ArrayBuffer) {
        return false;
      } else if (this.#arrayBuffer instanceof SharedArrayBuffer) {
        return true;
      } else {
        throw new ErrorHandling.AnticipatedError({
          functionName: "get MemoryBlock.shareable",
          message: "this.#arrayBuffer must be of type ArrayBuffer or SharedArrayBuffer.",
        });
      }
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "get MemoryBlock.shareable",
          cause: e,
        });
      }
    }
  }
  toArrayBuffer() {
    try {
      return this.#arrayBuffer;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryBlock.toArrayBuffer",
          cause: e,
        });
      }
    }
  }
};

export class MemoryView {
  #arrayBuffer;
  #byteOffset;
  #byteLength;
  constructor(args) {
    try {
      if (args instanceof MemoryBlock) {
        this.#arrayBuffer = args.memoryBlock.toArrayBuffer();
        this.#byteOffset = args.byteOffset;
        this.#byteLength = args.length;
        return;
      } else if (!(ErrorHandling.isBareObject(args))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryView constructor",
          message: "Invalid Arguments",
        });
      }
      if (!(Object.hasOwn(args, "memoryBlock"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryView constructor",
          message: "Argument \"memoryBlock\" is required.",
        });
      }
      this.#arrayBuffer = args.memoryBlock.toArrayBuffer();
      if (Object.hasOwn(args, "byteOffset")) {
        if (typeof args.byteOffset !== "number") {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView constructor",
            message: "Argument \"byteOffset\" must be a number.",
          });
        }
        if (!(Number.isInteger(args.byteOffset))) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView constructor",
            message: "Argument \"byteOffset\" must be an integer.",
          });
        }
        if (args.byteOffset < 0) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView constructor",
            message: "Argument \"byteOffset\" must be non-negative.",
          });
        }
        if (args.byteOffset >= this.#arrayBuffer.byteLength) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView constructor",
            message: "Argument \"byteOffset\" must not exceed length of the block.",
          });
        }
        this.#byteOffset = args.byteOffset;
      } else {
        this.#byteOffset = 0;
      }
      if (Object.hasOwn(args, "byteLength")) {
        if (typeof args.byteLength !== "number") {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView constructor",
            message: "Argument \"byteLength\" must be a number.",
          });
        }
        if (!(Number.isInteger(args.byteLength))) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView constructor",
            message: "Argument \"byteLength\" must be an integer.",
          });
        }
        if (args.byteLength < 0) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView constructor",
            message: "Argument \"byteLength\" must be non-negative.",
          });
        }
        this.#byteLength = args.byteLength;
      } else {
        this.#byteLength = this.#arrayBuffer.byteLength - this.#byteOffset;
      }
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView constructor",
          cause: e,
        });
      }
    }
  }
  get byteLength() {
    try {
      return this.#byteLength;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "get MemoryView.byteLength",
          cause: e,
        });
      }
    }
  }
  get shareable() {
    try {
      return (this.#arrayBuffer instanceof self.SharedArrayBuffer);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "get MemoryView.shareable",
          cause: e,
        });
      }
    }
  }
  createSlice(args) {
    try {
      if (args === undefined) {
        return new MemoryView({
          arrayBuffer: this.#arrayBuffer,
          byteOffset: this.#byteOffset,
          byteLength: this.#byteLength,
        });
      } else if (!(ErrorHandling.isBareObject(args))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryView.createSlice",
          message: "Invalid Arguments",
        });
      }
      let byteOffset;
      if (Object.hasOwn(args, "byteOffset")) {
        if (typeof args.byteOffset !== "number") {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView.createSlice",
            message: "Argument \"byteOffset\" must be a number.",
          });
        }
        if (!(Number.isInteger(args.byteOffset))) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView.createSlice",
            message: "Argument \"byteOffset\" must be an integer.",
          });
        }
        if (args.byteOffset < 0) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView.createSlice",
            message: "Argument \"byteOffset\" must be non-negative.",
          });
        }
        if (args.byteOffset >= this.#arrayBuffer.byteLength) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView.createSlice",
            message: "Argument \"byteOffset\" must not exceed length of the block.",
          });
        }
        byteOffset = args.byteOffset;
      } else {
        byteOffset = 0;
      }
      let byteLength;
      if (Object.hasOwn(args, "byteLength")) {
        if (typeof args.byteLength !== "number") {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView.createSlice",
            message: "Argument \"byteLength\" must be a number.",
          });
        }
        if (!(Number.isInteger(args.byteLength))) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView.createSlice",
            message: "Argument \"byteLength\" must be an integer.",
          });
        }
        if (args.byteLength < 0) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryView.createSlice",
            message: "Argument \"byteLength\" must be non-negative.",
          });
        }
        byteLength = args.byteLength;
      } else {
        byteLength = this.byteLength - byteOffset;
      }
      return new MemoryView({
        memoryBlock: new MemoryBlock(this.#arrayBuffer),
        byteOffset: this.#byteOffset + byteOffset,
        byteLength: byteLength,
      });
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.createSlice",
          cause: e,
        });
      }
    }
  }
  set(args) {
    try {
      if (!(ErrorHandling.isBareObject(args))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryView.set",
          message: "Invalid Arguments",
        });
      }
      if (Object.hasOwn(args, "from")) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryView.set",
          message: "Argument \"from\" is required.",
        });
      }
      if (args.from instanceof MemoryView) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryView.set",
          message: "Argument \"from\" must be of class MemoryView.",
        });
      }
      if (args.from.byteLength !== this.#byteLength) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryView.set",
          message: "byteLength must be equal.",
        });
      }
      // Uint8Array is used here to allow the bytes to be copied, it does not mean the bytes represent unsigned integers
      const thisView = new Uint8Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
      const fromView = new Uint8Array(args.from.#arrayBuffer, args.from.#byteOffset, args.from.#byteLength);
      thisView.set(fromView);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.set",
          cause: e,
        });
      }
    }
  }
  toInt8Array () {
    try {
      return new Int8Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.toInt8Array",
          cause: e,
        });
      }
    }
  }
  toUint8Array () {
    try {
      return new Uint8Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.toUint8Array",
          cause: e,
        });
      }
    }
  }
  toUint8ClampedArray () {
    try {
      return new Uint8ClampedArray(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.toUint8ClampedArray",
          cause: e,
        });
      }
    }
  }
  toInt16Array () {
    try {
      return new Int16Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.toInt16Array",
          cause: e,
        });
      }
    }
  }
  toUint16Array () {
    try {
      return new Uint16Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.toUint16Array",
          cause: e,
        });
      }
    }
  }
  toInt32Array () {
    try {
      return new Int32Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.toInt32Array",
          cause: e,
        });
      }
    }
  }
  toUint32Array () {
    try {
      return new Uint32Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.toUint32Array",
          cause: e,
        });
      }
    }
  }
  toFloat32Array () {
    try {
      return new Float32Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.toFloat32Array",
          cause: e,
        });
      }
    }
  }
  toFloat64Array () {
    try {
      return new Float64Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.toFloat64Array",
          cause: e,
        });
      }
    }
  }
  toBigInt64Array () {
    try {
      return new BigInt64Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.toBigInt64Array",
          cause: e,
        });
      }
    }
  }
  toBigUint64Array () {
    try {
      return new BigUint64Array(this.#arrayBuffer, this.#byteOffset, this.#byteLength);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryView.toBigUint64Array",
          cause: e,
        });
      }
    }
  }
}

export function createCopy(args) {
  const newMemoryBlock = new MemoryBlock({
    byteLength: args.memoryView.byteLength,
  });
  const newView = new MemoryView(newMemoryBlock);
  newView.set(args.memoryView);
  return newMemoryBlock;
}

export function createSlicedCopy(args) {
  const newMemoryBlock = new MemoryBlock({
    byteLength: args.end - args.start,
  });
  const slicedView = args.memoryView.createSlicedCopy({
    start: args.start,
    end: args.end,
  });
  const newView = new MemoryView(newMemoryBlock);
  newView.set(args.memoryView);
  return newMemoryBlock;
}

// A memory view
// Allows array-like access to memory as the given type
export class DataArray {
  #memoryView;
  #ElementClass;
  #length;
  constructor(args) {
    try {
      if (!(ErrorHandling.isBareObject(args))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray constructor",
          message: "Invalid Arguments",
        });
      }
      if (Object.hasOwn(args, "memoryView")) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray constructor",
          message: "Argument \"memoryView\" is required.",
        });
      }
      this.#memoryView = args.memoryView;
      if (Object.hasOwn(args, "ElementClass")) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray constructor",
          message: "Argument \"ElementClass\" is required.",
        });
      }
      this.#ElementClass = args.ElementClass;
      this.#length = this.#memoryView.byteLength / this.#ElementClass.BYTES_PER_ELEMENT;
      if (!(Number.isInteger(this.#length))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray constructor",
          message: "memoryView.byteLength is not a multiple of ElementClass.BYTES_PER_ELEMENT.",
        });
      }
      if (Object.hasOwn(args, "length")) {
        if (length !== args.length) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "DataArray constructor",
            message: "Invalid Length",
          });
        }
      }
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "DataArray constructor",
          cause: e,
        });
      }
    }
  }
  get ElementClass() {
    try {
      return this.#ElementClass;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "get DataArray.ElementClass",
          cause: e,
        });
      }
    }
  }
  get BYTES_PER_ELEMENT() {
    try {
      return this.#ElementClass.BYTES_PER_ELEMENT;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "get DataArray.BYTES_PER_ELEMENT",
          cause: e,
        });
      }
    }
  }
  get length() {
    try {
      return this.#length;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "get DataArray.length",
          cause: e,
        });
      }
    }
  }
  get [Symbol.iterator]() {
    try {
      function* iterator() {
        for (let i = 0; i < this.#length; ++i) {
          yield this.at(i);
        }
      };
      return iterator;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "get DataArray[Symbol.iterator]",
          cause: e,
        });
      }
    }
  }
  at(args) {
    try {
      let index;
      if (typeof args === "number") {
        index = args;
      } else if (isBareObject(args)) {
        if (!(args.hasOwnProperty("index"))) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "DataArray.at",
            message: "Argument \"index\" is required.",
          });
        }
        index = args.index;
      } else {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.at",
          message: "Invalid Argument",
        });
      }
      const byteOffset = this.#ElementClass.BYTES_PER_ELEMENT * index;
      const slice = this.#memoryView.createSlice({
        byteOffset: byteOffset,
        byteLength: this.#ElementClass.BYTES_PER_ELEMENT,
      });
      return new this.#ElementClass(slice);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "DataArray.at",
          cause: e,
        });
      }
    }
  }
  copyWithin(args) {
    try {
      if (!(ErrorHandling.isBareObject(args))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray constructor",
          message: "Invalid Arguments",
        });
      }
      if (!(args.hasOwnProperty("toIndex"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.copyWithin",
          message: "Argument \"toIndex\" is required.",
        });
      }
      if (!(typeof args.toIndex === "number")) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.copyWithin",
          message: "Argument \"toIndex\" must be a number.",
        });
      }
      if (!(Number.isInteger(args.toIndex))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.copyWithin",
          message: "Argument \"toIndex\" must be an integer.",
        });
      }
      if (!(args.hasOwnProperty("fromIndex"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.copyWithin",
          message: "fromIndex is required.",
        });
      }
      if (!(typeof args.fromIndex === "number")) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.copyWithin",
          message: "Argument \"fromIndex\" must be a number.",
        });
      }
      if (!(Number.isInteger(args.fromIndex))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.copyWithin",
          message: "Argument \"fromIndex\" must be an integer.",
        });
      }
      if (!(args.hasOwnProperty("length"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.copyWithin",
          message: "length is required.",
        });
      }
      if (!(typeof args.length === "number")) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.copyWithin",
          message: "Argument \"length\" must be a number.",
        });
      }
      if (!(Number.isInteger(args.length))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.copyWithin",
          message: "Argument \"length\" must be an integer.",
        });
      }
      const byteLength = args.length * this.#ElementClass.BYTES_PER_ELEMENT;
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
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "DataArray.copyWithin",
          cause: e,
        });
      }
    }
  }
  fill(args) {
    try {
      if (!(ErrorHandling.isBareObject(args))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray constructor",
          message: "Invalid Arguments",
        });
      }
      if (!(args.hasOwnProperty("value"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.fill",
          message: "value is required.",
        });
      }
      if (!(args.hasOwnProperty("startIndex"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.fill",
          message: "startIndex is required.",
        });
      }
      if (!(typeof args.startIndex === "number")) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.fill",
          message: "Argument \"startIndex\" must be a number.",
        });
      }
      if (!(Number.isInteger(args.startIndex))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.fill",
          message: "Argument \"startIndex\" must be an integer.",
        });
      }
      if (!(args.hasOwnProperty("endIndex"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.fill",
          message: "endIndex is required.",
        });
      }
      if (!(typeof args.endIndex === "number")) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.fill",
          message: "Argument \"endIndex\" must be a number.",
        });
      }
      if (!(Number.isInteger(args.endIndex))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "DataArray.fill",
          message: "Argument \"endIndex\" must be an integer.",
        });
      }
      for (let i = args.startIndex; i < args.endIndex; ++i) {
        this.at(i).set(args.value);
      }
      return;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "DataArray.fill",
          cause: e,
        });
      }
    }
  }
}

// A memory view
// An unsigned integer that occupies exactly 1 byte
export class Uint8 {
  #view;
  static get BYTES_PER_ELEMENT() {
    return 1;
  }
  constructor (args) {
    try {
      if (!(args.hasOwnProperty("memoryView"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8 constructor",
          message: "memoryView is required.",
        });
      }
      if (args.memoryView.byteLength !== this.BYTES_PER_ELEMENT) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8 constructor",
          message: "memoryView length is invalid.",
        });
      }
      this.#view = new Uint8Array(memoryView.);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "Uint8 constructor",
          cause: e,
        });
      }
    }
  }
  setValue(args) {
    try {
      if (typeof args !== "number") {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8.setValue",
          message: "args must be a number.",
        });
      }
      this.#view[0] = args.newValue;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "Uint8.setValue",
          cause: e,
        });
      }
    }
  }
  valueOf() {
    try {
      return this.#view[0];
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "Uint8.valueOf",
          cause: e,
        });
      }
    }
  }
}

/*
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
*/
