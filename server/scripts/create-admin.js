// ساخت یا عوض کردن حساب ادمین (تنها حساب سایت):   npm run create-admin
// می‌شود از متغیرهای ADMIN_USERNAME و ADMIN_PASSWORD هم استفاده کرد (برای سرور بدون ترمینال).
import readline from "node:readline";
import { config } from "../config.js";
import { openDb } from "../db.js";
import { createStore } from "../store.js";
import { hashPassword } from "../auth.js";

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) rl._writeToOutput = (s) => s.includes(question) && process.stdout.write(question); // حروف رمز دیده نمی‌شوند
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const username = (process.env.ADMIN_USERNAME || (await ask("Admin username: "))).trim();
const password = process.env.ADMIN_PASSWORD || (await ask("Admin password (min 10 chars): ", true));

if (!/^[\w.-]{3,40}$/.test(username)) {
  console.error("Username must be 3-40 characters: letters, digits, _ . -");
  process.exit(1);
}
if (password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}

const db = openDb(config.dbFile);
createStore(db).setAdmin(username, await hashPassword(password));
console.log(`Admin "${username}" saved. (Any previous login sessions are now invalid.)`);
db.close();
