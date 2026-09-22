// vivim.vault — migrate.ts (D-432, Ω-0.5)
// Schema migration: dry-run-first, versioned, append-only, rollback-cited.
//
// The law (spec Ω-0.5 §3.3, translated):
//   · Migrations are VERSIONED functions schema.v<N>→v<N+1> in a registry —
//     no anonymous DDL, no ad-hoc ALTERs from call sites.
//   · Dry-run is LAW: `vault.migrate@1` refuses VAULT_MIGRATION_REQUIRES_DRYRUN
//     without a prior ledgered plan row in ns vault.migrate.
//   · Rollback points are CITED: the plan names the version row the migration
//     rolls back to, and execute refuses VAULT_MIGRATION_ROLLBACK_UNCITED when
//     that row does not resolve. History is the backup — the rollback point is
//     a ledgered version row, and v1's implicit genesis is STAMPED EXPLICIT at
//     first migration so every rollback point cites a real row.
//   · Migrations never rewrite history: they add tables/columns and append
//     version rows. Old-shape rows verify forever under their mint-time schema
//     (the merkle walk recomputes their bytes identically — verify@1 stays green).
//
// The first real migration ships here: v1→v2 adds the `vault_meta` key/value
// table (the version/mint-time substrate later waves need).
import type { Database, VaultDB } from "./sql.ts";
import { casGet } from "./cas.ts";
import { appendObject } from "./changelog.ts";
import { canonicalJson, sha256Hex } from "./canon.ts";

/** Kernel namespace: migration plans + version rows + rollback points (retention: forever). */
export const MIGRATION_NS = "vault.migrate";
export const MIGRATION_REQUIRES_DRYRUN = "VAULT_MIGRATION_REQUIRES_DRYRUN";
export const MIGRATION_ROLLBACK_UNCITED = "VAULT_MIGRATION_ROLLBACK_UNCITED";

export interface MigrationStep {
  from: number;
  to: number;
  describe: string;
  /** READ-only census of what this step will touch (rows counted, tables named). */
  census: (db: Database) => Record<string, unknown>;
  /** Idempotent apply: DDL + data moves; NEVER rewrites existing rows. */
  apply: (db: Database) => void;
}

/** The registry. Ordered; exactly one step per version boundary. */
export const MIGRATIONS: MigrationStep[] = [
  {
    from: 1,
    to: 2,
    describe: "add vault_meta (key TEXT PRIMARY KEY, value TEXT) — the version/mint-time substrate; no existing row is touched",
    census: (db) => ({
      tables: (db.query("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name").all() as { name: string }[]).map((r) => r.name),
      changelogRows: (db.query("SELECT COUNT(*) AS c FROM changelog").get() as { c: number }).c,
      objectsRows: (db.query("SELECT COUNT(*) AS c FROM objects").get() as { c: number }).c,
    }),
    apply: (db) => {
      db.exec("CREATE TABLE IF NOT EXISTS vault_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
    },
  },
];

/** The ledgered version row id for a schema version ("version:v2"). */
export function versionRowId(version: number): string {
  return `version:v${version}`;
}

/** The ledgered plan row id for a from→to boundary ("plan:v1-v2"). */
export function planRowId(from: number, to: number): string {
  return `plan:v${from}-v${to}`;
}

function tableExists(db: Database, name: string): boolean {
  return (db.query("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(name)) !== null;
}

/** The current schema version: vault_meta's row when present, else the implicit genesis v1. */
export function currentSchemaVersion(db: Database): number {
  if (!tableExists(db, "vault_meta")) return 1;
  const row = db.query("SELECT value FROM vault_meta WHERE key = 'schema.version'").get() as { value: string } | null;
  return row ? Number(row.value) : 1;
}

function latestRowData(v: VaultDB, ns: string, id: string): Record<string, unknown> | null {
  // read via the objects table + CAS (the read path stays off the write queue)
  const row = v.db.query("SELECT cid FROM objects WHERE ns = ? AND id = ? ORDER BY rev DESC LIMIT 1").get(ns, id) as { cid: string } | null;
  if (!row) return null;
  return casGet(v.dataDir, row.cid) as Record<string, unknown>;
}

/** Does the vault.migrate ns hold this row id at any rev? (resolvable rollback points) */
function rowExists(v: VaultDB, id: string): boolean {
  return (v.db.query("SELECT 1 FROM objects WHERE ns = ? AND id = ? LIMIT 1").get(MIGRATION_NS, id)) !== null;
}

export interface MigrationPlan {
  from: number;
  to: number;
  steps: Array<{ from: number; to: number; describe: string; census: Record<string, unknown> }>;
  rollbackPoint: { ns: string; id: string; stamped: boolean }; // stamped: the genesis stamp this dry-run wrote
  planRowSeq: number; // the changelog seq of the ledgered plan row
}

/**
 * The dry-run (vault.migrate.dryrun@1): census every step, stamp the implicit
 * genesis when needed (so the rollback point cites a REAL row), and ledger the
 * plan. MUST run inside enqueueWrite (it appends the plan row).
 */
export function migrateDryrun(v: VaultDB, opts: { toVersion?: number } = {}): MigrationPlan {
  const db = v.db;
  const from = currentSchemaVersion(db);
  const target = opts.toVersion ?? latestVersion();
  if (target <= from) throw new Error(`vault.migrate.dryrun@1: already at schema v${from}; nothing to plan toward v${target}`);
  const steps: MigrationPlan["steps"] = [];
  let cursor = from;
  while (cursor < target) {
    const step = MIGRATIONS.find((m) => m.from === cursor);
    if (!step) throw new Error(`vault.migrate.dryrun@1: no registered migration v${cursor}→v${cursor + 1} — the registry is the only road (D-432)`);
    steps.push({ from: step.from, to: step.to, describe: step.describe, census: step.census(db) });
    cursor = step.to;
  }
  // the rollback point: the from-version's row. v1 is implicit until the first
  // migration stamps it — the stamp is a LEDGERED append, not a silent insert.
  const rollbackId = versionRowId(from);
  const stamped = !rowExists(v, rollbackId);
  if (stamped) {
    appendObject(v, {
      ns: MIGRATION_NS,
      id: rollbackId,
      data: { version: from, kind: "genesis-stamp", note: `implicit schema v${from} stamped explicit at first migration — every rollback point cites a real row (D-432; spec Ω-0.5 §3.3)`, at: Date.now() },
      meta: null,
      refs: [],
      causationId: `migrate:stamp:v${from}`,
    });
  }
  const planData = {
    kind: "migration-plan",
    from, to: target,
    steps: steps.map((s) => ({ from: s.from, to: s.to, describe: s.describe })),
    census: steps.map((s) => ({ from: s.from, to: s.to, census: s.census })),
    censusDigest: sha256Hex(canonicalJson(steps.map((s) => ({ f: s.from, t: s.to, c: s.census })))),
    rollbackPoint: { ns: MIGRATION_NS, id: rollbackId },
    at: Date.now(),
  };
  const appended = appendObject(v, {
    ns: MIGRATION_NS,
    id: planRowId(from, target),
    data: planData,
    meta: null,
    refs: [{ ns: MIGRATION_NS, id: rollbackId, rev: 1 }],
    causationId: `migrate:plan:v${from}-v${target}`,
  });
  return { from, to: target, steps, rollbackPoint: { ns: MIGRATION_NS, id: rollbackId, stamped }, planRowSeq: appended.seq };
}

export interface MigrationResult {
  from: number;
  to: number;
  applied: number[];
  planRowSeq: number;
  versionRowSeqs: number[];
}

/**
 * The execute (vault.migrate@1). MUST run inside enqueueWrite. Refuses without
 * a ledgered plan (VAULT_MIGRATION_REQUIRES_DRYRUN) and when the plan's
 * rollback point does not resolve (VAULT_MIGRATION_ROLLBACK_UNCITED). Applies
 * each registered step (idempotent DDL), stamps vault_meta, and ledgers a
 * version row per boundary — never rewriting a single existing row.
 */
export function migrate(v: VaultDB, opts: { toVersion?: number } = {}): MigrationResult {
  const db = v.db;
  const from = currentSchemaVersion(db);
  const target = opts.toVersion ?? latestVersion();
  if (target <= from) throw new Error(`vault.migrate@1: already at schema v${from} — nothing to do toward v${target}`);
  const plan = latestRowData(v, MIGRATION_NS, planRowId(from, target));
  if (!plan || plan["kind"] !== "migration-plan") {
    throw new Error(`${MIGRATION_REQUIRES_DRYRUN}: no ledgered plan row ${MIGRATION_NS}/${planRowId(from, target)} — dry-run is law; run vault.migrate.dryrun@1 first (D-432; spec Ω-0.5 §3.3)`);
  }
  const rollbackPoint = plan["rollbackPoint"] as { ns?: string; id?: string } | undefined;
  if (!rollbackPoint || typeof rollbackPoint.id !== "string" || !rowExists(v, rollbackPoint.id)) {
    throw new Error(`${MIGRATION_ROLLBACK_UNCITED}: the plan's rollback point (${String(rollbackPoint?.id)}) does not resolve to a ledgered ${MIGRATION_NS} row — history is the backup; an uncited rollback point is a plan that cannot be undone (D-432)`);
  }
  const applied: number[] = [];
  const versionRowSeqs: number[] = [];
  const planRowSeq = (db.query("SELECT seq FROM changelog WHERE ns = ? AND id = ? ORDER BY seq DESC LIMIT 1").get(MIGRATION_NS, planRowId(from, target)) as { seq: number }).seq;
  let cursor = from;
  while (cursor < target) {
    const step = MIGRATIONS.find((m) => m.from === cursor);
    if (!step) throw new Error(`vault.migrate@1: no registered migration v${cursor}→v${cursor + 1} — the registry is the only road (D-432)`);
    step.apply(db);
    applied.push(step.to);
    const stamped = appendObject(v, {
      ns: MIGRATION_NS,
      id: versionRowId(step.to),
      data: { version: step.to, kind: "version-row", describe: step.describe, rollbackPoint: { ns: MIGRATION_NS, id: versionRowId(step.from) }, planRef: planRowId(from, target), at: Date.now() },
      meta: null,
      refs: [{ ns: MIGRATION_NS, id: planRowId(from, target), rev: 1 }],
      causationId: `migrate:version:v${step.to}`,
    });
    versionRowSeqs.push(stamped.seq);
    db.query("INSERT INTO vault_meta (key, value) VALUES ('schema.version', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(String(step.to));
    cursor = step.to;
  }
  return { from, to: target, applied, planRowSeq, versionRowSeqs };
}

/** The highest version the registry knows. */
export function latestVersion(): number {
  return MIGRATIONS.reduce((acc, m) => Math.max(acc, m.to), 1);
}
