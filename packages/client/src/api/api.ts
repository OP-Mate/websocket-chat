import { apiClient } from "./apiClient";
import { type AuthResponse, type AuthSchemaType } from "chat-shared";
import type { IMessagesResponse } from "./types";

export class Api {
  public async login(body: AuthSchemaType) {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", body);

      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  public async register(body: AuthSchemaType) {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/auth/register",
        body
      );
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  public async getMessages(roomId: string) {
    try {
      const response = await apiClient.get<IMessagesResponse>(
        `/messages/${roomId}`
      );
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  public async me() {
    try {
      const response = await apiClient.get<{
        user: { id: string; username: string };
      }>("/auth/me");

      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}

export const api = new Api();
