# D5 — Agency, Background Work & Attention Reconciliation

> Classification: DERIVED — WORKING DESIGN / RESEARCH
> Status: initial destination reconciliation.
> Scope: connect existing agent, director, automation, outcome, session, provider, and governance machinery to the persistent-world experience of authorized work continuing over time.

## 1. Destination requirement

The destination is a persistent environment, not a request/response assistant.

The user must be able to say what outcome they want and then leave.

Authorized work may continue.

When the user returns, the environment must provide truthful continuity.

```
INTENT
  ↓
WORK
  ↓
ACTOR
  ↓
CAPABILITIES
  ↓
EXECUTION
  ↓
EVENTS / EVIDENCE
  ↓
WORLD CHANGES
  ↓
ATTENTION
  ↓
RETURN / REVIEW
```

## 2. Existing evidence

Ω already supplies:

- AgentIdentity and BehaviorContract as data.
- delegation records and scope attenuation.
- agent lifecycle states.
- governed execution.
- Outcome vocabulary.
- director rules and deterministic tick.
- computation classification.
- event/ledger discipline.
- session ledger.
- law/consent.
- evolution proposals and promotion/rollback.

The VIVIM mine supplies:

- agent loops;
- automation/scheduler behavior;
- background workers;
- notification/proactive machinery;
- workflow orchestration;
- provider background interaction.

The destination task is to make these one coherent work model.

## 3. Separate four concepts

### Agent

An actor with identity and granted authority.

### Work

The durable outcome being pursued.

### Automation / Standing Intent

A rule or continuing instruction that can create or advance work.

### Attention

The user's configured interest in what the environment should notice, report, or bring forward.

These should not collapse into one “autonomous agent” object.

## 4. The work lifecycle

The previously defined durable work path becomes the backbone:

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

A work item should retain enough references to answer:

- what was requested;
- who requested it;
- what context was used;
- what policy applied;
- what capabilities were required;
- what actor performed it;
- what realizations/accounts were used;
- what happened;
- what evidence supports the result;
- what remains unresolved.

## 5. Agent relationship to work

An agent does not own the outcome.

The work belongs to the user's environment.

The agent is the current actor for some part of that work.

```
USER
 ↓ delegates
WORK
 ↓ executed by
AGENT
 ↓ invokes
CAPABILITY
 ↓ realized by
PROVIDER / LOCAL TOOL
```

This keeps delegation from becoming an alternative authority hierarchy.

## 6. Standing intent

The director currently has a narrow rule model.

Destination standing intent is the larger user concept:

> “Keep watching / doing X under these conditions.”

Examples:

- tell me when this provider is down;
- watch Project X for important changes;
- every Monday prepare a status report;
- when a customer replies, prepare a response;
- while I am away, research this topic and summarize new findings.

A standing intent should be durable user configuration.

It can create work, not directly perform arbitrary effects.

## 7. Attention

Attention is the bridge between the persistent environment and the user's limited time.

An attention instruction should be able to express:

- what matters;
- what event/state makes it relevant;
- how often to check;
- what VIVIM may do automatically;
- what must wait for the user;
- how it should be reported;
- when the instruction expires.

The environment can then derive prioritized attention from:

- explicit standing intent;
- active projects;
- unfinished work;
- provider/account failures;
- pending approvals;
- important external changes;
- newly completed delegated work.

Attention is not authority.

## 8. Background work

Background execution is not a separate architecture.

It is normal work whose execution outlives the current interactive session.

```
User leaves
   ↓
work remains durable
   ↓
worker/agent resumes
   ↓
provider/session may be slow
   ↓
events accumulate
   ↓
results become available
   ↓
attention surfaces the result on return
```

This is particularly important for browser-mediated AI work where the user's web application is slower than an API call.

## 9. Return experience

The product should have one canonical continuity summary.

Conceptually:

```
SINCE YOU LEFT
────────────────
Completed
Running
Waiting for you
Changed
Failed
Found
Recommended next
────────────────
```

Every item should be traceable to work/evidence.

Avoid generic “AI activity” feeds that obscure causality.

## 10. Approval as a work state

Approval should fit naturally into work.

Example:

```
work = send Project X update
status = WAITING
reason = external mutation requires approval
proposal = message draft
action = Approve / Edit / Reject
```

Approval should resume the existing work rather than create an unrelated second workflow.

## 11. Failure and recovery

Background work must expect:

- provider unavailable;
- session expired;
- provider drift;
- account disconnected;
- policy changed;
- capability removed;
- evidence insufficient;
- task contradicted by later state.

The work record should preserve the failure and either:

- retry under policy;
- wait for a user decision;
- re-route when explicitly permitted;
- become refused;
- become repairable;
- terminate.

Do not silently restart under changed authority.

## 12. Existing session ledger connection

D-430 provides a useful development-side analog:

- durable stream;
- timestamped events;
- retrospective;
- bottleneck analysis;
- inspectable closure.

The product's work ledger should apply the same underlying principle:

> work is observable as it happens and reconstructable afterward.

The implementation details need not be identical to the development session ledger.

## 13. Agency boundaries

The destination should expose three ordinary choices:

### Automatic

VIVIM may execute within a standing rule.

### Ask

VIVIM may prepare the action, then wait for approval.

### Not delegable

The action always remains human-controlled.

These can be set at:

- capability;
- project/space;
- provider/account;
- work type;
- standing intent.

The system should show which setting caused the behavior when it matters.

## 14. Agent maturity

### A0 — identity

Persistent agent identity/contract exists.

### A1 — governed action

Agent can execute a bounded capability under its own principal and ordinary law path.

### A2 — durable work actor

Agent participates in the destination Work lifecycle.

### A3 — multi-step work

Agent can chain capabilities while retaining evidence and authority.

### A4 — provider-aware work

Agent can use user-selected provider/account realizations.

### A5 — background work

Agent can continue durable work after the initiating interaction ends.

### A6 — adaptive work

Agent can retry, wait, reroute, or ask based on explicit policy and observed evidence.

### A7 — productized delegation

Normal user can delegate meaningful outcomes without learning agent internals.

## 15. Attention maturity

### T0 — scattered signals

Existing notifications, automation, and proactive features.

### T1 — standing intent semantics

A canonical persistent representation of what the user wants watched/done.

### T2 — work generation

Standing intent creates durable work.

### T3 — prioritization

Attention projection combines explicit standing intent with world/work state.

### T4 — return continuity

Completed/failed/waiting work becomes part of the user's return view.

### T5 — configurable attention

User controls importance, cadence, notification, and delegation boundaries.

### T6 — sovereign continuity

Attention remains local, inspectable, portable, and explainable.

## 16. Critical gaps

### G-A1 — durable work object

Still the central missing integration object.

### G-A2 — standing-intent model

Director rules are narrower than the destination concept.

### G-A3 — attention model

No single semantic layer currently unifies interest, watching, reporting, notification, and background work.

### G-A4 — multi-step agent work

Current proof is deliberately narrow; the destination scenario needs compositional work.

### G-A5 — return continuity surface

The machinery exists, but the canonical product experience does not.

### G-A6 — account/session continuity

Background work must preserve the selected account/realization without silently changing identity.

### G-A7 — recovery policy

Provider drift, failure, and policy changes need a product-level work recovery model.

## 17. Thin falsifier

Create a work item:

> “While I’m away, monitor Project X for important updates. If one appears, research it using my configured provider, prepare a summary, and tell me when I return.”

Prove:

1. standing intent creates durable work;
2. work runs without the interactive session;
3. project context is reconstructed;
4. provider/account routing follows D4 policy;
5. agent operates under explicit authority;
6. work pauses rather than crosses an approval boundary;
7. events/evidence accumulate;
8. user return produces a truthful continuity summary;
9. all actions remain inspectable.

This is the destination test for persistent agency.

## 18. Immediate implementation sequence

### D5-1 — Work/agent mapping

Map Outcome, agent identity, delegation, director, automation, scheduler, event, and session structures.

### D5-2 — Standing-intent characterization

Map director rules and legacy automation into the broader destination concept without widening the director prematurely.

### D5-3 — Attention projection

Define how standing intent + work + world changes become user attention.

### D5-4 — Background execution

Connect durable work to daemon/worker/provider session behavior.

### D5-5 — Return continuity

Build the canonical “since you left” projection over real evidence.

### D5-6 — Multi-step agency falsifier

Run the Project X monitoring/research/summary scenario.

## 19. Working conclusion

The destination does not need an “autonomous AI” layer.

It needs a **durable work system with governed actors and explicit attention**.

That lets the product feel autonomous while preserving sovereignty:

```
USER
  ↓
standing intent / delegation
  ↓
WORK
  ↓
AGENT + CAPABILITIES
  ↓
PROVIDER / LOCAL REALIZATIONS
  ↓
EVIDENCE
  ↓
ATTENTION
  ↓
USER
```

The user remains the source of delegation and policy.

The environment supplies persistence, execution, continuity, and evolution.
