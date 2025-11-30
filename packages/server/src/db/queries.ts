import { db } from "./index";
import { MessageSchemaType, RoomSchemaType } from "chat-shared";
import { randomUUID } from "crypto";
import { DatabaseResult, IAddMessageDB, SqliteError, User } from "./types";

export function addUserToDB(
  username: string,
  hashedPassword: string
): DatabaseResult<{ id: string; username: string }> {
  const id = randomUUID();

  try {
    const stmt = db.prepare(
      `INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)`
    );
    stmt.run(id, username, hashedPassword);
    return { success: true, data: { id, username } };
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as SqliteError).code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return {
        success: false,
        error: "Username is already taken",
        code: "USERNAME_TAKEN",
      };
    }
    console.error("Database error adding user:", err);
    return {
      success: false,
      error: "Failed to create user account",
    };
  }
}

export function getAllUsersDB(
  userId: string
): DatabaseResult<{ id: string; username: string }[]> {
  try {
    const stmt = db.prepare(`SELECT id, username FROM users WHERE id != ?`);
    const users = stmt.all(userId) as { id: string; username: string }[];
    return { success: true, data: users };
  } catch (err: unknown) {
    console.error("Database error getting users:", err);
    return {
      success: false,
      error: "Failed to retrieve users",
    };
  }
}

export function addMessageDB(
  senderId: string,
  message: string,
  roomId: number
): DatabaseResult<Omit<MessageSchemaType, "type">> {
  try {
    const stmt = db.prepare(
      "INSERT INTO messages (message, sender_id, chat_room_id) VALUES (?, ?, ?)"
    );
    const info = stmt.run(message, senderId, roomId);

    const row = db
      .prepare(
        "SELECT id, message, sender_id, created_at, chat_room_id FROM messages WHERE id = ?"
      )
      .get(info.lastInsertRowid) as IAddMessageDB;

    if (!row) {
      return {
        success: false,
        error: "Failed to retrieve created message",
      };
    }

    return {
      success: true,
      data: {
        id: row.id,
        message: row.message,
        roomId: row.chat_room_id,
        createdAt: row.created_at,
        senderId: row.sender_id,
      },
    };
  } catch (err: unknown) {
    console.error("Database error adding message:", err);
    return {
      success: false,
      error: "Failed to save message",
    };
  }
}

export function getMessagesByRoomIdDB(
  roomId: string
): DatabaseResult<MessageSchemaType[]> {
  try {
    const stmt = db.prepare("SELECT * FROM messages WHERE chat_room_id = ?");
    const messages = stmt.all(roomId) as MessageSchemaType[];
    return { success: true, data: messages };
  } catch (err: unknown) {
    console.error("Database error getting messages:", err);
    return {
      success: false,
      error: "Failed to retrieve messages",
    };
  }
}

export function addRoom(
  name: string | null,
  isPrivateFlag: 0 | 1 = 0
): DatabaseResult<RoomSchemaType> {
  try {
    const stmt = db.prepare(
      "INSERT INTO chat_rooms (name, is_private) VALUES (?, ?)"
    );
    const info = stmt.run(name, isPrivateFlag);

    const row = db
      .prepare("SELECT id, name FROM chat_rooms WHERE id = ?")
      .get(info.lastInsertRowid) as RoomSchemaType;

    if (!row) {
      return {
        success: false,
        error: "Failed to retrieve created room",
      };
    }

    return { success: true, data: row };
  } catch (err: unknown) {
    console.error("Database error adding room:", err);
    return {
      success: false,
      error: "Failed to create room",
    };
  }
}

export function findUser(username: string): DatabaseResult<User | null> {
  try {
    const stmt = db.prepare(
      `SELECT id, username, password_hash FROM users WHERE username = ?`
    );
    const user = stmt.get(username) as User | undefined;
    return { success: true, data: user || null };
  } catch (err: unknown) {
    console.error("Database error finding user:", err);
    return {
      success: false,
      error: "Failed to find user",
    };
  }
}

export function addChatRoomUser(
  chatRoomId: number,
  userId: string
): DatabaseResult<boolean> {
  try {
    const stmt = db.prepare(
      `INSERT INTO chat_room_users (chat_room_id, user_id) VALUES(?, ?)`
    );
    stmt.run(chatRoomId, userId);
    return { success: true, data: true };
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as SqliteError).code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return {
        success: false,
        error: "User already in this room",
        code: "USER_ALREADY_IN_ROOM",
      };
    }
    console.error("Database error adding user to room:", err);
    return {
      success: false,
      error: "Failed to add user to room",
    };
  }
}

export function getUserIdsByChatRoomId(
  chatRoomId: number
): DatabaseResult<string[]> {
  try {
    const stmt = db.prepare(
      `SELECT user_id FROM chat_room_users WHERE chat_room_id = ?`
    );
    const rows = stmt.all(chatRoomId) as Array<{ user_id: string }>;
    const userIds = rows.map((row) => row.user_id);
    return { success: true, data: userIds };
  } catch (err: unknown) {
    console.error("Database error getting user IDs by chat room:", err);
    return {
      success: false,
      error: "Failed to retrieve users in room",
    };
  }
}

export function getIsChatRoomPrivate(
  chatRoomId: number
): DatabaseResult<boolean> {
  try {
    const row = db
      .prepare("SELECT is_private FROM chat_rooms WHERE id = ?")
      .get(chatRoomId) as { is_private?: 0 | 1 } | undefined;

    return { success: true, data: row?.is_private === 1 };
  } catch (err: unknown) {
    console.error("Database error checking if room is private:", err);
    return {
      success: false,
      error: "Failed to check room privacy status",
    };
  }
}

export function findPrivateRoomWithMessages(
  userA: string,
  userB: string
): DatabaseResult<{
  id: number;
  messages: Omit<MessageSchemaType, "type">[];
} | null> {
  try {
    const row = db
      .prepare(
        `
      SELECT r.id
      FROM chat_rooms r
      JOIN chat_room_users cru1 ON cru1.chat_room_id = r.id AND cru1.user_id = ?
      JOIN chat_room_users cru2 ON cru2.chat_room_id = r.id AND cru2.user_id = ?
      WHERE r.is_private = 1
        AND EXISTS (SELECT 1 FROM messages m WHERE m.chat_room_id = r.id)
      LIMIT 1
    `
      )
      .get(userA, userB) as { id: number } | undefined;

    if (!row?.id) {
      return { success: true, data: null };
    }

    const messages = db
      .prepare(
        "SELECT id, message, sender_id, created_at, chat_room_id as roomId FROM messages WHERE chat_room_id = ?"
      )
      .all(row.id) as Omit<MessageSchemaType, "type">[];

    return {
      success: true,
      data: { id: row.id, messages },
    };
  } catch (err: unknown) {
    console.error("Database error finding private room:", err);
    return {
      success: false,
      error: "Failed to find private room",
    };
  }
}

export function getAllPublicRooms(): DatabaseResult<RoomSchemaType[]> {
  try {
    const stmt = db.prepare(
      "SELECT id, name FROM chat_rooms WHERE is_private = 0"
    );
    const rooms = stmt.all() as RoomSchemaType[];
    return { success: true, data: rooms };
  } catch (err: unknown) {
    console.error("Database error getting public rooms:", err);
    return {
      success: false,
      error: "Failed to retrieve public rooms",
    };
  }
}
