# Master Agent-System Upgrade — Final Target Design
## 2026-09-28

**Status:** RATIFIED PROPOSED ARCHITECTURE — dual-speed, surface-independent operating model
**Baseline reviewed:** e181820502f1a5ea572ed51b98cebd3af0b9c5ae

## 1. Executive decision

The system needs two improvements at once:

1. preserve the rich deliberate architecture already built; and
2. make governed execution much faster and less dependent on hand-authored context.

The key correction is that **speed/mode and execution surface are independent dimensions**.

There are multiple work surfaces, including the local OpenCode environment and ChatGPT web applications. The owner may choose either surface for a deep session, a bounded implementation session, a research pass, an audit, or a transition between them.

MODE = DELIBERATE | EXECUTION
SURFACE = LOCAL | CHATGPT-WEBAPP | OTHER-GOVERNED-SURFACE

A surface does not inherently own a mode.

### Deliberate mode
For architecture, ontology, authority, governance, boundary design, cross-domain research, difficult refactors, falsification, or any question where reasoning quality and evidence gathering matter more than throughput.

### Execution mode
For implementing an already-governed decision with bounded scope, right-sized context, mechanical checks, and durable completion evidence.

The two modes are operating states of the same system, not two separate agent organizations.

## 2. Mode transition

DELIBERATION -> DESIGN DECISION -> EXECUTION BRIEF -> IMPLEMENTATION -> VERIFIED RESULT

If implementation discovers a material architectural surprise, authority conflict, boundary conflict, or falsifying evidence, the work returns to DELIBERATION.

The transition may happen entirely locally, entirely through ChatGPT web sessions, or across surfaces.

For example, the owner may deliberate deeply with local OpenCode, transfer durable state to ChatGPT for independent challenge, return locally for implementation, and then use ChatGPT for audit. The repository is the continuity bridge.

## 3. Surface roles

### Local OpenCode
Local OpenCode is capable of both DELIBERATE and EXECUTION work.

It can perform deep architectural reasoning, read the full local corpus and runtime, coordinate multiple CFA sessions, run local experiments, implement code, test it, and produce machine evidence.

It is the authoritative proof surface for claims that intrinsically depend on the actual local runtime, but it is not restricted to implementation.

### ChatGPT web applications
ChatGPT web sessions are also capable of both DELIBERATE and EXECUTION work where repository tooling permits.

They are useful for deep reasoning, research, cross-CFA synthesis, adversarial review, falsifier design, bounded repository changes, and independent audit of local results.

A ChatGPT session must not claim local-runtime proof it did not obtain.

It is not restricted to design.

### General rule
The owner may switch surfaces without changing the work semantics.

A surface switch is a continuity operation, not a role change.

## 4. Target topology

OWNER -> CHATGPT WEBAPP and/or LOCAL OPENCODE -> SHARED MAIN -> AGENT SYSTEM

The same ten CFA domains, worker tier, Steward, Commons and durable repository can participate in either mode.

DELIBERATE normally engages rich Steward + multiple CFAs + specialists + evidence.
EXECUTION normally engages Steward + one active CFA + bounded workers, with specialist consultation when needed.

## 5. Ten CFAs remain

The ten CFA architecture is retained.

In DELIBERATE mode, multiple CFAs may be deeply active.

In EXECUTION mode, one CFA normally owns the implementation corridor, while other CFAs remain available for consultation. An execution task may deliberately pause and invoke multi-CFA reasoning when the work becomes architecturally uncertain.

Active-CFA narrowing is an execution optimization, not a permanent restriction on local or web sessions.

## 6. Completion semantics

Receipts use explicit completion classes:

- IMPLEMENTED — actual code/config/test delta plus verification and commit SHA.
- FALSIFIED — concrete hypothesis tested and disproven with evidence.
- INVESTIGATED — bounded research complete; no implementation claimed.
- BLOCKED — execution cannot proceed for explicit external or authority reason.
- SUPERSEDED — replaced by governed work.
- PARKED — intentionally deferred.

Deliberative work may legitimately complete as INVESTIGATED or FALSIFIED.
Execution work claiming IMPLEMENTED requires implementation evidence.

## 7. One work item, flexible depth

Every work item should identify:

work_id
mode
surface
objective
owner/agent
allowed paths when applicable
prohibited paths when applicable
prerequisites
authority boundary
required tests/evidence
completion contract
canonical references

The work envelope is the execution contract when the work is EXECUTION.

Deep work does not have to be forced into a tiny envelope. A deliberate task can intentionally use a large, rich context package when the reasoning problem warrants it.

The optimization target is right-sized context, not minimal context at all costs.

## 8. Context architecture

Rich CFA homes remain valuable as constitutional, historical and domain memory.

Execution contexts should normally be compact:
CFA CHARTER + CURRENT STATE + WORK ENVELOPE + RELEVANT REFERENCES

Deliberate sessions may additionally load historical receipts, peer-CFA research, competing hypotheses, broader architecture documents, evidence packs and prior objections.

There is no rule that large prompt equals bad. The rule is that copied boilerplate should not be mistaken for useful reasoning context.

## 9. Prompt architecture

Preserve rich constitutional prompts for deep work.

Add a canonical reusable protocol plus generated work envelopes for routine execution.

Do not destroy long prompts merely to reduce token count.

Instead separate constitutional context, task-specific context, and execution envelope when applicable.

A routine envelope may be 1–2 KB. A genuinely complex task may require more context.

## 10. Mechanical enforcement

Required where the runtime can enforce it:
- exact requested-agent resolution or hard failure;
- CFA-to-worker allowlist;
- depth cap;
- resource/path/command bounds;
- receipt schema validation;
- changed-path verification;
- required-test verification;
- STATE freshness;
- no silent capability inflation.

These controls apply primarily to EXECUTION.

DELIBERATE work still has identity, authority, provenance and completion controls, but should not inherit unnecessary execution constraints.

## 11. Commons

Commons remains the communication substrate for both modes and across surfaces.

In DELIBERATE mode it supports rich questions, objections, evidence, hypotheses, handoffs and synthesis.

In EXECUTION mode routine messages should be compact: REQUEST, STATUS, BLOCKED, HANDOFF, RESULT and evidence references.

Commons is not a scheduler, ontology, authority store, task manager or product provenance authority.

Promotion still requires proof of identity/recovery, signatures, stream continuity, duplicate delivery, concurrent append, causal replay, concurrent handoff claims, visible transport failures, rebuildable views and privacy boundaries.

## 12. Communication semantics

MESSAGE != TRUTH
CONVERSATION != CANON
ASSERTION != AUTHORITY
SIGNATURE != TRUTH
ACKNOWLEDGEMENT != AGREEMENT

Event IDs are identifiers, not causal order.
Concurrent events remain concurrent until explicit protocol semantics resolve them.

Surface continuity should preserve, where applicable:
goal_id, work_id, mode, surface, session_id, attempt_id, handoff_id.

A surface switch must not silently fork authority or create a competing task.

## 13. Metrics

Measure the system by mode and surface, for example:
- DELIBERATE versus EXECUTION sessions;
- local versus ChatGPT-web sessions;
- code-changing execution sessions;
- implementation completion rate;
- investigation/falsification rate;
- task-to-verified-commit time;
- context size by mode;
- surface-switch count;
- manual continuation interventions;
- receipt failures;
- wrong-agent attempts;
- blocked-work age;
- worker containment failures;
- Commons acceptance rate;
- STATE freshness.

Metrics diagnose workflow behavior; they do not rank people, agents or CFAs.

## 14. Operating loops

### Deliberation
QUESTION -> SELECT SURFACE(S) -> RICH RESEARCH / MULTI-CFA REASONING -> EVIDENCE / OBJECTIONS / FALSIFIERS -> DESIGN DECISION -> EXECUTION BRIEF when needed

### Execution
EXECUTION BRIEF -> SELECT SURFACE -> CURRENT MAIN VERIFICATION -> BOUNDED CORRIDOR -> RIGHT-SIZED CONTEXT -> ACTIVE CFA / OPTIONAL SPECIALIST CONSULTATION -> CODE / TEST / FALSIFIER -> MACHINE-VALIDATED RECEIPT -> STATE UPDATE -> COMMIT -> RE-READ DELIVERY REF

The owner may execute either loop locally, through ChatGPT-supported repository work, or across both surfaces.

## 15. Migration order

M0 — Mode/surface distinction without creating a second task system.

M1 — Completion contract: receipt schema, validator and code-change gate.

M2 — Envelope generation for routine execution.

M3 — Execution containment: exact-agent fail-closed behavior and worker resource bounds.

M4 — Context right-sizing while preserving rich deliberate context.

M5 — Commons hardening: causal fold, handoff claims, visible transport failures, stream binding.

M6 — Metrics by mode and surface.

M7 — Real end-to-end execution proof.

M8 — Commons promotion/fallback.

M9 — Only then consider A2A, MCP, presence daemon or broader autonomy.

## 16. Definition of final

The final system lets the owner move fluidly between local and ChatGPT surfaces without losing continuity, choose deep or fast work according to the problem, preserve the ten-domain deliberative architecture, accelerate routine execution with mechanical controls, and return implementation surprises to deep reasoning.

> **Deep when needed. Fast when ready. Surface-independent. Evidence stays durable.**
