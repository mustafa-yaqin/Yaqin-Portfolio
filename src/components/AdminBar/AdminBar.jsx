import { Link } from "react-router-dom";
import { useAdminToken, setToken } from "../../api/adminToken.js";
import "./AdminBar.css";

// وقتی ادمین وارد شده باشد، بالای کل سایت دیده می‌شود تا هم سایت را ببیند هم سریع تغییرش بدهد
function AdminBar() {
  const token = useAdminToken();
  if (!token) return null;
  return (
    <div className="admin-bar" dir="rtl" lang="fa">
      <b>حالت مدیر</b>
      <Link to="/admin">پنل مدیریت</Link>
      <Link to="/admin?tab=projects&new=1">+ پروژه‌ی تازه</Link>
      <Link to="/admin?tab=messages">پیام‌ها</Link>
      <span className="admin-bar-gap" />
      <button onClick={() => setToken("")}>خروج</button>
    </div>
  );
}

export default AdminBar;
