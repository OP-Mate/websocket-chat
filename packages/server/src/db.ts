import Database from "better-sqlite3";
import { MessageSchemaType, RoomSchemaType } from "chat-shared";
import { randomUUID } from "crypto";

interface SqliteError extends Error {
  code?: string;
  errno?: number;
}

const db = new Database("chat.db");
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      is_online BOOLEAN DEFAULT TRUE
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      chat_room_id INTEGER,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id)
    );
    CREATE TABLE IF NOT EXISTS chat_rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      is_private BOOLEAN DEFAULT FALSE,
      created_at INTEGER DEFAULT (strftime('%s','now'))
    );

    INSERT OR IGNORE INTO chat_rooms (name, is_private) VALUES ('Main', False);
`);

export function addUserToDB(username: string) {
  const id = randomUUID();

  try {
    const stmt = db.prepare(`INSERT INTO users (id, username) VALUES (?, ?)`);
    stmt.run(id, username);
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
  console.log("NAME", name);
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
