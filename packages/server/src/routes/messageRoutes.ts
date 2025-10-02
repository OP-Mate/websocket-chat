import { Router } from "express";
import { getMessagesByRoomIdDB } from "src/db/queries";
import { authMiddleware } from "src/middleware/auth";
import { validateParams } from "../middleware/validation";
import { z } from "zod";

const router = Router();

router.use(authMiddleware);

const GetMessages = z.object({
  roomId: z.string({ required_error: "Room ID is required" }),
});

type GetMessagesSchemaType = z.infer<typeof GetMessages>;

router.get("/:roomId", validateParams(GetMessages), (req, res) => {
  const { roomId } = req.params as GetMessagesSchemaType;

  const response = getMessagesByRoomIdDB(roomId);

  if (!response) {
    return res.status(404).json({ error: "Room not found" });
  }
  res.status(200).json({ messages: response });
});

export { router as messageRoutes };
