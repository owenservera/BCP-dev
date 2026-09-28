# Master Agent-System Upgrade — Final Target Design
## 2026-09-28

Status: PROPOSED implementation blueprint.
Baseline reviewed: e181820502f1a5ea572ed51b98cebd3af0b9c5ae.

## Executive decision

The corpus review identifies a failure mode that must be treated as first-class: the system has become better at describing an autonomous organization than at producing verified code changes.

The final design therefore has two coupled planes:
1. Execution: local OpenCode ships bounded work.
2. Governance and communication: Steward, CFAs and Commons coordinate without becoming bureaucracy.

Target: one executor, bounded specialist consultation, mechanically enforced completion, durable evidence, minimal cold-start context, and communication that survives concurrency.

## Target topology

Owner -> COORD-01/ChatGPT -> durable design briefs -> local OpenCode -> Architecture Steward -> active execution CFA -> leaf workers -> repository -> main.
On-call CFAs sit beside the execution corridor and are consulted when their domain is implicated.

COORD-01 / ChatGPT: research, architecture, audit, falsifiers, cross-domain synthesis, documentation, bounded repository edits where tooling permits. It must never claim local runtime proof it did not execute.
Architecture Steward: local execution coordinator; compiles short envelopes, selects the responsible CFA, enforces completion, reconciles receipts.
Active CFA: owns one bounded implementation corridor.
On-call CFA: compact domain charter, consulted only when needed.
Leaf worker: disposable bounded capability with no authority or persistent ownership.

## Code is the completion unit

Receipt classes are IMPLEMENTED, FALSIFIED, INVESTIGATED, BLOCKED, SUPERSEDED, and PARKED.
IMPLEMENTED requires an actual code/config/test delta, verification evidence, and a commit SHA.
INVESTIGATED is valid for bounded research and explicitly does not claim implementation.
Docs-only work must never silently become IMPLEMENTED.

Every implementation work item identifies work_id, owner, execution CFA, source revision, allowed paths, prohibited paths, tests/commands, required evidence, and completion class.

## One work item, one corridor

Each active work item receives a bounded envelope. The envelope is the execution contract, not a second architecture document.
It contains identity, work_id, objective, exact scope, prerequisites, authority boundary, expected evidence, completion contract, and canonical references.

## Context architecture

Active CFA homes converge toward three durable files:
1. CHARTER.md — identity, mission, authority, boundaries, consultation triggers.
2. STATE.md — current truth, active work, blockers, next action, last verified revision.
3. LESSONS.md — durable mistakes and reusable discoveries.

Do not mass-delete existing homes immediately. First establish the compact target, preserve information, then harvest and retire redundant artifacts.

Canonical truth hierarchy: implementation and git history; executable tests/evidence; current compact state; machine-validated receipts; Commons communication; historical narrative.

## Prompt architecture

Replace 19–37 KB repeated launch prompts with one canonical AGENT-PROTOCOL plus role charters plus a generated task envelope.
Routine envelopes should target roughly 1–2 KB and contain links rather than copied documentation.
The Steward remains responsible for task semantics and authority selection; generation becomes mechanical.

## Mechanical enforcement

Required: exact requested-agent resolution or hard failure; CFA-to-worker allowlist; depth cap; resource/path/command bounds where OpenCode supports them; receipt schema validation; changed-path verification; required-test verification; STATE freshness; no silent capability inflation.

Prompt text explains constraints. Runtime permissions and validators enforce them.

## Commons

Commons is retained for now. It is not allowed to become a second scheduler, ontology, authority store, task manager, or provenance authority.
It receives a promotion gate: identity/recovery, signatures, stream continuity, duplicate idempotency, concurrent append, causal replay, concurrent handoff claims, visible transport failures, rebuildable views, and privacy boundaries.
If the owner-defined deadline is reached without green acceptance, use simple per-agent inbox artifacts plus Git as fallback until Commons is repaired. Do not silently delete the subsystem.

## Communication semantics

Message is not truth. Conversation is not canon. Assertion is not authority. Signature is not truth. Acknowledgement is not agreement.
Event IDs are identifiers, not causal order. Concurrent events remain concurrent until protocol semantics resolve them.
Handoff acceptance needs explicit claim resolution. Invalid peer state must be visible as INVALID or UNAVAILABLE, never folded into EMPTY.

## Metrics

Measure code-changing sessions/total, implementation completion rate, docs-only rate, task-to-verified-commit time, cold-start context cost, receipt failures, wrong-agent attempts, blocked-work age, worker containment failures, Commons acceptance rate, and active-work STATE freshness.

## Operating loop

OWNER GOAL -> CURRENT MAIN VERIFICATION -> ONE BOUNDED CORRIDOR -> SHORT ENVELOPE -> EXECUTOR -> SPECIALIST CONSULTATION -> CODE/TEST/FALSIFIER -> MACHINE-VALIDATED RECEIPT -> STATE UPDATE -> COMMIT -> RE-READ MAIN -> NEXT CORRIDOR.

## Migration order

M0 Freeze breadth: stop new architecture-document creation unless it closes an acceptance gap.
M1 Completion contract: receipt schema, validator, code-change gate.
M2 Envelope generation: canonical protocol and generator; migrate one corridor.
M3 Execution containment: exact-agent fail-closed behavior and worker resource bounds.
M4 Home simplification: CHARTER/STATE/LESSONS with historical/generated retirement.
M5 Commons hardening: causal fold, handoff claims, visible transport failures, stream binding.
M6 Metrics.
M7 One real end-to-end implementation corridor.
M8 Commons promotion or fallback decision.
M9 Only then consider A2A, MCP, presence daemon, or broader autonomy.

## Definition of final

A fresh owner goal can become a bounded envelope without manual prompt authoring; exact local agent resolution is fail-closed; a CFA completes real code corridors; specialist CFAs are on-call; implementation evidence is machine-valid; main is durable memory; Commons is either proven or explicitly in fallback; and measured execution demonstrates shipping rather than documentation growth.