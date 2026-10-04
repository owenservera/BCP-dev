// forge.survey — src/index.ts (D-417 Wave 1+ lane: the survey ops)
//
// Class 1 (READ) — "pure past the capture". Two ops, both functions of bytes
// the ledger already holds:
//
//   forge.survey.run@1     READ  {mineId}               → SurveyInventory@1
//   forge.survey.render@1  READ  {mineId | inventory}   → SurveyAtlas@1
//
// THE SPLIT IS THE POINT. The architecture predicted the split because
// `build-atlas.ts` fused a walker with a markdown generator, and inventory and
// render fail the substitutability axis while fused — you cannot swap the
// renderer without touching the walker. So render accepts EITHER a mine id (it
// resolves the inventory itself) OR an inventory envelope (it touches no port
// at all). The second form is what makes the boundary real rather than
// asserted: a different renderer can be dropped in behind the same op without
// any knowledge of how the bytes were fetched.
//
// NO FILESYSTEM, AND THE GATE DOES NOT CHECK THAT (G-11). `FORGE_CLASS_SPAN`
// reads the manifest's DECLARED contributions and fires only when a plugin spans
// two risk classes; nothing inspects what a READ op's source actually reaches
// for, so a READ-class forge plugin could re-walk the mine and the gate would
// stay green. What holds this compartment honest is not a gate — it is the
// import-specifier scan in `test/happy/survey.test.ts`, which reads the
// module specifiers `src/` actually imports (not a substring search over the
// text, which a comment explaining the rule would satisfy). Treat a green
// `forge-surface` as evidence about the MANIFEST, not about the source.
//
// REFUSALS ARE DATA (D-379 refusal-as-data): `ok:true` carrying
// {refused, error, op, rule, detail}. Every one of the ten is NAMED, and the
// refusal suite TRIGGERS every one inside an expect() — "appears somewhere in
// the file" is satisfied by a comment and proves nothing.
//
// WHY A CORRUPT BLOB IS A REFUSAL AND NOT A ROW. `InventoryRowSchema` is a
// z.strictObject with nowhere to record "these bytes are not what the receipt
// says". A survey that emitted such a row with a caveat bolted on would be
// reporting an unverified fact in the shape of a verified one, so the re-hash
// (`hashBytes(decoded) === row.hash`, and the length) is a refusal instead.
import { definePlugin, startPlugin } from "@vivim/omega-shim";
import type { PluginContext } from "@vivim/omega-shim";
import {
  FORGE_SURVEY_RENDER_OP, FORGE_SURVEY_RUN_OP,
  MINE_ID_PATTERN, decodeCasBlob, hashBytes, inventoryEnvelope, inventoryRowOf, renderAtlas,
  type CappedField, type InventoryRow, type SurveyAtlas, type SurveyInventory,
} from "./inventory.ts";
import { distinctCasRefs, readBlobs, readReceipt, receiptFiles, type ReceiptFileRow } from "./survey.ts";

export {
  CAS_REF_PATTERN, CAS_ROW_ID_PREFIX, FORGE_SURVEY_OPS, FORGE_SURVEY_PLUGIN_ID,
  FORGE_SURVEY_RENDER_OP, FORGE_SURVEY_RUN_OP, GET_MANY_CHUNK, LANGUAGE_BY_EXTENSION,
  MINE_ID_PATTERN, MAX_FIELD_ITEMS, RECEIPT_ID_PREFIX, RECEIPT_NAMESPACE, SHA256_PATTERN,
  capField, decodeCasBlob, extract, hashBytes, inventoryEnvelope, inventoryRowOf,
  languageOf, mineIdDigest, mineIdSlug, receiptRowId, renderAtlas,
} from "./inventory.ts";
export type { CappedField, Extracted, InventoryRow, SurveyAtlas, SurveyInventory } from "./inventory.ts";
export { classifyFailure } from "./survey.ts";

// ---- the refusal envelope (D-379 refusal-as-data) ------------------------------

export interface SurveyRefusal {
  refused: true;
  error: "REFUSED";
  op: string;
  rule: string;
  detail: string;
}

function refuse(op: string, rule: string, detail: string): SurveyRefusal {
  return { refused: true, error: "REFUSED", op, rule, detail };
}

/** Every named failure these two ops can produce. The refusal suite asserts
 *  each one is actually TRIGGERED, not merely named. */
export const SURVEY_REFUSAL_RULES = [
  "SURVEY_RUN_MALFORMED_INPUT",    // run payload is not {mineId} (or carries unknown fields)
  "SURVEY_RENDER_MALFORMED_INPUT", // render payload is neither {mineId} nor {inventory} (or carries both/neither/unknown)
  "SURVEY_MINE_ID_MALFORMED",      // mineId is not `<repo>@<7-64 hex>` — an unpinned tree has no identity
  "SURVEY_RECEIPT_MISSING",        // no capture receipt is stored for that pin
  "SURVEY_RECEIPT_MALFORMED",      // the stored row is not a readable CaptureReceipt@1 with verifiable file rows
  "SURVEY_BLOB_MISSING",           // a cited casRef is not in the ledger (getmany returns found:false — data, not an error)
  "SURVEY_BLOB_MALFORMED",         // the stored row is not a decodable CAS blob
  "SURVEY_BLOB_MISMATCH",          // the decoded bytes do not re-hash to the address the receipt cited
  "SURVEY_INVENTORY_MALFORMED",    // a supplied inventory envelope is not one (render's no-I/O form)
  "SURVEY_LEDGER_REFUSED",         // the receipt or the blobs could not be read: port refused or the vault failed
] as const;
export type SurveyRefusalRule = (typeof SURVEY_REFUSAL_RULES)[number];

// ---- the shared resolution (the ONLY thing run@1 and render@1 both do) --------

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

type Resolved =
  | { kind: "inventory"; inventory: SurveyInventory }
  | { kind: "refused"; op: string; rule: string; detail: string };

/** Mine id → the inventory, entirely through the ledger. Every branch returns a
 *  NAMED rule; none of them degrades into a partial answer. */
async function resolveInventory(mineId: string, op: string, ctx: PluginContext): Promise<Resolved> {
  const read = await readReceipt(ctx, mineId);
  if (read.kind === "missing") {
    return { kind: "refused", op, rule: "SURVEY_RECEIPT_MISSING", detail: `no capture receipt is stored for ${mineId}: ${read.detail} — run forge.mine.capture@1 first; a READ op never manufactures the evidence it is asked to describe` };
  }
  if (read.kind === "refused") {
    return { kind: "refused", op, rule: "SURVEY_LEDGER_REFUSED", detail: `${read.detail} — a receipt the ledger will not serve is not a surveyable receipt` };
  }
  if (!isRecord(read.row.data)) {
    return { kind: "refused", op, rule: "SURVEY_RECEIPT_MALFORMED", detail: `receipt row ${read.row.id} holds ${Array.isArray(read.row.data) ? "an array" : typeof read.row.data}, not a JSON object — there is no CaptureReceipt@1 here, and this op will not report an inventory about a row it cannot read` };
  }
  const files = receiptFiles(read.row.data);
  if ("why" in files) {
    return { kind: "refused", op, rule: "SURVEY_RECEIPT_MALFORMED", detail: `receipt row ${read.row.id} is not a surveyable CaptureReceipt@1: ${files.why}` };
  }
  const rootHash = read.row.data["rootHash"];
  if (typeof rootHash !== "string" || !/^sha256:[0-9a-f]{64}$/.test(rootHash)) {
    return { kind: "refused", op, rule: "SURVEY_RECEIPT_MALFORMED", detail: `receipt row ${read.row.id} declares rootHash ${JSON.stringify(rootHash)}; a survey names the root hash its rows were taken under, so an absent or malformed one is a refusal` };
  }

  const ids = distinctCasRefs(files.rows);
  const batch = await readBlobs(ctx, ids);
  if (batch.kind === "ledgerRefused") {
    return { kind: "refused", op, rule: "SURVEY_LEDGER_REFUSED", detail: `${batch.detail} — an inventory that cannot see the blobs is not an empty inventory` };
  }
  for (const id of ids) {
    const entry = batch.byId.get(id);
    if (entry === undefined || (entry as { found?: unknown }).found !== true) {
      return { kind: "refused", op, rule: "SURVEY_BLOB_MISSING", detail: `casRef ${id} is cited by the receipt but is not in vault ns proposal — the receipt's address has nothing behind it, and an inventory row over missing bytes would be a claim, not an observation` };
    }
  }

  const rows: InventoryRow[] = [];
  const capped: CappedField[] = [];
  for (const file of files.rows as ReceiptFileRow[]) {
    const entry = batch.byId.get(file.casRef) as { data?: unknown };
    const decoded = decodeCasBlob(entry.data);
    if (decoded === null) {
      return { kind: "refused", op, rule: "SURVEY_BLOB_MALFORMED", detail: `casRef ${file.casRef} (${file.path}) is stored in a shape this op cannot decode: ${JSON.stringify(entry.data).slice(0, 200)}` };
    }
    // THE CONTENT ADDRESS, RE-DERIVED. Two independent things must agree: the
    // bytes must hash to the address the receipt cited, and they must be as long
    // as the receipt said. A row that survived one and not the other is corrupt,
    // and InventoryRowSchema has nowhere to say so.
    const rehash = hashBytes(decoded);
    if (rehash !== file.hash || decoded.length !== file.bytes) {
      return { kind: "refused", op, rule: "SURVEY_BLOB_MISMATCH", detail: `casRef ${file.casRef} (${file.path}) decodes to ${decoded.length} byte(s) hashing to ${rehash}; the receipt cites ${file.bytes} byte(s) at ${file.hash} — the blob is corrupt or the receipt is, and an inventory row has nowhere to record that` };
    }
    const built = inventoryRowOf(file, decoded);
    rows.push(built.row);
    capped.push(...built.capped);
  }
  return { kind: "inventory", inventory: inventoryEnvelope(mineId, rootHash, rows, capped) };
}

// ---- forge.survey.run@1 ---------------------------------------------------------

/** Closed grammar: `{mineId}` and nothing else. */
const RUN_KNOWN_FIELDS = ["mineId"] as const;

export async function surveyRun(payload: unknown, ctx: PluginContext): Promise<SurveyInventory | SurveyRefusal> {
  if (!isRecord(payload)) {
    return refuse(FORGE_SURVEY_RUN_OP, "SURVEY_RUN_MALFORMED_INPUT",
      `payload must be {mineId} (got ${payload === null ? "null" : Array.isArray(payload) ? "array" : typeof payload})`);
  }
  for (const key of Object.keys(payload)) {
    if (!(RUN_KNOWN_FIELDS as readonly string[]).includes(key)) {
      return refuse(FORGE_SURVEY_RUN_OP, "SURVEY_RUN_MALFORMED_INPUT",
        `payload carries unknown field "${key}" — the run grammar is closed (known: ${RUN_KNOWN_FIELDS.join(", ")})`);
    }
  }
  const mineId = payload["mineId"];
  if (typeof mineId !== "string" || mineId.length === 0) {
    return refuse(FORGE_SURVEY_RUN_OP, "SURVEY_RUN_MALFORMED_INPUT",
      `payload.mineId must be a non-empty mine id (got ${mineId === null ? "null" : typeof mineId})`);
  }
  if (!MINE_ID_PATTERN.test(mineId)) {
    return refuse(FORGE_SURVEY_RUN_OP, "SURVEY_MINE_ID_MALFORMED",
      `mineId ${JSON.stringify(mineId)} does not match <repo>@<7-64 hex pin> — an unpinned tree has no identity to survey, so it is refused rather than described`);
  }

  const resolved = await resolveInventory(mineId, FORGE_SURVEY_RUN_OP, ctx);
  if (resolved.kind === "refused") {
    return refuse(resolved.op, resolved.rule, resolved.detail);
  }
  ctx.log(`forge.survey.run: ${mineId} → ${resolved.inventory.count} row(s), ${resolved.inventory.capped.length} capped field(s), rootHash ${resolved.inventory.rootHash}`);
  return resolved.inventory;
}

// ---- forge.survey.render@1 ------------------------------------------------------

/** The two legal shapes, declared as a closed pair — never both, never neither. */
const RENDER_KNOWN_FIELDS = ["mineId", "inventory"] as const;

/** A supplied inventory must be one this op could have produced: the envelope
 *  shape, a pinned mine id, a root hash, rows that carry the frozen row shape,
 *  and a `capped[]` that adds up. An envelope that does not is refused rather
 *  than rendered — rendering an inventory this op would not have emitted would
 *  make the renderer a second, laxer entry point into the same facts. */
function checkInventory(value: unknown): { ok: true; inventory: SurveyInventory } | { ok: false; why: string } {
  if (!isRecord(value)) return { ok: false, why: `inventory is ${value === null ? "null" : Array.isArray(value) ? "an array" : typeof value}, not an object` };
  if (value["schemaVersion"] !== "1" || value["op"] !== FORGE_SURVEY_RUN_OP) {
    return { ok: false, why: `inventory declares schemaVersion ${JSON.stringify(value["schemaVersion"])} / op ${JSON.stringify(value["op"])}; a SurveyInventory@1 declares "1" / "${FORGE_SURVEY_RUN_OP}"` };
  }
  const mineId = value["mineId"];
  if (typeof mineId !== "string" || !MINE_ID_PATTERN.test(mineId)) {
    return { ok: false, why: `inventory.mineId ${JSON.stringify(mineId)} is not <repo>@<7-64 hex>` };
  }
  if (typeof value["rootHash"] !== "string" || !/^sha256:[0-9a-f]{64}$/.test(value["rootHash"])) {
    return { ok: false, why: `inventory.rootHash ${JSON.stringify(value["rootHash"])} is not sha256:<64 hex>` };
  }
  if (!Array.isArray(value["rows"])) return { ok: false, why: `inventory.rows is ${value["rows"] === undefined ? "absent" : typeof value["rows"]}, not an array` };
  if (!Array.isArray(value["capped"])) return { ok: false, why: `inventory.capped is ${value["capped"] === undefined ? "absent" : typeof value["capped"]}, not an array` };
  for (const row of value["rows"] as unknown[]) {
    if (!isRecord(row)) return { ok: false, why: `inventory.rows holds ${row === null ? "null" : typeof row}, not a row object` };
    const strings = ["path", "hash"];
    for (const f of strings) {
      if (typeof row[f] !== "string" || (row[f] as string).length === 0) return { ok: false, why: `inventory row carries no ${f}` };
    }
    if (typeof row["bytes"] !== "number" || !Number.isInteger(row["bytes"]) || row["bytes"] < 0) return { ok: false, why: `inventory row ${row["path"]}: bytes is not a byte count` };
    if (!(row["language"] === null || (typeof row["language"] === "string" && (row["language"] as string).length > 0))) {
      return { ok: false, why: `inventory row ${row["path"]}: language must be a non-empty string or null` };
    }
    for (const f of ["exports", "imports", "models", "headings"]) {
      if (!Array.isArray(row[f]) || (row[f] as unknown[]).some((x) => typeof x !== "string" || (x as string).length === 0)) {
        return { ok: false, why: `inventory row ${row["path"]}: ${f} must be an array of non-empty strings` };
      }
    }
  }
  if (value["count"] !== (value["rows"] as unknown[]).length) {
    return { ok: false, why: `inventory.count says ${JSON.stringify(value["count"])} but rows[] holds ${(value["rows"] as unknown[]).length} — an envelope that over-claims its own rows` };
  }
  for (const c of value["capped"] as unknown[]) {
    if (!isRecord(c)) return { ok: false, why: `inventory.capped holds ${c === null ? "null" : typeof c}, not an object` };
    for (const f of ["path", "field"]) {
      if (typeof c[f] !== "string" || (c[f] as string).length === 0) return { ok: false, why: `inventory.capped row carries no ${f}` };
    }
    for (const f of ["kept", "dropped"]) {
      if (typeof c[f] !== "number" || !Number.isInteger(c[f]) || (c[f] as number) < 0) return { ok: false, why: `inventory.capped row: ${f} is not a count` };
    }
  }
  return { ok: true, inventory: value as unknown as SurveyInventory };
}

export async function surveyRender(payload: unknown, ctx: PluginContext): Promise<SurveyAtlas | SurveyRefusal> {
  if (!isRecord(payload)) {
    return refuse(FORGE_SURVEY_RENDER_OP, "SURVEY_RENDER_MALFORMED_INPUT",
      `payload must be {mineId} or {inventory} (got ${payload === null ? "null" : Array.isArray(payload) ? "array" : typeof payload})`);
  }
  for (const key of Object.keys(payload)) {
    if (!(RENDER_KNOWN_FIELDS as readonly string[]).includes(key)) {
      return refuse(FORGE_SURVEY_RENDER_OP, "SURVEY_RENDER_MALFORMED_INPUT",
        `payload carries unknown field "${key}" — the render grammar is closed (known: ${RENDER_KNOWN_FIELDS.join(", ")})`);
    }
  }
  const hasMine = Object.prototype.hasOwnProperty.call(payload, "mineId");
  const hasInventory = Object.prototype.hasOwnProperty.call(payload, "inventory");
  if (hasMine === hasInventory) {
    return refuse(FORGE_SURVEY_RENDER_OP, "SURVEY_RENDER_MALFORMED_INPUT",
      `payload must carry exactly one of mineId / inventory (got ${hasMine ? "mineId" : "neither"}${hasMine && hasInventory ? " AND inventory" : ""}) — two ways in is not one grammar`);
  }

  let inventory: SurveyInventory;
  if (hasInventory) {
    const checked = checkInventory(payload["inventory"]);
    if (!checked.ok) {
      return refuse(FORGE_SURVEY_RENDER_OP, "SURVEY_INVENTORY_MALFORMED",
        `${checked.why} — render will not draw an inventory it could not have produced itself`);
    }
    inventory = checked.inventory;
  } else {
    const mineId = payload["mineId"];
    if (typeof mineId !== "string" || mineId.length === 0) {
      return refuse(FORGE_SURVEY_RENDER_OP, "SURVEY_RENDER_MALFORMED_INPUT",
        `payload.mineId must be a non-empty mine id (got ${mineId === null ? "null" : typeof mineId})`);
    }
    if (!MINE_ID_PATTERN.test(mineId)) {
      return refuse(FORGE_SURVEY_RENDER_OP, "SURVEY_MINE_ID_MALFORMED",
        `mineId ${JSON.stringify(mineId)} does not match <repo>@<7-64 hex pin> — an unpinned tree has no atlas`);
    }
    const resolved = await resolveInventory(mineId, FORGE_SURVEY_RENDER_OP, ctx);
    if (resolved.kind === "refused") {
      return refuse(resolved.op, resolved.rule, resolved.detail);
    }
    inventory = resolved.inventory;
  }

  // Pure from here: the renderer is a function of the inventory and nothing else,
  // which is what lets render be swapped without touching the resolver.
  const atlas = renderAtlas(inventory);
  ctx.log(`forge.survey.render: ${inventory.mineId} → atlas of ${atlas.count} section(s), ${atlas.atlas.length} byte(s) (${atlas.capped.length} capped field(s))`);
  return atlas;
}

startPlugin(definePlugin({
  ops: {
    [FORGE_SURVEY_RUN_OP]: (payload: unknown, ctx: PluginContext) => surveyRun(payload, ctx),
    [FORGE_SURVEY_RENDER_OP]: (payload: unknown, ctx: PluginContext) => surveyRender(payload, ctx),
  },
}));
