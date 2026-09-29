# 05 — Workspace Isolation

> This is the owner's hard constraint and the primary reason the VIVIM runtime is not simply the
> reference runtime. Concurrent autonomous agents must never share a checkout.

## The rule

```
one agent  ->  one isolated git worktree  ->  one owned branch  ->  one session
```

and, critically, the ordering: **the worktree is allocated and verified before the session
exists.** A session created in a shared directory is the failure we are preventing, and it is
not recoverable by cleaning up afterwards.

## Why the reference cannot be used as-is

`opencode-swarm` spawns every session in one project directory. Four agents editing the same
tree concurrently is data corruption with extra steps, and it also means no agent has a clean
reviewable branch. Its own e2e test runs two agents that both write — acceptable for a
memory/message demo, unacceptable for agents that touch code.

## Delegating, not reimplementing

The repository already has a reviewed allocator:
`omega-endstate-build/scripts/New-AgentWorkspace.ps1`. It:

- resolves the base from the **remote** `team/omega-endstate` tip, not the local branch;
- creates branch `work/omega-endstate/<AGENT-ID>/<TASK>`;
- refuses to reuse an existing branch or an existing path;
- writes `.omega-agent/manifest.json` inside the worktree;
- registers the workspace under a lock, and rolls back completely on failure;
- has a matching `Retire-AgentWorkspace.ps1` and `Verify-AgentWorkspace.ps1`.

`runtime/src/workspace.ts` calls it and then **proves** the result. It deliberately does not
reimplement the git mechanics, and it deliberately does not scrape the script's console output
(fragile). Instead it reads the manifest the allocator wrote.

## `allocate(repoRoot, agentId, task)`

1. Validate `agentId` and `task` against `^[A-Za-z0-9][A-Za-z0-9._-]*$`.
2. Confirm the allocator script exists.
3. Run it with `pwsh -NoProfile -NonInteractive -File ... -AgentId -Task`, 300 s timeout.
4. Read `Workspace:` from stdout **only** to learn the path, then read
   `<workspace>/.omega-agent/manifest.json` for `agentId`, `branch`, `baseBranch`, `baseSha`,
   `workspacePath`.
5. Assert `manifest.agentId === agentId`.
6. **Assert it is genuinely isolated:** `git rev-parse --git-common-dir` must differ from
   `--git-dir`. Equal values mean this is the main checkout wearing a manifest.
7. Assert `branch === work/omega-endstate/<agentId>/<task>`.
8. Return the allocation.

Every failure raises `WorkspaceError` with the allocator's own output attached. Nothing is
guessed.

## `verify(allocation)`

Re-checks existence, that HEAD is on the expected branch, and returns cleanliness. Run before a
session is created, and available for a post-run audit.

## Allocation is sequential, on purpose

Worktree allocation touches git refs and a shared registry file. The allocator takes a lock, so
parallel calls would not corrupt anything, but they would serialise on that lock anyway while
adding timeout risk. Allocation is fast; the expensive part is the model turns. **Sequential
allocation, fully parallel turns** is the right split.

## Known allocator defect (found 2026-09-28)

`New-AgentWorkspace.ps1` derives its workspace root from the *parent of the repository root*:

```
repoRoot = C:\.../omega-endstate-workspaces\STEW-01-bootstrap-team
-> WorkspaceRoot = C:\.../omega-endstate-workspaces/omega-endstate-workspaces     <-- nested
-> workspace     = C:\.../omega-endstate-workspaces/omega-endstate-workspaces/base-01-sw_abc123
```

Because the Steward's own worktree lives *inside* a workspace root, the name is duplicated. The
result is still isolated and outside the repository, so this is **not a safety bug** — but it is
confusing, and a future agent could reasonably read `omega-endstate-workspaces/omega-endstate-workspaces`
as a mistake and "fix" it by moving work.

**Still open as of the `work/omega-endstate/STEW-01/bootstrap-team` reorg.** The allocator's
*default root name* was changed from `omega-endstate-workspaces` to `omega-endstate-worktrees`
(§11: agent identity is not branch identity; the workspace root is machine-local), but the
derivation itself was **not** changed. Because the live worktree still lives at
`omega-endstate-workspaces\STEW-01-bootstrap-team`, the default still computes to:

```
repoRoot = C:\.../omega-endstate-workspaces\STEW-01-bootstrap-team
-> WorkspaceRoot = C:\.../omega-endstate-workspaces/omega-endstate-worktrees       <-- still nested
-> workspace     = C:\.../omega-endstate-workspaces/omega-endstate-worktrees/<TASK>
```

So the defect is **renamed, not fixed**. The isolation property is unaffected; only the
confusing duplicate-name shape remains.

**Mitigation, immediate:** the orchestrator passes an explicit `-WorkspaceRoot`, so nesting never
happens under our control.

**Proper fix, separate change:** make the allocator take the workspace root as a parameter and
fail clearly if the computed root is inside another workspace root. That is a change to a shared,
reviewed script and gets its own commit and review — not a drive-by edit from a swarm run.

## Per-agent prohibitions, stated in the system prompt

Each agent's prompt says, and each agent's evidence bar expects:

- You are in your own worktree. Do not touch other agents' worktrees.
- Do not commit to `team/omega-endstate`.
- No force-push, no history rewrite, no `git add .`.
- Do not retire or reassign another agent's workspace.

## Retirement

`Retire-AgentWorkspace.ps1 -WorkspacePath <path> -DeleteLocalBranch -Confirm:$false`.

Verified working, including that the remote branch is left alone. Retirement is the Steward's
call after reviewing receipts, not something an agent may do for itself.
