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

## Multi-provider execution pool

The development environment has five independently configured ZCode model-provider lanes available for parallel work. Treat them as a shared execution pool:

- **Owen** — 1M-context **Space Bunny Free**
- **OpenCode acct 2** — 1M-context **Space Bunny Free**
- **OpenCode acct 3** — 1M-context **Space Bunny Free**
- **OpenCode acct 4** — 1M-context **Space Bunny Free**
- **OpenCode acct 5** — 1M-context **Space Bunny Free**

These are five separate provider/API call lanes, not five configuration profiles to redesign. **Do not modify, rotate, replace, merge, reset, or “optimize” the provider configurations, credentials, endpoints, model mappings, or account wiring unless the owner explicitly requests configuration work.** The project's job is to schedule work across the already-wired pool.

Default to high fan-out when the work is genuinely independent. Split large objectives into independent research, implementation, test, review, exploration, and verification units and distribute those units across the five lanes. Keep dependent work ordered, avoid duplicate work unless duplication is deliberately used for independent verification, and prefer isolated branches/worktrees or other safe change boundaries when multiple lanes may edit concurrently.

Use the full pool when useful rather than serializing work through one provider. A single lane should not become the accidental coordinator bottleneck. Heads of workstreams should be able to dispatch work to available lanes, reclaim idle capacity, and rebalance assignments as work completes or blocks.

The 1M context capacity should be treated as a scarce execution resource: give each lane a coherent problem with enough local context to reason independently, but do not stuff unrelated work into one context merely because capacity exists. Preserve concise artifacts, contracts, paths, findings, and handoff state so completed work can be recombined without replaying entire sessions.

At bootstrap, verify that these five lanes and the named model are actually reachable from the current ZCode runtime, but treat the existing configuration as read-only infrastructure. If a lane is unavailable, diagnose the runtime condition and route around it; do not silently rewrite the configuration.

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


# Continuous Product Release Gym

The project should operate a continuous product-release gym rather than a fixed feature roadmap.

The gym repeatedly asks:

> **What is the smallest genuinely useful product we can release now that a real user would actually install?**

For every round, generate **10 product-release candidates**. Optimize for the smallest useful product space and the shortest credible time to market, while maximizing the real user value and learning produced by the release.

Prefer:

**small product surface + real utility + existing Ω capability reuse + immediate installability + strong learning**

over:

**large feature set + architectural completeness + speculative future functionality**

Every candidate should state the user, the single job, the minimum installable surface, existing Ω capabilities reused, what must be built, what can remain manual, how success would be observed, and what evidence would justify expanding it.

Rank candidates by minimum product surface, immediate usefulness, time-to-market, reuse of existing capabilities, distinctiveness, learning value, and expansion potential.

### Current first-round hypothesis

A particularly strong example from the current Ω state is a **floating AI control center**.

The minimum product is a small installable VIVIM utility with a floating control surface based primarily on a text box.

The user types one prompt.

VIVIM shows which supported AI WebApps are currently available and, for a first useful release, can send the same prompt to each available provider.

Initial required providers:

- ChatGPT / OpenAI Web
- Claude Web
- Gemini Web

The UI can remain extremely small, for example:

**● ChatGPT   ● Claude   ○ Gemini**

The product should remember observed provider/account/profile capabilities locally, including differences such as which models or capabilities are available on free versus paid profiles. Observed capability state is refreshable evidence, not permanent truth.

The product should not require an AI API merely to provide this capability. Existing user-controlled AI WebApps are the external intelligence providers; VIVIM supplies semantic control, discovery, routing, authorization, browser realization, observed outcome, evidence, and continuity.

The first interface should resist becoming a dashboard. Start with the text command surface and a compact availability indicator. Additional UI should be discoverable and configurable through user language rather than built in advance.

The first release is valuable because a very small product can exercise a meaningful Ω path:

**human expression → intent → context → capability → provider/account/realization → authority → Work → browser/WebApp → observed result → evidence → continuity**

This candidate is a hypothesis, not a predetermined roadmap. The gym must remain free to select a different candidate when current evidence indicates that another tiny product has better immediate value.

### Release-loop rule

Do not automatically build candidate 2 after candidate 1.

A release creates evidence. The next gym round should be influenced by installation, use, repeated user requests, friction, failures, successful/unsuccessful provider realization, architectural reuse, and what the released product teaches about the actual product boundary.

Therefore:

**released product + observed evidence → next 10 candidates**

not:

**predetermined roadmap → implementation**

A product is not considered released merely because its underlying mechanism works. A release must support the basic user journey:

**install → launch → understand → perform the core job → receive a real result**

The gym is also an architectural pressure test. A mechanism that helps one product is not automatically an engine. Promote abstractions only when repeated product work demonstrates reusable value.

Preferred progression:

**concrete case → repeated pattern → reusable capability → engine candidate → validated upgradeable engine**

No engine boundary is sacred. No product-release round should become an excuse to freeze the architecture.
