import {
  ChatEventSchema,
  type ChatEventSchemaType,
  type UserSchemaType,
} from "chat-shared";
import type { SafeParseReturnType } from "zod";
import { router } from "../main";

export type AddMessageFn = (msg: ChatEventSchemaType) => void;
export type AddUserFn = (usr: UserSchemaType[]) => void;
export type RemoveUserFn = (id: string) => void;

export class ChatWebSocket {
  url: string;
  ws: WebSocket | null;
  addMessage: AddMessageFn;
  addUser: AddUserFn;
  removeUser: RemoveUserFn;

  constructor(
    url: string,
    addMessage: AddMessageFn,
    addUser: AddUserFn,
    removeUser: RemoveUserFn
  ) {
    this.url = url;
    this.ws = null;
    this.sendMessage = this.sendMessage.bind(this);
    this.addMessage = addMessage;
    this.addUser = addUser;
    this.removeUser = removeUser;
  }

  init(name: string) {
    this.ws = new WebSocket(`${this.url}?name=${encodeURIComponent(name)}`);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onopen = () => router.navigate({ to: "/users" });
  }
  handleMessage(event: MessageEvent) {
    let data: unknown;
    try {
      data =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    } catch (err) {
      console.error("Failed to parse message:", err);
      return;
    }

    const result = ChatEventSchema.safeParse(data);

    if (!result.success) {
      console.error("Validation error:", result.error);
      return;
    }

    switch (result.data.type) {
      case "message": {
        this.addMessage(result.data);
        break;
      }
      case "join": {
        this.addUser(result.data.users);
        break;
      }

      case "delete": {
        this.removeUser(result.data.id);
        break;
      }

      default:
        break;
    }
  }

  sendMessage(
    schemaPayload: SafeParseReturnType<ChatEventSchemaType, unknown>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (schemaPayload.success) {
        try {
          if (this.ws) {
            this.ws.send(JSON.stringify(schemaPayload.data));
            resolve();
          } else {
            reject(new Error("WebSocket is not initialized."));
          }
        } catch (err) {
          reject(err);
        }
      } else if (schemaPayload.error) {
        console.error("Validation error", schemaPayload.error);
        reject(schemaPayload.error);
      }
    });
  }
}
