import type { MessageSchemaType, UserSchemaType } from "chat-shared";
import { create } from "zustand";

interface WebSocketStore {
  messages: MessageSchemaType[];
  users: UserSchemaType[];
  name: string;
}

export const useWebSocketStore = create<WebSocketStore>(() => ({
  messages: [],
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

export const setName = (name: string) => {
  useWebSocketStore.setState({
    name,
  });
};

export const deleteUser = (id: string) => {
  useWebSocketStore.setState((s) => ({
    users: s.users.filter((user) => user.id !== id),
  }));
};

export const useMessages = () => useWebSocketStore((s) => s.messages);
export const useUsers = () => useWebSocketStore((s) => s.users);
export const useName = () => useWebSocketStore((s) => s.name);

export const getName = () => useWebSocketStore.getState().name;
