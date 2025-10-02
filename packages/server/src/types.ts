import { Request } from "express";
import { JwtPayload } from "./utils/jwt";

export interface AuthRequest extends Request {
  cookies: Record<string, string>;
  user?: JwtPayload;
}

export type UUIDType = `${string}-${string}-${string}-${string}-${string}`;
