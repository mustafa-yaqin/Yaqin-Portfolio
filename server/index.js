// اجرای بک‌اند (و خود سایت اگر npm run build زده باشید):   npm start
import { config } from "./config.js";
import { openDb } from "./db.js";
import { createStore } from "./store.js";
import { createApp } from "./app.js";
import { seedIfFirstRun } from "./seedData.js";
import { hashPassword } from "./auth.js";
import { getSetupCode } from "./setupCode.js";

const db = openDb(config.dbFile);
const store = createStore(db);

// ۱) بار اول: پروژه‌ها و مهارت‌های فعلی سایت وارد دیتابیس می‌شوند
const seeded = seedIfFirstRun(store);
if (seeded) console.log(`First run: imported ${seeded.projects} projects and ${seeded.skills} skills.`);

// ۲) ادمین: یا از متغیرهای ADMIN_USERNAME / ADMIN_PASSWORD ساخته می‌شود، یا از داخل مرورگر با کد راه‌اندازی
if (!store.getAdmin()) {
  const { ADMIN_USERNAME: user, ADMIN_PASSWORD: pass } = process.env;
  if (user && pass && /^[\w.-]{3,40}$/.test(user) && pass.length >= 10) {
    store.setAdmin(user, await hashPassword(pass));
    console.log(`Admin "${user}" created from environment variables.`);
  } else {
    config.setupCode = getSetupCode(store, config.setupCode);
    console.log("\n  No admin account yet.");
    console.log(`  Open the site at  #/admin  and create it with this setup code:  ${config.setupCode}`);
    console.log("  (To see the code again later:  npm run setup-code)\n");
  }
}

const server = createApp({ db, config });
server.listen(config.port, () => {
  console.log(`Ready on http://localhost:${config.port}` + (config.staticDir ? "  (site + API)" : "  (API only; run `npm run build` to serve the site too)"));
});

// خاموش شدن تمیز (برای Render، Railway و غیره)
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => {
      db.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 5000).unref();
  });
}
