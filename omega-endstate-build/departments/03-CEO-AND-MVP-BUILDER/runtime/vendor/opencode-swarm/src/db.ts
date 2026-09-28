import { Database } from "bun:sqlite"
import { dirname } from "node:path"
import { mkdirSync } from "node:fs"

export const DEFAULT_DB_PATH = ".swarm/swarm.db"

/** Resolve the swarm DB path for a project directory, honoring OPENCODE_SWARM_DB. */
export function resolveDbPath(projectDir: string): string {
  return process.env.OPENCODE_SWARM_DB ?? `${projectDir}/${DEFAULT_DB_PATH}`
}

/** Open (creating if needed) the swarm database with schema applied. */
export function openDb(path: string): Database {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true })
  const db = new Database(path, { create: true })
  db.exec("PRAGMA journal_mode = WAL")
  db.exec("PRAGMA busy_timeout = 5000")
  db.exec(`
    CREATE TABLE IF NOT EXISTS swarms (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      config_json TEXT NOT NULL,
      status      TEXT NOT NULL DEFAULT 'created',
      created_at  INTEGER NOT NULL,
      updated_at  INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS agents (
      swarm_id   TEXT NOT NULL,
      name       TEXT NOT NULL,
      session_id TEXT,
      status     TEXT NOT NULL DEFAULT 'created',
      result     TEXT,
      cost_usd   REAL NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (swarm_id, name)
    );
    CREATE TABLE IF NOT EXISTS memory (
      swarm_id   TEXT NOT NULL,
      key        TEXT NOT NULL,
      value      TEXT NOT NULL,
      tags       TEXT NOT NULL DEFAULT '[]',
      updated_by TEXT,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (swarm_id, key)
    );
    CREATE TABLE IF NOT EXISTS messages (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      swarm_id     TEXT NOT NULL,
      from_agent   TEXT NOT NULL,
      to_agent     TEXT NOT NULL,
      body         TEXT NOT NULL,
      created_at   INTEGER NOT NULL,
      delivered_at INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_messages_to ON messages (swarm_id, to_agent, delivered_at);
    CREATE INDEX IF NOT EXISTS idx_agents_session ON agents (session_id);
  `)
  migrate(db)
  return db
}

/** Bring pre-existing databases up to the current schema. */
export function migrate(db: Database): void {
  const cols = db.query<{ name: string }, []>(`PRAGMA table_info(agents)`).all().map((c) => c.name)
  if (!cols.includes("cost_usd")) db.exec(`ALTER TABLE agents ADD COLUMN cost_usd REAL NOT NULL DEFAULT 0`)
}
