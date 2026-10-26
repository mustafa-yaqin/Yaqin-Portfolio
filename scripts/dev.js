// npm run dev  ->  بک‌اند و سایت را با هم بالا می‌آورد (سایت: http://localhost:5173)
import { spawn } from "node:child_process";

const run = (args) => spawn(process.execPath, args, { stdio: "inherit" });
const children = [run(["--watch", "server/index.js"]), run(["node_modules/vite/bin/vite.js"])];

const stop = () => children.forEach((c) => c.kill());
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
children.forEach((c) => c.on("exit", stop));
