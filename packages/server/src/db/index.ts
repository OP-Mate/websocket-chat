import Database from "better-sqlite3";
import { createMigration, createSchema } from "./schema";

export const db = new Database("chat.db");

createSchema(db);

createMigration(db);
