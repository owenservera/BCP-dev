// forge.mine — src/mine.ts (D-409 READ half of the mine family)
// The PURE half of the READ siblings: the mine-id discipline, the receipt-row
// identity law, the root-hash re-derivation, and the proof-report shape. No
// filesystem, no ports, no I/O — every function here is a pure function of its
// input, which is what makes the READ class honest: this plugin's whole
// observable behaviour is a function of bytes that are already in the ledger.
//
// WHY THE RECEIPT COMES THROUGH THE LEDGER, NOT AN IMPORT. The capture receipt
// is owned by plugins/forge-mine-capture/ (D-409: one risk class per plugin
// directory). Nothing here imports that plugin's source. The capture appends the
// receipt to vault ns `proposal` under a CONTENT-derived row id
// (`mine:<repo>/<rootHash>`) and reads it back byte-identical before returning
// it; this plugin reads that row back through port:vault.get@1 and re-derives
// the SAME id from the mine id's own pin. Two independent derivations of one
// row address, agreeing by construction — because forge.mine.capture@1 refuses
// unless the pinned digest equals the computed rootHash. The agreement is not
// assumed: the test suite asserts it against the capture's own rootHashOf on the
// live receipt.
//
// MINE-ID DISCIPLINE (D-409 SF3). A mine id is `<repo>@<7-64 hex>` (sdk
// MINE_PATTERN, mirrored here rather than imported so the compartment depends
// on nothing but the shim — the same mirroring discipline the capture plugin
// applied). The pin IS the root hash, so the mine id and the content-derived
// row id are two spellings of one fact. These ops are the first real consumers
// of that pattern: every op refuses an unpinned id by name (MINE_ID_MALFORMED),
// and list@1 emits the EVIDENCE_REF `mine:<repo>@<pin>` form the pack's frozen
// regex already accepts.
//
// THE HASH DOMAIN, restated once and never a parameter:
//   hash(file) = sha256(CRLF→LF-normalised bytes)      (declared by the capture)
//   rootHash   = sha256( "\n".join(`${path}:${hexHash}`) ) in path order
// This module does NOT re-hash bytes — it has none. It re-derives the root hash
// from the receipt's own rows, which is exactly the "receipt vs re-walk" the
// frozen wire asks for, with the disk deliberately out of scope (D-409).
import { createHash } from "node:crypto";

/** This plugin's id — the canonical forge id from FORGE_PLUGIN_IDS. */
export const FORGE_MINE_PLUGIN_ID = "forge.mine";

/** The three READ ops (frozen wire — pack.builder FORGE_OP_CATALOG). */
export const FORGE_MINE_VERIFY_OP = "forge.mine.verify@1";
export const FORGE_MINE_DIFF_OP = "forge.mine.diff@1";
export const FORGE_MINE_LIST_OP = "forge.mine.list@1";
export const FORGE_MINE_OPS = [FORGE_MINE_VERIFY_OP, FORGE_MINE_DIFF_OP, FORGE_MINE_LIST_OP] as const;

/** The namespace the receipt lives in. D-409 SF1 (un-retired): ns `proposal`
 *  unless retention differs. This plugin only ever READS there. */
export const RECEIPT_NAMESPACE = "proposal";

/** The content-derived row-id prefix `forge.mine.capture@1` writes under. */
export const RECEIPT_ID_PREFIX = "mine:";

/** sdk MINE_PATTERN, mirrored (see the file header). */
export const MINE_ID_PATTERN = /^[a-z0-9][a-z0-9.-]*@[0-9a-f]{7,64}$/;

/** The hash idiom every Forge artifact uses: `sha256:<64 hex>`. */
export const SHA256_PATTERN = /^sha256:[0-9a-f]{64}$/;

/** The EVIDENCE_REF `mine:<id>` form (pack.builder's frozen EVIDENCE_REF). */
export const MINE_EVIDENCE_REF_PATTERN = /^mine:[a-z0-9][a-z0-9.-]*@[0-9a-f]{7,64}$/;

/** A UTC ISO instant (the receipt's one moving field). */
export const UTC_ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

/** How many paths a diff check's `diff` string names before it says how many it
 *  dropped. Truncation that counts itself out loud is honest; truncation that
 *  reads as completeness is not. */
export const MAX_LISTED_PATHS = 20;

/** "sha256:<hex>" over the given bytes — the house idiom, one place. */
export function hashBytes(bytes: Uint8Array): string {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

/** The receipt's root hash, re-derived from its own rows.
 *  sha256 over the newline-joined `path:hexHash` of every admitted file, in path
 *  order — the formula the capture declares and the pinned fixture's own
 *  reference implementation computes independently. */
export function rootHashOf(files: ReadonlyArray<{ path: string; hash: string }>): string {
  const joined = files.map((f) => `${f.path}:${f.hash.replace(/^sha256:/, "")}`).join("\n");
  return hashBytes(Buffer.from(joined, "utf-8"));
}

/** The pinned digest half of a mine id (`repo@sha` → `sha`). */
export function mineIdDigest(mineId: string): string {
  const at = mineId.lastIndexOf("@");
  return at < 0 ? "" : mineId.slice(at + 1);
}

/** The slug half of a mine id (`repo@sha` → `repo`). */
export function mineIdSlug(mineId: string): string {
  const at = mineId.lastIndexOf("@");
  return at < 0 ? mineId : mineId.slice(0, at);
}

/** The governed receipt row id for a pinned mine: `mine:<repo>/<pin>`.
 *
 *  Derived from the mine id ALONE — never from the receipt's contents. That is
 *  the whole point: the address a receipt must live at is a property of the pin
 *  the caller declared, so a receipt stored anywhere else is a check that can
 *  FAIL (see the `row-id-matches-root-hash` check) rather than a lookup that
 *  always succeeds. The capture derives the same id from the other end (slug +
 *  computed rootHash) and refuses unless the two agree. */
export function receiptRowId(mineId: string): string {
  return `${RECEIPT_ID_PREFIX}${mineIdSlug(mineId)}/${mineIdDigest(mineId)}`;
}

/** The mine id a receipt row id names, or null when it names none.
 *  `mine:<repo>/<64 hex>` → `<repo>@<64 hex>`. Anything else — a different
 *  prefix, a missing slash, a non-hex pin, a repo that does not match the
 *  pattern — is null, and callers REFUSE on null rather than skipping the row. */
export function mineIdFromRowId(rowId: string): string | null {
  if (!rowId.startsWith(RECEIPT_ID_PREFIX)) return null;
  const rest = rowId.slice(RECEIPT_ID_PREFIX.length);
  const slash = rest.indexOf("/");
  if (slash <= 0 || slash === rest.length - 1) return null;
  const mineId = `${rest.slice(0, slash)}@${rest.slice(slash + 1)}`;
  return MINE_ID_PATTERN.test(mineId) ? mineId : null;
}

/** The EVIDENCE_REF a pinned mine is cited by (`mine:<repo>@<pin>`). */
export function evidenceRefFor(mineId: string): string {
  return `${RECEIPT_ID_PREFIX}${mineId}`;
}

// ---- the proof report (pack.builder `ProofReportSchema`) ------------------------
//
// Declared here as TYPES only — the schema that governs the report is the
// pack's, and the test proves this op's live output validates against it
// (a z.strictObject, so it also fails on any extra key the op invents).

export interface ProofCheck {
  name: string;
  result: "pass" | "fail";
  diff: string | null;   // why it failed, in data; null on pass
}

export interface ProofReport {
  schemaVersion: "1";
  subject: string;
  op: string;
  result: "pass" | "fail";
  checks: ProofCheck[];
  replayHash: string | null;
  // Always [] from this plugin: executing refusal paths is forge.proof.refusal@1's
  // wire row ("{subject} → proof report (every refusal path executed)"). These
  // ops verify one receipt; they do not run a refusal suite. The key is present
  // because the frozen shape is strict, and its emptiness is the honest answer.
  refusalResults: Array<{ name: string; result: "pass" | "fail" }>;
}

/** One check. A failing check always carries its diff — a "fail" with no reason
 *  is a verdict nobody can act on. */
export function check(name: string, ok: boolean, diff: string | null = null): ProofCheck {
  return { name, result: ok ? "pass" : "fail", diff: ok ? null : (diff ?? "failed with no stated reason") };
}

/** The roll-up: pass ⟺ no check failed. */
export function rollUp(checks: ReadonlyArray<ProofCheck>): "pass" | "fail" {
  return checks.every((c) => c.result === "pass") ? "pass" : "fail";
}

/** Assemble the report. `replayHash` is the hash this re-walk produced, or null
 *  when the fold could not run at all (nothing was replayed; saying otherwise
 *  would be a claim without a computation behind it). */
export function proofReport(subject: string, op: string, checks: ProofCheck[], replayHash: string | null): ProofReport {
  return { schemaVersion: "1", subject, op, result: rollUp(checks), checks, replayHash, refusalResults: [] };
}

// ---- the re-walk (the fold a receipt must survive) ------------------------------

/** One admitted file row, reduced to what a comparison needs. */
export interface ReceiptEntry { path: string; hash: string }

export interface ReceiptFold {
  checks: ProofCheck[];
  entries: ReceiptEntry[] | null;   // null when files[] is not a readable array
  replayHash: string | null;        // the re-derived root hash, null when no fold ran
  ok: boolean;
}

/** The nine named checks every verify runs, in a fixed order so two reports are
 *  comparable line for line. Order is policy: identity before shape, shape
 *  before fold, fold before the pin. */
export const RECEIPT_CHECK_NAMES = [
  "receipt-is-capture-receipt-1",
  "receipt-mine-id-matches-request",
  "file-count-matches-files",
  "files-path-ordered-and-unique",
  "root-hash-recomputes",
  "mine-pin-matches-root-hash",
  "row-id-matches-root-hash",
  "cas-ref-is-content-address",
  "captured-at-is-utc-iso",
] as const;

/** Re-derive a stored receipt from its own rows and report every disagreement by
 *  name. This is the "receipt vs re-walk" the frozen wire asks for, with the
 *  disk out of scope on purpose: this plugin holds no filesystem capability, so
 *  it cannot cheat by re-reading the tree and agreeing with itself.
 *
 *  `expectedMineId` is the id the CALLER asked about; `rowId` is the row the
 *  ledger actually served. Both matter: the first proves the receipt is about
 *  what was asked, the second proves it sits where its own pin says it sits. */
export function foldReceipt(data: Record<string, unknown>, expectedMineId: string, rowId: string): ReceiptFold {
  const checks: ProofCheck[] = [];

  checks.push(check(
    "receipt-is-capture-receipt-1",
    data["schemaVersion"] === "1" && data["op"] === "forge.mine.capture@1",
    `stored row declares schemaVersion ${JSON.stringify(data["schemaVersion"])} / op ${JSON.stringify(data["op"])}; a CaptureReceipt@1 declares "1" / "forge.mine.capture@1"`,
  ));

  checks.push(check(
    "receipt-mine-id-matches-request",
    data["mineId"] === expectedMineId,
    `the receipt is about ${JSON.stringify(data["mineId"])}, not the requested ${JSON.stringify(expectedMineId)}`,
  ));

  const rawFiles = data["files"];
  const filesIsArray = Array.isArray(rawFiles);
  const files = (filesIsArray ? rawFiles : []) as Array<Record<string, unknown>>;
  const entries: ReceiptEntry[] | null = filesIsArray
    ? files.map((f) => ({ path: String(f?.["path"] ?? ""), hash: String(f?.["hash"] ?? "") }))
    : null;

  checks.push(check(
    "file-count-matches-files",
    filesIsArray && data["fileCount"] === files.length,
    filesIsArray
      ? `fileCount says ${JSON.stringify(data["fileCount"])} but files[] holds ${files.length} — the receipt over- or under-claims its own tree`
      : `files[] is ${Array.isArray(rawFiles) ? "unreadable" : rawFiles === undefined ? "absent" : typeof rawFiles}, not an array — nothing can be counted`,
  ));

  if (entries !== null) {
    const ordered = entries.every((e, i) => i === 0 || entries[i - 1]!.path < e.path);
    checks.push(check(
      "files-path-ordered-and-unique",
      ordered,
      ordered ? null : "files[] is not strictly ascending by path — the receipt is a function of the filesystem's readdir order, not of the mine",
    ));
  } else {
    checks.push(check("files-path-ordered-and-unique", false, "files[] is not an array — ordering cannot hold"));
  }

  const replayHash = entries !== null ? rootHashOf(entries) : null;
  checks.push(check(
    "root-hash-recomputes",
    replayHash !== null && replayHash === data["rootHash"],
    replayHash === null
      ? "no fold ran — rootHash cannot be re-derived from an unreadable files[]"
      : `re-walking files[] yields ${replayHash}, the receipt declares ${JSON.stringify(data["rootHash"])}`,
  ));

  const declaredRootHash = typeof data["rootHash"] === "string" ? data["rootHash"] : "";
  checks.push(check(
    "mine-pin-matches-root-hash",
    SHA256_PATTERN.test(declaredRootHash) && mineIdDigest(expectedMineId) === declaredRootHash.replace(/^sha256:/, ""),
    `mineId ${expectedMineId} pins ${mineIdDigest(expectedMineId)} but the receipt's rootHash is ${declaredRootHash || "(absent)"} — an unpinned tree is refused, not described`,
  ));

  const expectedRowId = receiptRowId(expectedMineId);
  checks.push(check(
    "row-id-matches-root-hash",
    rowId === expectedRowId,
    `the row was read from ${rowId} but ${expectedMineId} pins row ${expectedRowId} — the receipt does not sit where its own pin says it sits`,
  ));

  checks.push(check(
    "cas-ref-is-content-address",
    filesIsArray && files.every((f) => f?.["casRef"] === `cas:${String(f?.["hash"] ?? "")}`),
    "every files[].casRef must be `cas:<that row's own hash>` — D-409 SF2 is open, so the address must stay a pure function of the content",
  ));

  const capturedAt = data["capturedAt"];
  checks.push(check(
    "captured-at-is-utc-iso",
    typeof capturedAt === "string" && UTC_ISO_PATTERN.test(capturedAt) && Number.isFinite(Date.parse(capturedAt)),
    `capturedAt is ${JSON.stringify(capturedAt)}; the receipt records WHEN in a UTC ISO instant`,
  ));

  return { checks, entries, replayHash, ok: rollUp(checks) === "pass" };
}

/** The failing check names, joined — how diff says "this side is not verified"
 *  without re-printing nine checks into a diff string. */
export function failedCheckNames(checks: ReadonlyArray<ProofCheck>): string {
  return checks.filter((c) => c.result === "fail").map((c) => c.name).join(", ");
}

/** Render a path list into a diff string, counting what it dropped. A list that
 *  fits is the paths; a list that does not is the paths plus the honest count. */
export function pathList(paths: ReadonlyArray<string>, limit: number = MAX_LISTED_PATHS): string {
  if (paths.length === 0) return "none";
  const shown = paths.slice(0, limit);
  const hidden = paths.length - shown.length;
  return shown.join(", ") + (hidden > 0 ? ` … (+${hidden} more)` : "");
}