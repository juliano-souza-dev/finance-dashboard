import Database, { Database as DatabaseType } from "better-sqlite3";

import path from "path";
import { promises as fs } from "fs";

const dataDir = path.join(process.cwd(), "data");

await fs.mkdir(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "cache.db");

const db: DatabaseType = new Database(dbPath);

db.prepare(
  `
        CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        date TEXT,
        description TEXT,
        category TEXT,
        value REAL,
        type TEXT,
        status TEXT
)
    `
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS sync_info (
    id INTEGER PRIMARY KEY CHECK(id=1),
    last_sync INTEGER
  )
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT 
  )
`
).run();

export default db;
export type { DatabaseType };
