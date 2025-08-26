import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Message } from "../Message.component";
import * as wsModule from "../../../services/ws";
import { ChatEventSchema, type ChatEventSchemaType } from "chat-shared";

describe("<Message />", () => {
  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(1234567890);

    vi.spyOn(wsModule.ws, "sendMessage").mockImplementation(() =>
      Promise.resolve()
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the input", () => {
    render(<Message roomId={0} />);
    expect(screen.getByPlaceholderText("Type a message")).toBeInTheDocument();
  });

  it("calls ws.sendMessage with valid payload on submit", async () => {
    render(<Message roomId={0} />);
    const input = screen.getByPlaceholderText(
      "Type a message"
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Hello world" } });
    fireEvent.submit(input.closest("form")!);

    const payload: ChatEventSchemaType = {
      type: "message_input",
      message: "Hello world",
      roomId: 0,
    };
    const parsedPayload = ChatEventSchema.safeParse(payload);

    await Promise.resolve();

    expect(wsModule.ws.sendMessage).toHaveBeenCalledWith(parsedPayload);
  });

  it("clears the input after successful send", async () => {
    render(<Message roomId={0} />);
    const input = screen.getByPlaceholderText(
      "Type a message"
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Hello world" } });
    fireEvent.submit(input.closest("form")!);

    await Promise.resolve();

    expect(input.value).toBe("");
  });
});
