# Master Agent-System Upgrade — Final Target Design
## 2026-09-28

**Status:** RATIFIED PROPOSED ARCHITECTURE — dual-speed operating model  
**Baseline reviewed:** `e181820502f1a5ea572ed51b98cebd3af0b9c5ae`  
**Scope:** agentic operating system, execution, communication, documentation, completion, observability  
**Explicitly out of scope:** Ω law redesign, product implementation, A2A activation, MCP activation, persistent daemon activation, new authority store, new ontology.

## 1. Executive decision

The corpus review identified a missing dimension: the system needs to preserve deliberate architectural work while gaining a much faster local execution mode.

The ratified target is therefore a **dual-speed agentic operating system**:

### Slow lane — Deliberation
For architecture, ontology, authority, governance, boundary design, cross-domain research, difficult refactors, and decisions where premature implementation is costly.

This lane keeps the rich Steward + CFA + worker + Commons model.

### Fast lane — Execution
For implementing an already-governed decision.

This lane uses one active execution CFA, compact context, generated work envelopes, bounded workers, mechanical completion gates, automatic verification, and minimal coordination overhead.

The two lanes are not competing architectures. They are two operating modes of the same system.

## 2. Mode transition

The canonical transition is:

```
DELIBERATION
   ↓
DESIGN DECISION
   ↓
EXECUTION BRIEF
   ↓
IMPLEMENTATION
   ↓
VERIFIED RESULT
   ↓
architectural surprise?
   ├─ no → continue execution
   └─ yes → return to DELIBERATION
```

An executor must not silently redesign a constitutional decision. When implementation discovers a material architectural conflict, it returns the issue to deliberation.

## 3. Target topology

```
                           OWNER
                             │
                             ▼
                       COORD-01 / ChatGPT
                             │
                 ┌───────────┴───────────┐
                 │                       │
           DELIBERATE MODE         EXECUTION MODE
                 │                       │
        rich Steward + CFAs          Steward
        + workers + Commons             │
                 │                  active CFA
                 │                       │
                 └────────────┬──────────┘
                              ▼
                        CODE / EVIDENCE
                              │
                              ▼
                             MAIN
```

### Roles

**COORD-01 / ChatGPT**
- architectural research;
- independent audit;
- design briefs;
- falsifier design;
- cross-domain synthesis;
- review of local receipts;
- repository documentation and bounded edits where tooling permits;
- no claim of local-runtime proof without local execution.

**Architecture Steward**
- owns coordination within the selected mode;
- in deliberation, convenes and reconciles domain reasoning;
- in execution, compiles the bounded work envelope, selects the execution CFA, and enforces completion;
- is not a second product authority.

**Active execution CFA**
- owns one bounded implementation corridor;
- edits code/config/tests;
- delegates workers;
- produces machine-valid completion evidence.

**On-call CFA**
- preserves domain expertise and constitutional memory;
- participates when its domain is implicated;
- can review, constrain, challenge, or falsify;
- does not need to continuously generate work.

**Leaf worker**
- disposable bounded capability;
- scout/research/draft/verify/run;
- no authority and no persistent task ownership.

## 4. Ten CFAs remain

The ten CFA architecture is retained as the **domain coverage map and deliberative specialist system**.

We are not deleting CFAs.

During deliberate work, multiple CFAs can be actively engaged.

During execution work, normally one CFA owns the corridor and the remaining CFAs become on-call unless the work explicitly requires a multi-CFA deliberation.

This is a role-mode distinction, not a loss of domain authority.

## 5. Completion semantics

Receipts use explicit completion classes:

- **IMPLEMENTED** — actual code/config/test delta plus verification and commit SHA.
- **FALSIFIED** — concrete hypothesis tested and disproven with evidence.
- **INVESTIGATED** — bounded research complete; no implementation claimed.
- **BLOCKED** — execution cannot proceed for explicit external/authority reason.
- **SUPERSEDED** — replaced by governed work.
- **PARKED** — intentionally deferred.

Deliberative completion and implementation completion are distinct.

A deliberation may legitimately finish without code. An implementation may not be called IMPLEMENTED without implementation evidence.

## 6. One work item, one corridor

Every execution item has:

```
work_id
objective
execution_cfa
allowed_paths
prohibited_paths
prerequisites
authority boundary
required tests/evidence
completion contract
canonical references
```

The envelope is the execution contract, not another architecture document.

## 7. Context architecture

The rich CFA homes remain valuable for slow deliberation and historical continuity.

The **execution context** is intentionally smaller:

```
CFA CHARTER
+
CURRENT STATE
+
WORK ENVELOPE
+
RELEVANT REFERENCES
```

The long homes are not mass-deleted.

The eventual canonical compact target remains:

1. **CHARTER.md** — identity, mission, authority, boundaries, consultation triggers.
2. **STATE.md** — current truth, active work, blockers, next action, last verified revision.
3. **LESSONS.md** — durable mistakes and discoveries.

Existing additional files are harvested and retired only after their information is safely represented elsewhere.

## 8. Prompt architecture

The rich constitutional prompts remain available for deliberate mode.

For execution mode, repeated 19–37 KB launch prompts are replaced by:

```
AGENT-PROTOCOL
+
CFA CHARTER
+
generated WORK ENVELOPE
```

Routine execution envelopes target approximately 1–2 KB and reference canonical material instead of copying it.

Thus we preserve the intellectual constitution while eliminating unnecessary execution context.

## 9. Mechanical enforcement

Required:
- exact requested-agent resolution or hard failure;
- CFA-to-worker allowlist;
- depth cap;
- resource/path/command bounds wherever the runtime supports them;
- receipt schema validation;
- changed-path verification;
- required-test verification;
- STATE freshness;
- no silent capability inflation.

Prompt text explains constraints. Runtime permissions and validators enforce them.

## 10. Commons

Commons remains the communication substrate for both modes.

In deliberation, it supports rich questions, objections, evidence, hypotheses, handoffs and synthesis.

In execution, normal traffic should be compact: REQUEST, STATUS, BLOCKED, HANDOFF, RESULT and relevant evidence references.

Commons is not a scheduler, ontology, authority store, task manager or product provenance authority.

It receives a promotion gate covering identity/recovery, signatures, stream continuity, duplicate delivery, concurrent append, causal replay, concurrent handoff claims, visible transport failures, rebuildable views, and privacy boundaries.

If the owner-defined acceptance deadline is reached without green proof, fallback is simple per-agent inbox artifacts plus Git until Commons is repaired.

## 11. Communication semantics

The protocol remains:

```
MESSAGE != TRUTH
CONVERSATION != CANON
ASSERTION != AUTHORITY
SIGNATURE != TRUTH
ACKNOWLEDGEMENT != AGREEMENT
```

Event IDs are identifiers, not causal order.

Concurrent events remain concurrent until explicit protocol semantics resolve them.

Handoff acceptance requires explicit claim resolution.

Invalid peer state must be visible as INVALID or UNAVAILABLE, not silently represented as EMPTY.

## 12. Metrics

Measure:
- deliberative sessions versus execution sessions;
- code-changing sessions / execution sessions;
- implementation completion rate;
- docs-only and investigation rate;
- task-to-verified-commit time;
- cold-start context cost by mode;
- receipt validation failures;
- wrong-agent attempts;
- blocked-work age;
- worker containment failures;
- Commons acceptance rate;
- current STATE coverage.

Metrics diagnose system behavior; they do not rank people or CFAs.

## 13. Operating loops

### Deliberation loop

```
OWNER QUESTION
  ↓
COORD-01 / STEWARD
  ↓
MULTI-CFA RESEARCH
  ↓
EVIDENCE / OBJECTIONS / FALSIFIERS
  ↓
DESIGN DECISION
  ↓
EXECUTION BRIEF
```

### Execution loop

```
EXECUTION BRIEF
  ↓
CURRENT MAIN VERIFICATION
  ↓
ONE BOUNDED CORRIDOR
  ↓
SHORT GENERATED ENVELOPE
  ↓
ACTIVE CFA
  ↓
OPTIONAL ON-CALL CONSULTATION
  ↓
CODE / TEST / FALSIFIER
  ↓
MACHINE-VALIDATED RECEIPT
  ↓
STATE UPDATE
  ↓
COMMIT
  ↓
RE-READ MAIN
```

The manual "Next" choreography is acceptable in deliberate mode. Routine execution should not depend on it.

## 14. Migration order

**M0 — Mode split.** Record and implement explicit DELIBERATE versus EXECUTION work classification.

**M1 — Completion contract.** Receipt schema, validator, code-change gate.

**M2 — Envelope generation.** Canonical protocol + generator; migrate one execution corridor.

**M3 — Execution containment.** Exact-agent fail-closed behavior and worker resource bounds.

**M4 — Context reduction.** Establish compact execution context and begin safe harvest/retirement of redundant standing artifacts.

**M5 — Commons hardening.** Causal fold, handoff claims, visible transport failures, stream binding.

**M6 — Metrics.** Measure both modes separately.

**M7 — Real proof.** Complete one real execution corridor end-to-end.

**M8 — Commons promotion/fallback.**

**M9 — Only then consider A2A, MCP, presence daemon, or broader autonomy.**

## 15. Definition of final

The final system can deliberately think deeply when the problem warrants it, execute quickly when the design is already settled, return architectural surprises from execution to deliberation, preserve the ten-domain CFA model, mechanically enforce execution boundaries, produce machine-valid evidence, keep main as durable memory, and keep communication subordinate to execution and authority.

> **Slow when thinking matters. Fast when the decision is already made. Never confuse the two.**
