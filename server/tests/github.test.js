import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { importGithub, pickImage } from "../githubImport.js";

const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(40000)]);
const json = (data) => ({ ok: true, status: 200, json: async () => data });

// گیت‌هاب ساختگی: سه مخزن (یکی با عکس، یکی بی‌عکس، یکی فورک) + یک مخزن که قبلاً در سایت هست
function fakeFetch(url) {
  if (url.includes("/users/tester/repos")) {
    return json([
      { name: "Shop_Site", fork: false, default_branch: "main", html_url: "https://github.com/tester/Shop_Site", description: "A shop", language: "SCSS", topics: ["shop"], homepage: "https://shop.example.com" },
      { name: "no-pics", fork: false, default_branch: "main", html_url: "https://github.com/tester/no-pics", language: "JS" },
      { name: "forked", fork: true, default_branch: "main", html_url: "https://github.com/tester/forked" },
      { name: "already-here", fork: false, default_branch: "main", html_url: "https://github.com/tester/already-here" },
      { name: "tester", fork: false, default_branch: "main", html_url: "https://github.com/tester/tester" },
    ]);
  }
  if (url.includes("/Shop_Site/git/trees")) {
    return json({ tree: [
      { path: "node_modules/x/big.png", type: "blob", size: 90000 },
      { path: "assets/logo.png", type: "blob", size: 40000 },
      { path: "assets/favicon.png", type: "blob", size: 2000 },
      { path: "docs/screenshot.png", type: "blob", size: 40040 },
      { path: "index.html", type: "blob", size: 500 },
    ] });
  }
  if (url.includes("/no-pics/git/trees")) return json({ tree: [{ path: "index.html", type: "blob", size: 500 }, { path: "tiny.png", type: "blob", size: 300 }] });
  if (url.includes("raw.githubusercontent.com/tester/Shop_Site/main/docs/screenshot.png")) return { ok: true, status: 200, arrayBuffer: async () => png.buffer.slice(png.byteOffset, png.byteOffset + png.length) };
  return { ok: false, status: 404, json: async () => ({}) };
}

test("picks the screenshot, not the logo/icon/node_modules files", () => {
  const best = pickImage([
    { path: "node_modules/x/big.png", type: "blob", size: 90000 },
    { path: "logo.png", type: "blob", size: 80000 },
    { path: "docs/screenshot.png", type: "blob", size: 60000 },
  ]);
  assert.equal(best.path, "docs/screenshot.png");
  assert.equal(pickImage([{ path: "tiny.png", type: "blob", size: 100 }]), null);
});

test("imports only own, new repos that have an image, and saves the image locally", async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "gh-"));
  const r = await importGithub({ user: "tester", fetchImpl: fakeFetch, outDir: out, existingIds: ["already-here"], descriptions: { Shop_Site: { fa: "فروشگاه", en: "Shop" } } });
  assert.equal(r.total, 5);
  assert.equal(r.added.length, 1);
  const p = r.added[0];
  assert.equal(p.id, "shop-site");
  assert.equal(p.image, "./images/github/shop-site.png");
  assert.equal(p.github, "https://github.com/tester/Shop_Site");
  assert.equal(p.link, "https://shop.example.com");
  assert.equal(p.fa.text, "فروشگاه");
  assert.deepEqual(p.en.tags, ["SCSS", "shop"]);
  assert.ok(fs.existsSync(path.join(out, "shop-site.png")));
  assert.deepEqual(r.skipped.map((s) => s.name).sort(), ["already-here", "forked", "no-pics", "tester"]);
  fs.rmSync(out, { recursive: true, force: true });
});
