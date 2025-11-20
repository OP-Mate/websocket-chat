import { RawData, WebSocket } from "ws";
import { wss } from "../index";
import { ChatEventSchema } from "chat-shared";
import {
  addMessageDB,
  getAllUsersDB,
  getIsChatRoomPrivate,
  getUserIdsByChatRoomId,
} from "../db/queries";
import { AuthWebSocket } from ".";
import { onlineStore } from "./onlineCheck";

function createArrayBuffer(msg: string) {
  return Buffer.from(msg, "utf-8");
}

function isClientAvailable(
  client: AuthWebSocket,
  targetUserIds?: string[]
): boolean {
  return (
    client.readyState === WebSocket.OPEN &&
    (!targetUserIds || targetUserIds.includes(client.user.id))
  );
}

function broadcastMsg(
  rawData: RawData,
  isBinary: boolean,
  to: string[] | null = null
) {
  wss.clients.forEach((client: AuthWebSocket) => {
    if (isClientAvailable(client, to || undefined)) {
      client.send(rawData, { binary: isBinary });
    }
  });
}

export const handleInitialMsg = (socket: AuthWebSocket) => {
  const { id, username } = socket.user;

  onlineStore.add(id);

  const currentUsers = getAllUsersDB(id);

  socket.send(
    JSON.stringify({
      type: "all_users",
      users: currentUsers.map((user) => ({
        ...user,
        is_online: onlineStore.has(user.id) ? 1 : 0,
      })),
      userId: id,
      username: username,
    }),
    {
      binary: false,
    }
  );
  // Send to all other users that this new user has connected
  const newUserMsg = JSON.stringify({
    type: "online_user",
    user: { id: id, username: username, is_online: 1 },
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
  senderId: string
) => {
  const msg = JSON.parse(rawData.toString("utf-8"));
  const result = ChatEventSchema.safeParse(msg);

  if (result.error) {
    console.log(result.error);
    return;
  }

  switch (result.data.type) {
    case "message_input": {
      const users = getUserIdsByChatRoomId(result.data.roomId);

      const chatRoomPrivate = getIsChatRoomPrivate(result.data.roomId);

      const response = addMessageDB(
        senderId,
        result.data.message,
        result.data.roomId
      );

      broadcastMsg(
        createArrayBuffer(
          JSON.stringify({
            type: "message",
            ...response,
          })
        ),
        isBinary,
        chatRoomPrivate ? users : null
      );
    }
  }
};

export const handleClose = (socket: AuthWebSocket) => {
  const { id, username } = socket.user;

  onlineStore.delete(id);

  const msg = JSON.stringify({
    type: "offline_user",
    user: {
      id,
      username,
      is_online: 0,
    },
  });

  for (const user of wss.clients) {
    if (user === socket) {
      onlineStore.delete(user.id);
    }
  }
  broadcastMsg(createArrayBuffer(msg), false);
  console.log(`Client disconnected: ${id}`);
};
