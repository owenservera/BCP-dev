# Local OpenCode Master Upgrade Prompt — M0/M1
## Dual-Speed Agent System
## 2026-09-28

### Mission

Implement the first operational slice of the ratified dual-speed model.

Do NOT redesign the agent system.
Do NOT create another architecture layer.
Do NOT activate A2A, MCP, the presence daemon, or broader autonomy.
Do NOT modify Ω law.
Do NOT mass-delete existing CFA homes.

The target is to make execution work measurably different while preserving deliberate mode.

## 0. Baseline discipline

Start from the latest `main`.

Verify:
- clean worktree;
- actual HEAD SHA;
- OpenCode version;
- Bun/Node/Git versions;
- current .opencode agent inventory;
- current FULL-INTEGRATION-TASK-LIST.md;
- current Steward state/tasks;
- current Session Result Contract;
- current Durable Completion Gate.

Then read:
- `docs/agent-system/DUAL-SPEED-RATIFICATION-2026-09-28.md`
- `docs/agent-system/MASTER-AGENT-SYSTEM-UPGRADE-2026-09-28.md`
- `docs/agent-system/MASTER-COMMUNICATION-SYSTEM-DESIGN-2026-09-28.md`
- `docs/agent-system/DELEGATION-AND-CAPABILITY-ENFORCEMENT-2026-09-28.md`
- `docs/agent-system/IMPLEMENTATION-MATRIX-CHATGPT-VS-LOCAL-2026-09-28.md`

Treat repository evidence as authoritative over this prompt when they conflict.

## 1. Preserve the two-speed model

### DELIBERATE
Keep the existing rich Steward + multi-CFA + worker + Commons process.

Use it for architectural decisions, cross-domain analysis, ontology, authority, governance, boundary design, difficult refactors, and falsification.

### EXECUTION
Add/enable the fast path for already-governed work:
- one active execution CFA;
- compact context;
- bounded work envelope;
- on-call specialist consultation;
- mechanical completion;
- code/test/commit evidence.

Material architectural surprises must return the task to DELIBERATE rather than being silently redesigned in EXECUTION.

## 2. M0 — classify work mode

Introduce the smallest viable durable representation for:
- DELIBERATE
- EXECUTION

Prefer extending an existing work/task/receipt representation over introducing another task database.

The classification must be observable in the receipt.

Do not require old deliberate receipts to be rewritten.

## 3. M1 — execution completion contract

Extend the existing Session Result Contract rather than creating a competing receipt system.

The existing canonical fields remain authoritative.

Add only the minimum fields needed to distinguish execution proof and verify it, such as:
- MODE
- WORK_ID
- REQUESTED_AGENT
- RESOLVED_AGENT
- ALLOWED_PATHS
- ACTUAL_CHANGED_PATHS
- REQUIRED_TESTS
- TEST_RESULTS
- ENFORCEMENT_LEVEL

Do not duplicate fields already canonical elsewhere.

Use JSON Schema or the repository's existing machine-validation convention.

## 4. Completion semantics

Preserve:
- IMPLEMENTED
- FALSIFIED
- INVESTIGATED
- BLOCKED
- SUPERSEDED
- PARKED

For EXECUTION:
- IMPLEMENTED requires implementation evidence;
- commit/ref must be exact;
- changed paths must be within the envelope;
- required tests must have recorded results;
- final delivery ref must contain the receipt and state update.

For DELIBERATE:
- INVESTIGATED and FALSIFIED are legitimate terminal outcomes;
- lack of code is not automatically a failure.

Do not redefine architectural truth through the receipt system.

## 5. Automatic completion gate

Create or extend a deterministic validation command/test that can answer:

1. Is the receipt structurally valid?
2. Does requested_agent equal resolved_agent?
3. Is the source SHA valid?
4. Does the referenced commit exist?
5. Do actual changed paths stay inside allowed paths?
6. Are required tests present and successful?
7. Is the required STATE update present/current?
8. Does the final delivery ref contain the receipt?
9. Does the claimed completion class match the evidence?

A failure must be explicit.

Do not silently downgrade failures to warnings.

## 6. Exact-agent safety

The existing P2.1 finding is important:
requested `--agent` may silently fall back to the default agent.

Turn this into a tested invariant.

Required behavior:
- exact requested agent -> execute;
- unresolved or silently substituted agent -> hard failure.

If the installed OpenCode version makes this impossible to enforce mechanically, record that limitation explicitly as a runtime-enforcement gap and provide the strongest available guard. Do not describe prompt-only checking as equivalent to enforcement.

## 7. One real execution corridor

After M1 is implemented, pick ONE small non-Ω implementation task already justified by repository evidence.

The corridor must have:
- one active CFA;
- exact allowed paths;
- exact tests;
- one writer;
- receipt;
- STATE update;
- commit;
- final re-read from main.

Do not start with a major Commons redesign.

The purpose is to prove the operating model, not to maximize feature output.

## 8. Deliberate mode remains first-class

Do not compact or delete the rich CFA corpus as part of this slice.

Do not replace the Steward deliberation process.

Do not interpret "shipping-first" as "code-only."

The distinction is:
- deliberate work may complete in evidence/design space;
- execution work claiming IMPLEMENTED must ship code and proof.

## 9. Measurements

Collect at least:
- MODE;
- cold-start context/prompt size estimate;
- task start timestamp;
- verified-commit timestamp;
- number of agent launches;
- number of manual continuation interventions;
- implementation result class.

Do not rank agents. These are system measurements.

## 10. Stop conditions

Stop and return to deliberation if:
- authority is ambiguous;
- Ω law would need changing;
- a boundary would need activation;
- another ontology/store/task manager is proposed;
- a core architectural assumption is contradicted;
- exact-agent identity cannot be proven;
- a worker capability exceeds the envelope;
- the implementation corridor becomes cross-domain enough to require architectural review.

## 11. Required result

At the end, produce:
- exact files changed;
- exact tests/commands;
- source SHA;
- final commit SHA;
- MODE;
- requested/resolved agent;
- enforcement level;
- changed-path check;
- receipt path;
- STATE path;
- measured execution data;
- unresolved gaps;
- explicit next action.

Then re-read the current delivery ref and verify the receipt and STATE are actually present there.

If that final verification cannot be completed, classify the result PARTIAL / BLOCKED / REPORTED-UNVERIFIED, never COMPLETE.

## Success condition

This slice succeeds when a fresh, already-governed execution task can move through the local system without requiring a 20–30 KB bespoke launch prompt or repeated manual "Next" intervention, while the deliberate model remains intact and available.

The goal is not to make the system smaller for its own sake.

The goal is to make it **dual-speed**:
- deep when the problem is deep;
- fast when the decision is already made;
- explicit when work must return to deliberation.
