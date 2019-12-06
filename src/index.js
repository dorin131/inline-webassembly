const wabt = require('wabt')();

module.exports = async (input) => {
  const wasmModule = wabt.parseWat('main.wat', new TextEncoder('utf-8').encode(input));
  const { buffer } = wasmModule.toBinary({});
  const module = await WebAssembly.compile(buffer);
  const instance = await WebAssembly.instantiate(module);
  return instance.exports;
};
