import React from 'react';
import WalletPanel from './components/WalletPanel';

const highlights = [
  {
    title: '链上就绪',
    description: 'React 19 + wagmi + viem + React Query，预置钱包连接、余额获取与网络切换。',
  },
  {
    title: '工程化配置',
    description: 'Webpack 5 构建，生产模式分包、CSS 抽离与压缩，图片与静态资源开箱即用。',
  },
  {
    title: '可扩展分层',
    description: '为 hooks、stores、layouts、pages 预留目录，可继续接入路由、状态库、合约类型生成。',
  },
];

const nextSteps = [
  { label: '连接钱包', detail: '使用 WalletPanel 组件，已提供 injected 连接示例（MetaMask 等）。' },
  { label: '读写合约', detail: '在 hooks 中使用 viem/wagmi 调用，并通过 React Query 做缓存与状态管理。' },
  { label: '多网络支持', detail: '在 config/wagmi.ts 中维护 chains/RPC，前端可切换 mainnet/sepolia 等网络。' },
];

const structure = [
  { name: 'src/config/wagmi.ts', detail: 'chains 与 transports 配置，按需改 RPC/支持的网络。' },
  { name: 'src/providers/', detail: '统一挂载 WagmiProvider + React Query。' },
  { name: 'src/components/WalletPanel/', detail: '钱包连接、余额展示、网络切换示例。' },
  { name: 'src', detail: '其余业务代码，可继续添加 hooks/stores/pages 等。' },
];

const App = () => (
  <div className="page">
    <div className="gradient gradient-1" />
    <div className="gradient gradient-2" />

    <main className="container">
      <header className="card hero">
        <p className="pill">Create App Kit · React 19 · Web3</p>
        <h1>快速启动 Web3 前端</h1>
        <p className="subtitle">
          预置 wagmi + viem + React Query，内置钱包连接与网络切换示例。直接填入合约 ABI 与 RPC，即可继续开发读取/写入功能。
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
          <p>链配置、Provider 与钱包组件均已放置好，直接替换/扩展即可。</p>
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
          <p>补充 RPC/ABI/接口后，继续扩展业务功能。</p>
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

      <WalletPanel />
    </main>
  </div>
);

export default App;
