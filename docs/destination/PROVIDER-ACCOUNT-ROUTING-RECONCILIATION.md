# D4 — Provider, Account, Intelligence & Routing Reconciliation

> Classification: DERIVED — WORKING DESIGN / RESEARCH
> Status: initial destination reconciliation; not yet an Ω law record.
> Scope: map and reconcile existing provider/account/routing evidence into the destination product model.
> Source rule: Ω contracts/decisions are the architectural baseline; VIVIM mine behavior is harvest evidence.

## 1. Why this slice comes first

The destination promise says:

- My internet.
- My accounts.
- My intelligence.
- My rules.

The repository already has most of the machinery, but the concepts currently live at different layers.

The specific bridge that is missing is:

```
CAPABILITY
   ↓
AVAILABLE REALIZATIONS
   ↓
ACCOUNT / MODEL / SESSION
   ↓
USER ROUTING POLICY
   ↓
AUTHORIZED WORK
   ↓
ACTUAL REALIZATION + EVIDENCE
```

Without this bridge, a user can have many providers but does not yet have a coherent way to decide which one is used for what.

## 2. Existing truth

### Ω already provides

- `ProviderRealization` in vault namespace `providers`.
- realization lifecycle: DRAFT → TESTING → PROMOTED → DEGRADED / REQUIRES_REDISCOVERY.
- `ProviderClass`: SIMULATOR / API_NATIVE / BROWSER_MEDIATED.
- `providers.registry@1` and `providers.realization.get@1`.
- computation routing via `ComputationKind`: DETERMINISTIC / PROBABILISTIC / HUMAN.
- `resolve.classify@1`, `resolve.report@1`, `strategy.scorecard@1`.
- credentials spine with reference-only semantics.
- browser session/capture records.
- law/consent and governed external mutation.

### VIVIM mine already provides

- ProviderDefinition.
- ProviderAccount.
- provider endpoints.
- model catalog.
- capability catalog.
- per-account Chrome profile/fleet relationships.
- account defaulting.
- ProviderMux routing.
- routing preferences by capability.
- priority, round-robin, fan-out, cost-optimized and learned strategies.
- provider fallbacks.
- capability-specific UI/configuration resolution.
- provider onboarding and discovery.

### Important conclusion

The mine is not missing some magical routing feature. It already contains the behavior family.

The work is to **generalize and re-express that behavior under Ω's realization, evidence, authority, and representation rules.**

## 3. Canonical concept boundaries

### Provider

The external system.

Examples: ChatGPT, Claude, Gmail, GitHub, a website, or another application/service.

A provider is not the user's account and is not the realization of every capability it may expose.

### Account

The user's authenticated relationship with a provider.

Destination-level account state needs to be able to identify, at minimum:

- provider identity;
- account identity/label;
- authentication state;
- available capabilities;
- available models where applicable;
- associated realization/session/profile;
- user policy/configuration;
- health/availability;
- provenance.

Credentials themselves remain reference-only and follow the credential law.

### Capability

A semantic thing the environment can do.

Examples:

- read conversation;
- summarize;
- search;
- send message;
- generate text;
- inspect webpage;
- navigate;
- create artifact.

A capability is not synonymous with a provider.

### Realization

A concrete implementation of a capability.

A realization is attributable, testable, promotable, replaceable, and linked to evidence.

Examples conceptually:

```
generate.text
  ├─ ChatGPT/account-A/browser
  ├─ Claude/account-B/browser
  └─ another verified realization
```

The realization record remains the Ω proof object.

### Model

A selectable mode within a provider/account realization when the provider exposes models.

Model choice is a routing/configuration dimension, not a new authority system.

### Session

The concrete active execution relationship with the external/provider environment.

For browser-mediated V1 this may include the user's selected Chrome profile/session.

### Routing Policy

The user's rules for choosing among valid candidate realizations.

This is the missing destination-level product concept.

It should remain policy data, not an execution bypass and not a second law system.

## 4. Routing is policy, not discovery

The resolver must not invent capability availability.

Discovery/verification establishes which realizations exist and their proof status.

Routing chooses among already-valid candidates.

Therefore:

```
DISCOVERY
  proves candidate realization

REGISTRY
  reports candidate realization state

ROUTING POLICY
  chooses among allowed candidates

LAW / AUTHORITY
  decides whether the chosen work may happen

EXECUTION
  performs the work

EVIDENCE
  records what actually happened
```

This prevents the routing layer from becoming a hidden authority path.

## 5. Destination routing policy model

The product model should support a policy containing:

### Match scope

What the rule applies to:

- capability;
- domain/provider;
- project/space/context;
- account;
- model family;
- work type;
- time/standing rule where relevant.

Do not make every dimension mandatory. A simple global preference should remain simple.

### Candidate selection

The user can:

- choose a specific provider;
- choose a specific account;
- constrain a model;
- choose among a priority order;
- permit fallback;
- permit multi-provider execution where explicitly configured.

### Constraints

The user can express boundaries such as:

- never use provider X for this kind of work;
- only use account Y for this project;
- do not use a paid model here;
- do not leave the machine for this operation;
- require approval before an external mutation;
- use deterministic/local capability when one exists.

These constraints are policy inputs, not hidden system heuristics.

### Fallback

Fallback should be explicit policy.

A provider becoming unavailable must not silently select a different provider when the user's rule forbids that behavior.

### Learning

Learned performance data may inform ranking, but it must never silently replace explicit user policy.

This is consistent with the Ω scorecard doctrine and the legacy ProviderMux learned strategy.

## 6. Resolution order

The intended resolution sequence is:

```
1. Determine semantic capability / operation
2. Determine current context and applicable policy scope
3. Gather valid candidate realizations
4. Remove candidates forbidden/unavailable under explicit policy
5. Apply explicit user priority / selection
6. Apply allowed fallback / cost / performance rules
7. If unresolved, ask the user or escalate
8. Produce a selection decision
9. Run through ordinary authority/law path
10. Record actual realization, account and session evidence
```

Key rule:

> **No explicit user policy should be silently overridden by a learned score.**

And:

> **No learned score should grant authority.**

## 7. What user experience this produces

The normal experience remains simple.

### Default

> “Use my usual AI.”

VIVIM resolves the user's standing default.

### Explicit choice

> “Use Claude for this.”

The current context gets an explicit temporary routing instruction.

### Account choice

> “Use my work ChatGPT account.”

The route must resolve against the specific account relationship.

### Rule

> “Use Claude for coding and ChatGPT for writing.”

This becomes persistent user configuration.

### Constraint

> “Never use my work account for personal projects.”

This becomes a scoped policy constraint.

### Uncertainty

> “I have two valid options here. Which one should I use?”

The system asks rather than guessing when policy does not safely determine the choice.

### Inspection

When it matters, the user can see:

```
Selected:
Claude
Account:
Work / Owen
Model:
Sonnet ...
Reason:
Project-X coding rule
Fallback:
ChatGPT / personal
Authority:
standing approval
```

The complexity is available, but it does not have to dominate the ordinary interaction.

## 8. Mapping the mine into Ω

| Mine mechanism | Destination treatment |
|---|---|
| ProviderDefinition | Provider identity/metadata |
| ProviderAccount | **Harvest as core Account concept** |
| ProviderEndpoint | Provider realization/session metadata |
| model catalog | Model availability metadata |
| capabilitiesJson | Capability declarations, not authority |
| ProviderMux | **Harvest routing behavior; do not port architecture wholesale** |
| RoutingPreference | Policy-derived preference data |
| priority strategy | Explicit routing rule |
| cost_optimized | User-authorized routing strategy |
| learned strategy | Derived ranking data only |
| fallback providers | Explicit fallback chain |
| account isDefault | Lowest-level default preference |
| Chrome profileDir | Account/session realization detail |
| chromeSlaveId/debugPort | Execution substrate reference |
| capability resolution | Product configuration/availability view |
| ProviderRegistry | Ω realization registry |
| selector lists | Disposable provider realization mechanics |
| onboarding orchestrator | Discovery/onboarding path |
| provider health | Realization availability and maintenance state |

## 9. What must NOT be merged

Do not collapse:

- provider and account;
- account and credential;
- capability and realization;
- realization and session;
- routing and authorization;
- learned ranking and user policy;
- provider discovery and provider selection;
- model choice and capability identity.

These distinctions prevent the system from recreating the legacy provider silo in a new shape.

## 10. Account maturity path

### A0 — legacy evidence

ProviderAccount + Chrome profile/fleet + login state.

### A1 — destination characterization

Define the user-visible Account object and its relationship to Provider, Capability, Realization, Credential, and Session.

### A2 — Ω representation

Account can be represented and retrieved as ordinary world data with provenance.

### A3 — governed selection

An account can participate in a routing decision without bypassing law.

### A4 — live execution

A selected account/session is actually used in the supported real provider path.

### A5 — integrated product account

User can connect, inspect, rename/label, select, constrain, disconnect, recover, and replace an account through the normal product.

## 11. Routing maturity path

### R0 — legacy behavior characterized

ProviderMux demonstrates multiple strategy families.

### R1 — destination policy defined

User policy semantics and precedence are explicit.

### R2 — candidate resolver

Given capability + context + available realizations + policy, produce a deterministic selection or an explicit unresolved result.

### R3 — governed execution

Selection feeds the ordinary authority/law path. Routing cannot execute directly.

### R4 — evidence

Selection decision and actual realization are distinct, both attributable.

### R5 — product UX

User can inspect and modify routing rules naturally.

### R6 — adaptive

Performance/cost evidence can improve ranking inside the boundaries the user permits.

## 12. Provider/Account/Model/Realization matrix

The product must be able to express cases like:

| Capability | Provider | Account | Model | Realization | Policy |
|---|---|---|---|---|---|
| reasoning | Claude | personal | chosen/default | browser | default for research |
| reasoning | ChatGPT | work | chosen/default | browser | coding in work project |
| message.send | Gmail | personal | n/a | browser | allowed with approval |
| local search | local files | n/a | n/a | deterministic | always preferred |
| browser inspect | Chrome | selected profile | n/a | browser | project-scoped |

The point is not this exact table becoming a database.

The point is that **the product has to be able to represent this relationship without pretending a provider alone is enough.**

## 13. Routing decision record

For any selection that matters, the system should be able to reconstruct:

```
request
capability
context
policy matched
candidates considered
candidates excluded
selection
authority result
realization used
account used
model used
session used
outcome
evidence
```

This aligns directly with the destination principle:

**no mysterious agency.**

## 14. Default V1 implications

D-418/D-420 establish that the shippable V1 substrate is Chrome master/slave and no AI-API realization ships in V1.

That does NOT mean the finished product should expose only one provider choice.

The V1 product layer must be able to ship with a curated default set of free browser-mediated provider/account entry points as product configuration evolves.

Therefore distinguish:

- **shippable substrate:** Chrome master/slave;
- **default V1 capability set:** the bundled user-useful provider/plugins;
- **connected accounts:** the user's actual authenticated relationships;
- **routing policy:** the user's choices among those relationships.

The exact commercial/provider bundle belongs to product release planning, not to the realization contract itself.

## 15. Reconciliation work slices

### Slice RA-1 — Account characterization

Inputs:
- legacy ProviderAccount;
- Chrome profile/fleet;
- credentials law;
- provider realization/session.

Deliverable:
- destination Account semantics;
- relationship graph;
- state/maturity table;
- no code.

### Slice RA-2 — Routing policy characterization

Inputs:
- ProviderMux;
- RoutingPreference;
- priority/cost/fallback/learned behavior;
- D-323 computation routing.

Deliverable:
- policy precedence;
- candidate selection semantics;
- learning boundary;
- unresolved/ask behavior.

### Slice RA-3 — Ω bridge

Inputs:
- ProviderRealization;
- vivim.providers;
- vivim.director;
- credentials;
- browser sessions.

Deliverable:
- exact data-flow mapping from account/policy to realization/session;
- identify missing contracts only where proven necessary.

### Slice RA-4 — Thin falsifier

Test one capability with at least two valid realizations and one explicit user preference.

Prove:
- preference changes selection;
- forbidden candidate is not selected;
- no candidate causes escalation;
- routing cannot bypass law;
- actual realization is recorded.

### Slice RA-5 — Live account proof

Use the V1 Chrome substrate.

Prove:
- selected account/session is the one actually used;
- no silent account substitution;
- release/re-authentication is attributable;
- evidence reconstructs the path.

### Slice RA-6 — Product route surface

Only after the semantic and execution bridge is proven:

- show current choice;
- change choice;
- create routing rule;
- temporarily override;
- inspect why a route was chosen.

## 16. Dependency order

```
Account semantics
      ↓
Provider/Account availability
      ↓
Realization candidates
      ↓
Routing policy
      ↓
Selection decision
      ↓
Authority/law
      ↓
Session
      ↓
Execution
      ↓
Evidence
```

Parallel support:

- P1-03 supplies identity/provenance semantics.
- P1-05 supplies runtime/composition mechanics.
- P1-06 supplies authority.
- P1-07 supplies real provider state.
- P1-08 supplies harvested provider/account behavior.
- D4 owns the product synthesis.

P1-04 is needed when selection depends on current context or user standing intent.

P1-09 verifies the cross-workstream result.

## 17. Immediate outcome

This reconciliation does **not** authorize implementation of a new router yet.

It establishes the seam to implement against:

> **Account is a first-class user-world relationship. Realization is the technical implementation. Routing is user-owned policy over valid realizations. Law remains the authority. Session is execution state. Evidence records what actually happened.**

That is the bridge the destination requires and the current repository is closest to providing.
