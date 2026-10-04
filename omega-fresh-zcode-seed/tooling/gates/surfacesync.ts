// tooling/gates/surfacesync.ts — D-436 (Ω-4.5, spec D-438): the surface parity sweep.
//
// THE LAW: parity you cannot measure is parity you are guessing about.
// Every (op × surface) pair resolves to bound / na-declared / drift / orphan
// — decided by a LIVE dispatch probe (never a grep), with reasoned per-op
// N/A rows (revocable, never blanket), derivation stamps on generated
// artifacts (the tamper gate: the derivation tool's grant is the only
// writer), and a one-command report that renders identically on replay.
//
// Pure core: probes are INJECTED ((op) => {dispatched}) — the op layer wires
// real dispatchers (MCP tool round-trip today; CLI/web staged with reasoned
// N/A rows until their waves), tests inject fakes. No I/O lives here except
// the registry loaders (JSON files, tolerant reads).
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const SURFACE_DRIFT = "SURFACE_DRIFT";
export const SURFACE_DERIVATION_TAMPER = "SURFACE_DERIVATION_TAMPER";
export const SURFACE_OP_UNBOUND = "SURFACE_OP_UNBOUND";
export const SURFACE_ORPHAN_BINDING = "SURFACE_ORPHAN_BINDING";
export const SURFACE_NA_UNREVIEWED = "SURFACE_NA_UNREVIEWED";

/** The stamp every generated surface artifact carries (an HTML comment line or a JSON block). */
export interface DerivationStamp {
  surfaceRef: string;        // canvas | cli | mcp | daemon | web | harness
  artifactPath: string;
  vocabularyDigest: string;  // the input vocabulary the artifact derives from
  derivationTool: string;    // the ONLY writer of this path (e.g. "omega:genome")
  derivedAt: number;
}

/** The derivation registry: surfaces/derivation.json — declared derived paths + their tools. */
export interface DerivationRow {
  artifactPath: string;
  surfaceRef: string;
  derivationTool: string;
  vocabularyOf: string;      // how the vocabulary digest is derived (a command)
}

/** An N/A row: surfaces/na.json — per-op, reasoned, reviewable, revocable. */
export interface NaRow {
  op: string;
  surface: string;
  reason: string;
  author: string;
  at: number;
  revokedAt?: number;        // revocation is append-only state: the drift returns
}

/** One probe per surface: does DISPATCHING this op succeed? (live, not grep) */
export type SurfaceProbe = (op: string) => { dispatched: boolean; detail?: string };

export interface SurfaceProbeSet {
  surface: string;
  probe: SurfaceProbe;
  /** ops this surface binds that may NOT be in the composition's routing (orphans if absent) */
  declaredBindings?: string[];
}

export type PairVerdict =
  | { op: string; surface: string; verdict: "bound" }
  | { op: string; surface: string; verdict: "na-declared"; reason: string }
  | { op: string; surface: string; verdict: "drift"; code: typeof SURFACE_OP_UNBOUND; detail: string }
  | { op: string; surface: string; verdict: "orphan"; code: typeof SURFACE_ORPHAN_BINDING; detail: string };

export interface ParityReport {
  ok: boolean;               // false when any drift/orphan/unreviewed-na exists
  pairs: PairVerdict[];
  unreviewedNa: Array<{ op: string; surface: string; code: typeof SURFACE_NA_UNREVIEWED; detail: string }>;
  driftCount: number;
  orphanCount: number;
  rendered: string;          // the one-command answer, byte-stable on replay
}

/** Load the N/A registry (tolerant: absent file = no rows; malformed rows skipped). */
export function loadNaRegistry(root: string): NaRow[] {
  const p = join(root, "surfaces", "na.json");
  if (!existsSync(p)) return [];
  try {
    const parsed = JSON.parse(readFileSync(p, "utf-8")) as { rows?: unknown };
    if (!Array.isArray(parsed.rows)) return [];
    return parsed.rows.filter((r): r is NaRow => {
      if (r === null || typeof r !== "object") return false;
      const x = r as Record<string, unknown>;
      return typeof x["op"] === "string" && typeof x["surface"] === "string" && typeof x["reason"] === "string";
    });
  } catch {
    return [];
  }
}

/** Load the derivation registry (tolerant). */
export function loadDerivationRegistry(root: string): DerivationRow[] {
  const p = join(root, "surfaces", "derivation.json");
  if (!existsSync(p)) return [];
  try {
    const parsed = JSON.parse(readFileSync(p, "utf-8")) as { rows?: unknown };
    if (!Array.isArray(parsed.rows)) return [];
    return parsed.rows.filter((r): r is DerivationRow => {
      if (r === null || typeof r !== "object") return false;
      const x = r as Record<string, unknown>;
      return typeof x["artifactPath"] === "string" && typeof x["derivationTool"] === "string";
    });
  } catch {
    return [];
  }
}

/** The active (unrevoked) N/A rows for a (op, surface) pair — exact op first, then the wildcard row (blanket scopes are flagged by the sweep). */
export function activeNa(naRows: NaRow[], op: string, surface: string): NaRow | null {
  const rows = naRows.filter((r) => r.op === op && r.surface === surface && r.revokedAt === undefined);
  if (rows.length > 0) return rows[rows.length - 1]!;
  const wildcard = naRows.filter((r) => r.op === "*" && r.surface === surface && r.revokedAt === undefined);
  return wildcard.length > 0 ? wildcard[wildcard.length - 1]! : null;
}

/**
 * THE parity sweep (D-436). A pure fold over (routable ops × probe sets × N/A
 * rows): same inputs → byte-identical report. Drift is decided by the LIVE
 * probe; orphans by the surface's declared bindings; blanket N/A refuses.
 */
export function sweepParity(
  routedOps: readonly string[],
  probeSets: readonly SurfaceProbeSet[],
  naRows: readonly NaRow[],
): ParityReport {
  const ops = [...new Set(routedOps)].sort();
  const pairs: PairVerdict[] = [];
  const unreviewedNa: ParityReport["unreviewedNa"] = [];
  for (const ps of probeSets) {
    for (const op of ops) {
      const na = activeNa([...naRows], op, ps.surface);
      if (na !== null && na.op !== "*" && na.reason.trim().length >= 10) {
        pairs.push({ op, surface: ps.surface, verdict: "na-declared", reason: na.reason });
        continue;
      }
      if (na !== null) {
        // blanket or reason-less N/A is the unreviewed exemption the spec refuses
        unreviewedNa.push({
          op, surface: ps.surface, code: SURFACE_NA_UNREVIEWED,
          detail: `the N/A row for (${op}, ${ps.surface}) is ${na.op === "*" ? "a BLANKET scope (*)" : "reason-less"} — exemptions are per-op, reasoned, and reviewable (author ${na.author})`,
        });
      }
      const probe = ps.probe(op);
      if (probe.dispatched) {
        pairs.push({ op, surface: ps.surface, verdict: "bound" });
      } else {
        pairs.push({
          op, surface: ps.surface, verdict: "drift", code: SURFACE_OP_UNBOUND,
          detail: `dispatch FAILED on ${ps.surface}${probe.detail !== undefined ? ` (${probe.detail})` : ""} — the op is routed but the surface does not serve it`,
        });
      }
    }
    // orphans: bindings the surface declares that the composition does not route
    const routed = new Set(ops);
    for (const bound of ps.declaredBindings ?? []) {
      if (!routed.has(bound)) {
        pairs.push({
          op: bound, surface: ps.surface, verdict: "orphan", code: SURFACE_ORPHAN_BINDING,
          detail: `${ps.surface} binds ${bound} but the composition routes no such op — a binding to nothing`,
        });
      }
    }
  }
  pairs.sort((a, b) => (a.op < b.op ? -1 : a.op > b.op ? 1 : a.surface < b.surface ? -1 : a.surface > b.surface ? 1 : 0));
  unreviewedNa.sort((a, b) => (a.op < b.op ? -1 : a.op > b.op ? 1 : a.surface < b.surface ? -1 : 1));
  const driftCount = pairs.filter((p) => p.verdict === "drift").length;
  const orphanCount = pairs.filter((p) => p.verdict === "orphan").length;
  const report: ParityReport = {
    ok: driftCount === 0 && orphanCount === 0 && unreviewedNa.length === 0,
    pairs, unreviewedNa, driftCount, orphanCount,
    rendered: "",
  };
  report.rendered = renderParityReport(report);
  return report;
}

/** The one-command answer, byte-stable on replay (the report IS the fold). */
export function renderParityReport(r: ParityReport): string {
  const lines: string[] = [];
  lines.push(`surface parity — ${r.ok ? "GREEN" : `RED (${r.driftCount} drift, ${r.orphanCount} orphan, ${r.unreviewedNa.length} unreviewed N/A)`}`);
  for (const p of r.pairs) {
    if (p.verdict === "bound") continue; // bound is the healthy default — the report names the exceptions
    if (p.verdict === "na-declared") lines.push(`  na-declared  ${p.op} @ ${p.surface} — ${p.reason}`);
    if (p.verdict === "drift") lines.push(`  DRIFT        ${p.op} @ ${p.surface} — ${SURFACE_DRIFT}: ${p.detail}`);
    if (p.verdict === "orphan") lines.push(`  ORPHAN       ${p.op} @ ${p.surface} — ${p.detail}`);
  }
  for (const u of r.unreviewedNa) lines.push(`  UNREVIEWED   ${u.op} @ ${u.surface} — ${SURFACE_NA_UNREVIEWED}: ${u.detail}`);
  if (r.ok) lines.push("  (every routed op is bound or reasoned-N/A on every probed surface)");
  return lines.join("\n");
}

// ---- the derivation stamp + the tamper gate ----------------------------------

/** Parse a surface.derivation stamp from artifact text (the HTML comment form stampLine embeds). */
export function stampOf(artifactText: string): DerivationStamp | null {
  const m = /<!--\s*surface\.derivation:\s*(\{.*?\})\s*-->/.exec(artifactText);
  if (!m) return null;
  try {
    const v = JSON.parse(m[1]!) as Record<string, unknown>;
    if (typeof v["surfaceRef"] !== "string" || typeof v["artifactPath"] !== "string" || typeof v["vocabularyDigest"] !== "string" || typeof v["derivationTool"] !== "string" || typeof v["derivedAt"] !== "number") return null;
    return v as DerivationStamp;
  } catch {
    return null;
  }
}

/** Render the stamp line a generator embeds (HTML comment form). */
export function stampLine(s: DerivationStamp): string {
  return `<!-- surface.derivation: ${JSON.stringify({ surfaceRef: s.surfaceRef, artifactPath: s.artifactPath, vocabularyDigest: s.vocabularyDigest, derivationTool: s.derivationTool, derivedAt: s.derivedAt })} -->`;
}

export interface TamperVerdict {
  ok: boolean;
  issues: string[];
}

/**
 * THE tamper gate (D-436): every REGISTERED derived artifact must carry a
 * well-formed stamp naming its registered tool — a missing stamp, a foreign
 * tool, or a path mismatch is SURFACE_DERIVATION_TAMPER. The derivation
 * tool's grant is the only writer; `derive` checks this before writing.
 */
export function tamperCheck(
  registry: readonly DerivationRow[],
  artifacts: ReadonlyMap<string, string>, // path → artifact text
): TamperVerdict {
  const issues: string[] = [];
  for (const row of [...registry].sort((a, b) => (a.artifactPath < b.artifactPath ? -1 : 1))) {
    const text = artifacts.get(row.artifactPath);
    if (text === undefined) {
      issues.push(`${SURFACE_DERIVATION_TAMPER}: registered derived artifact ${row.artifactPath} is absent — a registered path with no artifact is a derivation that never ran (or a file deleted by hand)`);
      continue;
    }
    const stamp = stampOf(text);
    if (stamp === null) {
      issues.push(`${SURFACE_DERIVATION_TAMPER}: ${row.artifactPath} carries no surface.derivation stamp — hand-written or stamp-stripped; only ${row.derivationTool} may write it`);
      continue;
    }
    if (stamp.derivationTool !== row.derivationTool) {
      issues.push(`${SURFACE_DERIVATION_TAMPER}: ${row.artifactPath} names derivation tool ${stamp.derivationTool} but the registry declares ${row.derivationTool} — a foreign writer`);
    }
    if (stamp.artifactPath !== row.artifactPath) {
      issues.push(`${SURFACE_DERIVATION_TAMPER}: ${row.artifactPath}'s stamp claims to be ${stamp.artifactPath} — a stamp copied from another artifact`);
    }
    if (stamp.surfaceRef !== row.surfaceRef) {
      issues.push(`${SURFACE_DERIVATION_TAMPER}: ${row.artifactPath} claims surface ${stamp.surfaceRef} but the registry declares ${row.surfaceRef}`);
    }
  }
  return { ok: issues.length === 0, issues };
}

/**
 * The derive gate: `surface.derive@1` may write ONLY registered paths, and
 * only with a fresh stamp. An unregistered write refuses; a registered write
 * with a stale or foreign stamp refuses.
 */
export function deriveVerdict(
  registry: readonly DerivationRow[],
  targetPath: string,
  currentText: string | undefined,
  nextStamp: DerivationStamp,
): { ok: true } | { ok: false; code: typeof SURFACE_DERIVATION_TAMPER; sentence: string } {
  const row = registry.find((r) => r.artifactPath === targetPath);
  if (!row) {
    return {
      ok: false, code: SURFACE_DERIVATION_TAMPER,
      sentence: `${SURFACE_DERIVATION_TAMPER}: ${targetPath} is not a registered derived path — surface.derive@1 writes only what surfaces/derivation.json declares (the grant is the registry)`,
    };
  }
  if (row.derivationTool !== nextStamp.derivationTool) {
    return {
      ok: false, code: SURFACE_DERIVATION_TAMPER,
      sentence: `${SURFACE_DERIVATION_TAMPER}: ${targetPath}'s registry declares writer ${row.derivationTool} but the stamp names ${nextStamp.derivationTool} — the derivation tool's grant is the only writer`,
    };
  }
  if (currentText !== undefined) {
    const prior = stampOf(currentText);
    if (prior !== null && prior.derivationTool !== row.derivationTool) {
      return {
        ok: false, code: SURFACE_DERIVATION_TAMPER,
        sentence: `${SURFACE_DERIVATION_TAMPER}: ${targetPath} carries a stamp from foreign tool ${prior.derivationTool} — refuse to overwrite evidence of a hand-edit (investigate, then regenerate)`,
      };
    }
  }
  return { ok: true };
}
