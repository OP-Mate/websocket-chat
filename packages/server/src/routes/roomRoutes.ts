import { Router } from "express";
import { broadcastRoomsUpdate } from "../websocket/broadcast";
import { addRoom, getAllPublicRooms } from "src/db/queries";
import { sseMiddleware } from "src/middleware/sse";
import { authMiddleware } from "src/middleware/auth";

const router = Router();

router.use(authMiddleware);

router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Room name is required" });
  }

  const newRoom = addRoom(name);

  res.status(201).json({ room: newRoom });

  // Notify all SSE clients about the new room
  broadcastRoomsUpdate();
});

router.get("/", sseMiddleware, (req, res) => {
  try {
    const allPublicRooms = getAllPublicRooms();
    res.write(`data: ${JSON.stringify(Array.from(allPublicRooms))}\n\n`);
  } catch (err) {
    console.error("SSE initial send failed:", err);
  }
});

export { router as roomRoutes };
