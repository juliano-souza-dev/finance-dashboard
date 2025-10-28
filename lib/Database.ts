import Database, { Database as DatabaseType } from "better-sqlite3";
import path from "path";
import fs from "fs";

//
// 🧩 Define o caminho do banco de forma compatível
//
const isProd = process.env.NODE_ENV === "production";

// Em produção → usa o diretório temporário da Vercel (/tmp)
const dataDir = isProd ? "/tmp" : path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "cache.db");

// Garante que o diretório exista (sincronamente, mais seguro no serverless)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 🔒 Cria o banco
const db: DatabaseType = new Database(dbPath);

// 🧱 Tabelas
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    date TEXT,
    description TEXT,
    category TEXT,
    value REAL,
    type TEXT,
    status TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS sync_info (
    id INTEGER PRIMARY KEY CHECK(id=1),
    last_sync INTEGER
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT
  )
`).run();

export default db;
export type { DatabaseType };
