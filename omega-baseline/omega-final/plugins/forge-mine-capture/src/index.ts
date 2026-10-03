// forge.mine.capture — src/index.ts (D-409 / D-417 §5 lane 1)
// The Mine Capture seam: `forge.mine.capture@1`, EXTERNAL_MUTATION — Class 3,
// "the ONE filesystem seam". D-409 split the mine family along the risk-class
// boundary and this directory is the EXTERNAL_MUTATION half: it READS a
// declared, pinned legacy tree. The READ siblings (verify/diff/list@1) belong
// to the separate `plugins/forge-mine/` plugin and are NOT declared here — a
// plugin spans exactly one risk class (FORGE_CLASS_SPAN), so merging them back
// would make this plugin a lie.
//
// Op (CONTRACT contribution, see plugin.json):
//   forge.mine.capture@1  EXTERNAL_MUTATION
//     {mineRoot, mineId} → CaptureReceipt@1 (pack.builder's frozen shape)
//
// Read-only BY CONSTRUCTION: the walk only ever calls lstat/readdir/readFile/
// realpath on the mine. The single mutation in the whole op is the append of
// the receipt to the governed proposal namespace (D-409 SF1 — ns `proposal`
// unless retention differs, which nothing has yet shown), followed by a
// read-back that must return the row byte-identical or the op refuses.
//
// Refusals are DATA (the house's D-379 refusal-as-data pattern, as
// forge.author.init@1 does it): an ok:true PortResult carrying
// {refused: true, error: "REFUSED", op, rule, detail}. Every refusal NAMES the
// failure. The order of the validation chain is policy — structure, then
// identity, then existence, then the law self-check, then the first file byte,
// then the pin, then the ledger — so every refusal leaves the mine tree exactly
// as it found it and leaves no receipt row behind.
//
// Exclusions vs refusals are DIFFERENT facts and the receipt says which is
// which: `refusals[]` records paths excluded BY DECLARED POLICY (dependency
// trees, VCS metadata) — the walk knew about them, decided to leave them out,
// and the receipt carries the reason. A NAMED refusal ends the op: no receipt
// is emitted at all, because a receipt that silently dropped an unreadable or
// escaping entry would attest to a tree it never fully saw.
import { definePlugin, startPlugin } from "@vivim/omega-shim";
import type { PluginContext } from "@vivim/omega-shim";
import type { PortResult } from "@vivim/omega-contracts";
import { lstatSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import {
  EXCLUDED_DIRS, EXCLUDED_FILES, FORGE_MINE_CAPTURE_OP, FORGE_MINE_CAPTURE_PLUGIN_ID,
  MINE_ID_PATTERN, RECEIPT_NAMESPACE, TEXT_NORMALISATION, canonicalJson, casRefFor,
  hashFileBytes, mineIdDigest, mineIdSlug, receiptRowId, rootHashOf,
  type CaptureReceipt, type ReceiptFile, type ReceiptRefusal,
} from "./receipt.ts";

export {
  EXCLUDED_DIRS, EXCLUDED_FILES, FORGE_MINE_CAPTURE_OP, FORGE_MINE_CAPTURE_PLUGIN_ID,
  MINE_ID_PATTERN, RECEIPT_NAMESPACE, TEXT_NORMALISATION, canonicalJson, casRefFor,
  hashFileBytes, mineIdDigest, mineIdSlug, normaliseTextBytes, receiptRowId, rootHashOf,
} from "./receipt.ts";
export type { CaptureReceipt, ReceiptFile, ReceiptRefusal } from "./receipt.ts";

/** The payload grammar is CLOSED (unknown fields refuse by name, the same
 *  discipline forge.author.init@1 uses for its recorded-spec grammar). */
const PAYLOAD_KNOWN_FIELDS = ["mineRoot", "mineId"] as const;

// ---- the refusal envelope (D-379 refusal-as-data) ------------------------------

export interface CaptureRefusal {
  refused: true;
  error: "REFUSED";
  op: string;
  rule: string;
  detail: string;
}

function refuse(rule: string, detail: string): CaptureRefusal {
  return { refused: true, error: "REFUSED", op: FORGE_MINE_CAPTURE_OP, rule, detail };
}

/** Every named failure this op can produce. A refusal test names each one; the
 *  forge-surface gate's FORGE_NO_REFUSAL_TEST requires the op to be named, and
 *  the house discipline requires the RULES to be. */
export const CAPTURE_REFUSAL_RULES = [
  "CAPTURE_MALFORMED_INPUT",     // the payload is not {mineRoot, mineId} (or carries unknown fields)
  "CAPTURE_MINE_ID_MALFORMED",   // mineId is not `<repo>@<7-64 hex>` — an unpinned mine has no identity
  "CAPTURE_MINE_ROOT_MISSING",   // mineRoot is absent, not a directory, or unresolvable
  "CAPTURE_LAW_REFUSED",         // the in-handler law self-check refused (forbidden principal / denied)
  "CAPTURE_PATH_ESCAPE",         // an entry resolves OUTSIDE the declared mine root (symlink/junction escape)
  "CAPTURE_UNREADABLE_FILE",     // an entry could not be stat-ed or read — the receipt would over-claim
  "CAPTURE_EMPTY_MINE",          // zero admitted files: a receipt for nothing attests to nothing
  "CAPTURE_MINE_PIN_MISMATCH",   // the pinned digest in mineId disagrees with the computed rootHash
  "CAPTURE_LEDGER_REFUSED",      // the receipt row was not appended, or did not read back byte-identical
] as const;
export type CaptureRefusalRule = (typeof CAPTURE_REFUSAL_RULES)[number];

// ---- the walk (pure decisions, one I/O seam) -----------------------------------

/** Is `target` inside `root`? Uses relative() rather than a prefix compare so
 *  the answer is right on Windows (case-insensitive volumes) and cannot be
 *  fooled by a sibling directory that merely shares a name prefix. */
export function isInside(root: string, target: string): boolean {
  const rel = relative(resolve(root), resolve(target));
  if (rel === "") return true;
  return !(rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel));
}

/** posix-relative, ".."-free by construction (every segment comes from a
 *  readdir of a directory already inside the root). */
function toReceiptPath(rel: string): string {
  return rel.split(sep).join("/");
}

class WalkAbort extends Error {
  constructor(readonly rule: CaptureRefusalRule, message: string) { super(message); }
}

interface WalkResult { files: ReceiptFile[]; refusals: ReceiptRefusal[] }

/** Walk the mine root, admitting every regular file and refusing to describe a
 *  tree it could not read whole. Throws WalkAbort (a NAMED refusal) rather than
 *  degrading silently — see the header on exclusions vs refusals. */
function walkMine(root: string): WalkResult {
  const files: ReceiptFile[] = [];
  const refusals: ReceiptRefusal[] = [];
  const queue: string[] = [""];
  while (queue.length > 0) {
    const relDir = queue.shift()!;
    const absDir = relDir === "" ? root : join(root, ...relDir.split("/"));
    let entries;
    try {
      entries = readdirSync(absDir, { withFileTypes: true });
    } catch (e) {
      throw new WalkAbort("CAPTURE_UNREADABLE_FILE",
        `cannot list ${relDir === "" ? "." : toReceiptPath(relDir)} under the mine root: ${String(e)}`);
    }
    // Deterministic order: the receipt is a function of the mine, not of the
    // filesystem's directory order.
    entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    for (const entry of entries) {
      const absPath = join(absDir, entry.name);
      const relPath = relDir === "" ? entry.name : `${relDir}/${entry.name}`;
      const receiptPath = toReceiptPath(relPath);

      if (entry.isSymbolicLink()) {
        let resolved: string;
        try {
          resolved = realpathSync(absPath);
        } catch (e) {
          // A dangling link (target removed) or an unresolvable one: we cannot
          // say what it points at, so the receipt cannot honestly include it.
          throw new WalkAbort("CAPTURE_UNREADABLE_FILE",
            `cannot resolve the link ${receiptPath}: ${String(e)} — the receipt would not describe the whole tree`);
        }
        if (!isInside(root, resolved)) {
          throw new WalkAbort("CAPTURE_PATH_ESCAPE",
            `${receiptPath} resolves to ${resolved}, OUTSIDE the declared mine root ${root} — a mine that reaches outside itself is refused, not described`);
        }
        let targetIsDir: boolean;
        try { targetIsDir = statSync(resolved).isDirectory(); } catch (e) {
          throw new WalkAbort("CAPTURE_UNREADABLE_FILE", `cannot stat the link target of ${receiptPath}: ${String(e)}`);
        }
        if (targetIsDir) {
          // Cycle-free by construction: a symlinked directory is an exclusion
          // with its reason, never a second way in (including a link back at
          // the root, which would otherwise recurse forever).
          refusals.push({ path: receiptPath, reason: "symlinked directory is not walked — capture is cycle-free by construction" });
          continue;
        }
        admit(refPath, receiptPath, absPath, files);
        continue;
      }

      if (entry.isDirectory()) {
        const exclusion = Object.prototype.hasOwnProperty.call(EXCLUDED_DIRS, entry.name)
          ? EXCLUDED_DIRS[entry.name] : undefined;
        if (exclusion !== undefined) {
          refusals.push({ path: receiptPath, reason: exclusion });
          continue;
        }
        queue.push(relPath);
        continue;
      }

      if (entry.isFile()) {
        const exclusion = Object.prototype.hasOwnProperty.call(EXCLUDED_FILES, entry.name)
          ? EXCLUDED_FILES[entry.name] : undefined;
        if (exclusion !== undefined) { refusals.push({ path: receiptPath, reason: exclusion }); continue; }
        admit(relPath, receiptPath, absPath, files);
        continue;
      }

      // Sockets, fifos, devices: not mine bytes, and not readable as text
      // either. Excluded by declared policy, with the reason in the receipt.
      refusals.push({ path: receiptPath, reason: "not a regular file or directory — excluded by capture policy" });
    }
  }
  files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  refusals.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return { files, refusals };
}

/** Read one admitted file and hash it under the declared normalisation. */
function admit(relPath: string, receiptPath: string, absPath: string, files: ReceiptFile[]): void {
  let raw: Buffer;
  try {
    raw = readFileSync(absPath);
  } catch (e) {
    throw new WalkAbort("CAPTURE_UNREADABLE_FILE",
      `cannot read ${receiptPath}: ${String(e)} — a receipt that silently dropped it would attest to a tree it never saw`);
  }
  const { hash, bytes } = hashFileBytes(raw);
  files.push({ path: toReceiptPath(relPath), hash, bytes, casRef: casRefFor(hash) });
}

// ---- the law self-check (the manifest's "law-gated" claim, as data) -----------

interface LawDecision { decision?: string; reason?: string }

async function lawSelfCheck(ctx: PluginContext): Promise<void> {
  const r: PortResult = await ctx.port.call("law.check@1", { principal: FORGE_MINE_CAPTURE_PLUGIN_ID, op: FORGE_MINE_CAPTURE_OP });
  if (!r.ok) {
    throw { rule: "CAPTURE_LAW_REFUSED", detail: `law.check@1 refused: ${r.error}: ${String((r as { detail?: string }).detail ?? "")}` };
  }
  const decision = (r.value ?? {}) as LawDecision;
  if (decision.decision !== "allow") {
    throw { rule: "CAPTURE_LAW_REFUSED", detail: `law.check@1 denied ${FORGE_MINE_CAPTURE_OP} for ${FORGE_MINE_CAPTURE_PLUGIN_ID}: ${decision.decision ?? "?"} — ${decision.reason ?? "no reason"}` };
  }
}

// ---- the op --------------------------------------------------------------------

/** forge.mine.capture@1 — the capture. See the header for the chain's order. */
export async function mineCapture(payload: unknown, ctx: PluginContext): Promise<unknown> {
  // a · payload shape — the grammar is closed
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    return refuse("CAPTURE_MALFORMED_INPUT", `payload must be {mineRoot, mineId} (got ${Array.isArray(payload) ? "array" : typeof payload})`);
  }
  const p = payload as Record<string, unknown>;
  for (const key of Object.keys(p)) {
    if (!(PAYLOAD_KNOWN_FIELDS as readonly string[]).includes(key)) {
      return refuse("CAPTURE_MALFORMED_INPUT", `payload carries unknown field "${key}" — the capture grammar is closed (known: ${PAYLOAD_KNOWN_FIELDS.join(", ")})`);
    }
  }
  const declaredRoot = p.mineRoot;
  const mineId = p.mineId;
  if (typeof declaredRoot !== "string" || declaredRoot.length === 0) {
    return refuse("CAPTURE_MALFORMED_INPUT", `payload.mineRoot must be a non-empty path string (got ${declaredRoot === null ? "null" : typeof declaredRoot})`);
  }
  if (typeof mineId !== "string" || mineId.length === 0) {
    return refuse("CAPTURE_MALFORMED_INPUT", `payload.mineId must be a non-empty mine id (got ${mineId === null ? "null" : typeof mineId})`);
  }

  // b · identity — a mine with no pin has no identity to attest
  if (!MINE_ID_PATTERN.test(mineId)) {
    return refuse("CAPTURE_MINE_ID_MALFORMED",
      `mineId ${JSON.stringify(mineId)} does not match <repo>@<7-64 hex pin> — an unpinned tree is refused, not described`);
  }

  // c · existence — the declared root must exist and BE a directory
  let root: string;
  try {
    root = realpathSync(resolve(declaredRoot));
  } catch (e) {
    return refuse("CAPTURE_MINE_ROOT_MISSING", `mineRoot ${declaredRoot} does not resolve on this machine: ${String(e)}`);
  }
  let rootIsDir: boolean;
  try { rootIsDir = statSync(root).isDirectory(); } catch (e) {
    return refuse("CAPTURE_MINE_ROOT_MISSING", `mineRoot ${root} cannot be stat-ed: ${String(e)}`);
  }
  if (!rootIsDir) {
    return refuse("CAPTURE_MINE_ROOT_MISSING", `mineRoot ${root} is not a directory — capture reads a tree, not a file`);
  }

  // d · the law self-check — BEFORE the first file byte leaves the disk
  try {
    await lawSelfCheck(ctx);
  } catch (e) {
    const r = e as { rule?: string; detail?: string };
    if (typeof r?.rule === "string") return refuse(r.rule, r.detail ?? "");
    throw e;
  }

  // e · the walk — the only reads; a NAMED refusal ends the op here
  let walked: WalkResult;
  try {
    walked = walkMine(root);
  } catch (e) {
    if (e instanceof WalkAbort) return refuse(e.rule, e.message);
    throw e;
  }

  // f · an empty capture attests to nothing
  if (walked.files.length === 0) {
    return refuse("CAPTURE_EMPTY_MINE",
      `mineRoot ${root} admits zero files (${walked.refusals.length} excluded) — a receipt with no files in it is not a mine, it is a claim`);
  }

  // g · the pin — mineId's digest MUST be the rootHash we just computed. This
  // is what makes the mine PINNED rather than merely declared: a caller who
  // names the wrong root hash gets a refusal, not a receipt describing
  // something other than what they asked for.
  const rootHash = rootHashOf(walked.files);
  const pinnedDigest = mineIdDigest(mineId);
  if (pinnedDigest !== rootHash.replace(/^sha256:/, "")) {
    return refuse("CAPTURE_MINE_PIN_MISMATCH",
      `mineId ${mineId} pins ${pinnedDigest} but ${root} hashes to ${rootHash.replace(/^sha256:/, "")} — the tree moved under the pin, or the pin names another mine`);
  }

  // h · the receipt, then the ONE mutation: the governed proposal row, and a
  //     read-back that must return it byte-identical (an unsynced write is a
  //     refused capture, never a receipt the ledger does not know about).
  const receipt: CaptureReceipt = {
    schemaVersion: "1",
    op: FORGE_MINE_CAPTURE_OP,
    mineId,
    mineRoot: root,
    capturedAt: new Date().toISOString(),
    fileCount: walked.files.length,
    rootHash,
    files: walked.files,
    refusals: walked.refusals,
  };
  const rowId = receiptRowId(mineId, rootHash);
  const appended: PortResult = await ctx.port.call("vault.append@1", {
    ns: RECEIPT_NAMESPACE,
    id: rowId,
    data: receipt,
    meta: {
      type: "capture-receipt",
      mineId,
      mineSlug: mineIdSlug(mineId),
      rootHash,
      fileCount: walked.files.length,
      refusals: walked.refusals.length,
      producedBy: FORGE_MINE_CAPTURE_OP,
    },
    refs: [],
  });
  if (!appended.ok) {
    return refuse("CAPTURE_LEDGER_REFUSED",
      `the receipt row was refused: ${appended.error}: ${String((appended as { detail?: string }).detail ?? "")} — an unledgered receipt attests to nothing`);
  }
  const readBack: PortResult = await ctx.port.call("vault.get@1", { ns: RECEIPT_NAMESPACE, id: rowId });
  const row = readBack.ok ? (readBack.value as { data?: unknown } | null) : null;
  if (!row || canonicalJson(row.data) !== canonicalJson(receipt)) {
    return refuse("CAPTURE_LEDGER_REFUSED",
      `receipt row ${rowId} did not read back byte-identical — the ledger is the receipt's ground; refuse rather than return a receipt the ledger does not hold`);
  }

  ctx.log(`forge.mine.capture: ${mineId} → ${receipt.fileCount} files, ${walked.refusals.length} excluded, rootHash ${rootHash}, receipt row ${rowId} (normalisation ${TEXT_NORMALISATION})`);
  return receipt;
}

startPlugin(definePlugin({
  ops: {
    [FORGE_MINE_CAPTURE_OP]: (payload: unknown, ctx: PluginContext) => mineCapture(payload, ctx),
  },
}));
