import React from 'react';
import { useHealthCheck } from './hooks/useHealthCheck';

const highlights = [
  {
    title: '现代化栈',
    description: 'React 19 + TypeScript + Webpack 5，开箱即用，内置 @ 别名指向 src。',
  },
  {
    title: 'Web2 工程化',
    description: '适合 REST/GraphQL 项目，生产环境分包、CSS 抽离，图片与静态资源处理完备。',
  },
  {
    title: '扩展位准备好',
    description: '为 hooks、stores、layouts、pages 预留目录，可继续接入路由、状态库与数据缓存。',
  },
];

const nextSteps = [
  { label: '接接口', detail: '在 hooks 中封装 fetch/axios，配合 SWR/React Query 等缓存库。' },
  { label: '加路由', detail: '引入 react-router 并在 src/pages 下组织业务页面。' },
  { label: '加状态', detail: '按需选择 Zustand/Jotai/Redux，集中管理跨页面状态与特性开关。' },
];

const structure = [
  { name: 'src/hooks/useHealthCheck.ts', detail: '示例健康检查 hook，可替换为真实接口调用逻辑。' },
  { name: 'src', detail: '业务代码与样式；可增 routes/pages/components 目录以分层。' },
  { name: 'public', detail: '静态资源与 HTML 模板，由 HtmlWebpackPlugin 注入。' },
  { name: 'build', detail: 'webpack.base / development / production 三套配置。' },
];

const App = () => {
  const apiStatus = useHealthCheck();

  return (
    <div className="page">
      <div className="gradient gradient-1" />
      <div className="gradient gradient-2" />
      <h1 className="text-3xl font-bold text-green-700 underline">
        Hello world!
      </h1>
      <main className="container">
        <header className="card hero">
          <p className="pill">Create App Kit · React 19 · Web2</p>
          <h1>马上开工的 Web2 前端模板</h1>
          <p className="subtitle">
            针对常规 Web2 项目预置目录与构建配置，适合直接对接 REST/GraphQL 服务，再按需接入路由、状态管理与数据缓存。
          </p>
          <div className="cta-row">
            <div className="cta primary">npm run dev</div>
            <div className="cta ghost">npm run build</div>
          </div>
          <p className="note">提示：生成项目后先 npm install，再执行上述命令。</p>
        </header>

        <section className="grid">
          {highlights.map((item) => (
            <article key={item.title} className="card feature">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

        <section className="card section">
          <div className="section__header">
            <h2>核心结构</h2>
            <p>目录与 hook 示例已经就绪，可直接替换为真实业务代码。</p>
          </div>
          <div className="structure">
            {structure.map((item) => (
              <div key={item.name} className="structure__item">
                <span className="structure__name">{item.name}</span>
                <span className="structure__detail">{item.detail}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card section">
          <div className="section__header">
            <h2>下一步</h2>
            <p>把接口、路由和状态接入后，即可开始业务迭代。</p>
          </div>
          <div className="steps">
            {nextSteps.map((step) => (
              <div key={step.label} className="steps__item">
                <div className="badge">{step.label}</div>
                <p className="steps__detail">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card section">
          <div className="section__header">
            <h2>接口健康示例</h2>
            <p>使用自定义 hook 检查 API 状态；请替换为真实接口。</p>
          </div>
          <p className="note">
            当前状态：<strong>{apiStatus}</strong>
          </p>
        </section>
      </main>
    </div>
  );
};

export default App;
