const wabt = require('wabt')();

module.exports = async (input) => {
  const wasmModule = wabt.parseWat('inline', new TextEncoder('utf-8').encode(input));
  const { buffer } = wasmModule.toBinary({});
  const module = await WebAssembly.compile(buffer);
  const instance = await WebAssembly.instantiate(module);

  const readString = (index, length) => {
    if (length) {
      return new TextDecoder().decode(instance.exports.memory.buffer.slice(index, index + length));
    }
    const decoded = new TextDecoder().decode(instance.exports.memory.buffer.slice(index));
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      if (!decoded.charCodeAt(i)) {
        return result
      }
      result += decoded[i];
    }
  }

  return {
    ...instance.exports,
    readString
  };
};
