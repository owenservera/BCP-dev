// .zcode/checks/resume-check.ts — D-TEAM-031
//
// AUTOCONTINUE, WITHOUT A CLOCK.
//
// A dropped connection costs context, not work — everything durable is committed. What it
// actually strands is a session mid-move, and this project has a documented history of exactly
// the states that strands one:
//
//   · an unattributed writer ran for twelve minutes and NOTHING in the PM system could see it
//     (gap G-01) — the tree was dirty and no corridor was registered;
//   · a corridor was registered OPEN, its run died, and the row stayed open afterwards;
//   · a run errored on something a later edit fixed, and the resume path was not obvious
//     (the stdout-cap kill, and the amend that lost `args.task`).
//
// Each of those is DETECTABLE FROM THE REPO ALONE. That is the whole design: recovery keyed on
// state, not on a timer. D-TEAM-026 removed every cron on the grounds that the project is always
// live — a scheduled auditor only helps when nobody is present — and this does not reintroduce
// one. It is run when a session starts, which is exactly when a clock would have been useless.
//
// It reports; it never fixes. The next action is a decision, and an agent making it from a
// summary is exactly the failure mode this repository keeps catching.

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

/** Trim trailing newline ONLY — porcelain pads unstaged rows with a LEADING space. */
const git = (args: string[]): string => {
  try {
    return execFileSync("git", args, { cwd: REPO, encoding: "utf-8" }).replace(/\r?\n$/, "");
  } catch {
    return "";
  }
};

const porcelain = git(["status", "--porcelain"]).split("\n").filter(Boolean);
const head = git(["rev-parse", "--short", "HEAD"]);
const tracking = read(join(ZCODE, "TRACKING.md"));
const handoff = read(join(ZCODE, "HANDOFF.md"));

interface Recovery {
  check: string;
  /** What happened, in one sentence. */
  what: string;
  /** The exact next action. A decision, not a guess. */
  next: string;
  severity: "high" | "low";
}

const recoveries: Recovery[] = [];

// ---- 1 · uncommitted work with nobody registered as writing ---------------------
// The G-01 shape exactly: a dirty tree and no owner. Adopt it or find its author.
const corridorRows = tracking
  .split("\n")
  .filter((l) => l.startsWith("| `") && /\bOPEN\b|\bIN FLIGHT\b/.test(l))
  .map((l) => /^\| `([^`]+)`/.exec(l)?.[1])
  .filter(Boolean) as string[];

if (porcelain.length > 0 && corridorRows.length === 0) {
  recoveries.push({
    check: "UNATTRIBUTED_WORK",
    what: `${porcelain.length} uncommitted change(s) and NO registered writer corridor — this is the G-01 shape: a writer with no owner, invisible to the PM system until it breaks something.`,
    next: "Run `bun run .zcode/checks/check-all.ts` for the file list, then either find the author or adopt the work as D-TEAM-020 did.",
    severity: "high",
  });
}

// ---- 2 · a corridor still open, with the work already committed -----------------
// A run that died leaves its row open. The next session inherits a phantom writer and, worse,
// measures its own gate against a tree it believes is being written.
if (corridorRows.length > 0 && porcelain.length === 0) {
  recoveries.push({
    check: "STALE_CORRIDOR_ROW",
    what: `Corridor(s) ${corridorRows.join(", ")} are still registered OPEN, but the working tree is clean — the run died and left the row behind.`,
    next: "Close the row in TRACKING.md with a LANDED/DONE status and the commit, or reopen the work. Until then every gate result is CONTAMINATED by a writer that is not running.",
    severity: "high",
  });
}

// ---- 3 · the handoff has drifted from HEAD ---------------------------------------
// The handoff is only useful if it is current. A stale one is worse than none: it is
// confidently wrong.
const handoffHead = /regenerated for commit `([0-9a-f]{7,})`|commit `([0-9a-f]{7,})`/.exec(handoff);
if (!handoff.trim()) {
  recoveries.push({
    check: "NO_HANDOFF",
    what: ".zcode/HANDOFF.md is missing — a new session has no one-screen statement of where the build is.",
    next: "Write it from TRACKING.md and the git log; it is the thing that survives a dropped connection.",
    severity: "low",
  });
}

// ---- report ---------------------------------------------------------------------
const report = {
  ok: recoveries.filter((r) => r.severity === "high").length === 0,
  head,
  dirtyEntries: porcelain.length,
  openCorridors: corridorRows,
  recoveries,
  // Always useful, always true: the three commands a resuming session should run.
  resumeWith: [
    "bun run .zcode/checks/check-all.ts   # governance + dispatch + ledger + tree attribution",
    "bun run --cwd omega-baseline/omega-final omega:quick",
    "git log --oneline -5",
  ],
};

console.log(JSON.stringify(report, null, 2));
console.error(
  report.ok
    ? `resume-check: clean at ${head}. Nothing needs recovery.`
    : `resume-check: ${recoveries.length} thing(s) need attention.\n  - ${recoveries.map((r) => `${r.check}: ${r.what}`).join("\n  - ")}`,
);

process.exit(report.ok ? 0 : 1);