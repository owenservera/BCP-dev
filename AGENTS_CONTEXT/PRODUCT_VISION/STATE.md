# PRODUCT_VISION — STATE

> Status: ACTIVE HANDOFF
> Classification: DERIVED — SESSION CONTEXT
> Date: 2026-09-25
> Repository: https://github.com/owenservera/BCP-dev
> Verified main HEAD at package creation: cd7b9054d04c70dc816986b4ae9abf0e0d89ba6d

## 1. Why VIVIM exists

VIVIM is a sovereign personal computing environment.

The foundational idea is:

**My machine. My internet. My accounts. My apps. My data. My intelligence. My rules. My interaction.**

The goal is not another application hub or AI assistant. The goal is one coherent environment through which a person can understand, organize, interact with, automate, and extend their digital world while retaining ownership and control.

VIVIM V1 is the first real prototype and a mine of working behavior/evidence to harvest. Ω is the strongest destination-oriented architecture. BCP is the reconciliation, proof, migration, and harvesting program.

## 2. Core experience

VIVIM should open into a persistent world containing the user's permitted projects, conversations, email, files, people, accounts, applications/services, work, memory/history, and configured interests.

If the user is working on Project X, VIVIM should already know enough to show current state, relevant conversations, decisions, files, open questions, active work, and what appears next, without forcing the user to reconstruct a dashboard.

The first experience depends on why the user opened VIVIM: continuing work, researching, communicating, retrieving, creating, or delegating.

## 3. Spatial environment

The destination visual model is an intelligent infinite spatial canvas, potentially including 3D/depth.

Canvas is a projection/surface, never the source of truth.

Spaces can represent workspaces, projects, research areas, conversations, focused tasks, and application-like areas.

World = what exists.
Space = where/how a context is organized.
Workspace = a configured way of experiencing a space.
Surface = how a thing/context is represented and interacted with.
Canvas = spatial projection.

Direct manipulation is first-class: see, navigate, focus, move, group, connect, open, inspect, resize, reorganize, create, configure.

## 4. Universal prompt

The prompt is not merely chat. It is the natural-language control surface for the environment.

The user can address VIVIM, a space, a thing/project/conversation, a person, an account/provider, an agent, a plugin/capability, an external AI provider, or a surface.

Interaction modes include ask, act, configure, create, delegate, and inspect.

Core semantic path:

Address → Intent → Context → Capability → Choice/Routing → Authority → Work → Execution → Evidence → World/Memory update

## 5. Plugins and capability model

Everything is composable through plugins and capabilities.

A plugin is a provider of explicit powers. Its capabilities, boundaries, configuration, dependencies, data access, authority/permissions, observable resources, automation possibilities, and surfaces should be user-visible and configurable.

There is no separate privileged advanced/admin user class required for normal powerful use. Complexity is progressively exposed through the same environment.

Hyper-configurable does not mean hyper-complicated.

## 6. V1

V1 is dynamic but ships useful by default:

VIVIM Core + Default Free Capability/Provider Set + Optional Connected Accounts + User Routing/Configuration

Default providers are not architecturally privileged. They are the bundled starting capability set.

Exact provider lineup is a product-release decision and must be checked against then-current availability and terms at release.

## 7. Provider / Account / Realization / Session

Provider = external system/service/application.
Account = user's authenticated relationship with that provider.
Realization = concrete implementation of a semantic capability.
Session = current execution relationship/profile/session used to interact with a provider.

Destination chain:

Capability → candidate realizations → Account + Model + Session → User Routing Policy → Authorized Work

These distinctions are foundational to the meaning of my internet / my accounts / my intelligence / my rules.

## 8. User choice and routing

The user wants decision-making control over what is used when.

Routing must support provider, account, model, priority/fallback, capability-specific defaults, project/space rules, one-off overrides, forbidden combinations, and cost/performance constraints within user policy.

Learned ranking may inform candidate choice but cannot silently override explicit user policy or grant authority.

Routing chooses among valid candidates. Authority/law decides whether selected work may occur.

The legacy VIVIM ProviderMux, routing preferences, priorities, fallbacks, cost strategies, learned scores, model catalog, account model, and Chrome profile/fleet are important harvest evidence.

## 9. Agents, work, automation

Delegation should feel like talking to an AI agent.

Example: Send an update on Project X to John covering where we are and what is next.

Internally, this may combine deterministic local retrieval, context assembly, LLM reasoning through the user's chosen AI provider/account, provider interaction, authority, evidence, and durable work.

The user experience is: Me → Agent → Work → Result.

Durable Work is a central missing product integration primitive.

Target lifecycle: DRAFT → READY → RUNNING → WAITING → SUCCEEDED / FAILED / REFUSED / CANCELLED → REVIEWED

An Agent is an actor executing Work under authority; it is not the authority source.

Background work is normal Work that continues after the initiating interaction ends.

## 10. Attention and continuity

VIVIM can be configured to care about interests, projects, repositories, providers, people, and topics.

Standing Intent and Attention cover watches, reports, alerts, scheduled research, notifications, and background triggers.

On return, VIVIM should answer: What changed? What did I do? What did I find? What failed? What needs you? What comes next?

## 11. Data, memory, second brain

The second brain is not a detached notes app. It is user-owned data plus relationships, memory semantics, deterministic context assembly, and work/history.

Keep distinct:
Source data.
Canonical local record.
Derived representation.
Memory.
Context.

Imported AI conversations preserve source genealogy and become normal world objects that can relate to projects, memory, search, and context.

Model-generated beliefs and summaries never silently become source truth.

## 12. Sovereignty and evidence principles

External providers remain external.
AI models are replaceable reasoning resources, not authorities.
Important actions are attributable.
Evidence is not authority.
Representation is not canonical truth.
Confidence is not proof.
Candidate is not realization.
Selector is not canonical truth.
LLM output is not authority.
Unknown is not failure.

## 13. Forge and evolution

Desired evolution loop:

User request → capability gap → reuse/compose existing capability → generate candidate when needed → test → evidence → user-controlled promotion → ordinary capability

Provider healing is governed evolution applied to changing external systems:

drift → observe → infer/map → generate/revise realization → test → probation → promotion

No silent promotion.
No privileged developer path for ordinary user extension.

## 14. Program views

P1 = architecture / proof obligations.
Destination = what VIVIM is and the intended user experience.
D1-D6 = product assembly views.
V/VS = vertical slices that force multiple dependencies into user outcomes.

Do not create another P1 portfolio just to represent product assembly.

## 15. Current vertical slices

VS0 — Governed action: real governed external action.
VS1 — Run my VIVIM: install → start → local durable world → reopen → same world.
VS2 — Bring my AI history: import → provenance → canonical conversation → project → workspace → search → memory/context.
VS3 — Act across providers: choose provider/account/model → express intent → route → authorize → act → inspect result.
VS4 — Delegate durable work: delegate → durable work → agent/provider/local tools → background execution.
VS5 — Return to continuity: leave → work/change continues → return to truthful summary.
VS6 — Create/modify capability: request → capability gap → composition/Forge → test → evidence → promotion.
VS7 — Survive provider drift: provider lab → healing → Forge → routing.
VS8 — Exit/reconstruct: export → restore → reconnect → reconstruct working environment.

## 16. Keystone dependency model

Tracked in docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md.

Top dependencies:

Vault / Evidence / Provenance — current L3-L4, target L6, complexity 10.
Ontology / World Identity — current L2-L3, target L6, complexity 9.
Ω Runtime / Plugin / Capability — current L3-L4, target L6, complexity 9.
Intent / Context / Interaction — current L2-L3, target L6, complexity 9.
Provider / Account / Realization / Routing — current L1-L2, target L6, complexity 10.
Authority / Law / Consent — current L3-L4, target L6, complexity 8.
Durable Work / Agent / Automation — current L1-L2, target L6, complexity 10.
World / Workspace / Canvas — current L1-L2, target L6, complexity 9.
Attention / Continuity — current L1, target L6, complexity 8.
Forge / Composition / Healing — current L2-L3, target L6, complexity 10.

Implementation ladder:
L-1 Uncharacterized → L0 Vision → L1 Prototype → L2 Working → L3 Integrated → L4 Live → L5 Productized → L6 Full Vision

Complexity is a management estimate, not exact engineering effort.

## 17. Unscoped dark-matter frontier

These destination areas are not sufficiently bounded by current Ω/VIVIM implementation and require characterization before implementation:

F1 native Windows product shell.
F2 install/update/rollback lifecycle.
F3 OS/filesystem/application integration.
F4 desktop interaction substrate.
F5 notification/attention delivery.
F6 multi-device/sync/machine continuity.
F7 sharing/collaboration/cross-machine delegation.
F8 resource lifecycle/hydration.
F9 local security/secret integration.
F10 extension distribution/ecosystem.
F11 richer spatial/application-like/3D layer.
F12 universal digital-world acquisition.
F13 local/network discovery.
F14 product diagnostics/recovery/repair.
F15 generic web/resource substrate.
F16 local intelligence/model execution lifecycle.

L-1 means uncharacterized, not prototype.

Highest-risk unscoped areas currently: F1, F3, F4, F6, F7, F15, F16.

## 18. Program controls

Seven important convergence controls:
1. Requirement → evidence traceability.
2. Maturity acceptance criteria.
3. Vertical-slice registry.
4. Explicit product ownership.
5. L-1 frontier intake.
6. Product-readiness gates separate from engineering gates.
7. Dependency change/revalidation.

Secondary controls identified:
risk/assumption register; evidence index; WIP/concurrency limits; deprecation/migration policy; user-validation loop; definition of done.

## 19. Current strategic direction

Do not measure progress primarily by workstream completion.

Measure:
Destination dependency → implementation level → vertical slice → evidence → user outcome

Primary program transition:
strong machine-side foundations → product assembly → real user experience → sovereign product

## 20. Immediate sequence

Proof path: P1-08 → P1-06 → P1-07 → P1-09.

Destination path: VS0 → VS1 → VS2 → VS3 → VS4 → VS5 → VS6 → VS7 → VS8.

Near-term destination frontier: VS1 / D1 Product Environment.

The product environment is important precisely because the current Ω program does not yet fully own native Windows shell, lifecycle, startup/recovery, default composition, diagnostics, packaging/update, and related product concerns.

## 21. Source map

Primary destination package: docs/destination/.
Program controls: docs/agent-system/PROGRAM-COMPLETENESS-AND-CONTROLS.md.
Dependency graph: docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md.
Traceability: docs/destination/REQUIREMENT-EVIDENCE-TRACEABILITY.md.
Vertical slices: docs/destination/VERTICAL-SLICE-REGISTRY.md.
Discovery source conversation: docs/destination/sources/2026-09-25-destination-discovery-conversation.md.

## 22. Fresh-session instruction

Read this STATE.md first, then the session JSON, then docs/destination/README.md and the program-control artifacts. Treat this file as a working handoff, not architecture law. Reconcile against current repository evidence before making changes.

## 23. System Intelligence — Wave 1 result

Wave 1 archaeology completed on:
- branch: `research/system-intelligence-archaeology`
- final research tip: `a7971a0557c464786b0db922cff34ae799e91767`

Reported completion:
- 6/6 investigator roles
- 44 atomic findings
- 65 dependency / relationship edges
- 99 normalized evidence records
- 42/42 required role artifacts
- 11/11 required synthesis artifacts

Central seams found:
- Internal/governed: `Vault / Evidence → Law / Authority → Recipe / Composition → Canonical Intent → Execution / Context`
- External/provider: `Provider → Account → Session → Browser → Realization → Routing → Governed Effect → Evidence`
- Product: `Product Instance → Persistence → Composition → World → Surface → Continuity`

Wave 1 found the external chain incomplete in current Ω: Legacy contains substantial Account/Session/routing machinery and BCP contains a browser realization path, but canonical Ω Account, routing, and full session lifecycle remain insufficiently characterized.

Wave 1 also confirms that Ω runtime maturity must not be confused with destination product maturity.

## 24. Wave 1 red-team findings

Keep these tensions explicit:
- provider-browser live implementation exists, but owner-side live proof is still pending;
- Legacy ChromeGovernor was historical browser authority, while current Ω has plugin-local CDP behavior;
- Legacy has concrete ProviderAccount/session/routing machinery, while current Ω does not yet prove an equivalent canonical model;
- Ω implementation maturity does not equal product maturity;
- the mind WorldModel is a bounded projection, not proof of a complete world model;
- product shell/lifecycle and durable continuity remain materially under-characterized.

## 25. Pass 2 now in progress

A second archaeology pass is running as a structural coverage and falsification audit.

It is intended to expose:
- hidden runtime dependencies and dynamic coupling;
- incomplete data flows and evolution limits;
- false shared abstractions;
- provider-specific leakage;
- provider protocol knowledge storage/use gaps;
- onboarding/parsing/discovery/healing/promotion gaps;
- routing/account/session gaps;
- Chrome master/slave lifecycle and resource risks;
- plugin cross-sharing and dependency-graph weaknesses;
- self-knowledge limitations;
- reprogrammability limitations;
- Legacy capability parity and destination negative space;
- boundary, lifecycle and authority holes.

The explicit concern set to falsify is:
1. self-evolving data model across prompts, messages, artifacts, documents, files, work, evidence, memory and relationships;
2. provider abstraction across similar-but-not-identical providers;
3. provider protocol knowledge as durable, queryable, versioned, repairable system knowledge;
4. provider onboarding and autonomous maintenance;
5. routing across provider/account/model/realization under user policy;
6. resource-efficient Chrome master/slave substrate;
7. reliable shared-vs-bespoke separation;
8. plugin infrastructure capable of the actual cross-capability dependency web;
9. robust actionable self-knowledge;
10. system-wide reprogrammability/evolvability.

Pass 2 must preserve Pass 1 as evidence and distinguish design-needed, experiment-needed, implementation-needed, proven, underproven, partial, missing and unknown.

## 26. V1 capability-floor clarification

A key product conclusion from this conversation:

**V1 must cover at least the meaningful capability floor demonstrated by Legacy VIVIM.**

This does not mean rebuilding the old architecture.

The rule is:
- meaningful demonstrated Legacy behaviors become V1 parity candidates;
- mechanisms can be replaced by destination/Ω mechanisms;
- obsolete or accidental behavior can be rejected with explicit evidence;
- destination capabilities absent from Legacy become new V1 work;
- unknown-value legacy behavior remains a research/defer decision.

The eventual mapping is:

`Legacy capability → evidence → V1 parity candidate → destination support → current implementation → proof`

The 80% Provider-01 parity target remains a provider-specific empirical target, not the whole V1 product scope.

## 27. Research sequencing decision

Do not immediately start every Wave 1 deep dive.

First consume Pass 2's structural audit.

Then classify each major critical area as:
- DESIGN FIRST
- EXPERIMENT FIRST
- IMPLEMENT FIRST
- SAFE TO DEFER

The next research/build sequence should be driven by structural risks revealed by Pass 2.

## 28. Fresh-session entry point

For a new Product Vision / architecture conversation:
1. Read `AGENTS_CONTEXT/PRODUCT_VISION/STATE.md`.
2. Read `AGENTS_CONTEXT/PRODUCT_VISION/HANDOFF-2026-09-25.md`.
3. Read `AGENTS_CONTEXT/PRODUCT_VISION/CONVERSATION-2026-09-25-SYSTEM-INTELLIGENCE.json` for detailed rationale/transcript context.
4. Read current System Intelligence synthesis on the research branch and, once merged, the Pass 2 outputs.
5. Reconcile against current repository evidence before treating handoff claims as current facts.

Immediate action:
**let Pass 2 finish; do not prematurely implement the identified critical areas.**

## 29. New cross-cutting frontier — Evolution, Reconciliation & Self-Maintenance

A deeper hard-problem cluster has now been elevated beneath D5 and alongside Forge/Provider/Work/Product lifecycle:

**How may VIVIM change while remaining the same coherent, user-owned, evidence-backed system?**

Initial design separates:

- deterministic maintenance;
- governed evolution;
- constitutional evolution.

Research must cover dynamic data/ontology evolution, identity and relationship reconciliation, compatibility, impact, temporal continuity, migration/recovery/rollback, evidence across versions, resource economics, self-extension, and constitutional anti-bypass rules.

Cold-start context: `AGENTS_CONTEXT/EVOLUTION/`.
Destination design: `docs/destination/EVOLUTION-RECONCILIATION.md`.
Research package target: `docs/destination/evolution/`.
