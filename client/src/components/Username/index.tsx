import {
  BroadcastCreateUserSchema,
  type BroadcastCreateUserSchemaType,
} from "chat-shared";
import React, { useCallback, useRef } from "react";
import { ws } from "../../services/ws";
import { setName } from "../../store";

export const Username: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input || !input.value) return;

    const payload = {
      type: "join",
      name: input.value,
    };

    setName(input.value);

    const result = BroadcastCreateUserSchema.safeParse(payload);
    if (result.success) {
      ws.sendMessage<BroadcastCreateUserSchemaType>(result);
    } else {
      console.error(result.error, result.data);
    }
  }, []);

  return (
    <dialog id="dialog" open>
      <p>Enter your name</p>
      <form method="dialog" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          name="name"
          placeholder="Name"
          required
        />
        <button type="submit">Join</button>
      </form>
    </dialog>
  );
};
