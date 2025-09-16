import type {
  MessageSchemaType,
  RoomSchemaType,
  UserSchemaType,
} from "chat-shared";
import { create } from "zustand";

interface WebSocketStore {
  messages: MessageSchemaType[];
  users: UserSchemaType[];
  name: string;
  userId: string;
  rooms: RoomSchemaType[];
}

export const useWebSocketStore = create<WebSocketStore>(() => ({
  messages: [],
  userId: "",
  users: [],
  name: "",
  rooms: [],
}));

export const addMessage = (message: MessageSchemaType[]) => {
  useWebSocketStore.setState((s) => ({
    messages: [...s.messages, ...message],
  }));
};

export const addRooms = (rooms: []) => {
  useWebSocketStore.setState((s) => ({
    rooms: [...s.rooms, ...rooms],
  }));
};

export const resetMessages = () => {
  useWebSocketStore.setState(() => ({
    messages: [],
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
