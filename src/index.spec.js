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
    const result = await iw(wasm);

    expect(typeof result).toBe('object');
    expect(typeof result.helloWorld).toBe('function');
    expect(result.helloWorld()).toBe(42);
  });
});
