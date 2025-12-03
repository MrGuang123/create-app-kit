/* tslint:disable */
/* eslint-disable */

/**
 * 调整亮度
 * factor: 亮度因子 (0.0 ~ 2.0, 1.0 为原始)
 */
export function adjust_brightness(data: Uint8Array, factor: number): void;

/**
 * 高斯模糊（简化版 3x3）
 */
export function blur(data: Uint8Array, width: number, height: number): void;

/**
 * 计算范围内的素数个数
 */
export function count_primes(max: number): number;

/**
 * 计算阶乘
 */
export function factorial(n: number): bigint;

/**
 * 迭代计算斐波那契数（高效版本）
 */
export function fibonacci_iterative(n: number): bigint;

/**
 * 递归计算斐波那契数（用于演示计算密集型任务）
 * 注意：这是故意使用低效的递归算法来对比性能
 */
export function fibonacci_recursive(n: number): bigint;

/**
 * 最大公约数
 */
export function gcd(a: bigint, b: bigint): bigint;

/**
 * 获取第 n 个素数
 */
export function get_nth_prime(n: number): number;

/**
 * 灰度化图像 (RGBA -> 灰度)
 * 直接修改传入的数据
 */
export function grayscale(data: Uint8Array): void;

export function init(): void;

/**
 * 反色处理
 */
export function invert(data: Uint8Array): void;

/**
 * 快速排序（返回排序后的数组）
 */
export function quick_sort(data: Int32Array): void;

/**
 * 字符串反转（展示 wasm-bindgen 的字符串支持）
 */
export function reverse_string(s: string): string;

/**
 * 计算数组和
 */
export function sum_array(data: Int32Array): bigint;

/**
 * 统计字符串中的单词数
 */
export function word_count(s: string): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly adjust_brightness: (a: number, b: number, c: any, d: number) => void;
  readonly blur: (a: number, b: number, c: any, d: number, e: number) => void;
  readonly count_primes: (a: number) => number;
  readonly factorial: (a: number) => bigint;
  readonly fibonacci_iterative: (a: number) => bigint;
  readonly fibonacci_recursive: (a: number) => bigint;
  readonly gcd: (a: bigint, b: bigint) => bigint;
  readonly grayscale: (a: number, b: number, c: any) => void;
  readonly init: () => void;
  readonly invert: (a: number, b: number, c: any) => void;
  readonly quick_sort: (a: number, b: number, c: any) => void;
  readonly reverse_string: (a: number, b: number) => [number, number];
  readonly sum_array: (a: number, b: number) => bigint;
  readonly word_count: (a: number, b: number) => number;
  readonly get_nth_prime: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
