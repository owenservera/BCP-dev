// forge.survey — src/inventory.ts (D-417 Wave 1+ lane: the survey ops)
//
// The PURE half. No ports, no I/O, no filesystem, and nothing runtime-specific
// (the bun-surface stage scans every `plugins/*/src` for the Bun global and for
// `bun:` imports) — every function
// here is a pure function of the bytes it is handed, which is what makes the
// class honest. `forge.survey.run@1` and `forge.survey.render@1` are READ ops
// and their whole observable behaviour is a function of what the ledger already
// holds; nothing in this file can reach a disk even if it wanted to (and the
// bun-surface and os-surface gate stages scan every `plugins/*/src` for exactly
// that kind of drift).
//
// WHAT IS MIRRORED AND WHY. The receipt-row id derivation, the CAS row shape and
// the mine-id pattern are all owned by the plugins that WRITE them
// (`plugins/forge-mine-capture/`, `plugins/forge-mine/`). This compartment does
// not import them: a plugin that reaches into a sibling's source has taken a
// dependency on code it is not granted authority over, and the import-surface
// gate treats the layering as a contract, not a suggestion. So the grammar is
// MIRRORED here — twice over, independently — and `test/happy/survey.test.ts`
// proves the two derivations agree against the LIVE receipt, because "they are
// the same formula written twice" is a claim and an agreement on real bytes is
// evidence.
//
// THE ROW is pack.builder's frozen InventoryRowSchema, a z.strictObject: it has
// nowhere to record an error, which is why a blob that decodes to the wrong
// bytes is a REFUSAL (SURVEY_BLOB_MISMATCH) rather than a row with a caveat in
// it. Truncation therefore lives in the ENVELOPE (`capped[]`), never inside a
// row — the forge.mine.diff discipline: truncation that counts itself out loud
// is honest, truncation that reads as completeness is not.
import { createHash } from "node:crypto";

// ---- the vocabulary -------------------------------------------------------------

/** This plugin's id — the canonical forge id from FORGE_PLUGIN_IDS. */
export const FORGE_SURVEY_PLUGIN_ID = "forge.survey";

/** The two READ ops (frozen wire — pack.builder FORGE_OP_CATALOG). */
export const FORGE_SURVEY_RUN_OP = "forge.survey.run@1";
export const FORGE_SURVEY_RENDER_OP = "forge.survey.render@1";
export const FORGE_SURVEY_OPS = [FORGE_SURVEY_RUN_OP, FORGE_SURVEY_RENDER_OP] as const;

/** The namespace the receipt AND its CAS blobs live in (D-409 SF1, un-retired). */
export const RECEIPT_NAMESPACE = "proposal";

/** The content-derived receipt row-id prefix (`forge.mine.capture@1` writes under). */
export const RECEIPT_ID_PREFIX = "mine:";

/** The CAS row-id family (D-409 SF2 as decided by D-TEAM-023). */
export const CAS_ROW_ID_PREFIX = "cas:";

/** sdk MINE_PATTERN, mirrored (see the file header). */
export const MINE_ID_PATTERN = /^[a-z0-9][a-z0-9.-]*@[0-9a-f]{7,64}$/;

/** The hash idiom every Forge artifact uses: `sha256:<64 hex>`. */
export const SHA256_PATTERN = /^sha256:[0-9a-f]{64}$/;

/** A `casRef` exactly as the capture declares it — the content address, nothing else. */
export const CAS_REF_PATTERN = /^cas:sha256:[0-9a-f]{64}$/;

/** One `vault.getmany@1` call's id budget — `GET_MANY_BOUND`
 *  (vivim-vault sql.ts:242) mirrored, for the same reason as the grammar above:
 *  over the bound the port REFUSES, so this is a hard chunk size. */
export const GET_MANY_CHUNK = 512;

/** How many entries one inventory field carries before the envelope says so.
 *  25 is a declared number, not a tuned one: the point is that a cap EXISTS and
 *  is visible, not where it sits. */
export const MAX_FIELD_ITEMS = 25;

// ---- the row (pack.builder `InventoryRowSchema`, declared as a TYPE) ------------

export interface InventoryRow {
  schemaVersion: "1";
  path: string;
  hash: string;
  bytes: number;
  language: string | null;   // null = no rule claims this extension (never "unknown-but-guessed")
  exports: string[];
  imports: string[];
  models: string[];
  headings: string[];
}

/** One field that hit the cap — recorded in the envelope, never inside a row. */
export interface CappedField {
  path: string;
  field: string;
  kept: number;
  dropped: number;
}

/** The SurveyInventory@1 envelope — what run@1 returns and render@1 consumes. */
export interface SurveyInventory {
  schemaVersion: "1";
  op: "forge.survey.run@1";
  mineId: string;
  rootHash: string;
  count: number;
  rows: InventoryRow[];
  capped: CappedField[];
}

/** The SurveyAtlas@1 envelope — what render@1 returns. `atlas` is markdown and
 *  is a pure function of the inventory; nothing else varies between two calls
 *  over the same mine, which is what makes it diffable. */
export interface SurveyAtlas {
  schemaVersion: "1";
  op: "forge.survey.render@1";
  mineId: string;
  rootHash: string;
  count: number;
  capped: CappedField[];
  atlas: string;
}

// ---- identity (mirrored, and asserted against the live receipt in the suite) ---

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

/** The governed receipt row id: `mine:<repo>/<pin>` — derived from the mine id
 *  ALONE, never from the receipt's contents, so a receipt stored anywhere else
 *  is a refusal rather than a lookup that quietly finds the wrong thing. Mirrors
 *  `plugins/forge-mine/src/mine.ts::receiptRowId`; the two derivations are
 *  compared on the live receipt by the suite. */
export function receiptRowId(mineId: string): string {
  return `${RECEIPT_ID_PREFIX}${mineIdSlug(mineId)}/${mineIdDigest(mineId)}`;
}

// ---- the CAS payload (mirrored decoder — see the file header) ------------------

/** Strict base64. `Buffer.from(s, "base64")` is LENIENT (it skips characters
 *  outside the alphabet), and a lenient decoder turns a corrupt row into a
 *  plausible buffer instead of the named failure it is. */
const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

/** "sha256:<hex>" over the given bytes — the house idiom, one place, and a
 *  SECOND derivation independent of the capture's (the suite asserts the two
 *  agree on every live blob). */
export function hashBytes(bytes: Uint8Array): string {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

/** Decode a stored CAS row back to bytes, or null when it is not a decodable
 *  blob. STRICT on shape AND on agreement: `casRef` must be `cas:<hash>`, `bytes`
 *  must equal the decoded length, and the payload must round-trip. The re-hash
 *  against `hash` is deliberately NOT done here — that is the CALLER's check
 *  (SURVEY_BLOB_MISMATCH), because a payload that decodes cleanly but hashes to
 *  something else is CORRUPTION, a different fact from a malformed row. */
export function decodeCasBlob(row: unknown): Buffer | null {
  if (row === null || typeof row !== "object" || Array.isArray(row)) return null;
  const r = row as Record<string, unknown>;
  if (r["schemaVersion"] !== "1" || r["op"] !== "forge.mine.capture@1") return null;
  if (r["encoding"] !== "base64") return null;
  if (typeof r["data"] !== "string") return null; // a zero-byte file's payload is "" — legal
  if (r["data"].length % 4 !== 0 || !BASE64_PATTERN.test(r["data"])) return null;
  const hash = r["hash"];
  if (typeof hash !== "string" || !SHA256_PATTERN.test(hash)) return null;
  if (r["casRef"] !== `${CAS_ROW_ID_PREFIX}${hash}`) return null;
  const decoded = Buffer.from(r["data"], "base64");
  if (decoded.toString("base64") !== r["data"]) return null;
  if (typeof r["bytes"] !== "number" || !Number.isInteger(r["bytes"]) || r["bytes"] !== decoded.length) return null;
  return decoded;
}

// ---- language + extraction (the survey's only opinion) -------------------------

/** Extension → language. A CLOSED map: an extension absent from it is `null`,
 *  which the row carries honestly rather than guessing "text". */
export const LANGUAGE_BY_EXTENSION: Readonly<Record<string, string>> = {
  ".py": "python",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".jsx": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".md": "markdown",
  ".markdown": "markdown",
  ".json": "json",
  ".yml": "yaml",
  ".yaml": "yaml",
  ".toml": "toml",
  ".txt": "text",
  ".sh": "shell",
  ".bash": "shell",
};

/** The language a path claims, or null when no rule claims it. */
export function languageOf(path: string): string | null {
  const slash = path.lastIndexOf("/");
  const name = slash < 0 ? path : path.slice(slash + 1);
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return null; // no extension, or a dotfile like `.gitignore`
  return LANGUAGE_BY_EXTENSION[name.slice(dot).toLowerCase()] ?? null;
}

function push(out: string[], seen: Set<string>, value: string): void {
  if (value.length === 0 || seen.has(value)) return; // first-seen order, deduped — deterministic
  seen.add(value);
  out.push(value);
}

function scan(text: string, re: RegExp, pick: (m: RegExpExecArray) => string | string[], out: string[], seen: Set<string>): void {
  for (const m of text.matchAll(re)) {
    const picked = pick(m);
    for (const v of Array.isArray(picked) ? picked : [picked]) push(out, seen, v);
  }
}

/** The four fields an inventory row can carry, before capping. */
export interface Extracted {
  exports: string[];
  imports: string[];
  models: string[];
  headings: string[];
}

function emptyExtracted(): Extracted {
  return { exports: [], imports: [], models: [], headings: [] };
}

/** The per-language rules. Anything not listed extracts NOTHING — the four
 *  arrays come back empty, which is a claim ("no rule fires here") rather than
 *  an absence of one. `models` is empty for every language in this first
 *  landing: no extension in the map is a model file, and inventing a rule for
 *  one would be a prediction, not an observation. */
export function extract(language: string | null, bytes: Uint8Array): Extracted {
  const out = emptyExtracted();
  if (language === null) return out;
  const text = Buffer.from(bytes).toString("utf-8");
  switch (language) {
    case "python":
      scan(text, /^[ \t]*(?:async[ \t]+)?(?:def|class)[ \t]+([A-Za-z_][A-Za-z0-9_]*)/gm, (m) => m[1]!, out.exports, new Set(out.exports));
      scan(text, /^[ \t]*(?:import[ \t]+([A-Za-z_][\w.]*)|from[ \t]+([A-Za-z_][\w.]*)[ \t]+import\b)/gm, (m) => m[1] ?? m[2] ?? "", out.imports, new Set(out.imports));
      return out;
    case "typescript":
    case "javascript":
      scan(text, /\bexport[ \t]+(?:default[ \t]+)?(?:async[ \t]+)?(?:function\*?|class|const|let|var|interface|type|enum)[ \t]+([A-Za-z_$][\w$]*)/g, (m) => m[1]!, out.exports, new Set(out.exports));
      scan(text, /\bexport[ \t]*\{([^}]*)\}/g, (m) => m[1]!.split(",").map((s) => s.trim().split(/\s+as\s+/).pop() ?? ""), out.exports, new Set(out.exports));
      scan(text, /\bfrom[ \t]+["']([^"']+)["']/g, (m) => m[1]!, out.imports, new Set(out.imports));
      scan(text, /\brequire\([ \t]*["']([^"']+)["']\s*\)/g, (m) => m[1]!, out.imports, new Set(out.imports));
      scan(text, /\bimport[ \t]+["']([^"']+)["']/g, (m) => m[1]!, out.imports, new Set(out.imports));
      return out;
    case "markdown":
      scan(text, /^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/gm, (m) => m[2]!, out.headings, new Set(out.headings));
      return out;
    default:
      return out;
  }
}

/** Cap one field, recording what it dropped. Truncation is ALWAYS counted. */
export function capField(path: string, field: keyof Extracted, values: string[], capped: CappedField[], limit: number = MAX_FIELD_ITEMS): string[] {
  if (values.length <= limit) return values;
  capped.push({ path, field, kept: limit, dropped: values.length - limit });
  return values.slice(0, limit);
}

/** Build one inventory row from a receipt row and the bytes that back it. */
export function inventoryRowOf(file: { path: string; hash: string; bytes: number }, bytes: Uint8Array): { row: InventoryRow; capped: CappedField[] } {
  const capped: CappedField[] = [];
  const language = languageOf(file.path);
  const found = extract(language, bytes);
  const row: InventoryRow = {
    schemaVersion: "1",
    path: file.path,
    hash: file.hash,
    bytes: file.bytes,
    language,
    exports: capField(file.path, "exports", found.exports, capped),
    imports: capField(file.path, "imports", found.imports, capped),
    models: capField(file.path, "models", found.models, capped),
    headings: capField(file.path, "headings", found.headings, capped),
  };
  return { row, capped };
}

/** Assemble the envelope. `rows` are sorted by path here, not by the caller, so
 *  the inventory is a function of the mine's paths rather than of whatever order
 *  the receipt happened to be walked in. */
export function inventoryEnvelope(mineId: string, rootHash: string, rows: InventoryRow[], capped: CappedField[]): SurveyInventory {
  const sorted = [...rows].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  const sortedCapped = [...capped].sort((a, b) => (
    a.path < b.path ? -1 : a.path > b.path ? 1 : a.field < b.field ? -1 : a.field > b.field ? 1 : 0
  ));
  return {
    schemaVersion: "1",
    op: FORGE_SURVEY_RUN_OP,
    mineId,
    rootHash,
    count: sorted.length,
    rows: sorted,
    capped: sortedCapped,
  };
}

// ---- the atlas renderer (pure, deterministic, timestamp-free) ------------------

function bullet(items: readonly string[], empty: string): string {
  if (items.length === 0) return `  - ${empty}`;
  return items.map((i) => `  - ${i}`).join("\n");
}

/** Render an inventory as markdown. A PURE FUNCTION of its input: no clock, no
 *  randomness, no ordering that is not already in the inventory. Two calls over
 *  the same rows produce byte-identical text, which is what makes the atlas
 *  diffable — a report whose diff is a timestamp teaches nothing. */
export function renderAtlas(inventory: SurveyInventory): SurveyAtlas {
  const lines: string[] = [];
  lines.push(`# atlas — ${inventory.mineId}`);
  lines.push("");
  lines.push(`- rootHash: ${inventory.rootHash}`);
  lines.push(`- files: ${inventory.count}`);
  lines.push(`- normalisation: crlf-to-lf (inherited from the capture receipt)`);
  lines.push("");
  for (const row of inventory.rows) {
    lines.push(`## ${row.path}`);
    lines.push("");
    lines.push(`- hash: ${row.hash}`);
    lines.push(`- bytes: ${row.bytes}`);
    lines.push(`- language: ${row.language ?? "(no rule claims this extension)"}`);
    lines.push("");
    if (row.language === "markdown") {
      lines.push("### headings");
      lines.push(bullet(row.headings, "none"));
      lines.push("");
    } else {
      lines.push("### exports");
      lines.push(bullet(row.exports, "none"));
      lines.push("");
      lines.push("### imports");
      lines.push(bullet(row.imports, "none"));
      lines.push("");
      lines.push("### models");
      lines.push(bullet(row.models, "none (no model-file rule is declared for this language)"));
      lines.push("");
    }
  }
  if (inventory.capped.length === 0) {
    lines.push("---");
    lines.push("");
    lines.push("No field hit the per-field cap; this atlas is complete.");
  } else {
    lines.push("---");
    lines.push("");
    lines.push(`Truncated (${inventory.capped.length} field(s)) — the count is stated rather than hidden:`);
    for (const c of inventory.capped) lines.push(`- ${c.path}: ${c.field} kept ${c.kept}, dropped ${c.dropped}`);
  }
  lines.push("");
  return {
    schemaVersion: "1",
    op: FORGE_SURVEY_RENDER_OP,
    mineId: inventory.mineId,
    rootHash: inventory.rootHash,
    count: inventory.count,
    capped: inventory.capped,
    atlas: lines.join("\n"),
  };
}
