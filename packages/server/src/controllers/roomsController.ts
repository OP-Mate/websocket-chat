import { AuthRequest } from "src/types";
import { Response } from "express";

import { broadcastRoomsUpdate } from "../websocket/broadcast";
import { addRoom, getAllPublicRooms } from "src/db/queries";
import { AddRoomBodySchemaType } from "src/routes/roomRoutes";

export const postAddRoom = (
  req: AuthRequest<AddRoomBodySchemaType>,
  res: Response
) => {
  const { name } = req.body;

  const newRoom = addRoom(name);

  res.status(201).json({ room: newRoom });

  broadcastRoomsUpdate();
};

export const getAllRooms = (_req: AuthRequest, res: Response) => {
  try {
    const allPublicRooms = getAllPublicRooms();

    if (!allPublicRooms.success) {
      return res.status(500).json({ message: allPublicRooms.error });
    }

    res.write(`data: ${JSON.stringify(allPublicRooms.data)}\n\n`);
  } catch (err) {
    console.error("SSE initial send failed:", err);
    res
      .status(500)
      .write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
  }
};
