// vivim-run/src/context.ts (D-443, Ω-3 — the context substrate, re-materialized spec paper D-427)
//
// The assembled window: a per-namespace, evidence-citing, deterministic
// projection of the vault (§12). The same query against the same source rows
// assembles the same window — the digest fold is the truth. Every included
// row carries its ref and its epistemic kind (§13: an uncited inclusion is a
// rumor); eviction at caps is NAMED or refused, never silent truncation; the
// window is metered (the Ω-2 budgetRef seam); the digest cache is a
// read-through of the fold — never a second truth.
//
// Pure core: the ops layer supplies the vault batch (the D-387 getmany hop)
// and `now`. No timers, no I/O.
import { canonicalJson, sha256Hex } from "./planstate.ts";

export const CTX_WINDOW_NS = "ctx.window";
export const CTX_NAMESPACE_UNKNOWN = "CTX_NAMESPACE_UNKNOWN";
export const CTX_ASSEMBLY_UNRESOLVABLE = "CTX_ASSEMBLY_UNRESOLVABLE";
export const CTX_DIGEST_DIVERGENCE = "CTX_DIGEST_DIVERGENCE";
export const CTX_EVICT_UNDECLARED = "CTX_EVICT_UNDECLARED";
export const CTX_KIND_UNLABELLED = "CTX_KIND_UNLABELLED";
export const CTX_BUDGET_UNMETERED = "CTX_BUDGET_UNMETERED";
export const CTX_BOUND_EXCEEDED = "CTX_BOUND_EXCEEDED";

export const CTX_READ_BOUND = 512;   // the per-namespace distinct-id read bound (the QUERY_BOUND discipline)
export const CTX_DEFAULT_CAP = 200;  // the per-namespace eviction cap (the mind's entityCap precedent)
export const CTX_RULES = ["newest-N", "oldest-N"] as const;
export type CtxRule = (typeof CTX_RULES)[number];

/** The citation: which namespace, and the seat it takes in the window's assembly. */
export interface ContextSourceRef { ns: string; role: string }

/** One resolvable vault row the fold reads (supplied by the ops layer's batch hop). */
export interface VaultRow {
  ns: string;
  id: string;
  rev: number;
  epistemicKind?: string;  // §13 — unlabelled included rows refuse CTX_KIND_UNLABELLED
  bytes: string;
}

/** An included row: the live revision, its span in the assembled window, its kind. */
export interface IncludedRef {
  ns: string;
  id: string;
  rev: number;
  byteOffsets: [number, number]; // [start, end) into the assembled window bytes
  epistemicKind: string;
}

export interface AssemblySection {
  ns: string;
  role: string;
  included: IncludedRef[];
  evicted: number;   // rows a named rule dropped — counted, never silent
  rule?: string;     // the named rule that applied (cited when evicted > 0)
}

export interface ContextAssembly {
  kind: "ctx.assembly@1";
  assemblyId: string;
  principal: string;
  query: string;        // the canonical intent ref | nlcl projection spec (§11)
  sources: AssemblySection[];
  digest: string;       // deterministic fold over included refs + rules + bounds
  budgetRef: string;    // the Ω-2 seam — the window is a scheduled workload (§18)
  vaultVersion: number; // the vault version this assembly folded over (the light call)
  assembledAt: number;
  v: number;            // evidence-count-derived — the included row count
}

export interface AssembleSpec {
  assemblyId: string;
  principal: string;
  query: string;
  sources: ContextSourceRef[];
  eviction?: Array<{ ns: string; rule: string }>;
  budgetRef: string;
  caps?: Record<string, number>;
  rows: VaultRow[];
  knownNamespaces: string[];
  vaultVersion: number;
}

export type AssemblyOutcome = { ok: true; row: ContextAssembly } | { ok: false; code: string; sentence: string };
export type ReadOutcome = { ok: true; row: ContextAssembly; rendered: string } | { ok: false; code: string; sentence: string };

/** THE digest fold (D-443) — included refs + rules + bounds, canonical, hashed. Pure. */
export function assemblyDigest(sections: readonly AssemblySection[]): string {
  const included = sections.flatMap((s) => s.included.map((r) => [r.ns, r.id, r.rev, r.epistemicKind, r.byteOffsets[0], r.byteOffsets[1]]));
  const rules = sections.filter((s) => s.rule !== undefined).map((s) => [s.ns, s.rule]);
  return `sha256:${sha256Hex(canonicalJson({ bound: CTX_READ_BOUND, included, rules }))}`;
}

/** Re-fold a stored row's citations and compare digests — the divergence detector. Pure. */
export function verifyAssembly(row: ContextAssembly): { ok: true } | { ok: false; code: string; sentence: string } {
  const folded = assemblyDigest(row.sources);
  if (folded !== row.digest) {
    return {
      ok: false, code: CTX_DIGEST_DIVERGENCE,
      sentence: `${CTX_DIGEST_DIVERGENCE}: the same citations re-folded to digest ${folded} ≠ the stored ${row.digest}; the divergence is refused loudly, not cached quietly (D-443, Ω-3)`,
    };
  }
  return { ok: true };
}

/**
 * THE assembly fold (D-443) — pure over its inputs. The window is evidence
 * or it is nothing: unknown namespaces, absent sources, unlabelled kinds,
 * unmetered assembly, and over-bound reads all refuse named; a namespace
 * over cap evicts by a NAMED rule (cited, counted) or refuses.
 */
export function assemble(spec: AssembleSpec, now: number): AssemblyOutcome {
  if (typeof spec.budgetRef !== "string" || spec.budgetRef.length === 0) {
    return { ok: false, code: CTX_BUDGET_UNMETERED, sentence: `${CTX_BUDGET_UNMETERED}: assembling a window is a scheduled workload (§18); assemble with a budgetRef or do not assemble (D-443, Ω-3)` };
  }
  // dedupe sources by ns (first role wins), sections sorted by ns — supplied order never moves the digest
  const byNs = new Map<string, string>();
  for (const s of spec.sources) {
    if (typeof s.ns !== "string" || s.ns.length === 0) {
      return { ok: false, code: CTX_ASSEMBLY_UNRESOLVABLE, sentence: `${CTX_ASSEMBLY_UNRESOLVABLE}: a source names no namespace — a window over nothing is refused (D-443)` };
    }
    if (!byNs.has(s.ns)) byNs.set(s.ns, typeof s.role === "string" && s.role.length > 0 ? s.role : "untyped");
  }
  if (byNs.size === 0) {
    return { ok: false, code: CTX_ASSEMBLY_UNRESOLVABLE, sentence: `${CTX_ASSEMBLY_UNRESOLVABLE}: the assembly cites no sources — a window over nothing is refused (D-443)` };
  }
  const known = new Set(spec.knownNamespaces);
  const ruleFor = new Map((spec.eviction ?? []).map((e) => [e.ns, e.rule]));
  const sections: AssemblySection[] = [];
  let cursor = 0;
  for (const ns of [...byNs.keys()].sort()) {
    if (!known.has(ns)) {
      return { ok: false, code: CTX_NAMESPACE_UNKNOWN, sentence: `${CTX_NAMESPACE_UNKNOWN}: the assembly cites ns '${ns}', which the vault does not carry; a window over nothing is refused (D-443, Ω-3)` };
    }
    const candidates = spec.rows.filter((r) => r.ns === ns);
    if (candidates.length === 0) {
      return { ok: false, code: CTX_ASSEMBLY_UNRESOLVABLE, sentence: `${CTX_ASSEMBLY_UNRESOLVABLE}: the cited source ns '${ns}' (role ${byNs.get(ns)}) carries no live rows — a window over nothing is refused (D-443)` };
    }
    const distinctIds = new Set(candidates.map((r) => r.id)).size;
    if (distinctIds > CTX_READ_BOUND) {
      return { ok: false, code: CTX_BOUND_EXCEEDED, sentence: `${CTX_BOUND_EXCEEDED}: this assembly exceeds the per-namespace read bound (${distinctIds} distinct ids in ns '${ns}' > ${CTX_READ_BOUND}); narrow the query or raise the declared bound (D-443)` };
    }
    // deterministic within-section order: id, then rev
    const ordered = [...candidates].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : a.rev - b.rev));
    const cap = spec.caps?.[ns] ?? CTX_DEFAULT_CAP;
    let kept = ordered;
    let rule: string | undefined;
    let evicted = 0;
    if (ordered.length > cap) {
      rule = ruleFor.get(ns);
      if (rule === undefined) {
        return { ok: false, code: CTX_EVICT_UNDECLARED, sentence: `${CTX_EVICT_UNDECLARED}: evicting from ns ${ns} requires a named rule (${CTX_RULES.join(" | ")}); silent truncation is the exact failure this substrate exists to kill (D-443, Ω-3)` };
      }
      if (!(CTX_RULES as readonly string[]).includes(rule)) {
        return { ok: false, code: CTX_EVICT_UNDECLARED, sentence: `${CTX_EVICT_UNDECLARED}: the rule '${rule}' names nothing the fold can apply to ns ${ns} (${CTX_RULES.join(" | ")}) — an unknown rule refuses, never truncates quietly (D-443)` };
      }
      const ranked = rule === "newest-N"
        ? [...ordered].sort((a, b) => b.rev - a.rev || (a.id < b.id ? -1 : 1))  // newest first
        : [...ordered].sort((a, b) => a.rev - b.rev || (a.id < b.id ? -1 : 1)); // oldest first
      kept = ranked.slice(0, cap).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : a.rev - b.rev));
      evicted = ordered.length - kept.length;
    }
    const included: IncludedRef[] = [];
    for (const r of kept) {
      if (typeof r.epistemicKind !== "string" || r.epistemicKind.length === 0) {
        return { ok: false, code: CTX_KIND_UNLABELLED, sentence: `${CTX_KIND_UNLABELLED}: row ${ns}/${r.id} carries no epistemic kind (§13); the vault refuses rumors, and so does the window (D-443, Ω-3)` };
      }
      const end = cursor + r.bytes.length;
      included.push({ ns, id: r.id, rev: r.rev, byteOffsets: [cursor, end], epistemicKind: r.epistemicKind });
      cursor = end;
    }
    sections.push({ ns, role: byNs.get(ns)!, included, evicted, ...(rule !== undefined ? { rule } : {}) });
  }
  const digest = assemblyDigest(sections);
  const v = sections.reduce((n, s) => n + s.included.length, 0);
  const assemblyId = typeof spec.assemblyId === "string" && spec.assemblyId.length > 0
    ? spec.assemblyId
    : `${CTX_WINDOW_NS}:${spec.principal}:${digest.slice(7, 23)}`; // digest-derived — deterministic across boots
  return {
    ok: true,
    row: {
      kind: "ctx.assembly@1", assemblyId, principal: spec.principal, query: spec.query,
      sources: sections, digest, budgetRef: spec.budgetRef,
      vaultVersion: spec.vaultVersion, assembledAt: now, v,
    },
  };
}

/** The headless render: the window as cited text — ns/id@rev [kind] bytes start..end. */
export function renderContextWindow(row: ContextAssembly): string {
  const lines = [
    `ctx.window — assembly ${row.assemblyId} (v${row.v}, principal ${row.principal}, query ${JSON.stringify(row.query)})`,
    `  digest ${row.digest} — budgetRef ${row.budgetRef} — vault v${row.vaultVersion} — assembledAt ${row.assembledAt}`,
  ];
  for (const s of row.sources) {
    const evicted = s.evicted > 0 ? `, ${s.evicted} evicted by ${s.rule}` : "";
    lines.push(`  ${s.ns} (${s.role}, ${s.included.length} row(s)${evicted}):`);
    for (const r of s.included) {
      lines.push(`    ${r.id}@${r.rev} [${r.epistemicKind}] bytes ${r.byteOffsets[0]}..${r.byteOffsets[1]}`);
    }
  }
  return lines.join("\n");
}

/**
 * The in-plugin registry (ring-first; the vault mirror rides port caps).
 * The digest cache is a READ-THROUGH of the fold — keyed principal + vault
 * version + digest (D-379's no-cross-principal law inherits); it serves
 * what the fold already derived, never a second truth.
 */
export class ContextRegistry {
  private byId = new Map<string, ContextAssembly>();
  private byDigest = new Map<string, ContextAssembly>();
  private knownNamespaces = new Set<string>();
  private full = 0; // full assemblies performed — the light-call meter

  assemble(spec: AssembleSpec, now: number): { ok: true; row: ContextAssembly; cached: boolean } | { ok: false; code: string; sentence: string } {
    const known = new Set([...this.knownNamespaces, ...spec.knownNamespaces]);
    const out = assemble({ ...spec, knownNamespaces: [...known].sort() }, now);
    if (!out.ok) return out;
    this.knownNamespaces = known;
    const prior = spec.assemblyId.length > 0 ? this.byId.get(spec.assemblyId) : undefined;
    if (prior !== undefined && prior.vaultVersion === spec.vaultVersion && prior.digest !== out.row.digest) {
      // the same query over the same vault produced two digests — refuse loudly, cache nothing
      return { ok: false, code: CTX_DIGEST_DIVERGENCE, sentence: `${CTX_DIGEST_DIVERGENCE}: assembly ${spec.assemblyId} over vault v${spec.vaultVersion} re-folded to ${out.row.digest} ≠ the recorded ${prior.digest}; the divergence is refused loudly, not cached quietly (D-443, Ω-3)` };
    }
    const key = `${out.row.principal}::${spec.vaultVersion}::${out.row.digest}`;
    const cached = this.byDigest.get(key);
    if (cached !== undefined) return { ok: true, row: cached, cached: true }; // read-through: same digest ⇒ same bytes
    this.full++;
    this.byId.set(out.row.assemblyId, out.row);
    this.byDigest.set(key, out.row);
    return { ok: true, row: out.row, cached: false };
  }

  /** THE light call (D-387's posture as contract): an unchanged vault version-checks with ZERO full assemblies. */
  versionCheck(principal: string, key: string, vaultVersion: number): { unchanged: boolean; row: ContextAssembly | null } {
    const exact = this.byDigest.get(`${principal}::${vaultVersion}::${key}`); // the digest-keyed fast path — no re-derivation
    if (exact !== undefined) return { unchanged: true, row: exact };
    const row = this.resolve(key, principal);
    if (row === null) return { unchanged: false, row: null };
    return row.vaultVersion === vaultVersion ? { unchanged: true, row } : { unchanged: false, row: null };
  }

  /** Fetch by assemblyId or digest — provenance rows ride along; a row the fold cannot reproduce refuses. */
  read(key: string, principal: string): ReadOutcome {
    const row = this.resolve(key, principal);
    if (row === null) {
      return { ok: false, code: CTX_ASSEMBLY_UNRESOLVABLE, sentence: `${CTX_ASSEMBLY_UNRESOLVABLE}: no assembly resolves ${JSON.stringify(key)} for principal ${principal} — a window over nothing is refused (D-443)` };
    }
    const v = verifyAssembly(row);
    if (!v.ok) return v; // never serve a row the fold cannot reproduce
    return { ok: true, row, rendered: renderContextWindow(row) };
  }

  /** The door for externally-supplied rows (the vault mirror): tampered digests refuse at the door. */
  ingest(row: ContextAssembly): { ok: true } | { ok: false; code: string; sentence: string } {
    const v = verifyAssembly(row);
    if (!v.ok) return v;
    this.byId.set(row.assemblyId, row);
    this.byDigest.set(`${row.principal}::${row.vaultVersion}::${row.digest}`, row);
    return { ok: true };
  }

  assemblies(): number { return this.full; }

  listNamespaces(): string[] { return [...this.knownNamespaces].sort(); }

  private resolve(key: string, principal: string): ContextAssembly | null {
    const byIdRow = this.byId.get(key);
    if (byIdRow !== undefined) return byIdRow.principal === principal ? byIdRow : null; // D-379: no cross-principal reads
    let out: ContextAssembly | null = null; // digest keys are version-qualified — scan, latest wins
    for (const row of this.byDigest.values()) {
      if (row.principal === principal && row.digest === key) out = row;
    }
    return out;
  }
}
