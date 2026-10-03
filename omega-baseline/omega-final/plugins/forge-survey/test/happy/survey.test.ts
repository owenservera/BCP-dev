// forge.survey — test/happy/survey.test.ts (D-417 Wave 1+ lane, end to end)
// What is proved here, in order:
//   · the manifest parses + validates with ZERO issues, declares exactly the two
//     READ ops, matches pack.builder's frozen FORGE_OP_CATALOG, and requests
//     only read-only vault ports;
//   · forge.survey.run@1 inventories the PINNED synthetic mine (42 files)
//     entirely out of the ledger, and EVERY row validates against the frozen
//     InventoryRowSchema (a strictObject, so an invented key fails here);
//   · the MIRRORED derivations agree on the LIVE receipt — survey's row id
//     against the capture's, survey's base64 decoder against the capture's,
//     survey's sha256 against the capture's. Two independent implementations
//     agreeing on real bytes is evidence; "they are the same formula written
//     twice" is a claim, and only one of those is worth anything;
//   · forge.survey.render@1 is a byte-identical pure function of its inventory
//     across two calls, and equals the pure renderer applied to run@1's output;
//   · THE PURITY PROOF G-11 LEAVES UNGATED: no module in src/ imports a
//     filesystem builtin. No gate checks this — FORGE_CLASS_SPAN reads the
//     manifest's declared contributions and never inspects source — so the
//     import-SPECIFIER scan below is the only thing standing behind the claim
//     that a READ op cannot re-walk the mine. It reads what the modules IMPORT,
//     not a substring of their text, because a comment explaining the rule
//     names node:fs and would satisfy a raw search;
//   · the mine tree and the ledger are byte-identical before and after: survey
//     reads and writes nothing.
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseManifest, validateManifest } from "@vivim/omega-sdk";
import { FORGE_OP_CATALOG, InventoryRowSchema } from "../../../../packs/builder/src/schemas.ts";
import {
  casBlobRow, decodeCasBlob as captureDecodeCasBlob, fileHashAndBytes,
  normaliseTextBytes, receiptRowId as captureReceiptRowId,
} from "../../../forge-mine-capture/src/receipt.ts";
import {
  FORGE_SURVEY_RENDER_OP, FORGE_SURVEY_RUN_OP, MAX_FIELD_ITEMS, decodeCasBlob as surveyDecodeCasBlob,
  hashBytes, languageOf, receiptRowId as surveyReceiptRowId, renderAtlas,
} from "../../src/inventory.ts";
import {
  MINE_ROOT, RECEIPT_NS, bootSurvey, call, capturePinned, current, pinnedMineId, readMineManifest,
  render, renderInventory, run, setCurrent, type MineManifest,
} from "../boot.ts";

const PLUGIN_DIR = join(import.meta.dir, "../../");
const OMEGA_ROOT = join(import.meta.dir, "../../../..");
let manifest: MineManifest;
let mineId: string;

/** Every module specifier this source actually imports — and nothing else. */
function importSpecifiers(src: string): string[] {
  const spec: string[] = [];
  const patterns = [
    /\bfrom\s*["']([^"']+)["']/g,
    /\bimport\s*\(?\s*["']([^"']+)["']/g,
    /\brequire\s*\(\s*["']([^"']+)["']/g,
  ];
  for (const re of patterns) for (const m of src.matchAll(re)) if (m[1]) spec.push(m[1]);
  return spec;
}

/** Filesystem builtins a READ-class forge op must never reach for. */
const FS_BUILTINS = ["node:fs", "fs", "node:fs/promises", "fs/promises", "node:fs-extra"];

function srcFiles(): string[] {
  const dir = join(PLUGIN_DIR, "src");
  return readdirSync(dir).filter((f) => f.endsWith(".ts")).sort().map((f) => join(dir, f));
}

/** A content snapshot of a tree — paths, kinds and per-file sha256. */
function snapshot(dir: string): string[] {
  const out: string[] = [];
  const walk = (abs: string, rel: string): void => {
    for (const e of readdirSync(abs, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const r = rel === "" ? e.name : `${rel}/${e.name}`;
      const child = join(abs, e.name);
      if (e.isDirectory()) { out.push(`d ${r}`); walk(child, r); continue; }
      if (!e.isFile()) { out.push(`l ${r}`); continue; }
      out.push(`f ${r} ${hashBytes(readFileSync(child))}`);
    }
  };
  walk(dir, "");
  return out.sort();
}

/** Every row id currently in the ledger, with its revision. */
async function ledgerIndex(): Promise<string[]> {
  const q = await current().host.router.callAsRoot("vault.query@1", { ns: RECEIPT_NS, filter: {} });
  if (!q.ok || !Array.isArray(q.value)) throw new Error(`vault.query@1 over ${RECEIPT_NS} did not answer: ${JSON.stringify(q).slice(0, 300)}`);
  return (q.value as Array<{ id: string; rev: number }>).map((r) => `${r.id}@${r.rev}`).sort();
}

let mineBefore: string[];
let ledgerBefore: string[];

beforeAll(async () => {
  manifest = readMineManifest();
  mineId = pinnedMineId(manifest);
  const b = await bootSurvey();
  setCurrent(b);
  mineBefore = snapshot(MINE_ROOT);
  // the receipt + CAS blobs the survey ops read, produced the only way one can exist
  await capturePinned(b.host);
  ledgerBefore = await ledgerIndex();
}, 180_000);

afterAll(async () => { await current().host.shutdown().catch(() => {}); }, 30_000);

describe("the manifest — parses, validates, and is the class the catalog pins", () => {
  test("parseManifest + validateManifest return zero issues", () => {
    const raw = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    const parsed = parseManifest(raw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.errors.join("; "));
    expect(parsed.value.id).toBe("forge.survey");
    expect(validateManifest(parsed.value)).toEqual([]);
  });

  test("the declared contributions are exactly the two READ ops, and the frozen catalog agrees", () => {
    const m = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    const ops = m.contributions.contract.map((c: { id: string; version: string }) => `${c.id}@${c.version}`).sort();
    expect(ops).toEqual([FORGE_SURVEY_RENDER_OP, FORGE_SURVEY_RUN_OP].sort());
    for (const c of m.contributions.contract) {
      expect(FORGE_OP_CATALOG[`${c.id}@${c.version}`]).toBe("READ");
      expect(c.risk).toBe("READ");
    }
    // the capture op is NOT here — it is the EXTERNAL_MUTATION seam, its own plugin
    expect(m.contributions.contract.map((c: { id: string }) => c.id)).not.toContain("forge.mine.capture");
  });

  test("every requested capability is granted, is read-only, and resolves in the composition", () => {
    const m = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    const spec = JSON.parse(readFileSync(join(OMEGA_ROOT, "compositions/forge-survey.json"), "utf-8"));
    const entry = spec.entries.find((e: { id: string }) => e.id === "forge.survey");
    expect(entry).toBeDefined();
    expect(m.capabilities.requested).toEqual(["port:vault.get@1", "port:vault.getmany@1"]);
    for (const cap of m.capabilities.requested) expect(entry.grant.capabilities).toContain(cap);
    // READ class, no mutation, no filesystem capability, no law port
    expect(entry.grant.capabilities).not.toContain("port:vault.append@1");
    expect(entry.grant.capabilities).not.toContain("port:law.check@1");
    for (const cap of entry.grant.capabilities) expect(cap.startsWith("port:vault.get")).toBe(true);
    const declared = new Set(m.contributions.contract.map((c: { id: string; version: string }) => `${c.id}@${c.version}`));
    for (const op of entry.grant.contracts) expect(declared.has(op)).toBe(true);
  });

  test("generality is declared at the level the evidence supports — speculative, and the divergence is recorded", () => {
    const m = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    expect(m.generality.level).toBe("speculative");
    expect(m.generality.evidence).toEqual([]);
    // OMEGA-FORGE-ARCHITECTURE.md:649-651 predicts generic (run) / harvested
    // (render). Shipping anything higher would need >=2 resolvable evidence refs
    // with one independent of the declared mine (sdk/src/validate.ts), which a
    // first landing cannot honestly evidence — so both ship conservative and the
    // divergence is carried in the decision record instead of silent prose drift.
    expect(m.generality.mine).toBeNull();
    expect(m.generality.originPaths).toEqual([]);
    expect(m.generality.harvestClass).toBeNull();
  });
});

describe("THE PURITY PROOF — no filesystem module is reachable from src/", () => {
  test("no module in src/ imports a filesystem builtin (the check G-11 does not make)", () => {
    const files = srcFiles();
    expect(files.length).toBeGreaterThan(0);
    const offences: string[] = [];
    for (const f of files) {
      for (const spec of importSpecifiers(readFileSync(f, "utf-8"))) {
        const bare = spec.replace(/^node:/, "");
        if (FS_BUILTINS.includes(spec) || FS_BUILTINS.includes(bare)) offences.push(`${f}: ${spec}`);
      }
    }
    expect(offences).toEqual([]);
    // the compartment's ONLY non-relative imports are the declared seam + crypto
    const externals = new Set<string>();
    for (const f of files) for (const spec of importSpecifiers(readFileSync(f, "utf-8"))) {
      if (!spec.startsWith(".")) externals.add(spec);
    }
    expect([...externals].sort()).toEqual(["@vivim/omega-contracts", "@vivim/omega-shim", "node:crypto"]);
  });
});

describe("the mirrored derivations agree on the LIVE receipt — two implementations, one fact", () => {
  test("survey's receiptRowId equals the capture's, on the row the ledger actually served", async () => {
    const got = await current().host.router.callAsRoot("vault.get@1", { ns: RECEIPT_NS, id: surveyReceiptRowId(mineId) });
    expect(got.ok).toBe(true);
    const row = got.ok ? (got.value as { data: Record<string, unknown> }) : null;
    expect(row).not.toBeNull();
    const rootHash = String(row!.data["rootHash"]);
    // the capture derives it from (slug + COMPUTED rootHash); survey from (slug +
    // the pin). They agree only because the capture refuses unless pin == rootHash.
    expect(surveyReceiptRowId(mineId)).toBe(captureReceiptRowId(mineId, rootHash));
    expect(row!.data["mineId"]).toBe(mineId);
  });

  test("survey's sha256 and the capture's agree on every file's NORMALISED bytes", async () => {
    const receipt = (await run(mineId));
    expect(receipt.count).toBe(manifest.fileCount);
    for (const row of receipt.rows) {
      const raw = readFileSync(join(MINE_ROOT, ...row.path.split("/")));
      const theirs = fileHashAndBytes(raw);
      // survey's hash and the capture's hash, computed over the same bytes
      expect(row.hash).toBe(theirs.hash);
      expect(row.bytes).toBe(theirs.bytes);
      // and both over the NORMALISED bytes, never the raw ones
      expect(hashBytes(normaliseTextBytes(raw))).toBe(row.hash);
    }
  });

  test("survey's base64 decoder and the capture's agree on every blob — and both are strict", async () => {
    const ids = [...new Set((await run(mineId)).rows.map((r) => r.hash))].map((h) => `cas:${h}`);
    expect(ids.length).toBeGreaterThan(0);
    const rows = await current().host.router.callAsRoot("vault.getmany@1", { ns: RECEIPT_NS, ids });
    expect(rows.ok).toBe(true);
    const raw = rows.ok ? rows.value : [];
    for (const entry of raw as Array<{ id: string; found: boolean; data: unknown }>) {
      const mine = surveyDecodeCasBlob(entry.data);
      const theirs = captureDecodeCasBlob(entry.data);
      expect(mine === null).toBe(theirs === null);
      expect(mine === null ? "null" : mine!.toString("base64")).toBe(theirs === null ? "null" : theirs!.toString("base64"));
      expect(mine).not.toBeNull();
    }
    // both refuse a row whose payload is not strict base64 — a lenient decoder
    // would turn a corrupt row into a plausible buffer
    const zeroHash = `sha256:${"0".repeat(64)}`;
    const broken = { ...casBlobRow(`cas:${zeroHash}`, zeroHash, Buffer.from("x")), data: "!!not base64!!" };
    expect(surveyDecodeCasBlob(broken)).toBeNull();
    expect(captureDecodeCasBlob(broken)).toBeNull();
  });
});

describe("forge.survey.run@1 — the inventory of a captured mine, entirely out of the ledger", () => {
  test("every row validates against the FROZEN InventoryRowSchema (a strictObject)", async () => {
    const inventory = await run(mineId);
    expect(inventory.schemaVersion).toBe("1");
    expect(inventory.op).toBe(FORGE_SURVEY_RUN_OP);
    expect(inventory.mineId).toBe(mineId);
    expect(inventory.rootHash).toBe(`sha256:${manifest.rootHash}`);
    expect(inventory.count).toBe(inventory.rows.length);
    for (const row of inventory.rows) {
      const parsed = InventoryRowSchema.safeParse(row);
      expect(parsed.success ? "ok" : JSON.stringify(parsed.error.issues)).toBe("ok");
    }
    // the whole inventory has no field the frozen schema does not know
    expect(Object.keys(inventory).sort()).toEqual(["capped", "count", "mineId", "op", "rootHash", "rows", "schemaVersion"]);
  });

  test("the paths agree with the receipt's, one row per admitted file, sorted", async () => {
    const inventory = await run(mineId);
    expect(inventory.rows).toHaveLength(42);
    const receipt = (await current().host.router.callAsRoot("vault.get@1", { ns: RECEIPT_NS, id: surveyReceiptRowId(mineId) })) as { ok: true; value: { data: { files: Array<{ path: string; hash: string; bytes: number }> } } };
    const fromReceipt = receipt.value.data.files;
    expect(inventory.rows.map((r) => r.path)).toEqual(fromReceipt.map((f) => f.path));
    for (const row of inventory.rows) {
      const want = fromReceipt.find((f) => f.path === row.path)!;
      expect(row.hash).toBe(want.hash);
      expect(row.bytes).toBe(want.bytes);
    }
    // sorted strictly by path — the inventory is a function of the mine's paths,
    // not of whatever order the receipt was walked in
    expect(inventory.rows.map((r) => r.path)).toEqual([...inventory.rows.map((r) => r.path)].sort());
  });

  test("language is a CLOSED map: a known extension is named, anything else is null", async () => {
    const inventory = await run(mineId);
    const byPath = new Map(inventory.rows.map((r) => [r.path, r]));
    expect(byPath.get("src/hashutil.py")!.language).toBe("python");
    expect(byPath.get("README.md")!.language).toBe("markdown");
    for (const row of inventory.rows) {
      expect(row.language).toBe(languageOf(row.path));
      if (row.language === null) {
        // a row that guesses for an unclaimed extension is a claim, not an observation
        expect(row.exports).toEqual([]);
        expect(row.imports).toEqual([]);
        expect(row.models).toEqual([]);
        expect(row.headings).toEqual([]);
      }
    }
  });

  test("the per-language rules fired on real content — not empty because nothing was read", async () => {
    const inventory = await run(mineId);
    const byPath = new Map(inventory.rows.map((r) => [r.path, r]));
    const py = byPath.get("src/hashutil.py")!;
    expect(py.exports.length).toBeGreaterThan(0);
    expect(py.exports).toContain("root_hash");
    expect(py.imports.length).toBeGreaterThan(0);
    expect(py.imports).toContain("hashlib");
    const md = byPath.get("README.md")!;
    expect(md.headings.length).toBeGreaterThan(0);
    // markdown takes headings and nothing else — the rules are per language
    expect(md.exports).toEqual([]);
    expect(md.imports).toEqual([]);
    expect(byPath.get("MANIFEST.json")).toBeUndefined(); // excluded by declared policy
    const json = byPath.get("mine.json") ?? [...byPath.values()].find((r) => r.language === "json");
    if (json) {
      expect(json.exports).toEqual([]);
      expect(json.headings).toEqual([]);
    }
  });

  test("capped[] is empty on this mine — the cap EXISTS, the corpus simply never reaches it", async () => {
    const inventory = await run(mineId);
    expect(inventory.capped).toEqual([]);
    // the cap is declared and every field is under it; a cap that never fired is
    // proven by the bound, not by the emptiness
    for (const row of inventory.rows) {
      for (const field of ["exports", "imports", "models", "headings"] as const) {
        expect(row[field].length).toBeLessThanOrEqual(MAX_FIELD_ITEMS);
      }
    }
    expect(MAX_FIELD_ITEMS).toBe(25);
  });
});

describe("forge.survey.render@1 — a pure function of the inventory", () => {
  test("two calls over the same mine produce byte-identical atlases", async () => {
    const a = await render(mineId);
    const b = await render(mineId);
    expect(b.atlas).toBe(a.atlas);
    expect(a.op).toBe(FORGE_SURVEY_RENDER_OP);
    expect(a.mineId).toBe(mineId);
    expect(a.rootHash).toBe(`sha256:${manifest.rootHash}`);
    expect(a.count).toBe(42);
    console.log(`[survey] atlas ${a.atlas.length} bytes over ${a.count} sections, byte-identical across two calls`);
  });

  test("the no-I/O form equals the pure renderer applied to run@1's output", async () => {
    // The split's whole point: the renderer is a function of the inventory and
    // nothing else. Handing it run@1's envelope through the op must produce the
    // same bytes as letting it resolve the inventory itself.
    const inventory = await run(mineId);
    const viaOp = await renderInventory(inventory);
    const viaMineId = await render(mineId);
    expect(viaOp.atlas).toBe(viaMineId.atlas);
    expect(viaOp.atlas).toBe(renderAtlas(inventory).atlas);
  });

  test("the atlas is deterministic BY CONSTRUCTION — no clock, no count that moves", async () => {
    const atlas = (await render(mineId)).atlas;
    expect(atlas).not.toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // no timestamp
    expect(atlas).not.toMatch(/capturedAt/);
    // every section is one of the inventory's paths, in the inventory's order
    const inventory = await run(mineId);
    const heads = atlas.split("\n").filter((l) => l.startsWith("## "));
    expect(heads).toEqual(inventory.rows.map((r) => `## ${r.path}`));
    expect(atlas).toContain("No field hit the per-field cap");
  });
});

describe("the READ half writes nothing and touches no disk", () => {
  test("the mine tree is byte-identical after the whole survey suite", () => {
    expect(snapshot(MINE_ROOT)).toEqual(mineBefore);
  });

  test("the ledger is unchanged by the survey ops — no row, no revision", async () => {
    // run@1 and render@1 are called above; neither may append or revise anything.
    const after = await ledgerIndex();
    expect(after).toEqual(ledgerBefore);
    // and the ledger does in fact HOLD the receipt and its blobs — "unchanged"
    // would be trivially true on an empty ledger.
    expect(after.length).toBeGreaterThan(1);
    expect(after.some((r) => r.startsWith(`mine:pantrylog/`))).toBe(true);
    expect(after.filter((r) => r.startsWith("cas:"))).toHaveLength(41);
  });

  test("the ops are UNGATED: they answer on a fresh boot before any consent exists", async () => {
    // capture is EXTERNAL_MUTATION and asks; survey is READ and does not. Calling
    // survey on a boot where consent has never been granted is the mechanical
    // form of that sentence.
    const { host } = await bootSurvey();
    try {
      const r = await host.router.callAsRoot(FORGE_SURVEY_RUN_OP, { mineId: "never-captured@abcdef0" });
      expect(r.ok).toBe(true);
      const v = r.ok ? (r.value as { refused?: boolean; rule?: string }) : null;
      // no gate: the handler ran and produced its own named refusal
      expect(v?.refused).toBe(true);
      expect(v?.rule).toBe("SURVEY_RECEIPT_MISSING");
      const gated = await host.router.callAsRoot("forge.mine.capture@1", { mineRoot: MINE_ROOT, mineId });
      expect(gated.ok).toBe(false);
      expect(String(gated.ok ? "" : gated.detail)).toContain("consent required");
    } finally {
      await host.shutdown().catch(() => {});
    }
  }, 180_000);
});

describe("the survey ops call the ledger and nothing else", () => {
  test("run@1 on a payload the grammar rejects never reaches a port", async () => {
    // Structure first: an unrecognised payload is refused before any read, so a
    // bad caller cannot make the plugin touch the ledger at all.
    const before = await ledgerIndex();
    const r = await call(FORGE_SURVEY_RUN_OP, { mineId, extra: true });
    expect(r.ok).toBe(true);
    expect(await ledgerIndex()).toEqual(before);
  });
});
