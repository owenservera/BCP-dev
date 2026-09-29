# Ω Swarm Evolution Path

> Status: EVOLUTION ROADMAP
> Date: 2026-09-29

The swarm must evolve in controlled capability bands. Each band unlocks the next only after its acceptance evidence exists.

## E0 — Seed and Reality

**Goal:** establish the factual baseline.

Build:
- repository/worktree discovery;
- current OpenCode runtime inspection;
- opencode-swarm baseline;
- Windows execution proof;
- Commons connectivity;
- durable task/state conventions.

Exit:
- one real task runs end-to-end;
- execution identity and workspace are recoverable;
- evidence is stored durably.

## E1 — Reliable Single Resident

**Goal:** one long-lived specialist can own a bounded responsibility.

Build:
- resident identity;
- TASKS/STATE/LESSONS recovery;
- bounded role contract;
- context compilation;
- evidence-return contract;
- replacement/restart recovery.

Exit:
- resident can resume after interruption without losing work state.

## E2 — Governed Delegation

**Goal:** a resident can safely create bounded workers.

Build:
- capability catalog;
- worker admission;
- isolated workspace allocation;
- task envelopes;
- worker lifecycle;
- result/evidence ingestion.

Exit:
- one resident delegates multiple independent jobs without shared-checkout corruption.

## E3 — Team Execution

**Goal:** multiple specialists cooperate on real Ω work.

Build:
- dependency-aware scheduling;
- review gates;
- handoffs;
- parallelism limits;
- integration queues;
- cross-agent evidence.

Exit:
- a real product milestone is completed by a team rather than a single agent.

## E4 — Persistent Organization

**Goal:** organization survives sessions and process death.

Build:
- desired-state organization;
- presence/reconciliation;
- resident replacement;
- queue persistence;
- checkpointing;
- recovery drills.

Exit:
- machine/session interruption does not destroy organizational state.

## E5 — Product Delivery Loop

**Goal:** swarm builds Ω repeatedly.

Build:
- milestone planner;
- architecture-to-code traceability;
- automated verification;
- product acceptance harness;
- release packaging;
- regression evidence.

Exit:
- at least one complete vertical product slice reaches user-meaningful acceptance.

## E6 — Evidence-Driven Evolution

**Goal:** swarm improves itself from real execution experience.

Build:
- post-task review;
- failure taxonomy;
- experiment registry;
- candidate configuration store;
- A/B or holdout evaluation where appropriate;
- promotion/rollback.

Evolution must cover L1 agent, L2 interaction, and L3 organization. Meta-Team's three-level evolution model is useful here, but Ω requires every promoted change to remain evidence-backed and reversible. citeturn0academia24turn0search3

Exit:
- the swarm has made at least three successful self-improvements demonstrated against a defined baseline.

## E7 — Adaptive Organization

**Goal:** organization changes shape in response to workload.

Build:
- workload sensing;
- capability-demand mapping;
- dynamic worker pools;
- role proposal;
- role retirement;
- bottleneck diagnosis.

Exit:
- the organization can add/remove bounded capacity without manual redesign of its entire operating model.

## E8 — Controlled Self-Governance

**Goal:** swarm can operate the development organization largely autonomously.

Build:
- continuous reconciliation;
- policy-aware self-modification;
- evolution council/review;
- rollback;
- drift detection;
- stale-context detection;
- governance escalation.

Exit:
- swarm can run a sustained Ω development cycle while humans retain explicit authority over the protected boundaries.

## E9 — Mature Ω Development Organism

The swarm can:

- understand the current Ω state;
- choose the next authorized product work;
- form the required team;
- build and test it;
- prove it;
- integrate it;
- update project state;
- identify its own development bottlenecks;
- run bounded improvement experiments;
- retain successful improvements;
- roll back harmful ones;
- recover from interruption;
- explain why it made important decisions.

The final criterion is delivery reliability, not autonomy theater.

## Evolution rule

Never jump from E0 to E9 by declaring architecture complete.

Each band must leave behind executable evidence that makes the next band safer and more useful.
