// Service Worker: سایت را در مرورگر ذخیره می‌کند تا با اینترنت ضعیف سریع باز شود و با اینترنت قطع هم کار کند.
// بعد از تغییرات بزرگ، عدد VERSION را عوض کنید تا ذخیره قدیمی پاک شود.
const VERSION = "v2";
const CACHE = "yaqin-" + VERSION;

// فایل‌هایی که همان اولین بار ذخیره می‌شوند (بقیه فایل‌ها هنگام دیدن سایت ذخیره می‌شوند)
const START_FILES = ["./", "./logo.jpg", "./photo.jpg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(START_FILES)).then(() => self.skipWaiting()));
});

// ذخیره‌های نسخه‌های قدیمی را پاک می‌کند
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// جواب را در ذخیره می‌گذارد (فقط جواب‌های سالم)
async function save(request, response) {
  if (response && (response.ok || response.type === "opaque")) {
    const cache = await caches.open(CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  // درخواست گیت‌هاب و API بک‌اند را خود سایت مدیریت می‌کند (پشتیبانشان داخل برنامه است، نه در این ذخیره)
  if (url.hostname === "api.github.com" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/uploads/")) return;

  const sameSite = url.origin === self.location.origin;
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameSite && !isFont) return;

  // ۱) خود صفحه: اول اینترنت (تا نسخه تازه بیاید). اگر ضعیف یا قطع بود، نسخه ذخیره‌شده
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cached = await caches.match("./");
        const network = fetch(request).then((response) => save("./", response));
        // بار اول (ذخیره‌ای نیست): فقط منتظر اینترنت می‌مانیم
        if (!cached) return network;
        // ذخیره هست: اگر اینترنت تا ۴ ثانیه جواب نداد یا قطع بود، ذخیره را نشان بده
        return Promise.race([network, new Promise((_, reject) => setTimeout(reject, 4000))]).catch(() => cached);
      })()
    );
    return;
  }

  // ۲) فایل‌های ساخته‌شده (نامشان با محتوا عوض می‌شود): اول ذخیره، چون هیچ‌وقت تغییر نمی‌کنند
  if (url.pathname.includes("/assets/")) {
    event.respondWith(caches.match(request).then((found) => found || fetch(request).then((response) => save(request, response))));
    return;
  }

  // ۳) بقیه (عکس، فونت): همان لحظه ذخیره را نشان بده و پشت صحنه نسخه تازه را بگیر
  event.respondWith(
    caches.match(request).then((found) => {
      const fresh = fetch(request)
        .then((response) => save(request, response))
        .catch((error) => {
          if (found) return found;
          throw error;
        });
      return found || fresh;
    })
  );
});
