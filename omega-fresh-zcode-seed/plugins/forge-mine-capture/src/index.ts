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
// realpath on the mine. Every mutation in the whole op is an append to the
// governed proposal namespace (D-409 SF1 — ns `proposal` unless retention
// differs, which nothing has yet shown), followed by a read-back that must
// return the row byte-identical or the op refuses. TWO append families, in a
// fixed order:
//
//   1. one CAS row per DISTINCT casRef, id `cas:<sha256hex>` — the bytes the
//      receipt's addresses point at (D-409 SF2, decided by D-TEAM-023). The
//      payload is the NORMALISED buffer `fileHashAndBytes` hashed and counted,
//      base64, so `hashBytes(decodeCasBlob(row)) === row.hash` holds for every
//      row in every mine.
//   2. the receipt row, id `mine:<repo>/<rootHash>`.
//
// The order is the FAIL-CLOSED LAW, not an implementation detail: no receipt is
// emitted for a snapshot that is not fully materialised. The converse is safe —
// orphan CAS rows are inert, because nothing cites them except a receipt, and a
// receipt is only returned once every blob it cites read back byte-identical.
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
  MINE_ID_PATTERN, RECEIPT_NAMESPACE, TEXT_NORMALISATION, canonicalJson, casBlobRow, casRefFor,
  decodeCasBlob, fileHashAndBytes, mineIdDigest, mineIdSlug, receiptRowId, rootHashOf,
  type CaptureReceipt, type ReceiptFile, type ReceiptRefusal,
} from "./receipt.ts";

export {
  CAS_ROW_ID_PREFIX, EXCLUDED_DIRS, EXCLUDED_FILES, FORGE_MINE_CAPTURE_OP, FORGE_MINE_CAPTURE_PLUGIN_ID,
  MINE_ID_PATTERN, RECEIPT_NAMESPACE, TEXT_NORMALISATION, canonicalJson, casBlobRow, casRefFor,
  decodeCasBlob, fileHashAndBytes, hashFileBytes, hashBytes, mineIdDigest, mineIdSlug,
  normaliseTextBytes, receiptRowId, rootHashOf,
} from "./receipt.ts";
export type { CaptureReceipt, CasBlobRow, ReceiptFile, ReceiptRefusal } from "./receipt.ts";

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
  // The ledger, not the receipt specifically: a CAS blob row that was not
  // appended or did not read back byte-identical, OR the receipt row likewise.
  // ONE rule covers both paths and the DETAIL says which died — it carries the
  // offending `cas:<sha256hex>` id or the `mine:<repo>/<rootHash>` id. A ninth
  // rule would not have been more honest; a tenth test on an exact-set assertion
  // would have been more brittle. What matters is that the detail never leaves
  // the reader guessing which ledger write failed.
  "CAPTURE_LEDGER_REFUSED",
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

/** One admitted file's bytes, retained for the CAS append. Keyed by casRef, so
 *  two byte-identical files in one mine share ONE blob row (content addressing
 *  means equal content ⇒ equal address; writing two would be the same fact
 *  twice). Insertion order is the order the walk first admitted the path, which
 *  is path order — the receipt is a function of the mine, not of readdir. */
interface CasSource { casRef: string; hash: string; bytes: number; normalised: Buffer }

interface WalkResult { files: ReceiptFile[]; refusals: ReceiptRefusal[]; blobs: Map<string, CasSource> }

/** Walk the mine root, admitting every regular file and refusing to describe a
 *  tree it could not read whole. Throws WalkAbort (a NAMED refusal) rather than
 *  degrading silently — see the header on exclusions vs refusals. */
function walkMine(root: string): WalkResult {
  const files: ReceiptFile[] = [];
  const refusals: ReceiptRefusal[] = [];
  const blobs = new Map<string, CasSource>();
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
        admit(relPath, receiptPath, absPath, files, blobs);
        continue;
      }

      // Sockets, fifos, devices: not mine bytes, and not readable as text
      // either. Excluded by declared policy, with the reason in the receipt.
      refusals.push({ path: receiptPath, reason: "not a regular file or directory — excluded by capture policy" });
    }
  }
  files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  refusals.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  // Re-key the blob map into receipt-path order so the CAS append order is a
  // function of the mine's paths, not of the order the queue happened to pop.
  const ordered = new Map<string, CasSource>();
  for (const f of files) {
    const src = blobs.get(f.casRef);
    if (src !== undefined) ordered.set(f.casRef, src);
  }
  return { files, refusals, blobs: ordered };
}

/** Read one admitted file, hash it under the declared normalisation, and RETAIN
 *  the normalised buffer for the CAS append. The retention is the whole point:
 *  until SF2 landed, `hashFileBytes` returned only an address and the bytes
 *  were dropped on the floor, which made every casRef an address with nothing
 *  behind it. The buffer kept here is the NORMALISED one — the bytes the hash
 *  and the byte count both describe — never the raw on-disk bytes, which on a
 *  CRLF checkout do not re-hash to the receipt's hash. */
function admit(relPath: string, receiptPath: string, absPath: string, files: ReceiptFile[], blobs: Map<string, CasSource>): void {
  let raw: Buffer;
  try {
    raw = readFileSync(absPath);
  } catch (e) {
    throw new WalkAbort("CAPTURE_UNREADABLE_FILE",
      `cannot read ${receiptPath}: ${String(e)} — a receipt that silently dropped it would attest to a tree it never saw`);
  }
  const { hash, bytes, normalised } = fileHashAndBytes(raw);
  const casRef = casRefFor(hash);
  files.push({ path: toReceiptPath(relPath), hash, bytes, casRef });
  if (!blobs.has(casRef)) blobs.set(casRef, { casRef, hash, bytes, normalised });
}

// ---- the CAS append (the producer half of SF2, decided by D-TEAM-023) ---------

/** One getmany call's id budget. This is `GET_MANY_BOUND` (vivim-vault
 *  sql.ts:242) mirrored rather than imported: the value is a fact about the
 *  PORT's contract, and a plugin that imported the vault's module to learn it
 *  would couple the compartment to the implementation of the port it calls.
 *  Over the bound the port REFUSES (→ DEGRADED), so this is a hard chunk size. */
const CAS_READ_BACK_CHUNK = 512;

/** Append every distinct blob the receipt will cite and read them all back.
 *  Returns null on success, or the DETAIL of the refusal to return — a detail,
 *  never a thrown error, because both ledger paths share one rule and the
 *  caller's envelope carries the op.
 *
 *  The read-back compares DECODED BYTES, not the serialised row: that is the
 *  stronger check (it proves the payload survived base64 and still matches what
 *  was hashed) and it is the same comparison a consumer must make. A row that
 *  decodes to something else is a named failure here rather than a mystery
 *  downstream. */
async function materialiseCasBlobs(ctx: PluginContext, blobs: ReadonlyMap<string, CasSource>): Promise<string | null> {
  const ids = [...blobs.keys()];
  for (const id of ids) {
    const src = blobs.get(id)!;
    const appended: PortResult = await ctx.port.call("vault.append@1", {
      ns: RECEIPT_NAMESPACE,
      id,
      data: casBlobRow(src.casRef, src.hash, src.normalised),
      meta: {
        type: "cas-blob",
        casRef: src.casRef,
        hash: src.hash,
        bytes: src.bytes,
        producedBy: FORGE_MINE_CAPTURE_OP,
      },
      refs: [],
    });
    if (!appended.ok) {
      return `CAS blob row ${id} was refused: ${appended.error}: ${String((appended as { detail?: string }).detail ?? "")} — an unledgered blob leaves the receipt citing an address with nothing behind it`;
    }
  }
  for (let i = 0; i < ids.length; i += CAS_READ_BACK_CHUNK) {
    const chunk = ids.slice(i, i + CAS_READ_BACK_CHUNK);
    const got: PortResult = await ctx.port.call("vault.getmany@1", { ns: RECEIPT_NAMESPACE, ids: chunk });
    if (!got.ok) {
      return `CAS blob rows ${chunk[0]}..${chunk[chunk.length - 1]} could not be read back: ${got.error}: ${String((got as { detail?: string }).detail ?? "")} — an unledgered blob leaves the receipt citing an address with nothing behind it`;
    }
    const raw = got.value;
    if (!Array.isArray(raw)) {
      return `vault.getmany@1 returned ${raw === null ? "null" : typeof raw}, not a row array — the ledger answered something this op cannot read honestly, and an unledgered blob leaves the receipt citing an address with nothing behind it`;
    }
    const byId = new Map<string, { found?: unknown; data?: unknown }>();
    for (const r of raw as Array<{ id?: unknown; found?: unknown; data?: unknown }>) byId.set(String(r?.id ?? ""), r);
    for (const id of chunk) {
      const row = byId.get(id);
      if (row === undefined || row.found !== true) {
        return `CAS blob row ${id} is not in the ledger — an unledgered blob leaves the receipt citing an address with nothing behind it`;
      }
      const decoded = decodeCasBlob(row.data);
      const want = blobs.get(id)!.normalised;
      if (decoded === null || !decoded.equals(want)) {
        return `CAS blob row ${id} did not read back byte-identical — the ledger is the blob's ground; refuse rather than return a receipt citing a row the ledger does not hold (an unledgered blob attests to nothing)`;
      }
    }
  }
  return null;
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

  // h · the CAS blobs FIRST, then the receipt. The order is the fail-closed
  //     law: a receipt is only returned for a snapshot that is fully
  //     materialised, so no caller ever receives a receipt whose casRefs
  //     resolve to nothing.
  const blobFailure = await materialiseCasBlobs(ctx, walked.blobs);
  if (blobFailure !== null) return refuse("CAPTURE_LEDGER_REFUSED", blobFailure);

  // i · the receipt row, read back byte-identical (an unsynced write is a
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
      `the receipt row ${rowId} was refused: ${appended.error}: ${String((appended as { detail?: string }).detail ?? "")} — an unledgered receipt attests to nothing`);
  }
  const readBack: PortResult = await ctx.port.call("vault.get@1", { ns: RECEIPT_NAMESPACE, id: rowId });
  const row = readBack.ok ? (readBack.value as { data?: unknown } | null) : null;
  if (!row || canonicalJson(row.data) !== canonicalJson(receipt)) {
    return refuse("CAPTURE_LEDGER_REFUSED",
      `receipt row ${rowId} did not read back byte-identical — the ledger is the receipt's ground; refuse rather than return a receipt the ledger does not hold (an unledgered receipt attests to nothing)`);
  }

  ctx.log(`forge.mine.capture: ${mineId} → ${receipt.fileCount} files, ${walked.refusals.length} excluded, rootHash ${rootHash}, ${walked.blobs.size} cas blob rows, receipt row ${rowId} (normalisation ${TEXT_NORMALISATION})`);
  return receipt;
}

startPlugin(definePlugin({
  ops: {
    [FORGE_MINE_CAPTURE_OP]: (payload: unknown, ctx: PluginContext) => mineCapture(payload, ctx),
  },
}));
