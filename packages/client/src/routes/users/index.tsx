import { createFileRoute } from "@tanstack/react-router";
import { Users } from "../../components/Users/Users.component";
import { Window } from "../../components/Window/Window.component";
import { Message } from "../../components/Message/Message.component";
import { addMessage, resetMessages } from "../../store";
import { useEffect } from "react";

export const Route = createFileRoute("/users/")({
  component: RouteComponent,
  loader: async () => {
    const r = await fetch("/api/messages?roomId=1");
    const { messages } = await r.json();

    addMessage(messages);
  },
});

function RouteComponent() {
  useEffect(() => {
    return () => resetMessages();
  }, []);

  return (
    <div className="list-none flex flex-row flex-1 gap-3">
      <Users />
      <div className="flex flex-1 flex-col w-64 gap-3">
        <Window />
        <Message />
      </div>
    </div>
  );
}
