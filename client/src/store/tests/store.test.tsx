import { describe, it, expect, beforeEach } from "vitest";
import * as store from "../index";
import type { BroadcastMsgSchemaType, UserSchemaType } from "chat-shared";
import { act, renderHook } from "@testing-library/react";

describe("WebSocketStore actions/selectors", () => {
  const user1: UserSchemaType = { id: "1", name: "Alice" };
  const user2: UserSchemaType = { id: "2", name: "Bob" };
  const msg1: BroadcastMsgSchemaType = {
    type: "message",
    name: "Alice",
    message: "Hello",
    timestamp: 1,
  };
  const msg2: BroadcastMsgSchemaType = {
    type: "message",
    name: "Bob",
    message: "Hi",
    timestamp: 2,
  };

  beforeEach(() => {
    store.useWebSocketStore.setState({
      messages: [],
      users: [],
      name: "",
    });
  });

  it("addMessage adds a message", () => {
    const { result } = renderHook(store.useMessages);

    act(() => {
      store.addMessage(msg1);
    });
    expect(result.current).toEqual([msg1]);
  });

  it("addUser adds users", () => {
    const { result } = renderHook(store.useUsers);

    act(() => {
      store.addUser([user1, user2]);
    });
    expect(result.current).toEqual([user1, user2]);
  });

  it("setName sets the name", () => {
    const { result } = renderHook(store.useName);

    act(() => {
      store.setName("Charlie");
    });
    expect(result.current).toBe("Charlie");
    expect(result.current).toBe("Charlie");
  });

  it("deleteUser removes a user by id", () => {
    const { result } = renderHook(store.useUsers);

    act(() => {
      store.addUser([user1, user2]);
      store.deleteUser("1");
    });
    expect(result.current).toEqual([user2]);
  });

  it("useMessages returns all messages", () => {
    const { result } = renderHook(store.useMessages);

    act(() => {
      store.addMessage(msg1);
      store.addMessage(msg2);
    });
    expect(result.current).toEqual([msg1, msg2]);
  });

  it("getName returns the current name", () => {
    store.setName("Zoe");
    expect(store.getName()).toBe("Zoe");
  });
});
