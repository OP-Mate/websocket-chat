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
  },
  { id: "456", username: "Bob" },
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
    render(<Users />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("applies a color style to each user", () => {
    render(<Users />);
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
