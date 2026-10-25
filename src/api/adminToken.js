import { useEffect, useState } from "react";

// توکن ورود ادمین فقط در همین تب می‌ماند (sessionStorage) و با بستن تب پاک می‌شود
const KEY = "yaqin-admin-token";

export const getToken = () => sessionStorage.getItem(KEY) || "";

export function setToken(token) {
  if (token) sessionStorage.setItem(KEY, token);
  else sessionStorage.removeItem(KEY);
  window.dispatchEvent(new Event("admin-auth"));
}

// برای کامپوننت‌هایی که باید با ورود و خروج ادمین عوض شوند
export function useAdminToken() {
  const [token, setLocal] = useState(getToken);
  useEffect(() => {
    const sync = () => setLocal(getToken());
    window.addEventListener("admin-auth", sync);
    return () => window.removeEventListener("admin-auth", sync);
  }, []);
  return token;
}
