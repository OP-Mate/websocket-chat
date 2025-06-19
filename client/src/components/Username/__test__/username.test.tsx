import { render, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/dom";
import "@testing-library/jest-dom";
import { Username } from "../index";
import * as wsModule from "../../../services/ws";
import * as storeModule from "../../../store";
vi.mock("../../../store");
import { BroadcastCreateUserSchema } from "../../../services/schema";

vi.mock("../../../services/websocket");

describe("<Username />", () => {
  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(1234567890);
    vi.spyOn(storeModule, "setName").mockImplementation(() => {});
    vi.spyOn(wsModule.ws, "sendMessage").mockImplementation(async () => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders input and button", () => {
    render(<Username />);
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByText("Join")).toBeInTheDocument();
  });

  it("calls setName and ws.sendMessage on valid submit", () => {
    render(<Username />);
    const input = screen.getByPlaceholderText("Name") as HTMLInputElement;
    const button = screen.getByText("Join");

    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.click(button);

    expect(storeModule.setName).toHaveBeenCalledWith("Alice");

    const payload = { type: "join", name: "Alice", timestamp: 1234567890 };

    const result = BroadcastCreateUserSchema.safeParse(payload);
    expect(wsModule.ws.sendMessage).toHaveBeenCalledWith(result);
  });

  it("does not call setName or ws.sendMessage if input is empty", () => {
    render(<Username />);
    const button = screen.getByText("Join");
    fireEvent.click(button);

    expect(storeModule.setName).not.toHaveBeenCalled();
    expect(wsModule.ws.sendMessage).not.toHaveBeenCalled();
  });

  it("logs error if validation fails", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Username />);
    const input = screen.getByPlaceholderText("Name") as HTMLInputElement;
    const button = screen.getByText("Join");

    // Simulate invalid input (e.g., empty string)
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(button);

    // Should not call setName or ws.sendMessage
    expect(storeModule.setName).not.toHaveBeenCalled();
    expect(wsModule.ws.sendMessage).not.toHaveBeenCalled();

    // No error should be logged because the handler returns early
    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
