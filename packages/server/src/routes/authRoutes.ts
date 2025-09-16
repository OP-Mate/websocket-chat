import { Router } from "express";
import { register, login } from "src/controllers/authController";

import z from "zod";
import { validateBody } from "src/middleware/validation";

const router = Router();

const authSchema = z.object({
  username: z.string({ required_error: "Username is required" }),
  password: z.coerce.string().min(1),
});

router.post("/register", validateBody(authSchema), register);

router.post("/login", validateBody(authSchema), login);

export { router as authRoutes };
