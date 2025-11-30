import {
  ChatEventSchema,
  type ChatEventSchemaType,
  type MessageSchemaType,
  type UserSchemaType,
} from "chat-shared";
import type { SafeParseReturnType } from "zod";
import {
  addOrUpdateUser,
  setUser,
  addPendingMessage,
  getSelectedRoomId,
} from "../store";

export type AddMessageFn = (msg: MessageSchemaType[]) => void;
export type AddUserFn = (usr: UserSchemaType[]) => void;
export type offlineUserFn = (id: string) => void;

export class ChatWebSocket {
  url: string;
  ws: WebSocket | null;
  addMessage: AddMessageFn;
  addUser: AddUserFn;
  offlineUser: offlineUserFn;

  constructor(
    url: string,
    addMessage: AddMessageFn,
    addUser: AddUserFn,
    offlineUser: offlineUserFn
  ) {
    this.url = url;
    this.ws = null;
    this.sendMessage = this.sendMessage.bind(this);
    this.addMessage = addMessage;
    this.addUser = addUser;
    this.offlineUser = offlineUser;
  }

  init() {
    if (this.ws) return;

    this.ws = new WebSocket(`${this.url}`);
    this.ws.onmessage = this.handleMessage.bind(this);
    return new Promise<void>((resolve, reject) => {
      if (!this.ws) {
        reject(new Error("WebSocket not initialized"));
        return;
      }
      this.ws.onopen = () => {
        resolve();
      };
      this.ws.onclose = (e) => {
        reject(new Error(e.reason));
      };
    });
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
        const { senderId, roomId } = result.data;

        const selectedRoomId = getSelectedRoomId();

        if (roomId === selectedRoomId) {
          this.addMessage([result.data]);
        } else {
          addPendingMessage(senderId);
        }
        break;
      }
      case "online_user":
      case "offline_user": {
        addOrUpdateUser(result.data.user);
        break;
      }

      case "all_users": {
        this.addUser(result.data.users);
        setUser(result.data);

        break;
      }

      case "join_failed": {
        console.log("joined failed", result.data.error);
        return;
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
