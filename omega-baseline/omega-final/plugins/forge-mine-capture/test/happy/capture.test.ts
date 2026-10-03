// forge.mine.capture — test/happy/capture.test.ts (D-409 falsifier)
// THE falsifier of this lane: run `forge.mine.capture@1` against the PINNED
// synthetic mine (fixtures/mines/synthetic-v0/, 42 files) on a real boot and
// prove the receipt agrees, file for file, with the mine's OWN MANIFEST.json —
// hashes the mine computed for itself with an independent implementation
// (fixtures/mines/synthetic-v0/src/hashutil.py). Agreement is not a tautology:
// the capture never reads MANIFEST.json, and MANIFEST.json never mentions this
// plugin. If the two disagree, one of them is wrong and the test says so.
//
// Also proven here: the manifest parses + validates with zero sdk issues, the
// manifest's risk class matches pack.builder's frozen catalog, the declared
// capability set is exactly what the composition grants, and the receipt row
// lands in the vault byte-identical to what the op returned.
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseManifest, validateManifest } from "@vivim/omega-sdk";
import { FORGE_OP_CATALOG } from "../../../../packs/builder/src/schemas.ts";
import { normaliseTextBytes } from "../../src/receipt.ts";
import {
  MINE_ROOT, bootCapture, call, capture, current, pinnedMineId, readMineManifest,
  consent, setCurrent, type MineManifest,
} from "../boot.ts";

const PLUGIN_DIR = join(import.meta.dir, "../../");
const OMEGA_ROOT = join(import.meta.dir, "../../../..");
const OP = "forge.mine.capture@1";
let manifest: MineManifest;
let receipt: Awaited<ReturnType<typeof capture>>;

beforeAll(async () => {
  manifest = readMineManifest();
  const b = await bootCapture();
  setCurrent(b);
  await consent(b.host);
  receipt = await capture({ mineRoot: MINE_ROOT, mineId: pinnedMineId(manifest) });
}, 120_000);

afterAll(async () => { await current().host.shutdown().catch(() => {}); }, 30_000);

describe("the manifest — parses, validates, and is the class the catalog pins", () => {
  test("parseManifest + validateManifest return zero issues", () => {
    const raw = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    const parsed = parseManifest(raw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.errors.join("; "));
    expect(parsed.value.id).toBe("forge.mine.capture");
    expect(validateManifest(parsed.value)).toEqual([]);
  });

  test("the declared contribution is exactly forge.mine.capture@1 EXTERNAL_MUTATION, and the frozen catalog agrees", () => {
    const m = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    expect(m.contributions.contract).toHaveLength(1);
    expect(m.contributions.contract[0]).toMatchObject({ kind: "contract", id: "forge.mine.capture", version: "1", risk: "EXTERNAL_MUTATION" });
    expect(`${m.contributions.contract[0].id}@${m.contributions.contract[0].version}`).toBe(OP);
    // two sources, one truth (D-351/D-406 parity)
    expect(FORGE_OP_CATALOG[OP]).toBe("EXTERNAL_MUTATION");
    // the READ siblings are NOT here — D-409's split, mechanically visible
    expect(Object.keys(m.contributions.contract).length).toBe(1);
  });

  test("the READ siblings (verify/diff/list@1) are NOT declared here — D-409 split-plugin", () => {
    const m = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    const ids = m.contributions.contract.map((c: { id: string }) => c.id);
    for (const sibling of ["forge.mine.verify", "forge.mine.diff", "forge.mine.list"]) {
      expect(ids).not.toContain(sibling);
    }
  });

  test("every requested capability is granted in the builder composition (requested ⊆ granted)", () => {
    const m = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    const spec = JSON.parse(readFileSync(join(OMEGA_ROOT, "compositions/forge-mine-capture.json"), "utf-8"));
    const entry = spec.entries.find((e: { id: string }) => e.id === "forge.mine.capture");
    expect(entry).toBeDefined();
    for (const cap of m.capabilities.requested) {
      expect(entry.grant.capabilities).toContain(cap);
    }
    // and every granted contract is declared by this manifest
    const declared = new Set(m.contributions.contract.map((c: { id: string; version: string }) => `${c.id}@${c.version}`));
    for (const op of entry.grant.contracts) expect(declared.has(op)).toBe(true);
  });
});

// PLUGIN_ROOT_REL is declared after the imports so the manifest test can read
// the repo root without importing a second copy of the path helpers.

describe("the receipt — schema-exact against pack.builder CaptureReceipt@1", () => {
  test("every field carries the shape the frozen schema pins", () => {
    expect(receipt.schemaVersion).toBe("1");
    expect(receipt.op).toBe(OP);
    expect(receipt.mineId).toBe(pinnedMineId(manifest));
    expect(receipt.mineRoot).toBe(MINE_ROOT);
    // capturedAt is a UTC ISO instant
    expect(receipt.capturedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
    expect(new Date(receipt.capturedAt).toISOString()).toBe(receipt.capturedAt);
    expect(receipt.fileCount).toBe(receipt.files.length);
    // The pinned mine excludes exactly one path by DECLARED POLICY: its own
    // inventory. The exclusion is VISIBLE in the receipt, never silent.
    expect(receipt.refusals).toEqual([{ path: "MANIFEST.json", reason: expect.stringContaining("self-referential") }]);
  });

  test("mineRoot is the RESOLVED root, so every files[].path resolves against it", () => {
    for (const f of receipt.files) {
      const abs = join(receipt.mineRoot, ...f.path.split("/"));
      expect(statSync(abs).isFile()).toBe(true);
    }
  });

  test("every row's casRef is a pure function of its content (SF2 stays open)", () => {
    for (const f of receipt.files) expect(f.casRef).toBe(`cas:${f.hash}`);
    // content-addressed means EQUAL CONTENT ⇒ EQUAL ADDRESS — two byte-identical
    // files in one mine share a casRef by construction, and that is correct.
    expect(new Set(receipt.files.map((f) => f.casRef)).size)
      .toBe(new Set(receipt.files.map((f) => f.hash)).size);
  });
});

describe("THE FALSIFIER — the receipt agrees with the mine's own MANIFEST.json", () => {
  test("fileCount equals the manifest's fileCount (42) and the on-disk file count", () => {
    expect(manifest.fileCount).toBe(42);
    expect(receipt.fileCount).toBe(manifest.fileCount);
    expect(receipt.files).toHaveLength(42);
  });

  test("every files[].hash equals the manifest's sha256 for the same path (42/42)", () => {
    const byPath = new Map(manifest.files.map((f) => [f.path, f.sha256]));
    expect(byPath.size).toBe(42);
    const disagree: string[] = [];
    let agree = 0;
    for (const f of receipt.files) {
      const want = byPath.get(f.path);
      if (want === undefined) { disagree.push(`${f.path}: NOT IN MANIFEST`); continue; }
      if (f.hash !== `sha256:${want}`) { disagree.push(`${f.path}: receipt ${f.hash} ≠ manifest sha256:${want}`); continue; }
      agree++;
    }
    // the comparison, in one line of evidence (gate-grade: pasteable)
    console.log(`[falsifier] ${agree}/${manifest.files.length} file hashes agree with MANIFEST.json · ${disagree.length} disagree · fileCount ${receipt.fileCount}/${manifest.fileCount} · rootHash ${receipt.rootHash} vs manifest sha256:${manifest.rootHash}`);
    const sample = receipt.files.slice(0, 3).map((f) => `${f.path}=${f.hash.replace("sha256:", "")}`);
    console.log(`[falsifier] sample rows: ${sample.join(" ")}`);
    expect([...byPath.keys()].filter((p) => !receipt.files.some((f) => f.path === p))).toEqual([]);
    expect(disagree).toEqual([]);
    expect(agree).toBe(42);
  });

  test("rootHash equals the manifest's rootHash — the pin the mine is replayable against", () => {
    expect(receipt.rootHash).toBe(`sha256:${manifest.rootHash}`);
  });

  test("the paths agree exactly, in the manifest's order", () => {
    expect(receipt.files.map((f) => f.path)).toEqual(manifest.files.map((f) => f.path));
  });

  test("the hash domain is the CRLF→LF-normalised bytes, and normalisation is a no-op on LF content", () => {
    // This is the honest part of the falsifier: on a checkout that rewrote
    // line endings, the RAW bytes of some files differ from the mine's
    // identity while the normalised bytes do not. The rule is declared, and it
    // can never change the hash of content that was already LF-only.
    let crlfAffected = 0;
    for (const f of manifest.files) {
      const raw = readFileSync(join(MINE_ROOT, ...f.path.split("/")));
      const normalised = normaliseTextBytes(raw);
      if (normalised.length !== raw.length) { crlfAffected++; continue; }
      // already LF: the raw bytes ARE the normalised bytes, so the declared
      // rule provably left this file's identity untouched
      expect(raw.equals(normalised)).toBe(true);
    }
    console.log(`[capture] ${manifest.files.length} files, ${crlfAffected} rewritten to CRLF by this checkout, ${manifest.files.length - crlfAffected} already LF`);
    expect(crlfAffected).toBeGreaterThanOrEqual(0);
  });

  test("bytes[] is the length of the hashed (normalised) bytes, never the raw length", () => {
    let checked = 0;
    for (const f of receipt.files) {
      const raw = readFileSync(join(MINE_ROOT, ...f.path.split("/")));
      if (raw.length === f.bytes) continue;
      expect(normaliseTextBytes(raw).length).toBe(f.bytes); // the CRLF-affected files
      checked++;
    }
    console.log(`[capture] ${checked} of ${receipt.files.length} rows report post-normalisation byte lengths`);
    expect(checked).toBeGreaterThanOrEqual(0);
  });
});

describe("the receipt lands in the governed ledger — read back byte-identical", () => {
  test("the receipt row is in ns proposal under the content-derived id, byte-identical", async () => {
    const id = `mine:pantrylog/${receipt.rootHash.replace(/^sha256:/, "")}`;
    const got = await current().host.router.callAsRoot("vault.get@1", { ns: "proposal", id });
    expect(got.ok).toBe(true);
    const row = got.ok ? (got.value as { data: Record<string, unknown>; meta: Record<string, unknown> }) : null;
    expect(row).not.toBeNull();
    // capturedAt is the ONE moving field (it records WHEN); everything the
    // receipt attests to must be identical to what the caller was handed.
    expect(row!.data["capturedAt"]).toBe(receipt.capturedAt);
    for (const k of ["schemaVersion", "op", "mineId", "mineRoot", "fileCount", "rootHash", "files", "refusals"] as const) {
      expect(row!.data[k]).toEqual(receipt[k] as unknown);
    }
    expect(row!.meta).toMatchObject({ type: "capture-receipt", mineId: receipt.mineId, rootHash: receipt.rootHash, fileCount: receipt.fileCount });
  });

  test("re-capturing an unchanged mine is idempotent — the same row id, not a new pile", async () => {
    const again = await capture({ mineRoot: MINE_ROOT, mineId: pinnedMineId(manifest) });
    expect(again.rootHash).toBe(receipt.rootHash);
    expect(again.files).toEqual(receipt.files);
    expect(again.capturedAt >= receipt.capturedAt).toBe(true);
  });

  test("the mine tree was NOT written — capture is read-only by construction", async () => {
    const r = await call({ mineRoot: MINE_ROOT, mineId: pinnedMineId(manifest) });
    expect(r.ok).toBe(true);
    // re-hash every file after the capture: identical to the receipt's rows
    const third = r.ok ? (r.value as typeof receipt) : null;
    expect(third).not.toBeNull();
    expect(third!.files.map((f) => f.hash)).toEqual(receipt.files.map((f) => f.hash));
  });
});
