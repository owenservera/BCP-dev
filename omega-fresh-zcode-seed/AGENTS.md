# Ω Autonomous Build — Project Instructions

Read `START-HERE.md`, `VISION.md`, `PRODUCT-ANCHOR.md`, `INVARIANTS.md`, `PROJECT-CONTEXT.md`, `BUILD-FOCUS.md`, `AUTONOMY.md`, and `ZCODE-CAPABILITY-SPACE.md` before making major architectural commitments or designing the development system.

This is a fresh autonomous build project seeded with the current VIVIM-Ω implementation baseline. The baseline is a starting implementation and evidence source, not a frozen architecture and not a prewritten roadmap.

## Operating mandate

Build the best shippable VIVIM-Ω implementation that expresses the durable product vision and produces a working beta.

Start by understanding reality.

Then decide what the product needs, what architecture best expresses it, and what development machinery will increase throughput and quality.

You may create whatever development structure the work requires: agents, subagents, departments, workstreams, workflows, task systems, memory/context systems, test harnesses, research tracks, or other tooling.

None of those structures are preinstalled here on purpose.

Do not import or recreate the old BCP-dev ZCode/OpenCode team architecture merely because it existed before. Re-derive your development organization from the work.

You have explicit authority to change Ω itself, including implementation, contracts, plugin boundaries, runtime choices, schemas, architecture, surfaces, and—when evidence demonstrates that the current direction is wrong—the project's vision or assumptions.

## First action

Before building a large feature:

1. Read the seed documents.
2. Inspect the whole seeded Ω baseline and its tests, fixtures, gates, contracts, and detailed docs.
3. Establish what is actually working, what is partial, what is aspirational, and what is historical.
4. Identify the smallest complete product journey that creates real value and learning.
5. Identify the few load-bearing gaps and risks around that journey.
6. Create the development organization and execution model that the evidence warrants.
7. Begin implementation and proof.

## Required development organization at bootstrap

The fresh project is not expected to begin as a flat collection of agents. At bootstrap, establish a small set of durable core workstreams with accountable heads of department/workstream. The exact organization is deliberately discoverable, but the coverage should normally include:

- R&D / Research & Architecture Discovery — investigates uncertain technical, architectural, model, provider, and capability questions and turns useful findings into actionable proposals or experiments.
- Product Development / DevOps Efficiency — owns implementation throughput, developer experience, automation, build/test performance, tooling leverage, and the continuous reduction of development friction.
- Project Management / Governance — owns cross-workstream coordination, priorities, dependencies, delivery state, decisions, escalation, and project-level operating integrity.
- Truth / Quality / Verification — independently challenges claims, validates work, tracks proof gaps, and prevents “implemented” or “green” from being mistaken for “correct”.

Create additional heads only where the work demonstrates a persistent need. A head is accountable for the health and throughput of its workstream; it is not a constitutional authority over the project. The project may split, merge, replace, or retire workstreams as evidence changes.

Every head should have a clear communication home in a shared project **Commons** system. At minimum, provide a project-wide commons plus durable workstream rooms, with mechanisms for requests, handoffs, blockers, decisions, escalations, and cross-workstream coordination. Important communication should be discoverable and reconstructable rather than trapped in ephemeral agent context.

Development work should be able to trigger the appropriate head/workstream automatically when defined conditions occur: a new user objective, detected failure, verification gap, research question, dependency or integration conflict, stale or blocked work, scheduled maintenance, or another condition the project explicitly chooses to automate. Automatic triggering must route work to accountable owners; it must not grant hidden authority. Human-authority boundaries, consequential external effects, and constitutional changes remain governed.

## Bootstrap from available capability, not repeated rediscovery

Do not spend the opening phase manually rebuilding knowledge that is already available through the seeded ZCode capability map, installed project skills, available plugins, accessible MCP servers, ZCode-native documentation or help, and reusable development capabilities already present in the runtime.

At bootstrap, inventory those capabilities, map them to the development organization's needs, and use them as prior knowledge. Re-verify facts that are runtime-specific, version-sensitive, permission-sensitive, or materially uncertain. The goal is rapid capability leverage, not blind trust: exploit what is already known, then spend investigation effort where uncertainty actually matters.

Before creating a new skill, plugin, MCP integration, workflow, dashboard, agent role, or automation, check whether an adequate capability already exists. Prefer composing existing capabilities over recreating them.

Do not ask the owner to supply a roadmap that the repository and the product anchor can derive.

Ask only when a genuinely external, destructive, legal, financial, security-sensitive, or product-authority decision cannot be resolved by evidence and reversible experimentation.

## Strategic design mandate

Autonomous implementation should optimize for more than immediate correctness.

Prefer **capability multipliers**: solutions that make future capabilities, providers, surfaces, or realizations easier to add, replace, repair, and govern.

When a concern repeatedly appears across independent product areas, consider whether it deserves an **upgradeable engine boundary**. Candidate engine status is earned by evidence of cross-cutting leverage; it does not imply constitutional-core status.

Never treat the first successful mechanism as the final architecture. A first provider adapter, protocol manager, browser realization, selector repair path, self-healer, worker, or model integration is a proving implementation. It should be challenged by a second materially different use case or realization before being allowed to shape durable abstractions.

In particular:

- provider/protocol infrastructure should generalize across providers, protocols, versions, accounts, and realizations rather than encode one provider's quirks;
- self-healing should be a general recovery capability with observation, diagnosis, governed change, verification, evidence, and bounded learning, with provider-specific repair strategies kept inside that boundary;
- semantic contracts should remain separable from replaceable realizations;
- mechanism, capability, policy, authority, evidence, and learning should remain distinguishable;
- important engines should have an upgrade/replacement path;
- claimed architectural improvement should show measurable leverage where feasible.

Use the progression:

**concrete case → repeated pattern → reusable capability → engine candidate → validated upgradeable engine**

Do not manufacture abstraction for hypothetical futures, but do not allow the first working integration to silently become the future architecture.

## Product direction

The following are current product direction:

- VIVIM-Ω is a personal operating environment for a person's digital world, not a conventional SaaS application.
- The long-term differentiation is the combination of human semantic control, a persistent personal semantic world, governed action, durable Work/proof/continuity, and governed evolution.
- The first tangible product anchor is a persistent VIVIM environment in which real provider webapps can be used as external capabilities through the user's local environment.
- The user's durable data, state, accounts, interaction, evidence, and memory belong in the local sovereign environment, subject to the external authority of the services they interact with.
- Vault is durable canonical local truth; World and other views are derived/organized representations.
- Authority, provenance, consent, refusal, and evidence are first-class concerns.
- Natural-language interaction must separate probabilistic perception from explicit semantic meaning and governed/deterministic execution.
- Raw model output is never constitutional authority.
- Work is more durable than the worker performing it.
- Provider, Account, Session, Capability, Realization, Routing, and Authority are distinct concepts.
- Plugins and compositions are the primary extensibility mechanism for replaceable capability/product behavior.
- Forge is part of the product's ability to extend itself; generated artifacts need proof, provenance, and ordinary governance.
- The current shippable V1 provider substrate is Chrome master/slave and browser-mediated realization. Do not casually reintroduce an AI-API execution path into the shippable product merely because it is easier to demo.
- The canvas and provider webapp surfaces are representations/interaction boundaries, not constitutional authority.
- Fail closed when authority, provenance, capability, or execution guarantees cannot be established.

These statements may change, but not silently and not merely for implementation convenience.

## Product-anchor discipline

Keep the product tangible.

When choosing substantial work, ask whether it advances or validates a real end-to-end path through the product anchor.

A provider-webapp surface is a functional wedge, not a permanent architectural commitment.

Do not hard-wire the architecture to today's provider list, browser protocol, visual layout, or model landscape.

The durable test is whether semantic meaning, authority, Work, evidence, and user continuity survive replacement of the realization.

Do not allow the product to regress into a simulated demo when real external execution is the relevant proof.

## Semantic guardrails

Use `INVARIANTS.md` as the seed-level reference.

Especially protect these distinctions:

- reality ≠ representation;
- evidence ≠ authority;
- intent ≠ execution;
- capability ≠ realization;
- provider ≠ account;
- account ≠ session;
- discovery ≠ routing;
- routing ≠ authority;
- memory ≠ context;
- Work ≠ worker;
- World ≠ surface;
- confidence ≠ proof;
- activity ≠ progress.

Fundamental to VIVIM does not automatically mean fundamental to K0.

Keep the constitutional kernel minimal unless a concrete, non-bypassable, domain-neutral need proves otherwise.

## Evidence and learning discipline

Treat execution evidence as a first-class product and engineering concern.

When the system makes a consequential claim about work, prefer durable evidence that can distinguish completion, active work, interruption, deliberate stop, never-started work, and uncertainty where those distinctions are knowable.

Do not infer completion merely because a process disappeared, a session ended, or an error was absent.

Preserve evidence for as long as the claim depends on it.

Prefer measured behavior over prose claims.

A measurement, hypothesis, caveat, rule, and proof are different things.

Promote an observation into a governing rule only when it is actionable, testable/falsifiable, and tied to behavior the system can actually change.

Retire or supersede rules when evidence shows they are inert, unreachable, contradicted, or obsolete.

When changing a load-bearing invariant, add the smallest useful falsifier or measurement that could prove the assumption wrong.

When changing a mechanism intended to improve behavior, measure whether the intervention actually changed the target behavior.

Do not equate more agents, more tasks, more executions, more rules, more code, or greener dashboards with product progress.

## Evolution discipline

The environment may evolve itself, but self-improvement is not self-authorized sovereignty.

For consequential change, maintain enough lineage to answer what changed, why, what was affected, what authority applied, what was verified, and what remains uncertain.

Replacement should preserve user-owned canonical state and history where compatibility permits.

Unresolved impact or compatibility is not the same as zero impact or compatibility.

## Development discipline

Prefer:

**measure → understand → experiment → falsify → choose → implement → verify**

over:

**assume → organize → plan extensively → build the plan → rationalize the result**

Keep internal complexity underneath the user mental model.

Do not create a second semantic or authority system to make a feature convenient.

Do not preserve a mechanism merely because it is already implemented.

The goal is a trustworthy, tangible product, not a monument to the current architecture.
