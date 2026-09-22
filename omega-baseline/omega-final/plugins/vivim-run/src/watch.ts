// vivim-run/src/watch.ts (D-440, Ω-1 — the watch substrate, re-materialized spec paper D-425)
//
// Watching is proving, not polling vibes: one registration discipline over
// process/signal/heartbeat scopes, typed predicates as pure folds over
// observation rows, the watcher's own lease (a silent watcher is itself
// watched), and every anomaly a named refusal or a ledgered observation.
//
// Pure core: the ops layer supplies `now`; the vault mirror rides port caps
// when present (ring-first, the health.ts precedent). No timers, no I/O.
import { canonicalJson as _cj } from "./planstate.ts";

export const WATCH_NS = "watch";
export const WATCH_SCOPE_INVALID = "WATCH_SCOPE_INVALID";
export const WATCH_SUBJECT_UNKNOWN = "WATCH_SUBJECT_UNKNOWN";
export const WATCH_BUDGET_UNDECLARED = "WATCH_BUDGET_UNDECLARED";
export const WATCH_DUPLICATE = "WATCH_DUPLICATE";
export const WATCH_LEASE_EXPIRED = "WATCH_LEASE_EXPIRED";

export type WatchScope = "process" | "signal" | "heartbeat";
export type WatchAction = "observe" | "flag" | "escalate";
export type Verdict = "quiet" | "flagged" | "escalated";

export interface CrashPredicate { kind: "crash-delta"; window: number; threshold: number }      // crashes ≥ threshold within window polls
export interface VersionPredicate { kind: "version-bump" }
export interface StallPredicate { kind: "no-progress"; stallDeadlineMs: number }
export type WatchPredicate = CrashPredicate | VersionPredicate | StallPredicate;

export interface WatchRegistration {
  watchId: string;
  principal: string;
  scope: WatchScope;
  subject: string;
  predicate: WatchPredicate;
  heartbeatMs?: number;   // the watcher's OWN lease — a watcher that stops watching is itself watched
  budgetRef: string;      // the Ω-2 seam: every poll loop declares its budget or does not run
  action: WatchAction;
}

/** One raw observation the evaluator folds over. */
export interface RawObservation {
  at: number;
  crashed?: boolean;      // process scope: did the subject crash in this poll
  version?: number;       // signal scope: the observed version
  progress?: number;      // heartbeat scope: the last progress tick
}

export interface WatchObservation {
  kind: "watch.observation@1";
  watchId: string;
  at: number;
  observed: RawObservation;
  verdict: Verdict;
  refs: string[];
  sentence?: string;      // the named-refusal sentence when the verdict is flagged/escalated
}

export type RegisterOutcome = { ok: true; row: WatchRegistration } | { ok: false; code: string; sentence: string };

/** THE registration door (D-440): malformed watches refuse, named; nothing registers. */
export function validateRegistration(
  reg: WatchRegistration,
  existing: ReadonlySet<string>,
): RegisterOutcome {
  if (reg.scope !== "process" && reg.scope !== "signal" && reg.scope !== "heartbeat") {
    return { ok: false, code: WATCH_SCOPE_INVALID, sentence: `${WATCH_SCOPE_INVALID}: scope must be process|signal|heartbeat (got ${JSON.stringify(reg.scope)}) — a watch without a scope watches nothing (D-440, Ω-1)` };
  }
  if (typeof reg.subject !== "string" || reg.subject.length === 0) {
    return { ok: false, code: WATCH_SUBJECT_UNKNOWN, sentence: `${WATCH_SUBJECT_UNKNOWN}: the ${reg.scope} watch names no subject — a watch on nothing is a mood, not a registration (D-440)` };
  }
  if (typeof reg.budgetRef !== "string" || reg.budgetRef.length === 0) {
    return { ok: false, code: WATCH_BUDGET_UNDECLARED, sentence: `${WATCH_BUDGET_UNDECLARED}: ${reg.watchId} declares no budgetRef — every poll loop declares its budget or does not run (the Ω-2 seam, D-440)` };
  }
  if (typeof reg.watchId !== "string" || reg.watchId.length === 0) {
    return { ok: false, code: WATCH_SCOPE_INVALID, sentence: `${WATCH_SCOPE_INVALID}: watchId must be a non-empty string (D-440)` };
  }
  if (existing.has(reg.watchId)) {
    return { ok: false, code: WATCH_DUPLICATE, sentence: `${WATCH_DUPLICATE}: a watch with id ${reg.watchId} already exists — amend it (register a superseding watch), never re-use an id (D-440)` };
  }
  if (reg.predicate === null || typeof reg.predicate !== "object" || typeof reg.predicate.kind !== "string") {
    return { ok: false, code: WATCH_SCOPE_INVALID, sentence: `${WATCH_SCOPE_INVALID}: the predicate must be typed (crash-delta | version-bump | no-progress) (D-440)` };
  }
  return { ok: true, row: reg };
}

/**
 * THE predicate evaluation (D-440) — a PURE fold over the observation rows.
 * Order-independent within the declared window; the late observer flags on
 * FIRST SIGHT (the D-331 rule generalized): a watch registered after the
 * subject is already degraded does not wait N polls to say so.
 */
export function evaluate(
  reg: WatchRegistration,
  history: readonly RawObservation[],
  now: number,
): WatchObservation {
  const observed = history[history.length - 1] ?? { at: now };
  const refs: string[] = [`${WATCH_NS}:${reg.watchId}`];
  const p = reg.predicate;
  if (p.kind === "crash-delta") {
    // the windowed crash rule (health.ts's law): crashes ≥ threshold within window polls
    const polls = history.slice(-p.window);
    const crashes = polls.filter((o) => o.crashed === true).length;
    const lateObserver = crashes >= p.threshold; // first sight already shows the pattern
    const flagged = crashes >= p.threshold;
    return {
      kind: "watch.observation@1", watchId: reg.watchId, at: now, observed,
      verdict: flagged ? (reg.action === "escalate" ? "escalated" : "flagged") : "quiet",
      refs,
      ...(flagged ? { sentence: `crash-delta: ${crashes} crash(es) within ${polls.length} poll(s) ≥ threshold ${p.threshold}${lateObserver ? " (flagged on first sight — the late observer does not re-learn what the window already shows)" : ""} (D-440)` } : {}),
    };
  }
  if (p.kind === "version-bump") {
    const versions = history.filter((o) => o.version !== undefined).map((o) => o.version!);
    const bumped = versions.length >= 2 && versions[versions.length - 1]! > versions[0]!;
    return {
      kind: "watch.observation@1", watchId: reg.watchId, at: now, observed,
      verdict: bumped ? (reg.action === "escalate" ? "escalated" : "flagged") : "quiet",
      refs,
      ...(bumped ? { sentence: `version-bump: ${reg.subject} moved ${versions[0]} → ${versions[versions.length - 1]} across ${versions.length} observation(s) (D-440)` } : {}),
    };
  }
  // no-progress (the D-435 stall rule generalized)
  const last = history[history.length - 1];
  const stalled = last !== undefined && last.progress !== undefined && now - last.progress > p.stallDeadlineMs;
  return {
    kind: "watch.observation@1", watchId: reg.watchId, at: now, observed,
    verdict: stalled ? (reg.action === "escalate" ? "escalated" : "flagged") : "quiet",
    refs,
    ...(stalled ? { sentence: `no-progress: ${reg.subject} silent for ${now - (last?.progress ?? now)}ms > stallDeadlineMs ${p.stallDeadlineMs} (D-440)` } : {}),
  };
}

export interface LeaseVerdict {
  expired: boolean;
  observation: WatchObservation | null;
}

/** THE lease (D-440): a watcher silent past its own heartbeatMs is itself watched. */
export function leaseCheck(
  reg: WatchRegistration,
  lastWatcherHeartbeat: number | null,
  now: number,
): LeaseVerdict {
  if (reg.heartbeatMs === undefined) return { expired: false, observation: null };
  if (lastWatcherHeartbeat === null) return { expired: false, observation: null };
  const silent = now - lastWatcherHeartbeat;
  if (silent <= reg.heartbeatMs) return { expired: false, observation: null };
  return {
    expired: true,
    observation: {
      kind: "watch.observation@1", watchId: reg.watchId, at: now, observed: { at: now },
      verdict: "flagged", refs: [`${WATCH_NS}:${reg.watchId}:lease`],
      sentence: `${WATCH_LEASE_EXPIRED}: the watcher for ${reg.subject} has been silent ${silent}ms > its own lease ${reg.heartbeatMs}ms — a watcher that stops watching is itself watched, and the subject renders flagged (D-440, Ω-1)`,
    },
  };
}

/** The headless listing: text, sorted by verdict then id. */
export function renderWatchList(rows: readonly WatchObservation[]): string {
  const sorted = [...rows].sort((a, b) => {
    const rank = (v: Verdict) => (v === "escalated" ? 0 : v === "flagged" ? 1 : 2);
    return rank(a.verdict) - rank(b.verdict) || (a.watchId < b.watchId ? -1 : 1);
  });
  const lines = [`watch.list — ${rows.length} observation(s), escalated first`];
  for (const o of sorted) {
    lines.push(`  ${o.verdict.padEnd(9)} ${o.watchId} at ${o.at}${o.sentence !== undefined ? ` — ${o.sentence}` : ""}`);
  }
  return lines.join("\n");
}

/** The in-plugin registry (ring-first; the vault mirror rides port caps). */
export class WatchRegistry {
  private regs = new Map<string, WatchRegistration>();
  private history = new Map<string, RawObservation[]>();
  private watcherBeats = new Map<string, number>();

  register(reg: WatchRegistration): RegisterOutcome {
    const v = validateRegistration(reg, new Set(this.regs.keys()));
    if (!v.ok) return v;
    this.regs.set(reg.watchId, v.row);
    return v;
  }

  record(watchId: string, obs: RawObservation): void {
    const list = this.history.get(watchId) ?? [];
    list.push(obs);
    this.history.set(watchId, list);
  }

  watcherBeat(watchId: string, at: number): void {
    this.watcherBeats.set(watchId, at);
  }

  sweep(now: number): WatchObservation[] {
    const out: WatchObservation[] = [];
    for (const reg of this.regs.values()) {
      const lease = leaseCheck(reg, this.watcherBeats.get(reg.watchId) ?? null, now);
      if (lease.expired && lease.observation !== null) {
        out.push(lease.observation);
        continue;
      }
      out.push(evaluate(reg, this.history.get(reg.watchId) ?? [], now));
    }
    return out;
  }

  list(): string[] {
    return [...this.regs.keys()].sort();
  }
}
