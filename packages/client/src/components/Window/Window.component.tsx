import React from "react";
import randomColor from "randomcolor";
import { useMessages, useName } from "../../store";

export const Window: React.FC = () => {
  const messages = useMessages();
  const name = useName();

  return (
    <ul className="flex flex-col gap-2 border-2 border-line rounded-md h-[90vh] p-3">
      {messages.map((msg, i) => {
        return (
          <li key={i} className="flex flex-col gap-3">
            <div
              className={`flex gap-3 ${name === msg.name ? "justify-end" : ""}`}
            >
              {name !== msg.name ? (
                <img
                  className="w-8 h-8"
                  src={`https://avatar.iran.liara.run/public/boy?username=${msg.name}`}
                  alt=""
                />
              ) : null}
              <div className="">
                <span
                  className="text-xs"
                  style={{
                    color: randomColor({ seed: msg.name, luminosity: "dark" }),
                  }}
                >
                  {msg.name} @{new Date(msg.timestamp).toLocaleTimeString()}
                </span>

                <p
                  style={{
                    borderColor: randomColor({
                      seed: msg.name,
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
