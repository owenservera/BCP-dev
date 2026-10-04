# Build Focus — Where to Over-Resource the Work

These are focus areas, not a prescribed roadmap.

Their purpose is to tell the autonomous build where deeper analysis, parallel investigation, stronger tests, and disproportionate engineering attention are likely to pay off.

The project should continuously re-rank them from evidence.

## 0. Maximize the development capability space

Before optimizing the product build, determine what the ZCode runtime can already do for this project and which combinations of native tools and extensions materially increase throughput, validation quality, continuity, and autonomous operation. The project should design its own DevOps from that capability census.

Treat ZCode itself as an available development substrate: workspace operations, subagents, dynamic workflows, persistent memory, skills, plugins, MCP, hooks, browser/Computer Use, background and scheduled work, remote execution, Git, and observability should be considered options to compose and test—not a checklist to blindly enable.

The development system should evolve through measured leverage: identify bottlenecks, create or change a capability, verify its effect, and retire machinery that does not earn its cost.



## 1. First tangible product route

The highest-value near-term question is whether VIVIM can become a genuinely usable local environment around a real provider webapp.

The target is not a polished browser wrapper.

The target is a complete governed route:

**person → address/expression → intent → context → capability → provider/account/realization → authority → work → browser/webapp → observed result → evidence → local continuity**

A small complete route is more valuable than a large collection of isolated subsystems.

The product anchor is a proving ground, not a permanent feature boundary.

## 2. Human semantic execution language

Treat the human-readable semantic layer as a primary long-horizon investment.

Investigate deeply:

- human expression → canonical meaning;
- deterministic semantic representation;
- addressing and context;
- ambiguity and clarification;
- composability;
- explainability;
- replay/reproducibility;
- self-knowledge;
- language learning without silent semantic drift.

The important question is not merely whether VIVIM can understand prompts.

It is whether a non-programmer can reliably express meaningful operations through a semantic language whose consequences the system can govern deterministically.

## 3. Personal semantic world, memory, and context

Focus on one coherent user-owned semantic world rather than scattered stores.

Watch the boundaries among:

- external source data;
- canonical local records;
- relationships;
- memory;
- context;
- representations;
- evidence.

Current context is a derived lens over the world, work, focus, policy, and standing intent.

It should not become a second source of truth.

## 4. Authority, Work, evidence, and continuity

The system should be able to show:

**what was requested → what was understood → what could do it → what was allowed → what work occurred → what actually happened**

Invest deeply in durable Work, honest execution state, evidence, recovery, and user continuity.

The exact state machines and orchestration mechanisms are implementation choices.

The durable requirement is that consequential work remains understandable and reconstructable across interruption and replacement where possible.

## 5. Provider, Account, Routing, and browser realization

Keep these concepts separate:

- Provider;
- Account;
- Capability;
- Realization;
- Session;
- Routing policy;
- Authority.

Routing chooses among valid candidates; it does not grant permission.

Discovery establishes available candidates; it does not silently decide user policy.

The browser is a practical V1 realization substrate, not the long-term product identity.

Live authenticated provider behavior is especially valuable evidence because fixture-only success can hide the real product risks.

## 6. Extensibility and Forge

Make capabilities genuinely composable and replaceable.

Focus on the principle:

**new capability → explicit contribution → proof → ordinary admission/governance → usable capability**

A first-party or Forge-created capability should not receive a secret path.

The strongest long-term test is whether the Forge can eventually create or modify ordinary governed pieces without creating a second privileged development universe.

## 7. Evolution, learning, and healing

VIVIM should become easier to improve while remaining trustworthy.

Investigate how the environment can:

- observe;
- understand;
- propose;
- assess impact;
- obtain appropriate authority;
- change;
- verify;
- preserve lineage;
- measure effect;
- recover or retire.

Do not assume that activity is improvement.

Do not let learned behavior silently override user policy or constitutional meaning.

Unknown impact, compatibility, identity, or external effect should remain representable as unknown.

## 8. Surfaces and product coherence

Treat canvas, provider webapps, chat, CLI, MCP, and future interfaces as ways of experiencing the same underlying semantic system.

Protect the distinction:

**World is not Surface.**

A surface can evolve independently of canonical identity and meaning.

At the same time, the user experience should remain simple enough that architectural complexity stays underneath.

## 9. Runtime, resources, and failure semantics

As VIVIM becomes more autonomous, process isolation, resource governance, cancellation, restart, recovery, and external-effect uncertainty become increasingly important.

Focus on honest failure and bounded behavior rather than theoretical perfection.

A transient worker should never be the sole authority for durable state.

## 10. Product lifecycle and sovereign exit

A real product eventually needs coherent install, first run, account connection, defaults, configuration, update, recovery, export, reconstruction, and replacement.

Do not build these as isolated administrative subsystems.

They should grow naturally from the same semantic world and authority model.

Exit and reconstruction are product capabilities, not compliance afterthoughts.

## Architectural leverage and upgradeability

Across all focus areas, preferentially invest in mechanisms that multiply future capability.

For a substantial new subsystem or integration, investigate:

- whether it is likely to recur across independent capabilities;
- whether it has a clean, replaceable boundary;
- whether a second materially different use case or realization can use that boundary;
- whether adding the next provider/capability is becoming cheaper rather than more exception-heavy;
- whether recovery and self-healing generalize beyond the motivating failure;
- whether the mechanism can be upgraded without forcing the product to adopt the same implementation forever;
- whether the proposed centralization belongs in a kernel, an engine, a plugin, a composition, or ordinary implementation.

The builder should periodically ask whether the current system is accumulating **engines** or merely accumulating **working integrations**.

The strategic target is not maximum abstraction. It is increasing leverage with minimal architectural lock-in.

## Long-horizon questions

Keep these questions alive across every build cycle:

- What part of this is likely to remain valuable if today's models and providers disappear?
- Are we strengthening the human semantic layer or merely wiring another tool?
- Where is canonical truth?
- What exactly proves the claim?
- Who was authorized, and on whose behalf?
- Can the operation be explained and replayed?
- What happens under uncertainty?
- What survives process, worker, provider, plugin, or surface replacement?
- Can this be a replaceable contribution instead of a privileged special case?
- Does the intervention measurably improve the target behavior?
- Is the current structure still the simplest one?
- Does a real person get more useful control of their digital world?

These questions are more important than preserving any particular current roadmap.

# Continuous Product Release Gym

The project should operate a continuous product-release gym rather than a fixed feature roadmap.

## Purpose

For every round, generate **10 product-release candidates** and identify the smallest genuinely useful product that a real user would actually install.

Optimize for:

**smallest useful product surface + shortest credible time-to-market + real user value + reuse of existing Ω capability + learning produced by release**

Do not optimize for architectural completeness.

## Candidate scoring

Every candidate must be scored against BOTH product opportunity and current implementation reality.

At minimum score:
- user value;
- minimum product surface;
- credible time-to-market;
- reuse of existing capability;
- distinctiveness / unmet space;
- learning value;
- expansion potential;
- **current-code readiness**.

Current-code readiness must explicitly distinguish:
- already real and executable;
- partially implemented;
- fixture/simulation only;
- missing;
- blocked by an external capability or runtime condition.

A candidate with excellent product value but poor current-code readiness must not be treated as immediately shippable merely because it fits the Ω vision.

## Current first-round hypothesis

A strong current hypothesis is a **floating AI control center**: a small installable VIVIM utility with a floating control surface based primarily on one text box, a compact availability indicator, and the ability to send one prompt to each available supported AI WebApp.

Initial required providers:
- ChatGPT / OpenAI Web
- Claude Web
- Gemini Web

Example: **● ChatGPT   ● Claude   ○ Gemini**

VIVIM should locally remember observed provider/account/profile capabilities, including differences such as free versus paid profiles and observed model availability. Capability knowledge is evidence that can become stale and must be refreshed.

The product should not require an AI API merely to obtain the intelligence. The user's provider WebApps are the external intelligence providers; VIVIM supplies semantic control, discovery, routing, authorization, browser realization, observed outcome, evidence, and continuity.

Keep the UI extremely small. Do not pre-build a dashboard when text interaction can discover and configure capability.

## Reality gate for browser-based releases

The current Ω seed contains a substantial **fixture-based** browser/provider path, but a fixture is not live external execution.

Any candidate whose core promise depends on real provider-WebApp interaction is **not release-ready** until at least one live, non-fixture browser realization has been demonstrated end-to-end on the target runtime.

The first live realization may be only one provider and one operation. It must prove real external interaction, not parse or replay fixtures.

For the floating-AI hypothesis, the likely first enabling task is therefore:

**make one real live browser/CDP provider leg work and produce observable evidence**

rather than immediately attempting the complete three-provider floating product.

After one live leg works, apply the second-use test: can the same realization boundary support a materially different provider or equivalent second realization without creating a parallel architecture? Keep provider-specific quirks inside the realization boundary.

## Release definition

A product is not released merely because its internal mechanism or fixture tests work.

A release must support:

**install → launch → understand → perform the core job → receive a real result**

For a browser-mediated product, “real result” means an observed external interaction on the intended live substrate.

## Round loop

For each round:
1. inspect current product/code reality;
2. generate 10 candidates;
3. score product opportunity and code readiness separately;
4. identify hidden enabling work;
5. choose the candidate or enabling slice that maximizes expected product learning per unit effort;
6. implement the smallest real slice;
7. test it;
8. independently verify it;
9. release when the release definition is satisfied;
10. collect evidence;
11. use that evidence to generate the next 10 candidates.

Therefore:

**released product + observed evidence → next 10 candidates**

not:

**predetermined roadmap → implementation**

## Architectural learning

The Gym is also an architectural pressure test. Do not promote the first working mechanism into permanent architecture.

Prefer:

**concrete case → repeated pattern → reusable capability → engine candidate → validated upgradeable engine**

No engine boundary is sacred. A product release can be tiny even when the architecture underneath it is becoming powerful.
