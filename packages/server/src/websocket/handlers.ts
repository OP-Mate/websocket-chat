import { RawData, WebSocket } from "ws";
import { wss } from "../index";
import { ApiCodeError, ChatEventSchema } from "chat-shared";
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

  if (!currentUsers.success) {
    sendErrorToUser(id, "failed_to_initialize_websocket");
    return;
  }

  socket.send(
    JSON.stringify({
      type: "all_users",
      users: currentUsers.data.map((user) => ({
        ...user,
        isOnline: onlineStore.has(user.id),
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
    user: { id: id, username: username, isOnline: true },
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

      if (!chatRoomPrivate.success || !users.success) {
        sendErrorToUser(senderId, "invalid_room");
        return;
      }

      const newMessage = addMessageDB(
        senderId,
        result.data.message,
        result.data.roomId
      );

      if (!newMessage.success) {
        sendErrorToUser(senderId, "invalid_message");
        return;
      }

      broadcastMsg(
        createArrayBuffer(
          JSON.stringify({
            type: "message",
            ...newMessage.data,
          })
        ),
        isBinary,
        chatRoomPrivate.success ? users.data : null
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
      isOnline: false,
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

function sendErrorToUser(userId: string, code: ApiCodeError) {
  wss.clients.forEach((client: AuthWebSocket) => {
    if (client.user.id === userId && client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "error",
          code: code,
        })
      );
    }
  });
}
