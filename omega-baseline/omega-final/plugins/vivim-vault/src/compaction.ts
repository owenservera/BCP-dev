// vivim.vault — compaction.ts (Ω2, D-432 guarded)
// Moves superseded revisions older than the newest `keep` per id into cold_objects —
// but NEVER a revision referenced by any live object's refs (provenance-required
// revisions survive). CAS blobs are never deleted (append-only), FTS rows of moved
// revisions are dropped (search covers live objects), and changelog is untouched
// (history is immutable — verify() still passes after compaction).
//
// Reads are never blocked: this runs inside the single-writer queue as synchronous
// SQLite work; live read ops execute between statements on the same connection.
//
// D-432 (Ω-0.5) adds the PLAN-DRIVEN path: a dry-run census (every candidate
// named, every referenced blob excluded, digest-pinned) ledgered as a plan row,
// and a guarded execute that RECOMPUTES the census and refuses
// VAULT_COMPACTION_REFERENCED_BLOB if the plan touches any referenced blob —
// the D-410 item-C invariant ("compaction never deletes a revision, period")
// enforced by the machine, before any mutation. The legacy (ns, keep) shape
// keeps its protective-skip semantics for compatibility (as-built note 6).

import { appendObject } from "./changelog.ts";
import { canonicalJson, sha256Hex } from "./canon.ts";
import type { VaultDB } from "./sql.ts";
import { ftsDeleteMany, liveRefs } from "./sql.ts";
import { casGet } from "./cas.ts";

/** Kernel namespace: compaction plans + receipts (retention: compact-shred-90d — rows forever, moved blobs shred at 90 days). */
export const COMPACT_NS = "vault.compact";
export const COMPACTION_REFERENCED_BLOB = "VAULT_COMPACTION_REFERENCED_BLOB";

export interface CompactResult { moved: number; kept: number; protected: number }

export interface CompactionCensus {
  ns: string;
  keep: number;
  candidates: Array<{ id: string; rev: number }>;   // superseded, NOT referenced → eligible
  excluded: Array<{ id: string; rev: number }>;      // superseded BUT referenced → protected
  censusDigest: string;                              // sha256 over the census — staleness detector
  blobBytes: number;                                 // sum of candidate blob sizes (the space estimate)
}

export interface CompactionPlan extends CompactionCensus {
  planRowSeq: number; // the changelog seq of the ledgered plan row
}

/** The census: one pure read that decides eligibility (referenced blobs NEVER eligible). */
export function compactCensus(v: VaultDB, ns: string, keep: number): CompactionCensus {
  if (typeof ns !== "string" || ns.length === 0) throw new Error("vault.compact.dryrun@1: ns must be a non-empty string");
  if (!Number.isInteger(keep) || keep < 1) throw new Error(`vault.compact.dryrun@1: keep must be an integer >= 1 (got ${String(keep)})`);
  const db = v.db;
  const protectedRefs = liveRefs(db);
  const rows = db.query("SELECT id, rev FROM objects WHERE ns = ? ORDER BY id ASC, rev ASC").all(ns) as unknown as { id: string; rev: number }[];
  const byId = new Map<string, number[]>();
  for (const row of rows) {
    const list = byId.get(row.id) ?? [];
    list.push(row.rev);
    byId.set(row.id, list);
  }
  const candidates: Array<{ id: string; rev: number }> = [];
  const excluded: Array<{ id: string; rev: number }> = [];
  let blobBytes = 0;
  for (const [id, revs] of byId) {
    const superseded = revs.slice(0, Math.max(0, revs.length - keep));
    for (const rev of superseded) {
      if (protectedRefs.has(`${ns}|${id}|${rev}`)) { excluded.push({ id, rev }); continue; }
      candidates.push({ id, rev });
      const cid = (db.query("SELECT cid FROM objects WHERE ns = ? AND id = ? AND rev = ?").get(ns, id, rev) as { cid: string }).cid;
      blobBytes += Buffer.byteLength(canonicalJson(casGet(v.dataDir, cid)), "utf-8");
    }
  }
  const censusDigest = sha256Hex(canonicalJson({ ns, keep, candidates, excluded }));
  return { ns, keep, candidates, excluded, censusDigest, blobBytes };
}

function planRowIdOf(census: CompactionCensus): string {
  return `plan:${census.censusDigest.slice(0, 16)}`;
}

/** The candidates a LEDGERED plan row names (read back from the vault, not the caller's word). */
function planCandidatesOf(v: VaultDB, rowId: string, planRef: { ns: string; keep: number }): Array<{ id: string; rev: number }> {
  const cidRow = v.db.query("SELECT cid FROM objects WHERE ns = ? AND id = ? ORDER BY rev DESC LIMIT 1").get(COMPACT_NS, rowId) as { cid: string } | undefined;
  if (!cidRow) return [];
  const data = casGet(v.dataDir, cidRow.cid) as { candidates?: Array<{ id: string; rev: number }> };
  return Array.isArray(data["candidates"]) ? data["candidates"] : [];
}

/**
 * The dry-run (vault.compact.dryrun@1): census + ledgered plan row. MUST run
 * inside enqueueWrite (it appends the plan row). Idempotent per digest — the
 * same census re-dry-runs to the same row.
 */
export function compactDryrun(v: VaultDB, ns: string, keep: number): CompactionPlan {
  const census = compactCensus(v, ns, keep);
  const rowId = planRowIdOf(census);
  const existing = v.db.query("SELECT seq FROM changelog WHERE ns = ? AND id = ? ORDER BY seq DESC LIMIT 1").get(COMPACT_NS, rowId) as { seq: number } | undefined;
  if (existing) return { ...census, planRowSeq: existing.seq };
  const appended = appendObject(v, {
    ns: COMPACT_NS,
    id: rowId,
    data: { kind: "compaction-plan", ns, keep, candidates: census.candidates, excluded: census.excluded, censusDigest: census.censusDigest, blobBytes: census.blobBytes, at: Date.now() },
    meta: null,
    refs: [],
    causationId: `compact:plan:${census.censusDigest.slice(0, 12)}`,
  });
  return { ...census, planRowSeq: appended.seq };
}

export interface GuardedCompactResult {
  moved: number;
  kept: number;
  protected: number;
  receiptRowSeq: number;
  planRowSeq: number;
}

/**
 * The plan-driven execute (vault.compact@1 with a planRef). MUST run inside
 * enqueueWrite. Recomputes the census and refuses — BEFORE any mutation —
 * when the plan is stale (the census changed) or touches a referenced blob
 * (VAULT_COMPACTION_REFERENCED_BLOB, the D-410 item-C machine). The legal
 * execute moves candidates hot→cold, drops their FTS rows, and ledgers the
 * receipt (counts, census digest, reclaimed bytes) in ns vault.compact.
 */
export function compactGuarded(v: VaultDB, planRef: { ns: string; keep: number; censusDigest: string }): GuardedCompactResult {
  if (!planRef || typeof planRef.ns !== "string" || !Number.isInteger(planRef.keep) || typeof planRef.censusDigest !== "string") {
    throw new Error("vault.compact@1 (plan-driven): planRef must name {ns, keep, censusDigest} — the digest is what a vault.compact.dryrun@1 returned (D-432)");
  }
  // the plan row must be LEDGERED (dry-run is law) and must be the LATEST plan for this (ns, keep)
  const rowId = `plan:${planRef.censusDigest.slice(0, 16)}`;
  const planRow = v.db.query("SELECT seq FROM changelog WHERE ns = ? AND id = ? ORDER BY seq DESC LIMIT 1").get(COMPACT_NS, rowId) as { seq: number } | undefined;
  if (!planRow) {
    throw new Error(`vault.compact@1 (plan-driven): no ledgered plan row ${COMPACT_NS}/${rowId} — dry-run is law; run vault.compact.dryrun@1 first (D-432)`);
  }
  // the guard FIRST (the spec's named refusal): a plan candidate that a live
  // object now cites is the crime the machine refuses — BEFORE staleness, so
  // the refusal names the referenced blob even when the census also drifted.
  const protectedNow = liveRefs(v.db);
  for (const c of planCandidatesOf(v, rowId, planRef)) {
    if (protectedNow.has(`${planRef.ns}|${c.id}|${c.rev}`)) {
      throw new Error(`${COMPACTION_REFERENCED_BLOB}: the plan would move ${planRef.ns}/${c.id}@${c.rev} but a live object's refs cite it — compaction never deletes (or moves) a referenced revision; re-run the dry-run, the census excludes it (D-410 item C, D-432)`);
    }
  }
  // recompute the census: the plan must still be the truth
  const now = compactCensus(v, planRef.ns, planRef.keep);
  if (now.censusDigest !== planRef.censusDigest) {
    throw new Error(`vault.compact@1 (plan-driven): plan ${planRef.censusDigest.slice(0, 12)}… is STALE — the census changed since the dry-run (${now.candidates.length} candidates now, digest ${now.censusDigest.slice(0, 12)}…); re-run vault.compact.dryrun@1 (D-432)`);
  }
  // the legal execute: move candidates hot→cold, drop FTS, ledger the receipt
  const db = v.db;
  db.exec("BEGIN IMMEDIATE");
  let moved = 0;
  let kept = 0;
  let protectedCount = now.excluded.length;
  const movedTargets: Array<{ id: string; rev: number }> = [];
  try {
    const ts = Date.now();
    for (const c of now.candidates) {
      db.query(
        "INSERT INTO cold_objects (ns, id, rev, cid, meta, moved_at) SELECT ns, id, rev, cid, meta, ? FROM objects WHERE ns = ? AND id = ? AND rev = ?",
      ).run(ts, planRef.ns, c.id, c.rev);
      db.query("DELETE FROM objects WHERE ns = ? AND id = ? AND rev = ?").run(planRef.ns, c.id, c.rev);
      movedTargets.push(c);
      moved++;
    }
    // kept: the newest `keep` per id still hot
    const hotRows = db.query("SELECT id, COUNT(*) AS c FROM objects WHERE ns = ? GROUP BY id").all(planRef.ns) as unknown as { c: number }[];
    for (const r of hotRows) kept += r.c;
    ftsDeleteMany(db, planRef.ns, movedTargets);
    db.exec("COMMIT");
  } catch (err) {
    try { db.exec("ROLLBACK"); } catch { /* already rolled back */ }
    throw err;
  }
  const receipt = appendObject(v, {
    ns: COMPACT_NS,
    id: `receipt:${planRef.censusDigest.slice(0, 16)}`,
    data: { kind: "compaction-receipt", ns: planRef.ns, keep: planRef.keep, moved, kept, protected: protectedCount, censusDigest: planRef.censusDigest, reclaimedBytes: now.blobBytes, at: Date.now() },
    meta: null,
    refs: [{ ns: COMPACT_NS, id: rowId, rev: 1 }],
    causationId: `compact:receipt:${planRef.censusDigest.slice(0, 12)}`,
  });
  return { moved, kept, protected: protectedCount, receiptRowSeq: receipt.seq, planRowSeq: planRow.seq };
}

export function compact(v: VaultDB, ns: string, keep: number): CompactResult {
  if (typeof ns !== "string" || ns.length === 0) throw new Error("vault.compact@1: ns must be a non-empty string");
  if (!Number.isInteger(keep) || keep < 1) throw new Error(`vault.compact@1: keep must be an integer >= 1 (got ${String(keep)})`);
  const db = v.db;
  const protectedRefs = liveRefs(db); // provenance edges from ALL live objects, any namespace
  const rows = db.query("SELECT id, rev FROM objects WHERE ns = ? ORDER BY id ASC, rev ASC").all(ns) as unknown as { id: string; rev: number }[];

  const byId = new Map<string, number[]>();
  for (const row of rows) {
    const list = byId.get(row.id) ?? [];
    list.push(row.rev);
    byId.set(row.id, list);
  }

  db.exec("BEGIN IMMEDIATE");
  try {
    let moved = 0;
    let kept = 0;
    let protectedCount = 0;
    const now = Date.now();
    // D-387 (perf review #2): the per-row FTS delete was candidates × fts_size
    // (unindexed columns → full scan per row). The move loop keeps its cheap
    // PK-indexed INSERT/DELETE per candidate but only COLLECTS the triples;
    // one ftsDeleteMany scan below removes every moved revision's FTS row in
    // the same transaction.
    const movedTargets: Array<{ id: string; rev: number }> = [];
    for (const [id, revs] of byId) {
      const hot = revs.slice(-keep);           // newest `keep` stay hot
      const candidates = revs.slice(0, Math.max(0, revs.length - keep)); // superseded
      kept += hot.length;
      for (const rev of candidates) {
        if (protectedRefs.has(`${ns}|${id}|${rev}`)) { kept++; protectedCount++; continue; } // provenance survives
        db.query(
          "INSERT INTO cold_objects (ns, id, rev, cid, meta, moved_at) SELECT ns, id, rev, cid, meta, ? FROM objects WHERE ns = ? AND id = ? AND rev = ?",
        ).run(now, ns, id, rev);
        db.query("DELETE FROM objects WHERE ns = ? AND id = ? AND rev = ?").run(ns, id, rev);
        movedTargets.push({ id, rev });
        moved++;
      }
    }
    ftsDeleteMany(db, ns, movedTargets);
    db.exec("COMMIT");
    return { moved, kept, protected: protectedCount };
  } catch (err) {
    try { db.exec("ROLLBACK"); } catch { /* already rolled back */ }
    throw err;
  }
}
