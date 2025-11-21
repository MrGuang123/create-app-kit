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
