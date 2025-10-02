import { Router } from "express";
import { register, login } from "src/controllers/authController";
import { validateBody } from "src/middleware/validation";
import { AuthSchema } from "chat-shared";

const router = Router();

router.post("/register", validateBody(AuthSchema), register);

router.post("/login", validateBody(AuthSchema), login);

export { router as authRoutes };
