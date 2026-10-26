// نشان دادن خود سایت (پوشه‌ی dist) از همین سرور: یک سرور، یک آدرس، بدون تنظیم CORS
import fs from "node:fs";
import path from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2", ".woff": "font/woff", ".map": "application/json",
};

const statOf = (file) => {
  try {
    return fs.statSync(file);
  } catch {
    return null;
  }
};

export function serveStatic(req, res, pathname, dir) {
  const fail = (status) => {
    res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(status === 404 ? "Not found" : "Bad request");
  };
  let rel;
  try {
    rel = decodeURIComponent(pathname);
  } catch {
    return fail(400);
  }
  if (rel.includes("\0")) return fail(400);

  let file = path.join(dir, path.normalize(rel));
  if (file !== dir && !file.startsWith(dir + path.sep)) return fail(404); // بیرون از پوشه‌ی سایت نمی‌شود رفت
  let stat = statOf(file);
  if (stat?.isDirectory()) {
    file = path.join(file, "index.html");
    stat = statOf(file);
  }
  if (!stat) {
    if (path.extname(rel)) return fail(404); // فایل واقعی (عکس، js) که نیست
    file = path.join(dir, "index.html");
    stat = statOf(file);
    if (!stat) return fail(404);
  }

  const ext = path.extname(file).toLowerCase();
  const cache = rel.startsWith("/assets/")
    ? "public, max-age=31536000, immutable" // نام این فایل‌ها با محتوا عوض می‌شود
    : ext === ".html" || rel === "/sw.js"
      ? "no-cache"
      : "public, max-age=3600";
  res.writeHead(200, {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Content-Length": stat.size,
    "Cache-Control": cache,
    "X-Content-Type-Options": "nosniff",
  });
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(file).pipe(res);
}
