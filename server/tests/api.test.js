import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../db.js";
import { createApp } from "../app.js";
import { createStore } from "../store.js";
import { hashPassword } from "../auth.js";

const ORIGIN = "http://localhost:5173";
let server, base, token, tmp;

const sample = (id = "demo-project", extra = {}) => ({
  id,
  image: "",
  link: "https://example.com",
  github: "https://github.com/mustafa-yaqin/demo",
  published: true,
  fa: { title: "نمونه", text: "متن", features: ["الف", "ب"], tags: ["React"], linkText: "مشاهده" },
  en: { title: "Demo", text: "Text", features: ["A", "B"], tags: ["React"], linkText: "View" },
  ...extra,
});

async function api(method, url, body, { auth = true, headers = {}, raw } = {}) {
  const res = await fetch(base + url, {
    method,
    headers: {
      ...(raw ? {} : body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { status: res.status, json, headers: res.headers, buffer: text };
}

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "yaqin-"));
  const db = openDb(":memory:");
  createStore(db).setAdmin("yaqin", await hashPassword("a-very-long-password"));
  const config = { secret: "x".repeat(40), allowedOrigins: [ORIGIN], publicUrl: "", trustProxy: false, tokenTtlMs: 3600_000, maxUploadBytes: 1024 * 1024, uploadDir: path.join(tmp, "up") };
  server = createApp({ db, config });
  await new Promise((r) => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("public API starts empty and admin routes need login", async () => {
  const r = await api("GET", "/api/projects");
  assert.equal(r.status, 200);
  assert.deepEqual(r.json, { projects: [] });
  assert.equal((await api("GET", "/api/admin/projects")).status, 401);
  assert.equal((await api("GET", "/api/admin/projects", undefined, { headers: { Authorization: "Bearer fake.token" } })).status, 401);
});

test("login: wrong password rejected, right one gives a token", async () => {
  assert.equal((await api("POST", "/api/admin/login", { username: "yaqin", password: "nope" })).status, 401);
  assert.equal((await api("POST", "/api/admin/login", { username: "other", password: "a-very-long-password" })).status, 401);
  const r = await api("POST", "/api/admin/login", { username: "yaqin", password: "a-very-long-password" });
  assert.equal(r.status, 200);
  token = r.json.token;
  assert.equal((await api("GET", "/api/admin/me")).json.username, "yaqin");
});

test("no signup route exists for visitors", async () => {
  for (const url of ["/api/register", "/api/signup", "/api/admin/register", "/api/users"]) {
    assert.equal((await api("POST", url, { username: "x", password: "y" }, { auth: false })).status, 404);
  }
});

test("project CRUD, validation, publish flag and cache invalidation", async () => {
  assert.equal((await api("POST", "/api/admin/projects", sample("Bad Id"))).status, 400);
  assert.equal((await api("POST", "/api/admin/projects", sample("xss", { link: "javascript:alert(1)" }))).status, 400);
  assert.equal((await api("POST", "/api/admin/projects", sample("no-title", { fa: { title: "" } }))).status, 400);

  const created = await api("POST", "/api/admin/projects", sample());
  assert.equal(created.status, 201);
  assert.equal((await api("POST", "/api/admin/projects", sample())).status, 409);

  let pub = await api("GET", "/api/projects", undefined, { auth: false });
  assert.equal(pub.json.projects.length, 1);
  assert.equal(pub.json.projects[0].en.title, "Demo");
  assert.equal("published" in pub.json.projects[0], false);

  // کش باید بعد از ویرایش تازه شود
  const upd = sample("demo-project");
  upd.en.title = "Renamed";
  assert.equal((await api("PUT", "/api/admin/projects/demo-project", upd)).status, 200);
  pub = await api("GET", "/api/projects", undefined, { auth: false });
  assert.equal(pub.json.projects[0].en.title, "Renamed");

  // پیش‌نویس در API عمومی دیده نمی‌شود
  await api("POST", "/api/admin/projects", sample("draft-one", { published: false }));
  pub = await api("GET", "/api/projects", undefined, { auth: false });
  assert.deepEqual(pub.json.projects.map((p) => p.id), ["demo-project"]);
  assert.equal((await api("GET", "/api/admin/projects")).json.projects.length, 2);

  // ترتیب
  assert.equal((await api("PUT", "/api/admin/projects/order", { ids: ["draft-one", "demo-project"] })).status, 200);
  assert.deepEqual((await api("GET", "/api/admin/projects")).json.projects.map((p) => p.id), ["draft-one", "demo-project"]);

  assert.equal((await api("DELETE", "/api/admin/projects/draft-one")).status, 200);
  assert.equal((await api("DELETE", "/api/admin/projects/draft-one")).status, 404);
});

test("public projects are cacheable with ETag and 304", async () => {
  const first = await api("GET", "/api/projects", undefined, { auth: false });
  assert.match(first.headers.get("cache-control"), /max-age=60/);
  const etag = first.headers.get("etag");
  assert.ok(etag);
  const second = await api("GET", "/api/projects", undefined, { auth: false, headers: { "If-None-Match": etag } });
  assert.equal(second.status, 304);
});

test("skills CRUD", async () => {
  const c = await api("POST", "/api/admin/skills", { name_fa: "ری‌اکت", name_en: "React" });
  assert.equal(c.status, 201);
  assert.equal((await api("POST", "/api/admin/skills", { name_fa: "", name_en: "x" })).status, 400);
  assert.deepEqual((await api("GET", "/api/skills", undefined, { auth: false })).json.skills.map((s) => s.en), ["React"]);
  await api("PUT", `/api/admin/skills/${c.json.skill.id}`, { name_fa: "ری‌اکت ۱۸", name_en: "React 18" });
  assert.equal((await api("GET", "/api/skills", undefined, { auth: false })).json.skills[0].en, "React 18");
  assert.equal((await api("DELETE", `/api/admin/skills/${c.json.skill.id}`)).status, 200);
  assert.deepEqual((await api("GET", "/api/skills", undefined, { auth: false })).json.skills, []);
});

test("contact form: stored, validated, honeypot, rate limited", async () => {
  const good = { name: "Ali", email: "ali@example.com", message: "Hello, I need a website." };
  assert.equal((await api("POST", "/api/contact", good, { auth: false })).status, 201);
  assert.equal((await api("POST", "/api/contact", { ...good, email: "bad" }, { auth: false })).status, 400);
  assert.equal((await api("POST", "/api/contact", { ...good, website: "http://spam" }, { auth: false })).status, 200);

  const list = (await api("GET", "/api/admin/messages")).json.messages;
  assert.equal(list.length, 1); // پیام ربات ذخیره نشده
  assert.equal(list[0].is_read, false);
  await api("PATCH", `/api/admin/messages/${list[0].id}`, { is_read: true });
  assert.equal((await api("GET", "/api/admin/messages")).json.messages[0].is_read, true);

  // محدودیت: ۵ ارسال در ساعت (۳ تا قبلاً شمرده شده)
  const statuses = [];
  for (let i = 0; i < 4; i++) statuses.push((await api("POST", "/api/contact", good, { auth: false })).status);
  assert.deepEqual(statuses, [201, 201, 429, 429]);

  assert.equal((await api("DELETE", `/api/admin/messages/${list[0].id}`)).status, 200);
});

test("visit counter", async () => {
  await api("POST", "/api/visit", {}, { auth: false });
  await api("POST", "/api/visit", {}, { auth: false });
  const s = (await api("GET", "/api/admin/stats")).json;
  assert.equal(s.visits.total, 2);
  assert.equal(s.visits.today, 2);
  assert.equal((await api("GET", "/api/admin/stats", undefined, { auth: false })).status, 401);
});

test("image upload checks real file content and size", async () => {
  const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(50)]);
  const ok = await api("POST", "/api/admin/upload", undefined, { raw: png, headers: { "Content-Type": "application/octet-stream" } });
  assert.equal(ok.status, 201);
  assert.match(ok.json.url, /^\/uploads\/[a-f0-9]{24}\.png$/);

  const served = await fetch(base + ok.json.url);
  assert.equal(served.status, 200);
  assert.equal(served.headers.get("content-type"), "image/png");

  const fake = await api("POST", "/api/admin/upload", undefined, { raw: Buffer.from("<script>alert(1)</script>"), headers: { "Content-Type": "image/png" } });
  assert.equal(fake.status, 415);
  const big = await api("POST", "/api/admin/upload", undefined, { raw: Buffer.concat([png, Buffer.alloc(2 * 1024 * 1024)]) });
  assert.equal(big.status, 413);
  assert.equal((await api("POST", "/api/admin/upload", undefined, { raw: png, auth: false })).status, 401);
  assert.equal((await fetch(base + "/uploads/..%2f..%2fetc%2fpasswd")).status, 404);

  // عکس آپلودی در API عمومی به آدرس کامل تبدیل می‌شود و با حذف پروژه پاک می‌شود
  await api("POST", "/api/admin/projects", sample("with-image", { image: ok.json.url }));
  const pub = await api("GET", "/api/projects", undefined, { auth: false });
  assert.equal(pub.json.projects.find((p) => p.id === "with-image").image, base + ok.json.url);
  await api("DELETE", "/api/admin/projects/with-image");
  await new Promise((r) => setTimeout(r, 50));
  assert.equal((await fetch(base + ok.json.url)).status, 404);
});

test("CORS only for allowed origins", async () => {
  const allowed = await api("GET", "/api/projects", undefined, { auth: false, headers: { Origin: ORIGIN } });
  assert.equal(allowed.headers.get("access-control-allow-origin"), ORIGIN);
  const other = await api("GET", "/api/projects", undefined, { auth: false, headers: { Origin: "https://evil.example" } });
  assert.equal(other.headers.get("access-control-allow-origin"), null);
  const pre = await api("OPTIONS", "/api/admin/projects", undefined, { auth: false, headers: { Origin: ORIGIN } });
  assert.equal(pre.status, 204);
});

test("changing the password invalidates the old token", async () => {
  const oldToken = token;
  const r = await api("POST", "/api/admin/password", { current: "a-very-long-password", next: "short" });
  assert.equal(r.status, 400);
  const ok = await api("POST", "/api/admin/password", { current: "a-very-long-password", next: "another-long-password" });
  assert.equal(ok.status, 200);
  token = oldToken;
  assert.equal((await api("GET", "/api/admin/me")).status, 401);
  token = ok.json.token;
  assert.equal((await api("GET", "/api/admin/me")).status, 200);
});

test("login is rate limited", async () => {
  let last;
  for (let i = 0; i < 9; i++) last = await api("POST", "/api/admin/login", { username: "yaqin", password: "wrong" }, { auth: false });
  assert.equal(last.status, 429);
  assert.ok(last.headers.get("retry-after"));
});
