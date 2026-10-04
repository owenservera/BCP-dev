// vivim.agent/src/adaptation.ts (D-455, Ω-16 — the adaptation governance
// boundary, re-materialized spec paper D-448)
//
// The system changes itself only under signature. Every self-change — a
// behavior contract's evolution, a model/realization swap, a policy
// amendment, a lexicon shift — is an adaptation proposal with a vault-cited
// blast-radius census before the flip, a treaty-impact check, a named
// rollback point, and a signature at the flip: the D-435 deprecation
// ceremony, generalized from capabilities to the system's own behavior.
// The flip is never quiet (§29), the census is re-digested at the flip
// (never ratify a stale map), the way back is windowed, and the ceremony
// governing itself is itself an adaptation — the recursion is law.
//
// Pure core: the ops layer (index.ts) supplies `now` + resolves citations;
// no timers, no I/O. Expected-but-negative results return
// {ok:false, code, sentence}; malformed INPUT SHAPES throw (→ DEGRADED at
// the op boundary, the house fail-closed discipline, same split as agent.ts).
import { createHash } from "node:crypto";

export const ADAPT_NS = "adapt";
/** The ceremony's own target ref: amending the ceremony is itself an
 *  adaptation, and the amendment must count the ceremony among its
 *  dependents — the last boundary draws itself (spec §9). */
export const ADAPT_CEREMONY_REF = "adapt.ceremony";

export const ADAPT_CENSUS_UNCITED = "ADAPT_CENSUS_UNCITED";
export const ADAPT_TREATY_UNCHECKED = "ADAPT_TREATY_UNCHECKED";
export const ADAPT_WINDOW_CLOSED = "ADAPT_WINDOW_CLOSED";
export const ADAPT_SELF_GOVERNANCE = "ADAPT_SELF_GOVERNANCE";
export const ADAPT_SILENT_PROMOTION = "ADAPT_SILENT_PROMOTION";
export const ADAPT_ROLLBACK_POINT_MISSING = "ADAPT_ROLLBACK_POINT_MISSING";
export const ADAPT_BLAST_RADIUS_CHANGED = "ADAPT_BLAST_RADIUS_CHANGED";

export type AdaptOutcome<T> = { ok: true; value: T } | { ok: false; code: string; sentence: string };

function refuse(code: string, sentence: string): { ok: false; code: string; sentence: string } {
  return { ok: false, code, sentence };
}

// ---- row vocabulary ----

export type AdaptTargetKind = "behavior" | "realization" | "policy" | "lexicon";
const TARGET_KINDS: readonly AdaptTargetKind[] = ["behavior", "realization", "policy", "lexicon"];

export interface AdaptTarget {
  kind: AdaptTargetKind;
  /** The target's id (behavior contract id, realization id, policy id, lexicon id). */
  ref: string;
}

export interface ProvenanceRef {
  ns: string;
  id: string;
  /** Integer ≥ 1 — "HEAD" is refused (the VaultProvenanceRef law). */
  rev: number;
}

export type CensusDependentKind = "composition" | "agent" | "standing" | "treaty";

/** One vault-cited dependent: WHO depends on the target, row-cited. */
export interface CensusEntry {
  dependent: string;
  kind: CensusDependentKind;
  ref: ProvenanceRef;
}

/** One treaty-impact check: a live treaty whose promised behavior the diff
 *  touches, and whether both parties re-signed. */
export interface TreatyCheck {
  treatyId: string;
  impacted: boolean;
  resigned: boolean;
}

/** The signature at the flip: a human principal (carrying its decision ref)
 *  OR a live auto-with-proof standing (citing the standing, which cites the
 *  original consent) — the chain of the yes. */
export type Ratifier =
  | { kind: "human"; principal: string; decisionRef: ProvenanceRef }
  | { kind: "standing"; standingRef: ProvenanceRef; consentRef: ProvenanceRef };

export interface AdaptProposalRow {
  proposalId: string;
  target: AdaptTarget;
  /** The diff this proposal flips on — for realization targets, the
   *  resolution battery diff (WHAT answers would change, not just who). */
  diffRef: ProvenanceRef;
  /** The row-cited rollback point — REQUIRED: the way back. */
  rollbackPoint: ProvenanceRef;
  /** The vault-cited blast radius at propose; digest-pinned, re-digested at flip. */
  census: CensusEntry[];
  censusDigest: string;
  /** REQUIRED when the census is empty: the cited proof that nothing cites the target. */
  censusBasis?: string;
  treatyChecks: TreatyCheck[];
  status: "proposed" | "ratified" | "rolled-back";
  window: { notBefore: number; notAfter: number };
  proposedAt: number;
  ratifiedAt?: number;
  ratifier?: Ratifier;
  rolledBackAt?: number;
}

/** Canonical vault row id for a ceremony row (ns "adapt"): `proposal:<proposalId>`. */
export function adaptProposalId(proposalId: string): string {
  if (typeof proposalId !== "string" || proposalId.length === 0) {
    throw new Error("adaptProposalId: proposalId must be a non-empty string");
  }
  if (/[\u0000|:]/.test(proposalId)) {
    throw new Error("adaptProposalId: proposalId must not contain '|' or NUL or ':' (id grammar)");
  }
  return `proposal:${proposalId}`;
}

/** The census digest: sha256 over the canonical, order-free census —
 *  inputHash-pinned exactly like D-435's dependents census. */
export function censusDigestOf(census: readonly CensusEntry[]): string {
  const canon = [...census]
    .map((e) => JSON.stringify([e.dependent, e.kind, e.ref.ns, e.ref.id, e.ref.rev]))
    .sort();
  return createHash("sha256").update(canon.join("\n")).digest("hex");
}

/** Parse a vault data row into a ceremony row; null when it is not one. */
export function parseAdaptRow(v: unknown): AdaptProposalRow | null {
  if (v === null || typeof v !== "object" || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  if (typeof o.proposalId !== "string" || o.proposalId.length === 0) return null;
  const t = o.target as Record<string, unknown> | undefined;
  if (t === undefined || typeof t !== "object" || !TARGET_KINDS.includes(t.kind as AdaptTargetKind)
    || typeof t.ref !== "string") return null;
  if (!isRef(o.diffRef) || !isRef(o.rollbackPoint)) return null;
  if (!Array.isArray(o.census) || !o.census.every(isCensusEntry)) return null;
  if (typeof o.censusDigest !== "string" || o.censusDigest.length === 0) return null;
  if (!Array.isArray(o.treatyChecks) || !o.treatyChecks.every(isTreatyCheck)) return null;
  if (o.status !== "proposed" && o.status !== "ratified" && o.status !== "rolled-back") return null;
  const w = o.window as { notBefore?: unknown; notAfter?: unknown } | undefined;
  if (w === undefined || typeof w !== "object" || typeof w.notBefore !== "number" || typeof w.notAfter !== "number") return null;
  if (typeof o.proposedAt !== "number") return null;
  return v as AdaptProposalRow;
}

// ---- the ceremony ----

export interface ProposeInput {
  proposalId: string;
  target: AdaptTarget;
  diffRef: ProvenanceRef;
  rollbackPoint?: ProvenanceRef;
  census: CensusEntry[];
  censusBasis?: string;
  treatyChecks: TreatyCheck[];
  window: { notBefore: number; notAfter: number };
}

/** THE propose door (D-455): the diff + the rollback point (REQUIRED — a
 *  self-change without a way back is a bet placed with the house's money);
 *  an empty census only with its cited proof of emptiness; a self-governance
 *  proposal must count the ceremony among its own dependents. Born
 *  `proposed`, never ratified by construction. */
export function buildProposal(input: ProposeInput, now: number): AdaptOutcome<AdaptProposalRow> {
  const op = "adapt.propose@1";
  if (typeof input.proposalId !== "string" || input.proposalId.length === 0) {
    throw new Error(`${op}: proposalId must be a non-empty string`);
  }
  if (input.target === null || typeof input.target !== "object"
    || !TARGET_KINDS.includes(input.target.kind)) {
    throw new Error(`${op}: target.kind must be behavior|realization|policy|lexicon`);
  }
  if (typeof input.target.ref !== "string" || input.target.ref.length === 0) {
    throw new Error(`${op}: target.ref must be a non-empty string`);
  }
  if (!isRef(input.diffRef)) throw new Error(`${op}: diffRef must be {ns, id, rev} (the diff — for realization targets the resolution battery diff)`);
  const w = input.window;
  if (w === null || typeof w !== "object" || !Number.isFinite(w?.notBefore) || !Number.isFinite(w?.notAfter) || w.notAfter <= w.notBefore) {
    throw new Error(`${op}: window must be {notBefore < notAfter} (the ceremony's clock, both finite)`);
  }
  if (typeof now !== "number" || !Number.isFinite(now)) throw new Error(`${op}: now must be a finite number`);
  if (!Array.isArray(input.census) || !input.census.every(isCensusEntry)) {
    throw new Error(`${op}: census must be an array of {dependent, kind, ref} entries`);
  }
  if (!Array.isArray(input.treatyChecks) || !input.treatyChecks.every(isTreatyCheck)) {
    throw new Error(`${op}: treatyChecks must be an array of {treatyId, impacted, resigned}`);
  }
  // the rollback point — REQUIRED (the way back)
  if (input.rollbackPoint === undefined) {
    return refuse(ADAPT_ROLLBACK_POINT_MISSING, `${ADAPT_ROLLBACK_POINT_MISSING}: the proposal names no rollback point; a self-change without a way back is a bet placed with the house's money (D-455, Ω-16)`);
  }
  if (!isRef(input.rollbackPoint)) throw new Error(`${op}: rollbackPoint must be {ns, id, rev} (a row-cited vault revision)`);
  // the census — empty only with its proof (you cannot change what you have not counted)
  if (input.census.length === 0 && !(typeof input.censusBasis === "string" && input.censusBasis.length > 0)) {
    return refuse(ADAPT_CENSUS_UNCITED, `${ADAPT_CENSUS_UNCITED}: the proposal carries an empty census with no cited basis; an empty blast radius is a claim, and claims cite their proof — you cannot change what you have not counted, and neither can the system (the D-435 law, one tier up) (D-455, Ω-16)`);
  }
  // the last boundary — the ceremony governing itself is itself an adaptation
  if (isSelfGovernanceTarget(input.target)
    && !input.census.some((e) => e.ref.ns === ADAPT_NS)) {
    return refuse(ADAPT_SELF_GOVERNANCE, `${ADAPT_SELF_GOVERNANCE}: the proposal amends the ceremony itself but does not count the ceremony among its dependents (no census entry cites ns ${ADAPT_NS}); the ceremony governing itself is itself an adaptation — the recursion is law, the last boundary draws itself (D-455, Ω-16)`);
  }
  return {
    ok: true,
    value: {
      proposalId: input.proposalId,
      target: input.target,
      diffRef: input.diffRef,
      rollbackPoint: input.rollbackPoint,
      census: input.census,
      censusDigest: censusDigestOf(input.census),
      ...(input.census.length === 0 && input.censusBasis !== undefined ? { censusBasis: input.censusBasis } : {}),
      treatyChecks: input.treatyChecks,
      status: "proposed", // never ratified by construction — the flip is a signature, not a state flip
      window: { notBefore: w.notBefore, notAfter: w.notAfter },
      proposedAt: now,
    },
  };
}

export interface RatifyInput {
  /** The FRESH census at the flip (re-digested; the census must describe the
   *  world being changed, not the world that proposed). */
  census?: CensusEntry[];
  /** The fresh treaty state; defaults to the row's pinned checks. */
  treatyChecks?: TreatyCheck[];
  /** The signature: a human principal or a live auto-with-proof standing. */
  ratifier?: Ratifier;
}

/** THE flip (D-455): window-checked, census re-digested, treaty-guarded,
 *  signed — in that order, each refusal named. The ratified row carries the
 *  ratifier (the chain of the yes). */
export function ratifyProposal(row: AdaptProposalRow, input: RatifyInput, now: number): AdaptOutcome<AdaptProposalRow> {
  if (typeof now !== "number" || !Number.isFinite(now)) throw new Error("ratifyProposal: now must be a finite number");
  if (row.status !== "proposed") {
    return refuse("UNSUPPORTED", `only proposed adaptations ratify (found "${row.status}") — a settled ceremony is evidence, never re-flipped`);
  }
  // the window bounds the whole ceremony: ratify opens at notBefore (the
  // ratifier signs over evidence, not over haste) and everything closes at
  // notAfter (a flip that can never be taken back is not governance).
  if (now < row.window.notBefore) {
    return refuse(ADAPT_WINDOW_CLOSED, `${ADAPT_WINDOW_CLOSED}: the window has not opened (notBefore ${new Date(row.window.notBefore).toISOString()}); the ratifier signs over evidence, not over haste (D-455, Ω-16)`);
  }
  if (now > row.window.notAfter) {
    return refuse(ADAPT_WINDOW_CLOSED, `${ADAPT_WINDOW_CLOSED}: the window closed at ${new Date(row.window.notAfter).toISOString()} — a flip that can never be taken back is not governance, it is a trap (D-455, Ω-16)`);
  }
  // the census — cited AND fresh; re-digested at the flip
  if (input.census === undefined) {
    return refuse(ADAPT_CENSUS_UNCITED, `${ADAPT_CENSUS_UNCITED}: the adaptation ratifies without a cited, fresh blast-radius census; you cannot change what you have not counted — and neither can the system (the D-435 law, one tier up) (D-455, Ω-16)`);
  }
  if (!Array.isArray(input.census) || !input.census.every(isCensusEntry)) {
    throw new Error("ratifyProposal: census must be an array of {dependent, kind, ref} entries");
  }
  const digest = censusDigestOf(input.census);
  if (digest !== row.censusDigest) {
    return refuse(ADAPT_BLAST_RADIUS_CHANGED, `${ADAPT_BLAST_RADIUS_CHANGED}: the census digest at ratification differs from the proposal's (${digest.slice(0, 12)}… ≠ ${row.censusDigest.slice(0, 12)}…); the world moved — re-census and re-propose, never ratify a stale map (D-455, Ω-16)`);
  }
  // the treaty guard — a promise two sovereigns made is not yours to change alone
  const checks = input.treatyChecks ?? row.treatyChecks;
  for (const t of checks) {
    if (t.impacted && !t.resigned) {
      return refuse(ADAPT_TREATY_UNCHECKED, `${ADAPT_TREATY_UNCHECKED}: the impacted treaty (${t.treatyId}) has not re-signed; a promise two sovereigns made is not yours to change alone (§16) (D-455, Ω-16)`);
    }
  }
  // the signature — never quiet (§29)
  if (input.ratifier === undefined) {
    return refuse(ADAPT_SILENT_PROMOTION, `${ADAPT_SILENT_PROMOTION}: promotion was attempted without a human signature or a live auto-with-proof standing; the quietness may be UX, the authority is never quiet (§29) (D-455, Ω-16)`);
  }
  if (input.ratifier.kind === "human") {
    if (typeof input.ratifier.principal !== "string" || input.ratifier.principal.length === 0 || !isRef(input.ratifier.decisionRef)) {
      return refuse(ADAPT_SILENT_PROMOTION, `${ADAPT_SILENT_PROMOTION}: the human signature names no principal or carries no decision ref — an anonymous yes is a shrug wearing a signature's clothes (D-455, Ω-16)`);
    }
  } else if (input.ratifier.kind === "standing") {
    if (!isRef(input.ratifier.standingRef) || !isRef(input.ratifier.consentRef)) {
      return refuse(ADAPT_SILENT_PROMOTION, `${ADAPT_SILENT_PROMOTION}: the standing signature cites no live standing + original consent — an uncited standing is not a pre-signed yes, it is a rumor (D-455, Ω-16)`);
    }
  } else {
    return refuse(ADAPT_SILENT_PROMOTION, `${ADAPT_SILENT_PROMOTION}: the ratifier is neither a human principal nor a live auto-with-proof standing (found ${JSON.stringify((input.ratifier as { kind?: unknown }).kind)}) (D-455, Ω-16)`);
  }
  return {
    ok: true,
    value: {
      ...row,
      status: "ratified",
      ratifiedAt: now,
      ratifier: input.ratifier,
      ...(input.treatyChecks !== undefined ? { treatyChecks: input.treatyChecks } : {}),
    },
  };
}

/** THE way back (D-455, pure law — op transport owed to the mounts wave):
 *  within the window, rollback to the point is one op citing the rows;
 *  past the window, rollback is a new adaptation — never past the point. */
export function rollbackProposal(row: AdaptProposalRow, now: number): AdaptOutcome<AdaptProposalRow> {
  if (typeof now !== "number" || !Number.isFinite(now)) throw new Error("rollbackProposal: now must be a finite number");
  if (row.status !== "ratified") {
    return refuse("UNSUPPORTED", `only ratified adaptations roll back (found "${row.status}") — the way back belongs to the flip, not to the proposal`);
  }
  if (now > row.window.notAfter) {
    return refuse(ADAPT_WINDOW_CLOSED, `${ADAPT_WINDOW_CLOSED}: rollback was attempted beyond the declared window (closed ${new Date(row.window.notAfter).toISOString()}); the way back ends where it was drawn, and past it lies only a new adaptation (D-455, Ω-16)`);
  }
  return { ok: true, value: { ...row, status: "rolled-back", rolledBackAt: now } };
}

/** True when the target is the ceremony itself (spec §9: changing
 *  adaptation governance is itself an adaptation). */
export function isSelfGovernanceTarget(target: AdaptTarget): boolean {
  return target.kind === "policy" && target.ref === ADAPT_CEREMONY_REF;
}

/** The ratifier's citations — what the op resolves and the append cites. */
export function ratifierRefs(ratifier: Ratifier): ProvenanceRef[] {
  return ratifier.kind === "human"
    ? [ratifier.decisionRef]
    : [ratifier.standingRef, ratifier.consentRef];
}

/** The census's citations — every dependent a row (append refs). */
export function censusRefs(census: readonly CensusEntry[]): ProvenanceRef[] {
  return census.map((e) => e.ref);
}

/** The headless render: the ceremony as text, actionable first. */
export function renderCeremony(rows: readonly AdaptProposalRow[]): string {
  const rank = (s: AdaptProposalRow["status"]) => (s === "proposed" ? 0 : s === "ratified" ? 1 : 2);
  const sorted = [...rows].sort((a, b) => rank(a.status) - rank(b.status) || (a.proposalId < b.proposalId ? -1 : 1));
  const lines = [`adapt.read — ${rows.length} proposal(s), proposed first`];
  for (const r of sorted) {
    const signedBy = r.ratifier === undefined
      ? ""
      : r.ratifier.kind === "human"
        ? `, signedBy ${r.ratifier.principal}`
        : ", signedBy a live standing (cites its consent)";
    lines.push(`  ${r.status.padEnd(10)} ${r.proposalId} ${r.target.kind}:${r.target.ref} (${r.census.length} dependent(s)${r.census.length === 0 && r.censusBasis !== undefined ? ", empty-with-basis" : ""}${signedBy})`);
  }
  return lines.join("\n");
}

// ---- shape helpers ----

function isRef(v: unknown): v is ProvenanceRef {
  if (v === null || typeof v !== "object" || Array.isArray(v)) return false;
  const o = v as Record<string, unknown>;
  return typeof o.ns === "string" && o.ns.length > 0
    && typeof o.id === "string" && o.id.length > 0
    && typeof o.rev === "number" && Number.isInteger(o.rev) && o.rev >= 1;
}

function isCensusEntry(v: unknown): v is CensusEntry {
  if (v === null || typeof v !== "object" || Array.isArray(v)) return false;
  const o = v as Record<string, unknown>;
  return typeof o.dependent === "string" && o.dependent.length > 0
    && (o.kind === "composition" || o.kind === "agent" || o.kind === "standing" || o.kind === "treaty")
    && isRef(o.ref);
}

function isTreatyCheck(v: unknown): v is TreatyCheck {
  if (v === null || typeof v !== "object" || Array.isArray(v)) return false;
  const o = v as Record<string, unknown>;
  return typeof o.treatyId === "string" && o.treatyId.length > 0
    && typeof o.impacted === "boolean" && typeof o.resigned === "boolean";
}

// ---- op payload parsers (wiring feeds these; malformed throws → DEGRADED) ----

export interface AdaptProposeOpInput extends Omit<ProposeInput, "rollbackPoint"> {
  rollbackPoint?: ProvenanceRef;
}

export function parseAdaptProposeOpInput(payload: unknown): AdaptProposeOpInput {
  const op = "adapt.propose@1";
  const p = reqObj(op, payload);
  const target = reqObj(op, "target", p.target);
  const w = reqObj(op, "window", p.window);
  return {
    proposalId: reqStr(op, "proposalId", p.proposalId),
    target: {
      kind: target.kind as AdaptTargetKind, // buildProposal re-validates the enum
      ref: reqStr(op, "target.ref", target.ref),
    },
    diffRef: asRef(op, "diffRef", p.diffRef),
    ...(p.rollbackPoint !== undefined ? { rollbackPoint: asRef(op, "rollbackPoint", p.rollbackPoint) } : {}),
    census: asCensusList(op, "census", p.census ?? []),
    ...(optStr(p.censusBasis) !== undefined ? { censusBasis: optStr(p.censusBasis)! } : {}),
    treatyChecks: asTreatyCheckList(op, "treatyChecks", p.treatyChecks ?? []),
    window: { notBefore: reqNum(op, "window.notBefore", w.notBefore), notAfter: reqNum(op, "window.notAfter", w.notAfter) },
  };
}

export interface AdaptRatifyOpInput {
  proposalId: string;
  census?: CensusEntry[];
  treatyChecks?: TreatyCheck[];
  ratifier?: Ratifier;
}

export function parseAdaptRatifyOpInput(payload: unknown): AdaptRatifyOpInput {
  const op = "adapt.ratify@1";
  const p = reqObj(op, payload);
  return {
    proposalId: reqStr(op, "proposalId", p.proposalId),
    ...(p.census !== undefined ? { census: asCensusList(op, "census", p.census) } : {}),
    ...(p.treatyChecks !== undefined ? { treatyChecks: asTreatyCheckList(op, "treatyChecks", p.treatyChecks) } : {}),
    ...(p.ratifier !== undefined ? { ratifier: asRatifier(op, p.ratifier) } : {}),
  };
}

export interface AdaptReadOpInput {
  proposalId?: string;
}

export function parseAdaptReadOpInput(payload: unknown): AdaptReadOpInput {
  const p = (payload ?? {}) as Record<string, unknown>;
  const id = optStr(p.proposalId);
  return id !== undefined ? { proposalId: id } : {};
}

// ---- local input helpers (mirrors agent.ts's private doors) ----

function reqObj(op: string, field: string, v: unknown): Record<string, unknown> {
  if (v === null || typeof v !== "object" || Array.isArray(v)) {
    throw new Error(`${op}: ${field} must be an object`);
  }
  return v as Record<string, unknown>;
}

function reqStr(op: string, field: string, v: unknown): string {
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`${op}: ${field} must be a non-empty string`);
  }
  return v;
}

function reqNum(op: string, field: string, v: unknown): number {
  if (typeof v !== "number" || !Number.isFinite(v)) {
    throw new Error(`${op}: ${field} must be a finite number`);
  }
  return v;
}

function optStr(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function asRef(op: string, field: string, v: unknown): ProvenanceRef {
  const o = reqObj(op, field, v);
  const ns = reqStr(op, `${field}.ns`, o.ns);
  const id = reqStr(op, `${field}.id`, o.id);
  if (typeof o.rev !== "number" || !Number.isInteger(o.rev) || o.rev < 1) {
    throw new Error(`${op}: ${field}.rev must be an integer >= 1 (got ${JSON.stringify(o.rev)})`);
  }
  return { ns, id, rev: o.rev };
}

function asCensusList(op: string, field: string, v: unknown): CensusEntry[] {
  if (!Array.isArray(v)) throw new Error(`${op}: ${field} must be an array of {dependent, kind, ref} entries`);
  return v.map((e, i) => {
    const o = reqObj(op, `${field}[${i}]`, e);
    const kind = o.kind;
    if (kind !== "composition" && kind !== "agent" && kind !== "standing" && kind !== "treaty") {
      throw new Error(`${op}: ${field}[${i}].kind must be composition|agent|standing|treaty`);
    }
    return { dependent: reqStr(op, `${field}[${i}].dependent`, o.dependent), kind, ref: asRef(op, `${field}[${i}].ref`, o.ref) };
  });
}

function asTreatyCheckList(op: string, field: string, v: unknown): TreatyCheck[] {
  if (!Array.isArray(v)) throw new Error(`${op}: ${field} must be an array of {treatyId, impacted, resigned}`);
  return v.map((e, i) => {
    const o = reqObj(op, `${field}[${i}]`, e);
    if (typeof o.impacted !== "boolean" || typeof o.resigned !== "boolean") {
      throw new Error(`${op}: ${field}[${i}].impacted/.resigned must be booleans`);
    }
    return { treatyId: reqStr(op, `${field}[${i}].treatyId`, o.treatyId), impacted: o.impacted, resigned: o.resigned };
  });
}

function asRatifier(op: string, v: unknown): Ratifier {
  const o = reqObj(op, "ratifier", v);
  if (o.kind === "human") {
    return { kind: "human", principal: reqStr(op, "ratifier.principal", o.principal), decisionRef: asRef(op, "ratifier.decisionRef", o.decisionRef) };
  }
  if (o.kind === "standing") {
    return {
      kind: "standing",
      standingRef: asRef(op, "ratifier.standingRef", o.standingRef),
      consentRef: asRef(op, "ratifier.consentRef", o.consentRef),
    };
  }
  throw new Error(`${op}: ratifier.kind must be "human" | "standing" (got ${JSON.stringify(o.kind)})`);
}
