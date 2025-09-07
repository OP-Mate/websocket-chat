import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "node:http";
import { messageRoutes } from "./routes/messageRoutes";
import { roomRoutes } from "./routes/roomRoutes";
import { handleWebsocketConnection } from "./websocket";

const app = express();

const server = createServer(app);

export const PORT = 8080;
export const wss = new WebSocketServer({ server });

wss.on("connection", handleWebsocketConnection);

app.use(express.json());

app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
