import { Router } from "express";
import { register, login, me } from "src/controllers/authController";
import { validateBody } from "src/middleware/validation";
import { AuthSchema } from "chat-shared";
import { authMiddleware } from "src/middleware/auth";

const router = Router();

router.post("/register", validateBody(AuthSchema), register);

router.post("/login", validateBody(AuthSchema), login);

router.get("/me", authMiddleware, me);

export { router as authRoutes };
