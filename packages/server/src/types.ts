import { Request } from "express";
import { JwtPayload } from "./utils/jwt";

export interface AuthRequest<Body = object, Params = object>
  extends Request<Params, object, Body> {
  cookies: Record<string, string>;
  user?: JwtPayload;
}

export type UUIDType = `${string}-${string}-${string}-${string}-${string}`;

export type NoopBody = object;
