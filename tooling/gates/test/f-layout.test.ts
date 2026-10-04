// tooling/gates/test/f-layout.test.ts — the F-LAYOUT falsifier (D-446, Ω-6).
// Generated as a RED stub by `omega:loop --stub D-446`, then implemented.
//  F-LAYOUT.1 the-reinstall — delete the app → reinstall → restore from the vault row → layout byte-exact (digest match), zero diffs
//  F-LAYOUT.2 the-merge — two devices diverge → logs reconcile → both converge to identical layouts; zero lost tiles; exactly one named merge record per ledger
//  F-LAYOUT.3 refusal-proves — invalid geometry, a forked parent claim, a tampered digest: three distinct named refusals; object-state fields cannot affect placement truth; nothing lands outside ns layout — canvas stays reserved, untouched
//  F-LAYOUT.4 deterministic-merge — the same diverged logs merged 100 times (both fold orders) → the same digest, ×100
//  F-LAYOUT.5 ghost-placement — suspend/discard the realization (placement state → ghost); placement rows persist; identity refs still resolve — a thousand tiles without a thousand runtimes (§18)
//  F-LAYOUT.6 headless — 1–5 daemon-only; the layout is data, renderable by anything (F1)
//  F-LAYOUT.7 loud-failure — no silent divergence; every reconciliation is a merge row or a refusal
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  canonicalTiles, foldTiles, LayoutRegistry, mergeSnapshots, renderLayout, restoreSnapshot,
  snapshotDigest, takeSnapshot,
  LAYOUT_DIGEST_MISMATCH, LAYOUT_NS, LAYOUT_SNAPSHOT_FORKED, LAYOUT_TILE_OVERLAP,
  type LayoutSnapshot, type TilePlacement,
} from "../../../plugins/vivim-run/src/layout.ts";
import { canonicalJson } from "../../../plugins/vivim-run/src/planstate.ts";

const t = (tileId: string, x = 0, y = 0, w = 100, h = 100, z = 0, state: TilePlacement["state"] = "placed"): TilePlacement =>
  ({ tileId, x, y, w, h, z, state });

const BASE_TILES = [t("a", 0, 0), t("b", 100, 0), t("c", 200, 0)];

describe("F-LAYOUT.1 (the-reinstall)", () => {
  test("delete the app → reinstall → restore from the vault row → layout byte-exact, zero diffs (CP-3's owed falsifier)", () => {
    const before = new LayoutRegistry();
    const snap = before.snapshot({ layoutId: "board-1", principal: "user:alice", tiles: BASE_TILES });
    expect(snap.ok).toBe(true);
    if (!snap.ok) return;
    // the vault: the serialized row — the ONLY thing that survives the deletion
    const vaultBytes = JSON.stringify(snap.row);
    // the app is deleted; a FRESH registry is the reinstall (nothing carried over)
    const reinstalled = new LayoutRegistry();
    const restored = reinstalled.restore(JSON.parse(vaultBytes) as LayoutSnapshot);
    expect(restored.ok).toBe(true);
    if (restored.ok) {
      expect(restored.diffs).toEqual([]);                                                    // zero diffs
      expect(restored.row.digest).toBe(snap.row.digest);                                     // digest match
      expect(JSON.stringify(canonicalTiles(restored.row.tiles))).toBe(JSON.stringify(canonicalTiles(snap.row.tiles))); // byte-exact
      expect(snapshotDigest(restored.row.tiles)).toBe(snap.row.digest);                      // the fold re-derives it
      expect(reinstalled.activeLayout()!.layoutId).toBe("board-1");                          // re-hydrated, now active
    }
    // the tampered vault: one coordinate nudged → the restore REFUSES, named, with diffs — never blind
    const tampered = JSON.parse(vaultBytes) as LayoutSnapshot;
    tampered.tiles[0]!.x += 1;
    const bad = reinstalled.restore(tampered);
    expect(bad.ok).toBe(false);
    if (!bad.ok) {
      expect(bad.code).toBe(LAYOUT_DIGEST_MISMATCH);
      expect(bad.diffs.length).toBeGreaterThan(0);
      expect(bad.sentence).toContain("refused with the diffs");
    }
  });
});

describe("F-LAYOUT.2 (the-merge)", () => {
  test("two devices diverge → logs reconcile → both converge; zero lost tiles; exactly one named merge record per ledger (CP-1's owed falsifier)", () => {
    // one common ancestor, two ledgers (same bytes both sides)
    const base = { layoutId: "base", principal: "user:alice", tiles: BASE_TILES };
    const deviceA = new LayoutRegistry();
    const deviceB = new LayoutRegistry();
    expect(deviceA.snapshot(base).ok).toBe(true);
    expect(deviceB.snapshot(base).ok).toBe(true);
    // diverge: A moves tile a down; B moves tile b down and adds tile d (each branch individually valid)
    const a1 = deviceA.snapshot({ layoutId: "a1", principal: "user:alice", parentSnapshot: "base", tiles: [t("a", 0, 200), t("b", 100, 0), t("c", 200, 0)] });
    const b1 = deviceB.snapshot({ layoutId: "b1", principal: "user:alice", parentSnapshot: "base", tiles: [t("a", 0, 0), t("b", 100, 200), t("c", 200, 0), t("d", 300, 0)] });
    expect(a1.ok).toBe(true);
    expect(b1.ok).toBe(true);
    // the write door's fork law fires IN one ledger: a second child of base refuses
    const forked = deviceA.snapshot({ layoutId: "b1-prime", principal: "user:alice", parentSnapshot: "base", tiles: BASE_TILES });
    expect(forked.ok).toBe(false);
    if (!forked.ok) expect(forked.code).toBe(LAYOUT_SNAPSHOT_FORKED);
    // logs reconcile: B's row syncs into A's ledger — VERIFIED ingest (digest-checked, never blind)
    const ingested = deviceA.ingest({ ...(b1.ok ? b1.row : null!) });
    expect(ingested.ok).toBe(true);
    // a tampered sync row is refused at ingest too — reconciliation is never blind
    const forged = { ...(b1.ok ? b1.row : null!), tiles: [t("a", 0, 0)] };
    expect(deviceA.ingest(forged).ok).toBe(false);
    // both devices fold the SAME named merge over the diverged heads (logs synced first, verified)
    const syncB = deviceB.ingest({ ...(a1.ok ? a1.row : null!) });
    expect(syncB.ok).toBe(true);
    const mergeSpec = { mergeId: "m1", principal: "user:alice", parents: ["a1", "b1"] as [string, string] };
    const mA = deviceA.merge(mergeSpec);
    const mB = deviceB.merge(mergeSpec);
    expect(mA.ok).toBe(true);
    expect(mB.ok).toBe(true);
    if (mA.ok && mB.ok) {
      expect(mA.row.digest).toBe(mB.row.digest);          // both converge to identical layouts
      expect(mA.row.parents).toEqual(["a1", "b1"]);        // both diverged heads named
      expect(mA.row.lost).toEqual([]);                     // zero lost tiles
      // tiles moved by only ONE branch survive the fold (no silent loss)
      expect(mA.row.resolution.some((x) => x.tileId === "d")).toBe(true);
      expect(mA.row.resolution.find((x) => x.tileId === "a")!.y).toBe(200); // A's move wins the LWW fold
      expect(mA.row.resolution.find((x) => x.tileId === "b")!.y).toBe(200); // B's move survives too
      // exactly ONE named merge record in each ledger
      expect(deviceA.mergeList()).toEqual(["m1"]);
      expect(deviceB.mergeList()).toEqual(["m1"]);
    }
  });
});

describe("F-LAYOUT.3 (refusal-proves)", () => {
  test("invalid geometry, a forked parent claim, a tampered digest: three distinct named refusals; canvas stays reserved", () => {
    const reg = new LayoutRegistry();
    expect(reg.snapshot({ layoutId: "base", principal: "u", tiles: BASE_TILES }).ok).toBe(true);
    const codes: string[] = [];
    // 1. invalid geometry: overlapping tiles
    const overlap = reg.snapshot({ layoutId: "x-overlap", principal: "u", tiles: [t("a", 0, 0, 100, 100), t("b", 50, 50, 100, 100)] });
    expect(overlap.ok).toBe(false);
    if (!overlap.ok) { expect(overlap.code).toBe(LAYOUT_TILE_OVERLAP); expect(overlap.sentence).toContain("overlap"); codes.push(overlap.code); }
    // non-positive extent refuses under the same geometry door
    const flat = reg.snapshot({ layoutId: "x-flat", principal: "u", tiles: [t("a", 0, 0, 0, 100)] });
    expect(flat.ok).toBe(false);
    if (!flat.ok) expect(flat.code).toBe(LAYOUT_TILE_OVERLAP);
    // 2. the fork: a second snapshot claims base after base already has a child
    expect(reg.snapshot({ layoutId: "c1", principal: "u", parentSnapshot: "base", tiles: BASE_TILES }).ok).toBe(true);
    const fork = reg.snapshot({ layoutId: "c2", principal: "u", parentSnapshot: "base", tiles: BASE_TILES });
    expect(fork.ok).toBe(false);
    if (!fork.ok) { expect(fork.code).toBe(LAYOUT_SNAPSHOT_FORKED); expect(fork.sentence).toContain("named merge record"); codes.push(fork.code); }
    // an un-verifiable parent claim is the same fork-shaped lie
    const ghost = takeSnapshot({ layoutId: "c3", principal: "u", parentSnapshot: "not-in-ledger", tiles: BASE_TILES }, new Map(), new Map());
    expect(ghost.ok).toBe(false);
    if (!ghost.ok) expect(ghost.code).toBe(LAYOUT_SNAPSHOT_FORKED);
    // 3. the tampered digest at restore
    const tampered = reg.get("base")!;
    const bad = restoreSnapshot({ ...tampered, tiles: [t("a", 1, 0), t("b", 100, 0), t("c", 200, 0)] });
    expect(bad.ok).toBe(false);
    if (!bad.ok) { expect(bad.code).toBe(LAYOUT_DIGEST_MISMATCH); codes.push(bad.code); }
    expect(new Set(codes)).toEqual(new Set([LAYOUT_TILE_OVERLAP, LAYOUT_SNAPSHOT_FORKED, LAYOUT_DIGEST_MISMATCH]));
    // nothing landed: only base + c1 exist
    expect(reg.list()).toEqual(["base", "c1"]);
    // a state-duplicating row cannot affect placement truth: the digest folds the canonical projection only
    const fatTiles = BASE_TILES.map((x) => ({ ...x, content: "OBJECT STATE — not placement" }));
    expect(snapshotDigest(fatTiles)).toBe(snapshotDigest(BASE_TILES));
    // the namespace law: this substrate writes ns layout ONLY — canvas stays reserved, untouched
    expect(LAYOUT_NS).toBe("layout");
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "layout.ts"), "utf-8");
    expect(src).not.toMatch(/NS\s*=\s*"canvas"/);
    expect(reg.list().every((id) => id.length > 0)).toBe(true);
  });
});

describe("F-LAYOUT.4 (deterministic-merge)", () => {
  test("the same diverged logs merged 100 times (both fold orders) → the same digest, ×100", () => {
    const pa: LayoutSnapshot = { layoutId: "a1", principal: "u", tiles: [t("a", 0, 200), t("b", 100, 0)], digest: snapshotDigest([t("a", 0, 200), t("b", 100, 0)]) };
    const pb: LayoutSnapshot = { layoutId: "b1", principal: "u", tiles: [t("a", 0, 0), t("b", 100, 200), t("d", 300, 0)], digest: snapshotDigest([t("a", 0, 0), t("b", 100, 200), t("d", 300, 0)]) };
    const first = mergeSnapshots({ mergeId: "m", principal: "u", parents: [pa, pb] });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const digests = new Set<string>([first.row.digest]);
    for (let i = 0; i < 100; i++) {
      const again = mergeSnapshots({ mergeId: `m-${i}`, principal: `u-${i % 3}`, parents: [pa, pb] });
      expect(again.ok).toBe(true);
      if (again.ok) digests.add(again.row.digest);
      // merge ORDER does not matter — the fold is commutative
      const swapped = mergeSnapshots({ mergeId: `m-s-${i}`, principal: "u", parents: [pb, pa] });
      expect(swapped.ok).toBe(true);
      if (swapped.ok) digests.add(swapped.row.digest);
    }
    expect(digests.size).toBe(1); // ×100 + both orders → ONE digest
    // and the raw fold is order-free at the tile level too
    expect(canonicalJson(foldTiles(pa.tiles, pb.tiles))).toBe(canonicalJson(foldTiles(pb.tiles, pa.tiles)));
  });
});

describe("F-LAYOUT.5 (ghost-placement)", () => {
  test("suspend/discard the realization; placement rows persist; identity refs still resolve — a thousand tiles without a thousand runtimes", () => {
    const reg = new LayoutRegistry();
    const live = reg.snapshot({ layoutId: "l1", principal: "user:alice", tiles: [t("a", 0, 0), t("b", 100, 0)] });
    expect(live.ok).toBe(true);
    // the realization is suspended: tile a's PLACEMENT state → ghost (a NEW row; nothing deletes)
    const ghosted = reg.snapshot({ layoutId: "l2", principal: "user:alice", parentSnapshot: "l1", tiles: [t("a", 0, 0, 100, 100, 0, "ghost"), t("b", 100, 0)] });
    expect(ghosted.ok).toBe(true);
    if (!ghosted.ok) return;
    // placement rows persist — l1 AND l2 are in the ledger, nothing deleted
    expect(reg.list()).toEqual(["l1", "l2"]);
    const g = reg.get("l2")!;
    // the ghost persists in the row and the digest covers it
    expect(g.tiles.find((x) => x.tileId === "a")!.state).toBe("ghost");
    expect(snapshotDigest(g.tiles)).toBe(g.digest);
    // identity refs still resolve WITHOUT any realization: a fresh registry re-hydrates the ghost from the row alone
    const restored = new LayoutRegistry().restore(JSON.parse(JSON.stringify(g)) as LayoutSnapshot);
    expect(restored.ok).toBe(true);
    if (restored.ok) expect(restored.row.tiles.find((x) => x.tileId === "a")!.state).toBe("ghost");
    // §18: a thousand objects without a thousand runtimes — 1,000 ghost tiles on a grid, one digest, zero realizations
    const many: TilePlacement[] = [];
    for (let i = 0; i < 1000; i++) many.push(t(`tile-${i}`, (i % 100) * 110, Math.floor(i / 100) * 110, 100, 100, 0, "ghost"));
    const horde = reg.snapshot({ layoutId: "l3", principal: "user:alice", parentSnapshot: "l2", tiles: many });
    expect(horde.ok).toBe(true);
    if (horde.ok) {
      expect(horde.row.tiles.length).toBe(1000);
      expect(horde.row.tiles.every((x) => x.state === "ghost")).toBe(true);
      expect(snapshotDigest(horde.row.tiles)).toBe(horde.row.digest); // the digest still covers every ghost
      expect(renderLayout(horde.row).split("\n").length).toBe(1001);  // headless text, all of them
    }
  });
});

describe("F-LAYOUT.6 (headless)", () => {
  test("1–5 daemon-only; the layout is data, renderable by anything (F1)", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "layout.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    // the render is text: placement, extent, z, state, digest — zero pixels
    const row: LayoutSnapshot = { layoutId: "board-1", principal: "user:alice", tiles: [t("a", 0, 0), t("b", 100, 0, 100, 100, 2, "ghost")], digest: snapshotDigest([t("a", 0, 0), t("b", 100, 0, 100, 100, 2, "ghost")]) };
    const text = renderLayout(row);
    expect(text).toContain("layout board-1 (by user:alice) — 2 tile(s)");
    expect(text).toContain("a @ (0,0) 100×100 z0 placed");
    expect(text).toContain("b @ (100,0) 100×100 z2 ghost");
    // the whole ceremony ran through the pure core: registries, folds, renders — no host, no UI
    const reg = new LayoutRegistry();
    reg.snapshot({ layoutId: "h1", principal: "u", tiles: [t("a", 0, 0)] });
    expect(reg.read().rendered).toContain("layout.read — 1 snapshot(s)");
    expect(reg.read("h1").rendered).toContain("a @ (0,0)");
  });
});

describe("F-LAYOUT.7 (loud-failure)", () => {
  test("no silent divergence; every reconciliation is a merge row or a refusal", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "layout.ts"), "utf-8");
    for (const code of [LAYOUT_DIGEST_MISMATCH, LAYOUT_TILE_OVERLAP, LAYOUT_SNAPSHOT_FORKED]) {
      expect(src.includes(code)).toBe(true); // the register lives in the module, not just the docs
    }
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false); // no silent swallows
    // the empty registry degrades honestly
    const reg = new LayoutRegistry();
    expect(reg.read().rendered).toContain("0 snapshot(s)");
    expect(reg.read("ghost").rendered).toContain("not in the ledger");
    // the merge's no-loss law is COMPUTED and carried on the row, never assumed
    const pa: LayoutSnapshot = { layoutId: "a1", principal: "u", tiles: [t("a", 0, 0)], digest: snapshotDigest([t("a", 0, 0)]) };
    const pb: LayoutSnapshot = { layoutId: "b1", principal: "u", tiles: [t("a", 5, 0), t("z", 200, 0)], digest: snapshotDigest([t("a", 5, 0), t("z", 200, 0)]) };
    const m = mergeSnapshots({ mergeId: "m", principal: "u", parents: [pa, pb] });
    expect(m.ok).toBe(true);
    if (m.ok) {
      expect(m.row.lost).toEqual([]);
      expect(m.row.resolution.length).toBe(2); // the union — nothing vanished
    }
    // a merge that would produce invalid geometry is REFUSED, named — never "mostly merged"
    // (each branch is individually valid; the LWW fold crosses A's a with B's b into overlap)
    const pc: LayoutSnapshot = { layoutId: "c1", principal: "u", tiles: [t("a", 100, 0), t("b", 0, 200)], digest: snapshotDigest([t("a", 100, 0), t("b", 0, 200)]) };
    const pd: LayoutSnapshot = { layoutId: "d1", principal: "u", tiles: [t("a", 0, 0), t("b", 150, 50)], digest: snapshotDigest([t("a", 0, 0), t("b", 150, 50)]) };
    const bad = mergeSnapshots({ mergeId: "m2", principal: "u", parents: [pc, pd] });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.code).toBe(LAYOUT_TILE_OVERLAP);
    // and a divergent restore never lands: the refused row does not become active
    const reg2 = new LayoutRegistry();
    const before = reg2.activeLayout();
    const refused = reg2.restore({ layoutId: "x", principal: "u", tiles: [t("a", 0, 0)], digest: "sha256:deadbeef" });
    expect(refused.ok).toBe(false);
    expect(reg2.activeLayout()).toBe(before); // nothing moved — a refusal is not a partial write
  });
});
