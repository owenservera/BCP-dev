// vivim.law — conflict.ts
// D-433 (Ω-2.5, spec `D-434`): the policy lattice — every conflict resolves by
// explicit precedence with most-restrictive at the tie; a contradiction the
// lattice cannot resolve is a PARADOX, first-class, refusing loudly with both
// rule ids in the sentence — never a coin-flip that executes quietly.
//
// The law may not contradict itself. This module is the resolution semantics:
//   precedenceClass  constitutional > statutory > grant > advisory
//   in-class         most-restrictive (deny > constrain > allow)
//   constraints      compose by intersection; an empty intersection is a paradox
//   constitutional   allow+deny in direct opposition is a paradox (the
//                    constitution may not contradict itself; lower classes
//                    resolve deny-overrides-allow and are ledgered resolved)
//   no applicable    deny — fail-closed, the most-restrictive default
//
// LOUD FAILURE BY CONSTRUCTION (F-LAW-COHERENCE.6): this module contains ZERO
// catch blocks and ZERO console writes. The resolution path is pure — every
// branch either resolves, returns a typed paradox, or the store refused the
// malformed row at its door with a named error (LAW_POLICY_ROW_INVALID) before
// it could ever reach resolution. Anomalies are named refusals or ledgered
// paradox rows; warn-and-continue is unexpressible here. The port-call layer
// (index.ts) owns the retries and the loud skips — the same import-safe split
// forbidden.ts established.
//
// Append-only supersession: an amendment row names its target via `supersedes`;
// the active view DERIVES `supersededBy` by replay — the old row is never
// edited. The amendment chain is history, and history is append-only.
import { createHash } from "node:crypto";

// ---- the row (D-433: policy is DATA, never switch statements) -------------

export type PrecedenceClass = "constitutional" | "statutory" | "grant" | "advisory";
export type PolicyEffect = "allow" | "deny" | "constrain";

/** constitutional (4) > statutory (3) > grant (2) > advisory (1). */
export const CLASS_RANK: Record<PrecedenceClass, number> = {
  constitutional: 4, statutory: 3, grant: 2, advisory: 1,
};
/** deny (3) > constrain (2) > allow (1) — most-restrictive at the tie. */
export const EFFECT_RANK: Record<PolicyEffect, number> = {
  deny: 3, constrain: 2, allow: 1,
};
export const PRECEDENCE_CLASSES: PrecedenceClass[] = ["constitutional", "statutory", "grant", "advisory"];
export const POLICY_EFFECTS: PolicyEffect[] = ["allow", "deny", "constrain"];

/** Typed constraint payload: windows intersect pairwise, caps by min, floors by max. */
export interface PolicyConstraint {
  /** time-of-day execution windows "HH:MM-HH:MM" — the op may run only inside EVERY row's window */
  windows?: string[];
  /** rate cap per minute — constraints intersect by MIN */
  rateCapPerMin?: number;
  /** retention floor in days — constraints intersect by MAX */
  retentionFloorDays?: number;
}

/** One policy row. `supersededBy` is DERIVED by replay (activeView), never stored on the old row. */
export interface PolicyRow {
  id: string;
  principal: string;             // exact principal or "*"
  precedenceClass: PrecedenceClass;
  scope: string;                 // op mask: exact ("vault.append@1"), prefix ("vault.*"), or "*"
  effect: PolicyEffect;
  constraint?: PolicyConstraint;
  supersedes?: string;           // append-only input: the row this one replaces
  supersededBy?: string;         // derived: the row that replaced this one
}

// ---- the refusal register (D-433: sentences verbatim from the spec) --------

export const LAW_POLICY_PARADOX = "LAW_POLICY_PARADOX";
export const LAW_CONFLICT_UNRESOLVED = "LAW_CONFLICT_UNRESOLVED";

/** The paradox sentence — names BOTH rule ids and the scope. */
export function paradoxSentence(policyA: string, policyB: string, scope: string): string {
  return `Your rules ${policyA} and ${policyB} contradict each other in scope ${scope} and the law refuses to guess; amend one and the scope unblocks.`;
}

export const CONFLICT_UNRESOLVED_SENTENCE =
  "This scope is blocked by an unresolved policy paradox; the law does not execute where it disagrees with itself.";

// ---- canonical serialization (replayable inputHash pins the scanned bytes) --

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const rec = value as Record<string, unknown>;
  return `{${Object.keys(rec).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(rec[k])}`).join(",")}}`;
}

export function sha256Hex(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

// ---- scope + constraint algebra (pure) --------------------------------------

/** Does `pattern` (exact | prefix-* | *) match the op id? Same idiom as policy.ts. */
export function scopeMatches(pattern: string, op: string): boolean {
  if (pattern === "*" || pattern === op) return true;
  if (pattern.endsWith("*")) return op.startsWith(pattern.slice(0, -1));
  return false;
}

/** Can two scopes ever select a common operation? (Over-approximation for prefix globs.) */
export function scopeOverlaps(a: string, b: string): boolean {
  if (a === "*" || b === "*" || a === b) return true;
  if (a.endsWith("*") && b.endsWith("*")) {
    const ap = a.slice(0, -1); const bp = b.slice(0, -1);
    return ap.startsWith(bp) || bp.startsWith(ap);
  }
  if (a.endsWith("*")) return scopeMatches(a, b);
  if (b.endsWith("*")) return scopeMatches(b, a);
  return false;
}

/** The shared scope of a pair: the more specific mask, deterministically. */
export function pairScope(a: string, b: string): string {
  if (a === b) return a;
  if (a === "*") return b;
  if (b === "*") return a;
  // both non-wildcard and overlapping: the longer (more specific) literal wins
  return a.length >= b.length ? a : b;
}

/** A probe op id that both scopes of an interacting pair match (for symbolic evaluation). */
export function probeOp(a: string, b: string): string {
  if (!a.endsWith("*") && a !== "*") return a;
  if (!b.endsWith("*") && b !== "*") return b;
  const longer = a.replace(/\*$/, "").length >= b.replace(/\*$/, "").length ? a : b;
  return `${longer.replace(/\*$/, "")}probe`;
}

export function principalsCompatible(a: string, b: string): boolean {
  return a === b || a === "*" || b === "*";
}

/** Parse "HH:MM-HH:MM" into [fromMin, toMin). Throws LAW_POLICY_ROW_INVALID on malformed. */
export function parseWindow(w: string): [number, number] {
  const m = /^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/.exec(w);
  if (!m) throw new Error(`LAW_POLICY_ROW_INVALID: constraint window "${w}" is not HH:MM-HH:MM`);
  const from = Number(m[1]) * 60 + Number(m[2]);
  const to = Number(m[3]) * 60 + Number(m[4]);
  if (from >= to) throw new Error(`LAW_POLICY_ROW_INVALID: constraint window "${w}" is empty (from must precede to)`);
  return [from, to];
}

function fmtWindow(w: [number, number]): string {
  const p = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
  return `${p(w[0])}-${p(w[1])}`;
}

export interface ConstraintFold {
  constraint: PolicyConstraint;
  empty: boolean;
  clashA?: string;   // the row whose window the fold carried when it emptied
  clashB?: string;   // the row that emptied it
}

/** Intersect constraints across rows (input order — callers pass id-sorted rows).
 *  Windows intersect pairwise; an empty result names the two clashing rows.
 *  rateCapPerMin takes the MIN; retentionFloorDays takes the MAX. */
export function intersectConstraints(rows: PolicyRow[]): ConstraintFold {
  let windows: Array<[number, number]> | null = null;
  let lastContributor: string | null = null;
  let rateCapPerMin: number | undefined;
  let retentionFloorDays: number | undefined;
  for (const r of rows) {
    const c = r.constraint;
    if (!c) continue;
    if (c.windows !== undefined) {
      const parsed = c.windows.map(parseWindow);
      if (windows === null) {
        windows = parsed;
        lastContributor = r.id;
      } else {
        const next: Array<[number, number]> = [];
        for (const a of windows) for (const b of parsed) {
          const from = Math.max(a[0], b[0]);
          const to = Math.min(a[1], b[1]);
          if (from < to) next.push([from, to]);
        }
        if (next.length === 0) {
          return {
            constraint: { windows: [] }, empty: true,
            clashA: lastContributor ?? r.id, clashB: r.id,
          };
        }
        windows = next;
        lastContributor = r.id;
      }
    }
    if (typeof c.rateCapPerMin === "number") {
      rateCapPerMin = rateCapPerMin === undefined ? c.rateCapPerMin : Math.min(rateCapPerMin, c.rateCapPerMin);
    }
    if (typeof c.retentionFloorDays === "number") {
      retentionFloorDays = retentionFloorDays === undefined ? c.retentionFloorDays : Math.max(retentionFloorDays, c.retentionFloorDays);
    }
  }
  const out: PolicyConstraint = {};
  if (windows !== null) out.windows = windows.map(fmtWindow);
  if (rateCapPerMin !== undefined) out.rateCapPerMin = rateCapPerMin;
  if (retentionFloorDays !== undefined) out.retentionFloorDays = retentionFloorDays;
  return { constraint: out, empty: false };
}

// ---- the lattice (total, deterministic, pure) -------------------------------

export interface LatticeParadox {
  kind: "paradox";
  code: typeof LAW_POLICY_PARADOX;
  sentence: string;
  policyA: string;
  policyB: string;
  scope: string;
  walk: string[];
}

export interface LatticeResolved {
  kind: "resolved";
  effect: PolicyEffect;
  constraint?: PolicyConstraint;
  precedenceApplied: PrecedenceClass | "none";
  reason: string;
  walk: string[];
  applicable: string[];
}

export type LatticeOutcome = LatticeParadox | LatticeResolved;

/** Rows made inactive by a `supersedes` pointer (derived, never stored). */
export function supersededIds(rows: PolicyRow[]): Set<string> {
  const out = new Set<string>();
  for (const r of rows) if (r.supersedes !== undefined) out.add(r.supersedes);
  return out;
}

/** The applicable rows for a gated operation: principal exact-or-*, scope match, not superseded. */
export function applicableRows(rows: PolicyRow[], target: { principal: string; op: string }): PolicyRow[] {
  const dead = supersededIds(rows);
  return rows
    .filter((r) => !dead.has(r.id) && principalsCompatible(r.principal, target.principal) && scopeMatches(r.scope, target.op))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/**
 * THE resolution (D-433). A pure function of the row set: order-independent
 * (applicable rows are id-sorted before anything else is decided), total
 * (every input yields a resolved verdict or a typed paradox), and replayable
 * (the walk records each precedence decision as a sentence).
 */
export function resolveLattice(rows: PolicyRow[], target: { principal: string; op: string }): LatticeOutcome {
  const applicable = applicableRows(rows, target);
  const walk: string[] = [];
  if (applicable.length === 0) {
    walk.push(`no applicable policy rows for principal ${target.principal} op ${target.op} — fail-closed: deny (the most-restrictive default)`);
    return { kind: "resolved", effect: "deny", precedenceApplied: "none", reason: "no applicable policy rows — fail-closed deny", walk, applicable: [] };
  }
  const topClass = applicable.reduce((best, r) => (CLASS_RANK[r.precedenceClass] > CLASS_RANK[best.precedenceClass] ? r : best), applicable[0]!).precedenceClass;
  const top = applicable.filter((r) => r.precedenceClass === topClass);
  const lower = applicable.filter((r) => r.precedenceClass !== topClass);
  walk.push(`applicable rows (id-sorted): ${applicable.map((r) => r.id).join(", ")}`);
  if (lower.length > 0) {
    walk.push(`class precedence: ${topClass} decides; ${[...new Set(lower.map((r) => r.precedenceClass))].join(", ")} never reached (superseded by precedence, recorded not applied)`);
  } else {
    walk.push(`class precedence: ${topClass} is the highest surviving class`);
  }
  // paradox state 1 — constitutional allow+deny in direct opposition
  if (topClass === "constitutional") {
    const allow = top.find((r) => r.effect === "allow");
    const deny = top.find((r) => r.effect === "deny");
    if (allow !== undefined && deny !== undefined) {
      const [a, b] = [allow.id, deny.id].sort();
      const sentence = paradoxSentence(a, b, target.op);
      walk.push(`paradox: ${a} (allow) and ${b} (deny) are both constitutional and directly opposed — the constitution may not contradict itself`);
      walk.push(`verdict: PARADOX — ${sentence}`);
      return { kind: "paradox", code: LAW_POLICY_PARADOX, sentence, policyA: a, policyB: b, scope: target.op, walk };
    }
  }
  // constraints intersect; an empty intersection is a paradox naming the clash
  const fold = intersectConstraints(top);
  if (fold.empty) {
    const [a, b] = [fold.clashA ?? top[0]!.id, fold.clashB ?? top[0]!.id].sort();
    const sentence = paradoxSentence(a, b, target.op);
    walk.push(`paradox: constraints of ${a} and ${b} intersect to nothing — narrowing is the only safe direction, and nothing is narrower than nothing`);
    walk.push(`verdict: PARADOX — ${sentence}`);
    return { kind: "paradox", code: LAW_POLICY_PARADOX, sentence, policyA: a, policyB: b, scope: target.op, walk };
  }
  // most-restrictive effect within the surviving class
  const effect = top.reduce((worst, r) => (EFFECT_RANK[r.effect] > EFFECT_RANK[worst.effect] ? r : worst), top[0]!).effect;
  const effects = [...new Set(top.map((r) => r.effect))];
  walk.push(`in-class composition: ${effects.join(" + ")} → ${effect} (most-restrictive at the tie${topClass === "constitutional" ? "" : "; deny overrides allow"})`);
  const hasConstraints = Object.keys(fold.constraint).length > 0;
  if (hasConstraints) {
    walk.push(`constraints intersected: ${canonicalJson(fold.constraint)}`);
  }
  const reason = hasConstraints
    ? `${effect} under ${topClass} (constraints intersected)`
    : `${effect} under ${topClass} (${effects.length > 1 ? "most-restrictive at the tie" : "unopposed"})`;
  walk.push(`verdict: ${reason}`);
  return {
    kind: "resolved", effect,
    ...(hasConstraints ? { constraint: fold.constraint } : {}),
    precedenceApplied: topClass, reason, walk, applicable: applicable.map((r) => r.id),
  };
}

/** The gate-facing fold of the lattice: what law.check@1 does with the row layer.
 *  `engaged: false` when no rows apply (the lattice layer stays silent — the
 *  baseline policy walk decides, byte-identical to the pre-D-433 gate). */
export interface GateVerdict {
  engaged: boolean;
  effect: PolicyEffect;
  reason: string;
  paradox?: { code: typeof LAW_CONFLICT_UNRESOLVED; sentence: string; policyA: string; policyB: string; paradoxSentence: string };
}

export function gateVerdict(rows: PolicyRow[], target: { principal: string; op: string }): GateVerdict {
  const outcome = resolveLattice(rows, target);
  if (outcome.kind === "paradox") {
    return {
      engaged: true, effect: "deny",
      reason: `${LAW_CONFLICT_UNRESOLVED} — ${CONFLICT_UNRESOLVED_SENTENCE} (${outcome.policyA} vs ${outcome.policyB}: ${outcome.sentence})`,
      paradox: {
        code: LAW_CONFLICT_UNRESOLVED, sentence: CONFLICT_UNRESOLVED_SENTENCE,
        policyA: outcome.policyA, policyB: outcome.policyB, paradoxSentence: outcome.sentence,
      },
    };
  }
  if (outcome.precedenceApplied === "none") {
    return { engaged: false, effect: "deny", reason: outcome.reason };
  }
  return { engaged: true, effect: outcome.effect, reason: outcome.reason };
}

// ---- the conflict scan (symbolic, pairwise, replayable) ---------------------

export interface ConflictPairRow {
  kind: "conflict.resolved@1";
  policyA: string;
  policyB: string;
  resolution: string;
  precedenceApplied: PrecedenceClass | "none";
  scannedAt: number;
  inputHash: string;
}

export interface ParadoxPairRow {
  kind: "conflict.paradox@1";
  policyA: string;
  policyB: string;
  scope: string;
  sentence: string;
  blockedUntil: "amended";
  inputHash: string;
}

export type PairOutcome =
  | { interact: false }
  | { interact: true; paradox: ParadoxPairRow }
  | { interact: true; resolved: ConflictPairRow };

/** Symbolically evaluate ONE pair (pure — the falsifier replays this 1,000 × 100). */
export function resolvePair(a: PolicyRow, b: PolicyRow, scannedAt = 0): PairOutcome {
  if (!principalsCompatible(a.principal, b.principal) || !scopeOverlaps(a.scope, b.scope)) {
    return { interact: false };
  }
  const scope = pairScope(a.scope, b.scope);
  const pair = a.id < b.id ? [stripDerived(a), stripDerived(b)] : [stripDerived(b), stripDerived(a)];
  const inputHash = sha256Hex(canonicalJson(pair));
  const target = { principal: a.principal === "*" ? b.principal : a.principal, op: probeOp(a.scope, b.scope) };
  const outcome = resolveLattice([a, b], target);
  if (outcome.kind === "paradox") {
    return {
      interact: true,
      paradox: {
        kind: "conflict.paradox@1", policyA: outcome.policyA, policyB: outcome.policyB,
        scope, sentence: outcome.sentence, blockedUntil: "amended", inputHash,
      },
    };
  }
  const sameClass = a.precedenceClass === b.precedenceClass;
  const resolution = sameClass
    ? `${outcome.effect} (${[...new Set([a.effect, b.effect])].length > 1 ? "in-class most-restrictive: deny overrides allow, constrain narrows" : "effects agree"})`
    : `${outcome.effect} (class precedence: ${a.precedenceClass === outcome.precedenceApplied ? a.precedenceClass : b.precedenceClass} over ${a.precedenceClass === outcome.precedenceApplied ? b.precedenceClass : a.precedenceClass})`;
  return {
    interact: true,
    resolved: {
      kind: "conflict.resolved@1", policyA: a.id < b.id ? a.id : b.id, policyB: a.id < b.id ? b.id : a.id,
      resolution, precedenceApplied: outcome.precedenceApplied, scannedAt, inputHash,
    },
  };
}

function stripDerived(r: PolicyRow): Omit<PolicyRow, "supersededBy"> {
  const { supersededBy: _drop, ...rest } = r;
  return rest;
}

export interface ConflictScanResult {
  pairs: number;
  resolved: ConflictPairRow[];
  paradox: ParadoxPairRow[];
  /** any paradox makes the scan itself a refusal (LAW_POLICY_PARADOX) */
  refused: boolean;
  refusedWith?: typeof LAW_POLICY_PARADOX;
  inputHash: string;
}

/** The full coherence sweep: every interacting pair of the ACTIVE set, symbolically. */
export function scanConflicts(rows: PolicyRow[], scannedAt = 0): ConflictScanResult {
  const active = activeView(rows).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const resolved: ConflictPairRow[] = [];
  const paradox: ParadoxPairRow[] = [];
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const out = resolvePair(active[i]!, active[j]!, scannedAt);
      if (!out.interact) continue;
      if ("paradox" in out) paradox.push(out.paradox);
      else resolved.push(out.resolved);
    }
  }
  return {
    pairs: resolved.length + paradox.length,
    resolved, paradox,
    refused: paradox.length > 0,
    ...(paradox.length > 0 ? { refusedWith: LAW_POLICY_PARADOX as const } : {}),
    inputHash: sha256Hex(canonicalJson(active.map(stripDerived))),
  };
}

/** The stable identity of a conflict row: pair + the input bytes it scanned. */
export function conflictRowId(row: ConflictPairRow | ParadoxPairRow): string {
  const kind = row.kind === "conflict.resolved@1" ? "conflict-resolved" : "conflict-paradox";
  return `${kind}:${row.policyA}--${row.policyB}:${row.inputHash.slice(0, 16)}`;
}

export function pairKey(row: ParadoxPairRow): string {
  return `${row.policyA}|${row.policyB}`;
}

// ---- the explain walk (deterministic replay) --------------------------------

export interface ExplainResult {
  principal: string;
  op: string;
  steps: string[];
  outcome: LatticeOutcome;
}

/** Why did this operation resolve this way? Re-execution, not archaeology:
 *  the same row set + the same target replays the same walk byte-for-byte. */
export function explainResolution(rows: PolicyRow[], target: { principal: string; op: string }): ExplainResult {
  const outcome = resolveLattice(rows, target);
  const dead = supersededIds(rows);
  const superseded = rows.filter((r) => dead.has(r.id)).sort((a, b) => (a.id < b.id ? -1 : 1));
  const steps: string[] = [
    `explain law.conflict for principal ${target.principal} op ${target.op} over ${rows.length} row(s)`,
  ];
  if (superseded.length > 0) {
    steps.push(`superseded (derived by replay, never edited): ${superseded.map((r) => `${r.id} ← ${r.supersededBy}`).join(", ")}`);
  }
  steps.push(...outcome.walk);
  return { principal: target.principal, op: target.op, steps, outcome };
}

// ---- the append-only row store ----------------------------------------------

/** Validate + normalize one row. Throws LAW_POLICY_ROW_INVALID / _DUPLICATE —
 *  the named refusals at the store door; a malformed row never reaches
 *  resolution (the loud-failure law). */
export function validateRow(row: unknown): PolicyRow {
  if (row === null || typeof row !== "object" || Array.isArray(row)) {
    throw new Error("LAW_POLICY_ROW_INVALID: row must be an object");
  }
  const r = row as Record<string, unknown>;
  const id = requireNonEmpty(r["id"], "id");
  const principal = requireNonEmpty(r["principal"], "principal");
  const precedenceClass = r["precedenceClass"];
  if (typeof precedenceClass !== "string" || !PRECEDENCE_CLASSES.includes(precedenceClass as PrecedenceClass)) {
    throw new Error(`LAW_POLICY_ROW_INVALID: precedenceClass must be one of ${PRECEDENCE_CLASSES.join("|")} (got ${JSON.stringify(precedenceClass)})`);
  }
  const scope = requireNonEmpty(r["scope"], "scope");
  if (/\s/.test(scope)) throw new Error(`LAW_POLICY_ROW_INVALID: scope "${scope}" contains whitespace`);
  const effect = r["effect"];
  if (typeof effect !== "string" || !POLICY_EFFECTS.includes(effect as PolicyEffect)) {
    throw new Error(`LAW_POLICY_ROW_INVALID: effect must be one of ${POLICY_EFFECTS.join("|")} (got ${JSON.stringify(effect)})`);
  }
  let constraint: PolicyConstraint | undefined;
  if (r["constraint"] !== undefined) {
    const c = r["constraint"];
    if (c === null || typeof c !== "object" || Array.isArray(c)) {
      throw new Error("LAW_POLICY_ROW_INVALID: constraint must be an object");
    }
    const cc = c as Record<string, unknown>;
    constraint = {};
    if (cc["windows"] !== undefined) {
      if (!Array.isArray(cc["windows"]) || cc["windows"].length === 0 || !cc["windows"].every((w) => typeof w === "string")) {
        throw new Error("LAW_POLICY_ROW_INVALID: constraint.windows must be a non-empty array of HH:MM-HH:MM strings");
      }
      constraint.windows = (cc["windows"] as string[]).map(parseWindow).map(fmtWindow); // parse throws on malformed
    }
    if (cc["rateCapPerMin"] !== undefined) {
      if (typeof cc["rateCapPerMin"] !== "number" || !Number.isFinite(cc["rateCapPerMin"]) || cc["rateCapPerMin"] <= 0) {
        throw new Error("LAW_POLICY_ROW_INVALID: constraint.rateCapPerMin must be a positive number");
      }
      constraint.rateCapPerMin = cc["rateCapPerMin"];
    }
    if (cc["retentionFloorDays"] !== undefined) {
      if (typeof cc["retentionFloorDays"] !== "number" || !Number.isFinite(cc["retentionFloorDays"]) || cc["retentionFloorDays"] < 0) {
        throw new Error("LAW_POLICY_ROW_INVALID: constraint.retentionFloorDays must be a non-negative number");
      }
      constraint.retentionFloorDays = cc["retentionFloorDays"];
    }
  }
  let supersedes: string | undefined;
  if (r["supersedes"] !== undefined) {
    supersedes = requireNonEmpty(r["supersedes"], "supersedes");
  }
  if ("supersededBy" in r) {
    throw new Error("LAW_POLICY_ROW_INVALID: supersededBy is DERIVED by replay — never hand-authored, never stored on the old row (the amendment chain is append-only)");
  }
  return {
    id, principal, precedenceClass: precedenceClass as PrecedenceClass, scope,
    effect: effect as PolicyEffect,
    ...(constraint !== undefined ? { constraint } : {}),
    ...(supersedes !== undefined ? { supersedes } : {}),
  };
}

function requireNonEmpty(v: unknown, field: string): string {
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`LAW_POLICY_ROW_INVALID: ${field} must be a non-empty string (got ${JSON.stringify(v)})`);
  }
  return v;
}

/** Parse a vault record into a row (throws on malformed — the reload logs loudly and counts). */
export function fromVaultRecord(data: unknown): PolicyRow {
  return validateRow(data);
}

/** The pure record mapping for the vault (append-only history, D-325 idiom). */
export function toVaultRecord(row: PolicyRow): Omit<PolicyRow, "supersededBy"> {
  return stripDerived(row);
}

/** The active view: supersededBy derived by replay, id-sorted. */
export function activeView(rows: PolicyRow[]): PolicyRow[] {
  const dead = supersededIds(rows);
  const killer = new Map<string, string>();
  for (const r of rows) if (r.supersedes !== undefined && !dead.has(r.id)) killer.set(r.supersedes, r.id);
  return rows
    .filter((r) => !dead.has(r.id))
    .map((r) => ({ ...r, ...(killer.has(r.id) ? { supersededBy: killer.get(r.id)! } : {}) }))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/**
 * The row store. Memory-first (the forbidden-overlay posture): the LIVE writer
 * is the amendment ceremony (policy.amend@1 — which refuses paradox-creating
 * amendments and rolls back); the RESTORE writer is the boot reload (vault
 * history may carry paradoxes — they arrive loudly and block, they are never
 * silently dropped). Persistence lives in index.ts (the port-call layer).
 */
export class PolicyRowStore {
  private rows = new Map<string, PolicyRow>();
  private lastAppended: string | null = null;

  /** Append a validated row. Throws LAW_POLICY_ROW_DUPLICATE / _AMEND_TARGET_UNKNOWN. */
  append(row: PolicyRow): PolicyRow {
    const clean = validateRow(row);
    if (this.rows.has(clean.id)) {
      throw new Error(`LAW_POLICY_ROW_DUPLICATE: a row with id "${clean.id}" already exists (amend it — append a superseding row, never re-use an id)`);
    }
    if (clean.supersedes !== undefined && !this.rows.has(clean.supersedes)) {
      throw new Error(`LAW_POLICY_AMEND_TARGET_UNKNOWN: supersedes "${clean.supersedes}" names no existing row`);
    }
    this.rows.set(clean.id, clean);
    this.lastAppended = clean.id;
    return clean;
  }

  /** The rollback primitive: remove the row the ceremony JUST appended (and nothing else). */
  rollback(id: string): boolean {
    if (this.lastAppended !== id) return false;
    this.rows.delete(id);
    this.lastAppended = null;
    return true;
  }

  get(id: string): PolicyRow | null {
    return this.rows.get(id) ?? null;
  }

  size(): number {
    return this.rows.size;
  }

  list(): PolicyRow[] {
    return [...this.rows.values()].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  }

  /** The resolution input: active rows with supersededBy derived. */
  activeRows(): PolicyRow[] {
    return activeView(this.list());
  }
}
