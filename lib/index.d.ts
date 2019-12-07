import { WasmModule as WM } from "wabt";

declare namespace InlineWebAssembly {

}

interface WasmModule extends WM {
  readString(index: number, length?: number): string
}

declare function InlineWebAssembly(wasm: string): Promise<WasmModule>;

export = InlineWebAssembly;
