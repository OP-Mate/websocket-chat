import {
  BroadcastDeleteUserSchema,
  BroadcastJoinSchema,
  BroadcastMsgSchema,
  BroadcastSchema,
  type BroadcastMsgSchemaType,
  type UserSchemaType,
} from "chat-shared";
import type { SafeParseReturnType } from "zod";

export type AddMessageFn = (msg: BroadcastMsgSchemaType) => void;
export type AddUserFn = (usr: UserSchemaType[]) => void;
export type RemoveUserFn = (id: string) => void;

export class ChatWebSocket {
  ws: WebSocket;
  addMessage: AddMessageFn;
  addUser: AddUserFn;
  removeUser: RemoveUserFn;

  constructor(
    url: string,
    addMessage: AddMessageFn,
    addUser: AddUserFn,
    removeUser: RemoveUserFn
  ) {
    this.ws = new WebSocket(url);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.addMessage = addMessage;
    this.addUser = addUser;
    this.removeUser = removeUser;
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

    const result = BroadcastSchema.safeParse(data);

    if (!result.success) {
      console.error("Validation error:", result.error);
      return;
    }

    switch (result.data.type) {
      case "message": {
        const msgResult = BroadcastMsgSchema.safeParse(data);
        if (msgResult.success) {
          this.addMessage(msgResult.data);
        } else {
          console.error(msgResult.error);
        }
        break;
      }
      case "join": {
        const joinResult = BroadcastJoinSchema.safeParse(data);
        if (joinResult.success) {
          this.addUser(joinResult.data.users);
        } else {
          console.error(joinResult.error);
        }
        break;
      }

      case "delete": {
        const result = BroadcastDeleteUserSchema.safeParse(data);

        if (result.success) {
          this.removeUser(result.data.id);
        } else if (result.error) {
          console.error(result.error);
        }
        break;
      }

      default:
        break;
    }
  }

  sendMessage<T>(
    schemaPayload: SafeParseReturnType<T, unknown>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (schemaPayload.success) {
        try {
          this.ws.send(JSON.stringify(schemaPayload.data));
          resolve();
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
