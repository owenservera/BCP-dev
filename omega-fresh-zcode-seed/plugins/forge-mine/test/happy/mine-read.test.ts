// forge.mine — test/happy/mine-read.test.ts (D-409 READ siblings, end to end)
// THE falsifier of this lane: the capture receipt exists ONLY because
// `forge.mine.capture@1` ran (EXTERNAL_MUTATION, consent-gated, the one
// filesystem seam), and all three READ ops are then shown consuming that stored
// receipt out of the governed ledger — on one real boot of
// compositions/forge-mine.json, which carries both halves of the D-409 split.
//
// What is proved here, in order:
//   · the manifest parses + validates with ZERO issues, declares exactly the
//     three READ ops, matches pack.builder's frozen FORGE_OP_CATALOG, and does
//     NOT declare the capture op (the split, mechanically visible);
//   · forge.mine.list@1 finds the mine the capture just stored — the receipt
//     flows through the ledger, not through an import;
//   · forge.mine.verify@1 re-derives the receipt from its own rows and passes
//     all nine checks, with `replayHash` equal to the capture's own rootHash —
//     two independent folds of the same law agreeing, and both agreeing with the
//     mine's own MANIFEST.json;
//   · forge.mine.diff@1 of the mine against itself is an agreement PASS with
//     empty deltas, and a REAL second mine produces a REAL detected delta;
//   · MINE_PATTERN (D-409 SF3) holds under real ids — every emitted id matches;
//   · the READ half neither writes the ledger nor touches the mine tree.
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseManifest, validateManifest } from "@vivim/omega-sdk";
import { omegaTmp } from "@vivim/omega-platform";
import { FORGE_OP_CATALOG, ProofReportSchema } from "../../../../packs/builder/src/schemas.ts";
import { rootHashOf as captureRootHashOf } from "../../../forge-mine-capture/src/receipt.ts";
import {
  MINE_EVIDENCE_REF_PATTERN, MINE_ID_PATTERN, RECEIPT_CHECK_NAMES, RECEIPT_ID_PREFIX,
  hashBytes, rootHashOf,
} from "../../src/mine.ts";
import {
  MINE_ROOT, bootMine, call, captureMine, capturePinned, current, diff, list,
  pinnedMineId, readMineManifest, setCurrent, verify, type MineManifest,
} from "../boot.ts";

const PLUGIN_DIR = join(import.meta.dir, "../../");
const OMEGA_ROOT = join(import.meta.dir, "../../../..");
const OP_VERIFY = "forge.mine.verify@1";
const OP_DIFF = "forge.mine.diff@1";
const OP_LIST = "forge.mine.list@1";
let manifest: MineManifest;
let mineId: string;

/** Every module specifier this source actually imports — and nothing else.
 *  The class checks below are about what the compartment REACHES FOR, not
 *  about which words appear in it: a comment explaining "there is no node:fs
 *  import in this compartment" names node:fs, and a raw substring search
 *  cannot tell that sentence from the import it denies. */
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

/** The READ compartment's own source, concatenated. */
function readSource(): string {
  return ["src/index.ts", "src/mine.ts"].map((f) => readFileSync(join(PLUGIN_DIR, f), "utf-8")).join("\n");
}

/** A content snapshot of a tree — paths, kinds and per-file sha256 — so "the
 *  READ ops did not write" is a claim about BYTES, not about file counts. */
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

beforeAll(async () => {
  manifest = readMineManifest();
  mineId = pinnedMineId(manifest);
  const b = await bootMine();
  setCurrent(b);
  // The receipt the READ ops consume, produced the only way one can exist.
  await capturePinned(b.host);
}, 180_000);

afterAll(async () => { await current().host.shutdown().catch(() => {}); }, 30_000);

describe("the manifest — parses, validates, and is the class the catalog pins", () => {
  test("parseManifest + validateManifest return zero issues", () => {
    const raw = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    const parsed = parseManifest(raw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.errors.join("; "));
    expect(parsed.value.id).toBe("forge.mine");
    expect(validateManifest(parsed.value)).toEqual([]);
  });

  test("the declared contributions are exactly the three READ siblings, and the frozen catalog agrees", () => {
    const m = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    const ops = m.contributions.contract.map((c: { id: string; version: string; risk: string }) => `${c.id}@${c.version}`).sort();
    expect(ops).toEqual([OP_DIFF, OP_LIST, OP_VERIFY]);
    // two sources, one truth (D-351/D-406 parity): every declared op matches
    // FORGE_OP_CATALOG's id@version → risk, and every one of them is READ.
    for (const c of m.contributions.contract) {
      expect(c.risk).toBe("READ");
      expect(FORGE_OP_CATALOG[`${c.id}@${c.version}`]).toBe(c.risk);
    }
    // one risk class per plugin (FORGE_CLASS_SPAN)
    expect([...new Set(m.contributions.contract.map((c: { risk: string }) => c.risk))]).toEqual(["READ"]);
  });

  test("the capture op is NOT declared here — D-409 split-plugin, one class per directory", () => {
    const m = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    const ids = m.contributions.contract.map((c: { id: string }) => c.id);
    expect(ids).not.toContain("forge.mine.capture");
    // ...and nothing in this compartment's SOURCE imports the capture plugin:
    // the receipt arrives through the ledger, never across a source boundary.
    const specs = importSpecifiers(readSource());
    expect(specs.filter((s) => s.includes("forge-mine-capture"))).toEqual([]);
  });

  test("READ means READ: no mutation capability and no filesystem seam in the source", () => {
    const m = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    // The two read-only vault ports, and nothing else. A READ plugin that could
    // append, or that could reach the disk, would be lying about its class.
    expect(m.capabilities.requested).toEqual(["port:vault.get@1", "port:vault.query@1"]);
    const specs = importSpecifiers(readSource());
    // No REACHING FOR THE DISK. node:crypto is fine — it hashes bytes the
    // ledger already holds and cannot touch a file; node:fs (and its friends)
    // are the seam this class exists to deny. The old assertion banned every
    // node: specifier, which failed on node:crypto — a rule wider than the
    // one the test names.
    const FS_MODULES = ["node:fs", "node:fs/promises", "node:fs-extra"];
    expect(specs.filter((s) => FS_MODULES.includes(s))).toEqual([]);
    // ...and no import ACROSS PLUGIN DIRECTORIES. The receipt arrives through
    // the ledger, never across a source boundary. The workspace packages
    // (@vivim/omega-shim, @vivim/omega-contracts) are this plugin's own
    // declared dependencies and are not a boundary crossing.
    expect(specs.filter((s) => s.includes("forge-mine-capture"))).toEqual([]);
    expect(specs.filter((s) => s.startsWith("../"))).toEqual([]);
  });

  test("every requested capability is granted in the composition, and every granted contract is declared", () => {
    const m = JSON.parse(readFileSync(join(PLUGIN_DIR, "plugin.json"), "utf-8"));
    const spec = JSON.parse(readFileSync(join(OMEGA_ROOT, "compositions/forge-mine.json"), "utf-8"));
    const entry = spec.entries.find((e: { id: string }) => e.id === "forge.mine");
    expect(entry).toBeDefined();
    for (const cap of m.capabilities.requested) expect(entry.grant.capabilities).toContain(cap);
    const declared = new Set(m.contributions.contract.map((c: { id: string; version: string }) => `${c.id}@${c.version}`));
    for (const op of entry.grant.contracts) expect(declared.has(op)).toBe(true);
    expect([...entry.grant.contracts].sort()).toEqual([OP_DIFF, OP_LIST, OP_VERIFY]);
  });

  test("the builder composition boots BOTH halves of the split — the receipt and its readers", () => {
    const spec = JSON.parse(readFileSync(join(OMEGA_ROOT, "compositions/forge-mine.json"), "utf-8"));
    const ids = spec.entries.map((e: { id: string }) => e.id);
    expect(ids).toContain("forge.mine.capture");
    expect(ids).toContain("forge.mine");
  });
});

describe("forge.mine.list@1 — the pinned mines the ledger holds", () => {
  test("the mine the capture seam just stored is listed, and nothing else is", async () => {
    const l = await list();
    expect(l.schemaVersion).toBe("1");
    expect(l.op).toBe(OP_LIST);
    expect(l.namespace).toBe("proposal");
    expect(l.count).toBe(l.mines.length);
    // exactly the one receipt this suite captured (the second mine is captured
    // later, in the diff describe block, which is why this set is still one)
    expect(l.count).toBe(1);
    expect(l.mines.map((m) => m.mineId)).toEqual([mineId]);
  });

  test("each row's identity is re-derived from the row id alone — no row data is read", async () => {
    const row = (await list()).mines[0]!;
    expect(row.rowId).toBe(`${RECEIPT_ID_PREFIX}pantrylog/${manifest.rootHash}`);
    expect(row.rootHash).toBe(`sha256:${manifest.rootHash}`);
    expect(row.rev).toBeGreaterThanOrEqual(1);
    // D-409 SF3 (MINE_PATTERN discipline, in anger): the ids this op emits are
    // MINE_IDs, and the citation is the EVIDENCE_REF `mine:<id>` form the pack's
    // frozen regex already accepts.
    expect(MINE_ID_PATTERN.test(row.mineId)).toBe(true);
    expect(row.ref).toBe(`mine:${mineId}`);
    expect(MINE_EVIDENCE_REF_PATTERN.test(row.ref)).toBe(true);
  });

  test("the row list is really the ledger's: the row list names holds the capture receipt", async () => {
    const row = (await list()).mines[0]!;
    const got = await current().host.router.callAsRoot("vault.get@1", { ns: "proposal", id: row.rowId });
    expect(got.ok).toBe(true);
    const v = got.ok ? (got.value as { data: { rootHash: string; fileCount: number }; meta: Record<string, unknown> }) : null;
    expect(v!.data.rootHash).toBe(`sha256:${manifest.rootHash}`);
    expect(v!.data.fileCount).toBe(manifest.fileCount);
    expect(v!.meta).toMatchObject({ type: "capture-receipt", producedBy: "forge.mine.capture@1" });
  });
});

describe("forge.mine.verify@1 — the receipt re-walks against itself", () => {
  test("every check passes on the live receipt and the report says so", async () => {
    const r = await verify(mineId);
    // the frozen shape, re-proved on the live value (a z.strictObject, so an
    // invented extra key would fail here)
    expect(ProofReportSchema.safeParse(r).success).toBe(true);
    expect(r.subject).toBe(mineId);
    expect(r.op).toBe(OP_VERIFY);
    expect(r.checks.map((c) => c.name)).toEqual([...RECEIPT_CHECK_NAMES]);
    expect(r.checks.length).toBe(9);
    const failed = r.checks.filter((c) => c.result === "fail");
    console.log(`[verify] ${r.checks.length} checks · result ${r.result} · replayHash ${r.replayHash} · failures ${failed.length === 0 ? "none" : failed.map((c) => `${c.name}: ${c.diff}`).join(" | ")}`);
    // A passing check carries no diff; a failing one ALWAYS carries one — a
    // "fail" with no reason is a verdict nobody can act on.
    for (const c of r.checks) expect(c.diff).toBe(c.result === "pass" ? null : c.diff);
    for (const c of failed) expect(typeof c.diff).toBe("string");
    expect(failed.map((c) => c.name)).toEqual([]);
    expect(r.result).toBe("pass");
    expect(r.refusalResults).toEqual([]);
  });

  test("replayHash is the hash THIS re-walk produced, and three implementations agree on it", async () => {
    const r = await verify(mineId);
    expect(r.replayHash).toBe(`sha256:${manifest.rootHash}`);
    // Two independent folds of the same declared law: this plugin's rootHashOf
    // (src/mine.ts) and the capture plugin's own
    // (forge-mine-capture/src/receipt.ts, which declares the same formula).
    const captured = await current().host.router.callAsRoot("vault.get@1", { ns: "proposal", id: `mine:pantrylog/${manifest.rootHash}` });
    expect(captured.ok).toBe(true);
    const files = captured.ok
      ? (captured.value as { data: { files: Array<{ path: string; hash: string }> } }).data.files
      : [];
    expect(files.length).toBe(manifest.fileCount);
    expect(rootHashOf(files)).toBe(captureRootHashOf(files));   // the two implementations agree, byte for byte
    expect(rootHashOf(files)).toBe(r.replayHash);               // and this is what verify reported
    // ...and a third, fully independent one: the MINE's own MANIFEST.json,
    // whose 42 hashes were computed by the fixture's reference implementation.
    expect(r.replayHash).toBe(`sha256:${manifest.rootHash}`);
  });

  test("the re-walk is not a tautology: every receipt row resolves to a real file with the recorded hash", async () => {
    // `root-hash-recomputes` folds the receipt's OWN per-file hashes. Re-deriving
    // a file hash from DISK here proves those hashes are about this checkout, so
    // the fold is a fact about the mine rather than a self-consistent fiction.
    const captured = await current().host.router.callAsRoot("vault.get@1", { ns: "proposal", id: `mine:pantrylog/${manifest.rootHash}` });
    const files = captured.ok
      ? (captured.value as { data: { files: Array<{ path: string; hash: string; bytes: number }> } }).data.files
      : [];
    const byPath = new Map(manifest.files.map((f) => [f.path, f.sha256]));
    let crlfAffected = 0;
    for (const f of files) {
      const abs = join(MINE_ROOT, ...f.path.split("/"));
      expect(statSync(abs).isFile()).toBe(true);
      // the receipt's per-file hash equals the MINE's own recorded hash for the
      // same path — and the row is present in the mine's inventory at all
      expect(f.hash).toBe(`sha256:${byPath.get(f.path)}`);
      const raw = readFileSync(abs);
      // the declared CRLF→LF domain: recorded bytes are the NORMALISED length
      const crlf = raw.length - (raw.toString("latin1").match(/\r\n/g)?.length ?? 0);
      if (crlf !== f.bytes) crlfAffected++;
    }
    console.log(`[verify] ${files.length} receipt rows resolve to real files; ${crlfAffected} of them report a post-normalisation byte length`);
    expect(files.length).toBe(42);

    // Branch coverage for the normalisation rule, built HERE rather than read off
    // the ambient fixture. The original assertion asked the checkout's own
    // line-endings to supply both branches, which is only true on a host where
    // core.autocrlf is false: this repo checks out with autocrlf=true, so all 42
    // files arrive already LF-normalised, crlfAffected is 0, and the assertion
    // fails while testing nothing about the code. A test that depends on the
    // machine's git config is not a hermetic test — so this mine is constructed
    // with one file that IS CRLF on disk and one that is not, and both branches
    // are then guaranteed regardless of how the host is configured.
    const probeRoot = omegaTmp("omega-forge-mine", `crlf-probe-${Date.now()}`);
    rmSync(probeRoot, { recursive: true, force: true });
    mkdirSync(probeRoot, { recursive: true });
    const crlfBody = "export const a = 1;\r\nexport const b = 2;\r\n";
    const lfBody = "export const c = 3;\n";
    writeFileSync(join(probeRoot, "crlf.ts"), crlfBody);
    writeFileSync(join(probeRoot, "lf.ts"), lfBody);
    // The pin is the root hash over the NORMALISED bytes of each file — the same
    // domain capture declares. Hashing a normalised LENGTH instead of normalised
    // CONTENT is what made the first attempt refuse with CAPTURE_MINE_PIN_MISMATCH.
    const normalise = (s: string): string => s.replace(/\r\n/g, "\n");
    const probeId = `crlfprobe@${rootHashOf([
      { path: "crlf.ts", hash: hashBytes(Buffer.from(normalise(crlfBody), "utf-8")) },
      { path: "lf.ts", hash: hashBytes(Buffer.from(normalise(lfBody), "utf-8")) },
    ]).replace(/^sha256:/, "")}`;
    const probeReceipt = await captureMine(current().host, probeRoot, probeId);
    expect(probeReceipt.fileCount).toBe(2);

    let probeCrlf = 0;
    let probeLf = 0;
    for (const f of probeReceipt.files) {
      const raw = readFileSync(join(probeRoot, ...f.path.split("/"))).toString("utf-8");
      // the receipt records the NORMALISED byte length...
      expect(f.bytes).toBe(Buffer.byteLength(normalise(raw), "utf-8"));
      // ...and the two branches are distinguishable by what was on disk
      if (raw.length > normalise(raw).length) probeCrlf++;
      else probeLf++;
    }
    // BOTH branches genuinely occurred — the normalisation rule is exercised on
    // a CRLF file and proven a no-op on an LF one, on any host.
    expect(probeCrlf).toBe(1);
    expect(probeLf).toBe(1);
  });
});

describe("forge.mine.diff@1 — the delta between two stored receipts", () => {
  test("a mine diffed against ITSELF is an agreement PASS with empty deltas", async () => {
    const r = await diff(mineId, mineId);
    expect(ProofReportSchema.safeParse(r).success).toBe(true);
    expect(r.op).toBe(OP_DIFF);
    expect(r.subject).toBe(`${mineId} ↔ ${mineId}`);
    expect(r.replayHash).toBeNull(); // nothing is replayed here — forge.proof.replay@1 owns replay
    expect(r.refusalResults).toEqual([]);
    const byName = new Map(r.checks.map((c) => [c.name, c]));
    expect([...byName.keys()]).toEqual(["left-receipt-verified", "right-receipt-verified", "added", "removed", "changed"]);
    for (const name of ["left-receipt-verified", "right-receipt-verified", "added", "removed", "changed"]) {
      expect(byName.get(name)!.result).toBe("pass");
      // A PASSING check carries no diff. `check()` in src/mine.ts is explicit —
      // "a failing check always carries its diff" — so diff is null on pass by
      // construction, and ProofReportSchema allows string | null. The empty
      // list is expressed by result:"pass", not by a "none" sentinel in a field
      // that is otherwise reserved for the reason a check failed.
      expect(byName.get(name)!.diff).toBeNull();
    }
    expect(r.result).toBe("pass");
  });

  test("a REAL difference is detected: the pinned fixture vs a differently-pinned throwaway mine", async () => {
    // A second mine, captured through the same EXTERNAL_MUTATION seam with its
    // own pin — the shape forge.proof.secondmine@1 will formalise later.
    const root = omegaTmp("omega-forge-mine", `second-mine-${Date.now()}`);
    rmSync(root, { recursive: true, force: true });
    mkdirSync(join(root, "src"), { recursive: true });
    writeFileSync(join(root, "src", "main.ts"), "export const a = 1;\n");
    writeFileSync(join(root, "README.md"), "# a different mine\n");
    // the pin is the root hash THIS module computes over the mine's own rows
    const otherId = `throwaway@${rootHashOf([
      { path: "README.md", hash: hashBytes(Buffer.from("# a different mine\n", "utf-8")) },
      { path: "src/main.ts", hash: hashBytes(Buffer.from("export const a = 1;\n", "utf-8")) },
    ]).replace(/^sha256:/, "")}`;
    const receipt = await captureMine(current().host, root, otherId);
    expect(receipt.mineId).toBe(otherId);
    expect(receipt.fileCount).toBe(2);

    const r = await diff(mineId, otherId);
    expect(r.result).toBe("fail"); // the trees differ — that IS the "detect" verdict
    const byName = new Map(r.checks.map((c) => [c.name, c]));
    // BOTH sides still re-walk: a detected difference is not a broken receipt.
    expect(byName.get("left-receipt-verified")!.result).toBe("pass");
    expect(byName.get("right-receipt-verified")!.result).toBe("pass");
    const added = byName.get("added")!;
    expect(added.result).toBe("fail");
    // "added" is relative to the fixture, not to an empty tree. synthetic-v0
    // already carries a README.md, so the throwaway mine's README.md is NOT an
    // addition; only src/main.ts is (the fixture's src/ holds .py files). The
    // original expectation of "README.md, src/main.ts" was a whole-tree delta
    // dressed as a two-tree one — and it failed because the diff was RIGHT.
    expect(added.diff).toBe("src/main.ts");
    const removed = byName.get("removed")!;
    expect(removed.result).toBe("fail");
    // `removed` is CAPPED and says so: the fixture has 42 receipt rows, the
    // throwaway mine has 2, so 40+ paths are removed and pathList truncates at
    // MAX_LISTED_PATHS with an explicit "+N more". The cap being VISIBLE is the
    // contract — a silent truncation would be indistinguishable from "those were
    // all of them", which is the failure mode the manifest names.
    const removedText = String(removed.diff);
    expect(removedText).toMatch(/\+\d+ more\)$/);
    const removedPaths = removedText.replace(/ … \(\+\d+ more\)$/, "").split(", ");
    expect(removedPaths.length).toBeLessThan(manifest.fileCount);
    // MANIFEST.json is excluded from the receipt BY DESIGN (capture declares it,
    // so a receipt can never be self-referential), which means it is in neither
    // side's files[] and therefore in NEITHER delta. The old assertion demanded
    // it appear in `removed` — a path the receipt never carried. Exclusions and
    // files are different facts; the diff keeps them apart.
    expect(removedText).not.toContain("MANIFEST.json");
    expect(added.diff).not.toContain("MANIFEST.json");
    // what IS removed is the fixture's real content — the two-file throwaway
    // mine lacks every one of the fixture's receipt paths
    expect(removedPaths).toContain("Makefile");
    expect(removedPaths).toContain("data/pantry.json");
    // "changed" is the same path carrying a different hash. README.md is at the
    // same path in both mines with different content, so it is a CHANGE, not
    // nothing — and a diff that reported zero changes here would be the bug.
    const changed = byName.get("changed")!;
    expect(changed.result).toBe("fail");
    expect(changed.diff).toContain("README.md");
    expect(changed.diff).toContain("→");
    console.log(`[diff] added ${String(added.diff).split(", ").length} · removed ${removedPaths.length} · changed 1 (README.md) · result ${r.result}`);

    // The second mine is now a pinned mine too, and list SEES it. The claim is
    // about the throwaway mine being listed alongside the fixture — not about
    // how many mines the ledger happens to hold, which depends on what other
    // suites in this file captured first.
    const l = await list();
    const ids = l.mines.map((m) => m.mineId);
    expect(ids).toContain(mineId);
    expect(ids).toContain(otherId);
    expect(l.count).toBe(ids.length);
    for (const m of l.mines) {
      expect(MINE_ID_PATTERN.test(m.mineId)).toBe(true);
      expect(MINE_EVIDENCE_REF_PATTERN.test(m.ref)).toBe(true);
    }
    // and both verify clean, so list → verify is a usable round trip
    for (const m of l.mines) expect((await verify(m.mineId)).result).toBe("pass");
  }, 180_000);
});

describe("the READ ops mutate nothing — neither the ledger nor the mine tree", () => {
  test("the fixture mine is byte-identical across a full READ round", async () => {
    const before = snapshot(MINE_ROOT);
    expect(before.filter((r) => r.startsWith("f ")).length).toBe(43); // 42 admitted + MANIFEST.json itself
    await verify(mineId);
    await diff(mineId, mineId);
    await list();
    const after = snapshot(MINE_ROOT);
    expect(after).toEqual(before);
    console.log(`[read-only] ${before.length} tree entries byte-identical after verify + diff + list`);
  }, 60_000);

  test("the READ ops append nothing: the ledger's receipt row set is unchanged", async () => {
    const rowsOf = async (): Promise<string[]> => {
      const q = await current().host.router.callAsRoot("vault.query@1", { ns: "proposal", filter: { idPrefix: RECEIPT_ID_PREFIX } });
      return q.ok ? (q.value as Array<{ id: string; rev: number }>).map((r) => `${r.id}@rev${r.rev}`).sort() : [];
    };
    const before = await rowsOf();
    await verify(mineId);
    await diff(mineId, mineId);
    await list();
    await call("forge.mine.list@1", {});
    const after = await rowsOf();
    console.log(`[read-only] ${after.length} receipt row(s) before and after a full READ round: ${after.join(", ")}`);
    // The claim is "the READ ops changed NOTHING", so the baseline is whatever
    // the ledger held when this test started — not a hard-coded count. Earlier
    // suites in this file capture their own mines, and pinning 2 here made the
    // read-only claim fail for a reason that had nothing to do with reading.
    expect(before.length).toBeGreaterThan(0); // the comparison must be about something
    expect(after).toEqual(before);
  }, 60_000);
});