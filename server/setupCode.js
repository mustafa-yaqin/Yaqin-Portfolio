import crypto from "node:crypto";

// کد راه‌اندازی تا وقتی ادمین ساخته نشده ثابت می‌ماند (در دیتابیس ذخیره می‌شود)؛
// پس با خاموش و روشن شدن سرور (مثلاً --watch در npm run dev) عوض نمی‌شود.
export function getSetupCode(store, fromEnv) {
  if (fromEnv) return fromEnv;
  let code = store.getMeta("setup_code");
  if (!code) {
    code = crypto.randomBytes(4).toString("hex");
    store.setMeta("setup_code", code);
  }
  return code;
}
