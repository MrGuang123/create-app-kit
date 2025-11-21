import { createConfig, http } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// 默认链配置，可根据需要添加自定义 RPC 或更多网络
export const chains = [mainnet, sepolia] satisfies readonly [Chain, ...Chain[]];

export const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [injected()],
  ssr: false,
});
