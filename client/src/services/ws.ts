import { ChatWebSocket } from "./websocket";
import { addMessage, addUser, deleteUser } from "../store";

export const ws = new ChatWebSocket(
  "ws://localhost:8080/",
  addMessage,
  addUser,
  deleteUser
);
