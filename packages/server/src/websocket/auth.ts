import { IncomingMessage } from "http";
import { parse as parseCookie } from "cookie";
import { verifyToken } from "src/utils/jwt"; //

export async function authFromRequest(req: IncomingMessage) {
  const raw = req.headers?.cookie ?? "";
  const cookies = parseCookie(raw || "");
  const token = cookies["access_token"];
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    return payload;
  } catch {
    return null;
  }
}
