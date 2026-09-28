
# Ω End-State Agentic System — Promotion Gates

> Status: PROPOSED
> Governing mission: Full VIVIM beta ready to distribute for free.

## Purpose

These are promotion boundaries for the agentic development system. A gate asks whether there is enough evidence to move to the next capability layer.

A gate is not an implementation task, architecture approval, or proof of the eventual organization.

Keep separate:
- promised capability;
- implemented capability;
- tested capability;
- verified capability;
- useful capability;
- scalable capability.

Passing an earlier gate does not imply a later gate.

## Gate sequence

### GATE-01 — Cloned Agent-System Baseline Accepted

Question: Is the current local implementation a faithful, working, fully tested realization of what the cloned opencode-swarm repository actually promised?

This is the first gate.

It is deliberately limited to the inherited baseline contract. It does not require proof of new Omega capabilities.

See: gates/GATE-01-CLONED-BASELINE-ACCEPTANCE.md

### GATE-02 — Beta Workload Usefulness

Question: Does the accepted baseline materially help perform real VIVIM beta work with acceptable coordination cost?

Focus:
- useful work completed;
- time/rework saved;
- coordination overhead;
- human intervention;
- failure discovery;
- evidence quality.

A system may pass GATE-01 and fail GATE-02.

### GATE-03 — Governed Delegation

Question: Can the chosen topology delegate bounded work with reliable identity, scope, permissions and lineage?

Focus:
- caller/target binding;
- authority boundaries;
- worker/resident semantics;
- unauthorized delegation refusal;
- parent/child lineage;
- work-item binding;
- mechanical leafness where required.

The exact mechanism must be chosen from evidence; the current U1 design is not presumed to be the final answer.

### GATE-04 — Durable Recovery

Question: Can the system survive interruption, restart, partial failure and fresh-session recovery without losing the work graph or falsely reporting completion?

Focus:
- persistent state;
- recovery;
- resumability;
- idempotency;
- orphan handling;
- durable evidence;
- unknown versus completed.

### GATE-05 — Parallel and Scale Fitness

Question: Does the organization remain useful as safe parallel work increases without coordination cost, contention or ambiguity growing faster than useful work?

Focus:
- concurrency;
- isolation;
- resource admission;
- communication load;
- context pressure;
- duplicate work;
- transaction cost;
- bottlenecks.

No fixed agent count is required. Scale is discovered from workload.

### GATE-06 — Verification and Governance Fitness

Question: Can the system independently challenge consequential work and expose unsafe progression without becoming an unmeasured coordination sink?

Focus:
- independent challenge;
- evidence;
- review boundaries;
- VETO-01 advisory experiment;
- false-positive and false-negative learning;
- completion versus proof;
- release conditions;
- governance cost.

### GATE-07 — Controlled Self-Evolution

Question: Can the organization improve its own roles, prompts, tooling, context and topology using evidence while preserving lineage, rollback and mission alignment?

Focus:
- baseline/variant;
- evaluation;
- falsification;
- rollback;
- owner ratification;
- retirement;
- no silent self-mutation.

### GATE-08 — Self-Governing Organization

Question: Can the development organization safely operate, inspect and improve itself with progressively less human coordination while remaining recoverable, evidence-grounded and subordinate to the beta mission?

Focus:
- self-observation;
- self-definition;
- bounded self-change;
- governance-of-governance;
- independent challenge;
- authority earned by decision class;
- recoverability;
- mission preservation.

This is a long-horizon target, not a prerequisite to begin shipping beta work.

## Promotion rules

1. Do not mark a runtime-dependent gate PASS from documentation alone.
2. Every gate result must point to durable evidence.
3. A failed gate identifies what is not yet proven; it is not automatically a permanent rejection.
4. UNKNOWN is not PASS.
5. Do not skip a gate merely to avoid resolving an earlier evidence gap unless independence is explicitly demonstrated.
6. Keep every gate as narrow as possible while still proving its intended capability.
7. Beta delivery continues in parallel; governance and organizational research are enabling means, not a prerequisite program.
8. Gate definitions may evolve, but prior results must remain reconstructable and revisions must preserve lineage.
