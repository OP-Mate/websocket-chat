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
    <form
      className="border-2 border-line rounded-md flex flex-1 overflow-hidden"
      onSubmit={handleSubmit}
    >
      <div className="relative flex flex-1">
        <input
          className="pl-3 focus:outline-none focus:border-b-4 w-full border-b-4 border-b-transparent text-background focus:border-blue-500 placeholder:pt-4"
          id="message-input"
          name="message-input"
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="group absolute right-3 top-3 text-xl border-l-2 border-line pl-2"
          aria-label="Send message"
        >
          <i className="fa-solid fa-paper-plane group-hover:text-background"></i>
        </button>
      </div>
    </form>
  );
};
