import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "node:http";
import { messageRoutes } from "./routes/messageRoutes";
import { roomRoutes } from "./routes/roomRoutes";
import { AuthWebSocket, handleWebsocketConnection } from "./websocket";
import { authRoutes } from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { authFromRequest } from "./websocket/auth";
import { privateRoutes } from "./routes/privateRoutes";

const app = express();

const server = createServer(app);

export const PORT = 8080;
export const wss = new WebSocketServer({
  noServer: true,
}) as WebSocketServer & {
  clients: Set<AuthWebSocket>;
};

wss.on("connection", handleWebsocketConnection);

server.on("upgrade", async (req, socket, head) => {
  const user = await authFromRequest(req);
  if (!user) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    (ws as AuthWebSocket).user = user;
    wss.emit("connection", ws, req);
  });
});

app.use(cookieParser());
app.use(express.json());

app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/private", privateRoutes);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
