// tooling/gates/test/f-gov-ci.test.ts — the F-GOV-CI falsifier (D-439, Ω-7.5).
// Generated as a RED stub by `omega:loop --stub D-439`, then implemented.
//  F-GOV-CI.1 smuggled-record — a record citing no falsifier fails GOV_FALSIFIER_UNCITED naming the record
//  F-GOV-CI.2 one-green-flip — a RATIFIED record without the two-green evidence claims fails GOV_GREEN_WITHOUT_EVIDENCE
//  F-GOV-CI.3 mute-refusal — a refusal code named by a record but absent from the tree's source fails GOV_REFUSAL_SENTENCE_MISSING
//  F-GOV-CI.4 metrics-determinism — two scorecard runs are byte-identical; a mutated input moves exactly the expected cells
//  F-GOV-CI.5 clean-acceptance — the accept orchestrator exits 0 when every stage is green; a seeded red article fails GOV_ACCEPT_UNMET naming the stage
//  F-GOV-CI.6 archive-check — a corrupted bundle byte fails the archive stage with the mismatch named (sha expected vs found)
//  F-GOV-CI.7 headless — the whole ceremony is CLI/daemon-only; the real-tree validate + metrics run green
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  deriveScorecard, realNamespaces, realRecords, realRefusalInSource, runAccept,
  validateCorpus, type RecordInput,
} from "../gov.ts";

const ROOT = join(import.meta.dir, "..", "..", "..");

function fixtureRecord(over: Partial<RecordInput> & { n: number }): RecordInput {
  return {
    n: over.n,
    file: `D-${over.n}-fixture.md`,
    status: over.status ?? "PROPOSED",
    text: over.text ?? "# fixture\n\n## Status\n\nPROPOSED\n\n## Evidence\n\n- `F-FIXTURE.1` (x) — the fixture clause\n",
    ...over,
  };
}

const RESOLVERS = {
  refusalInSource: (code: string) => code !== "LAW_PAPER_REFUSAL",
  knownNamespaces: new Set(["chat", "intent", "intent.lexicon", "vault.recovery", "exec.intervene", "capability.lifecycle"]),
  openBlocking: [] as Array<{ blocks: string; question: string }>,
  supersessionFindings: [] as Array<{ file: string; line: number; msg: string }>,
};

describe("F-GOV-CI.1 (smuggled-record)", () => {
  test("a record citing no falsifier fails GOV_FALSIFIER_UNCITED naming the record", () => {
    const smuggled = fixtureRecord({ n: 901, text: "# smuggled\n\n## Status\n\nPROPOSED\n\n## Evidence\n\n- trust me, it works\n" });
    const v = validateCorpus([smuggled], RESOLVERS);
    expect(v.ok).toBe(false);
    const issue = v.issues.find((i) => i.code === "GOV_FALSIFIER_UNCITED");
    expect(issue).toBeDefined();
    expect(issue!.target).toBe("D-901");
    expect(issue!.detail).toContain("cannot fail");
    // the honest record passes
    expect(validateCorpus([fixtureRecord({ n: 902 })], RESOLVERS).ok).toBe(true);
  });
});

describe("F-GOV-CI.2 (one-green-flip)", () => {
  test("a RATIFIED record without the two-green evidence claims fails GOV_GREEN_WITHOUT_EVIDENCE", () => {
    const oneGreen = fixtureRecord({
      n: 903, status: "RATIFIED",
      text: "# one-green\n\n## Status\n\nRATIFIED\n\n## Evidence\n\n- `F-FIXTURE.1` (x) — green once, ship it\n\n## Index\n\nclass: evidence\n",
    });
    const v = validateCorpus([oneGreen], RESOLVERS);
    expect(v.ok).toBe(false);
    const issue = v.issues.find((i) => i.code === "GOV_GREEN_WITHOUT_EVIDENCE");
    expect(issue).toBeDefined();
    expect(issue!.target).toBe("D-903");
    expect(issue!.detail).toContain("D-364");
    // the honest RATIFIED record (two greens claimed) passes
    const honest = fixtureRecord({
      n: 904, status: "RATIFIED",
      text: "# honest\n\n## Status\n\nRATIFIED\n\n## Evidence\n\n- `F-FIXTURE.1` (x) — x\n- Ratified on greens: full gate green 1234/0 ×2 on the PROPOSED tree\n\n## Index\n\nclass: evidence\n",
    });
    expect(validateCorpus([honest], RESOLVERS).ok).toBe(true);
  });
});

describe("F-GOV-CI.3 (mute-refusal)", () => {
  test("a refusal code named by a record but absent from the tree's source fails GOV_REFUSAL_SENTENCE_MISSING", () => {
    const mute = fixtureRecord({
      n: 905,
      text: "# mute\n\n## Status\n\nPROPOSED\n\n## Evidence\n\n- `F-FIXTURE.1` (x) — refuses LAW_PAPER_REFUSAL when it must\n",
    });
    const v = validateCorpus([mute], RESOLVERS);
    expect(v.ok).toBe(false);
    const issue = v.issues.find((i) => i.code === "GOV_REFUSAL_SENTENCE_MISSING");
    expect(issue).toBeDefined();
    expect(issue!.target).toBe("D-905");
    expect(issue!.detail).toContain("LAW_PAPER_REFUSAL");
    expect(issue!.detail).toContain("a paper refusal");
    // a code that exists in source passes
    const spoken = fixtureRecord({
      n: 906,
      text: "# spoken\n\n## Status\n\nPROPOSED\n\n## Evidence\n\n- `F-FIXTURE.1` (x) — refuses INTENT_LEXICON_AUTO_APPLY_REFUSED when it must\n",
    });
    expect(validateCorpus([spoken], RESOLVERS).ok).toBe(true);
    // namespace law: a dotted ns the doc does not own fails
    const rogueNs = fixtureRecord({
      n: 907,
      text: "# rogue ns\n\n## Status\n\nPROPOSED\n\n## Evidence\n\n- `F-FIXTURE.1` (x) — writes ns `ghost.unowned` forever\n",
    });
    const v2 = validateCorpus([rogueNs], RESOLVERS);
    expect(v2.issues.some((i) => i.code === "GOV_NAMESPACE_UNOWNED" && i.detail.includes("ghost.unowned"))).toBe(true);
  });
});

describe("F-GOV-CI.4 (metrics-determinism)", () => {
  test("two scorecard runs are byte-identical; a mutated input moves exactly the expected cells", () => {
    const registry = readFileSync(join(ROOT, "genome", "layers.json"), "utf-8");
    const records = realRecords(ROOT);
    const a = deriveScorecard(registry, records);
    const b = deriveScorecard(registry, records);
    expect(b.rendered).toBe(a.rendered);
    expect(JSON.stringify(b.layers)).toBe(JSON.stringify(a.layers));
    // the real tree's shape: 32 layers, 16 implemented, CORE + Ω-0..3.5 + the Ω-DEV family
    expect(a.coverage.total).toBe(32);
    expect(a.coverage.implemented).toBe(32); // 32 at D-455 landing (wave E: the boundary tier completes — THE WHOLE CORPUS IS IN)
    expect(a.layers.find((l) => l.id === "Ω-0.5")!.treeId).toBe(432);
    // a mutated input: a synthetic PROPOSED record flips to RATIFIED → the ratified count moves exactly +1
    // (synthesized because the corpus may be fully ratified at any later run — the fixture
    // must not depend on someone else's open work)
    const synthetic = { n: 900, file: "D-900-fixture.md", status: "PROPOSED" as const, text: "# x\n\n## Status\n\nPROPOSED\n\n## Evidence\n\n- `F-FIXTURE.1` (x) — x\n" };
    const mutated = [...records, synthetic].map((r) => r.n === 900 ? { ...r, status: "RATIFIED" as const } : r);
    const c = deriveScorecard(registry, mutated);
    expect(c.coverage.ratified).toBe(a.coverage.ratified + 1);
    expect(c.layers.length).toBe(a.layers.length); // the layer table did not move
    // dep health is derived: the unsatisfied share is a number, stable per input
    expect(c.depHealth.satisfied + c.depHealth.blocked).toBe(a.depHealth.satisfied + a.depHealth.blocked);
  });
});

describe("F-GOV-CI.5 (clean-acceptance)", () => {
  test("the accept orchestrator exits 0 when every stage is green; a seeded red article fails GOV_ACCEPT_UNMET naming the stage", () => {
    const greenStages = [
      { name: "gov.validate", run: () => ({ ok: true, issues: [] }) },
      { name: "falsifier-suites", run: () => ({ ok: true, issues: [] }) },
      { name: "doctruth", run: () => ({ ok: true, issues: [] }) },
      { name: "surface-parity", run: () => ({ ok: true, issues: [] }) },
      { name: "perf-budgets", run: () => ({ ok: true, issues: [] }) },
      { name: "archive-integrity", run: () => ({ ok: true, issues: [] }) },
      { name: "board-freshness", run: () => ({ ok: true, issues: [] }) },
      { name: "status-carriage", run: () => ({ ok: true, issues: [] }) },
    ];
    const accepted = runAccept(greenStages);
    expect(accepted.ok).toBe(true);
    expect(accepted.rendered).toContain("ACCEPTED");
    // the seeded red article: doctruth fails → GOV_ACCEPT_UNMET names the stage
    const seeded = greenStages.map((s) => s.name === "doctruth"
      ? { name: s.name, run: () => ({ ok: false, issues: ["DOCTRUTH_DRIFT: docs/generated.md source src/a.ts changed since the last regeneration"] }) }
      : s);
    const unmet = runAccept(seeded);
    expect(unmet.ok).toBe(false);
    expect(unmet.unmet).toBeDefined();
    expect(unmet.unmet!.code).toBe("GOV_ACCEPT_UNMET");
    expect(unmet.unmet!.stage).toBe("doctruth");
    expect(unmet.unmet!.sentence).toContain("DOCTRUTH_DRIFT");
    expect(unmet.rendered).toContain("UNMET at 'doctruth'");
    // the sweep stops at the first red stage (fail-closed, no partial passes)
    expect(unmet.stages.find((s) => s.name === "archive-integrity")).toBeUndefined();
  });
});

describe("F-GOV-CI.6 (archive-check)", () => {
  test("a corrupted bundle byte fails the archive stage with the mismatch named (sha expected vs found)", () => {
    // the archive stage: the last bundle's sha vs the README row (the injected checker)
    const expected = "e1396296aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad98ccb7e";
    const found = "e1396296bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbd98ccb7e";
    const archiveStage = {
      name: "archive-integrity",
      run: () => ({
        ok: false,
        issues: [`BOOT_ARCHIVE_HASH_MISMATCH: bundle _3's README row pins sha256 ${expected.slice(0, 16)}… but the file on disk hashes ${found.slice(0, 16)}… — one corrupted byte`],
      }),
    };
    const v = runAccept([archiveStage]);
    expect(v.ok).toBe(false);
    expect(v.unmet!.stage).toBe("archive-integrity");
    expect(v.unmet!.sentence).toContain("BOOT_ARCHIVE_HASH_MISMATCH");
    expect(v.unmet!.sentence).toContain("e1396296aaaa");
    expect(v.unmet!.sentence).toContain("e1396296bbbb");
  });
});

describe("F-GOV-CI.7 (headless)", () => {
  test("the whole ceremony is CLI/daemon-only; the real-tree validate + metrics run green", () => {
    const src = readFileSync(join(import.meta.dir, "..", "gov.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    // THE REAL TREE: validate green (every record cites falsifiers, every RATIFIED row has evidence,
    // every refusal code exists in source, every ns is owned)
    const records = realRecords(ROOT);
    expect(records.length).toBeGreaterThan(100);
    const verdict = validateCorpus(records, {
      refusalInSource: realRefusalInSource(ROOT),
      knownNamespaces: realNamespaces(ROOT),
      openBlocking: [],
      supersessionFindings: [],
    });
    expect(verdict.issues).toEqual([]);
    expect(verdict.ok).toBe(true);
    expect(verdict.checked.ratified).toBeGreaterThanOrEqual(110); // 115 at D-439 landing (the whole corpus minus the pre-D-364 era)
  }, 60000);
});
