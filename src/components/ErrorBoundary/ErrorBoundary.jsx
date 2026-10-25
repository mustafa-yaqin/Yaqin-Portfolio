import { Component } from "react";
import "./ErrorBoundary.css";

// اگر در هر جای سایت خطایی رخ دهد، به‌جای صفحه سفید این پیام دیده می‌شود
class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    const fa = document.documentElement.lang !== "en";
    return (
      <div className="boundary">
        <h2>{fa ? "مشکلی پیش آمد" : "Something went wrong"}</h2>
        <button className="btn btn-main" onClick={() => window.location.reload()}>
          {fa ? "بارگذاری دوباره" : "Reload"}
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
