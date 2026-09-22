// tooling/gates/test/f-boot.test.ts — the F-BOOT falsifier (D-431, Ω-0 / spec D-449).
// Generated as a RED stub by `omega:loop --stub D-431`, then implemented.
//  F-BOOT.1 byte-identical ×2 — two verifies of the same archive yield identical stage tuples for S1–S4, gate green both times, receipts differing only in bootId/bootedAt
//  F-BOOT.2 rogue-injection refusal — a file planted in the boot tree fires BOOT_UNVERIFIED_FILE with the path named; the boot HALTS (no stage after, no receipt); the refusal is ledgered and replayable
//  F-BOOT.3 self-forge mechanical — emit on the pristine tree reports selfForge:true by root-hash equality; one corrupted byte yields BOOT_EMIT_DIVERGENCE naming the path; no --consent is BOOT_NO_CONSENT
//  F-BOOT.4 self-hosting — a bare directory holding only the bundle: clone → verify → gate green, all local; the verify path itself is network-clean by construction
//  F-BOOT.5 headless — every op completes with piped stdio and no TTY; the module's imports are node:* + local only (no canvas, no surface)
//  F-BOOT.6 advisory honesty — a boot that cannot prove a stage (os-family mismatch, dry-run, absent gate) yields ADVISORY, never VERIFIED, each named; the provable boot IS verified
import { describe, test, expect } from "bun:test";
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { omegaTmp } from "@vivim/omega-platform";
import {
  verifyArchive, emitSelfForge, auditStore, loadBootRecords,
  scanNetworkReach, parseLedgerRows,
  type VerifyResult, type ReceiptRow,
} from "../boot.ts";

const REPO = join(import.meta.dir, "..", "..", "..");
const BOOT_TS = join(REPO, "tooling", "gates", "boot.ts");

function sha256(s: string | Buffer): string { return createHash("sha256").update(s).digest("hex"); }
function shortHash(h: string): string { return h.length <= 16 ? h : `${h.slice(0, 8)}…${h.slice(-8)}`; }

function git(dir: string, ...args: string[]): { code: number; out: string; err: string } {
  const p = Bun.spawnSync(["git", "-C", dir, ...args], { stdout: "pipe", stderr: "pipe" });
  return { code: p.exitCode ?? 1, out: p.stdout.toString(), err: p.stderr.toString() };
}

/** A minimal but honest gate for fixture archives: prints the same summary
 *  shape the real gate prints (the clone's OWN declared omega:gate). */
const FIXTURE_GATE = `const tests = { pass: 1, fail: 0 };
console.log(JSON.stringify({ ok: true, failed: 0, hostLoc: 0, tests, at: new Date().toISOString() }, null, 2));
`;

interface FixtureOpts { os?: string; gate?: boolean }

/** Build a fixture archive: a git tree (carrying a copy of the REAL verifier),
 *  a bundle cut from it, and a ledger README pinning that bundle — the whole
 *  D-414 discipline in miniature. */
function makeFixture(name: string, opts: FixtureOpts = {}): { home: string; ledgerDir: string; bundlePath: string } {
  const base = omegaTmp("omega-f-boot", name);
  rmSync(base, { recursive: true, force: true });
  const home = join(base, "system");
  mkdirSync(join(home, "tooling", "gates"), { recursive: true });
  mkdirSync(join(home, "build"), { recursive: true });
  // the running system carries the verifier; the archive vouches for it (S2's self-check)
  copyFileSync(BOOT_TS, join(home, "tooling", "gates", "boot.ts"));
  const hasGate = opts.gate !== false;
  writeFileSync(join(home, "package.json"), JSON.stringify({
    name: "fixture-omega", private: true,
    ...(hasGate ? { scripts: { "omega:gate": "bun run gate.mjs" } } : {}),
  }, null, 2) + "\n");
  if (hasGate) writeFileSync(join(home, "gate.mjs"), FIXTURE_GATE);
  writeFileSync(join(home, "build", "status.json"), JSON.stringify({
    toolchain: {
      bun: String(Bun.version), node: String(process.versions.node), arch: String(process.arch),
      os: opts.os ?? `${process.platform} 1.2.3-fixture`,
    },
  }, null, 2) + "\n");
  writeFileSync(join(home, "docs.md"), "# fixture\nthe archive is the bundle — no second format.\n");
  // the tree's own ignore law: local memory is reserved, never archived (the D-428 boundary)
  writeFileSync(join(home, ".gitignore"), "node_modules/\nboot/\nsessions/\ndev-vault/\n*.log\n");
  // commit + cut the bundle (the frozen archive)
  const g0 = Bun.spawnSync(["git", "init", "-q", "-b", "omega", home], { stdout: "pipe", stderr: "pipe" });
  if ((g0.exitCode ?? 1) !== 0) throw new Error(`git init failed: ${g0.stderr.toString()}`);
  const gc = git(home, "-c", "user.name=fixture", "-c", "user.email=fixture@fixture", "add", "-A");
  if (gc.code !== 0) throw new Error(`git add failed: ${gc.err}`);
  const cm = git(home, "-c", "user.name=fixture", "-c", "user.email=fixture@fixture", "commit", "-q", "-m", "fixture archive");
  if (cm.code !== 0) throw new Error(`git commit failed: ${cm.err}`);
  const rev = git(home, "rev-parse", "HEAD");
  const tip = rev.out.trim();
  const tree = git(home, "rev-parse", "HEAD^{tree}").out.trim();
  const ledgerDir = join(base, "ledger");
  mkdirSync(ledgerDir, { recursive: true });
  const bundlePath = join(ledgerDir, "vivim-omega-wave0-omega-forge_1.bundle");
  const gb = Bun.spawnSync(["git", "-C", home, "bundle", "create", "-q", bundlePath, "--all"], { stdout: "pipe", stderr: "pipe" });
  if ((gb.exitCode ?? 1) !== 0) throw new Error(`git bundle create failed: ${gb.stderr.toString()}`);
  const full = sha256(readFileSync(bundlePath));
  writeFileSync(join(ledgerDir, "README.md"), [
    "# fixture ledger",
    "",
    "| Bundle | Round | Tip | Tree | sha256 | Evidence |",
    "|---|---|---|---|---|---|",
    `| \`_1.bundle\` | 1 — fixture archive | \`${tip.slice(0, 7)}\` | \`${shortHash(tree)}\` | \`${shortHash(full)}\` | F-BOOT fixture |`,
    "",
  ].join("\n"));
  return { home, ledgerDir, bundlePath };
}

function cloneFixture(fx: { bundlePath: string }, dir: string): string {
  const p = Bun.spawnSync(["git", "clone", "--quiet", fx.bundlePath, dir], { stdout: "pipe", stderr: "pipe" });
  if ((p.exitCode ?? 1) !== 0) throw new Error(`git clone failed: ${p.stderr.toString()}`);
  return dir;
}

const tuple = (r: VerifyResult) => r.stages.map((s) => ({ stage: s.stage, inputHash: s.inputHash, outputHash: s.outputHash, verdict: s.verdict }));
const stripVolatile = (rec: ReceiptRow) => { const { bootId: _b, bootedAt: _t, ...rest } = rec; return rest; };
const stageOf = (r: VerifyResult, s: string) => r.stages.find((x) => x.stage === s)!;

describe("F-BOOT (D-431)", () => {
  test("F-BOOT.1 (byte-identical ×2) — identical stage tuples and receipts modulo bootId/bootedAt; gate green both times", () => {
    const fx = makeFixture("identical-x2");
    const r1 = verifyArchive(fx.home, { ledgerDir: fx.ledgerDir, gate: true });
    const r2 = verifyArchive(fx.home, { ledgerDir: fx.ledgerDir, gate: true });
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    expect(tuple(r1)).toEqual(tuple(r2));                       // the verification mathematics is identical
    expect(stripVolatile(r1.receipt!)).toEqual(stripVolatile(r2.receipt!)); // receipts differ only in bootId/bootedAt
    expect(r1.receipt!.chainHead).toBe(r2.receipt!.chainHead);  // the chain head is a volatile-free fold
    expect(r1.receipt!.bootId).not.toBe(r2.receipt!.bootId);
    for (const r of [r1, r2]) {                                 // gate GREEN both times, digest pinned
      expect(stageOf(r, "S5").verdict).toBe("verified");
      expect(r.receipt!.gateDigest).toBeTruthy();
      expect(r.receipt!.badge).toBe("VERIFIED");
    }
    expect(r1.receipt!.gateDigest).toBe(r2.receipt!.gateDigest); // the same tree → the same digest (volatile at excluded)
    const rows = loadBootRecords(fx.home);
    expect(rows.filter((x) => x.type === "archive")).toHaveLength(1); // the second verify reuses the first's pin (no duplicate)
  });

  test("F-BOOT.2 (rogue-injection refusal) — BOOT_UNVERIFIED_FILE names the file, halts the boot, ledgers the sentence, replays", () => {
    const fx = makeFixture("rogue-injection");
    const bootTree = cloneFixture(fx, join(fx.ledgerDir, "..", "boottree"));
    writeFileSync(join(bootTree, "planted-rogue.ts"), "// a file no manifest entry vouches for\n");
    const r = verifyArchive(bootTree, { ledgerDir: fx.ledgerDir, treeDir: bootTree });
    expect(r.ok).toBe(false);
    expect(r.refusedWith).toBe("BOOT_UNVERIFIED_FILE");
    expect(r.sentence!).toContain("planted-rogue.ts");
    expect(r.sentence!).toContain("no manifest entry vouches");
    expect(r.stages.map((s) => s.stage)).toEqual(["S1", "S2"]); // HALTED: nothing after the refused stage
    expect(loadBootRecords(bootTree).some((x) => x.type === "receipt")).toBe(false); // no receipt exists
    const audit = auditStore(bootTree, fx.ledgerDir);           // the refusal is replayable
    expect(audit.ok).toBe(true);
    expect(audit.counts.stage).toBe(2);
    expect(audit.receipts).toHaveLength(0);
    expect(loadBootRecords(bootTree).some((x) => x.type === "stage" && x.refusedWith === "BOOT_UNVERIFIED_FILE")).toBe(true);
  });

  test("F-BOOT.3 (self-forge mechanical) — selfForge:true on the pristine tree; one byte → BOOT_EMIT_DIVERGENCE naming the path; consent required", () => {
    const fx = makeFixture("self-forge");
    const v = verifyArchive(fx.home, { ledgerDir: fx.ledgerDir, gate: true }); // establish the trusted ground
    expect(v.ok && v.receipt!.badge).toBe("VERIFIED");
    expect(() => emitSelfForge(fx.home, { ledgerDir: fx.ledgerDir, consent: false })).toThrow(/BOOT_NO_CONSENT/);
    const e1 = emitSelfForge(fx.home, { ledgerDir: fx.ledgerDir, consent: true });
    expect(e1.ok).toBe(true);
    expect(e1.selfForge).toBe(true);
    expect(e1.receipt!.runningRootHash).toBe(e1.receipt!.archiveRef.rootHash); // root-hash identical
    const victim = join(fx.home, "build", "status.json");       // corrupt ONE byte of one tracked file
    writeFileSync(victim, readFileSync(victim, "utf-8") + " ");
    const e2 = emitSelfForge(fx.home, { ledgerDir: fx.ledgerDir, consent: true });
    expect(e2.ok).toBe(false);
    expect(e2.divergent).toContain("~build/status.json");       // the divergent path is NAMED
    expect(e2.sentence!).toContain("BOOT_EMIT_DIVERGENCE");
    expect(loadBootRecords(fx.home).some((x) => x.type === "stage" && x.stage === "EMIT" && x.refusedWith === "BOOT_EMIT_DIVERGENCE")).toBe(true);
  });

  test("F-BOOT.4 (self-hosting) — bare dir + bundle → clone → verify → gate green, all local; the verify path is network-clean by construction", () => {
    const fx = makeFixture("self-hosting");
    const machine = join(fx.ledgerDir, "..", "machine");        // the wiped machine: only the bundle arrives
    mkdirSync(machine, { recursive: true });
    const bootTree = cloneFixture(fx, join(machine, "tree"));
    const r = verifyArchive(bootTree, { ledgerDir: fx.ledgerDir, treeDir: bootTree, gate: true });
    expect(r.ok).toBe(true);
    expect(r.receipt!.badge).toBe("VERIFIED");
    expect(r.receipt!.stages.every((s) => s.verdict === "verified")).toBe(true); // the WHOLE chain, gate included
    expect(r.receipt!.gateDigest).toBeTruthy();
    expect(existsSync(join(bootTree, "boot", "records.jsonl"))).toBe(true);      // the receipt lives in the system it proved
    // structural: the running verifier's own path has zero network reach — the
    // scanner scans the tool that runs it (and its imports)
    const self = scanNetworkReach(REPO, ["tooling/gates/boot.ts", "tooling/gates/round-close.ts", "platform/src/platform.ts"]);
    expect(self.violations).toEqual([]);
    expect(self.postBootSurfaces).toEqual([]);
    expect(self.scanned).toBeGreaterThanOrEqual(3);
  });

  test("F-BOOT.5 (headless) — every op completes under piped stdio with no TTY; imports are node:* + local only", () => {
    const fx = makeFixture("headless");
    const bootTree = cloneFixture(fx, join(fx.ledgerDir, "..", "boottree"));
    const run = (args: string[]) => Bun.spawnSync(["bun", "run", BOOT_TS, ...args], { stdout: "pipe", stderr: "pipe" });
    const v = run(["verify", "--tree", bootTree, "--ledger", fx.ledgerDir, "--gate"]);
    expect(v.exitCode).toBe(0);                                  // no TTY under piped stdio — the proof is complete headless
    expect(v.stdout.toString()).toContain("badge VERIFIED");
    const s = run(["status", "--ledger", fx.ledgerDir, "--tree", bootTree]);
    expect(s.exitCode).toBe(0);
    expect(s.stdout.toString()).toContain("latest");
    const a = run(["audit", "--ledger", fx.ledgerDir, "--tree", bootTree]);
    expect(a.exitCode).toBe(0);
    expect(a.stdout.toString()).toContain("GREEN");
    const rc = run(["receipt", "--tree", bootTree]);
    expect(rc.exitCode).toBe(0);
    const receipt = JSON.parse(rc.stdout.toString()) as ReceiptRow;
    expect(receipt.badge).toBe("VERIFIED");
    const src = readFileSync(BOOT_TS, "utf-8");                  // the module's imports: node:* + local only (no canvas, no surface)
    const imports = [...src.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    expect(imports.length).toBeGreaterThanOrEqual(5);
    expect(imports.every((i) => i.startsWith("node:") || i.startsWith("./"))).toBe(true);
  });

  test("F-BOOT.6 (advisory honesty) — unprovable is ADVISORY (named, never VERIFIED); provable IS verified; drift REFUSES", () => {
    // case 1: os-family mismatch — a different-platform boot is a different receipt, not a refusal
    const fxPlan9 = makeFixture("advisory-os", { os: "plan9 fourth-edition" });
    const treeA = cloneFixture(fxPlan9, join(fxPlan9.ledgerDir, "..", "tree"));
    const rA = verifyArchive(treeA, { ledgerDir: fxPlan9.ledgerDir, treeDir: treeA, gate: true });
    expect(rA.ok).toBe(true);                                    // completed
    expect(rA.receipt!.badge).toBe("ADVISORY");                  // never VERIFIED
    expect(stageOf(rA, "S3").verdict).toBe("advisory");
    expect(rA.receipt!.toolchain!.match).toBe("os-family");
    expect(stageOf(rA, "S3").detail).toContain("different-platform boot is a different receipt");
    // case 2: dry-run — no --gate means S5 is unproven by construction
    const fxDry = makeFixture("advisory-dryrun");
    const treeB = cloneFixture(fxDry, join(fxDry.ledgerDir, "..", "tree"));
    const rB = verifyArchive(treeB, { ledgerDir: fxDry.ledgerDir, treeDir: treeB });
    expect(rB.ok).toBe(true);
    expect(rB.receipt!.badge).toBe("ADVISORY");
    expect(stageOf(rB, "S5").verdict).toBe("advisory");
    expect(stageOf(rB, "S5").detail).toContain("dry-run");
    // case 3: the archive declares no gate — the absence is recorded, not papered over
    const fxNoGate = makeFixture("advisory-nogate", { gate: false });
    const treeC = cloneFixture(fxNoGate, join(fxNoGate.ledgerDir, "..", "tree"));
    const rC = verifyArchive(treeC, { ledgerDir: fxNoGate.ledgerDir, treeDir: treeC, gate: true });
    expect(rC.ok).toBe(true);
    expect(rC.receipt!.badge).toBe("ADVISORY");
    expect(stageOf(rC, "S5").detail).toContain("no omega:gate script");
    // case 4: toolchain drift REFUSES — unproven and failed are different sentences, both loud
    const fxDrift = makeFixture("advisory-drift", { os: `${process.platform} 9.9.9`, });
    writeFileSync(join(fxDrift.home, "build", "status.json"), JSON.stringify({
      toolchain: { bun: "0.0.0-drift", node: String(process.versions.node), arch: String(process.arch), os: `${process.platform} 1.2.3-fixture` },
    }, null, 2) + "\n");
    const g = git(fxDrift.home, "-c", "user.name=f", "-c", "user.email=f@f", "add", "-A");
    const c = git(fxDrift.home, "-c", "user.name=f", "-c", "user.email=f@f", "commit", "-q", "-m", "drift the pin");
    if (g.code !== 0 || c.code !== 0) throw new Error("fixture drift commit failed");
    const bundle2 = join(fxDrift.ledgerDir, "vivim-omega-wave0-omega-forge_2.bundle");
    const gb = Bun.spawnSync(["git", "-C", fxDrift.home, "bundle", "create", "-q", bundle2, "--all"], { stdout: "pipe", stderr: "pipe" });
    if ((gb.exitCode ?? 1) !== 0) throw new Error(`bundle create failed: ${gb.stderr.toString()}`);
    const tip2 = git(fxDrift.home, "rev-parse", "HEAD").out.trim();
    const tree2 = git(fxDrift.home, "rev-parse", "HEAD^{tree}").out.trim();
    const full2 = sha256(readFileSync(bundle2));
    const readme = readFileSync(join(fxDrift.ledgerDir, "README.md"), "utf-8");
    writeFileSync(join(fxDrift.ledgerDir, "README.md"), readme +
      `| \`_2.bundle\` | 2 — drifted pin | \`${tip2.slice(0, 7)}\` | \`${shortHash(tree2)}\` | \`${shortHash(full2)}\` | F-BOOT fixture |` + "\n");
    const treeD = cloneFixture({ bundlePath: bundle2 }, join(fxDrift.ledgerDir, "..", "treeD"));
    const rD = verifyArchive(treeD, { ledgerDir: fxDrift.ledgerDir, bundlePath: bundle2, treeDir: treeD, gate: true });
    expect(rD.ok).toBe(false);
    expect(rD.refusedWith).toBe("BOOT_TOOLCHAIN_DRIFT");
    expect(rD.sentence!).toContain("0.0.0-drift");
    expect(loadBootRecords(treeD).some((x) => x.type === "receipt")).toBe(false);
    // contrast: the provable boot IS verified — the tool claims exactly what it can prove
    const rB2 = verifyArchive(treeB, { ledgerDir: fxDry.ledgerDir, treeDir: treeB, gate: true });
    expect(rB2.ok && rB2.receipt!.badge).toBe("VERIFIED");
    // the ledger parser holds on the real shapes too (the README it will read at dogfood time)
    expect(parseLedgerRows(readFileSync(join(fxDrift.ledgerDir, "README.md"), "utf-8")).map((r) => r.n)).toEqual([1, 2]);
  });
});
