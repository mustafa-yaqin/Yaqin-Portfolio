// ابزارهای کوچک HTTP: خطا، خواندن بدنه، پاسخ JSON، CORS و ETag
import crypto from "node:crypto";

export class HttpError extends Error {
  constructor(status, message, headers) {
    super(message);
    this.status = status;
    this.headers = headers;
  }
}

export function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let finished = false;
    req.on("data", (chunk) => {
      if (finished) return;
      size += chunk.length;
      if (size > limit) {
        finished = true;
        reject(new HttpError(413, "Payload too large", { Connection: "close" }));
        req.resume();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!finished) {
        finished = true;
        resolve(Buffer.concat(chunks));
      }
    });
    req.on("error", (error) => {
      if (!finished) {
        finished = true;
        reject(error);
      }
    });
  });
}

export async function readJson(req, limit = 100 * 1024) {
  const buffer = await readBody(req, limit);
  if (buffer.length === 0) return {};
  try {
    const data = JSON.parse(buffer.toString("utf8"));
    if (data === null || typeof data !== "object" || Array.isArray(data)) throw new Error();
    return data;
  } catch {
    throw new HttpError(400, "Body must be a JSON object");
  }
}

const SECURITY = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cross-Origin-Resource-Policy": "cross-origin", // عکس‌ها باید روی سایت دیگر (فرانت‌اند) نمایش داده شوند
  "Content-Security-Policy": "default-src 'none'; sandbox",
};

export function send(res, status, data, headers = {}) {
  const body = typeof data === "string" || Buffer.isBuffer(data) ? data : JSON.stringify(data);
  const isJson = typeof data !== "string" && !Buffer.isBuffer(data);
  res.writeHead(status, {
    ...SECURITY,
    ...(isJson ? { "Content-Type": "application/json; charset=utf-8" } : {}),
    "Content-Length": Buffer.byteLength(body),
    ...headers,
  });
  res.end(body);
}

// پاسخ GET با ETag: اگر مرورگر همین نسخه را دارد، 304 (بدون بدنه) برمی‌گردد
export function sendCached(req, res, data, cacheControl) {
  const body = JSON.stringify(data);
  const etag = `"${crypto.createHash("sha1").update(body).digest("base64url")}"`;
  const headers = { ETag: etag, "Cache-Control": cacheControl, "Content-Type": "application/json; charset=utf-8" };
  if (req.headers["if-none-match"] === etag) {
    res.writeHead(304, { ...SECURITY, ...headers });
    return res.end();
  }
  send(res, 200, body, headers);
}

export function applyCors(req, res, allowedOrigins) {
  const origin = req.headers.origin;
  if (!origin) return;
  if (allowedOrigins.includes("*")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
}

export function clientIp(req, trustProxy) {
  if (trustProxy) {
    const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (forwarded) return forwarded;
  }
  return req.socket.remoteAddress || "unknown";
}
