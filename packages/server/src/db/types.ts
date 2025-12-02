import { DBCodeError } from "chat-shared";
import { UUIDType } from "src/types";

export type DatabaseResult<T> =
  | { success: true; data: T }
  | { success: false; code: DBCodeError };

export interface SqliteError extends Error {
  code?: string;
  error?: number;
}

export interface IAddMessageDB {
  id: number;
  message: string;
  sender_id: string;
  created_at: number;
  chat_room_id: number;
}

export interface User {
  password_hash: string;
  username: string;
  id: UUIDType;
}
