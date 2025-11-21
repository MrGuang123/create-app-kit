import React from 'react';
import { formatEther } from 'viem';
import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

const WalletPanel = () => {
  const chainId = useChainId();
  const { address, chain, status } = useAccount();
  const { connect, connectors, isPending: connecting, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    chains,
    switchChain,
    isPending: switching,
  } = useSwitchChain({
    chains: [mainnet, sepolia],
  });

  const { data: balance, isLoading: loadingBalance } = useBalance({
    address,
    chainId,
    query: { enabled: Boolean(address) },
  });

  const onConnect = (connectorId: string) => {
    const connector = connectors.find((item) => item.id === connectorId) ?? connectors[0];
    if (connector) connect({ connector });
  };

  return (
    <div className="card wallet">
      <div className="wallet__header">
        <div>
          <p className="badge badge-soft">钱包连接</p>
          <h3>{address ? '已连接' : '未连接'}</h3>
          <p className="muted">
            状态：{status}
            {chain ? ` · 网络：${chain.name}` : ''}
          </p>
        </div>
        {address ? (
          <button className="btn ghost" onClick={() => disconnect()}>
            断开
          </button>
        ) : null}
      </div>

      {!address ? (
        <div className="wallet__actions">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              className="btn"
              onClick={() => onConnect(connector.id)}
              disabled={connecting}
            >
              {connector.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="wallet__body">
          <div className="wallet__row">
            <span className="label">地址</span>
            <span className="value mono">{address}</span>
          </div>
          <div className="wallet__row">
            <span className="label">余额</span>
            <span className="value mono">
              {loadingBalance ? '加载中...' : balance ? `${formatEther(balance.value)} ${balance.symbol}` : '--'}
            </span>
          </div>

          <div className="wallet__row">
            <span className="label">切换网络</span>
            <div className="switcher">
              {chains.map((item) => (
                <button
                  key={item.id}
                  className={`btn ghost ${chainId === item.id ? 'btn--active' : ''}`}
                  onClick={() => switchChain({ chainId: item.id })}
                  disabled={switching || chainId === item.id}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {connectError ? <p className="error">连接失败：{connectError.message}</p> : null}
    </div>
  );
};

export default WalletPanel;
