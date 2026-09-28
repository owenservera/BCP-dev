# Ω End-State Build Team — Known Complexity Areas

> Status: KNOWN DESIGN/ENGINEERING FRONTIER
> Date: 2026-09-28
> Branch: `team/omega-endstate`
> Purpose: warn the team where substantial complexity is likely to concentrate regardless of architecture

This is **not a backlog and not a prescribed sequence**.

These are areas where the repository's archaeology, destination research and current Ω evidence indicate that meaningful engineering difficulty is likely to remain even if the team invents a different implementation.

## 1. Real web-app control at production reliability

The core challenge is not "open Chrome."

It is reliably operating modern, authenticated, stateful web applications as a product capability.

The system must handle:

- startup and attachment;
- process/profile lifecycle;
- multiple accounts;
- concurrent browser resources;
- navigation;
- focus;
- user interaction;
- asynchronous UI changes;
- page lifecycle;
- network/streaming behavior;
- provider-specific states;
- failures and recovery.

The difficulty is turning browser automation from a clever mechanism into a dependable infrastructure layer.

**Archaeology signal:** Legacy VIVIM has a substantial ChromeGovernor/browser-control family, and Ω already has a Chrome-mediated provider substrate.

## 2. Provider knowledge

Every external application has behavior that VIVIM must learn.

That knowledge may include:

- semantic concepts;
- capabilities;
- interaction affordances;
- page/DOM/AX structure;
- streaming patterns;
- navigation states;
- message boundaries;
- selectors or alternative locating strategies;
- supported operations;
- version/drift fingerprints;
- authentication states;
- failure signatures.

The hard problem is deciding what is durable semantic provider knowledge versus disposable implementation detail.

**Archaeology signal:** Legacy contains provider definitions, protocol discovery, provider discovery, manifest inference and protocol-generation mechanisms.

## 3. Automatic discovery and onboarding

Adding a new provider should not mean hand-coding every detail forever.

The system eventually needs a discovery path that can learn enough about a provider to make it usable.

That includes questions such as:

- how is the provider identified?
- how are capabilities discovered?
- how are important states discovered?
- how is authentication understood?
- how are meaningful interaction targets identified?
- how is provider knowledge validated?
- how is learned knowledge persisted and versioned?

The challenge is making discovery generic enough to reuse while respecting provider-specific reality.

## 4. Self-healing when providers change

Provider websites will change.

Selectors will break.

DOM structure will shift.

Accessibility trees may change.

Streaming formats may change.

Buttons move.

Flows get renamed.

The intended product cannot require the user to wait for VIVIM engineering after every provider update.

The team therefore has to solve some version of:

```
drift detection
→ diagnosis
→ rediscovery
→ candidate repair
→ verification
→ promotion
→ rollback if wrong
```

The difficult part is not just finding a new selector. It is proving that the repaired behavior still means the same thing.

**Archaeology signal:** selector healer/refiner/cache/store, discovery stacks, semantic grounding and alignment machinery.

## 5. Parsing and semantic normalization

Real provider interactions are not clean request/response APIs.

The system may need to interpret:

- DOM changes;
- accessibility information;
- network events;
- SSE/stream chunks;
- websocket activity;
- partial messages;
- tool/action states;
- artifacts;
- attachments;
- edits/regenerations;
- branches;
- provider-specific metadata.

Then it needs to express the useful semantic result through common VIVIM concepts.

The challenge is maintaining a stable semantic model while provider representations continually differ.

## 6. Account / profile / session lifecycle

"User has Claude" is not enough.

The system needs to understand:

```
Provider
  ↓
Account
  ↓
Credential/reference
  ↓
Chrome profile
  ↓
Browser process
  ↓
Active session
  ↓
Current page/application state
```

It must also handle:

- multiple accounts at the same provider;
- login expiry;
- profile isolation;
- relogin;
- account selection;
- health;
- replacement;
- disconnect;
- recovery;
- concurrent use.

This becomes especially difficult once background Work can depend on an account/session.

## 7. Cross-provider capability abstraction

ChatGPT, Claude and Gemini can all support "chat," but they are not identical systems.

The abstraction must therefore be:

**common semantic capability + provider-specific realization**

rather than pretending all providers expose the same internals.

The hard design question is:

> What must be normalized, and what must remain provider-specific?

Too little abstraction makes the product a collection of adapters.

Too much abstraction destroys useful provider-specific capabilities.

## 8. Routing

Once multiple accounts and realizations exist, VIVIM needs to decide which one to use.

Routing may eventually consider:

- explicit user choice;
- persistent rules;
- current project/context;
- account;
- model;
- capability;
- privacy;
- availability;
- latency;
- cost;
- quality evidence;
- fallback permissions.

The difficult boundary is keeping routing from becoming hidden authority.

A learned ranking can suggest.

It cannot silently rewrite the user's rules.

**Archaeology signal:** ProviderMux, routing preferences, priority, fallback, fan-out, round-robin, cost and learned strategies.

## 9. The single-pane-of-glass product surface

The user should feel like they are in VIVIM rather than jumping between automation adapters.

That means the team has to solve the product-level synthesis of:

- provider conversations;
- the VIVIM world;
- current context;
- project/workspace;
- account selection;
- provider-specific capabilities;
- universal prompt;
- direct manipulation;
- provider-native interaction where necessary.

The challenge is preserving a coherent interaction model without flattening meaningful differences.

## 10. Canonical world and external reality

The environment needs one durable representation of the user's world while external systems remain authoritative about their own external state.

That creates difficult questions:

- what is canonical in VIVIM?
- what remains a projection?
- how is external state referenced?
- how are changes detected?
- what is imported versus linked?
- how are conflicts represented?
- how are deleted/changed external objects handled?
- how does the system avoid becoming a duplicate database of everything?

The distinction between **world truth, representation, evidence and external source authority** becomes load-bearing.

## 11. Context and memory

The product eventually needs to know what matters now.

That means connecting:

- world state;
- current space;
- project;
- recent work;
- conversations;
- documents;
- attention;
- history;
- durable memory;
- evidence.

The hard problem is not merely retrieval.

It is producing **the right context for the right task without fabricating continuity**.

This is why the repository's deterministic context/mind work matters even though the team is free to redesign it.

## 12. Durable Work and agency

A good AI interface can produce a response.

A computing environment must be able to own an outcome over time.

The team will need some coherent answer to:

```
request
→ intent
→ plan
→ work
→ step
→ attempt
→ wait
→ resume
→ verify
→ outcome
→ evidence
→ memory/world update
```

Complexity increases sharply when Work:

- spans providers;
- uses multiple accounts;
- waits for humans;
- survives restart;
- runs in the background;
- encounters provider drift;
- needs rollback;
- must explain exactly what happened.

## 13. Authority and user control

The environment becomes powerful enough that "just automate it" is insufficient.

The system needs understandable answers to:

- who may act?
- on whose behalf?
- over what scope?
- using which account?
- with what standing permission?
- what requires approval?
- what expires?
- what happens when permission is revoked?
- how is delegation bounded?

The challenge is making this powerful enough for real automation without turning it into an administrative control plane the ordinary user cannot understand.

## 14. Evidence and trust

The product has to be able to distinguish:

- what it thinks happened;
- what it observed;
- what the provider reported;
- what actually executed;
- what was inferred;
- what is proven.

This matters particularly when a provider is external and UI behavior is inferred through browser instrumentation.

A screenshot, model response or parser guess is not automatically proof that the intended action occurred.

## 15. Evolution and compatibility

The final environment is intended to evolve continuously.

That creates difficult questions around:

- plugin replacement;
- provider-version changes;
- data-model evolution;
- Work created under older semantics;
- stale context;
- changed capabilities;
- changed policies;
- rollback;
- quarantine;
- user-visible compatibility.

The team must eventually answer:

> How can the environment change itself without quietly changing what the user's existing things mean?

## 16. Resource and concurrency management

A local environment with many browser sessions, agents, providers, background jobs, surfaces and plugins has real resource constraints.

The team will encounter:

- process/memory budgets;
- browser startup costs;
- idle resources;
- concurrency;
- suspension/resume;
- scheduling;
- contention;
- failure isolation;
- machine sleep/wake;
- unplugged/mobile resource conditions.

The goal is not infinite concurrency.

It is a system that remains useful and truthful under finite local resources.

## 17. Product lifecycle and recovery

The end state is an environment installed on someone's machine.

That introduces a whole product layer:

- first install;
- first launch;
- account connection;
- provider discovery;
- configuration;
- updates;
- migrations;
- failed updates;
- rollback;
- backup;
- export;
- restore;
- machine replacement;
- provider reconnection;
- recovery after corruption.

A sophisticated runtime without a coherent lifecycle is not a finished product.

## 18. Testing real external systems

Fixtures are necessary but insufficient.

The team eventually has to establish a proving strategy across:

```
static
→ simulated
→ replay
→ integration
→ real authenticated provider
→ long-running / drift
→ recovery
```

The hard problem is reproducibility when the external system is not under VIVIM's control.

## 19. Provider breadth without architecture collapse

The first three AI providers are intentionally only a seed.

The long-term environment should be able to incorporate other kinds of web applications.

The complexity is avoiding two bad extremes:

**one bespoke integration per provider**

versus

**one giant universal abstraction that cannot express real provider differences.**

The winning design will likely have a strong generic substrate plus explicit provider knowledge/contributions.

The team gets to discover the exact boundary.

## 20. Development-system complexity

The team itself is part of the experiment.

Building this product may require:

- specialist research agents;
- provider-specific investigators;
- architecture agents;
- product/journey agents;
- implementation agents;
- verification agents;
- live-environment agents;
- evolution/maintenance agents;
- shared development infrastructure.

The team must discover whether its development system should be organized by domain, journey, substrate, capability, or something else.

This is intentionally not prescribed.

## 21. The common denominator

Across all of these areas, the recurring challenge is:

> **Take a heterogeneous, changing external world and make it feel like one coherent, local, user-owned environment without erasing the differences or pretending VIVIM controls things it does not control.**

That is likely to remain difficult no matter which internal architecture the team chooses.

## 22. What success looks like

The team has solved the hard parts when a person can:

```
open VIVIM
→ see their world
→ use existing accounts
→ talk to ChatGPT / Claude / Gemini through one environment
→ switch or route between them
→ continue existing conversations
→ delegate real work
→ interact with other web apps
→ leave
→ return
→ understand what happened
→ survive provider changes
→ extend the environment
→ export/recover their state
```

without needing to understand the machinery underneath.

The exact architecture that accomplishes this is the team's job to discover.
