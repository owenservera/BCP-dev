# Invariants — Seed-Level Product and Architecture Guardrails

## Status

These are inherited working invariants distilled from the Ω baseline, destination corpus, prior VIVIM evidence, and recent development-learning work.

They are not a frozen implementation specification.

They exist to prevent the fresh build from repeatedly rediscovering high-cost lessons or silently collapsing distinctions that matter to the product.

When evidence proves an invariant wrong, the project may change it through explicit reasoning and preserved lineage.

## Sovereignty

VIVIM is a user-owned local environment.

The user's machine, durable local state, accounts, data, applications, interaction, and rules are part of the product's sovereignty proposition.

External providers remain external.

VIVIM should own the local relationship and authorized interaction around an external provider without pretending to own the provider itself.

## Canonicality

There should be a clear answer to “what is the source of truth?”

Do not allow a projection, cache, summary, session, model context, browser observation, or UI arrangement to become canonical merely because it is convenient.

The intended conceptual distinction is:

- **Vault:** durable canonical local truth.
- **World:** meaningful projection/organization of canonical things and relationships.
- **Work:** durable process reality.
- **Evidence:** record supporting claims about what happened.
- **Surface:** representation and interaction.
- **Context:** task-scoped derived assembly.
- **Process/session:** transient execution mechanism.

A surface may disappear.
A worker may disappear.
A process may restart.
The user's canonical meaning should not disappear with them.

## Semantic separations

Do not casually collapse:

| Keep distinct | Principle |
|---|---|
| Reality / Representation | a representation is not the thing |
| Evidence / Authority | proof does not grant permission |
| Intent / Execution | what was meant is not what was done |
| Capability / Realization | semantic ability is not an implementation |
| Provider / Account | external service is not the user's relationship to it |
| Account / Session | durable relationship is not transient execution state |
| Discovery / Routing | knowing what exists is not choosing among it |
| Routing / Authority | selecting a realization is not permission to act |
| Memory / Context | durable retention is not temporary task assembly |
| Work / Worker | durable work is not the actor performing it |
| World / Surface | UI projection is not canonical state |
| Space / World | organization is not a second database |
| Confidence / Proof | plausibility is not evidence |
| Construction / Authority | creating something does not authorize it |
| Activity / Progress | more activity is not more value |
| Successful execution / Correct outcome | a completed mechanism can still produce the wrong result |
| Product importance / Kernel necessity | important does not mean it belongs in the constitutional core |

These distinctions may be implemented differently over time. The relationships they protect are the important part.

## Human semantic control

Natural language is an interaction medium, not authority.

The long-term target is:

**human expression → semantic interpretation → explicit meaning → governed execution**

AI may be used where uncertainty, inference, synthesis, discovery, or other probabilistic work adds value.

The resulting consequential meaning must become explicit enough for the deterministic parts of the system to govern.

Raw model output never becomes constitutional authority by itself.

When meaningful ambiguity remains, the environment should clarify, narrow, or refuse rather than silently invent certainty.

## One semantic operation, many surfaces

Language, canvas, CLI, MCP, automation, agents, and future surfaces should converge on the same underlying semantic operations.

Different surfaces may differ radically in presentation.

They should not silently create separate execution or authority systems.

## Work and agency

Work is the durable unit of consequential activity.

A worker, agent, model, browser session, or process is a replaceable actor or mechanism over that work.

Consequential work should remain understandable and reconstructable across interruption, process death, worker replacement, and external delay where the runtime can reasonably preserve the necessary evidence.

Completion should be positively evidenced where knowable.

Disappearance of a process is not proof of completion.

An uncertain external effect should be treated as uncertain until reconciled; blind retry is not a substitute for knowledge.

## Authority and refusal

Authority should be explicit, attributable, and scoped.

The system should be able to answer, for consequential activity:

- what was requested;
- what was understood;
- what capability was selected;
- which provider/account/realization was involved;
- what authority applied;
- what was attempted;
- what actually happened;
- what remains uncertain.

Refusal is a legitimate system outcome, not an implementation failure to hide.

No component should gain authority simply because it is first-party, generated by Forge, trusted historically, or successful previously.

## Evidence and learning

Evidence should survive long enough to support the claims that depend on it.

Observation, hypothesis, caveat, rule, and proof are different epistemic categories.

A useful engineering rule should be actionable, testable, falsifiable, and connected to behavior the system can actually change.

Rules should be retired or superseded when they become inert, unreachable, contradicted, or no longer useful.

More executions, more rules, more agents, or more code are not evidence of improvement.

A system change should, where measurable, be evaluated for whether it actually changed the behavior it was intended to change.

## Extensibility

Replaceable or extensible capabilities and product contributions should enter through explicit boundaries.

“Everything is a plugin” does not mean every byte or every world object is a plugin.

It means meaningful replaceable capability and product behavior should not require secret privileged paths.

First-party and third-party extensions should be governed by the same essential boundary principles.

Forge is an extension mechanism, not a second authority system.

Construction does not confer trust or authority; admission, governance, evidence, and lifecycle still apply.

## Core minimality

Fundamental to VIVIM does not mean fundamental to the kernel.

A responsibility should move toward the constitutional kernel only when the build can show that it is necessary for arbitrary extensions to exist safely, non-bypassably enforceable there, domain-neutral, broadly applicable, constitutionally stable, minimal, and free of product semantics.

Otherwise it remains a candidate for contracts, plugins, compositions, or tooling.

The exact current K0/K1 boundary must be re-validated against the live system.

## Continuity and replacement

User-owned identity, canonical state, useful relationships, Work history, evidence genealogy, and compatible configuration should survive replacement of transient mechanisms and replaceable implementations.

A replacement may invalidate compatibility.

That is a reason to expose the incompatibility and preserve recoverability, not to silently rewrite history.

A rollback is not equivalent to deletion.

Retiring a mechanism should not erase the evidence that the mechanism once produced.

## Evolution

The environment should become easier to change without becoming less trustworthy.

Important change should remain attributable, impact-aware, appropriately authorized, verifiable, and recoverable.

The exact change pipeline may evolve.

The invariant is that self-improvement cannot silently turn into self-granted authority.

Constitutional change is a different category from ordinary product evolution and must not be self-authorized by the ordinary machinery it governs.

## No mysterious agency

Consequential behavior should make actor, capability, authority, scope, and outcome discoverable enough for the person and for the system to reason about them.

The complexity of achieving this may be substantial.

That complexity should remain underneath the human mental model.

## Exit

The person should be able to leave, export, restore, reconstruct, replace, and reconfigure the environment without surrendering the meaning of their world to an opaque external owner.

The exact export format is not the invariant.

Recoverable ownership is.

## Small falsifiers over large ceremonies

When an important claim is uncertain, prefer the smallest experiment that could prove it wrong.

Do not equate documentation volume, process complexity, test count, or organizational structure with rigor.

The fresh project should continually seek compact evidence that invalidates bad assumptions early.
