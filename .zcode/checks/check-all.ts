// .zcode/checks/check-all.ts — D-TEAM-027
//
// THE EVENT-DRIVEN DUTY, MECHANISED.
//
// D-TEAM-026 deleted every clock-driven automation and replaced them with a table of
// "this fires when that happens". That table is in TEAM.md and TRACKING.md — it is PROSE.
// And prose-only rules are this repository's most repeated failure mode, measured three times
// today: D-TEAM-021 wrote "run the suite serially" in the ledger and left the default
// crashing; the `bunfig.toml` "fix" looked finished and did nothing; the Monday audit was
// recorded DONE and never fired once.
//
// Replacing a cron with a table is not automating anything. This file is that table, executable.
//
// Run it at session start and at corridor close — the two points D-TEAM-026 assigned the duty
// to. It aggregates the checks that already exist rather than reimplementing them:
//
//   · governance-check.ts   — every standing instrument exists on purpose (D-TEAM-025)
//   · dispatch-queue.ts     — is there work safe to start right now (D-TEAM-025)
//   · the untracked sweep   — HOUSEKEEPING's zero-unexplained-untracked rule, which until now
//                             existed ONLY inside the prompt of a cron that has been deleted
//
// Exit 0 when clean, 1 when something needs a human. It never fixes anything.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ZCODE = join(HERE, "..");
const REPO = join(ZCODE, "..");

const read = (p: string): string => {
  try { return readFileSync(p, "utf-8"); } catch { return ""; }
};

const git = (args: string[]): string => {
  try {
    // Trim trailing newline ONLY. `git status --porcelain` pads unstaged entries with a leading
    // space (" M path"), and trimming the whole output chops that first status column off the
    // first line, which turns "M path" into a path that does not exist.
    return execFileSync("git", args, { cwd: REPO, encoding: "utf-8" }).replace(/\r?\n$/, "");
  } catch {
    return "";
  }
};

/** Run a sibling check and parse its JSON. Exit code is reported, never thrown. */
function runCheck(script: string): { code: number; json: Record<string, unknown> | null } {
  let out = "";
  let code = 0;
  try {
    out = execFileSync("bun", ["run", join(ZCODE, "checks", script)], {
      cwd: REPO,
      encoding: "utf-8",
      env: { ...process.env },
    });
  } catch (e) {
    code = 1;
    out = (e as { stdout?: string }).stdout ?? "";
  }
  return { code, json: parseJson(out) };
}

/**
 * A check's stdout IS its JSON (console.error goes to stderr, which this does not read), so the
 * object is the whole payload and can start at index 0. The first version looked for a preceding
 * newline and silently got null for every sub-check — which is how a check can report "clean"
 * having read nothing at all.
 */
function parseJson(out: string): Record<string, unknown> | null {
  const start = out.indexOf("{");
  const end = out.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  return safeParse(out.slice(start, end + 1));
}

function safeParse(s: string): Record<string, unknown> | null {
  try { return JSON.parse(s); } catch { return null; }
}

// ---- the untracked sweep (HOUSEKEEPING's rule, mechanised) --------------------
// "Zero unexplained untracked": every `git status --porcelain` entry must be accounted for —
// by HOUSEKEEPING.md's tables, or by a REGISTERED open corridor. The corridor case matters:
// while a writer is live its files are legitimately uncommitted, and D-TEAM-017's entire point
// is that the dirt is *attributed* rather than merely tolerated. Unattributed dirt with nothing
// running is the failure; attributed dirt from a registered writer is the system working.
const housekeeping = read(join(ZCODE, "HOUSEKEEPING.md"));
const porcelain = git(["status", "--porcelain"]).split("\n").filter(Boolean);

const governance = runCheck("governance-check.ts");
const dispatch = runCheck("dispatch-queue.ts");
const ledger = runCheck("ledger-check.ts");
const resume = runCheck("resume-check.ts");
const openCorridors = (governance.json?.openCorridors as string[] | undefined) ?? [];

const unattributed = porcelain.filter((line) => {
  const path = line.slice(3).trim().replace(/"/g, "");
  return !housekeeping.includes(path);
});

/**
 * Which paths each OPEN corridor actually declared it owns, read back out of the registry.
 *
 * Without this the check is toothless: "a corridor is open" would excuse ANY dirt in the
 * worktree, including a second writer the registry knows nothing about. That is the exact
 * failure G-01 describes — an unattributed writer nobody could see — reproduced by the very
 * mechanism meant to catch it.
 *
 * It immediately earned its place: the forge-survey corridor registered
 * `plugins/forge-survey/` and is in fact editing `plugins/forge-mine-capture/`, which it never
 * declared. The registry row was wrong, which is a finding about the registry, not the writer.
 */
const tracking = read(join(ZCODE, "TRACKING.md"));
const declaredPaths = new Map<string, string[]>();
for (const line of tracking.split("\n")) {
  if (!line.startsWith("| `")) continue;
  if (!/\bOPEN\b|\bIN FLIGHT\b/.test(line)) continue;
  const cells = line.split("|").map((c) => c.trim());
  const name = /^\| `([^`]+)`/.exec(line)?.[1];
  if (!name) continue;
  const files = [...(cells[3] ?? "").matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  declaredPaths.set(name, files);
}

const offRegister: string[] = [];
for (const line of unattributed) {
  const path = line.slice(3).trim().replace(/"/g, "");
  // Substring, not prefix: registry rows name paths relative to `omega-final`
  // (`plugins/forge-survey/`) while git reports them from the repo root
  // (`omega-baseline/omega-final/plugins/forge-survey/...`). Matching on prefix would call every
  // corridor's own files unregistered.
  const owned = [...declaredPaths.values()].some((files) =>
    files.some((f) => {
      const base = f.replace(/\/$/, "").replace(/\*$/, "");
      return base.length > 0 && path.includes(base);
    }),
  );
  if (!owned) offRegister.push(path);
}

const problems: string[] = [];
if (governance.code !== 0) {
  const issues = (governance.json?.issues as { check: string; what: string }[] | undefined) ?? [];
  for (const i of issues) problems.push(`${i.check}: ${i.what}`);
  if (issues.length === 0) problems.push("governance-check failed without reporting an issue");
}
if (ledger.code !== 0) {
  const gaps = (ledger.json?.gaps as { entry: string; missing: string[] }[] | undefined) ?? [];
  for (const g of gaps) problems.push(`${g.entry} is missing ${g.missing.join(", ")}`);
  const un = (ledger.json?.unregistered as string[] | undefined) ?? [];
  for (const id of un) problems.push(`${id} has no row in the ledger's index table`);
  if (gaps.length === 0 && un.length === 0) problems.push("ledger-check failed without reporting an issue");
}
if (openCorridors.length === 0 && unattributed.length > 0) {
  // Nothing is registered as writing, so nothing explains a dirty tree.
  problems.push(
    `${unattributed.length} unattributed working-tree entr(ies) and NO open corridor: ${JSON.stringify(unattributed)}`,
  );
} else if (offRegister.length > 0) {
  // A corridor is open and is writing outside what it registered. Not a build failure — the
  // work may be perfectly legitimate — but the registry is now inaccurate, which is the defect
  // that let an unattributed writer run for twelve minutes in the first place.
  problems.push(
    `OPEN corridor(s) ${openCorridors.join(", ")} are writing OUTSIDE their registered paths — fix the registry row: ${JSON.stringify(offRegister)}`,
  );
}

const report = {
  ok: problems.length === 0,
  problems,
  governance: { ok: governance.json?.ok, workflows: governance.json?.workflows },
  ledger: { ok: ledger.json?.ok, entries: ledger.json?.entries },
  // Reported, never failed here: resume-check describes an interrupted state for whoever picks
  // the work up, and a live session is by definition mid-something. Its HIGH findings are its
  // own exit code; folding them into this one would report a clean session as broken.
  resume: { ok: resume.json?.ok, recoveries: (resume.json?.recoveries as { check: string }[] | undefined)?.length ?? 0 },
  dispatch: {
    dispatchable: dispatch.json?.dispatchable,
    blocked: dispatch.json?.blocked,
  },
  // Reported, never failed: a gate result taken while a corridor is open is CONTAMINATED,
  // not a measurement (D-TEAM-017). This check cannot know whether a gate is being taken.
  openCorridors,
  dirtyEntries: porcelain.length,
  unattributed,
  offRegister,
};

console.log(JSON.stringify(report, null, 2));
console.error(
  report.ok
    ? `check-all: clean. ${report.governance.workflows} instruments registered.` +
      (openCorridors.length > 0
        ? ` Corridor OPEN (${openCorridors.join(", ")}) — ${unattributed.length - offRegister.length} uncommitted file(s) ATTRIBUTED to it, and any gate taken now is CONTAMINATED.`
        : "")
    : `check-all: ${problems.length} problem(s).\n  - ${problems.join("\n  - ")}`,
);

process.exit(report.ok ? 0 : 1);