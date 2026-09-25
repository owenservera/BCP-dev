# Personal Agent / Self-Knowledge — Working Vision Pass 1

> Classification: DERIVED — PROPOSED / NOT YET CANONICAL
> Date: 2026-09-25
> Lane: research/personal-agent-self-knowledge

This is an opinionated design starting point after repository archaeology. It is not Ω law. It must be reconciled with the World/Object, Product Instance, Agentic Core, provider/account/routing, and external symbolic-language work.

## 1. Core thesis

VIVIM should not be an AI assistant attached to a personal computer. It should be a personal computing environment with a semantic operating interface.

The Personal Agent is the principal-facing intelligence of that environment.

The key separations are:

Canonical Reality = what exists and what happened.
Self-Knowledge = what can be derived and shown about reality.
Personal Agent = the principal-facing actor that helps the user understand and act.
Intent = structured meaning of a request.
Capability = a power that may be invoked.
Authority = what may happen.
Work = durable pursuit of an outcome.
Evidence = what supports a claim that something happened.
Surface = how reality is presented.

No layer above canonical storage should become a competing source of truth.

## 2. What the archaeology says

Ω is already a serious machine-side substrate. It has user-signed Recipe admission, worker-thread isolation, host-side capability-token verification, generation revocation, law-gated risky calls, lazy activation, bounded queues and deadlines, a durable user-owned vault, Merkle-linked history, recovery/export/import, a self-model plugin, deterministic NCLL, 17 symbolic families, Intent persistence and traces, principal-owned lexical customization, agent identity/delegation, discovery/inference/verification/healing, and a growing execution substrate.

Ω is not yet the full VIVIM product. The important missing product depth is around first-class account experience, provider/model/account/session routing, broad canonical world coverage, durable Work as the universal execution subject, general multi-step agency, background continuity, attention, native Windows and desktop reality, multi-device continuity, and complete product lifecycle.

Legacy is the behavioral mine that proves those product concerns existed in executable form. It contains a large conversation/send pipeline, episodic/semantic/procedural memory, context detect/recall/rank/budget/inject, workflow DAG execution with human loops, autonomous tasks with budgets and approvals, multi-provider mux strategies, discovery/onboarding/healing, workspace presets, notifications, and a large surface/API/MCP/CLI ecosystem.

Therefore:

Ω has architectural depth.
Legacy has behavioral breadth.
The destination needs both.

## 3. The primitive I favor

I think the fundamental primitive is addressable reality, not the agent.

Anything the person can meaningfully ask about or act upon should be addressable in one semantic system.

That includes Objects, Relationships, Capabilities, Work, Principals, Accounts, Sessions, Resources, Policy, Evidence, Language, and Surfaces.

The Personal Agent does not own these. It resolves and operates over them.

## 4. Self-Knowledge is a query algebra

I would avoid making the long-term interface a pile of separate noun-specific commands such as self.plugins, self.capabilities, self.history, self.config.

Instead, the semantic vocabulary should be compositional.

Core query meanings to investigate:

DESCRIBE
INSPECT
LIST
FIND
STATUS
COMPARE
DIFF
HISTORY
DEPENDENCIES
IMPACT
TRACE
EXPLAIN
EVIDENCE

The target supplies the subject. The query semantics supply what is being asked.

Examples are conceptual, not claims about implemented syntax:

? @vivim → capabilities
? @vivim.run → dependencies
? @work:123 → status
? @decision:42 → evidence
? @plugin:foo → configuration

Changes should continue through normal Intent and Work semantics rather than a special self-knowledge mutation path.

## 5. Personal Agent identity

The Personal Agent should be a product role and actor associated with one Product Instance and one principal, not another database and not a special authority.

The reasoning resources behind it are replaceable.

Conceptually:

Principal → Product Instance → Personal Agent identity/role → deterministic substrate → optional AI reasoning resources → Intent/Work.

The AI model may propose language, plans, summaries, or explanations. It must not become the parser of record, authority source, canonical self-model, or durable truth store.

## 6. Work should be the center of action

The repository already contains many things that look like execution: intents, agent.exec, director ticks, workflow executions, autonomous tasks, scheduler mechanisms, and run.submit.

The destination should resist making any one of those the ultimate object being done.

Work should mean durable pursuit of an outcome.

A Work can reference a Plan, Steps, Attempts, Agents, Capabilities, Realizations, Human Gates, Evidence, Results, and Artifacts.

This makes questions such as “what are you doing?”, “why did you stop?”, “continue that”, and “what changed?” natural.

## 7. Self-Knowledge must be recursively inspectable

A person should be able to ask:

How did you interpret that?

The answer should be reconstructable from the actual semantic trace:

utterance → normalization → symbols → frames → grounded references → candidates → resolution → authority → work → result → evidence.

Existing NCLL tracing and D-434 Intent debugging are therefore not peripheral developer features. They are the foundation for an accountable Personal Agent.

Likewise:

What are you? should resolve to agent/product identity.
What can you do? should resolve to live composition/capability reality.
Why could you not do that? should resolve to actual resolution, authority, resource, or freshness state.
What are you doing? should resolve to current Work.
What happened? should resolve to evidence.

## 8. Plugin self-description

Ω already has most of the ingredients.

A normal plugin should become understandable by generic machinery from its manifest, grants, contributions, dependencies, requested capabilities, runtime/budget, content identity, generality evidence, and language contributions.

Desired propagation:

plugin installed → contribution discovery → canonical facts → self-knowledge projection → language availability → Personal Agent can explain/use it.

No bespoke Personal-Agent adapter should be normal plugin integration.

## 9. Symbolic language

I think the 17 symbols are potentially VIVIM's semantic punctuation, not merely shorthand:

@ reference
? query
/ command
∆ change
+ add
- remove
& combine
→ direction
$ binding
% configuration
= definition/teaching
✓ confirmation
! force
^ priority
~ approximate
# tag
* wildcard

Their grammar should remain stable where possible. Meanings, frames, vocabulary, and principal-owned language should remain data.

Natural language and symbols should be two views of one semantic representation, with structured Intent as the bridge.

The typing experience should eventually make that relationship visible:

send this to Peter
→ /send @this → @peter-miller
→ Send the latest message to Peter Miller

The user learns the machine language while using the machine.

## 10. Trust model

A meaningful self-answer should be a small structured evidence product:

claim + basis + freshness + provenance + authority + conflicts + optional next action.

The UX should not merely show a trust badge. It should let the person inspect why the system said what it said.

The existing self-knowledge freshness result should be absorbed here: a persisted derived view is only CURRENT after comparing its recorded basis with current canonical basis. Time is metadata; cached freshness is not proof.

## 11. Product metaphor

I would describe VIVIM as a semantic operating environment for a person's digital life.

The Personal Agent is the conversational controller.
The Canvas is a spatial view.
The Vault is durable user-owned storage and evidence.
The capability/runtime layer is executable affordance.
Law is the authority boundary.
Work is durable action state.
NCLL is semantic language.
Provider/account/session is the bridge to external reality.
Forge is how the environment extends and repairs itself.

VIVIM is the composition, not one of these subsystems.

## 12. The strongest design test

Do not make the first proof “can VIVIM list its plugins?” That is too easy.

Make the design capable of answering:

What are you doing right now, why are you doing it, what can still happen, what is preventing it, and what evidence supports that answer?

That single question crosses Product Instance, World, Work, Agent, Intent, Capability, Routing, Authority, Resource/Session, Evidence, and Self-Knowledge.

If that can be answered honestly from live canonical reality, the Personal Agent is probably sitting at the correct seam.

## 13. Falsifiers

The vision should fail if:

- a normal new plugin needs a bespoke self-knowledge adapter;
- “what can I do?” can only be answered from cached documentation;
- dependency impact requires a manually maintained table;
- Personal Agent action can bypass normal authority;
- an LLM is required to determine executable Intent;
- “why?” can only be answered from prose generated after the fact;
- a self-view can claim currentness without checking its basis;
- a person cannot inspect how their natural language became Intent;
- “what are you doing?” requires reconstructing logs instead of reading Work;
- replacing the Personal Agent destroys canonical user data.

## 15. Spatial Intent Circuit — adopted design input

The Spatial Intent Circuit is now part of this working vision.

It is the visible, writable projection between deterministic Intent/Plan state and presentation. Its deepest purpose is pre-execution assurance: the person should be able to see what will happen before it happens.

The circuit introduces no new authority and no shadow world. Its state is derived from canonical semantics:

- glyph from LangOpFrame.family;
- socket from LangFrameSlot.kind;
- epistemic ring from interpretation/binding state;
- risk ring from RiskClass;
- candidate ordering from resolver ranking;
- binding rays from canonical object IDs;
- circuit edges from PlanTemplate dependencies;
- gates from law/consent state;
- execution state from Work/Plan execution;
- provenance from canonical revision/evidence references.

The dual-ring principle is particularly important: certainty is independent from safety. A VERIFIED target may still carry an EXTERNAL_MUTATION lock.

Ambiguity is a manipulable cardinality state rather than an error. Missing arguments are sockets. Large result sets become query sockets. Downstream plan steps become blocked when upstream resolution is unresolved. Simple commands remain visually simple; multi-step commands earn the expanded circuit.

The circuit is bidirectional: direct manipulation must update semantic Intent/Plan state, and text edits must invalidate stale bindings. The target property is structural round-trip equivalence between parsed canonical form and the manipulated circuit.

The circuit is also a security boundary: grounded payloads remain inert data and are never reinterpreted as instructions.

The full adopted integration note is docs/destination/personal-agent/SPATIAL-INTENT-CIRCUIT-INTEGRATION.md.

## 16. Revised product loop

With Spatial Intent included, the product loop is now:

address → interpret → ground → visibly compile → correct/confirm → authorize → create/continue Work → execute → evidence → update World → surface continuity

This is the bridge between the Personal Agent and the Canvas.

The Personal Agent supplies conversational agency. The Spatial Intent Circuit supplies visible semantic control. Neither becomes canonical truth.

## 17. Stronger falsifier

The most valuable early destination proof is now: send this to Oscar, with multiple Oscar contacts.

The system should visibly show the action, ambiguous target candidates, live canvas bindings, verification/proof state, external-mutation risk, consent gate, and downstream execution state before any send occurs.

A second stage should prove the same semantic path with a multi-step request, where the compact circuit expands only because the plan is actually multi-step.


## 14. Unresolved by design

This pass does not settle the final World/Object relationship contract, Product Instance activation/lifecycle, exact Work namespace/contracts, Personal Agent persistence boundary, exact symbolic introspection grammar, the owner's external symbolic material, generic dependency traversal semantics, cross-provider account/session/routing, the final answer envelope, external observation freshness, cross-domain conflicts, product UX, or Windows/desktop substrate.

Those are explicit next design problems, not reasons to invent hidden semantics.

## 15. Status

PROPOSED. This is the working vision for the next convergence pass, not architecture law.
