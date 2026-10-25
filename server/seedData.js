// داده‌های اولیه‌ی سایت: src/data/projects.js (+ src/data/projects.github.json که npm run import-github می‌سازد)
// و مهارت‌های src/data/text.*.js. پروژه‌های تازه‌ی این فایل‌ها فقط یک بار به دیتابیس اضافه می‌شوند.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { projectInput } from "./validate.js";
import { PROJECTS } from "../src/data/projects.js";
import fa from "../src/data/text.fa.js";
import en from "../src/data/text.en.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function githubProjects() {
  try {
    const list = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "data", "projects.github.json"), "utf8"));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
const allProjects = () => [...PROJECTS, ...githubProjects()];

function toInput(p) {
  // لینک گیت‌هاب در سایت قدیمی داخل «link» بود؛ حالا فیلد جدای خودش را دارد
  const isGithub = (p.link || "").startsWith("https://github.com");
  const strip = (l) => (isGithub ? { ...l, linkText: "" } : l);
  return projectInput(
    { id: p.id, image: p.image, link: isGithub ? "" : p.link, github: isGithub ? p.link : p.github || "", published: true, fa: strip(p.fa), en: strip(p.en) },
    { creating: true },
  );
}

const readIds = (store) => {
  try {
    return JSON.parse(store.getMeta("seeded_ids") || "null");
  } catch {
    return null;
  }
};

function seedSkills(store) {
  fa.skills.forEach((name, i) => store.createSkill({ name_fa: name, name_en: en.skills[i] ?? name }));
  return fa.skills.length;
}

// پر کردن کامل (برای npm run seed -- --force)
export function seedAll(store) {
  const list = allProjects();
  list.forEach((p) => store.createProject(toInput(p)));
  store.setMeta("seeded_ids", JSON.stringify(list.map((p) => p.id)));
  return { projects: list.length, skills: seedSkills(store) };
}

// پروژه‌هایی که تازه به فایل‌های داده اضافه شده‌اند را وارد می‌کند. هر پروژه فقط یک بار:
// اگر ادمین بعداً آن را پاک کرد، با راه‌اندازی دوباره برنمی‌گردد.
export function syncSeed(store) {
  const known = readIds(store) || (store.getMeta("seeded") ? PROJECTS.map((p) => p.id) : []); // نصب‌های قدیمی: پروژه‌های اولیه را «دیده‌شده» حساب کن
  let added = 0;
  for (const p of allProjects()) {
    if (known.includes(p.id)) continue;
    known.push(p.id);
    if (!store.getProject(p.id)) {
      store.createProject(toInput(p));
      added += 1;
    }
  }
  store.setMeta("seeded_ids", JSON.stringify(known));
  return added;
}

// هر بار که سرور بالا می‌آید صدا زده می‌شود
export function seedIfFirstRun(store) {
  const first = !store.getMeta("seeded");
  let skills = 0;
  let projects = 0;
  if (first) {
    const has = store.listProjects({ onlyPublished: false }).length + store.listSkills().length > 0;
    if (has) store.setMeta("seeded_ids", JSON.stringify(allProjects().map((p) => p.id))); // دیتابیس از قبل پر بوده؛ دست نزن
    else {
      store.setMeta("seeded_ids", "[]"); // دیتابیس خالی است: همه‌ی پروژه‌ها در syncSeed وارد می‌شوند
      skills = seedSkills(store);
    }
    store.setMeta("seeded", "1");
  }
  projects = syncSeed(store);
  return first || projects ? { projects, skills } : null;
}
