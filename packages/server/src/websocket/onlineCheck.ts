import { wss } from "src";
import { AuthWebSocket } from ".";

export const onlineStore = new Set();

setInterval(() => {
  wss.clients.forEach((ws: AuthWebSocket) => {
    if (!onlineStore.has(ws.user.id)) return ws.terminate();

    ws.ping();
  });
}, 30_000);
