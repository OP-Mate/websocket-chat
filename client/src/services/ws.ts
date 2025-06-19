import { ChatWebSocket } from "./websocket";
import { addMessage, addUser, deleteUser } from "../store";

export const ws = new ChatWebSocket(
  `ws://${window.location.hostname}:8080/ws`,
  addMessage,
  addUser,
  deleteUser
);
