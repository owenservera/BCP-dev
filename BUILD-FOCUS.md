# Build Focus — Revised for the Multi-Worker World

These are focus areas, not a prescribed roadmap. They tell the autonomous build where deeper investigation, parallel reasoning, stronger falsifiers, and disproportionate engineering attention are likely to pay off.

This version deliberately treats autonomous workers as an external and interchangeable population. A worker may be a Dot, Codex, ZCode agent, Claude/Gemini agent, local model, human, or something not yet imagined. Ω must not become identified with any one of them.

The project should continuously re-rank these areas from evidence.

## 1. Ω as the sovereign control plane

**Focus:** Intent → Truth → Authority → Capability → Worker → Realization → Proof.

This is now the central architectural question.

Ω should own the responsibility and its meaning. Workers execute responsibilities on Ω's behalf; realizations provide ways to make changes in the real world; evidence proves what actually happened.

The key invariant to test relentlessly is:

**the worker is replaceable; the responsibility is not.**

A change of worker must not change the identity of the work, its authority, its accumulated evidence, its lineage, or its recoverability.

Watch for accidental designs where a model, agent, conversation, browser session, or UI becomes the canonical identity of work.

## 2. Work continuity across worker replacement

**Focus:** durable Work/Responsibility identity, state, plans, attempts, handoffs, worker assignment, replacement, resumption, cancellation, and outcome history.

A piece of work should survive:

- model replacement;
- agent replacement;
- crashed workers;
- changed execution substrates;
- changed interfaces;
- context compaction;
- long gaps in time.

The system should be able to say:

"this responsibility is still the same responsibility, although Worker A stopped and Worker B continued."

This is where data continuity becomes operational rather than philosophical.

The load-bearing falsifier is worker substitution without semantic loss.

## 3. Truth, evidence, provenance, and canonical representation

**Focus:** separating:

**EVIDENCE ≠ REPRESENTATION ≠ DESCRIPTION ≠ AUTHORITY**

A worker claim is not a fact merely because the worker is capable or confident.

Ω should preserve:

- what a worker claimed;
- what source or observation supports it;
- the canonical representation currently accepted;
- who or what had authority to admit it;
- how the representation can be reconstructed;
- what changed when a claim was rejected, superseded, or corrected.

Treat provenance, replay, and explainability as product capabilities.

This becomes especially important when many heterogeneous workers produce competing interpretations.

## 4. Realization independence and the sovereign edge

**Focus:** the boundary between abstract capability and real-world execution.

A capability should be separable from the mechanism that realizes it:

**capability → realization**

Examples include Chrome/browser interaction, local files, desktop applications, APIs, shell tools, MCP services, cloud computers, or human action.

The current shippable direction remains browser-mediated Chrome master/slave rather than an AI-API execution dependency.

But the deeper architectural goal is broader:

**Ω should be able to swap realizations without changing the identity or authority of the underlying responsibility.**

The browser is not truth. A selector is not truth. A worker's interpretation of a webpage is not truth. The realized action and its evidence are what matter.

## 5. Context, knowledge, and handoff portability

**Focus:** giving any worker the right context without making that worker the owner of the context.

This includes self-knowledge, context assembly, task briefs, relevant history, evidence references, constraints, capabilities, and handoff state.

The desirable pattern is:

**Ω owns context continuity → workers receive task-specific views.**

A replacement worker should be able to continue meaningful work without inheriting an opaque private memory blob from the previous worker.

Context should be reconstructable, scoped, and evidence-linked.

This is also where Ω's emerging "self-knowledge" concept matters: the environment should be able to explain itself to whichever worker currently operates within it.

## 6. Capability and Forge economics

**Focus:** turning capabilities into portable, governable Lego rather than creating ever more bespoke agents.

The important unit is no longer primarily "an agent."

It is a capability/responsibility definition with:

- input contract;
- output contract;
- authority requirements;
- capabilities required;
- acceptable realizations;
- worker requirements or preferences;
- evidence requirements;
- escalation rules;
- fallback behavior;
- provenance;
- tests/falsifiers.

The Forge should help produce and prove these pieces.

The strategic question is whether a capability can be moved between workers and environments without being rebuilt around each worker.

Avoid creating another privileged SDK-like agent layer.

## 7. Authority, identity, trust, and governed change

**Focus:** stable identity of people, responsibilities, capabilities, workers, realizations, and consequential changes.

Merge the old identity/trust and adaptation concerns here.

The system needs clear answers to:

Who is acting?

For whom?

Under what authority?

Through which worker?

Using which realization?

With what evidence?

What is allowed to change automatically?

What requires explicit approval?

How is rollback represented?

Self-change should remain possible, but it must not create a hidden route around the authority model.

The worker itself should not become a privileged authority merely because it is persistent.

## 8. Runtime containment, failure, and resource economics

**Focus:** workers and realizations as unreliable, replaceable resources.

Expect:

- hung workers;
- crashed workers;
- duplicated attempts;
- partial execution;
- stale context;
- unavailable browsers;
- external service changes;
- resource pressure;
- disconnected machines.

The architecture should make replacement normal rather than exceptional.

Measure containment, recovery, retry behavior, resource budgets, and sibling impact.

Do not build theoretical sandbox machinery without a concrete product or failure requirement.

## 9. Surfaces as control and observability, not alternate systems

**Focus:** language, canvas, CLI, MCP, dashboards, and future interfaces as projections of the same governed state.

A surface should let a person understand:

- what responsibility exists;
- who/what is working on it;
- what the worker claimed;
- what is verified;
- what is waiting;
- what is blocked;
- what authority is required;
- what happened in the real world.

The surface must not become a competing source of truth.

This also gives the "agent activity dashboard" a more durable meaning: it is an Ω control/observability surface, not a UI specifically for one agent framework.

## 10. Product coherence and beta reality

**Focus:** demonstrate the model with a small number of high-value end-to-end responsibilities.

The first compelling product experience should prove:

**human intent → Ω responsibility → worker → realization → evidence → canonical outcome**

The worker can change during the journey.

The realization can change where possible.

The interface can change.

The responsibility and its evidence should survive.

Do not optimize for number of agents, number of integrations, number of plugins, or documentation volume.

The final test remains:

**Can a real person entrust Ω with something meaningful, leave, return later, understand what happened, and continue without losing the thread?**

## Cross-cutting questions

- Who owns the responsibility?
- Is the worker merely executing it?
- What exactly is known, and what is merely claimed?
- What evidence admitted the claim?
- Can another worker continue without losing meaning?
- Can the realization be swapped?
- Where is authority evaluated?
- What survives a crash or replacement?
- Can this capability be expressed as portable Lego?
- Is this generic infrastructure or a special case for today's worker?
- Can the claim be falsified cheaply?
- Is Ω still sovereign if the worker disappears?

These questions should be applied continuously rather than turned into a separate governance ceremony.
