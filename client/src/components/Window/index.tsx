import React from "react";
import randomColor from "randomcolor";
import { useMessages } from "../../store";

export const Window: React.FC = () => {
  const messages = useMessages();

  return (
    <div id="message-list">
      <div>
        {messages.map((msg, i) => {
          return (
            <div key={i}>
              <span style={{ color: randomColor({ seed: msg.name }) }}>
                {msg.name} @{new Date(msg.timestamp).toLocaleTimeString()}:{" "}
              </span>
              <span>{msg.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
