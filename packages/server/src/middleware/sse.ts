import { Request, Response, NextFunction } from "express";
import { sseClients } from "../websocket/broadcast";

export function sseMiddleware(req: Request, res: Response, next: NextFunction) {
  // SSE required headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  // register client and ensure cleanup
  sseClients.push(res);
  req.on("close", () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
    try {
      res.end();
    } catch (e) {
      console.error(e);
    }
  });

  next();
}
