import express from "express";
import { WebSocketServer, WebSocket, RawData } from "ws";
import { ChatEventSchema, RoomSchemaType } from "chat-shared";
import { createServer, IncomingMessage } from "node:http";
import "./db";
import {
  addMessageDB,
  addRoom,
  addUserToDB,
  getAllPublicRooms,
  getAllUsersDB,
  getMessagesByRoomIdDB,
} from "./db";

const app = express();

const server = createServer(app);

const PORT = 8080;
const wss = new WebSocketServer({ server });

app.use(express.json());

function createArrayBuffer(msg: string) {
  return Buffer.from(msg, "utf-8");
}

function broadcastMsg(rawData: RawData, isBinary: boolean) {
  for (const user of wss.clients) {
    if (user.readyState === WebSocket.OPEN) {
      user.send(rawData, { binary: isBinary });
    }
  }
}

function createUser(req: IncomingMessage) {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url ?? "", `http://${host}`);
  const username = url.searchParams.get("username");
  return {
    username: username || "",
  };
}

// Websocket

wss.on("connection", (socket, req) => {
  const { username } = createUser(req);

  const response = addUserToDB(username);

  const id = response.id;

  const currentUsers = getAllUsersDB();
  socket.send(
    JSON.stringify({
      type: "all_users",
      users: currentUsers,
      userId: response.id,
    }),
    {
      binary: false,
    }
  );
  // Send to all other users that this new user has connected
  const newUserMsg = JSON.stringify({
    type: "new_user",
    user: { id: response.id, username: response.username },
  });

  wss.clients.forEach(function each(client) {
    if (client !== socket && client.readyState === WebSocket.OPEN) {
      client.send(createArrayBuffer(newUserMsg), { binary: false });
    }
  });

  socket.on("message", (rawData, isBinary) => {
    const msg = JSON.parse(rawData.toString("utf-8"));
    const result = ChatEventSchema.safeParse(msg);

    if (result.error) {
      console.log(result.error);
      return;
    }

    switch (result.data.type) {
      case "message_input": {
        const response = addMessageDB(
          id,
          result.data.message,
          result.data.roomId
        );
        broadcastMsg(
          createArrayBuffer(JSON.stringify({ type: "message", ...response })),
          isBinary
        );
      }
    }
  });

  socket.on("close", () => {
    const msg = JSON.stringify({
      type: "delete",
      id,
    });

    for (const user of wss.clients) {
      if (user === socket) {
        // TODO: Set user to offline
        console.log("set user to offline");
      } else {
        broadcastMsg(createArrayBuffer(msg), false);
      }
    }
    console.log("Client disconnected");
  });
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});

// REST

app.get("/api/messages", (req, res) => {
  const roomId = req.query.roomId as string;

  const response = getMessagesByRoomIdDB(roomId);

  if (!response) {
    return res.status(404).json({ error: "Room not found" });
  }
  res.status(200).json({ messages: response });
});

// Store connected SSE clients
const sseClients: express.Response[] = [];

app.get("/api/rooms", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  sseClients.push(res);

  const allPublicRooms = getAllPublicRooms();
  res.write(`data: ${JSON.stringify(Array.from(allPublicRooms))}\n\n`);

  req.on("close", () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
    res.end();
  });
});

// Helper to broadcast room updates to all SSE clients
function broadcastRoomsUpdate() {
  const allPublicRooms = getAllPublicRooms();
  const data = `data: ${JSON.stringify(Array.from(allPublicRooms))}\n\n`;
  sseClients.forEach((client) => client.write(data));
}

app.post("/api/rooms", (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Room name is required" });
  }

  const newRoom = addRoom(name);

  res.status(201).json({ room: newRoom });

  // Notify all SSE clients about the new room
  broadcastRoomsUpdate();
});

app.post("/api/rooms", (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Room name is required" });
  }

  const newRoom = addRoom(name);

  res.status(201).json({ room: newRoom });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
