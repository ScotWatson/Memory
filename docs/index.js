/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const initPageTime = performance.now();

const asyncWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

const asyncErrorLog = (async function () {
  try {
    return await import("https://scotwatson.github.io/Debug/20230705/ErrorLog.mjs");
  } catch (e) {
    console.error(e);
  }
})();

const asyncMemory = (async function () {
  try {
    return await import("https://scotwatson.github.io/Memory/20230705/Memory.mjs");
  } catch (e) {
    console.error(e);
  }
})();

(async function () {
  try {
    const modules = await Promise.all( [ asyncWindow, asyncErrorLog, asyncMemory ] );
    start(modules);
  } catch (e) {
    console.error(e);
  }
})();

async function start(evtWindow, ErrorLog, Memory) {
  try {
    const buffer = new Memory.Block({
      byteLength: 1000,
    });
    const view = new Memory.View(buffer);

    const array = (function () {
      let array = new Array(buffer.byteLength);
      for (let i = 0; i < buffer.byteLength; ++i) {
        array[i] = new Uint8Array(buffer, i, 1);
      }
      return array;
    })();
    test1();
    test2();
  } catch (e) {
    ErrorLog.finalCatch({
      functionName: "start",
      error: e,
    });
  }

  function test1() {
    const start = performance.now();
    for (let i = 0; i < 1000000; ++i) {
      for (let j = 0; i < 1000; ++i) {
        view[j] = Math.random() * 256;
      }
    }
    const end = performance.now();
    console.log("test1 time: ", (end - start));
  }

  function test2() {
    const start = performance.now();
    for (let i = 0; i < 1000000; ++i) {
      for (let j = 0; i < 1000; ++i) {
        array[j][0] = Math.random() * 256;
      }
    }
    const end = performance.now();
    console.log("test2 time: ", (end - start));
  }
}
