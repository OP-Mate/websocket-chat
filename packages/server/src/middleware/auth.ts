import { Response, NextFunction } from "express";
import { AuthRequest } from "src/types";
import { verifyToken } from "src/utils/jwt";

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.access_token;

  if (!token) return res.status(401).json({ code: "unauthenticated" });
  try {
    const payload = await verifyToken(token);

    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ code: "invalid_token" });
  }
}
