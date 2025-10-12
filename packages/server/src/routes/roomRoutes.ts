import { Router } from "express";
import { sseMiddleware } from "src/middleware/sse";
import { authMiddleware } from "src/middleware/auth";
import { postAddRoom, getAllRooms } from "src/controllers/roomsController";
import z from "zod";
import { validateBody } from "src/middleware/validation";

const router = Router();

const AddRoomBodySchema = z.object({
  name: z.string({ required_error: "Room name is required" }),
});

export type AddRoomBodySchemaType = z.infer<typeof AddRoomBodySchema>;

router.use(authMiddleware);

router.post("/", validateBody(AddRoomBodySchema), postAddRoom);

router.get("/", sseMiddleware, getAllRooms);

export { router as roomRoutes };
