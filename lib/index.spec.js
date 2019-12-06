const iw = require('./');

describe('Main', () => {
  it('should return a function which returns 42', async () => {
    const wasm = `
    (module
      (func (result i32)
        (i32.const 42)
      )
      (export "helloWorld" (func 0))
    )`;
    const wasmModule = await iw(wasm);

    expect(typeof wasmModule).toBe('object');
    expect(typeof wasmModule.helloWorld).toBe('function');
    expect(wasmModule.helloWorld()).toBe(42);
  });
});
