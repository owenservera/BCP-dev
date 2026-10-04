# Ω Autonomous Build — Project Instructions

Read START-HERE.md, PROJECT-CONTEXT.md, VISION.md, BUILD-FOCUS.md, and AUTONOMY.md before making architectural commitments.

This is a fresh autonomous build project seeded with the current VIVIM-Ω implementation baseline. The baseline is a starting implementation and evidence source, not a frozen architecture and not a prewritten roadmap.

## Operating mandate

Build the best shippable VIVIM-Ω implementation that satisfies the project vision and produces a working beta. Discover the actual state of the seeded code first. Then decide what the product needs, what the architecture needs, and what development machinery you need.

You may create whatever development structure the work requires: agents, subagents, departments, workstreams, workflows, task systems, memory/context systems, test harnesses, research tracks, or other tooling. None of those structures are preinstalled here on purpose.

Do not import or recreate the old BCP-dev ZCode/OpenCode team architecture merely because it existed before. Re-derive your development organization from the work.

The strategic model is deliberately worker-neutral. A Dot, Codex, ZCode agent, model, specialist process, human, or future worker is an execution resource, not the identity of the user's responsibility.

You have explicit authority to change Ω itself. This includes code, contracts, plugin boundaries, runtime choices, schemas, architecture, and—when evidence demonstrates that the current direction is wrong—the project vision or its constitutional assumptions. Do not preserve a design solely because it appears in the baseline.

## First action

Before building a large feature, perform an autonomous orientation pass:

1. Read this project-level seed documentation.
2. Inspect the entire Ω baseline and its existing tests and gates.
3. Read the detailed Ω vision and the current invariant and decision material in docs.
4. Build an accurate map of what is implemented, what is partial, what is aspirational, and what is obsolete.
5. Identify the smallest set of load-bearing gaps and risks that determine the build order.
6. Create your own execution model and begin the highest-value work.

During that orientation, explicitly map:

Intent → Truth → Authority → Capability → Worker → Realization → Proof.

Determine which parts of that chain are already strong, which are incomplete, and which are accidentally coupled.

Do not ask the owner to supply a roadmap that the repository can derive. Ask only when a genuinely external, destructive, legal, financial, security-sensitive, or product-authority decision cannot be resolved by evidence and reversible experimentation.

## Product-direction guardrails

The following are current product direction, not invitations to silently drift:

- VIVIM-Ω is a personal operating environment for a person's digital world, not a conventional SaaS application.
- The user's data, state, capabilities, evidence, and memory belong in the local sovereign environment.
- Vault is the durable source of truth; derived surfaces are projections.
- Law, authority, provenance, consent, and refusal are first-class system concerns.
- Natural-language interaction must separate probabilistic perception from deterministic intent and deterministic execution.
- Raw model output is never constitutional authority.
- Plugins and compositions are the primary extensibility mechanism.
- The Forge is part of the product's ability to extend itself; generated artifacts need proof, provenance, and an honest trust/generalization story.
- The current shippable V1 provider substrate is Chrome master/slave (provider.browser); do not casually reintroduce an AI-API execution dependency into the shippable product.
- The canvas is a projection/surface over authoritative state, not the authority itself.
- A worker is not the canonical identity of work. Responsibilities must survive worker replacement where the product semantics require it.
- Fail closed when authority, provenance, capability, or execution guarantees cannot be established.

These statements may themselves be changed, but only because the build discovers stronger evidence or a better product truth.

## Evidence discipline

Prefer measured behavior over prose claims. Prefer existing tests and gates over assumptions. When changing a load-bearing invariant, add the smallest falsifying test or measurement that can prove the old assumption wrong.

Keep the project's own documentation honest as the implementation evolves. Supersede stale architectural claims rather than silently leaving contradictory instructions behind.

The baseline already contains a mature gate and test system. Use it. Do not weaken tests, bypass gates, or reshape the architecture merely to make a report look green.

When a worker produces a claim, keep separate:
- the worker's assertion;
- the evidence supporting it;
- the canonical representation accepted by Ω;
- the authority that admitted it.

When a worker changes or disappears, preserve enough durable state for another worker to continue without treating the previous worker's private memory as canonical.
