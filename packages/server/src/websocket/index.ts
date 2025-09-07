import { WebSocket } from "ws";
import { IncomingMessage } from "node:http";
import { PORT } from "../index";
import { handleCreate, handleMessage, handleClose } from "./handlers";

export const handleWebsocketConnection = (
  socket: WebSocket,
  req: IncomingMessage
) => {
  const id = handleCreate(socket, req);

  socket.on("message", (rawData, isBinary) =>
    handleMessage(rawData, isBinary, id)
  );

  socket.on("close", () => handleClose(socket, id));
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
};
