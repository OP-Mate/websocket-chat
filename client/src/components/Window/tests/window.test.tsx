import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Window } from "../index";
import * as storeModule from "../../../store";
import randomColor from "randomcolor";

vi.mock("randomcolor", () => ({
  __esModule: true,
  default: vi.fn(() => "#abcdef"),
}));

describe("<Window />", () => {
  const mockMessages = [
    {
      type: "message",
      name: "Alice",
      message: "Hello!",
      timestamp: 1710000000000,
    },
    {
      type: "message",
      name: "Bob",
      message: "Hi Alice!",
      timestamp: 1710000001000,
    },
  ];

  beforeEach(() => {
    // @ts-expect-error unit tests
    vi.spyOn(storeModule, "useMessages").mockReturnValue(mockMessages);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all messages", () => {
    render(<Window />);
    expect(screen.getByText(/Alice @/)).toBeInTheDocument();
    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(screen.getByText(/Bob @/)).toBeInTheDocument();
    expect(screen.getByText("Hi Alice!")).toBeInTheDocument();
  });

  it("applies a color style to each name", () => {
    render(<Window />);
    const alice = screen.getByText(/Alice @/);
    const bob = screen.getByText(/Bob @/);
    expect(alice).toHaveStyle({ color: "#abcdef" });
    expect(bob).toHaveStyle({ color: "#abcdef" });
    expect(randomColor).toHaveBeenCalledWith({ seed: "Alice" });
    expect(randomColor).toHaveBeenCalledWith({ seed: "Bob" });
  });

  it("shows the correct formatted time", () => {
    render(<Window />);
    const alice = screen.getByText(/Alice @/);
    const bob = screen.getByText(/Bob @/);
    // The time string will depend on the locale, so just check the pattern
    expect(alice.textContent).toMatch(/Alice @\d{1,2}:\d{2}:\d{2}/);
    expect(bob.textContent).toMatch(/Bob @\d{1,2}:\d{2}:\d{2}/);
  });
});
