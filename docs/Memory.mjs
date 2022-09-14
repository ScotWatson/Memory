/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as ErrorHandling from "https://scotwatson.github.io/ErrorHandling/ErrorHandling.mjs";

// cannot change length
// represents a single allocated block of memory
// automatically initialized to all zeros
// addressable as 8-bit (1-byte) entities, but unable to directly access
class MemoryBlock {
  #arrayBuffer;
  constructor(args) {
    try {
      if (!(ErrorHandling.isBareObject(args))) {
        throw new ErrorHandling.InvalidInputError({
          functionName: "MemoryBlock constructor",
          message: "Argument must be a bare object.",
        });
      }
      if (!(Object.hasOwn(args, "length"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock constructor",
          message: "Argument \"length\" of MemoryBlock constructor is required."
        });
      }
      let shared = false;
      if (Object.hasOwn(args, "shared")) {
        shared = (args.shared === true);
      }
      if (shared) {
        if (!(self.crossOriginIsolated)) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryBlock constructor",
            message: "Creating a shared MemoryBlock requires Cross-Origin Isolation."
          });
        }
        this.#arrayBuffer = new SharedArrayBuffer(args.length);
      } else {
        this.#arrayBuffer = new ArrayBuffer(args.length);
      }
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
  static fromArrayBuffer(args) {
    try {
      let shared;
      if (ErrorHandling.isBareObject(args)) {
        if (!(Object.hasOwn(args, "arrayBuffer"))) {
           throw new ErrorHandling.InvalidInputError({
             functionName: "MemoryBlock.fromArrayBuffer",
             argumnetName: "",
             message: "requires a bare object.",
           });
        }
        this.#arrayBuffer = args.arrayBuffer;
        if (this.#arrayBuffer instanceof ArrayBuffer) {
          shared = false;
        } else if (this.#arrayBuffer instanceof SharedArrayBuffer) {
          shared = true;
        } else {
          throw new ErrorHandling.InvalidInputError({
            functionName: "MemoryBlock.fromArrayBuffer",
            argumentName: "arrayBuffer",
            message: "must be of type ArrayBuffer or SharedArrayBuffer.",
          });
        }
      } else if (args instanceof ArrayBuffer) {
        this.#arrayBuffer = args;
        shared = false;
      } else if (args instanceof SharedArrayBuffer) {
        this.#arrayBuffer = args;
        shared = true;
      } else {
        throw new ErrorHandling.InvalidInputError({
          functionName: "MemoryBlock.fromArrayBuffer",
          argumnetName: "",
          message: "requires a bare object, ArrayBuffer, or SharedArrayBuffer.",
        });
      }
      if (Object.hasOwn(args, "length")) {
        if (typeof args.length !== "number") {
          throw new ErrorHandling.InvalidInputError({
            functionName: "MemoryBlock.fromArrayBuffer",
            argumentName: "length",
            message: "must be of type number."
          });
        }
        if (args.length !== this.#arrayBuffer) {
          throw new ErrorHandling.InvalidInputError({
            functionName: "MemoryBlock.fromArrayBuffer",
            argumentName: "length",
            message: "does not match.",
          });
        }
      }
      if (Object.hasOwn(args, "shared")) {
        if (args.shared !== shared) {
          throw new ErrorHandling.InvalidInputError({
            functionName: "MemoryBlock.fromArrayBuffer",
            argumentName: "shared",
            message: "does not match.",
          });
        }
      }
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryBlock.fromArrayBuffer",
          cause: e,
        });
      }
    }
  }
  get length() {
    try {
      return this.#arrayBuffer.byteLength;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "get MemoryBlock.length",
          cause: e,
        });
      }
    }
  }
  static fromIterable(args) {
    try {
      if (isBareObject(args)) {
        if (!(Object.hasOwn(args, "iterable"))) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryBlock.fromIterable",
            message: "Argument iterable is required.",
          });
        }
      } else if (args[Symbol.iterator] === undefined) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.fromIterable",
          message: "Invalid Arguments",
        });
      }
      let totalLength = 0;
      for (const item of args) {
        if (!(item instanceof MemoryBlock)) {
          throw new ErrorHandling.AnticipatedError({
            functionName: "MemoryBlock.fromIterable",
            message: "Only MemoryBlock items can be concatenated.",
          });
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
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryBlock.fromArrayBuffer",
          cause: e,
        });
      }
    }
  }
  get shared() {
    try {
      if (this.#arrayBuffer instanceof ArrayBuffer) {
        return false;
      } else if (this.#arrayBuffer instanceof SharedArrayBuffer) {
        return true;
      } else {
        throw new ErrorHandling.AnticipatedError({
          functionName: "get MemoryBlock.shared",
          message: "this.#arrayBuffer must be of type ArrayBuffer or SharedArrayBuffer.",
        });
      }
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "get MemoryBlock.shared",
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
  copyWithin(args) {
    try {
      if (!(isBareObject(args))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.copyWithin",
          message: "Invalid Arguments",
        });
      }
      if (!(args.hasOwnProperty("target"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.copyWithin",
          message: "Invalid Arguments",
        });
      }
      if (typeof args.target !== "Number") {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.copyWithin",
          message: "Invalid Arguments",
        });
      }
      if (!(Number.isInteger(args.target))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.copyWithin",
          message: "Invalid Arguments: Target must be an integer",
        });
      }
      if (!(args.hasOwnProperty("start"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.copyWithin",
          message: "Invalid Arguments",
        });
      }
      if (typeof args.start !== "Number") {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.copyWithin",
          message: "Invalid Arguments"
        });
      }
      if (!(Number.isInteger(args.start))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.copyWithin",
          message: "Invalid Arguments: Start must be an integer",
        });
      }
      if (!(args.hasOwnProperty("end"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.copyWithin",
          message: "Invalid Arguments",
        });
      }
      if (typeof args.end !== "Number") {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.copyWithin",
          message: "Invalid Arguments",
        });
      }
      if (!(Number.isInteger(args.end))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.copyWithin",
          message: "Invalid Arguments: End must be an integer",
        });
      }
      const view = new Uint8Array(this.#arrayBuffer);
      view.copyWithin(args.target, args.start, args.end);
      return this;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryBlock.copyWithin",
          cause: e,
        });
      }
    }
  }
  createReversed() {
    try {
      const newBuffer = new ArrayBuffer(this.#arrayBuffer);
      const view = new Uint8Array();
      view.reverse();
      return new MemoryBlock(newBuffer);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryBlock.createReversed",
          cause: e,
        });
      }
    }
  }
  reverse() {
    try {
      const view = new Uint8Array(this.#arrayBuffer);
      view.reverse();
      return this;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryBlock.reverse",
          cause: e,
        });
      }
    }
  }
  createCopy(args) {
    try {
      return new MemoryBlock(new ArrayBuffer(this.#arrayBuffer));
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryBlock.createCopy",
          cause: e,
        });
      }
    }
  }
  createSlicedCopy(args) {
    try {
      if (!(args.hasOwnProperty("start"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.createSlicedCopy",
          message: "Invalid Arguments",
        });
      }
      if (typeof args.start !== "Number") {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.createSlicedCopy",
          message: "Invalid Arguments",
        });
      }
      if (!(Number.isInteger(args.start))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.createSlicedCopy",
          message: "Invalid Arguments: start must be an integer",
        });
      }
      if (!(args.hasOwnProperty("end"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.createSlicedCopy",
          message: "Invalid Arguments"
        });
      }
      if (typeof args.end !== "Number") {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.createSlicedCopy",
          message: "Invalid Arguments",
        });
      }
      if (!(Number.isInteger(args.end))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "MemoryBlock.createSlicedCopy",
          message: "Invalid Arguments: end must be an integer",
        });
      }
      const newLength = args.end - args.start;
      const newBuffer = new ArrayBuffer(newLength);
      const copyView = new Uint8Array(this.#arrayBuffer, args.start, args.end);
      newBuffer.set(copyView);
      return new MemoryBlock(newBuffer);
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "MemoryBlock.createSlicedCopy",
          cause: e,
        });
      }
    }
  }
};

class Uint8 {
  #view;
  constructor (args) {
    try {
      if (!(args.hasOwnProperty("memoryBlock"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8 constructor",
          message: "memoryBlock is required.",
        });
      }
      let byteOffset;
      if (args.hasOwnProperty("byteOffset")) {
        byteOffset = args.byteOffset;
      } else {
        byteOffset = 0;
      }
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

// cannot change length
// locked to a memory block
// interprets each byte as an unsigned 8-bit integer
// allows reading and writing of contents
class Uint8View {
  #memoryBlock;
  #view;
  static BYTES_PER_ELEMENT = 1;
  constructor(args) {
    try {
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
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "Uint8View constructor",
          cause: e,
        });
      }
    }
  }
  get length() {
    try {
      return this.#view.length;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "get Uint8View.length",
          cause: e,
        });
      }
    }
  }
  get [Symbol.iterator]() {
    try {
      return this.#view[Symbol.iterator];
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "get Uint8View[Symbol.iterator]",
          cause: e,
        });
      }
    }
  }
  at(args) {
    try {
      if (!(args.hasOwnProperty("index"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8View.at",
          message: "index is required.",
        });
      }
      return this.#view[args.index];
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "Uint8View.at",
          cause: e,
        });
      }
    }
  }
  copyWithin(args) {
    try {
      if (!(args.hasOwnProperty("toIndex"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8View.copyWithin",
          message: "target is required.",
        });
      }
      if (!(args.hasOwnProperty("fromIndex"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8View.copyWithin",
          message: "start is required.",
        });
      }
      if (!(args.hasOwnProperty("length"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8View.copyWithin",
          message: "end is required.",
        });
      }
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "Uint8View.copyWithin",
          cause: e,
        });
      }
    }
  }
  fill(args) {
    try {
      if (!(args.hasOwnProperty("value"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8View.fill",
          message: "value is required.",
        });
      }
      if (!(args.hasOwnProperty("startIndex"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8View.fill",
          message: "start is required.",
        });
      }
      if (!(args.hasOwnProperty("endIndex"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8View.fill",
          message: "end is required.",
        });
      }
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "Uint8View.fill",
          cause: e,
        });
      }
    }
  }
  reverse() {
    try {
      this.#view.reverse();
      return this;
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "Uint8View.reverse",
          cause: e,
        });
      }
    }
  }
  set(args) {
    try {
      if (!(args.hasOwnProperty("typedarray"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8View.set",
          message: "typedarray is required.",
        });
      }
      if (!(args.hasOwnProperty("targetOffset"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8View.set",
          message: "targetOffset is required.",
        });
      }
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "Uint8View.set",
          cause: e,
        });
      }
    }
  }
  // "start" and "end" are relative to the start of this.#view
  createSlice(args) {
    try {
      if (!(args.hasOwnProperty("start"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8View.set",
          message: "start is required.",
        });
      }
      if (!(args.hasOwnProperty("end"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8View.set",
          message: "end is required.",
        });
      }
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "Uint8View.set",
          cause: e,
        });
      }
    }
  }
  sort(args) {
    try {
      if (!(args.hasOwnProperty("compareFn"))) {
        throw new ErrorHandling.AnticipatedError({
          functionName: "Uint8View.sort",
          message: "compareFn is required.",
        });
      }
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "Uint8View.sort",
          cause: e,
        });
      }
    }
  }
  isViewOf(args) {
    try {
    } catch (e) {
      if (e instanceof ErrorHandling.AnticipatedError) {
        throw e;
      } else {
        throw new ErrorHandling.UnanticipatedError({
          functionName: "Uint8View.isViewOf",
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
