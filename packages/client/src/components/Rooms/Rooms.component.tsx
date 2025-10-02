import React, { useCallback, useEffect, useState } from "react";
import { type RoomSchemaType } from "chat-shared";

interface IRoomListProps {
  setShowAddRoom: (bool: boolean) => void;
  setSelectedRoomId: (roomId: number) => void;
  selectedRoomId: number;
}

export const RoomsList: React.FC<IRoomListProps> = ({
  setShowAddRoom,
  setSelectedRoomId,
  selectedRoomId,
}) => {
  const [rooms, setRooms] = useState<RoomSchemaType[]>([]);

  useEffect(() => {
    const evtSource = new EventSource("/api/rooms");
    evtSource.onmessage = (event) => {
      const parsed = JSON.parse(event.data);

      setRooms(parsed);
    };

    return () => {
      evtSource.close();
    };
  }, []);

  const selectRoom = useCallback(
    (roomId: number) => {
      setSelectedRoomId(roomId);
    },
    [setSelectedRoomId]
  );

  return (
    <div className="flex flex-col border-2 p-3 border-line rounded-md overflow-hidden w-64">
      <ul className="flex flex-1 flex-col">
        {rooms.map((room) => (
          <button onClick={() => selectRoom(room.id)}>
            <li
              className={`flex items-center gap-3 first:border-t border-b px-3 border-line py-3 border-opacity-60 ${
                room.id === selectedRoomId ? "bg-blue-100" : ""
              }`}
              key={room.id}
            >
              <span className="text-lg font-medium">{room.name}</span>
            </li>
          </button>
        ))}
      </ul>

      <button
        onClick={() => setShowAddRoom(true)}
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
      >
        Add Room
      </button>
    </div>
  );
};
