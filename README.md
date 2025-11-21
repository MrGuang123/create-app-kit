# create-app-kit

一个可发布的 CLI 包，内置前端模板（React 19 + TypeScript + Webpack 5），支持 Web2 / Web3 两套示例。根目录是 CLI，模板在 `templates/` 下。

## 目录

- `bin/`：CLI 可执行文件。
- `templates/react-web2/`：Web2 通用模板（REST/GraphQL 友好，含健康检查示例 hook）。
- `templates/react-web3/`：Web3 模板（wagmi + viem + React Query，含钱包连接/网络切换示例）。
- `package.json`：CLI 包配置，`files` 会将 `bin` 与 `templates` 一起发布。

## 使用

```bash
# 列出模板
npx create-app-kit --list

# 生成项目（默认交互选择模板；示例使用 react-web2）
npx create-app-kit my-app -t react-web2   # Web2 模板
# npx create-app-kit my-app -t react-web3 # Web3 模板
cd my-app
npm install
npm run dev   # 开发模式
npm run build # 生产构建
```

## 添加新模板

1. 在 `templates/<template-name>` 下放置完整模板（含 package.json / src / build / public / tsconfig.json 等）。
2. 写 `template.json`，填上 `title` 和 `description`，CLI 会自动出现在 `--list`。
3. 不需要改 CLI 代码即可新增模板；发布时直接 `npm publish`（包会带上 templates）。

> 当前模板已使用 React 19 正式版，类型定义同步到 `@types/react` `@types/react-dom` 19.x。
