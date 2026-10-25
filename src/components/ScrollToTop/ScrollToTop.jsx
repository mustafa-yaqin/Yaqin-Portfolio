import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// هر بار صفحه عوض شد، صفحه را به بالا می‌برد
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
