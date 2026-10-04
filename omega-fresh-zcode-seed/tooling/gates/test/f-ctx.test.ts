// tooling/gates/test/f-ctx.test.ts — the F-CTX falsifier (D-443, Ω-3).
// Generated as a RED stub by `omega:loop --stub D-443`, then implemented.
//  F-CTX.1 deterministic-assembly — same query + same source rows ⇒ byte-identical window and digest, ×100 replays, across boots (a fresh registry derives the same digest — the fold is the only truth); supplied row order never moves it
//  F-CTX.2 provenance-completeness — every included row resolves to a live revision with byte offsets that tile the window exactly; a cited source that is absent refuses CTX_ASSEMBLY_UNRESOLVABLE; a replay that cannot reproduce the digest refuses CTX_DIGEST_DIVERGENCE rather than serving stale
//  F-CTX.3 eviction-is-named — a namespace over cap → the named rule applies and is cited in the row (the evicted counted), or CTX_EVICT_UNDECLARED; never a shorter window with no explanation
//  F-CTX.4 refusal-proves — unknown ns, unlabelled kind, unmetered assembly, over-bound, absent source, tampered digest: each register code fired by a planted violation
//  F-CTX.5 the-light-call — an unchanged vault version-checks through the digest cache with zero full assemblies; a bumped version re-derives, and the same rows land the same digest
//  F-CTX.6 headless — the ceremony is daemon/CLI-only; the window renders as cited text
//  F-CTX.7 loud-failure — zero silent-truncation paths, mechanically checked: any assembly that dropped rows cites the rule that dropped them
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  assemble, verifyAssembly, renderContextWindow, ContextRegistry, CTX_READ_BOUND, CTX_DEFAULT_CAP,
  CTX_NAMESPACE_UNKNOWN, CTX_ASSEMBLY_UNRESOLVABLE, CTX_DIGEST_DIVERGENCE,
  CTX_EVICT_UNDECLARED, CTX_KIND_UNLABELLED, CTX_BUDGET_UNMETERED, CTX_BOUND_EXCEEDED,
  type AssembleSpec, type ContextAssembly, type VaultRow,
} from "../../../plugins/vivim-run/src/context.ts";

function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const row = (ns: string, id: string, rev: number, bytes = "x".repeat(10), epistemicKind = "fact"): VaultRow => ({ ns, id, rev, bytes, epistemicKind });

const vaultRows: VaultRow[] = [
  row("chat", "m1", 3, "hello alice", "fact"),
  row("chat", "m2", 4, "hello bob", "fact"),
  row("memory", "p1", 1, "alice prefers text", "inference"),
];

const spec = (over: Partial<AssembleSpec> = {}): AssembleSpec => ({
  assemblyId: "",
  principal: "user:alice",
  query: "intent:recent-chat",
  sources: [{ ns: "chat", role: "history" }, { ns: "memory", role: "identity" }],
  budgetRef: "budget:context:window",
  rows: vaultRows,
  knownNamespaces: ["chat", "memory"],
  vaultVersion: 7,
  ...over,
});

const unwrap = <T extends { ok: boolean }>(out: T, what: string): T & { ok: true } => {
  if (!out.ok) throw new Error(`unreachable: ${what} refused`);
  return out as T & { ok: true };
};

describe("F-CTX.1 (deterministic-assembly)", () => {
  test("same query + same source rows ⇒ byte-identical window and digest, ×100 replays, across boots; supplied row order never moves it", () => {
    const a = unwrap(assemble(spec(), 1_000), "assemble");
    const first = JSON.stringify(a.row);
    for (let replay = 0; replay < 100; replay++) {
      expect(JSON.stringify(unwrap(assemble(spec(), 1_000), "assemble").row)).toBe(first);
    }
    // across boots: fresh registries derive the same digest and the same digest-derived id — the fold is the only truth
    const r1 = new ContextRegistry();
    const r2 = new ContextRegistry();
    const o1 = unwrap(r1.assemble(spec(), 1_000), "r1");
    const o2 = unwrap(r2.assemble(spec(), 1_000), "r2");
    expect(o1.row.digest).toBe(o2.row.digest);
    expect(o1.row.assemblyId).toBe(o2.row.assemblyId);
    // supplied row order and source order never move the digest
    expect(unwrap(assemble(spec({ rows: [...vaultRows].reverse() }), 5_000), "assemble").row.digest).toBe(a.row.digest);
    expect(unwrap(assemble(spec({ sources: [{ ns: "memory", role: "identity" }, { ns: "chat", role: "history" }] }), 5_000), "assemble").row.digest).toBe(a.row.digest);
    // the read-through cache serves the same bytes — no re-derivation, no second truth
    const again = unwrap(r1.assemble(spec(), 6_000), "cache");
    expect(again.cached).toBe(true);
    expect(again.row.digest).toBe(o1.row.digest);
    expect(r1.assemblies()).toBe(1); // the cache hit performed ZERO full assemblies
  });
});

describe("F-CTX.2 (provenance-completeness)", () => {
  test("every included row resolves to a live revision with byte offsets that tile the window exactly; absent sources and unreproducible digests refuse rather than serve", () => {
    const out = unwrap(assemble(spec(), 1_000), "assemble");
    expect(out.row.v).toBe(3);
    let tiled = 0;
    for (const section of out.row.sources) {
      for (const inc of section.included) {
        const live = vaultRows.find((r) => r.ns === inc.ns && r.id === inc.id && r.rev === inc.rev);
        expect(live).toBeDefined(); // every included row resolves to a live revision
        expect(inc.byteOffsets[0]).toBeLessThan(inc.byteOffsets[1]);
        expect(inc.byteOffsets[1] - inc.byteOffsets[0]).toBe(live!.bytes.length);
        tiled += inc.byteOffsets[1] - inc.byteOffsets[0];
      }
    }
    expect(tiled).toBe(vaultRows.reduce((n, r) => n + r.bytes.length, 0)); // offsets tile the window exactly
    // a cited source that is absent refuses CTX_ASSEMBLY_UNRESOLVABLE (the ns is carried, the rows are not)
    const absent = assemble(spec({ knownNamespaces: ["chat", "memory", "empty"], sources: [...spec().sources, { ns: "empty", role: "rumor" }] }), 1_000);
    expect(absent.ok).toBe(false);
    if (!absent.ok) expect(absent.code).toBe(CTX_ASSEMBLY_UNRESOLVABLE);
    // a replay that cannot reproduce the digest refuses CTX_DIGEST_DIVERGENCE rather than serving stale
    const tampered = JSON.parse(JSON.stringify(out.row)) as ContextAssembly;
    tampered.sources[0]!.included[0]!.rev += 1;
    const v = verifyAssembly(tampered);
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.code).toBe(CTX_DIGEST_DIVERGENCE);
    // the registry door refuses the tampered row; read keeps serving the good one
    const reg = new ContextRegistry();
    const good = unwrap(reg.assemble(spec(), 1_000), "registry");
    const refused = reg.ingest({ ...tampered, assemblyId: "ctx.window:evil" });
    expect(refused.ok).toBe(false);
    if (!refused.ok) expect(refused.code).toBe(CTX_DIGEST_DIVERGENCE);
    expect(unwrap(reg.read(out.row.assemblyId, "user:alice"), "read").row.digest).toBe(good.row.digest);
    // a row mutated in place after storage never serves — read re-verifies before serving
    good.row.sources[0]!.included[0]!.rev += 1;
    const stale = reg.read(out.row.assemblyId, "user:alice");
    expect(stale.ok).toBe(false);
    if (!stale.ok) expect(stale.code).toBe(CTX_DIGEST_DIVERGENCE);
  });
});

describe("F-CTX.3 (eviction-is-named)", () => {
  test("a namespace over cap → the named rule applies and is cited in the row (the evicted counted), or CTX_EVICT_UNDECLARED; never a shorter window with no explanation", () => {
    const many: VaultRow[] = Array.from({ length: 250 }, (_, i) => row("chat", `m${String(i).padStart(3, "0")}`, i, "b".repeat(4), "fact"));
    const chat = { sources: [{ ns: "chat", role: "history" }] } as Partial<AssembleSpec>;
    // over the default cap with no rule → refusal, named
    const noRule = assemble(spec({ ...chat, rows: many }), 1_000);
    expect(noRule.ok).toBe(false);
    if (!noRule.ok) {
      expect(noRule.code).toBe(CTX_EVICT_UNDECLARED);
      expect(noRule.sentence).toContain("chat");
      expect(noRule.sentence).toContain("silent truncation");
    }
    // the named rule applies and is cited — the newest survive, the evicted are counted
    const withRule = unwrap(assemble(spec({ ...chat, rows: many, eviction: [{ ns: "chat", rule: "newest-N" }] }), 1_000), "newest-N");
    const section = withRule.row.sources[0]!;
    expect(section.included.length).toBe(CTX_DEFAULT_CAP);
    expect(section.evicted).toBe(50);
    expect(section.rule).toBe("newest-N");
    const ids = section.included.map((r) => r.id);
    expect(ids).toContain("m249"); // newest kept
    expect(ids).not.toContain("m000"); // oldest evicted — by the named rule, not silently
    // oldest-N keeps the other end, cited the same way
    const oldest = unwrap(assemble(spec({ ...chat, rows: many, eviction: [{ ns: "chat", rule: "oldest-N" }] }), 1_000), "oldest-N");
    const oldIds = oldest.row.sources[0]!.included.map((r) => r.id);
    expect(oldIds).toContain("m000");
    expect(oldIds).not.toContain("m249");
    expect(oldest.row.sources[0]!.evicted).toBe(50);
    expect(oldest.row.sources[0]!.rule).toBe("oldest-N");
    // a declared cap below the row count with no rule refuses too
    const capped = assemble(spec({ ...chat, rows: many.slice(0, 10), caps: { chat: 5 } }), 1_000);
    expect(capped.ok).toBe(false);
    if (!capped.ok) expect(capped.code).toBe(CTX_EVICT_UNDECLARED);
    // an unknown rule name refuses (fail-closed — a rule the fold cannot apply never truncates quietly)
    const vibes = assemble(spec({ ...chat, rows: many, eviction: [{ ns: "chat", rule: "vibes" }] }), 1_000);
    expect(vibes.ok).toBe(false);
    if (!vibes.ok) {
      expect(vibes.code).toBe(CTX_EVICT_UNDECLARED);
      expect(vibes.sentence).toContain("vibes");
    }
  });
});

describe("F-CTX.4 (refusal-proves)", () => {
  test("unknown ns, unlabelled kind, unmetered assembly, over-bound, absent source, tampered digest: each register code fired by a planted violation", () => {
    // unmetered assembly (§18 — the window is a scheduled workload)
    const unmetered = assemble(spec({ budgetRef: "" }), 1_000);
    expect(unmetered.ok).toBe(false);
    if (!unmetered.ok) {
      expect(unmetered.code).toBe(CTX_BUDGET_UNMETERED);
      expect(unmetered.sentence).toContain("§18");
    }
    // unknown ns — the vault does not carry it
    const unknown = assemble(spec({ sources: [{ ns: "ghost", role: "history" }] }), 1_000);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) {
      expect(unknown.code).toBe(CTX_NAMESPACE_UNKNOWN);
      expect(unknown.sentence).toContain("ghost");
      expect(unknown.sentence).toContain("vault does not carry");
    }
    // absent source — the ns is carried, the rows are not
    const absent = assemble(spec({ knownNamespaces: ["chat", "memory", "ghost"], sources: [{ ns: "ghost", role: "history" }] }), 1_000);
    expect(absent.ok).toBe(false);
    if (!absent.ok) expect(absent.code).toBe(CTX_ASSEMBLY_UNRESOLVABLE);
    // unlabelled kind — a rumor refuses at the door (§13)
    const rumour = assemble(spec({ rows: [...vaultRows, { ns: "chat", id: "m3", rev: 5, bytes: "psst" }] }), 1_000);
    expect(rumour.ok).toBe(false);
    if (!rumour.ok) {
      expect(rumour.code).toBe(CTX_KIND_UNLABELLED);
      expect(rumour.sentence).toContain("chat/m3");
      expect(rumour.sentence).toContain("rumors");
    }
    // over-bound — more than 512 distinct ids in one namespace
    const flood: VaultRow[] = Array.from({ length: CTX_READ_BOUND + 1 }, (_, i) => row("chat", `f${i}`, 1, "z", "fact"));
    const over = assemble(spec({ rows: flood, sources: [{ ns: "chat", role: "history" }] }), 1_000);
    expect(over.ok).toBe(false);
    if (!over.ok) {
      expect(over.code).toBe(CTX_BOUND_EXCEEDED);
      expect(over.sentence).toContain(String(CTX_READ_BOUND));
    }
    // eviction undeclared (proven fully in F-CTX.3 — fired here for the register's completeness)
    const evict = assemble(spec({ rows: flood.slice(0, 250), sources: [{ ns: "chat", role: "history" }] }), 1_000);
    expect(evict.ok).toBe(false);
    if (!evict.ok) expect(evict.code).toBe(CTX_EVICT_UNDECLARED);
    // digest divergence — the tampered replay (proven fully in F-CTX.2; fired here for the register)
    const good = unwrap(assemble(spec(), 1_000), "assemble");
    const forged = JSON.parse(JSON.stringify(good.row)) as ContextAssembly;
    forged.digest = "sha256:deadbeef";
    const div = verifyAssembly(forged);
    expect(div.ok).toBe(false);
    if (!div.ok) expect(div.code).toBe(CTX_DIGEST_DIVERGENCE);
  });
});

describe("F-CTX.5 (the-light-call)", () => {
  test("an unchanged vault version-checks through the digest cache with zero full assemblies; a bumped version re-derives, and the same rows land the same digest", () => {
    const reg = new ContextRegistry();
    const out = unwrap(reg.assemble(spec(), 1_000), "assemble");
    expect(reg.assemblies()).toBe(1);
    // the unchanged vault version-checks through the digest cache — zero full assemblies
    for (let i = 0; i < 25; i++) {
      const light = reg.versionCheck("user:alice", out.row.digest, 7);
      expect(light.unchanged).toBe(true);
      expect(light.row!.digest).toBe(out.row.digest);
    }
    expect(reg.assemblies()).toBe(1); // still ONE full assembly — the light call never re-derives
    // a bumped vault version fails the check → the caller re-assembles
    expect(reg.versionCheck("user:alice", out.row.digest, 8).unchanged).toBe(false);
    const re = unwrap(reg.assemble(spec({ vaultVersion: 8 }), 2_000), "re-assemble");
    expect(reg.assemblies()).toBe(2); // the vault changed — the fold re-derives
    expect(re.row.digest).toBe(out.row.digest); // same rows ⇒ same digest — one truth
    expect(reg.versionCheck("user:alice", re.row.digest, 8).unchanged).toBe(true); // the new version light-checks clean
    // a cross-principal check never serves (D-379 inherits)
    expect(reg.versionCheck("user:mallory", out.row.digest, 7).unchanged).toBe(false);
  });
});

describe("F-CTX.6 (headless)", () => {
  test("the ceremony is daemon/CLI-only; the window renders as cited text", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "context.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    const out = unwrap(assemble(spec(), 1_000), "assemble");
    const text = renderContextWindow(out.row);
    expect(text).toContain("ctx.window — assembly");
    expect(text).toContain("chat (history, 2 row(s)):");
    expect(text).toContain("m1@3 [fact] bytes 0..11");
    expect(text).toContain("memory (identity, 1 row(s)):");
    expect(text).toContain("p1@1 [inference] bytes 20..38");
    expect(text).toContain("digest sha256:");
  });
});

describe("F-CTX.7 (loud-failure)", () => {
  test("zero silent-truncation paths, mechanically checked: any assembly that dropped rows cites the rule that dropped them", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "context.ts"), "utf-8");
    for (const code of [CTX_NAMESPACE_UNKNOWN, CTX_ASSEMBLY_UNRESOLVABLE, CTX_DIGEST_DIVERGENCE, CTX_EVICT_UNDECLARED, CTX_KIND_UNLABELLED, CTX_BUDGET_UNMETERED, CTX_BOUND_EXCEEDED]) {
      expect(src.includes(code)).toBe(true);
    }
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false); // no silent swallows
    // the battery: 200 random row sets — every dropped row is evicted BY NAME and counted
    const rand = prng(20260922);
    const kinds = ["fact", "inference", "judgment"];
    for (let trial = 0; trial < 200; trial++) {
      const n = 1 + Math.floor(rand() * 300);
      const rows: VaultRow[] = Array.from({ length: n }, (_, i) => row("chat", `r${String(i).padStart(3, "0")}`, i, "b".repeat(1 + Math.floor(rand() * 5)), kinds[Math.floor(rand() * kinds.length)]));
      const cap = 50 + Math.floor(rand() * 100);
      const out = unwrap(assemble(spec({
        rows,
        sources: [{ ns: "chat", role: "history" }],
        eviction: [{ ns: "chat", rule: rand() < 0.5 ? "newest-N" : "oldest-N" }],
        caps: { chat: cap },
      }), 1_000), `battery ${trial}`);
      const section = out.row.sources[0]!;
      if (section.included.length < n) {
        expect(section.rule).toBeDefined(); // the rule is cited — never a shorter window with no explanation
        expect(section.evicted).toBe(n - section.included.length);
      } else {
        expect(section.evicted).toBe(0);
      }
    }
    // the empty registry refuses honestly rather than serving nothing quietly
    const reg = new ContextRegistry();
    const none = reg.read("ctx.window:none", "user:alice");
    expect(none.ok).toBe(false);
    if (!none.ok) expect(none.code).toBe(CTX_ASSEMBLY_UNRESOLVABLE);
  });
});
