// vivim-run/src/badge.ts (D-441, Ω-7 — the badge substrate, re-materialized spec paper D-431)
//
// The badge is text before it is pixels: the kernel ceremony MINTS the tier
// (self-claims refused), promotion cites two-resolvable-one-independent
// evidence (the static law lifted to runtime), demotion scars ride affected
// rows (nothing deletes), and ONE print fold renders the two-axis sentence
// from rows alone — surfaces may style it, never source it elsewhere.
import { createHash } from "node:crypto";

export const BADGE_NS = "badge";
export const BADGE_TIER_CLAIMED = "BADGE_TIER_CLAIMED";
export const BADGE_EVIDENCE_INSUFFICIENT = "BADGE_EVIDENCE_INSUFFICIENT";
export const BADGE_EVIDENCE_UNRESOLVABLE = "BADGE_EVIDENCE_UNRESOLVABLE";
export const BADGE_ERA_INVALID = "BADGE_ERA_INVALID";
export const BADGE_DUPLICATE = "BADGE_DUPLICATE";

export const TIERS = ["untrusted", "signed", "verified", "first-party", "system"] as const;
export type Tier = (typeof TIERS)[number];
export type Generality = "GEN_SPECULATIVE" | "GEN_PERSONAL" | "GEN_GENERIC" | "GEN_ENVIRONMENT";

export interface BadgeRow {
  badgeId: string;
  subjectRef: string;          // plugin | pack | realization | artifact | row
  tier: Tier;                  // ASSIGNED by the kernel ceremony — never the subject
  assignedBy: string;          // the ceremony's principal (kernel lane)
  generality: Generality;
  basis: string;               // decision record | census | proof report
  era: { notBefore: number };  // mint-time law: history's badges never silently re-mean
  at: number;
  demotedTo?: Tier;            // the scar — carried forward, never deleted
  demotionReason?: string;     // REVOKED_KEY_ERA | evidence-lost | breach | …
  demotedAt?: number;
  promotionEvidence?: string[]; // the refs the promotion cited
}

export type MintOutcome = { ok: true; row: BadgeRow } | { ok: false; code: string; sentence: string };
export type PromoteOutcome = { ok: true; row: BadgeRow } | { ok: false; code: string; sentence: string };

/** Deterministic JSON (sorted keys) — the digest foundation. */
export function canonicalJson(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonicalJson).join(",")}]`;
  if (v !== null && typeof v === "object") {
    return `{${Object.keys(v as Record<string, unknown>).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson((v as Record<string, unknown>)[k])}`).join(",")}}`;
  }
  return JSON.stringify(v) ?? "null";
}

export function badgeDigest(row: BadgeRow): string {
  return `sha256:${createHash("sha256").update(canonicalJson(row)).digest("hex")}`;
}

/**
 * THE mint ceremony (D-441): the kernel assigns the tier. A subject claiming
 * its own tier (assignedBy === subjectRef's owner, or tier asserted in the
 * subject's own payload) is the forgery the door refuses.
 */
export function mint(
  spec: { badgeId: string; subjectRef: string; tier: string; assignedBy: string; generality: Generality; basis: string; notBefore: number; at: number; subjectClaimedTier?: string },
  existing: ReadonlySet<string>,
): MintOutcome {
  if (typeof spec.badgeId !== "string" || spec.badgeId.length === 0) {
    return { ok: false, code: BADGE_ERA_INVALID, sentence: `${BADGE_ERA_INVALID}: badgeId must be a non-empty string (D-441)` };
  }
  if (existing.has(spec.badgeId)) {
    return { ok: false, code: BADGE_DUPLICATE, sentence: `${BADGE_DUPLICATE}: badge ${spec.badgeId} already exists — supersede it, never re-mint an id (D-441)` };
  }
  if (spec.subjectClaimedTier !== undefined && spec.subjectClaimedTier === spec.tier) {
    return { ok: false, code: BADGE_TIER_CLAIMED, sentence: `${BADGE_TIER_CLAIMED}: the subject's own payload asserts tier ${spec.subjectClaimedTier} — the kernel ceremony assigns tiers, the subject never self-certifies (D-441, Ω-7)` };
  }
  if (!(TIERS as readonly string[]).includes(spec.tier)) {
    return { ok: false, code: BADGE_ERA_INVALID, sentence: `${BADGE_ERA_INVALID}: tier must be one of ${TIERS.join("|")} (got ${JSON.stringify(spec.tier)}) (D-441)` };
  }
  if (typeof spec.assignedBy !== "string" || spec.assignedBy.length === 0 || spec.assignedBy === spec.subjectRef) {
    return { ok: false, code: BADGE_TIER_CLAIMED, sentence: `${BADGE_TIER_CLAIMED}: the assigner (${JSON.stringify(spec.assignedBy)}) must be the kernel ceremony, not the subject itself (D-441)` };
  }
  if (!Number.isFinite(spec.notBefore) || spec.at < spec.notBefore) {
    return { ok: false, code: BADGE_ERA_INVALID, sentence: `${BADGE_ERA_INVALID}: the mint time ${spec.at} precedes the era's notBefore ${spec.notBefore} — a badge cannot predate its own law (D-441)` };
  }
  return {
    ok: true,
    row: { badgeId: spec.badgeId, subjectRef: spec.subjectRef, tier: spec.tier as Tier, assignedBy: spec.assignedBy, generality: spec.generality, basis: spec.basis, era: { notBefore: spec.notBefore }, at: spec.at },
  };
}

/**
 * THE promotion (D-441): to GEN_GENERIC requires ≥2 resolvable evidence refs,
 * ≥1 independent — validateGenerality's static law lifted to runtime.
 */
export function promote(
  row: BadgeRow,
  to: Generality,
  evidence: string[],
  resolvable: (ref: string) => boolean,
  independent: (a: string, b: string) => boolean,
  decisionRef: string,
): PromoteOutcome {
  if (to !== "GEN_GENERIC") {
    return { ok: true, row: { ...row, generality: to, promotionEvidence: evidence } }; // narrowing needs no ceremony beyond the row
  }
  if (evidence.length < 2) {
    return { ok: false, code: BADGE_EVIDENCE_INSUFFICIENT, sentence: `${BADGE_EVIDENCE_INSUFFICIENT}: promoting ${row.badgeId} to GEN_GENERIC with ${evidence.length} evidence ref(s) — the law demands ≥2 resolvable, ≥1 independent (the static seat's own rule, D-441)` };
  }
  for (const ref of evidence) {
    if (!resolvable(ref)) {
      return { ok: false, code: BADGE_EVIDENCE_UNRESOLVABLE, sentence: `${BADGE_EVIDENCE_UNRESOLVABLE}: evidence ref ${JSON.stringify(ref)} does not resolve — a promotion citing nothing promotes nothing (D-441)` };
    }
  }
  const hasIndependent = evidence.some((a) => evidence.some((b) => a !== b && independent(a, b)));
  if (!hasIndependent) {
    return { ok: false, code: BADGE_EVIDENCE_INSUFFICIENT, sentence: `${BADGE_EVIDENCE_INSUFFICIENT}: all ${evidence.length} evidence ref(s) are the same origin — one independent witness is the floor for GEN_GENERIC (D-441)` };
  }
  return { ok: true, row: { ...row, generality: to, promotionEvidence: evidence } };
}

/**
 * THE demotion (D-441): reason-carrying, scarring, never deleting. A key-era
 * revocation demotes suspect-era badges and the scar rides the row forward.
 */
export function demote(row: BadgeRow, to: Tier, reason: string, at: number): BadgeRow {
  return { ...row, tier: to, demotedTo: to, demotionReason: reason, demotedAt: at };
}

/**
 * THE print fold (D-441): the two-axis sentence from rows alone — the only
 * renderer. Tampering a source row changes the print or fails the digest.
 */
export function badgePrint(row: BadgeRow): string {
  const scar = row.demotedTo !== undefined
    ? ` — DEMOTED to ${row.demotedTo} at ${row.demotedAt} (${row.demotionReason}; the scar rides forward, nothing deleted)`
    : "";
  return `${row.subjectRef} carries tier ${row.tier} (assigned by ${row.assignedBy}, era notBefore ${row.era.notBefore}) · generality ${row.generality}${row.promotionEvidence !== undefined ? ` (promoted on ${row.promotionEvidence.length} citation(s))` : ""} · basis ${row.basis}${scar} [${badgeDigest(row).slice(0, 22)}…]`;
}

/** Era-aware evaluation: a badge is judged under the law of its mint time. */
export function eraVerdict(row: BadgeRow, keyEraRevokedAt: number | null): { valid: boolean; detail: string } {
  if (keyEraRevokedAt !== null && row.era.notBefore < keyEraRevokedAt && row.demotedTo === undefined) {
    return { valid: false, detail: `the badge's era (notBefore ${row.era.notBefore}) predates the key revocation at ${keyEraRevokedAt} — suspect-era; demote with REVOKED_KEY_ERA (D-441)` };
  }
  return { valid: true, detail: "era-clean" };
}

/** The in-plugin registry (the vault mirror rides port caps, ring-first). */
export class BadgeRegistry {
  private rows = new Map<string, BadgeRow>();
  mint(spec: Parameters<typeof mint>[0]): MintOutcome {
    const out = mint(spec, new Set(this.rows.keys()));
    if (out.ok) this.rows.set(out.row.badgeId, out.row);
    return out;
  }
  promote(badgeId: string, to: Generality, evidence: string[], resolvable: (ref: string) => boolean, independent: (a: string, b: string) => boolean, decisionRef: string): PromoteOutcome {
    const row = this.rows.get(badgeId);
    if (!row) return { ok: false, code: BADGE_DUPLICATE, sentence: `${BADGE_DUPLICATE}: badge ${badgeId} not found (D-441)` };
    const out = promote(row, to, evidence, resolvable, independent, decisionRef);
    if (out.ok) this.rows.set(badgeId, out.row);
    return out;
  }
  demote(badgeId: string, to: Tier, reason: string, at: number): BadgeRow | null {
    const row = this.rows.get(badgeId);
    if (!row) return null;
    const next = demote(row, to, reason, at);
    this.rows.set(badgeId, next);
    return next;
  }
  get(badgeId: string): BadgeRow | null { return this.rows.get(badgeId) ?? null; }
  print(badgeId: string): string | null { const r = this.rows.get(badgeId); return r ? badgePrint(r) : null; }
  list(): string[] { return [...this.rows.keys()].sort(); }
}
