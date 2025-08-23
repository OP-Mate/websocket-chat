import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Window } from "../Window.component";
import * as storeModule from "../../../store";
import randomColor from "randomcolor";
import "@testing-library/jest-dom";
import type { MessageSchemaType, UserSchemaType } from "chat-shared";

const mockMessages: MessageSchemaType[] = [
  {
    id: 1,
    type: "message",
    message: "Hello!",
    created_at: 1710000000000,
    sender_id: "123",
  },
  {
    id: 2,
    type: "message",
    message: "Hi Alice!",
    created_at: 1710000001001,
    sender_id: "456",
  },
];

const usersMock: UserSchemaType[] = [
  {
    id: "123",
    username: "Alice",
  },
  { id: "456", username: "Bob" },
];

const mockUserId = "123";

vi.mock("randomcolor", () => ({
  __esModule: true,
  default: vi.fn(() => "#abcdef"),
}));

describe("<Window />", () => {
  beforeEach(() => {
    vi.spyOn(storeModule, "useMessages").mockReturnValue(mockMessages);
    vi.spyOn(storeModule, "useUsers").mockReturnValue(usersMock);
    vi.spyOn(storeModule, "useUserId").mockReturnValue(mockUserId);
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
    expect(randomColor).toHaveBeenCalledWith({
      seed: "123",
      luminosity: "dark",
    });
    expect(randomColor).toHaveBeenCalledWith({
      luminosity: "dark",
      seed: "456",
    });
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
