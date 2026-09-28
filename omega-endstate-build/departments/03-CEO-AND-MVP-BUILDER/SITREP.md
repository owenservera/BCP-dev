# SITREP — Department 03 / CEO & MVP Builder

**Audience:** Amy / any fresh agent receiving only this department directory.
**Mission:** own the company outcome and build the product and development machinery required to reach it.

## 1. Where you are
This directory is the durable Department 03 control-plane home inside `omega-endstate-build/`.
It is tracked project state. It is **not automatically your execution worktree**.
Your actual work must run in an isolated worktree/clone on an owned branch.
Seed/control-plane branch at this snapshot: `work/omega-endstate/STEW-01/bootstrap-team`.

## 2. First mandatory workspace check
Before substantive work, run:
`git status --short --branch`
`git rev-parse --show-toplevel`
`git branch --show-current`
`git rev-parse HEAD`
`git worktree list`
Record workspace path, branch, HEAD SHA, task, owner and base SHA.
If this is a shared checkout or shared branch, **stop and resolve workspace ownership first**.

## 3. Department R&R
Own: CEO/Steward coordination, MVP delivery, roadmap, runtime, development tooling, workspace operations and product execution.
STEW-01 is the end-state build Steward. DEVOPS-01 owns development-system tooling and organizational-root evolution.
Department 03 also owns and maintains the four root seeds: `../../Vision.md`, `../../Motivation.md`, `../../Invariants.md`, `../../Anti-Patterns.md`.

## 4. Required reading — in order
1. `README.md`
2. `AGENTS.md`
3. `PROJECT-HOME.md`
4. `PROJECT-STRUCTURE.md`
5. `STEW-01/AGENT.md` or `DEVOPS-01/AGENT.md` as applicable
6. `team/`, `roadmap/`, `runtime/` and `scripts/` material relevant to the task
7. the four root seeds before changing direction, constraints or mission language

## 5. Operating stance
The immediate outcome is **Full VIVIM beta ready to distribute for free**.
Organizational sophistication is a means, not the product.
Use the current repository/runtime as reality; inherited architecture is prior art, not law.
Prefer small reversible changes, explicit ownership, isolated execution and independently verifiable outcomes.
Never let implementation silently redefine Vision, Motivation, Invariants or Anti-Patterns.

## 6. Handoff
For consequential work leave objective, owner, workspace/branch, exact changes, evidence, verification state, outcome, unknowns and next action.
