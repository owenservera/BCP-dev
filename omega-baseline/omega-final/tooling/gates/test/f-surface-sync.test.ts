// tooling/gates/test/f-surface-sync.test.ts — the F-SURFACE-SYNC falsifier (D-436, Ω-4.5).
// Generated as a RED stub by `omega:loop --stub D-436`, then implemented.
//  F-SURFACE-SYNC.1 seeded-drift — an op bound on 4 of 5 surfaces names the fifth as SURFACE_OP_UNBOUND with the (op, surface) pair
//  F-SURFACE-SYNC.2 hand-edit — a direct write to a registered derived artifact is refused SURFACE_DERIVATION_TAMPER (stamp mismatch)
//  F-SURFACE-SYNC.3 orphan — a surface binding a nonexistent op reports SURFACE_ORPHAN_BINDING
//  F-SURFACE-SYNC.4 reasoned-na — a per-op N/A row passes; a revoked one returns to drift; a blanket scope refuses SURFACE_NA_UNREVIEWED
//  F-SURFACE-SYNC.5 live-probe — a file present but a probe that fails to dispatch is still drift (the sweep never greps)
//  F-SURFACE-SYNC.6 one-command — the report renders identically from the fold on replay; clean tree renders clean
//  F-SURFACE-SYNC.7 headless — the sweep is CLI/daemon-only; probes are injected, no canvas dependency
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  deriveVerdict, loadDerivationRegistry, loadNaRegistry, stampLine, stampOf,
  sweepParity, tamperCheck, SURFACE_NA_UNREVIEWED,
  type DerivationRow, type DerivationStamp, type NaRow, type SurfaceProbeSet,
} from "../surfacesync.ts";

const OPS = ["chat.send@1", "vault.append@1", "vault.query@1", "run.stats@1", "intent.submit@1"];
const ALL_BOUND: SurfaceProbeSet[] = ["cli", "mcp", "daemon", "web", "harness"].map((surface) => ({
  surface,
  probe: () => ({ dispatched: true }),
}));

describe("F-SURFACE-SYNC.1 (seeded-drift)", () => {
  test("an op bound on 4 of 5 surfaces names the fifth as SURFACE_OP_UNBOUND with the (op, surface) pair", () => {
    const surfaces: SurfaceProbeSet[] = ["cli", "mcp", "daemon", "web", "harness"].map((surface) => ({
      surface,
      probe: (op: string) => ({ dispatched: !(surface === "web" && op === "vault.query@1") }),
    }));
    const report = sweepParity(OPS, surfaces, []);
    expect(report.ok).toBe(false);
    expect(report.driftCount).toBe(1);
    const drift = report.pairs.find((p) => p.verdict === "drift");
    expect(drift).toBeDefined();
    expect(drift!.op).toBe("vault.query@1");
    expect(drift!.surface).toBe("web");
    if (drift!.verdict === "drift") expect(drift!.code).toBe("SURFACE_OP_UNBOUND");
    // the report names the pair and the code, in text
    expect(report.rendered).toContain("vault.query@1 @ web");
    expect(report.rendered).toContain("SURFACE_DRIFT");
  });
});

describe("F-SURFACE-SYNC.2 (hand-edit)", () => {
  test("a direct write to a registered derived artifact is refused SURFACE_DERIVATION_TAMPER (stamp mismatch)", () => {
    const registry: DerivationRow[] = [
      { artifactPath: "build/genome.md", surfaceRef: "harness", derivationTool: "omega:genome", vocabularyOf: "the fold" },
    ];
    // the hand-edit: content whose stamp names a foreign tool
    const handEdited = `# genome\n\nsome hand-typed words\n${stampLine({ surfaceRef: "harness", artifactPath: "build/genome.md", vocabularyDigest: "x", derivationTool: "hand", derivedAt: 1 })}`;
    const verdict = tamperCheck(registry, new Map([["build/genome.md", handEdited]]));
    expect(verdict.ok).toBe(false);
    expect(verdict.issues.length).toBe(1);
    expect(verdict.issues[0]).toContain("SURFACE_DERIVATION_TAMPER");
    expect(verdict.issues[0]).toContain("foreign writer");
    // the stamp-less artifact (stamp stripped) also refuses
    const stripped = tamperCheck(registry, new Map([["build/genome.md", "# genome\n\nno stamp here"]]));
    expect(stripped.ok).toBe(false);
    expect(stripped.issues[0]).toContain("no surface.derivation stamp");
    // the absent artifact refuses
    const absent = tamperCheck(registry, new Map());
    expect(absent.ok).toBe(false);
    expect(absent.issues[0]).toContain("never ran");
    // the honest artifact passes
    const honest = `<!-- header -->\n${stampLine({ surfaceRef: "harness", artifactPath: "build/genome.md", vocabularyDigest: "d".repeat(16), derivationTool: "omega:genome", derivedAt: 42 })}\n# genome\n...`;
    expect(tamperCheck(registry, new Map([["build/genome.md", honest]])).ok).toBe(true);
    // derive itself refuses unregistered paths
    const rogueWrite = deriveVerdict(registry, "docs/SOME-DOC.md", undefined, { surfaceRef: "harness", artifactPath: "docs/SOME-DOC.md", vocabularyDigest: "x", derivationTool: "omega:genome", derivedAt: 1 });
    expect(rogueWrite.ok).toBe(false);
    if (!rogueWrite.ok) expect(rogueWrite.code).toBe("SURFACE_DERIVATION_TAMPER");
  });
});

describe("F-SURFACE-SYNC.3 (orphan)", () => {
  test("a surface binding a nonexistent op reports SURFACE_ORPHAN_BINDING", () => {
    const surfaces: SurfaceProbeSet[] = [
      { surface: "mcp", probe: () => ({ dispatched: true }), declaredBindings: [...OPS, "ghost.op@9"] },
      ...ALL_BOUND.filter((s) => s.surface !== "mcp"),
    ];
    const report = sweepParity(OPS, surfaces, []);
    expect(report.ok).toBe(false);
    expect(report.orphanCount).toBe(1);
    const orphan = report.pairs.find((p) => p.verdict === "orphan");
    expect(orphan!.op).toBe("ghost.op@9");
    expect(orphan!.surface).toBe("mcp");
    if (orphan!.verdict === "orphan") expect(orphan!.code).toBe("SURFACE_ORPHAN_BINDING");
    expect(report.rendered).toContain("ORPHAN");
    expect(report.rendered).toContain("binding to nothing");
  });
});

describe("F-SURFACE-SYNC.4 (reasoned-na)", () => {
  test("a per-op N/A row passes; a revoked one returns to drift; a blanket scope refuses SURFACE_NA_UNREVIEWED", () => {
    const surfaces: SurfaceProbeSet[] = [
      { surface: "web", probe: (op: string) => ({ dispatched: op !== "vault.append@1" }) },
      ...ALL_BOUND.filter((s) => s.surface !== "web"),
    ];
    // reasoned N/A: the drift is covered
    const na: NaRow[] = [{ op: "vault.append@1", surface: "web", reason: "the web surface is a read-path projection today; writes route through daemon-client", author: "D-436", at: 1 }];
    expect(sweepParity(OPS, surfaces, na).ok).toBe(true);
    expect(sweepParity(OPS, surfaces, na).pairs.find((p) => p.verdict === "na-declared")?.op).toBe("vault.append@1");
    // revocation: the row's revocation returns the drift
    const revoked: NaRow[] = [{ ...na[0]!, revokedAt: 2 }];
    const afterRevoke = sweepParity(OPS, surfaces, revoked);
    expect(afterRevoke.ok).toBe(false);
    expect(afterRevoke.driftCount).toBe(1);
    // blanket scope: refused as unreviewed
    const blanket: NaRow[] = [{ op: "*", surface: "web", reason: "web is read-only, all of it, trust me", author: "someone", at: 1 }];
    const blanketReport = sweepParity(OPS, surfaces, blanket);
    expect(blanketReport.ok).toBe(false);
    expect(blanketReport.unreviewedNa.length).toBeGreaterThan(0);
    expect(blanketReport.unreviewedNa[0]!.code).toBe(SURFACE_NA_UNREVIEWED);
    // a reason-less row is equally unreviewed
    const terse: NaRow[] = [{ op: "vault.append@1", surface: "web", reason: "nah", author: "x", at: 1 }];
    expect(sweepParity(OPS, surfaces, terse).unreviewedNa.length).toBe(1);
  });
});

describe("F-SURFACE-SYNC.5 (live-probe)", () => {
  test("a file present but a probe that fails to dispatch is still drift (the sweep never greps)", () => {
    // the surface's source FILE contains the op string — grep would pass; the
    // probe fails: still drift, because dispatch reality is the only truth
    const surfaces: SurfaceProbeSet[] = [
      { surface: "cli", probe: (op: string) => ({ dispatched: op !== "chat.send@1", detail: "router has no handler" }) },
      ...ALL_BOUND.filter((s) => s.surface !== "cli"),
    ];
    const report = sweepParity(OPS, surfaces, []);
    expect(report.ok).toBe(false);
    const drift = report.pairs.find((p) => p.verdict === "drift")!;
    expect(drift.op).toBe("chat.send@1");
    expect(drift.surface).toBe("cli");
    if (drift.verdict === "drift") expect(drift.detail).toContain("router has no handler");
  });
});

describe("F-SURFACE-SYNC.6 (one-command)", () => {
  test("the report renders identically from the fold on replay; clean tree renders clean", () => {
    const clean = sweepParity(OPS, ALL_BOUND, []);
    expect(clean.ok).toBe(true);
    expect(clean.rendered).toContain("GREEN");
    expect(clean.rendered).toContain("(every routed op is bound or reasoned-N/A on every probed surface)");
    // replay: byte-identical
    const again = sweepParity(OPS, ALL_BOUND, []);
    expect(again.rendered).toBe(clean.rendered);
    expect(JSON.stringify(again.pairs)).toBe(JSON.stringify(clean.pairs));
    // the real registries parse and the real derivation stamp round-trips
    const root = join(import.meta.dir, "..", "..", "..");
    const na = loadNaRegistry(root);
    expect(na.length).toBeGreaterThan(0);
    expect(na.every((r) => r.reason.length >= 10)).toBe(true);
    const reg = loadDerivationRegistry(root);
    expect(reg.length).toBeGreaterThan(0);
    const stamp: DerivationStamp = { surfaceRef: "harness", artifactPath: "build/genome.md", vocabularyDigest: "abc123", derivationTool: "omega:genome", derivedAt: 99 };
    expect(stampOf(`prefix\n${stampLine(stamp)}\nsuffix`)).toEqual(stamp);
    expect(stampOf("no stamp at all")).toBeNull();
  });
});

describe("F-SURFACE-SYNC.7 (headless)", () => {
  test("the sweep is CLI/daemon-only; probes are injected, no canvas dependency", () => {
    const src = readFileSync(join(import.meta.dir, "..", "surfacesync.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    // the module performs no dispatch of its own — the probes arrive injected
    expect(/ctx\.port|router\./.test(src)).toBe(false);
  });
});
