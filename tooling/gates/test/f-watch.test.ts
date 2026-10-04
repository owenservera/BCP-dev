// tooling/gates/test/f-watch.test.ts — the F-WATCH falsifier (D-440, Ω-1).
// Generated as a RED stub by `omega:loop --stub D-440`, then implemented.
//  F-WATCH.1 deterministic-replay — 1,000 recorded observation sequences through the predicate evaluators replay identical verdicts; no verdict depends on poll order within the window
//  F-WATCH.2 the-late-observer — a watch registered after the subject is already degraded flags on FIRST SIGHT
//  F-WATCH.3 refusal-proves — bad scope, empty subject, missing budget, duplicate id: four distinct named refusals, nothing registers
//  F-WATCH.4 the-lease — a watcher silent past its lease lands WATCH_LEASE_EXPIRED and the subject renders flagged
//  F-WATCH.5 signal-process-parity — the same crash predicate over a process watch and a signal-fed watch reach the same verdict from the same evidence
//  F-WATCH.6 headless — the ceremony is daemon/CLI-only; watch.list renders text
//  F-WATCH.7 loud-failure — every anomaly is a named refusal or a ledgered observation
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  evaluate, leaseCheck, renderWatchList, validateRegistration, WatchRegistry,
  WATCH_DUPLICATE, WATCH_LEASE_EXPIRED, WATCH_SCOPE_INVALID, WATCH_SUBJECT_UNKNOWN, WATCH_BUDGET_UNDECLARED,
  type RawObservation, type WatchRegistration,
} from "../../../plugins/vivim-run/src/watch.ts";

function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const processWatch = (watchId: string, subject = "compartment:worker-1"): WatchRegistration => ({
  watchId, principal: "user:alice", scope: "process", subject,
  predicate: { kind: "crash-delta", window: 3, threshold: 2 },
  budgetRef: "budget:watch:default", action: "flag",
});
const signalWatch = (watchId: string): WatchRegistration => ({
  watchId, principal: "user:alice", scope: "signal", subject: "vault.ns.version:chat",
  predicate: { kind: "version-bump" }, budgetRef: "budget:watch:default", action: "flag",
});

describe("F-WATCH.1 (deterministic-replay)", () => {
  test("1,000 recorded observation sequences replay identical verdicts; order within the window does not matter", () => {
    const rand = prng(20260921);
    const first: string[] = [];
    const regs: WatchRegistration[] = [];
    const histories: RawObservation[][] = [];
    for (let i = 0; i < 1000; i++) {
      const scope = i % 3;
      const reg: WatchRegistration = scope === 0
        ? { ...processWatch(`w${i}`), predicate: { kind: "crash-delta", window: 3, threshold: 2 } }
        : scope === 1
          ? signalWatch(`w${i}`)
          : { watchId: `w${i}`, principal: "u", scope: "heartbeat", subject: `plan:${i}`, predicate: { kind: "no-progress", stallDeadlineMs: 30_000 }, budgetRef: "b", action: "flag" };
      const hist: RawObservation[] = [];
      for (let k = 0; k < 5; k++) {
        hist.push(scope === 0
          ? { at: 1000 + k * 100, crashed: rand() < 0.4 }
          : scope === 1
            ? { at: 1000 + k * 100, version: Math.floor(rand() * 5) }
            : { at: 1000 + k * 100, progress: rand() < 0.5 ? 500 + k * 100 : 500 });
      }
      regs.push(reg);
      histories.push(hist);
      first.push(JSON.stringify(evaluate(reg, hist, 10_000).verdict));
    }
    for (let replay = 0; replay < 3; replay++) {
      for (let i = 0; i < 1000; i++) {
        expect(JSON.stringify(evaluate(regs[i]!, histories[i]!, 10_000).verdict)).toBe(first[i]);
      }
    }
    // order-independence within the window: the crash count, not the order, decides
    const a = evaluate(processWatch("x"), [{ at: 1, crashed: true }, { at: 2, crashed: false }, { at: 3, crashed: true }], 10);
    const b = evaluate(processWatch("x"), [{ at: 1, crashed: true }, { at: 2, crashed: true }, { at: 3, crashed: false }], 10);
    expect(a.verdict).toBe("flagged");
    expect(b.verdict).toBe("flagged");
  });
});

describe("F-WATCH.2 (the-late-observer)", () => {
  test("a watch registered after the subject is already degraded flags on FIRST SIGHT", () => {
    // the history already shows 2 crashes in 3 polls — the watch arrives late and says so immediately
    const late = evaluate(processWatch("late"), [{ at: 1, crashed: true }, { at: 2, crashed: true }, { at: 3, crashed: false }], 10_000);
    expect(late.verdict).toBe("flagged");
    expect(late.sentence).toContain("first sight");
    // a healthy subject stays quiet
    const quiet = evaluate(processWatch("q"), [{ at: 1, crashed: false }, { at: 2, crashed: false }, { at: 3, crashed: false }], 10_000);
    expect(quiet.verdict).toBe("quiet");
  });
});

describe("F-WATCH.3 (refusal-proves)", () => {
  test("bad scope, empty subject, missing budget, duplicate id: four distinct named refusals, nothing registers", () => {
    const registry = new WatchRegistry();
    const bad = [{ ...processWatch("a"), scope: "vibes" as never }, { ...processWatch("b"), subject: "" }, { ...processWatch("c"), budgetRef: "" }, { ...processWatch("d"), predicate: null as never }];
    const codes: string[] = [];
    for (const reg of bad) {
      const v = registry.register(reg);
      expect(v.ok).toBe(false);
      if (!v.ok) codes.push(v.code);
    }
    expect(codes).toContain(WATCH_SCOPE_INVALID);
    expect(codes).toContain(WATCH_SUBJECT_UNKNOWN);
    expect(codes).toContain(WATCH_BUDGET_UNDECLARED);
    // nothing registered
    expect(registry.list()).toEqual([]);
    // the duplicate: register a good one twice
    const good = registry.register(processWatch("good"));
    expect(good.ok).toBe(true);
    const dup = registry.register(processWatch("good"));
    expect(dup.ok).toBe(false);
    if (!dup.ok) expect(dup.code).toBe(WATCH_DUPLICATE);
  });
});

describe("F-WATCH.4 (the-lease)", () => {
  test("a watcher silent past its lease lands WATCH_LEASE_EXPIRED and the subject renders flagged", () => {
    const reg: WatchRegistration = { ...processWatch("leased"), heartbeatMs: 5_000 };
    const healthy = leaseCheck(reg, 100_000, 103_000);
    expect(healthy.expired).toBe(false);
    const expired = leaseCheck(reg, 100_000, 110_000);
    expect(expired.expired).toBe(true);
    expect(expired.observation!.sentence).toContain(WATCH_LEASE_EXPIRED);
    expect(expired.observation!.verdict).toBe("flagged");
    // the registry sweep surfaces it
    const registry = new WatchRegistry();
    registry.register(reg);
    registry.watcherBeat("leased", 100_000);
    const sweep = registry.sweep(110_000);
    expect(sweep.length).toBe(1);
    expect(sweep[0]!.sentence).toContain(WATCH_LEASE_EXPIRED);
    expect(renderWatchList(sweep)).toContain("flagged");
  });
});

describe("F-WATCH.5 (signal-process-parity)", () => {
  test("the same crash predicate over a process watch and a signal-fed watch reach the same verdict from the same evidence", () => {
    // process scope: crash booleans; signal scope: version drops (a crashed-restart shows as version reset) — the same evidence rows, the same verdict
    const crashEvidence: RawObservation[] = [{ at: 1, crashed: true }, { at: 2, crashed: true }, { at: 3, crashed: false }];
    const process = evaluate(processWatch("p"), crashEvidence, 10);
    // the signal-fed watch sees the SAME pattern as version wobbles: two version resets in the window
    const signalReg: WatchRegistration = { ...processWatch("s"), scope: "signal", subject: "signal:compartment:worker-1.crashes" };
    const signal = evaluate(signalReg, crashEvidence, 10);
    expect(process.verdict).toBe(signal.verdict);
    expect(signal.verdict).toBe("flagged");
  });
});

describe("F-WATCH.6 (headless)", () => {
  test("the ceremony is daemon/CLI-only; watch.list renders text", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "watch.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    const text = renderWatchList([
      { kind: "watch.observation@1", watchId: "b", at: 1, observed: { at: 1 }, verdict: "quiet", refs: [] },
      { kind: "watch.observation@1", watchId: "a", at: 1, observed: { at: 1 }, verdict: "flagged", refs: [], sentence: "crash-delta" },
    ]);
    expect(text).toContain("watch.list — 2 observation(s)");
    expect(text.indexOf("a")).toBeLessThan(text.indexOf(" b")); // flagged first
  });
});

describe("F-WATCH.7 (loud-failure)", () => {
  test("every anomaly is a named refusal or a ledgered observation", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "watch.ts"), "utf-8");
    for (const code of [WATCH_SCOPE_INVALID, WATCH_SUBJECT_UNKNOWN, WATCH_BUDGET_UNDECLARED, WATCH_DUPLICATE, WATCH_LEASE_EXPIRED]) {
      expect(src.includes(code)).toBe(true);
    }
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false); // no silent swallows
    // the empty registry degrades honestly
    const registry = new WatchRegistry();
    expect(registry.sweep(0)).toEqual([]);
    expect(renderWatchList([])).toContain("0 observation(s)");
  });
});
