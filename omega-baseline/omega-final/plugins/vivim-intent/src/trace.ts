// vivim-intent/src/trace.ts — the replayable derivation trace (D-434, Ω-2.6).
//
// THE LAW this module enforces: every resolution is a pure function of
// (utterance, lexicon state) — the same inputs replay the same trace
// byte-for-byte, the winning step cites its evidence, and any divergence is
// a named refusal (INTENT_RESOLUTION_NONDETERMINISTIC), never a shrug.
//
// The walk stages (honest granularity at the intent boundary):
//   normalize → parse (the injected base resolver — NLCL in production) →
//   lexicon (alias/pattern hits, cited by entryId) → disambiguate (rules) →
//   resolve (the canonical intent + digest)
//
// Pure core: the op layer supplies the base resolver + vault; tests inject
// deterministic stubs. No clocks, no randomness, no realization calls.
import { createHash } from "node:crypto";
import {
  activeEntries, canonicalJson, INTENT_LEXICON_SCOPE_INVALID, type LexiconEntry,
} from "./lexicon.ts";

export const INTENT_TRACE_UNAVAILABLE = "INTENT_TRACE_UNAVAILABLE";
export const INTENT_RESOLUTION_NONDETERMINISTIC = "INTENT_RESOLUTION_NONDETERMINISTIC";

export const TRACE_UNAVAILABLE_SENTENCE =
  "This resolution predates the trace layer or its trace row was pruned; the walk cannot be replayed, and what cannot be replayed cannot be debugged.";

export type TraceStepKind = "normalize" | "parse" | "lexicon" | "disambiguate" | "resolve";

export interface TraceStep {
  step: number;
  kind: TraceStepKind;
  detail: string;
  data?: Record<string, unknown>;
}

export interface LexiconHit {
  entryId: string;
  kind: string;
  matched: string;
  effect: string;
}

export interface DisambiguationApplied {
  entryId: string;
  prefer: string;
  among?: string[];
  decided: string;
}

/** The base resolver the op layer injects (NLCL classify in production).
 *  Deterministic BY CONTRACT — the audit exists to prove it. */
export type BaseResolver = (normalizedUtterance: string) => { op: string; payload?: Record<string, unknown>; score?: number }[];

export interface IntentTrace {
  kind: "intent.trace@1";
  utteranceRef: string;             // sha256 of the normalized utterance (content-addressed)
  utterance: string;                // verbatim, the replay input
  steps: TraceStep[];
  candidates: string[];             // ops the base resolver proposed
  lexiconHits: LexiconHit[];
  disambiguations: DisambiguationApplied[];
  resolvedIntent: { op: string; payload?: Record<string, unknown> } | null;
  resolverDigest: string;           // sha256 over the canonical trace core
  lexiconDigest: string;            // the lexicon state this trace pinned
  replayable: true;
}

function sha256Hex(s: string): string {
  return createHash("sha256").update(s, "utf-8").digest("hex");
}

/** Normalize the utterance for matching: case-fold, collapse whitespace, trim. Pure. */
export function normalizeUtterance(utterance: string): string {
  return String(utterance).toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * THE traced resolution (D-434). Pure over (utterance, entries, base resolver):
 * the same inputs replay byte-identical traces. The lexicon stage runs AFTER
 * base parsing and BEFORE disambiguation (the spec's defined slot); every hit
 * cites its entryId; defaults fill only missing payload slots.
 */
export function resolveWithTrace(
  utterance: string,
  entries: LexiconEntry[],
  base: BaseResolver,
): IntentTrace {
  const steps: TraceStep[] = [];
  let n = 0;
  const step = (kind: TraceStepKind, detail: string, data?: Record<string, unknown>): void => {
    steps.push({ step: ++n, kind, detail, ...(data !== undefined ? { data } : {}) });
  };
  const normalized = normalizeUtterance(utterance);
  step("normalize", `utterance folded: ${JSON.stringify(normalized)}`);
  const active = activeEntries(entries);
  const candidates = base(normalized);
  step("parse", `base resolver proposed ${candidates.length} candidate(s): ${candidates.map((c) => c.op).join(", ") || "(none)"}`);
  // the lexicon stage — aliases and patterns, cited by entryId
  const lexiconHits: LexiconHit[] = [];
  const aliasMap = new Map<string, string>();
  for (const e of active) {
    if (e.kind === "alias") {
      const p = e.payload as { word: string; op: string };
      if (typeof p.word === "string" && typeof p.op === "string" && new RegExp(`\\b${p.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(normalized)) {
        aliasMap.set(p.word, p.op);
        lexiconHits.push({ entryId: e.entryId, kind: e.kind, matched: p.word, effect: `alias → ${p.op}` });
      }
    } else if (e.kind === "pattern") {
      const p = e.payload as { pattern: string; op: string };
      if (typeof p.pattern === "string" && typeof p.op === "string" && new RegExp(p.pattern, "i").test(normalized)) {
        lexiconHits.push({ entryId: e.entryId, kind: e.kind, matched: p.pattern, effect: `pattern → ${p.op}` });
      }
    }
  }
  step("lexicon", active.length === 0
    ? "lexicon stage: no active entries — the walk proceeds on the base resolver alone"
    : `lexicon stage: ${active.length} active entr${active.length === 1 ? "y" : "ies"}, ${lexiconHits.length} hit(s)${lexiconHits.length > 0 ? `: ${lexiconHits.map((h) => `${h.matched} (${h.entryId})`).join(", ")}` : ""}`);
  // candidate set with aliases folded in
  const ops = [...new Set([...candidates.map((c) => c.op), ...aliasMap.values()])];
  // disambiguation rules — the tie-break, cited by entryId
  const disambiguations: DisambiguationApplied[] = [];
  let resolvedOp: string | null = ops.length === 1 ? ops[0]! : null;
  if (ops.length > 1) {
    for (const e of active) {
      if (e.kind !== "disambiguation-rule") continue;
      const p = e.payload as { prefer: string; among?: string[] };
      if (typeof p.prefer !== "string") continue;
      const among = Array.isArray(p.among) ? p.among : ops;
      if (among.includes(p.prefer) && among.every((o) => ops.includes(o))) {
        disambiguations.push({ entryId: e.entryId, prefer: p.prefer, ...(Array.isArray(p.among) ? { among: p.among } : {}), decided: p.prefer });
        resolvedOp = p.prefer;
        break;
      }
    }
  }
  step("disambiguate", ops.length <= 1
    ? `disambiguation: ${ops.length === 1 ? "single candidate — no tie to break" : "no candidates — the walk refuses (no resolution)"}`
    : disambiguations.length > 0
      ? `disambiguation: ${ops.length} candidates → ${disambiguations[0]!.decided} (rule ${disambiguations[0]!.entryId})`
      : `disambiguation: ${ops.length} candidates, no rule applies — unresolved (the principal's next entry is the cure)`);
  // defaults fill only missing slots
  let payload: Record<string, unknown> | undefined;
  if (resolvedOp !== null) {
    const baseWinner = candidates.find((c) => c.op === resolvedOp);
    payload = baseWinner?.payload !== undefined ? { ...baseWinner.payload } : undefined;
    for (const e of active) {
      if (e.kind !== "default") continue;
      const p = e.payload as { op: string; params: Record<string, unknown> };
      if (p.op !== resolvedOp || p.params === null || typeof p.params !== "object") continue;
      payload = { ...(payload ?? {}) };
      for (const [k, v] of Object.entries(p.params)) {
        if (payload[k] === undefined) payload[k] = v;
      }
    }
  }
  step("resolve", resolvedOp === null
    ? "verdict: UNRESOLVED — no canonical intent (candidates ambiguous, no rule)"
    : `verdict: ${resolvedOp}${payload !== undefined ? ` with payload ${canonicalJson(payload)}` : " (no payload)"}`);
  const core = {
    utteranceRef: `utt:${sha256Hex(normalized).slice(0, 16)}`,
    candidates: ops,
    lexiconHits,
    disambiguations,
    resolvedIntent: resolvedOp === null ? null : { op: resolvedOp, ...(payload !== undefined ? { payload } : {}) },
  };
  const lexiconDigestOf = (es: LexiconEntry[]): string => {
    const canon = activeEntries(es).map((e) => canonicalJson({ entryId: e.entryId, kind: e.kind, payload: e.payload, scope: e.scope, principal: e.principal })).join("\n");
    return `sha256:${sha256Hex(canon)}`;
  };
  return {
    kind: "intent.trace@1",
    utteranceRef: core.utteranceRef,
    utterance: String(utterance),
    steps,
    candidates: ops,
    lexiconHits,
    disambiguations,
    resolvedIntent: core.resolvedIntent,
    resolverDigest: `sha256:${sha256Hex(canonicalJson(core))}`,
    lexiconDigest: lexiconDigestOf(entries),
    replayable: true,
  };
}

export interface TraceDiff {
  same: boolean;
  utteranceSame: boolean;
  lexiconChanged: boolean;
  firstDivergence: number | null;   // the step number where the walks split
  divergedSteps: Array<{ step: number; a: string; b: string }>;
  resolvedSame: boolean;
}

/** Diff two traces of the SAME utterance: localize the change (the planted-rule
 *  debugger). Pure. */
export function diffTraces(a: IntentTrace, b: IntentTrace): TraceDiff {
  const diverged: Array<{ step: number; a: string; b: string }> = [];
  const max = Math.max(a.steps.length, b.steps.length);
  let first: number | null = null;
  for (let i = 0; i < max; i++) {
    const sa = a.steps[i];
    const sb = b.steps[i];
    const la = sa === undefined ? "(absent)" : `${sa.kind}: ${sa.detail}`;
    const lb = sb === undefined ? "(absent)" : `${sb.kind}: ${sb.detail}`;
    if (la !== lb) {
      diverged.push({ step: i + 1, a: la, b: lb });
      if (first === null) first = i + 1;
    }
  }
  return {
    same: diverged.length === 0 && a.resolverDigest === b.resolverDigest,
    utteranceSame: normalizeUtterance(a.utterance) === normalizeUtterance(b.utterance),
    lexiconChanged: a.lexiconDigest !== b.lexiconDigest,
    firstDivergence: first,
    divergedSteps: diverged,
    resolvedSame: canonicalJson(a.resolvedIntent) === canonicalJson(b.resolvedIntent),
  };
}

/** Serialize a trace deterministically (the replay comparison bytes). Pure. */
export function traceBytes(t: IntentTrace): string {
  return canonicalJson(t);
}

/** Parse a trace row from vault data. Null when malformed (tolerant read). Pure. */
export function parseTraceRow(data: unknown): IntentTrace | null {
  if (data === null || typeof data !== "object" || Array.isArray(data)) return null;
  const r = data as Record<string, unknown>;
  if (typeof r["utterance"] !== "string" || typeof r["resolverDigest"] !== "string" || !Array.isArray(r["steps"])) return null;
  return data as IntentTrace;
}
