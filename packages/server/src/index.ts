import { WebSocketServer, WebSocket, RawData } from "ws";
import { type UserSchemaType, ChatEventSchema } from "chat-shared";

interface IUser extends UserSchemaType {
  socket: WebSocket;
}

const PORT = 8080;
const server = new WebSocketServer({ port: PORT });

const users = new Set<IUser>();

function createArrayBuffer(msg: string) {
  return Buffer.from(msg, "utf-8");
}

function broadcastMsg(rawData: RawData, isBinary: boolean) {
  for (const user of users) {
    if (user.socket.readyState === WebSocket.OPEN) {
      user.socket.send(rawData, { binary: isBinary });
    }
  }
}

server.on("connection", (socket) => {
  // TODO: Refactor user it generation
  let id = "";

  if (users.size >= 1) {
    const currentUsers = Array.from(users).map((user) => ({
      id: user.id,
      name: user.name,
    }));
    socket.send(JSON.stringify({ type: "join", users: currentUsers }), {
      binary: false,
    });
  }

  socket.on("message", (rawData, isBinary) => {
    const msg = JSON.parse(rawData.toString("utf-8"));
    const result = ChatEventSchema.safeParse(msg);

    if (result.error) {
      console.log(result.error);
      return;
    }

    switch (result.data.type) {
      case "join": {
        id = result.data.users[0]?.id || "";

        users.add({
          id,
          name: result.data.users[0]?.name || "",
          socket,
        });
        const joinMsg = JSON.stringify(result.data);
        broadcastMsg(createArrayBuffer(joinMsg), false);

        break;
      }

      case "message": {
        broadcastMsg(rawData, isBinary);
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
