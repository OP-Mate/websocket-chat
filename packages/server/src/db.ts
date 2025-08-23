import Database from "better-sqlite3";
import { MessageSchemaType } from "chat-shared";

interface SqliteError extends Error {
  code?: string;
  errno?: number;
}

const db = new Database("chat.db");
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s','now'))
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

export function addUserToDB(id: string, username: string) {
  try {
    const stmt = db.prepare(`INSERT INTO users (id, username) VALUES (?, ?)`);
    stmt.run(id, username);
    return { success: true };
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as SqliteError).code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return { success: false, error: "USERNAME_TAKEN" };
    }
    throw err;
  }
}

export function getAllUsersDB() {
  const stmt = db.prepare(`SELECT id, username FROM users`);
  return stmt.all();
}

export function addMessageDB(senderId: string, message: string) {
  const stmt = db.prepare(
    "INSERT INTO messages (message, sender_id) VALUES (?, ?)"
  );
  const info = stmt.run(message, senderId);
  const row = db
    .prepare(
      "SELECT id, message, sender_id, created_at FROM messages WHERE id = ?"
    )
    .get(info.lastInsertRowid);
  return row as MessageSchemaType;
}
