import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// در حالت توسعه، درخواست‌های /api و /uploads به بک‌اند (npm run server) می‌رود؛ پس نیازی به هیچ تنظیمی نیست
const backend = "http://localhost:8787";
const proxy = { "/api": backend, "/uploads": backend };

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { proxy },
  preview: { proxy },
});
