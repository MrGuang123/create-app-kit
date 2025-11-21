# React Web3 模板

- 技术栈：React 19 + TypeScript + Webpack 5 + wagmi 3 + viem + React Query。
- 特色：预置钱包连接（injected）、余额查询、网络切换示例；别名 `@` 指向 `src`，生产模式分包与 CSS 抽离。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

产物输出到 `dist/`。如需静态服务器可使用 `npx serve dist` 等工具。

## 重要文件

- `src/config/wagmi.ts`：配置 chains 和 RPC（默认 mainnet + sepolia，可自行替换）。
- `src/providers/`：挂载 `WagmiProvider` 与 `QueryClientProvider`。
- `src/components/WalletPanel/`：钱包连接、余额展示、网络切换示例，可扩展交易签名/合约调用。
- `src/App.tsx`：示例落地页，可用来替换成业务页面。

> 需要接入自定义 RPC 或更多链时，直接修改 `wagmiConfig.ts`；如需增加合约调用，建议在 hooks 中封装，并结合 React Query 做缓存与加载状态管理。
