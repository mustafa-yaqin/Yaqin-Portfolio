import { Link } from "react-router-dom";

function NotFound({ t }) {
  return (
    <section className="page">
      <div className="wrap not-found">
        <h2>{t.notFound.title}</h2>
        <Link className="btn btn-main" to="/">{t.notFound.back}</Link>
      </div>
    </section>
  );
}

export default NotFound;
