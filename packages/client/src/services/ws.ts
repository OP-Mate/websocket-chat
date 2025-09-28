import { ChatWebSocket } from "./websocket";
import { addMessage, addUser, deleteUser } from "../store";

const protocol = window.location.protocol === "https:" ? "wss" : "ws";
export const ws = new ChatWebSocket(
  `${protocol}://${window.location.hostname}/ws/`,
  addMessage,
  addUser,
  deleteUser
);
