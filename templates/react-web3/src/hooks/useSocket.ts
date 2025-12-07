import {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  SocketClient,
  socketManager,
} from "@/utils/socket";

type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";

interface UseSocketOptions {
  /** 实例 key（用于共享连接）*/
  key?: string;
  /** WebSocket URL（动态获取时可能为 undefined）*/
  url?: string;
  /** URL 准备好后自动连接 */
  autoConnect?: boolean;
  /** 要加入的频道 */
  channel?: string;
  /** 消息回调 */
  onMessage?: (data: any) => void;
  /** 状态变化回调 */
  onStatusChange?: (status: ConnectionStatus) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const {
    key,
    url,
    autoConnect = true,
    channel,
    onMessage,
    onStatusChange,
  } = options;

  const [status, setStatus] =
    useState<ConnectionStatus>("disconnected");
  const [lastMessage, setLastMessage] = useState<any>(null);
  const socketRef = useRef<SocketClient | null>(null);
  const cleanupRef = useRef<(() => void)[]>([]);
  const prevUrlRef = useRef<string | undefined>(undefined);

  // 初始化 Socket
  useEffect(() => {
    // URL 还没获取到，不连接
    if (!url) return;

    const instanceKey = key || url;

    // 检查是否需要重建实例（URL 变化了）
    if (socketManager.has(instanceKey)) {
      const existingSocket = socketManager.get(instanceKey);
      const existingUrl = existingSocket.getUrl();

      // 只有当 URL 真正变化时才移除旧实例
      if (existingUrl !== url) {
        console.log(
          `[useSocket] URL changed: ${existingUrl} -> ${url}`
        );
        socketManager.remove(instanceKey);
      }
    }

    // 获取或创建实例
    socketRef.current = socketManager.get(instanceKey, {
      url,
      onStatusChange: (s) => {
        setStatus(s);
        onStatusChange?.(s);
      },
    });

    // 订阅消息
    const unsubMessage = socketRef.current.onMessage(
      (data) => {
        setLastMessage(data);
        onMessage?.(data);
      }
    );
    cleanupRef.current.push(unsubMessage);

    // 自动连接
    if (autoConnect && !socketRef.current.isConnected()) {
      socketRef.current.connect();
    }

    // 同步当前状态
    setStatus(socketRef.current.getStatus());
    prevUrlRef.current = url;

    return () => {
      cleanupRef.current.forEach((fn) => fn());
      cleanupRef.current = [];
    };
  }, [url, key]);

  // 频道订阅
  useEffect(() => {
    if (!channel || !socketRef.current) return;

    const leaveChannel =
      socketRef.current.joinChannel(channel);

    return () => {
      leaveChannel();
    };
  }, [channel]);

  // 发送消息
  const send = useCallback(<T>(data: T) => {
    return socketRef.current?.send(data) ?? false;
  }, []);

  // 发送到指定频道
  const sendToChannel = useCallback(
    <T>(targetChannel: string, type: string, data: T) => {
      return (
        socketRef.current?.send({
          channel: targetChannel,
          type,
          data,
        }) ?? false
      );
    },
    []
  );

  // 订阅消息类型
  const subscribe = useCallback(
    (type: string, handler: (data: any) => void) => {
      return (
        socketRef.current?.subscribe(type, handler) ??
        (() => {})
      );
    },
    []
  );

  // 订阅频道消息
  const subscribeChannel = useCallback(
    (ch: string, handler: (data: any) => void) => {
      return (
        socketRef.current?.subscribeChannel(ch, handler) ??
        (() => {})
      );
    },
    []
  );

  // 订阅频道 + 类型
  const subscribeChannelType = useCallback(
    (
      ch: string,
      type: string,
      handler: (data: any) => void
    ) => {
      return (
        socketRef.current?.subscribeChannelType(
          ch,
          type,
          handler
        ) ?? (() => {})
      );
    },
    []
  );

  // 手动连接/断开
  const connect = useCallback(
    () => socketRef.current?.connect(),
    []
  );
  const disconnect = useCallback(
    () => socketRef.current?.disconnect(),
    []
  );

  return {
    status,
    isConnected: status === "connected",
    lastMessage,
    send,
    sendToChannel,
    subscribe,
    subscribeChannel,
    subscribeChannelType,
    connect,
    disconnect,
  };
}
