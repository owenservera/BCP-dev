// tooling/gates/test/f-doctruth.test.ts — the F-DOCTRUTH falsifier (D-437, Ω-5.5).
// Generated as a RED stub by `omega:loop --stub D-437`, then implemented.
//  F-DOCTRUTH.1 seeded-rot — a source mutated without regen is DOCTRUTH_DRIFT naming the doc, the source, and the role
//  F-DOCTRUTH.2 fabricated-pointer — a claim citing a nonexistent decision refuses to print with LIBRARIAN_CLAIM_UNCITED naming the claim
//  F-DOCTRUTH.3 manifest-less — a governed doc with no manifest row is LIBRARIAN_SOURCE_MANIFEST_MISSING
//  F-DOCTRUTH.4 generator-honesty — a hand-edited generated doc fails the re-derivation byte-diff with LIBRARIAN_GENERATOR_DRIFT; the hand era never re-derives (report-only forever)
//  F-DOCTRUTH.5 summary-audit — a 50-commit range's claims all resolve; a deleted citation makes the claim vanish or the generation refuse
//  F-DOCTRUTH.6 seed-continuity — the absorbed S1–S6 verdicts are identical to docscan's own on the repo's corpus
//  F-DOCTRUTH.7 headless — the whole ceremony is CLI/daemon-only
import { describe, test, expect } from "bun:test";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { omegaTmp } from "@vivim/omega-platform";
import { scanDocs } from "../docscan.ts";
import {
  claimCited, driftReport, hashFile, loadLibrarian, summarizeRows, verifyLibrarian,
  type ClaimRow, type LibrarianRow,
} from "../doctruth.ts";

function fixtureRoot(): { root: string; rows: LibrarianRow[] } {
  const root = omegaTmp("omega-f-doctruth", `${Date.now()}-${process.pid}`);
  rmSync(root, { recursive: true, force: true });
  mkdirSync(join(root, "docs"), { recursive: true });
  mkdirSync(join(root, "src"), { recursive: true });
  // two sources
  writeFileSync(join(root, "src", "a.ts"), "export const A = 1;\n");
  writeFileSync(join(root, "src", "b.ts"), "export const B = 2;\n");
  const rows: LibrarianRow[] = [{
    docPath: "docs/generated.md",
    era: "generated",
    sources: [
      { path: "src/a.ts", role: "the constant table", sha256: hashFile(join(root, "src", "a.ts"))! },
      { path: "src/b.ts", role: "the fallback table", sha256: hashFile(join(root, "src", "b.ts"))! },
    ],
    generator: "fixture:generator",
  }];
  writeFileSync(join(root, "docs", "generated.md"), "GENERATED-CONTENT-v1\n");
  return { root, rows };
}

const generatorOf = (bytes: string) => (row: LibrarianRow) => row.era === "generated" ? bytes : "";

describe("F-DOCTRUTH.1 (seeded-rot)", () => {
  test("a source mutated without regen is DOCTRUTH_DRIFT naming the doc, the source, and the role", () => {
    const { root, rows } = fixtureRoot();
    // the rot: source b changes after the doc was generated
    writeFileSync(join(root, "src", "b.ts"), "export const B = 3; // ROT\n");
    const v = verifyLibrarian(root, rows, () => null, generatorOf("GENERATED-CONTENT-v1\n"), (p) => join(root, p));
    const rot = v.issues.find((i) => i.code === "DOCTRUTH_DRIFT");
    expect(rot).toBeDefined();
    expect(rot!.docPath).toBe("docs/generated.md");
    expect(rot!.detail).toContain("src/b.ts");
    expect(rot!.detail).toContain("the fallback table");
    // a disappeared source is drift squared
    rmSync(join(root, "src", "b.ts"));
    const v2 = verifyLibrarian(root, rows, () => null, generatorOf("GENERATED-CONTENT-v1\n"), (p) => join(root, p));
    expect(v2.issues.some((i) => i.code === "DOCTRUTH_DRIFT" && i.detail.includes("ABSENT"))).toBe(true);
    rmSync(root, { recursive: true, force: true });
  });
});

describe("F-DOCTRUTH.2 (fabricated-pointer)", () => {
  test("a claim citing a nonexistent decision refuses to print with LIBRARIAN_CLAIM_UNCITED naming the claim", () => {
    const claim: ClaimRow = {
      text: "The vault spine landed two-phase appends",
      cites: [{ kind: "record", ref: "D-999" }],
    };
    const verdict = claimCited(claim, (id) => id !== "D-999", () => true, () => 10);
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.code).toBe("LIBRARIAN_CLAIM_UNCITED");
      expect(verdict.sentence).toContain("D-999");
      expect(verdict.sentence).toContain("refuses to print");
    }
    // the same claim with the record existing prints
    expect(claimCited(claim, () => true, () => true, () => 10).ok).toBe(true);
    // a commit citation to nothing refuses
    const commitClaim: ClaimRow = { text: "Fixed in a commit", cites: [{ kind: "commit", ref: "deadbeef" }] };
    expect(claimCited(commitClaim, () => true, (ref) => ref !== "deadbeef", () => 10).ok).toBe(false);
    // a file:line past the end refuses
    const fileClaim: ClaimRow = { text: "See the code", cites: [{ kind: "file", ref: "src/a.ts:99" }] };
    expect(claimCited(fileClaim, () => true, () => true, () => 3).ok).toBe(false);
    expect(claimCited(fileClaim, () => true, () => true, () => 99).ok).toBe(true);
  });
});

describe("F-DOCTRUTH.3 (manifest-less)", () => {
  test("a governed doc with no manifest row is LIBRARIAN_SOURCE_MANIFEST_MISSING", () => {
    const { root, rows } = fixtureRoot();
    // the doc vanished: the registry row points at nothing
    rmSync(join(root, "docs", "generated.md"));
    const v = verifyLibrarian(root, rows, () => null, generatorOf(""), (p) => join(root, p));
    expect(v.issues.some((i) => i.code === "LIBRARIAN_SOURCE_MANIFEST_MISSING" && i.docPath === "docs/generated.md")).toBe(true);
    // the real registry parses: at least one row, the generated era
    const real = loadLibrarian(join(import.meta.dir, "..", "..", ".."));
    expect(real.malformed).toBe(0);
    expect(real.rows.length).toBeGreaterThanOrEqual(1);
    expect(real.rows.some((r) => r.era === "generated" && r.generator === "omega:genome")).toBe(true);
    rmSync(root, { recursive: true, force: true });
  });
});

describe("F-DOCTRUTH.4 (generator-honesty)", () => {
  test("a hand-edited generated doc fails the re-derivation byte-diff; the hand era never re-derives", () => {
    const { root, rows } = fixtureRoot();
    // the hand-edit: committed bytes diverge from the generator's truth
    writeFileSync(join(root, "docs", "generated.md"), "GENERATED-CONTENT-v1\n plus hand words\n");
    const v = verifyLibrarian(root, rows, (abs) => readFileSync(abs, "utf-8"), generatorOf("GENERATED-CONTENT-v1\n"), (p) => join(root, p));
    expect(v.issues.some((i) => i.code === "LIBRARIAN_GENERATOR_DRIFT" && i.detail.includes("fixture:generator"))).toBe(true);
    expect(v.checked.regenerated).toBe(1);
    // the hand era: no re-derivation, no byte-diff — report-only forever
    const handRows: LibrarianRow[] = [{ docPath: "docs/hand.md", era: "hand", sources: [], generator: "none" }];
    writeFileSync(join(root, "docs", "hand.md"), "hand-authored words, freely edited\n");
    const v2 = verifyLibrarian(root, handRows, (abs) => readFileSync(abs, "utf-8"), generatorOf("SHOULD-NEVER-MATCH"), (p) => join(root, p));
    expect(v2.checked.regenerated).toBe(0);
    expect(v2.issues.some((i) => i.code === "LIBRARIAN_GENERATOR_DRIFT")).toBe(false);
    rmSync(root, { recursive: true, force: true });
  });
});

describe("F-DOCTRUTH.5 (summary-audit)", () => {
  test("a 50-commit range's claims all resolve; a deleted citation makes the claim vanish or the generation refuse", () => {
    // 50 resolvable commit claims
    const commits = Array.from({ length: 50 }, (_, i) => `c${i}`.padStart(40, "0"));
    const claims: ClaimRow[] = commits.map((c, i) => ({ text: `Change ${i} landed`, cites: [{ kind: "commit", ref: c }] }));
    const all = summarizeRows(claims, () => true, (ref) => commits.includes(ref), () => 1);
    expect(all.refused).toEqual([]);
    expect(all.text.split("\n").length).toBe(50);
    // one citation deleted from the store: the claim VANISHES from the render and the refusal is named
    const store = new Set(commits.slice(0, 49)); // c49 deleted
    const after = summarizeRows(claims, () => true, (ref) => store.has(ref), () => 1);
    expect(after.text.split("\n").length).toBe(49);
    expect(after.refused.length).toBe(1);
    expect(after.refused[0]).toContain("LIBRARIAN_CLAIM_UNCITED");
    expect(after.refused[0]).toContain("refuses to print");
  });
});

describe("F-DOCTRUTH.6 (seed-continuity)", () => {
  test("the absorbed S1–S6 verdicts are identical to docscan's own on the repo's corpus", () => {
    const root = join(import.meta.dir, "..", "..", "..");
    const docscanOwn = scanDocs(root);
    // the librarian verdict with an empty registry still runs the internal stage
    const v = verifyLibrarian(root, [], () => null, () => "", (p) => join(root, p));
    const internal = v.issues.filter((i) => i.code.startsWith("DOCSCAN-"));
    expect(internal.length).toBe(docscanOwn.findings.length);
    // rule-by-rule, file-by-file identical (absorption = dependency, verdicts unchanged)
    const own = docscanOwn.findings.map((f) => `${f.rule}|${f.file}|${f.line}|${f.msg}`).sort();
    const absorbed = internal.map((i) => {
      const m = /^(.*?)\.md:(\d+) (.*)$/.exec(i.detail);
      const file = m !== null ? m[1]! : i.docPath;
      const line = m !== null ? Number(m[2]) : 0;
      const msg = m !== null ? m[3]! : i.detail;
      return `${i.code.replace("DOCSCAN-", "")}|${file}|${line}|${msg}`;
    }).sort();
    expect(absorbed).toEqual(own);
    // the repo's corpus is clean today (the D-422 posture held)
    expect(docscanOwn.findings.length).toBe(0);
    // the drift report is blast-radius sorted and the GREEN render is honest
    expect(v.rendered).toContain("GREEN");
    expect(driftReport(v)).toEqual([]);
  });
});

describe("F-DOCTRUTH.7 (headless)", () => {
  test("the whole ceremony is CLI/daemon-only", () => {
    const src = readFileSync(join(import.meta.dir, "..", "doctruth.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    // docscan stays imported, never duplicated (absorption = dependency)
    expect(/from\s+"\.\/docscan\.ts"/.test(src)).toBe(true);
  });
});
