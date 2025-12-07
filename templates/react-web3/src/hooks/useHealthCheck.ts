import { useEffect, useState } from 'react';

type Status = 'idle' | 'loading' | 'ok' | 'error';

// 简单的健康检查示例，实际可替换为 fetch/axios 请求你的 API。
export const useHealthCheck = () => {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let canceled = false;

    const ping = async () => {
      try {
        // 替换为真实接口，如：await fetch(`${API_BASE}/health`);
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!canceled) setStatus('ok');
      } catch (err) {
        if (!canceled) setStatus('error');
      }
    };

    ping();
    return () => {
      canceled = true;
    };
  }, []);

  return status;
};
