// ارتباط پنل با بک‌اند
import { request, API_URL } from "../../api/client.js";
import { getToken, setToken } from "../../api/adminToken.js";

export { getToken, setToken };

export async function api(path, options = {}) {
  try {
    const data = await request(path, { timeout: 15000, ...options, token: getToken() });
    // هر تغییری (افزودن، ویرایش، حذف) انجام شد، سایت همین لحظه اطلاعات تازه را می‌خواند
    if (options.method && options.method !== "GET" && !path.startsWith("/api/admin/login") && !path.startsWith("/api/admin/messages")) {
      window.dispatchEvent(new Event("portfolio-changed"));
    }
    return data;
  } catch (error) {
    // توکن منقضی یا باطل شده: خروج (پنل خودکار به صفحه‌ی ورود برمی‌گردد)
    if (error.status === 401 && !path.startsWith("/api/admin/login") && !path.startsWith("/api/admin/setup")) setToken("");
    throw error;
  }
}

// آپلود عکس: خود فایل را مستقیم می‌فرستیم و سرور از روی محتوا نوعش را تشخیص می‌دهد
export async function uploadImage(file) {
  const res = await fetch(API_URL + "/api/admin/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/octet-stream" },
    body: file,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) setToken("");
    throw new Error((data && data.error) || `HTTP ${res.status}`);
  }
  return data.url;
}

// آدرس عکس آپلودشده برای پیش‌نمایش
export const imageSrc = (image) => (image && image.startsWith("/uploads/") ? API_URL + image : image);

export const errorText = (error) => {
  if (error.status === 429) return "تعداد تلاش‌ها زیاد بود؛ کمی بعد دوباره امتحان کنید.";
  if (error.status === 401) return "ورود لازم است.";
  if (!error.status) return "ارتباط با سرور برقرار نشد. مطمئن شوید بک‌اند اجرا است (npm start).";
  return error.message;
};
