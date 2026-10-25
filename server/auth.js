// رمز (scrypt)، توکن ورود (HMAC) و محدودکننده‌ی تعداد درخواست. همه با ماژول crypto داخلی Node.
import crypto from "node:crypto";

const scrypt = (password, salt, keylen, opts) =>
  new Promise((resolve, reject) =>
    crypto.scrypt(password, salt, keylen, opts, (err, key) => (err ? reject(err) : resolve(key))),
  );

const N = 16384, R = 8, P = 1, KEYLEN = 64;

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(password, salt, KEYLEN, { N, r: R, p: P });
  return ["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPassword(password, stored) {
  const [kind, n, r, p, salt, hash] = String(stored).split("$");
  if (kind !== "scrypt") return false;
  const expected = Buffer.from(hash, "base64");
  const key = await scrypt(password, Buffer.from(salt, "base64"), expected.length, { N: +n, r: +r, p: +p });
  return crypto.timingSafeEqual(key, expected);
}

// یک هش ساختگی تا زمان پاسخ برای نام کاربری اشتباه هم مثل رمز اشتباه باشد
export const DUMMY_HASH = await hashPassword(crypto.randomBytes(8).toString("hex"));

const b64 = (buf) => Buffer.from(buf).toString("base64url");

export function signToken(payload, secret) {
  const body = b64(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token, secret) {
  if (typeof token !== "string") return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", secret).update(body).digest();
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

// محدودکننده‌ی ساده در حافظه: key (مثلا IP) در هر بازه حداکثر max بار
export function createLimiter() {
  const hits = new Map();
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, v] of hits) if (v.resetAt <= now) hits.delete(key);
  }, 60_000);
  timer.unref();
  return {
    check(key, max, windowMs) {
      const now = Date.now();
      let entry = hits.get(key);
      if (!entry || entry.resetAt <= now) {
        entry = { count: 0, resetAt: now + windowMs };
        hits.set(key, entry);
      }
      entry.count += 1;
      return { ok: entry.count <= max, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
    },
    reset(key) {
      hits.delete(key);
    },
  };
}
