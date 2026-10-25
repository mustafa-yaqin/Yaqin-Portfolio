// بررسی ورودی‌ها (بدون کتابخانه). هر تابع یا داده‌ی تمیز برمی‌گرداند یا HttpError 400 پرتاب می‌کند.
import { HttpError } from "./http.js";

const bad = (message) => {
  throw new HttpError(400, message);
};

function text(value, name, { min = 0, max = 500 } = {}) {
  if (value === undefined || value === null) value = "";
  if (typeof value !== "string") bad(`${name} must be a string`);
  const v = value.trim();
  if (v.length < min) bad(`${name} is required`);
  if (v.length > max) bad(`${name} is too long (max ${max})`);
  return v;
}

function list(value, name, { maxItems = 12, maxLen = 200 } = {}) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) bad(`${name} must be a list`);
  if (value.length > maxItems) bad(`${name} has too many items (max ${maxItems})`);
  return value.map((item) => text(item, name, { max: maxLen })).filter(Boolean);
}

// فقط http و https (جلوی javascript: در href را می‌گیرد)
function url(value, name) {
  const v = text(value, name, { max: 500 });
  if (!v) return "";
  let parsed;
  try {
    parsed = new URL(v);
  } catch {
    bad(`${name} is not a valid URL`);
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") bad(`${name} must start with http:// or https://`);
  return v;
}

// عکس: یا آپلودشده در همین بک‌اند، یا فایل داخل public/images، یا لینک https
function image(value) {
  const v = text(value, "image", { max: 300 });
  if (!v) return "";
  if (/^\/uploads\/[a-f0-9]{24}\.(png|jpg|gif|webp)$/.test(v)) return v;
  if (/^\.\/images\/[\w./-]+$/.test(v) && !v.includes("..")) return v;
  return url(v, "image");
}

function lang(value, name) {
  if (!value || typeof value !== "object") bad(`${name} is required`);
  return {
    title: text(value.title, `${name}.title`, { min: 1, max: 120 }),
    text: text(value.text, `${name}.text`, { max: 1000 }),
    features: list(value.features, `${name}.features`),
    tags: list(value.tags, `${name}.tags`, { maxItems: 12, maxLen: 40 }),
    linkText: text(value.linkText, `${name}.linkText`, { max: 60 }),
  };
}

export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function projectInput(body, { creating }) {
  const data = {
    image: image(body.image),
    link: url(body.link, "link"),
    github: url(body.github, "github"),
    published: body.published === undefined ? true : Boolean(body.published),
    fa: lang(body.fa, "fa"),
    en: lang(body.en, "en"),
  };
  if (creating) {
    const id = text(body.id, "id", { min: 2, max: 60 });
    if (!SLUG.test(id)) bad("id must be lowercase English letters, digits and dashes (like my-project)");
    data.id = id;
  }
  return data;
}

export function skillInput(body) {
  return {
    name_fa: text(body.name_fa, "name_fa", { min: 1, max: 60 }),
    name_en: text(body.name_en, "name_en", { min: 1, max: 60 }),
  };
}

export function contactInput(body) {
  const email = text(body.email, "email", { min: 3, max: 150 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad("email is not valid");
  return {
    name: text(body.name, "name", { min: 1, max: 100 }),
    email,
    message: text(body.message, "message", { min: 5, max: 3000 }),
  };
}

export function idList(body) {
  if (!Array.isArray(body.ids) || body.ids.length > 500) bad("ids must be a list");
  return body.ids;
}

export { text };
