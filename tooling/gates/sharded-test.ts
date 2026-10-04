// tooling/gates/sharded-test.ts — D-TEAM-024 (replaces the serial-by-default rule)
//
// WHY THIS EXISTS. `--max-concurrency` does not parallelise this suite. Measured on
// four slow plugin files (bun 1.3.14, 8 cores, 21.9 GB):
//
//   one process, --max-concurrency 4 ......... 39.7 s
//   one process, --max-concurrency 1 ......... 39.6 s     <- identical
//   four separate bun processes .............. 18.8 s     <- 2.1x faster
//
// So the runner was always sequential, and the "concurrency" knob was inert — the
// same class of defect as an argv that exits 0 without running (D-TEAM-022): a flag
// that looks load-bearing and silently does nothing.
//
// That also explains the OOM. It was never N workers each holding memory. It was ONE
// long-lived process accumulating across ~1591 tests until it hit 19.45 GB commit on a
// 23.52 GB box (D-TEAM-021, HOUSEKEEPING). The fix for that is not a lower
// concurrency number — it is a SHORTER PROCESS. Sharding the suite across a few
// concurrent, short-lived `bun test` invocations bounds each process's accumulation
// AND runs them in parallel. It is faster and safer at the same time, which is why
// this replaces the serial rule rather than tuning it.
//
// WHAT IT DOES. Enumerates every *.test.ts under the package, splits them into N
// balanced shards, runs up to `concurrency` shards at once as independent processes,
// and aggregates the pass/fail counts and failing test names that gate.ts reports.

import { Glob } from "bun";
import { closeSync, openSync } from "node:fs";

const ROOT = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const LOGDIR = (process.env.TMP ?? process.env.TEMP ?? ROOT).replace(/[\\/]$/, "");

/** Areas excluded from the default sweep — vendored or generated trees. */
const SKIP = /(^|[\\/])(node_modules|dist|build|\.git)([\\/]|$)/;

const argv = process.argv.slice(2);
const flag = (name: string, dflt: string): string => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : dflt;
};

/**
 * Number of shards to run CONCURRENTLY. This is what OMEGA_TEST_CONCURRENCY now
 * means: it used to be passed to `bun test --max-concurrency`, where it did nothing.
 * It is now the width of the process pool, which is a real lever. Kept under the old
 * name so existing invocations keep working.
 */
const width = Math.max(1, Number(process.env.OMEGA_TEST_CONCURRENCY ?? flag("width", "4")));
const timeoutMs = Number(flag("timeout-ms", "600000"));
/** Only run files under this prefix, e.g. --only=plugins */
const only = flag("only", "");

function findTests(dir: string): string[] {
  const glob = new Glob("**/*.test.ts");
  const out: string[] = [];
  for (const rel of glob.scanSync({ cwd: dir, onlyFiles: true, dot: false })) {
    if (SKIP.test(rel)) continue;
    if (only && !rel.replace(/\\/g, "/").startsWith(`${only.replace(/\\/g, "/")}/`)) continue;
    out.push(rel);
  }
  return out.sort();
}

/**
 * Split files into `n` shards, round-robin over the sorted list.
 *
 * Deliberately simple, and kept for a measured reason rather than taste. A size-weighted
 * LPT balancer was written to fix a real imbalance (two 35-file shards measured 56 s and
 * 147 s) and then dropped: file size is a proxy for cost, not cost, and an unmeasured
 * "probably faster" is not worth the complexity. This is the arrangement the suite was
 * VERIFIED against — 1582 pass / 2 skip / 2 fail at width 4 — so this is what ships.
 */
function shard(files: string[], n: number): string[][] {
  const out: string[][] = Array.from({ length: n }, () => []);
  files.forEach((f, i) => out[i % n].push(f));
  return out;
}

interface ShardResult {
  index: number;
  code: number | null;
  out: string;
  ms: number;
  files: number;
}

async function runShard(index: number, files: string[]): Promise<ShardResult> {
  const t0 = Date.now();
  // Output goes to FILES, never to a pipe. Several of these tests spawn MCP stdio
  // servers and vault daemons; on Windows a grandchild inherits the write end of an
  // inherited pipe and never closes it, so `new Response(proc.stdout).text()` waits
  // for an EOF that never arrives and the whole runner wedges — with every child
  // already exited. That is the exact hang AGENTS.md documents, and a file has no
  // EOF to miss. This was observed on the first run of this tool: 3 of 4 shards
  // finished in 14-35s and the runner sat there forever.
  const outPath = `${LOGDIR}/shard-${index}.log`;
  // A numeric fd, not a FileSink: Bun 1.3.14's spawn rejects a sink object
  // (ERR_INVALID_ARG_TYPE — "stdio must be an array of 'inherit', 'ignore', or null").
  const fd = openSync(outPath, "w");
  // No `onTimeout` here: it would close over `proc` before the assignment completes,
  // so a timeout firing inside the spawn call throws ReferenceError and never kills.
  //
  // `--failures-only` is LOAD-BEARING, not cosmetic (D-TEAM-028). The full suite prints
  // ~349 KB of per-test output; `world.run` rejects any stdout over 256 KB, so the gate
  // call inside omega-build died with "stdout is 348912 bytes, over the 262144-byte cap"
  // — after 43 minutes of correct implementation, at the gate, for a reason that had
  // nothing to do with the work. Only failures and the summary are ever read downstream.
  const proc = Bun.spawn(["bun", "test", "--failures-only", "--timeout", "60000", ...files], {
    cwd: ROOT,
    stdout: fd,
    stderr: fd,
    env: { ...process.env },
  });
  timerKill(proc);
  const code = await proc.exited;
  proc.unref();
  closeSync(fd);
  const out = await Bun.file(outPath).text();
  return { index, code, out, ms: Date.now() - t0, files: files.length, crashed: shardCrashed(out) };
}

// Bun.spawn has no built-in wall-clock timeout that also kills; keep one explicit.
function timerKill(proc: { kill: (n?: number) => void }): void {
  setTimeout(() => proc.kill(), timeoutMs).unref?.();
}

const files = findTests(ROOT);
if (files.length === 0) {
  console.error("sharded-test: no test files found");
  process.exit(1);
}

interface ShardResult {
  index: number;
  code: number | null;
  out: string;
  ms: number;
  files: number;
  /** Set when the shard's runner died instead of reporting a verdict. */
  crashed: boolean;
}

/**
 * Did the shard actually finish, or did its runner die?
 *
 * `bun test` prints a `N pass` summary only when it completes. A shard whose output
 * has no summary line ran NOTHING to a verdict — it crashed (`panic(thread): Stack
 * overflow`) or was killed — and every test in it is unrun.
 *
 * This distinction is the whole reason the check exists. On the first full sharded
 * run, shard 3 stack-overflowed at 42 s and the runner summed the other three
 * shards into an authoritative-looking "1134 pass / 1 fail" — silently discarding
 * ~450 tests that never ran. A summary that cannot distinguish "no failures" from
 * "one third of the suite vanished" is worse than no summary at all.
 */
function shardCrashed(out: string): boolean {
  return !/^\s*\d+ (pass|fail)\b/m.test(out.replace(/\x1b\[[0-9;]*m/g, ""));
}

/**
 * Areas whose tests assert on concurrency or timing, and so must have the box to
 * themselves. Both entries are measured, not guessed.
 *
 *  - `surfaces`: at width 4 the suite crashed inside `surfaces/daemon/test/pool.test.ts`
 *    with `panic(thread): Stack overflow` at RSS 2.47 GB / Commit 5.99 GB — not out of
 *    memory, but a genuine deep-recursion crash, logged right after Bun reported
 *    `workers_spawned(95) workers_terminated(92)`. The same file passes cleanly when
 *    `surfaces` runs alone (58 s, 70 pass, 0 fail).
 *  - `host`: its `lazy.test.ts` asserts on dormant-spawn and singleflight timing
 *    ("concurrent first touches share one spawn", "a never-called op still spawns and
 *    answers on first touch"). Both fail under 4-way contention and pass in isolation
 *    (6 pass / 0 fail). Testing a scheduler's timing while three other shards compete
 *    for the same cores is not a fair test of it.
 *
 * They run in a serial phase BEFORE the parallel one — ~80 s of the suite, and it buys
 * a run that actually completes and reports honestly.
 */
const SERIAL_AREAS = ["surfaces", "host"];

/**
 * Files whose tests assert on TIMING, and so cannot share the box.
 *
 * Measured, not guessed — each of these failed under 4-way sharding and passes alone:
 *   · vivim-run/integration  — "law.registry@1 p99 stays under 5ms while ~50 tasks flow"
 *   · vivim-nlcl/nlcl       — "interpret is fast enough for keystroke latency (< 2ms)"
 *   · vivim-director        — "the LIVE loop: intervalMs 100 fires the pass on schedule"
 *   · vivim-chat/pilot      — the 200-append indexed-cap refusal (and the slowest file, 17.5 s)
 *   · gates/f-durability    — 100 randomized torn appends
 *   · gates/efficiency-tooling — F-5 spawns the gate itself, so it contends with everything
 *
 * A wall-clock assertion measured while three other shards compete for the same cores is not
 * a test of the code under test. **Running them in parallel and reporting them as failures is
 * the false-red this repository keeps fighting** — a gate that cries wolf is worse than a slow
 * one, because the first response is to stop believing it.
 *
 * Cost of this list: ~60 s of serial time. It buys a report whose failures are real.
 */
const SERIAL_FILES = [
  "plugins/vivim-run/test/integration.test.ts",
  "plugins/vivim-nlcl/test/nlcl.test.ts",
  "plugins/vivim-director/test/director.test.ts",
  "plugins/vivim-chat/test/pilot.test.ts",
  "tooling/gates/test/f-durability.test.ts",
  "tooling/gates/test/efficiency-tooling.test.ts",
  // D-325: "spawn persists the overlay, restart keeps it" — a reboot-durability assertion.
  // Measured load-flaky at width 4 (fails in the pool, passes 4/4 alone), like the others here.
  "plugins/vivim-law/test/forbidden-durability.test.ts",
];

const norm = (f: string) => f.replace(/\\/g, "/");
const isSerialArea = (f: string) => SERIAL_AREAS.some((a) => norm(f).startsWith(`${a}/`));
const isSerialFile = (f: string) => SERIAL_FILES.some((p) => norm(f).includes(p));
const parallelFiles = files.filter((f) => !isSerialArea(f) && !isSerialFile(f));
// One shard PER serial unit — one per area, one per declared file — not one shard holding all
// of them. Measured: surfaces and host take 58 s and 25 s as separate processes but 100.8 s
// merged into one — they interact when they share a runner, which is the opposite of what
// this phase is for.
const serialShards = [
  ...SERIAL_AREAS.map((a) => files.filter((f) => norm(f).startsWith(`${a}/`))),
  ...SERIAL_FILES.map((p) => files.filter((f) => norm(f).includes(p))),
].filter((s) => s.length > 0);

console.error(
  `sharded-test: ${files.length} test files — ${serialShards.length} serial area shard(s) ` +
    `(${SERIAL_AREAS.join(", ")} + ${SERIAL_FILES.length} timing-sensitive file(s)) + ${parallelFiles.length} sharded ${width}-at-a-time`,
);

const results: ShardResult[] = [];
let shardCounter = 0;

/** Run shards with at most `pool` in flight. */
async function runPool(pool: string[][], widthLimit: number): Promise<void> {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(widthLimit, pool.length) }, async () => {
      for (;;) {
        const i = next++;
        if (i >= pool.length) return;
        const r = await runShard(shardCounter++, pool[i]);
        results.push(r);
        console.error(
          `  shard ${r.index} done: ${r.files} files, ${(r.ms / 1000).toFixed(1)}s` +
            (r.crashed ? "   <-- CRASHED, no verdict" : ""),
        );
      }
    }),
  );
}

// Phase 1 — concurrency/timing-sensitive areas, each alone, one after another.
if (serialShards.length > 0) {
  console.error("phase 1: serial areas (exclusive)");
  await runPool(serialShards, 1);
}
// Phase 2 — everything else, in parallel.
const parallelShards = shard(parallelFiles, width).filter((s) => s.length > 0);
if (parallelShards.length > 0) {
  console.error(`phase 2: ${parallelFiles.length} files across ${parallelShards.length} shards`);
  await runPool(parallelShards, width);
}

results.sort((a, b) => a.index - b.index);
const strip = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, "");
const plain = strip(results.map((r) => r.out).join("\n"));

const tally = (key: string): number =>
  results.reduce((n, r) => n + Number(new RegExp(`^\\s*(\\d+) ${key}`, "m").exec(strip(r.out))?.[1] ?? 0), 0);
const pass = tally("pass");
const fail = tally("fail");
const skip = tally("skip");
const failing = [...plain.matchAll(/\(fail\) (.+?) \[\d[\d.,]*m?s\]/g)].map((m) => m[1].trim().slice(0, 160));

// What gate.ts actually reads: the failing test lines, and nothing else. Echoing the whole
// log is what broke the corridor — `world.run` rejects stdout over 256 KB, and the full suite
// prints ~349 KB (D-TEAM-028). A hard cap as well as the flag, so a regression that re-adds
// noise fails here rather than 43 minutes downstream.
//
// The ORIGINAL lines are re-emitted, not reconstructed from the names, because gate.ts's
// fallback regex requires the `[123.45ms]` suffix: `/\(fail\) (.+?) \[\d[\d.,]*m?s\]/`.
const noise = plain
  .split("\n")
  .filter((l) => l.trimStart().startsWith("(fail)"))
  .join("\n");
if (noise.length > 60_000) {
  console.error(`sharded-test: failure detail truncated (${noise.length} bytes)`);
  console.log(noise.slice(0, 60_000));
} else {
  console.log(noise);
}

const crashedShards = results.filter((r) => r.crashed);
const ok = crashedShards.length === 0 && results.every((r) => r.code === 0) && fail === 0;

console.log(
  JSON.stringify(
    {
      ok,
      shards: results.length,
      width,
      files: files.length,
      ...(crashedShards.length > 0
        ? {
            INCOMPLETE: `${crashedShards.length} shard(s) died without reporting a verdict — the counts below cover only the shards that finished and DO NOT account for every test file`,
            crashedShards: crashedShards.map((r) => ({
              shard: r.index,
              exitCode: r.code,
              files: r.files,
              lastLine: r.out.trim().split("\n").filter(Boolean).slice(-1)[0]?.slice(0, 200) ?? "",
            })),
          }
        : {}),
      pass,
      skip,
      fail,
      slowestShardMs: Math.max(...results.map((r) => r.ms)),
      failingTests: [...new Set(failing)],
    },
    null,
    2,
  ),
);

process.exit(ok ? 0 : 1);