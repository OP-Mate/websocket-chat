import { createFileRoute } from "@tanstack/react-router";
import { RoomsList } from "../../components/Rooms/Rooms.component";
import { Window } from "../../components/Window/Window.component";
import { Username } from "../../components/Username/Username.component";
import { useCallback, useEffect, useState } from "react";
import { Message } from "../../components/Message/Message.component";
import { addMessage, resetMessages } from "../../store";

export const Route = createFileRoute("/rooms/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showAddRoom, setShowAddRoom] = useState(false);

  const [selectedRoomId, setSelectedRoomId] = useState(1);

  useEffect(() => {
    (async () => {
      resetMessages();
      const r = await fetch(`/api/messages?roomId=${selectedRoomId}`);
      const { messages } = await r.json();

      addMessage(messages);
    })();
  }, [selectedRoomId]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);

    const newRoomName = form.get("name") as string;

    fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newRoomName }),
    });

    setShowAddRoom(false);
  }, []);

  console.log("selectedRoomId", selectedRoomId);

  return (
    <div className="list-none flex flex-row flex-1 gap-3">
      <RoomsList
        setShowAddRoom={setShowAddRoom}
        setSelectedRoomId={setSelectedRoomId}
        selectedRoomId={selectedRoomId}
      />
      <div className="flex flex-1 flex-col w-64 gap-3">
        <Window />
        <Message roomId={selectedRoomId} />
        {showAddRoom && <Username handleSubmit={handleSubmit} />}
      </div>
    </div>
  );
}
