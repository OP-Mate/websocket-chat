import { db } from "./index";
import { MessageSchemaType, RoomSchemaType } from "chat-shared";
import { randomUUID } from "crypto";
import { UUIDType } from "src/types";

interface SqliteError extends Error {
  code?: string;
  error?: number;
}

interface IAddMessageDB {
  id: number;
  message: string;
  sender_id: string;
  created_at: number;
  chat_room_id: number;
}

export function addUserToDB(username: string, hashedPassword: string) {
  const id = randomUUID();

  try {
    const stmt = db.prepare(
      `INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)`
    );
    stmt.run(id, username, hashedPassword);
    return { success: true, id, username };
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as SqliteError).code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return { success: false, error: "USERNAME_TAKEN", id, username };
    }
    throw err;
  }
}

export function getAllUsersDB(userId: string) {
  const stmt = db.prepare(
    `SELECT id, username, is_online FROM users WHERE id != ?`
  );

  const info = stmt.all(userId);

  return info;
}

export function addMessageDB(
  senderId: string,
  message: string,
  roomId: number
) {
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
    return {
      id: row.id,
      message: row.message,
      roomId: row.chat_room_id,
      created_at: row.created_at,
      sender_id: row.sender_id,
    } as Omit<MessageSchemaType, "type">;
  } catch {
    // todo
  }
}

export function getMessagesByRoomIdDB(roomId: string) {
  const stmt = db.prepare("SELECT * FROM messages WHERE chat_room_id = ?");
  return stmt.all(roomId);
}

export function getAllPublicRooms() {
  const stmt = db.prepare(
    "SELECT id, name FROM chat_rooms WHERE is_private = 0"
  );

  return stmt.all();
}

export function addRoom(name: string | null, isPrivateFlag: 0 | 1 = 0) {
  const stmt = db.prepare(
    "INSERT INTO chat_rooms (name, is_private) VALUES (?, ?)"
  );

  const info = stmt.run(name, isPrivateFlag);

  const row = db
    .prepare("SELECT id, name FROM chat_rooms WHERE id = ?")
    .get(info.lastInsertRowid);

  return row as RoomSchemaType;
}

interface User {
  password_hash: string;
  username: string;
  id: UUIDType;
}

export function findUser(username: string) {
  const stmt = db.prepare(
    `SELECT id, username, password_hash FROM users WHERE username = ?`
  );
  return stmt.get(username) as User;
}

export function addChatRoomUser(chatRoomId: number, userId: string) {
  const stmt = db.prepare(
    `INSERT INTO chat_room_users (chat_room_id, user_id) VALUES(?, ?)`
  );

  const info = stmt.run(chatRoomId, userId);

  return info;
}

export function chatRoomUser(chatRoomId: number, userId: string) {
  const stmt = db.prepare(`
    SELECT * from chat_room_users WHERE id = ? & user_id = ?  `);

  const info = stmt.run(chatRoomId, userId);

  return info;
}

export function getUserIdsByChatRoomId(chatRoomId: number): string[] {
  const stmt = db.prepare(
    `SELECT user_id FROM chat_room_users WHERE chat_room_id = ?`
  );
  const rows = stmt.all(chatRoomId) as Array<{ user_id: string }>;
  return rows.map((row) => row.user_id);
}

export function getIsChatRoomPrivate(chatRoomId: number): boolean {
  const row = db
    .prepare("SELECT is_private FROM chat_rooms WHERE id = ?")
    .get(chatRoomId) as { is_private?: 0 | 1 } | undefined;

  return row?.is_private === 1;
}

export function findPrivateRoomWithMessages(
  userA: string,
  userB: string
): { id: number; messages: Omit<MessageSchemaType, "type">[] } | null {
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
    .get(userA, userB);

  if (!row?.id) return null;

  const messages = db
    .prepare(
      "SELECT id, message, sender_id, created_at FROM messages WHERE chat_room_id = ?"
    )
    .all(row.id) as Omit<MessageSchemaType, "type">[];

  return { id: row.id, messages };
}
