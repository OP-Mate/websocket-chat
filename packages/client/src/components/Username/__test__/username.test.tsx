import { render, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/dom";
import "@testing-library/jest-dom";
import { Username } from "../Username.component";
import * as wsModule from "../../../services/ws";
vi.mock("../../../store");

vi.mock("../../../services/websocket");

describe("<Username />", () => {
  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(1234567890);
    vi.spyOn(wsModule.ws, "sendMessage").mockImplementation(async () => {});
    vi.spyOn(wsModule.ws, "init").mockImplementation(async () => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders input and button", () => {
    render(<Username />);
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByText("Join")).toBeInTheDocument();
  });

  it("calls ws.init on valid submit", () => {
    render(<Username />);
    const input = screen.getByPlaceholderText("Name") as HTMLInputElement;
    const button = screen.getByText("Join");

    fireEvent.change(input, { target: { value: "Alice" } });

    fireEvent.click(button);

    expect(wsModule.ws.init).toHaveBeenCalledWith("Alice");
  });

  it("does not call ws.init if input is empty", () => {
    render(<Username />);
    const button = screen.getByText("Join");
    fireEvent.click(button);

    expect(wsModule.ws.init).not.toHaveBeenCalled();
  });

  //TODO: Review this test
  it.skip("logs error if validation fails", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Username />);
    const input = screen.getByPlaceholderText("Name") as HTMLInputElement;
    const button = screen.getByText("Join");

    // Simulate invalid input (e.g., empty string)
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(button);

    // Should not call setName or ws.sendMessage
    // expect(storeModule.setName).not.toHaveBeenCalled();
    expect(wsModule.ws.sendMessage).not.toHaveBeenCalled();

    // No error should be logged because the handler returns early
    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
