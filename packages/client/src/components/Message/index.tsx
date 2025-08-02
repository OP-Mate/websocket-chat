import React, { useCallback } from "react";
import { ws } from "../../services/ws";
import { ChatEventSchema } from "chat-shared";
import { getName } from "../../store";

export const Message: React.FC = () => {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);

    const message = form.get("message-input") as string;

    const payload = {
      type: "message",
      name: getName(),
      message,
    };

    const parsedPayload = ChatEventSchema.safeParse(payload);

    ws.sendMessage(parsedPayload)
      .then(() => {
        (e.target as HTMLFormElement).reset();
      })
      .catch((e) => console.error("error from the promise", e));
  }, []);

  return (
    <form id="message-new" onSubmit={handleSubmit}>
      <input
        id="message-input"
        name="message-input"
        placeholder="Type message"
      />
    </form>
  );
};
