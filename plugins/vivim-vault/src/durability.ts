// vivim.vault — durability.ts (D-432, Ω-0.5)
// The crash-recovery ceremony and the recovery audit.
//
// recoverVault walks the intent journal's tail (wal.ts) and makes every
// un-accounted byte LOUD:
//
//   · a complete intent+commit pair            → survived, nothing to do
//   · a torn tail (partial line, no newline)   → quarantined, ledgered
//   · an intent with no commit, data ABSENT    → quarantined, ledgered, never folded
//   · an intent with no commit, data COMMITTED → the fold KEEPS the data (SQLite
//     proves it: the changelog contains the predicted link — deleting a provably
//     committed revision would be the actual crime); the torn ACCOUNTING is
//     quarantined and ledgered with dataCommitted named
//
// Quarantine means: the byte range's verbatim bytes are preserved
// content-addressed under <dataDir>/quarantine/ (with a sidecar carrying the
// row they owe), a vault.recovery row is appended citing the byte range, the
// quarantine hash and the preceding committed chain head, and the live
// journal is truncated back to the last committed boundary. MOVED, not
// dropped; never reconstructed; never silently truncated.
//
// Recovery is idempotent and self-healing: an interrupted recovery (crash
// between artifact and row) completes its own unledgered rows from the
// sidecars. An artifact with NO sidecar and NO row is exactly the mutation
// wearing a repair costume the register names: VAULT_RECOVERY_UNLEDGERED,
// refused. auditRecovery is the read-only parity check both directions
// (orphan artifacts, dangling citations).
//
// Where a journal line is garbage BEFORE the committed boundary, that is not
// a crash shape — the journal is append-only, so only tamper puts garbage
// behind a commit — and recovery refuses with a named error rather than
// walking past it (fail-closed; verify.ts owns history tamper).
import type { Database, VaultDB } from "./sql.ts";
import { casGet } from "./cas.ts";
import { appendObject, chainHead } from "./changelog.ts";
import { sha256Hex } from "./canon.ts";
import {
  listQuarantineArtifacts, quarantineArtifactExists, quarantineRowId, readQuarantineArtifact,
  RECOVERY_NS, RECOVERY_UNLEDGERED, truncateJournalTo, walkJournal, writeQuarantineArtifact,
  type JournalWalk, type QuarantineSidecar,
} from "./wal.ts";

export type QuarantineKind = "torn-bytes" | "uncommitted-intent" | "committed-data-torn-commit";

export interface QuarantineRecord {
  kind: QuarantineKind;
  byteStart: number;
  byteEnd: number;
  quarantineHash: string;
  ns?: string;
  id?: string;
  rev?: number;
  dataCommitted?: boolean;
  committedSeq?: number;
}

export interface RecoveryDecision {
  kind: QuarantineKind | "reconciled-artifact" | "clean-walk";
  row?: number;      // the changelog seq of the ledgered vault.recovery row
  refusal?: string;  // the named refusal the decision carries (never absent for a tear)
  detail: string;
}

export interface RecoveryResult {
  ok: boolean;
  clean: boolean;
  bootId: string;
  walkedBytes: number;
  committedBoundary: number;   // byte offset just past the last commit line (0 when none)
  quarantines: QuarantineRecord[];
  decisions: RecoveryDecision[];
  truncatedTo: number | null;
  rowsLedgered: number;
}

export interface RecoveryAudit {
  ok: boolean;
  issues: string[];
  artifacts: number;
  rows: number;
}

const TORN_SENTENCE = "The last write did not complete before the machine failed; its bytes are preserved under quarantine and nothing in them is assumed to have happened.";

function newBootId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Does the changelog contain the link this intent predicted? (SQLite's proof the data committed.) */
function intentCommitted(db: Database, intent: { seq: number; rowHash: string; ns: string; id: string; rev: number; cid: string }): { committed: boolean; seq: number | null } {
  const row = db.query("SELECT ns, id, rev, cid, entry_hash FROM changelog WHERE seq = ?").get(intent.seq) as
    { ns: string; id: string; rev: number; cid: string; entry_hash: string } | null;
  if (!row) return { committed: false, seq: null };
  const exact = row.entry_hash === intent.rowHash && row.ns === intent.ns && row.id === intent.id
    && row.rev === intent.rev && row.cid === intent.cid;
  return { committed: exact, seq: exact ? intent.seq : null };
}

/** The ledgered vault.recovery row for a quarantine hash, when it already exists (idempotence). */
function recoveryRowSeq(db: Database, rowId: string): number | null {
  const row = db.query("SELECT rev FROM objects WHERE ns = ? AND id = ? ORDER BY rev DESC LIMIT 1").get(RECOVERY_NS, rowId) as { rev: number } | null;
  if (!row) return null;
  const link = db.query("SELECT seq FROM changelog WHERE ns = ? AND id = ? AND rev = ? ORDER BY seq LIMIT 1").get(RECOVERY_NS, rowId, row.rev) as { seq: number } | null;
  return link ? link.seq : null;
}

function sidecarOf(q: QuarantineRecord, bootId: string, precedingCommit: string): QuarantineSidecar {
  return {
    rowId: quarantineRowId(q.quarantineHash),
    causationId: `recovery:${bootId}:${q.quarantineHash.slice(0, 8)}`,
    data: {
      bootId,
      kind: q.kind,
      byteRange: [q.byteStart, q.byteEnd],
      quarantineHash: q.quarantineHash,
      precedingCommit,
      refusal: "VAULT_TORN_TAIL_QUARANTINED",
      sentence: TORN_SENTENCE,
      badge: "quarantined",
      ...(q.ns !== undefined ? { ns: q.ns, id: q.id, rev: q.rev } : {}),
      ...(q.dataCommitted !== undefined ? { dataCommitted: q.dataCommitted } : {}),
      ...(q.committedSeq !== undefined ? { committedSeq: q.committedSeq } : {}),
    },
  };
}

/** Ledger (idempotently) the vault.recovery row a sidecar describes. Returns the changelog seq. */
function ledgerRecoveryRow(v: VaultDB, sidecar: QuarantineSidecar): number {
  const existing = recoveryRowSeq(v.db, sidecar.rowId);
  if (existing !== null) return existing;
  const r = appendObject(v, {
    ns: RECOVERY_NS,
    id: sidecar.rowId,
    data: sidecar.data,
    causationId: sidecar.causationId,
  });
  return r.seq;
}

/**
 * The recovery ceremony (vault.recover@1). MUST run inside enqueueWrite — it
 * truncates the journal and appends rows like any mutation.
 *
 * Order of operations (every interruption window is self-healing):
 *   A · fail-fast orphan check (no mutation): an artifact with no sidecar and
 *       no row is the unledgered mutation — refused before anything moves.
 *   B · walk + tail scan (pure reads).
 *   C · preserve the tail bytes verbatim (artifacts + sidecars, idempotent),
 *       THEN truncate the live journal to the committed boundary.
 *   D · ledger every un-rowed artifact (this walk's quarantines AND any older
 *       interrupted recovery's) — the journal is clean now, so the recovery
 *       rows' own two-phase appends land after the boundary.
 */
export function recoverVault(v: VaultDB, opts: { bootId?: string } = {}): RecoveryResult {
  const bootId = opts.bootId ?? newBootId();
  const decisions: RecoveryDecision[] = [];
  let rowsLedgered = 0;

  // A · fail-fast: no recovery-shaped mutation without its ledgered row
  for (const artifact of listQuarantineArtifacts(v.dataDir)) {
    if (recoveryRowSeq(v.db, quarantineRowId(artifact.hash)) !== null) continue;
    if (artifact.sidecar === null) {
      throw new Error(`${RECOVERY_UNLEDGERED}: quarantine artifact ${artifact.hash} has no sidecar and no ${RECOVERY_NS} row — recovery that is not itself ledgered is mutation wearing a repair costume (D-432; spec Ω-0.5 §7)`);
    }
  }

  // B · walk the journal tail
  const walk: JournalWalk = walkJournal(v.dataDir);
  if (walk.missing || walk.size === 0) {
    decisions.push({ kind: "clean-walk", detail: `no journal to walk (legacy vault or fresh copy) — ${reconcileNote(v)}` });
    const healed = healUnledgeredArtifacts(v, decisions);
    return {
      ok: true, clean: true, bootId, walkedBytes: walk.size, committedBoundary: 0,
      quarantines: [], decisions, truncatedTo: null, rowsLedgered: rowsLedgered + healed,
    };
  }

  // the committed boundary: everything after the LAST commit line is the tail
  let boundary = 0;
  for (const line of walk.lines) {
    if (line.row?.kind === "append.commit") boundary = line.end;
  }

  // integrity behind the boundary: garbage there is tamper, not a tear —
  // crash shapes can only damage the TAIL (the journal is append-only, and
  // appendObject refuses to extend a non-appendable journal).
  for (const line of walk.lines) {
    if (line.end <= boundary && (line.parseError !== null || line.row === null)) {
      throw new Error(`wal: journal corruption BEFORE the committed boundary (bytes ${line.start}..${line.end}: ${line.parseError ?? "unrecognized line"}) — this is tamper, not a tear; refusing to recover past it (D-432). verify@1 owns history tamper.`);
    }
  }

  // scan the tail: quarantines, with SQLite's own proof consulted per intent
  const quarantines: QuarantineRecord[] = [];
  for (const line of walk.lines) {
    if (line.start < boundary) continue;
    if (line.row === null) {
      // a newline-terminated line that does not parse — un-accounted tail bytes
      quarantines.push({
        kind: "torn-bytes", byteStart: line.start, byteEnd: line.end,
        quarantineHash: sha256Hex(line.bytes),
      });
      continue;
    }
    if (line.row.kind === "append.intent") {
      const proof = intentCommitted(v.db, line.row);
      quarantines.push({
        kind: proof.committed ? "committed-data-torn-commit" : "uncommitted-intent",
        byteStart: line.start, byteEnd: line.end,
        quarantineHash: sha256Hex(line.bytes),
        ns: line.row.ns, id: line.row.id, rev: line.row.rev,
        dataCommitted: proof.committed,
        ...(proof.seq !== null ? { committedSeq: proof.seq } : {}),
      });
    }
    // a commit line in the tail cannot exist: boundary is past the LAST commit
  }
  if (walk.tornTail !== null) {
    quarantines.push({
      kind: "torn-bytes",
      byteStart: walk.tornTail.start,
      byteEnd: walk.tornTail.end,
      quarantineHash: sha256Hex(walk.tornTail.bytes),
    });
  }

  if (quarantines.length === 0) {
    decisions.push({ kind: "clean-walk", detail: `journal walked clean: ${walk.lines.length} line(s), ${walk.size} bytes, boundary at ${boundary}` });
    const healed = healUnledgeredArtifacts(v, decisions);
    return {
      ok: true, clean: true, bootId, walkedBytes: walk.size, committedBoundary: boundary,
      quarantines: [], decisions, truncatedTo: null, rowsLedgered: rowsLedgered + healed,
    };
  }

  // C · preserve verbatim, then MOVE the tail out of the live journal. A crash
  //    between the two leaves the tail in place — the next walk re-derives the
  //    same content-addressed artifacts (idempotent); a crash after leaves
  //    artifacts + sidecars without rows — D heals them.
  const precedingCommit = chainHead(v.db);
  for (const q of quarantines) {
    const bytes = readJournalSlice(q.byteStart, q.byteEnd, walk);
    writeQuarantineArtifact(v.dataDir, q.quarantineHash, bytes, sidecarOf(q, bootId, precedingCommit));
  }
  truncateJournalTo(v.dataDir, boundary);

  // D · ledger: older un-rowed artifacts first (interrupted recoveries), then
  //    this walk's quarantines — all idempotent on the row id.
  const healed = healUnledgeredArtifacts(v, decisions);
  rowsLedgered += healed;
  const walkedHashes = new Set(quarantines.map((q) => q.quarantineHash));
  for (const q of quarantines) {
    const sidecar = sidecarOf(q, bootId, precedingCommit);
    const seq = ledgerRecoveryRow(v, sidecar);
    rowsLedgered++;
    decisions.push({
      kind: q.kind,
      row: seq,
      refusal: "VAULT_TORN_TAIL_QUARANTINED",
      detail: `bytes ${q.byteStart}..${q.byteEnd} (${q.kind}${q.ns !== undefined ? `, ${q.ns}/${q.id}@${q.rev}` : ""}${q.dataCommitted === true ? ", data PROVABLY COMMITTED and kept in the fold" : ", nothing assumed to have happened"}) quarantined as ${q.quarantineHash.slice(0, 12)}… and ledgered at seq ${seq}`,
    });
  }
  void walkedHashes; // (quarantines this walk produced; older artifacts are D-healed above)

  return {
    ok: true, clean: false, bootId, walkedBytes: walk.size, committedBoundary: boundary,
    quarantines, decisions, truncatedTo: boundary, rowsLedgered,
  };
}

/** Ledger any artifact that still owes a row (an interrupted recovery's leftovers). Returns how many rows it wrote. */
function healUnledgeredArtifacts(v: VaultDB, decisions: RecoveryDecision[]): number {
  let healed = 0;
  for (const artifact of listQuarantineArtifacts(v.dataDir)) {
    if (recoveryRowSeq(v.db, quarantineRowId(artifact.hash)) !== null) continue;
    if (artifact.sidecar === null) {
      throw new Error(`${RECOVERY_UNLEDGERED}: quarantine artifact ${artifact.hash} has no sidecar and no ${RECOVERY_NS} row — recovery that is not itself ledgered is mutation wearing a repair costume (D-432; spec Ω-0.5 §7)`);
    }
    const seq = ledgerRecoveryRow(v, artifact.sidecar);
    healed++;
    decisions.push({
      kind: "reconciled-artifact",
      row: seq,
      refusal: "VAULT_TORN_TAIL_QUARANTINED",
      detail: `artifact ${artifact.hash.slice(0, 12)}… completed its own unledgered row (an interrupted recovery) at seq ${seq}`,
    });
  }
  return healed;
}

function reconcileNote(v: VaultDB): string {
  const artifacts = listQuarantineArtifacts(v.dataDir);
  return artifacts.length === 0 ? "quarantine zone empty" : `${artifacts.length} quarantine artifact(s) checked`;
}

/** Byte slice out of the pre-truncation journal (the walk carries the whole file in memory). */
function readJournalSlice(start: number, end: number, walk: JournalWalk): Buffer {
  if (walk.tornTail !== null && start >= walk.tornTail.start) {
    const offset = start - walk.tornTail.start;
    return walk.tornTail.bytes.subarray(offset, offset + (end - start));
  }
  const line = walk.lines.find((l) => l.start === start);
  if (line) return line.bytes;
  throw new Error(`wal: quarantine byte range ${start}..${end} not found in the walked journal — refusing (D-432)`);
}

/**
 * The recovery audit (read-only): every quarantine artifact has a ledgered
 * vault.recovery row, and every row cites an existing artifact. Both
 * directions of the parity — an orphan artifact is unledgered mutation; a
 * dangling citation is deleted evidence. Issues carry VAULT_RECOVERY_UNLEDGERED.
 */
export function auditRecovery(v: VaultDB): RecoveryAudit {
  const issues: string[] = [];
  const artifacts = listQuarantineArtifacts(v.dataDir);
  const artifactHashes = new Set(artifacts.map((a) => a.hash));

  const rows = v.db.query("SELECT id, rev, cid FROM objects WHERE ns = ?").all(RECOVERY_NS) as { id: string; rev: number; cid: string }[];
  const citedHashes = new Set<string>();
  for (const row of rows) {
    let data: Record<string, unknown>;
    try {
      data = casGet(v.dataDir, row.cid) as Record<string, unknown>;
    } catch (err) {
      issues.push(`${RECOVERY_UNLEDGERED}: ${RECOVERY_NS} row ${row.id}@${row.rev} has an unreadable payload (${String(err instanceof Error ? err.message : err)}) — the citation cannot be checked (D-432)`);
      continue;
    }
    const hash = data["quarantineHash"];
    if (typeof hash !== "string" || !/^[0-9a-f]{64}$/.test(hash)) {
      issues.push(`${RECOVERY_UNLEDGERED}: ${RECOVERY_NS} row ${row.id}@${row.rev} cites no well-formed quarantine hash — a recovery row without its quarantine is a sentence without evidence (D-432)`);
      continue;
    }
    citedHashes.add(hash);
    if (!quarantineArtifactExists(v.dataDir, hash)) {
      issues.push(`${RECOVERY_UNLEDGERED}: ${RECOVERY_NS} row ${row.id}@${row.rev} cites quarantine ${hash} that does not exist — evidence was deleted or never written (D-432)`);
    }
  }
  for (const artifact of artifacts) {
    if (!citedHashes.has(artifact.hash)) {
      issues.push(`${RECOVERY_UNLEDGERED}: quarantine artifact ${artifact.hash} has no ${RECOVERY_NS} row — recovery that is not itself ledgered is mutation wearing a repair costume (D-432; spec Ω-0.5 §7)`);
    }
  }
  return { ok: issues.length === 0, issues, artifacts: artifacts.length, rows: rows.length };
}
