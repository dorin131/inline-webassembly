import { WasmModule } from "wabt";

declare namespace InlineWebAssembly {

}

declare function InlineWebAssembly(wasm: string): Promise<WasmModule>;

export = InlineWebAssembly;
