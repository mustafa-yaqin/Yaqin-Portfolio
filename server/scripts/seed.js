// پر کردن دستی دیتابیس (معمولاً لازم نیست؛ سرور بار اول خودش این کار را می‌کند):   npm run seed
// برای پاک کردن و پر کردن دوباره:  npm run seed -- --force
import { config } from "../config.js";
import { openDb } from "../db.js";
import { createStore } from "../store.js";
import { seedAll } from "../seedData.js";

const db = openDb(config.dbFile);
const store = createStore(db);
const force = process.argv.includes("--force");

const existing = store.listProjects({ onlyPublished: false }).length + store.listSkills().length;
if (existing > 0 && !force) {
  console.log("Database already has projects/skills. Nothing changed. (Use --force to replace them.)");
} else {
  if (force) db.exec("DELETE FROM projects; DELETE FROM skills;");
  const r = seedAll(store);
  store.setMeta("seeded", "1");
  console.log(`Seeded ${r.projects} projects and ${r.skills} skills.`);
}
db.close();
