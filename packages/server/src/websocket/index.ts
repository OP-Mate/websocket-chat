import { WebSocket } from "ws";
import { PORT } from "../index";
import { handleMessage, handleClose, handleInitialMsg } from "./handlers";
import { JwtPayload } from "src/utils/jwt";

export type AuthWebSocket = WebSocket & { user: JwtPayload };

export const handleWebsocketConnection = (socket: AuthWebSocket) => {
  const id = socket.user.id;

  handleInitialMsg(socket);

  socket.on("message", (rawData, isBinary) =>
    handleMessage(rawData, isBinary, id)
  );

  socket.on("close", () => handleClose(socket));
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
};
