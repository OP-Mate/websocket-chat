import { ChatWebSocket } from "./websocket";
import { addMessage, addUser, deleteUser } from "../store";

const PORT = import.meta.env.DEV ? 8080 : window.location.port;

const protocol = window.location.protocol === "https:" ? "wss" : "ws";
export const ws = new ChatWebSocket(
  `${protocol}://${window.location.hostname}:${PORT}/ws/`,
  addMessage,
  addUser,
  deleteUser
);
