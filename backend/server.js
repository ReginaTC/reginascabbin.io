import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const PORT = Number(process.env.PORT || 3001);
const DB_DIR = process.env.DB_DIR || path.resolve(process.cwd(), "data");
const DB_FILE = process.env.DB_FILE || path.join(DB_DIR, "guestbook.db");

const MAX_AUTHOR_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 280;

const SEED_MESSAGES = [
  { author: "过路的朋友", message: "这里看起来很适合傍晚来坐坐。" },
  { author: "未来的 Regina", message: "记得继续写，不用每篇都完整。" },
  { author: "雨天读者", message: "客厅里的光很暖，文字也很暖。" },
  { author: "匿名来访", message: "如果哪天更新慢一点，也没关系，我们会等。" }
];

const app = express();
app.use(express.json({ limit: "32kb" }));

let db;

function normalizeAuthor(author) {
  const trimmed = String(author || "").trim();
  if (!trimmed) {
    return "匿名来访";
  }
  return trimmed.slice(0, MAX_AUTHOR_LENGTH);
}

function normalizeMessage(message) {
  const trimmed = String(message || "").trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.slice(0, MAX_MESSAGE_LENGTH);
}

async function initDatabase() {
  await fs.mkdir(DB_DIR, { recursive: true });

  db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
  `);

  const row = await db.get("SELECT COUNT(*) AS count FROM messages");
  if ((row?.count || 0) === 0) {
    const now = new Date().toISOString();
    const stmt = await db.prepare(
      "INSERT INTO messages (author, message, created_at) VALUES (?, ?, ?)"
    );
    try {
      for (const seed of SEED_MESSAGES) {
        await stmt.run(seed.author, seed.message, now);
      }
    } finally {
      await stmt.finalize();
    }
  }
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/messages", async (req, res) => {
  try {
    const rawLimit = Number(req.query.limit || 30);
    const limit = Number.isFinite(rawLimit)
      ? Math.max(1, Math.min(100, Math.floor(rawLimit)))
      : 30;

    const rows = await db.all(
      "SELECT id, author, message, created_at AS createdAt FROM messages ORDER BY id DESC LIMIT ?",
      limit
    );

    res.json({ messages: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load messages." });
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const author = normalizeAuthor(req.body?.author);
    const message = normalizeMessage(req.body?.message);

    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const createdAt = new Date().toISOString();
    const result = await db.run(
      "INSERT INTO messages (author, message, created_at) VALUES (?, ?, ?)",
      author,
      message,
      createdAt
    );

    res.status(201).json({
      message: {
        id: result.lastID,
        author,
        message,
        createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save message." });
  }
});

async function start() {
  await initDatabase();

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`Guestbook API running on http://127.0.0.1:${PORT}`);
    console.log(`DB file: ${DB_FILE}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
