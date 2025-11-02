import React, { useRef, useEffect } from "react";
import { useMessages } from "../../store";
import { WindowList } from "./WindowList";

export const Window: React.FC = () => {
  const messages = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ul className="flex flex-col gap-2 border-2 border-line rounded-md h-[90vh] p-3 overflow-y-scroll">
      {messages.map((message) => (
        <WindowList key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </ul>
  );
};
