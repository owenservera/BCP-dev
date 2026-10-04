# Product Anchor — The First Tangible VIVIM

## Purpose

This document anchors the fresh build in a concrete product experience without turning that experience into the long-term architecture.

The first useful VIVIM should be tangible: a persistent, local environment in which real provider webapps are usable as first-class external capabilities, while VIVIM supplies the semantic control, continuity, authority, and evidence around them.

This is the **functional anchor for the beta path**.

It is not the final visual form of VIVIM, and it does not authorize a particular frontend architecture.

## The product anchor

The first product should feel like:

> **One persistent VIVIM environment in which the person's provider webapps and other digital capabilities are available as things they can address, use, and reason about.**

The simplest visible realization may be a single-pane environment where one or more provider webapps occupy the working surface.

That is useful precisely because it makes the product real early:

- the person can see something;
- the person can connect a real account;
- the person can use a real provider;
- the person can express an intention in ordinary language;
- VIVIM can mediate the action;
- VIVIM can preserve what happened;
- the person can return and continue.

Do not mistake the visible provider surface for the product's authority or canonical state.

## What is external and what VIVIM owns

The provider webapp remains external.

VIVIM should own the local semantic relationship around it:

- provider identity;
- Account relationship;
- local realization/session association;
- user configuration and routing policy;
- authorized context;
- Work associated with interaction;
- evidence and provenance;
- continuity of the user's local world.

The provider remains authoritative for its own external service and data.

The browser is a realization mechanism, not a source of constitutional authority.

## The functional route

The first complete route should conceptually be:

```
PERSON
  ↓
ADDRESS / EXPRESS
  ↓
INTENT
  ↓
CONTEXT
  ↓
CAPABILITY
  ↓
PROVIDER / ACCOUNT / REALIZATION
  ↓
AUTHORITY
  ↓
WORK
  ↓
BROWSER / WEBAPP REALIZATION
  ↓
OBSERVED RESULT
  ↓
EVIDENCE
  ↓
LOCAL WORLD / CONTINUITY
```

The implementation may differ, but the product should remain understandable in these terms.

## What the user experiences

A person should eventually be able to do something as simple as:

> “Use my usual AI to help me with this.”

or:

> “Open my project and continue where I left off.”

or:

> “Use Claude for this and keep the result with the project.”

The environment may perform substantial deterministic work beneath that request.

The person should not need to understand:

- plugin manifests;
- worker topology;
- provider discovery internals;
- routing algorithms;
- vault implementation;
- browser automation mechanics;
- agent orchestration;
- internal state machines.

Those are implementation concerns.

The user should understand what was requested, what VIVIM understood, what it will do, what it is allowed to do, what actually happened, and what is now part of the continuing world.

## The persistent-provider principle

A connected provider webapp should not feel like an unrelated browser tab that happened to be placed inside VIVIM.

VIVIM should know, subject to evidence and policy:

- which provider is being represented;
- which Account is associated;
- which capability is being exercised;
- what context is relevant;
- what Work is associated;
- what actions were attempted;
- what outcomes were observed;
- what evidence remains.

This is the beginning of making an external webapp a participant in a user-owned environment rather than a separate application window.

## The first vertical slice

The first product proof should be deliberately small but complete.

A representative journey is:

```
1. Start VIVIM.
2. See the persistent local environment.
3. Connect or select a real provider Account.
4. Reach the provider webapp through the intended browser substrate.
5. Express a natural-language request.
6. Resolve that request into an explicit semantic operation.
7. Apply the appropriate authority / consent rules.
8. Perform one real supported browser-mediated operation.
9. Observe and record the result.
10. Preserve the resulting evidence and relevant local state.
11. Restart or leave and return.
12. Continue without reconstructing the whole relationship manually.
```

The exact operation is a build decision.

The completeness of the route is the important part.

## V1 boundary

Current product direction is browser-mediated external realization through Chrome master/slave.

The shippable V1 should not quietly grow a second AI-API architecture merely because it is easier to demonstrate a model interaction.

A provider webapp is valuable here because it proves the central sovereignty proposition:

> VIVIM can use the person's existing external applications without making their private APIs the foundation of VIVIM.

Provider count is not the goal.

A small number of real, useful, replaceable provider relationships are more valuable than a large inventory of nominal integrations.

## The anchor must not become a trap

The provider-webapp surface is a **wedge**, not the 10-year destination.

Do not optimize the architecture around today's visual arrangement, provider list, browser protocol, or current model landscape.

The durable question is:

> Can the same semantic world, language, authority, Work, evidence, and continuity survive when the external realization changes?

The intended evolution is therefore:

```
provider webapps as first tangible surfaces
        ↓
many capabilities / many surfaces
        ↓
one coherent semantic environment
```

The environment should eventually make a provider webapp just one kind of live participant among projects, conversations, documents, people, work, agents, automations, services, and other digital things.

## Strategic design tests for the anchor

The first vertical slice must not accidentally define the permanent architecture.

In particular, treat the first provider/protocol implementation, browser realization, account integration, and recovery/self-healing mechanism as **proving realizations**. They should solve the immediate product problem while preserving a credible path to reuse.

Ask of important implementation boundaries:

- Does solving today's case make a materially different second case easier?
- Can a second provider or realization satisfy the same semantic capability without creating a parallel product path?
- Are provider/protocol quirks isolated as realizations or being promoted into canonical semantics?
- Can the recovery mechanism generalize beyond the exact failure that motivated it?
- Can the mechanism be upgraded or replaced without rewriting the surrounding product?
- Does the abstraction reduce future complexity, or merely hide today's special cases?

A working first slice is successful product evidence. It is not by itself evidence that its internal mechanisms deserve permanent architectural status.

## Product anchor tests

A new design should be challenged with questions such as:

- Can a person get useful value without learning the architecture?
- Is the real external system actually being used, rather than simulated?
- Can the person tell which Account and provider were used when it matters?
- Does the action travel through the same semantic and authority path as other surfaces?
- Can VIVIM explain what happened?
- Does the user's durable local state survive surface or realization replacement?
- Can a provider be replaced without redesigning the user's world?
- Does the product remain meaningful when an AI model is unavailable?

A feature that answers these questions well is pulling the product toward the intended environment.

## Product falsifiers

Useful early falsifiers include:

1. A provider surface can disappear without destroying canonical local state.
2. A selected Account cannot silently become another Account.
3. A browser selector or DOM observation cannot become constitutional truth merely because it was convenient to access.
4. A natural-language request can be represented as explicit semantic intent before consequential execution.
5. Authority is decided outside raw model output.
6. The resulting Work and evidence remain available after the worker or browser session disappears.
7. A second valid realization can be introduced without creating a parallel product architecture.
8. The same underlying operation can be reached from a different interaction surface without changing its authority semantics.

The exact test mechanisms should be discovered by the build.

## Relationship to the wider destination

The anchor is intentionally connected to the destination semantic path:

**Address → Intent → Context → Capability → Choice/Routing → Authority → Work → Execution → Evidence → World/Memory update.**

The first product only needs a thin, useful slice of that universe.

It should nevertheless use the same concepts so that the beta grows into the destination rather than becoming a throwaway prototype.
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
