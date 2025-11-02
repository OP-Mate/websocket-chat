import { Router } from "express";
import { joinPrivateRoom } from "src/controllers/privateController";

import { authMiddleware } from "src/middleware/auth";
import { validateParams } from "src/middleware/validation";
import z from "zod";

const router = Router();

const JoinPrivateParamsSchema = z.object({
  id: z.string(),
});

export type JoinPrivateParamsSchemaType = z.infer<
  typeof JoinPrivateParamsSchema
>;

router.use(authMiddleware);

router.get("/:id", validateParams(JoinPrivateParamsSchema), joinPrivateRoom);

export { router as privateRoutes };
