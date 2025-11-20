import { Database } from "better-sqlite3";

export const createSchema = (db: Database) => {
  db.pragma("foreign_keys = ON");

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
      name TEXT UNIQUE,
      is_private BOOLEAN DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s','now'))
    );

    INSERT OR IGNORE INTO chat_rooms (name, is_private) VALUES ('Main', 0);
`);
};

export const createMigration = (db: Database) => {
  const cols = db.prepare(`PRAGMA table_info(users)`).all() as Array<{
    name: string;
  }>;

  const hasPasswordHash = cols.some((c) => c.name === "password_hash");
  if (!hasPasswordHash) {
    db.exec(`ALTER TABLE users ADD COLUMN password_hash TEXT;`);
  }

  const table = db
    .prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='chat_room_users'`
    )
    .get();
  if (!table) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS chat_room_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_room_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s','now')),
        FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(chat_room_id, user_id)
      );
    `);
  }
};
