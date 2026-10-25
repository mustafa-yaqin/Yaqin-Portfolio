// آوردن پروژه‌های گیت‌هاب که عکس دارند به پورتفولیو:   npm run import-github
// (اینترنت لازم است. اگر خطای rate limit گرفتید، یک GITHUB_TOKEN بدهید.)
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../config.js";
import { importGithub } from "../githubImport.js";
import { GITHUB_USER } from "../../src/data/socials.js";
import { FALLBACK_REPOS } from "../../src/data/repos.js";
import { PROJECTS } from "../../src/data/projects.js";

const file = path.join(ROOT, "src", "data", "projects.github.json");
const current = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
const existingIds = [...PROJECTS.map((p) => p.id), ...current.map((p) => p.id)];
// توضیح فارسی/انگلیسی که قبلاً برای بعضی مخزن‌ها نوشته بودید دوباره استفاده می‌شود
const descriptions = Object.fromEntries(FALLBACK_REPOS.map((r) => [r.name, r.desc]));

console.log(`Looking at github.com/${GITHUB_USER} ...`);
const { added, skipped, total } = await importGithub({
  user: GITHUB_USER,
  outDir: path.join(ROOT, "public", "images", "github"),
  token: process.env.GITHUB_TOKEN,
  existingIds,
  descriptions,
  log: console.log,
});

fs.writeFileSync(file, JSON.stringify([...current, ...added], null, 2) + "\n");
console.log(`\n${total} repositories checked: ${added.length} added, ${skipped.length} skipped.`);
if (added.length) {
  console.log("Next: restart the server (npm run dev) so they appear in the admin panel, then edit titles/descriptions there.");
  console.log("Before deploying run:  npm run export-fallback");
}
