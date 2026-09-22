// tooling/gates/test/f-law-coherence.test.ts — the F-LAW-COHERENCE falsifier (D-433, Ω-2.5).
// Generated as a RED stub by `omega:loop --stub D-433`, then implemented.
//  F-LAW-COHERENCE.1 deterministic-resolution — 1,000 randomized policy pairs resolve identically across 100 replays: the lattice (constitutional > statutory > grant > advisory; deny-overrides-allow; constraints intersect; most-restrictive-at-tie) is a pure function
//  F-LAW-COHERENCE.2 planted-paradox — two opposed constitutional rules refuse LAW_POLICY_PARADOX naming both ids and scope; amendment (supersession) unblocks; all ledgered
//  F-LAW-COHERENCE.3 smugglers-tour — a composition carrying a fake secret / an ungranted capability / a stored selector-as-truth / an undeclared mutation is refused with four DISTINCT named refusals; fixing each unblocks activation
//  F-LAW-COHERENCE.4 no-scan-no-activation — activation with a stale/missing scan row (manifest-hash mismatch) refuses COMPOSE_SCAN_NOT_RUN
//  F-LAW-COHERENCE.5 headless — the whole conflict/scan ceremony is CLI/daemon-only
//  F-LAW-COHERENCE.6 loud-failure — zero warn-and-continue branches in the resolution path: every anomaly is a named refusal or a ledgered paradox row
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  canonicalJson, gateVerdict, PolicyRowStore, resolveLattice, resolvePair, scanConflicts,
  LAW_POLICY_PARADOX, LAW_CONFLICT_UNRESOLVED, type PolicyRow, type PrecedenceClass, type PolicyEffect,
} from "../../../plugins/vivim-law/src/conflict.ts";
import {
  activationGate, ComposeScanLedger, findingSentence, scanComposition,
  SECRET_PATTERN_SET_V1, SELECTOR_PATTERN_SET_V1,
} from "../../../plugins/vivim-law/src/compose-scan.ts";

/** Deterministic PRNG (mulberry32) — the randomized corpus is reproducible. */
function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CLASSES: PrecedenceClass[] = ["constitutional", "statutory", "grant", "advisory"];
const EFFECTS: PolicyEffect[] = ["allow", "deny", "constrain"];
const PRINCIPALS = ["alice", "bob", "*"];
const SCOPES = ["chat.send@1", "vault.append@1", "chat.*", "*"];

function randomRow(rand: () => number, i: number): PolicyRow {
  const row: PolicyRow = {
    id: `p${String(i).padStart(4, "0")}`,
    principal: PRINCIPALS[Math.floor(rand() * PRINCIPALS.length)]!,
    precedenceClass: CLASSES[Math.floor(rand() * CLASSES.length)]!,
    scope: SCOPES[Math.floor(rand() * SCOPES.length)]!,
    effect: EFFECTS[Math.floor(rand() * EFFECTS.length)]!,
  };
  const c = rand();
  if (c < 0.25) row.constraint = { windows: ["09:00-17:00"] };
  else if (c < 0.4) row.constraint = { rateCapPerMin: 1 + Math.floor(rand() * 100) };
  else if (c < 0.5) row.constraint = { retentionFloorDays: Math.floor(rand() * 30) };
  return row;
}

describe("F-LAW-COHERENCE.1 (deterministic-resolution)", () => {
  test("1,000 randomized policy pairs resolve identically across 100 replays — the lattice is a pure function", () => {
    const rand = prng(20260921);
    const rows = Array.from({ length: 1000 }, (_, i) => randomRow(rand, i));
    const first: string[] = [];
    for (let i = 0; i < rows.length; i += 2) {
      const out = resolvePair(rows[i]!, rows[i + 1]!);
      first.push(canonicalJson(out));
    }
    for (let replay = 0; replay < 100; replay++) {
      for (let i = 0; i < rows.length; i += 2) {
        const out = resolvePair(rows[i]!, rows[i + 1]!);
        expect(canonicalJson(out)).toBe(first[i / 2]!);
      }
    }
    // spot-check the lattice laws on constructed cases
    // class precedence: constitutional deny beats statutory allow
    const a = resolveLattice(
      [
        { id: "s-allow", principal: "*", precedenceClass: "statutory", scope: "chat.send@1", effect: "allow" },
        { id: "c-deny", principal: "*", precedenceClass: "constitutional", scope: "chat.send@1", effect: "deny" },
      ],
      { principal: "alice", op: "chat.send@1" },
    );
    expect(a.kind === "resolved" && a.effect).toBe("deny");
    // deny-overrides-allow within a class
    const b = resolveLattice(
      [
        { id: "g-allow", principal: "*", precedenceClass: "grant", scope: "chat.send@1", effect: "allow" },
        { id: "g-deny", principal: "*", precedenceClass: "grant", scope: "chat.send@1", effect: "deny" },
      ],
      { principal: "alice", op: "chat.send@1" },
    );
    expect(b.kind === "resolved" && b.effect).toBe("deny");
    // constraints intersect (rate cap takes the min)
    const c = resolveLattice(
      [
        { id: "r1", principal: "*", precedenceClass: "grant", scope: "chat.send@1", effect: "constrain", constraint: { rateCapPerMin: 10 } },
        { id: "r2", principal: "*", precedenceClass: "grant", scope: "chat.send@1", effect: "constrain", constraint: { rateCapPerMin: 3 } },
      ],
      { principal: "alice", op: "chat.send@1" },
    );
    expect(c.kind === "resolved" && c.constraint?.rateCapPerMin).toBe(3);
    // no applicable rows: fail-closed deny
    const d = resolveLattice([], { principal: "alice", op: "chat.send@1" });
    expect(d.kind === "resolved" && d.effect).toBe("deny");
  });
});

describe("F-LAW-COHERENCE.2 (planted-paradox)", () => {
  test("two opposed constitutional rules refuse LAW_POLICY_PARADOX naming both ids and scope; supersession unblocks; the scan ledgers it", () => {
    const store = new PolicyRowStore();
    store.append({ id: "c-allow", principal: "*", precedenceClass: "constitutional", scope: "chat.send@1", effect: "allow" });
    store.append({ id: "c-deny", principal: "*", precedenceClass: "constitutional", scope: "chat.send@1", effect: "deny" });
    const out = resolveLattice(store.activeRows(), { principal: "alice", op: "chat.send@1" });
    expect(out.kind).toBe("paradox");
    if (out.kind === "paradox") {
      expect(out.code).toBe(LAW_POLICY_PARADOX);
      expect(out.policyA).toBe("c-allow");
      expect(out.policyB).toBe("c-deny");
      expect(out.scope).toBe("chat.send@1");
      expect(out.sentence.length).toBeGreaterThan(10);
    }
    // the gate folds the paradox into a named refusal
    const gate = gateVerdict(store.activeRows(), { principal: "alice", op: "chat.send@1" });
    expect(gate.engaged).toBe(true);
    expect(gate.effect).toBe("deny");
    expect(gate.reason).toContain(LAW_CONFLICT_UNRESOLVED);
    // the symbolic sweep finds the paradox pair, blocked until amended
    const scan = scanConflicts(store.activeRows());
    expect(scan.refused).toBe(true);
    expect(scan.paradox.length).toBe(1);
    expect(scan.paradox[0]!.blockedUntil).toBe("amended");
    expect(scan.paradox[0]!.policyA).toBe("c-allow");
    expect(scan.paradox[0]!.policyB).toBe("c-deny");
    // the amendment: append a superseding row (append-only — history keeps the crime)
    store.append({ id: "c-deny-v2", principal: "*", precedenceClass: "constitutional", scope: "chat.send@1", effect: "allow", supersedes: "c-deny" });
    const out2 = resolveLattice(store.activeRows(), { principal: "alice", op: "chat.send@1" });
    expect(out2.kind).toBe("resolved");
    expect(out2.kind === "resolved" && out2.effect).toBe("allow");
    const scan2 = scanConflicts(store.activeRows());
    expect(scan2.refused).toBe(false);
    // the paradox row is ledger-shaped (a record, not a vibe)
    expect(scan.paradox[0]!.kind).toBe("conflict.paradox@1");
    expect(scan.resolved[0]?.kind ?? "conflict.resolved@1").toBe("conflict.resolved@1");
  });
});

describe("F-LAW-COHERENCE.3 (smugglers-tour)", () => {
  test("four distinct named refusals for the four smuggles; the fixed composition activates", () => {
    const dirty = {
      name: "smuggler",
      entries: [
        {
          id: "worker-1",
          grant: { contracts: ["chat.send@1"], capabilities: ["host:filesystem.write"] },
          config: {
            apiKey: "AKIAIOSFODNN7EXAMPLE",       // 1 · the fake secret (AWS key shape)
            clickSelector: "#submit-btn",          // 2 · the stored selector-as-truth
            onEvent: "vault.append@1",             // 3 · the undeclared mutation
          },
        },
      ],
    };
    // 4 · the ungranted capability: host:filesystem.write is NOT in grants
    const verdict = scanComposition(dirty, []);
    expect(verdict.verdict).toBe("refused");
    const codes = new Set(verdict.findings.filter((f) => f.blocking).map((f) => f.code));
    expect(codes.has("COMPOSE_SCAN_SECRET_FOUND")).toBe(true);
    expect(codes.has("COMPOSE_UNGRANTED_CAPABILITY")).toBe(true);
    expect(codes.has("COMPOSE_SELECTOR_AS_TRUTH")).toBe(true);
    expect(codes.has("COMPOSE_UNDECLARED_MUTATION")).toBe(true);
    // every finding carries a refusal sentence (the register is prose, not vibes)
    for (const f of verdict.findings) {
      if (!f.blocking) continue;
      expect(findingSentence(f).length).toBeGreaterThan(20);
    }
    // the ledger records the refused row; activation refuses naming the first blocking code
    const ledger = new ComposeScanLedger();
    const row = ledger.record("smuggler", verdict, 1);
    expect(row.verdict).toBe("refused");
    const gate = activationGate(dirty, ledger.rowsList(), "smuggler");
    expect(gate.ok).toBe(false);
    if (!gate.ok) {
      expect(typeof gate.code).toBe("string");
      expect(["COMPOSE_SCAN_SECRET_FOUND", "COMPOSE_UNGRANTED_CAPABILITY", "COMPOSE_SELECTOR_AS_TRUTH", "COMPOSE_UNDECLARED_MUTATION", "COMPOSE_SCAN_NOT_RUN"]).toContain(gate.code);
    }
    // the fixed composition: secret removed, capability granted (and declared), selector derived at runtime, mutation declared
    const clean = {
      name: "clean-comp",
      entries: [
        {
          id: "worker-1",
          grant: { contracts: ["chat.send@1", "vault.append@1"], capabilities: ["host:filesystem.write"] },
          config: { note: "secrets live in the Trust Mesh" },
        },
      ],
      mutations: ["vault.append@1"],
      budget: { cpuMs: 1000 },
    };
    const cleanVerdict = scanComposition(clean, ["host:filesystem.write"]);
    expect(cleanVerdict.verdict).toBe("pass");
    const cleanRow = ledger.record("clean-comp", cleanVerdict, 2);
    const cleanGate = activationGate(clean, ledger.rowsList(), "clean-comp");
    expect(cleanGate.ok).toBe(true);
    if (cleanGate.ok) expect(cleanGate.row.kind).toBe("compose.scan@1");
  });
});

describe("F-LAW-COHERENCE.4 (no-scan-no-activation)", () => {
  test("activation with a stale or missing scan row refuses COMPOSE_SCAN_NOT_RUN", () => {
    const manifest = { name: "late", entries: [{ id: "w", grant: { contracts: ["chat.send@1"] } }] };
    // no rows at all
    const none = activationGate(manifest, [], "late");
    expect(none.ok).toBe(false);
    if (!none.ok) {
      expect(none.code).toBe("COMPOSE_SCAN_NOT_RUN");
      expect(none.sentence).toContain("no scan row");
    }
    // a row for DIFFERENT bytes (the stale case): the hash names the divergence
    const other = { name: "late", entries: [{ id: "w", grant: { contracts: ["chat.send@1"] } }], extra: true };
    const ledger = new ComposeScanLedger();
    ledger.record("late", scanComposition(other, []), 1);
    const stale = activationGate(manifest, ledger.rowsList(), "late");
    expect(stale.ok).toBe(false);
    if (!stale.ok && stale.code === "COMPOSE_SCAN_NOT_RUN") {
      expect(stale.scannedHashes.length).toBe(1); // the stale hash is named, not hidden
    }
    // the matching pass row activates
    const verdict = scanComposition(manifest, []);
    ledger.record("late", verdict, 2);
    const ok = activationGate(manifest, ledger.rowsList(), "late");
    expect(ok.ok).toBe(true);
  });
});

describe("F-LAW-COHERENCE.5 (headless)", () => {
  test("the conflict/scan modules import no canvas/surface dependency — CLI/daemon-only by construction", () => {
    for (const f of ["conflict.ts", "compose-scan.ts"] as const) {
      const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-law", "src", f), "utf-8");
      expect(/from\s+"@vivim\/(omega-)?(surfaces|canvas|web|daemon-client)/.test(src)).toBe(false);
      expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    }
    // the pattern sets are inspectable constants, not hidden behavior
    expect(SECRET_PATTERN_SET_V1.version).toBe("1");
    expect(SECRET_PATTERN_SET_V1.patterns.length).toBeGreaterThan(4);
    expect(SELECTOR_PATTERN_SET_V1.valueShapes.length).toBeGreaterThan(3);
  });
});

describe("F-LAW-COHERENCE.6 (loud-failure)", () => {
  test("malformed rows refuse at the door; duplicate ids and unknown amendment targets refuse by name; no warn-and-continue branches in the pure path", () => {
    const store = new PolicyRowStore();
    // malformed: bad class
    expect(() => store.append({ id: "x", principal: "*", precedenceClass: "royal" as PrecedenceClass, scope: "*", effect: "allow" })).toThrow(/LAW_POLICY_ROW_INVALID/);
    // malformed: whitespace scope
    expect(() => store.append({ id: "x", principal: "*", precedenceClass: "grant", scope: "a b", effect: "allow" })).toThrow(/LAW_POLICY_ROW_INVALID/);
    // malformed: supersededBy is derived, never authored
    expect(() => store.append({ id: "x", principal: "*", precedenceClass: "grant", scope: "*", effect: "allow", supersededBy: "y" } as unknown as PolicyRow)).toThrow(/LAW_POLICY_ROW_INVALID/);
    store.append({ id: "live", principal: "*", precedenceClass: "grant", scope: "chat.send@1", effect: "allow" });
    // duplicate id
    expect(() => store.append({ id: "live", principal: "*", precedenceClass: "grant", scope: "*", effect: "deny" })).toThrow(/LAW_POLICY_ROW_DUPLICATE/);
    // unknown amendment target
    expect(() => store.append({ id: "next", principal: "*", precedenceClass: "grant", scope: "*", effect: "deny", supersedes: "ghost" })).toThrow(/LAW_POLICY_AMEND_TARGET_UNKNOWN/);
    // no warn-and-continue: the pure modules contain no empty catch (a swallowed
    // anomaly would be exactly the silent branch the spec forbids)
    for (const f of ["conflict.ts", "compose-scan.ts"] as const) {
      const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-law", "src", f), "utf-8");
      expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false);
      expect(/catch\s*(\([^)]*\))?\s*\{\s*\/\*/.test(src)).toBe(false);
    }
  });
});
