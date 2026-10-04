// vivim.vault — wal.ts (D-432, Ω-0.5)
// The INTENT JOURNAL: the two-phase append's write-ahead accounting, the walk
// that reads it back, and the quarantine zone that preserves torn bytes.
//
// The write-ahead discipline (spec Ω-0.5 §3.1, translated to this vault's
// SQLite reality):
//
//   append.intent  {rowHash, byteRange, namespace}   — fsynced BEFORE the data write
//   … the data transaction (CAS → objects → FTS → merkle link, changelog.ts) …
//   append.commit  {intentRef, fsyncProof}           — fsynced after
//
// A reader (and the recovery walk in durability.ts) treats
// intent-without-commit as UNCOMMITTED — it never enters the fold. SQLite's
// own WAL gives the data transaction atomicity (a torn transaction rolls
// back); what SQLite does NOT give is an ACCOUNT of what was lost — its
// rollback is silent, and the constitution's law is that every anomaly is a
// ledgered row or a named refusal. This journal is that account.
//
// Byte law, stated plainly: the journal is an append-only byte file; a line's
// trailing "\n" is PART OF THE RECORD (a final line without its terminator is
// uncommitted by construction, even if its bytes happen to parse); byte
// ranges are real offsets; a torn tail is real bytes, preserved verbatim and
// content-addressed under <dataDir>/quarantine/ (with a sidecar carrying the
// recovery row it owes, so an interrupted recovery can complete its own
// ledger — never a second silent path).
//
// The fsyncProof is a BINDING HASH (intent byte-range → commit line), not a
// filesystem receipt: each journal line really is written and fsynced through
// a filehandle sync, but no portable post-sync fsstat receipt exists and none
// is claimed. SQLite's durability boundary (synchronous=NORMAL, the D-373
// parity block) is deliberately unchanged — the journal makes the ACCOUNTING
// crash-honest; the perf baselines (D-378/D-387) stay honest.
//
// Single-writer law: journal writes happen inside enqueueWrite like every
// vault mutation; the byte math (append at current size) is safe because the
// queue serializes them. No module above this one writes the journal.
import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, readdirSync, readSync, renameSync, statSync, truncateSync, writeFileSync, writeSync } from "node:fs";
import { join } from "node:path";
import { canonicalJson, sha256Hex } from "./canon.ts";

/** Kernel namespace: quarantined torn tails, verbatim bytes (retention: forever). */
export const RECOVERY_NS = "vault.recovery";
/** The refusal a quarantined tear carries (spec Ω-0.5 §7 — the exact sentence lives with the row). */
export const TORN_TAIL_REFUSAL = "VAULT_TORN_TAIL_QUARANTINED";
/** The refusal for recovery-shaped actions with no ledgered row (spec Ω-0.5 §7). */
export const RECOVERY_UNLEDGERED = "VAULT_RECOVERY_UNLEDGERED";

/** Phase 1 of a durable append — the predicted merkle link, journaled before the data write. */
export interface IntentRow {
  kind: "append.intent";
  intentId: number;        // the predicted changelog seq (unique per append — the journal's id)
  ns: string;
  id: string;
  rev: number;
  cid: string;             // cidOf(data) — computable before the CAS write
  causationId: string;
  seq: number;             // === intentId (kept distinct in the shape: the one is journal identity, the other chain position)
  prevHash: string;
  rowHash: string;         // entryHash(seq, …) — the link this append will add if it commits
  at: number;
}

/** Phase 3 — the accounting close, journaled after the data transaction commits. */
export interface CommitRow {
  kind: "append.commit";
  intentRef: number;       // the intent's intentId
  seq: number;             // the committed seq (must equal the intent's prediction)
  fsyncProof: string;      // binds the commit line to the intent line's byte range
  at: number;
}

/** A parsed journal line (newline-terminated). `row` null means unparseable/garbage. */
export interface JournalLine {
  start: number;           // first byte offset of the line (inclusive)
  end: number;             // offset just past the "\n" (exclusive)
  bytes: Buffer;           // the verbatim line bytes INCLUDING the terminator
  row: IntentRow | CommitRow | null;
  parseError: string | null;
}

/** Trailing bytes with no terminator — the torn tail's rawest form. */
export interface TornTail { start: number; end: number; bytes: Buffer }

export interface JournalWalk {
  missing: boolean;        // no journal file (legacy vaults, fresh roundtrip copies)
  size: number;
  lines: JournalLine[];    // newline-terminated lines, in byte order
  tornTail: TornTail | null;
}

export function journalPath(dataDir: string): string {
  return join(dataDir, "wal", "intents.jsonl");
}

/** The commit line's binding hash: intent identity + chain position + the intent's byte range. */
export function fsyncProofOf(intent: IntentRow, intentByteStart: number, intentByteEnd: number): string {
  return sha256Hex(`${intent.intentId}|${intent.seq}|${intent.rowHash}|${intentByteStart}-${intentByteEnd}`);
}

/** Serialize a journal row deterministically (canonical JSON + terminator). */
export function journalLineOf(row: IntentRow | CommitRow): string {
  return canonicalJson(row) + "\n";
}

function isIntent(value: Record<string, unknown>): value is IntentRow {
  return typeof value.kind === "string" && value.kind === "append.intent"
    && typeof value.intentId === "number" && typeof value.ns === "string" && typeof value.id === "string"
    && typeof value.rev === "number" && typeof value.cid === "string" && typeof value.causationId === "string"
    && typeof value.seq === "number" && typeof value.prevHash === "string" && typeof value.rowHash === "string"
    && typeof value.at === "number";
}

function isCommit(value: Record<string, unknown>): value is CommitRow {
  return typeof value.kind === "string" && value.kind === "append.commit"
    && typeof value.intentRef === "number" && typeof value.seq === "number"
    && typeof value.fsyncProof === "string" && typeof value.at === "number";
}

function parseLine(bytes: Buffer): { row: IntentRow | CommitRow | null; parseError: string | null } {
  const text = bytes.toString("utf-8").trim();
  if (text.length === 0) return { row: null, parseError: "empty line" };
  try {
    const value = JSON.parse(text) as Record<string, unknown>;
    if (isIntent(value) || isCommit(value)) return { row: value as IntentRow | CommitRow, parseError: null };
    return { row: null, parseError: `not an intent/commit line: ${text.slice(0, 60)}` };
  } catch (err) {
    return { row: null, parseError: String(err instanceof Error ? err.message : err) };
  }
}

/** Append one journal line and fsync it. Returns its exact byte range. */
export function appendJournalLine(dataDir: string, row: IntentRow | CommitRow): { byteStart: number; byteEnd: number } {
  const dir = join(dataDir, "wal");
  mkdirSync(dir, { recursive: true });
  const path = journalPath(dataDir);
  const text = journalLineOf(row);
  const byteStart = existsSync(path) ? statSync(path).size : 0;
  const fd = openSync(path, "a"); // append mode: writes land at end, never mid-file
  try {
    writeSync(fd, text);
    fsyncSync(fd); // the durability boundary of the ACCOUNTING (the spec's phase-1/phase-3 fsync)
  } finally {
    closeSync(fd);
  }
  return { byteStart, byteEnd: byteStart + Buffer.byteLength(text, "utf-8") };
}

/** Read and parse the journal. Pure read — recovery decides what to do with the walk. */
export function walkJournal(dataDir: string): JournalWalk {
  const path = journalPath(dataDir);
  if (!existsSync(path)) return { missing: true, size: 0, lines: [], tornTail: null };
  const buf = readFileSync(path);
  const lines: JournalLine[] = [];
  let tornTail: TornTail | null = null;
  let offset = 0;
  while (offset < buf.length) {
    const nl = buf.indexOf(0x0a, offset);
    if (nl === -1) {
      // no terminator for the remaining bytes: the torn tail, by construction uncommitted
      tornTail = { start: offset, end: buf.length, bytes: buf.subarray(offset) };
      break;
    }
    const bytes = buf.subarray(offset, nl + 1);
    const parsed = parseLine(bytes);
    lines.push({ start: offset, end: nl + 1, bytes, row: parsed.row, parseError: parsed.parseError });
    offset = nl + 1;
  }
  return { missing: false, size: buf.length, lines, tornTail };
}

// ---- the quarantine zone (verbatim torn bytes, content-addressed) ----

export interface QuarantineSidecar {
  rowId: string;          // the vault.recovery object id this artifact owes
  causationId: string;    // the recovery append's causation id
  data: Record<string, unknown>; // the full recovery-row payload (byteRange, refusal, sentence, …)
}

function quarantineDir(dataDir: string): string {
  return join(dataDir, "quarantine");
}

export function quarantinePath(dataDir: string, hash: string): string {
  if (!/^[0-9a-f]{64}$/.test(hash)) throw new Error(`quarantine: malformed hash '${hash}'`);
  return join(quarantineDir(dataDir), hash.slice(0, 2), hash);
}

function dirFsync(dir: string): void {
  try {
    const fd = openSync(dir, "r");
    try { fsyncSync(fd); } finally { closeSync(fd); }
  } catch { /* directory fsync unsupported — best effort, the cas.ts precedent */ }
}

/** Write-tmp → fsync → rename, the cas.ts durability pattern, for raw quarantine bytes. */
function writeArtifact(dataDir: string, hash: string, bytes: Buffer): void {
  const final = quarantinePath(dataDir, hash);
  if (existsSync(final)) return; // content-addressed idempotence
  const shard = join(quarantineDir(dataDir), hash.slice(0, 2));
  mkdirSync(shard, { recursive: true });
  const tmp = join(shard, `.${hash}.tmp-${process.pid.toString(36)}`);
  writeFileSync(tmp, bytes);
  const fd = openSync(tmp, "r+");
  try { fsyncSync(fd); } finally { closeSync(fd); }
  renameSync(tmp, final);
  dirFsync(shard);
}

/** Preserve torn bytes verbatim + the sidecar row they owe. Idempotent (content-addressed). */
export function writeQuarantineArtifact(
  dataDir: string,
  hash: string,
  bytes: Buffer,
  sidecar: QuarantineSidecar,
): void {
  writeArtifact(dataDir, hash, bytes);
  const sidecarPath = `${quarantinePath(dataDir, hash)}.json`;
  if (!existsSync(sidecarPath)) {
    const text = canonicalJson(sidecar) + "\n";
    writeFileSync(sidecarPath, text);
    const fd = openSync(sidecarPath, "r+");
    try { fsyncSync(fd); } finally { closeSync(fd); }
  }
}

/** A raw artifact with no sidecar — the import path (its rows arrive in the archive). */
export function writeRawQuarantineArtifact(dataDir: string, hash: string, bytes: Buffer): void {
  writeArtifact(dataDir, hash, bytes);
}

export interface QuarantineArtifact {
  hash: string;
  sidecar: QuarantineSidecar | null; // null when absent or unparseable (audit names it)
}

/** Every quarantine artifact on disk (hash-named files; sidecars are the .json neighbors). */
export function listQuarantineArtifacts(dataDir: string): QuarantineArtifact[] {
  const root = quarantineDir(dataDir);
  if (!existsSync(root)) return [];
  const out: QuarantineArtifact[] = [];
  for (const shard of readdirSync(root)) {
    if (!/^[0-9a-f]{2}$/.test(shard)) continue;
    for (const name of readdirSync(join(root, shard))) {
      if (!/^[0-9a-f]{64}$/.test(name)) continue; // sidecars and tmp leftovers are not artifacts
      const sidecarPath = join(root, shard, `${name}.json`);
      let sidecar: QuarantineSidecar | null = null;
      if (existsSync(sidecarPath)) {
        try {
          sidecar = JSON.parse(readFileSync(sidecarPath, "utf-8")) as QuarantineSidecar;
        } catch { sidecar = null; } // the audit names it; parsing stays non-fatal here
      }
      out.push({ hash: name, sidecar });
    }
  }
  return out.sort((a, b) => (a.hash < b.hash ? -1 : 1));
}

/** Read an artifact's verbatim bytes. Throws when absent (evidence must exist to be cited). */
export function readQuarantineArtifact(dataDir: string, hash: string): Buffer {
  return readFileSync(quarantinePath(dataDir, hash));
}

/** Does the artifact exist? (audit parity: rows must cite real evidence) */
export function quarantineArtifactExists(dataDir: string, hash: string): boolean {
  try { return existsSync(quarantinePath(dataDir, hash)); } catch { return false; }
}

/** The recovery row id a quarantine hash owes (stable, sidecar-carried, audit-checked). */
export function quarantineRowId(hash: string): string {
  return `tear:${hash.slice(0, 16)}`;
}

/** Remove the un-committed tail from the live journal (bytes already preserved in quarantine). */
export function truncateJournalTo(dataDir: string, boundary: number): void {
  truncateSync(journalPath(dataDir), boundary);
}

/**
 * Is the journal in a state a new append may extend? True when the file is
 * absent/empty, or its FINAL complete line is an append.commit (a clean
 * accounting boundary). A torn tail (bytes without a terminator) or an
 * uncommitted trailing intent makes it NON-appendable: appending past a tear
 * would bury garbage mid-file, where no crash shape can put it — recovery
 * must quarantine first. O(tail) — reads at most the last COMPLETE_TAIL_BYTES.
 */
export const JOURNAL_TAIL_WINDOW = 4096;

export function journalAppendable(dataDir: string): { appendable: boolean; reason?: string } {
  const path = journalPath(dataDir);
  if (!existsSync(path)) return { appendable: true };
  const size = statSync(path).size;
  if (size === 0) return { appendable: true };
  const fd = openSync(path, "r");
  let tail: Buffer;
  try {
    const start = Math.max(0, size - JOURNAL_TAIL_WINDOW);
    tail = Buffer.alloc(size - start);
    readSync(fd, tail, 0, tail.length, start);
  } finally {
    closeSync(fd);
  }
  if (tail[tail.length - 1] !== 0x0a) {
    return { appendable: false, reason: "the journal ends in a torn line (no terminator) — run vault.recover@1 first" };
  }
  const lineStart = tail.lastIndexOf(0x0a, tail.length - 2) + 1; // 0 when the window holds the whole line
  const lastLine = tail.subarray(lineStart);
  const parsed = parseLine(lastLine);
  if (parsed.row?.kind === "append.commit") return { appendable: true };
  if (parsed.row?.kind === "append.intent") {
    return { appendable: false, reason: "the journal ends in an uncommitted intent (no commit line) — run vault.recover@1 first" };
  }
  return { appendable: false, reason: `the journal's last line is not a commit (${parsed.parseError ?? "unrecognized"}) — run vault.recover@1 first` };
}
