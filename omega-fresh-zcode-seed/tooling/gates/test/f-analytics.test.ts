// tooling/gates/test/f-analytics.test.ts — the F-ANALYTICS falsifier (D-445, Ω-5).
// Generated as a RED stub by `omega:loop --stub D-445`, then implemented.
//  F-ANALYTICS.1 replay-equality — fold 10,000 recorded events → counters; delete the counter rows; refold → byte-identical results, ×50
//  F-ANALYTICS.2 the-attention-wall — gaze/cadence-shaped events refuse with the sentence; nothing lands; the refusal itself is logged as a SYSTEM event, not as an attention event
//  F-ANALYTICS.3 retention-honesty — aged event classes shred on schedule with tombstones (Ω-0.5); post-shred folds return defined-absence, never fabricated zeros
//  F-ANALYTICS.4 drift-is-a-finding — tamper a stored counter → the next read names the drift (ANALYTICS_DIGEST_MISMATCH) rather than serving it
//  F-ANALYTICS.5 refusal-proves — each register code fired by a planted violation
//  F-ANALYTICS.6 headless — 1–5 daemon-only; counters render as text
//  F-ANALYTICS.7 loud-failure — zero unledgered drops — a failed emit is a named refusal or a mirror-failed row
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  AnalyticsRegistry, DAY_MS, EVENT_KINDS, canonicalJson, counterDigest, foldCounters, isAttentionShaped, recordEvent, renderCounter, renderEvents,
  ANALYTICS_ATTENTION_REFUSED, ANALYTICS_DIGEST_MISMATCH, ANALYTICS_NS_UNKNOWN, ANALYTICS_RETENTION_UNDECLARED,
} from "../../../plugins/vivim-run/src/analytics.ts";

describe("F-ANALYTICS.1 (replay-equality)", () => {
  test("fold 10,000 recorded events → counters; delete the counter rows; refold → byte-identical results, ×50", () => {
    const reg = new AnalyticsRegistry();
    const familiesList = ["system", "op", "ceremony", "governor"];
    // 10,000 recorded events across the declared families and the full kind vocabulary
    for (let i = 0; i < 10_000; i++) {
      const out = reg.record({ eventNs: familiesList[i % 4]!, kind: EVENT_KINDS[i % EVENT_KINDS.length]!, at: 1000 + i, payload: { i } });
      if (!out.ok) throw new Error(`event ${i} refused: ${out.sentence}`);
    }
    const win = { from: 0, to: 20_000 };
    const first = reg.fold(win);
    expect(first.length).toBe(4); // one counter per family
    const bytes = canonicalJson(first);
    // ×50: delete the cached counter rows, refold — byte-identical every time
    for (let round = 0; round < 50; round++) {
      reg.dropCounters(); // the cache is never authority
      expect(canonicalJson(reg.fold(win))).toBe(bytes);
    }
    // the pure fold over the same rows agrees (the two doors, one truth)
    expect(canonicalJson(foldCounters(reg.query({ from: 0, to: 20_000 }).events, win))).toBe(bytes);
    // and through the read door: lazily cached, same bytes, inputHash always carried
    const view = reg.countersView(win);
    expect(view.findings).toEqual([]);
    expect(canonicalJson(view.counters)).toBe(bytes);
    for (const c of view.counters) expect(c.basis.inputHash.startsWith("sha256:")).toBe(true);
  });
});

describe("F-ANALYTICS.2 (the-attention-wall)", () => {
  test("gaze/cadence-shaped events refuse with the sentence; nothing lands; the refusal itself is logged as a SYSTEM event, not as an attention event", () => {
    const reg = new AnalyticsRegistry();
    const attempts = [
      { eventNs: "system", kind: "gaze" },
      { eventNs: "system", kind: "attention-span" },
      { eventNs: "attention", kind: "invoked" },
      { eventNs: "system", kind: "scroll-cadence" },
      { eventNs: "ui", kind: "keystroke" },
      { eventNs: "system", kind: "dwell-time" },
    ];
    for (const a of attempts) {
      const out = reg.record({ ...a, at: 1000, payload: { note: "planted" } });
      expect(out.ok).toBe(false);
      if (!out.ok) {
        expect(out.code).toBe(ANALYTICS_ATTENTION_REFUSED);
        expect(out.sentence).toContain("does not measure gazes");
      }
    }
    // nothing attention-shaped landed; what landed is exactly one SYSTEM refusal row per attempt
    const q = reg.query({ from: 0, to: 2000 });
    expect(q.total).toBe(attempts.length);
    expect(q.events.every((e) => e.eventNs === "system" && e.kind === "refused")).toBe(true);
    expect(q.events.some((e) => isAttentionShaped(e.eventNs, e.kind))).toBe(false);
    // the counter fold counts the refusals as system events — the wall is visible, never the gaze
    const sys = reg.fold({ from: 0, to: 2000 }).find((c) => c.ns === "system")!;
    expect(sys.counts["refused"]).toBe(attempts.length);
  });
});

describe("F-ANALYTICS.3 (retention-honesty)", () => {
  test("aged event classes shred on schedule with tombstones; post-shred folds return defined-absence, never fabricated zeros", () => {
    const reg = new AnalyticsRegistry();
    // system events (90d) vs ceremony events (forever)
    for (let i = 0; i < 40; i++) expect(reg.record({ eventNs: "system", kind: "invoked", at: 1000 + i, payload: { i } }).ok).toBe(true);
    for (let i = 0; i < 7; i++) expect(reg.record({ eventNs: "ceremony", kind: "rotated", at: 1000 + i, payload: { i } }).ok).toBe(true);
    // before the shred: both families fold
    const before = reg.fold({ from: 0, to: 10 * DAY_MS });
    expect(before.find((c) => c.ns === "system")!.counts["invoked"]).toBe(40);
    expect(before.find((c) => c.ns === "ceremony")!.counts["rotated"]).toBe(7);
    // the shred at now = 1000 + 91d: system rows are aged past 90d; ceremony rows are forever
    const now = 1000 + 91 * DAY_MS;
    expect(reg.shred(now)).toBe(40);
    // tombstones, never deletes: the rows still exist, carrying shreddedAt + the retention class
    const q = reg.query({ eventNs: "system" });
    expect(q.total).toBe(40);
    expect(q.events.every((e) => e.shreddedAt === now && e.retentionAtShred === "system-events-90d")).toBe(true);
    // post-shred fold: defined-absence for the shredded class — never a fabricated zero
    const after = reg.fold({ from: 0, to: now + 1 });
    const sys = after.find((c) => c.ns === "system")!;
    expect(sys.absent).toBe(true);
    expect(sys.counts).toEqual({});
    expect(sys.shreddedEvents).toBe(40);
    expect(renderCounter(sys)).toContain("defined-absence");
    // the forever class is untouched — and a later shred changes nothing
    const cer = after.find((c) => c.ns === "ceremony")!;
    expect(cer.absent).toBeUndefined();
    expect(cer.counts["rotated"]).toBe(7);
    expect(reg.shred(now + 10 * DAY_MS)).toBe(0);
  });
});

describe("F-ANALYTICS.4 (drift-is-a-finding)", () => {
  test("tamper a stored counter → the next read names the drift (ANALYTICS_DIGEST_MISMATCH) rather than serving it", () => {
    const reg = new AnalyticsRegistry();
    for (let i = 0; i < 25; i++) {
      expect(reg.record({ eventNs: "op", kind: i % 2 === 0 ? "invoked" : "refused", at: 1000 + i, payload: { i } }).ok).toBe(true);
    }
    const win = { from: 0, to: 200_000 };
    // the honest read caches the fold
    const honest = reg.counter("op", win);
    expect(honest.ok).toBe(true);
    const truth = honest.ok ? honest.row : null;
    expect(truth).not.toBeNull();
    if (truth === null) return;
    // the tamper: mutate the stored row's counts (a stale digest)
    reg.storeCounter({ ...truth, counts: { ...truth.counts, invoked: 999 } });
    const read = reg.counter("op", win);
    expect(read.ok).toBe(false);
    if (!read.ok) {
      expect(read.code).toBe(ANALYTICS_DIGEST_MISMATCH);
      expect(read.sentence).toContain("never an overwrite");
      expect(read.truth).not.toBeNull(); // the fold is the truth — reported, never overwritten
    }
    // a tamperer who recomputes the row's own digest is still caught by the replay
    const clever = { ...truth, counts: { ...truth.counts, invoked: 999 } };
    reg.storeCounter({ ...clever, digest: counterDigest(clever) });
    const read2 = reg.counter("op", win);
    expect(read2.ok).toBe(false);
    if (!read2.ok) expect(read2.code).toBe(ANALYTICS_DIGEST_MISMATCH);
    // the finding is LEDGERED (queryable), and the tampered row was never silently repaired
    expect(reg.findings().some((f) => f.code === ANALYTICS_DIGEST_MISMATCH)).toBe(true);
    expect(reg.findings().length).toBeGreaterThanOrEqual(2);
  });
});

describe("F-ANALYTICS.5 (refusal-proves)", () => {
  test("each register code fired by a planted violation", () => {
    const reg = new AnalyticsRegistry();
    const fired = new Set<string>();
    const refuse = (out: { ok: boolean; code?: string }): string => {
      expect(out.ok).toBe(false);
      return out.code ?? "(none)";
    };
    // ANALYTICS_ATTENTION_REFUSED — the crown refusal (§29 at write)
    fired.add(refuse(reg.record({ eventNs: "system", kind: "gaze", at: 1, payload: {} })));
    // ANALYTICS_NS_UNKNOWN — the namespace is not in the vocabulary
    fired.add(refuse(reg.record({ eventNs: "telemetry", kind: "invoked", at: 1, payload: {} })));
    // ANALYTICS_NS_UNKNOWN — the kind is not in the vocabulary
    fired.add(refuse(reg.record({ eventNs: "system", kind: "vibes", at: 1, payload: {} })));
    // ANALYTICS_RETENTION_UNDECLARED — a declaration that cannot say what it forgets
    fired.add(refuse(reg.declareFamily({ eventNs: "experiment", retention: "" })));
    // ... and the emit door agrees: a retention-less family refuses the row (the pure core's planted violation)
    fired.add(refuse(recordEvent({ eventNs: "experiment", kind: "invoked", at: 1, payload: {} }, new Map([["experiment", { eventNs: "experiment", retention: "" as const, shredAfterMs: 90 * DAY_MS }]]))));
    // ANALYTICS_DIGEST_MISMATCH — a row that misreports its own evidence (drift covered deeper in F-ANALYTICS.4)
    fired.add(refuse(reg.record({ eventNs: "system", kind: "invoked", at: 1, payload: { a: 1 }, claimedDigest: "sha256:deadbeef" })));
    expect(fired).toEqual(new Set([ANALYTICS_ATTENTION_REFUSED, ANALYTICS_RETENTION_UNDECLARED, ANALYTICS_DIGEST_MISMATCH, ANALYTICS_NS_UNKNOWN]));
    // the module carries the exact register
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "analytics.ts"), "utf-8");
    for (const c of [ANALYTICS_ATTENTION_REFUSED, ANALYTICS_RETENTION_UNDECLARED, ANALYTICS_DIGEST_MISMATCH, ANALYTICS_NS_UNKNOWN]) {
      expect(src.includes(c)).toBe(true);
    }
  });
});

describe("F-ANALYTICS.6 (headless)", () => {
  test("1–5 daemon-only; counters render as text", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "analytics.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    // counters render as text: one fold renders, byte-identical on every surface
    const reg = new AnalyticsRegistry();
    expect(reg.record({ eventNs: "governor", kind: "flagged", at: 5, payload: { why: "test" } }).ok).toBe(true);
    const [c] = reg.fold({ from: 0, to: 10 });
    expect(c).toBeDefined();
    const text = renderCounter(c!);
    expect(text).toContain("count:governor");
    expect(text).toContain("flagged×1");
    expect(renderCounter(c!)).toBe(text);
    // events render as text too
    const rendered = renderEvents(reg.query({}).events);
    expect(rendered).toContain("governor/flagged");
    expect(rendered).toContain("sha256:");
  });
});

describe("F-ANALYTICS.7 (loud-failure)", () => {
  test("zero unledgered drops — a failed emit is a named refusal or a mirror-failed row", () => {
    const reg = new AnalyticsRegistry();
    // every emit outcome is a row or a named refusal — never silence
    const outcomes = [
      reg.record({ eventNs: "system", kind: "invoked", at: 1, payload: {} }), // lands
      reg.record({ eventNs: "system", kind: "gaze", at: 2, payload: {} }),    // refused — and the refusal ledgered as a system row
      reg.record({ eventNs: "ghost", kind: "invoked", at: 3, payload: {} }),  // refused, named
    ];
    for (const o of outcomes) {
      if (o.ok) expect(o.row.payloadDigest.startsWith("sha256:")).toBe(true);
      else {
        expect(o.code.length).toBeGreaterThan(0);
        expect(o.sentence.length).toBeGreaterThan(20);
      }
    }
    // accounting closes: 1 landed event + 1 ledgered refusal row; the ghost drop is a NAMED refusal
    expect(reg.query({}).total).toBe(2);
    expect(reg.query({ kind: "refused" }).total).toBe(1);
    // the drift findings are ledgered too (F-ANALYTICS.4's law at this seat) — nothing falls on the floor
    expect(reg.findings()).toEqual([]);
    // zero silent catches in the source
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "analytics.ts"), "utf-8");
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false);
  });
});
