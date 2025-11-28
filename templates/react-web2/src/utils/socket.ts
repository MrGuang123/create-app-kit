type MessageHandler = (data: any) => void;
type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";
type TTTimer = ReturnType<typeof setTimeout> | null;
type TITimer = ReturnType<typeof setInterval> | null;

interface SocketOptions {
  url: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeat?: boolean;
  heartbeatInterval?: number;
  heartbeatMessage?: string | object;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
}

const defaultOptions = {
  reconnect: true,
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  heartbeat: true,
  heartbeatInterval: 30000,
  heartbeatMessage: { type: "ping" },
};

export class SocketClient {
  private ws: WebSocket | null = null;
  private options: SocketOptions & typeof defaultOptions;
  private reconnectAttempts = 0;
  private reconnectTimer: TTTimer = null;
  private heartbeatTimer: TITimer = null;
  private status: ConnectionStatus = "disconnected";
  private manualClose = false;

  // 分层订阅结构
  // 所有消息
  private globalListeners = new Set<MessageHandler>();
  // 按 type
  private typeListeners = new Map<
    string,
    Set<MessageHandler>
  >();
  // 按 channel
  private channelListeners = new Map<
    string,
    Set<MessageHandler>
  >();
  // 按 channel + type
  private channelTypeListeners = new Map<
    string,
    Map<string, Set<MessageHandler>>
  >();

  // 已订阅的频道列表（用于重连后重新订阅）
  private subscribedChannels = new Set<string>();

  constructor(options: SocketOptions) {
    this.options = {
      ...defaultOptions,
      ...options,
    } as SocketOptions & typeof defaultOptions;
  }

  getUrl() {
    return this.options.url;
  }

  // 连接
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.warn("[Socket] Already connected");
      return;
    }

    this.manualClose = false;
    this.setStatus("connecting");

    try {
      this.ws = new WebSocket(this.options.url);
      this.setupEventHandlers();
    } catch (error) {
      console.error("[Socket] Connection error:", error);
      this.handleReconnect();
    }
  }

  // 断开连接
  disconnect() {
    this.manualClose = true;
    this.cleanup();
    this.ws?.close();
    this.ws = null;
    this.setStatus("disconnected");
  }

  // 发送消息
  send<T = any>(data: T) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn(
        "[Socket] Not connected, message not sent"
      );
      return false;
    }

    const message =
      typeof data === "string"
        ? data
        : JSON.stringify(data);
    this.ws.send(message);
    return true;
  }

  // ==================== 频道相关 ====================

  /**
   * 订阅频道
   * 会向服务端发送订阅请求，并在重连后自动重新订阅
   */
  joinChannel(channel: string) {
    this.subscribedChannels.add(channel);
    // 向服务端发送订阅请求（根据你的协议调整）
    this.send({ type: "subscribe", channel });
    return () => this.leaveChannel(channel);
  }

  /**
   * 离开频道
   */
  leaveChannel(channel: string) {
    this.subscribedChannels.delete(channel);
    this.send({ type: "unsubscribe", channel });
    // 清理该频道的所有监听器
    this.channelListeners.delete(channel);
    this.channelTypeListeners.delete(channel);
  }

  // ==================== 订阅相关 ====================

  /**
   * 订阅所有消息
   */
  onMessage(handler: MessageHandler) {
    this.globalListeners.add(handler);
    return () => this.globalListeners.delete(handler);
  }

  /**
   * 按消息类型订阅
   * @example subscribe("chat", handler)
   */
  subscribe(type: string, handler: MessageHandler) {
    if (!this.typeListeners.has(type)) {
      this.typeListeners.set(type, new Set());
    }
    this.typeListeners.get(type)!.add(handler);
    return () =>
      this.typeListeners.get(type)?.delete(handler);
  }

  /**
   * 订阅指定频道的所有消息
   * @example subscribeChannel("room-1", handler)
   */
  subscribeChannel(
    channel: string,
    handler: MessageHandler
  ) {
    if (!this.channelListeners.has(channel)) {
      this.channelListeners.set(channel, new Set());
    }
    this.channelListeners.get(channel)!.add(handler);
    return () =>
      this.channelListeners.get(channel)?.delete(handler);
  }

  /**
   * 订阅指定频道的指定类型消息
   * @example subscribeChannelType("room-1", "chat", handler)
   */
  subscribeChannelType(
    channel: string,
    type: string,
    handler: MessageHandler
  ) {
    if (!this.channelTypeListeners.has(channel)) {
      this.channelTypeListeners.set(channel, new Map());
    }
    const channelMap =
      this.channelTypeListeners.get(channel)!;
    if (!channelMap.has(type)) {
      channelMap.set(type, new Set());
    }
    channelMap.get(type)!.add(handler);

    return () => channelMap.get(type)?.delete(handler);
  }

  // ==================== 内部方法 ====================

  private setStatus(status: ConnectionStatus) {
    this.status = status;
    this.options.onStatusChange?.(status);
  }

  getStatus() {
    return this.status;
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log("[Socket] Connected");
      this.reconnectAttempts = 0;
      this.setStatus("connected");
      this.startHeartbeat();
      // 重连后重新订阅所有频道
      this.resubscribeChannels();
      this.options.onOpen?.();
    };

    this.ws.onclose = (event) => {
      console.log(
        "[Socket] Disconnected",
        event.code,
        event.reason
      );
      this.cleanup();
      this.options.onClose?.(event);

      if (!this.manualClose) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error("[Socket] Error:", error);
      this.options.onError?.(error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.dispatchMessage(data);
      } catch {
        this.dispatchMessage(event.data);
      }
    };
  }

  // 支持频道的消息分发
  private dispatchMessage(data: any) {
    // 1. 全局监听
    this.globalListeners.forEach((handler) =>
      handler(data)
    );

    // 2. 按 type 分发
    if (data?.type) {
      this.typeListeners
        .get(data.type)
        ?.forEach((handler) => handler(data));
    }

    // 3. 按 channel 分发
    if (data?.channel) {
      // 频道的所有消息
      this.channelListeners
        .get(data.channel)
        ?.forEach((handler) => handler(data));

      // 频道 + type
      if (data?.type) {
        this.channelTypeListeners
          .get(data.channel)
          ?.get(data.type)
          ?.forEach((handler) => handler(data));
      }
    }
  }

  //  重连后重新订阅频道
  private resubscribeChannels() {
    this.subscribedChannels.forEach((channel) => {
      this.send({ type: "subscribe", channel });
    });
  }

  private handleReconnect() {
    if (!this.options.reconnect) {
      this.setStatus("disconnected");
      return;
    }

    if (
      this.reconnectAttempts >=
      this.options.maxReconnectAttempts
    ) {
      console.error(
        "[Socket] Max reconnect attempts reached"
      );
      this.setStatus("disconnected");
      return;
    }

    this.setStatus("reconnecting");
    this.reconnectAttempts++;

    console.log(
      `[Socket] Reconnecting... (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`
    );

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.options.reconnectInterval);
  }

  private startHeartbeat() {
    if (!this.options.heartbeat) return;

    this.heartbeatTimer = setInterval(() => {
      this.send(this.options.heartbeatMessage);
    }, this.options.heartbeatInterval);
  }

  private cleanup() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

// ==================== 多实例管理器 ====================

class SocketManager {
  private instances = new Map<string, SocketClient>();

  /**
   * 获取或创建 Socket 实例
   * @param key 实例标识（用于区分多个连接）
   * @param options 配置（首次创建时需要）
   */
  get(key: string, options?: SocketOptions): SocketClient {
    if (!this.instances.has(key)) {
      if (!options) {
        throw new Error(
          `[SocketManager] Instance "${key}" not found. Provide options to create.`
        );
      }
      this.instances.set(key, new SocketClient(options));
    }
    return this.instances.get(key)!;
  }

  /**
   * 检查实例是否存在
   */
  has(key: string): boolean {
    return this.instances.has(key);
  }

  /**
   * 移除并断开实例
   */
  remove(key: string) {
    const instance = this.instances.get(key);
    if (instance) {
      instance.disconnect();
      this.instances.delete(key);
    }
  }

  /**
   * 断开所有连接
   */
  disconnectAll() {
    this.instances.forEach((instance) =>
      instance.disconnect()
    );
    this.instances.clear();
  }
}

export const socketManager = new SocketManager();
