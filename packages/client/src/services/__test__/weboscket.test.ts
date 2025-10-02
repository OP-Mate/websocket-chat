import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import {
  ChatWebSocket,
  type AddMessageFn,
  type AddUserFn,
  type RemoveUserFn,
} from "../websocket.ts";

const uuid = "2203afe3-9230-4fdd-bb7a-8a91a0534cee";

describe("ChatWebSocket", () => {
  let mockWebSocket: {
    send: Mock<() => void>;
    close: Mock<() => void>;
    onmessage: null;
  };
  let addMessage: AddMessageFn;
  let addUser: AddUserFn;
  let removeUser: RemoveUserFn;
  let chatWs: ChatWebSocket;

  beforeEach(() => {
    mockWebSocket = {
      send: vi.fn(),
      close: vi.fn(),
      onmessage: null,
    };
    //@ts-expect-error unit tests
    global.WebSocket = vi.fn(() => mockWebSocket);
    addMessage = vi.fn();
    addUser = vi.fn();
    removeUser = vi.fn();
    chatWs = new ChatWebSocket(
      "ws://localhost:8080",
      addMessage,
      addUser,
      removeUser
    );
    chatWs.init().then();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct url and handlers", () => {
    expect(chatWs.ws).toBe(mockWebSocket);
    expect(typeof chatWs.handleMessage).toBe("function");
    expect(typeof chatWs.sendMessage).toBe("function");
  });

  it.skip("should call addMessage on valid message event", () => {
    const msg = {
      id: 1,
      message: "Hello",
      type: "message",
      created_at: 1,
      sender_id: uuid,
    };
    const event = { data: JSON.stringify(msg) };
    chatWs.handleMessage(event as MessageEvent);
    expect(addMessage).toHaveBeenCalledWith(expect.objectContaining(msg));
  });

  it("should call addUser on valid join event", () => {
    const join = { type: "new_user", user: { id: uuid, username: "A" } };
    const event = { data: JSON.stringify(join) };
    chatWs.handleMessage(event as MessageEvent);
    expect(addUser).toHaveBeenCalledWith([join.user]);
  });

  it("should call removeUser on valid delete event", () => {
    const del = { type: "delete", id: uuid };
    const event = { data: JSON.stringify(del) };
    chatWs.handleMessage(event as MessageEvent);
    expect(removeUser).toHaveBeenCalledWith(uuid);
  });

  it("should log error on invalid JSON", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    chatWs.handleMessage({ data: "{invalid" } as MessageEvent);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("should send message if schemaPayload is valid", async () => {
    const schemaPayload = {
      success: true as const,
      data: {
        type: "message",
        user: "u",
        message: "hi",
        id: uuid,
      },
    };
    await chatWs.sendMessage(schemaPayload);
    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify(schemaPayload.data)
    );
  });

  it("should reject sendMessage if schemaPayload is invalid", async () => {
    const schemaPayload = { success: false, error: "err" };
    // @ts-expect-error testing invalid payload
    await expect(chatWs.sendMessage(schemaPayload)).rejects.toBe("err");
  });

  it.skip("should reject sendMessage if send throws", async () => {
    mockWebSocket.send.mockImplementation(() => {
      throw new Error("fail");
    });
    const schemaPayload = {
      success: true as const,
      data: {
        type: "message",
        user: "u",
        message: "hi",
        id: uuid,
      },
    };
    await expect(chatWs.sendMessage(schemaPayload)).rejects.toThrow("fail");
  });
});
