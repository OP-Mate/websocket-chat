import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { App } from "../index";
import * as storeModule from "../../store";

// Mock the components to avoid rendering their internals
vi.mock("../../components/Username", () => ({
  Username: () => <div data-testid="username">Username</div>,
}));
vi.mock("../../components/Users", () => ({
  Users: () => <div data-testid="users">Users</div>,
}));
vi.mock("../../components/Window", () => ({
  Window: () => <div data-testid="window">Window</div>,
}));
vi.mock("../../components/Message", () => ({
  Message: () => <div data-testid="message">Message</div>,
}));

describe("<App />", () => {
  beforeEach(() => {
    // Ensure the portal root exists in the document
    const portal = document.createElement("div");
    portal.setAttribute("id", "portal");
    document.body.appendChild(portal);
  });

  afterEach(() => {
    document.getElementById("portal")?.remove();
    vi.restoreAllMocks();
  });

  it("renders Username in a portal when name is empty", () => {
    vi.spyOn(storeModule, "useName").mockReturnValue("");
    render(<App />);
    expect(screen.getByTestId("username")).toBeInTheDocument();
  });

  it("renders Users, Window, and Message components", () => {
    vi.spyOn(storeModule, "useName").mockReturnValue("Alice");
    render(<App />);
    expect(screen.getByTestId("users")).toBeInTheDocument();
    expect(screen.getByTestId("window")).toBeInTheDocument();
    expect(screen.getByTestId("message")).toBeInTheDocument();
  });

  it("does not render Username when name is present", () => {
    vi.spyOn(storeModule, "useName").mockReturnValue("Alice");
    render(<App />);
    expect(screen.queryByTestId("username")).not.toBeInTheDocument();
  });
});
