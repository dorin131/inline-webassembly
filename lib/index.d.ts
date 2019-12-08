import { WasmModule as WM } from 'wabt';

declare namespace InlineWebAssembly {}

interface WasmModule extends WM {
  /**
   * Read a string from the module memory by providing a pointer (the position of the first character).
   * 
   * It is highly recommended that you provide the length too. In the case when no length argument is supplied,
   * it will be assumed that the string finishes at the first zero byte.
   */
  readString(index: number, length?: number): string;
  /**
   * Create a new string in the module memory. By default all strings will be added one after the other, separated
   * by a zero byte.
   * 
   * The function returns a pointer to the newly created string.
   * 
   * For this to work as expected you have to either export the memory from the WebAseembly code or import it from
   * JavaScript, through the import object. 
   */
  createString(string: string, memoryLocation?: number): number;
}

declare function InlineWebAssembly(wasm: string, importObject?: any): Promise<WasmModule>;

export = InlineWebAssembly;
