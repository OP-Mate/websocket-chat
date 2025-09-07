import { RawData, WebSocket } from "ws";
import { IncomingMessage } from "node:http";
import { wss } from "../index";
import { ChatEventSchema } from "chat-shared";
import { addMessageDB, addUserToDB, getAllUsersDB } from "../db/queries";

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

export const handleCreate = (socket: WebSocket, req: IncomingMessage) => {
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

  return id;
};

export const handleMessage = (
  rawData: RawData,
  isBinary: boolean,
  id: string
) => {
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
};

export const handleClose = (socket: WebSocket, id: string) => {
  const msg = JSON.stringify({
    type: "delete",
    id,
  });

  for (const user of wss.clients) {
    if (user === socket) {
      // TODO: Set user to offline
      console.log("set user to offline");
    }
  }
  broadcastMsg(createArrayBuffer(msg), false);
  console.log(`Client disconnected: ${id}`);
};
