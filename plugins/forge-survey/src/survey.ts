// forge.survey — src/survey.ts (D-417 Wave 1+ lane: the survey ops)
//
// THE ONLY I/O IN THIS COMPARTMENT, and it is two ports: `vault.get@1` for the
// one receipt row, and chunked `vault.getmany@1` for its CAS blobs. There is no
// `node:fs` import anywhere in `plugins/forge-survey/src/`, and that is not a
// style preference — it is the class. Reading a foreign legacy tree is the
// capture seam's EXTERNAL_MUTATION, consent-gated act (D-409); if a READ op
// could re-walk the mine, that split would be a fiction, because the dangerous
// act would live behind an ungated op. This compartment reads the snapshot AS
// STORED and every check below is a function of ledger bytes alone.
//
// THE PINS ARE NOT ASSUMED, THEY ARE DERIVED. The receipt row id is re-derived
// from the mine id's own pin (`receiptRowId`, mirrored), and the capture refuses
// unless pin == rootHash — so the two derivations agree by construction, and
// the suite asserts that agreement on the LIVE receipt rather than trusting it.
//
// TWO FAILURES THAT LOOK ALIKE. `vault.get@1` THROWS on a missing row
// (vivim-vault sql.ts:234), which the shim maps to `{ok:false,
// error:"DEGRADED", detail:"handler vault.get@1 threw: …"}` (shim
// src/index.ts:101) — so "the receipt is not there" and "the ledger is closed"
// arrive in the SAME envelope and must be told apart, which is what
// `classifyFailure` is for: the vault's own "no object … (not found)" is
// ABSENCE, and everything else (including a capability REFUSED) fails CLOSED
// toward "I could not read it". `vault.getmany@1` needs no classifier at all:
// a missing id is DATA (`{id, found:false}`, sql.ts:266), never an error,
// precisely so a batch cannot lose its other rows.
import type { PluginContext } from "@vivim/omega-shim";
import type { PortResult } from "@vivim/omega-contracts";
import {
  CAS_REF_PATTERN, GET_MANY_CHUNK, RECEIPT_NAMESPACE, SHA256_PATTERN, receiptRowId,
} from "./inventory.ts";

type LedgerRow = { id: string; data: unknown };

export type LedgerRead =
  | { kind: "row"; row: LedgerRow }
  | { kind: "missing"; detail: string }
  | { kind: "refused"; detail: string };

/** Classify a failed port call — copied from `plugins/forge-mine/src/index.ts`
 *  (the same two facts, the same fail-closed default) rather than imported:
 *  sharing the RULE matters, sharing the module would make this compartment
 *  depend on a sibling's authority. DEGRADED + the vault's own "no object …
 *  (not found)" is ABSENCE; anything else is a closed ledger. */
export function classifyFailure(r: PortResult): "missing" | "refused" {
  const detail = String((r as { detail?: string }).detail ?? "");
  if (r.error === "REFUSED") return "refused";
  if (/no object\b/i.test(detail) && /\(not found\)/i.test(detail)) return "missing";
  return "refused";
}

/** Read the ONE receipt row for a pinned mine. */
export async function readReceipt(ctx: PluginContext, mineId: string): Promise<LedgerRead> {
  const id = receiptRowId(mineId);
  const r: PortResult = await ctx.port.call("vault.get@1", { ns: RECEIPT_NAMESPACE, id });
  if (!r.ok) {
    const detail = `vault.get@1 ${RECEIPT_NAMESPACE}/${id} → ${r.error}: ${String((r as { detail?: string }).detail ?? "")}`;
    return classifyFailure(r) === "missing" ? { kind: "missing", detail } : { kind: "refused", detail };
  }
  const v = r.value as { data?: unknown } | null;
  if (v === null || v === undefined || v.data === undefined || v.data === null) {
    return { kind: "missing", detail: `vault.get@1 ${RECEIPT_NAMESPACE}/${id} returned a row with no data — a receipt with nothing in it is not a receipt` };
  }
  return { kind: "row", row: { id, data: v.data } };
}

export type BlobBatch =
  | { kind: "rows"; byId: Map<string, unknown> }
  | { kind: "ledgerRefused"; detail: string };

/** Read every distinct casRef in bounded batches. One hop for many ids — the
 *  alternative is one round trip per file, which on a 42-file mine is 42 host
 *  dispatches instead of one. */
export async function readBlobs(ctx: PluginContext, ids: readonly string[]): Promise<BlobBatch> {
  const byId = new Map<string, unknown>();
  for (let i = 0; i < ids.length; i += GET_MANY_CHUNK) {
    const chunk = ids.slice(i, i + GET_MANY_CHUNK);
    const r: PortResult = await ctx.port.call("vault.getmany@1", { ns: RECEIPT_NAMESPACE, ids: chunk });
    if (!r.ok) {
      return {
        kind: "ledgerRefused",
        detail: `vault.getmany@1 ${RECEIPT_NAMESPACE} (${chunk.length} id(s) from ${chunk[0]}) → ${r.error}: ${String((r as { detail?: string }).detail ?? "")}`,
      };
    }
    const raw = r.value;
    if (!Array.isArray(raw)) {
      return { kind: "ledgerRefused", detail: `vault.getmany@1 returned ${raw === null ? "null" : typeof raw}, not a row array — the ledger answered something this op cannot read honestly` };
    }
    for (const entry of raw as Array<{ id?: unknown; found?: unknown; data?: unknown }>) {
      byId.set(String(entry?.id ?? ""), entry);
    }
  }
  return { kind: "rows", byId };
}

/** The receipt's file rows, reduced to what a survey needs and checked hard
 *  enough that the inventory can never be built from a row it did not verify.
 *  Returns the reason as a string so the caller names it in its own rule
 *  vocabulary. */
export interface ReceiptFileRow { path: string; hash: string; bytes: number; casRef: string }

export function receiptFiles(data: Record<string, unknown>): { rows: ReceiptFileRow[] } | { why: string } {
  if (data["schemaVersion"] !== "1" || data["op"] !== "forge.mine.capture@1") {
    return { why: `the stored row declares schemaVersion ${JSON.stringify(data["schemaVersion"])} / op ${JSON.stringify(data["op"])}; a CaptureReceipt@1 declares "1" / "forge.mine.capture@1"` };
  }
  const raw = data["files"];
  if (!Array.isArray(raw)) {
    return { why: `files[] is ${raw === undefined ? "absent" : Array.isArray(raw) ? "unreadable" : typeof raw}, not an array — there is no inventory to build` };
  }
  const rows: ReceiptFileRow[] = [];
  for (const f of raw as Array<Record<string, unknown>>) {
    const path = f?.["path"];
    const hash = f?.["hash"];
    const bytes = f?.["bytes"];
    const casRef = f?.["casRef"];
    if (typeof path !== "string" || path.length === 0) return { why: `a files[] row carries no path (${JSON.stringify(f)})` };
    if (typeof hash !== "string" || !SHA256_PATTERN.test(hash)) return { why: `${path}: hash ${JSON.stringify(hash)} is not sha256:<64 hex> — a row the survey cannot re-verify is not a row it can report` };
    if (typeof bytes !== "number" || !Number.isInteger(bytes) || bytes < 0) return { why: `${path}: bytes ${JSON.stringify(bytes)} is not a byte count` };
    if (typeof casRef !== "string" || !CAS_REF_PATTERN.test(casRef) || casRef !== `cas:${hash}`) {
      return { why: `${path}: casRef ${JSON.stringify(casRef)} is not \`cas:${hash}\` — the address must stay a pure function of the content, or a survey would be citing bytes nothing claims to hold` };
    }
    rows.push({ path, hash, bytes, casRef });
  }
  if (rows.length === 0) return { why: "files[] is empty — a receipt for zero files describes nothing a survey could report" };
  return { rows };
}

/** The distinct casRefs of a receipt's file rows, in first-seen path order. */
export function distinctCasRefs(rows: readonly ReceiptFileRow[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of rows) {
    if (seen.has(r.casRef)) continue;
    seen.add(r.casRef);
    out.push(r.casRef);
  }
  return out;
}
