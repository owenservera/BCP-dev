// tooling/gates/test/forge-surface.test.ts — the D5 falsifiers: every forge-surface
// rule proven GREEN on the real tree AND RED on a hand-built violation. The check
// functions are pure over an input object, so red fixtures are mutated copies of
// the real input — the gate and the tests see the same truth.
import { describe, test, expect, beforeAll } from "bun:test";
import { join } from "node:path";
import type { PluginManifest } from "@vivim/omega-contracts";
import { checkForgeSurface, loadForgeSurfaceInput, type ForgePluginRecord, type ForgeSurfaceInput } from "../forge-surface.ts";

const ROOT = join(import.meta.dir, "../../..");
let real: ForgeSurfaceInput;

beforeAll(async () => {
  real = await loadForgeSurfaceInput(ROOT);
});

/** A deep copy of the real input — mutations land on the copy, never the tree. */
function mutated(fn: (input: ForgeSurfaceInput) => void): ForgeSurfaceInput {
  const copy = JSON.parse(JSON.stringify(real)) as ForgeSurfaceInput;
  fn(copy);
  return copy;
}

/** One forge plugin record by manifest id — the split assertions below read
 *  through this so a renamed plugin fails by name instead of silently vacuous. */
function forgeRecord(id: string): ForgePluginRecord {
  const p = real.forgePlugins.find((x) => x.manifest.id === id);
  if (!p) throw new Error(`forge plugin ${id} is not on the real tree`);
  return p;
}

function rulesOf(r: { issues: Array<{ check: string }> }): string[] {
  return r.issues.map((i) => i.check);
}

/** Every module specifier a source actually imports. Class checks are about what
 *  a compartment REACHES FOR, not which words appear in it — a comment saying
 *  "there is no node:fs import here" names node:fs. */
function importSpecifiers(src: string): string[] {
  const spec: string[] = [];
  for (const re of [/\bfrom\s*["']([^"']+)["']/g, /\bimport\s*\(?\s*["']([^"']+)["']/g, /\brequire\s*\(\s*["']([^"']+)["']/g]) {
    for (const m of src.matchAll(re)) if (m[1]) spec.push(m[1]);
  }
  return spec;
}

describe("D5 — forge-surface on the REAL tree (all green)", () => {
  test("the loader actually sees the domain (guards against silent no-op)", () => {
    // D-409 split-plugin: the mine family is TWO plugin directories in TWO risk
    // classes. Both halves are named here so the split is mechanically visible
    // on the real tree, not just in prose — three READ ops in forge.mine, the
    // single EXTERNAL_MUTATION op in forge.mine.capture, and neither plugin
    // declaring the other's ops.
    expect(real.forgePlugins.map((p) => p.manifest.id)).toEqual(["forge.author", "forge.mine", "forge.mine.capture"]);
    const contributions = forgeRecord("forge.mine.capture").manifest.contributions?.contract ?? [];
    expect(contributions.map((c) => `${c.id}@${c.version}`).sort()).toEqual(["forge.mine.capture@1"]);
    expect([...new Set(contributions.map((c) => c.risk))]).toEqual(["EXTERNAL_MUTATION"]); // one class per plugin
    for (const sibling of ["forge.mine.verify", "forge.mine.diff", "forge.mine.list"]) {
      expect(contributions.some((c) => c.id === sibling)).toBe(false); // the READ half is forge-mine's
    }
    // ...and the READ half, which is the other side of the same split.
    const mine = forgeRecord("forge.mine");
    const readOps = mine.manifest.contributions?.contract ?? [];
    // Sorted on both sides: the claim is WHICH three ops this half declares, not
    // the order the manifest happens to list them in. The manifest declares
    // verify, diff, list (the order the ops are documented); asserting an
    // alphabetical order made a correct manifest fail a correct test.
    expect(readOps.map((c) => `${c.id}@${c.version}`).sort()).toEqual(["forge.mine.diff@1", "forge.mine.list@1", "forge.mine.verify@1"]);
    expect([...new Set(readOps.map((c) => c.risk))]).toEqual(["READ"]);
    expect(readOps.some((c) => c.id === "forge.mine.capture")).toBe(false);
    // READ class = no filesystem-mutation capability, and nothing that could
    // reach one: the only ports it asks for are the two read-only vault reads.
    expect(mine.manifest.capabilities.requested).toEqual(["port:vault.get@1", "port:vault.query@1"]);
    const mineSrc = Object.values(mine.sourceText).join("\n");
    // Import specifiers, not raw text. This file's own comment says "There is no
    // `node:fs` import in this compartment" — and a substring search over raw
    // source cannot tell that sentence from the import it denies, so the check
    // fired on the very prose that states the rule. Same defect the plugin's own
    // suite had; fixed in both places.
    const mineImports = importSpecifiers(mineSrc);
    expect(mineImports.filter((s) => s === "node:fs" || s === "node:fs/promises")).toEqual([]);
    // no cross-plugin source import — the receipt arrives via the ledger
    expect(mineImports.filter((s) => s.includes("forge-mine-capture"))).toEqual([]);
    expect(real.compositions.some((c) => c.name === "forge-author")).toBe(true);
    expect(real.compositions.some((c) => c.name === "forge-mine-capture")).toBe(true);
    expect(real.compositions.some((c) => c.name === "forge-mine")).toBe(true);
    expect(real.compositions.length).toBeGreaterThanOrEqual(18);
    expect(Object.keys(real.catalog).length).toBe(24);
    expect(real.packFixtureValidation.length).toBe(14); // 7 valid + 7 invalid, each pinned to its sin
  });

  test("the real tree passes every check (the Forge boundary holds)", () => {
    const r = checkForgeSurface(real);
    expect(r.issues).toEqual([]);
    expect(r.ok).toBe(true);
  });

  test("the builder composition routes its forge op; no product composition does", () => {
    const builder = real.compositions.find((c) => c.name === "forge-author")!;
    expect(builder.entries.find((e) => e.id === "forge.author")?.grant.contracts).toContain("forge.author.init@1");
    for (const comp of real.compositions) {
      if (comp.name.startsWith("forge-")) continue;
      for (const e of comp.entries) {
        expect(e.grant.contracts.filter((c) => c.startsWith("forge."))).toEqual([]);
      }
    }
  });
});

describe("D5 — FORGE_IN_PRODUCT (red)", () => {
  test("a product composition granting a forge.* op fails with the op named", () => {
    const r = checkForgeSurface(mutated((input) => {
      const agent = input.compositions.find((c) => c.name === "agent")!;
      agent.entries[0]!.grant.contracts.push("forge.emit.plugin@1");
    }));
    expect(r.ok).toBe(false);
    const hit = r.issues.find((i) => i.check === "FORGE_IN_PRODUCT")!;
    expect(hit.subject).toContain("agent");
    expect(hit.reason).toContain("forge.emit.plugin@1");
    expect(hit.fix).toContain("builder composition");
  });
});

describe("D5 — FORGE_CLASS_SPAN (red)", () => {
  test("a forge plugin declaring ops in two risk classes fails (READ + MUTATION is still two)", () => {
    const r = checkForgeSurface(mutated((input) => {
      const m = input.forgePlugins[0]!.manifest as PluginManifest;
      m.contributions!.contract!.push({ kind: "contract", id: "forge.survey.run", version: "1", risk: "READ" });
    }));
    expect(r.ok).toBe(false);
    const hit = r.issues.find((i) => i.check === "FORGE_CLASS_SPAN")!;
    expect(hit.subject).toBe("plugins/forge-author");
    expect(hit.reason).toContain("READ");
    expect(hit.reason).toContain("MUTATION");
    expect(hit.fix).toContain("split");
  });
});

describe("D5 — FORGE_EMIT_SCOPE (red)", () => {
  test("a manifest justification without the proposal-only claim fails", () => {
    const r = checkForgeSurface(mutated((input) => {
      const m = input.forgePlugins[0]!.manifest as PluginManifest;
      m.capabilities!.justification = "reads recorded specs and writes provisional scaffold artifacts";
    }));
    expect(r.ok).toBe(false);
    expect(rulesOf(r)).toContain("FORGE_EMIT_SCOPE");
    expect(r.issues.find((i) => i.check === "FORGE_EMIT_SCOPE")!.reason).toContain("proposal-only");
  });

  test("a forge plugin whose source writes a vault ns other than proposal fails with the ns named", () => {
    const r = checkForgeSurface(mutated((input) => {
      const p = input.forgePlugins[0]!;
      p.sourceText["src/index.ts"] = `${p.sourceText["src/index.ts"]}\nawait ctx.port.call("vault.append@1", { ns: "config", id: "evil", data: {} });\n`;
    }));
    expect(r.ok).toBe(false);
    const hit = r.issues.find((i) => i.check === "FORGE_EMIT_SCOPE")!;
    expect(hit.reason).toContain("config");
    expect(hit.fix).toContain("ns proposal");
  });
});

describe("D5 — FORGE_NO_REFUSAL_TEST (red)", () => {
  test("a declared forge.* op with no refusal test naming it fails with the op named", () => {
    const r = checkForgeSurface(mutated((input) => {
      input.forgePlugins[0]!.refusalTestTexts = []; // the refusal suite vanished
    }));
    expect(r.ok).toBe(false);
    const hit = r.issues.find((i) => i.check === "FORGE_NO_REFUSAL_TEST")!;
    expect(hit.reason).toContain("forge.author.init@1");
    expect(hit.fix).toContain("test/refusal");
  });
});

describe("D5 — FORGE_CONTRACT_DRIFT (red)", () => {
  test("a manifest risk that contradicts the catalog fails (two sources, one truth)", () => {
    const r = checkForgeSurface(mutated((input) => {
      const m = input.forgePlugins[0]!.manifest as PluginManifest;
      m.contributions!.contract![0]!.risk = "READ";
    }));
    expect(r.ok).toBe(false);
    const hit = r.issues.find((i) => i.check === "FORGE_CONTRACT_DRIFT")!;
    expect(hit.reason).toContain("forge.author.init@1");
    expect(hit.reason).toContain("MUTATION");
  });

  test("a declared op absent from the catalog fails (the wire is frozen)", () => {
    const r = checkForgeSurface(mutated((input) => {
      const m = input.forgePlugins[0]!.manifest as PluginManifest;
      m.contributions!.contract![0]!.id = "forge.author.explode";
    }));
    expect(r.ok).toBe(false);
    expect(rulesOf(r)).toContain("FORGE_CONTRACT_DRIFT");
    expect(r.issues.find((i) => i.check === "FORGE_CONTRACT_DRIFT")!.reason).toContain("not in pack.builder");
  });

  test("an invalid pack fixture that VALIDATES fails (a schema that cannot reject is not a schema)", () => {
    const r = checkForgeSurface(mutated((input) => {
      const bad = input.packFixtureValidation.find((f) => f.fixture.includes("invalid"))!;
      bad.valid = true; // the schema stopped rejecting the pinned sin
    }));
    expect(r.ok).toBe(false);
    const hit = r.issues.find((i) => i.check === "FORGE_CONTRACT_DRIFT")!;
    expect(hit.reason).toContain("no longer rejects");
  });

  test("a valid pack fixture that fails validation fails (fixture and schema drifted apart)", () => {
    const r = checkForgeSurface(mutated((input) => {
      const good = input.packFixtureValidation.find((f) => !f.fixture.includes("invalid"))!;
      good.valid = false;
      good.errors = ["targetPath: must be a non-empty string"];
    }));
    expect(r.ok).toBe(false);
    const hit = r.issues.find((i) => i.check === "FORGE_CONTRACT_DRIFT")!;
    expect(hit.reason).toContain("valid fixture fails");
  });
});

describe("D5 — GEN_LEVEL_MISSING (red, hard for forge.*/pack.builder)", () => {
  test("a forge plugin without a generality block fails", () => {
    const r = checkForgeSurface(mutated((input) => {
      const m = input.forgePlugins[0]!.manifest as PluginManifest & { generality?: unknown };
      delete m.generality;
    }));
    expect(r.ok).toBe(false);
    const hit = r.issues.find((i) => i.check === "GEN_LEVEL_MISSING")!;
    expect(hit.reason).toContain("forge.author");
  });

  test("pack.builder without a generality block fails too (it declares the frozen wire)", () => {
    const r = checkForgeSurface(mutated((input) => {
      const m = input.packBuilder.manifest as PluginManifest & { generality?: unknown };
      delete m.generality;
    }));
    expect(r.ok).toBe(false);
    expect(r.issues.find((i) => i.check === "GEN_LEVEL_MISSING")!.reason).toContain("pack.builder");
  });
});
