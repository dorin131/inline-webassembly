const wabt = require('wabt')();
const util = require('util');

getDecoderEncoder = () => {
  let Decoder, Encoder;
  try {
    Decoder = TextDecoder;
    Encoder = TextEncoder;
  } catch (e) {
    Decoder = util.TextDecoder;
    Encoder = util.TextEncoder;
  }
  return { Decoder, Encoder };
}

module.exports = async (input, importObject) => {
  const { Decoder, Encoder } = getDecoderEncoder();
  const wasmModule = wabt.parseWat('inline', new Encoder('utf-8').encode(input));
  const { buffer } = wasmModule.toBinary({});
  const module = await WebAssembly.compile(buffer);
  const instance = await WebAssembly.instantiate(module, importObject || {});
  let memoryPointer = 2;

  const readString = (index, length) => {
    if (length) {
      return new Decoder().decode(instance.exports.memory.buffer.slice(index, index + length));
    }
    const decoded = new Decoder().decode(instance.exports.memory.buffer.slice(index));

    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      if (!decoded.charCodeAt(i)) {
        return result
      }
      result += decoded[i];
    }
    throw Error(`Error reading string at index ${index}. Cannot find end. Please provide length argument.`)
  }

  const createString = (string, memoryLocation) => {
    let writeTo = memoryPointer;

    if (memoryLocation && Number.isNaN(memoryLocation)) {
      throw Error(`Invalid memory location for string "${string}". Has to be a number.`);
    }

    if (memoryLocation && memoryLocation <= memoryPointer + 1) {
      throw Error(`Invalid memory location for string "${string}". Has to be >= ${memoryPointer + 2}.`);
    }

    if (memoryLocation && Number.isInteger(memoryLocation)) {
      writeTo = memoryLocation;
    }

    const wasmBuffer = new Uint8Array(instance.exports.memory.buffer, writeTo);

    for (let i = 0; i < string.length; i++) {
      wasmBuffer[i] = string.charCodeAt(i);
    }

    memoryPointer = writeTo + string.length + 2;

    return writeTo;
  }

  return {
    ...instance.exports,
    readString,
    createString
  };
};
