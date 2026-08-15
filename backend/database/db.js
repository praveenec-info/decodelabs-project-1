// Database connection + schema setup (Pillar 1: The Blueprint)
// Uses Node.js's built-in SQLite module — no native compilation required

const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "tasks.db");
const db = new DatabaseSync(dbPath);

// Schema: single "tasks" table
// id        -> Primary Key, auto-increments
// text      -> NOT NULL (a task must have content)
// priority  -> CHECK constraint (only low/normal/high allowed) — enforced at DB level, not just app level
// done      -> boolean stored as 0/1 (SQLite has no native boolean)
// createdAt -> timestamp, defaults to current time
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high')),
    done INTEGER NOT NULL DEFAULT 0 CHECK(done IN (0, 1)),
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// Seed initial data only if table is empty (avoids duplicate seeds on every restart)
const row = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();
if (row.count === 0) {
  const seed = db.prepare(
    "INSERT INTO tasks (text, priority, done) VALUES (?, ?, ?)"
  );
  seed.run("Walking", "high", 1);
  seed.run("Writing", "normal", 0);
  seed.run("Exercise", "low", 0);
}

module.exports = db;