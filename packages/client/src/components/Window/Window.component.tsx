import React from "react";
import randomColor from "randomcolor";
import { useMessages, useUserId, useUsers } from "../../store";

export const Window: React.FC = () => {
  const messages = useMessages();
  const userId = useUserId();
  const users = useUsers();

  return (
    <ul className="flex flex-col gap-2 border-2 border-line rounded-md h-[90vh] p-3">
      {messages.map((msg) => {
        const user = users.find((user) => user.id === msg.sender_id);
        const userName = user?.username || "";

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
    </ul>
  );
};
