// forge.mine — src/index.ts (D-409 READ half of the mine family)
//
// The three READ siblings of `forge.mine.capture@1`. D-409 decided the split and
// `plugins/forge-mine-capture/` is the EXTERNAL_MUTATION half; this directory is
// the READ half and the capture op is NOT declared here (FORGE_CLASS_SPAN: a
// plugin spans exactly one risk class, and FORGE_CONTRACT_DRIFT pins all three
// of these to READ in pack.builder's FORGE_OP_CATALOG).
//
//   forge.mine.list@1   READ  {}                 → the pinned mines
//   forge.mine.verify@1 READ  {mineId}           → ProofReport@1
//   forge.mine.diff@1   READ  {mineA, mineB}     → ProofReport@1
//
// THE DISCIPLINE THIS FILE EXISTS TO KEEP: no filesystem. Reading a foreign
// legacy tree is the highest-risk act in the system and it is the capture
// seam's job — EXTERNAL_MUTATION, consent-gated twice (caller and plugin
// principal), audited. If a READ op could re-walk the mine, the class split
// D-409 paid for would be a fiction: the dangerous act would live in an op the
// host never gates. So this plugin reads the receipt AS STORED — the row
// `forge.mine.capture@1` appended to vault ns `proposal` under the
// content-derived id `mine:<repo>/<rootHash>` — and every check below is a
// function of ledger bytes alone. There is no `node:fs` import in this
// compartment; the refusal suite asserts the tree is byte-identical across the
// whole READ suite, and the ledger row count is unchanged by it.
//
// REFUSE vs REPORT — the one distinction this plugin has to get right.
//   REFUSE (ok:true carrying the D-379 refusal envelope) when there is NOTHING
//   TO VERIFY: a malformed payload, an unpinned mine id, a receipt that is not
//   there, a stored row that is not even an object, a receipt-prefixed row whose
//   id names no pin, a closed ledger.
//   REPORT (a ProofReport with result:"fail") when a receipt EXISTS and
//   disagrees with its own re-walk. That includes the un-pinned-hash case
//   D-409 names as this plugin's headline refusal test — but it is a failing
//   proof report, not a refusal, because the honest answer to "does this
//   receipt hold together?" is a verdict with the failing checks named, not a
//   refusal that hides them. A refusal means "I could not look"; a fail report
//   means "I looked, and here is exactly what does not hold".
//
// The payload grammars are CLOSED (unknown fields refuse by name) — the same
// discipline forge.author.init@1 and forge.mine.capture@1 use.
import { definePlugin, startPlugin } from "@vivim/omega-shim";
import type { PluginContext } from "@vivim/omega-shim";
import type { PortResult } from "@vivim/omega-contracts";
import {
  FORGE_MINE_DIFF_OP, FORGE_MINE_LIST_OP, FORGE_MINE_VERIFY_OP,
  MINE_ID_PATTERN, RECEIPT_ID_PREFIX, RECEIPT_NAMESPACE,
  check, evidenceRefFor, failedCheckNames, foldReceipt, mineIdFromRowId, pathList,
  proofReport, receiptRowId,
  type ProofCheck, type ProofReport, type ReceiptEntry,
} from "./mine.ts";

export {
  FORGE_MINE_DIFF_OP, FORGE_MINE_LIST_OP, FORGE_MINE_OPS, FORGE_MINE_PLUGIN_ID,
  FORGE_MINE_VERIFY_OP, MAX_LISTED_PATHS, MINE_EVIDENCE_REF_PATTERN, MINE_ID_PATTERN,
  RECEIPT_CHECK_NAMES, RECEIPT_ID_PREFIX, RECEIPT_NAMESPACE, SHA256_PATTERN,
  UTC_ISO_PATTERN, evidenceRefFor, failedCheckNames, foldReceipt, hashBytes,
  mineIdDigest, mineIdFromRowId, mineIdSlug, pathList, proofReport, receiptRowId,
  rootHashOf, rollUp,
} from "./mine.ts";
export type { ProofCheck, ProofReport, ReceiptEntry, ReceiptFold } from "./mine.ts";

// ---- the refusal envelope (D-379 refusal-as-data) -------------------------------

export interface MineRefusal {
  refused: true;
  error: "REFUSED";
  op: string;
  rule: string;
  detail: string;
}

function refuse(op: string, rule: string, detail: string): MineRefusal {
  return { refused: true, error: "REFUSED", op, rule, detail };
}

/** Every named failure these three ops can produce. The refusal suite asserts
 *  each one is actually TRIGGERED (not merely named in a comment) — the house
 *  lesson from corridor 1: "the rule appears somewhere in the file" is
 *  satisfied by a comment and proves nothing. */
export const MINE_REFUSAL_RULES = [
  "MINE_VERIFY_MALFORMED_INPUT",   // verify payload is not {mineId} (or carries unknown fields)
  "MINE_DIFF_MALFORMED_INPUT",     // diff payload is not {mineA, mineB} (or carries unknown fields)
  "MINE_LIST_MALFORMED_INPUT",     // list payload is not {} — the frozen wire pins an empty object
  "MINE_ID_MALFORMED",             // a mine id is not `<repo>@<7-64 hex>` — an unpinned tree has no identity
  "MINE_RECEIPT_MISSING",          // no capture receipt is stored for that pin (named side on diff)
  "MINE_RECEIPT_MALFORMED",        // the stored row is not an object at all — there is nothing to verify
  "MINE_ROW_ID_MALFORMED",         // a receipt-prefixed row whose id names no pin — corruption, not a row to drop
  "MINE_LEDGER_REFUSED",           // the receipt could not be read: port refused or the vault failed
] as const;
export type MineRefusalRule = (typeof MINE_REFUSAL_RULES)[number];

// ---- reading the stored receipt (the ONLY I/O in this plugin) -------------------

type LedgerRow = { id: string; rev: number; data: unknown };
type LedgerRead =
  | { kind: "row"; row: LedgerRow }
  | { kind: "missing"; detail: string }
  | { kind: "refused"; detail: string };

/** Classify a failed port call. Two distinct failures share one `ok:false`
 *  shape and must NOT be collapsed: the port refused (no capability token, or a
 *  governed refusal) is a CLOSED LEDGER, while the vault's own "no object" is an
 *  ABSENT RECEIPT. Anything we cannot classify as absence fails CLOSED toward
 *  `MINE_LEDGER_REFUSED` — "I could not read it" is the conservative claim; "it
 *  is not there" is the one that needs positive evidence. The raw port detail
 *  travels in the refusal envelope either way, so nothing is hidden by the
 *  classification. */
function classifyFailure(r: PortResult): "missing" | "refused" {
  const detail = String((r as { detail?: string }).detail ?? "");
  if (r.error === "REFUSED") return "refused";
  if (/no object\b/i.test(detail) && /\(not found\)/i.test(detail)) return "missing";
  return "refused";
}

/** Read the ONE receipt row for a pinned mine. The row id is derived from the
 *  mine id's own pin, never from the receipt's contents — so a receipt stored
 *  under the wrong id is a `row-id-matches-root-hash` FAILURE the verify report
 *  names, not a lookup that quietly finds the wrong thing. */
async function readReceipt(ctx: PluginContext, mineId: string): Promise<LedgerRead> {
  const id = receiptRowId(mineId);
  const r: PortResult = await ctx.port.call("vault.get@1", { ns: RECEIPT_NAMESPACE, id });
  if (!r.ok) {
    const detail = `vault.get@1 ${RECEIPT_NAMESPACE}/${id} → ${r.error}: ${String((r as { detail?: string }).detail ?? "")}`;
    return classifyFailure(r) === "missing" ? { kind: "missing", detail } : { kind: "refused", detail };
  }
  const v = r.value as { data?: unknown; rev?: number } | null;
  if (v === null || v === undefined || v.data === undefined || v.data === null) {
    return { kind: "missing", detail: `vault.get@1 ${RECEIPT_NAMESPACE}/${id} returned a row with no data — a receipt with nothing in it is not a receipt` };
  }
  return { kind: "row", row: { id, rev: typeof v.rev === "number" ? v.rev : 0, data: v.data } };
}

/** Shared shape check: a stored row that is not an object cannot be verified at
 *  all — there is no report to make about it. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// ---- forge.mine.list@1 -----------------------------------------------------------

/** The frozen wire pins `{}` (packs/builder/contract/forge-ops.md), so the
 *  grammar is closed AND empty. An absent payload IS that empty object; anything
 *  else — an array, a string, a single field — refuses by name. */
const LIST_KNOWN_FIELDS = [] as const;

/** One pinned mine, as the ledger's row id describes it. No row data is read:
 *  a pinned mine IS its pin, so the id already carries everything a caller
 *  needs to hand straight back to verify@1 or diff@1. */
export interface PinnedMine {
  ref: string;       // EVIDENCE_REF `mine:<repo>@<pin>` — the citation form
  mineId: string;    // MINE_ID — what verify@1/diff@1 take as input
  rootHash: string;  // `sha256:<hex>` — the pin, in hash idiom
  rowId: string;     // `mine:<repo>/<pin>` — where the receipt is stored
  rev: number;       // the ledger revision that served the row
}

export interface MineList {
  schemaVersion: "1";
  op: "forge.mine.list@1";
  namespace: string;
  count: number;
  mines: PinnedMine[];
}

export async function mineList(payload: unknown, ctx: PluginContext): Promise<MineList | MineRefusal> {
  if (payload !== undefined && payload !== null) {
    if (!isRecord(payload)) {
      return refuse(FORGE_MINE_LIST_OP, "MINE_LIST_MALFORMED_INPUT",
        `payload must be {} (got ${Array.isArray(payload) ? "array" : typeof payload}); the frozen wire pins an empty payload and an absent payload is that empty object`);
    }
    for (const key of Object.keys(payload)) {
      if (!(LIST_KNOWN_FIELDS as readonly string[]).includes(key)) {
        return refuse(FORGE_MINE_LIST_OP, "MINE_LIST_MALFORMED_INPUT",
          `payload carries field "${key}" — the list grammar is closed and EMPTY (the frozen wire pins \`{}\`; filtering belongs to the caller, which knows the pin it wants)`);
      }
    }
  }

  const q: PortResult = await ctx.port.call("vault.query@1", {
    ns: RECEIPT_NAMESPACE,
    filter: { idPrefix: RECEIPT_ID_PREFIX },
  });
  if (!q.ok) {
    return refuse(FORGE_MINE_LIST_OP, "MINE_LEDGER_REFUSED",
      `vault.query@1 ${RECEIPT_NAMESPACE}/${RECEIPT_ID_PREFIX}* → ${q.error}: ${String((q as { detail?: string }).detail ?? "")} — a list that cannot see the ledger is not an empty ledger`);
  }
  const raw = q.value;
  if (!Array.isArray(raw)) {
    return refuse(FORGE_MINE_LIST_OP, "MINE_LEDGER_REFUSED",
      `vault.query@1 returned ${raw === null ? "null" : typeof raw}, not a row array — the ledger answered something this op cannot read honestly`);
  }

  const mines: PinnedMine[] = [];
  for (const entry of raw as Array<{ id?: unknown; rev?: unknown }>) {
    const id = String(entry?.id ?? "");
    const mineId = mineIdFromRowId(id);
    if (mineId === null) {
      return refuse(FORGE_MINE_LIST_OP, "MINE_ROW_ID_MALFORMED",
        `row ${RECEIPT_NAMESPACE}/${JSON.stringify(id)} sits under the receipt prefix but its id names no pinned mine (want \`${RECEIPT_ID_PREFIX}<repo>@<7-64 hex>\`) — corruption is not a row to skip quietly; fix the ledger or the writer`);
    }
    mines.push({
      ref: evidenceRefFor(mineId),
      mineId,
      rootHash: `sha256:${mineId.slice(mineId.lastIndexOf("@") + 1)}`,
      rowId: id,
      rev: typeof entry?.rev === "number" ? entry.rev : 0,
    });
  }

  ctx.log(`forge.mine.list: ${mines.length} pinned mine(s) in ns ${RECEIPT_NAMESPACE} (rows ${mines.map((m) => m.mineId).join(", ") || "none"})`);
  return { schemaVersion: "1", op: FORGE_MINE_LIST_OP, namespace: RECEIPT_NAMESPACE, count: mines.length, mines };
}

// ---- forge.mine.verify@1 ---------------------------------------------------------

/** Closed grammar: `{mineId}` and nothing else. */
const VERIFY_KNOWN_FIELDS = ["mineId"] as const;

export async function mineVerify(payload: unknown, ctx: PluginContext): Promise<ProofReport | MineRefusal> {
  if (!isRecord(payload)) {
    return refuse(FORGE_MINE_VERIFY_OP, "MINE_VERIFY_MALFORMED_INPUT",
      `payload must be {mineId} (got ${payload === null ? "null" : Array.isArray(payload) ? "array" : typeof payload})`);
  }
  for (const key of Object.keys(payload)) {
    if (!(VERIFY_KNOWN_FIELDS as readonly string[]).includes(key)) {
      return refuse(FORGE_MINE_VERIFY_OP, "MINE_VERIFY_MALFORMED_INPUT",
        `payload carries unknown field "${key}" — the verify grammar is closed (known: ${VERIFY_KNOWN_FIELDS.join(", ")})`);
    }
  }
  const mineId = payload["mineId"];
  if (typeof mineId !== "string" || mineId.length === 0) {
    return refuse(FORGE_MINE_VERIFY_OP, "MINE_VERIFY_MALFORMED_INPUT",
      `payload.mineId must be a non-empty mine id (got ${mineId === null ? "null" : typeof mineId})`);
  }
  if (!MINE_ID_PATTERN.test(mineId)) {
    return refuse(FORGE_MINE_VERIFY_OP, "MINE_ID_MALFORMED",
      `mineId ${JSON.stringify(mineId)} does not match the <repo>@<7-64 hex> pin (MINE_PATTERN) — an unpinned tree has no identity to verify, so it is refused rather than described`);
  }

  const read = await readReceipt(ctx, mineId);
  if (read.kind === "missing") {
    return refuse(FORGE_MINE_VERIFY_OP, "MINE_RECEIPT_MISSING",
      `no capture receipt is stored for ${mineId}: ${read.detail} — run forge.mine.capture@1 first; a READ op never manufactures the evidence it is asked to check`);
  }
  if (read.kind === "refused") {
    return refuse(FORGE_MINE_VERIFY_OP, "MINE_LEDGER_REFUSED", `${read.detail} — a receipt the ledger will not serve is not a verified receipt`);
  }
  if (!isRecord(read.row.data)) {
    return refuse(FORGE_MINE_VERIFY_OP, "MINE_RECEIPT_MALFORMED",
      `receipt row ${read.row.id} holds ${Array.isArray(read.row.data) ? "an array" : typeof read.row.data}, not a JSON object — there is no CaptureReceipt@1 here to re-walk, and this op will not report a verdict about a row it cannot read`);
  }

  const fold = foldReceipt(read.row.data, mineId, read.row.id);
  const report = proofReport(mineId, FORGE_MINE_VERIFY_OP, fold.checks, fold.replayHash);
  ctx.log(`forge.mine.verify: ${mineId} → ${report.result} (${fold.checks.filter((c) => c.result === "fail").length}/${fold.checks.length} checks failed, re-walk hash ${fold.replayHash ?? "none"})`);
  return report;
}

// ---- forge.mine.diff@1 -----------------------------------------------------------

/** Closed grammar: `{mineA, mineB}` and nothing else. */
const DIFF_KNOWN_FIELDS = ["mineA", "mineB"] as const;

export async function mineDiff(payload: unknown, ctx: PluginContext): Promise<ProofReport | MineRefusal> {
  if (!isRecord(payload)) {
    return refuse(FORGE_MINE_DIFF_OP, "MINE_DIFF_MALFORMED_INPUT",
      `payload must be {mineA, mineB} (got ${payload === null ? "null" : Array.isArray(payload) ? "array" : typeof payload})`);
  }
  for (const key of Object.keys(payload)) {
    if (!(DIFF_KNOWN_FIELDS as readonly string[]).includes(key)) {
      return refuse(FORGE_MINE_DIFF_OP, "MINE_DIFF_MALFORMED_INPUT",
        `payload carries unknown field "${key}" — the diff grammar is closed (known: ${DIFF_KNOWN_FIELDS.join(", ")})`);
    }
  }
  const ids: Record<"mineA" | "mineB", string> = { mineA: "", mineB: "" };
  for (const key of DIFF_KNOWN_FIELDS) {
    const value = payload[key];
    if (typeof value !== "string" || value.length === 0) {
      return refuse(FORGE_MINE_DIFF_OP, "MINE_DIFF_MALFORMED_INPUT",
        `payload.${key} must be a non-empty mine id (got ${value === null ? "null" : typeof value})`);
    }
    ids[key] = value;
    if (!MINE_ID_PATTERN.test(value)) {
      return refuse(FORGE_MINE_DIFF_OP, "MINE_ID_MALFORMED",
        `${key} ${JSON.stringify(value)} does not match the <repo>@<7-64 hex> pin (MINE_PATTERN) — an unpinned tree cannot be one side of a comparison`);
    }
  }

  const sides: Array<{ side: "mineA" | "mineB"; mineId: string }> = [
    { side: "mineA", mineId: ids.mineA },
    { side: "mineB", mineId: ids.mineB },
  ];
  const folds = new Map<"mineA" | "mineB", { checks: ProofCheck[]; entries: ReceiptEntry[] | null }>();
  for (const { side, mineId } of sides) {
    const read = await readReceipt(ctx, mineId);
    if (read.kind === "missing") {
      return refuse(FORGE_MINE_DIFF_OP, "MINE_RECEIPT_MISSING",
        `${side} ${mineId} has no stored capture receipt: ${read.detail} — a diff needs both sides captured; half a comparison is not a comparison`);
    }
    if (read.kind === "refused") {
      return refuse(FORGE_MINE_DIFF_OP, "MINE_LEDGER_REFUSED", `${side} could not be read: ${read.detail}`);
    }
    if (!isRecord(read.row.data)) {
      return refuse(FORGE_MINE_DIFF_OP, "MINE_RECEIPT_MALFORMED",
        `${side} receipt row ${read.row.id} holds ${Array.isArray(read.row.data) ? "an array" : typeof read.row.data}, not a JSON object — nothing to compare`);
    }
    folds.set(side, foldReceipt(read.row.data, mineId, read.row.id));
  }

  const left = folds.get("mineA")!;
  const right = folds.get("mineB")!;
  const checks: ProofCheck[] = [
    check("left-receipt-verified", left.ok, left.ok ? null : `mineA ${ids.mineA} does not re-walk: ${failedCheckNames(left.checks)}`),
    check("right-receipt-verified", right.ok, right.ok ? null : `mineB ${ids.mineB} does not re-walk: ${failedCheckNames(right.checks)}`),
  ];

  // The three delta checks. When a side carries no readable files[] the delta is
  // NOT computed — an empty added/removed list would read as "the trees agree",
  // which is the one answer a diff must never give by accident.
  if (left.entries === null || right.entries === null) {
    const unreadable = [left.entries === null ? "mineA" : null, right.entries === null ? "mineB" : null].filter((s): s is string => s !== null).join(" + ");
    for (const name of ["added", "removed", "changed"]) {
      checks.push(check(name, false, `not computed — ${unreadable} receipt carries no readable files[]; an empty delta would falsely read as agreement`));
    }
  } else {
    const L = new Map(left.entries.map((e) => [e.path, e.hash]));
    const R = new Map(right.entries.map((e) => [e.path, e.hash]));
    const added = [...R.keys()].filter((p) => !L.has(p)).sort();
    const removed = [...L.keys()].filter((p) => !R.has(p)).sort();
    const changed = [...L.keys()].filter((p) => R.has(p) && R.get(p) !== L.get(p)).sort()
      .map((p) => `${p}: ${L.get(p)} → ${R.get(p)}`);
    checks.push(check("added", added.length === 0, pathList(added)));
    checks.push(check("removed", removed.length === 0, pathList(removed)));
    checks.push(check("changed", changed.length === 0, pathList(changed)));
  }

  const subject = `${ids.mineA} ↔ ${ids.mineB}`;
  const report = proofReport(subject, FORGE_MINE_DIFF_OP, checks, null);
  ctx.log(`forge.mine.diff: ${subject} → ${report.result} (${checks.filter((c) => c.result === "fail").map((c) => c.name).join(", ") || "no differences"})`);
  return report;
}

startPlugin(definePlugin({
  ops: {
    [FORGE_MINE_LIST_OP]: (payload: unknown, ctx: PluginContext) => mineList(payload, ctx),
    [FORGE_MINE_VERIFY_OP]: (payload: unknown, ctx: PluginContext) => mineVerify(payload, ctx),
    [FORGE_MINE_DIFF_OP]: (payload: unknown, ctx: PluginContext) => mineDiff(payload, ctx),
  },
}));