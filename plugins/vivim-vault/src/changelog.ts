// vivim.vault — changelog.ts (Ω2, D-432 two-phase)
// The append path: CAS the data, insert the object revision (hot), upsert the FTS row,
// extend the Merkle-chained changelog — one IMMEDIATE transaction, one enqueueWrite.
//
// Chain law: entry_hash = sha256(seq|causationId|ns|id|rev|cid|prev_hash) where
// prev_hash is the previous entry's entry_hash (genesis = 64 zeros). The chain is
// grown from what is on disk (head read inside the same transaction), so post-tamper
// appends extend the tampered chain and verify() flags the tampered seq.
//
// rev allocation reads MAX(rev) from the CHANGED LOG (not objects): compaction moves
// revisions out of `objects` but never out of `changelog`, so revisions can never
// collide with compacted history.
//
// D-432 (Ω-0.5): the append is TWO-PHASE — the predicted link is journaled and
// fsynced as an append.intent line BEFORE the data transaction, and the accounting
// closes with an append.commit line after it (wal.ts holds the journal). A reader
// and the recovery walk treat intent-without-commit as UNCOMMITTED: it never enters
// the fold. If the committed link drifts from the prediction (a writer bypassed the
// single-writer queue between the phases) the append REFUSES — the intent stays
// uncommitted and the next recovery quarantines it. Never silently folded.

import type { Database, Ref, VaultDB } from "./sql.ts";
import { casPut } from "./cas.ts";
import { bodyText, cidOf, entryHash, GENESIS_HASH } from "./canon.ts";
import { envelopeOf, ftsInsert } from "./sql.ts";
import { appendJournalLine, fsyncProofOf, journalAppendable, type IntentRow, type CommitRow } from "./wal.ts";

export interface ChangelogRow {
  seq: number; causationId: string; ns: string; id: string; rev: number;
  cid: string; entry_hash: string; prev_hash: string;
}

export interface AppendInput {
  ns: string; id: string; data: unknown; meta?: unknown; refs?: Ref[];
  causationId: string;
}

export interface AppendResult { rev: number; cid: string; seq: number }

/** Current chain head (last entry's entry_hash; genesis if empty). */
export function chainHead(db: Database): string {
  const row = db.query("SELECT entry_hash FROM changelog ORDER BY seq DESC LIMIT 1").get() as { entry_hash: string } | null;
  return row ? row.entry_hash : GENESIS_HASH;
}

export function changelogCount(db: Database): number {
  return (db.query("SELECT COUNT(*) AS n FROM changelog").get() as { n: number }).n;
}

/** Insert one changelog link, reading the head inside the caller's transaction. */
export function appendChangelogEntry(db: Database, e: { causationId: string; ns: string; id: string; rev: number; cid: string }): { seq: number; entryHash: string } {
  const prevHash = chainHead(db);
  const seq = (db.query("SELECT COALESCE(MAX(seq), 0) + 1 AS s FROM changelog").get() as { s: number }).s;
  const hash = entryHash(seq, e.causationId, e.ns, e.id, e.rev, e.cid, prevHash);
  db.query(
    "INSERT INTO changelog (seq, causationId, ns, id, rev, cid, entry_hash, prev_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(seq, e.causationId, e.ns, e.id, e.rev, e.cid, hash, prevHash);
  return { seq, entryHash: hash };
}

/**
 * Phase 0 of the two-phase append (D-432): predict the full merkle link BEFORE
 * writing anything. Pure over (db, input) — stable inside the single-writer
 * queue, which is the only place appends happen. Exported because the recovery
 * ceremony and the Ω-8 crash-injection scripts need the same prediction.
 */
export function predictAppend(db: Database, input: AppendInput): IntentRow {
  const cid = cidOf(input.data);
  const prevHash = chainHead(db);
  const seq = (db.query("SELECT COALESCE(MAX(seq), 0) + 1 AS s FROM changelog").get() as { s: number }).s;
  const rev = (db.query("SELECT COALESCE(MAX(rev), 0) + 1 AS r FROM changelog WHERE ns = ? AND id = ?").get(input.ns, input.id) as { r: number }).r;
  return {
    kind: "append.intent",
    intentId: seq,
    ns: input.ns,
    id: input.id,
    rev,
    cid,
    causationId: input.causationId,
    seq,
    prevHash,
    rowHash: entryHash(seq, input.causationId, input.ns, input.id, rev, cid, prevHash),
    at: Date.now(),
  };
}

/**
 * Phase 1 ALONE (D-432): journal + fsync the intent, then stop — no data
 * transaction, no commit line. This is the exact on-disk state of a crash
 * between the phases, constructible on demand (the falsifier's chaos harness
 * and Ω-8's crash-injection scripts); recovery quarantines it.
 */
export function beginIntentOnly(v: VaultDB, input: AppendInput): { intent: IntentRow; byteRange: { byteStart: number; byteEnd: number } } {
  const intent = predictAppend(v.db, input);
  const byteRange = appendJournalLine(v.dataDir, intent);
  return { intent, byteRange };
}

/**
 * Full two-phase append (D-432). MUST run inside enqueueWrite (callers route
 * through runAppend / the op handlers). CAS write happens after the intent and
 * before the transaction: a failed transaction leaves an orphan blob at most —
 * content-addressed, inert, never read as wrong data.
 */
export function appendObject(v: VaultDB, input: AppendInput): AppendResult {
  const db = v.db;
  // phase 0 — the journal must be in a clean accounting state: appending past a
  // torn tail would bury un-accounted bytes mid-file where no crash shape can
  // put them (only tamper can) — the pre-boundary integrity check would then
  // refuse the whole vault. Quarantine first, append after (D-432).
  const appendable = journalAppendable(v.dataDir);
  if (!appendable.appendable) {
    throw new Error(`vault.append@1: the intent journal is not appendable — ${appendable.reason} (D-432)`);
  }
  // phase 1 — the intent line, fsynced BEFORE the data write (spec Ω-0.5 §3.1)
  const intent = predictAppend(db, input);
  const intentRange = appendJournalLine(v.dataDir, intent);
  // phase 2 — the data transaction (the pre-D-432 body, prediction-checked)
  casPut(v.dataDir, input.data);
  db.exec("BEGIN IMMEDIATE");
  try {
    const rev = (db.query("SELECT COALESCE(MAX(rev), 0) + 1 AS r FROM changelog WHERE ns = ? AND id = ?").get(input.ns, input.id) as { r: number }).r;
    if (rev !== intent.rev) {
      throw new Error(`vault.append@1: intent void — predicted rev ${intent.rev} but the changelog allocated ${rev} (${input.ns}/${input.id}); a writer bypassed the single-writer queue between the phases. The uncommitted intent will be quarantined at next recovery (D-432)`);
    }
    db.query("INSERT INTO objects (ns, id, rev, cid, meta) VALUES (?, ?, ?, ?, ?)")
      .run(input.ns, input.id, rev, intent.cid, envelopeOf(input.meta, input.refs ?? []));
    ftsInsert(db, input.ns, input.id, rev, bodyText(input.data));
    const { seq, entryHash: committedHash } = appendChangelogEntry(db, { causationId: input.causationId, ns: input.ns, id: input.id, rev, cid: intent.cid });
    if (seq !== intent.seq || committedHash !== intent.rowHash) {
      throw new Error(`vault.append@1: intent void — committed link (seq ${seq}, ${committedHash.slice(0, 12)}…) drifted from the prediction (seq ${intent.seq}, ${intent.rowHash.slice(0, 12)}…); a writer bypassed the single-writer queue between the phases. The uncommitted intent will be quarantined at next recovery (D-432)`);
    }
    db.exec("COMMIT");
    // phase 3 — the commit line, fsynced after the data is durable in SQLite's WAL
    const commit: CommitRow = {
      kind: "append.commit",
      intentRef: intent.intentId,
      seq,
      fsyncProof: fsyncProofOf(intent, intentRange.byteStart, intentRange.byteEnd),
      at: Date.now(),
    };
    appendJournalLine(v.dataDir, commit);
    return { rev, cid: intent.cid, seq };
  } catch (err) {
    try { db.exec("ROLLBACK"); } catch { /* already rolled back */ }
    throw err;
  }
}
