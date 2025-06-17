import { WebSocketServer, WebSocket } from "ws";
import crypto from "node:crypto";
import { UserSchema, UserSchemaType, BroadcastMsgSchema } from "chat-shared";

console.log("HELLO");

interface IUser extends UserSchemaType {
  socket: WebSocket;
}

const PORT = 8080;
const server = new WebSocketServer({ port: PORT, host: "0.0.0.0" });

const users = new Set<IUser>();

function createArrayBuffer(msg: string) {
  return Buffer.from(msg, "utf-8");
}

function broadcastMsg(rawData: WebSocket.RawData, isBinary: boolean) {
  for (const user of users) {
    if (user.socket.readyState === WebSocket.OPEN) {
      user.socket.send(rawData, { binary: isBinary });
    }
  }
}

server.on("connection", (socket) => {
  if (users.size >= 1) {
    const currentUsers = Array.from(users).map((user) => ({
      id: user.id,
      name: user.name,
    }));
    socket.send(JSON.stringify({ type: "join", users: currentUsers }), {
      binary: false,
    });
  }
  const id = crypto.randomUUID();

  socket.on("message", (rawData, isBinary) => {
    const msg = JSON.parse(rawData.toString("utf-8"));

    switch (msg.type) {
      case "join": {
        const user = { id, name: msg.name };

        const result = UserSchema.safeParse(user);

        if (result.success) {
          users.add({ ...user, socket: socket });
          const joinMsg = JSON.stringify({
            type: "join",
            users: [user],
          });
          broadcastMsg(createArrayBuffer(joinMsg), false);
        }
        break;
      }

      case "message": {
        const result = BroadcastMsgSchema.safeParse(msg);
        if (result.success) {
          broadcastMsg(rawData, isBinary);
        }
        break;
      }

      default:
        break;
    }
  });

  socket.on("close", () => {
    const msg = JSON.stringify({
      type: "delete",
      id,
    });

    // Remove the user from the set by matching the socket
    for (const user of users) {
      if (user.socket === socket) {
        users.delete(user);
      } else {
        broadcastMsg(createArrayBuffer(msg), false);
      }
    }
    console.log("Client disconnected");
  });
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});
