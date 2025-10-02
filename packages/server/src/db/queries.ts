import { db } from "./index";
import { MessageSchemaType, RoomSchemaType } from "chat-shared";
import { randomUUID } from "crypto";
import { UUIDType } from "src/types";

interface SqliteError extends Error {
  code?: string;
  errno?: number;
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

export function getAllUsersDB() {
  const stmt = db.prepare(`SELECT id, username FROM users`);
  return stmt.all();
}

export function addMessageDB(
  senderId: string,
  message: string,
  roomId: number
) {
  const stmt = db.prepare(
    "INSERT INTO messages (message, sender_id, chat_room_id) VALUES (?, ?, ?)"
  );
  const info = stmt.run(message, senderId, roomId);
  const row = db
    .prepare(
      "SELECT id, message, sender_id, created_at FROM messages WHERE id = ?"
    )
    .get(info.lastInsertRowid);
  return row as Omit<MessageSchemaType, "type">;
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

export function addRoom(name: string) {
  const stmt = db.prepare(
    "INSERT INTO chat_rooms (name, is_private) VALUES (?, ?)"
  );
  const isPrivateFlag = 0; // default false

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
