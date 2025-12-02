import { type Response } from "express";
import {
  addChatRoomUser,
  addRoom,
  findPrivateRoomWithMessages,
} from "src/db/queries";
import { JoinPrivateParamsSchemaType } from "src/routes/privateRoutes";
import { AuthRequest } from "src/types";

export const joinPrivateRoom = (
  req: AuthRequest<object, JoinPrivateParamsSchemaType>,
  res: Response
) => {
  const senderId = req.user?.id;
  const receiveId = req.params.id;

  if (!senderId) {
    res.status(401).json({ code: "unauthenticated" });
    return;
  }

  const foundRoomsMessages = findPrivateRoomWithMessages(senderId, receiveId);

  if (!foundRoomsMessages.success) {
    res.status(500).json({ code: "database_error" });
    return;
  }

  if (foundRoomsMessages.data == null) {
    const newRoom = addRoom(null, 1);

    if (!newRoom.success) {
      return res.status(500).json({ code: "database_error" });
    }

    const senderUser = addChatRoomUser(newRoom.data.id, senderId);
    const receiveUser = addChatRoomUser(newRoom.data.id, receiveId);

    if (!senderUser.success || !receiveUser.success) {
      return res.status(500).json({
        code: "database_error",
      });
    }

    return res.status(200).json({ messages: [], roomId: newRoom.data.id });
  }

  return res.status(200).json({
    messages: foundRoomsMessages.data?.messages || [],
    roomId: foundRoomsMessages.data?.id,
  });
};
