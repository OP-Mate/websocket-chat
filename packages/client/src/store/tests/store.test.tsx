import { describe, it, expect, beforeEach } from "vitest";
import * as store from "../index";
import type { ChatEventSchemaType, UserSchemaType } from "chat-shared";
import { act, renderHook } from "@testing-library/react";

describe("WebSocketStore actions/selectors", () => {
  const user1: UserSchemaType = { id: "1", username: "Alice" };
  const user2: UserSchemaType = { id: "2", username: "Bob" };
  const msg1: ChatEventSchemaType = {
    id: 1,
    type: "message",
    message: "Hello",
    sender_id: "123",
    created_at: 1,
  };
  const msg2: ChatEventSchemaType = {
    id: 2,
    type: "message",
    message: "Hi",
    sender_id: "456",
    created_at: 2,
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
});
