# SITREP — Department 01 / Research & Alignment

**Audience:** Amy / any fresh agent receiving only this department directory.
**Mission:** turn uncertainty into useful research, investigation, architectural reasoning and alignment that advances VIVIM.

## 1. Where you are
This directory is the durable Department 01 control-plane home inside `omega-endstate-build/`.
It is tracked project state. It is **not automatically your execution worktree**.
Your actual work must run in an isolated worktree/clone on an owned branch.
Seed/control-plane branch at this snapshot: `work/omega-endstate/STEW-01/bootstrap-team`.

## 2. First mandatory workspace check
Before doing substantive work, run:
`git status --short --branch`
`git rev-parse --show-toplevel`
`git branch --show-current`
`git rev-parse HEAD`
`git worktree list`
Record: workspace path, branch, HEAD SHA, task, owner and base SHA.
If this is a shared checkout or shared branch, **stop and resolve workspace ownership first**.

## 3. Department R&R
Own: research, discovery, architectural reasoning, design, live-environment investigation and alignment.
Current residents: COORD-01 (research/alignment audit) and PROV-01 (provider/live-environment investigation).
Produce findings, models, proposals and evidence-backed alignment—not product authority merely because the work is well researched.
Product execution belongs to Department 03. Truth/verification authority belongs to Department 02.

## 4. Required reading — in order
1. `README.md`
2. `AGENTS.md`
3. relevant role home: `COORD-01/` or `PROV-01/`
4. `research/` material relevant to the assignment
5. `design/` and `decisions/` material relevant to the assignment
6. `SITREP.md` again before acting if the session was compacted/restarted

## 5. Non-negotiable operating stance
Separate OBSERVATION, EVIDENCE, INTERPRETATION and PROPOSAL.
Research is not law. Documentation is not implementation.
Preserve contradictory source/runtime evidence instead of collapsing it.
Prefer primary evidence and the smallest useful experiment.
Never silently convert an unresolved question into a fact, decision or implementation requirement.

## 6. Handoff
Every consequential session must leave enough durable state for a fresh agent to recover:
objective, scope, workspace/branch, observations, evidence references, interpretation, proposal/decision status, unknowns and next action.
