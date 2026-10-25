// تنظیمات بک‌اند. همه‌چیز از متغیرهای محیطی (فایل server/.env) خوانده می‌شود.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// فایل .env اگر بود خوانده می‌شود (بدون نیاز به بسته‌ی اضافه؛ از Node 21.7 به بعد)
try {
  process.loadEnvFile(path.join(ROOT, "server", ".env"));
} catch {
  /* فایل .env اجباری نیست */
}

const env = process.env;
const production = env.NODE_ENV === "production";

if (production && (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32)) {
  console.error("SESSION_SECRET must be set (at least 32 characters) when NODE_ENV=production.");
  process.exit(1);
}

// پوشه‌ی سایت ساخته‌شده (npm run build). اگر وجود داشته باشد، همین سرور خود سایت را هم نشان می‌دهد
const builtSite = path.resolve(env.STATIC_DIR || path.join(ROOT, "dist"));

const dataDir = path.resolve(env.DATA_DIR || path.join(ROOT, "server", "data"));

export const config = {
  production,
  port: Number(env.PORT) || 8787,
  staticDir: fs.existsSync(path.join(builtSite, "index.html")) ? builtSite : "",
  // کد یک‌بارمصرف برای ساختن اولین حساب ادمین از داخل مرورگر؛ در لاگ سرور چاپ می‌شود
  setupCode: env.SETUP_CODE || "",
  dataDir,
  dbFile: env.DB_FILE ? path.resolve(env.DB_FILE) : path.join(dataDir, "portfolio.db"),
  uploadDir: env.UPLOAD_DIR ? path.resolve(env.UPLOAD_DIR) : path.join(dataDir, "uploads"),
  // در حالت توسعه اگر SESSION_SECRET نباشد، یک کلید تصادفی ساخته می‌شود (با هر بار اجرا عوض می‌شود)
  secret: env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
  // سایت‌هایی که اجازه دارند API را از مرورگر صدا بزنند. "*" یعنی همه (فقط برای API عمومی مناسب است)
  allowedOrigins: (env.ALLOWED_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  // آدرس عمومی همین بک‌اند (برای ساختن لینک کامل عکس‌ها). اگر خالی باشد از هدر Host ساخته می‌شود
  publicUrl: (env.PUBLIC_URL || "").replace(/\/+$/, ""),
  // پشت پروکسی (Render، Railway، nginx) باید 1 باشد تا IP واقعی بازدیدکننده خوانده شود
  trustProxy: env.TRUST_PROXY === "1",
  tokenTtlMs: 12 * 60 * 60 * 1000,
  maxUploadBytes: 3 * 1024 * 1024,
};
