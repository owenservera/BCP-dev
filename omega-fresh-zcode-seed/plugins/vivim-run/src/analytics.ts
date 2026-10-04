// vivim-run/src/analytics.ts (D-445, Ω-5 — the analytics substrate, re-materialized spec paper D-429)
//
// Observation without surveillance (§29): system events and per-namespace
// counters as retention-lawed vault rows — regenerable by replay, attributed
// for accountability, and constitutionally barred from measuring human
// attention. The fold is the truth, never stored: a stored counter that
// disagrees with its own replay is a ledgered FINDING, never an overwrite.
import { createHash } from "node:crypto";

export const ANALYTICS_EVENT_NS = "analytics.event";     // retention: per class (default system-events-90d; ceremony/governor forever)
export const ANALYTICS_COUNTER_NS = "analytics.counter"; // retention: analytics-counters-1y (regenerable caches)

export const ANALYTICS_ATTENTION_REFUSED = "ANALYTICS_ATTENTION_REFUSED";
export const ANALYTICS_RETENTION_UNDECLARED = "ANALYTICS_RETENTION_UNDECLARED";
export const ANALYTICS_DIGEST_MISMATCH = "ANALYTICS_DIGEST_MISMATCH";
export const ANALYTICS_NS_UNKNOWN = "ANALYTICS_NS_UNKNOWN";

/** The typed SYSTEM-event vocabulary (spec §3): an event's subject must be a
 *  system happening — invoked · refused · quarantined · budget-exhausted ·
 *  suspended · rotated · paired · flagged. */
export const EVENT_KINDS = ["invoked", "refused", "quarantined", "budget-exhausted", "suspended", "rotated", "paired", "flagged"] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

/** Retention classes (spec §3/§4): a namespace that cannot say what it forgets
 *  is refused — the retention column is load-bearing, not decorative. */
export type RetentionClass = "system-events-90d" | "forever" | "analytics-counters-1y";

export interface EventFamily {
  eventNs: string;                  // the event family's namespace
  retention: RetentionClass | "";   // "" = undeclared → the sink refuses the row
  shredAfterMs: number | null;      // the shred schedule; null = forever
}

export const DAY_MS = 24 * 60 * 60 * 1000;

/** The declared families from row one (spec §4): system-class events default
 *  system-events-90d; ceremony and governor events are forever. */
export const DEFAULT_FAMILIES: EventFamily[] = [
  { eventNs: "system", retention: "system-events-90d", shredAfterMs: 90 * DAY_MS },
  { eventNs: "op", retention: "system-events-90d", shredAfterMs: 90 * DAY_MS },
  { eventNs: "ns", retention: "system-events-90d", shredAfterMs: 90 * DAY_MS },
  { eventNs: "compartment", retention: "system-events-90d", shredAfterMs: 90 * DAY_MS },
  { eventNs: "ceremony", retention: "forever", shredAfterMs: null },
  { eventNs: "governor", retention: "forever", shredAfterMs: null },
];

/** §29's crown refusal, mechanical: an event whose subject is a human's
 *  attention, gaze, or interaction cadence is refused AT WRITE. The subject
 *  vocabulary (eventNs + kind) is the door; payloads are digests, not subjects. */
const ATTENTION_RE = /gaze|attention|dwell|cadence|engagement|watch-?time|screen-?time|eye-?track|scroll|keystroke|click-?stream|tap-?stream/i;
export function isAttentionShaped(eventNs: string, kind: string): boolean {
  return ATTENTION_RE.test(`${eventNs} ${kind}`);
}

export interface ObservationRow {
  eventNs: string;
  kind: string;             // the typed system-event vocabulary
  principal?: string;       // attribution for accountability — never interaction cadence
  at: number;
  payloadDigest: string;    // sha256 over the canonical payload — the row's evidence tie
  shreddedAt?: number;      // the Ω-0.5 tombstone: shred replaces, never deletes
  retentionAtShred?: string; // the class under which the row was shredded
}

export interface CounterRow {
  counterId: string;               // count:<eventNs>
  ns: string;                      // the event family this counter folds
  window: { from: number; to: number };
  counts: Record<string, number>;  // by kind, sorted keys (canonical)
  basis: { from: number; to: number; inputHash: string }; // REGENERABLE by replay — a cache of the fold, never authority
  shreddedEvents?: number;         // tombstoned rows in-window (the defined-absence witness)
  absent?: boolean;                // defined-absence: every source row shredded — never a fabricated zero
  digest: string;                  // the counter row's own digest (drift detection)
}

export interface Finding { code: string; sentence: string; at: number; counterId?: string }

// ---- digests (the badge precedent: canonical JSON, sorted keys) ----

/** Deterministic JSON (sorted keys) — the digest foundation. */
export function canonicalJson(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonicalJson).join(",")}]`;
  if (v !== null && typeof v === "object") {
    return `{${Object.keys(v as Record<string, unknown>).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson((v as Record<string, unknown>)[k])}`).join(",")}}`;
  }
  return JSON.stringify(v) ?? "null";
}

export function payloadDigestOf(payload: unknown): string {
  return `sha256:${createHash("sha256").update(canonicalJson(payload)).digest("hex")}`;
}

export function counterDigest(row: Omit<CounterRow, "digest">): string {
  return `sha256:${createHash("sha256").update(canonicalJson(row)).digest("hex")}`;
}

// ---- the event sink (pure core) ----

export type RecordOutcome = { ok: true; row: ObservationRow } | { ok: false; code: string; sentence: string };

/** THE event sink (D-445): the attention wall first (§29 enforced at write),
 *  then the vocabulary, then retention, then the digest — every refusal
 *  named, nothing silently dropped. */
export function recordEvent(
  spec: { eventNs: string; kind: string; principal?: string; at: number; payload?: unknown; claimedDigest?: string },
  families: ReadonlyMap<string, EventFamily>,
): RecordOutcome {
  if (isAttentionShaped(spec.eventNs, spec.kind)) {
    return { ok: false, code: ANALYTICS_ATTENTION_REFUSED, sentence: `${ANALYTICS_ATTENTION_REFUSED}: this event's subject (${spec.eventNs}/${spec.kind}) is a human's attention, not a system happening; the constitution does not measure gazes, and neither does this ledger (§29, D-445)` };
  }
  const family = families.get(spec.eventNs);
  if (family === undefined) {
    return { ok: false, code: ANALYTICS_NS_UNKNOWN, sentence: `${ANALYTICS_NS_UNKNOWN}: event namespace ${JSON.stringify(spec.eventNs)} is not in the system-event vocabulary; an observation from nowhere is a rumor with a timestamp (D-445)` };
  }
  if (family.retention === "") {
    return { ok: false, code: ANALYTICS_RETENTION_UNDECLARED, sentence: `${ANALYTICS_RETENTION_UNDECLARED}: event class ${JSON.stringify(spec.eventNs)} has no retention rule; a namespace that cannot say what it forgets is refused (§29's namespace law, D-445)` };
  }
  if (!(EVENT_KINDS as readonly string[]).includes(spec.kind)) {
    return { ok: false, code: ANALYTICS_NS_UNKNOWN, sentence: `${ANALYTICS_NS_UNKNOWN}: event kind ${JSON.stringify(spec.kind)} is not in the system-event vocabulary (${EVENT_KINDS.join("|")}); unnamed observations cannot be retained, so they cannot land (D-445)` };
  }
  const digest = payloadDigestOf(spec.payload ?? null);
  if (spec.claimedDigest !== undefined && spec.claimedDigest !== digest) {
    return { ok: false, code: ANALYTICS_DIGEST_MISMATCH, sentence: `${ANALYTICS_DIGEST_MISMATCH}: the event claims payload digest ${spec.claimedDigest} but its payload folds to ${digest}; a row that misreports its own evidence never lands (D-445)` };
  }
  return { ok: true, row: { eventNs: spec.eventNs, kind: spec.kind, ...(spec.principal !== undefined ? { principal: spec.principal } : {}), at: spec.at, payloadDigest: digest } };
}

// ---- the counter fold (pure, deterministic, regenerable) ----

/** THE counter fold (D-445): per-namespace counts over event rows — pure,
 *  deterministic, regenerable (same rows → byte-identical counters). Tombstoned
 *  rows do not count; a family whose in-window rows are ALL tombstones folds
 *  to defined-absence (absent: true), never a fabricated zero. */
export function foldCounters(events: readonly ObservationRow[], win: { from: number; to: number }): CounterRow[] {
  const byNs = new Map<string, { live: ObservationRow[]; shredded: number }>();
  for (const e of events) {
    if (e.at < win.from || e.at > win.to) continue;
    const slot = byNs.get(e.eventNs) ?? { live: [], shredded: 0 };
    if (e.shreddedAt !== undefined) slot.shredded += 1;
    else slot.live.push(e);
    byNs.set(e.eventNs, slot);
  }
  const out: CounterRow[] = [];
  for (const ns of [...byNs.keys()].sort()) {
    const slot = byNs.get(ns)!;
    const counts: Record<string, number> = {};
    for (const e of slot.live) counts[e.kind] = (counts[e.kind] ?? 0) + 1;
    const sortedCounts: Record<string, number> = {};
    for (const k of Object.keys(counts).sort()) sortedCounts[k] = counts[k]!;
    // inputHash over the sorted live digests — order-independent, replay-stable
    const inputHash = `sha256:${createHash("sha256").update(canonicalJson(slot.live.map((e) => e.payloadDigest).sort())).digest("hex")}`;
    const base = {
      counterId: `count:${ns}`,
      ns,
      window: { from: win.from, to: win.to },
      counts: sortedCounts,
      basis: { from: win.from, to: win.to, inputHash },
      ...(slot.shredded > 0 ? { shreddedEvents: slot.shredded } : {}),
      ...(slot.live.length === 0 ? { absent: true as const } : {}),
    };
    out.push({ ...base, digest: counterDigest(base) });
  }
  return out;
}

// ---- the renders (text before pixels; one fold renders, identically everywhere) ----

export function renderCounter(row: CounterRow): string {
  const win = row.window; // the spec's counter shape carries `window` — the property, never a DOM global
  const counts = Object.keys(row.counts).sort().map((k) => `${k}×${row.counts[k]}`).join(", ") || "(none)";
  const absence = row.absent === true ? "ABSENT (all source rows shredded — defined-absence, never a fabricated zero)" : counts;
  return `${row.counterId} [${win.from}..${win.to}] · ${absence} · basis ${row.basis.inputHash.slice(0, 22)}…${row.shreddedEvents !== undefined ? ` · ${row.shreddedEvents} shredded` : ""}`;
}

export function renderEvents(events: readonly ObservationRow[]): string {
  if (events.length === 0) return "(no events)";
  return events
    .map((e) => `${e.at} ${e.eventNs}/${e.kind}${e.principal !== undefined ? ` by ${e.principal}` : ""} · ${e.payloadDigest.slice(0, 22)}…${e.shreddedAt !== undefined ? ` · SHREDDED ${e.shreddedAt} (${e.retentionAtShred ?? "?"})` : ""}`)
    .join("\n");
}

// ---- the in-plugin registry (the vault mirror rides port caps, ring-first) ----

/** The analytics registry: events (append-only), families (retention-lawed),
 *  counters (the CACHE of the fold — never authority), findings (the ledger). */
export class AnalyticsRegistry {
  private families = new Map<string, EventFamily>(DEFAULT_FAMILIES.map((f) => [f.eventNs, f]));
  private events: ObservationRow[] = [];
  private counters = new Map<string, CounterRow>();
  private findingsLedger: Finding[] = [];

  /** Declare a family: retention must be said, or the declaration is refused. */
  declareFamily(spec: { eventNs: string; retention: RetentionClass | "" }): { ok: true; family: EventFamily } | { ok: false; code: string; sentence: string } {
    if (spec.retention === "") {
      return { ok: false, code: ANALYTICS_RETENTION_UNDECLARED, sentence: `${ANALYTICS_RETENTION_UNDECLARED}: family ${JSON.stringify(spec.eventNs)} declares no retention; a namespace that cannot say what it forgets is refused (§29's namespace law, D-445)` };
    }
    const family: EventFamily = { eventNs: spec.eventNs, retention: spec.retention, shredAfterMs: spec.retention === "forever" ? null : spec.retention === "system-events-90d" ? 90 * DAY_MS : 365 * DAY_MS };
    this.families.set(spec.eventNs, family);
    return { ok: true, family };
  }

  /** THE emit door (analytics.record@1): a row or a named refusal — and the
   *  attention refusal itself is logged as a SYSTEM event, never as an
   *  attention row (§8.2). */
  record(spec: { eventNs: string; kind: string; principal?: string; at?: number; payload?: unknown; claimedDigest?: string }): RecordOutcome {
    const at = spec.at ?? Date.now();
    const out = recordEvent({ ...spec, at }, this.families);
    if (!out.ok) {
      if (out.code === ANALYTICS_ATTENTION_REFUSED) {
        const logged = recordEvent({ eventNs: "system", kind: "refused", at, payload: { refused: out.code, subject: `${spec.eventNs}/${spec.kind}` } }, this.families);
        if (logged.ok) this.events.push(logged.row); // the mirror of the D-435 law: the refusal is ledgered
      }
      return out;
    }
    this.events.push(out.row);
    return out;
  }

  /** The observation read (analytics.query@1): filter + headless render. */
  query(spec: { eventNs?: string; kind?: string; from?: number; to?: number; limit?: number }): { events: ObservationRow[]; total: number; rendered: string } {
    const events = this.events.filter((e) =>
      (spec.eventNs === undefined || e.eventNs === spec.eventNs) &&
      (spec.kind === undefined || e.kind === spec.kind) &&
      (spec.from === undefined || e.at >= spec.from) &&
      (spec.to === undefined || e.at <= spec.to));
    const limited = spec.limit !== undefined && Number.isFinite(spec.limit) ? events.slice(0, Math.max(0, spec.limit)) : events;
    return { events: limited, total: events.length, rendered: renderEvents(limited) };
  }

  /** The fold door (analytics.counters@1's truth source): pure over the rows. */
  fold(win: { from: number; to: number }): CounterRow[] {
    return foldCounters(this.events, win);
  }

  /** Read (or lazily fold) one counter: ALWAYS carries basis.inputHash; a
   *  stored row that disagrees with its own replay is a finding — never
   *  served, never overwritten (the fold is the truth). */
  counter(ns: string, win: { from: number; to: number }): { ok: true; row: CounterRow } | { ok: false; code: string; sentence: string; truth: CounterRow | null } {
    const refolded = this.fold(win).find((c) => c.ns === ns) ?? null;
    const cached = this.counters.get(`count:${ns}`);
    if (cached !== undefined) {
      if (cached.digest !== counterDigest(cached) || refolded === null || cached.digest !== refolded.digest) {
        const sentence = `${ANALYTICS_DIGEST_MISMATCH}: stored counter count:${ns} disagrees with its own replay; the fold is the truth and the drift is a finding, never an overwrite (D-445)`;
        this.findingsLedger.push({ code: ANALYTICS_DIGEST_MISMATCH, sentence, at: Date.now(), counterId: `count:${ns}` });
        return { ok: false, code: ANALYTICS_DIGEST_MISMATCH, sentence, truth: refolded };
      }
      return { ok: true, row: cached };
    }
    if (refolded === null) {
      return { ok: false, code: ANALYTICS_NS_UNKNOWN, sentence: `${ANALYTICS_NS_UNKNOWN}: no observation rows fold a counter for namespace ${JSON.stringify(ns)} in the window — absence is data, not a zero (D-445)`, truth: null };
    }
    this.counters.set(refolded.counterId, refolded); // the lazy fold caches the truth
    return { ok: true, row: refolded };
  }

  /** The counters view (analytics.counters@1): the fold served, drift named. */
  countersView(win: { from: number; to: number }): { counters: CounterRow[]; findings: Array<{ code: string; sentence: string; truth: CounterRow | null }>; rendered: string } {
    const counters: CounterRow[] = [];
    const findings: Array<{ code: string; sentence: string; truth: CounterRow | null }> = [];
    for (const c of this.fold(win)) {
      const read = this.counter(c.ns, win);
      if (read.ok) counters.push(read.row);
      else findings.push({ code: read.code, sentence: read.sentence, truth: read.truth });
    }
    const rendered = [...counters.map(renderCounter), ...findings.map((f) => `FINDING ${f.code}: ${f.sentence}`)].join("\n") || "(no counters in window)";
    return { counters, findings, rendered };
  }

  /** The vault mirror's write-back door: stored counter rows arrive here (the
   *  cache of the fold — never authority; drift is checked on every read). */
  storeCounter(row: CounterRow): void {
    this.counters.set(row.counterId, row);
  }

  /** Delete the cached counter rows — the regenerability proof's lever: the
   *  events are the evidence, the cache is regenerable by replay. */
  dropCounters(): void {
    this.counters.clear();
  }

  /** The shred (Ω-0.5 tombstone discipline): aged event classes shred on
   *  schedule — rows become tombstones, never deletes; forever-classes never
   *  shred. The counter cache is invalidated (a cache, not evidence). */
  shred(now: number): number {
    let n = 0;
    this.events = this.events.map((e) => {
      if (e.shreddedAt !== undefined) return e;
      const family = this.families.get(e.eventNs);
      if (family === undefined || family.shredAfterMs === null) return e;
      if (now - e.at >= family.shredAfterMs) {
        n += 1;
        return { ...e, shreddedAt: now, retentionAtShred: family.retention };
      }
      return e;
    });
    this.counters.clear(); // the ground truth moved — the cache follows, the rows never do
    return n;
  }

  /** The findings ledger (drift is a finding — queryable, never dropped). */
  findings(): readonly Finding[] {
    return this.findingsLedger;
  }
}
