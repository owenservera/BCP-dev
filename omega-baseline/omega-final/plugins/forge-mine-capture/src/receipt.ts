// forge.mine.capture — src/receipt.ts (D-409)
// The PURE half of the capture seam: the hash domain, the root-hash fold, and
// the receipt's identity rules. No filesystem, no ports, no I/O — every
// function here is a pure function of its input, which is what makes the
// falsifier honest (a receipt is a function of the mine's bytes, and nothing
// else).
//
// THE HASH DOMAIN — one declared rule, stated once, never a parameter:
//   hash(file) = sha256(CRLF→LF-normalised bytes)
// A receipt whose hash changed when the reader's checkout rewrote its line
// endings would attest to the checkout, not to the mine. The repo already
// declares the same law at the checkout edge (`.gitattributes`: "Recorded
// harvest fixtures are byte-hashed in … MANIFEST.json … without an explicit
// rule `* text=auto` checks .txt out as CRLF, so the on-disk bytes stop
// matching the recorded sha256"); the capture applies it at the read edge so a
// mine captured on any platform yields the same receipt. The rule is a strict
// no-op on LF-only content — a lone CR (0x0D not followed by 0x0A) is
// PRESERVED, so normalisation can never merge a line a mine author wrote on
// purpose.
//
// THE ROOT HASH — the fold the mine is replayable against:
//   rootHash = sha256( "\n".join( `${path}:${hexHash}` for each admitted file, path order ) )
// This is the formula the pinned fixture's own reference implementation
// computes (`fixtures/mines/synthetic-v0/src/hashutil.py::root_hash`), byte for
// byte. Agreeing with an INDEPENDENT implementation is the falsifier; a
// formula this plugin invented and then agreed with itself would prove nothing.
//
// THE CAS ROW — where a casRef's BYTES live (D-409 SF2, decided by D-TEAM-023).
// The address was always `cas:<hash>`, a pure function of content; SF2 was
// left open so the storage decision would not be smuggled into the receipt by
// accident. This is the half that closes it, and it is deliberately the
// NARROWEST answer available: one governed row per DISTINCT casRef, in the SAME
// ns `proposal` the receipt already writes (no new namespace — SF1 stays
// un-retired, and the namespaces registry stays one row per namespace), keyed
// BY the address itself, payload base64 of the NORMALISED bytes — the exact
// bytes `fileHashAndBytes` hashed and counted, never the raw on-disk bytes.
// That last clause is load-bearing, not cosmetic: on a CRLF checkout the raw
// bytes do not re-hash to the receipt's hash, so storing them would make every
// consumer's `hashBytes(decoded) === row.hash` check fail on every CRLF file
// and present as a consumer bug.
// DEFERRED ON PURPOSE, and recorded rather than solved: the incremental-hashing
// budget. A re-capture of an unchanged mine still READS and re-hashes every
// file (the walk is the evidence); only the WRITES dedupe, because the row id
// is the content address and append is latest-wins per id. A path+mtime+size
// cache is a separate decision with its own evidence — this record does not
// pretend to have solved it.
import { createHash } from "node:crypto";

/** The op this plugin exists for (frozen wire — pack.builder FORGE_OP_CATALOG). */
export const FORGE_MINE_CAPTURE_OP = "forge.mine.capture@1";

/** The plugin id (the ingestion-airlock row names exactly this, D-417 §5). */
export const FORGE_MINE_CAPTURE_PLUGIN_ID = "forge.mine.capture";

/** The vault namespace the receipt lands in (D-409 SF1, un-retired: ns proposal
 *  unless retention differs — see the `proposal` row in docs/VAULT-NAMESPACES.md).
 *  Nothing here is authority: a capture receipt is a proposal record. */
export const RECEIPT_NAMESPACE = "proposal";

/** The CAS row-id family (D-409 SF2 as decided by D-TEAM-023): `cas:<hash>` —
 *  the receipt's own `casRef`, used VERBATIM as the governed row id, so the
 *  address a receipt cites IS the address the blob lives at. There is no second
 *  naming scheme and therefore no way for the two to drift apart. */
export const CAS_ROW_ID_PREFIX = "cas:";

/** Strict base64 — the payload alphabet, declared rather than assumed, because
 *  `Buffer.from(s, "base64")` is LENIENT (it silently skips characters outside
 *  the alphabet), and a lenient decoder turns a corrupt row into a plausible
 *  buffer instead of the named failure it is. */
const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

/** One CAS blob row: the governed carrier for the bytes a casRef addresses.
 *  `bytes` is the length of the DECODED payload, which is the length of the
 *  bytes the hash covers — never the base64 length. */
export interface CasBlobRow {
  schemaVersion: "1";
  op: "forge.mine.capture@1";
  casRef: string;             // `cas:<hash>` — the row id, unchanged
  hash: string;               // `sha256:<hex>` over the DECODED payload
  bytes: number;              // decoded length, in bytes
  encoding: "base64";
  data: string;               // the NORMALISED bytes, base64
}

/** Build the CAS row for one content address from the NORMALISED bytes — the
 *  exact buffer `fileHashAndBytes` hashed. Passing raw on-disk bytes here
 *  would produce a row whose payload does not re-hash to its own `hash`. */
export function casBlobRow(casRef: string, hash: string, normalised: Uint8Array): CasBlobRow {
  return {
    schemaVersion: "1",
    op: "forge.mine.capture@1",
    casRef,
    hash,
    bytes: normalised.length,
    encoding: "base64",
    data: Buffer.from(normalised).toString("base64"),
  };
}

/** Decode a stored row back to its bytes, or null when it is not a decodable
 *  CAS blob. STRICT on both halves: the shape must be a CasBlobRow whose
 *  `casRef`/`hash`/`bytes` agree with each other, and the payload must be
 *  strict base64 that round-trips (which is what makes `bytes` checkable
 *  without trusting the stored count). A ZERO-BYTE file is legal — the pinned
 *  mine contains one, and its payload is the empty string, which is strict
 *  base64 by every rule above — so emptiness is not treated as malformed.
 *  Returns null rather than throwing so
 *  every consumer can name the failure in its own vocabulary; the re-hash
 *  against `hash` is the caller's check, never this function's — a payload that
 *  decodes cleanly but hashes to something else is CORRUPTION, not shape. */
export function decodeCasBlob(row: unknown): Buffer | null {
  if (row === null || typeof row !== "object" || Array.isArray(row)) return null;
  const r = row as Record<string, unknown>;
  if (r["schemaVersion"] !== "1" || r["op"] !== "forge.mine.capture@1") return null;
  if (r["encoding"] !== "base64") return null;
  if (typeof r["data"] !== "string") return null;
  if (r["data"].length % 4 !== 0 || !BASE64_PATTERN.test(r["data"])) return null;
  const casRef = r["casRef"];
  const hash = r["hash"];
  if (typeof casRef !== "string" || casRef !== `${CAS_ROW_ID_PREFIX}${String(hash)}`) return null;
  if (typeof hash !== "string" || !SHA256_PATTERN.test(hash)) return null;
  const decoded = Buffer.from(r["data"], "base64");
  if (decoded.toString("base64") !== r["data"]) return null; // lenient-decode damage
  if (typeof r["bytes"] !== "number" || !Number.isInteger(r["bytes"]) || r["bytes"] !== decoded.length) return null;
  return decoded;
}

/** sdk MINE_PATTERN, mirrored: a mine id is `<repo>@<sha>` with a 7-64 hex pin.
 *  Mirrored rather than imported so the compartment depends on nothing but the
 *  shim (the import-surface gate forbids workspace imports inside plugin src
 *  beyond the declared seam). */
export const MINE_ID_PATTERN = /^[a-z0-9][a-z0-9.-]*@[0-9a-f]{7,64}$/;

/** The hash idiom every Forge artifact uses: `sha256:<64 hex>`. */
export const SHA256_PATTERN = /^sha256:[0-9a-f]{64}$/;

/** The declared normalisation rule, as data — the receipt's own provenance note. */
export const TEXT_NORMALISATION = "crlf-to-lf";

/** Directory names that are excluded BY DECLARED POLICY: a dependency tree or
 *  VCS metadata is machine state, not mine bytes (the same precedent as the
 *  host `contentHashDir` node_modules exclusion, recorded in BACKLOG.md). They
 *  land in the receipt's `refusals[]` with a named reason — an exclusion is a
 *  receipt fact, never a silent drop. */
export const EXCLUDED_DIRS: Readonly<Record<string, string>> = {
  "node_modules": "dependency tree outside the declared mine",
  ".git": "VCS metadata outside the declared mine bytes",
};

/** FILE names excluded BY DECLARED POLICY, for the same reason and with the
 *  same receipt-visible discipline. Exactly one, and it is the mine's own
 *  inventory:
 *
 *  A mine carries a MANIFEST.json listing its own files and their hashes. If
 *  the capture hashed that file too, the root hash would depend on a document
 *  that (in any maintained mine) lists the root hash — self-reference. The
 *  pinned synthetic mine excludes itself for exactly this reason: its manifest
 *  lists 42 files and MANIFEST.json is not among them. Hashing it would make
 *  the receipt a function of the very document the receipt replaces, so it is
 *  excluded BY DECLARED POLICY and recorded in `refusals[]` — never dropped
 *  silently. */
export const EXCLUDED_FILES: Readonly<Record<string, string>> = {
  "MANIFEST.json": "the mine's own inventory — hashing it would make the receipt self-referential (the inventory would have to contain its own hash)",
};

/** One admitted file, in receipt form. */
export interface ReceiptFile {
  path: string;      // posix-relative to mineRoot; ".." is structurally impossible (see walk)
  hash: string;      // "sha256:<hex>" over the NORMALISED bytes
  bytes: number;     // byte length of the SAME bytes the hash covers — never the raw length
  casRef: string;    // content address (see casRefFor — pure function of the content)
}

/** One excluded entry, in receipt form. */
export interface ReceiptRefusal {
  path: string;
  reason: string;
}

/** The CaptureReceipt@1 shape (pack.builder `CaptureReceiptSchema`). Declared
 *  here as a TYPE only — the schema that governs it is the pack's, and the
 *  test proves this op's output validates against it. */
export interface CaptureReceipt {
  schemaVersion: "1";
  op: "forge.mine.capture@1";
  mineId: string;
  mineRoot: string;
  capturedAt: string;
  fileCount: number;
  rootHash: string;
  files: ReceiptFile[];
  refusals: ReceiptRefusal[];
}

/** CRLF → LF on BYTES (never through a string codec — a mine may hold arbitrary
 *  bytes and a decode/encode round-trip is not the identity). A lone 0x0D that
 *  is not part of a CRLF pair is preserved verbatim. */
export function normaliseTextBytes(bytes: Uint8Array): Buffer {
  const out = Buffer.allocUnsafe(bytes.length);
  let n = 0;
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i]!;
    if (b === 0x0d && bytes[i + 1] === 0x0a) continue; // drop the CR of a CRLF pair
    out[n++] = b;
  }
  return out.subarray(0, n);
}

/** "sha256:<hex>" over the given bytes — the house idiom, one place. */
export function hashBytes(bytes: Uint8Array): string {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

/** The file hash: sha256 over the CRLF→LF-normalised bytes (the declared rule).
 *  `fileHashAndBytes` is the same computation with the buffer returned; this
 *  one exists so callers that need only the address never hold a file's bytes
 *  in memory. THE HASH DOMAIN IS DECLARED ONCE — both go through
 *  `fileHashAndBytes`, so the two can never disagree about it. */
export function fileHashAndBytes(raw: Uint8Array): { hash: string; bytes: number; normalised: Buffer } {
  const normalised = normaliseTextBytes(raw);
  return { hash: hashBytes(normalised), bytes: normalised.length, normalised };
}

export function hashFileBytes(raw: Uint8Array): { hash: string; bytes: number } {
  const { hash, bytes } = fileHashAndBytes(raw);
  return { hash, bytes };
}

/** The content address a receipt row cites for its file.
 *
 *  casRef is a PURE FUNCTION OF THE CONTENT — `cas:sha256:<hex>`, the same
 *  digest in the store-address idiom. That is deliberate: D-409's SF2 ("CAS
 *  blobs vs rows; incremental hashing budget") is still OPEN, so the receipt
 *  must not encode a storage decision. Because the address does not depend on
 *  where the bytes live, SF2 can land (blobs, rows, or a path+mtime+size
 *  incremental cache) WITHOUT re-capturing any mine — the receipts already
 *  written stay valid. A casRef that named a storage location would have made
 *  the undecided fork into a fact by accident. */
export function casRefFor(hash: string): string {
  return `cas:${hash}`;
}

/** The receipt's root hash: sha256 over the newline-joined `path:hexHash` of
 *  every admitted file, in path order. Byte-identical to the pinned fixture's
 *  own `root_hash` (see the file header). */
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

/** The governed row id for a receipt. Stable in the mine's CONTENT, so
 *  re-capturing an unchanged mine is an idempotent upsert of the same row
 *  (latest-wins per id) rather than an ever-growing pile of duplicates. */
export function receiptRowId(mineId: string, rootHash: string): string {
  return `mine:${mineIdSlug(mineId)}/${rootHash.replace(/^sha256:/, "")}`;
}

/** Canonical JSON (sorted keys, no insignificant whitespace) — the read-back
 *  comparison must not depend on how either side chose to format a row. */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const rec = value as Record<string, unknown>;
  return `{${Object.keys(rec).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(rec[k])}`).join(",")}}`;
}
