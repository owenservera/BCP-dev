# VIVIM — Journey → Architecture Mapping

> Classification: DERIVED — ARCHITECTURE RESEARCH / MAPPING VIEW  
> Status: current repository mapping as of 2026-09-25  
> Steward: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/`  
> Purpose: map the existing, evidenced VIVIM product journeys onto the existing destination responsibility, dependency, capability, authority, Work, World, Surface, and vertical-slice structures.

---

## 1. Scope

This document answers one architectural question:

> **Where do the already-defined VIVIM product journeys land in the existing destination architecture, and which existing responsibilities, dependencies, capabilities, authority seams, Work semantics, World objects, Surfaces, and vertical slices do they exercise?**

This is a **mapping artifact**, not a new product model.

It does not introduce:
- a new ontology;
- new product journeys;
- a new capability taxonomy;
- a second authority model;
- a second Work model;
- a new Surface hierarchy;
- a replacement for the existing vertical-slice registry.

The canonical journey names and descriptions are taken from:

- `docs/destination/DESTINATION-MASTER-MAP.md §8`;
- `docs/destination/VERTICAL-SLICE-REGISTRY.md`;
- `AGENTS_CONTEXT/PRODUCT_VISION/STATE.md`;
- the durable System Intelligence journey associations.

The Product Experience Archaeology work on `research/steward-product-experience` is treated as a complementary experience-evidence source. This document deliberately does **not** repeat its lifecycle reconstruction, interaction grammar, UX archaeology, or contradiction inventory. It carries the resulting experience implications into the existing architecture map.

### Launch-prompt note

At the time of this pass, the requested file:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/JOURNEY-ARCHITECTURE-MAPPING/LAUNCH-PROMPT.md`

was not present on the current mainline or on the returned Steward branch set. The mapping was therefore executed directly from the owner-provided mission plus the active Architecture Steward contracts, current destination documents, System Intelligence findings, and the complementary Product Experience Archaeology package. No missing prompt content has been invented.

---

## 2. Existing canonical journey set

The current destination defines exactly eight product journeys:

| ID | Canonical journey | Existing definition |
|---|---|---|
| **J1** | **Open and orient** | open → see world → see changes → see current work → continue |
| **J2** | **Continue work** | open a project → relevant conversations/files/people/context appear → continue without reconstructing state |
| **J3** | **Universal interaction** | address anything → state intent → understand → show material effect → act |
| **J4** | **Delegated action** | describe outcome → durable work → agent/tool/provider acts → progress/result/evidence |
| **J5** | **Provider choice** | request intelligence/action → available realizations → user policy → correct account/session |
| **J6** | **Background continuity** | leave → authorized work continues → return to truthful summary and pending decisions |
| **J7** | **Evolution** | request new ability → capability gap → forge/configure → test → promote → use |
| **J8** | **Exit** | export → restore → reconnect providers/accounts → reconstruct working world |

**Authority/source:** `docs/destination/DESTINATION-MASTER-MAP.md §8`.

These are the journey nodes used below. The mapping does not rename or split them.

---

## 3. Architecture mapping rule

The existing Steward canonical model distinguishes:

- RESPONSIBILITY — what must be owned/accomplished;
- CAPABILITY — a power that can be exercised;
- REALIZATION — a concrete path through which a capability acts;
- OBJECT / WORLD — canonical user-domain state;
- WORK — durable execution subject;
- AUTHORITY — who may authorize an action/change;
- EVIDENCE — material supporting what happened or is claimed;
- VIEW / SURFACE — representation;
- JOURNEY — user-visible outcome path.

The journey is therefore not itself an architectural subsystem.

The mapping direction is:

```text
JOURNEY
  ↓
USER-VISIBLE OUTCOME
  ↓
EXISTING RESPONSIBILITIES
  ↓
EXISTING CAPABILITIES / REALIZATIONS
  ↓
EXISTING AUTHORITY + WORK SEMANTICS
  ↓
EXISTING WORLD / EVIDENCE STATE
  ↓
EXISTING SURFACES
  ↓
EXISTING VERTICAL-SLICE PROOF
```

A journey-to-responsibility relationship is a **product dependency**. It does not mean every responsibility is a hard runtime prerequisite in every scenario.

Where an edge is not already explicitly proven by repository evidence, this document marks the relationship as a destination mapping rather than upgrading it to runtime fact.

---

# 4. Journey-to-architecture map

## J1 — Open and orient

### Existing outcome

> open → see world → see changes → see current work → continue

### Primary responsibilities

| Responsibility | ID | Role in J1 |
|---|---|---|
| Product Instance identity | **R-102** | identifies the durable user-owned environment being reopened |
| Product persistence / continuity | **R-103** | reconnects composition, world, configuration and history across opens |
| Canonical vault/storage | **R-027** | durable source of canonical local state |
| Canonical object identity | **R-028** | preserves identity of things shown on arrival |
| Ontology | **R-048** | supplies semantic types/relationships for the world |
| World projection | **R-049** | derives the user-visible world view |
| Derivation / projection | **R-044** | turns canonical state into representations |
| Query / retrieval | **R-043** | supplies changes, current work and relevant state |
| Self-Knowledge | **R-052** | can expose environment/configuration/capability state when part of orientation |
| Attention | **R-090** | determines what deserves foreground attention |
| Return / re-entry continuity | **R-093** | produces return state/summary where applicable |
| Workspace / space model | **R-094** | organizes the arrival context |
| Surface / view model | **R-095** | renders the relevant representation |
| Canvas / spatial layout | **R-096** | provides spatial arrival where the chosen surface is canvas-based |
| Native product shell | **R-098** | supplies the inhabited launch surface |
| Product diagnostics / repair UX | **R-122** | relevant when arrival exposes repair/recovery state |

### Capabilities exercised

The journey uses existing capabilities/responsibilities for:

- inspect/query the current world;
- retrieve relevant objects and recent changes;
- open/focus the current space or project;
- surface current Work;
- navigate among existing representations;
- inspect environment state when needed.

The semantic capability model remains **R-010 Capability definition** plus the concrete query/world/surface responsibilities above. No new "orientation capability" is introduced.

### Authority

J1 is principally a **read / presentation / continuity** journey.

Authority remains relevant for:
- which external sources are available to inspect;
- which data the environment may surface;
- attention configuration;
- consequential actions taken after orientation.

The relevant existing authority responsibilities are **R-064 Authority model**, **R-065 Law / policy semantics**, and **R-066 Consent** where the post-arrival interaction becomes consequential.

### Work

Work is **not intrinsic to opening**.

Instead:
- current Work may be one of the states surfaced by J1;
- an existing Work item may establish the user's current continuation context;
- new Work begins only when the user performs/delegates an outcome.

This preserves the existing distinction between Work and mechanism.

### World

J1 is the clearest consumer of the canonical:

```text
Vault / Evidence
      ↓
Canonical Things + Relationships
      ↓
World Projection
      ↓
Space / Workspace
      ↓
Surface
```

The world shown on arrival is a **projection**, not a dashboard-owned data store.

### Surface

Existing destination surfaces implicated:

- native product shell;
- workspace/space;
- canvas/spatial environment;
- object/project views;
- attention/return presentation.

The current world/surface boundary remains explicit: **R-049 World projection → R-095 Surface / R-096 Canvas**, not surface → canonical truth.

### Vertical slices

- **Primary: VS1 — Run my VIVIM**
- **Supporting: VS5 — return to a changed world with truthful continuity**
- **Lifecycle relationship: VS8 — reconstruction/exit**

VS1 already defines the minimum:

> install → start → local durable world → reopen → state remains.

### Evidence

Relevant current evidence includes:

- **SI-040101 — VIVIM Product Instance**: persistent environment boundary; J1/J2/J8; VS1/VS5/VS8.
- **SI-040102 — World projection**: J1/J2/J3/J5/J6; VS1/VS2/VS3/VS5.
- **SI-040103 — Space / workspace / canvas projection**: J1/J2/J3/J6; VS1/VS3/VS5.
- **SI-050106 — World ↔ Surface**: explicit canonical-world / derived-surface boundary; J1/J2/J3/J5/J6.
- **SI-050107 — Product Instance ↔ Persistence**: durable instance boundary distinct from temporary runtime state; J1/J8; VS1/VS8.
- **SI-060105 — Product shell / lifecycle**: arrival, lifecycle and recovery remain under-modelled at product depth.

### Current architectural read

J1 is the entry point that proves whether **Product Instance + Vault + World + Workspace + Surface** actually form one environment.

The main incompleteness is not missing vocabulary. It is the unassembled product lifecycle represented by **R-102/R-103/R-098/R-101/R-105**.

---

## J2 — Continue work

### Existing outcome

> open a project → relevant conversations/files/people/context appear → continue without reconstructing state

### Primary responsibilities

| Responsibility | ID | Role in J2 |
|---|---|---|
| Canonical object identity | **R-028** | stable project/conversation/file/person identities |
| Object lifecycle | **R-029** | preserve/modify/restore project-linked objects |
| Relationship model | **R-031** | express project ↔ conversation/file/person relationships |
| Identity reconciliation | **R-032** | preserve correspondence across imported/external identities |
| Relationship reconciliation | **R-033** | maintain changing relationships |
| Query / retrieval | **R-043** | gather relevant project state |
| World projection | **R-049** | make project-related world state addressable |
| Context assembly | **R-050** | select relevant information for the current work |
| Memory | **R-051** | carry retained context where semantically appropriate |
| Self-Knowledge / freshness | **R-052/R-053** | relevant when project context depends on VIVIM's current state |
| Language grounding | **R-058** | resolve explicit project/file/person references |
| Intent formation | **R-059** | express the continuation action |
| Durable Work | **R-069** | preserve/continue entrusted outcomes |
| Revision / history | **R-030** | maintain temporal continuity |
| Provenance / source genealogy | **R-034** | retain origin of imported/external information |
| Workspace / space model | **R-094** | present project as an organized working context |
| Surface / view model | **R-095** | expose the relevant project representations |

### Capabilities exercised

Existing capability responsibilities include:

- query/retrieve project state (**R-043**);
- inspect/open objects (**R-049/R-095**);
- resolve project/file/person addresses (**R-058**);
- assemble current context (**R-050**);
- perform the next project action via ordinary capabilities (**R-010**).

Conversation import/storage is already represented elsewhere in the destination and System Intelligence evidence; this mapping does not create a new "project capability."

### Authority

J2 may be read-heavy, but authority still governs:
- source accessibility;
- external data exposure;
- edits/mutations;
- any delegated work initiated from the project.

Relevant responsibilities:

- **R-064 Authority**
- **R-065 Law / policy**
- **R-066 Consent**
- **R-068 Risk classification**

### Work

The central Work question in J2 is **continuation without reconstruction**.

Existing R-069/R-070/R-071 mean the architecture can preserve:
- the outcome being pursued;
- steps/attempts;
- recovery;
- evidence/history.

The remaining product gap is the join from canonical project/context state to one coherent continuing Work experience.

### World

J2 depends strongly on:

```text
PROJECT / CONVERSATION / FILE / PERSON
            ↓
RELATIONSHIPS + PROVENANCE
            ↓
WORLD
            ↓
CONTEXT
```

The project is a World object/context, not a separate persistence silo.

### Surface

The existing destination has evidence for:
- project views;
- conversation views;
- workspace/space organization;
- canvas/spatial arrangement;
- multiple representations of the same Thing.

The product boundary remains **World → Surface**, not Surface → World authority.

### Vertical slices

- **Primary: VS2 — Bring my AI history**
- **Supporting: VS5 — truthful continuity**
- **Adjacent: VS3 — act on the project through provider/account routing**

VS2 requires:

> import supported history → project relationship → browse/search/inspect → provenance preserved.

### Evidence

- **SI-020104 — Legacy conversation/message persistence**: Conversation and ConversationMessage support live/imported/history-synced conversations; J2/J3/J5/J8; VS2/VS3/VS5/VS8.
- **SI-050106 — World ↔ Surface**: canonical world to surface projection.
- **SI-050105 — Work ↔ Evidence**: Work + vault can retain execution evidence; J2/J4/J6/J7.
- **SI-060103 — Account/routing canonical gap**: project continuity may depend on account/provider relationships.
- **SI-060104 — World projection breadth**: broader cross-domain world projection remains incomplete.

### Current architectural read

J2 is the clearest test that **Context is derived from a persistent World rather than reconstructed ad hoc per application**.

Its most consequential unresolved edges are **World ↔ Context ↔ Work ↔ Surface**, not the existence of more project UI.

---

## J3 — Universal interaction

### Existing outcome

> address anything → state intent → understand → show material effect → act

### Primary responsibilities

| Responsibility | ID | Role in J3 |
|---|---|---|
| Addressing / grounding | **R-058** | resolve the addressed Thing/space/provider/capability/etc. |
| Intent formation | **R-059** | canonical representation of what the person wants |
| Plan formation | **R-060** | proposed execution strategy where required |
| Deterministic feedback / interpretation preview | **R-062** | show machine interpretation before consequential action |
| Capability definition | **R-010** | semantic powers available to the environment |
| Capability reference/token | **R-011/R-012** | stable capability invocation and authorization carrier |
| Context assembly | **R-050** | relevant world evidence for the intent |
| Authority model | **R-064** | who may authorize the effect |
| Law / policy semantics | **R-065** | permitted action under policy |
| Consent | **R-066** | explicit owner permission where required |
| Risk classification | **R-068** | determine effect-risk handling |
| Durable Work | **R-069** | execution subject where the request becomes Work |
| Execution realization | **R-073** | concrete implementation used to exercise capability |
| Evidence model | **R-035** | record what supports the interpretation/result |
| Verification | **R-037** | verify state/effect/claim where required |
| World projection | **R-049** | provide addressable canonical context |
| Surface / view model | **R-095** | interaction/presentation surface |
| Direct manipulation | **R-097** | non-language path that must converge on the same semantic model |

### Canonical interaction mapping

The existing destination spine is:

```text
ADDRESS
  ↓
INTENT
  ↓
CONTEXT
  ↓
CAPABILITY
  ↓
CHOICE / ROUTING
  ↓
AUTHORITY
  ↓
WORK
  ↓
EXECUTION
  ↓
EVIDENCE
  ↓
MEMORY / WORLD UPDATE
```

This is the existing mapping from `INTERACTION-INTENT-WORK-RECONCILIATION.md`. It is not a new chain.

### Capabilities

J3 is the broadest capability-consuming journey.

The important distinction is:

```text
Intent ≠ Capability
Capability ≠ Realization
Realization ≠ Authority
Authority ≠ Execution
```

The existing Core/Plugin responsibility matrix already gives each seam its owner.

### Authority

J3 is where the existing authority separation is most visible:

```text
WHAT do I want?
  = Intent

WHAT power is needed?
  = Capability

HOW can it be realized?
  = Realization / Routing

MAY it happen?
  = Authority / Law / Consent

WHAT happened?
  = Work + Evidence
```

Relevant responsibilities: **R-064–R-068**.

### Work

J3 does not require every interaction to become long-running Work.

Existing **R-069 Durable Work** permits immediate or durable execution, while the user-visible distinction remains whether an outcome has been entrusted and needs state/history.

### World

J3 depends on World for addressing and context:

- target objects;
- current space;
- project;
- person;
- provider/account;
- capability;
- Work;
- composition/surface.

### Surface

Existing surfaces can participate:
- universal prompt / NCLL path;
- canvas/direct manipulation;
- object/project/conversation views;
- CLI/MCP/other existing entry surfaces where applicable.

All must converge on the existing intent/control path rather than create parallel semantic command systems.

### Vertical slices

- **VS0 — one governed external action**
- **VS3 — choose provider/account and perform work**
- **VS6 — create/modify a capability**
- **VS7 — survive provider drift** where the interaction traverses a provider realization that changes.

### Evidence

- **SI-020101 — Legacy capability resolution/execution**: typed capability resolution and provider execution; J3/J5; VS3.
- **SI-050103 — Capability ↔ Realization**: verified separation of routable capability contract and ProviderRealization; J3/J5/J7.
- **SI-050104 — Intent ↔ Capability ↔ Authority**: intent, capability resolution, and law/consent are separate seams; J3/J4/J5/J7.
- **SI-030104 — D-411 intent evolution**: current canonical intent persistence and resolution rows.
- **SI-060102 — Provider live code still needs live proof**: current browser path exists in code, but owner-side live execution remains pending.

### Current architectural read

J3 is the integration seam through which most of the destination architecture becomes one interaction system.

Its central dependency is not "chat." It is the existing **Address → Intent → Capability → Routing → Authority → Work** structure.

---

## J4 — Delegated action

### Existing outcome

> describe outcome → durable work → agent/tool/provider acts → progress/result/evidence

### Primary responsibilities

| Responsibility | ID | Role in J4 |
|---|---|---|
| Intent formation | **R-059** | record the requested outcome |
| Plan formation | **R-060** | define the proposed execution path |
| Authority model | **R-064** | establish permissible action |
| Law / policy | **R-065** | constrain delegated action |
| Consent | **R-066** | obtain approval where required |
| Delegation | **R-067** | grant bounded authority |
| Risk classification | **R-068** | effect-risk handling |
| Durable Work | **R-069** | canonical outcome being pursued |
| Plan / step / attempt semantics | **R-070** | execution decomposition and attribution |
| Work recovery / reconciliation | **R-071** | recover after interruption/unknown effects |
| Agent | **R-072** | governed actor performing Work |
| Execution realization | **R-073** | capability implementation |
| Scheduler / durable waits | **R-074** | continued execution/waiting |
| Resource governance | **R-075** | bound resource usage |
| Evidence / provenance | **R-034/R-035** | show what was used and what happened |
| Verification | **R-037** | independently confirm outcome/effect |
| Background continuity | **R-092** | execution can outlive current interaction |
| Return / re-entry continuity | **R-093** | make resulting state intelligible on return |

### Capabilities

J4 composes existing capabilities. It does not require an "agent capability universe" separate from the existing capability model.

The agent is the actor; **Work** remains the canonical entrusted outcome.

### Authority

This journey is governed by the existing:

**Authority → Law → Consent → Delegation → Risk**

Important distinction:

> An agent's existence does not grant it arbitrary product authority.

Delegation creates bounded authority for a Work context.

### Work

J4 is the strongest direct test of **R-069–R-074**.

The expected existing lifecycle is:

```text
requested
→ planned
→ running
→ waiting
→ outcome
→ remembered
```

The more explicit state language in D5 expands this to:

```text
DRAFT
→ READY
→ RUNNING
→ WAITING
→ SUCCEEDED / FAILED / REFUSED / CANCELLED
→ REVIEWED
```

This remains an existing reconciliation view, not a new Work ontology.

### World

Work consumes:
- project/context;
- relevant Things;
- provider/account/session state where required;
- existing memory/history;
- authoritative evidence.

Work then produces:
- result;
- evidence;
- changes to the World;
- possible attention.

### Surface

Existing surface responsibilities:
- Work progress/result;
- evidence inspection;
- approval/consent;
- background/return state;
- project/world updates.

The orchestration graph is not the primary user representation.

### Vertical slices

- **Primary: VS4 — delegate durable work and leave**
- **Supporting: VS5 — return to changed world with truthful continuity**
- **Adjacent: VS3 — provider/account realization**
- **Adjacent: VS6/VS7** where Work invokes Forge or provider-healing behavior.

### Evidence

- **SI-050105 — Work ↔ Evidence**: run/work mechanisms and vault revisions can persist execution evidence; J2/J4/J6/J7.
- **SI-040105 — Durable work and continuity**: product-level requested→planned→running→waiting→outcome→remembered semantics remain incomplete.
- **SI-050104 — Intent ↔ Capability ↔ Authority**.
- **SI-060107 — Continuity / attention**: return-to-user loop remains product-grade gap.

### Current architectural read

The existing architecture already separates **Agent, Work, Capability and Authority**. The major missing assembly is a product-grade durable loop that remains truthful when execution continues after the initiating interaction.

---

## J5 — Provider choice

### Existing outcome

> request intelligence/action → available realizations → user policy → correct account/session

### Primary responsibilities

| Responsibility | ID | Role in J5 |
|---|---|---|
| Capability definition | **R-010** | start from what the environment can do |
| Provider identity | **R-076** | identify the external provider |
| Account identity | **R-077** | identify the person's authenticated relationship |
| Session identity | **R-078** | identify the concrete active interaction |
| External resource identity | **R-079** | identify profile/process/page/model/resource |
| External resource lifecycle | **R-080** | available/active/expired/etc. |
| Provider realization | **R-081** | concrete provider-specific implementation |
| Routing / selection | **R-082** | select among valid realizations |
| Fallback / preference / constraints | **R-083** | user-owned selection policy |
| Provider knowledge | **R-084** | versioned knowledge of provider behavior |
| Discovery | **R-085** | establish available candidates |
| Healing / repair | **R-086** | maintain realizations under drift |
| Browser realization | **R-087** | browser-mediated external action |
| Credentials / secret references | **R-088** | governed credential references |
| Context assembly | **R-050** | determine which routing constraints/context apply |
| Authority / consent | **R-064–R-068** | govern the resulting work |
| Execution realization | **R-073** | actual capability implementation |
| Evidence / provenance | **R-034/R-035** | prove what provider/account/realization was used |

### Canonical provider mapping

Existing destination reconciliation says:

```text
CAPABILITY
   ↓
AVAILABLE REALIZATIONS
   ↓
ACCOUNT / MODEL / SESSION
   ↓
USER ROUTING POLICY
   ↓
AUTHORIZED WORK
   ↓
ACTUAL REALIZATION + EVIDENCE
```

Provider, Account, Session and Realization are deliberately separate responsibilities.

### Capabilities

The semantic starting point remains **Capability**, not Provider.

The user may care about provider/account/model when choice matters, but the architecture remains:

```text
Capability
  → candidates
  → routing policy
  → realization
```

This preserves the existing capability-centric model without erasing provider-specific behavior.

### Authority

Routing is **not** authority.

Existing separation:

```text
Discovery
  establishes candidates

Routing
  chooses among valid candidates

Law / Authority
  determines whether chosen Work may happen

Execution
  performs it

Evidence
  records what happened
```

Relevant responsibilities: **R-064–R-068 + R-082–R-083**.

### Work

The provider choice occurs before or during execution of existing Work.

The selected account/session/realization belongs to the execution attribution of that Work.

There is no need for a new "Provider Work" concept.

### World

Provider and Account are Things/relationships in the destination World. The World may represent:
- providers;
- accounts;
- services;
- sessions/resources where product semantics make them user-addressable.

Canonical world state does not become a cache of external provider truth merely because provider information is represented locally.

### Surface

Existing relevant surfaces:
- account/provider configuration;
- capability choice;
- routing/configuration controls;
- consent/approval surface;
- evidence/result inspection;
- project/work views.

### Vertical slices

- **Primary: VS3 — choose provider/account and perform work**
- **Supporting: VS7 — survive provider drift**
- **Lifecycle: VS8 — reconnect providers/accounts after restore**

### Evidence

- **SI-020102 — Legacy Provider Account model**: concrete ProviderAccount tying provider/account/login/profile/session relationships; J2/J3/J5/J8; VS3/VS5/VS8.
- **SI-020103 — Legacy ProviderSession/ProfileSession chain**: separate provider/profile session evidence; J2/J3/J5.
- **SI-050101 — Provider ↔ Account**: destination boundary and missing first-class Ω account bridge.
- **SI-050102 — Account ↔ Session ↔ Browser**: lifecycle and account-choice seam remains incompletely characterized.
- **SI-050103 — Capability ↔ Realization**.
- **SI-050108 — Provider ↔ Routing**: legacy routing behavior exists; durable destination policy remains incomplete.
- **SI-060102 — Provider live code still needs live proof**.
- **SI-060103 — Account/routing canonical gap**.
- **SI-040106 — Provider/account user journey**.

### Current architectural read

J5 is where the destination promise **“my internet / my accounts / my intelligence / my rules”** becomes a concrete architecture path.

The most important unresolved seam is already named by the repository: **R-077 Account identity + R-082/R-083 Routing + R-078/R-079 Session/Resource**.

---

## J6 — Background continuity

### Existing outcome

> leave → authorized work continues → return to truthful summary and pending decisions

### Primary responsibilities

| Responsibility | ID | Role in J6 |
|---|---|---|
| Context assembly | **R-050** | retain the relevant work/world context |
| Durable Work | **R-069** | work survives the interactive session |
| Plan / step / attempt | **R-070** | continue attributable work |
| Work recovery | **R-071** | recover/ reconcile interrupted work |
| Agent | **R-072** | actor for delegated/background Work |
| Scheduler / triggers / durable waits | **R-074** | determine when work wakes or continues |
| Resource governance | **R-075** | govern ongoing resource usage |
| Attention | **R-090** | determine what deserves return/notification |
| Notification / delivery | **R-091** | deliver attention through existing surface/OS channels |
| Background continuity | **R-092** | continue authorized Work after interaction ends |
| Return / re-entry continuity | **R-093** | summarize changes, results, failures, pending user work |
| World projection | **R-049** | expose changed World state |
| Evidence model | **R-035** | make changes/results truthful and inspectable |
| Product persistence | **R-103** | preserve cross-session continuity |

### Capabilities

The existing capability model is reused.

Background execution is not a separate capability class; it is a **lifecycle condition of Work** under **R-092**.

### Authority

The critical distinction already present in D5 is:

- Agent = actor;
- Work = outcome;
- Standing Intent = continuing user instruction;
- Attention = what should be surfaced.

Authority comes from existing law/delegation/consent semantics. Attention does not grant authority.

Relevant responsibilities: **R-064–R-068, R-074, R-090–R-093**.

### Work

J6 is primarily a test of:

```text
Work
  → survives session boundary
  → progresses / waits / fails / succeeds
  → accumulates evidence
  → produces world changes
  → becomes attention on return
```

No new background-work ontology is required.

### World

J6 closes the loop:

```text
Work / External effect
        ↓
Evidence
        ↓
World change
        ↓
Attention
        ↓
Return surface
```

This is an existing destination relationship described by D5 and System Intelligence findings.

### Surface

The product surface must communicate:
- completed work;
- running work;
- waiting for user;
- changed world;
- failure/refusal;
- useful next action.

The exact finished return surface is not yet canonical; **R-093** is the existing responsibility for it.

### Vertical slices

- **Primary: VS5 — return to a changed world with truthful continuity**
- **Supporting: VS4 — delegate durable work and leave**
- **Adjacent: VS7** when background work depends on provider healing/drift handling.

### Evidence

- **SI-040105 — Durable work and continuity**.
- **SI-060107 — Continuity / attention**.
- **SI-050105 — Work ↔ Evidence**.
- **SI-040103 — Space / workspace / canvas projection**.
- **SI-040102 — World projection**.

### Current architectural read

J6 is the principal join between **Work, World, Attention and Surface**.

The repository does not need another scheduler abstraction to express it. The missing closure is the user-facing transition:

**ongoing Work → truthful World change → Attention → Return**.

---

## J7 — Evolution

### Existing outcome

> request new ability → capability gap → forge/configure → test → promote → use

### Primary responsibilities

| Responsibility | ID | Role in J7 |
|---|---|---|
| Intent formation | **R-059** | request the desired outcome/ability |
| Capability definition | **R-010** | define the semantic power being sought |
| Forge | **R-113** | generate/combine/test/promote candidates |
| Plugin distribution / ecosystem | **R-114** | acquire/manage extension contributions where applicable |
| Evolution | **R-115** | govern change to product behavior/plugins/data/configuration |
| Compatibility | **R-116** | assess replacements across dimensions |
| Impact analysis | **R-117** | derive affected Work/resources/projections |
| Migration | **R-118** | preserve semantics/history during transition |
| Promotion / activation | **R-119** | candidate → verified → compatible → active |
| Rollback / quarantine / retirement | **R-120** | reverse safely without erasing history |
| Plugin compatibility / replacement | **R-123** | replace implementations while preserving data/Work |
| Provider knowledge | **R-084** | update knowledge of external providers |
| Healing / repair | **R-086** | detect/propose/verify provider repair |
| Evidence / provenance | **R-034/R-035** | support candidate/proof status |
| Verification | **R-037** | prove the candidate/change |
| Authority / law / consent | **R-064–R-068** | govern promotion and consequential changes |
| Execution realization | **R-073** | use the promoted realization |
| Durable Work / recovery | **R-069–R-071** | carry out longer-running evolution activities where applicable |

### Capabilities

J7 operates on the existing capability model.

The "capability gap" is a condition in the existing world/runtime, not a new ontology class.

The existing semantic relationship is:

```text
Capability needed
   ↓
No sufficient valid realization
   ↓
Forge / configure / discover
   ↓
Candidate
   ↓
Test / verify
   ↓
Promotion
   ↓
Use
```

### Authority

Evolution is explicitly governed.

Promotion, replacement and activation must not become a hidden bypass around:
- admission;
- law;
- compatibility;
- evidence;
- rollback.

Relevant existing responsibilities: **R-001–R-025**, **R-113–R-123**, **R-064–R-068**.

### Work

J7 may use existing Work for multi-step evolution activity, but no new "Evolution Work" type is necessary.

The existing **R-115–R-120** change/evolution responsibilities govern the lifecycle; **R-069–R-071** supply durable execution semantics when work is long-running.

### World

Evolution changes canonical representations of:
- capabilities;
- plugins/compositions;
- configuration;
- provider knowledge;
- perhaps World-facing projections.

The canonical world must survive implementation replacement.

### Surface

Relevant existing surfaces:
- capability/configuration surface;
- Forge surface;
- proposal/test/result views;
- evidence/diagnostic views;
- approval/consent surface;
- repaired/replaced capability representation.

The exact normal-user Forge UX remains a product gap, but the architecture responsibilities are already present.

### Vertical slices

- **Primary: VS6 — create/modify a capability from inside VIVIM**
- **Supporting: VS7 — survive provider drift**
- **Adjacent: VS8** when evolution must coexist with export/reconstruction.

### Evidence

- **SI-030107 — Ω Forge mine/harvest boundary**: Forge/mining is explicitly separated from product implementation; provenance/generalities retained.
- **SI-030105 — Ω evolution from core seam laws to substrate chain**.
- **SI-050103 — Capability ↔ Realization**.
- **SI-050104 — Intent ↔ Capability ↔ Authority**.
- **SI-030106 — BCP provider-browser divergence**.
- **SI-060102 — Provider live code still needs live proof**.
- **R-113–R-123** in the current responsibility matrix.

### Current architectural read

J7 is already represented by an existing evolution control system. The open work is principally **productization and proof composition**, not creation of a second evolution architecture.

---

## J8 — Exit

### Existing outcome

> export → restore → reconnect providers/accounts → reconstruct working world

### Primary responsibilities

| Responsibility | ID | Role in J8 |
|---|---|---|
| Product Instance identity | **R-102** | define the environment being reconstructed |
| Product persistence / continuity | **R-103** | preserve composition/world/config/history |
| Export / exit | **R-046** | emit user-owned recoverable state |
| Restore / reconstruction | **R-047** | reconstruct the environment from durable state |
| Backup / recovery / reconstruction | **R-105** | product-level recovery without hidden central dependency |
| Canonical vault/storage | **R-027** | source of durable state |
| Canonical object identity | **R-028** | preserve identity during reconstruction |
| Revision / history | **R-030** | retain history |
| Provenance / source genealogy | **R-034** | retain origin/traceability |
| Evidence model | **R-035** | preserve supported historical claims/effects |
| World projection | **R-049** | reconstruct the user's world |
| Configuration | **R-104** | reconstruct user-owned policy/configuration |
| Provider identity | **R-076** | reconnect the external service relationships |
| Account identity | **R-077** | reconnect user-owned provider relationships |
| Session identity | **R-078** | re-establish concrete external interaction relationships |
| Resource identity/lifecycle | **R-079/R-080** | rehydrate/reconnect external resources where applicable |
| Routing / selection | **R-082** | restore user-owned routing choices |
| Fallback/preferences/constraints | **R-083** | restore user policy |
| Verification | **R-037** | verify reconstructed state/effects where required |
| Evolution / compatibility | **R-115/R-116** | ensure reconstruction across versions/replacements |

### Capabilities

Existing capabilities include:
- export;
- import/acquisition;
- inspect;
- restore/reconstruct;
- provider/account reconnect;
- verify.

These are already represented by **R-045–R-047** and related provider responsibilities.

### Authority

The owner retains authority over:
- export;
- restore;
- configuration;
- provider/account reconnection;
- any consequential external reconnection.

The exit journey is also a direct expression of the foundational principle that essential state remains portable and recoverable.

### Work

Exit/reconstruction may execute through existing Work semantics when multi-step, but the architecture does not require a new "Restore Work" type.

The essential guarantee is that reconstructed state is attributable, evidence-backed, and preserves canonical identity.

### World

The intended reconstruction is:

```text
Exported owned state
      ↓
Vault / canonical records
      ↓
Objects + Relationships
      ↓
World projection
      ↓
Workspace / Surface
      ↓
Provider / Account reconnection
```

This preserves the existing World/Surface boundary.

### Surface

Existing product surfaces implicated:
- export/backup;
- restore/recovery;
- reconnect accounts/providers;
- diagnostics;
- world/workspace reconstruction;
- verification/evidence.

### Vertical slices

- **Primary: VS8 — export and reconstruct the working environment**
- **Supporting: VS1 — install/start/reopen**
- **Adjacent: VS3 — provider/account selection and action**

### Evidence

- **SI-040101 — VIVIM Product Instance**: J1/J2/J8; VS1/VS5/VS8.
- **SI-050107 — Product Instance ↔ Persistence**: J1/J8; VS1/VS8.
- **SI-040106 — Provider/account user journey**: J2/J3/J5/J8; VS3/VS5/VS8.
- **SI-060101 — Implementation is not product proof**: machine-side implementation maturity must not be promoted into product completeness; J1/J8.
- **SI-060105 — Product shell / lifecycle**: install/update/recovery/product shell remains incomplete at product depth.
- **R-046/R-047/R-101–R-105** in the responsibility matrix.

### Current architectural read

J8 is the strongest test of whether the environment is actually **user-owned rather than merely locally stored**.

The existing vault/export ingredients are not enough by themselves; the product must reconstruct the same meaningful environment, configuration and external relationships without hidden central dependencies.

---

# 5. Cross-journey responsibility coverage

The eight journeys reuse a relatively stable set of architectural responsibilities.

| Responsibility cluster | J1 | J2 | J3 | J4 | J5 | J6 | J7 | J8 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Product Instance / persistence | ✓ | ✓ |  |  |  | ✓ |  | ✓ |
| Vault / Evidence / provenance | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Ontology / World / identity | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Context |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| Address / grounding / Intent |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Capability / realization |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Routing / Provider / Account / Session |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Authority / Law / Consent |  |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Durable Work / Agent / execution | (current Work shown) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | (reconstruction may use Work) |
| Attention / return continuity | ✓ | ✓ |  | ✓ | ✓ | ✓ | ✓ | ✓ |
| Workspace / Surface / Canvas | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Forge / Evolution / compatibility |  |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Product shell / lifecycle | ✓ | ✓ |  |  |  | ✓ | ✓ | ✓ |

This table is a **journey participation view**, not a claim that every checked responsibility is a hard dependency for every concrete implementation.

---

# 6. Journey → dependency structure

The current dependency model already defines broad keystones by journey:

| Keystone | J1 | J2 | J3 | J4 | J5 | J6 | J7 | J8 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Vault / Evidence / Provenance | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Ontology / World Identity | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Ω Runtime / Capabilities | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Intent / Context |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| Provider / Account / Routing |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Authority / Law |  |  | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| Durable Work / Agent |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| World / Workspace / Canvas | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Attention / Continuity | ✓ | ✓ |  | ✓ | ✓ | ✓ | ✓ | ✓ |
| Forge / Evolution |  |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Source:** `docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md §9`.

### What this means

The journey graph already exposes three important patterns:

1. **World, Vault/Evidence, Runtime/Capabilities, and Surface participate across the whole journey set.**
2. **Provider/Account/Routing is the major bridge between generic capabilities and real external action.**
3. **Work and Attention are the continuity bridge that transforms individual interactions into an environment that remains useful over time.**

These are existing dependency observations, not newly introduced architecture.

---

# 7. Journey → capability → realization → authority → Work → evidence

The complete destination path can be overlaid on all eight journeys without changing the existing model:

```text
WORLD / CONTEXT
      ↓
ADDRESS
      ↓
INTENT
      ↓
CAPABILITY
      ↓
AVAILABLE REALIZATIONS
      ↓
ROUTING / USER POLICY
      ↓
AUTHORITY / LAW / CONSENT
      ↓
WORK
      ↓
EXECUTION / REALIZATION
      ↓
EVIDENCE
      ↓
WORLD / MEMORY UPDATE
      ↓
SURFACE / ATTENTION
      ↓
CONTINUITY
```

### Journey-specific participation

| Journey | Start of path | Capability/realization role | Authority role | Work role | Evidence/result role |
|---|---|---|---|---|---|
| **J1** | World + Product Instance | Mostly inspection/presentation capabilities | mostly access/configuration | current Work may be surfaced | show truthful current state/change |
| **J2** | Project/world/context | retrieval + project-related capabilities | relevant to source access/mutations | continuation context | preserved history/provenance |
| **J3** | Address + Intent | central; resolves semantic action to realizations | central | immediate or durable depending outcome | effect/result/evidence |
| **J4** | Outcome intent | composed capabilities, often agent/provider/tool realizations | delegation + consent + policy | canonical center | progress/result/evidence |
| **J5** | Capability request | realization/account/session/routing is central | policy then authority | selected route attributed to Work | selected account/realization + outcome |
| **J6** | Existing Work / standing intent | ongoing capabilities | continuing authorization | canonical center | events → World change → attention |
| **J7** | Capability gap | Forge creates/tests a candidate realization | promotion/change authority | multi-step change activity as needed | proof, compatibility, promotion, rollback history |
| **J8** | Product Instance + owned state | export/restore/reconnect capabilities | owner authority | optional durable reconstruction activity | reconstruction proof + retained evidence |

---

# 8. World and Surface mapping

The existing World/Surface reconciliation provides the stable boundary needed by the journey map.

### Canonical direction

```text
EVIDENCE / VAULT
      ↓
CANONICAL THINGS + RELATIONSHIPS
      ↓
WORLD PROJECTION
      ↓
SPACE / WORKSPACE
      ↓
SURFACES / LIVE OBJECTS
      ↓
DIRECT MANIPULATION
```

**Source:** `docs/destination/WORLD-WORKSPACE-CANVAS-RECONCILIATION.md §2`.

### Journey implications

| Journey | World responsibility | Surface responsibility |
|---|---|---|
| J1 | assemble durable world/current state | arrival/orientation |
| J2 | project project-related Things/Relationships/Context | project/workspace/conversation representations |
| J3 | resolve addressed targets and context | prompt, canvas, direct manipulation, object views |
| J4 | retain Work and resulting changes | progress/result/evidence/review |
| J5 | represent provider/account relationships | routing/account/provider choice and inspection |
| J6 | expose changed world and unfinished Work | attention/return/re-entry |
| J7 | represent capabilities/compositions/change state | Forge/configuration/proposal/test/promotion |
| J8 | reconstruct owned World state and relationships | restore/reconnect/recovery surface |

### Non-collapse rule

Across all journeys:

- **World is not Surface.**
- **Surface is not canonical storage.**
- **Workspace is not a second database.**
- **Spatial placement is representation state.**
- **A surface mutation becomes a canonical mutation only through the existing semantic control path where the underlying world changes.**

This is already established by destination reconciliation and System Intelligence; it is not introduced here.

---

# 9. Authority mapping across the journey set

Authority is not a separate user journey. It is a cross-cutting dependency.

| Journey | Existing authority seam |
|---|---|
| J1 | owner-scoped environment, source access, attention/configuration boundaries |
| J2 | source access and project mutation boundaries |
| J3 | law/consent/risk after intent + capability + routing |
| J4 | bounded delegation + consent + risk + revocation |
| J5 | routing policy is user-owned choice; law remains separate |
| J6 | standing/background authorization; attention cannot grant permission |
| J7 | governed change/promotion/replacement |
| J8 | owner control over export/restore/reconnect |

The existing Core-vs-Plugin boundary remains the authority floor:

- product responsibilities such as Intent, Work, Provider, Account, Attention, Forge and Evolution are not automatically K0;
- K0 provides generic enforcement where the existing boundary analysis proves it is required;
- semantic authority remains in the existing authority/law contracts and system plugins.

**Source:** `docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md`.

---

# 10. Work mapping across the journey set

Work is most central in J4 and J6, but it threads through the architecture more broadly.

### Existing Work responsibility chain

```text
R-059 Intent
   ↓
R-060 Plan
   ↓
R-069 Durable Work
   ↓
R-070 Step / Attempt
   ↓
R-073 Execution Realization
   ↓
R-071 Recovery / Reconciliation
   ↓
R-035 Evidence
   ↓
R-049 World Projection
   ↓
R-090 Attention / R-093 Return
```

This is a mapping of existing responsibilities, not a new execution architecture.

### Journey participation

- **J1:** current Work can be surfaced; not all arrival is Work.
- **J2:** Work can provide the object of continuation.
- **J3:** an interaction may become immediate or durable Work.
- **J4:** Work is the canonical center of delegation.
- **J5:** Work carries the selected provider/account/session realization.
- **J6:** Work survives the interactive session boundary.
- **J7:** existing Work can execute multi-step change, while evolution responsibilities retain semantic ownership.
- **J8:** restoration may use durable Work, but reconstruction semantics belong to Product/Vault responsibilities.

---

# 11. Vertical-slice mapping

The existing registry defines VS0–VS8 as the product convergence tests.

| Journey | Primary slice | Secondary / supporting slices | Why |
|---|---|---|---|
| **J1** | **VS1** | VS5, VS8 | open/reopen durable world and preserve continuity |
| **J2** | **VS2** | VS5, VS3 | import/history + context + continued action |
| **J3** | **VS0 / VS3** | VS6, VS7 | governed action; provider/account execution; capability evolution/drift |
| **J4** | **VS4** | VS5, VS3 | delegated Work and truthful continuation |
| **J5** | **VS3** | VS7, VS8 | provider/account/routing plus drift/reconnect |
| **J6** | **VS5** | VS4, VS7 | durable background execution and return |
| **J7** | **VS6** | VS7, VS8 | Forge/evolution and replacement/drift/reconstruction |
| **J8** | **VS8** | VS1, VS3 | export/reconstruct and reconnect |

### Existing slice definitions

- **VS0:** one governed external action.
- **VS1:** install/start/reopen a local VIVIM world.
- **VS2:** import an AI conversation into a project.
- **VS3:** choose provider/account and perform work.
- **VS4:** delegate durable work and leave.
- **VS5:** return to a changed world with truthful continuity.
- **VS6:** create/modify a capability from inside VIVIM.
- **VS7:** survive provider drift.
- **VS8:** export and reconstruct the working environment.

**Source:** `docs/destination/VERTICAL-SLICE-REGISTRY.md §2–6`.

---

# 12. Cross-journey dependency pressure

The current dependency scorecard and System Intelligence findings indicate that the same few seams repeatedly mediate the eight journeys.

### Provider / Account / Routing

Touches J2–J8 materially and is externally exposed.

Existing responsibilities:

- R-076 Provider;
- R-077 Account;
- R-078 Session;
- R-079 Resource;
- R-081 Realization;
- R-082 Routing;
- R-083 Constraints;
- R-085 Discovery;
- R-086 Healing;
- R-087 Browser realization.

Current evidence says the behavior family exists strongly in Legacy and partially in Ω, while canonical account/routing and live owner-side proof remain open.

### Durable Work

Touches J2–J7 and provides the main bridge between interaction and continuity.

Existing responsibilities:

- R-069 Durable Work;
- R-070 Plan/step/attempt;
- R-071 Recovery;
- R-072 Agent;
- R-074 Scheduler/waits;
- R-092 Background continuity;
- R-093 Return continuity.

The current gap is assembly of a destination-grade product loop rather than absence of a scheduler.

### World / Workspace / Canvas

Touches all journeys.

Existing responsibilities:

- R-028–R-033 identity/relationships;
- R-043 Query;
- R-044 Projection;
- R-048 Ontology;
- R-049 World;
- R-094 Workspace;
- R-095 Surface;
- R-096 Canvas;
- R-097 Direct manipulation.

The core distinction remains World authority versus Surface representation.

### Product Instance / lifecycle

Most visible in J1 and J8, but affects continuity throughout.

Existing responsibilities:

- R-098 Native shell;
- R-101 Install/update/downgrade;
- R-102 Instance identity;
- R-103 Persistence;
- R-104 Configuration;
- R-105 Backup/recovery;
- R-122 Diagnostics/repair.

### Attention / continuity

Most visible in J1, J4, J6, J7, J8.

Existing responsibilities:

- R-090 Attention;
- R-091 Notification;
- R-092 Background continuity;
- R-093 Return/re-entry continuity.

The repository currently characterizes these responsibilities more strongly than it proves their complete user-facing assembly.

---

# 13. What the journey map confirms

## 13.1 The existing journey set already spans the destination

No additional journey is required to explain the current destination architecture.

J1–J8 collectively cover:

```text
arrival
→ work
→ interaction
→ delegation
→ provider choice
→ away/return
→ evolution
→ exit
```

This is already the journey model in the destination master map.

## 13.2 The architecture is not organized as eight separate products

The same responsibility participates in multiple journeys.

For example:

- World is shared by J1–J8;
- Vault/Evidence is shared by J1–J8;
- Runtime/Capabilities is shared by J1–J8;
- Provider/Account/Routing crosses J2–J8;
- Work crosses J2–J7;
- Surface participates throughout.

This is why the Architecture Steward should represent journeys as **views over shared nodes**, not as separate subsystems.

## 13.3 The critical architectural joins are already named

The current repository repeatedly identifies these joins:

- Provider ↔ Account;
- Account ↔ Session ↔ Browser;
- Capability ↔ Realization;
- Intent ↔ Capability ↔ Authority;
- Work ↔ Evidence;
- World ↔ Surface;
- Product Instance ↔ Persistence;
- Provider ↔ Routing;
- Durable Work ↔ Attention.

These are the seams that make the journey graph real.

## 13.4 “Capability” remains the stable semantic starting point for action

The journeys do not imply a provider-first architecture.

The existing destination structure is:

```text
Intent
  ↓
Capability
  ↓
Available realization(s)
  ↓
Routing policy
  ↓
Authority
  ↓
Work
```

Provider/account/session details are introduced where a concrete realization requires them.

## 13.5 Surface remains representation, not authority

J1, J2, J3, J4, J5, J6, J7 and J8 all use surfaces, but none requires the Surface to become canonical storage.

This reinforces the existing World/Surface reconciliation rather than expanding the surface model.

---

# 14. Evidence and status discipline

This mapping deliberately separates **journey participation** from **implementation maturity**.

A journey can depend on a responsibility even when that responsibility is:

- PARTIAL;
- DESIGN-REQUIRED;
- IMPLEMENTATION-REQUIRED;
- EXPERIMENT-REQUIRED;
- PRODUCT FRONTIER;
- LIVE-proof pending.

Examples already evidenced in the repository:

| Seam | Existing evidence | Current limitation |
|---|---|---|
| Provider/account/routing | Legacy ProviderAccount + ProviderMux + Ω ProviderRealization | canonical account/routing bridge remains open |
| Capability/realization | Ω ProviderRealization + provider-browser path | live owner-side provider proof remains pending |
| Intent/capability/authority | Ω Intent + law/consent contracts | finished ordinary-user interaction remains incomplete |
| World/surface | WorldModel + live objects + destination reconciliation | breadth/identity-join and finished product projection remain open |
| Work/evidence | vivim-run + vault | single product Work lifecycle remains incomplete |
| Product instance/persistence | vault + Product Instance research | product wrapper/lifecycle remains unassembled |
| Attention/continuity | director/daemon/automation + D5 reconciliation | one canonical return/attention experience remains open |
| Forge/evolution | Forge architecture + promotion/evolution controls | normal-user evolution path remains open |

The repository's epistemic rule remains:

> **implementation is not product proof.**

**Source:** SI-060101 and current maturity/vertical-slice documents.

---

# 15. Relationship to Product Experience Archaeology

The complementary Product Experience Archaeology package establishes a different level of resolution.

That package answers:

> what the experience already present in the repository asks VIVIM to feel like and let a person do.

This document answers:

> where those existing journey obligations land in the current architecture map.

Therefore the division of labor is:

| Artifact | Primary question |
|---|---|
| Product Experience Archaeology | What experience is already evidenced? |
| Destination Master Map | What are the canonical destination journeys? |
| Responsibility Matrix | What must be owned/accomplished? |
| Dependency / Keystone Scorecard | What materially depends on what? |
| Vertical Slice Registry | What end-to-end outcomes prove composition? |
| This document | How do the journeys cross all of those existing structures? |

No content from the Product Experience Archaeology package is promoted to architecture authority merely by being mapped here.

---

# 16. Gaps exposed by the mapping

These are **existing repository gaps surfaced through journey composition**, not new product requirements.

### G1 — J1/J8 Product Instance closure

**Relevant responsibilities:** R-101–R-105.

The repository has Product Instance research, vault durability and lifecycle principles, but the complete arrival → persistence → update/recovery → exit loop is not assembled.

### G2 — J2 context continuity

**Relevant responsibilities:** R-043, R-049, R-050, R-051, R-094, R-103.

The context substrate exists, but the product-level "continue without reconstructing state" experience remains a composition gap.

### G3 — J3 universal ordinary-user interaction

**Relevant responsibilities:** R-058–R-068, R-095, R-097.

The semantic seams are well characterized, while whole-world addressing and finished ordinary-user feedback/approval UX remain incomplete.

### G4 — J4/J6 durable Work closure

**Relevant responsibilities:** R-069–R-074, R-090–R-093.

The execution and governance ingredients exist. A single truthful user lifecycle through waiting, return, result, failure/refusal and review remains incomplete.

### G5 — J5 provider/account/routing closure

**Relevant responsibilities:** R-076–R-088.

This is the most explicit architecture-to-live-reality gap: the repository has strong behavioral evidence and provider-browser implementation evidence, but canonical account/routing lifecycle plus owner-side live proof remain open.

### G6 — J7 ordinary-user evolution path

**Relevant responsibilities:** R-113–R-123.

Forge/evolution architecture is strong; ordinary-user presentation, verification, promotion, replacement and rollback remain productized only partially.

### G7 — Cross-journey native shell / OS surface

**Relevant responsibilities:** R-098–R-101, R-099–R-100, R-122.

The product is intended to inhabit the user's machine, but native shell/desktop/OS integration remains a frontier.

---

# 17. Recommended Steward representation

The current mapping does **not** justify creating another large architecture document family.

The existing Steward direction is sufficient:

```text
JOURNEY
  ↕
RESPONSIBILITY
  ↕
DEPENDENCY
  ↕
CAPABILITY / REALIZATION
  ↕
AUTHORITY
  ↕
WORK
  ↕
WORLD / OBJECT
  ↕
SURFACE
  ↕
VERTICAL SLICE
  ↕
EVIDENCE / PROOF
```

The most useful eventual machine-readable Steward relation set is already implied by the existing canonical model:

- JOURNEY **REQUIRES** RESPONSIBILITY
- JOURNEY **DEPENDS_ON** RESPONSIBILITY
- JOURNEY **ENABLES** WORK / PRODUCT outcome
- RESPONSIBILITY **REQUIRES** RESPONSIBILITY
- CAPABILITY **REALIZES** via REALIZATION
- AUTHORITY **AUTHORIZES** Work/Action
- WORK **CONSUMES** Capability/Context
- WORK **PRODUCES** Evidence/World change
- SURFACE **PROJECTS** World/Work/Context
- VERTICAL SLICE **VALIDATES/PROVES** the relevant composition

Those are all existing Steward edge concepts. No new edge vocabulary is required.

---

# 18. Practical use by future Steward passes

When a research package or implementation change arrives, use this map to ask:

1. Which existing J1–J8 journey does the change touch?
2. Which responsibility IDs change?
3. Does the change add/remove/alter a dependency edge?
4. Does it alter the capability ↔ realization relation?
5. Does it change authority, consent, delegation or risk?
6. Does it change Work semantics or Work continuity?
7. Does it change canonical World state or only a Surface representation?
8. Which vertical slice should demonstrate the changed composition?
9. What evidence currently supports the updated mapping?
10. What remains unknown or unproven?

This keeps journey mapping as a **view over the architecture**, rather than a second architecture.

---

# 19. Method and limitations

## Method

This pass:

1. Established the current eight-jury destination set from existing destination authority.
2. Loaded the current 125-row responsibility inventory.
3. Loaded the existing Architecture Steward canonical model and dependency method.
4. Used current destination reconciliation documents for World/Surface, Intent/Work, Provider/Account/Routing and Background/Attention.
5. Used System Intelligence findings with explicit journey/vertical-slice associations.
6. Used the complementary Product Experience Archaeology package only for already-recovered experience implications.
7. Mapped each journey into existing responsibilities rather than introducing new ones.
8. Mapped each journey to existing vertical slices.
9. Recorded current gaps only where existing repository sources already characterize them.
10. Preserved distinctions among evidence, authority, representation, implementation, and product maturity.

## Limitations

- This document does not claim to have exhaustively read every file in the repository.
- GitHub search/index coverage is not equivalent to a complete semantic crawl.
- Journey associations in System Intelligence are research metadata; they are not independently ratified product law.
- A journey → responsibility mapping is not automatically a hard runtime dependency.
- Some current responsibilities are DESIGN-REQUIRED / EXPERIMENT-REQUIRED / L-1, so journey membership can exceed current implementation maturity.
- Provider live-external proof remains an owner-machine concern where current repository evidence explicitly says so.
- Product Instance research references a missing current-main `docs/destination/VIVIM-PRODUCT-INSTANCE-CORE.md`; this map does not silently elevate the research package to the authority of that missing file.
- The requested launch prompt path was absent from the inspected current branch/returned Steward branch set, so no unobserved prompt instructions have been fabricated.

---

# 20. Source map

### Primary destination architecture

- `docs/destination/DESTINATION-MASTER-MAP.md`
- `docs/destination/RECONCILIATION-MAP.md`
- `docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md`
- `docs/destination/VERTICAL-SLICE-REGISTRY.md`
- `docs/destination/MATURITY-AND-GAPS.md`
- `docs/destination/WORLD-WORKSPACE-CANVAS-RECONCILIATION.md`
- `docs/destination/INTERACTION-INTENT-WORK-RECONCILIATION.md`
- `docs/destination/PROVIDER-ACCOUNT-ROUTING-RECONCILIATION.md`
- `docs/destination/AGENCY-BACKGROUND-ATTENTION-RECONCILIATION.md`

### Responsibility / architecture map

- `docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md`
- `docs/destination/architecture/README.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CANONICAL-MODEL.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/MAPPING-SYSTEM.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/DEPENDENCY-GRAPH-METHOD.md`

### Product experience / supporting context

- `AGENTS_CONTEXT/PRODUCT_VISION/STATE.md`
- `docs/destination/HUMAN-EXPERIENCE.md`
- `docs/destination/CONCEPTUAL-MODEL.md`
- `docs/destination/NORTH-STAR.md`
- complementary package: `docs/destination/product-experience/research/PRODUCT-EXPERIENCE-ARCHAEOLOGY.md` on `research/steward-product-experience`

### System Intelligence evidence

- `docs/destination/system-intelligence/STATE.md`
- `docs/destination/system-intelligence/synthesis/PRODUCT-TRACE.md`
- `docs/destination/system-intelligence/indexes/EDGES.json`
- `docs/destination/system-intelligence/indexes/ATOMS.json`
- `docs/destination/system-intelligence/findings/SI-02/ATOMS.jsonl`
- `docs/destination/system-intelligence/findings/SI-04/ATOMS.jsonl`
- `docs/destination/system-intelligence/findings/SI-05/ATOMS.jsonl`
- `docs/destination/system-intelligence/findings/SI-06/ATOMS.jsonl`

---

# 21. Final mapping statement

The repository already contains the architecture needed to **describe** J1–J8 without creating a second model.

The durable mapping is:

```text
J1  OPEN / ORIENT
    ↕ Product Instance + World + Workspace + Surface

J2  CONTINUE WORK
    ↕ World + Context + Memory + Work + Surface

J3  UNIVERSAL INTERACTION
    ↕ Address + Intent + Capability + Routing + Authority + Work + Evidence

J4  DELEGATED ACTION
    ↕ Intent + Authority + Delegation + Durable Work + Agent + Evidence

J5  PROVIDER CHOICE
    ↕ Capability + Realization + Provider + Account + Session + Routing + Authority

J6  BACKGROUND CONTINUITY
    ↕ Work + Scheduler + Attention + World Change + Return Surface

J7  EVOLUTION
    ↕ Capability + Forge + Evidence + Compatibility + Evolution + Promotion/Rollback

J8  EXIT
    ↕ Product Instance + Vault + Export + Restore + World + Configuration + Provider/Account reconnection
```

Across all eight:

```text
WORLD / CONTEXT
      ↓
ADDRESS / INTENT
      ↓
CAPABILITY
      ↓
REALIZATION / ROUTING
      ↓
AUTHORITY
      ↓
WORK
      ↓
EVIDENCE
      ↓
WORLD CHANGE
      ↓
SURFACE / ATTENTION
      ↓
CONTINUITY
```

That is a mapping of the existing destination architecture, responsibilities, evidence and vertical slices—not a new architecture.
