import { WasmModule as WM } from "wabt";

declare namespace InlineWebAssembly {}

interface WasmModule extends WM {
  readString(index: number, length?: number): string;
  createString(string: string, memoryLocation: number): number;
}

declare function InlineWebAssembly(wasm: string, importObject?: any): Promise<WasmModule>;

export = InlineWebAssembly;
