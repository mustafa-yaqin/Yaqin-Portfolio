// پشتیبان‌گیری از دیتابیس:   npm run backup     (آخرین ۱۴ نسخه نگه داشته می‌شود)
// عکس‌ها داخل پوشه‌ی uploads هستند؛ آن پوشه را هم همراه این نسخه نگه دارید.
import fs from "node:fs";
import path from "node:path";
import { config } from "../config.js";
import { openDb } from "../db.js";

const dir = path.join(config.dataDir, "backups");
fs.mkdirSync(dir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
const file = path.join(dir, `portfolio-${stamp}.db`);

const db = openDb(config.dbFile);
db.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
db.close();

const old = fs.readdirSync(dir).filter((f) => f.endsWith(".db")).sort().slice(0, -14);
old.forEach((f) => fs.rmSync(path.join(dir, f)));
console.log(`Backup saved: ${file}`);
