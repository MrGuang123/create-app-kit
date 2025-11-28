import { createStore } from "@/utils/createStore";

type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";

interface SocketMessage {
  id: string;
  type: string;
  data: any;
  timestamp: number;
}

type SocketState = {
  status: ConnectionStatus;
  messages: SocketMessage[];
  lastMessage: SocketMessage | null;
};

type SocketActions = {
  setStatus: (status: ConnectionStatus) => void;
  addMessage: (
    message: Omit<SocketMessage, "id" | "timestamp">
  ) => void;
  clearMessages: () => void;
};

export const useSocketStore = createStore<
  SocketState,
  SocketActions
>(
  (set) => ({
    status: "disconnected",
    messages: [],
    lastMessage: null,

    setStatus: (status) =>
      set(
        (state) => {
          state.status = status;
        },
        false,
        `socket/setStatus/${status}`
      ),

    addMessage: (message) =>
      set(
        (state) => {
          const newMessage: SocketMessage = {
            ...message,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          };
          state.messages.push(newMessage);
          state.lastMessage = newMessage;
          // 只保留最近 100 条
          if (state.messages.length > 100) {
            state.messages = state.messages.slice(-100);
          }
        },
        false,
        `socket/addMessage/${message.type}`
      ),

    clearMessages: () =>
      set(
        (state) => {
          state.messages = [];
          state.lastMessage = null;
        },
        false,
        "socket/clearMessages"
      ),
  }),
  {
    name: "socket-store",
    persistOptions: {
      partialize: () => ({}), // 不持久化
    },
  }
);
