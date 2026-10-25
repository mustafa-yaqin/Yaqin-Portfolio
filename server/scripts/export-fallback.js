// نسخه‌ی پشتیبانِ داخل سایت را از دیتابیس می‌سازد:   npm run export-fallback
// خروجی: src/data/snapshot.json  (+ کپی عکس‌های آپلودشده به public/images/uploads)
// وقتی بک‌اند خاموش باشد، سایت همین فایل را نشان می‌دهد. قبل از هر انتشار فرانت‌اند این را اجرا کنید.
import fs from "node:fs";
import path from "node:path";
import { config, ROOT } from "../config.js";
import { openDb } from "../db.js";
import { createStore } from "../store.js";

const db = openDb(config.dbFile);
const store = createStore(db);

const outImages = path.join(ROOT, "public", "images", "uploads");
fs.mkdirSync(outImages, { recursive: true });

// عکس‌های آپلودشده روی بک‌اند هستند و با خاموش شدنش نمی‌آیند؛ پس به فایل‌های خود سایت کپی می‌شوند
const localImage = (image) => {
  if (!image.startsWith("/uploads/")) return image;
  const name = path.basename(image);
  const from = path.join(config.uploadDir, name);
  if (!fs.existsSync(from)) return "";
  fs.copyFileSync(from, path.join(outImages, name));
  return `./images/uploads/${name}`;
};

const projects = store.listProjects({ onlyPublished: true }).map(({ published, sort, ...p }) => ({ ...p, image: localImage(p.image) }));
const skills = store.listSkills().map((s) => ({ id: s.id, fa: s.name_fa, en: s.name_en }));

// عکس‌های آپلودی که دیگر در هیچ پروژه‌ای نیستند پاک می‌شوند تا پوشه سنگین نشود
const keep = new Set(projects.map((p) => path.basename(p.image)));
for (const file of fs.readdirSync(outImages)) if (!keep.has(file)) fs.rmSync(path.join(outImages, file));

if (projects.length === 0 && !process.argv.includes("--allow-empty")) {
  console.error("No published projects in the database. Refusing to overwrite the snapshot (use --allow-empty to force).");
  process.exit(1);
}

fs.writeFileSync(
  path.join(ROOT, "src", "data", "snapshot.json"),
  JSON.stringify({ exportedAt: new Date().toISOString(), projects, skills }, null, 2) + "\n",
);
console.log(`Snapshot saved: ${projects.length} projects, ${skills.length} skills.`);
db.close();
