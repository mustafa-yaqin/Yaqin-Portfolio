// همه داده‌های ثابت سایت از همین‌جا خوانده می‌شوند:  import { TEXT, SOCIALS } from "../../data";
import fa from "./text.fa.js";
import en from "./text.en.js";

export const TEXT = { fa, en };
export { GITHUB_USER, SOCIALS } from "./socials.js";
// پروژه‌ها و مهارت‌های پشتیبان (ساخته‌شده با npm run export-fallback). وقتی بک‌اند خاموش است همین‌ها نشان داده می‌شوند.
// فایل projects.js فقط منبع اولیه برای پر کردن دیتابیس است (npm run seed).
import snapshot from "./snapshot.json";
export const SNAPSHOT = snapshot;
export { FALLBACK_REPOS } from "./repos.js";
