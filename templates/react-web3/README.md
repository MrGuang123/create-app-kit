# React Web3 模板

> 基于 React 19 + TypeScript + Webpack 5 的现代化前端脚手架

## ✨ 特性

- ⚡ React 19 + TypeScript
- 🎨 Tailwind CSS 4 + Shadcn UI
- 📦 Zustand 状态管理
- 🔄 React Query 数据请求
- 🌍 i18next 国际化（中/英）
- 🌓 暗色/亮色主题切换
- 🔌 WebSocket 工具封装
- ✅ Vitest 单元测试 + Cypress E2E 测试
- 🔧 Biome 代码格式化 + Husky Git hooks

## 📁 项目结构

src/
├── components/ # 通用组件
├── constants/ # 常量定义
├── hooks/ # 自定义 Hooks
├── layouts/ # 布局组件
├── locales/ # 国际化语言包
├── pages/ # 页面组件
├── providers/ # React Context Providers
├── routes/ # 路由配置
├── services/ # API 服务层
├── shadcn/ # Shadcn UI 组件
├── stores/ # Zustand 状态
├── types/ # TypeScript 类型定义
└── utils/ # 工具函数

## 🚀 快速开始

# 安装依赖

pnpm install

# 启动开发服务器

pnpm dev

# 构建生产版本

pnpm build

# 运行单元测试

pnpm vitest

# 运行 E2E 测试

pnpm cy:open

## 📖 开发指南

### 添加新页面

1. 在 `src/pages/` 创建页面目录
2. 在 `src/routes/config.tsx` 添加路由配置
3. （可选）在 `src/locales/` 添加翻译

### 使用 WebSocket

```
import { useSocket } from "@/hooks/useSocket";

function MyComponent() {
  const { status, send, lastMessage } = useSocket({
    url: "ws://localhost:8080",
  });
}
```

### 添加国际化

在 `src/locales/zh-CN/common.ts` 和 `src/locales/en-US/common.ts` 中添加翻译键值。

## 安装

pnpm install> 注意：首次安装时 Cypress 会自动下载二进制文件（约 300MB），如果网络问题导致失败，请手动运行 `npx cypress install`。

## 测试

E2E 测试（少量，慢，贵）- 完整用户流程
集成测试（适量）- 组件 + Hook + Store 联动
单元测试（大量，快，便宜）- Utils, Hooks, Store, 纯函数

建议测试内容：
工具函数、自定义 Hooks、Store/状态管理、业务逻辑函数（涉及计算、规则）、复杂交互组件（表单、模态框等）
不建议测试内容：
样式/CSS、第三方库行为、简单的 UI 展示组件、路由跳转

## webassembly

### 1. 全局安装 rust 和 wasm-pack（只需一次）

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install wasm-pack

### 2. 进入项目目录

cd projectName

### 3. 编译 Rust WASM（会自动下载 Cargo.toml 中的依赖）

pnpm wasm:build

### 4. 启动开发服务器

pnpm dev

### 注意

计算量大 - 单次调用内部有大量计算
JS 做不好 - 递归、内存操作、64 位整数
有现成库 - 想复用 Rust/C++ 生态
