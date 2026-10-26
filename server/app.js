// مسیرهای API و سرور HTTP
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { HttpError, readBody, readJson, send, sendCached, applyCors, clientIp } from "./http.js";
import { hashPassword, verifyPassword, DUMMY_HASH, signToken, verifyToken, createLimiter } from "./auth.js";
import { createStore } from "./store.js";
import { serveStatic } from "./static.js";
import { projectInput, skillInput, contactInput, idList } from "./validate.js";

const MINUTE = 60_000;
const IMAGE_TYPES = [
  { ext: "png", test: (b) => b.length > 8 && b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])) },
  { ext: "jpg", test: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: "gif", test: (b) => b.length > 6 && b.subarray(0, 4).toString("latin1") === "GIF8" },
  { ext: "webp", test: (b) => b.length > 12 && b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP" },
];
const MIME = { png: "image/png", jpg: "image/jpeg", gif: "image/gif", webp: "image/webp" };

export function createApp({ db, config }) {
  const store = createStore(db);
  const limiter = createLimiter();
  fs.mkdirSync(config.uploadDir, { recursive: true });

  // کش جواب‌های عمومی. با هر تغییر در پنل پاک می‌شود
  const cache = new Map();
  const remember = (key, build) => {
    if (!cache.has(key)) cache.set(key, build());
    return cache.get(key);
  };
  const invalidate = () => cache.clear();

  // ---------- مسیرها ----------
  const routes = [];
  const route = (method, pattern, handler, { admin = false } = {}) => {
    const keys = [];
    const regex = new RegExp("^" + pattern.replace(/:(\w+)/g, (_, k) => (keys.push(k), "([^/]+)")) + "/?$");
    routes.push({ method, regex, keys, handler, admin });
  };

  const baseUrl = (req) => {
    if (config.publicUrl) return config.publicUrl;
    const proto = (config.trustProxy && req.headers["x-forwarded-proto"]) || "http";
    return `${proto}://${req.headers.host}`;
  };
  const absolutize = (base, p) => ({ ...p, image: p.image.startsWith("/uploads/") ? base + p.image : p.image });
  const publicProject = (base, p) => {
    const { published, sort, ...rest } = absolutize(base, p);
    return rest;
  };

  // ===== عمومی (فقط‌خواندنی) =====
  route("GET", "/api/health", (c) => send(c.res, 200, { ok: true }, { "Cache-Control": "no-store" }));

  route("GET", "/api/projects", (c) => {
    const base = baseUrl(c.req);
    const data = remember("projects:" + base, () => ({
      projects: store.listProjects({ onlyPublished: true }).map((p) => publicProject(base, p)),
    }));
    sendCached(c.req, c.res, data, "public, max-age=60, stale-while-revalidate=86400");
  });

  route("GET", "/api/skills", (c) => {
    const data = remember("skills", () => ({
      skills: store.listSkills().map((s) => ({ id: s.id, fa: s.name_fa, en: s.name_en })),
    }));
    sendCached(c.req, c.res, data, "public, max-age=60, stale-while-revalidate=86400");
  });

  route("POST", "/api/visit", (c) => {
    if (!c.limit("visit", 30, 60 * MINUTE)) return;
    store.addVisit();
    send(c.res, 204, "", { "Cache-Control": "no-store" });
  });

  route("POST", "/api/contact", async (c) => {
    if (!c.limit("contact", 5, 60 * MINUTE)) return;
    const body = await readJson(c.req, 20 * 1024);
    // فیلد مخفی «website»: آدم‌ها آن را نمی‌بینند، ربات‌ها پر می‌کنند. پیام ربات بی‌صدا دور ریخته می‌شود
    if (typeof body.website === "string" && body.website.trim() !== "") return send(c.res, 200, { ok: true });
    store.addMessage(contactInput(body));
    send(c.res, 201, { ok: true });
  });

  // عکس‌های آپلودشده (اسم فایل تصادفی است؛ فقط همین الگو پذیرفته می‌شود تا کسی از پوشه بیرون نرود)
  route("GET", "/uploads/:file", (c) => {
    const m = /^([a-f0-9]{24})\.(png|jpg|gif|webp)$/.exec(c.params.file);
    if (!m) throw new HttpError(404, "Not found");
    const file = path.join(config.uploadDir, c.params.file);
    if (!fs.existsSync(file)) throw new HttpError(404, "Not found");
    const data = fs.readFileSync(file);
    send(c.res, 200, data, { "Content-Type": MIME[m[2]], "Cache-Control": "public, max-age=31536000, immutable" });
  });

  // ===== اولین راه‌اندازی: ساخت حساب ادمین از داخل مرورگر =====
  // فقط وقتی هیچ ادمینی وجود ندارد کار می‌کند و کد راه‌اندازی (که فقط در لاگ سرور چاپ می‌شود) لازم دارد
  route("GET", "/api/admin/status", (c) => send(c.res, 200, { needsSetup: !store.getAdmin() }, { "Cache-Control": "no-store" }));

  route("POST", "/api/admin/setup", async (c) => {
    c.limit("setup", 10, 15 * MINUTE);
    if (store.getAdmin()) throw new HttpError(403, "Admin already exists");
    const body = await readJson(c.req, 4 * 1024);
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const code = Buffer.from(typeof body.code === "string" ? body.code.trim() : "");
    const real = Buffer.from(config.setupCode || "");
    if (!real.length || code.length !== real.length || !crypto.timingSafeEqual(code, real)) throw new HttpError(403, "Wrong setup code");
    if (!/^[\w.-]{3,40}$/.test(username)) throw new HttpError(400, "Username must be 3-40 characters: letters, digits, _ . -");
    if (password.length < 10) throw new HttpError(400, "Password must be at least 10 characters");
    const hash = await hashPassword(password);
    if (store.getAdmin()) throw new HttpError(403, "Admin already exists"); // کس دیگری همزمان زودتر بود
    const version = store.setAdmin(username, hash);
    store.setMeta("setup_code", ""); // کد دیگر لازم نیست
    const expiresAt = Date.now() + config.tokenTtlMs;
    send(c.res, 201, { token: signToken({ sub: "admin", v: version, exp: expiresAt }, config.secret), expiresAt });
  });

  // ===== ورود ادمین =====
  route("POST", "/api/admin/login", async (c) => {
    if (!c.limit("login", 8, 15 * MINUTE)) return;
    if (!limiter.check("login-all", 60, 15 * MINUTE).ok) throw new HttpError(429, "Too many login attempts, try again later");
    const body = await readJson(c.req, 4 * 1024);
    const admin = store.getAdmin();
    const username = typeof body.username === "string" ? body.username : "";
    const password = typeof body.password === "string" ? body.password : "";
    const okUser = !!admin && username === admin.username;
    const okPass = await verifyPassword(password, okUser ? admin.pass_hash : DUMMY_HASH);
    if (!okUser || !okPass) throw new HttpError(401, "Wrong username or password");
    limiter.reset(`login:${c.ip}`);
    const expiresAt = Date.now() + config.tokenTtlMs;
    const token = signToken({ sub: "admin", v: admin.token_version, exp: expiresAt }, config.secret);
    send(c.res, 200, { token, expiresAt }, { "Cache-Control": "no-store" });
  });

  // ===== ادمین (همه پشت توکن) =====
  const admin = (method, pattern, handler) => route(method, pattern, handler, { admin: true });

  admin("GET", "/api/admin/me", (c) => send(c.res, 200, { username: c.admin.username }));

  admin("POST", "/api/admin/password", async (c) => {
    const body = await readJson(c.req, 4 * 1024);
    const current = typeof body.current === "string" ? body.current : "";
    const next = typeof body.next === "string" ? body.next : "";
    if (!(await verifyPassword(current, c.admin.pass_hash))) throw new HttpError(403, "Current password is wrong");
    if (next.length < 10) throw new HttpError(400, "New password must be at least 10 characters");
    const version = store.setAdmin(c.admin.username, await hashPassword(next));
    const expiresAt = Date.now() + config.tokenTtlMs;
    send(c.res, 200, { token: signToken({ sub: "admin", v: version, exp: expiresAt }, config.secret), expiresAt });
  });

  admin("GET", "/api/admin/stats", (c) => send(c.res, 200, store.stats(), { "Cache-Control": "no-store" }));

  // پروژه‌ها
  admin("GET", "/api/admin/projects", (c) => send(c.res, 200, { projects: store.listProjects({ onlyPublished: false }) }, { "Cache-Control": "no-store" }));
  admin("POST", "/api/admin/projects", async (c) => {
    const project = store.createProject(projectInput(await readJson(c.req), { creating: true }));
    invalidate();
    send(c.res, 201, { project });
  });
  admin("PUT", "/api/admin/projects/order", async (c) => {
    store.reorder("projects", idList(await readJson(c.req)).map(String), "id");
    invalidate();
    send(c.res, 200, { ok: true });
  });
  admin("PUT", "/api/admin/projects/:id", async (c) => {
    const old = store.getProject(c.params.id);
    if (!old) throw new HttpError(404, "Project not found");
    const project = store.updateProject(c.params.id, projectInput(await readJson(c.req), { creating: false }));
    if (old.image !== project.image) removeUnusedUpload(old.image);
    invalidate();
    send(c.res, 200, { project });
  });
  admin("DELETE", "/api/admin/projects/:id", (c) => {
    const old = store.getProject(c.params.id);
    store.deleteProject(c.params.id);
    if (old) removeUnusedUpload(old.image);
    invalidate();
    send(c.res, 200, { ok: true });
  });

  // مهارت‌ها
  admin("GET", "/api/admin/skills", (c) => send(c.res, 200, { skills: store.listSkills() }, { "Cache-Control": "no-store" }));
  admin("POST", "/api/admin/skills", async (c) => {
    const skill = store.createSkill(skillInput(await readJson(c.req)));
    invalidate();
    send(c.res, 201, { skill });
  });
  admin("PUT", "/api/admin/skills/order", async (c) => {
    store.reorder("skills", idList(await readJson(c.req)).map(Number), "id");
    invalidate();
    send(c.res, 200, { ok: true });
  });
  admin("PUT", "/api/admin/skills/:id", async (c) => {
    const skill = store.updateSkill(Number(c.params.id), skillInput(await readJson(c.req)));
    invalidate();
    send(c.res, 200, { skill });
  });
  admin("DELETE", "/api/admin/skills/:id", (c) => {
    store.deleteSkill(Number(c.params.id));
    invalidate();
    send(c.res, 200, { ok: true });
  });

  // پیام‌های تماس
  admin("GET", "/api/admin/messages", (c) => send(c.res, 200, { messages: store.listMessages() }, { "Cache-Control": "no-store" }));
  admin("PATCH", "/api/admin/messages/:id", async (c) => {
    const body = await readJson(c.req, 1024);
    store.setMessageRead(Number(c.params.id), body.is_read !== false);
    send(c.res, 200, { ok: true });
  });
  admin("DELETE", "/api/admin/messages/:id", (c) => {
    store.deleteMessage(Number(c.params.id));
    send(c.res, 200, { ok: true });
  });

  // آپلود عکس: خود فایل (باینری) در بدنه می‌آید، نه فرم چندبخشی. نوع فایل از روی محتوا تشخیص داده می‌شود نه از روی اسمش
  admin("POST", "/api/admin/upload", async (c) => {
    const buffer = await readBody(c.req, config.maxUploadBytes);
    const type = IMAGE_TYPES.find((t) => t.test(buffer));
    if (!type) throw new HttpError(415, "Only PNG, JPEG, GIF and WebP images are accepted");
    const name = `${crypto.randomBytes(12).toString("hex")}.${type.ext}`;
    fs.writeFileSync(path.join(config.uploadDir, name), buffer);
    send(c.res, 201, { url: `/uploads/${name}` });
  });

  function removeUnusedUpload(image) {
    if (!/^\/uploads\/[a-f0-9]{24}\.(png|jpg|gif|webp)$/.test(image || "")) return;
    if (store.imageInUse(image)) return;
    fs.rm(path.join(config.uploadDir, path.basename(image)), { force: true }, () => {});
  }

  // ---------- سرور ----------
  async function handle(req, res) {
    const ip = clientIp(req, config.trustProxy);
    applyCors(req, res, config.allowedOrigins);
    if (req.method === "OPTIONS") {
      return send(res, 204, "", {
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      });
    }
    const { pathname } = new URL(req.url, "http://localhost");
    // خود سایت (فایل‌های dist)؛ هر آدرسی که API یا عکس آپلودی نیست
    if (config.staticDir && (req.method === "GET" || req.method === "HEAD") && !pathname.startsWith("/api/") && !pathname.startsWith("/uploads/")) {
      return serveStatic(req, res, pathname, config.staticDir);
    }
    let matched = null;
    let pathMatched = false;
    for (const r of routes) {
      const m = r.regex.exec(pathname);
      if (!m) continue;
      pathMatched = true;
      if (r.method !== req.method) continue;
      matched = { r, params: Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])) };
      break;
    }
    if (!matched) throw new HttpError(pathMatched ? 405 : 404, pathMatched ? "Method not allowed" : "Not found");

    const ctx = {
      req,
      res,
      ip,
      params: matched.params,
      admin: null,
      limit(name, max, windowMs) {
        const result = limiter.check(`${name}:${ip}`, max, windowMs);
        if (!result.ok) throw new HttpError(429, "Too many requests, try again later", { "Retry-After": String(result.retryAfter) });
        return true;
      },
    };

    if (matched.r.admin) {
      const header = req.headers.authorization || "";
      const payload = verifyToken(header.startsWith("Bearer ") ? header.slice(7) : "", config.secret);
      const row = payload && store.getAdmin();
      if (!row || payload.v !== row.token_version) throw new HttpError(401, "Login required");
      ctx.admin = row;
    }
    await matched.r.handler(ctx);
  }

  return http.createServer((req, res) => {
    handle(req, res).catch((error) => {
      if (res.headersSent) return res.destroy();
      if (error instanceof HttpError) return send(res, error.status, { error: error.message }, error.headers);
      console.error(error);
      send(res, 500, { error: "Server error" });
    });
  });
}

