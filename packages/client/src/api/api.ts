import { apiClient } from "./apiClient";
import {
  type ApiCodeError,
  type AuthResponse,
  type AuthSchemaType,
} from "chat-shared";
import type { IMessagesResponse } from "./types";

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; code: ApiCodeError };

export class Api {
  public async login(body: AuthSchemaType) {
    return await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", body);
  }

  public async register(body: AuthSchemaType) {
    return await apiClient.post<AuthResponse>("/auth/register", body);
  }

  public async getMessages(roomId: number) {
    return await apiClient.get<ApiResponse<IMessagesResponse>>(
      `/messages/${roomId}`
    );
  }

  public async me() {
    return await apiClient.get<{
      user: { id: string; username: string };
    }>("/auth/me");
  }

  public async joinPrivateRoom(id: string) {
    return await apiClient.get<IMessagesResponse>(`/private/${id}`);
  }
  public async AddRoom(roomName: string) {
    return await apiClient.post(`/rooms`, { name: roomName });
  }
}

export const api = new Api();
