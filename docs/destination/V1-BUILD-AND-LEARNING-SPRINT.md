# V1 Build & Learning Sprint — Product, Plugin & Provider Discovery Control

> Classification: DERIVED — PRODUCT RESEARCH / SPRINT CONTROL
> Status: WORKING — owner-controlled, evidence-driven
> Date: 2026-09-25
> Scope: first functioning VIVIM prototype + first real provider
>
> This document is deliberately different from a conventional implementation plan. The sprint is both a build and a design laboratory. We will build fast, but every meaningful implementation choice is also evidence about the eventual VIVIM product, plugin system, canonical data model, provider model, and surface model.
>
> This is not Ω law. It is not a final product architecture. It is the control document for learning what the architecture should become.

---

## 1. Why this sprint exists

The first functioning VIVIM build has two jobs.

### Job A — Prove a real product instance

~~~text
RUN
 → IDENTIFIABLE INSTANCE
 → DURABLE DATA
 → VERIFIED COMPOSITION
 → PRODUCT SURFACE
 → MEANINGFUL ACTION
 → PERSISTED STATE
 → RESTART
 → RECONSTRUCTION
~~~

### Job B — Learn the product architecture by building one real provider

We will take one real AI WebApp far enough that we can understand its meaningful user-task surface, target approximately **80% weighted functional parity**, and use that work to discover:

- the canonical VIVIM AI Chat shape;
- the real Provider / Account / Session / Realization boundary;
- the first VIVIM Core Plugins;
- the minimum set of canonical data shapes;
- reusable capability contracts;
- provider-specific realization boundaries;
- surface/slot composition rules;
- evidence and state models;
- what must be extracted from fast prototype code;
- what should remain local implementation detail;
- what the second provider will be able to reuse.

The provider is therefore a **learning instrument as well as a product capability**.

---

# 2. Operating doctrine

## 2.1 Build fast, capture deliberately

We explicitly permit rapid implementation, temporary wiring, adapters, shims, and experiments.

What we do **not** permit is allowing temporary code to silently become architecture.

The sprint therefore uses a promotion system:

~~~text
OBSERVE
  ↓
IMPLEMENT FAST
  ↓
CAPTURE LEARNING
  ↓
CLASSIFY
  ↓
TEST REUSE / BOUNDARY
  ↓
EXTRACT
  ↓
PROMOTE
~~~

A thing may remain prototype code. Promotion is earned by evidence.

## 2.2 Repository evidence beats conceptual preference

When existing Ω or legacy VIVIM code already demonstrates behavior, use it as evidence.

Do not assume:

- the legacy architecture is destination architecture;
- the Ω architecture is already complete;
- a documented abstraction is actually implemented;
- a code abstraction is necessarily the correct product abstraction.

## 2.3 The first provider is a falsifier

Provider #1 should force the model to confront external reality.

When provider behavior does not fit the current abstraction, record that as design evidence.

The goal is **not** to make every provider conform by adding provider-specific exceptions.

The goal is to discover where the canonical VIVIM model is genuinely universal and where a provider realization must remain specialized.

## 2.4 Every abstraction must answer a question

Before promoting an abstraction, record what question it answers.

Examples:

- Data shape → “What durable thing exists?”
- Capability → “What power does VIVIM expose?”
- Plugin → “What independently replaceable/maintainable component supplies a power or service?”
- Surface slot → “Where/how can a representation be substituted?”
- Realization → “How is this capability actually executed here?”
- Evidence → “What supports the claim that this happened?”

If the abstraction answers no distinct question, it may be accidental complexity.

---

# 3. Sprint outcomes

At the end of the sprint we should have **six outputs**, not one.

### Outcome 1 — Working VIVIM prototype

A repository-launched, durable, restartable product instance with one coherent AI-chat surface.

### Outcome 2 — Provider-01 realization

One real provider implemented deeply enough to reach approximately 80% weighted functional task coverage.

### Outcome 3 — Canonical AI Chat Shape v0

An evidence-backed, provider-independent semantic shape that a second provider can target without rebuilding the product.

### Outcome 4 — VIVIM Core Plugin Set v0

A classified set of company-maintained, product-critical plugins required by the prototype and likely to remain foundational.

### Outcome 5 — Canonical Data / Contract Set v0

The durable entities and capability contracts that have become real through implementation.

### Outcome 6 — Extraction + Learning Record

A complete ledger of prototype shortcuts, discoveries, contradictions, rejected assumptions, promotion decisions, and evidence.

---



# 3A. Repository genealogy and evidence roles

The V1 sprint must distinguish the major VIVIM code lineages. They are not interchangeable sources.

~~~text
LEGACY VIVIM
   │
   └──────────────► standalone VIVIM-Ω
                         │
                         │ incorporated snapshot
                         ▼
                  BCP / omega-baseline
                         │
          ┌──────────────┴──────────────┐
          │                             │
      Ω baseline                 BCP live evolution
          │                             │
          └──────────────┬──────────────┘
                         ▼
                 emerging VIVIM product
~~~

## Current source roles

| Source | Role | Authority |
|---|---|---|
| `vivim-original-baseline/vivim-final-enhanced/` | Legacy behavioral, UX, provider and machinery mine | Evidence to harvest; not destination law |
| `owenservera/vivim-omega` | Standalone Ω historical upstream/reference snapshot and decision history | Historical evidence; not current BCP implementation |
| `omega-baseline/omega-final/` inside BCP-dev | Incorporated Ω tree plus subsequent BCP evolution | Current implementation evidence within BCP |
| `bcp-speed/bcp/` | BCP/Forge/forensic/migration machinery | Current program/tooling evidence |
| `docs/destination/` | Product destination and discovery/control documents | Current product working model unless superseded |
| `docs/agent-system/` | Cooperative-program controls | Process authority, not product definition |

### Standalone Ω rule

The standalone `vivim-omega` repository must be consulted when we need to answer:

- what the original Ω design intended;
- why an Ω decision was made;
- what existed before BCP incorporated the Ω tree;
- whether BCP changed, removed or added a capability relative to that historical baseline.

It must **not** be used as evidence that a capability exists in the current BCP product unless the corresponding capability is also verified in BCP.

### BCP-current rule

When deciding what can be built now, use the current BCP tree and current product/program documents.

When a current BCP implementation differs from standalone Ω, record the difference as lineage/evolution evidence rather than silently treating either version as universally authoritative.

This distinction is especially important for V1 provider work, because BCP contains later live-browser and governed-execution evolution that is not present in the September 21 standalone Ω snapshot.


# 4. The four architectural layers we are learning simultaneously

The sprint should never treat “the architecture” as one blob.

We are learning four related but distinct layers.

~~~text
PRODUCT MODEL
  Things / World / Context / Conversation / Work / Account / etc.

CAPABILITY MODEL
  Capability / Contract / Intent / State / Evidence

PLUGIN MODEL
  Core / Provider / Surface / Substrate / Extension boundaries

REALIZATION MODEL
  Browser / API / Local / Model / Human / Other execution mechanisms
~~~

A discovery belongs to the correct layer before it becomes a design decision.

---

# 5. The V1 prototype boundary

The prototype does not need:

- final installer UX;
- final Windows packaging;
- 3D canvas;
- full digital-world coverage;
- multi-agent swarms;
- multi-device sync;
- every provider;
- full background automation;
- generalized autonomous healing.

The prototype does need:

- an identifiable product instance;
- a non-temporary durable data boundary;
- verified boot/recovery;
- a real VIVIM product surface;
- real conversation interaction;
- one real provider;
- durable conversation/application state where applicable;
- provider/session/account identity where required;
- governed execution;
- evidence sufficient to explain what occurred;
- a clean path for a second provider to reuse the canonical shape.

---

# 6. The special plugin class: VIVIM Core Plugins

Everything remains a plugin in the architectural sense.

“Core” is a **maintenance, trust, compatibility and ownership classification**, not an escape from the plugin model.

## 6.1 Core Plugin definition

A **VIVIM Core Plugin** is a first-party/company-maintained plugin whose failure, incompatible change, or absence materially affects the ability of VIVIM to provide its foundational product contract.

Core Plugins should have:

- first-party ownership;
- signed release artifacts;
- explicit compatibility/version policy;
- stronger regression requirements;
- migration responsibility;
- security review proportional to authority/data access;
- documented lifecycle;
- defined deprecation/replacement process;
- inclusion in supported default compositions where applicable.

Core does not mean “cannot be replaced forever.” It means VIVIM owns the compatibility and maintenance responsibility.

## 6.2 Core classification tests

A component is a Core Plugin candidate when several of these are true:

| Test | Question |
|---|---|
| Boot | Is the prototype/product unable to operate without it? |
| Trust | Does it participate in law, authority, secrets, evidence or durable truth? |
| Cross-provider | Does more than one provider or product capability need it? |
| Product-wide | Does multiple VIVIM surfaces/domains depend on it? |
| Canonical contract owner | Does it define or enforce a product-wide contract? |
| Durable data | Does it own or mediate persistent user state? |
| Compatibility | Would arbitrary third-party replacement create unacceptable product compatibility risk? |
| First-party UX | Is it part of the standard VIVIM experience rather than an optional extension? |
| Security | Would a broken implementation materially undermine VIVIM security/sovereignty? |

No single test is sufficient.

## 6.3 Candidate V1 Core Plugins

These are **candidates, not yet ratified**:

~~~text
FOUNDATION
  vivim.vault
  vivim.law
  vivim.run
  vivim.identity / instance
  vivim.config

PRODUCT MODEL
  vivim.world
  vivim.conversation
  vivim.chat
  vivim.evidence

PROVIDER ABSTRACTION
  vivim.provider
  vivim.account
  vivim.session
  vivim.realization

EXTERNAL REALITY
  vivim.browser / substrate

SURFACES
  vivim.chat-surface
  vivim.unified-entry
  vivim.evidence-inspector
~~~

Important: this list is a **discovery target**. The sprint must prove, merge, split, rename, or reject these candidates.

---

# 7. Canonical AI Chat Shape — discovery framework

The canonical AI Chat Shape is not a React tree and not a screenshot clone.

It is a semantic product contract.

Provider-01 should help us discover its minimum stable form.

## 7.1 Shape dimensions

The investigation must cover at least:

### Identity
- provider;
- account;
- session;
- model;
- realization.

### Conversation
- create;
- open;
- list;
- search;
- rename;
- archive/delete;
- switch;
- fork/continue if supported.

### Composition
- text;
- attachments;
- quoted material;
- links;
- structured input;
- optional tool/context inputs.

### Execution
- send;
- stop/cancel;
- retry;
- regenerate;
- continue.

### Response
- text;
- streaming;
- rich content;
- code;
- citations;
- files/artifacts;
- images;
- structured results.

### Intelligence controls
- model;
- reasoning/depth;
- tools;
- capabilities;
- provider-specific generation controls.

### Interaction
- copy;
- edit;
- retry;
- selection;
- search;
- message-level actions;
- conversation-level actions.

### State

At minimum investigate:

~~~text
IDLE
COMPOSING
SUBMITTING
STREAMING
COMPLETED
WAITING
FAILED
CANCELLED
DEGRADED
REQUIRES_AUTHORITY / CONSENT
~~~

Actual canonical states are determined from evidence.

### Durability / truth
- conversation identity;
- message identity;
- provider identity;
- account/session identity;
- timestamps;
- execution metadata;
- evidence/provenance;
- incomplete/failed states.

### Surface composition
- header;
- conversation navigation;
- thread;
- composer;
- action controls;
- results;
- confirmation;
- errors;
- inspector;
- provider-specific extensions.

## 7.2 What makes a shape canonical

A field/behavior belongs in the canonical shape when at least one of these is true:

1. it appears across providers;
2. the product needs it independent of provider;
3. the user mental model depends on it;
4. VIVIM needs it for governance/evidence;
5. it is required to translate between providers without semantic loss;
6. omitting it causes provider #2 to require structural redesign.

A feature does not become canonical merely because Provider-01 has it.

## 7.3 Provider-specific extension rule

Provider-specific behavior should normally follow:

~~~text
Canonical capability / shape
        +
Provider extension
        ↓
Provider realization
~~~

rather than:

~~~text
Provider UI
   ↓
new VIVIM product primitive
~~~

unless evidence shows the concept is actually general.

---

# 8. Provider-01 parity model

“80% parity” must be measurable.

## 8.1 Weighted task coverage

Score meaningful user tasks, not pixel similarity.

Initial weighting:

| Capability family | Weight |
|---|---:|
| Conversation lifecycle | 15 |
| Message composition + send | 15 |
| Response + streaming | 15 |
| History/navigation/search | 10 |
| Model/intelligence controls | 10 |
| Attachments/content types | 10 |
| Message/conversation actions | 8 |
| Account/session identity | 7 |
| Error/recovery/auth states | 5 |
| Provider-specific advanced surface | 5 |
| **Total** | **100** |

Target:

**≥80 weighted points of working meaningful task coverage.**

## 8.2 Non-negotiable reliability floor

The 80-point target does not permit failures in foundational areas merely because the score averages out.

The following must be reliable before claiming the provider is a viable realization:

- authenticated session establishment;
- send;
- response capture;
- conversation identity;
- persistence of canonical state;
- error/refusal truthfulness;
- evidence capture;
- safe external mutation handling where applicable.

## 8.3 Parity statuses

Each capability is tracked as:

~~~text
UNKNOWN
OBSERVED
IMPLEMENTED
VERIFIED
DEGRADED
UNSUPPORTED
PROVIDER-SPECIFIC
PROMOTED
~~~

Only **VERIFIED** contributes fully to the parity score.

---

# 9. Provider learning agenda

Provider-01 is expected to teach us more than “how to click Send.”

For every domain, capture:

| Domain | What we must learn |
|---|---|
| Identity | How provider/account/session/model are distinguishable |
| Navigation | How conversations are addressed and discovered |
| Input | What can actually be submitted and how |
| Streaming | What states/events represent partial and final response |
| Content | Which response forms exist |
| Controls | Which options modify generation |
| Errors | How auth, limits, transient failure and refusal appear |
| Persistence | What provider state survives and how it is revisited |
| Browser substrate | What DOM/AX/network/stream evidence is actually needed |
| Drift | Which observations are stable vs selector/layout noise |
| Extensions | Which features cannot be represented by the current canonical shape |

This becomes the first **Provider Reality Profile**.

---

# 10. Architecture Extraction Ledger

This is the central anti-entropy mechanism for the sprint.

Every non-trivial prototype shortcut or discovery gets an entry.

## 10.1 Entry schema

| Field | Meaning |
|---|---|
| ID | EXT-#### |
| Date | When discovered |
| Build slice | Where it arose |
| Fast implementation | What we did quickly |
| Why fast | Why the shortcut was reasonable |
| Observation | What reality showed |
| Classification | data / contract / plugin / provider / surface / local |
| Trigger(s) | Why extraction is being considered |
| Reuse count | Number of independent consumers |
| Boundary | What should own it |
| Current location | Where code currently lives |
| Proposed home | Candidate destination |
| Evidence | Tests / fixtures / runs / source |
| Decision | keep / extract / defer / reject |
| Owner | Person/agent |
| Follow-up | Exact next action |

## 10.2 Extraction triggers

Use these trigger codes:

- **X1 — second consumer**: same behavior is needed elsewhere.
- **X2 — provider independence**: implementation is not actually provider-specific.
- **X3 — trust boundary**: authority, secrets, evidence, external mutation or safety boundary.
- **X4 — durable state**: state needs a stable canonical owner.
- **X5 — lifecycle**: has its own create/operate/degrade/recover lifecycle.
- **X6 — contract pressure**: multiple callers need a stable protocol.
- **X7 — test isolation**: independent testing is becoming necessary.
- **X8 — versioning**: needs compatibility/version semantics.
- **X9 — complexity concentration**: prototype code is becoming a subsystem.
- **X10 — second provider pressure**: Provider-02 would otherwise duplicate it.
- **X11 — product language**: user-facing concept exists independently of implementation.
- **X12 — evidence boundary**: claim/effect must be independently attributable.

A prototype element can be extracted even with only one current consumer when X3, X4, X6, X8, X11 or X12 applies strongly.

---

# 11. Canonical Data Shape Ledger

Separate this from the extraction ledger.

A data shape is not automatically a plugin.

Track:

| ID | Shape | Why it exists | Durable? | Provider-neutral? | Current implementation | Canonical status |
|---|---|---|---|---|---|---|
| DS-#### | e.g. Conversation | user/product identity | yes | yes | legacy/Ω/new | candidate |
| DS-#### | e.g. Message | semantic interaction | yes | yes | ... | candidate |
| DS-#### | e.g. Account | external relationship | yes | yes | ... | candidate |
| DS-#### | e.g. Session | transient authority/execution | maybe | mostly | ... | candidate |
| DS-#### | e.g. Realization | execution bridge | yes | yes | ... | candidate |

Canonical shape decisions must record:

- semantics;
- identity;
- lifecycle;
- ownership;
- provenance;
- revision;
- provider extensions;
- serialization requirements;
- evidence requirements.

---

# 12. Capability / contract discovery ledger

Track semantic capabilities independently from their realization.

Examples to investigate:

~~~text
conversation.create
conversation.open
conversation.search
message.compose
message.send
message.stop
message.retry
message.regenerate
attachment.add
model.select
tool.select
response.stream
response.inspect
account.select
session.observe
evidence.inspect
~~~

For each:

| Field | Required |
|---|---|
| Capability ID | yes |
| Human meaning | yes |
| Inputs/outputs | yes |
| Authority requirements | yes |
| Durable effects | yes/no |
| Provider dependence | none / partial / strong |
| Current realization | provider/runtime/local |
| Evidence produced | yes |
| Canonical status | candidate/proven/rejected |

The important rule is:

> **Capability is what VIVIM promises; realization is how this provider currently delivers it.**

---

# 13. Surface / slot discovery

The legacy VIVIM slot system is an important starting specimen, not a frozen answer.

Current legacy evidence includes a provider/capability-resolved slot model and chat slots for:

~~~text
header
sidebar
thread
composer
actionBar
entry
bubble
send
attach
streaming
result
confirm
error
~~~

During Provider-01 we should determine:

### A. Which are genuinely canonical?

### B. Which should be product-level components?

### C. Which should be surface slots?

### D. Which should be provider-specific extensions?

### E. Which concepts belong in the underlying state model instead of the UI?

The goal is to discover a canonical **AI Chat Surface Contract**, not merely reproduce the legacy component tree.

---

# 14. Core Plugin discovery ledger

For every candidate core plugin, track:

| Field | Required |
|---|---|
| Plugin ID | yes |
| Product responsibility | yes |
| Why plugin boundary exists | yes |
| Why first-party/core | yes |
| Dependencies | yes |
| Capabilities owned | yes |
| Data owned | yes |
| Trust/authority | yes |
| Replaceability | yes |
| Current Ω evidence | yes |
| Legacy evidence | yes |
| V1 required? | yes/no |
| Promotion evidence | yes |
| Maintenance policy | yes |

Classification:

~~~text
CORE — company-maintained + product foundational

FIRST_PARTY_OPTIONAL — company-maintained but not required by the base product

PROVIDER — realizes external provider behavior

SUBSTRATE — bridges external/local execution reality

SURFACE — user-facing projection/interaction

EXPERIMENTAL — temporary learning implementation

THIRD_PARTY — externally maintained extension

TEST / FIXTURE — evidence-only implementation
~~~

A plugin can move between classes as the product matures.

---

# 15. Anchor-point review system

The sprint must stop periodically and reinterpret what we have built.

## Anchor A — 0–20%

### Question

**Can the smallest VIVIM instance exist?**

Review:

- identity;
- durable path;
- composition;
- vault;
- product surface skeleton.

Output:

- first core-plugin candidates;
- missing instance concepts;
- first extraction entries.

---

## Anchor B — 20–40%

### Question

**Can we perform one complete provider conversation?**

Review:

~~~text
address
→ intent
→ capability
→ realization
→ execution
→ result
→ evidence
~~~

Record:

- state model discoveries;
- account/session discoveries;
- provider boundary discoveries;
- new canonical data shapes.

---

## Anchor C — 40–60%

### Question

**What does a real AI conversation actually contain?**

Review:

- history;
- streaming;
- rich responses;
- controls;
- retries;
- attachments;
- errors;
- message actions.

This is the first major **Canonical AI Chat Shape review**.

---

## Anchor D — 60–80%

### Question

**Can VIVIM express most of the provider's meaningful user task surface without provider-specific product branching?**

Review:

- parity score;
- provider-specific extensions;
- duplicated code;
- extraction triggers;
- plugin boundaries;
- canonical contracts.

This is the main **Second-Provider Readiness Review**.

---

## Anchor E — 80–100%

### Question

**What did Provider-01 teach us about VIVIM itself?**

Freeze a learning snapshot:

- canonical shape v0;
- core plugin set v0;
- data shapes v0;
- capability contracts v0;
- provider realization v0;
- unresolved contradictions;
- rejected assumptions;
- second-provider experiment plan.

---

# 16. The prototype-to-canonical promotion funnel

Nothing becomes “architecture” merely because it works.

Use this funnel:

~~~text
FAST CODE
  │
  ├── no reuse signal → KEEP LOCAL
  │
  └── learning signal
          ↓
     CANDIDATE
          ↓
     evidence review
          ↓
      PROMOTE?
       /     \
     YES      NO
      ↓        ↓
 CANONICAL   DEFER / REJECT
~~~

Promotion requires at least:

- explicit semantic purpose;
- identified owner;
- identified boundary;
- evidence;
- compatibility implications understood;
- tests appropriate to the level;
- no known contradiction with higher-order product principles.

---

# 17. Fast-code quarantine rule

Prototype code may live in ordinary implementation locations temporarily.

However, every intentional shortcut must be visible in the ledger.

Examples:

- local map used instead of canonical Account store;
- provider-specific state embedded in generic Chat object;
- direct browser selector used as an experiment;
- temporary adapter bypassing plugin boundary;
- hard-coded provider model list;
- direct file persistence during early boot;
- mock response used to shape surface before live evidence exists.

The rule is:

> **Temporary is acceptable. Invisible temporary is not.**

---

# 18. The second-provider test

We will eventually choose Provider-02 as an architectural falsifier.

Before starting it, derive a reuse forecast:

~~~text
Provider-01 implementation
      ↓
Canonical layer
      ↓
Provider-02 realization
~~~

For each Provider-01 subsystem classify:

~~~text
REUSE DIRECTLY
REUSE THROUGH CONTRACT
REFACTOR ONCE
PROVIDER-SPECIFIC
WRONG ABSTRACTION
~~~

The quality of the architecture is strongly indicated by how much of Provider-01's **product shell** survives while the realization changes.

---

# 19. Provider realization boundary

The target architecture should trend toward:

~~~text
                    VIVIM AI CHAT
                         │
              canonical contracts
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   Provider-01      Provider-02      Provider-03
   realization       realization       realization
        │                │                │
 browser/API/local  browser/API/...  browser/API/...
~~~

The provider implementation should primarily own:

- observed external semantics;
- provider-specific mapping;
- provider-specific UI differences;
- provider-specific quirks;
- provider-specific capabilities/extensions;
- provider-specific discovery/repair knowledge.

It should not quietly own:

- universal conversation semantics;
- VIVIM identity;
- the canonical evidence model;
- product-wide routing policy;
- universal chat state;
- general UI infrastructure.

---

# 20. Provider Lab evidence requirements

Every meaningful provider behavior should become reproducible evidence where practical.

For important capabilities capture:

~~~text
HYPOTHESIS
  ↓
OBSERVED
  ↓
REPRODUCED
  ↓
IMPLEMENTED
  ↓
VERIFIED
  ↓
PROMOTED
~~~

Evidence may include:

- live authenticated browser run;
- DOM/AX observations;
- network/stream observations where available;
- screenshots/fixtures where appropriate;
- replay fixtures;
- parser output;
- realization record;
- resulting Vault evidence;
- failure/refusal cases.

The objective is to avoid accidentally turning one successful live run into a false generalization.

---

# 21. Architecture decision ledger

Some discoveries are not implementation items. They are decisions.

Track:

| ID | Decision | Alternatives | Evidence | Confidence | Revisit trigger |
|---|---|---|---|---|---|
| ADR-#### | e.g. “Conversation is canonical across providers” | ... | ... | ... | second provider contradiction |

Decisions should be classified:

~~~text
OBSERVATION
HYPOTHESIS
WORKING DECISION
OWNER-RATIFIED
DESTINATION PRINCIPLE
Ω LAW
~~~

This prevents a fast sprint choice from accidentally becoming permanent authority.

---

# 22. Discovery questions that should stay open

The sprint should actively investigate these rather than prematurely answer them.

### Product

- What is the minimum thing a user owns in VIVIM?
- What is the first useful state of an empty VIVIM world?
- When does an AI conversation become part of the VIVIM world?
- What is the user's mental model of a provider/account/session?
- Which actions are “chat” and which are general VIVIM work?

### Plugin model

- What exactly makes something a plugin?
- What does a plugin own?
- Can a plugin own data, or only capabilities?
- Can one plugin expose multiple capabilities?
- How are dependencies declared?
- What is the plugin lifecycle?
- What can be overridden?
- What can be replaced live?
- What is the security boundary?
- How does a user discover/configure a plugin?

### Core classification

- Which plugins must VIVIM maintain?
- What is actually boot-critical?
- What can be replaced by another implementation?
- What compatibility guarantees define “core”?
- Does core status attach to a plugin, a contract, or both?

### Chat model

- What is a Conversation?
- What is a Message?
- What is a response artifact?
- What is a generation/run?
- Where do model/tool settings live?
- What belongs to Account vs Session?
- What is provider state vs VIVIM state?

### Provider reality

- Which behavior is stable?
- Which behavior is incidental UI?
- What external reality should be represented canonically?
- What can be reconstructed?
- What cannot be observed reliably?
- What must remain provider-specific?

### Surface

- What is canonical interaction?
- What is configurable?
- What belongs in slots?
- What belongs in data/state?
- What is a projection of canonical state?

---

# 23. Explicit anti-patterns for this sprint

Do not:

### Build provider-specific product branches everywhere

~~~text
if ChatGPT...
if Claude...
if Gemini...
~~~

is a warning sign unless it is clearly inside a provider realization boundary.

### Create generic abstractions before evidence

Do not create “universal message engine” / “universal provider framework” solely because the names sound right.

### Treat every repeated component as a plugin

Shared code ≠ plugin boundary.

### Treat every plugin as core

Everything-is-a-plugin does not mean everything is first-party foundational.

### Optimize for architectural purity at the expense of learning velocity

The sprint explicitly values fast feedback.

### Let temporary code become hidden architecture

That is the purpose of the ledgers and anchor reviews.

---

# 24. What “done” means for the sprint

The sprint is complete when all of these are true.

## Product

- [ ] One documented command launches the prototype.
- [ ] One identifiable instance is created/loaded.
- [ ] Durable state is outside temporary scratch storage.
- [ ] Composition boots through the governed Ω path.
- [ ] Initial world is honest.
- [ ] One coherent AI Chat surface is usable.
- [ ] One real provider works end-to-end.
- [ ] Meaningful state survives restart.
- [ ] Failures/refusals are truthful.
- [ ] Evidence can reconstruct important actions.

## Provider

- [ ] Provider Reality Profile exists.
- [ ] Weighted parity score is calculated.
- [ ] ≥80 weighted meaningful task coverage is verified.
- [ ] Foundational reliability floor passes.
- [ ] Provider-specific features/extensions are identified.
- [ ] Live evidence/replay corpus exists for critical paths.

## Architecture

- [ ] Canonical AI Chat Shape v0 exists.
- [ ] Provider / Account / Session / Realization semantics are explicit.
- [ ] Candidate Core Plugins are classified.
- [ ] Canonical data shapes are recorded.
- [ ] Capability contracts are recorded.
- [ ] Surface/slot model is characterized.
- [ ] Extraction ledger is complete.
- [ ] Contradictions/rejected assumptions are recorded.
- [ ] Provider-02 reuse forecast exists.

## Governance

- [ ] Prototype shortcuts are visible.
- [ ] Owner decisions are separated from observations.
- [ ] Core plugins have first-party ownership rationale.
- [ ] Evidence exists for promoted contracts.
- [ ] No implementation shortcut has silently become a destination law.

---

# 25. Required sprint artifacts

Create these as the sprint proceeds.

~~~text
docs/destination/
  V1-BUILD-AND-LEARNING-SPRINT.md             ← this control document
  V1-CANONICAL-AI-CHAT-SHAPE.md              ← emerges during sprint
  V1-CORE-PLUGINS.md                          ← emerges during sprint
  V1-PROVIDER-01-REALITY-PROFILE.md           ← provider findings
  V1-PROVIDER-01-PARITY-MATRIX.md             ← weighted coverage
  V1-ARCHITECTURE-EXTRACTION-LEDGER.md        ← EXT-####
  V1-CANONICAL-DATA-SHAPES.md                 ← DS-####
  V1-CAPABILITY-CONTRACT-LEDGER.md            ← CAP-####
  V1-ARCHITECTURE-DECISION-LEDGER.md          ← ADR-####
  V1-SPRINT-LEARNING-REPORT.md                ← final synthesis
~~~

These artifacts are related but intentionally separate. The sprint-control document explains the method; the other artifacts capture the actual discoveries.

---

# 26. Sprint sequence

The sequence is deliberately:

~~~text
0. BASELINE
      ↓
1. INSTANCE
      ↓
2. FIRST PRODUCT SURFACE
      ↓
3. PROVIDER-01 CONNECTION
      ↓
4. FIRST COMPLETE CHAT LOOP
      ↓
5. DEEP CHAT PARITY
      ↓
6. EXTRACTION / CANONICALIZATION
      ↓
7. 80% PARITY
      ↓
8. SECOND-PROVIDER READINESS REVIEW
      ↓
9. SPRINT SYNTHESIS
~~~

Do not wait until step 9 to think about architecture.

---

# 27. Initial V1 architecture hypothesis

This is intentionally a hypothesis to test:

~~~text
                        VIVIM
                          │
           ┌──────────────┼──────────────┐
           │              │              │
        PRODUCT        CAPABILITIES    SURFACES
           │              │              │
        World          Contracts      Chat Surface
        Conversation   Intent         Unified Entry
        Account        Work           Inspector
        Session        Authority      Future Canvas
           │              │
           └──────┬───────┘
                  │
              CORE PLUGINS
                  │
       ┌──────────┼──────────┐
       │          │          │
      Vault      Law        Run
       │          │          │
       └──────────┼──────────┘
                  │
           REALIZATION LAYER
                  │
             Provider-01
                  │
          Browser / API / etc.
~~~

This diagram is **not a commitment**. The first provider and first prototype are expected to change it.

---

# 28. Success metric for the learning system

The sprint should be judged not only by “how much code works.”

Track four separate measures:

### Product Reality

How much of the promised prototype journey actually works?

### Provider Coverage

How much of Provider-01's meaningful task surface is verified?

### Canonical Reuse

How much of the first provider implementation is provider-neutral?

### Architectural Learning

How many important discoveries were captured and resolved rather than buried?

A sprint that ships 80% provider parity but creates three layers of provider-specific hacks is **not** a successful architectural learning sprint.

A sprint that ships a narrower provider slice while producing a clean canonical model that Provider-02 can reuse may be much more valuable.

---

# 29. Final sprint principle

The first build should leave VIVIM **more understandable than when it started**.

At the beginning, many things are concepts.

By the end, we want a much clearer boundary between:

~~~text
WHAT VIVIM IS
WHAT VIVIM PROMISES
WHAT A CORE PLUGIN IS
WHAT A PROVIDER REALIZATION IS
WHAT A CANONICAL DATA SHAPE IS
WHAT A CAPABILITY IS
WHAT A SURFACE IS
WHAT IS TEMPORARY
WHAT WE STILL DO NOT KNOW
~~~

The first provider is not merely a feature.

**It is the experiment that forces these boundaries to become real.**
