import { db } from "./index";

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
