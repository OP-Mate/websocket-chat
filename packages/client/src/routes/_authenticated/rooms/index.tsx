import { createFileRoute } from "@tanstack/react-router";
import { RoomsList } from "../../../components/Rooms/Rooms.component";
import { Window } from "../../../components/Window/Window.component";
import { AddRoom } from "../../../components/Rooms/Rooms.add";
import { useCallback, useEffect, useState } from "react";
import { Message } from "../../../components/Message/Message.component";
import { addMessage, resetMessages, useSelectedRoomId } from "../../../store";
import { api } from "../../../api/api";
import { NoChannel } from "../../../components/NoChannel/NoChannel.component";

export const Route = createFileRoute("/_authenticated/rooms/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showAddRoom, setShowAddRoom] = useState(false);

  const selectedRoomId = useSelectedRoomId();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      resetMessages();
      const { messages } = await api.getMessages(String(selectedRoomId));

      if (!cancelled) {
        addMessage(messages);
      }
    })();

    return () => {
      cancelled = true;
    };
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

  return (
    <div className="list-none flex flex-row flex-1 gap-3">
      <RoomsList
        setShowAddRoom={setShowAddRoom}
        selectedRoomId={selectedRoomId}
      />
      <div className="flex flex-1 flex-col w-64 gap-3">
        {selectedRoomId ? (
          <>
            <Window />
            <Message />
          </>
        ) : (
          <NoChannel />
        )}

        {showAddRoom && <AddRoom handleSubmit={handleSubmit} />}
      </div>
    </div>
  );
}
