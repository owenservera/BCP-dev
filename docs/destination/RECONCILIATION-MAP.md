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
