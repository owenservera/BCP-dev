# Local Agent M0/M1 Upgrade Prompt — Surface-Independent Model
## 2026-09-28

### Mission

Implement the first operational slice of the ratified dual-speed model.

Do NOT redesign the agent system.
Do NOT create another architecture layer.
Do NOT activate A2A, MCP, the presence daemon, or broader autonomy.
Do NOT modify Ω law.
Do NOT mass-delete existing CFA homes.

The target is to make **routine governed execution** faster while preserving the ability to run **deep DELIBERATE sessions locally**.

## 0. Baseline discipline

Start from the latest main.

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

Then read the current dual-speed ratification, master upgrade, communication design, delegation/capability design, and implementation matrix.

Treat repository evidence as authoritative over this prompt when they conflict.

## 1. Preserve surface independence

Both LOCAL and CHATGPT-WEBAPP are capable of DELIBERATE and EXECUTION work.

Do not encode a fixed "local executor / ChatGPT thinker" architecture.

Local OpenCode may run deep multi-CFA reasoning. ChatGPT may perform bounded repository work where tooling permits.

The meaningful boundary is evidence capability: local-runtime claims require local-runtime evidence.

## 2. M0 — classify mode

Introduce the smallest viable durable representation for DELIBERATE and EXECUTION.

Prefer extending existing work/task/receipt representations over introducing another task database.

Preserve surface/session lineage as metadata, not as a new authority system.

Do not require old receipts to be rewritten.

## 3. M1 — execution completion contract

Extend the existing Session Result Contract rather than creating a competing receipt system.

The existing canonical fields remain authoritative.

Add only the minimum fields needed to distinguish execution proof and verify it, for example:
MODE
WORK_ID
SURFACE
REQUESTED_AGENT
RESOLVED_AGENT
ALLOWED_PATHS
ACTUAL_CHANGED_PATHS
REQUIRED_TESTS
TEST_RESULTS
ENFORCEMENT_LEVEL

Do not duplicate fields already canonical elsewhere.

## 4. Completion semantics

Preserve IMPLEMENTED, FALSIFIED, INVESTIGATED, BLOCKED, SUPERSEDED and PARKED.

For EXECUTION, IMPLEMENTED requires implementation evidence, exact commit/ref, changed-path containment, required test results, and final receipt/state verification.

For DELIBERATE, INVESTIGATED and FALSIFIED are legitimate terminal outcomes.

A deep local session is not required to produce code merely because it ran locally.

## 5. Automatic completion gate

Create or extend a deterministic validation command/test that can answer:

1. Is the receipt structurally valid?
2. Does requested_agent equal resolved_agent when an agent was explicitly requested?
3. Is the source SHA valid?
4. Does the referenced commit exist when implementation was claimed?
5. Do actual changed paths stay inside allowed paths when a path envelope applies?
6. Are required tests present and successful for IMPLEMENTED work?
7. Is the required STATE update present/current?
8. Does the final delivery ref contain the receipt?
9. Does the claimed completion class match the evidence?

A failure must be explicit. Do not silently downgrade failures to warnings.

## 6. Exact-agent safety

The existing P2.1 finding remains important: requested agent selection may silently fall back to the default agent.

Turn this into a tested invariant where the runtime permits it.

Required behavior:
- exact requested agent -> execute;
- unresolved or silently substituted agent -> hard failure.

If the installed OpenCode version makes this impossible to enforce mechanically, record that limitation explicitly as a runtime-enforcement gap. Do not describe prompt-only checking as equivalent to enforcement.

## 7. One real execution corridor

After M1, pick ONE small non-Ω implementation task already justified by repository evidence.

The corridor must have one active CFA, exact allowed paths, exact tests, one writer, receipt, STATE update, commit, and final re-read from main.

Do not start with a major Commons redesign.

The purpose is to prove the operating model, not maximize feature output.

## 8. Deep sessions remain first-class

Do not compact or delete the rich CFA corpus as part of this slice.

Do not replace the Steward deliberation process.

Do not interpret "shipping-first" as "code-only."

A deliberate task may be deep, local, multi-CFA, long-context and evidence-heavy.

The optimization is to make routine execution efficient, not to make all thinking shallow.

## 9. Surface switching

A task may move:
LOCAL DELIBERATE -> CHATGPT DELIBERATE -> LOCAL EXECUTION -> CHATGPT AUDIT
or follow another owner-selected path.

Preserve goal_id, work_id, mode, surface, source revision, current STATE, unresolved questions, evidence references, session identity and attempt identity.

Do not create a second authority chain when switching surfaces.

## 10. Measurements

Collect where practical:
- MODE;
- SURFACE;
- cold-start context size;
- task start timestamp;
- verified-commit timestamp when applicable;
- number of agent launches;
- number of manual continuation interventions;
- implementation result class.

Do not rank agents. These are system measurements.

## 11. Stop conditions

Return to DELIBERATE reasoning if authority is ambiguous, Ω law would need changing, a boundary would need activation, another ontology/store/task manager is proposed, a core architectural assumption is contradicted, exact-agent identity cannot be proven for a consequential execution step, a worker exceeds the envelope, or the task becomes cross-domain enough to require architectural review.

## 12. Required result

At the end, produce exact files changed, exact tests/commands, source SHA, final commit SHA, MODE, SURFACE, requested/resolved agent where applicable, enforcement level, changed-path check, receipt path, STATE path, measured execution data, unresolved gaps and explicit next action.

Then re-read the current delivery ref and verify the receipt and STATE are actually present there.

If that final verification cannot be completed, classify the result PARTIAL / BLOCKED / REPORTED-UNVERIFIED, never COMPLETE.

## Success condition

This slice succeeds when routine governed execution can become faster and more deterministic without taking away the owner's ability to run deep reasoning locally or in ChatGPT, switch surfaces, or return implementation surprises to deliberation.
