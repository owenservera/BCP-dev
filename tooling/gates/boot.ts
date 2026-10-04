// tooling/gates/boot.ts — D-431 (Ω-0, spec D-449): the hermetic bootstrap.
//
// The gap this closes: self-hosting is PROGRAM CEREMONY today — round-close
// cuts the bundle and pins its sha256 (D-414), status.json pins the toolchain,
// and "the Forge emits itself byte-identical" (core falsifier F2) is a
// wave-close assertion by whoever ran the commands. Nothing in the SYSTEM
// re-proves any of it on demand, nothing refuses a boot on unproven ground.
//
// The one invariant this module exists to protect:
//   No stage of the bootstrap chain is trusted without a hash, and no boot
//   is called verified that the tooling cannot prove. A system that cannot
//   prove its own ground cannot vouch for anything that stands on it.
//
// The mechanism (spec §3, translated to the tree's idiom):
//   The archive IS the ledger bundle — no second format, no privileged path.
//   A five-stage chain of custody (resolve → manifest walk → toolchain →
//   hermeticity → gate digest), each stage a chained boot/ row carrying
//   inputHash/outputHash and a verdict: verified | advisory | refused.
//   A refused stage HALTS the boot — loud, with a sentence, never silent.
//   The receipt is written only when nothing refused; its badge is VERIFIED
//   only when every stage verified (the D-321 honesty contract — unproven is
//   ADVISORY, never silently VERIFIED). boot.emit re-proves the Forge
//   byte-identical to its own archive, root-hash to root-hash, on demand.
//
// Two verify modes (spec §5: fail-closed boot + on-demand dry run):
//   rehearsal (default)  — the tool clones the bundle itself to the scratch
//                          root and proves that clone (audit/rehearsal).
//   --tree <dir>         — the SELF-HOSTING boot: prove a pre-materialized
//                          tree (wipe machine → clone → verify). The store
//                          lands in THAT tree's boot/ — the receipt is
//                          written into the system it just proved.
//
// Same constitutional boundary as D-428/D-430: LAW IS COMMITTED, MEMORY IS
// LOCAL. boot/ is gitignored tooling state. Tamper-EVIDENT, not tamper-PROOF:
// whoever owns the box can rewrite; audit re-derives every digest and names
// the lie. This module imports no network capability — structural: the
// bootstrap path cannot reach the network because nothing in it can.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, appendFileSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, isAbsolute } from "node:path";
import { tmpdir, userInfo } from "node:os";
import { scanBundles, resolveLedgerDir } from "./round-close.ts";

// ---- the refusal register (spec §7 + the consent law; every code a sentence) ----

export const BOOT_REFUSALS = {
  BOOT_ARCHIVE_HASH_MISMATCH: "The archive's bytes do not match the hash it claims; this is not the system it says it is, and the boot refuses.",
  BOOT_UNVERIFIED_FILE: "This file sits in the bootstrap path but no manifest entry vouches for it; the boot refuses rather than run a guest it cannot name.",
  BOOT_TOOLCHAIN_DRIFT: "The toolchain on this machine does not match the archive's pinned toolchain; the boot refuses rather than stand on ground it cannot verify.",
  BOOT_NETWORK_VIOLATION: "The bootstrap path reached for the network; hermetic means hermetic, and the boot refuses.",
  BOOT_EMIT_DIVERGENCE: "The Forge's re-emission differs from the pinned archive at these paths: {paths}; the system refuses to claim it is byte-identical to itself.",
  BOOT_NO_RECEIPT: "There is no verified boot receipt for this session; operations that require a trusted ground refuse until the chain is verified.",
  BOOT_NO_CONSENT: "boot.emit re-emits the archive from the running tree (an EXTERNAL_MUTATION-class op); it requires the principal's explicit --consent.",
} as const;
export type BootRefusalCode = keyof typeof BOOT_REFUSALS;

export type Verdict = "verified" | "advisory" | "refused";
export type Badge = "VERIFIED" | "ADVISORY";

// ---- the store rows (boot/records.jsonl, one chained line each) ----

export interface ArchiveRow {
  type: "archive"; at: string; bootId: string;
  n: number; file: string;           // the bundle's ledger-relative filename
  sha256: string;                    // the FULL pin — first verify establishes it
  tip: string; tree: string;         // from the ledger README row (provenance echo)
}

export interface StageRow {
  type: "stage"; at: string; bootId: string;
  stage: "S1" | "S2" | "S3" | "S4" | "S5" | "EMIT"; name: string;
  inputHash: string; outputHash: string;
  verdict: Verdict; refusedWith?: string; detail: string;
}

export interface ReceiptRow {
  type: "receipt"; bootId: string; bootedAt: string;
  op: "verify" | "emit";
  archiveRef: { n: number; file: string; sha256: string; rootHash: string; tip: string };
  chainHead: string;                 // fold of THIS boot's stage tuples (volatile-free)
  stages: Array<{ stage: string; name: string; verdict: Verdict }>;
  gateDigest?: string;
  toolchain?: { pin: Record<string, string> | null; actual: Record<string, string>; match: "exact" | "os-family" | "unpinned" };
  selfForge?: boolean;
  runningRootHash?: string;
  principal: string; sessionRef?: string;
  badge: Badge;
}

export type BootRecord = ArchiveRow | StageRow | ReceiptRow;

export interface BootLink { line: number; sha256: string; prev: string }
export interface BootChain { chain: BootLink[]; head: string }

const GENESIS = "genesis";
const BOOT_FILE = "tooling/gates/boot.ts"; // the verifier — S2's self-check target

function sha256(s: string | Buffer): string {
  return createHash("sha256").update(s).digest("hex");
}

/** The ledger's short form for a 64-char sha256: first 8 … last 8. */
export function shortHash(h: string): string {
  return h.length <= 16 ? h : `${h.slice(0, 8)}…${h.slice(-8)}`;
}

function bootIdOf(now: Date): string {
  const t = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
  return `${t}-${Math.random().toString(36).slice(2, 6)}`;
}

// ---- run helpers (sync git; the bootstrap path is local-only by construction) ----

function run(cmd: string[], cwd?: string): { code: number; out: string; err: string } {
  const p = Bun.spawnSync(cmd, { cwd, stdout: "pipe", stderr: "pipe" });
  return { code: p.exitCode ?? 1, out: p.stdout.toString(), err: p.stderr.toString() };
}

// ---- pure folds (testable; the same inputs give byte-identical outputs) ----

/** Parse the ledger README's bundle table. Pure. */
export function parseLedgerRows(readme: string): Array<{ n: number; tip: string; treeShort: string; sha256Short: string }> {
  const rows: Array<{ n: number; tip: string; treeShort: string; sha256Short: string }> = [];
  for (const m of readme.matchAll(/^\|\s*`_(\d+)\.bundle`\s*\|[^\n]*\|\s*`([0-9a-f]{7,40})`\s*\|\s*`([0-9a-f]{8}…[0-9a-f]{8})`\s*\|\s*`([0-9a-f]{8}…[0-9a-f]{8})`\s*\|/gm)) {
    rows.push({ n: parseInt(m[1]!, 10), tip: m[2]!, treeShort: m[3]!, sha256Short: m[4]! });
  }
  return rows;
}

/** The content manifest: git's tracked paths → sha256 of on-disk bytes.
 *  A path git vouches for that cannot be read is a LIE named, not a crash. */
export function manifestOf(treeDir: string): { manifest: Map<string, string>; issues: string[] } {
  const issues: string[] = [];
  const manifest = new Map<string, string>();
  const ls = run(["git", "-C", treeDir, "ls-files", "-z"]);
  if (ls.code !== 0) return { manifest, issues: [`git ls-files failed in ${treeDir}: ${ls.err.trim().slice(0, 160)}`] };
  const paths = ls.out.split("\0").filter((p) => p.length > 0);
  for (const p of paths) {
    try {
      manifest.set(p, sha256(readFileSync(join(treeDir, p))));
    } catch {
      issues.push(`manifest path ${p} is not readable on disk — git vouches for it but the bytes are absent`);
    }
  }
  return { manifest, issues };
}

/** The merkle root over the manifest: sha256 of the canonical sorted pairs. Pure. */
export function rootHashOf(manifest: Map<string, string>): string {
  const pairs = [...manifest.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return sha256(JSON.stringify(pairs));
}

/** Unlisted guests: files git reports as untracked AND not ignored — git's
 *  own ignore law draws the line between the system (tracked) and the box's
 *  declared local memory (boot/, sessions/, dev-vault/ — the D-428 boundary,
 *  reserved in the tree's .gitignore; never part of the archive). A file that
 *  is neither tracked nor reserved is a guest no manifest vouches for. */
export function unlistedGuests(treeDir: string): { guests: string[]; issues: string[] } {
  const ls = run(["git", "-C", treeDir, "ls-files", "--others", "--exclude-standard", "-z"]);
  if (ls.code !== 0) return { guests: [], issues: [`git ls-files --others failed in ${treeDir}: ${ls.err.trim().slice(0, 160)}`] };
  return { guests: ls.out.split("\0").filter((p) => p.length > 0).sort(), issues: [] };
}

/** The network-reach scanner. Markers under surfaces/ + plugins/ are LEGAL —
 *  the post-boot canvas and live providers (the headless doctrine: the proof
 *  is complete without the projection); anywhere else is a violation. Pure. */
const NET_MARKERS: Array<[RegExp, string]> = [
  [/from\s*["']node:(http|https|net|dns|dgram|tls)["']/g, "node:$1 import"],
  [/require\(\s*["']node:(http|https|net|dns|dgram|tls)["']\s*\)/g, "node:$1 require"],
  [/from\s*["']undici["']/g, "undici import"],
  [/\bfetch\s*\(/g, "fetch call"],
  [/\bnew\s+WebSocket\b/g, "WebSocket construction"],
  [/(?:import\s*\(\s*["']|from\s*["'])(https?:\/\/)/g, "network URL import"],
];

export interface NetScan {
  violations: Array<{ path: string; line: number; marker: string }>;
  postBootSurfaces: string[];
  scanned: number;
  unreadable: string[];
}

export function scanNetworkReach(treeDir: string, paths: string[]): NetScan {
  const scan: NetScan = { violations: [], postBootSurfaces: [], scanned: 0, unreadable: [] };
  const codeLike = (p: string) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(p) || p === "package.json" || p === "bun.lock" || p.endsWith(".lockb");
  for (const p of paths.filter(codeLike)) {
    let text: string;
    try {
      text = readFileSync(join(treeDir, p), "utf-8");
    } catch {
      scan.unreadable.push(p);
      continue;
    }
    scan.scanned++;
    const legal = p.startsWith("surfaces/") || p.startsWith("plugins/");
    for (const [re, label] of NET_MARKERS) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        const line = text.slice(0, m.index).split("\n").length;
        if (legal) { scan.postBootSurfaces.push(p); break; }
        scan.violations.push({ path: p, line, marker: label });
      }
    }
  }
  return scan;
}

/** Toolchain compare: bun/node/arch exact (drift refuses); os family mismatch
 *  is ADVISORY — a different-platform boot is a different receipt (spec
 *  choicepoint 5), named in the detail. Pure. */
export function compareToolchain(
  pin: Record<string, string> | null,
  actual: Record<string, string>,
): { verdict: Verdict; refusedWith?: BootRefusalCode; detail: string } {
  if (!pin || !pin.bun || !pin.node || !pin.arch || !pin.os) {
    return { verdict: "advisory", detail: "no toolchain pin in the archive (build/status.json carries no {bun,node,os,arch}) — the boot cannot prove the toolchain, only record it" };
  }
  const drift: string[] = [];
  if (String(pin.bun) !== String(actual.bun)) drift.push(`bun: pinned ${pin.bun} vs actual ${actual.bun}`);
  if (String(pin.node) !== String(actual.node)) drift.push(`node: pinned ${pin.node} vs actual ${actual.node}`);
  if (String(pin.arch) !== String(actual.arch)) drift.push(`arch: pinned ${pin.arch} vs actual ${actual.arch}`);
  if (drift.length > 0) {
    return { verdict: "refused", refusedWith: "BOOT_TOOLCHAIN_DRIFT", detail: `The toolchain on this machine does not match the archive's pinned toolchain (${drift.join("; ")}); the boot refuses rather than stand on ground it cannot verify.` };
  }
  const pinOsFamily = String(pin.os).split(/\s+/)[0]!;
  if (pinOsFamily !== String(actual.os)) {
    return { verdict: "advisory", detail: `os family differs: pinned ${pin.os} vs actual ${actual.os} — a different-platform boot is a different receipt, not a refusal (byte-identity is judged per archive × toolchain)` };
  }
  return { verdict: "verified", detail: `exact — bun ${actual.bun}, node ${actual.node}, ${actual.arch}, ${actual.os}` };
}

/** The deterministic gate digest: the summary's stable fields only (the
 *  volatile `at` excluded — the same tree yields the same digest). Pure. */
export function gateDigestOf(summary: Record<string, unknown>): string {
  return sha256(JSON.stringify({ ok: summary.ok, failed: summary.failed, hostLoc: summary.hostLoc, tests: summary.tests ?? null }));
}

/** The receipt's chainHead: a fold over THIS boot's stage tuples with the
 *  volatile fields (at, bootId) excluded — two boots of the same archive on
 *  the same machine derive the SAME head (F-BOOT.1). Pure. */
export function chainHeadOf(stages: Array<Pick<StageRow, "stage" | "name" | "inputHash" | "outputHash" | "verdict" | "refusedWith">>): string {
  return sha256(JSON.stringify(stages.map((s) => ({
    stage: s.stage, name: s.name, inputHash: s.inputHash, outputHash: s.outputHash, verdict: s.verdict, ...(s.refusedWith ? { refusedWith: s.refusedWith } : {}),
  }))));
}

/** Parse the gate's summary: the clone's gates.log last line (compact JSON the
 *  gate appends) or the stdout tail's pretty JSON. Pure. */
export function parseGateSummary(stdout: string, gatesLog: string | null): Record<string, unknown> | null {
  if (gatesLog) {
    const lines = gatesLog.split("\n").filter((l) => l.trim().length > 0);
    const last = lines[lines.length - 1];
    if (last) {
      try { const j = JSON.parse(last) as Record<string, unknown>; if (typeof j.ok === "boolean") return j; } catch { /* fall through */ }
    }
  }
  const lines = stdout.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i]!.startsWith("{")) {
      const cand = lines.slice(i).join("\n");
      try { const j = JSON.parse(cand) as Record<string, unknown>; if (typeof j.ok === "boolean") return j; } catch { /* keep walking */ }
      try { const j = JSON.parse(lines[i]!) as Record<string, unknown>; if (typeof j.ok === "boolean") return j; } catch { /* keep walking */ }
    }
  }
  return null;
}

// ---- the store (boot/ — the session-store idiom, chained per line) ----

function home(root: string): string { return join(root, "boot"); }
function recordsPath(root: string): string { return join(home(root), "records.jsonl"); }
function chainPath(root: string): string { return join(home(root), "records.chain.json"); }

export function parseBootRecord(line: string): { record: BootRecord | null; issues: string[] } {
  let raw: unknown;
  try { raw = JSON.parse(line); } catch { return { record: null, issues: ["not valid JSON"] }; }
  const r = raw as Partial<BootRecord>;
  const issues: string[] = [];
  if (r.type !== "archive" && r.type !== "stage" && r.type !== "receipt") issues.push(`type "${String(r.type)}" illegal (archive | stage | receipt)`);
  if (typeof r.bootId !== "string" || !r.bootId) issues.push("bootId is required");
  if (r.type === "archive" && (typeof r.n !== "number" || typeof r.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(r.sha256))) issues.push("archive rows need n + a full 64-hex sha256");
  if (r.type === "stage") {
    if (!["S1", "S2", "S3", "S4", "S5", "EMIT"].includes(String(r.stage))) issues.push(`stage "${String(r.stage)}" illegal`);
    if (!["verified", "advisory", "refused"].includes(String(r.verdict))) issues.push(`verdict "${String(r.verdict)}" illegal`);
  }
  if (r.type === "receipt" && r.badge !== "VERIFIED" && r.badge !== "ADVISORY") issues.push(`badge "${String(r.badge)}" illegal`);
  if (issues.length > 0) return { record: null, issues };
  return { record: r as BootRecord, issues: [] };
}

function readChain(root: string): BootChain {
  if (!existsSync(chainPath(root))) return { chain: [], head: GENESIS };
  try {
    const c = JSON.parse(readFileSync(chainPath(root), "utf-8")) as BootChain;
    return { chain: Array.isArray(c.chain) ? c.chain : [], head: typeof c.head === "string" ? c.head : GENESIS };
  } catch {
    throw new Error("BOOT_STORE_UNREADABLE: boot/records.chain.json is malformed — repair it by hand (the store is local state; audit names the damage before any op touches it)");
  }
}

function readLines(root: string): string[] {
  if (!existsSync(recordsPath(root))) return [];
  const text = readFileSync(recordsPath(root), "utf-8");
  return text === "" ? [] : text.split("\n").filter((l) => l.trim().length > 0);
}

/** Recompute the chain over raw lines; name every lie. Pure. */
export function verifyBootChain(lines: string[], chain: BootChain): string[] {
  const issues: string[] = [];
  if (chain.chain.length > lines.length) {
    issues.push(`BOOT_CHAIN_BROKEN: chain links ${lines.length + 1}..${chain.chain.length} have no line — record line(s) ${lines.length + 1}..${chain.chain.length} were deleted after chaining`);
  } else if (lines.length > chain.chain.length) {
    issues.push(`BOOT_CHAIN_BROKEN: line(s) ${chain.chain.length + 1}..${lines.length} are unchained — added outside the ledger`);
  }
  let prev = GENESIS;
  const n = Math.min(chain.chain.length, lines.length);
  for (let i = 0; i < n; i++) {
    const link = chain.chain[i]!;
    const actual = sha256(lines[i]!);
    if (link.line !== i + 1) issues.push(`BOOT_CHAIN_BROKEN: link ${i + 1} claims line ${link.line}`);
    if (actual !== link.sha256) issues.push(`BOOT_CHAIN_BROKEN: line ${i + 1} hash mismatch — recorded ${link.sha256.slice(0, 8)}…, actual ${actual.slice(0, 8)}… (edited or corrupted after chaining)`);
    if (link.prev !== prev) issues.push(`BOOT_CHAIN_BROKEN: line ${i + 1} prev ${link.prev.slice(0, 8)}… does not continue the chain`);
    prev = link.sha256;
  }
  if (n > 0 && chain.head !== prev) issues.push(`BOOT_CHAIN_BROKEN: chain head ${chain.head.slice(0, 8)}… ≠ recomputed ${prev.slice(0, 8)}…`);
  lines.forEach((l, i) => {
    const { record, issues: rIssues } = parseBootRecord(l);
    if (!record) issues.push(`BOOT_RECORD_INVALID: line ${i + 1}: ${rIssues.join("; ")}`);
  });
  return issues;
}

export function loadBootRecords(root: string): BootRecord[] {
  return readLines(root).map((l) => parseBootRecord(l).record!).filter(Boolean);
}

function appendRecord(root: string, rec: BootRecord): void {
  const lines = readLines(root);
  const chain = readChain(root);
  const broken = verifyBootChain(lines, chain);
  if (broken.length > 0) throw new Error(`refused: BOOT_CHAIN_BROKEN — will not extend a broken chain (${broken[0]}); repair first, the chain is the witness`);
  const line = JSON.stringify(rec);
  mkdirSync(home(root), { recursive: true });
  appendFileSync(recordsPath(root), `${line}\n`);
  chain.chain.push({ line: lines.length + 1, sha256: sha256(line), prev: chain.head });
  chain.head = sha256(line);
  writeFileSync(chainPath(root), `${JSON.stringify(chain, null, 2)}\n`);
}

/** The open session, cited on receipts when one exists (best-effort — the
 *  boot never depends on the session store, it cites it). */
function sessionRefOf(root: string): string | undefined {
  try {
    const p = join(root, "sessions", "open.json");
    if (!existsSync(p)) return undefined;
    const o = JSON.parse(readFileSync(p, "utf-8")) as { id?: string };
    return typeof o.id === "string" ? o.id : undefined;
  } catch { return undefined; }
}

// ---- the archive resolution (S1's facts) ----

export interface ArchiveFacts {
  n: number; file: string; bundlePath: string; sha256: string;
  row: { n: number; tip: string; treeShort: string; sha256Short: string };
  tip: string;                        // the bundle's own recorded branch tip
  ledgerDir: string; ledgerSource: string;
}

function bundleTipOf(bundlePath: string): string | null {
  const heads = run(["git", "bundle", "list-heads", bundlePath]);
  if (heads.code !== 0) return null;
  let head: string | null = null;
  for (const line of heads.out.split("\n")) {
    const m = /^([0-9a-f]{40})\s+(.*)$/.exec(line.trim());
    if (!m) continue;
    if (m[2]!.startsWith("refs/heads/")) return m[1]!;
    if (m[2] === "HEAD") head = m[1]!;
  }
  return head;
}

/** Resolve the archive: the latest ledger bundle (or --bundle), its README
 *  pin, and its full sha256. Pure-ish (fs + git reads only). */
export function resolveArchive(ledgerDir: string, bundlePath?: string): ArchiveFacts {
  if (!existsSync(ledgerDir)) throw new Error(`refused: BOOT_ARCHIVE_HASH_MISMATCH — the ledger dir ${ledgerDir} is absent; no ledger, no pin, no proof`);
  const readmePath = join(ledgerDir, "README.md");
  if (!existsSync(readmePath)) throw new Error(`refused: BOOT_ARCHIVE_HASH_MISMATCH — ${readmePath} is absent; the README table is the ledger of record (no pin, no proof)`);
  const rows = parseLedgerRows(readFileSync(readmePath, "utf-8"));
  let n: number; let file: string; let abs: string;
  if (bundlePath) {
    const m = /vivim-omega-wave0-omega-forge_(\d+)\.bundle$/.exec(bundlePath);
    if (!m) throw new Error(`refused: --bundle must name a vivim-omega-wave0-omega-forge_N.bundle (got ${bundlePath})`);
    n = parseInt(m[1]!, 10);
    file = m[0]!;
    abs = isAbsolute(bundlePath) ? bundlePath : join(ledgerDir, file);
  } else {
    const scan = scanBundles(readdirSync(ledgerDir));
    if (scan.ns.length === 0) throw new Error(`refused: BOOT_ARCHIVE_HASH_MISMATCH — no vivim-omega-wave0-omega-forge_N.bundle in ${ledgerDir}; the archive IS the bundle (no second format)`);
    n = Math.max(...scan.ns);
    file = `vivim-omega-wave0-omega-forge_${n}.bundle`;
    abs = join(ledgerDir, file);
  }
  if (!existsSync(abs)) throw new Error(`refused: BOOT_ARCHIVE_HASH_MISMATCH — the archive ${abs} is pinned by the ledger but absent from disk`);
  const row = rows.find((r) => r.n === n);
  if (!row) throw new Error(`refused: BOOT_ARCHIVE_HASH_MISMATCH — the ledger README has no row pinning _${n}.bundle; the README table is the ledger of record`);
  const full = sha256(readFileSync(abs));
  if (shortHash(full) !== row.sha256Short) {
    throw new Error(`refused: BOOT_ARCHIVE_HASH_MISMATCH — ${file} hashes to ${shortHash(full)} but the ledger row pins ${row.sha256Short}; this is not the system it says it is, and the boot refuses.`);
  }
  const tip = bundleTipOf(abs);
  if (!tip) throw new Error(`refused: BOOT_ARCHIVE_HASH_MISMATCH — git bundle list-heads read no tip from ${file}; an archive that names no head cannot be booted against`);
  if (!tip.startsWith(row.tip)) throw new Error(`refused: BOOT_ARCHIVE_HASH_MISMATCH — the ledger row pins tip ${row.tip} but the bundle's head is ${tip.slice(0, 8)}; the README is the ledger of record and it is lying`);
  return { n, file, bundlePath: abs, sha256: full, row, tip, ledgerDir, ledgerSource: "resolved" };
}

// ---- the five-stage chain of custody ----

export interface VerifyOptions {
  ledgerDir: string;                  // explicit (the CLI resolves; tests inject)
  bundlePath?: string;
  treeDir?: string;                   // --tree: the self-hosting boot target
  gate?: boolean;                     // S5 runs the clone's own gate
  principal?: string;
  now?: Date;
}

export interface VerifyResult {
  ok: boolean;
  bootId: string;
  refusedWith?: BootRefusalCode | "GATE_RED";
  sentence?: string;
  stages: StageRow[];
  receipt?: ReceiptRow;
}

/** The five-stage verification. Each stage appends its row the moment its
 *  verdict is known; a refused stage HALTS — nothing after it runs, no
 *  receipt exists, the refusal rows are the record. */
export function verifyArchive(root: string, opts: VerifyOptions): VerifyResult {
  const now = opts.now ?? new Date();
  const bootId = bootIdOf(now);
  const principal = opts.principal ?? userInfo().username;
  const stages: StageRow[] = [];
  const push = (s: Omit<StageRow, "type" | "at" | "bootId">) => {
    const row: StageRow = { type: "stage", at: now.toISOString(), bootId, ...s };
    stages.push(row);
    appendRecord(root, row);
    return row;
  };
  const refuse = (stage: StageRow["stage"], name: string, code: BootRefusalCode | "GATE_RED", sentence: string, inputHash = "", outputHash = ""): VerifyResult => {
    push({ stage, name, inputHash, outputHash, verdict: "refused", refusedWith: code, detail: sentence });
    return { ok: false, bootId, refusedWith: code, sentence, stages };
  };

  // S1 · resolve — the archive hashes to its pin; the full sha256 is pinned
  // in the store on first verify and compared full-strength thereafter.
  let a: ArchiveFacts;
  try {
    a = resolveArchive(opts.ledgerDir, opts.bundlePath);
  } catch (e) {
    return refuse("S1", "resolve", "BOOT_ARCHIVE_HASH_MISMATCH", String(e instanceof Error ? e.message : e));
  }
  const prior = loadBootRecords(root).filter((r): r is ArchiveRow => r.type === "archive" && r.n === a.n).pop();
  if (prior && prior.sha256 !== a.sha256) {
    return refuse("S1", "resolve", "BOOT_ARCHIVE_HASH_MISMATCH",
      `refused: BOOT_ARCHIVE_HASH_MISMATCH — _${a.n}.bundle is pinned in boot/ as ${prior.sha256} but now hashes to ${a.sha256}; the bundle changed under its number, and the boot refuses.`,
      sha256(a.file), a.sha256);
  }
  if (!prior) {
    appendRecord(root, { type: "archive", at: now.toISOString(), bootId, n: a.n, file: a.file, sha256: a.sha256, tip: a.row.tip, tree: a.row.treeShort });
  }
  push({ stage: "S1", name: "resolve", inputHash: sha256(a.file), outputHash: a.sha256, verdict: "verified",
    detail: `_${a.n}.bundle hashes to its pin (README ${a.row.sha256Short}${prior ? `; store pin full-strength ${shortHash(a.sha256)}` : "; store pin established this verify — full-strength from now on"}); tip ${a.tip.slice(0, 8)}` });

  // The verified tree: a fresh clone of the pinned bundle (rehearsal), or the
  // operator's pre-materialized tree (the self-hosting boot). Local only.
  let treeDir: string;
  let createdClone = false;
  if (opts.treeDir) {
    treeDir = opts.treeDir;
    if (!existsSync(treeDir)) return refuse("S2", "manifest walk", "BOOT_UNVERIFIED_FILE", `refused: BOOT_UNVERIFIED_FILE — the tree to verify (${treeDir}) does not exist`);
  } else {
    treeDir = join(tmpdir(), "omega-boot", bootId);
    mkdirSync(join(tmpdir(), "omega-boot"), { recursive: true });
    const clone = run(["git", "clone", "--quiet", a.bundlePath, treeDir]);
    if (clone.code !== 0) return refuse("S1", "resolve", "BOOT_ARCHIVE_HASH_MISMATCH", `refused: the pinned bundle could not be cloned (git: ${clone.err.trim().slice(0, 160)}) — an unclonable archive is unbootable`);
    createdClone = true;
  }

  try {
    // S2 · manifest walk — git vouches; the disk must agree EXACTLY; the
    // verifier itself must hash-match the archive it proves.
    const head = run(["git", "-C", treeDir, "rev-parse", "HEAD"]);
    const treeHead = head.out.trim();
    if (head.code !== 0 || !treeHead) return refuse("S2", "manifest walk", "BOOT_UNVERIFIED_FILE", `refused: BOOT_UNVERIFIED_FILE — the tree at ${treeDir} has no readable HEAD (${head.err.trim().slice(0, 120)})`);
    if (treeHead !== a.tip) {
      return refuse("S2", "manifest walk", "BOOT_UNVERIFIED_FILE",
        `refused: BOOT_UNVERIFIED_FILE — the tree at ${treeDir} is not the archive: HEAD ${treeHead.slice(0, 8)} ≠ bundle tip ${a.tip.slice(0, 8)}; this is not the system it claims`,
        sha256(JSON.stringify({ treeHead, tip: a.tip })), "");
    }
    const { manifest, issues: mIssues } = manifestOf(treeDir);
    if (mIssues.length > 0) {
      return refuse("S2", "manifest walk", "BOOT_UNVERIFIED_FILE", `refused: BOOT_UNVERIFIED_FILE — ${mIssues[0]}`, sha256(treeHead), "");
    }
    const { guests, issues: gIssues } = unlistedGuests(treeDir);
    if (gIssues.length > 0) {
      return refuse("S2", "manifest walk", "BOOT_UNVERIFIED_FILE", `refused: BOOT_UNVERIFIED_FILE — ${gIssues[0]}`, sha256(treeHead), "");
    }
    if (guests.length > 0) {
      return refuse("S2", "manifest walk", "BOOT_UNVERIFIED_FILE",
        `refused: BOOT_UNVERIFIED_FILE — ${guests.slice(0, 5).join(", ")}${guests.length > 5 ? ` (+${guests.length - 5} more)` : ""} sit(s) in the bootstrap path but no manifest entry vouches for it; the boot refuses rather than run a guest it cannot name (and nothing after this stage executes)`,
        sha256(treeHead), rootHashOf(manifest));
    }
    const archived = manifest.get(BOOT_FILE);
    if (!archived) {
      return refuse("S2", "manifest walk", "BOOT_UNVERIFIED_FILE", `refused: BOOT_UNVERIFIED_FILE — the archive carries no verifier (${BOOT_FILE} absent from the manifest); a boot cannot be proven by a tool the archive does not contain`, sha256(treeHead), rootHashOf(manifest));
    }
    let running: string;
    try {
      running = sha256(readFileSync(join(root, BOOT_FILE)));
    } catch {
      return refuse("S2", "manifest walk", "BOOT_UNVERIFIED_FILE", `refused: BOOT_UNVERIFIED_FILE — the verifier file ${join(root, BOOT_FILE)} is unreadable; the tool proving the ground cannot be hashed`, sha256(treeHead), rootHashOf(manifest));
    }
    if (running !== archived) {
      return refuse("S2", "manifest walk", "BOOT_UNVERIFIED_FILE",
        `refused: BOOT_UNVERIFIED_FILE — the verifier at ${BOOT_FILE} (${shortHash(running)}) is not the archived one (${shortHash(archived)}); the tool proving the ground is not standing on it`,
        sha256(treeHead), rootHashOf(manifest));
    }
    const rootHash = rootHashOf(manifest);
    push({ stage: "S2", name: "manifest walk", inputHash: sha256(JSON.stringify({ treeHead, tip: a.tip })), outputHash: rootHash, verdict: "verified",
      detail: `${manifest.size} files vouched, disk == manifest exactly, verifier hash-matches; rootHash ${shortHash(rootHash)}` });

    // S3 · toolchain — the archive's pin vs the actual runtime.
    let pin: Record<string, string> | null = null;
    try {
      const st = JSON.parse(readFileSync(join(treeDir, "build", "status.json"), "utf-8")) as { toolchain?: Record<string, string> };
      pin = st.toolchain ?? null;
    } catch { pin = null; }
    const actual = { bun: String(Bun.version), node: String(process.versions.node), arch: String(process.arch), os: String(process.platform) };
    const tc = compareToolchain(pin, actual);
    push({ stage: "S3", name: "toolchain", inputHash: sha256(JSON.stringify(pin)), outputHash: sha256(JSON.stringify(actual)), verdict: tc.verdict, ...(tc.refusedWith ? { refusedWith: tc.refusedWith } : {}), detail: tc.detail });
    if (tc.verdict === "refused") {
      return { ok: false, bootId, refusedWith: tc.refusedWith, sentence: `refused: ${tc.refusedWith} — ${tc.detail}`, stages };
    }
    const toolchain = { pin, actual, match: pin ? (tc.verdict === "verified" ? "exact" as const : "os-family" as const) : "unpinned" as const };

    // S4 · hermeticity — zero network reach in the bootstrap path.
    const scan = scanNetworkReach(treeDir, [...manifest.keys()].sort());
    if (scan.unreadable.length > 0) {
      push({ stage: "S4", name: "hermeticity", inputHash: rootHash, outputHash: sha256(JSON.stringify(scan)), verdict: "advisory",
        detail: `cannot prove — ${scan.unreadable.slice(0, 3).join(", ")} unreadable; hermeticity is unproven, not failed (ADVISORY, never silently VERIFIED)` });
    } else if (scan.violations.length > 0) {
      const named = scan.violations.slice(0, 5).map((v) => `${v.path}:${v.line} (${v.marker})`).join(", ");
      return refuse("S4", "hermeticity", "BOOT_NETWORK_VIOLATION",
        `refused: BOOT_NETWORK_VIOLATION — the bootstrap path reached for the network (${named}${scan.violations.length > 5 ? ` +${scan.violations.length - 5} more` : ""}); hermetic means hermetic, and the boot refuses.`,
        rootHash, sha256(JSON.stringify(scan)));
    } else {
      push({ stage: "S4", name: "hermeticity", inputHash: rootHash, outputHash: sha256(JSON.stringify({ scanned: scan.scanned, postBoot: scan.postBootSurfaces.length })), verdict: "verified",
        detail: `clean — ${scan.scanned} code files scanned, zero network reach in the bootstrap path${scan.postBootSurfaces.length > 0 ? ` (post-boot canvas/providers excluded per the headless doctrine: ${[...new Set(scan.postBootSurfaces)].slice(0, 3).join(", ")}${new Set(scan.postBootSurfaces).size > 3 ? " …" : ""})` : ""}` });
    }

    // S5 · gate digest — the booted tree's OWN gate, offline.
    let gateDigest: string | undefined;
    if (!opts.gate) {
      push({ stage: "S5", name: "gate digest", inputHash: rootHash, outputHash: "", verdict: "advisory",
        detail: "dry-run — pass --gate for the full boot (the gate digest is part of the proof; without it the receipt is ADVISORY by construction)" });
    } else {
      let gateCmd: string | null = null;
      try {
        const pkg = JSON.parse(readFileSync(join(treeDir, "package.json"), "utf-8")) as { scripts?: Record<string, string> };
        gateCmd = pkg.scripts?.["omega:gate"] ?? null;
      } catch { /* no package.json — no gate */ }
      if (!gateCmd) {
        push({ stage: "S5", name: "gate digest", inputHash: rootHash, outputHash: "", verdict: "advisory",
          detail: "no omega:gate script in the booted tree — the gate cannot be proven, only its absence recorded (ADVISORY, never silently VERIFIED)" });
      } else {
        const inst = run(["bun", "install", "--offline"], treeDir);
        if (inst.code !== 0) {
          push({ stage: "S5", name: "gate digest", inputHash: rootHash, outputHash: "", verdict: "advisory",
            detail: `offline install failed — the gate cannot run hermetically (ADVISORY): ${inst.err.trim().slice(0, 160)}` });
        } else {
          const g = run(["bun", "run", "omega:gate"], treeDir, 1_800_000);
          let logText: string | null = null;
          try { logText = readFileSync(join(treeDir, "build", "gates.log"), "utf-8"); } catch { logText = null; }
          const summary = parseGateSummary(g.out, logText);
          if (!summary) {
            if (g.code === 0) {
              push({ stage: "S5", name: "gate digest", inputHash: rootHash, outputHash: "", verdict: "advisory",
                detail: "the gate exited 0 but published no summary — the digest cannot be pinned (ADVISORY, never silently VERIFIED)" });
            } else {
              return refuse("S5", "gate digest", "GATE_RED",
                `refused: GATE_RED — the booted tree's own gate ran RED (exit ${g.code}) and the boot refuses to call this ground verified: ${g.out.replace(/\x1b\[[0-9;]*m/g, "").trim().slice(-200)}`,
                rootHash, "");
            }
          } else if (summary.ok !== true) {
            return refuse("S5", "gate digest", "GATE_RED",
              `refused: GATE_RED — the booted tree's own gate ran RED (failed: ${String(summary.failed)}, tests: ${JSON.stringify(summary.tests ?? null)}) and the boot refuses to call this ground verified`,
              rootHash, gateDigestOf(summary));
          } else {
            gateDigest = gateDigestOf(summary);
            push({ stage: "S5", name: "gate digest", inputHash: rootHash, outputHash: gateDigest, verdict: "verified",
              detail: `the clone's own gate GREEN — digest ${shortHash(gateDigest)} (ok=${String(summary.ok)}, tests ${JSON.stringify(summary.tests ?? null)}; the volatile at is excluded — the same tree yields the same digest)` });
          }
        }
      }
    }

    // The receipt — written only when nothing refused. VERIFIED only when
    // every stage verified (the D-321 honesty contract).
    const badge: Badge = stages.every((s) => s.verdict === "verified") ? "VERIFIED" : "ADVISORY";
    const receipt: ReceiptRow = {
      type: "receipt", bootId, bootedAt: now.toISOString(), op: "verify",
      archiveRef: { n: a.n, file: a.file, sha256: a.sha256, rootHash, tip: a.tip },
      chainHead: chainHeadOf(stages),
      stages: stages.map((s) => ({ stage: s.stage, name: s.name, verdict: s.verdict })),
      ...(gateDigest ? { gateDigest } : {}),
      ...(toolchain ? { toolchain } : {}),
      principal, ...(sessionRefOf(root) ? { sessionRef: sessionRefOf(root)! } : {}),
      badge,
    };
    appendRecord(root, receipt);
    return { ok: true, bootId, stages, receipt };
  } finally {
    if (createdClone) { try { rmSync(treeDir, { recursive: true, force: true }); } catch { /* best-effort scratch cleanup */ } }
  }
}

// ---- boot.emit — the mechanical self-forge (F2) ----

export interface EmitOptions {
  ledgerDir: string;
  bundlePath?: string;
  consent: boolean;
  treeDir?: string;                   // the tree to re-emit from (default: root)
  principal?: string;
  now?: Date;
}

export interface EmitResult {
  ok: boolean;
  bootId: string;
  selfForge?: boolean;
  divergent?: string[];
  sentence?: string;
  receipt?: ReceiptRow;
}

/** Re-emit the archive from the running tree and compare root hashes. One
 *  byte off → BOOT_EMIT_DIVERGENCE naming the paths. Requires --consent and
 *  a prior VERIFIED receipt for the same archive (a trusted ground). */
export function emitSelfForge(root: string, opts: EmitOptions): EmitResult {
  if (!opts.consent) {
    throw new Error(`refused: BOOT_NO_CONSENT — ${BOOT_REFUSALS.BOOT_NO_CONSENT}`);
  }
  const now = opts.now ?? new Date();
  const bootId = bootIdOf(now);
  const principal = opts.principal ?? userInfo().username;
  const a = resolveArchive(opts.ledgerDir, opts.bundlePath);
  const records = loadBootRecords(root);
  const trusted = records.some((r): r is ReceiptRow => r.type === "receipt" && r.op === "verify" && r.badge === "VERIFIED" && r.archiveRef.n === a.n && r.archiveRef.sha256 === a.sha256);
  if (!trusted) {
    throw new Error(`refused: BOOT_NO_RECEIPT — ${BOOT_REFUSALS.BOOT_NO_RECEIPT} (no VERIFIED receipt for _${a.n}.bundle at ${shortHash(a.sha256)} in boot/ — run omega:boot verify --gate first)`);
  }
  const treeDir = opts.treeDir ?? root;
  const { manifest: running, issues } = manifestOf(treeDir);
  if (issues.length > 0) {
    const row: StageRow = { type: "stage", at: now.toISOString(), bootId, stage: "EMIT", name: "self-forge", inputHash: a.sha256, outputHash: "", verdict: "refused", refusedWith: "BOOT_EMIT_DIVERGENCE", detail: `refused: BOOT_EMIT_DIVERGENCE — the running tree cannot be walked: ${issues[0]}` };
    appendRecord(root, row);
    return { ok: false, bootId, divergent: issues, sentence: row.detail };
  }
  const cloneDir = join(tmpdir(), "omega-boot", `emit-${bootId}`);
  mkdirSync(join(tmpdir(), "omega-boot"), { recursive: true });
  const clone = run(["git", "clone", "--quiet", a.bundlePath, cloneDir]);
  if (clone.code !== 0) throw new Error(`refused: BOOT_ARCHIVE_HASH_MISMATCH — the pinned bundle could not be cloned for comparison (git: ${clone.err.trim().slice(0, 160)})`);
  try {
    const { manifest: archived } = manifestOf(cloneDir);
    const added = [...running.keys()].filter((p) => !archived.has(p)).sort();
    const removed = [...archived.keys()].filter((p) => !running.has(p)).sort();
    const changed = [...running.keys()].filter((p) => archived.has(p) && archived.get(p) !== running.get(p)).sort();
    const runningRoot = rootHashOf(running);
    const archiveRoot = rootHashOf(archived);
    if (added.length + removed.length + changed.length > 0 || runningRoot !== archiveRoot) {
      const paths = [...added.map((p) => `+${p}`), ...removed.map((p) => `-${p}`), ...changed.map((p) => `~${p}`)];
      const detail = `refused: BOOT_EMIT_DIVERGENCE — ${BOOT_REFUSALS.BOOT_EMIT_DIVERGENCE.replace("{paths}", paths.slice(0, 8).join(", ") + (paths.length > 8 ? ` (+${paths.length - 8} more)` : ""))}`;
      const row: StageRow = { type: "stage", at: now.toISOString(), bootId, stage: "EMIT", name: "self-forge", inputHash: archiveRoot, outputHash: runningRoot, verdict: "refused", refusedWith: "BOOT_EMIT_DIVERGENCE", detail };
      appendRecord(root, row);
      return { ok: false, bootId, divergent: paths, sentence: detail };
    }
    const receipt: ReceiptRow = {
      type: "receipt", bootId, bootedAt: now.toISOString(), op: "emit",
      archiveRef: { n: a.n, file: a.file, sha256: a.sha256, rootHash: archiveRoot, tip: a.tip },
      chainHead: chainHeadOf([{ stage: "EMIT", name: "self-forge", inputHash: archiveRoot, outputHash: runningRoot, verdict: "verified" }]),
      stages: [{ stage: "EMIT", name: "self-forge", verdict: "verified" }],
      selfForge: true, runningRootHash: runningRoot,
      principal, ...(sessionRefOf(root) ? { sessionRef: sessionRefOf(root)! } : {}),
      badge: "VERIFIED",
    };
    appendRecord(root, receipt);
    return { ok: true, bootId, selfForge: true, receipt };
  } finally {
    try { rmSync(cloneDir, { recursive: true, force: true }); } catch { /* best-effort */ }
  }
}

// ---- audit — the deterministic replay of what the rows carry ----

export interface AuditResult {
  ok: boolean;
  issues: string[];
  counts: { archive: number; stage: number; receipt: number };
  receipts: Array<{ bootId: string; op: string; badge: Badge }>;
}

/** Re-hash every chain link, re-derive each verify-receipt's chainHead from
 *  its bootId's stage rows, and re-check each archive row against the bundle
 *  on disk. Collecting — data lies are reported, never thrown. */
export function auditStore(root: string, ledgerDir?: string): AuditResult {
  const issues: string[] = [];
  const lines = readLines(root);
  const chain = readChain(root);
  issues.push(...verifyBootChain(lines, chain));
  const records = loadBootRecords(root);
  const counts = { archive: 0, stage: 0, receipt: 0 };
  const receipts: AuditResult["receipts"] = [];
  for (const r of records) {
    if (r.type === "archive") {
      counts.archive++;
      if (ledgerDir) {
        const abs = join(ledgerDir, r.file);
        if (existsSync(abs)) {
          const actual = sha256(readFileSync(abs));
          if (actual !== r.sha256) issues.push(`BOOT_ARCHIVE_HASH_MISMATCH (audit): _${r.n}.bundle is pinned as ${shortHash(r.sha256)} but now hashes to ${shortHash(actual)} — the bundle changed under its number`);
        } else {
          issues.push(`BOOT_AUDIT_NOTE: _${r.n}.bundle (${abs}) is not on disk — the pin cannot be re-checked in this environment`);
        }
      } else {
        issues.push(`BOOT_AUDIT_NOTE: _${r.n}.bundle pin not re-checked (no --ledger resolved — pass --ledger to re-hash the bundle on disk)`);
      }
    } else if (r.type === "stage") counts.stage++;
    else {
      counts.receipt++;
      receipts.push({ bootId: r.bootId, op: r.op, badge: r.badge });
      if (r.op === "verify") {
        const own = records.filter((x): x is StageRow => x.type === "stage" && x.bootId === r.bootId && x.stage !== "EMIT");
        const head = chainHeadOf(own);
        if (head !== r.chainHead) issues.push(`BOOT_RECEIPT_TAMPERED: receipt ${r.bootId} chainHead ${shortHash(r.chainHead)} ≠ re-derived ${shortHash(head)} (stages edited after the seal)`);
      }
    }
  }
  return { ok: issues.length === 0, issues, counts, receipts };
}

// ---- CLI ----

const ROOT = join(import.meta.dir, "../..");

function flag(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function has(name: string): boolean { return process.argv.includes(`--${name}`); }

if (import.meta.main) {
  const cmd = process.argv[2];
  try {
    const ledger = flag("ledger");
    const resolved = resolveLedgerDir(ROOT, ledger);
    const ledgerDir = resolved.dir;
    const root = flag("tree") ?? ROOT; // --tree: the self-hosting boot's tree (store + self-check live there)
    if (cmd === "verify") {
      const r = verifyArchive(root, { ledgerDir, ...(flag("bundle") ? { bundlePath: flag("bundle") } : {}), ...(flag("tree") ? { treeDir: flag("tree") } : {}), gate: has("gate"), ...(flag("principal") ? { principal: flag("principal") } : {}) });
      for (const s of r.stages) {
        const mark = s.verdict === "verified" ? "✓" : s.verdict === "advisory" ? "○" : "✗";
        console.log(`${mark} ${s.stage} ${s.name}: ${s.detail}`);
      }
      if (!r.ok) {
        console.error(r.sentence);
        process.exit(1);
      }
      if (has("json")) console.log(JSON.stringify(r.receipt, null, 2));
      else {
        console.log(`receipt ${r.receipt!.bootId} — badge ${r.receipt!.badge} · archive _${r.receipt!.archiveRef.n}.bundle ${shortHash(r.receipt!.archiveRef.sha256)} · rootHash ${shortHash(r.receipt!.archiveRef.rootHash)}${r.receipt!.gateDigest ? ` · gateDigest ${shortHash(r.receipt!.gateDigest)}` : ""} · chainHead ${shortHash(r.receipt!.chainHead)}`);
        console.log(r.receipt!.badge === "VERIFIED" ? "the ground is proven: every stage verified, hashes pinned, chain ledgered (D-431)" : "the ground is ADVISORY — named, honest, never silently verified (D-321)");
      }
    } else if (cmd === "emit") {
      const r = emitSelfForge(root, { ledgerDir, ...(flag("bundle") ? { bundlePath: flag("bundle") } : {}), consent: has("consent"), ...(flag("tree") ? { treeDir: flag("tree") } : {}), ...(flag("principal") ? { principal: flag("principal") } : {}) });
      if (!r.ok) { console.error(r.sentence); process.exit(1); }
      console.log(`self-forge PROVEN — the running tree's manifest is root-hash identical to _${r.receipt!.archiveRef.n}.bundle (${shortHash(r.receipt!.runningRootHash!)}); the Forge re-emits itself byte-identical, mechanically (F2)`);
      if (has("json")) console.log(JSON.stringify(r.receipt, null, 2));
    } else if (cmd === "audit") {
      const a = auditStore(root, ledgerDir);
      for (const i of a.issues) console.error(`✗ ${i}`);
      console.log(a.ok
        ? `boot/: GREEN — ${a.counts.archive} archive pin(s), ${a.counts.stage} stage row(s), ${a.counts.receipt} receipt(s); every link re-hashed, every chainHead re-derived`
        : "boot/: RED — the chain and the pins are the witness; repair before any op");
      if (has("json")) console.log(JSON.stringify({ ok: a.ok, counts: a.counts, receipts: a.receipts }, null, 2));
      process.exit(a.ok ? 0 : 1);
    } else if (cmd === "receipt") {
      const want = flag("bootId");
      const rs = loadBootRecords(root).filter((r): r is ReceiptRow => r.type === "receipt" && (!want || r.bootId === want));
      if (rs.length === 0) { console.error(`refused: BOOT_NO_RECEIPT — no receipt${want ? ` ${want}` : ""} in boot/`); process.exit(1); }
      console.log(JSON.stringify(want ? rs[0] : rs[rs.length - 1], null, 2));
    } else if (cmd === "status") {
      const records = loadBootRecords(root);
      const receipts = records.filter((r): r is ReceiptRow => r.type === "receipt");
      const last = receipts[receipts.length - 1];
      const a = auditStore(root, ledgerDir);
      console.log(`boot/: ${records.length} row(s) · ${receipts.length} receipt(s)${last ? ` · latest ${last.bootId} (${last.op}, ${last.badge}${last.selfForge ? ", self-forge proven" : ""})` : " · no receipts yet (run omega:boot verify)"}`);
      for (const i of a.issues) console.error(`✗ ${i}`);
      process.exit(a.issues.length === 0 ? 0 : 1);
    } else {
      console.log("usage: omega:boot verify [--ledger <dir>] [--bundle <path>] [--tree <dir>] [--gate] [--json] | emit --consent [--ledger] [--bundle] [--tree <dir>] [--json] | audit [--ledger] [--json] | receipt [--bootId <id>] | status [--ledger]");
      console.log("  the five-stage chain of custody: S1 resolve → S2 manifest walk → S3 toolchain → S4 hermeticity → S5 gate digest (--gate)");
      console.log("  --tree <dir> = the self-hosting boot: prove a pre-materialized tree (wipe machine → clone → verify); the store lands in that tree's boot/");
    }
  } catch (e) {
    console.error(String(e instanceof Error ? e.message : e));
    process.exit(1);
  }
}
