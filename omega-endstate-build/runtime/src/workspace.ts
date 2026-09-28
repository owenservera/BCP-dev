/**
 * workspace.ts — per-agent git worktree isolation.
 *
 * This is the owner's hard constraint: concurrent autonomous agents must never
 * share a checkout. The reference runtime (opencode-swarm) spawns every session
 * in one directory, which is unacceptable here.
 *
 * We therefore delegate allocation to the repository's existing, already-reviewed
 * allocator `omega-endstate-build/scripts/New-AgentWorkspace.ps1`, which:
 *   - resolves the base from the REMOTE `team/omega-endstate` tip,
 *   - creates branch `work/omega-endstate/<AGENT-ID>/<TASK>`,
 *   - refuses to reuse an existing branch or an existing path,
 *   - writes `.omega-agent/manifest.json` inside the worktree,
 *   - registers the workspace and rolls back on failure.
 *
 * Rather than parsing that script's console output (fragile), we read the
 * manifest it wrote and verify the worktree really is a worktree. If any of that
 * is missing we fail the agent — we never guess, and we never let an agent run
 * in a shared checkout because allocation output looked plausible.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

export interface Allocation {
  agentId: string;
  task: string;
  workspace: string;
  branch: string;
  baseSha: string;
  baseBranch: string;
}

export class WorkspaceError extends Error {
  constructor(
    message: string,
    readonly detail?: string,
  ) {
    super(message);
    this.name = "WorkspaceError";
  }
}

const VALID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

function runGit(args: string[], cwd: string): string {
  const r = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
  });
  if (r.status !== 0) {
    throw new WorkspaceError(
      `git ${args.join(" ")} failed`,
      (r.stderr || r.stdout || "").trim(),
    );
  }
  return (r.stdout ?? "").trim();
}

/**
 * Allocate an isolated worktree for one agent.
 *
 * `runId` doubles as the task slug, so a run produces one worktree per agent and
 * the branch names stay readable and unique per run.
 */
export function allocate(
  repoRoot: string,
  agentId: string,
  task: string,
): Allocation {
  if (!VALID.test(agentId)) {
    throw new WorkspaceError(`illegal agentId: ${agentId}`);
  }
  if (!VALID.test(task)) {
    throw new WorkspaceError(`illegal task slug: ${task}`);
  }

  const script = join(
    repoRoot,
    "omega-endstate-build",
    "scripts",
    "New-AgentWorkspace.ps1",
  );
  if (!existsSync(script)) {
    throw new WorkspaceError("allocator script not found", script);
  }

  const r = spawnSync(
    "pwsh",
    [
      "-NoProfile",
      "-NonInteractive",
      "-File",
      script,
      "-AgentId",
      agentId,
      "-Task",
      task,
    ],
    { cwd: repoRoot, encoding: "utf8", windowsHide: true, timeout: 300_000 },
  );

  if (r.error) throw new WorkspaceError("allocator failed to run", String(r.error));
  if (r.status !== 0) {
    throw new WorkspaceError(
      `allocator exited ${r.status}`,
      (r.stdout || "").trim() || (r.stderr || "").trim(),
    );
  }

  // Read the manifest the allocator wrote rather than scraping its output.
  const out = r.stdout ?? "";
  const m = out.match(/^\s*Workspace:\s*(\S+)\s*$/im);
  if (!m) {
    throw new WorkspaceError(
      "allocator did not report a Workspace path",
      out.trim().slice(0, 800),
    );
  }
  const workspace = m[1];

  const manifestPath = join(workspace, ".omega-agent", "manifest.json");
  if (!existsSync(manifestPath)) {
    throw new WorkspaceError("allocator did not write a manifest", manifestPath);
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    agentId: string;
    task: string;
    branch: string;
    baseBranch: string;
    baseSha: string;
    workspacePath: string;
  };

  if (manifest.agentId !== agentId) {
    throw new WorkspaceError(
      `manifest agentId mismatch: ${manifest.agentId} != ${agentId}`,
    );
  }

  // Prove it is genuinely an isolated worktree, not the main checkout.
  const gitCommon = runGit(["rev-parse", "--path-format=absolute", "--git-common-dir"], workspace);
  const gitDir = runGit(["rev-parse", "--path-format=absolute", "--git-dir"], workspace);
  if (gitCommon === gitDir) {
    throw new WorkspaceError(
      "allocated path is the repository itself, not an isolated worktree",
      workspace,
    );
  }

  const expectedBranch = `work/omega-endstate/${agentId}/${task}`;
  if (manifest.branch !== expectedBranch) {
    throw new WorkspaceError(
      `branch mismatch: ${manifest.branch} != ${expectedBranch}`,
    );
  }

  return {
    agentId,
    task,
    workspace: manifest.workspacePath ?? workspace,
    branch: manifest.branch,
    baseSha: manifest.baseSha,
    baseBranch: manifest.baseBranch,
  };
}

/** Confirm an allocated workspace is still clean and on its expected branch. */
export function verify(allocation: Allocation): {
  ok: boolean;
  clean: boolean;
  head: string;
  problems: string[];
} {
  const problems: string[] = [];
  if (!existsSync(allocation.workspace)) {
    return { ok: false, clean: false, head: "", problems: ["workspace missing"] };
  }
  let head = "";
  try {
    head = runGit(["rev-parse", "HEAD"], allocation.workspace);
    const branch = runGit(
      ["rev-parse", "--abbrev-ref", "HEAD"],
      allocation.workspace,
    );
    if (branch !== allocation.branch) {
      problems.push(`on branch ${branch}, expected ${allocation.branch}`);
    }
  } catch (e) {
    problems.push(e instanceof Error ? e.message : String(e));
    return { ok: false, clean: false, head, problems };
  }
  const dirty = runGit(["status", "--porcelain"], allocation.workspace);
  return {
    ok: problems.length === 0,
    clean: dirty.length === 0,
    head,
    problems,
  };
}
