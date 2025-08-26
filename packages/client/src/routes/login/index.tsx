import React, { useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ws } from "../../services/ws";
import { router } from "../../router";
import { Username } from "../../components/Username/Username.component";

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);

    const name = form.get("name") as string;

    ws.init(name)
      .then(() => router.navigate({ to: "/users" }))
      .catch((e) => console.log(e));
  }, []);

  return <Username handleSubmit={handleSubmit} />;
}
