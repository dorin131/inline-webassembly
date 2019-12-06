const wabt = require("wabt")();
 
const wasm = `(module
  (func (result i32)
    (i32.const 42)
  )
  (export "helloWorld" (func 0))
)`

const wasmModule = wabt.parseWat('main.wat', new TextEncoder("utf-8").encode(wasm));
const { buffer } = wasmModule.toBinary({});

(async function() {
  const module = await WebAssembly.compile(buffer);
  const instance = await WebAssembly.instantiate(module);
  console.log(instance.exports.helloWorld());
})()
