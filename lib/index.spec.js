const iw = require('./');

describe('Main', () => {

  it('should return 42', async () => {
    const wasm = `
    (module
      (func $f (result i32)
        (i32.const 42)
      )
      (export "helloWorld" (func $f))
    )`;
    const wasmModule = await iw(wasm);

    expect(typeof wasmModule).toBe('object');
    expect(typeof wasmModule.helloWorld).toBe('function');
    expect(wasmModule.helloWorld()).toBe(42);
  });

  it('should return the sum of two parameters', async () => {
    const wasm = `
    (module
      (func (export "addTwo") (param $n1 i32) (param $n2 i32) (result i32)
        get_local $n1
        get_local $n2
        i32.add))`;
    const wasmModule = await iw(wasm);

    expect(typeof wasmModule).toBe('object');
    expect(typeof wasmModule.addTwo).toBe('function');
    expect(wasmModule.addTwo(5, 10)).toBe(15);
  });

  it('should return 43', async () => {
    const wasm = `
    (module
      (func $getAnswer (result i32)
        i32.const 42)
      (func (export "getAnswerPlus1") (result i32)
        call $getAnswer
        i32.const 1
        i32.add))`;
    const wasmModule = await iw(wasm);

    expect(typeof wasmModule).toBe('object');
    expect(typeof wasmModule.getAnswerPlus1).toBe('function');
    expect(wasmModule.getAnswerPlus1(5, 10)).toBe(43);
  });

  it('should return a function which returns "Hello World" (by having the string length)', async () => {
    const wasm = `
    (module
      (memory (export "memory") 1)
      (func (export "hello") (result i32)
        i32.const 16
      )
      (data (i32.const 16)
        "Hello World"
      )
      (global (export "str_len") i32 (i32.const 11))
    )`;
    const wasmModule = await iw(wasm);
  
    expect(typeof wasmModule).toBe('object');
    expect(typeof wasmModule.hello).toBe('function');
    expect(typeof wasmModule.str_len).toBe('object');
    
    const outputPointer = wasmModule.hello();
    const outputLength = wasmModule.str_len.value;
    
    expect(wasmModule.str_len.value).toBe(11);
    expect(wasmModule.readString(outputPointer, outputLength)).toEqual('Hello World');
  });

  it('should return a function which returns "Hello World" (by not having the string length)', async () => {
    const wasm = `
    (module
      (memory (export "memory") 1)
      (func (export "hello") (result i32)
        i32.const 16
      )
      (data (i32.const 16)
        "Hello World"
      )
    )`;
    const wasmModule = await iw(wasm);
  
    expect(typeof wasmModule).toBe('object');
    expect(typeof wasmModule.hello).toBe('function');
    
    const outputPointer = wasmModule.hello();

    expect(wasmModule.readString(outputPointer)).toEqual('Hello World');
  });

  it('should pass a JS function to WASM and call it', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const wasm = `
    (module
      (import "env" "sayHey" (func $sayHey))
      (func (export "hello")
        (call $sayHey)
      )
    )`;

    const sayHey = function() {
      console.log('Hey!')
    }

    const wasmModule = await iw(wasm, { env: { sayHey }});
  
    expect(typeof wasmModule).toBe('object');
    expect(typeof wasmModule.hello).toBe('function');
    
    wasmModule.hello();

    expect(consoleSpy).toHaveBeenCalledWith('Hey!');
  });

  it('should pass a JS function with arguments to WASM and call it', async () => {
    const wasm = `
    (module
      (import "env" "add" (func $add (param i32 i32) (result i32)))
      (func (export "addition") (param $n1 i32) (param $n2 i32) (result i32)
        get_local $n1
        get_local $n2
        (call $add)
      )
    )`;

    const add = function(a, b) {
      return a + b;
    }

    const wasmModule = await iw(wasm, { env: { add }});
  
    expect(typeof wasmModule).toBe('object');
    expect(typeof wasmModule.addition).toBe('function');
    
    const result = wasmModule.addition(10, 33);

    expect(result).toEqual(43);
  });

});
