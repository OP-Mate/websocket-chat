import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Users } from "../Users.component";
import * as storeModule from "../../../store";
import randomColor from "randomcolor";
import type { UserSchemaType } from "chat-shared";

const usersMock: UserSchemaType[] = [
  {
    id: "123",
    username: "Alice",
    is_online: 1,
  },
  { id: "456", username: "Bob", is_online: 1 },
];

vi.mock("randomcolor", () => ({
  __esModule: true,
  default: vi.fn(() => "#123456"),
}));

describe("<Users />", () => {
  beforeEach(() => {
    vi.spyOn(storeModule, "useUsers").mockReturnValue(usersMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a list of users", () => {
    render(<Users handleJoinPrivateRoom={vi.fn()} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("applies a color style to each user", () => {
    render(<Users handleJoinPrivateRoom={vi.fn()} />);
    const alice = screen.getByText("Alice");
    const bob = screen.getByText("Bob");
    expect(alice).toHaveStyle({ color: "#123456" });
    expect(bob).toHaveStyle({ color: "#123456" });
    expect(randomColor).toHaveBeenCalledWith({
      seed: "123",
      luminosity: "dark",
    });
    expect(randomColor).toHaveBeenCalledWith({
      seed: "456",
      luminosity: "dark",
    });
  });
});
