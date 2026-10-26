import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";
import "./styles/base.css";

// HashRouter: آدرس‌ها مثل  #/about  می‌شوند و روی هر میزبانی (مثل GitHub Pages) کار می‌کنند.
// future: این دو تنظیم هشدار نسخه بعدی React Router را از کنسول برمی‌دارد.
// اگر روی Netlify یا Vercel هستید، می‌توانید HashRouter را به BrowserRouter تغییر دهید.
ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </HashRouter>
  </ErrorBoundary>
);

// ذخیره سایت در مرورگر (فایل public/sw.js): سریع‌تر باز شدن و کار کردن بدون اینترنت. فقط در نسخه نهایی فعال است.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
