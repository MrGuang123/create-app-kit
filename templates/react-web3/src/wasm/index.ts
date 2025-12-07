/**
 * Rust WASM 模块加载器
 * 使用 wasm-pack 生成的 JS 绑定
 */

// wasm-pack 生成的类型会放在 pkg 目录
// 首次使用前需要运行 pnpm wasm:build
import type * as WasmModule from "./pkg/compute_wasm";

type WasmExports = typeof WasmModule;

let wasmInstance: WasmExports | null = null;
let loadingPromise: Promise<WasmExports> | null = null;

/**
 * 加载 WASM 模块（单例模式）
 */
export async function loadWasm(): Promise<WasmExports> {
  if (wasmInstance) {
    return wasmInstance;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      // 动态导入 wasm-pack 生成的模块
      const wasm = await import("./pkg/compute_wasm");

      // 初始化 WASM 模块
      await wasm.default();

      wasmInstance = wasm;
      console.log("[WASM] Rust module loaded successfully");

      return wasm;
    } catch (error) {
      console.error("[WASM] Failed to load module:", error);
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
}

/**
 * 获取已加载的 WASM 实例
 */
export function getWasmInstance(): WasmExports | null {
  return wasmInstance;
}

/**
 * 检查 WASM 是否已加载
 */
export function isWasmLoaded(): boolean {
  return wasmInstance !== null;
}

// 重新导出类型，方便使用
export type { WasmExports };
