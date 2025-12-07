/**
 * Rust WASM 模块类型声明
 * wasm-pack 会自动生成 .d.ts 文件，这里提供备用声明
 */

declare module "*.wasm" {
  const content: WebAssembly.Module;
  export default content;
}

// wasm-pack 生成的模块类型（如果 pkg 目录不存在时的备用）
declare module "@/wasm/pkg/compute_wasm" {
  // 初始化函数
  export default function init(): Promise<void>;

  // 斐波那契
  export function fibonacci_recursive(n: number): bigint;
  export function fibonacci_iterative(n: number): bigint;

  // 素数
  export function count_primes(max: number): number;
  export function get_nth_prime(n: number): number;

  // 图像处理
  export function grayscale(data: Uint8Array): void;
  export function invert(data: Uint8Array): void;
  export function adjust_brightness(
    data: Uint8Array,
    factor: number
  ): void;
  export function blur(
    data: Uint8Array,
    width: number,
    height: number
  ): void;

  // 数组计算
  export function sum_array(data: Int32Array): bigint;
  export function quick_sort(data: Int32Array): void;

  // 字符串处理
  export function reverse_string(s: string): string;
  export function word_count(s: string): number;

  // 数学计算
  export function factorial(n: number): bigint;
  export function gcd(a: bigint, b: bigint): bigint;
}
