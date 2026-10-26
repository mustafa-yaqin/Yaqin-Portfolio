import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../db.js";
import { createApp } from "../app.js";
import { createStore } from "../store.js";
import { seedIfFirstRun } from "../seedData.js";

let server, base, tmp, store;
const post = (url, body, token) =>
  fetch(base + url, { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "yaqin-setup-"));
  fs.mkdirSync(path.join(tmp, "site", "assets"), { recursive: true });
  fs.writeFileSync(path.join(tmp, "site", "index.html"), "<html>SITE</html>");
  fs.writeFileSync(path.join(tmp, "site", "assets", "app-123.js"), "console.log(1)");
  fs.writeFileSync(path.join(tmp, "secret.txt"), "TOP SECRET");
  const db = openDb(":memory:");
  store = createStore(db);
  const config = { secret: "y".repeat(40), allowedOrigins: [], publicUrl: "", trustProxy: false, tokenTtlMs: 3600_000, maxUploadBytes: 1024, uploadDir: path.join(tmp, "up"), staticDir: path.join(tmp, "site"), setupCode: "abc12345" };
  server = createApp({ db, config });
  await new Promise((r) => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => { server.close(); fs.rmSync(tmp, { recursive: true, force: true }); });

test("first run imports the site's projects and skills once", () => {
  const r = seedIfFirstRun(store);
  assert.ok(r.projects >= 8);
  assert.equal(store.listSkills().length, 12);
  const count = store.listProjects({ onlyPublished: false }).length;
  store.deleteProject("erp");
  assert.equal(seedIfFirstRun(store), null); // بعد از پاک کردن دوباره پر نمی‌شود
  assert.equal(store.listProjects({ onlyPublished: false }).length, count - 1);
});

test("admin can be created from the browser only with the setup code, only once", async () => {
  assert.equal((await (await fetch(base + "/api/admin/status")).json()).needsSetup, true);
  assert.equal((await post("/api/admin/setup", { username: "yaqin", password: "a-long-password-1", code: "wrong" })).status, 403);
  assert.equal((await post("/api/admin/setup", { username: "yaqin", password: "short", code: "abc12345" })).status, 400);
  const ok = await post("/api/admin/setup", { username: "yaqin", password: "a-long-password-1", code: "abc12345" });
  assert.equal(ok.status, 201);
  const { token } = await ok.json();
  assert.equal((await fetch(base + "/api/admin/me", { headers: { Authorization: `Bearer ${token}` } })).status, 200);
  assert.equal((await (await fetch(base + "/api/admin/status")).json()).needsSetup, false);
  assert.equal((await post("/api/admin/setup", { username: "evil", password: "another-long-pass", code: "abc12345" })).status, 403);
  assert.equal((await post("/api/admin/login", { username: "yaqin", password: "a-long-password-1" })).status, 200);
});

test("the same server shows the built site and keeps API separate", async () => {
  const home = await fetch(base + "/");
  assert.equal(home.status, 200);
  assert.match(await home.text(), /SITE/);
  const asset = await fetch(base + "/assets/app-123.js");
  assert.match(asset.headers.get("cache-control"), /immutable/);
  assert.equal((await fetch(base + "/missing.png")).status, 404);
  assert.equal((await fetch(base + "/some/page")).status, 200); // مسیر ناشناخته به index.html می‌رود
  assert.equal((await fetch(base + "/..%2fsecret.txt")).status, 404);
  assert.equal((await fetch(base + "/%2e%2e/secret.txt")).status, 404);
  assert.equal((await fetch(base + "/api/nope")).status, 404);
  assert.ok((await (await fetch(base + "/api/projects")).json()).projects.length >= 7);
});

test("setup code stays the same across restarts and is cleared after the admin exists", async () => {
  const { getSetupCode } = await import("../setupCode.js");
  const fresh = createStore(openDb(":memory:"));
  const first = getSetupCode(fresh, "");
  assert.match(first, /^[a-f0-9]{8}$/);
  assert.equal(getSetupCode(fresh, ""), first); // اجرای دوباره‌ی سرور
  assert.equal(getSetupCode(fresh, "mine1234"), "mine1234"); // کد دلخواه از env
  assert.equal(store.getMeta("setup_code"), ""); // در تست قبلی بعد از ساخت ادمین پاک شده
});
