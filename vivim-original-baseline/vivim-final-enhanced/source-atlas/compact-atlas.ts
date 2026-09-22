// source-atlas/compact-atlas.ts
// Compacts the ENTIRE source-atlas/ directory into ONE lossless, AI-optimized .txt bundle.
//
// Usage:
//   bun run source-atlas/compact-atlas.ts                        → write source-atlas/ATLAS.txt
//   bun run source-atlas/compact-atlas.ts --out <path>            → write custom output path
//   bun run source-atlas/compact-atlas.ts --verify [--out <path>] → verify existing bundle (no rewrite)
//   bun run source-atlas/compact-atlas.ts --check [...]           → alias for --verify
//   bun run source-atlas/compact-atlas.ts --stats-only            → print inventory + exit
//   bun run source-atlas/compact-atlas.ts --help                  → help
//
// Guarantees:
//   - Deterministic order (entry docs → L0→L4 → architecture → omega → generated → indexes → tooling).
//   - Every source file embedded VERBATIM (CRLF normalized to LF; documented + hash covers normalized form).
//   - Manifest carries per-file bytes/lines/chars/SHA256 so ANY truncation or edit is detectable.
//   - Collision-guarded sentinels: generation aborts if any file content contains the sentinel strings.
//   - --verify round-trips the bundle back to disk content and fails on any mismatch (zero data-loss proof).

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const VERSION = "1.0.0";
const ATLAS_DIR = join(import.meta.dir, "."); // source-atlas/
const ROOT = join(import.meta.dir, "..");
const DEFAULT_OUT = join(ATLAS_DIR, "ATLAS.txt");

// NOTE: built via repeat() so the literal sentinel never appears in THIS file's
// source (self-hosting guard — otherwise the bundle would always collide with itself).
const BEGIN_PREFIX = ">".repeat(10) + " BEGIN FILE ";
const BEGIN_SUFFIX = " " + ">".repeat(10);
const END_PREFIX = "<".repeat(10) + " END FILE ";
const END_SUFFIX = " " + "<".repeat(10);

// ── helpers ──────────────────────────────────────────────────────────────────

function walkFiles(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (e === "node_modules" || e === ".git" || e === ".next" || e === "dist") continue;
      walkFiles(p, out);
    } else if (s.isFile()) {
      out.push(p);
    }
  }
  return out;
}

const toPosix = (p: string) => p.replace(/\\/g, "/");
const relAtlas = (abs: string) => toPosix(relative(ATLAS_DIR, abs));

function sha256Hex(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/** Read as UTF-8, normalize CRLF→LF. Returns normalized text. Throws on unreadable files. */
function readNormalized(abs: string): string {
  const raw = readFileSync(abs, "utf8");
  return raw.replace(/\r\n/g, "\n");
}

function firstLine(text: string): string {
  for (const ln of text.split("\n")) {
    const t = ln.trim();
    if (t.length > 0) return t.slice(0, 100).replace(/\|/g, "\\|");
  }
  return "(empty)";
}

interface FileEntry {
  abs: string;
  rel: string; // posix, relative to source-atlas/
  bytes: number; // utf8 byte length of normalized text
  lines: number;
  chars: number;
  sha: string;
  text: string;
}

// ── deterministic AI-value order ─────────────────────────────────────────────
// Rank buckets: lower = earlier in bundle. Within bucket: alphabetical.
function rank(rel: string): [number, string] {
  const r = rel;
  if (r === "00-README.md") return [10, r];
  if (r === "01-AUDIENCES.md") return [11, r];
  if (r === "02-GLOSSARY.md") return [12, r];
  if (r === "03-QUICKSTART.md") return [13, r];
  if (r === "L0-system-overview.md") return [20, r];
  if (r === "L1-zone-map.md") return [21, r];
  if (r === "L2-module-clusters.md") return [22, r];
  if (r.startsWith("L3-file-catalog/")) return [30, r];
  if (r.startsWith("L4-contracts/")) return [40, r];
  if (r === "architecture/00-ARCH-README.md") return [50, r];
  if (r.startsWith("architecture/")) return [51, r];
  if (r.startsWith("omega/")) return [60, r];
  if (r.startsWith("generated/")) return [70, r];
  if (r === "ATLAS-INDEX.json") return [80, r];
  if (r === "ATLAS-FILES.json") return [81, r];
  if (r === "build-atlas.ts") return [90, r];
  if (r === "compact-atlas.ts") return [91, r]; // self last: tooling after evidence
  return [99, r]; // any future file: appended deterministically, never silently dropped
}

function collectEntries(excludeAbs: string[]): FileEntry[] {
  const outAbs = resolve(excludeAbs[0] ?? DEFAULT_OUT);
  const files = walkFiles(ATLAS_DIR)
    .filter((p) => resolve(p) !== outAbs) // NEVER embed the bundle itself (infinite recursion)
    .filter((p) => !p.endsWith(".tmp") && !p.endsWith(".part"))
    .sort((a, b) => {
      const ra = rank(relAtlas(a));
      const rb = rank(relAtlas(b));
      if (ra[0] !== rb[0]) return ra[0] - rb[0];
      return ra[1] < rb[1] ? -1 : ra[1] > rb[1] ? 1 : 0;
    });

  return files.map((abs) => {
    const text = readNormalized(abs);
    return {
      abs,
      rel: relAtlas(abs),
      bytes: Buffer.byteLength(text, "utf8"),
      lines: text.length === 0 ? 0 : text.split("\n").length,
      chars: text.length,
      sha: sha256Hex(text),
      text,
    };
  });
}

// ── bundle rendering ─────────────────────────────────────────────────────────

function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

function buildBundle(entries: FileEntry[], outRel: string): string {
  const total = entries.length;
  const totalBytes = entries.reduce((n, e) => n + e.bytes, 0);
  const totalLines = entries.reduce((n, e) => n + e.lines, 0);
  const totalChars = entries.reduce((n, e) => n + e.chars, 0);
  const estTokens = Math.ceil(totalChars / 4);
  const overall = sha256Hex(entries.map((e) => e.sha).join("\n"));
  const stamp = new Date().toISOString();
  const idOf = (i: number) => `${pad3(i + 1)}/${pad3(total)}`;

  // Collision guard: sentinels must not appear inside file content.
  for (const e of entries) {
    if (e.text.includes(BEGIN_PREFIX) || e.text.includes(END_PREFIX)) {
      throw new Error(
        `Sentinel collision in ${e.rel}: content contains "${BEGIN_PREFIX.trim()}" or "${END_PREFIX.trim()}". ` +
          `Change sentinels in compact-atlas.ts before bundling (no-loss guard).`,
      );
    }
  }

  const L: string[] = [];
  L.push("=".repeat(80));
  L.push("SOURCE-ATLAS COMPACT BUNDLE — single-file, lossless, AI-optimized");
  L.push("=".repeat(80));
  L.push(`Generated (UTC) : ${stamp}`);
  L.push(`Generator       : source-atlas/compact-atlas.ts v${VERSION}`);
  L.push(`Source dir      : source-atlas/`);
  L.push(`Output          : ${outRel}`);
  L.push(
    `Totals          : ${total} files | ${totalBytes} bytes (utf8, LF) | ${totalLines} lines | ${totalChars} chars | ~${estTokens.toLocaleString("en-US")} tokens (chars/4)`,
  );
  L.push(`Overall SHA256  : ${overall}  (sha256 of per-file sha256 list, in bundle order)`);
  L.push(`Integrity       : every file below is VERBATIM (CRLF normalized to LF before hash).`);
  L.push(`Verify          : bun run source-atlas/compact-atlas.ts --verify`);
  L.push(`Regenerate      : bun run source-atlas/compact-atlas.ts`);
  L.push("");
  L.push("HOW TO READ (AI):");
  L.push("- Deterministic order: entry docs → L0→L4 → architecture → omega → generated → indexes → tooling.");
  L.push("- Skim MANIFEST for the map, then jump to the per-file start marker (grep: 'BEGIN FILE').");
  L.push("- File start marker is: 10x '>' + ' BEGIN FILE ' + '<id>: <path>' + ' ' + 10x '>' (see real markers below).");
  L.push("- File end marker is: 10x '<' + ' END FILE ' + '<id>: <path>' + ' ' + 10x '<' (grep: 'END FILE').");
  L.push("- Content between META line and END marker is the exact file (no truncation, no summarization).");
  L.push("- Layer legend: 00=index, 01=audiences, 02=glossary, 03=quickstart, L0=system, L1=zones,");
  L.push("  L2=clusters, L3=file catalog, L4=contracts, LA(architecture/)=design context,");
  L.push("  omega=pilot verdicts, generated=machine lists, ATLAS-*.json=indexes, *.ts=tooling.");
  L.push("- Reading order: 00-README → 01 → L0 → L1 → L2 → L3 → L4 → architecture/00-ARCH-README");
  L.push("  → rest of architecture → omega → generated → ATLAS-INDEX → ATLAS-FILES → build/compact tooling.");
  L.push("");
  L.push("-".repeat(80));
  L.push(`MANIFEST (${total} files: id | path | bytes | lines | chars | sha256 | first-line)`);
  L.push("-".repeat(80));
  L.push("| id | path | bytes | lines | chars | sha256 | first-line |");
  L.push("|----|------|-------|-------|-------|--------|------------|");
  entries.forEach((e, i) => {
    L.push(`| ${idOf(i)} | ${e.rel} | ${e.bytes} | ${e.lines} | ${e.chars} | ${e.sha} | ${firstLine(e.text)} |`);
  });
  L.push("");
  L.push("-".repeat(80));
  L.push("TABLE OF CONTENTS (bundle order)");
  L.push("-".repeat(80));
  entries.forEach((e, i) => {
    L.push(`${idOf(i)} ${e.rel}`);
  });
  L.push("");
  L.push("=".repeat(80));
  L.push(`FILES BEGIN (${total} files, verbatim below)`);
  L.push("=".repeat(80));
  L.push("");

  entries.forEach((e, i) => {
    const id = idOf(i);
    L.push(`${BEGIN_PREFIX}${id}: ${e.rel}${BEGIN_SUFFIX}`);
    L.push(`PATH: ${e.rel}`);
    L.push(`BYTES: ${e.bytes} | LINES: ${e.lines} | CHARS: ${e.chars} | SHA256: ${e.sha}`);
    L.push("-".repeat(80));
    L.push(e.text.endsWith("\n") ? e.text.slice(0, -1) : e.text); // keep exactly one newline before END
    L.push(`${END_PREFIX}${id}: ${e.rel}${END_SUFFIX}`);
    L.push("");
  });

  L.push("=".repeat(80));
  L.push("FILES END");
  L.push("=".repeat(80));
  L.push(`Files: ${total} | Bytes: ${totalBytes} | Lines: ${totalLines} | Chars: ${totalChars} | Est. tokens: ~${estTokens.toLocaleString("en-US")}`);
  L.push(`Overall SHA256: ${overall}`);
  L.push(`Verify: bun run source-atlas/compact-atlas.ts --verify`);
  L.push("");
  return L.join("\n") + "\n";
}

// ── verify (round-trip, zero-loss proof) ─────────────────────────────────────

interface ParsedFile {
  id: string;
  path: string;
  metaBytes: number;
  metaLines: number;
  metaChars: number;
  metaSha: string;
  content: string;
}

function parseBundle(bundle: string): { manifest: Map<string, string>; files: ParsedFile[]; overall: string | null } {
  const manifest = new Map<string, string>();
  const manifestRe = /^\|\s*(\d{3}\/\d{3})\s*\|\s*(\S+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*([0-9a-f]{64})\s*\|/gm;
  let m: RegExpExecArray | null;
  while ((m = manifestRe.exec(bundle)) !== null) {
    manifest.set(m[2], m[6]);
  }
  const overallMatch = bundle.match(/Overall SHA256\s*:\s*([0-9a-f]{64})/);
  const files: ParsedFile[] = [];
  const lines = bundle.split("\n");
  let i = 0;
  const beginRe = /^>{10} BEGIN FILE (\d{3}\/\d{3}): (.+) >{10}$/;
  const metaRe = /^BYTES: (\d+) \| LINES: (\d+) \| CHARS: (\d+) \| SHA256: ([0-9a-f]{64})$/;
  const pathRe = /^PATH: (.+)$/;
  while (i < lines.length) {
    const bm = lines[i].match(beginRe);
    if (bm) {
      const id = bm[1];
      const path = bm[2].trim();
      const pm = (lines[i + 1] ?? "").match(pathRe);
      const mm = (lines[i + 2] ?? "").match(metaRe);
      if (!pm || !mm || pm[1].trim() !== path) {
        throw new Error(`Malformed file header at line ${i + 1} for ${path} (expected PATH + META lines).`);
      }
      // skip dashed separator line (i+3), content starts at i+4
      let j = i + 4;
      const contentLines: string[] = [];
      const endMarker = `${END_PREFIX}${id}: ${path}${END_SUFFIX}`;
      let found = false;
      while (j < lines.length) {
        if (lines[j] === endMarker) {
          found = true;
          break;
        }
        contentLines.push(lines[j]);
        j++;
      }
      if (!found) throw new Error(`Missing END marker for ${id}: ${path} (bundle truncated?).`);
      files.push({
        id,
        path,
        metaBytes: Number(mm[1]),
        metaLines: Number(mm[2]),
        metaChars: Number(mm[3]),
        metaSha: mm[4],
        content: contentLines.join("\n"),
      });
      i = j + 1;
    } else {
      i++;
    }
  }
  return { manifest, files, overall: overallMatch?.[1] ?? null };
}

function verifyBundle(outAbs: string): void {
  if (!existsSync(outAbs)) {
    console.error(`VERIFY FAIL: bundle not found: ${toPosix(relative(ROOT, outAbs))}`);
    process.exit(1);
  }
  const bundle = readFileSync(outAbs, "utf8").replace(/\r\n/g, "\n");
  const { manifest, files, overall } = parseBundle(bundle);
  const errors: string[] = [];

  // 1. Re-collect current disk state (same exclusion + order) and compare file sets.
  const disk = collectEntries([outAbs]);
  const diskByPath = new Map(disk.map((e) => [e.rel, e]));
  const bundleByPath = new Map(files.map((f) => [f.path, f]));

  for (const d of disk) {
    const b = bundleByPath.get(d.rel);
    if (!b) {
      errors.push(`missing in bundle: ${d.rel}`);
      continue;
    }
    // Content stored without trailing newline (see builder slice); reconstruct exact normalized form.
    const candidates = [b.content, b.content + "\n"];
    const match = candidates.some((c) => sha256Hex(c) === d.sha);
    if (!match) {
      const gotSha = sha256Hex(b.content);
      errors.push(`content SHA mismatch: ${d.rel} (disk=${d.sha} bundle=${gotSha})`);
    }
    if (b.metaSha !== d.sha) errors.push(`manifest META mismatch: ${d.rel} (meta=${b.metaSha} disk=${d.sha})`);
    const manifestSha = manifest.get(d.rel);
    if (manifestSha !== d.sha) errors.push(`manifest table mismatch: ${d.rel} (table=${manifestSha} disk=${d.sha})`);
    if (b.metaBytes !== d.bytes || b.metaLines !== d.lines) {
      errors.push(`size mismatch: ${d.rel} (bundle meta ${b.metaBytes}B/${b.metaLines}L vs disk ${d.bytes}B/${d.lines}L)`);
    }
  }
  for (const b of files) {
    if (!diskByPath.has(b.path)) errors.push(`extra in bundle (not on disk): ${b.path}`);
  }

  // 2. Order check: bundle order must equal deterministic disk order.
  const diskOrder = disk.map((d) => d.rel).join("\n");
  const bundleOrder = files.map((f) => f.path).join("\n");
  if (diskOrder !== bundleOrder) errors.push("file ORDER mismatch vs deterministic order (regenerate bundle).");

  // 3. Overall hash check.
  const recomputedOverall = sha256Hex(disk.map((d) => d.sha).join("\n"));
  if (overall !== recomputedOverall) {
    errors.push(`overall SHA mismatch (bundle=${overall} recomputed=${recomputedOverall})`);
  }

  // 4. Count check.
  if (files.length !== disk.length) {
    errors.push(`count mismatch: bundle has ${files.length} files, disk has ${disk.length}`);
  }

  if (errors.length > 0) {
    console.error(`VERIFY FAIL: ${errors.length} problem(s) in ${toPosix(relative(ROOT, outAbs))}:`);
    for (const e of errors.slice(0, 50)) console.error(`  - ${e}`);
    if (errors.length > 50) console.error(`  ... and ${errors.length - 50} more`);
    process.exit(1);
  }
  console.log(`VERIFY OK: ${files.length} files, content identical, order deterministic, manifest consistent.`);
  console.log(`Overall SHA256: ${recomputedOverall}`);
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function printHelp(): void {
  console.log(`compact-atlas.ts v${VERSION} — compact source-atlas/ into one lossless AI-optimized .txt
Usage:
  bun run source-atlas/compact-atlas.ts [--out <path>] [--verify|--check] [--stats-only] [--help]
Defaults:
  --out source-atlas/ATLAS.txt
Examples:
  bun run source-atlas/compact-atlas.ts
  bun run source-atlas/compact-atlas.ts --out source-atlas/ATLAS.txt --verify`);
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }
  let out = DEFAULT_OUT;
  const outIdx = args.indexOf("--out");
  if (outIdx !== -1) {
    if (!args[outIdx + 1]) {
      console.error("--out requires a path value.");
      process.exit(1);
    }
    out = resolve(ROOT, args[outIdx + 1]);
  }
  const outAbs = resolve(out);
  const wantVerify = args.includes("--verify") || args.includes("--check");

  if (wantVerify) {
    verifyBundle(outAbs);
    return;
  }

  const entries = collectEntries([outAbs]);

  if (args.includes("--stats-only")) {
    const bytes = entries.reduce((n, e) => n + e.bytes, 0);
    const chars = entries.reduce((n, e) => n + e.chars, 0);
    console.log(JSON.stringify({ files: entries.length, bytes, chars, estTokens: Math.ceil(chars / 4), order: entries.map((e) => e.rel) }, null, 2));
    return;
  }

  const outRel = toPosix(relative(ROOT, outAbs));
  const bundle = buildBundle(entries, outRel);
  mkdirSync(dirname(outAbs), { recursive: true });
  writeFileSync(outAbs, bundle, "utf8");

  const bytes = entries.reduce((n, e) => n + e.bytes, 0);
  const bundleBytes = Buffer.byteLength(bundle, "utf8");
  console.log(`ATLAS bundle written: ${outRel}`);
  console.log(`Files: ${entries.length} | Bundle bytes: ${bundleBytes} | Source bytes: ${bytes} | Est. tokens (bundle/4): ~${Math.ceil(bundleBytes / 4).toLocaleString("en-US")}`);
  console.log(`Verify: bun run source-atlas/compact-atlas.ts --verify --out ${outRel}`);
}

main();
