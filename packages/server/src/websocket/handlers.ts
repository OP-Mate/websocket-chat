import { RawData, WebSocket } from "ws";
import { wss } from "../index";
import { ChatEventSchema } from "chat-shared";
import { addMessageDB, getAllUsersDB } from "../db/queries";
import { AuthWebSocket } from ".";

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

export const handleInitialMsg = (socket: AuthWebSocket) => {
  const { id, username } = socket.user;

  const currentUsers = getAllUsersDB();
  socket.send(
    JSON.stringify({
      type: "all_users",
      users: currentUsers,
      userId: id,
    }),
    {
      binary: false,
    }
  );
  // Send to all other users that this new user has connected
  const newUserMsg = JSON.stringify({
    type: "new_user",
    user: { id: id, username: username },
  });

  // Send to all other users of new user
  wss.clients.forEach(function each(client) {
    if (client !== socket && client.readyState === WebSocket.OPEN) {
      client.send(createArrayBuffer(newUserMsg), { binary: false });
    }
  });
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

export const handleClose = (socket: AuthWebSocket) => {
  const { id } = socket.user;

  const msg = JSON.stringify({
    type: "delete",
    id,
  });

  // Send to all other users of user disconnect
  for (const user of wss.clients) {
    if (user === socket) {
      // TODO: Set user to offline
      console.log("set user to offline");
    }
  }
  broadcastMsg(createArrayBuffer(msg), false);
  console.log(`Client disconnected: ${id}`);
};
