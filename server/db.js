// دیتابیس SQLite با ماژول داخلی Node (node:sqlite) - بدون نصب هیچ بسته‌ای.
// نیاز به Node نسخه 22.13 یا بالاتر. اگر بعداً خواستید better-sqlite3 بگذارید، فقط همین فایل عوض می‌شود.
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY CHECK (id = 1),      -- فقط یک ردیف: یک ادمین
  username TEXT NOT NULL,
  pass_hash TEXT NOT NULL,
  token_version INTEGER NOT NULL DEFAULT 1,   -- با تغییر رمز بالا می‌رود و ورودهای قبلی باطل می‌شوند
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,                        -- همان id آدرس صفحه جزئیات (مثلا erp)
  image TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  github TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1,
  sort INTEGER NOT NULL DEFAULT 0,
  fa TEXT NOT NULL,                           -- JSON: title, text, features, tags, linkText
  en TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_fa TEXT NOT NULL,
  name_en TEXT NOT NULL,
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS visits (
  day TEXT PRIMARY KEY,                       -- مثل 2026-10-25 (UTC)
  count INTEGER NOT NULL DEFAULT 0
);
`;

export function openDb(file) {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 3000;");
  db.exec(SCHEMA);
  return db;
}

// اجرای چند دستور پشت‌سرهم به‌صورت یکجا (یا همه انجام می‌شوند یا هیچ‌کدام)
export function transaction(db, fn) {
  db.exec("BEGIN");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
