import { createFileRoute } from "@tanstack/react-router";
import { Username } from "../../components/Username/Username.component";

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Username />;
}
