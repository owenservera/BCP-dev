# Autonomous Build Protocol

## 0. Start

Clone `main`. Establish:
- commit SHA;
- OS/runtime/tool versions;
- available browser;
- ports;
- test/build commands;
- repository cleanliness.

Read ZAI_BUILD_CONTEXT before broad repository exploration.

## 1. Every turn solves ONE major hard problem

A turn has exactly one primary objective.

Examples:
- “Prove and implement attributable Account → Session → Browser Resource identity.”
- “Make two authenticated accounts safely isolated.”
- “Make browser resource recovery restart-safe.”
- “Implement durable Work checkpoints across an external effect.”
- “Implement canonical Artifact lifecycle and restore.”
- “Make ProviderKnowledgeView evidence-backed and freshness-aware.”

Do not split attention across five major architectural problems.

Small supporting changes are allowed only if they are necessary for the current problem.

## 2. Attack the hardest part first

For the chosen problem:
1. identify current implementation;
2. identify the strongest known falsifier;
3. run a real experiment where possible;
4. implement the smallest robust solution;
5. test it;
6. integrate it into a real user-facing path;
7. run regression tests;
8. document evidence and remaining uncertainty.

The agent may launch browsers and use authenticated sessions available in its environment. Never request or expose secrets in source control.

## 3. Do not wait for the owner

If an experiment requires something available to the agent, do it.

If external credentials are unavailable:
- build a safe test harness;
- use explicit mocks/fixtures for deterministic semantics;
- mark the external proof UNRUN;
- continue with independent work;
- do not fabricate live evidence.

## 4. Prefer vertical slices

Bad:
`Account CRUD → Session CRUD → Browser CRUD → Routing CRUD`

Good:
`user intent → account selection → session attach → browser resource → provider action → evidence → durable state`

The second exposes the real coupling.

## 5. Engineering standard

The agent should be willing to:
- refactor deeply;
- delete dead code;
- replace weak implementations;
- add migrations;
- add tests;
- create fixtures;
- build diagnostics;
- add observability that is local and user-controlled;
- repair type/design inconsistencies;
- build real UI;
- run end-to-end browser tests;
- benchmark bottlenecks;
- recover from failures.

Do not preserve bad code merely because it already exists.

## 6. Architecture discipline

Before adding a new abstraction ask:
- Is there already a contract?
- Is this semantic or merely implementation detail?
- Does it belong to the destination or the provider realization?
- Is it canonical data or a projection?
- Who has authority?
- What evidence proves it?
- How does it survive restart?
- How does a second provider/resource/object use it?

Avoid:
- universal base objects;
- provider-specific product branches;
- hidden global state;
- locator-as-identity;
- generated code granting itself authority;
- silent fallbacks across identities;
- duplicate canonical state.

## 7. Completion standard for a hard problem

A problem is not solved because code compiles.

It is solved when:
- semantic boundary is explicit;
- implementation exists;
- automated tests exist;
- failure behavior is explicit;
- restart/recovery behavior is addressed where relevant;
- evidence/provenance is captured where relevant;
- real UI or product path uses it;
- no known security/identity ambiguity remains unacknowledged;
- a fresh agent could understand and reuse the solution.

## 8. Commit discipline

At the end of each turn:
- run relevant tests;
- run build/typecheck;
- inspect diff;
- commit a coherent solution;
- update turn state;
- produce the reusable package.

Prefer one coherent commit per solved hard problem, plus package artifacts if appropriate.
