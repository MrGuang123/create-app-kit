# React Web2 模板

- 技术栈：React 19 + TypeScript + Webpack 5。
- 特色：面向 Web2 应用的通用模板，适配 REST/GraphQL 接口；提供示例 hook、目录分层，别名 `@` 指向 `src`，生产模式分包与 CSS 抽离。

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

- `src/hooks/useHealthCheck.ts`：健康检查示例 hook，可替换成真实接口调用。
- `src/App.tsx`：示例落地页，可移除示例卡片并改为业务页面。
- `build/webpack.*.js`：基础/开发/生产三套配置，若需注入环境变量可在 base 配置中添加 DefinePlugin。

> 建议在 hooks 中封装接口请求（fetch/axios），配合状态库或数据缓存库（如 React Query/SWR）进一步管理请求状态；需要路由时可添加 `react-router` 并在 `src/pages` 组织页面。

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
