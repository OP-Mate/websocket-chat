import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Users } from "../index";
import * as storeModule from "../../../store";
import randomColor from "randomcolor";

vi.mock("randomcolor", () => ({
  __esModule: true,
  default: vi.fn(() => "#123456"),
}));

describe("<Users />", () => {
  beforeEach(() => {
    vi.spyOn(storeModule, "useUsers").mockReturnValue([
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ]);
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
    expect(randomColor).toHaveBeenCalledWith({ seed: "Alice" });
    expect(randomColor).toHaveBeenCalledWith({ seed: "Bob" });
  });
});
