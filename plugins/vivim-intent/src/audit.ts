// vivim-intent/src/audit.ts — the standing leakage audit (D-434, Ω-2.6).
//
// THE LINE this module patrols: "ML perceives, the substrate decides." The
// walk may USE a badged realization for perception (the base resolver), but
// the DECISION path (lexicon + disambiguation + resolution) must stay
// deterministic substrate code. The audit proves it three ways:
//
//   1 · replay battery — a pinned corpus runs twice; any verdict divergence
//      is INTENT_RESOLUTION_NONDETERMINISTIC naming the case (the tripwire
//      for a probabilistic call grafted into the walk)
//   2 · verdict-set diff — the resolved-op SET must be stable across runs
//   3 · static provenance — the walk's own source imports no realization
//      surface (provider/LLM modules); perception is injected at the op
//      boundary, never imported into the decision path
//
// Pure core: the op layer schedules it (weekly default + on version bump);
// everything here is deterministic data-in/data-out.
import { createHash } from "node:crypto";
import { canonicalJson, type LexiconEntry } from "./lexicon.ts";
import { resolveWithTrace, type BaseResolver, type IntentTrace } from "./trace.ts";

export const INTENT_AUDIT_VERDICT_DRIFT = "INTENT_AUDIT_VERDICT_DRIFT";
export const INTENT_RESOLUTION_NONDETERMINISTIC = "INTENT_RESOLUTION_NONDETERMINISTIC";

export interface CorpusCase { utterance: string; expectOp?: string }

export interface AuditFinding {
  code: typeof INTENT_RESOLUTION_NONDETERMINISTIC | typeof INTENT_AUDIT_VERDICT_DRIFT;
  sentence: string;
  case?: string;
}

export interface ReplayAuditResult {
  ok: boolean;
  cases: number;
  findings: AuditFinding[];
  runA: string;   // canonical verdict-set of run 1
  runB: string;   // canonical verdict-set of run 2
}

/** The replay battery: every corpus case resolves TWICE; divergence is the
 *  named nondeterminism refusal with the case named. Pure. */
export function auditReplay(corpus: CorpusCase[], entries: LexiconEntry[], base: BaseResolver): ReplayAuditResult {
  const findings: AuditFinding[] = [];
  const verdict = (t: IntentTrace): string => canonicalJson({ op: t.resolvedIntent?.op ?? null, digest: t.resolverDigest });
  const setA: string[] = [];
  const setB: string[] = [];
  for (const c of corpus) {
    const a = resolveWithTrace(c.utterance, entries, base);
    const b = resolveWithTrace(c.utterance, entries, base);
    setA.push(verdict(a));
    setB.push(verdict(b));
    const va = verdict(a);
    const vb = verdict(b);
    if (va !== vb) {
      findings.push({
        code: INTENT_RESOLUTION_NONDETERMINISTIC,
        sentence: `${INTENT_RESOLUTION_NONDETERMINISTIC}: utterance ${JSON.stringify(c.utterance)} resolved differently across replays (${va} vs ${vb}) — a probabilistic call is inside the walk; ML proposes, the substrate decides (D-434, Ω-2.6)`,
        case: c.utterance,
      });
      continue;
    }
    if (c.expectOp !== undefined && a.resolvedIntent?.op !== c.expectOp) {
      findings.push({
        code: INTENT_AUDIT_VERDICT_DRIFT,
        sentence: `${INTENT_AUDIT_VERDICT_DRIFT}: utterance ${JSON.stringify(c.utterance)} resolved to ${String(a.resolvedIntent?.op)} but the pinned battery expects ${c.expectOp} — the walk drifted from its recorded behavior (D-434, Ω-2.6)`,
        case: c.utterance,
      });
    }
  }
  return {
    ok: findings.length === 0,
    cases: corpus.length,
    findings,
    runA: setA.join("\n"),
    runB: setB.join("\n"),
  };
}

/** The static provenance check: the decision path imports no realization
 *  surface. Scans the given sources (the op layer passes the walk's files).
 *  Pure. */
export function scanForRealizationImports(files: Array<{ path: string; src: string }>): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const forbidden = /from\s+"[^"]*(?:provider-llm|provider-browser|providers|@vivim\/omega-sdk)/;
  for (const f of files) {
    if (forbidden.test(f.src)) {
      findings.push({
        code: INTENT_RESOLUTION_NONDETERMINISTIC,
        sentence: `${INTENT_RESOLUTION_NONDETERMINISTIC}: the walk source ${f.path} imports a realization surface — perception is injected at the op boundary, never imported into the decision path (D-434, Ω-2.6)`,
      });
    }
  }
  return findings;
}

/** The full audit: replay battery + static provenance. Pure. */
export function runAudit(
  corpus: CorpusCase[],
  entries: LexiconEntry[],
  base: BaseResolver,
  walkSources: Array<{ path: string; src: string }>,
): { ok: boolean; replay: ReplayAuditResult; staticFindings: AuditFinding[] } {
  const replay = auditReplay(corpus, entries, base);
  const staticFindings = scanForRealizationImports(walkSources);
  return { ok: replay.ok && staticFindings.length === 0, replay, staticFindings };
}
