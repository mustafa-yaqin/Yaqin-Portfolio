// همه پرسش‌های دیتابیس یک‌جا
import { transaction } from "./db.js";
import { HttpError } from "./http.js";

const now = () => new Date().toISOString();

function projectFromRow(r) {
  return {
    id: r.id,
    image: r.image,
    link: r.link,
    github: r.github,
    published: !!r.published,
    sort: r.sort,
    fa: JSON.parse(r.fa),
    en: JSON.parse(r.en),
  };
}

export function createStore(db) {
  return {
    getMeta: (key) => db.prepare("SELECT value FROM meta WHERE key = ?").get(key)?.value,
    setMeta: (key, value) => db.prepare("INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, String(value)),

    // ---------- ادمین ----------
    getAdmin: () => db.prepare("SELECT * FROM admin WHERE id = 1").get(),
    setAdmin(username, passHash) {
      const existing = db.prepare("SELECT token_version FROM admin WHERE id = 1").get();
      if (existing) {
        db.prepare("UPDATE admin SET username = ?, pass_hash = ?, token_version = token_version + 1, updated_at = ? WHERE id = 1").run(username, passHash, now());
      } else {
        db.prepare("INSERT INTO admin (id, username, pass_hash, token_version, updated_at) VALUES (1, ?, ?, 1, ?)").run(username, passHash, now());
      }
      return db.prepare("SELECT token_version FROM admin WHERE id = 1").get().token_version;
    },

    // ---------- پروژه‌ها ----------
    listProjects({ onlyPublished }) {
      const sql = `SELECT * FROM projects ${onlyPublished ? "WHERE published = 1" : ""} ORDER BY sort ASC, created_at ASC`;
      return db.prepare(sql).all().map(projectFromRow);
    },
    getProject(id) {
      const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
      return row ? projectFromRow(row) : null;
    },
    createProject(p) {
      if (this.getProject(p.id)) throw new HttpError(409, "A project with this id already exists");
      const next = db.prepare("SELECT COALESCE(MAX(sort), -1) + 1 AS n FROM projects").get().n;
      db.prepare(
        "INSERT INTO projects (id, image, link, github, published, sort, fa, en, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
      ).run(p.id, p.image, p.link, p.github, p.published ? 1 : 0, next, JSON.stringify(p.fa), JSON.stringify(p.en), now(), now());
      return this.getProject(p.id);
    },
    updateProject(id, p) {
      const info = db
        .prepare("UPDATE projects SET image=?, link=?, github=?, published=?, fa=?, en=?, updated_at=? WHERE id=?")
        .run(p.image, p.link, p.github, p.published ? 1 : 0, JSON.stringify(p.fa), JSON.stringify(p.en), now(), id);
      if (info.changes === 0) throw new HttpError(404, "Project not found");
      return this.getProject(id);
    },
    deleteProject(id) {
      const info = db.prepare("DELETE FROM projects WHERE id = ?").run(id);
      if (info.changes === 0) throw new HttpError(404, "Project not found");
    },
    imageInUse(image) {
      return !!db.prepare("SELECT 1 FROM projects WHERE image = ? LIMIT 1").get(image);
    },
    reorder(table, ids, key) {
      transaction(db, () => {
        const stmt = db.prepare(`UPDATE ${table} SET sort = ? WHERE ${key} = ?`);
        ids.forEach((id, index) => stmt.run(index, id));
      });
    },

    // ---------- مهارت‌ها ----------
    listSkills: () => db.prepare("SELECT id, name_fa, name_en, sort FROM skills ORDER BY sort ASC, id ASC").all(),
    createSkill(s) {
      const next = db.prepare("SELECT COALESCE(MAX(sort), -1) + 1 AS n FROM skills").get().n;
      const info = db.prepare("INSERT INTO skills (name_fa, name_en, sort) VALUES (?,?,?)").run(s.name_fa, s.name_en, next);
      return db.prepare("SELECT id, name_fa, name_en, sort FROM skills WHERE id = ?").get(Number(info.lastInsertRowid));
    },
    updateSkill(id, s) {
      const info = db.prepare("UPDATE skills SET name_fa = ?, name_en = ? WHERE id = ?").run(s.name_fa, s.name_en, id);
      if (info.changes === 0) throw new HttpError(404, "Skill not found");
      return db.prepare("SELECT id, name_fa, name_en, sort FROM skills WHERE id = ?").get(id);
    },
    deleteSkill(id) {
      const info = db.prepare("DELETE FROM skills WHERE id = ?").run(id);
      if (info.changes === 0) throw new HttpError(404, "Skill not found");
    },

    // ---------- پیام‌ها ----------
    addMessage: (m) => db.prepare("INSERT INTO messages (name, email, message, created_at) VALUES (?,?,?,?)").run(m.name, m.email, m.message, now()),
    listMessages: () => db.prepare("SELECT id, name, email, message, is_read, created_at FROM messages ORDER BY id DESC LIMIT 500").all().map((m) => ({ ...m, is_read: !!m.is_read })),
    setMessageRead(id, read) {
      const info = db.prepare("UPDATE messages SET is_read = ? WHERE id = ?").run(read ? 1 : 0, id);
      if (info.changes === 0) throw new HttpError(404, "Message not found");
    },
    deleteMessage(id) {
      const info = db.prepare("DELETE FROM messages WHERE id = ?").run(id);
      if (info.changes === 0) throw new HttpError(404, "Message not found");
    },

    // ---------- بازدید ----------
    addVisit() {
      const day = new Date().toISOString().slice(0, 10);
      db.prepare("INSERT INTO visits (day, count) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET count = count + 1").run(day);
    },
    stats() {
      const total = db.prepare("SELECT COALESCE(SUM(count), 0) AS n FROM visits").get().n;
      const today = db.prepare("SELECT count FROM visits WHERE day = ?").get(new Date().toISOString().slice(0, 10))?.count || 0;
      const last30 = db.prepare("SELECT day, count FROM visits ORDER BY day DESC LIMIT 30").all().reverse();
      const unread = db.prepare("SELECT COUNT(*) AS n FROM messages WHERE is_read = 0").get().n;
      const messages = db.prepare("SELECT COUNT(*) AS n FROM messages").get().n;
      const projects = db.prepare("SELECT COUNT(*) AS n FROM projects").get().n;
      return { visits: { total, today, last30 }, messages: { total: messages, unread }, projects };
    },
  };
}
