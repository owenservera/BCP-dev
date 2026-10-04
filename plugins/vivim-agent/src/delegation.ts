// vivim.agent/src/delegation.ts (D-454, Ω-15 — the delegation boundary,
// re-materialized spec paper D-447)
//
// Authority narrows every hop, or it is not delegation — it is escape.
// Chains resolve from vault rows, never from carried claims: the fold walks
// leaf → root over ns "control" chain rows, verifies child ⊑ parent at EVERY
// edge (attenuation as a mechanical subset check in the tokens.ts grammar),
// recomputes expiry from the clock (no cached authority — gate-time pull),
// and emits an authorityChain digest for Ω-12 frames to cite. Revocation
// cascades subtree-wide in one append-only sweep. Sovereign crossings carry
// a mutually-signed, expiring, mirrored treaty row (the shape is declared
// here; transport is owed to the sharing wave — the ns canvas precedent).
//
// Pure core: the ops layer (index.ts) supplies rows + `now`; no timers, no
// I/O. Expected-but-negative results return {ok:false, code, sentence};
// malformed INPUT SHAPES throw (→ DEGRADED at the op boundary, the house
// fail-closed discipline, same split as agent.ts).
import { createHash } from "node:crypto";
import { canonicalScope, isSubset } from "./tokens.ts";

export const DELEGATION_NS = "control";
export const DELEGATE_ATTENUATION_VIOLATED = "DELEGATE_ATTENUATION_VIOLATED";
export const DELEGATE_REVOKED_CASCADE = "DELEGATE_REVOKED_CASCADE";
export const DELEGATE_CHAIN_BROKEN = "DELEGATE_CHAIN_BROKEN";
export const DELEGATE_EXPIRED = "DELEGATE_EXPIRED";
export const DELEGATE_ENVELOPE_UNVERIFIED = "DELEGATE_ENVELOPE_UNVERIFIED";
export const DELEGATE_TREATY_UNSIGNED = "DELEGATE_TREATY_UNSIGNED";
export const DELEGATE_CHAIN_TOO_DEEP = "DELEGATE_CHAIN_TOO_DEEP";

/** The default depth budget — the DECLARED policy-row value the caller
 *  passes; amend the row, never this default. Never a vibes constant. */
export const DEFAULT_DEPTH_BUDGET = 4;

export type DelegationStatus = "live" | "revoked" | "lapsed";

export interface DelegationChainRow {
  delegationId: string;
  /** The parent delegationId; null for the root hop. */
  parent: string | null;
  /** Whom the authority flows to (the child agent). */
  grantee: string;
  /** tokens.ts grammar — ⊑ the parent's scope, checked at every edge. */
  attenuatedScope: string;
  /** REQUIRED at every hop — no perpetual grants. */
  expiresAt: number;
  status: DelegationStatus;
  /** Cascade annotations (revoked rows): when + through which hop. */
  revokedAt?: number;
  revokedThrough?: string;
  /** Renewal genealogy: the dead chain this fresh chain replaces. */
  renews?: string;
}

export type DelegationOutcome<T> = { ok: true; value: T } | { ok: false; code: string; sentence: string };

function refuse(code: string, sentence: string): { ok: false; code: string; sentence: string } {
  return { ok: false, code, sentence };
}

/** Canonical vault row id for a chain row (ns "control"): `chain:<delegationId>`. */
export function chainRowId(delegationId: string): string {
  if (typeof delegationId !== "string" || delegationId.length === 0) {
    throw new Error("chainRowId: delegationId must be a non-empty string");
  }
  if (/[\u0000|:]/.test(delegationId)) {
    throw new Error("chainRowId: delegationId must not contain '|' or NUL or ':' (id grammar)");
  }
  return `chain:${delegationId}`;
}

/** Parse a vault data row into a chain row; null when it is not one (data,
 *  not shape — the fold refuses DELEGATE_CHAIN_BROKEN on unparseable hops).
 *  Extra fields (revokedAt, revokedThrough, renews) survive the cast — the
 *  genealogy is the row's own, never re-typed (the asAgentIdentity rule). */
export function parseChainRow(v: unknown): DelegationChainRow | null {
  if (v === null || typeof v !== "object" || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  if (typeof o.delegationId !== "string" || o.delegationId.length === 0) return null;
  if (o.parent !== null && typeof o.parent !== "string") return null;
  if (typeof o.grantee !== "string" || o.grantee.length === 0) return null;
  if (typeof o.attenuatedScope !== "string" || o.attenuatedScope.length === 0) return null;
  if (typeof o.expiresAt !== "number" || !Number.isFinite(o.expiresAt)) return null; // REQUIRED at every hop
  if (o.status !== "live" && o.status !== "revoked" && o.status !== "lapsed") return null;
  return v as DelegationChainRow;
}

function indexRows(rows: readonly unknown[]): Map<string, DelegationChainRow> {
  const byId = new Map<string, DelegationChainRow>();
  for (const raw of rows) {
    const row = parseChainRow(raw);
    if (row === null) continue; // not a chain row — the referenced hops matter below, not the noise
    byId.set(row.delegationId, row); // the caller's snapshot is head rows; on duplicates the LATER row wins (append-only: later = newer)
  }
  return byId;
}

export interface ChainHop {
  delegationId: string;
  grantee: string;
  scope: string;
  expiresAt: number;
  status: DelegationStatus;
}

export interface ChainFoldOk {
  /** Root → leaf, the recomputed ancestry. */
  hops: ChainHop[];
  depth: number;
  /** The leaf's recomputed authority (the narrowest scope in the chain). */
  effectiveScope: string;
  /** sha256 over the canonical root→leaf hop chain — citable by Ω-12 frames. */
  authorityChain: string;
  /** The EARLIEST expiry in the chain — the subtree's authority ends with it. */
  expiresAt: number;
}

export interface FoldChainInput {
  /** Raw vault data rows (the caller's latest-wins snapshot). */
  rows: readonly unknown[];
  leafDelegationId: string;
  now: number;
  /** The policy row's depth budget (defaults to DEFAULT_DEPTH_BUDGET). */
  depthBudget?: number;
  /** The envelope's carried authority claim — a routing hint the fold verifies. */
  carriedAuthority?: string;
}

/** THE chain fold (D-454): authority recomputed from rows — carried claims
 *  are hints, the vault rows are the truth. Per-edge subset attenuation,
 *  clock-pinned expiry, subtree revocation discovery, digest emission. */
export function foldChain(input: FoldChainInput): DelegationOutcome<ChainFoldOk> {
  const budget = input.depthBudget ?? DEFAULT_DEPTH_BUDGET;
  if (!Number.isInteger(budget) || budget < 1) {
    throw new Error("foldChain: depthBudget must be a positive integer (a declared policy row, never vibes)");
  }
  if (typeof input.now !== "number" || !Number.isFinite(input.now)) {
    throw new Error("foldChain: now must be a finite number");
  }
  if (typeof input.leafDelegationId !== "string" || input.leafDelegationId.length === 0) {
    throw new Error("foldChain: leafDelegationId must be a non-empty string");
  }
  const byId = indexRows(input.rows);
  const leaf = byId.get(input.leafDelegationId);
  if (leaf === undefined) {
    return refuse(DELEGATE_CHAIN_BROKEN, `${DELEGATE_CHAIN_BROKEN}: the delegation "${input.leafDelegationId}" does not resolve in the vault — a chain is rows or it is nothing (D-454, Ω-15)`);
  }
  // walk leaf → root (cycle-checked: a chain that walks in circles grants nothing)
  const walked: DelegationChainRow[] = [];
  const seen = new Set<string>();
  let cur: DelegationChainRow | undefined = leaf;
  while (cur !== undefined) {
    if (seen.has(cur.delegationId)) {
      return refuse(DELEGATE_CHAIN_BROKEN, `${DELEGATE_CHAIN_BROKEN}: the chain from "${input.leafDelegationId}" is a cycle at "${cur.delegationId}" — a chain that walks in circles grants nothing (D-454, Ω-15)`);
    }
    seen.add(cur.delegationId);
    walked.push(cur);
    if (cur.parent === null) break; // the root hop
    const parentRow = byId.get(cur.parent);
    if (parentRow === undefined) {
      return refuse(DELEGATE_CHAIN_BROKEN, `${DELEGATE_CHAIN_BROKEN}: the parent delegation "${cur.parent}" of "${cur.delegationId}" does not resolve — the chain is broken, and a broken chain grants nothing (D-454, Ω-15)`);
    }
    cur = parentRow;
  }
  const chain = walked.reverse(); // root → leaf
  if (chain.length > budget) {
    return refuse(DELEGATE_CHAIN_TOO_DEEP, `${DELEGATE_CHAIN_TOO_DEEP}: the chain is ${chain.length} hops > the declared depth budget ${budget}; authority that never lands is a burden, not a spine (D-454, Ω-15)`);
  }
  // every hop's scope must parse in the tokens grammar (a row whose scope is
  // not a scope is not a chain row)
  for (const hop of chain) {
    try {
      canonicalScope(hop.attenuatedScope);
    } catch {
      return refuse(DELEGATE_CHAIN_BROKEN, `${DELEGATE_CHAIN_BROKEN}: the hop "${hop.delegationId}" names a scope that does not parse in the tokens grammar ("${hop.attenuatedScope}") — a chain is rows or it is nothing (D-454)`);
    }
  }
  // expiry — recomputed from the clock at every fold (no cached authority)
  for (const hop of chain) {
    if (hop.expiresAt <= input.now || hop.status === "lapsed") {
      return refuse(DELEGATE_EXPIRED, `${DELEGATE_EXPIRED}: the hop "${hop.delegationId}" lapsed at ${new Date(hop.expiresAt).toISOString()}; the subtree's authority ended with it — renewal is a fresh chain, not a stretch (D-454, Ω-15)`);
    }
  }
  // revocation — a revoked ancestor kills the whole descendant subtree, loudly
  for (const hop of chain) {
    if (hop.status === "revoked") {
      return refuse(DELEGATE_REVOKED_CASCADE, `${DELEGATE_REVOKED_CASCADE}: the ancestor delegation "${hop.delegationId}" is revoked — the whole descendant subtree went loud with it; cited row ${chainRowId(hop.delegationId)} (D-454, Ω-15)`);
    }
  }
  // attenuation — the mechanical per-edge subset check, at EVERY edge
  for (let i = 1; i < chain.length; i++) {
    const parent = chain[i - 1]!;
    const child = chain[i]!;
    let subset = false;
    try { subset = isSubset(child.attenuatedScope, parent.attenuatedScope); } catch { subset = false; }
    if (!subset) {
      return refuse(DELEGATE_ATTENUATION_VIOLATED, `${DELEGATE_ATTENUATION_VIOLATED}: the delegation "${child.delegationId}" names authority "${child.attenuatedScope}" ⊄ its parent's "${parent.attenuatedScope}"; authority narrows every hop, or it is not delegation — it is escape (D-454, Ω-15)`);
    }
  }
  // the carried claim — a routing hint the fold verifies; hints that lie are refused
  const effectiveScope = canonicalScope(leaf.attenuatedScope);
  if (input.carriedAuthority !== undefined) {
    const carried = canonicalScope(input.carriedAuthority); // malformed grammar throws → DEGRADED (shape)
    if (carried !== effectiveScope) {
      return refuse(DELEGATE_ENVELOPE_UNVERIFIED, `${DELEGATE_ENVELOPE_UNVERIFIED}: the envelope carries authority "${input.carriedAuthority}" but the vault fold recomputes "${effectiveScope}"; carried claims are routing hints, and hints that lie are refused (D-454, Ω-15)`);
    }
  }
  const hops: ChainHop[] = chain.map((h) => ({
    delegationId: h.delegationId, grantee: h.grantee, scope: h.attenuatedScope,
    expiresAt: h.expiresAt, status: h.status,
  }));
  return {
    ok: true,
    value: {
      hops, depth: hops.length, effectiveScope,
      authorityChain: authorityChainDigest(hops),
      expiresAt: Math.min(...chain.map((h) => h.expiresAt)),
    },
  };
}

/** The authorityChain digest: sha256 over the canonical root→leaf hop chain
 *  (delegationId, grantee, canonical scope per hop) — stable across replays,
 *  citable by Ω-12 frames. */
export function authorityChainDigest(hops: readonly ChainHop[]): string {
  const canon = hops.map((h) => JSON.stringify([h.delegationId, h.grantee, canonicalScope(h.scope)]));
  return createHash("sha256").update(canon.join("\n")).digest("hex");
}

export interface RevocationPlan {
  revokedAt: number;
  /** The hop the grantor named. */
  revokedThrough: string;
  /** The subtree rows to append (status "revoked"), the named hop included. */
  cascade: Array<{ delegationId: string; row: DelegationChainRow }>;
}

/** THE revocation cascade (D-454): revoking any hop marks the whole
 *  descendant subtree revoked-at-{ts} in one sweep — append-only,
 *  latest-wins, genealogy via the appended rows' own annotations. Descendants
 *  discover at their next fold (gate-time pull — no push channel promised). */
export function planRevocation(rows: readonly unknown[], delegationId: string, now: number): DelegationOutcome<RevocationPlan> {
  if (typeof delegationId !== "string" || delegationId.length === 0) {
    throw new Error("planRevocation: delegationId must be a non-empty string");
  }
  if (typeof now !== "number" || !Number.isFinite(now)) {
    throw new Error("planRevocation: now must be a finite number");
  }
  const byId = indexRows(rows);
  const hop = byId.get(delegationId);
  if (hop === undefined) {
    return refuse(DELEGATE_CHAIN_BROKEN, `${DELEGATE_CHAIN_BROKEN}: the delegation "${delegationId}" does not resolve — there is nothing to revoke (D-454)`);
  }
  const children = new Map<string, DelegationChainRow[]>();
  for (const row of byId.values()) {
    if (row.parent !== null) {
      const list = children.get(row.parent) ?? [];
      list.push(row);
      children.set(row.parent, list);
    }
  }
  // BFS the subtree: every LIVE|lapsed row is cascaded; already-revoked rows
  // keep their history closed (re-appending a closed row is noise, not law).
  const cascade: Array<{ delegationId: string; row: DelegationChainRow }> = [];
  const seen = new Set<string>();
  const queue: DelegationChainRow[] = [hop];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (seen.has(cur.delegationId)) continue;
    seen.add(cur.delegationId);
    if (cur.status !== "revoked") {
      cascade.push({
        delegationId: cur.delegationId,
        row: { ...cur, status: "revoked", revokedAt: now, revokedThrough: delegationId },
      });
    }
    for (const child of children.get(cur.delegationId) ?? []) queue.push(child);
  }
  return { ok: true, value: { revokedAt: now, revokedThrough: delegationId, cascade } };
}

/** The two-sovereign treaty row (D-454, spec §3 — shape declared here,
 *  transport owed to the sharing wave): a crossing without both signatures
 *  and both ledger mirrors refuses; expiry fires exactly on schedule. */
export interface TreatyRow {
  treatyId: string;
  parties: [string, string];
  /** The grammar the crossing executes within (tokens.ts scope grammar). */
  delegatedCapabilityGrammar: string;
  /** The crossing's scope — must sit inside the grammar. */
  scope: string;
  expiresAt: number;
  signatures: string[];
  mirroredLedgerRefs: string[];
}

export function validateTreatyRow(row: TreatyRow, now: number): { ok: true } | { ok: false; code: string; sentence: string } {
  if (typeof row.treatyId !== "string" || row.treatyId.length === 0) {
    throw new Error("validateTreatyRow: treatyId must be a non-empty string (malformed shape → DEGRADED)");
  }
  if (!Array.isArray(row.parties) || row.parties.length !== 2
    || row.parties.some((p) => typeof p !== "string" || p.length === 0) || row.parties[0] === row.parties[1]) {
    throw new Error("validateTreatyRow: parties must be two distinct non-empty principals (malformed shape → DEGRADED)");
  }
  canonicalScope(row.delegatedCapabilityGrammar); // throws on malformed grammar (shape)
  let within = false;
  try { within = isSubset(row.scope, row.delegatedCapabilityGrammar); } catch { within = false; }
  if (!within) {
    throw new Error(`validateTreatyRow: the crossing scope "${row.scope}" escapes the delegated capability grammar "${row.delegatedCapabilityGrammar}" — a treaty that grants outside its own grammar is malformed`);
  }
  if (typeof row.expiresAt !== "number" || !Number.isFinite(row.expiresAt)) {
    throw new Error("validateTreatyRow: expiresAt must be a finite number (no perpetual treaties)");
  }
  if (typeof now !== "number" || !Number.isFinite(now)) {
    throw new Error("validateTreatyRow: now must be a finite number");
  }
  const signed = row.parties.every((p) => row.signatures.includes(p));
  const mirrored = Array.isArray(row.mirroredLedgerRefs) && row.mirroredLedgerRefs.length === 2
    && row.mirroredLedgerRefs.every((r) => typeof r === "string" && r.length > 0);
  if (!signed || !mirrored) {
    return refuse(DELEGATE_TREATY_UNSIGNED, `${DELEGATE_TREATY_UNSIGNED}: the sovereign crossing "${row.treatyId}" lacks ${!signed ? "both parties' signatures" : "both ledger mirrors"}; two sovereigns, one canvas, zero one-sided doors (§16) (D-454, Ω-15)`);
  }
  if (row.expiresAt <= now) {
    return refuse(DELEGATE_EXPIRED, `${DELEGATE_EXPIRED}: the treaty "${row.treatyId}" expired at ${new Date(row.expiresAt).toISOString()} — exactly on schedule (F11); renewal is a fresh treaty, not a stretch (D-454)`);
  }
  return { ok: true };
}

/** The headless render: the resolved chain as text, root first. */
export function renderChain(fold: ChainFoldOk): string {
  const lines = [`delegate.chain — ${fold.depth} hop(s), authority ${fold.effectiveScope}, chain ends ${new Date(fold.expiresAt).toISOString()}`];
  fold.hops.forEach((h, i) => {
    lines.push(`  ${String(i).padStart(2, " ")} ${h.delegationId} → ${h.grantee} @ ${h.scope} [${h.status}]`);
  });
  lines.push(`  authorityChain ${fold.authorityChain.slice(0, 16)}… (citable by Ω-12 frames)`);
  return lines.join("\n");
}

// ---- op payload parsers (wiring feeds these; malformed throws → DEGRADED) ----

export interface ChainOpInput {
  delegationId: string;
  carriedAuthority?: string;
  depthBudget?: number;
}

export function parseChainOpInput(payload: unknown): ChainOpInput {
  const op = "delegate.chain@1";
  const p = reqObj(op, payload);
  const carried = optStr(p.carriedAuthority);
  if (carried !== undefined) {
    try {
      canonicalScope(carried);
    } catch (e) {
      throw new Error(`${op}: malformed carriedAuthority — ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  const budget = p.depthBudget;
  if (budget !== undefined && (!Number.isInteger(budget) || budget < 1)) {
    throw new Error(`${op}: depthBudget must be a positive integer (the declared policy row's value)`);
  }
  return {
    delegationId: reqStr(op, "delegationId", p.delegationId),
    ...(carried !== undefined ? { carriedAuthority: carried } : {}),
    ...(budget !== undefined ? { depthBudget: budget as number } : {}),
  };
}

export interface RevokeOpInput {
  delegationId: string;
}

export function parseRevokeOpInput(payload: unknown): RevokeOpInput {
  const op = "delegate.revoke@1";
  const p = reqObj(op, payload);
  return { delegationId: reqStr(op, "delegationId", p.delegationId) };
}

// ---- local input helpers (mirrors agent.ts's private doors) ----

function reqObj(op: string, v: unknown): Record<string, unknown> {
  if (v === null || typeof v !== "object" || Array.isArray(v)) {
    throw new Error(`${op}: payload must be an object`);
  }
  return v as Record<string, unknown>;
}

function reqStr(op: string, field: string, v: unknown): string {
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`${op}: ${field} must be a non-empty string`);
  }
  return v;
}

function optStr(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
