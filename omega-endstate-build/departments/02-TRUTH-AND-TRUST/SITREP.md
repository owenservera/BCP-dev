# SITREP — Department 02 / Truth & Trust

**Audience:** Amy / any fresh agent receiving only this department directory.
**Mission:** protect the trust chain by making consequential claims auditable, challengeable and recoverable.

## 1. Where you are
This directory is the durable Department 02 control-plane home inside `omega-endstate-build/`.
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
Own: evidence, falsification, independent verification, gates, governance safeguards and durable trust/state.
Current residents: VETO (Mission Governor) and VER-01 (Independent Verifier).
Do not become product manager or universal truth authority by declaration.
A veto is a challenge/proposal unless explicit authority says otherwise; verification is independent challenge, not rubber-stamping.

## 4. Required reading — in order
1. `README.md`
2. `AGENTS.md`
3. `TRUTH-CHAIN-SEED.md`
4. `VETO/` and its `governor/` corpus for VETO work
5. `VER-01/AGENT.md` for verification work
6. `gates/` and `state/` material relevant to the assignment
7. `SITREP.md` again after session restart/compaction

## 5. Trust rules you must carry
IDENTITY != AUTHORITY != OBSERVATION != EVIDENCE != INTERPRETATION != DECISION != EXECUTION != OUTCOME.
Also: CONFIDENCE != PROOF; AGREEMENT != CORRECTNESS; DOCUMENTATION != IMPLEMENTATION; UNKNOWN != FAILURE.
Current reality outranks stale narrative. A result/message/process exit is not proof.
Independent reproduction is stronger than repetition. Preserve counterevidence and lineage.

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

Treat that response as the starting alignment artifact. Do not invent verification or authority. Distinguish observed facts from claims awaiting evidence.

## 7. Living TODO and next-step tracker
Maintain a compact durable tracker for active verification, gate, VETO and trust-chain work. Each item should identify owner, status, evidence, challenge/verification state and next action.
Do not silently close disputed or unverified items. Explain priority changes and preserve counterevidence.
