// vivim.law — index.ts (Ω1 spine)
// The gate. Wiring: policy (data) + consent table + forbidden-action overlay +
// shadow amendment + registry, exposed as READ-risk contracts. Mutating host
// capabilities (journal append, tokens revoke) are exercised ONLY through ports,
// and journaling is best-effort — a law decision is never blocked by a journal failure.
//
// D-416 (S3, the evidence-store fold): law's narrative journal rows ride the vault
// chain wherever port:vault.append@1 is granted (ns "law", id family
// "journal:<boot>-<seq>"); without the grant the legacy host sidecar port stays
// the write path (the transition discipline). The kernel audit chain's persistence
// point is law.audit.drain@1 (ns "audit"). Zero host LOC — B5 stays flat.
import { definePlugin, startPlugin } from "@vivim/omega-shim";
import type { PluginContext, CallMeta } from "@vivim/omega-shim";
import { HOST_OPS, principalKind } from "@vivim/omega-contracts";
import type { LawDecision, PortResult, ConsentGrant, PrincipalKind } from "@vivim/omega-contracts";
import { LAW_POLICY_V1, evalPolicy, type PolicyDoc } from "./policy.ts";
import { ConsentTable } from "./consent.ts";
import { ForbiddenTable, FORBIDDEN_NS, FORBIDDEN_ID_PREFIX, forbiddenVaultId, toRecord, fromRecord } from "./forbidden.ts";
import { PRINCIPAL_NS, principalVaultId, newRecord, retireRecord, fromRecord as fromPrincipalRecord, type PrincipalRecord } from "./principal.ts"; // D-412 (S2) — fromRecord ALIASED: forbidden.ts owns the bare name (the silent-shadowing lesson: two same-named imports, bun binds the last)
import { mintCap, attenuate } from "./tokens.ts";
import { ShadowAmendment, AMENDMENT_SWAP_NOTE } from "./amendment.ts";
import { LawRegistry } from "./registry.ts";
// D-433 (Ω-2.5 / spec `D-434`): the policy lattice + the composition security
// scan. conflict.ts and compose-scan.ts are the pure cores (import-safe for
// unit tests — the forbidden.ts split); the port calls and retries live here.
import {
  PolicyRowStore, applicableRows, conflictRowId, fromVaultRecord, gateVerdict,
  pairKey, resolveLattice, scanConflicts, supersededIds, toVaultRecord,
  LAW_POLICY_PARADOX,
  type ConflictPairRow, type ParadoxPairRow, type PolicyRow,
} from "./conflict.ts";
import {
  ComposeScanLedger, activationGate, compositionRefOf, findingSentence,
  manifestHashOf, scanComposition,
  type ComposeScanRow,
} from "./compose-scan.ts";
// D-451 (Ω-11, aperture privacy): the sensitivity lattice, the write-verified
// taint law, the strengthen-only ratchets, the universal cross-principal
// fence, the deputy dataReach ceiling, and the export law — the pure core.
import {
  PRIVACY_CLASSES, PrivacyRefusalLedger, fenceCheck,
  taintFold, validateClassRow, withLedgerRef, writeGate, activeClassMap,
  APERTURE_CLASS_ROW_INVALID,
  type PrivacyClass, type PrivacyClassRow, type TaintSource,
} from "./apertureprivacy.ts";
// D-453 (Ω-13, standing): the radius registry — expiry REQUIRED, revocation
// immediate and loud, renewal a fresh citing grant, escalation one loud card.
import {
  StandingStore, checkStanding, grantIdOf, toVaultRecord as standingToVaultRecord,
  validateStanding, STANDING_UNKNOWN,
  type StandingRow,
} from "./standing.ts";
// D-452 (Ω-12, invocation): the frame — nothing runs without one; authority
// re-resolves at every check (the check takes the LIVE rows, holds no cache).
import {
  InvocationLedger, checkInvocation, validateFrame,
  type ConsentAuthority, type DelegationChain, type InvocationFrame, type InvokeRow,
} from "./invocation.ts";

// ---- shared law state (single compartment, single thread) ----
const consentTable = new ConsentTable();
const forbiddenTable = new ForbiddenTable();
const shadow = new ShadowAmendment(LAW_POLICY_V1);
const registry = new LawRegistry();
const rootConsentCap = mintCap("law.consent"); // attenuated per grant — the algebra in live use
let generation = 1;                            // law state generation (bumps on every state change)

// D-416 (S3): the fold's id families — per-boot stamp + per-process sequence,
// both zero-padded base36 so lexicographic order == chronological order within
// a boot, and two law processes never fold their events into one object
// lineage (a collision would merge two events' history under one id).
const JOURNAL_NS = "law";                       // the ns exists: forbidden overlay (D-325) lives here
const JOURNAL_ID_PREFIX = "journal:";
const AUDIT_NS = "audit";                       // D-416: the audit-chain persistence ns
const AUDIT_ID_PREFIX = "audit-chain:";
const CONFLICT_NS = "law.conflict";             // D-433: the policy-lattice ns (retention forever)
const POLICY_ID_PREFIX = "policy:";             // D-433: policy rows, one object per row id (append-only history)
const COMPOSE_SCAN_NS = "compose.scan";         // D-433: scan rows (retention compose-scan-2y)
const journalBoot = Date.now().toString(36).padStart(9, "0");
let journalSeq = 0;
let drainSeq = 0;
let conflictSeq = 0;                            // D-433: the conflict-row id family sequence
/** getmany page for the registry's vault absorb — safely under the vault's
 *  GET_MANY_BOUND (512, D-387); never imported cross-plugin (import-surface law). */
const REGISTRY_PAGE = 200;

// ---- forbidden durability (D-325): vault-backed overlay -------------------
// Persistence is composition-granted, never assumed: the law entry must grant
// BOTH port:vault.append@1 and port:vault.query@1 (agent.json first; audited
// across the rest by the W1 composition-conformance net). Without both caps
// the overlay stays memory-only — the pre-D-325 behavior, byte for byte.
let forbiddenPersistence = false;
let forbiddenLoaded = false;
let forbiddenLoadedCount = 0;
let forbiddenLastError: string | null = null;

// D-433 (Ω-2.5): the policy-row store — same posture as the forbidden overlay
// (memory-only without vault caps; vault-persisted + boot-reloaded with them).
// History may carry paradoxes; they arrive loudly and block, never drop silently.
const policyRows = new PolicyRowStore();
const composeScans = new ComposeScanLedger();
let conflictPersistence = false;
let conflictLoaded = false;
let conflictSkipped = 0; // malformed vault rows skipped loudly (counted, never absorbed)

// D-451/452/453 (Ω-11/12/13, the boundary chain): the privacy / invocation /
// standing state — same posture as the row store (memory-first; evidence rows
// ride the granted vault ports wherever present). The privacy ops are PURE
// VERDICT folds (READ risk, the law.forbidden.set@1 precedent): classes and
// cites arrive as payload data, the refusal ledger is evidence-only. The
// standing registry is the LIVE authority store invoke.check@1 re-resolves
// against on EVERY call — never cached, by construction.
const PRIVACY_NS = "privacy";                     // D-451: class rows + refusal rows (classes forever; refusals privacy-refusals-400d)
const STANDING_NS = "standing";                   // D-453: radius rows (forever — the trust history)
const INVOKE_NS = "invoke";                       // D-452: inv rows, ids inv:<causationId> (invoke-2y)
const privacyRefusals = new PrivacyRefusalLedger();
const standings = new StandingStore();
const invokeLedger = new InvocationLedger();
const invokeLedgeredIds = new Set<string>();      // ledger DEDUP only — never authority caching

/** D-451: parse the payload's class declarations through the class-row door
 *  (APERTURE_CLASS_ROW_INVALID on malformed) → the active class map. */
function classMapFromPayload(p: Record<string, unknown>): Map<string, PrivacyClass> {
  const classes = p["classes"];
  if (classes === undefined || classes === null) return new Map();
  if (!Array.isArray(classes)) {
    throw new Error("privacy: payload classes must be an array of class rows {ns, class, at?} — the declarations the verdict folds over (the capability-graph input; without it everything fails closed)");
  }
  const rows: PrivacyClassRow[] = [];
  for (const c of classes) rows.push(validateClassRow(c));
  return activeClassMap(rows);
}

/** D-451: parse a payload class field ("open"|"internal"|"principal"|"secret"). */
function privacyClassOf(v: unknown, field: string): PrivacyClass | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v !== "string" || !PRIVACY_CLASSES.includes(v as PrivacyClass)) {
    throw new Error(`${APERTURE_CLASS_ROW_INVALID}: ${field} must be one of ${PRIVACY_CLASSES.join("|")} (got ${JSON.stringify(v)})`);
  }
  return v as PrivacyClass;
}

/** D-451: parse the payload's cited inputs ({ns, id, rev?, class?}[]). */
function citesFromPayload(p: Record<string, unknown>): TaintSource[] | undefined {
  const cites = p["cites"];
  if (cites === undefined || cites === null) return undefined;
  if (!Array.isArray(cites)) {
    throw new Error("privacy: payload cites must be an array of {ns, id, rev?, class?} — the input rows the derived row folds (the taint law's subject)");
  }
  return cites as TaintSource[];
}

/** D-451: ledger a fence refusal row to vault ns "privacy" (best-effort, the
 *  journal discipline: the verdict stands; a ledger failure loses the row
 *  loudly). */
async function ledgerPrivacyRefusal(ctx: PluginContext | null, id: string, row: Record<string, unknown>): Promise<void> {
  if (!ctx || !ctx.capabilities.includes("port:vault.append@1")) return;
  try {
    const r: PortResult = await ctx.port.call("vault.append@1", { ns: PRIVACY_NS, id, data: { ts: Date.now(), ...row } });
    if (!r.ok) ctx.log(`privacy: refusal row ${id} lost loudly (${r.error}: ${r.detail ?? ""}) — the verdict stands`);
  } catch (e) {
    ctx.log(`privacy: refusal row ${id} lost loudly (${String(e)}) — the verdict stands`);
  }
}

/** D-452: ledger an inv row to vault ns "invoke" (best-effort, same discipline). */
async function ledgerInvokeRow(ctx: PluginContext | null, row: InvokeRow): Promise<void> {
  if (!ctx || !ctx.capabilities.includes("port:vault.append@1")) return;
  try {
    const r: PortResult = await ctx.port.call("vault.append@1", { ns: INVOKE_NS, id: row.id, data: { ts: Date.now(), ...row } });
    if (!r.ok) ctx.log(`invoke: row ${row.id} lost loudly (${r.error}: ${r.detail ?? ""}) — the verdict stands`);
  } catch (e) {
    ctx.log(`invoke: row ${row.id} lost loudly (${String(e)}) — the verdict stands`);
  }
}

/** D-453: persist a standing row to vault ns "standing" — fail-closed (the
 *  D-325 pattern: the caller rolls the in-memory append back on failure). */
async function persistStandingRow(ctx: PluginContext | null, id: string, data: unknown): Promise<void> {
  if (!ctx || !ctx.capabilities.includes("port:vault.append@1")) return;
  const r: PortResult = await ctx.port.call("vault.append@1", { ns: STANDING_NS, id, data });
  if (!r.ok) throw new Error(`vault.append@1 ${r.error}: ${r.detail ?? "no detail"}`);
}

function hasVaultCaps(ctx: PluginContext | null): boolean {
  if (!ctx) return false;
  return ctx.capabilities.includes("port:vault.append@1") && ctx.capabilities.includes("port:vault.query@1");
}

interface VaultQueryRow { id: string; rev: number; cid: string }
interface VaultGetResult { rev: number; cid: string; data: unknown }

/** Single reload attempt: query ns "law" prefix "forbidden:", fetch each record, rebuild the table. */
async function reloadForbidden(ctx: PluginContext): Promise<number> {
  const q = await ctx.port.call("vault.query@1", { ns: FORBIDDEN_NS, filter: { idPrefix: FORBIDDEN_ID_PREFIX } });
  if (!q.ok) {
    throw new Error(
      `vivim.law: forbidden persistence requires vivim.vault queryable — missing dependency vivim.vault ` +
      `(vault.query@1 ${q.error}: ${q.detail ?? "no detail"})`,
    );
  }
  const rows = (q.value ?? []) as VaultQueryRow[];
  let count = 0;
  for (const row of rows) {
    if (typeof row?.id !== "string" || !row.id.startsWith(FORBIDDEN_ID_PREFIX)) continue;
    const g = await ctx.port.call("vault.get@1", { ns: FORBIDDEN_NS, id: row.id });
    if (!g.ok) continue; // cold gap or compacted past keep — skip honestly, never fabricate
    const entry = fromRecord((g.value as VaultGetResult).data);
    if (!entry) continue; // malformed record — skipped, never throws the reload
    forbiddenTable.set(entry.principal, entry.ops);
    if (entry.ops.length > 0) count++;
  }
  forbiddenLoaded = true;
  forbiddenLoadedCount = count;
  forbiddenLastError = null;
  return count;
}

/** Boot-time reload with bounded retries: the vault boots phase 1, after law
 *  phase 0, so the first query can race a still-booting vault (DEGRADED /
 *  absent → retry). A composition with NO vault entry fails permanently
 *  (REFUSED no-routed-implementation → missing dependency, no retry loop). */
async function reloadForbiddenAtBoot(ctx: PluginContext): Promise<void> {
  const MAX_ATTEMPTS = 40;
  const WAIT_MS = 125;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const count = await reloadForbidden(ctx);
      if (count === 0) ctx.log(`0 forbidden entries`);
      else ctx.log(`forbidden overlay: ${count} entries reloaded from vault ns "law"`);
      return;
    } catch (e) {
      const msg = String(e);
      forbiddenLastError = msg;
      // Permanent: this composition boots no vault — stop retrying, stay loud.
      if (msg.includes("no routed implementation")) {
        ctx.log(
          `vivim.law: forbidden persistence requires vivim.vault queryable — missing dependency vivim.vault ` +
          `in this composition (law grants vault caps but boots no vivim.vault). Overlay stays UNLOADED; ` +
          `law.forbidden.set@1 aborts fail-closed until the vault is present.`,
        );
        return;
      }
      if (attempt === MAX_ATTEMPTS) {
        ctx.log(
          `vivim.law: forbidden overlay reload failed after ${MAX_ATTEMPTS} attempts — missing dependency vivim.vault ` +
          `queryable (${msg}). Overlay stays UNLOADED; law.forbidden.set@1 aborts fail-closed. ` +
          `Recover with law.forbidden.reload@1 once the vault is queryable.`,
        );
        return;
      }
      await new Promise((r) => setTimeout(r, WAIT_MS));
    }
  }
}

function asObj(v: unknown): Record<string, unknown> {
  return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : {};
}

// ---- D-433 (Ω-2.5): the policy-row reload + the conflict/scan ledgers ------

/** Reload the policy row store from vault ns "law.conflict" (ids policy:<id>).
 *  History may carry paradoxes — they are absorbed LOUDLY (logged, counted)
 *  and block their scopes; they are never silently dropped, and a malformed
 *  row is skipped loudly, never fabricated into resolution. */
async function reloadPolicyRows(ctx: PluginContext): Promise<number> {
  const q = await ctx.port.call("vault.query@1", { ns: CONFLICT_NS, filter: { idPrefix: POLICY_ID_PREFIX } });
  if (!q.ok) {
    throw new Error(
      `vivim.law: policy-row persistence requires vivim.vault queryable — missing dependency vivim.vault ` +
      `(vault.query@1 ${q.error}: ${q.detail ?? "no detail"})`,
    );
  }
  const rows = (q.value ?? []) as VaultQueryRow[];
  let loaded = 0;
  for (const row of rows) {
    if (typeof row?.id !== "string" || !row.id.startsWith(POLICY_ID_PREFIX)) continue;
    const g = await ctx.port.call("vault.get@1", { ns: CONFLICT_NS, id: row.id });
    if (!g.ok) {
      conflictSkipped++;
      ctx.log(`law.conflict: policy row ${row.id} cold gap — skipped loudly, never fabricated`);
      continue;
    }
    let parsed: PolicyRow;
    try {
      parsed = fromVaultRecord((g.value as VaultGetResult).data);
    } catch (e) {
      conflictSkipped++;
      ctx.log(`law.conflict: malformed policy row ${row.id} skipped LOUDLY (never absorbed into resolution): ${String(e)}`);
      continue;
    }
    if (policyRows.get(parsed.id) === null) {
      policyRows.append(parsed);
      loaded++;
    }
  }
  conflictLoaded = true;
  if (loaded > 0) ctx.log(`policy lattice: ${loaded} row(s) reloaded from vault ns "law.conflict"`);
  const standing = scanConflicts(policyRows.activeRows());
  if (standing.paradox.length > 0) {
    ctx.log(
      `law.conflict: ${standing.paradox.length} STANDING PARADOX(ES) absorbed from history — the affected scopes block until amended: ` +
      standing.paradox.map((p) => `${p.policyA} vs ${p.policyB}`).join("; "),
    );
  }
  return loaded;
}

/** Boot-time reload with bounded retries (the forbidden-overlay discipline,
 *  fewer attempts: it runs after that reload already established the vault). */
async function reloadPolicyRowsAtBoot(ctx: PluginContext): Promise<void> {
  const MAX_ATTEMPTS = 8;
  const WAIT_MS = 125;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await reloadPolicyRows(ctx);
      return;
    } catch (e) {
      const msg = String(e);
      if (msg.includes("no routed implementation")) {
        ctx.log(
          `vivim.law: policy-row persistence requires vivim.vault queryable — missing dependency vivim.vault ` +
          `in this composition. Row store stays UNLOADED; law.conflict.scan@1 and policy.amend@1 abort ` +
          `fail-closed until the vault is present (a coherence sweep over a partial store is a lie).`,
        );
        return;
      }
      if (attempt === MAX_ATTEMPTS) {
        ctx.log(
          `vivim.law: policy-row reload failed after ${MAX_ATTEMPTS} attempts (${msg}). Row store stays ` +
          `UNLOADED; law.conflict.scan@1 and policy.amend@1 abort fail-closed. Reboot once the vault is queryable.`,
        );
        return;
      }
      await new Promise((r) => setTimeout(r, WAIT_MS));
    }
  }
}

/** Ledger a conflict row to vault ns "law.conflict" (best-effort, the journal
 *  discipline: the scan verdict stands; a ledger failure loses the row loudly). */
async function ledgerConflictRow(ctx: PluginContext | null, row: ConflictPairRow | ParadoxPairRow): Promise<void> {
  if (!ctx || !ctx.capabilities.includes("port:vault.append@1")) return;
  const id = conflictRowId(row);
  try {
    const r: PortResult = await ctx.port.call("vault.append@1", { ns: CONFLICT_NS, id, data: { ts: Date.now(), ...row } });
    if (!r.ok) ctx.log(`law.conflict: row ${id} lost loudly (${r.error}: ${r.detail ?? ""}) — the scan verdict stands`);
  } catch (e) {
    ctx.log(`law.conflict: row ${id} lost loudly (${String(e)}) — the scan verdict stands`);
  }
}

/** Persist a scan row to vault ns "compose.scan" (best-effort, same discipline). */
async function persistScanRow(ctx: PluginContext | null, row: ComposeScanRow): Promise<void> {
  if (!ctx || !ctx.capabilities.includes("port:vault.append@1")) return;
  try {
    const r: PortResult = await ctx.port.call("vault.append@1", { ns: COMPOSE_SCAN_NS, id: `scan:${row.manifestHash.slice(0, 12)}`, data: { ts: Date.now(), ...row } });
    if (!r.ok) ctx.log(`compose.scan: row for ${row.compositionRef} lost loudly (${r.error}) — the verdict stands`);
  } catch (e) {
    ctx.log(`compose.scan: row for ${row.compositionRef} lost loudly (${String(e)}) — the verdict stands`);
  }
}

/** The fail-closed posture for the coherence sweep + amendment: with vault
 *  caps granted but the store unloaded, a sweep over partial truth is the
 *  silent-lie class D-433 exists to kill — refuse it by name. */
function requireLoadedStore(op: string): void {
  if (conflictPersistence && !conflictLoaded) {
    throw new Error(`${op}: policy row store UNLOADED (vault caps granted but the boot reload never succeeded) — refused fail-closed (D-433: coherence over a partial store is a lie)`);
  }
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}
function optStr(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
function bump(): number {
  return ++generation;
}

/** D-412 (S2): read a principal identity row — null when absent or malformed
 *  (skipped honestly, never fabricated — the forbidden-reload discipline). */
async function readPrincipalRecord(ctx: PluginContext, principal: string): Promise<PrincipalRecord | null> {
  try {
    const g = await ctx.port.call("vault.get@1", { ns: PRINCIPAL_NS, id: principalVaultId(principal) });
    if (!g.ok) return null;
    return fromPrincipalRecord((g.value as VaultGetResult).data);
  } catch {
    return null;
  }
}

/** D-412 (S2): ensure a principal identity row exists (register when absent).
 *  Throws on write failure — callers decide rollback (fail-closed, D-325 pattern). */
async function ensurePrincipalRecord(ctx: PluginContext, principal: string): Promise<PrincipalRecord> {
  const existing = await readPrincipalRecord(ctx, principal);
  if (existing !== null) return existing;
  const rec = newRecord(principal);
  const r = await ctx.port.call("vault.append@1", { ns: PRINCIPAL_NS, id: principalVaultId(principal), data: rec });
  if (!r.ok) throw new Error(`vault.append@1 ${r.error}: ${r.detail ?? "no detail"}`);
  return rec;
}

/** Best-effort journal append (D-416/S3: THE FOLD). With port:vault.append@1
 *  granted, the narrative row rides vault ns "law" (id family
 *  journal:<boot>-<seq>) under the changelog chain + CAS — one row per event,
 *  the governed event as a fold like any other; the D-411 intent citations and
 *  D-412 principal events ride the same chain (they are journal rows). Without
 *  the vault grant (spine/chat/test rigs) the legacy host sidecar port stays
 *  the write path — the transition discipline, behavior unchanged. Best-effort
 *  EITHER way: a law decision is never blocked by a journal failure; the
 *  failure is logged, the row is lost loudly, never silently. */
async function journal(ctx: PluginContext | null, entry: Record<string, unknown>): Promise<void> {
  if (!ctx) return;
  if (ctx.capabilities.includes("port:vault.append@1")) {
    // D-416 (S3): the recursion guard — the journal never narrates ITS OWN
    // writes. Every fold append is a gated MUTATION whose law.check row would
    // itself fold, recursing without bound (the pre-fold host-op path was
    // gate-free BY CONSTRUCTION — capability-gated, never law-gated; the fold
    // must preserve that property on the routed path). The gate row for
    // vivim.law's OWN vault append is skipped — the changelog row for the
    // append IS that record (hash-chained + CAS + boot-verified — richer
    // evidence than the narrative row would be). Other principals' appends
    // keep their gate rows: their fold appends are law's writes, so the guard
    // still cuts the recursion at depth one for every caller.
    if (entry["op"] === "law.check" && entry["targetOp"] === "vault.append@1" && entry["principal"] === ctx.manifest.id) {
      return;
    }
    const id = `${JOURNAL_ID_PREFIX}${journalBoot}-${(++journalSeq).toString(36).padStart(9, "0")}`;
    try {
      const r: PortResult = await ctx.port.call("vault.append@1", { ns: JOURNAL_NS, id, data: { ts: Date.now(), ...entry } });
      if (!r.ok) ctx.log(`law: journal fold ${r.error} (${r.detail ?? ""}) — decision stands, row lost loudly`);
    } catch (e) {
      ctx.log(`law: journal fold failed: ${String(e)} — decision stands, row lost loudly`);
    }
    return;
  }
  try {
    const r: PortResult = await ctx.port.call(HOST_OPS.journalAppend, entry);
    if (!r.ok) ctx.log(`law: journal append ${r.error} (${r.detail ?? ""}) — decision stands, journaling skipped`);
  } catch (e) {
    ctx.log(`law: journal append failed: ${String(e)} — decision stands, journaling skipped`);
  }
}

// ---- the gate resolver: policy doc → decision, consent applied ----
interface Resolved {
  decision: LawDecision["decision"];
  reason: string;
  journal: boolean;
  consentId?: string;
}

function resolve(doc: PolicyDoc, principal: string, op: string): Resolved {
  const ev = evalPolicy(doc, principal, op);
  if (ev.action.decision === "require-consent") {
    const grant = consentTable.hasMatchingGrant(principal, op);
    if (grant) {
      return { decision: "allow", reason: `${ev.action.reason} — consent ${grant.consentId} active (gen ${grant.generation})`, journal: ev.action.journal };
    }
    return { decision: "require-consent", reason: ev.action.reason, journal: ev.action.journal, consentId: consentTable.requireConsent(principal, op) };
  }
  return { decision: ev.action.decision, reason: ev.action.reason, journal: ev.action.journal };
}

// ---- the ops ----
export const def = definePlugin({
  onInit: async (ctx) => {
    const init = registry.init(ctx.config["journalPath"], ctx.manifest.id);
    ctx.log(`vivim.law up (Ω1) — policy ${LAW_POLICY_V1.policyId}@${LAW_POLICY_V1.version}, journal replay: ${init.replayed} events`);
    // D-325: reload the forbidden overlay once the vault is queryable. Law is
    // bootPhase 0, vault is bootPhase 1 — never assume the vault is up at
    // law-init time. Without vault caps this stays memory-only (pre-D-325).
    forbiddenPersistence = hasVaultCaps(ctx);
    if (!forbiddenPersistence) {
      forbiddenLoaded = true; // nothing to load — memory-only by composition, not by failure
      conflictPersistence = false;
      conflictLoaded = true; // D-433: same posture — memory-only by composition
      return;
    }
    forbiddenLoaded = false;
    conflictPersistence = true; // D-433 rides the same caps gate (append + query)
    conflictLoaded = false;
    await reloadForbiddenAtBoot(ctx);
    // D-433 (Ω-2.5): reload the policy rows after the overlay — the vault is
    // queryable by then; history may carry paradoxes, absorbed loudly above.
    await reloadPolicyRowsAtBoot(ctx);
  },

  ops: {
    /** THE gate. Payload: {principal, op, payload, causationId} — plus, since
     *  D-411 (S1, the canonical-intent seam), OPTIONAL {intentRef, payloadHash}:
     *  callers that resolved a canonical intent before invoking cite it here,
     *  and every journaled law decision carries the citation (evidence binding,
     *  not new policy — evalPolicy stays typed on who/which-op; callers without
     *  a citation journal exactly as before). Returns LawDecision. */
    "law.check@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const principal = str(p["principal"]);
      const op = str(p["op"]);
      const causationId = optStr(p["causationId"]) ?? meta.causationId;
      // D-411 (S1): the canonical-intent citation — optional, additive, journaled.
      const intentRef = optStr(p["intentRef"]);
      const payloadHash = optStr(p["payloadHash"]);

      let primary = resolve(LAW_POLICY_V1, principal, op);
      // Forbidden-action overlay (D-310): a per-principal deny that precedes
      // policy evaluation — forbidden holds regardless of what the token
      // would otherwise permit. Memory-only; recipe amendment is durable.
      if (forbiddenTable.isForbidden(principal, op)) {
        primary = {
          decision: "deny",
          reason: `forbidden action for principal "${principal}" (behavior-contract policy overlay)`,
          journal: true,
        };
      }
      // D-433 (Ω-2.5): the policy-lattice seam. The row layer NARROWS only —
      // a scope blocked by a standing paradox denies with LAW_CONFLICT_
      // UNRESOLVED naming the pair; a lattice deny denies; allow/constrain
      // leave the baseline decision unchanged. An EMPTY row store leaves the
      // gate byte-identical to the pre-D-433 walk (every existing composition).
      if (!forbiddenTable.isForbidden(principal, op) && policyRows.size() > 0) {
        const lattice = gateVerdict(policyRows.activeRows(), { principal, op });
        if (lattice.paradox !== undefined || (lattice.engaged && lattice.effect === "deny")) {
          primary = {
            decision: "deny",
            reason: lattice.paradox !== undefined
              ? lattice.reason
              : `policy lattice deny — ${lattice.reason} (D-433: the row layer narrows, never broadens)`,
            journal: true,
          };
        }
      }
      const decision: LawDecision = {
        decision: primary.decision,
        reason: primary.reason,
        principal,
        ...(primary.consentId !== undefined ? { consentId: primary.consentId } : {}),
      };

      // shadow evaluation (amendment, Ω1): same resolver, both policies, divergences recorded
      let divergence: ReturnType<ShadowAmendment["observe"]> = null;
      const shadowDoc = shadow.doc();
      if (shadowDoc) {
        const shadowRes = resolve(shadowDoc, principal, op);
        divergence = shadow.observe(principal, op, primary, shadowRes, causationId);
      }

      registry.countEvent();
      registry.observe(principal, "active", "law.check"); // callers are composition ids (root/µhost-gate filtered)
      if (primary.journal) {
        await journal(ctx, {
          source: "vivim.law",
          op: "law.check",
          principal,
          targetOp: op,
          decision: primary.decision,
          reason: primary.reason,
          ...(primary.consentId !== undefined ? { consentId: primary.consentId } : {}),
          causationId,
          // D-411 (S1): the canonical-intent citation — present iff the caller
          // resolved a canonical intent before invoking (falsifier F-3).
          ...(intentRef !== undefined ? { intentRef } : {}),
          ...(payloadHash !== undefined ? { payloadHash } : {}),
          ...(shadowDoc ? { shadow: { decision: divergence ? divergence.shadow.decision : primary.decision, diverged: divergence !== null } } : {}),
        });
      }
      return decision;
    },

    /** Lifecycle registry: ids seen, journal events, active consents, law generation.
     *  D-416 (S3): the fold's read side — law's narrative rows live in vault ns
     *  "law" wherever the fold is active; they are absorbed LIVE here (query the
     *  journal id family, fetch ONLY the new bodies, paged under the getmany
     *  bound — the D-387 discipline). Best-effort: a vault read failure degrades
     *  the registry to the file+observed view, never throws. */
    "law.registry@1": async (_payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      registry.observe(meta.from, "active", "op");
      registry.countEvent();
      if (ctx && ctx.capabilities.includes("port:vault.query@1") && ctx.capabilities.includes("port:vault.getmany@1")) {
        try {
          const q: PortResult = await ctx.port.call("vault.query@1", { ns: JOURNAL_NS, filter: { idPrefix: JOURNAL_ID_PREFIX } });
          if (q.ok) {
            const rows = (Array.isArray(q.value) ? q.value : []).filter((r): r is { id: string } => typeof (r as { id?: unknown })?.id === "string");
            const fresh = rows.map((r) => r.id).filter((id) => !registry.vaultRowSeen(id));
            for (let i = 0; i < fresh.length; i += REGISTRY_PAGE) {
              const page = fresh.slice(i, i + REGISTRY_PAGE);
              const g: PortResult = await ctx.port.call("vault.getmany@1", { ns: JOURNAL_NS, ids: page });
              if (!g.ok) break; // best-effort: absorb what arrived; the rest waits for the next call
              for (const row of (Array.isArray(g.value) ? g.value : []) as Array<{ id?: unknown; found?: unknown; data?: unknown }>) {
                if (row.id !== undefined && row.found === true && typeof row.data === "object" && row.data !== null) {
                  registry.absorbVaultRow(String(row.id), row.data as Record<string, unknown>);
                }
              }
            }
          }
        } catch { /* best-effort by design — the snapshot stays servable */ }
      }
      return registry.snapshot(consentTable.activeCount(), generation, {
        persistence: forbiddenPersistence,
        loaded: forbiddenLoaded,
        count: forbiddenLoaded ? forbiddenTable.list().filter((e) => e.ops.length > 0).length : forbiddenLoadedCount,
        ...(forbiddenLastError !== null ? { lastError: forbiddenLastError } : {}),
      });
    },

    /** D-416 (S3) — the audit-chain persistence point (common to both fork
     *  options, landed with (a)): drain the kernel's signed audit chain (the
     *  HOST_OPS.auditChain export — verified, signerKeyId, publicKey, length,
     *  headHash, entries) into vault ns "audit" as ONE whole append per drain.
     *  The chain itself is untouched (the drain is read-only on the kernel —
     *  the lens reports, it never authors); fail-closed on the vault append,
     *  the caller sees the error. Id family audit-chain:<boot>-<seq> — one
     *  snapshot object per drain, never superseding: every drain is a full
     *  export, the row IS the persistence. The kernel attaches at EVERY boot
     *  (D-340); availability is a cap question, never a wiring one. */
    "law.audit.drain@1": async (_payload: unknown, ctx: PluginContext | null, _meta: CallMeta) => {
      registry.countEvent();
      if (!ctx || !ctx.capabilities.includes("host.kernel.lens") || !ctx.capabilities.includes("port:vault.append@1")) {
        throw new Error("law.audit.drain: requires host.kernel.lens + port:vault.append@1 (the persistence point IS the seam — memory-only is not a posture here, unlike the forbidden overlay)");
      }
      const chain: PortResult = await ctx.port.call(HOST_OPS.auditChain, {});
      if (!chain.ok) throw new Error(`law.audit.drain: audit chain export ${chain.error}: ${chain.detail ?? "no detail"}`);
      const value = chain.value as { verified: boolean; signerKeyId: string; publicKey: string; length: number; headHash: string; entries: unknown[] };
      const id = `${AUDIT_ID_PREFIX}${journalBoot}-${(++drainSeq).toString(36).padStart(9, "0")}`;
      const r: PortResult = await ctx.port.call("vault.append@1", { ns: AUDIT_NS, id, data: value });
      if (!r.ok) throw new Error(`law.audit.drain: vault append ${r.error}: ${r.detail ?? "no detail"} — drain refused fail-closed`);
      return { drained: value.length, headHash: value.headHash, verified: value.verified, ns: AUDIT_NS, id };
    },

    /** Grant a consent (default) or explicitly deny-revoke it ({action:"revoke"}).
     *  D-384 principal binding: a non-root caller may only manage consents for
     *  ITSELF. Root — the surfaces' human proxy (console/CLI) — may grant for
     *  any principal; that delegation is the consent ceremony. Anything else is
     *  cross-principal forgery and refuses before any state change. */
    "law.consent.grant@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const consentId = str(p["consentId"]);
      const action = p["action"] === "revoke" || p["action"] === "deny-revoke" ? "revoke" : "grant";
      const principal = optStr(p["principal"]);
      const scope = optStr(p["scope"]);
      if (principal !== undefined && meta.from !== "root" && principal !== meta.from) {
        throw new Error(`law.consent.grant: caller '${meta.from}' may not manage consents for principal '${principal}' (cross-principal refusal, D-384)`);
      }

      if (action === "revoke") {
        const revoked = consentTable.revoke(consentId);
        const gen = bump();
        registry.countEvent();
        await journal(ctx, { source: "vivim.law", op: "law.consent.grant", action: "revoke", consentId, revoked, principal: meta.from, causationId: meta.causationId });
        return { action, consentId, revoked, generation: gen, active: consentTable.activeCount() };
      }

      const rec = consentTable.grant(consentId, { ...(principal !== undefined ? { principal } : {}), ...(scope !== undefined ? { scope } : {}) });
      // D-412 (S2): the consent ceremony is the identity-bearing write — when
      // it names a principal AND law holds vault caps, the grant resolves
      // through the principal record (ensured to exist). Fail-closed on the
      // record write: the in-memory grant rolls back, the ceremony aborts —
      // never half-done (the D-325 forbidden-durability pattern). Without
      // vault caps the grant behaves exactly as before (memory-only posture).
      let principalRecord: PrincipalRecord | null = null;
      if (principal !== undefined && forbiddenPersistence) {
        if (!ctx) throw new Error("law.consent.grant: no plugin context — principal record impossible, grant aborted fail-closed");
        try {
          principalRecord = await ensurePrincipalRecord(ctx, principal);
        } catch (e) {
          consentTable.revoke(consentId);
          throw new Error(`law.consent.grant: principal record write failed — grant aborted fail-closed (missing dependency vivim.vault?): ${String(e)}`);
        }
      }
      const gen = bump();
      const cap = attenuate(rootConsentCap, `law.consent:id=${consentId}`); // narrowing, by construction
      registry.countEvent();
      await journal(ctx, {
        source: "vivim.law", op: "law.consent.grant", action: "grant", consentId,
        ...(principal !== undefined ? { principal } : {}), ...(scope !== undefined ? { scope } : {}),
        grantGeneration: rec.generation, caller: meta.from, causationId: meta.causationId,
      });
      return {
        action,
        grant: { consentId: rec.consentId, ...(rec.principal !== undefined ? { principal: rec.principal } : {}), ...(rec.scope !== undefined ? { scope: rec.scope } : {}), grantedAt: rec.grantedAt } satisfies ConsentGrant,
        generation: gen,
        cap,
        // D-412 (S2): the principal-record posture of this grant — resolved
        // (record exists), memory-only (no vault caps), or unnamed.
        ...(principalRecord !== null ? { principalRecord: { principal: principalRecord.principal, state: principalRecord.state, generation: principalRecord.generation } } : principal !== undefined ? { principalRecord: null } : {}),
      };
    },

    /** Delegate token revocation to the host generation bump (capability: host.tokens.revoke). */
    "law.tokens.revoke@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const pluginId = str(p["pluginId"]);
      if (!pluginId) throw new Error("law.tokens.revoke: payload requires {pluginId}");
      registry.observe(pluginId, "active", "tokens.revoke");
      // journal the intent BEFORE delegating. D-384: a scoped revoke no longer
      // touches this compartment's own tokens (per-record revocation, not a
      // global generation bump) — the intent-first order is kept anyway so the
      // intent is durable even for the revoke-all path, which does invalidate
      // our own journal token (post-revoke appends then fail closed, best-effort).
      await journal(ctx, { source: "vivim.law", op: "law.tokens.revoke", principal: meta.from, pluginId, causationId: meta.causationId });
      const r: PortResult = await ctx!.port.call(HOST_OPS.tokensRevoke, { pluginId });
      bump();
      registry.countEvent();
      if (!r.ok) return { revoked: false, pluginId, hostResult: r };
      const v = asObj(r.value);
      return { revoked: true, pluginId, hostGeneration: v["generation"], affectedTokens: v["affectedTokens"] };
    },

    /** Shadow amendment: register/clear a shadow policy, or fetch the divergence report. */
    "law.amendment@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const action = str(p["action"] ?? "report") || "report";
      if (action === "register-shadow") {
        const spec = asObj(p["policy"]);
        if (Object.keys(spec).length === 0) throw new Error("law.amendment: register-shadow requires a policy spec");
        const status = shadow.registerShadow(spec);
        bump();
        registry.countEvent();
        await journal(ctx, { source: "vivim.law", op: "law.amendment", action, shadowPolicyId: status.policyId, principal: meta.from, causationId: meta.causationId });
        return { action, shadow: status, report: shadow.report() };
      }
      if (action === "clear-shadow") {
        const status = shadow.clearShadow();
        bump();
        registry.countEvent();
        await journal(ctx, { source: "vivim.law", op: "law.amendment", action, principal: meta.from, causationId: meta.causationId });
        return { action, shadow: status, report: shadow.report() };
      }
      // report (default): divergence ledger since shadow registration
      registry.countEvent();
      return { action: "report", report: shadow.report(), swap: AMENDMENT_SWAP_NOTE };
    },

    /** Forbidden-action overlay: replace a principal's forbidden op list (empty array clears).
     *  Payload {principal, ops: string[]}. READ-risk like every law contract — the
     *  enforcement lives in law.check@1, which denies matches before policy eval.
     *  D-325: with vault caps granted, the write is journaled to vault ns "law"
     *  AFTER the in-memory set — an append failure rolls the set back and aborts
     *  fail-closed (the spawn that triggered it aborts too, per agent.spawn). */
    "law.forbidden.set@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      // set() validates shape at runtime (fail-closed → DEGRADED); casts only satisfy the signature.
      const rawPrincipal = p["principal"] as string;
      const prior = forbiddenTable.list().find((e) => e.principal === rawPrincipal)?.ops;
      const entry = forbiddenTable.set(p["principal"] as string, p["ops"] as string[]);
      bump();
      registry.countEvent();
      if (forbiddenPersistence) {
        if (!ctx) {
          // No port outside a worker — roll back, never leave a write half-done.
          if (prior === undefined) forbiddenTable.clear(entry.principal);
          else forbiddenTable.set(entry.principal, prior);
          throw new Error("law.forbidden.set: no plugin context — vault append impossible, set aborted fail-closed");
        }
        try {
          const r = await ctx.port.call("vault.append@1", {
            ns: FORBIDDEN_NS,
            id: forbiddenVaultId(entry.principal),
            data: toRecord(entry),
          });
          if (!r.ok) throw new Error(`vault.append@1 ${r.error}: ${r.detail ?? "no detail"}`);
        } catch (e) {
          // Roll the in-memory set back — a half-persisted overlay is worse than none.
          if (prior === undefined) forbiddenTable.clear(entry.principal);
          else forbiddenTable.set(entry.principal, prior);
          throw new Error(
            `law.forbidden.set: vault append failed — set aborted fail-closed ` +
            `(missing dependency vivim.vault queryable?): ${String(e)}`,
          );
        }
      }
      await journal(ctx, {
        source: "vivim.law", op: "law.forbidden.set", action: "set",
        principal: entry.principal, ops: entry.ops,
        caller: meta.from, causationId: meta.causationId,
      });
      return { principal: entry.principal, ops: entry.ops, count: entry.ops.length, generation, persisted: forbiddenPersistence };
    },

    /** Forbidden-overlay reload (D-325): re-read vault ns "law" prefix
     *  "forbidden:" into the in-memory table. READ-risk. The boot path calls
     *  the same mapping automatically; this op is the deterministic handle for
     *  tests and for operator recovery after a vault outage. Throws DEGRADED
     *  naming vivim.vault when the vault is absent or unqueryable — never an
     *  empty-table silent success. */
    "law.forbidden.reload@1": async (_payload: unknown, ctx: PluginContext | null, _meta: CallMeta) => {
      registry.countEvent();
      if (!forbiddenPersistence) {
        return { loaded: true, persistence: false, count: forbiddenTable.list().filter((e) => e.ops.length > 0).length };
      }
      if (!ctx) throw new Error("law.forbidden.reload: no plugin context — missing dependency vivim.vault queryable");
      const count = await reloadForbidden(ctx);
      return { loaded: true, persistence: true, count };
    },

    /** D-412 (S2) — register a principal identity row. Idempotent while
     *  active (returns the existing record); REFUSES PRINCIPAL_REUSED when
     *  the id was retired — the string can never become a different record
     *  (the non-reuse invariant, enforced). */
    "law.principal.register@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const principal = str(p["principal"]);
      if (!principal) throw new Error("law.principal.register: payload requires {principal}");
      registry.countEvent();
      if (!ctx || !ctx.capabilities.includes("port:vault.append@1") || !ctx.capabilities.includes("port:vault.get@1")) {
        throw new Error("law.principal.register: requires port:vault.append@1 + port:vault.get@1 (identity rows ARE the seam — memory-only is not a posture here, unlike the forbidden overlay)");
      }
      const existing = await readPrincipalRecord(ctx, principal);
      if (existing !== null && existing.state === "retired") {
        throw new Error(`law.principal.register: PRINCIPAL_REUSED — '${principal}' was retired and can never be re-registered (non-reuse invariant, D-412)`);
      }
      if (existing !== null) {
        return { principal: existing.principal, kind: existing.kind, state: existing.state, generation: existing.generation, registeredAt: existing.registeredAt, alreadyRegistered: true };
      }
      const rec = newRecord(principal);
      const r = await ctx.port.call("vault.append@1", { ns: PRINCIPAL_NS, id: principalVaultId(principal), data: rec });
      if (!r.ok) throw new Error(`law.principal.register: vault append ${r.error}: ${r.detail ?? "no detail"} — refused fail-closed`);
      registry.observe(principal, "active", "principal.register");
      await journal(ctx, { source: "vivim.law", op: "law.principal.register", principal, kind: rec.kind, caller: meta.from, causationId: meta.causationId });
      return { principal: rec.principal, kind: rec.kind, state: rec.state, generation: rec.generation, registeredAt: rec.registeredAt, alreadyRegistered: false };
    },

    /** D-412 (S2) — retire a principal identity row. Retired is FOREVER:
     *  the row stays (retention: forever), the id is dead. Refuses
     *  PRINCIPAL_UNKNOWN (absent) and PRINCIPAL_RETIRED (already retired). */
    "law.principal.retire@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const principal = str(p["principal"]);
      if (!principal) throw new Error("law.principal.retire: payload requires {principal}");
      registry.countEvent();
      if (!ctx || !ctx.capabilities.includes("port:vault.append@1") || !ctx.capabilities.includes("port:vault.get@1")) {
        throw new Error("law.principal.retire: requires port:vault.append@1 + port:vault.get@1");
      }
      const existing = await readPrincipalRecord(ctx, principal);
      if (existing === null) {
        throw new Error(`law.principal.retire: PRINCIPAL_UNKNOWN — '${principal}' has no identity row`);
      }
      if (existing.state === "retired") {
        throw new Error(`law.principal.retire: PRINCIPAL_RETIRED — '${principal}' is already retired (retired is forever, D-412)`);
      }
      const rec = retireRecord(existing);
      const r = await ctx.port.call("vault.append@1", { ns: PRINCIPAL_NS, id: principalVaultId(principal), data: rec });
      if (!r.ok) throw new Error(`law.principal.retire: vault append ${r.error}: ${r.detail ?? "no detail"} — refused fail-closed`);
      registry.observe(principal, "retired", "principal.retire");
      await journal(ctx, { source: "vivim.law", op: "law.principal.retire", principal, caller: meta.from, causationId: meta.causationId });
      return { principal: rec.principal, state: rec.state, retiredAt: rec.retiredAt, generation: rec.generation };
    },

    /** D-412 (S2) — READ a principal identity row: the record or
     *  {found: false}. Never throws on absence — absence is data. */
    "law.principal.get@1": async (payload: unknown, ctx: PluginContext | null, _meta: CallMeta) => {
      const p = asObj(payload);
      const principal = str(p["principal"]);
      if (!principal) throw new Error("law.principal.get: payload requires {principal}");
      registry.countEvent();
      if (!ctx || !ctx.capabilities.includes("port:vault.get@1")) {
        throw new Error("law.principal.get: requires port:vault.get@1");
      }
      const rec = await readPrincipalRecord(ctx, principal);
      if (rec === null) return { found: false, principal };
      return { found: true, ...rec };
    },

    /** D-353 — the principal describe read (agent.describe@1's law-side mirror).
     *  One call answers: who is this principal (kind), what may they NEVER do
     *  (the forbidden overlay, with its persistence posture), which consents
     *  are theirs (principal-narrowed active grants only), and the law
     *  generation they were described at. READ — mutates nothing; the
     *  combination rule (identity.state × contract.state, D-315) is realized
     *  by the same per-principal walk every other law op uses: forbidden,
     *  policy, and consent tables are all keyed per-principal already, so
     *  `user:<id>` needs zero new tables — only this acceptance of the prefix. */
    "law.describe@1": (payload: unknown, _ctx: PluginContext | null, _meta: CallMeta) => {
      const p = asObj(payload);
      const principal = str(p["principal"]);
      if (!principal) throw new Error("law.describe: payload requires {principal}");
      registry.countEvent();
      const entry = forbiddenTable.list().find((e) => e.principal === principal);
      const forbidden: { ops: string[]; persisted: boolean } = {
        ops: entry?.ops ?? [],
        persisted: forbiddenPersistence,
      };
      const consents = consentTable.listFor(principal).map((r) => ({
        consentId: r.consentId,
        grantedAt: r.grantedAt,
        generation: r.generation,
        active: r.active,
        ...(r.scope !== undefined ? { scope: r.scope } : {}),
      }));
      const out: { principal: string; kind: PrincipalKind; forbidden: { ops: string[]; persisted: boolean }; consents: ReturnType<typeof consents>; generation: number } = {
        principal,
        kind: principalKind(principal),
        forbidden,
        consents,
        generation,
      };
      return out;
    },

    /** D-433 (Ω-2.5) — the coherence sweep: every interacting pair of the
     *  active policy row set, evaluated symbolically. Resolvable pairs
     *  ledger conflict.resolved@1 rows; paradoxical pairs ledger
     *  conflict.paradox@1 rows that BLOCK the affected scope until amended
     *  (law.check denies there with LAW_CONFLICT_UNRESOLVED). Any paradox
     *  makes the scan itself a refusal (LAW_POLICY_PARADOX). READ-risk like
     *  every law contract — the enforcement teeth live in law.check@1. */
    "law.conflict.scan@1": async (_payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      registry.countEvent();
      requireLoadedStore("law.conflict.scan");
      const scannedAt = Date.now();
      const result = scanConflicts(policyRows.activeRows(), scannedAt);
      for (const r of result.resolved) await ledgerConflictRow(ctx, r);
      for (const px of result.paradox) await ledgerConflictRow(ctx, px);
      registry.observe(meta.from, "active", "law.conflict.scan");
      await journal(ctx, {
        source: "vivim.law", op: "law.conflict.scan", principal: meta.from,
        rows: policyRows.size(), pairs: result.pairs,
        resolved: result.resolved.length, paradoxes: result.paradox.length,
        inputHash: result.inputHash, causationId: meta.causationId,
      });
      return {
        rows: policyRows.size(),
        pairs: result.pairs,
        resolved: result.resolved,
        paradox: result.paradox,
        refused: result.refused,
        ...(result.refusedWith !== undefined ? { refusedWith: result.refusedWith } : {}),
        inputHash: result.inputHash,
        persistence: conflictPersistence,
        ...(conflictSkipped > 0 ? { skippedMalformedRows: conflictSkipped } : {}),
      };
    },

    /** D-433 (Ω-2.5) — why did this operation resolve this way? The
     *  deterministic replay of the lattice walk: applicable rows, class
     *  precedence, effect composition, constraint intersection — as sentences.
     *  Pure re-execution over the current row set; historical replay feeds a
     *  past row set from the append-only vault rows. READ. */
    "law.conflict.explain@1": async (payload: unknown, _ctx: PluginContext | null, _meta: CallMeta) => {
      const p = asObj(payload);
      const principal = str(p["principal"]);
      const op = str(p["op"]);
      if (!principal || !op) throw new Error("law.conflict.explain: payload requires {principal, op}");
      registry.countEvent();
      const rows = policyRows.activeRows();
      const applicable = applicableRows(rows, { principal, op });
      const outcome = resolveLattice(rows, { principal, op });
      const dead = supersededIds(rows);
      const superseded = rows.filter((r) => dead.has(r.id));
      const steps: string[] = [
        `explain law.conflict for principal ${principal} op ${op} over ${rows.length} row(s)`,
      ];
      if (superseded.length > 0) {
        steps.push(`superseded (derived by replay, never edited): ${superseded.map((r) => `${r.id} ← ${r.supersededBy ?? "?"}`).join(", ")}`);
      }
      steps.push(`applicable (principal exact-or-*, scope match, not superseded): ${applicable.length === 0 ? "none" : applicable.map((r) => r.id).join(", ")}`);
      steps.push(...outcome.walk);
      return { principal, op, rows: rows.length, applicable: applicable.map((r) => r.id), steps, outcome };
    },

    /** D-433 (Ω-2.5) — the composition security scan: five checks (secret-
     *  pattern · grant-coverage · selector-as-truth · mutation-declaration ·
     *  budget-binding) over the manifest bytes, backed by VERSIONED,
     *  INSPECTABLE pattern sets. action:"scan" ledgers the verdict row (ns
     *  compose.scan, manifestHash-pinned); action:"activate" refuses unless a
     *  PASSING row matches the CURRENT manifest hash — unscanned code does
     *  not activate, full stop. READ-risk: the gate is the activation
     *  ceremony, not a mutation. */
    "compose.scan@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const action = str(p["action"] ?? "scan") || "scan";
      const composition = p["composition"];
      if (composition === undefined || composition === null) {
        throw new Error("compose.scan: payload requires {composition} — the composition manifest object");
      }
      registry.countEvent();
      if (action === "scan") {
        const grants = p["grants"];
        if (!Array.isArray(grants) || !grants.every((g) => typeof g === "string")) {
          throw new Error("compose.scan: action scan requires {grants: string[]} — the principal's live capability grants (the capability-graph input; without it coverage is unprovable, and unprovable is refused)");
        }
        const verdict = scanComposition(composition, grants);
        const row = composeScans.record(compositionRefOf(composition), verdict, Date.now());
        await persistScanRow(ctx, row);
        registry.observe(meta.from, "active", "compose.scan");
        await journal(ctx, {
          source: "vivim.law", op: "compose.scan", action: "scan",
          compositionRef: row.compositionRef, manifestHash: row.manifestHash,
          findings: row.findings.length, verdict: row.verdict,
          caller: meta.from, causationId: meta.causationId,
        });
        return { action, row, sentences: row.findings.map((f) => findingSentence(f)) };
      }
      if (action === "activate") {
        const compositionRef = compositionRefOf(composition);
        // the durable read: rows persisted in ns compose.scan join the
        // in-memory ledger for the gate (best-effort — a vault read failure
        // degrades to the in-memory view, loudly, never to a silent pass)
        if (ctx && ctx.capabilities.includes("port:vault.query@1") && composeScans.get(compositionRef, manifestHashOf(composition)) === null) {
          try {
            const q: PortResult = await ctx.port.call("vault.query@1", { ns: COMPOSE_SCAN_NS, filter: { idPrefix: "scan:" } });
            if (q.ok) {
              for (const vr of (Array.isArray(q.value) ? q.value : []) as VaultQueryRow[]) {
                if (typeof vr?.id !== "string") continue;
                const g: PortResult = await ctx.port.call("vault.get@1", { ns: COMPOSE_SCAN_NS, id: vr.id });
                if (!g.ok) continue;
                const data = (g.value as VaultGetResult).data as Record<string, unknown>;
                if (data === null || typeof data !== "object") continue;
                composeScans.record(str(data["compositionRef"]), {
                  manifestHash: str(data["manifestHash"]),
                  findings: Array.isArray(data["findings"]) ? (data["findings"] as unknown[]) : [],
                  blocking: 0,
                  verdict: data["verdict"] === "refused" ? "refused" : "pass",
                }, Number(data["scannedAt"] ?? 0));
              }
            }
          } catch (e) {
            ctx.log(`compose.scan: vault scan-row read failed (${String(e)}) — activation judges the in-memory ledger only, loudly`);
          }
        }
        const gate = activationGate(composition, composeScans.rowsList(), compositionRef);
        if (!gate.ok) {
          await journal(ctx, {
            source: "vivim.law", op: "compose.scan", action: "activate",
            compositionRef, manifestHash: gate.manifestHash, activated: false,
            refusedWith: gate.code, causationId: meta.causationId,
          });
          const extra = "scannedHashes" in gate ? ` (scanned: ${gate.scannedHashes.length === 0 ? "none" : gate.scannedHashes.join(", ")})` : "";
          throw new Error(`${gate.code}: ${gate.sentence}${extra}`);
        }
        await journal(ctx, {
          source: "vivim.law", op: "compose.scan", action: "activate",
          compositionRef, manifestHash: gate.row.manifestHash, activated: true,
          scannedAt: gate.row.scannedAt, causationId: meta.causationId,
        });
        return { action, activated: true, row: gate.row };
      }
      throw new Error(`compose.scan: unknown action "${action}" (want scan|activate)`);
    },

    /** D-433 (Ω-2.5) — the append-only supersession: appends the amendment
     *  row, marks the target superseded (derived by replay), then RE-RUNS the
     *  conflict scan. An amendment that would CREATE a new paradox is refused
     *  LAW_POLICY_PARADOX and rolled back — the live set never gains a paradox
     *  by its own hand; resolving one is always this op. Fail-closed on the
     *  vault append (the D-325 pattern: the in-memory append rolls back). */
    "policy.amend@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const row = p["row"];
      if (row === undefined || row === null || typeof row !== "object" || Array.isArray(row)) {
        throw new Error("policy.amend: payload requires {row} — the amendment policy row");
      }
      registry.countEvent();
      requireLoadedStore("policy.amend");
      const before = scanConflicts(policyRows.activeRows());
      const baseline = new Set(before.paradox.map(pairKey));
      const appended = policyRows.append(row as PolicyRow); // validates — LAW_POLICY_ROW_INVALID at the door
      const after = scanConflicts(policyRows.activeRows());
      const created = after.paradox.filter((px) => !baseline.has(pairKey(px)));
      if (created.length > 0) {
        policyRows.rollback(appended.id);
        const px = created[0]!;
        await journal(ctx, {
          source: "vivim.law", op: "policy.amend", rowId: appended.id, refused: true,
          refusedWith: LAW_POLICY_PARADOX, principal: meta.from, causationId: meta.causationId,
        });
        throw new Error(`${LAW_POLICY_PARADOX}: ${px.sentence} — the amendment is refused and rolled back; amend one of the standing rules instead`);
      }
      if (conflictPersistence) {
        if (!ctx) {
          policyRows.rollback(appended.id);
          throw new Error("policy.amend: no plugin context — vault append impossible, amendment aborted fail-closed");
        }
        try {
          const r: PortResult = await ctx.port.call("vault.append@1", {
            ns: CONFLICT_NS,
            id: `${POLICY_ID_PREFIX}${appended.id}`,
            data: toVaultRecord(appended),
          });
          if (!r.ok) throw new Error(`vault.append@1 ${r.error}: ${r.detail ?? "no detail"}`);
        } catch (e) {
          policyRows.rollback(appended.id);
          throw new Error(`policy.amend: vault append failed — amendment aborted fail-closed (missing dependency vivim.vault?): ${String(e)}`);
        }
      }
      const gen = bump();
      registry.countEvent();
      registry.observe(meta.from, "active", "policy.amend");
      await journal(ctx, {
        source: "vivim.law", op: "policy.amend", rowId: appended.id,
        ...(appended.supersedes !== undefined ? { supersedes: appended.supersedes } : {}),
        principal: meta.from, scanPairs: after.pairs, paradoxes: after.paradox.length,
        causationId: meta.causationId,
      });
      return {
        amended: appended.id,
        supersedes: appended.supersedes ?? null,
        rows: policyRows.size(),
        scan: { pairs: after.pairs, resolved: after.resolved.length, paradoxes: after.paradox.length },
        generation: gen,
        persisted: conflictPersistence,
      };
    },

    /** D-451 (Ω-11) — the taint fold: a derived row carries max(class of every
     *  input row it cites). READ (a pure verdict fold — the law.forbidden.set
     *  precedent: enforcement lives at the write/read paths). Payload:
     *  {cites: [{ns, id, rev?, class?}], classes?: [{ns, class}]} — the class
     *  declarations are the caller's input (the capability-graph shape);
     *  without them every citation fails closed to secret. */
    "privacy.taint@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const cites = citesFromPayload(p);
      if (cites === undefined) {
        throw new Error("privacy.taint: payload requires {cites: [{ns, id, rev?, class?}]} — the input rows the derived row folds (the taint law's subject)");
      }
      const map = classMapFromPayload(p);
      registry.countEvent();
      const fold = taintFold(cites, map);
      registry.observe(meta.from, "active", "privacy.taint");
      await journal(ctx, {
        source: "vivim.law", op: "privacy.taint", principal: meta.from,
        cites: cites.length, taint: fold.taint, unverified: fold.unverified.length,
        causationId: meta.causationId,
      });
      return {
        taint: fold.taint,
        sources: fold.sources,
        unverified: fold.unverified,
        failedClosed: fold.unverified.length > 0,
        classes: [...map.entries()].map(([ns, cls]) => ({ ns, class: cls })),
        causationId: meta.causationId,
      };
    },

    /** D-451 (Ω-11) — the privacy gate verdict. READ (the verdict is data;
     *  the write/read paths enforce it). action:"write" (default) runs the
     *  write gate — the ratchets (APERTURE_CLASS_WEAKENED vs the namespace,
     *  APERTURE_RATCHET_WEAKENED vs the row's existing taint) and the
     *  write-verified taint law (APERTURE_TAINT_MISMATCH /
     *  _TAINT_UNVERIFIED). action:"read" runs the universal fence — the exact
     *  D-379 shape (REFUSED verdict envelope + ns privacy refusal row,
     *  ledgered): APERTURE_CLASS_UNKNOWN (undeclared, fail closed),
     *  APERTURE_CROSS_PRINCIPAL, APERTURE_REACH_UNDECLARED (deputy dataReach
     *  absent = none), APERTURE_DEPUTY_OVERREACH (ceiling exceeded). */
    "privacy.check@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const action = str(p["action"] ?? "write") || "write";
      const map = classMapFromPayload(p);
      registry.countEvent();
      if (action === "write") {
        const w = asObj(p["write"]);
        const ns = str(w["ns"]);
        const id = str(w["id"]);
        const owner = str(w["owner"]);
        if (!ns || !id || !owner) {
          throw new Error("privacy.check: action write requires {write: {ns, id, owner, class?, cites?}} — the row being written");
        }
        const cls = privacyClassOf(w["class"], "write.class");
        const cites = citesFromPayload(w);
        const existing = privacyClassOf(p["existingTaint"], "existingTaint");
        const verdict = writeGate({ ns, id, owner, ...(cls !== undefined ? { class: cls } : {}), ...(cites !== undefined ? { cites } : {}) }, map, existing, Date.now());
        await journal(ctx, {
          source: "vivim.law", op: "privacy.check", action: "write",
          target: `${ns}/${id}`, owner, verdict: verdict.verdict,
          ...(verdict.code !== undefined ? { refusedWith: verdict.code } : {}),
          class: verdict.effectiveClass, taint: verdict.taint,
          caller: meta.from, causationId: meta.causationId,
        });
        return { action, ...verdict, ledgered: false };
      }
      if (action === "read") {
        const r = asObj(p["read"]);
        const ns = str(r["ns"]);
        const id = str(r["id"]);
        const owner = str(r["owner"]);
        const reader = str(r["reader"]);
        if (!ns || !id || !owner || !reader) {
          throw new Error("privacy.check: action read requires {read: {ns, id, owner, reader, class?, op?}} — the row being read and who is reading it");
        }
        const cls = privacyClassOf(r["class"], "read.class");
        const op = str(r["op"]) || "vault.get@1";
        const d = asObj(p["deputy"]);
        const grantor = str(d["grantor"]);
        const deputy = grantor === "" ? undefined : {
          grantor,
          ...(privacyClassOf(d["dataReach"], "deputy.dataReach") !== undefined ? { dataReach: privacyClassOf(d["dataReach"], "deputy.dataReach")! } : {}),
          ...(privacyClassOf(d["grantorView"], "deputy.grantorView") !== undefined ? { grantorView: privacyClassOf(d["grantorView"], "deputy.grantorView")! } : {}),
        };
        const raw = fenceCheck({ ns, id, owner, reader, ...(cls !== undefined ? { class: cls } : {}), op }, map, deputy, Date.now());
        let verdict = raw;
        if (raw.verdict === "REFUSED" && raw.refusalRow !== undefined) {
          // the D-379 discipline: the refusal is a VERDICT + a ledger row —
          // in-memory evidence always, the vault row wherever the port exists
          verdict = withLedgerRef(raw, privacyRefusals);
          const row = verdict.refusalRow!;
          await ledgerPrivacyRefusal(ctx, row.id, row as unknown as Record<string, unknown>);
        }
        await journal(ctx, {
          source: "vivim.law", op: "privacy.check", action: "read",
          target: `${ns}/${id}`, owner, reader, verdict: verdict.verdict,
          ...(verdict.code !== undefined ? { refusedWith: verdict.code } : {}),
          class: verdict.class, caller: meta.from, causationId: meta.causationId,
        });
        return {
          action,
          verdict: verdict.verdict,
          ...(verdict.code !== undefined ? { code: verdict.code } : {}),
          ...(verdict.sentence !== undefined ? { sentence: verdict.sentence } : {}),
          class: verdict.class,
          declared: verdict.declared,
          ...(verdict.refusalRow !== undefined ? { refusalRow: verdict.refusalRow } : {}),
          ...(verdict.envelope !== undefined ? { envelope: verdict.envelope } : {}),
          walk: verdict.walk,
          ledgered: verdict.verdict === "REFUSED",
        };
      }
      throw new Error(`privacy.check: unknown action "${action}" (want write|read)`);
    },

    /** D-452 (Ω-12) — the frame verdict: nothing runs without a frame, and
     *  authority re-resolves from the LIVE rows at every check (a cached
     *  consent is a stale consent — structurally: this op consults the live
     *  standing registry + the payload's live authority rows on EVERY call).
     *  READ (the verdict is data; the gate consumes it). Payload:
     *  {frame?, target: {op, opClass}, consents?, delegations?, standings?,
     *  rootPrincipals?, now?}. Unframed EXTERNAL_MUTATION refuses
     *  INVOKE_FRAME_MISSING; READ-class ops frame best-effort; the framed
     *  verdict carries the inv row (ns invoke, ids inv:<causationId>),
     *  ledgered wherever the vault port exists. */
    "invoke.check@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const t = asObj(p["target"]);
      const op = str(t["op"]);
      const opClass = str(t["opClass"] ?? "EXTERNAL_MUTATION") || "EXTERNAL_MUTATION";
      if (!op) throw new Error("invoke.check: payload requires {target: {op, opClass}} — the capability-graph-resolved op being invoked");
      if (opClass !== "EXTERNAL_MUTATION" && opClass !== "READ") {
        throw new Error(`invoke.check: target.opClass must be EXTERNAL_MUTATION|READ (got ${JSON.stringify(opClass)})`);
      }
      const knownOps = Array.isArray(p["knownOps"]) ? (p["knownOps"] as unknown[]).map((o) => str(o)).filter(Boolean) : [];
      if (knownOps.length === 0 && !Array.isArray(p["knownOps"])) {
        throw new Error("invoke.check: payload requires {knownOps: string[]} — the capability graph (one cannot frame what the system cannot name)");
      }
      const consents = (Array.isArray(p["consents"]) ? (p["consents"] as unknown[]).map((c) => asObj(c)) : []) as ConsentAuthority[];
      const delegations = (Array.isArray(p["delegations"]) ? (p["delegations"] as unknown[]).map((d) => asObj(d)) : []) as DelegationChain[];
      // the standing registry — the FULL list, re-read fresh on every single
      // call (never cached): checkStanding refuses revoked/lapsed rows with
      // their specific sentences, which the frame verdict folds as evidence
      const now = typeof p["now"] === "number" && Number.isFinite(p["now"]) ? p["now"] : Date.now();
      const payloadStandings: StandingRow[] = [];
      for (const s of Array.isArray(p["standings"]) ? (p["standings"] as unknown[]) : []) payloadStandings.push(validateStanding(s));
      const authorityStandings = [...standings.list(), ...payloadStandings];
      const rootPrincipals = Array.isArray(p["rootPrincipals"]) ? (p["rootPrincipals"] as unknown[]).map((r) => str(r)).filter(Boolean) : ["root"];
      const causationId = optStr(p["causationId"]) ?? meta.causationId;
      registry.countEvent();
      let frame: InvocationFrame | null | undefined = undefined;
      if (p["frame"] !== undefined && p["frame"] !== null) {
        frame = validateFrame(p["frame"]); // throws INVOKE_FRAME_INCOMPLETE at the door — loud
      } else {
        frame = null;
      }
      const verdict = checkInvocation(frame, { op, opClass: opClass as "EXTERNAL_MUTATION" | "READ" }, {
        opClass: opClass as "EXTERNAL_MUTATION" | "READ",
        knownOps, consents, delegations,
        standings: authorityStandings, rootPrincipals, now,
      }, causationId);
      if (verdict.invRow !== null && !invokeLedgeredIds.has(verdict.invRow.id)) {
        invokeLedgeredIds.add(verdict.invRow.id); // ledger dedup ONLY — the verdict itself is computed fresh every call
        invokeLedger.record(verdict.invRow);
        await ledgerInvokeRow(ctx, verdict.invRow);
      }
      registry.observe(meta.from, "active", "invoke.check");
      await journal(ctx, {
        source: "vivim.law", op: "invoke.check", principal: meta.from,
        targetOp: op, opClass, verdict: verdict.verdict,
        ...(verdict.code !== undefined ? { refusedWith: verdict.code } : {}),
        ...(verdict.frameDigest !== null ? { frameDigest: verdict.frameDigest } : {}),
        ...(verdict.authorityResolved !== null ? { authorityResolved: verdict.authorityResolved } : {}),
        causationId,
      });
      return { ...verdict, causationId };
    },

    /** D-453 (Ω-13) — create/renew a radius. MUTATION (the trust registry's
     *  own write path). Grantor-gated (the D-384 binding: a non-root caller
     *  grants only for itself; root's grant IS the delegation ceremony).
     *  expiresAt is REQUIRED — STANDING_PERPETUAL_REFUSED at the door; a bad
     *  scope grammar refuses STANDING_SCOPE_INVALID; re-granting an existing
     *  id refuses STANDING_RENEWAL_AS_EXTENSION (renewal is a fresh grant
     *  citing the old via renewedFrom — the chain visible). Vault persistence
     *  fail-closed with in-memory rollback (the D-325 pattern). */
    "standing.grant@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const principal = str(p["principal"]);
      const grantee = str(p["grantee"]);
      const scope = str(p["scope"]);
      if (!principal || !grantee || !scope) {
        throw new Error("standing.grant: payload requires {principal, grantee, scope, expiresAt} — the radius's shape (§14's seven fields)");
      }
      if (meta.from !== "root" && principal !== meta.from) {
        throw new Error(`standing.grant: caller '${meta.from}' may not grant standing for principal '${principal}' (grantor-gated, the D-384 binding — root's grant is the delegation ceremony)`);
      }
      const now = typeof p["now"] === "number" && Number.isFinite(p["now"]) ? p["now"] : Date.now();
      const context = optStr(p["context"]);
      const renewedFrom = optStr(p["renewedFrom"]);
      const standingId = optStr(p["standingId"]) ?? grantIdOf(
        { principal, grantee, scope, ...(context !== undefined ? { context } : {}) },
        renewedFrom, // a renewal's id differs from the original — the chain stays visible via renewedFrom
      );
      const evidence = Array.isArray(p["evidence"]) ? (p["evidence"] as unknown[]).map((e) => str(e)).filter(Boolean) : [];
      // the row shape — expiresAt ONLY when the payload carried one: absent,
      // the store door refuses STANDING_PERPETUAL_REFUSED (no grant lives
      // forever because nobody said when)
      const row: Record<string, unknown> = {
        standingId, principal, grantee, scope,
        approvalMode: (str(p["approvalMode"] ?? "ask") || "ask"),
        grantedAt: now,
        evidence,
        ...(context !== undefined ? { context } : {}),
        ...(optStr(p["consentRef"]) !== undefined ? { consentRef: optStr(p["consentRef"])! } : {}),
        ...(renewedFrom !== undefined ? { renewedFrom } : {}),
      };
      const expiresAt = p["expiresAt"];
      if (typeof expiresAt === "number" && Number.isFinite(expiresAt)) row["expiresAt"] = expiresAt;
      registry.countEvent();
      const appended = standings.grant(row as StandingRow); // the door: PERPETUAL / SCOPE_INVALID / RENEWAL_AS_EXTENSION / ROW_INVALID
      if (ctx && ctx.capabilities.includes("port:vault.append@1")) {
        try {
          await persistStandingRow(ctx, appended.standingId, standingToVaultRecord(appended));
        } catch (e) {
          standings.rollback(appended.standingId);
          throw new Error(`standing.grant: vault append failed — grant aborted fail-closed (missing dependency vivim.vault?): ${String(e)}`);
        }
      }
      const gen = bump();
      registry.observe(meta.from, "active", "standing.grant");
      await journal(ctx, {
        source: "vivim.law", op: "standing.grant", standingId: appended.standingId,
        principal: appended.principal, grantee: appended.grantee, scope: appended.scope,
        expiresAt: appended.expiresAt, ...(appended.renewedFrom !== undefined ? { renewedFrom: appended.renewedFrom } : {}),
        caller: meta.from, causationId: meta.causationId,
      });
      return { standing: appended, generation: gen, persisted: ctx !== null && ctx.capabilities.includes("port:vault.append@1") };
    },

    /** D-453 (Ω-13) — revoke a radius. MUTATION. Grantor or root. Immediate
     *  and loud: revokedAt lands now, in-flight frames refuse at their next
     *  gate check (nothing is cached anywhere); a SECOND revoke refuses
     *  STANDING_REVOKED (never a silent idempotent success); an unknown id
     *  refuses STANDING_UNKNOWN. The revocation row persists to vault ns
     *  standing as revoked:<standingId> (append-only history — lapsed and
     *  revoked rows are evidence, never deleted). */
    "standing.revoke@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const standingId = str(p["standingId"]);
      if (!standingId) throw new Error("standing.revoke: payload requires {standingId} — the radius to revoke");
      const existing = standings.get(standingId);
      if (existing === null) {
        throw new Error(`${STANDING_UNKNOWN}: no standing "${standingId}" — the radius list is the registry, nothing else`);
      }
      if (meta.from !== "root" && existing.principal !== meta.from) {
        throw new Error(`standing.revoke: caller '${meta.from}' may not revoke principal '${existing.principal}'s standing (grantor or root only)`);
      }
      const now = typeof p["now"] === "number" && Number.isFinite(p["now"]) ? p["now"] : Date.now();
      const reason = optStr(p["reason"]) ?? "revoked by the grantor";
      registry.countEvent();
      const row = standings.revoke(standingId, { reason, now }); // immediate — the next check refuses
      if (ctx && ctx.capabilities.includes("port:vault.append@1")) {
        await persistStandingRow(ctx, `revoked:${standingId}`, { standingId, revokedAt: row.revokedAt, revokeReason: reason, by: meta.from, ts: now });
      }
      const gen = bump();
      registry.observe(meta.from, "active", "standing.revoke");
      await journal(ctx, {
        source: "vivim.law", op: "standing.revoke", standingId,
        principal: row.principal, revokedAt: row.revokedAt, reason,
        caller: meta.from, causationId: meta.causationId,
      });
      return { standing: row, generation: gen };
    },

    /** D-453 (Ω-13) — the gate-time verdict Ω-12's frames resolve at every
     *  check. READ. Payload: {standingId, op?, context?, proofPassed?, now?}
     *  → STANDING_REVOKED (immediate, naming revokedAt + reason) ·
     *  STANDING_EXPIRED (naming expiresAt + the renewal path) ·
     *  STANDING_SCOPE_EXCEEDED · STANDING_CONTEXT_UNMATCHED · verdict "ask"
     *  (auto-with-proof with a failing proof — the zoned yes without the
     *  silent yes; the escalation sentence rides the return). */
    "standing.check@1": async (payload: unknown, ctx: PluginContext | null, meta: CallMeta) => {
      const p = asObj(payload);
      const standingId = str(p["standingId"]);
      if (!standingId) throw new Error("standing.check: payload requires {standingId} — the radius being cited");
      const row = standings.get(standingId);
      if (row === null) {
        throw new Error(`${STANDING_UNKNOWN}: no standing "${standingId}" — the radius list is the registry, nothing else`);
      }
      const now = typeof p["now"] === "number" && Number.isFinite(p["now"]) ? p["now"] : Date.now();
      const op = optStr(p["op"]);
      const context = optStr(p["context"]);
      const proofPassed = typeof p["proofPassed"] === "boolean" ? p["proofPassed"] : undefined;
      registry.countEvent();
      const verdict = checkStanding(row, { ...(op !== undefined ? { op } : {}), ...(context !== undefined ? { context } : {}), ...(proofPassed !== undefined ? { proofPassed } : {}), now });
      await journal(ctx, {
        source: "vivim.law", op: "standing.check", standingId,
        principal: meta.from, verdict: verdict.verdict,
        ...(verdict.code !== undefined ? { refusedWith: verdict.code } : {}),
        causationId: meta.causationId,
      });
      return { ...verdict, ...(verdict.verdict === "ask" ? { escalationSentence: `May ${row.principal} let ${row.grantee} do ${row.scope} — the proof condition failed; the radius falls to ask. Answer before it stalls; an ignored question is never a yes.` } : {}) };
    },
  },
});

startPlugin(def); // no-op outside a worker (tests / FakeHost): the def stays pure
