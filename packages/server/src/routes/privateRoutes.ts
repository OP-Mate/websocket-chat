import { Router, type Response } from "express";
import {
  addChatRoomUser,
  addRoom,
  findPrivateRoomWithMessages,
} from "src/db/queries";
import { authMiddleware } from "src/middleware/auth";
import { AuthRequest } from "src/types";

const router = Router();

router.use(authMiddleware);

router.get("/:id", (req: AuthRequest, res: Response) => {
  const senderId = req.user?.id;
  const receiveId = req.params?.id;

  if (!senderId) {
    res.status(401).json({ code: "unauthenticated" });
    return;
  }

  if (!receiveId) {
    res.status(401).json({ code: "validation_failed" });
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
});

export { router as privateRoutes };
