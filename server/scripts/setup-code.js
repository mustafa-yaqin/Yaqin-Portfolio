// نشان دادن کد راه‌اندازی (برای ساختن اولین حساب مدیر از داخل مرورگر):   npm run setup-code
import { config } from "../config.js";
import { openDb } from "../db.js";
import { createStore } from "../store.js";
import { getSetupCode } from "../setupCode.js";

const db = openDb(config.dbFile);
const store = createStore(db);
if (store.getAdmin()) console.log("The admin account already exists; no setup code needed. Log in at #/admin.");
else console.log("Setup code:", getSetupCode(store, config.setupCode));
db.close();
