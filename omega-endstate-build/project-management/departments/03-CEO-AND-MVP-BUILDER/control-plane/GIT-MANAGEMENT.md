# VIVIM Ω End-State Build — Git Management

> Status: OWNER-DIRECTED SAFETY PROTOCOL
> Applies to: Steward and all autonomous/subagent work on this path

## Core rule

**Branch isolation is necessary; workspace isolation is mandatory.**

A branch isolates commit lineage.

A worktree or clone isolates the actual filesystem and Git index.

Therefore:

```
normal autonomous work
= isolated worktree or clone
+ owned work branch
+ coherent task
```

Never let concurrently active autonomous agents share a checkout.

## Repository lines

```
main
    = parallel BCP / Architecture Steward development line

team/omega-endstate
    = Ω End-State Build Team integration line

work/omega-endstate/<AGENT_ID>/<TASK>
    = autonomous work branch
```

The repository default branch must never be used as an implicit task base.

For Ω End-State work, default from:

`team/omega-endstate`

unless the task explicitly names another base.

## Project home vs workspaces

`omega-endstate-build/` contains the shared tracked project home; this department owns the CEO/MVP execution portion of that control plane.

It must not become the shared working checkout for multiple agents.

Active agent workspaces should normally be separate local worktrees or clones outside the tracked project directory.

## What is configured here vs what must happen locally

This project now contains executable PowerShell helpers under `omega-endstate-build/scripts/` for workspace allocation, verification, Steward bootstrap, and retirement.

From the repository side, we can provide:

- the safety policy;
- branch naming and ownership rules;
- workspace allocation logic;
- local agent manifests;
- workspace registry schema;
- verification/retirement tooling;
- durable team scaffolding.

The actual Windows filesystem operations still occur in the local session. The first Steward session must run the bootstrap helper locally rather than assuming that the GitHub branch itself creates isolation.

## Required startup inspection

Before substantive work:

```powershell
git status --short --branch
git branch --show-current
git rev-parse HEAD
git log -1 --oneline --decorate
git remote -v
git worktree list
git fetch origin --prune
```

Then re-check:

```powershell
git status --short --branch
git rev-parse HEAD
```

Never assume the current checkout or branch is what you intended.

## Workspace allocation

Use the supplied helper for normal local allocation:

```powershell
.\omega-endstate-build\scripts\Bootstrap-Steward.ps1
```

or for another agent:

```powershell
.\omega-endstate-build\scripts\New-AgentWorkspace.ps1 -AgentId PROV-01 -Task provider-lab
```

Use `-Mode clone` for unusually high-risk work where a completely separate Git repository checkout is preferable.

The default workspace root is a sibling directory named `omega-endstate-workspaces`, outside the tracked repository. This prevents agent workspaces from becoming nested tracked project state.

The allocator records machine-local registry state in that workspace root and writes a machine-local `.omega-agent/manifest.json` into each allocated workspace. Those manifests are gitignored.

Before accepting a workspace, run:

```powershell
.\omega-endstate-build\scripts\Verify-AgentWorkspace.ps1
```

## Workspace assignment record

Before assigning work to an agent, record:

```
AGENT_ID
TASK_ID
WORKSPACE_PATH
BRANCH
BASE_SHA
OWNER
```

Prefer:

- one worktree per concurrent agent;
- separate clone for unusually high-risk or destructive experiments.

Do not put a child agent onto the Steward's own working checkout.

Do not switch branches in a workspace another agent might be using.

## Dirty-worktree rule

Unknown pre-existing changes are a safety event.

Do not automatically:

```
git reset --hard
git clean -fd
git restore .
git checkout .
git stash
```

First determine ownership and whether the changes are recoverable work.

## Staging rule

Never blindly use:

`git add .`

in a multi-agent workspace.

Stage explicit files or a deliberately verified set.

Before committing:

```powershell
git status
git diff --cached
```

## Commit rule

Commits must be coherent and recoverable.

Do not make checkpoint commits just because a session is ending.

Use clear messages.

Do not mix unrelated changes.

## Never commit secrets

Never commit provider credentials, cookies, API keys, private keys, tokens, session exports or other machine/account secrets.

Real-provider testing must separate sanitized evidence from credentials.

## Peer inspection

Never merge a peer branch merely to inspect it.

Use:

- branch refs;
- exact commit SHA;
- diffs;
- file inspection;
- tests;
- evidence;
- Commons.

Branches are for changes.

Commons is for communication.

## Integration

Canonical sequence:

```
fetch
→ inspect
→ verify base
→ inspect diff
→ verify ownership/overlap
→ test
→ integrate
→ verify resulting tree
→ record resulting SHA
```

Integrate coherent units, not every intermediate state.

Never continuously rebase parallel branches simply to keep them visually close.

## Published history

Never force-push or rewrite published history without explicit owner authorization for the exact ref.

Never use destructive history operations to repair ordinary coordination mistakes.

Prefer additive corrective commits.

## Branch deletion

Never delete another agent's branch without explicit ownership and recovery verification.

A branch may contain the only recoverable form of important work.

## Worktree lifecycle

Before removal:

```powershell
git worktree list
git status --short
```

Verify the exact workspace and branch.

After removal:

```powershell
git worktree list
```

Verify expected residue is gone.

Do not immediately destroy a workspace after an agent reports success; preserve enough state for recovery until integration is verified.

## Stale refs

Ordinary branch listings are not sufficient.

When Git state behaves unexpectedly, inspect:

```powershell
git show-ref
git for-each-ref
git worktree list
git remote -v
```

Unexpected tracking refs or worktree metadata can cause tools to inherit state that is invisible in a simple branch listing.

## Apparent deletions

Never infer deletion from absence alone.

Before declaring that a commit deleted files, inspect:

- parents;
- merge base;
- exact commit diff;
- tree state;
- resulting merge tree;
- whether the file existed in that ancestry.

Distinguish explicit deletion from branch divergence.

## Unexpected Git state

Stop before repairing.

Capture:

```
current branch
HEAD
status
worktrees
refs
recent commits
remote refs
```

Classify the situation as:

- expected divergence;
- stale state;
- concurrent work;
- wrong base;
- wrong workspace;
- unexpected deletion;
- unexpected merge;
- corruption.

Then correct deliberately.

## Integration-line protection

Before changing `team/omega-endstate`:

1. resolve its exact current SHA;
2. verify no active work is being overwritten;
3. inspect the intended change;
4. integrate minimally;
5. verify the resulting tree;
6. record the resulting SHA.

Never force the integration line into a desired state.

## Project bootstrap invariant

The first local Steward should normally be launched from an isolated workspace created by `Bootstrap-Steward.ps1`, on a branch such as `work/omega-endstate/STEW-01/bootstrap-team`, based from the exact current `team/omega-endstate` remote SHA.

The Steward must not operate day-to-day from the shared `team/omega-endstate` checkout.

## Final invariant

The Git system must make autonomous parallel development **recoverable**.

If the team has to choose between a slightly slower operation that preserves attribution/isolation and a faster ambiguous operation, preserve isolation and recoverability.


## Executable safety helpers

Use the tracked helpers rather than hand-assembling repetitive workspace operations:

- `../../../scripts/Bootstrap-Steward.ps1` — allocate the first Steward workspace;
- `../../../scripts/New-AgentWorkspace.ps1` — allocate an isolated worktree or clone for any agent;
- `../../../scripts/Verify-AgentWorkspace.ps1` — verify manifest, branch, base ancestry and workspace identity;
- `../../../scripts/PreIntegration.ps1` — inspect current team divergence and changed files before integration;
- `../../../scripts/Retire-AgentWorkspace.ps1` — safely retire a completed worktree without implicitly deleting the branch.

The allocator uses a machine-local registry lock so concurrent agent allocation cannot silently overwrite registry state. It refuses existing agent branches/workspaces instead of reusing them.

The scripts are helpers, not authority replacements: the local Steward remains responsible for semantic ownership, task assignment and integration decisions.
