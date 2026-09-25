# VIVIM Destination — Reconciliation Map

> Classification: DERIVED — WORKING / RESEARCH
> Status: initial mapping pass; not canonical law.
> Purpose: map the current destination UX/conceptual model into material that already exists in BCP-dev.
> Rule: this document maps, reconciles, and exposes gaps. It does not invent a new architecture.

## 1. Why this exists

The destination foundation was deliberately written at the human/product level:

> My machine. My internet. My accounts. My apps. My data. My intelligence. My rules. My interaction.

The repository already contains substantial embodiments of those ideas in Ω, VIVIM, BCP, and the P1 program. The immediate job is therefore to identify:

1. where each destination concept already exists;
2. what maturity that material has;
3. which P1/delivery track owns the relevant problem;
4. what is genuinely missing or insufficiently connected.

A gap here is **not** permission to design from scratch. First reconcile against existing evidence.

## 2. Status vocabulary

- **Strong** — explicit in current destination/Ω material with meaningful implementation or proof behind it.
- **Partial** — the concept exists, but product expression, integration, or evidence is incomplete.
- **Fragmented** — clearly present across several bodies of work but lacks one coherent product-level representation.
- **Missing / unowned** — materially relevant but current program structure gives it no clear product owner or implementation path.
- **Conflict** — existing material expresses a different rule and must be reconciled before either version becomes destination truth.

## 3. Concept-to-existing map

| Destination concept | Existing material | Current read | Main relationship |
|---|---|---|---|
| **Sovereign personal environment** | Ω end-state vision; local-first/network-optional posture; vault/law/event/capability/composition/Forge/surface stack | **Strong** at destination/architecture level | P1-03/P1-05/P1-06; D1 |
| **My machine** | Ω hermetic boot, local vault, OS/platform gates, Windows portability work; VIVIM local-first architecture | **Strong** technically; product shell incomplete | P1-05; D1 |
| **My internet** | provider.browser, Chrome substrate, discovery/observation/healing plans | **Strong** architecturally; live provider breadth not proven | P1-07/P1-08; D4 |
| **My accounts** | Chrome profile fleet; credential capability; provider/account representations; realization records | **Strong** as substrate; user-facing account model unfinished | P1-05/P1-07; D1/D4 |
| **My apps** | application-like compositions/surfaces; live objects; legacy VIVIM application/surface work | **Partial / fragmented** | P1-05/P1-08; D1 |
| **My data** | one append-only vault; namespaces/retention; evidence/provenance; export/exit principles | **Strong** architecturally; full user lifecycle still needs ownership | P1-03/P1-04; D1/D2 |
| **My intelligence** | replaceable provider realizations; provider.browser v1; realizationRef; optional LLM edge assist | **Strong** conceptually | P1-05/P1-07; D3/D4 |
| **My rules** | law, consent, delegation, budgets, director rules, configuration | **Strong** | P1-06; D3 |
| **My interaction** | NCLL; canonical intent; common operation vocabulary; CLI/MCP/web; canvas/direct manipulation vision | **Strong** conceptually; unified product surface incomplete | P1-04/P1-05/P1-06; D1/D5 |
| **Everything is a plugin** | Ω Forge architecture; plugin manifests/contracts; plugin kernel; compositions; Forges as ordinary plugins | **Strong** | P1-05/P1-08; D5 |
| **Explicit plugin boundaries** | capability grammar; host caps; per-plugin grants; risk classes; declared seams; one-writer namespace rule | **Strong** | P1-05/P1-06 |
| **Default V1 provider set** | Ω provider-browser v1 plus provider packs/simulator history; provider manifests/fleet | **Partial** | Newly clarified product requirement; packaging/onboarding not yet expressed coherently |
| **User choice of provider/plugin/account/model** | provider/realization model; grants; configuration; manifests; NCLL routing syntax; realizationRef | **Partial — important** | P1-05/P1-06/P1-07; D3/D4 |
| **User-owned routing rules** | director rules/policy; provider realizations; no complete product routing UX | **Partial** | P1-04/P1-05/P1-06; D5 |
| **World** | Ω Part II world; `vivim.mind` WorldModel; vault + registry + projections | **Strong** in Ω; product model unfinished | P1-03/P1-04; D2/D5 |
| **Space / workspace** | Ω canvas/`ns canvas`; live-object placement; workspaces/projects/scenes/rooms; legacy VIVIM canvas/workspaces | **Strong conceptually; fragmented implementation** | P1-03/P1-10; D1/D2 |
| **Thing / live object** | Ω live-object 5-tuple; object kinds; ontology baseline; projected entities | **Strong** | P1-03/P1-04 |
| **Surface** | Ω CLI/MCP/daemon/web; surface derivation; canvas as projection; legacy frontend | **Strong technically; finished UX incomplete** | P1-05; D1 |
| **Context** | context refs; WorldModel; NLCL context resolution; aperture/history; P1-04 ownership | **Partial / implementation gap remains** | P1-04; D2/D5 |
| **Attention / standing intent** | director rules; automation namespace; destination attention/proactivity model | **Partial** | P1-04/P1-06; D5 |
| **Addressing** | NCLL frames; symbolic targets; entity grounding; server interpret/execute flows | **Strong in Ω language layer; universal product interaction unproven** | P1-04/P1-05; D5 |
| **Natural-language configuration** | NCLL frames; deterministic parser; director teach/rule/registry; effect preview; consent cards | **Strong for Ω console path** | P1-04/P1-05; D5 |
| **Delegation / agents** | governance/delegation model; `vivim-agent`; agent records; documented agent runtime gap | **Partial** — governance ahead of acting-agent runtime | P1-06; D3/D5 |
| **Work / background execution** | work concept; automation/tick loop; daemon; background web-app execution vision | **Partial** | P1-06/P1-07; D3/D4 |
| **Evidence / provenance** | governed-event atom; evidence refs/offsets; ProvenanceTier × generality; ontology baseline | **Strong** | P1-03 |
| **Memory / second brain** | vault; memory kinds; mind/WorldModel; context/projection work; legacy memory/knowledge systems | **Strong architecturally; product workflow incomplete** | P1-03/P1-04; D2/D5 |
| **Continuity while away** | automation/daemon/event ledger/background work plus destination return/continuity model | **Partial** | P1-06/P1-07; D3/D4/D5 |
| **Verification / explainability** | law/refusal; effect preview; evidence ledger; replay; reconstruction; provenance badges | **Strong** | P1-03/P1-06/P1-09 |
| **Forge / native extension** | Forge architecture; forge plugins; forge-author; generation/proof pipeline | **Strong** | P1-05/P1-08; D5 |
| **Self-evolution / healing** | discover → observe → infer → map → verify → heal; provider maintenance loop | **Strong as architecture; live external proof open** | P1-07/P1-08; D4/D5 |
| **No privileged user class** | explicit destination principle; Forge authoring path; no privileged path rule | **Strong as principle; user-grade implementation to evaluate** | P1-05; D5 |
| **Exit / recoverability** | Ω export/import and append-only/content-addressed model; destination exit principle | **Strong in destination; complete product path not delivered** | P1-03; D1 |
| **Program truth / evidence discipline** | P1-01/P1-02; workstream registry; program board; evidence-first milestones | **Strong** | P1-01/P1-02/P1-09; D6 |

## 4. The most important reconciliation

The destination is **not waiting for another set of abstractions**.

The repository already contains recognizable embodiments of nearly every major idea from the destination discovery conversation. The problem is mainly distribution and connection:

```
DESTINATION INTENT
        ↓
Ω constitutional model
        ↓
Ω runtime / plugin implementation
        ↓
Ω NCLL / mind / director
        ↓
provider / discovery / healing machinery
        ↓
legacy VIVIM product mechanisms
        ↓
P1 proof / migration machinery
        ↓
ONE PRODUCT EXPERIENCE
```

The next job is therefore to determine how these existing pieces compose into the product we have now described.

## 5. Three critical reconciliations

### 5.1 Dynamic capability environment + useful V1

These are compatible, not contradictory:

```
VIVIM CORE
    +
DEFAULT V1 CAPABILITY SET
    +
USER ADDITIONS / PROVIDERS / ACCOUNTS
    +
USER CONFIGURATION + ROUTING
    +
USER COMPOSITIONS
```

The Ω plugin/runtime work already supports the extensibility side. The newly clarified product requirement is that V1 must arrive with a useful default free provider/capability set. The remaining work is product packaging, onboarding, and choice/routing UX.

### 5.2 Capability is not provider

The existing Ω model already points toward:

```
semantic capability
        ↓
one or more realizations
        ↓
provider / plugin / account / implementation
```

The destination discovery adds one explicit user-controlled step:

```
capability
        ↓
available realizations
        ↓
user choice / routing rules
        ↓
authority + execution
```

The repository has most of the lower half. The explicit user-facing choice/routing experience is the significant gap.

### 5.3 Canvas is a projection, not the architecture

The Ω end-state vision already resolves this correctly: the canvas is a spatial projection; vault/event/law/capability/composition machinery remains authoritative.

Therefore we should **reuse** the Ω canvas/object work rather than create a second canvas architecture.

The unresolved question is the finished VIVIM product surface and how its spatial projection coexists with the other surfaces.

## 6. Where each layer belongs

### Destination
Answers:
- what VIVIM is;
- what the person owns;
- what the person experiences;
- what concepts the person encounters;
- what principles survive implementation change.

Current files:
- `docs/destination/NORTH-STAR.md`
- `docs/destination/FOUNDATIONAL-PRINCIPLES.md`
- `docs/destination/HUMAN-EXPERIENCE.md`
- `docs/destination/CONCEPTUAL-MODEL.md`

### Ω architecture
Answers:
- how those concepts are represented and governed;
- what is canonical;
- how plugins, capabilities, law, vault, events, surfaces, Forge, and provider realizations work.

Primary material:
- `omega-baseline/omega-final/docs/forge/OMEGA-ENDSTATE-VISION.md`
- `omega-baseline/omega-final/docs/forge/OMEGA-FORGE-ARCHITECTURE.md`
- `omega-baseline/omega-final/docs/ARCHITECTURE-NEXT-STEPS.md`
- `omega-baseline/omega-final/docs/NCLL-AND-SELF-KNOWLEDGE.md`
- `omega-baseline/omega-final/docs/SURFACES.md`

### Legacy VIVIM / mine
Answers:
- what was actually built;
- what user behavior already works;
- what mechanisms are worth harvesting;
- what pain/complexity should not be repeated.

### P1
Answers:
- what architectural/proof problem is currently being solved;
- what evidence proves it;
- what remains blocked or unproven.

### D/V delivery view
Answers:
- what useful product outcome is being delivered next;
- what user-visible capability that outcome represents;
- which P1 outputs it consumes.

## 7. Actual product gaps exposed by this pass

These are **mapping findings**, not new architecture proposals.

**A. V1 default environment**
Which existing providers/plugins are actually included in the initial distribution, how they appear on first run, and what "free" means operationally.

**B. Capability / realization / user choice**
How the user sees:
- what capability is available;
- which providers/plugins/accounts can realize it;
- which one is currently selected;
- what routing rules govern selection;
- when VIVIM asks for a choice.

**C. Unified world / workspace**
How WorldModel, vault, projected entities, canvas, surfaces, conversations, projects, files, and accounts become one coherent everyday environment.

**D. Product lifecycle**
Install, first run, durable data location, import, backup/recovery, updates, and exit.

**E. Background continuity**
How the existing daemon/automation/event machinery becomes the user experience of:
"while you were away, this happened."

## 8. What we should not do

Do not create new abstractions merely because a destination noun is not named exactly the same way in code.

Do not turn P1-10 into the product canvas owner.

Do not replace the existing Ω plugin/capability model with a new plugin taxonomy.

Do not treat `message.send@1` as the destination capability model; it is the first thin proof vehicle.

Do not promote an historical implementation into destination authority merely because it has the right name.

## 9. Current program shape

```
DISCOVERY CONVERSATION
        ↓
DESTINATION FOUNDATION
        ↓
RECONCILIATION / MAPPING      ← current activity
        ↓
TRUE GAPS + EXISTING ASSETS
        ↓
PRODUCT SURFACE / DELIVERY DESIGN
        ↓
END-STATE BLUEPRINT
        ↓
IMPLEMENTATION / PROOF
```

Remain in the mapping stage until the major destination concepts have been reconciled against actual repository material.

The next useful artifact is a deeper **concept → existing artifact → implementation → proof → delivery owner** map for the major destination areas:

1. environment + world;
2. capabilities + providers + user choice/routing;
3. workspace/canvas/surfaces;
4. intelligence + agents + background work;
5. data/memory/context;
6. Forge/composition/evolution.


## 10. Deep audit — what the repository actually gives us

The first pass was intentionally broad. The deeper pass traced the destination concepts into concrete Ω and VIVIM structures. Several findings need to be made explicit.

### 10.1 The destination environment is currently distributed, not assembled

Ω has multiple strong compositions, each proving a slice:

- `browser` — shippable-v1 browser/provider substrate;
- `chat` — conversation storage/resolution pilot;
- `console` — integrated local console over email/mind/NLCL/director;
- `discovery-mind` — discovery + provider registry pipeline;
- Forge compositions — builder/evolution paths.

Those compositions are evidence of good subsystem boundaries, but none is yet the finished expression of:

> **My machine + my internet + my accounts + my apps + my data + my intelligence + my rules + my interaction.**

This is the central assembly gap.

### 10.2 The Ω WorldModel is not yet the user's whole world

`vivim.mind` is a strong deterministic lens, but its current `WorldModel` is deliberately bounded.

Today its principal grounding material includes:
- active plugins/composition;
- routable operations;
- projected messages;
- derived contacts;
- automation rules;
- taught lexicon;
- current focus/attachments and optional capability-gap data.

Its evidence projection is currently centered on small named namespaces rather than the entire person's digital world.

That is not a flaw in the lens. It means the destination-level **World** is ahead of the current Ω product world.

The legacy VIVIM mine contains much richer domain structures for providers, accounts, conversations, projects, workspaces, canvas, memory, routing, and onboarding. Those are evidence inputs to be harvested, not a second authority model.

### 10.3 Provider choice/routing is the clearest real product gap

The current Ω provider model has:

```
capability/op
    ↓
provider realization
    ↓
status / proof / provenance
```

The current resolver can choose a PROMOTED realization, but the rule is effectively a deterministic default selection (currently first eligible realization by stable id ordering). That is useful for proof and safety; it is not yet the finished user control model.

The legacy VIVIM mine contains materially richer evidence:

- provider definitions;
- provider accounts;
- account defaulting;
- model catalogs;
- provider capability declarations;
- provider-specific capability configuration;
- multi-account/profile strategy;
- routing preferences;
- routing strategies;
- cost budgets;
- fallback ordering;
- learned routing scores;
- explicit target provider lists.

The legacy `ProviderMuxEngine` therefore looks less like an obsolete feature and more like a **harvest candidate for the product concept of user-controlled realization selection**.

Important limitation: the legacy mux does not finish the destination requirement. Its response path records `accountId` but currently dispatches with `accountId: null`, and its learned routing score is provider/capability based rather than a complete user-authored policy over provider + account + model + context + authority.

So the repository gives us substantial raw material for this feature, but not a finished destination implementation.

### 10.4 "Default V1" is a packaging/composition problem, not a new capability architecture

D-418 and D-420 establish a precise shipping boundary:

- `compositions/browser.json` is the shippable-v1 composition;
- v1 is fully Chrome master/slave;
- no AI-API realization ships in v1.

That is a release/substrate statement, not yet a product statement answering which **free default providers** a user receives and how those providers become selectable in the user's environment.

The destination requirement therefore sits one level above the current proof composition:

```
V1 distribution
    ↓
default installed plugins / provider realizations
    ↓
connected user accounts
    ↓
available capabilities
    ↓
user routing / choice
```

Nothing in the deep pass justifies inventing a new plugin architecture for this. The existing composition, provider, realization, credential, and routing material is the source pool.

### 10.5 Accounts are a separate object from providers

This is more important than the first map showed.

The legacy VIVIM provider model distinguishes:

```
Provider
  ├── Definition
  ├── Endpoints
  ├── Models
  ├── Capabilities
  └── Accounts
       ├── identity
       ├── plan/tier
       ├── login state
       ├── profile
       └── Chrome slave
```

Ω's current `ProviderRealization` primarily represents:

```
archetype + provider + class + status + proof
```

Those solve different problems.

For the destination phrase **"my accounts"**, the user will need to be able to distinguish:

- the provider itself;
- the user's account with that provider;
- the browser/profile/session realization serving that account;
- the capability available through that account;
- the user's chosen routing policy.

This is a real reconciliation boundary already visible in the mine. It should not be collapsed into "provider metadata."

### 10.6 The canvas/product surface gap is real and concrete

The Ω architecture gives us the correct constitutional rule:

> canvas is a projection, never the source of truth.

It also gives us the live-object model and `ns canvas` placement semantics.

But the actual richer canvas implementation — primitives, layers, designers, sandbox, workspace presets, adaptive workspace, project/conversation organization — is still in the legacy VIVIM tree.

The old canvas primitive set includes workspace, projects, knowledge, agents, providers, and conversations. That is highly relevant evidence for the destination product surface.

So the current state is:

```
Ω
  = strong canvas/object CONSTITUTION

VIVIM mine
  = strong canvas/UX IMPLEMENTATION EVIDENCE

BCP
  = reconciliation / harvesting machinery

Destination
  = the place where these become one product surface
```

### 10.7 Context is already substantially solved at the substrate level

D-443 is stronger than the first pass implied.

The repository already has a deterministic context substrate:
- cited source rows;
- byte offsets;
- epistemic kinds;
- named eviction;
- deterministic digest;
- principal-scoped cache;
- budget reference;
- explicit refusal on unresolved or unlabelled context.

So the question is no longer "do we need context?" It is:

> **How does the product-level idea of "my current context" map onto this existing deterministic assembly substrate and the richer legacy context/assembly mechanisms?**

That is primarily a P1-04 / product integration question.

### 10.8 Agents: governance is ahead of breadth

The agent machinery is no longer merely hypothetical:
- identity and lineage are vault data;
- spawn authority is scope-based;
- delegation chains and revocation exist;
- `agent.exec` checks scope, realization status, law, and ledgers outcomes.

But the current execution envelope is still narrower than the destination agent concept. In particular, the current v0 execution path is deliberately constrained around attributable `vault.*` calls, while the destination scenario expects agents to orchestrate local deterministic capabilities, provider sessions, AI reasoning, external actions, and background work.

This is therefore a **breadth/integration gap**, not a missing governance concept.

### 10.9 Background continuity has the machinery but not yet the product loop

The repository contains:
- director tick;
- automation rules as data;
- daemon surfaces;
- governed event / ledger machinery;
- provider background direction.

The missing piece is the user-facing loop:

```
standing intent
  → work while away
  → observed changes / actions / results
  → trustworthy return summary
  → pending decisions / next actions
```

The architecture already contains the ingredients; the product has not yet assembled the experience.

### 10.10 Forge / no privileged user class is unusually well represented

The Forge work is one of the strongest alignments with the destination:
- Forges are ordinary plugins;
- no privileged developer path is required by the conceptual model;
- builder composition exists;
- generated artifacts are proposal-only until promoted;
- the house gate mechanically prevents Forge operations from silently entering product compositions.

The remaining product question is ergonomic:

> **Can an ordinary VIVIM user go from "I want this" to a useful new capability/plugin/composition without leaving the environment or learning the architecture?**

The Ω and legacy plugin-builder evidence strongly suggest this is a continuation of existing work, not a new idea.

## 11. Deep bridge matrix

The most useful way to continue is now:

| Destination outcome | Existing asset to reuse | Missing connection | Likely ownership |
|---|---|---|---|
| **My world** | `vivim.mind`, vault, ontology, legacy domain stores | unify more domain projections into one product world | P1-03/P1-04 + D1/D2 |
| **My accounts** | legacy ProviderAccount, Chrome profiles, credentials, provider registry | connect account identity to Ω realization/session/capability model | P1-05/P1-07 + D1/D4 |
| **My capabilities** | plugin manifests, provider registry, WorldModel capability view | expose complete capability universe across installed plugins | P1-05/P1-04 + D1/D5 |
| **My choices** | legacy ProviderMux routing preferences/strategies; Ω realization registry | user-owned routing over provider/account/model/context | P1-04/P1-05/P1-07 + D3/D4 |
| **My interaction** | NLCL, intent, visual spec, CLI/MCP/web | make one interaction layer address the complete world/capability set | P1-04/P1-05 + D1/D5 |
| **My workspace** | Ω live-object model + legacy canvas/workspaces/presets | assemble one product canvas over current vault/world state | P1-03/P1-04 + D1/D2 |
| **My conversations** | `vivim.chat`, import pack, legacy conversation organizers/importers | materialize/import/organize into user workspace at product scale | P1-03/P1-04/P1-08 + D2 |
| **My context** | D-443 context substrate + legacy context assembly | product context/focus semantics over the deterministic substrate | P1-04 + D2/D5 |
| **My delegated work** | `vivim.agent`, law, director, daemon | broaden acting capabilities and user-facing work lifecycle | P1-06/P1-07 + D3/D4/D5 |
| **My continuity** | automation + daemon + event ledger | return/attention/next-action product loop | P1-04/P1-06/P1-07 + D5 |
| **My evolution** | Forge + forge-author + legacy plugin builder | ordinary-user creation path inside VIVIM | P1-05/P1-08 + D5 |
| **My exit** | vault roundtrip/export + destination rule | complete product backup/recovery/migration journey | P1-03 + D1 |

## 12. The key architectural/product boundary

The deep pass suggests the destination should be thought of as **a user-owned assembly**, not as a fixed collection of subsystems.

The repository already provides many of the parts:

```
                USER'S VIVIM
                     │
        ┌────────────┼────────────┐
        │            │            │
     WORLD       CAPABILITIES   CONTROL
        │            │            │
   data/things    plugins      rules
   spaces         providers    routing
   history        realizations authority
   context        accounts     delegation
                     │
                     ▼
                 SURFACES
                     │
            canvas / prompt / views
                     │
                     ▼
              COMPOSITIONS / WORK
                     │
                     ▼
             EVENTS / EVIDENCE
                     │
                     ▼
               MEMORY / TIME
```

The important thing is not to implement this diagram literally. It is to use it as the reconciliation test:

> **Can every user-visible capability be traced back through an existing governed mechanism, and can the user understand/control the relevant choice without needing to understand the mechanism?**

That is the product-level test the current repository has not yet passed.

## 13. Deep-pass conclusion

We should **not** open another conceptual-design phase.

The evidence now supports a mapping/build sequence:

1. reconcile the existing provider/account/routing machinery;
2. reconcile the existing canvas/workspace/product-surface machinery;
3. reconcile import/conversation/memory/context into the World;
4. reconcile agent/background work into the same capability/authority model;
5. only then write the final end-state blueprint from the mapped system.

The final blueprint should therefore be a **synthesis of existing evidence plus explicit gaps**, not a new architecture invented after reading the repository.

## 14. Cross-cutting evolution and self-maintenance boundary

The current reconciliation map should now be read with one additional invariant:

> A destination component is not fully reconciled until its behavior under **change** is understood.

For each major concept, the program must eventually answer:

```
what is its identity?
what can change?
what may change automatically?
what requires authority?
what remains compatible?
what becomes stale?
what happens to active Work?
what happens to evidence?
how is rollback/reconstruction performed?
what does the user need to know?
```

The dedicated evolution design at `EVOLUTION-RECONCILIATION.md` supplies the cross-cutting vocabulary. Its deeper research package must consume the existing World/Object, Work, Product Instance, Forge, Provider Intelligence, Self-Knowledge, vault, evidence, and destination dependency artifacts rather than inventing parallel subsystems.
