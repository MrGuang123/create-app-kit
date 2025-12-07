import { useState, useCallback } from "react";
import { useSocket } from "@/hooks/useSocket";
import { socketManager } from "@/utils/socket";

// ==================== 日志组件 ====================
function LogPanel({
  title,
  logs,
  onClear,
}: {
  title: string;
  logs: string[];
  onClear: () => void;
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-3 py-2 bg-muted">
        <span className="text-sm font-medium text-foreground">
          {title}
        </span>
        <button
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={onClear}
        >
          清空
        </button>
      </div>
      <div className="h-40 overflow-y-auto p-2 bg-card text-primary font-mono text-xs">
        {logs.length === 0 ? (
          <span className="text-muted-foreground">
            暂无日志...
          </span>
        ) : (
          logs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </div>
    </div>
  );
}

// ==================== 单个 Socket 连接面板 ====================
function SocketPanel({
  id,
  onRemove,
}: {
  id: string;
  onRemove?: () => void;
}) {
  const [url, setUrl] = useState(
    __APP_ENV__.wsUrl || "wss://ws.postman-echo.com/raw"
  );
  const [message, setMessage] = useState(
    '{"type":"chat","msg":"hello"}'
  );
  const [logs, setLogs] = useState<string[]>([]);

  // 频道相关
  const [channelName, setChannelName] = useState("room-1");
  const [joinedChannels, setJoinedChannels] = useState<
    string[]
  >([]);
  const [channelMessage, setChannelMessage] = useState("");

  // 订阅相关
  const [subscribeType, setSubscribeType] =
    useState("chat");
  const [subscribedTypes, setSubscribedTypes] = useState<
    string[]
  >([]);

  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) =>
      [`[${time}] ${msg}`, ...prev].slice(0, 100)
    );
  }, []);

  const {
    status,
    isConnected,
    send,
    sendToChannel,
    subscribe,
    subscribeChannel,
    connect,
    disconnect,
  } = useSocket({
    key: id,
    url,
    autoConnect: false,
    onMessage: (data) => {
      addLog(`📩 收到: ${JSON.stringify(data)}`);
    },
    onStatusChange: (s) => {
      addLog(`🔄 状态: ${s}`);
    },
  });

  // 加入频道
  const handleJoinChannel = () => {
    if (
      !channelName ||
      joinedChannels.includes(channelName)
    )
      return;

    // 订阅频道消息
    subscribeChannel(channelName, (data) => {
      addLog(`📢 [${channelName}] ${JSON.stringify(data)}`);
    });

    setJoinedChannels((prev) => [...prev, channelName]);
    send({ type: "subscribe", channel: channelName });
    addLog(`✅ 加入频道: ${channelName}`);
  };

  // 离开频道
  const handleLeaveChannel = (ch: string) => {
    send({ type: "unsubscribe", channel: ch });
    setJoinedChannels((prev) =>
      prev.filter((c) => c !== ch)
    );
    addLog(`👋 离开频道: ${ch}`);
  };

  // 发送频道消息
  const handleSendToChannel = (ch: string) => {
    if (!channelMessage) return;
    sendToChannel(ch, "message", { text: channelMessage });
    addLog(`📤 [${ch}] 发送: ${channelMessage}`);
    setChannelMessage("");
  };

  // 订阅消息类型
  const handleSubscribeType = () => {
    if (
      !subscribeType ||
      subscribedTypes.includes(subscribeType)
    )
      return;

    subscribe(subscribeType, (data) => {
      addLog(
        `🏷️ [type:${subscribeType}] ${JSON.stringify(data)}`
      );
    });

    setSubscribedTypes((prev) => [...prev, subscribeType]);
    addLog(`👂 订阅类型: ${subscribeType}`);
  };

  return (
    <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
      {/* 头部 */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-foreground">
          连接 #{id}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded ${
              isConnected
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {status}
          </span>
          {onRemove && (
            <button
              className="text-destructive hover:text-destructive/80 text-sm"
              onClick={() => {
                disconnect();
                socketManager.remove(id);
                onRemove();
              }}
            >
              删除
            </button>
          )}
        </div>
      </div>

      {/* URL 和连接控制 */}
      <div className="space-y-2">
        <input
          className="w-full p-2 border border-input rounded text-sm bg-background text-foreground"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="WebSocket URL"
          disabled={isConnected}
        />
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm disabled:opacity-50"
            onClick={connect}
            disabled={isConnected}
          >
            连接
          </button>
          <button
            className="px-3 py-1.5 bg-destructive text-destructive-foreground rounded text-sm disabled:opacity-50"
            onClick={disconnect}
            disabled={!isConnected}
          >
            断开
          </button>
        </div>
      </div>

      {/* 发送普通消息 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          发送消息
        </label>
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border border-input rounded text-sm bg-background text-foreground"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='{"type":"test"}'
          />
          <button
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm disabled:opacity-50"
            onClick={() => {
              try {
                const data = JSON.parse(message);
                send(data);
                addLog(`📤 发送: ${message}`);
              } catch {
                addLog(`❌ JSON 格式错误`);
              }
            }}
            disabled={!isConnected}
          >
            发送
          </button>
        </div>
      </div>

      {/* 频道管理 */}
      <div className="space-y-2 p-3 bg-muted rounded">
        <label className="text-sm font-medium text-foreground">
          📢 频道管理
        </label>
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border border-input rounded text-sm bg-background text-foreground"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="频道名称"
          />
          <button
            className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm disabled:opacity-50"
            onClick={handleJoinChannel}
            disabled={!isConnected}
          >
            加入
          </button>
        </div>

        {/* 已加入的频道 */}
        {joinedChannels.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              已加入的频道：
            </div>
            {joinedChannels.map((ch) => (
              <div
                key={ch}
                className="flex items-center gap-2 p-2 bg-card rounded"
              >
                <span className="flex-1 text-sm font-medium text-foreground">
                  {ch}
                </span>
                <input
                  className="flex-1 p-1 border border-input rounded text-xs bg-background text-foreground"
                  placeholder="消息内容"
                  value={channelMessage}
                  onChange={(e) =>
                    setChannelMessage(e.target.value)
                  }
                />
                <button
                  className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs"
                  onClick={() => handleSendToChannel(ch)}
                >
                  发送
                </button>
                <button
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                  onClick={() => handleLeaveChannel(ch)}
                >
                  离开
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 类型订阅 */}
      <div className="space-y-2 p-3 bg-muted rounded">
        <label className="text-sm font-medium text-foreground">
          🏷️ 按类型订阅
        </label>
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border border-input rounded text-sm bg-background text-foreground"
            value={subscribeType}
            onChange={(e) =>
              setSubscribeType(e.target.value)
            }
            placeholder="消息类型 (如: chat, notification)"
          />
          <button
            className="px-3 py-1.5 bg-accent text-accent-foreground rounded text-sm disabled:opacity-50"
            onClick={handleSubscribeType}
            disabled={!isConnected}
          >
            订阅
          </button>
        </div>
        {subscribedTypes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {subscribedTypes.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 日志 */}
      <LogPanel
        title="日志"
        logs={logs}
        onClear={() => setLogs([])}
      />
    </div>
  );
}

// ==================== 主测试页面 ====================
export default function SocketTestPage() {
  const [connections, setConnections] = useState<string[]>([
    "main",
  ]);

  const addConnection = () => {
    const id = `conn-${Date.now()}`;
    setConnections((prev) => [...prev, id]);
  };

  const removeConnection = (id: string) => {
    setConnections((prev) => prev.filter((c) => c !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            🔌 WebSocket 测试中心
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            测试所有 Socket 功能：多连接、频道、消息订阅
          </p>
        </div>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          onClick={addConnection}
        >
          + 新增连接
        </button>
      </div>

      {/* 功能说明 */}
      <div className="p-4 bg-primary/10 rounded-lg text-sm">
        <h3 className="font-medium mb-2 text-foreground">
          📋 测试功能列表
        </h3>
        <ul className="space-y-1 text-muted-foreground">
          <li>✅ 基本连接/断开</li>
          <li>✅ 发送 JSON 消息</li>
          <li>✅ 多个独立 Socket 连接</li>
          <li>✅ 频道加入/离开</li>
          <li>✅ 向指定频道发送消息</li>
          <li>✅ 按消息类型订阅</li>
          <li>✅ 自动重连（断开后自动尝试）</li>
          <li>✅ 心跳保活（30秒发送一次）</li>
        </ul>
      </div>

      {/* 测试用服务器说明 */}
      <div className="p-4 bg-accent rounded-lg text-sm">
        <h3 className="font-medium mb-2 text-foreground">
          🌐 测试服务器
        </h3>
        <ul className="space-y-1 text-muted-foreground">
          <li>
            <code className="bg-muted px-1 rounded text-foreground">
              wss://ws.postman-echo.com/raw
            </code>{" "}
            - Echo 服务器（回显消息）
          </li>
          <li>
            <code className="bg-muted px-1 rounded text-foreground">
              wss://echo.websocket.org
            </code>{" "}
            - 备用 Echo 服务器
          </li>
          <li>
            <code className="bg-muted px-1 rounded text-foreground">
              ws://localhost:8080
            </code>{" "}
            - 本地测试服务器
          </li>
        </ul>
      </div>

      {/* 连接面板列表 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {connections.map((id, index) => (
          <SocketPanel
            key={id}
            id={id}
            onRemove={
              index > 0
                ? () => removeConnection(id)
                : undefined
            }
          />
        ))}
      </div>

      {/* 快捷测试消息 */}
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2 text-foreground">
          📝 测试消息模板
        </h3>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 text-xs">
          <code className="p-2 bg-card text-primary rounded border border-border">
            {`{"type":"chat","msg":"hello"}`}
          </code>
          <code className="p-2 bg-card text-primary rounded border border-border">
            {`{"type":"subscribe","channel":"room-1"}`}
          </code>
          <code className="p-2 bg-card text-primary rounded border border-border">
            {`{"channel":"room-1","type":"message","data":"hi"}`}
          </code>
          <code className="p-2 bg-card text-primary rounded border border-border">
            {`{"type":"notification","title":"New"}`}
          </code>
          <code className="p-2 bg-card text-primary rounded border border-border">
            {`{"type":"ping"}`}
          </code>
          <code className="p-2 bg-card text-primary rounded border border-border">
            {`{"type":"unsubscribe","channel":"room-1"}`}
          </code>
        </div>
      </div>
    </div>
  );
}
