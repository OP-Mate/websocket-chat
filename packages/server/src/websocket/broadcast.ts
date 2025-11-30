import { getAllPublicRooms } from "../db/queries";
import { Response } from "express";

// Store connected SSE clients
export const sseClients: Response[] = [];

export function broadcastRoomsUpdate() {
  const allPublicRooms = getAllPublicRooms();
  const rooms = allPublicRooms.success ? allPublicRooms.data : [];
  const data = `data: ${JSON.stringify(rooms)}\n\n`;

  for (const client of sseClients) {
    try {
      client.write(data);
    } catch (err) {
      console.error("Failed to write SSE to client:", err);
    }
  }
}
