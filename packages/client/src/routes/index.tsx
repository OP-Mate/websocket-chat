import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useUserId } from "../store";
import { router } from "../router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const userId = useUserId();

  useEffect(() => {
    if (!userId) {
      router.navigate({ to: "/login" });
    }
  }, [userId]);

  return <div>Landing page</div>;
}
