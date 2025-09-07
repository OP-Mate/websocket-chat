import { Router } from "express";
import { getMessagesByRoomIdDB } from "src/db/queries";

const router = Router();

router.get("/:roomId", (req, res) => {
  const roomId = req.params.roomId;

  const response = getMessagesByRoomIdDB(roomId);

  if (!response) {
    return res.status(404).json({ error: "Room not found" });
  }
  res.status(200).json({ messages: response });
});

export { router as messageRoutes };
