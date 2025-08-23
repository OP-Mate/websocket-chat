import type { MessageSchemaType, UserSchemaType } from "chat-shared";
import { create } from "zustand";

interface WebSocketStore {
  messages: MessageSchemaType[];
  users: UserSchemaType[];
  name: string;
  userId: string;
}

export const useWebSocketStore = create<WebSocketStore>(() => ({
  messages: [],
  userId: "",
  users: [],
  name: "",
}));

export const addMessage = (message: MessageSchemaType) => {
  useWebSocketStore.setState((s) => ({
    messages: [...s.messages, message],
  }));
};

export const addUser = (user: UserSchemaType[]) => {
  useWebSocketStore.setState((s) => ({
    users: [...s.users, ...user],
  }));
};

export const setUserId = (userId: string) => {
  useWebSocketStore.setState({
    userId,
  });
};

export const deleteUser = (id: string) => {
  useWebSocketStore.setState((s) => ({
    users: s.users.filter((user) => user.id !== id),
  }));
};

export const useMessages = () => useWebSocketStore((s) => s.messages);
export const useUsers = () => useWebSocketStore((s) => s.users);
export const useUserId = () => useWebSocketStore((s) => s.userId);
