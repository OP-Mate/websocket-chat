import React, { useCallback } from "react";
import { ws } from "../../services/ws";
import { setName } from "../../store";

export const Username: React.FC = () => {
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);

    const name = form.get("name") as string;

    ws.init(name);
    setName(name);
  }, []);

  return (
    <dialog id="dialog" open>
      <p>Enter your name</p>
      <form method="dialog" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" required />
        <button type="submit">Join</button>
      </form>
    </dialog>
  );
};
