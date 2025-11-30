import { AuthRequest } from "src/types";
import { Response } from "express";
import { getMessagesByRoomIdDB } from "src/db/queries";
import { MessagesParamsSchemaType } from "src/routes/messageRoutes";

export const getMessages = (
  req: AuthRequest<object, MessagesParamsSchemaType>,
  res: Response
) => {
  const { roomId } = req.params;

  const messages = getMessagesByRoomIdDB(roomId);

  if (!messages.success) {
    return res.status(404).json({ error: "Room not found" });
  }
  res.status(200).json({ messages: messages.data });
};
