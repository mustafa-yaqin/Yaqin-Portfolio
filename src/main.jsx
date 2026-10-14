import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./style.css";

// HashRouter: آدرس‌ها مثل  #/about  می‌شوند و روی هر میزبانی (مثل GitHub Pages) کار می‌کنند.
// اگر روی سرور خودتان تنظیم دارید، می‌توانید HashRouter را به BrowserRouter تغییر دهید.
ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <App />
  </HashRouter>
);
