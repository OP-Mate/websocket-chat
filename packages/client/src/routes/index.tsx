import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useName } from "../store";
import { router } from "../main";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const name = useName();

  useEffect(() => {
    if (!name) {
      router.navigate({ to: "/login" });
    }
  }, [name]);

  return <div>Landing page</div>;
}
