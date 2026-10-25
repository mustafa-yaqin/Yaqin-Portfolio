import { useEffect, useState } from "react";
import "./OfflineBanner.css";

// وقتی اینترنت قطع شود، یک نوار کوچک پایین صفحه نشان می‌دهد (سایت همچنان کار می‌کند)
function OfflineBanner({ t }) {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online) return null;
  return (
    <div className="offline-banner" role="status">
      {t.offline}
    </div>
  );
}

export default OfflineBanner;
