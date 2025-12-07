import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  persist,
  type PersistOptions,
} from "zustand/middleware";

const isDev = process.env.NODE_ENV === "development";

type CreateStoreOptions<T> = {
  name: string;
  // 添加Partial<T>是因为不一定所有的属性都需要存储
  persistOptions?: Omit<
    PersistOptions<T, Partial<T>>,
    "name"
  >;
};

export function createStore<
  State extends object,
  Actions extends object
>(
  initializer: StateCreator<
    State & Actions,
    [["zustand/devtools", never], ["zustand/immer", never]],
    []
  >,
  options: CreateStoreOptions<State & Actions>
) {
  const { name, persistOptions } = options;

  return create<State & Actions>()(
    persist(
      devtools(immer(initializer), {
        name,
        enabled: isDev, // ← 生产环境禁用，但中间件链保持一致
      }),
      { name, ...persistOptions }
    )
  );
}

// 中间件顺序：persist (外) → devtools → immer (内)
/**
 * 原因：
 * immer 改变了 set 函数的 API，
 * 如果 immer 不在最内层，其他中间件拿到的是"错误"的 set 签名，无法正确处理。
 *
 * devtools 需要记录"最终的状态变化"，
 * 如果 devtools 在 immer 内层，它会看到 mutable 操作（state.count++），
 * 而不是最终的 immutable 结果，导致记录不正确。
 *
 * persist 必须在最外层才能：
 * 最早介入（提供初始状态）
 * 最后拦截（存储最终状态）
 */

// StateCreator详解
/**
 * T: Store 的完整状态类型（包含 state + actions）
 * Mis: Mutators In（输入中间件列表）—— 这个 store 会用到哪些中间件
 * [中间件名, 配置类型]
 * 比如 [['zustand/immer', never]]，表示这个 store 会用到 immer 中间件
 * Mos: Mutators Out（输出中间件列表）—— 这个 creator 对外暴露哪些中间件
 * U: 可选，用于 slice 模式的部分状态
 */
