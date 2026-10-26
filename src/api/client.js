// ارتباط با بک‌اند.
// پیش‌فرض: همان آدرس خود سایت (یک سرور هم سایت را می‌دهد هم API را؛ بدون هیچ تنظیمی).
// اگر سایت جای دیگری است (مثلاً Netlify) و بک‌اند جای دیگر، در .env.local بنویسید VITE_API_URL=https://...
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

// درخواست JSON با مهلت زمانی. اگر سرور جواب ندهد، خطا می‌دهد و سایت از اطلاعات ذخیره‌شده استفاده می‌کند.
export async function request(path, { method = "GET", body, token, timeout = 5000, keepalive = false, cache } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(API_URL + path, {
      method,
      cache,
      signal: controller.signal,
      keepalive,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = res.status === 204 ? null : await res.json().catch(() => null);
    if (!res.ok) {
      const error = new Error((data && data.error) || `HTTP ${res.status}`);
      error.status = res.status;
      throw error;
    }
    // سایت‌های ایستا برای آدرس ناشناخته صفحه‌ی HTML با کد 200 می‌دهند؛ یعنی بک‌اندی در کار نیست
    if (res.status !== 204 && data === null) throw new Error("bad-response");
    return data;
  } finally {
    clearTimeout(timer);
  }
}
