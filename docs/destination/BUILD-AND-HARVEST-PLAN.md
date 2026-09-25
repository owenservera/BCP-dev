# VIVIM Destination — Build and Harvest Plan

> Classification: DERIVED — WORKING PROGRAM PLAN
> Status: sequenced plan derived from destination mapping and repository evidence.

## 1. Program method

~~~text
MAP
 ↓
HARVEST
 ↓
RECONCILE
 ↓
COMPOSE
 ↓
PRODUCTIZE
~~~

Never start by rebuilding the whole destination stack.

**Map:** identify the semantic object and boundary.

**Harvest:** locate the strongest Ω/VIVIM mechanism.

**Reconcile:** express useful behavior through destination contracts.

**Compose:** put it into a real cross-domain journey.

**Productize:** make it understandable, configurable, durable, recoverable.

## 2. Six delivery tracks

These are delivery views, not a replacement P1 architecture portfolio.

### D1 — Product Environment

Install, startup, first run, bootstrap, shell, surface lifecycle, packaging, update, recovery, default environment.

### D2 — World and Workspace

World projection, spaces, things, relationships, projects, conversations, canvas, workspace, context continuity.

### D3 — Interaction and Work

Addressing, universal prompt, intent, work creation, progress, result, evidence presentation.

### D4 — Providers, Accounts and Intelligence

Providers, accounts, browser sessions, models, realizations, routing, fallback, healing.

### D5 — Agency and Evolution

Agents, delegation, automation, attention, background work, Forge, self-extension.

### D6 — Sovereignty and Trust

Evidence, provenance, policy, backup, export, recovery, inspectability, replacement, exit.

## 3. Dependency graph

~~~text
P1-03 Ontology / Evidence
          ↓
P1-05 Runtime / Plugin
          ↓
   ┌──────┼──────┐
   ↓      ↓      ↓
 P1-04  P1-06  P1-07
 context agency providers
   │      │      │
   └──────┼──────┘
          ↓
      D1–D6 composition
          ↓
       P1-09 E2E
          ↓
   destination-grade UX
~~~

D1–D6 should begin as product assembly tracks without waiting for every P1 workstream to be finished.

## 4. Wave A — Provider / Account / Routing

**Goal:** make “my accounts / my intelligence / my rules” mechanically meaningful.

Harvest:
- ProviderAccount;
- per-account Chrome profiles/fleet;
- provider capability/model catalogs;
- ProviderMux;
- routing preferences;
- priority, cost, fallback, learned strategies.

Reconcile:

~~~text
Account
  ↓
available capabilities
  ↓
candidate realizations
  ↓
routing policy
  ↓
chosen realization
  ↓
session
  ↓
work
~~~

Exit evidence: user selects or constrains the account/provider/model behavior for a capability; the system can explain the selection, execute through the governed path, and record the actual realization.

## 5. Wave B — World / Workspace / Canvas

Harvest:
- WorldModel;
- legacy projects;
- conversation organization;
- memory/knowledge structures;
- canvas primitives/layers/designer;
- workspace/adaptive workspace/presets;
- Ω live-object model.

Reconcile:

~~~text
Vault evidence
   ↓
World projection
   ↓
Spaces / Things / Relationships
   ↓
Surfaces
~~~

Exit evidence: open VIVIM, enter a project, and receive a useful current state without manually reconstructing it.

## 6. Wave C — Universal Interaction / Durable Work

Unify:
- NLCL;
- intent IR;
- visual spec;
- capability registry;
- context assembly;
- agent/work concepts.

Target path:

~~~text
address
  ↓
intent
  ↓
context
  ↓
capability / realization choice
  ↓
authority
  ↓
durable work
  ↓
result
  ↓
evidence
~~~

Exit evidence: a user request can become a durable inspectable work item rather than only a synchronous function call.

## 7. Wave D — Live Chrome

Use D-418/D-420 as the shipping boundary.

Sequence:
1. attach;
2. capture-vs-fixture substitution;
3. real provider operation;
4. streamed response;
5. parser verification;
6. realization promotion;
7. repeated reliability evidence;
8. account/profile/session lifecycle;
9. background-safe handling.

Exit evidence: a real authenticated browser session performs the supported semantic operation through the ordinary governed path.

This is the decisive maturity move for “my internet”.

## 8. Wave E — Delegated Work / Background Continuity

Unify:
- vivim.agent;
- director;
- intent plans;
- daemon/scheduler;
- events/ledger;
- provider sessions;
- context assemblies.

Target work state:

~~~text
DRAFT
→ READY
→ RUNNING
→ WAITING
→ SUCCEEDED / FAILED / REFUSED / CANCELLED
→ REVIEWED
~~~

Return experience:

~~~text
What changed
What ran
What I did
What I found
What failed
What needs you
What comes next
~~~

## 9. Wave F — Attention / Standing Intent

Create one semantic layer for:
- interests;
- watches;
- reports;
- scheduled research;
- notifications;
- background triggers;
- “tell me when...” requests.

The user should configure what VIVIM watches, what it may do, and how it reports.

## 10. Wave G — Native Evolution

Target flow:

~~~text
capability gap
   ↓
understand desired behavior
   ↓
compose / generate proposal
   ↓
test against evidence
   ↓
user approval
   ↓
promotion
   ↓
ordinary capability
~~~

Harvest forge.author, proposal/promotion, plugin builder, live capability registry, discovery/healing.

## 11. Wave H — Product lifecycle

Own the complete product journey:

~~~text
install
→ initialize
→ connect what I own
→ understand my world
→ configure defaults
→ work
→ background work
→ update
→ recover
→ export
→ restore
~~~

This is a delivery track, not another architecture layer.

## 12. Harvest matrix

| Existing mechanism | Action | Destination home |
|---|---|---|
| ProviderAccount | Harvest + generalize | D4 |
| ProviderMux | Harvest behavior; redesign policy data | D4 |
| provider selectors | Harvest as disposable realization technique | P1-07 |
| onboarding orchestrator | Harvest discovery workflow | P1-07 / D5 |
| adaptive workspace | Harvest UX behavior | D2 |
| workspace presets | Harvest as templates/compositions | D2 |
| canvas primitives/layers/designer | Harvest surface behavior | D2 |
| conversation organizer | Harvest organization behavior | D2 |
| import parsers | Already harvested; integrate | D2 / P1-08 |
| legacy memory engines | Assay selectively | D2 / D6 |
| capability resolution | Harvest configuration precedence | D3 / D4 |
| live capability registry | Harvest extension behavior | D5 |
| plugin builder | Harvest authoring UX | D5 |
| browser automation recipes | Harvest empirical vocabulary | P1-07 |
| selector healing | Harvest only as realization technique | P1-07 |
| provider health | Harvest monitoring | P1-07 |
| routing learned scores | Harvest as ranking evidence, never authority | D4 |
| old admin/config surfaces | Do not copy UX | destination interaction model |

## 13. Immediate sequence

### Cycle 1 — COMPLETE
Provider / Account / Routing reconciliation.

Primary artifact: `PROVIDER-ACCOUNT-ROUTING-RECONCILIATION.md`.

Outputs: canonical Account relationship, routing-policy semantics, realization-selection flow, migration/harvest matrix, maturity path, thin falsifier, and live-account proof criteria.

### Cycle 2 — COMPLETE
World / Workspace / Canvas reconciliation.

Primary artifact: `WORLD-WORKSPACE-CANVAS-RECONCILIATION.md`.

Outputs: world projection, space/thing mapping, project/conversation continuity, canvas integration, first-minute experience.

### Cycle 3 — COMPLETE
Interaction / Work reconciliation.

Primary artifact: `INTERACTION-INTENT-WORK-RECONCILIATION.md`.

Outputs: universal addressing, durable work envelope, routing integration, authority integration, result/evidence presentation.

### Cycle 4 — CURRENT
Live Chrome / Accounts.

Preceded by the completed D4 reconciliation and consumed by the agency/background work path.

Outputs: live provider proof, real account/profile/session path, realization promotion, failure/healing path.

### Cycle 5
Background / Attention / Evolution.

Primary artifact: `AGENCY-BACKGROUND-ATTENTION-RECONCILIATION.md`.

Outputs: standing intent, background work, return continuity, capability gaps, native Forge journey.

### Cycle 6
Product lifecycle / E2E.

Outputs: first-run, default environment, recovery, export, end-to-end journey suite.

## 14. Current execution rule

## 14A. Core-vs-plugin boundary gate

Before a new implementation is started, classify its responsibility using `docs/destination/CORE-VS-PLUGIN-BOUNDARY-DISTILLATION.md`.

Do not move functionality into Ω Core merely because it is:

- essential to VIVIM;
- first-party;
- security-sensitive in its policy/content;
- used by many plugins;
- always enabled in the default composition.

Only non-bypassable, domain-neutral runtime mechanism belongs in K0. Shared semantics belong in K1 contracts; product/domain behavior belongs in plugins. Policy **enforcement** may be K0 while policy **content** remains plugin-owned.

A new K0 proposal requires an explicit boundary rationale and falsifier before code lands.


Do not open a new architectural workstream for this slice. D4 owns the product synthesis; P1-05/P1-06/P1-07/P1-08 contribute the runtime, authority, provider-reality, and harvest evidence. The first implementation request comes only after RA-1 through RA-3 are reconciled and the thin falsifier is specified.

## 15. Explicit non-goals

Do not spend major effort on another plugin SDK, another provider abstraction layer, another world graph, another memory architecture, another routing engine, another canvas authority model, or broad AI-provider API integration ahead of the shippable Chrome path.

The repository already has enough material in these areas.

## 16. Destination-grade rule

A capability becomes destination-grade when the relevant journey is:

**semantic + governed + proven + live where needed + composed + human + sovereign.**

The program should optimize for:

**make the world coherent → make capabilities selectable → make work durable → make external reality real → make continuity persistent → make evolution native.**
