// Data access layer — now backed by SQLite instead of in-memory array
// All queries use parameterized statements (Pillar 4: The Shield — prevents SQL Injection)

const db = require("../database/db");

// Convert SQLite's 0/1 done column into a real boolean for the API response
function toApiFormat(row) {
  if (!row) return row;
  return { ...row, done: !!row.done };
}

module.exports = {
  getAll: () => {
    const rows = db.prepare("SELECT * FROM tasks ORDER BY id ASC").all();
    return rows.map(toApiFormat);
  },

  getById: (id) => {
    const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    return toApiFormat(row);
  },

  create: (data) => {
    // Parameterized query — user input (data.text) is never concatenated into the SQL string
    const stmt = db.prepare(
      "INSERT INTO tasks (text, priority, done) VALUES (?, ?, ?)"
    );
    const result = stmt.run(data.text, data.priority || "normal", 0);
    return module.exports.getById(result.lastInsertRowid);
  },

  update: (id, data) => {
    const existing = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    if (!existing) return null;

    const text = data.text !== undefined ? data.text : existing.text;
    const priority = data.priority !== undefined ? data.priority : existing.priority;
    const done = data.done !== undefined ? (data.done ? 1 : 0) : existing.done;

    db.prepare(
      "UPDATE tasks SET text = ?, priority = ?, done = ? WHERE id = ?"
    ).run(text, priority, done, id);

    return module.exports.getById(id);
  },

  remove: (id) => {
    const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    return result.changes > 0;
  }
};