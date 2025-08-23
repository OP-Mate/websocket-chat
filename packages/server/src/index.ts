import { WebSocketServer, WebSocket, RawData } from "ws";
import crypto from "node:crypto";
import { ChatEventSchema, UserSchema } from "chat-shared";
import { IncomingMessage } from "node:http";
import "./db";
import { addMessageDB, addUserToDB, getAllUsersDB } from "./db";

const PORT = 8080;
const server = new WebSocketServer({ port: PORT });

function createArrayBuffer(msg: string) {
  return Buffer.from(msg, "utf-8");
}

function broadcastMsg(rawData: RawData, isBinary: boolean) {
  for (const user of server.clients) {
    if (user.readyState === WebSocket.OPEN) {
      user.send(rawData, { binary: isBinary });
    }
  }
}

function createUser(req: IncomingMessage) {
  const id = crypto.randomUUID();

  const host = req.headers.host || "localhost";
  const url = new URL(req.url ?? "", `http://${host}`);
  const username = url.searchParams.get("username");
  return {
    id,
    username,
  };
}

server.on("connection", (socket, req) => {
  const { id, username } = createUser(req);

  const result = UserSchema.safeParse({ id, username });

  if (result.error) {
    socket.close(1337, "TODO: Some error about `name` being invalid");
  } else {
    const response = addUserToDB(result.data.id, result.data.username);

    if (!response.success) {
      socket.close(4000, response.error);
      return;
    }

    const currentUsers = getAllUsersDB();
    socket.send(
      JSON.stringify({ type: "all_users", users: currentUsers, userId: id }),
      {
        binary: false,
      }
    );
    // Send to all other users that this new user has connected
    const newUserMsg = JSON.stringify({
      type: "new_user",
      user: result.data,
    });

    server.clients.forEach(function each(client) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(createArrayBuffer(newUserMsg), { binary: false });
      }
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
      case "message_input": {
        const response = addMessageDB(id, result.data.message);
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

    for (const user of server.clients) {
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
