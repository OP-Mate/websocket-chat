import { WebSocket } from "ws";
import { PORT } from "../index";
import { handleMessage, handleClose, handleInitialMsg } from "./handlers";
import { JwtPayload } from "src/utils/jwt";
import { onlineStore } from "./onlineCheck";

export interface AuthWebSocket extends WebSocket {
  id: string;
  user: JwtPayload;
  roomId?: number;
  lastPing?: number;
  connectionTime?: number;
  isActive?: boolean;
}

export const handleWebsocketConnection = (socket: AuthWebSocket) => {
  const senderId = socket.user.id;

  handleInitialMsg(socket);

  socket.on("message", (rawData, isBinary) =>
    handleMessage(rawData, isBinary, senderId)
  );

  socket.on("pong", () => {
    onlineStore.add(senderId);
  });

  socket.on("close", () => handleClose(socket));
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
};
