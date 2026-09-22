// vivim.law — apertureprivacy.ts
// D-451 (Ω-11, spec paper `D-443`, re-materialized): aperture privacy — the
// fence becomes the law. D-379's single-principal fence generalizes from ns
// chat to the whole vault: what may NOT cross the aperture becomes data.
//
// The law of this module:
//   the lattice       open < internal < principal < secret — privacy classes
//                     are vault-schema law, the sibling of retention
//   declarations      ns `privacy`, ids class:<ns>, {ns, class, amendedBy,
//                     at} — append-only amendment history; an UNDECLARED
//                     namespace fails closed to secret (the vault refuses
//                     what it cannot classify)
//   the taint law     a derived row carries max(class of every input row it
//                     cites), verified mechanically at write — a weaker
//                     declared class refuses APERTURE_TAINT_MISMATCH; an
//                     unresolvable citation quarantines via
//                     APERTURE_TAINT_UNVERIFIED (fail-closed to secret)
//   the ratchets      a row may be STRONGER than its namespace, never weaker
//                     (APERTURE_CLASS_WEAKENED); a write may not LOWER an
//                     existing row's taint (APERTURE_RATCHET_WEAKENED)
//   the fence         reader ≠ owner && class ≥ principal → the exact D-379
//                     shape: REFUSED verdict envelope + a refusal row in ns
//                     privacy {target, owner, caller, op, class, at} — never
//                     DEGRADED (that is reserved for broken handlers)
//   the deputy law    the D-328b grammar's additive dataReach field — absent
//                     means none, fail closed (APERTURE_REACH_UNDECLARED);
//                     a declared-but-exceeded ceiling refuses
//                     APERTURE_DEPUTY_OVERREACH; effective = min(dataReach,
//                     the grantor's own lawful view)
//   the export law    secret-class rows never cross (APERTURE_EXPORT_WITH_
//                     SECRETS); principal-class rows only under treaty
//
// LOUD FAILURE BY CONSTRUCTION (F-APERTURE-PRIVACY.7): zero catch blocks,
// zero console writes, zero silent degradation. Every crossing is a verdict +
// row; every taint finding is ledgered, never auto-fixed. The port-call layer
// (index.ts) owns persistence and journaling.
import { createHash } from "node:crypto";

// ---- the sensitivity lattice (open < internal < principal < secret) --------

export type PrivacyClass = "open" | "internal" | "principal" | "secret";
export const PRIVACY_CLASSES: PrivacyClass[] = ["open", "internal", "principal", "secret"];
/** open (1) < internal (2) < principal (3) < secret (4). */
export const CLASS_LATTICE: Record<PrivacyClass, number> = { open: 1, internal: 2, principal: 3, secret: 4 };
/** The fail-closed default: an undeclared namespace is a secret namespace. */
export const FAIL_CLOSED_CLASS: PrivacyClass = "secret";

export function classRank(c: PrivacyClass): number {
  return CLASS_LATTICE[c];
}

/** The stronger (higher-lattice) of two classes — the taint fold's max. */
export function maxClass(a: PrivacyClass, b: PrivacyClass): PrivacyClass {
  return CLASS_LATTICE[a] >= CLASS_LATTICE[b] ? a : b;
}

/** min by LATTICE RANK = the lesser reach (the deputy ceiling fold). */
export function minClass(a: PrivacyClass, b: PrivacyClass): PrivacyClass {
  return CLASS_LATTICE[a] <= CLASS_LATTICE[b] ? a : b;
}

// ---- the refusal register (D-451: sentences verbatim from the spec) --------

export const APERTURE_CROSS_PRINCIPAL = "APERTURE_CROSS_PRINCIPAL";
export const APERTURE_DEPUTY_OVERREACH = "APERTURE_DEPUTY_OVERREACH";
export const APERTURE_DERIVED_LEAK = "APERTURE_DERIVED_LEAK";
export const APERTURE_CLASS_UNKNOWN = "APERTURE_CLASS_UNKNOWN";
export const APERTURE_CLASS_WEAKENED = "APERTURE_CLASS_WEAKENED";
export const APERTURE_TAINT_MISMATCH = "APERTURE_TAINT_MISMATCH";
export const APERTURE_TAINT_UNVERIFIED = "APERTURE_TAINT_UNVERIFIED";
export const APERTURE_RATCHET_WEAKENED = "APERTURE_RATCHET_WEAKENED";
export const APERTURE_REACH_UNDECLARED = "APERTURE_REACH_UNDECLARED";
export const APERTURE_EXPORT_WITH_SECRETS = "APERTURE_EXPORT_WITH_SECRETS";
// store-door errors (the LAW_POLICY_ROW_INVALID class — named, at the door)
export const APERTURE_CLASS_ROW_INVALID = "APERTURE_CLASS_ROW_INVALID";
export const APERTURE_CLASS_DUPLICATE = "APERTURE_CLASS_DUPLICATE";
export const APERTURE_AMEND_TARGET_UNKNOWN = "APERTURE_AMEND_TARGET_UNKNOWN";

export function crossPrincipalSentence(cls: PrivacyClass, owner: string, caller: string): string {
  return `This row is ${cls}-class and its owner is ${owner}; the caller is ${caller}. The fence refuses — as a verdict, on the ledger, naming both principals.`;
}
export const DEPUTY_OVERREACH_SENTENCE =
  "The deputy's delegated data reach does not cover this class; working for someone is not seeing like them.";
export const DERIVED_LEAK_SENTENCE =
  "A derived row carries a class weaker than one of its inputs; privacy cannot be laundered through a fold, and the write is refused.";
export const CLASS_UNKNOWN_SENTENCE =
  "No privacy class governs this namespace; unclassifiable data is unreadable data — declare the class or the fence holds.";
export const CLASS_WEAKENED_SENTENCE =
  "A row attempted to weaken its namespace's class; classes ratchet up, never down.";
export const TAINT_UNVERIFIED_SENTENCE =
  "A derived row's class cannot be verified against its cited inputs; the finding is ledgered and the row quarantined from further reads.";
export const RATCHET_WEAKENED_SENTENCE =
  "A write may not lower a row's taint; the strengthen-only ratchet holds — classes ratchet up, never down.";
export const REACH_UNDECLARED_SENTENCE =
  "The delegation envelope declares no data reach; working for someone is not seeing like them — the deputy's reach is none, fail closed.";
export const EXPORT_WITH_SECRETS_SENTENCE =
  "The export carries secret-class rows; you may share the machine, never the secrets (§16).";

/** The D-379 verdict envelope, generalized: ok:true at the port boundary
 *  carrying the REFUSED verdict + the ledger ref — a policy refusal is a
 *  verdict, not a failure (DEGRADED is for broken handlers). */
export interface RefusedEnvelope {
  refused: true;
  error: "REFUSED";
  op: string;
  detail: string;
  code: string;
  ledgered: true;
  ledgerRef: { ns: string; id: string; rev: number };
}

// ---- the class rows (ns privacy, ids class:<ns>, append-only amendment) ----

export interface PrivacyClassRow {
  id: string;                 // "class:<ns>" — derived, never authored
  ns: string;
  class: PrivacyClass;
  amendedBy?: string;         // the principal that appended this amendment
  at: number;
  supersedes?: string;        // append-only input: the row this one replaces
}

export function classRowId(ns: string): string {
  return `class:${ns}`;
}

/** Validate + normalize one class row. Throws APERTURE_CLASS_ROW_INVALID. */
export function validateClassRow(row: unknown): PrivacyClassRow {
  if (row === null || typeof row !== "object" || Array.isArray(row)) {
    throw new Error("APERTURE_CLASS_ROW_INVALID: row must be an object");
  }
  const r = row as Record<string, unknown>;
  const ns = reqStr(r["ns"], "ns");
  const cls = r["class"];
  if (typeof cls !== "string" || !PRIVACY_CLASSES.includes(cls as PrivacyClass)) {
    throw new Error(`APERTURE_CLASS_ROW_INVALID: class must be one of ${PRIVACY_CLASSES.join("|")} (got ${JSON.stringify(cls)})`);
  }
  const at = typeof r["at"] === "number" && Number.isFinite(r["at"]) ? r["at"] : 0;
  const out: PrivacyClassRow = { id: classRowId(ns), ns, class: cls as PrivacyClass, at };
  if (r["amendedBy"] !== undefined) out.amendedBy = reqStr(r["amendedBy"], "amendedBy");
  if (r["supersedes"] !== undefined) out.supersedes = reqStr(r["supersedes"], "supersedes");
  if (r["id"] !== undefined && r["id"] !== out.id) {
    throw new Error(`APERTURE_CLASS_ROW_INVALID: id is DERIVED from ns ("${out.id}"), never authored (got ${JSON.stringify(r["id"])})`);
  }
  return out;
}

function reqStr(v: unknown, field: string): string {
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`APERTURE_CLASS_ROW_INVALID: ${field} must be a non-empty string (got ${JSON.stringify(v)})`);
  }
  return v;
}

export type ClassMap = Map<string, PrivacyClass>;

/** The active class map: amendment history is append-only, so the LATEST
 *  declaration per namespace wins (at, then id) — the active view derives by
 *  replay, never by editing the chain. */
export function activeClassMap(rows: PrivacyClassRow[]): ClassMap {
  const map: ClassMap = new Map();
  for (const r of [...rows].sort((a, b) => a.at - b.at || (a.id < b.id ? -1 : 1))) {
    map.set(r.ns, r.class);
  }
  return map;
}

/** The effective class of a namespace: declared, or the fail-closed secret. */
export function effectiveClass(ns: string, map: ClassMap): PrivacyClass {
  return map.get(ns) ?? FAIL_CLOSED_CLASS;
}

/**
 * The class store (the PolicyRowStore posture): memory-first, append-only
 * amendment history held as the full chain — one live declaration per
 * namespace (the latest), its predecessors superseded in the chain, never
 * edited. A re-declaration of a governed namespace MUST cite the row it
 * amends (supersedes) — the policy.amend@1 discipline.
 */
export class PrivacyClassStore {
  private chain: PrivacyClassRow[] = [];
  private lastAppended: string | null = null;

  append(row: PrivacyClassRow): PrivacyClassRow {
    const clean = validateClassRow(row);
    const governed = this.chain.some((r) => r.ns === clean.ns);
    if (governed && clean.supersedes === undefined) {
      throw new Error(`APERTURE_CLASS_DUPLICATE: ${clean.id} already exists (amend it — append a superseding row citing supersedes, never a bare re-declaration)`);
    }
    if (clean.supersedes !== undefined && !this.chain.some((r) => r.id === clean.supersedes)) {
      throw new Error(`APERTURE_AMEND_TARGET_UNKNOWN: supersedes "${clean.supersedes}" names no existing class row`);
    }
    this.chain.push(clean);
    this.lastAppended = `${clean.id}@${clean.at}`;
    return clean;
  }

  rollback(id: string): boolean {
    if (this.lastAppended !== id) return false;
    this.chain.pop();
    this.lastAppended = null;
    return true;
  }

  classMap(): ClassMap {
    return activeClassMap(this.chain);
  }

  size(): number {
    return this.chain.length;
  }

  list(): PrivacyClassRow[] {
    return [...this.chain].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : a.at - b.at));
  }
}

// ---- the taint law (derived class = max of cited inputs, write-verified) ---

/** A cited input: {ns, id, rev} with the class EXPLICIT (verified evidence)
 *  or resolved from the class map (undeclared → fail-closed secret). */
export interface TaintSource {
  ns: string;
  id: string;
  rev?: number;
  class?: PrivacyClass;
}

export interface TaintFoldResult {
  taint: PrivacyClass;             // max over resolved sources (secret when none resolvable-but-cited? no — max over ALL)
  sources: Array<{ ns: string; id: string; rev?: number; class: PrivacyClass; resolved: "cited" | "declared" | "fail-closed" }>;
  unverified: string[];            // the citations that could not be resolved to a class
}

/** THE taint fold (privacy.taint@1). Pure: explicit cite class > class-map
 *  declaration > fail-closed secret. Unresolvable citations surface in
 *  `unverified` — the audit quarantines them; a fold never widens. */
export function taintFold(cites: TaintSource[], map: ClassMap): TaintFoldResult {
  let taint: PrivacyClass = "open";
  const sources: TaintFoldResult["sources"] = [];
  const unverified: string[] = [];
  for (const c of cites) {
    let cls: PrivacyClass;
    let resolved: "cited" | "declared" | "fail-closed";
    if (c.class !== undefined) {
      cls = c.class;
      resolved = "cited";
    } else if (map.has(c.ns)) {
      cls = map.get(c.ns)!;
      resolved = "declared";
    } else {
      cls = FAIL_CLOSED_CLASS; // undeclared namespace — the vault refuses what it cannot classify
      resolved = "fail-closed";
      unverified.push(`${c.ns}/${c.id}${c.rev !== undefined ? `@${c.rev}` : ""}`);
    }
    taint = maxClass(taint, cls);
    sources.push({ ns: c.ns, id: c.id, ...(c.rev !== undefined ? { rev: c.rev } : {}), class: cls, resolved });
  }
  return { taint, sources, unverified };
}

// ---- the refusal rows (ns privacy — the generalized refusal_* family) ------

export interface RefusalRow {
  kind: "privacy.refusal@1";      // the generalized refusal_* family (D-379's rows grandfathered as the first instance)
  id: string;                     // "refusal:<boot>-<seq>" — assigned by the ledger
  target: string;                 // ns/id of the refused row
  owner: string;
  caller: string;
  op: string;
  class: PrivacyClass;
  code: string;
  at: number;
}

export interface FenceCheckResult {
  verdict: "allow" | "REFUSED";
  code?: string;
  sentence?: string;
  class: PrivacyClass;
  declared: boolean;
  refusalRow?: RefusalRow;
  envelope?: RefusedEnvelope;
  walk: string[];
}

/** The D-328b delegation grammar's additive deputy envelope. dataReach is a
 *  lattice CEILING; absent means NONE over principal/secret — fail closed. */
export interface DeputyEnvelope {
  grantor: string;                        // the resolved reader (the chain's root)
  dataReach?: PrivacyClass;               // the classes the deputy may read on the grantor's behalf
  grantorView?: PrivacyClass;             // the grantor's own lawful view (default secret — their own data)
}

/** The deputy ceiling: min(dataReach, the grantor's own lawful view). An
 *  absent dataReach leaves open+internal only — none over principal/secret. */
export function deputyCeiling(deputy: DeputyEnvelope): PrivacyClass {
  const reach = deputy.dataReach ?? "internal"; // absent = none beyond open+internal
  const view = deputy.grantorView ?? "secret";
  return minClass(reach, view);
}

/** THE universal fence (the read gate). Any read where the resolved reader ≠
 *  the row's owning principal and class ≥ principal refuses with the exact
 *  D-379 shape — verdict + ns-privacy refusal row, never DEGRADED. An
 *  undeclared namespace refuses APERTURE_CLASS_UNKNOWN for EVERY reader
 *  (unclassifiable data is unreadable data — declaring opens it exactly as
 *  declared). Deputies: the ceiling is min(dataReach, grantor view); absent
 *  dataReach is APERTURE_REACH_UNDECLARED, an exceeded ceiling is
 *  APERTURE_DEPUTY_OVERREACH, and cross-principal still fences the grantor. */
export function fenceCheck(
  read: { ns: string; id: string; owner: string; reader: string; class?: PrivacyClass; op?: string },
  map: ClassMap,
  deputy?: DeputyEnvelope,
  now = 0,
): FenceCheckResult {
  const op = read.op ?? "vault.get@1";
  const declared = read.class !== undefined || map.has(read.ns);
  const cls = read.class ?? effectiveClass(read.ns, map);
  const walk: string[] = [`fence ${read.ns}/${read.id}: owner ${read.owner}, reader ${read.reader}, class ${cls}${declared ? "" : " (UNDECLARED — fail-closed)"}`];
  const refuse = (code: string, sentence: string): FenceCheckResult => {
    const refusalRow: RefusalRow = {
      kind: "privacy.refusal@1",
      id: "refusal:", // the ledger assigns the durable id
      target: `${read.ns}/${read.id}`,
      owner: read.owner,
      caller: read.reader,
      op,
      class: cls,
      code,
      at: now,
    };
    walk.push(`verdict: REFUSED ${code} — a verdict, on the ledger, naming both principals`);
    return {
      verdict: "REFUSED", code, sentence, class: cls, declared, refusalRow,
      envelope: {
        refused: true, error: "REFUSED", op, detail: sentence, code,
        ledgered: true, ledgerRef: { ns: "privacy", id: "", rev: 0 }, // the ledger fills the ref
      },
      walk,
    };
  };
  // the fail-closed default: no class row governs this namespace
  if (!declared) {
    walk.push(`no privacy class governs ns "${read.ns}" — unclassifiable data is unreadable data`);
    return refuse(APERTURE_CLASS_UNKNOWN, CLASS_UNKNOWN_SENTENCE);
  }
  // the deputy law — the resolved reader is the chain's root (the grantor):
  // a deputy acting for the OWNER is bounded by the dataReach ceiling only
  if (deputy !== undefined && deputy.grantor === read.owner) {
    if (classRank(cls) >= CLASS_LATTICE.principal && deputy.dataReach === undefined) {
      walk.push(`deputy envelope declares no dataReach — absent means none, fail closed`);
      return refuse(APERTURE_REACH_UNDECLARED, REACH_UNDECLARED_SENTENCE);
    }
    if (deputy.dataReach !== undefined && classRank(cls) > classRank(deputyCeiling(deputy))) {
      walk.push(`class ${cls} exceeds the deputy ceiling ${deputyCeiling(deputy)} (dataReach ${deputy.dataReach}, grantor view ${deputy.grantorView ?? "secret"})`);
      return refuse(APERTURE_DEPUTY_OVERREACH, DEPUTY_OVERREACH_SENTENCE);
    }
    walk.push(`deputy read within ceiling ${deputyCeiling(deputy)} — allowed`);
    return { verdict: "allow", class: cls, declared, walk };
  }
  // the universal fence: the RESOLVED reader (the principal, or the deputy
  // chain's root) ≠ the row's owning principal, and class ≥ principal
  const resolvedReader = deputy !== undefined ? deputy.grantor : read.reader;
  if (resolvedReader !== read.owner && classRank(cls) >= CLASS_LATTICE.principal) {
    return refuse(APERTURE_CROSS_PRINCIPAL, crossPrincipalSentence(cls, read.owner, read.reader));
  }
  walk.push(`within the fence (reader ${read.reader === read.owner ? "is the owner" : `reads ${cls}-class data`})`);
  return { verdict: "allow", class: cls, declared, walk };
}

// ---- the write gate (ratchets + taint, verified mechanically at write) -----

export interface PrivacyWrite {
  ns: string;
  id: string;
  owner: string;
  class?: PrivacyClass;          // the declared row class (≥ ns class; default = ns class)
  cites?: TaintSource[];         // the inputs this derived row folds (the taint law applies when present)
  op?: string;
}

export interface WriteGateResult {
  verdict: "allow" | "refused";
  code?: string;
  sentence?: string;
  nsClass: PrivacyClass;
  declaredClass: PrivacyClass;
  taint: PrivacyClass;
  effectiveClass: PrivacyClass;  // what the row MUST carry: max(declared, taint)
  walk: string[];
}

/** THE write gate (privacy.check@1, action "write"). Strengthen-only in both
 *  directions: never weaker than the namespace (APERTURE_CLASS_WEAKENED),
 *  never weaker than the fold of the cited inputs (APERTURE_TAINT_MISMATCH),
 *  never weaker than the row's existing taint (APERTURE_RATCHET_WEAKENED).
 *  An unresolvable citation quarantines (APERTURE_TAINT_UNVERIFIED). */
export function writeGate(
  write: PrivacyWrite,
  map: ClassMap,
  existingTaint?: PrivacyClass,
  now = 0,
): WriteGateResult {
  const op = write.op ?? "vault.append@1";
  const nsClass = effectiveClass(write.ns, map);
  const declared = write.class ?? nsClass;
  const fold = write.cites !== undefined && write.cites.length > 0 ? taintFold(write.cites, map) : null;
  const taint = fold?.taint ?? declared;
  const effective = maxClass(declared, taint);
  const walk: string[] = [
    `write ${write.ns}/${write.id} (op ${op}): ns class ${nsClass}, declared ${declared}${fold ? `, taint fold ${taint} over ${fold.sources.length} cited input(s)` : " (no citations — not a derived row)"}`,
  ];
  const refuse = (code: string, sentence: string): WriteGateResult => {
    walk.push(`verdict: refused ${code}`);
    return { verdict: "refused", code, sentence, nsClass, declaredClass: declared, taint, effectiveClass: effective, walk };
  };
  // the row-level ratchet: never weaker than the namespace's class
  if (classRank(declared) < classRank(nsClass)) {
    walk.push(`declared ${declared} < ns class ${nsClass}`);
    return refuse(APERTURE_CLASS_WEAKENED, `${CLASS_WEAKENED_SENTENCE} (${write.ns} is ${nsClass}-class; this row declared ${declared})`);
  }
  // the taint law: verified mechanically at write — privacy cannot be laundered through a fold
  if (fold !== null) {
    if (fold.unverified.length > 0) {
      walk.push(`citations unresolvable: ${fold.unverified.join(", ")} — quarantined, fail-closed to secret`);
      return refuse(APERTURE_TAINT_UNVERIFIED, `${TAINT_UNVERIFIED_SENTENCE} (unresolved: ${fold.unverified.join(", ")})`);
    }
    if (classRank(declared) < classRank(taint)) {
      walk.push(`declared ${declared} < taint fold ${taint} — the derived leak`);
      return refuse(APERTURE_TAINT_MISMATCH, `${DERIVED_LEAK_SENTENCE} (fold requires ${taint}, declared ${declared})`);
    }
  }
  // the time ratchet: a write may not LOWER an existing row's taint
  if (existingTaint !== undefined && classRank(effective) < classRank(existingTaint)) {
    walk.push(`effective ${effective} < existing taint ${existingTaint}`);
    return refuse(APERTURE_RATCHET_WEAKENED, `${RATCHET_WEAKENED_SENTENCE} (row carries ${existingTaint}; this write would carry ${effective})`);
  }
  walk.push(`verdict: allow — row carries ${effective} (ns floor ${nsClass}${fold ? `, taint ${taint}` : ""})${now ? ` at ${now}` : ""}`);
  return { verdict: "allow", nsClass, declaredClass: declared, taint, effectiveClass: effective, walk };
}

// ---- the audit fold (the taint sweep: findings ledgered, never auto-fixed) -

export interface DerivedRowAudit {
  ns: string;
  id: string;
  class: PrivacyClass;
  cites: TaintSource[];
}

export interface TaintFinding {
  code: typeof APERTURE_DERIVED_LEAK | typeof APERTURE_TAINT_UNVERIFIED;
  target: string;
  sentence: string;
}

/** The taint sweep (privacy.audit@1's fold): verifies every derived row's
 *  class ≥ its inputs'. Findings are DATA — ledgered by the caller, never
 *  auto-fixed (the audit never mutates what it judges). */
export function auditTaint(rows: DerivedRowAudit[], map: ClassMap): { findings: TaintFinding[]; checked: number; clean: number } {
  const findings: TaintFinding[] = [];
  for (const row of rows.sort((a, b) => (a.ns < b.ns ? -1 : a.ns > b.ns ? 1 : a.id < b.id ? -1 : 1))) {
    const fold = taintFold(row.cites, map);
    if (fold.unverified.length > 0) {
      findings.push({ code: APERTURE_TAINT_UNVERIFIED, target: `${row.ns}/${row.id}`, sentence: `${TAINT_UNVERIFIED_SENTENCE} (unresolved: ${fold.unverified.join(", ")})` });
    } else if (classRank(row.class) < classRank(fold.taint)) {
      findings.push({ code: APERTURE_DERIVED_LEAK, target: `${row.ns}/${row.id}`, sentence: `${DERIVED_LEAK_SENTENCE} (carries ${row.class}, inputs require ${fold.taint})` });
    }
  }
  return { findings, checked: rows.length, clean: rows.length - findings.length };
}

// ---- the export law (the machine, never the secrets) -----------------------

/** The export gate: secret-class rows never cross; principal-class rows cross
 *  only under treaty (Ω-15's shape — the treatyRef names it). */
export function exportGate(
  rows: Array<{ ns: string; id: string; class?: PrivacyClass }>,
  map: ClassMap,
  treatyRef?: string,
): { verdict: "allow" | "refused"; code?: string; sentence?: string; refused: string[]; walk: string[] } {
  const refused: string[] = [];
  const walk: string[] = [`export gate over ${rows.length} row(s)${treatyRef ? ` under treaty ${treatyRef}` : " (no treaty)"}`];
  for (const row of rows) {
    const cls = row.class ?? effectiveClass(row.ns, map);
    if (cls === "secret") {
      refused.push(`${row.ns}/${row.id}`);
      walk.push(`${row.ns}/${row.id} is secret-class — you may share the machine, never the secrets`);
    } else if (cls === "principal" && treatyRef === undefined) {
      refused.push(`${row.ns}/${row.id}`);
      walk.push(`${row.ns}/${row.id} is principal-class — crosses only under treaty (Ω-15's shape)`);
    }
  }
  if (refused.length > 0) {
    return { verdict: "refused", code: APERTURE_EXPORT_WITH_SECRETS, sentence: EXPORT_WITH_SECRETS_SENTENCE, refused, walk };
  }
  walk.push(`verdict: allow — no secret-class rows, principal-class rows treaty-covered`);
  return { verdict: "allow", refused, walk };
}

// ---- the refusal ledger (ns privacy — evidence rows, append-only) ----------

/**
 * The refusal ledger: every fence crossing lands a row (the D-379 discipline,
 * centralized in ns privacy). The ledger assigns the durable id family
 * refusal:<seq> and returns the envelope's ledgerRef — the verdict is data
 * before it is anything else.
 */
export class PrivacyRefusalLedger {
  private rows = new Map<string, RefusalRow>();
  private seq = 0;
  private readonly boot = Date.now().toString(36).padStart(9, "0");

  record(row: RefusalRow): { row: RefusalRow; ledgerRef: { ns: string; id: string; rev: number } } {
    const id = `${row.id || "refusal:"}${this.boot}-${String(++this.seq).padStart(9, "0")}`;
    const clean: RefusalRow = { ...row, id };
    this.rows.set(id, clean);
    return { row: clean, ledgerRef: { ns: "privacy", id, rev: 1 } };
  }

  list(): RefusalRow[] {
    return [...this.rows.values()].sort((a, b) => (a.id < b.id ? -1 : 1));
  }

  size(): number {
    return this.rows.size;
  }
}

/** Canonical serialization + sha256 (the replayable-input discipline). */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const rec = value as Record<string, unknown>;
  return `{${Object.keys(rec).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(rec[k])}`).join(",")}}`;
}

export function sha256Hex(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

/** Fill a fence verdict's envelope with the ledger's durable ref. */
export function withLedgerRef(result: FenceCheckResult, ledger: PrivacyRefusalLedger): FenceCheckResult {
  if (result.verdict !== "REFUSED" || result.refusalRow === undefined) return result;
  const { row, ledgerRef } = ledger.record(result.refusalRow);
  return { ...result, refusalRow: row, envelope: { ...result.envelope!, ledgerRef } };
}
