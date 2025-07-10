import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Message } from "../index";
import * as wsModule from "../../../services/ws";
import * as storeModule from "../../../store";
import { BroadcastMsgSchema } from "chat-shared";

describe("<Message />", () => {
  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(1234567890);

    vi.spyOn(wsModule.ws, "sendMessage").mockImplementation(() =>
      Promise.resolve()
    );
    vi.spyOn(storeModule, "getName").mockReturnValue("Alice");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the input", () => {
    render(<Message />);
    expect(screen.getByPlaceholderText("Type message")).toBeInTheDocument();
  });

  it("calls ws.sendMessage with valid payload on submit", async () => {
    render(<Message />);
    const input = screen.getByPlaceholderText(
      "Type message"
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Hello world" } });
    fireEvent.submit(input.closest("form")!);

    const payload = {
      type: "message",
      name: "Alice",
      message: "Hello world",
    };
    const parsedPayload = BroadcastMsgSchema.safeParse(payload);

    await Promise.resolve();

    expect(wsModule.ws.sendMessage).toHaveBeenCalledWith(parsedPayload);
  });

  it("clears the input after successful send", async () => {
    render(<Message />);
    const input = screen.getByPlaceholderText(
      "Type message"
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Hello world" } });
    fireEvent.submit(input.closest("form")!);

    await Promise.resolve();

    expect(input.value).toBe("");
  });
});
