// vivim-run/src/capability.ts (D-435, Ω-3.5)
// The capability deprecation lifecycle: census-first, successor-named,
// time-boxed badged shims, sunset refusals with directions.
//
// THE LAW: no vanishing doors. A capability may not quietly disappear:
//  · deprecation counts dependents FROM THE VAULT before ratification and
//    flags them (CAP_DEPRECATE_CENSUS_UNCITED when the census is missing —
//    a deprecation that did not look at its dependents is a guess)
//  · the successor is named — or "none" is declared EXPLICITLY
//    (CAP_DEPRECATE_WITHOUT_SUCCESSOR)
//  · the migration window routes through a badged, budgeted, EXPIRING shim;
//    post-sunset use refuses CAP_SUNSET_BREACH naming the successor
//  · an expired shim refuses CAP_SHIM_EXPIRED, and extension mechanically
//    requires a NEW decision record (decisionRef cited, different id)
//
// Pure core: the op layer supplies the vault census + `now`; tests inject both.
import { canonicalJson, sha256Hex } from "./planstate.ts";

export const CAP_DEPRECATED = "CAP_DEPRECATED";
export const CAP_DEPRECATE_WITHOUT_SUCCESSOR = "CAP_DEPRECATE_WITHOUT_SUCCESSOR";
export const CAP_DEPRECATE_CENSUS_UNCITED = "CAP_DEPRECATE_CENSUS_UNCITED";
export const CAP_SUNSET_BREACH = "CAP_SUNSET_BREACH";
export const CAP_SHIM_EXPIRED = "CAP_SHIM_EXPIRED";

export type LifecycleState = "active" | "deprecated" | "sunset" | "retired";

export interface DependentRef {
  ref: string;        // the vault citation (ns/id@rev or composition ref)
  kind: string;       // "composition" | "plan" | "grant" | …
}

export interface MigrationShim {
  shimId: string;
  badge: "GEN_SPECULATIVE";   // the migration tier (never GEN_GENERIC — a shim is scaffolding)
  expiresAt: number;
  decisionRef: string;        // the record that authorized THIS window
}

export interface LifecycleRow {
  capability: string;
  state: LifecycleState;
  successor: string;          // the named successor OR the literal "none" (explicit)
  dependents: DependentRef[]; // the vault-cited census, inputHash-pinned
  censusDigest: string;       // sha256 over the census — the pin
  migrationShim?: MigrationShim;
  sunsetAt?: number;
  decisionRef: string;        // the ratifying record
  deprecatedAt: number;
  retiredAt?: number;
}

export type DeprecateOutcome =
  | { ok: true; row: LifecycleRow; flagged: DependentRef[] }
  | { ok: false; code: string; sentence: string };

export type UseOutcome =
  | { ok: true; routed: "direct"; state: LifecycleState }
  | { ok: true; routed: "shim"; shim: MigrationShim; badge: string }
  | { ok: false; code: string; sentence: string; successor?: string };

export interface DeprecateSpec {
  capability: string;
  successor?: string;            // omit-and-no-"none" → CAP_DEPRECATE_WITHOUT_SUCCESSOR
  census: DependentRef[];        // the vault-cited dependents (may be empty — but must be CITED, i.e. the array must be present)
  censusCited: boolean;          // false when the caller skipped the census step
  decisionRef: string;
  now: number;
  sunsetAfterMs?: number;        // the migration window length (default 90d)
}

/**
 * THE deprecation ceremony (D-435). Census-first (the dependents are counted
 * from the vault BEFORE ratification), successor-named (or explicit none),
 * shim-windowed. Pure over the spec.
 */
export function deprecate(spec: DeprecateSpec): DeprecateOutcome {
  if (typeof spec.capability !== "string" || spec.capability.length === 0) {
    return { ok: false, code: CAP_DEPRECATE_CENSUS_UNCITED, sentence: `${CAP_DEPRECATE_CENSUS_UNCITED}: capability must be a non-empty string (D-435)` };
  }
  if (!spec.censusCited) {
    return {
      ok: false,
      code: CAP_DEPRECATE_CENSUS_UNCITED,
      sentence: `${CAP_DEPRECATE_CENSUS_UNCITED}: the dependents census was not taken — count them from the vault BEFORE ratifying the deprecation, or the door vanishes on someone (D-435, Ω-3.5)`,
    };
  }
  if (spec.successor === undefined || spec.successor.length === 0) {
    return {
      ok: false,
      code: CAP_DEPRECATE_WITHOUT_SUCCESSOR,
      sentence: `${CAP_DEPRECATE_WITHOUT_SUCCESSOR}: ${spec.capability} deprecates without a successor and without an explicit "none" — name the road forward or declare honestly that there is none (D-435, Ω-3.5)`,
    };
  }
  const sunsetAfter = spec.sunsetAfterMs ?? 90 * 24 * 60 * 60 * 1000;
  const censusDigest = sha256Hex(canonicalJson({ capability: spec.capability, dependents: spec.census }));
  const row: LifecycleRow = {
    capability: spec.capability,
    state: "deprecated",
    successor: spec.successor,
    dependents: spec.census,
    censusDigest,
    ...(spec.census.length > 0
      ? { migrationShim: { shimId: `shim:${spec.capability}:${censusDigest.slice(0, 8)}`, badge: "GEN_SPECULATIVE" as const, expiresAt: spec.now + sunsetAfter, decisionRef: spec.decisionRef } }
      : {}),
    sunsetAt: spec.now + sunsetAfter,
    decisionRef: spec.decisionRef,
    deprecatedAt: spec.now,
  };
  return { ok: true, row, flagged: spec.census };
}

/**
 * THE use gate (D-435): active → direct; deprecated pre-sunset with a shim →
 * routed with the badge; post-sunset → CAP_SUNSET_BREACH naming the successor.
 */
export function useCapability(row: LifecycleRow | null, capability: string, now: number): UseOutcome {
  if (row === null || row.capability !== capability || row.state === "retired") {
    return { ok: true, routed: "direct", state: row?.state ?? "active" };
  }
  if (row.state === "active") return { ok: true, routed: "direct", state: "active" };
  // deprecated or sunset: the sunset clock decides
  if (row.sunsetAt !== undefined && now >= row.sunsetAt) {
    return {
      ok: false,
      code: CAP_SUNSET_BREACH,
      successor: row.successor,
      sentence: `${CAP_SUNSET_BREACH}: ${capability} sunset at ${row.sunsetAt} — use is refused with directions: migrate to ${row.successor === "none" ? "nothing (the capability was declared terminal — remove the dependency)" : row.successor}${row.migrationShim ? ` (the shim window closed; a NEW shim requires a NEW decision record)` : ""} (D-435, Ω-3.5)`,
    };
  }
  if (row.migrationShim !== undefined) {
    if (now >= row.migrationShim.expiresAt) {
      return {
        ok: false,
        code: CAP_SHIM_EXPIRED,
        sentence: `${CAP_SHIM_EXPIRED}: the migration shim ${row.migrationShim.shimId} for ${capability} expired at ${row.migrationShim.expiresAt} — extension requires a NEW decision record citing it, never a quiet date bump (D-435, Ω-3.5)`,
      };
    }
    return { ok: true, routed: "shim", shim: row.migrationShim, badge: row.migrationShim.badge };
  }
  return { ok: true, routed: "direct", state: row.state };
}

export interface ExtendShimOutcome {
  ok: boolean;
  code?: string;
  sentence?: string;
  shim?: MigrationShim;
}

/** Shim extension: mechanically requires a NEW decision record (a different
 *  decisionRef citing the expiring shim). A date bump alone refuses. */
export function extendShim(row: LifecycleRow, newDecisionRef: string, extendMs: number, now: number): ExtendShimOutcome {
  if (row.migrationShim === undefined) {
    return { ok: false, code: CAP_SHIM_EXPIRED, sentence: `${CAP_SHIM_EXPIRED}: ${row.capability} has no shim to extend (D-435)` };
  }
  if (typeof newDecisionRef !== "string" || newDecisionRef.length === 0 || newDecisionRef === row.migrationShim.decisionRef) {
    return {
      ok: false,
      code: CAP_SHIM_EXPIRED,
      sentence: `${CAP_SHIM_EXPIRED}: extending shim ${row.migrationShim.shimId} requires a NEW decision record — the same record cannot authorize two windows (got ${JSON.stringify(newDecisionRef)}) (D-435, Ω-3.5)`,
    };
  }
  const shim: MigrationShim = { ...row.migrationShim, expiresAt: now + extendMs, decisionRef: newDecisionRef };
  return { ok: true, shim };
}

/** The lifecycle read: the honest view (ns capability.lifecycle rows). */
export function lifecycleView(row: LifecycleRow): Record<string, unknown> {
  return {
    capability: row.capability,
    state: row.state,
    successor: row.successor,
    dependents: row.dependents.length,
    censusDigest: row.censusDigest,
    ...(row.migrationShim !== undefined ? { shim: row.migrationShim.shimId, shimExpires: row.migrationShim.expiresAt } : {}),
    ...(row.sunsetAt !== undefined ? { sunsetAt: row.sunsetAt } : {}),
    decisionRef: row.decisionRef,
    deprecatedAt: row.deprecatedAt,
  };
}
