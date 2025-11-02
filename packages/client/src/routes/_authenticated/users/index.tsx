import { createFileRoute } from "@tanstack/react-router";
import { Users } from "../../../components/Users/Users.component";
import { Window } from "../../../components/Window/Window.component";
import { Message } from "../../../components/Message/Message.component";
import {
  addMessage,
  resetMessages,
  setSelectedRoomId,
  useSelectedRoomId,
} from "../../../store";
import { api } from "../../../api/api";
import { NoChannel } from "../../../components/NoChannel/NoChannel.component";

export const Route = createFileRoute("/_authenticated/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  const selectedRoomId = useSelectedRoomId();

  const handleJoinPrivateRoom = async (userId: string) => {
    const { messages, roomId } = await api.joinPrivateRoom(userId);
    resetMessages();
    addMessage(messages);
    setSelectedRoomId(roomId);
  };

  return (
    <div className="list-none flex flex-row flex-1 gap-3">
      <Users handleJoinPrivateRoom={handleJoinPrivateRoom} />
      <div className="flex flex-1 flex-col w-64 gap-3">
        {selectedRoomId ? (
          <>
            <Window />
            <Message />
          </>
        ) : (
          <NoChannel />
        )}
      </div>
    </div>
  );
}
