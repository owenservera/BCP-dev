// tooling/gates/test/f-durability.test.ts — the F-DURABILITY falsifier (D-432, Ω-0.5).
// Generated as a RED stub by `omega:loop --stub D-432`, then implemented.
//  F-DURABILITY.1 chaos-append — 100 randomized torn appends: zero corrupted folds, every tear quarantined as a ledgered refusal-shaped row, the fold sees exactly the committed rows
//  F-DURABILITY.2 migration-rehearsal — a real schema change lands only through dry-run first; old-shape rows still verify under their mint-time schema; rollback points are ledgered
//  F-DURABILITY.3 compaction-guard — a compaction plan touching a referenced blob refuses VAULT_COMPACTION_REFERENCED_BLOB; a legal compaction leaves merkle verification green
//  F-DURABILITY.4 export-import — namespace-scoped export → wipe → import on a fresh vault: chain verifies, badges + retention carried
//  F-DURABILITY.5 headless — the whole ceremony is daemon/CLI-only, zero canvas dependency
//  F-DURABILITY.6 loud-failure — zero silent truncation/reconstruction paths: every recovery decision is a ledgered row or a named refusal
import { describe, test, expect } from "bun:test";
import { closeSync, mkdirSync, openSync, readFileSync, rmSync, writeSync } from "node:fs";
import { join } from "node:path";
import { omegaTmp } from "@vivim/omega-platform";
import { appendObject, beginIntentOnly, chainHead } from "../../../plugins/vivim-vault/src/changelog.ts";
import "../../../plugins/vivim-vault/src/db.ts"; // binds the Bun driver lane (D-373)
import { auditRecovery, recoverVault } from "../../../plugins/vivim-vault/src/durability.ts";
import { exportVault, importVault } from "../../../plugins/vivim-vault/src/export.ts";
import { compactDryrun, compactGuarded } from "../../../plugins/vivim-vault/src/compaction.ts";
import { currentSchemaVersion, migrate, migrateDryrun, MIGRATION_NS, planRowId, versionRowId } from "../../../plugins/vivim-vault/src/migrate.ts";
import { journalAppendable, journalPath, RECOVERY_NS, walkJournal, writeRawQuarantineArtifact } from "../../../plugins/vivim-vault/src/wal.ts";
import { casGet, casPut } from "../../../plugins/vivim-vault/src/cas.ts";
import { cidOf, entryHash } from "../../../plugins/vivim-vault/src/canon.ts";
import { envelopeOf, ftsInsert, openVault, type VaultDB } from "../../../plugins/vivim-vault/src/sql.ts";
import { verify } from "../../../plugins/vivim-vault/src/verify.ts";

let seq = 0;
function tmp(name: string): string {
  const dir = omegaTmp("omega-f-durability", `${name}-${Date.now()}-${process.pid}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  return dir;
}
async function append(v: VaultDB, ns: string, id: string, data: unknown, refs: { ns: string; id: string; rev: number }[] = []) {
  return v.enqueueWrite(() => appendObject(v, { ns, id, data, meta: null, refs, causationId: `fd32_c_${++seq}` }));
}

/** Deterministic PRNG (mulberry32) — the chaos sequence is reproducible, failures are not flaky. */
function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Append raw bytes to the journal WITHOUT a terminator — the torn-tail shape a crash leaves. */
function tearRawBytes(v: VaultDB, bytes: string): void {
  const fd = openSync(journalPath(v.dataDir), "a");
  try { writeSync(fd, bytes); } finally { closeSync(fd); }
}

describe("F-DURABILITY.1 (chaos-append) — 100 randomized torn appends", () => {
  test("zero corrupted folds, every tear quarantined + ledgered, the fold sees exactly the committed rows", async () => {
    const dir = tmp("chaos");
    const v = openVault(dir);
    const rand = prng(20260921);
    const shape = ["intent-only", "raw-garbage", "torn-commit"] as const;
    let committedAppends = 0;
    let expectedRecoveryRows = 0;
    for (let i = 0; i < 100; i++) {
      // 1-2 committed appends first (the state a crash interrupts)
      const n = 1 + Math.floor(rand() * 2);
      for (let k = 0; k < n; k++) {
        await append(v, "chat", `m${i}`, { i, k, body: `message ${i}-${k}` });
        committedAppends++;
      }
      // the tear, in one of three crash shapes
      const s = shape[Math.floor(rand() * shape.length)]!;
      if (s === "intent-only") {
        await v.enqueueWrite(() => { beginIntentOnly(v, { ns: "chat", id: `torn${i}`, data: { lost: i }, meta: null, refs: [], causationId: `fd32_tear_${i}` }); });
        expectedRecoveryRows++;
      } else if (s === "raw-garbage") {
        tearRawBytes(v, `{"kind":"append.intent","ns":"chat","id":"half${i}","rev`); // no newline, mid-JSON
        expectedRecoveryRows++;
      } else {
        await v.enqueueWrite(() => { beginIntentOnly(v, { ns: "chat", id: `torn${i}`, data: { lost: i }, meta: null, refs: [], causationId: `fd32_tear2_${i}` }); });
        tearRawBytes(v, `{"kind":"append.commit","intentRef":${9999 + i},`); // commit line cut mid-byte
        expectedRecoveryRows += 2; // the intent AND the partial commit bytes
      }
      // recovery: the ceremony must run before anything else appends
      const r = await v.enqueueWrite(() => recoverVault(v));
      expect(r.ok).toBe(true);
      expect(r.clean).toBe(false);
      // the journal is appendable again (clean boundary)
      const appendable = journalAppendable(v.dataDir);
      expect(appendable.appendable).toBe(true);
      // the fold is NOT corrupted
      const verdict = verify(v);
      expect(verdict.ok).toBe(true);
      // nothing torn ever folded: chat ids from tear shapes never appear
      const folded = v.db.query("SELECT id FROM objects WHERE ns = 'chat' AND (id LIKE 'torn%' OR id LIKE 'half%')").all();
      expect(folded.length).toBe(0);
    }
    // every tear is a ledgered refusal-shaped row (the accounting closes)
    const recoveryRows = v.db.query("SELECT COUNT(*) AS c FROM objects WHERE ns = ?", ).get(RECOVERY_NS) as { c: number };
    expect(recoveryRows.c).toBe(expectedRecoveryRows);
    // the fold sees exactly the committed rows + the recovery accounting
    const total = v.db.query("SELECT COUNT(*) AS c FROM changelog").get() as { c: number };
    expect(total.c).toBe(committedAppends + recoveryRows.c);
    // audit both directions: every artifact has its row, every row cites its evidence
    const audit = auditRecovery(v);
    expect(audit.ok).toBe(true);
    v.close();
    rmSync(dir, { recursive: true, force: true });
  }, 60000);

  test("committed-data-torn-commit keeps the data (SQLite proved it) and ledgers the torn accounting", async () => {
    const dir = tmp("committed-tear");
    const v = openVault(dir);
    await append(v, "chat", "a", { v: 1 });
    // simulate: the data transaction COMMITTED but the commit line never landed
    const intent = await v.enqueueWrite(() => {
      const predicted = beginIntentOnly(v, { ns: "chat", id: "b", data: { v: 2 }, meta: null, refs: [], causationId: "fd32_ct" });
      return predicted;
    });
    // now do the data append WITHOUT the journal's commit line: run the raw body by
    // hand — transaction + no commit line (the committed-data-torn-commit shape)
    await v.enqueueWrite(() => {
      const db = v.db;
      const data = { v: 2 };
      const cid = cidOf(data);
      casPut(v.dataDir, data);
      db.exec("BEGIN IMMEDIATE");
      const rev = intent.intent.rev;
      db.query("INSERT INTO objects (ns, id, rev, cid, meta) VALUES (?, ?, ?, ?, ?)").run("chat", "b", rev, cid, envelopeOf(null, []));
      ftsInsert(db, "chat", "b", rev, JSON.stringify(data));
      const seqv = intent.intent.seq;
      const rowHash = entryHash(seqv, "fd32_ct", "chat", "b", rev, cid, intent.intent.prevHash);
      db.query("INSERT INTO changelog (seq, causationId, ns, id, rev, cid, entry_hash, prev_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .run(seqv, "fd32_ct", "chat", "b", rev, cid, rowHash, intent.intent.prevHash);
      db.exec("COMMIT");
    });
    const r = await v.enqueueWrite(() => recoverVault(v));
    expect(r.clean).toBe(false);
    const kept = v.db.query("SELECT rev FROM objects WHERE ns = 'chat' AND id = 'b'").get() as { rev: number };
    expect(kept.rev).toBe(intent.intent.rev); // the fold KEEPS provably-committed data
    const rec = v.db.query("SELECT cid FROM objects WHERE ns = ? ORDER BY rev DESC LIMIT 1", ).get(RECOVERY_NS) as { cid: string };
    const data = casGet(v.dataDir, rec.cid) as Record<string, unknown>;
    expect(data["dataCommitted"]).toBe(true); // and the torn accounting names it
    expect(verify(v).ok).toBe(true);
    expect(auditRecovery(v).ok).toBe(true);
    v.close();
    rmSync(dir, { recursive: true, force: true });
  });
});

describe("F-DURABILITY.2 (migration-rehearsal)", () => {
  test("execute without dry-run refuses; dry-run ledgers the plan + stamps genesis; old rows verify after the real change; rollback points are ledgered and cited", async () => {
    const dir = tmp("migrate");
    const v = openVault(dir);
    await append(v, "chat", "a", { v: 1 });
    await append(v, "chat", "a", { v: 2 });
    // execute first: refused, named
    await expect(v.enqueueWrite(() => migrate(v, {}))).rejects.toThrow(/VAULT_MIGRATION_REQUIRES_DRYRUN/);
    // dry-run: census + plan + the genesis stamp (v1 becomes a real row)
    const plan = await v.enqueueWrite(() => migrateDryrun(v, {}));
    expect(plan.from).toBe(1);
    expect(plan.to).toBe(2);
    expect(plan.rollbackPoint.stamped).toBe(true);
    const stamp = v.db.query("SELECT 1 FROM objects WHERE ns = ? AND id = ?", ).get(MIGRATION_NS, versionRowId(1));
    expect(stamp).not.toBeNull();
    // execute: the real schema change (vault_meta lands), version row ledgered
    const result = await v.enqueueWrite(() => migrate(v, {}));
    expect(result.applied).toEqual([2]);
    expect(currentSchemaVersion(v.db)).toBe(2);
    const v2row = v.db.query("SELECT 1 FROM objects WHERE ns = ? AND id = ?", ).get(MIGRATION_NS, versionRowId(2));
    expect(v2row).not.toBeNull();
    // old-shape rows still verify under their mint-time schema
    const verdict = verify(v);
    expect(verdict.ok).toBe(true);
    const back = v.db.query("SELECT cid FROM objects WHERE ns = 'chat' AND id = 'a' ORDER BY rev DESC LIMIT 1").get() as { cid: string };
    expect(casGet(v.dataDir, back.cid)).toEqual({ v: 2 });
    // the uncited rollback point: a plan whose rollback row does not resolve refuses
    const dirB = tmp("migrate-uncited");
    const vb = openVault(dirB);
    await append(vb, "chat", "x", { v: 1 });
    await vb.enqueueWrite(() => migrateDryrun(vb, {})); // the honest plan (rev 1)
    await vb.enqueueWrite(() => {
      appendObject(vb, {
        ns: MIGRATION_NS, id: planRowId(1, 2),
        data: { kind: "migration-plan", from: 1, to: 2, steps: [], censusDigest: "x", rollbackPoint: { ns: MIGRATION_NS, id: "version:v999" }, at: Date.now() },
        meta: null, refs: [], causationId: "fd32_fakeplan",
      });
    });
    await expect(vb.enqueueWrite(() => migrate(vb, {}))).rejects.toThrow(/VAULT_MIGRATION_ROLLBACK_UNCITED/);
    vb.close();
    rmSync(dirB, { recursive: true, force: true });
    // and the honest vault's state is unchanged: already at v2
    expect(currentSchemaVersion(v.db)).toBe(2);
    v.close();
    rmSync(dir, { recursive: true, force: true });
  });
});

describe("F-DURABILITY.3 (compaction-guard)", () => {
  test("a plan touching a referenced blob refuses VAULT_COMPACTION_REFERENCED_BLOB; the legal re-plan compacts and the merkle walk stays green", async () => {
    const dir = tmp("compact");
    const v = openVault(dir);
    await append(v, "docs", "a", { v: 1 });
    await append(v, "docs", "a", { v: 2 });
    await append(v, "docs", "a", { v: 3 }); // keep=1 → a@1, a@2 are candidates
    const plan = await v.enqueueWrite(() => compactDryrun(v, "docs", 1));
    expect(plan.candidates).toEqual([{ id: "a", rev: 1 }, { id: "a", rev: 2 }]);
    // a live object now cites a@2 — the plan touches a referenced blob
    await append(v, "notes", "n1", { cites: "docs/a@2" }, [{ ns: "docs", id: "a", rev: 2 }]);
    await expect(v.enqueueWrite(() => compactGuarded(v, { ns: "docs", keep: 1, censusDigest: plan.censusDigest })))
      .rejects.toThrow(/VAULT_COMPACTION_REFERENCED_BLOB.*docs\/a@2/);
    // nothing moved yet (the guard fires BEFORE any mutation)
    const hot = v.db.query("SELECT COUNT(*) AS c FROM objects WHERE ns = 'docs'").get() as { c: number };
    expect(hot.c).toBe(3);
    // the legal re-plan: the census now excludes a@2
    const plan2 = await v.enqueueWrite(() => compactDryrun(v, "docs", 1));
    expect(plan2.candidates).toEqual([{ id: "a", rev: 1 }]);
    expect(plan2.excluded).toEqual([{ id: "a", rev: 2 }]);
    const done = await v.enqueueWrite(() => compactGuarded(v, { ns: "docs", keep: 1, censusDigest: plan2.censusDigest }));
    expect(done.moved).toBe(1);
    // the receipt row is ledgered
    const receipt = v.db.query("SELECT 1 FROM objects WHERE ns = 'vault.compact' AND id LIKE 'receipt:%'").get();
    expect(receipt).not.toBeNull();
    // referenced revision survived; a@1 moved to cold, never deleted
    const a2 = v.db.query("SELECT 1 FROM objects WHERE ns = 'docs' AND id = 'a' AND rev = 2").get();
    expect(a2).not.toBeNull();
    const cold1 = v.db.query("SELECT 1 FROM cold_objects WHERE ns = 'docs' AND id = 'a' AND rev = 1").get();
    expect(cold1).not.toBeNull();
    // the merkle chain never changed: verify green
    expect(verify(v).ok).toBe(true);
    v.close();
    rmSync(dir, { recursive: true, force: true });
  });
});

describe("F-DURABILITY.4 (export-import)", () => {
  test("namespace-scoped export → import on a fresh vault: chain verifies, seals + retention carried; mid-chain and non-empty targets refuse", async () => {
    const dir = tmp("export");
    const v = openVault(dir);
    await append(v, "chat", "a", { v: 1 });
    await append(v, "chat", "a", { v: 2 });
    await append(v, "chat", "b", { v: 1 });
    // a tear + recovery in scope (the archive must carry its evidence)
    await v.enqueueWrite(() => { beginIntentOnly(v, { ns: "chat", id: "torn", data: { lost: true }, meta: null, refs: [], causationId: "fd32_e" }); });
    await v.enqueueWrite(() => recoverVault(v));
    const archive = exportVault(v, [{ ns: "chat", retention: "chat-forever" }]);
    expect(archive.segment.length).toBe(3);
    expect(archive.seals).toEqual([{ ns: "chat", rows: 3, headHash: archive.seals[0]!.headHash, retention: "chat-forever" }]);
    expect(archive.recovery.length).toBe(1); // the in-scope tear's evidence rides along
    // wipe → import on a fresh vault
    const dir2 = tmp("import");
    const result = await importVault(dir2, archive);
    expect(result.ok).toBe(true);
    expect(result.rows).toBe(3);
    const fresh = openVault(dir2);
    expect(verify(fresh).ok).toBe(true);
    // chat rows came back verbatim
    const a2 = fresh.db.query("SELECT cid FROM objects WHERE ns = 'chat' AND id = 'a' ORDER BY rev DESC LIMIT 1").get() as { cid: string };
    expect(casGet(fresh.dataDir, a2.cid)).toEqual({ v: 2 });
    // the recovery evidence carried: the imported vault's audit is green
    expect(auditRecovery(fresh).ok).toBe(true);
    // re-export: the seal (the badge) and the retention manifest survive the round trip
    const archive2 = exportVault(fresh, [{ ns: "chat", retention: "chat-forever" }]);
    expect(archive2.seals[0]!.headHash).toBe(archive.seals[0]!.headHash);
    expect(archive2.namespaces).toEqual(archive.namespaces);
    // mid-chain refusal: a vault whose ns interleaves with another ns
    const dir3 = tmp("midchain");
    const v3 = openVault(dir3);
    await append(v3, "chat", "a", { v: 1 });
    await append(v3, "other", "o", { v: 1 });
    await append(v3, "chat", "a", { v: 2 });
    const mid = exportVault(v3, [{ ns: "chat", retention: "r" }]);
    const dir4 = tmp("midchain-target");
    await expect(importVault(dir4, mid)).rejects.toThrow(/VAULT_IMPORT_CHAIN_MISMATCH.*mid-chain/);
    // non-empty target refusal
    await expect(importVault(dir2, archive)).rejects.toThrow(/VAULT_IMPORT_CHAIN_MISMATCH.*already holds a vault/);
    // scope refusal: no retention named
    expect(() => exportVault(v3, [{ ns: "chat" } as { ns: string; retention: string }])).toThrow(/VAULT_EXPORT_SCOPE_UNNAMED/);
    expect(() => exportVault(v3, [])).toThrow(/VAULT_EXPORT_SCOPE_UNNAMED/);
    fresh.close(); v3.close(); v.close();
    for (const d of [dir, dir2, dir3, dir4]) rmSync(d, { recursive: true, force: true });
  });
});

describe("F-DURABILITY.5 (headless)", () => {
  test("the durability modules import no canvas/surface dependency — the ceremony is daemon/CLI-only by construction", () => {
    const files = ["wal.ts", "durability.ts", "migrate.ts", "export.ts", "compaction.ts", "changelog.ts"] as const;
    for (const f of files) {
      const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-vault", "src", f), "utf-8");
      expect(/from\s+"@vivim\/(omega-)?(surfaces|canvas|web|daemon-client)/.test(src)).toBe(false);
      expect(/from\s+"\.\.\/\.\.\/surfaces\//.test(src)).toBe(false);
    }
    // the ops are data-in/data-out: no DOM globals USED (property access — the
    // English word "window" in a comment about the interruption window is prose)
    for (const f of files) {
      const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-vault", "src", f), "utf-8");
      expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    }
  });
});

describe("F-DURABILITY.6 (loud-failure)", () => {
  test("appending over a torn journal refuses by name; an unledgered quarantine artifact refuses by name; recovery leaves no decision without a row", async () => {
    const dir = tmp("loud");
    const v = openVault(dir);
    await append(v, "chat", "a", { v: 1 });
    // torn tail: appending past it is refused (the silent path would bury garbage)
    tearRawBytes(v, '{"kind":"append.intent","ns":"chat"');
    const appendable = journalAppendable(v.dataDir);
    expect(appendable.appendable).toBe(false);
    // ONE queue level: the raw appendObject inside the write queue (nesting
    // enqueueWrite inside enqueueWrite is a promise-queue cycle — the helper
    // wraps too, so the refusal path is exercised directly here)
    await expect(v.enqueueWrite(() => appendObject(v, { ns: "chat", id: "b", data: { v: 2 }, meta: null, refs: [], causationId: "fd32_loud_refuse" }))).rejects.toThrow(/not appendable/);
    // an unledgered artifact with no sidecar: the repair costume refuses
    writeRawQuarantineArtifact(v.dataDir, "a".repeat(64), Buffer.from("rogue bytes"));
    await expect(v.enqueueWrite(() => recoverVault(v))).rejects.toThrow(/VAULT_RECOVERY_UNLEDGERED/);
    // remove the rogue artifact; recovery now completes and every decision has a row
    rmSync(join(v.dataDir, "quarantine", "aa", "a".repeat(64)));
    const r = await v.enqueueWrite(() => recoverVault(v));
    const rowsWithDetail = v.db.query("SELECT cid FROM objects WHERE ns = ?", ).all(RECOVERY_NS) as { cid: string }[];
    expect(r.quarantines.length).toBe(rowsWithDetail.length);
    // the walk is clean and appendable again
    expect(journalAppendable(v.dataDir).appendable).toBe(true);
    expect(walkJournal(v.dataDir).tornTail).toBeNull();
    expect(verify(v).ok).toBe(true);
    expect(auditRecovery(v).ok).toBe(true);
    v.close();
    rmSync(dir, { recursive: true, force: true });
  });
});
