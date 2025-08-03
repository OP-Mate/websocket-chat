import { WebSocketServer, WebSocket, RawData } from "ws";
import crypto from "node:crypto";
import { type UserSchemaType, ChatEventSchema, UserSchema } from "chat-shared";
import { IncomingMessage } from "node:http";

interface IUser extends UserSchemaType {
  socket: WebSocket;
}

const PORT = 8080;
const server = new WebSocketServer({ port: PORT });

const users = new Set<IUser>();

function createArrayBuffer(msg: string) {
  return Buffer.from(msg, "utf-8");
}

function broadcastMsg(
  rawData: RawData,
  isBinary: boolean,
  omitIds: string[] = []
) {
  for (const user of users) {
    if (
      user.socket.readyState === WebSocket.OPEN &&
      !omitIds.includes(user.id)
    ) {
      user.socket.send(rawData, { binary: isBinary });
    }
  }
}

function createUser(req: IncomingMessage) {
  const id = crypto.randomUUID();

  const host = req.headers.host || "localhost";
  const url = new URL(req.url ?? "", `http://${host}`);
  const name = url.searchParams.get("name");
  return {
    id,
    name,
  };
}

server.on("connection", (socket, req) => {
  const { id, name } = createUser(req);

  const result = UserSchema.safeParse({ id, name });

  if (result.error) {
    socket.close(1337, "TODO: Some error about `name` being invalid");
  } else {
    // add user
    users.add({
      ...result.data,
      socket,
    });

    // Get list of all connected users
    const currentUsers = Array.from(users).map((user) => ({
      id: user.id,
      name: user.name,
    }));

    // Send back to the user
    socket.send(JSON.stringify({ type: "join", users: currentUsers }), {
      binary: false,
    });

    // Send to all other users that this new user has connected
    const joinMsg = JSON.stringify({
      type: "join",
      users: [result.data],
    });
    broadcastMsg(createArrayBuffer(joinMsg), false, [id]);
  }

  socket.on("message", (rawData, isBinary) => {
    const msg = JSON.parse(rawData.toString("utf-8"));
    const result = ChatEventSchema.safeParse(msg);

    if (result.error) {
      console.log(result.error);
      return;
    }

    broadcastMsg(rawData, isBinary);
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
