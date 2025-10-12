import { Router } from "express";
import { authMiddleware } from "src/middleware/auth";
import { validateParams } from "../middleware/validation";
import { z } from "zod";
import { getMessages } from "src/controllers/messageController";

const router = Router();

router.use(authMiddleware);

const MessagesParamsSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
});

export type MessagesParamsSchemaType = z.infer<typeof MessagesParamsSchema>;

router.get("/:roomId", validateParams(MessagesParamsSchema), getMessages);
export { router as messageRoutes };
