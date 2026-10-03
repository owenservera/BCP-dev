// .zcode/checks/dispatch-queue.ts — D-TEAM-025
//
// "Fully automate dev" means the next READY task gets picked up without a human deciding to
// pick it up. That is only safe if the *preconditions* are checked rather than assumed —
// D-TEAM-010 mandates one writer per worktree and named no mechanism, and the corpus has
// already paid for that twice (an unattributed writer for twelve minutes; a gate taken across
// a live corridor, which was meaningless).
//
// So this does NOT dispatch anything. It answers one question — "is there work that is safe to
// start right now?" — and returns the exact dispatch call. The gate runs when conditions hold;
// the condition check is the whole safety argument.
//
// Conditions, all of which must hold:
//   1. No writer corridor is OPEN           (D-TEAM-017: one writer per worktree)
//   2. The working tree has no unexplained changes (a dirty tree means someone is mid-write)
//   3. A task is actually READY            (not BLOCKED, not DONE, not an owner-reserved item)
//
// Output is JSON on stdout and a human sentence on stderr. Exit 0 when work is dispatchable,
// 1 when it is not, 2 when no candidate exists at all — so a cron can tell "blocked" from
// "nothing to do" without parsing prose.

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
    return execFileSync("git", args, { cwd: REPO, encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
};

const tracking = read(join(ZCODE, "TRACKING.md"));
const lines = tracking.split("\n");

// ---- condition 1 — an open writer corridor blocks everything -----------------
const openCorridors = lines
  .filter((l) => l.startsWith("| `") && /\bOPEN\b|\bIN FLIGHT\b/.test(l))
  .map((l) => /^\| `([^`]+)`/.exec(l)?.[1])
  .filter(Boolean) as string[];

// ---- condition 2 — a dirty tree means someone is mid-write -------------------
const porcelain = git(["status", "--porcelain"])
  .split("\n")
  .filter(Boolean);

// ---- condition 3 — find a genuinely READY task -------------------------------
// READY is read as a task that is actionable by the team: marked READY, and not blocked on
// the owner. Owner-reserved rows are excluded by name — the policy keeps those conservative
// and reversible, and they must never be auto-dispatched.
const OWNER_RESERVED = /\bowner[- ](side|reserved|action|decision|inform)\b|\bOWNER-INFORM\b/i;

/**
 * Lanes whose READY work is an IMPLEMENTATION corridor, i.e. something `omega-build` can
 * actually execute.
 *
 * Without this the queue would blindly hand a builder a design task. T-08 ("Stage-E L3
 * graph-bundle contract" — "one bounded L3 contract/design pass") is READY today, and it is
 * a *contract/design* exercise, not a bounded code change; dispatching a builder at it would
 * produce code where a decision was wanted. READY means "unblocked", not "the same kind of
 * work" — those are different claims and the queue must not conflate them.
 */
const BUILD_LANES = new Set(["WS-5", "system"]);

interface Candidate {
  id: string;
  task: string;
  lane: string;
  status: string;
  evidence: string;
  /** False for READY work that is not a bounded implementation corridor. */
  autoDispatchable: boolean;
}

const candidates: Candidate[] = [];
for (const line of lines) {
  if (!line.startsWith("| T-")) continue;
  const cells = line.split("|").map((c) => c.trim());
  const id = cells[1];
  if (!id || !/^T-\d+$/.test(id)) continue;
  const task = cells[2] ?? "";
  const lane = cells[4] ?? "";
  const status = cells[5] ?? "";
  if (!/\bREADY\b/.test(status)) continue;
  if (OWNER_RESERVED.test(status) || OWNER_RESERVED.test(cells[6] ?? "")) continue;
  candidates.push({
    id,
    task,
    lane,
    status,
    evidence: cells[6] ?? "",
    autoDispatchable: BUILD_LANES.has(lane),
  });
}

// Only an implementation-lane task can start the queue; the rest are reported, not run.
const buildable = candidates.filter((c) => c.autoDispatchable);

const blocked: string[] = [];
if (openCorridors.length > 0) blocked.push(`writer corridor OPEN: ${openCorridors.join(", ")}`);
if (porcelain.length > 0) blocked.push(`working tree has ${porcelain.length} unexplained change(s)`);
if (buildable.length === 0) {
  blocked.push(
    candidates.length === 0
      ? "no task is marked READY"
      : `READY tasks exist but none is an implementation lane (${candidates.map((c) => `${c.id}:${c.lane}`).join(", ")})`,
  );
}

const dispatchable = blocked.length === 0 && buildable.length > 0;
const next = buildable[0];

const out = {
  dispatchable,
  blocked,
  openCorridors,
  dirtyFiles: porcelain.slice(0, 12),
  ready: candidates,
  // The exact call, so a scheduler never has to compose it (and never guesses the task id).
  dispatch: dispatchable
    ? {
        tool: "CreateWorkflow",
        saved: "omega-build",
        args: { task: `Task ${next.id} — ${next.task}. Evidence/next action: ${next.evidence}` },
      }
    : undefined,
};

console.log(JSON.stringify(out, null, 2));
console.error(
  dispatchable
    ? `dispatch-queue: ${next.id} (${next.lane}) is READY and the worktree is clean — dispatchable via omega-build.`
    : `dispatch-queue: nothing dispatched. ${blocked.join("; ")}.`,
);

process.exit(dispatchable ? 0 : candidates.length === 0 && blocked.length === 1 ? 2 : 1);