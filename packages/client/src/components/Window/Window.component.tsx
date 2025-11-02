import React, { useRef, useEffect } from "react";
import randomColor from "randomcolor";
import { useMessages, useUserId, useUsername, useUsers } from "../../store";

export const Window: React.FC = () => {
  const messages = useMessages();
  const userId = useUserId();
  const users = useUsers();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const username = useUsername();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ul className="flex flex-col gap-2 border-2 border-line rounded-md h-[90vh] p-3 overflow-y-scroll">
      {messages.map((msg) => {
        const user = users.find((user) => user.id === msg.sender_id);
        // todo: fix this
        const userName = user?.username || username;

        return (
          <li key={msg.id} className="flex flex-col gap-3">
            <div
              className={`flex gap-3 ${userId === msg.sender_id ? "justify-end" : ""}`}
            >
              {userId !== msg.sender_id ? (
                <img
                  className="w-8 h-8"
                  src={`https://avatar.iran.liara.run/public/boy?username=${msg.sender_id}`}
                  alt=""
                />
              ) : null}
              <div className="">
                <span
                  className="text-xs"
                  style={{
                    color: randomColor({
                      seed: msg.sender_id,
                      luminosity: "dark",
                    }),
                  }}
                >
                  {userName} @
                  {new Date(Number(msg.created_at) * 1000).toLocaleString(
                    "en-GB",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>

                <p
                  style={{
                    borderColor: randomColor({
                      seed: msg.sender_id,
                      luminosity: "dark",
                    }),
                  }}
                  className="border p-2 rounded-md"
                >
                  {msg.message}
                </p>
              </div>
            </div>
          </li>
        );
      })}
      <div ref={messagesEndRef} />
    </ul>
  );
};
