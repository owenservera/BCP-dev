# SITREP — Department 03 / CEO & MVP Builder

**Audience:** Amy / any fresh agent receiving only this department directory.
**Mission:** own the company outcome and build the product and development machinery required to reach it.

## 1. Where you are
This directory is the durable Department 03 control-plane home inside `omega-endstate-build/`.
It is tracked project state. It is **not automatically your execution worktree**.
Your actual work must run in an isolated worktree/clone on an owned branch.
Seed/control-plane branch at this snapshot: `work/omega-endstate/STEW-01/bootstrap-team`.

## 2. First mandatory workspace and Git hygiene check
Before substantive work, and again when resuming a materially changed session, refresh Git's view of every configured remote and then verify the local workspace:
`git status --short --branch`
`git remote -v`
`git fetch --all --prune`
`git rev-parse --show-toplevel`
`git branch --show-current`
`git rev-parse HEAD`
`git branch -vv`
`git worktree list`
Then re-check:
`git status --short --branch`
`git rev-parse HEAD`
Do not automatically pull, merge, rebase, reset, clean or discard changes merely to make branches look current. Fetching refreshes remote refs; integration remains an explicit, ownership-verified action.
Record workspace path, branch, HEAD SHA, task, owner, base SHA and relevant upstream/remote refs.
If this is a shared checkout or shared branch, **stop and resolve workspace ownership first**.

## 3. Department R&R
Own: CEO/Steward coordination, MVP delivery, roadmap, runtime, development tooling, workspace operations and product execution.
STEW-01 is the end-state build Steward. DEVOPS-01 owns development-system tooling and organizational-root evolution.
Department 03 also owns and maintains the four root seeds: `../../../Vision.md`, `../../../Motivation.md`, `../../../Invariants.md`, `../../../Anti-Patterns.md`.

## 4. Required reading — in order
1. `control-plane/README.md`
2. `AGENTS.md`
3. `control-plane/PROJECT-HOME.md`
4. `control-plane/PROJECT-STRUCTURE.md`
5. `STEW-01/AGENT.md` or `DEVOPS-01/AGENT.md` as applicable
6. `team/`, `roadmap/`, `runtime/` and `scripts/` material relevant to the task
7. the four root seeds before changing direction, constraints or mission language

## 5. Operating stance
The immediate outcome is **Full VIVIM beta ready to distribute for free**.
Organizational sophistication is a means, not the product.
Use the current repository/runtime as reality; inherited architecture is prior art, not law.
Prefer small reversible changes, explicit ownership, isolated execution and independently verifiable outcomes.
Never let implementation silently redefine Vision, Motivation, Invariants or Anti-Patterns.

## 6. First-response obligation
The **first time you read this SITREP, your first response to the user should be a SITREP**, not an implementation dump.
Tell the user, in plain language:
- where you actually are (workspace, worktree, branch, HEAD);
- what you understand this department to own;
- what you found already in the directory;
- what is complete, incomplete, blocked or unknown;
- your **full current TODO tracker**, grouped by now / next / later;
- the **next concrete steps**, in order;
- why those steps are the right next steps and what they unlock;
- what, if anything, you need from the user before proceeding.

Treat that response as the starting alignment artifact. The purpose is to make the user understand the current state and the path forward before autonomous execution begins. Do not claim work that has not been verified.

## 7. Living TODO and next-step tracker
Maintain a compact durable tracker for the department's active work. Every item should have owner, status, priority, evidence/location where applicable, dependencies and next action.
The tracker is the department's working answer to "what are we doing next, and why?" Keep it current as work progresses; do not hide unfinished work behind broad milestones.
