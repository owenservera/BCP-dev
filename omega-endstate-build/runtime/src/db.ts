/**
 * db.ts — SQLite store for the VIVIM end-state team runtime.
 *
 * One file-backed DB in WAL mode, safe for concurrent access from two processes:
 * the opencode plugin (in-process tool calls) and the orchestrator (external).
 *
 * Deviations from the reference implementation, all deliberate (see
 * design/RUNTIME-DESIGN-V1.md §3):
 *   - agents carry workspace / branch / baseSha: concurrent agents must never
 *     share a checkout, so a session cannot exist without an owned worktree.
 *   - agents carry an explicit evidence verdict: CONFIRMED | REFUTED | UNRESOLVED.
 *     UNRESOLVED is a legitimate recorded outcome, not a failure.
 *   - agents carry a receipt path pointing at a committed repository file, so a
 *     run is reconstructable by a fresh Steward and not only from this DB.
 */

import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export type Verdict = "CONFIRMED" | "REFUTED" | "UNRESOLVED";
export type AgentStatus =
  | "allocated"
  | "running"
  | "done"
  | "failed"
  | "blocked";

export interface AgentRecord {
  runId: string;
  name: string;
  sessionId: string | null;
  workspace: string | null;
  branch: string | null;
  baseSha: string | null;
  task: string;
  evidenceBar: string;
  tools: string;
  status: AgentStatus;
  verdict: Verdict | null;
  receipt: string | null;
  error: string | null;
  updatedAt: string;
}

export interface MessageRecord {
  id: number;
  runId: string;
  fromAgent: string;
  toAgent: string;
  body: string;
  createdAt: string;
  deliveredAt: string | null;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS runs (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  configJson   TEXT NOT NULL,
  status       TEXT NOT NULL,
  repoRoot     TEXT NOT NULL,
  createdAt    TEXT NOT NULL,
  updatedAt    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS agents (
  runId        TEXT NOT NULL,
  name         TEXT NOT NULL,
  sessionId    TEXT,
  workspace    TEXT,
  branch       TEXT,
  baseSha      TEXT,
  task         TEXT NOT NULL,
  evidenceBar  TEXT NOT NULL,
  tools        TEXT NOT NULL,
  status       TEXT NOT NULL,
  verdict      TEXT,
  receipt      TEXT,
  error        TEXT,
  updatedAt    TEXT NOT NULL,
  PRIMARY KEY (runId, name)
);

CREATE TABLE IF NOT EXISTS messages (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  runId        TEXT NOT NULL,
  fromAgent    TEXT NOT NULL,
  toAgent      TEXT NOT NULL,
  body         TEXT NOT NULL,
  createdAt    TEXT NOT NULL,
  deliveredAt  TEXT
);

CREATE INDEX IF NOT EXISTS idx_messages_pending
  ON messages (runId, toAgent, deliveredAt);

CREATE TABLE IF NOT EXISTS memory (
  runId        TEXT NOT NULL,
  key          TEXT NOT NULL,
  value        TEXT NOT NULL,
  tags         TEXT,
  updatedBy    TEXT NOT NULL,
  updatedAt    TEXT NOT NULL,
  PRIMARY KEY (runId, key)
);
`;

export class Store {
  private db: Database;

  constructor(path: string) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new Database(path, { create: true });
    // WAL lets the plugin's in-process tool calls and the orchestrator's
    // external writes interleave without a second coordination layer.
    if (path !== ":memory:") this.db.exec("PRAGMA journal_mode = WAL;");
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.db.exec(SCHEMA);
  }

  close(): void {
    this.db.close();
  }

  private now(): string {
    return new Date().toISOString();
  }

  // ---- runs -------------------------------------------------------------

  createRun(
    id: string,
    name: string,
    configJson: string,
    repoRoot: string,
  ): void {
    const t = this.now();
    this.db
      .query(
        `INSERT OR REPLACE INTO runs (id, name, configJson, status, repoRoot, createdAt, updatedAt)
         VALUES (?, ?, ?, 'created', ?, ?, ?)`,
      )
      .run(id, name, configJson, repoRoot, t, t);
  }

  setRunStatus(id: string, status: string): void {
    this.db
      .query(`UPDATE runs SET status = ?, updatedAt = ? WHERE id = ?`)
      .run(status, this.now(), id);
  }

  getRun(id: string):
    | { id: string; name: string; status: string; repoRoot: string }
    | null {
    return (
      (this.db
        .query(`SELECT id, name, status, repoRoot FROM runs WHERE id = ?`)
        .get(id) as { id: string; name: string; status: string; repoRoot: string } | null) ??
      null
    );
  }

  listRuns(): Array<{ id: string; name: string; status: string; updatedAt: string }> {
    return this.db
      .query(`SELECT id, name, status, updatedAt FROM runs ORDER BY updatedAt DESC`)
      .all() as Array<{ id: string; name: string; status: string; updatedAt: string }>;
  }

  // ---- agents -----------------------------------------------------------

  upsertAgent(rec: AgentRecord): void {
    this.db
      .query(
        `INSERT INTO agents
           (runId, name, sessionId, workspace, branch, baseSha, task, evidenceBar,
            tools, status, verdict, receipt, error, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(runId, name) DO UPDATE SET
           sessionId   = excluded.sessionId,
           workspace   = excluded.workspace,
           branch      = excluded.branch,
           baseSha     = excluded.baseSha,
           status      = excluded.status,
           verdict     = excluded.verdict,
           receipt     = excluded.receipt,
           error       = excluded.error,
           updatedAt   = excluded.updatedAt`,
      )
      .run(
        rec.runId,
        rec.name,
        rec.sessionId,
        rec.workspace,
        rec.branch,
        rec.baseSha,
        rec.task,
        rec.evidenceBar,
        rec.tools,
        rec.status,
        rec.verdict,
        rec.receipt,
        rec.error,
        this.now(),
      );
  }

  getAgent(runId: string, name: string): AgentRecord | null {
    return (
      (this.db
        .query(`SELECT * FROM agents WHERE runId = ? AND name = ?`)
        .get(runId, name) as AgentRecord | null) ?? null
    );
  }

  listAgents(runId: string): AgentRecord[] {
    return this.db
      .query(`SELECT * FROM agents WHERE runId = ? ORDER BY name`)
      .all(runId) as AgentRecord[];
  }

  // ---- messages ---------------------------------------------------------

  postMessage(
    runId: string,
    fromAgent: string,
    toAgent: string,
    body: string,
  ): number {
    const r = this.db
      .query(
        `INSERT INTO messages (runId, fromAgent, toAgent, body, createdAt, deliveredAt)
         VALUES (?, ?, ?, ?, ?, NULL)`,
      )
      .run(runId, fromAgent, toAgent, body, this.now());
    return Number(r.lastInsertRowid);
  }

  pendingMessages(runId: string, toAgent: string, limit = 20): MessageRecord[] {
    return this.db
      .query(
        `SELECT * FROM messages
          WHERE runId = ? AND toAgent = ? AND deliveredAt IS NULL
          ORDER BY id ASC LIMIT ?`,
      )
      .all(runId, toAgent, limit) as MessageRecord[];
  }

  markDelivered(ids: number[]): void {
    if (ids.length === 0) return;
    const t = this.now();
    const stmt = this.db.query(
      `UPDATE messages SET deliveredAt = ? WHERE id = ?`,
    );
    for (const id of ids) stmt.run(t, id);
  }

  allMessages(runId: string): MessageRecord[] {
    return this.db
      .query(`SELECT * FROM messages WHERE runId = ? ORDER BY id ASC`)
      .all(runId) as MessageRecord[];
  }

  // ---- shared memory ----------------------------------------------------

  memorySet(
    runId: string,
    key: string,
    value: string,
    updatedBy: string,
    tags?: string,
  ): void {
    this.db
      .query(
        `INSERT INTO memory (runId, key, value, tags, updatedBy, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(runId, key) DO UPDATE SET
           value = excluded.value, tags = excluded.tags,
           updatedBy = excluded.updatedBy, updatedAt = excluded.updatedAt`,
      )
      .run(runId, key, value, tags ?? null, updatedBy, this.now());
  }

  memoryGet(runId: string, key: string): { key: string; value: string } | null {
    return (
      (this.db
        .query(`SELECT key, value FROM memory WHERE runId = ? AND key = ?`)
        .get(runId, key) as { key: string; value: string } | null) ?? null
    );
  }

  /**
   * Substring + tag search only. Vector/semantic search is explicitly out of
   * scope at v1 (design/RUNTIME-DESIGN-V1.md §8).
   */
  memorySearch(
    runId: string,
    query: string,
  ): Array<{ key: string; value: string; updatedBy: string; updatedAt: string }> {
    const like = `%${query.toLowerCase()}%`;
    return this.db
      .query(
        `SELECT key, value, updatedBy, updatedAt FROM memory
          WHERE runId = ?
            AND (lower(key) LIKE ? OR lower(value) LIKE ? OR lower(COALESCE(tags,'')) LIKE ?)
          ORDER BY key`,
      )
      .all(runId, like, like, like) as Array<{
      key: string;
      value: string;
      updatedBy: string;
      updatedAt: string;
    }>;
  }
}
