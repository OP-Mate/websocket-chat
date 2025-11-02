import type {
  AllUserSchemaType,
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
  selectedUser: string;
  pendingMessagesId: string[];
  selectedRoomId: number;
}

export const useWebSocketStore = create<WebSocketStore>(() => ({
  messages: [],
  userId: "",
  users: [],
  name: "",
  rooms: [],
  selectedUser: "",
  pendingMessagesId: [],
  selectedRoomId: 0,
}));

export const addMessage = (message: MessageSchemaType[]) => {
  useWebSocketStore.setState((s) => {
    return { messages: [...s.messages, ...message] };
  });
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

export const addPendingMessage = (userId: string) => {
  useWebSocketStore.setState((s) => ({
    pendingMessagesId: [...s.pendingMessagesId, userId],
  }));
};

export const removePendingMessage = (userId: string) => {
  useWebSocketStore.setState((s) => ({
    pendingMessagesId: s.pendingMessagesId.filter((id) => id !== userId),
  }));
};

export const addOrUpdateUser = (user: UserSchemaType) => {
  useWebSocketStore.setState((s) => {
    const userExists = s.users.find((u) => u.id === user.id);

    return {
      users: userExists
        ? s.users.map((u) => (u.id === user.id ? { ...u, ...user } : u))
        : [...s.users, user],
    };
  });
};

export const setUser = (user: AllUserSchemaType) => {
  useWebSocketStore.setState({
    userId: user.userId,
    name: user.username,
  });
};

export const offlineUser = (id: string) => {
  useWebSocketStore.setState((s) => ({
    users: s.users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          is_online: 0,
        };
      }
      return user;
    }),
  }));
};

export const setSelectedRoomId = (id: number) => {
  useWebSocketStore.setState({ selectedRoomId: id });
};

export const useSelectedRoomId = () =>
  useWebSocketStore((s) => s.selectedRoomId);

export const getSelectedRoomId = (): number =>
  useWebSocketStore.getState().selectedRoomId;

export const useMessages = () => useWebSocketStore((s) => s.messages);
export const useUsers = () => useWebSocketStore((s) => s.users);
export const useUserId = () => useWebSocketStore((s) => s.userId);
export const useUsername = () => useWebSocketStore((s) => s.name);
export const usePendingMessages = () =>
  useWebSocketStore((s) => s.pendingMessagesId);
