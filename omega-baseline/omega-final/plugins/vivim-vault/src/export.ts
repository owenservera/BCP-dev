// vivim-vault — export.ts (D-432, Ω-0.5)
// Namespace-scoped, chain-preserving export and verified import.
//
// The law (spec Ω-0.5 §3.5, translated):
//   · Export refuses VAULT_EXPORT_SCOPE_UNNAMED unless every namespace is
//     named WITH its retention rule — an export without a forgetting law is
//     a leak waiting to happen.
//   · The archive carries the namespace's chain segment (rows + linkage +
//     segment head), its object revisions, its CAS blobs byte-faithfully,
//     its badges (per-ns chain seal) and retention manifest, and the
//     quarantine artifacts its vault.recovery rows cite.
//   · The archive refuses to exist unless it verifies against itself.
//   · Import verifies the segment BEFORE any merge (VAULT_IMPORT_CHAIN_MISMATCH
//     on divergence, on a mid-chain segment whose prefix it would have to
//     fabricate, or on a non-empty target — no cross-vault sync semantics,
//     by the spec's own refusal), then inserts rows and blobs verbatim,
//     rebuilds FTS, and runs the full merkle walk green.
//
// As-built honesty (the record's note 4): import merges GENESIS segments into
// FRESH vaults only. A segment whose rows interleave with out-of-scope
// namespaces (their prev_hash chains through rows the archive does not carry)
// refuses rather than fabricating its prefix. Export encryption is a keyRef
// pass-through: Trust Mesh (Ω-4) does not exist yet, so no key management is
// claimed or performed.
import { existsSync, mkdirSync } from "node:fs";
import { isAbsolute } from "node:path";
import { casGet, casPut } from "./cas.ts";
import { bodyText, canonicalJson, entryHash, sha256Hex, GENESIS_HASH } from "./canon.ts";
import { appendObject } from "./changelog.ts";
import { dbPath, DDL, ftsInsert, openDatabase, openVault, type VaultDB } from "./sql.ts";
import { verify } from "./verify.ts";
import { listQuarantineArtifacts, readQuarantineArtifact, RECOVERY_NS, writeRawQuarantineArtifact, writeQuarantineArtifact, type QuarantineSidecar } from "./wal.ts";

export const EXPORT_SCOPE_UNNAMED = "VAULT_EXPORT_SCOPE_UNNAMED";
export const IMPORT_CHAIN_MISMATCH = "VAULT_IMPORT_CHAIN_MISMATCH";

export interface ExportScope { ns: string; retention: string }

export interface SegmentRow {
  seq: number; causationId: string; ns: string; id: string; rev: number;
  cid: string; entryHash: string; prevHash: string;
}

export interface NamespaceSeal { ns: string; rows: number; headHash: string; retention: string }

export interface RecoveryCarry {
  rowId: string; data: Record<string, unknown>;
  artifactHash: string; artifactBytesBase64: string; sidecar: QuarantineSidecar;
}

export interface VaultArchive {
  kind: "vault.export";
  version: 1;
  namespaces: ExportScope[];
  segment: SegmentRow[];
  gaps: string[];             // external prev_hashes the segment chains through (named, never fabricated)
  seals: NamespaceSeal[];     // per-ns chain seal (derived from the segment — the badge)
  objects: Array<{ ns: string; id: string; rev: number; cid: string; meta: string }>;
  cold: Array<{ ns: string; id: string; rev: number; cid: string; meta: string; movedAt: number }>;
  blobs: Record<string, string>; // cid → canonical JSON text (the CAS bytes, byte-faithful)
  recovery: RecoveryCarry[];  // quarantine artifacts + the rows they owe, for in-scope tears
  archiveHash: string;        // sha256 over everything above (self-certifying)
}

function b64(bytes: Buffer): string { return bytes.toString("base64"); }
function unb64(text: string): Buffer { return Buffer.from(text, "base64"); }

/** Build the archive for the named scopes. READ over the vault; the caller persists it. */
export function exportVault(v: VaultDB, scopes: ExportScope[]): VaultArchive {
  if (!Array.isArray(scopes) || scopes.length === 0) {
    throw new Error(`${EXPORT_SCOPE_UNNAMED}: export requires at least one {ns, retention} scope — an export without a forgetting law is a leak waiting to happen (D-432; spec Ω-0.5 §3.5)`);
  }
  const seen = new Set<string>();
  for (const s of scopes) {
    if (typeof s.ns !== "string" || s.ns.length === 0 || typeof s.retention !== "string" || s.retention.length === 0) {
      throw new Error(`${EXPORT_SCOPE_UNNAMED}: every scope needs a non-empty ns AND retention rule (got ns=${String(s.ns)}, retention=${String(s.retention)}) (D-432)`);
    }
    if (seen.has(s.ns)) throw new Error(`${EXPORT_SCOPE_UNNAMED}: duplicate scope ns '${s.ns}' (D-432)`);
    seen.add(s.ns);
  }
  const nsSet = new Set(scopes.map((s) => s.ns));
  const db = v.db;

  // the segment: changelog rows of the scoped namespaces, original linkage preserved
  const segment: SegmentRow[] = (db.query(
    "SELECT seq, causationId, ns, id, rev, cid, entry_hash, prev_hash FROM changelog WHERE ns IN (SELECT value FROM json_each(?)) ORDER BY seq ASC",
  ).all(JSON.stringify([...nsSet])) as unknown as Array<{ seq: number; causationId: string; ns: string; id: string; rev: number; cid: string; entry_hash: string; prev_hash: string }>)
    .map((r) => ({ seq: r.seq, causationId: r.causationId, ns: r.ns, id: r.id, rev: r.rev, cid: r.cid, entryHash: r.entry_hash, prevHash: r.prev_hash }));

  // self-verify pass 1: every segment row's entry hash recomputes
  for (const row of segment) {
    const recomputed = entryHash(row.seq, row.causationId, row.ns, row.id, row.rev, row.cid, row.prevHash);
    if (recomputed !== row.entryHash) {
      throw new Error(`${IMPORT_CHAIN_MISMATCH}: segment row seq ${row.seq} (${row.ns}/${row.id}@${row.rev}) has an entry hash that does not recompute — the archive refuses to exist unless it verifies against itself (D-432)`);
    }
  }

  // the gaps: prev_hashes that chain through rows OUTSIDE the scopes (named, never carried wrong)
  const segHashes = new Set(segment.map((r) => r.entryHash));
  const gaps = new Set<string>();
  let prev: SegmentRow | null = null;
  for (const row of segment) {
    const chainsToPrev = prev !== null && row.prevHash === prev.entryHash;
    if (!chainsToPrev && row.prevHash !== GENESIS_HASH && !segHashes.has(row.prevHash)) gaps.add(row.prevHash);
    prev = row;
  }

  // seals: per-ns chain seal — rows counted, head = last entry hash in that ns
  const seals: NamespaceSeal[] = scopes.map((s) => {
    const rows = segment.filter((r) => r.ns === s.ns);
    return { ns: s.ns, rows: rows.length, headHash: rows.length > 0 ? rows[rows.length - 1].entryHash : GENESIS_HASH, retention: s.retention };
  });

  // objects + blobs (hot and cold) for the scoped namespaces
  const objects = (db.query("SELECT ns, id, rev, cid, meta FROM objects WHERE ns IN (SELECT value FROM json_each(?)) ORDER BY ns, id, rev", ).all(JSON.stringify([...nsSet])) as unknown as { ns: string; id: string; rev: number; cid: string; meta: string }[])
    .map((r) => ({ ns: r.ns, id: r.id, rev: r.rev, cid: r.cid, meta: r.meta }));
  const cold = (db.query("SELECT ns, id, rev, cid, meta, moved_at FROM cold_objects WHERE ns IN (SELECT value FROM json_each(?)) ORDER BY ns, id, rev").all(JSON.stringify([...nsSet])) as unknown as { ns: string; id: string; rev: number; cid: string; meta: string; moved_at: number }[])
    .map((r) => ({ ns: r.ns, id: r.id, rev: r.rev, cid: r.cid, meta: r.meta, movedAt: r.moved_at }));

  const blobs: Record<string, string> = {};
  for (const row of [...objects, ...cold]) {
    if (blobs[row.cid] !== undefined) continue;
    // the CAS blob IS the canonical JSON bytes — carried byte-faithfully as text
    blobs[row.cid] = canonicalJson(casGet(v.dataDir, row.cid));
  }

  // recovery carries: vault.recovery rows whose quarantines concerned in-scope namespaces
  const recovery: RecoveryCarry[] = [];
  const artifacts = listQuarantineArtifacts(v.dataDir);
  const recRows = db.query("SELECT id, cid FROM objects WHERE ns = ? ORDER BY id, rev", ).all(RECOVERY_NS) as { id: string; cid: string }[];
  const artifactByHash = new Map(artifacts.map((a) => [a.hash, a]));
  for (const rec of recRows) {
    const data = casGet(v.dataDir, rec.cid) as Record<string, unknown>;
    const ns = data["ns"];
    if (typeof ns !== "string" || !nsSet.has(ns)) continue; // out-of-scope tear
    const hash = data["quarantineHash"];
    const artifact = typeof hash === "string" ? artifactByHash.get(hash) : undefined;
    if (!artifact) throw new Error(`${IMPORT_CHAIN_MISMATCH}: ${RECOVERY_NS} row ${rec.id} cites quarantine ${String(hash)} that does not exist — the archive refuses to carry a citation without its evidence (D-432)`);
    recovery.push({
      rowId: rec.id,
      data,
      artifactHash: artifact.hash,
      artifactBytesBase64: b64(readQuarantineArtifact(v.dataDir, artifact.hash)),
      sidecar: artifact.sidecar ?? { rowId: rec.id, causationId: String(data["causationId"] ?? "recovery:import"), data },
    });
  }

  const archive: Omit<VaultArchive, "archiveHash"> = {
    kind: "vault.export", version: 1, namespaces: scopes, segment, gaps: [...gaps].sort(),
    seals, objects, cold, blobs, recovery,
  };
  const archiveHash = sha256Hex(canonicalJson(archive));
  return { ...archive, archiveHash };
}

export interface ImportResult {
  ok: boolean;
  rows: number;
  blobs: number;
  headHash: string;
  recoveryRowsReMinted: number;
}

/**
 * Import a genesis-shaped archive into a FRESH vault directory. Verifies the
 * segment BEFORE any merge; inserts rows and blobs verbatim; rebuilds FTS;
 * re-mints the recovery rows as fresh appends (their payloads preserved);
 * runs the full merkle walk. Returns the verdict — green or a named refusal.
 */
export async function importVault(targetDir: string, archive: VaultArchive): Promise<ImportResult> {
  if (typeof targetDir !== "string" || targetDir.length === 0 || !isAbsolute(targetDir)) {
    throw new Error(`vault.import@1: targetDir must be an absolute path (got ${String(targetDir)})`);
  }
  if (archive.kind !== "vault.export" || archive.version !== 1) {
    throw new Error(`${IMPORT_CHAIN_MISMATCH}: not a vault.export v1 archive (kind=${String(archive.kind)}, version=${String(archive.version)}) (D-432)`);
  }
  const hashCheck = sha256Hex(canonicalJson({ ...archive, archiveHash: undefined }));
  if (hashCheck !== archive.archiveHash) {
    throw new Error(`${IMPORT_CHAIN_MISMATCH}: archive hash mismatch — the archive was modified after it was built (${hashCheck.slice(0, 12)}… ≠ ${archive.archiveHash.slice(0, 12)}…) (D-432)`);
  }
  if (existsSync(dbPath(targetDir))) {
    throw new Error(`${IMPORT_CHAIN_MISMATCH}: target ${targetDir} already holds a vault — import merges GENESIS segments into FRESH vaults only; cross-vault sync semantics are refused by the spec (D-432; spec Ω-0.5 §3.5)`);
  }

  // segment verification BEFORE any merge
  const seg = [...archive.segment].sort((a, b) => a.seq - b.seq);
  for (let i = 0; i < seg.length; i++) {
    const row = seg[i];
    const recomputed = entryHash(row.seq, row.causationId, row.ns, row.id, row.rev, row.cid, row.prevHash);
    if (recomputed !== row.entryHash) {
      throw new Error(`${IMPORT_CHAIN_MISMATCH}: segment row seq ${row.seq} (${row.ns}/${row.id}@${row.rev}) entry hash does not recompute (D-432)`);
    }
    if (row.seq !== i + 1) {
      throw new Error(`${IMPORT_CHAIN_MISMATCH}: segment is not genesis-shaped (first seq is ${seg[0].seq}, not 1) — a mid-chain segment whose prefix it would have to fabricate (D-432)`);
    }
    if (i === 0) {
      if (row.prevHash !== GENESIS_HASH) {
        throw new Error(`${IMPORT_CHAIN_MISMATCH}: the segment starts mid-chain (seq ${row.seq} chains to ${row.prevHash.slice(0, 12)}…, not genesis) — importing it would fabricate its prefix, and fabrication is refused (D-432)`);
      }
    } else {
      const prevRow = seg[i - 1];
      if (row.prevHash !== prevRow.entryHash) {
        throw new Error(`${IMPORT_CHAIN_MISMATCH}: segment linkage breaks at seq ${row.seq} (chains to ${row.prevHash.slice(0, 12)}…, previous in-segment head is ${prevRow.entryHash.slice(0, 12)}…) — a mid-chain segment whose prefix it would have to fabricate (D-432)`);
      }
    }
  }
  // every object's blob must be present
  for (const row of [...archive.objects, ...archive.cold]) {
    if (archive.blobs[row.cid] === undefined) {
      throw new Error(`${IMPORT_CHAIN_MISMATCH}: object ${row.ns}/${row.id}@${row.rev} cites blob ${row.cid} the archive does not carry (D-432)`);
    }
  }

  // merge: fresh vault, verbatim rows, blobs, FTS rebuild
  mkdirSync(targetDir, { recursive: true });
  for (const cid of Object.keys(archive.blobs)) {
    casPut(targetDir, JSON.parse(archive.blobs[cid]));
  }
  const target = openDatabase(dbPath(targetDir));
  target.exec("PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL;");
  target.exec(DDL);
  try {
    target.exec("BEGIN IMMEDIATE");
    for (const row of seg) {
      target.query("INSERT INTO changelog (seq, causationId, ns, id, rev, cid, entry_hash, prev_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .run(row.seq, row.causationId, row.ns, row.id, row.rev, row.cid, row.entryHash, row.prevHash);
    }
    for (const row of archive.objects) {
      target.query("INSERT INTO objects (ns, id, rev, cid, meta) VALUES (?, ?, ?, ?, ?)").run(row.ns, row.id, row.rev, row.cid, row.meta);
    }
    for (const row of archive.cold) {
      target.query("INSERT INTO cold_objects (ns, id, rev, cid, meta, moved_at) VALUES (?, ?, ?, ?, ?, ?)").run(row.ns, row.id, row.rev, row.cid, row.meta, row.movedAt);
    }
    for (const row of archive.objects) {
      ftsInsert(target, row.ns, row.id, row.rev, bodyText(JSON.parse(archive.blobs[row.cid])));
    }
    target.exec("COMMIT");
  } catch (err) {
    try { target.exec("ROLLBACK"); } catch { /* already rolled back */ }
    throw err;
  } finally {
    target.close();
  }

  // recovery carries: artifacts + sidecars first (the evidence), then re-mint the rows
  for (const carry of archive.recovery) {
    writeRawQuarantineArtifact(targetDir, carry.artifactHash, unb64(carry.artifactBytesBase64));
    writeQuarantineArtifact(targetDir, carry.artifactHash, unb64(carry.artifactBytesBase64), carry.sidecar);
  }
  const fresh = openVault(targetDir);
  try {
    await fresh.enqueueWrite(() => {
      for (const carry of archive.recovery) {
        appendObject(fresh, { ns: RECOVERY_NS, id: carry.rowId, data: carry.data, meta: null, refs: [], causationId: `import:recovery:${carry.rowId}` });
      }
    });
    const reMinted = archive.recovery.length;
    const verdict = verify(fresh);
    if (!verdict.ok) {
      throw new Error(`${IMPORT_CHAIN_MISMATCH}: the imported vault fails its own merkle walk (${verdict.detail ?? `corrupt at seq ${String(verdict.corruptAt)}`}) (D-432)`);
    }
    return { ok: true, rows: seg.length, blobs: Object.keys(archive.blobs).length, headHash: verdict.headHash, recoveryRowsReMinted: reMinted };
  } finally {
    fresh.close();
  }
}
