/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const initPageTime = performance.now();

/*
const loadStreamsModule = import("https://scotwatson.github.io/Streams/Streams.mjs");

loadStreamsModule.then(function (module) {
  console.log(Object.getOwnPropertyNames(module));
}, streamFail);

function streamFail(e) {
  console.error("Stream Fail")
  console.error(e)
}
*/
const loadWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

Promise.all( [ loadWindow ] ).then(start, fail);

function start() {
  const buffer = new ArrayBuffer(1000);

  const view = new Uint8Array(buffer);

  const array = (function () {
    let array = new Array(buffer.byteLength);
    for (let i = 0; i < buffer.byteLength; ++i) {
      array[i] = new Uint8Array(buffer, i, 1);
    }
    return array;
  })();
  test1();
  test2();

  function test1() {
    const start = performance.now();
    for (let i = 0; i < 100000; ++i) {
      for (let j = 0; i < 1000; ++i) {
        view[j] = Math.random() * 256;
      }
    }
    const end = performance.now();
    console.log("test1 time: ", (end - start));
  }

  function test2() {
    const start = performance.now();
    for (let i = 0; i < 100000; ++i) {
      for (let j = 0; i < 1000; ++i) {
        array[j][0] = Math.random() * 256;
      }
    }
    const end = performance.now();
    console.log("test2 time: ", (end - start));
  }
}

function fail(e) {
  console.error("loadFail");
  console.error(e);
}
