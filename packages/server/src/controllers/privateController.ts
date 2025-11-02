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

  if (foundRoomsMessages == null) {
    const newRoom = addRoom(null, 1);

    addChatRoomUser(newRoom.id, senderId);
    addChatRoomUser(newRoom.id, receiveId);

    return res.status(200).json({ messages: [], roomId: newRoom.id });
  }

  return res.status(200).json({
    messages: foundRoomsMessages.messages,
    roomId: foundRoomsMessages.id,
  });
};
