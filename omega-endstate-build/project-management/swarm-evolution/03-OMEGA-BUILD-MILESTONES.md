# Ω Build Milestones for the Evolving Swarm

> Status: PRODUCT ROADMAP
> Date: 2026-09-29

These are real product milestones. The evolving swarm must use them as its workload and prove that its increasing capability is useful by shipping them.

## M0 — Development Foundation

**Outcome:** Ω development environment is reproducible.

Deliver:
- canonical Ω workspace;
- isolated agent worktrees;
- local OpenCode execution;
- swarm baseline;
- Commons communication;
- durable project-management state;
- verification/reporting.

Proof:
- fresh machine/session can recover the project and execute a bounded task.

## M1 — Sovereign Browser Substrate

**Outcome:** VIVIM can operate a real local browser substrate using the user's existing browser/account state.

Deliver:
- Chrome substrate;
- provider profile isolation;
- browser lifecycle/control;
- no Puppeteer/Playwright foundation;
- evidence capture;
- failure/drift observation.

Proof:
- real browser session is controllable and observable without creating a new provider account.

## M2 — ChatGPT Web Vertical Slice

**Outcome:** a user can conduct a real multi-turn ChatGPT conversation through VIVIM.

Deliver:
- provider discovery;
- session start;
- prompt submission;
- response observation;
- conversation continuity;
- local evidence;
- Vault persistence.

Proof:
- conversation can be started, resumed, inspected, and reconstructed locally.

## M3 — Provider Triad

**Outcome:** ChatGPT Web, Claude Web, and Gemini Web work through one governed provider realization layer.

Deliver:
- provider capability contracts;
- Chrome realization adapters;
- drift detection;
- parser/selector repair;
- normalized evidence.

Proof:
- same user intent can be routed through each provider with provider-specific realization hidden behind the governed seam.

## M4 — Sovereign Command Loop

**Outcome:** Universal Prompt becomes the product's primary command surface.

Deliver:
- Prompt → semantic compilation → provider realization → evidence;
- routing/choice;
- authority checks;
- Vault record;
- user-visible outcome.

Proof:
- a user can issue a natural-language task and inspect what VIVIM actually did.

## M5 — Continuity and Vault

**Outcome:** durable personal continuity becomes real.

Deliver:
- canonical local records;
- identity/lineage;
- conversation/work continuity;
- reconstructability;
- evidence lineage;
- import from external AI histories where available.

Proof:
- user can leave and return without losing semantic continuity.

## M6 — Real Digital-World Acquisition

**Outcome:** VIVIM can acquire useful information/actions from the broader web and local apps through governed capabilities.

Deliver:
- generic web/resource substrate;
- capability discovery;
- external resource lifecycle;
- secrets/integration boundaries;
- explicit external mutation consent.

Proof:
- at least one non-AI external-world journey completes with auditable evidence.

## M7 — Product Experience Layer

**Outcome:** the system becomes usable as a coherent product rather than a collection of substrate demos.

Deliver:
- native Windows shell;
- command center;
- attention/notification model;
- settings/admin surfaces;
- diagnostics and repair;
- clear evidence/provenance presentation.

Proof:
- a normal user can complete representative journeys without developer intervention.

## M8 — Beta Distribution

**Outcome:** free local VIVIM beta can be installed/launched and used by external testers.

Deliver:
- packaging;
- setup;
- migration/import;
- diagnostics;
- repair;
- update strategy;
- privacy/sovereignty documentation;
- crash/recovery handling.

Proof:
- external tester completes defined beta journeys on a clean environment.

## M9 — Ω Self-Development Demonstration

**Outcome:** the swarm itself is demonstrably building and improving Ω.

Deliver:
- autonomous milestone selection within policy;
- team formation;
- implementation;
- verification;
- integration;
- self-evolution experiment;
- rollback capability.

Proof:
- a complete Ω milestone is delivered by the evolving swarm with a durable evidence trail.

## Dependency shape

```
M0
 ↓
M1
 ↓
M2 ─────┐
 ↓      │
M3 ─────┤
 ↓      │
M4      │
 ↓      │
M5 ─────┘
 ↓
M6
 ↓
M7
 ↓
M8
 ↓
M9
```

M2/M3 are provider realization foundations. M4 is the first coherent product loop. M5 establishes continuity. M6–M8 widen and harden the product. M9 proves the organizational thesis.

## Milestone discipline

A milestone is not complete because code exists.

It is complete only when:

`implementation + verification + product proof + durable evidence`

exist together.
