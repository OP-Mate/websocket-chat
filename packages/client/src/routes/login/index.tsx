import React, { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Username } from "../../components/Username/Username.component";
import { serverResponses } from "../../constants/responses";
import { router } from "../../router";
import { ws } from "../../services/ws";
import type { AuthCode } from "chat-shared";

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [error, setError] = useState("");

  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = new FormData(e.target as HTMLFormElement);

      const username = form.get("username") as string;
      const password = form.get("password") as string;

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const json = await response.json();

        if (json.code === "user_logged_in") {
          await ws.init();
          router.navigate({ to: "/users" });
        } else {
          setError(serverResponses[json.code as AuthCode]);
        }
      } catch (e) {
        console.log(e);
      }
    },

    []
  );

  const handleRegister = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = new FormData(e.target as HTMLFormElement);

      const username = form.get("username") as string;
      const password = form.get("password") as string;

      const confirmPassword = form.get("confirmPassword") as string;

      if (confirmPassword !== password) {
        setError("Password does not match");
        return;
      }

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const json = await response.json();

        if (json.code === "user_created") {
          await ws.init();
          router.navigate({ to: "/users" });
        } else {
          setError(serverResponses[json.code as AuthCode]);
        }
      } catch (e) {
        console.log(e);
      }
    },
    []
  );

  return (
    <Username
      handleLogin={handleLogin}
      handleRegister={handleRegister}
      error={error}
    />
  );
}
