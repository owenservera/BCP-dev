# D3 — Interaction, Intent & Durable Work Reconciliation

> Classification: DERIVED — WORKING DESIGN / RESEARCH
> Status: initial destination reconciliation.
> Scope: connect the universal interaction layer, deterministic intent system, provider/account routing, authority, agents, and durable work into one product path.

## 1. Destination requirement

The person should not need to understand the machinery required to accomplish an outcome.

They should be able to say:

> "Send an update on Project X to John using my usual AI."

The environment should transform that request into understandable, governed work.

The destination path is:

```
ADDRESS
  ↓
INTENT
  ↓
CONTEXT
  ↓
CAPABILITY
  ↓
CHOICE / ROUTING
  ↓
AUTHORITY
  ↓
WORK
  ↓
EXECUTION
  ↓
EVIDENCE
  ↓
MEMORY / WORLD UPDATE
```

This is the product-level spine connecting the previous D2 and D4 reconciliations.

## 2. Existing material

### Ω

- NLCL deterministic parser and WorldModel.
- Intent IR and resolution.
- visual interpretation/effect preview.
- capability registry.
- D-323 computation routing.
- law/consent.
- agent identity/delegation.
- `Outcome` and evidence vocabulary.
- append-only vault/event model.
- director rule/automation path.

### VIVIM mine

- NLCL categories/executors.
- provider routing/mux.
- capability resolution.
- automation/workflow.
- agent execution.
- background/scheduler machinery.
- conversation operations.
- plugin builder.

## 3. What the user actually does

The environment needs a small set of understandable interaction modes.

### Ask

A request for information or transformation.

### Do

A request for an action.

### Configure

A request to change how some future behavior works.

### Delegate

A request to perform an outcome over time or without the user's continuous attention.

### Create

A request to make a new thing, composition, capability, or surface.

### Inspect

A request to understand current state, evidence, configuration, or why a decision happened.

These can all use the same address + intent machinery.

## 4. Addressing

The current NLCL already supports grounding against a WorldModel.

Destination addressing must extend naturally to:

- VIVIM;
- current space;
- project;
- conversation;
- person;
- account;
- provider;
- capability;
- agent;
- work item;
- plugin;
- composition;
- surface.

Context should make addresses implicit where safe.

Explicit addressing overrides context rather than becoming a separate interaction system.

## 5. Intent

The current Intent IR is already the right substrate.

The product distinction is:

**what I said** → **what VIVIM understood** → **what it proposes to do**.

The user should be able to see the second and third when ambiguity, risk, or meaningful choice warrants it.

The exact IR stays internal.

## 6. Context

Context is not “all available data.”

It is the evidence-backed subset relevant to this intent.

The context pipeline should therefore use:

- current space;
- current focus;
- active project;
- explicit references;
- relevant work;
- relevant history;
- user-selected constraints;
- routing policy scope.

D-443 remains the deterministic assembly substrate.

Context does not grant authority.

## 7. Capability resolution

Intent resolution must identify one or more semantic capabilities.

Example:

```
"send an update"
    ↓
project.read
content.synthesize
message.send
```

Capabilities should be described in human terms.

Internal op ids remain implementation vocabulary.

## 8. Choice / routing

Use the Provider/Account/Routing reconciliation.

For each capability requiring a realization:

1. determine applicable routing policy;
2. identify valid candidates;
3. apply explicit user constraints/preferences;
4. use permitted fallback/ranking;
5. ask when unresolved.

Routing produces a selection decision.

It never performs the action itself and never grants authority.

## 9. Authority

After intent + capability + routing:

```
WHAT
+
HOW
+
WHO/WHICH
+
MAY I?
```

The law/consent system answers the final authority question.

The user experience should expose:

- what will happen;
- which account/provider will be used;
- whether approval is needed;
- the scope of the action.

Do not expose every internal law rule unless inspecting.

## 10. Work as a first-class product object

This is the largest missing bridge in the current program.

The user delegates an **outcome**, not an implementation procedure.

A work item should be durable enough to survive:

- application restart;
- provider delay;
- user absence;
- partial failure;
- waiting for approval;
- retry;
- provider healing;
- handoff to another agent.

Target lifecycle:

```
DRAFT
→ READY
→ RUNNING
→ WAITING
→ SUCCEEDED
→ FAILED
→ REFUSED
→ CANCELLED
→ REVIEWED
```

Not every path uses every state.

The state is history, not merely UI status.

## 11. Work decomposition

A work item may contain steps:

```
WORK
 ├── intent
 ├── context snapshot/reference
 ├── policy snapshot/reference
 ├── capability requirements
 ├── selected realizations
 ├── approvals
 ├── child actions
 ├── results
 └── evidence
```

The work record should not embed huge payloads if references are sufficient.

## 12. Agent role

An agent is an actor that performs work under authority.

It is not a special UI mode.

An agent may:

- read relevant context;
- invoke deterministic capabilities;
- invoke providers through selected realizations;
- wait;
- retry within policy;
- request approval;
- report results.

The agent must never become the authority source.

## 13. Background behavior

Background work is simply work whose execution continues after the current interaction ends.

This means:

```
user request
   ↓
durable work created
   ↓
user may leave
   ↓
worker/agent/provider executes
   ↓
events/evidence accumulate
   ↓
user returns
   ↓
continuity surface
```

No separate “autonomous AI” architecture is required for this basic loop.

## 14. Evidence and result presentation

At completion, VIVIM should distinguish:

- requested;
- understood;
- authorized;
- attempted;
- actually executed;
- observed result.

For example:

```
Requested:
"Send the Project X update."

Understood:
Project X + John + email + synthesis

Selected:
Claude / Work account / browser

Authorized:
Standing rule allows draft;
external send required approval

Executed:
message.send

Observed:
provider receipt + vault record

Result:
sent
```

This is the user-level form of the evidence discipline already present underneath.

## 15. Failure semantics

Failure should remain typed.

Examples:

- ambiguous intent;
- missing capability;
- no valid realization;
- account disconnected;
- policy forbids action;
- approval required;
- provider unavailable;
- provider drift detected;
- execution failed;
- evidence incomplete.

The user should receive the most useful explanation available, not a generic agent error.

## 16. Product interaction rule

The default experience should optimize for:

**minimal interruption + maximum recoverability.**

That means:

- ordinary READ work should usually be direct;
- reversible/local mutations can often proceed under standing policy;
- external mutations should surface meaningful approval;
- ambiguous or consequential selection should ask;
- long work should become durable background work;
- everything important remains inspectable after the fact.

## 17. Maturity path

### I0 — existing components

NLCL, intent, routing, law, agent, outcomes, evidence.

### I1 — unified semantic path

One request can flow address → intent → capability without parallel resolution systems.

### I2 — routed execution

Provider/account/model choice becomes part of the intent/work path.

### I3 — durable work

The requested outcome becomes a persistent work object with lifecycle.

### I4 — governed execution

Every effect uses the ordinary authority path and records actual realization.

### I5 — background continuity

User can leave and return without losing state.

### I6 — cross-domain composition

One work item can legitimately chain local data + provider reasoning + external mutation.

### I7 — productized interaction

The user experiences one interaction layer across all installed capabilities.

## 18. Critical gaps

### G-I1 — Work object

No single destination-level work object yet binds intent, context, routing, authority, execution, result, and evidence.

### G-I2 — Universal interaction bridge

NLCL/intent exist, but complete-world addressing is not yet one product surface.

### G-I3 — Routing in work

Provider selection is currently separate from durable work semantics.

### G-I4 — Human-visible decision projection

The system has visual intent/effect structures, but the product-level presentation of meaningful choices needs composition.

### G-I5 — Background continuity

Execution machinery exists, but the return experience is not yet integrated.

### G-I6 — Multi-step outcomes

The destination examples naturally require chains of capabilities and provider actions; the current pilot is intentionally much thinner.

## 19. Thin falsifier

Use one request that requires three different capabilities:

> "Summarize the current Project X status and send it to John."

Prove:

1. project context is deterministically assembled;
2. the intent resolves to a multi-capability plan;
3. provider/account routing is selected explicitly;
4. authority is checked after routing;
5. work persists as a durable object;
6. execution produces attributable events;
7. result/evidence can be inspected;
8. the world/project state reflects the completed communication.

This is a much stronger destination test than another isolated operation test.

## 20. Immediate implementation sequence

### D3-1 — Work object characterization

Map current Outcome, intent, agent, director, scheduler, and event records.

### D3-2 — Intent-to-work bridge

Define the smallest durable work envelope that can carry an intent through execution.

### D3-3 — Routing integration

Attach D4 routing decisions to work, preserving user policy and actual realization.

### D3-4 — Authority integration

Ensure work cannot bypass law/consent.

### D3-5 — Evidence/result surface

Expose requested/selected/authorized/executed/observed states.

### D3-6 — Cross-domain falsifier

Prove a multi-step Project X → synthesize → send journey end-to-end.

## 21. Working conclusion

The universal prompt is not a chatbot front-end.

It is the **human entry point into the environment's work system**.

The user expresses an outcome.

VIVIM handles the machinery:

```
address
→ understand
→ gather context
→ resolve capabilities
→ select realization
→ check authority
→ create/execute work
→ verify
→ remember
```

This is the bridge from the existing deterministic NLCL/control-plane work to the actual VIVIM product experience.
