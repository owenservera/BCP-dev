// vivim-run/src/layout.ts (D-446, Ω-6 — the layout substrate, re-materialized spec paper D-430)
//
// The space that survives the app: placement as versioned vault rows that
// reference object identity (never object state), a deterministic digest fold
// over canonical tile state, restore as digest-checked re-hydration (never
// blind), and the CRDT-law substrate — two snapshots claiming one parent
// refuse LAYOUT_SNAPSHOT_FORKED; divergence reconciles through exactly ONE
// named merge record whose per-tile LWW fold is deterministic ×100.
//
// ns `layout`, NOT `canvas`: canvas stays RESERVED for the future
// canvas-surface writer (the spec's own judgment — the reservation is
// discipline, not an empty seat to borrow).
//
// Pure core: no timers, no I/O, zero pixels (F1 by construction). The ops
// layer supplies the principal; the vault mirror rides port caps when present
// (ring-first, the health.ts precedent).
import { canonicalJson, sha256Hex } from "./planstate.ts";

export const LAYOUT_NS = "layout";
export const LAYOUT_DIGEST_MISMATCH = "LAYOUT_DIGEST_MISMATCH";
export const LAYOUT_TILE_OVERLAP = "LAYOUT_TILE_OVERLAP";
export const LAYOUT_SNAPSHOT_FORKED = "LAYOUT_SNAPSHOT_FORKED";

export type PlacementState = "placed" | "ghost" | "shelved";

export interface TilePlacement {
  tileId: string;            // IDENTITY ref — the row never duplicates object state
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  state: PlacementState;     // the PLACEMENT label (ghost tiles persist — §18)
}

export interface LayoutSnapshot {
  layoutId: string;
  principal: string;
  tiles: TilePlacement[];
  digest: string;            // sha256 over canonical tile state — same tiles, same bytes, forever
  parentSnapshot?: string;   // identity ref to the parent row (never state)
}

/** The named merge record: how diverged logs reconcile — one row, both parents
 *  named, the resolution folded deterministically, and `lost` provably empty. */
export interface LayoutMergeRecord {
  kind: "layout.merge@1";
  mergeId: string;
  principal: string;
  parents: [string, string];     // the diverged snapshot layoutIds
  resolution: TilePlacement[];   // the per-tile LWW fold
  lost: string[];                // tileIds the fold dropped — must stay empty
  digest: string;
}

export type SnapshotOutcome = { ok: true; row: LayoutSnapshot } | { ok: false; code: string; sentence: string };
export type MergeOutcome = { ok: true; row: LayoutMergeRecord } | { ok: false; code: string; sentence: string };
export type RestoreOutcome = { ok: true; row: LayoutSnapshot; diffs: string[] } | { ok: false; code: string; sentence: string; diffs: string[] };

/** THE canonical tile projection (D-446): exactly the placement grammar —
 *  {tileId,x,y,w,h,z,state}. Fields beyond the grammar are not placement and
 *  never enter the digest, so object state cannot affect placement truth. */
export function canonicalTiles(tiles: readonly TilePlacement[]): TilePlacement[] {
  return tiles
    .map((t) => ({ tileId: t.tileId, x: t.x, y: t.y, w: t.w, h: t.h, z: t.z, state: t.state }))
    .sort((a, b) => (a.tileId < b.tileId ? -1 : a.tileId > b.tileId ? 1 : 0));
}

/** THE snapshot fold (D-446): the deterministic digest over canonical tile
 *  state. Same tiles (any order, any extra non-placement fields) ⇒ same bytes. */
export function snapshotDigest(tiles: readonly TilePlacement[]): string {
  return `sha256:${sha256Hex(canonicalJson(canonicalTiles(tiles)))}`;
}

/** Axis-aligned rectangle overlap (inclusive edges touching is NOT overlap). */
export function rectanglesOverlap(a: TilePlacement, b: TilePlacement): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

/** THE geometry door (D-446): invalid geometry refuses LAYOUT_TILE_OVERLAP —
 *  overlapping rectangles, non-finite or non-positive extents, and one
 *  identity placed twice never land. */
export function validateGeometry(tiles: readonly TilePlacement[]): { ok: true } | { ok: false; sentence: string } {
  const seen = new Set<string>();
  for (const t of tiles) {
    if (typeof t.tileId !== "string" || t.tileId.length === 0) {
      return { ok: false, sentence: `${LAYOUT_TILE_OVERLAP}: a tile with no tileId — rows reference identity, and identity has no anonymous form (D-446, Ω-6)` };
    }
    if (!Number.isFinite(t.x) || !Number.isFinite(t.y) || !Number.isFinite(t.w) || !Number.isFinite(t.h) || !Number.isFinite(t.z)) {
      return { ok: false, sentence: `${LAYOUT_TILE_OVERLAP}: tile ${t.tileId} carries non-finite geometry — invalid geometry is refused, named (D-446)` };
    }
    if (t.w <= 0 || t.h <= 0) {
      return { ok: false, sentence: `${LAYOUT_TILE_OVERLAP}: tile ${t.tileId} has non-positive extent (${t.w}×${t.h}) — a tile that occupies no space is not placed, it is hidden (D-446)` };
    }
    if (seen.has(t.tileId)) {
      return { ok: false, sentence: `${LAYOUT_TILE_OVERLAP}: tile ${t.tileId} is placed twice in one snapshot — one identity, one placement; two placements for one tile is how two truths are born (D-446)` };
    }
    seen.add(t.tileId);
  }
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (rectanglesOverlap(tiles[i]!, tiles[j]!)) {
        return { ok: false, sentence: `${LAYOUT_TILE_OVERLAP}: tiles ${tiles[i]!.tileId} and ${tiles[j]!.tileId} overlap at (${tiles[j]!.x},${tiles[j]!.y}) — invalid geometry is refused before it lands (D-446, Ω-6)` };
      }
    }
  }
  return { ok: true };
}

/** THE snapshot door (D-446): geometry-gated, digest-folded, fork-refusing.
 *  `rows` is the known ledger; `children` maps a parent layoutId to the set of
 *  layoutIds claiming it (the write path demands ONE child per parent). */
export function takeSnapshot(
  spec: { layoutId: string; principal: string; tiles: TilePlacement[]; parentSnapshot?: string },
  rows: ReadonlyMap<string, LayoutSnapshot>,
  children: ReadonlyMap<string, ReadonlySet<string>>,
): SnapshotOutcome {
  const geo = validateGeometry(spec.tiles);
  if (!geo.ok) return { ok: false, code: LAYOUT_TILE_OVERLAP, sentence: geo.sentence };
  if (spec.parentSnapshot !== undefined) {
    if (!rows.has(spec.parentSnapshot)) {
      return { ok: false, code: LAYOUT_SNAPSHOT_FORKED, sentence: `${LAYOUT_SNAPSHOT_FORKED}: ${spec.layoutId} claims parent ${spec.parentSnapshot}, which is not in the ledger — an unverifiable lineage is a fork wearing a claim (D-446)` };
    }
    const siblings = children.get(spec.parentSnapshot);
    if (siblings !== undefined) {
      for (const sibling of siblings) {
        if (sibling !== spec.layoutId) {
          return { ok: false, code: LAYOUT_SNAPSHOT_FORKED, sentence: `${LAYOUT_SNAPSHOT_FORKED}: snapshots ${sibling} and ${spec.layoutId} both claim parent ${spec.parentSnapshot} — divergence reconciles through ONE named merge record, never a silent second child (D-446, Ω-6)` };
        }
      }
    }
  }
  const tiles = canonicalTiles(spec.tiles);
  return {
    ok: true,
    row: { layoutId: spec.layoutId, principal: spec.principal, tiles, digest: snapshotDigest(tiles), ...(spec.parentSnapshot !== undefined ? { parentSnapshot: spec.parentSnapshot } : {}) },
  };
}

/** THE per-tile LWW fold (D-446): union of tiles by identity; on conflict the
 *  total order on canonical tile bytes decides (clock-less LWW — commutative,
 *  associative, idempotent: any merge order converges to the same digest).
 *  No tile present in either parent ever vanishes. */
export function foldTiles(a: readonly TilePlacement[], b: readonly TilePlacement[]): TilePlacement[] {
  const acc = new Map<string, TilePlacement>();
  for (const t of [...canonicalTiles(a), ...canonicalTiles(b)]) {
    const prev = acc.get(t.tileId);
    if (prev === undefined || canonicalJson(t) > canonicalJson(prev)) acc.set(t.tileId, t);
  }
  return [...acc.values()].sort((x, y) => (x.tileId < y.tileId ? -1 : x.tileId > y.tileId ? 1 : 0));
}

/** THE named merge (D-446): fold two diverged snapshots into ONE record —
 *  deterministic (same parents ⇒ same digest, ×100), geometry-gated, and
 *  `lost` computed and carried so the no-loss law is visible, not assumed. */
export function mergeSnapshots(
  spec: { mergeId: string; principal: string; parents: [LayoutSnapshot, LayoutSnapshot] },
): MergeOutcome {
  const [pa, pb] = spec.parents;
  const folded = foldTiles(pa.tiles, pb.tiles);
  const geo = validateGeometry(folded);
  if (!geo.ok) return { ok: false, code: LAYOUT_TILE_OVERLAP, sentence: `${geo.sentence} (the merge fold produced invalid geometry — the reconciliation is refused, named) (D-446)` };
  const ids = new Set([...pa.tiles, ...pb.tiles].map((t) => t.tileId));
  const lost = [...ids].filter((id) => !folded.some((t) => t.tileId === id));
  return {
    ok: true,
    row: { kind: "layout.merge@1", mergeId: spec.mergeId, principal: spec.principal, parents: [pa.layoutId, pb.layoutId], resolution: folded, lost, digest: snapshotDigest(folded) },
  };
}

/** THE verified re-hydration (D-446): restore recomputes the digest over the
 *  row's tiles and refuses LAYOUT_DIGEST_MISMATCH with the diffs — never
 *  blind, never "mostly restoring". */
export function restoreSnapshot(row: LayoutSnapshot): RestoreOutcome {
  const recomputed = snapshotDigest(row.tiles);
  if (row.digest !== recomputed) {
    const diffs = [
      `digest recorded=${row.digest}`,
      `digest recomputed=${recomputed}`,
      `tiles=${row.tiles.length}`,
    ];
    return { ok: false, code: LAYOUT_DIGEST_MISMATCH, sentence: `${LAYOUT_DIGEST_MISMATCH}: restoring ${row.layoutId} — the recorded digest does not match the re-computed fold; an inexact restore is refused with the diffs, not shipped (D-446, Ω-6)`, diffs };
  }
  const geo = validateGeometry(row.tiles);
  if (!geo.ok) return { ok: false, code: LAYOUT_TILE_OVERLAP, sentence: geo.sentence, diffs: [] };
  return { ok: true, row: { ...row, tiles: canonicalTiles(row.tiles) }, diffs: [] };
}

/** The headless render: the layout is data, renderable by anything (F1). */
export function renderLayout(row: LayoutSnapshot): string {
  const lines = [
    `layout ${row.layoutId} (by ${row.principal}) — ${row.tiles.length} tile(s), digest ${row.digest.slice(0, 22)}…${row.parentSnapshot !== undefined ? ` · parent ${row.parentSnapshot}` : ""}`,
  ];
  for (const t of row.tiles) {
    lines.push(`  ${t.tileId} @ (${t.x},${t.y}) ${t.w}×${t.h} z${t.z} ${t.state}`);
  }
  return lines.join("\n");
}

export function renderMerge(row: LayoutMergeRecord): string {
  const lines = [
    `merge ${row.mergeId} (by ${row.principal}) — parents ${row.parents[0]} + ${row.parents[1]} → digest ${row.digest.slice(0, 22)}… · lost ${row.lost.length} (the no-loss law, visible)`,
  ];
  for (const t of row.resolution) {
    lines.push(`  ${t.tileId} @ (${t.x},${t.y}) ${t.w}×${t.h} z${t.z} ${t.state}`);
  }
  return lines.join("\n");
}

/** The in-plugin registry (ring-first; the vault mirror rides port caps). */
export class LayoutRegistry {
  private rows = new Map<string, LayoutSnapshot>();
  private children = new Map<string, Set<string>>();    // parent → the children claiming it (the fork law's ledger view)
  private merges = new Map<string, LayoutMergeRecord>();
  private active: LayoutSnapshot | null = null;

  snapshot(spec: { layoutId: string; principal: string; tiles: TilePlacement[]; parentSnapshot?: string }): SnapshotOutcome {
    const out = takeSnapshot(spec, this.rows, this.children);
    if (out.ok) {
      this.rows.set(out.row.layoutId, out.row);
      if (out.row.parentSnapshot !== undefined) {
        const set = this.children.get(out.row.parentSnapshot) ?? new Set<string>();
        set.add(out.row.layoutId);
        this.children.set(out.row.parentSnapshot, set);
      }
    }
    return out;
  }

  /** Log reconciliation (the sync path): a row from a reconciled append-only
   *  log, accepted ONLY after digest verification — verified ingest, never
   *  blind. The write door's fork law does not fire here: divergence in the
   *  log is exactly what the named merge consumes. */
  ingest(row: LayoutSnapshot): RestoreOutcome {
    const out = restoreSnapshot(row);
    if (out.ok) {
      this.rows.set(out.row.layoutId, out.row);
      if (out.row.parentSnapshot !== undefined) {
        const set = this.children.get(out.row.parentSnapshot) ?? new Set<string>();
        set.add(out.row.layoutId);
        this.children.set(out.row.parentSnapshot, set);
      }
    }
    return out;
  }

  /** THE named merge: fold two diverged heads into one record; the converged
   *  layout becomes the active placement. Re-using a mergeId is refused. */
  merge(spec: { mergeId: string; principal: string; parents: [string, string] }): MergeOutcome {
    if (this.merges.has(spec.mergeId)) {
      return { ok: false, code: LAYOUT_SNAPSHOT_FORKED, sentence: `merge ${spec.mergeId} already exists — supersede it with a new id, never re-use one (D-446)` };
    }
    const pa = this.rows.get(spec.parents[0]);
    const pb = this.rows.get(spec.parents[1]);
    if (pa === undefined || pb === undefined) {
      const missing = pa === undefined ? spec.parents[0] : spec.parents[1];
      return { ok: false, code: LAYOUT_SNAPSHOT_FORKED, sentence: `${LAYOUT_SNAPSHOT_FORKED}: merge ${spec.mergeId} names parent ${missing}, which is not in the ledger — an unverifiable lineage is a fork wearing a claim (D-446)` };
    }
    const out = mergeSnapshots({ mergeId: spec.mergeId, principal: spec.principal, parents: [pa, pb] });
    if (out.ok) {
      this.merges.set(out.row.mergeId, out.row);
      this.active = { layoutId: out.row.mergeId, principal: out.row.principal, tiles: out.row.resolution, digest: out.row.digest };
    }
    return out;
  }

  /** Verified re-hydration: digest-checked (a vault row post-reinstall or a
   *  re-serialized ledger row); on success the layout becomes active. */
  restore(row: LayoutSnapshot): RestoreOutcome {
    const out = restoreSnapshot(row);
    if (out.ok) {
      this.rows.set(out.row.layoutId, out.row);
      this.active = out.row;
    }
    return out;
  }

  get(layoutId: string): LayoutSnapshot | null { return this.rows.get(layoutId) ?? null; }
  getMerge(mergeId: string): LayoutMergeRecord | null { return this.merges.get(mergeId) ?? null; }
  activeLayout(): LayoutSnapshot | null { return this.active; }
  list(): string[] { return [...this.rows.keys()].sort(); }
  mergeList(): string[] { return [...this.merges.keys()].sort(); }

  /** The headless read view. */
  read(layoutId?: string): { row: LayoutSnapshot | null; rendered: string } {
    if (layoutId !== undefined) {
      const row = this.rows.get(layoutId) ?? null;
      return { row, rendered: row !== null ? renderLayout(row) : `layout ${layoutId} is not in the ledger (D-446)` };
    }
    const lines = [`layout.read — ${this.rows.size} snapshot(s), ${this.merges.size} merge record(s)`];
    for (const id of this.list()) lines.push(`  ${renderLayout(this.rows.get(id)!)}`);
    for (const id of this.mergeList()) lines.push(`  ${renderMerge(this.merges.get(id)!)}`);
    lines.push(this.active !== null ? `active: ${this.active.layoutId} (digest ${this.active.digest.slice(0, 22)}…)` : "active: (nothing restored yet)");
    return { row: this.active, rendered: lines.join("\n") };
  }
}
