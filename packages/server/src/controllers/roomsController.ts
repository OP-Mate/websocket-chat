import { AuthRequest } from "src/types";
import { Response } from "express";

import { broadcastRoomsUpdate } from "../websocket/broadcast";
import { addRoom, getAllPublicRooms } from "src/db/queries";
import { AddRoomBodySchemaType } from "src/routes/roomRoutes";

export const postAddRoom =
  () => (req: AuthRequest<AddRoomBodySchemaType>, res: Response) => {
    const { name } = req.body;

    const newRoom = addRoom(name);

    res.status(201).json({ room: newRoom });

    broadcastRoomsUpdate();
  };

export const getAllRooms = (_req: AuthRequest, res: Response) => {
  try {
    const allPublicRooms = getAllPublicRooms();
    res.write(`data: ${JSON.stringify(Array.from(allPublicRooms))}\n\n`);
  } catch (err) {
    console.error("SSE initial send failed:", err);
  }
};
