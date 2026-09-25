# VIVIM Product Experience Archaeology

> Classification: DERIVED — RESEARCH / RECONCILIATION INPUT  
> Status: repository-grounded archaeology; not product law, not a second destination model  
> Date: 2026-09-25  
> Branch: `research/steward-product-experience`  
> Output purpose: recover the product experience already present across VIVIM's destination, Ω, agent-context, System Intelligence, ZAI build context, and Legacy behavioral mine, then map the required experience corollaries into the existing architecture.

## Scope and reading discipline

This package answers one question:

> **What does VIVIM need to feel like, let a person do, preserve, explain, automate, configure, recover from, and evolve across the complete user lifecycle?**

It does not create a new product vision, ontology, task system, or Ω law. It preserves existing destination research and treats this artifact as a **mapping view** for the Architecture Steward.

Evidence labels used here:

- **OBSERVED** — directly present in repository code or a specific artifact.
- **CORROBORATED** — supported by more than one independent current source.
- **DERIVED** — a synthesis that follows from existing evidence without asserting a new canonical fact.
- **HARVEST** — valuable Legacy behavior to preserve semantically and rebuild under the destination model.
- **PROPOSED** — explicit destination/design requirement that is not yet sufficiently proven in implementation.
- **CONTRADICTED** — materially in tension with another current source; the conflict is reported rather than resolved here.
- **UNKNOWN** — evidence is insufficient.

The repository's authority hierarchy remains intact: Ω ratified law and explicit decisions outrank working destination text; executable evidence outranks documentation where they conflict; Legacy is behavioral evidence, not architecture law.

---

# 1. Source map

## 1.1 Current destination / product sources

| Source | Role in this archaeology | Relevant UX evidence |
|---|---|---|
| `docs/destination/NORTH-STAR.md` | Primary destination statement | Sovereign environment; persistent world; “my world → my context → what I want → what can be done → what I delegated → what happened → what I can do next.” |
| `docs/destination/FOUNDATIONAL-PRINCIPLES.md` | Primary principles | Sovereignty, no privileged user class, composability, natural-language control, configurable interaction, no mysterious agency, continuity, evolution, exit. |
| `docs/destination/HUMAN-EXPERIENCE.md` | Primary human-experience view | First minute, persistent world, spatial environment, direct manipulation, universal prompt, creating, attention, delegation, background continuity, agency. |
| `docs/destination/CONCEPTUAL-MODEL.md` | Primary human vocabulary | World, Space, Thing, Relationship, Surface, Context, Attention, Address, Intent, Capability, Work, Agent, Authority, Evidence; Space/Workspace distinction; project and focus behavior. |
| `docs/destination/DESTINATION-MASTER-MAP.md` | Current cross-domain destination map | Explicit harvest requirements for provider/account/routing, canvas/workspace, onboarding/discovery, plugin builder, healing. |
| `docs/destination/RECONCILIATION-MAP.md` | Current synthesis / reconciliation | Product assembly gap; background continuity; provider/account/routing gap; surface/product assembly. |
| `docs/destination/VERTICAL-SLICE-REGISTRY.md` | User-outcome convergence | VS0–VS8 establish the lifecycle spine from governed action through run, import, routing, delegation, continuity, evolution, drift, and restore. |
| `docs/destination/MATURITY-AND-GAPS.md` | Maturity / incompleteness evidence | Provider accounts, routing, canvas/workspaces, work, automation, background continuity and product shell remain partial or under-modelled. |
| `docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md` | High-centrality gaps | Product shell, install/update/rollback, OS integration, resource lifecycle, extension distribution, spatial/product surface, universal acquisition, diagnostics. |
| `docs/destination/BUILD-AND-HARVEST-PLAN.md` | Destination build/harvest implications | Install/startup, World/Workspace/Canvas, provider/account routing, return experience, Legacy assets to harvest. |

## 1.2 Agent-context sources

| Source | Role | UX evidence |
|---|---|---|
| `AGENTS_CONTEXT/PRODUCT_VISION/STATE.md` | Product Vision cold start | Persistent user-owned world, universal semantic path, natural/symbolic/spatial interaction, major experience dependencies. |
| `AGENTS_CONTEXT/PRODUCT_VISION/SESSION-2026-09-25.json` | Detailed rationale capture | First-open vision, proactive/return behavior, delegation, plugin visibility, hyper-configurability, spatial canvas + universal prompt, routing choice. |
| `AGENTS_CONTEXT/PRODUCT_VISION/HANDOFF-2026-09-25.md` | Product Vision handoff | Explicit user journey, V1 floor, central seams, known product gaps. |
| `AGENTS_CONTEXT/PERSONAL_AGENT/STATE.md` | Personal Agent state | Self-describing environment and queryable system reality. |
| `AGENTS_CONTEXT/PERSONAL_AGENT/VISION.md` | Self-Knowledge UX | Internal-wiki metaphor, evidence-backed explanations, plugin-native self-description. |
| `AGENTS_CONTEXT/PERSONAL_AGENT/CANONICAL-MODEL.md` | Self-Knowledge model | Canonical reality → projections → Personal Agent; evidence/freshness distinctions. |
| `AGENTS_CONTEXT/PERSONAL_AGENT/COMMAND-SYMBOL-SYSTEM.md` | Symbolic interaction | 17 existing symbolic families; NL ↔ symbols ↔ Intent; introspection remains open. |
| `AGENTS_CONTEXT/PERSONAL_AGENT/OPEN-FRONTIER.md` | Unresolved interaction surface | Broader self-knowledge and newer symbolic language material are not yet durable/canonical. |
| `AGENTS_CONTEXT/EVOLUTION/STATE.md` | Evolution behavior | Observe → detect → characterize → propose → impact → compatibility → authority → change → verify → promote → monitor → rollback/quarantine. |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/README.md` | Steward operating model | This artifact is an integration/mapping view, not a new authority. |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OPERATING-INTERPRETATION.md` | Documentation/depth discipline | New artifacts only when existing structures are insufficient; ZAI remains a separate build layer. |
| `AGENTS_CONTEXT/CORE_VS_PLUGIN_BOUNDARY/LAUNCH-PROMPT.md` | Boundary discipline | Product importance does not determine K0; preserve replaceability and authority distinctions. |

## 1.3 System Intelligence

The main branch contains the durable System Intelligence corpus. It is explicitly not to be restarted.

Sampled:

- `docs/destination/system-intelligence/pass-3/README.md`
- `docs/destination/system-intelligence/pass-3/EXPERIMENT-MATRIX.md`
- `docs/destination/system-intelligence/pass-3/indexes/DEPENDENCIES.json`
- `docs/destination/system-intelligence/synthesis/PRODUCT-TRACE.md`
- `docs/destination/system-intelligence/findings/SI-02/SUMMARY.md`
- `docs/destination/system-intelligence/findings/SI-02/EVIDENCE.md`
- `docs/destination/system-intelligence/findings/SI-04/EVIDENCE.md`
- `docs/destination/system-intelligence/findings/SI-05/ATOMS.jsonl`
- System Intelligence indexes and synthesis references to the Pass 1/2 lineage.

Key System Intelligence contribution: the critical product coupling is repeatedly represented as:

`USER INTENT → CAPABILITY → REALIZATION → ACCOUNT → SESSION → BROWSER RESOURCE → RESULT → WORK/EVIDENCE → WORLD/SURFACE → SELF-KNOWLEDGE`.

Pass 3 also records E1–E8 falsifiers; E1–E5 remain live/behavioral experiment requirements, not completed proofs.

## 1.4 Destination research packages sampled

- `docs/destination/world-surface-core/RESEARCH-RESULTS.md`
- `docs/destination/self-knowledge-core/RESEARCH.md`
- `docs/destination/product-instance-core/PRODUCT-INSTANCE-CORE-RESEARCH.md`
- `docs/destination/agentic-core/README.md`
- `docs/destination/legacy-harvest/DESTINATION-MAPPING.md`
- `docs/destination/legacy-harvest/HARVEST-SYNTHESIS.md`
- `docs/destination/AGENCY-BACKGROUND-ATTENTION-RECONCILIATION.md`
- `docs/destination/DATA-MEMORY-CONTEXT-RECONCILIATION.md`
- `docs/destination/WORLD-WORKSPACE-CANVAS-RECONCILIATION.md`
- `docs/destination/PROVIDER-ACCOUNT-ROUTING-RECONCILIATION.md`
- `docs/destination/EVOLUTION-RECONCILIATION.md`
- `docs/destination/PERSONAL-AGENT-SELF-KNOWLEDGE-AND-COMMAND-LANGUAGE.md`
- `docs/destination/product-instance-core/README.md`

These are treated as supporting views/research inputs, not replaced by this package.

## 1.5 Ω decisions / end-state

Sampled:

- `omega-baseline/omega-final/docs/forge/OMEGA-ENDSTATE-VISION.md`
- `omega-baseline/omega-final/docs/forge/annex/OMEGA-VISION-ATOMS.md`
- `omega-baseline/omega-final/docs/decisions/D-407-endstate-vision.md`
- `omega-baseline/omega-final/docs/decisions/D-408-endstate-amendment.md`
- `omega-baseline/omega-final/docs/decisions/D-418-v1-substrate-chrome-first.md`
- `omega-baseline/omega-final/docs/decisions/D-456-v1-substrate-chrome-only.md`

Important UX-bearing Ω evidence:

- the sovereign environment is larger than its canvas;
- the Natural Language Control Plane is a constitutional interaction path;
- the canvas is a projection, not canonical product truth;
- live objects have identity/composition/vault/spatial/provenance dimensions;
- spatial state belongs in `ns canvas`;
- the end-state vision defines a closed interaction-verb algebra of 18 verbs;
- all surfaces converge on canonical intent;
- time, sleeping compositions, repair, sharing, and exit are part of the experience model;
- V1 substrate is Chrome master/slave; no AI-API realization ships in V1.

## 1.6 ZAI build context

Sampled:

- `ZAI_BUILD_CONTEXT/README.md`
- `ZAI_BUILD_CONTEXT/MISSION.md`
- `ZAI_BUILD_CONTEXT/PRODUCT-VISION.md`
- `ZAI_BUILD_CONTEXT/SOURCE-OF-TRUTH.md`
- `ZAI_BUILD_CONTEXT/HARD-PROBLEM-REGISTRY.md`
- `ZAI_BUILD_CONTEXT/BUILD-PROTOCOL.md`

Contribution: the builder-facing UX goal is concrete: start a persistent world, use a coherent surface, connect real accounts, choose provider/account/model/routing, execute real work, preserve results, recover truthfully, continue later, run durable background work, and eventually evolve capabilities.

## 1.7 Legacy UX / implementation mine

Sampled:

- `vivim-original-baseline/vivim-final-enhanced/frontend/src/features/guided-landing.tsx`
- `vivim-original-baseline/vivim-final-enhanced/docs/alpha/05-LANDING-PAGE-DESIGN-BRIEF.md`
- `vivim-original-baseline/vivim-final-enhanced/src/engines/adaptive-workspace.ts`
- `vivim-original-baseline/vivim-final-enhanced/src/engines/workspace-presets.ts`
- `vivim-original-baseline/vivim-final-enhanced/src/engines/conversation-organizer.ts`
- `vivim-original-baseline/vivim-final-enhanced/src/engines/provider-mux.ts`
- `vivim-original-baseline/vivim-final-enhanced/src/engines/backup-manager.ts`
- `vivim-original-baseline/vivim-final-enhanced/src/engines/export.ts`
- `vivim-original-baseline/vivim-final-enhanced/docs/architecture/overview.md`
- `vivim-original-baseline/vivim-final-enhanced/docs/runbooks/providers.md`
- `vivim-original-baseline/vivim-final-enhanced/docs/architecture/data-model.md`
- Legacy/source-atlas references for frontend, router, capability, provider and surface behavior.

Legacy is read as a behavioral mine. A useful behavior survives only after it is expressed through destination identity, authority, evidence, projection and lifecycle rules.

---

# 2. Canonical experience themes

## Theme A — VIVIM is an environment, not a destination page

**Experience:** On opening VIVIM, the person enters an existing world rather than choosing among disconnected applications.

**Evidence:** NORTH-STAR, HUMAN-EXPERIENCE, CONCEPTUAL-MODEL, Ω §0/§4.

**Status:** **CORROBORATED**.

The user mental model is:

`my world → my context → what I want → what can be done → what I delegated → what happened → what I can do next`.

The product can expose many application-like surfaces, but the person should not have to think in application silos to operate the environment.

## Theme B — Address is the start of interaction

**Experience:** The person is not merely “chatting”; they are addressing VIVIM, a thing, space, person, provider, account, agent, capability, Work, or other target.

**Evidence:** HUMAN-EXPERIENCE; PERSONAL-AGENT command/self-knowledge material; Product Vision; Ω NCLP.

**Status:** **CORROBORATED**.

Addressing and focus establish semantic target/context. They do not confer authority.

## Theme C — One interaction system, many surfaces

**Experience:** Natural language, symbolic notation, keyboard, canvas, command palette, CLI/MCP/API/automation/agent can express the same underlying intent.

**Evidence:** Ω vision atom CIV-12; Personal Agent command system; destination interaction material.

**Status:** **CORROBORATED**.

The experience should feel continuous as the representation changes.

## Theme D — The world is canonical; surfaces are replaceable

**Experience:** A project, conversation, document, account or Work can be represented in different views without changing what it is.

**Evidence:** CONCEPTUAL-MODEL; WORLD-WORKSPACE-CANVAS-RECONCILIATION; world-surface research; Ω canvas rules.

**Status:** **CORROBORATED**.

This is essential to direct manipulation: moving a tile changes presentation/organization, not canonical identity unless the resulting intent explicitly changes the underlying world.

## Theme E — Context follows the task

**Experience:** VIVIM should usually know what matters now without requiring the person to rebuild context manually.

**Evidence:** HUMAN-EXPERIENCE; CONCEPTUAL-MODEL current focus; DATA-MEMORY-CONTEXT; Personal Vision.

**Status:** **CORROBORATED**.

Context is assembled from current space/project/focus, active Work, relevant history, standing intent, explicit constraints and permitted evidence. Focus is a context seed, never authority.

## Theme F — Delegation is outcome-oriented, not orchestration-oriented

**Experience:** “Send the update,” “research this,” “prepare the report,” etc. should feel like entrusting an outcome to VIVIM.

**Evidence:** HUMAN-EXPERIENCE; AGENCY-BACKGROUND-ATTENTION; agentic-core; Legacy harvest.

**Status:** **CORROBORATED**.

The person should see outcome, progress, approval boundaries and result—not a graph of internal agents unless inspection is requested.

## Theme G — VIVIM remains active while the person is away

**Experience:** Work may continue after the initiating interaction ends.

**Evidence:** AGENCY-BACKGROUND-ATTENTION; Product Vision; legacy background machinery; VS4/VS5.

**Status:** **CORROBORATED**, but productized experience remains **PROPOSED**.

The environment must make background behavior attributable and inspectable.

## Theme H — Return is a first-class experience

**Experience:** Returning should reveal meaningful continuity: what changed, what was done, what failed, what is waiting for the person, what was found, and what is next.

**Evidence:** HUMAN-EXPERIENCE; AGENCY-BACKGROUND-ATTENTION; RECONCILIATION-MAP; VS5.

**Status:** **CORROBORATED requirement / PROPOSED product loop**.

The repository repeatedly describes the loop but does not yet provide one assembled canonical return surface.

## Theme I — User-owned capability choice

**Experience:** The person chooses or constrains which provider/account/model/realization may satisfy a capability.

**Evidence:** Product Vision; PROVIDER-ACCOUNT-ROUTING; System Intelligence; Legacy ProviderMux; VS3.

**Status:** **CORROBORATED requirement / UNKNOWN finished UX**.

Learned ranking can help inside user-defined policy, but cannot silently override explicit constraints.

## Theme J — The environment explains itself

**Experience:** The person can ask what VIVIM is doing, what it can do, what is configured, why something is unavailable, what changed, what evidence supports an answer, and what would be affected by a change.

**Evidence:** PERSONAL-AGENT context; SELF-KNOWLEDGE research; EVOLUTION-RECONCILIATION.

**Status:** **CORROBORATED requirement / PROPOSED complete product surface**.

Self-knowledge is a projection over canonical reality, not another hand-maintained truth store.

## Theme K — Creation and evolution are native user activities

**Experience:** A person can move from “I want this” to a new capability/composition through a governed path.

**Evidence:** FOUNDATIONAL-PRINCIPLES; Ω Forge material; Personal Agent; Legacy plugin-builder evidence.

**Status:** **CORROBORATED aspiration / PROPOSED normal-user path**.

Forge-generated output remains candidate/proposal until verified and promoted under authority.

## Theme L — Failure is a truthful state, not an exception-shaped dead end

**Experience:** Refusal, ambiguity, stale state, provider failure, disconnected accounts, interrupted Work and repair should be understandable and recoverable.

**Evidence:** FOUNDATIONAL-PRINCIPLES; Ω refusal/failure rules; AGENCY-BACKGROUND; EVOLUTION; SELF-KNOWLEDGE freshness.

**Status:** **CORROBORATED** at principle level; product surface **PROPOSED**.

The recurring destination rule is: unknown ≠ failure, candidate ≠ realization, representation ≠ truth, evidence ≠ authority.

## Theme M — Exit is part of the product

**Experience:** The person can export, restore, reconstruct and leave without losing the meaning of their world.

**Evidence:** FOUNDATIONAL-PRINCIPLES; Product Instance research; DATA-MEMORY-CONTEXT; VS8; legacy export/backup.

**Status:** **CORROBORATED requirement / PROPOSED complete lifecycle**.

---

# 3. User lifecycle map

| Lifecycle stage | Observable user behavior | System behavior required | Existing architectural corollary | Status |
|---|---|---|---|---|
| **1. Arrival / first open** | Launches VIVIM | Recognize/install or reopen the same Product Instance; establish useful starting view | Product Instance + Vault + World + Workspace | **PROPOSED** |
| **2. Orientation** | Looks around / sees what matters | Present persistent world, active work, relevant changes and available affordances | World + Surface + Attention + Self-Knowledge | **PROPOSED** |
| **3. Address** | Names or selects a target | Resolve target against current canonical world | Address + Object/Relationship + Intent | **CORROBORATED** |
| **4. Focus** | Selects thing/space/project/work | Seed task context without granting authority | Focus + Context projection | **CORROBORATED** |
| **5. Ask / express intent** | Types, speaks, clicks or composes | Convert expression into canonical Intent | NCLP/NCLL + Intent | **CORROBORATED** |
| **6. Understand choices** | Sees capability/provider/account options | Show valid capabilities and relevant realizations/policies | Capability + Routing + Account + Realization | **PROPOSED** |
| **7. Approve / constrain** | Approves, edits, refuses, delegates | Apply law/consent and user policy | Authority + Work | **CORROBORATED** |
| **8. Execute** | Watches or ignores while Work proceeds | Run durable/interactive Work through governed realization | Work + Capability + Execution + Evidence | **PROPOSED** productized |
| **9. Inspect** | Asks what happened / why | Expose evidence, actor, choice, scope, status | Evidence + Self-Knowledge + routing decision record | **PROPOSED** |
| **10. Continue / organize** | Moves, groups, connects, opens, edits | Persist organization/presentation while preserving canonical identity | Space + Workspace + Surface + World | **CORROBORATED** |
| **11. Leave** | Closes or stops interacting | Preserve Work/World continuity | Product Instance + Work + Vault | **PROPOSED** |
| **12. Away / background** | Does nothing | Authorized Work continues, waits or repairs under policy | Standing Intent + Work + Agent + Attention | **CORROBORATED requirement** |
| **13. Return** | Reopens VIVIM | Summarize completed/running/waiting/changed/failed/found/next | Attention + Work + World + Evidence | **PROPOSED** |
| **14. Recover** | Deals with interruption/failure | Distinguish retry/wait/refuse/reroute/repair; no silent identity change | Session/Resource + Work recovery + Evolution | **PROPOSED** |
| **15. Evolve** | Creates/configures/replaces a capability | Propose → impact → compatible → authorized → verify → promote | Forge + Evolution + Plugin/Composition | **PROPOSED** |
| **16. Export / exit** | Exports/restores/leaves | Preserve identity, relationships, history, configuration and evidence | Vault + Product Instance + Exit manifest | **PROPOSED** |

### Lifecycle implication

The experience is not a series of pages. It is a **persistent loop**:

`ARRIVE → ORIENT → ADDRESS → CONTEXTUALIZE → INTEND → CHOOSE → AUTHORIZE → WORK → OBSERVE → CONTINUE → LEAVE → BACKGROUND → RETURN → RECOVER/Evolve → EXIT`.

The same semantic path can be entered from different surfaces and resumed later.

---

# 4. Interaction grammar

## 4.1 The established canonical verb algebra

Ω supplies a specific closed verb algebra in `OMEGA-VISION-ATOMS.md` CIV-11:

**SEE, ASK, CREATE, CONNECT, MOVE, OPEN, EDIT, RUN, DELEGATE, APPROVE, REFUSE, FORK, REPAIR, INSPECT, UNDO, REPLAY, SHARE, EXPORT.**

**Status: CORROBORATED** because the Ω end-state vision and its atomization explicitly describe these as the closed interaction set, and CIV-12 requires them to be surface-independent.

This archaeology does **not** create another verb set.

## 4.2 Surface-level verbs that must lower into the closed algebra

The broader repository frequently uses terms such as **navigate, focus, address, configure, verify, remember, forge, do**. These are useful human/product language, but the current Ω evidence does not justify promoting them into a second canonical verb algebra.

| Surface term | Interpretation in the existing grammar | Status |
|---|---|---|
| **Navigate** | Primarily SEE / OPEN / MOVE | **DERIVED** |
| **Focus** | Context-selection operation around SEE/OPEN; not authority | **DERIVED** |
| **Address** | Target resolution preceding ASK/CREATE/RUN/DELEGATE/etc. | **DERIVED** |
| **Configure** | Usually EDIT/CREATE/CONNECT, governed by Authority | **DERIVED** |
| **Verify** | ASK/INSPECT/REPLAY depending on subject | **DERIVED** |
| **Remember** | CREATE/EDIT on durable memory or relationships | **DERIVED** |
| **Forge** | CREATE/FORK/EDIT/REPAIR under Forge/Evolution | **DERIVED** |
| **Do** | Product-language shorthand for the governed path, not a canonical verb | **UNKNOWN as canonical term** |

This preserves the closed algebra while leaving room for product language that is more natural to a person.

## 4.3 Interaction modifiers are not authority

Address, focus, current workspace, selected surface and current context can reduce ambiguity and improve grounding. None may itself grant permission to mutate the world.

This follows the same distinction repeated across destination and research:

`Surface state → context seed`, never `surface state → authority`.

## 4.4 Interaction trace

The experience-level interaction trace should be explainable as:

`expression → address → intent → context → capability → choice/routing → authority → work → execution → evidence → world/memory update`.

For pure questions, the path may terminate at evidence-backed derivation without external effect.

## 4.5 Direct manipulation and language are peers at the edge

A person can:

- drag a thing;
- open a project;
- connect two things;
- edit a configuration;
- inspect a result;
- type a natural-language command;
- use a symbolic form.

These should converge on the same semantic operations rather than create hidden UI-specific mutations.

---

# 5. Experience corollary matrix

| Experience promise | Observable user behavior | Underlying obligation | Existing destination / architecture | Existing implementation / evidence | Missing piece | Maturity / proof |
|---|---|---|---|---|---|---|
| **I enter my world** | Open VIVIM and see meaningful state | Durable instance + reconstructable world | Product Instance + Vault + World | Product Instance research; World research; VS1 | One assembled start/open loop | **PROPOSED / PARTIAL** |
| **VIVIM knows what matters now** | Sees project/work/context without rebuilding it | Current-focus/context projection | Context + World + Attention | D6 context substrate; current mind focus; HUMAN-EXPERIENCE | Product-level current-context projection | **CORROBORATED / UNDER-MODELLED** |
| **I can address anything meaningful** | Name/select VIVIM, project, account, person, Work, provider, etc. | Stable identity + address resolution | Address + Object/Relationship + Self-Knowledge | Personal Agent model; conceptual model | Broad cross-domain address surface | **PROPOSED** |
| **One interaction layer follows me** | Language/canvas/command palette/CLI feel coherent | Canonical Intent convergence | NCLP + Intent + surface contract | Ω CIV-12; nlcl-pure; Intent contract | Full verb×surface parity | **CORROBORATED / PROOF PENDING** |
| **I can see and manipulate my world** | Move/group/connect/open/edit | Projection + semantic mutation path | World + Space + Workspace + Surface | World-surface research; legacy canvas | Complete world/surface assembly | **CORROBORATED / PARTIAL** |
| **My project is already organized** | Open a project and find related people/conversations/docs/work | Relationships + projections | World/Object/Relationship + Space | ConversationOrganizer; World reconciliation | Unified cross-domain projection | **HARVEST / PROPOSED** |
| **I can choose how a capability is realized** | Choose/constrain provider/account/model | User-owned routing policy | Capability + Account + Realization + Routing | ProviderMux; D4 routing research; VS3 | Canonical policy + finished UX + live proof | **CORROBORATED / UNKNOWN** |
| **I know what account VIVIM is using** | Inspect account/session/resource | External identity chain | Account + Session + Browser Resource + Evidence | Legacy models; provider-browser; SI-05 | Ω canonical lifecycle and E1–E4 proof | **PROPOSED / EXPERIMENT-REQUIRED** |
| **I can delegate an outcome** | “Do X while I’m away” | Durable Work identity and checkpoints | Work + Agent + Authority + Evidence | agentic-core; legacy harvest; D5 | Productized durable Work | **CORROBORATED / PARTIAL** |
| **VIVIM can work without me** | Leaves product and returns later | Temporal persistence + background execution | Work + Standing Intent + Attention | Director/daemon; D5 | Unified background/return loop | **PROPOSED** |
| **I can see what happened** | Inspects outcome and history | Evidence/event attribution | Evidence + Work + Self-Knowledge | Ω ledger/vault; Personal Agent | Unified result/why/actor surface | **CORROBORATED / PARTIAL** |
| **VIVIM explains itself** | Asks “why unavailable?” / “what changed?” | Evidence-backed self-knowledge | vivim.mind + Self-Knowledge | self-knowledge research | Answer contract + broader basis model | **PROPOSED / PARTIAL** |
| **Failures are understandable** | Sees refusal, waiting, stale, disconnected, failed states | Explicit failure vocabulary + recovery | Law + Work + Session/Resource + Evolution | Ω refusals; D5; evolution | Unified user-facing recovery surface | **CORROBORATED / UNDER-MODELLED** |
| **VIVIM can repair/evolve** | Requests new capability or repair | Governed evolution + promotion | Forge + Evolution + Composition | Forge, provider healing, change loop | Ordinary-user evolution journey | **CORROBORATED / PROPOSED** |
| **My configuration belongs to me** | Changes behavior, layout, routing, attention | Durable user policy/config | Product Instance + Space/Workspace + Routing + Attention | workspace presets; routing preferences; destination principles | One unified configuration model at UX edge | **PROPOSED** |
| **My history remains mine** | Reopen / search / import old AI history | Source genealogy + canonical local records | Vault + World + Memory + Context | legacy import/history; D6 | Cross-domain source→world integration | **CORROBORATED / PARTIAL** |
| **I can leave** | Export / restore | Portable, reconstructable environment | Vault + Product Instance + Exit | legacy export/backup; Product Instance research; VS8 | Complete reconstruction journey | **CORROBORATED / PROPOSED** |

---

# 6. Experience-to-architecture bridge

## 6.1 Canonical bridge

The experience can be read as one continuous semantic chain:

```
PERSON
  ↓
ADDRESS / FOCUS
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
EXECUTION / REALIZATION
  ↓
EVIDENCE
  ↓
WORLD / MEMORY UPDATE
  ↓
SURFACE / ATTENTION
  ↓
RETURN / NEXT ACTION
```

The user sees the beginning and end of this chain. VIVIM's complexity remains underneath.

## 6.2 Concept-specific bridge

### World

**Experience obligation:** the person can treat their digital reality as one coherent environment.

**Architecture corollary:** canonical objects and relationships must be identity-stable, addressable, provenance-aware and projectable.

**Existing evidence:** CONCEPTUAL-MODEL; WORLD-WORKSPACE-CANVAS; SI world atoms; D6.

**Gap:** domain breadth and daily relationship UX remain under-modelled.

**Status:** **CORROBORATED / PROPOSED assembly**.

### Object / Relationship

**Experience obligation:** people, projects, conversations, files, accounts, services, Work, etc. can be related without becoming duplicate records.

**Architecture corollary:** canonical identity/relationship semantics independent of surface.

**Existing evidence:** World-surface research; destination conceptual model; Legacy Node/relationship evidence.

**Gap:** complete object lifecycle + relationship evolution and product-scale projections.

**Status:** **CORROBORATED / PARTIAL**.

### Space / Workspace / Surface

**Experience obligation:** a person can organize and experience the same world differently.

**Architecture corollary:** Space carries semantic context; Workspace carries presentation/interaction arrangement; Surface projects canonical state.

**Existing evidence:** CONCEPTUAL-MODEL; world-surface research; legacy adaptive workspace/presets.

**Gap:** product-wide stable distinction and full persistence/reconstruction.

**Status:** **CORROBORATED**.

### Context / Focus

**Experience obligation:** current task context is assembled automatically enough to reduce cognitive load, without turning focus into authority.

**Architecture corollary:** product-facing current-context projection over deterministic context substrate.

**Existing evidence:** D6; current `vivim.mind`; Personal Agent; focus semantics.

**Gap:** canonical product current-context object/lens and privacy-aware provider subsets.

**Status:** **CORROBORATED requirement / PROPOSED implementation seam**.

### Address / Intent

**Experience obligation:** the user can speak to the environment and be understood as directing an operation at a specific target.

**Architecture corollary:** stable addressing + canonical Intent, with natural/symbolic/spatial expressions converging on the same representation.

**Existing evidence:** NCLP; nlcl-pure; Intent contract; Personal Agent.

**Gap:** exact cross-domain addressing/introspection grammar and external symbolic-work reconciliation.

**Status:** **CORROBORATED / UNKNOWN final grammar**.

### Capability / Routing / Account / Realization

**Experience obligation:** “what can I do?” and “which of my relationships will do it?” are different questions.

**Architecture corollary:** Capability ≠ Realization; Provider ≠ Account; Account ≠ Session; Routing is user-owned policy.

**Existing evidence:** D4; Legacy ProviderMux; SI-02/SI-05; provider-browser.

**Gap:** canonical Ω account/session lifecycle, complete routing UI, E1–E5 live proof.

**Status:** **CORROBORATED requirement / EXPERIMENT-REQUIRED**.

### Authority / Consent

**Experience obligation:** the user understands when VIVIM can act and when it must ask/refuse.

**Architecture corollary:** authority is downstream of intent and independent from evidence or UI state.

**Existing evidence:** Ω law; refusal sentence rule; D5 agency boundaries.

**Gap:** seamless presentation of approval boundaries across all surfaces.

**Status:** **CORROBORATED / PROPOSED product surface**.

### Work / Execution / Recovery

**Experience obligation:** delegated outcomes survive the initiating interaction.

**Architecture corollary:** durable Work owns lifecycle/checkpoints; Agent is an actor/role; Attempts capture execution; evidence persists.

**Existing evidence:** agentic-core; D5; Legacy harvest.

**Gap:** a complete product Work surface and restart/live recovery proof.

**Status:** **CORROBORATED requirement / PARTIAL**.

### Evidence / Self-Knowledge

**Experience obligation:** “why?” is answerable without a model becoming authority.

**Architecture corollary:** claims carry basis/freshness/authority/evidence, with currentness derived rather than trusted from stale snapshots.

**Existing evidence:** SELF-KNOWLEDGE research; D-423/D-424 precedent; vault revisions; Ω evidence model.

**Gap:** broader basis vectors and unified user-facing answer contract.

**Status:** **CORROBORATED / PROPOSED**.

### Attention / Continuity

**Experience obligation:** VIVIM notices what matters, works while away, and tells the person what happened.

**Architecture corollary:** standing intent creates Work; attention derives salience; return renders evidence-backed continuity.

**Existing evidence:** D5; legacy automation/notification; VS5.

**Gap:** one canonical attention/return loop and OS-facing delivery.

**Status:** **CORROBORATED requirement / PROPOSED**.

### Product Instance / Lifecycle / Exit

**Experience obligation:** the same personal environment survives process replacement, upgrade, restart and restore.

**Architecture corollary:** Product Instance is durable identity/lifecycle boundary; Vault owns durable truth; process/browser are sessions/resources.

**Existing evidence:** Product Instance research; VS1/VS8; vault durability.

**Gap:** `docs/destination/VIVIM-PRODUCT-INSTANCE-CORE.md` is missing from current main even though many current artifacts reference it; the replacement research package exists under `docs/destination/product-instance-core/`.

**Status:** **UNKNOWN / under-modelled**.

---

# 7. Legacy UX harvest

Legacy is classified here by **behavioral value**, not by implementation desirability.

## 7.1 Guided Landing — first-touch conversation

Source: `frontend/src/features/guided-landing.tsx`

Observed behaviors:

- first-run can be a conversation rather than a form;
- onboarding agent speaks first;
- provider choices are inline in the same interaction thread;
- setup proceeds live;
- user is interrupted for genuinely gated browser login rather than every step;
- the composer is treated as the dominant surface.

**Disposition: HARVEST.**

Destination implication:

> First-run should be able to demonstrate the universal interaction model while minimizing setup ceremony.

Do **not** preserve the hard-coded provider catalog, visual palette, or old setup API shapes as destination architecture.

## 7.2 Alpha landing page — tester tracks

Source: `docs/alpha/05-LANDING-PAGE-DESIGN-BRIEF.md`

Observed:

- product shown rather than merely described;
- chat/build/admin surfaces;
- Explorer / Builder / Observer / Breaker tracks;
- wiki/help/feedback integrated into first-use.

**Disposition: HISTORICAL + HARVEST selective behavior.**

Useful behaviors: progressive disclosure, product-as-demonstration, embedded help, feedback.

Conflict: permanent user personas/“admin” and “developer” tracks are not compatible with the current **no privileged user class** principle if understood as product classes.

## 7.3 Adaptive Workspace

Source: `src/engines/adaptive-workspace.ts`

Observed:

- presentation changes by interaction mode;
- panels are progressively disclosed;
- the implementation has chat/expert/agent modes and promotion thresholds.

**Disposition: HARVEST the adaptive-presentation behavior; HISTORICAL the mode taxonomy.**

Destination interpretation already present in CONCEPTUAL-MODEL:

> adaptive presentation, stable semantics.

The world and identity do not change because more panels become visible.

## 7.4 Workspace presets

Source: `src/engines/workspace-presets.ts`

Observed:

- reusable named arrangements;
- combinations of built-in and canvas panels;
- patterns for chat, dashboard, agent monitoring, memory work.

**Disposition: HARVEST.**

Destination implication: presets can be user-authored compositions/templates over Space/Workspace, not permanent product modes.

## 7.5 Conversation organization

Source: `src/engines/conversation-organizer.ts`

Observed:

- projects;
- topics;
- project assignment;
- project → topic → conversation navigation tree.

**Disposition: HARVEST.**

The behavior supports the desired project-centered world. Its current auto-topic algorithm is simplistic and should not be promoted as semantic authority.

## 7.6 Provider onboarding / discovery

Sources:
- `docs/runbooks/providers.md`
- Legacy provider/browser docs and implementations.

Observed:

`discover → infer → test-selectors → test-parse → test-cap → test-frontend → verify → converge`.

**Disposition: HARVEST.**

Destination implication: provider onboarding should remain evidence-driven and realization-scoped; it should not leak provider-specific discovery semantics into the canonical capability model.

## 7.7 Provider/account/routing behavior

Sources:
- `src/engines/provider-mux.ts`
- Legacy `ProviderAccount`/session schema
- `docs/destination/PROVIDER-ACCOUNT-ROUTING-RECONCILIATION.md`
- SI-02/SI-05

Observed:

- provider/account distinction;
- account-aware routing concepts;
- priorities/cost/learned preference structures;
- Chrome profile/account isolation.

**Disposition: HARVEST.**

The richer behavior supports user-controlled realization selection, but the destination still requires a canonical Ω bridge and live identity proof.

## 7.8 Conversation/history persistence

Sources:
- Legacy `Conversation`/message persistence;
- conversation sync/import evidence;
- D6.

Observed:

- durable conversations;
- provider/account links;
- import/history identity;
- message ordering/parentage.

**Disposition: HARVEST.**

Destination requirement: retain source genealogy and canonical identity without copying the legacy database model.

## 7.9 Export / backup / restore

Sources:
- `src/engines/export.ts`
- `src/engines/backup-manager.ts`
- Legacy storage docs.

Observed:

- scoped export;
- encrypted export path;
- import;
- database backup/restore;
- retention of a rolling local backup set.

**Disposition: HARVEST.**

Destination interpretation: these support the exit/recovery requirement, but Ω's one-vault/one-truth model and Product Instance lifecycle should own the final semantics.

## 7.10 Legacy chat-first architecture

Source: `docs/architecture/overview.md`

Observed mental model:

> “local-first AI conversation platform” with capability resolution and provider routing as the central product.

**Disposition: HISTORICAL as product framing; HARVEST capability-resolution behavior.**

The current destination is broader: conversations are one important specialization of a governed environment.

## 7.11 Legacy universal Node model

Source: `docs/architecture/data-model.md`

Observed:

- universal Node;
- versioning;
- graph edges;
- aliases;
- time-travel history.

**Disposition: HISTORICAL / HARVEST selected behaviors.**

The destination must not resurrect “everything is one schema” merely because the old Node model was broad. Preserve stable identity/version/relationship behavior where it fits current canonical object semantics.

---

# 8. Missing / under-modelled UX

## 8.1 Product Instance arrival is not fully assembled

Product Instance research explicitly characterizes the identity/lifecycle boundary, but the referenced current destination file `docs/destination/VIVIM-PRODUCT-INSTANCE-CORE.md` is absent on main.

**Status: UNKNOWN / under-modelled.**

The repo therefore has a research solution for part of the seam, but not one stable primary destination UX artifact and not a proven complete arrival → reopen experience.

## 8.2 There is no single current-context product experience

The deterministic context substrate exists, and the product vision has focus/current-context semantics, but the user-facing assembly is still a gap.

**Status: CORROBORATED gap.**

## 8.3 Provider/account/routing is not yet a complete user loop

The concepts are well characterized:

`Capability → valid realization → Account → Session → Browser Resource → effect → evidence`.

But live E1–E5 experiments remain unrun, and current Ω does not yet establish one canonical identity/routing lifecycle.

**Status: EXPERIMENT-REQUIRED.**

## 8.4 Background continuity is a design, not yet one surface

Director/daemon/automation machinery exists. What is missing is one user-facing loop for:

`standing intent → work → changed world → truthful return summary → pending decision`.

**Status: PROPOSED / under-modelled.**

## 8.5 Failure/recovery UX is fragmented

The architecture has refusal sentences, Work states, session/resource recovery, provider healing and evolution quarantine. The person does not yet have one coherent recovery language across them.

**Status: CORROBORATED gap.**

## 8.6 Creation/evolution is not yet normal-user seamless

Forge exists as a strong architecture concept and implementation boundary. The open question is whether an ordinary user can describe a desired capability and remain within the product experience through proposal, inspection, test, promotion and rollback.

**Status: PROPOSED.**

## 8.7 Native Windows / desktop experience is largely frontier

BUILD_CONTEXT and the dependency scorecard identify native product shell, OS/filesystem/application integration, desktop interaction and notifications as L-1 frontiers.

**Status: UNKNOWN at product-design depth.**

## 8.8 Universal acquisition is incomplete

The vision assumes a world made from the person's existing digital reality, but there is no single general “bring my world in” onboarding flow covering files, conversations, contacts, projects, services and resources.

**Status: CORROBORATED gap / PROPOSED experience.**

## 8.9 Spatial / application-like / 3D experience remains open

The repository contains substantial canvas evidence and Ω's spatial model, but the richer application-like/3D environment is not yet a complete destination substrate.

**Status: PARTIAL / UNKNOWN at full product scale.**

## 8.10 Attention delivery outside the app is not fully scoped

Attention semantics exist; OS notification delivery, device continuity and cross-machine attention are still broad frontiers.

**Status: UNKNOWN.**

---

# 9. Contradictions and unresolved tensions

The objective here is to preserve the evidence and let the governing architecture/product owner resolve conflicts explicitly where required.

## C1 — Application/dashboard vs environment/world

**Evidence A:** Legacy docs frame VIVIM primarily as a local-first AI conversation platform with chat surfaces.

**Evidence B:** Current destination and Ω describe a sovereign personal computing environment containing a persistent world, with applications/surfaces as projections.

**Status: CONTRADICTED historical vs current framing.**

No action is taken here. Current destination framing is clearly different, but Legacy chat behavior remains useful evidence.

## C2 — Chat-first vs universal interaction

**Evidence A:** GuidedLanding literally implements “chat-as-landing-page”; Legacy architecture centers conversations.

**Evidence B:** Personal Agent, NCLP and Ω CIV-12 require multiple surfaces to converge on canonical intent.

**Status: CONTRADICTED if chat is treated as the only or canonical product interaction.**

The durable reconciliation is to preserve chat as a powerful surface while refusing to make conversation the universal product ontology.

## C3 — Admin/developer modes vs no privileged user class

**Evidence A:** Legacy alpha design defines Explorer/Builder/Observer/Breaker tracks and chat/build/admin surfaces.

**Evidence B:** FOUNDATION PRINCIPLES says no privileged user class; the person should access fundamental powers through safe mechanisms.

**Status: CONTRADICTED if the Legacy roles become permission classes.**

The adaptive-workspace evidence supports progressive disclosure as presentation, not privilege.

## C4 — UI state vs canonical world

**Evidence A:** Legacy canvas contains optimistic UI state, mirrors, layout and mutation machinery.

**Evidence B:** Ω and world-surface research state that canvas/surface is a projection and may not own canonical truth.

**Status: CONTRADICTED only if UI state is treated as world authority.**

Destination rule is explicit: preserve direct manipulation while lowering consequential mutations into canonical Intent.

## C5 — Autonomous behavior vs user-configured standing intent

**Evidence A:** Legacy includes autonomous tasks/objectives/schedulers.

**Evidence B:** Current destination says proactivity should arise from configured interests and standing intent and exposes Automatic / Ask / Not delegable choices.

**Status: CONTRADICTED if “autonomous” means unexplained independent authority.**

The harvest is background execution and durable work, not mysterious agency.

## C6 — Provider-centric vs capability-centric UX

**Evidence A:** Legacy often begins interaction with a provider (“send to Claude”, provider manifests, provider onboarding).

**Evidence B:** Current destination separates Capability, Provider, Account, Realization and Routing.

**Status: CONTRADICTED if provider becomes the user's primary semantic object for every action.**

Provider selection remains useful when it matters, but the canonical question is first “what can I do?” and then “which valid realization satisfies it under my policy?”

## C7 — Canvas as primary surface vs canvas not the product

**Evidence A:** Ω D-408 retains canvas as the primary surface.

**Evidence B:** The same amendment explicitly demotes canvas from product identity: the canvas is not the product.

**Status: APPARENT TENSION, already reconciled by Ω.**

This is not a new contradiction to resolve. It means “primary surface” is visual/product priority, not authority or semantic ownership.

## C8 — “Explainable defaults” vs learned adaptation

**Evidence A:** Legacy adaptive workspace and learned routing introduce automatic adaptation.

**Evidence B:** Destination principles require user-owned policy and explainable behavior.

**Status: CONTRADICTED if learning silently changes policy.**

Derived adaptation can remain, but the product must distinguish user-authored rules from learned suggestions/ranking.

---

# 10. Recommended documentation realignment

This is a **recommendation for future Steward reconciliation**, not a repository reorganization action.

## 10.1 Remain primary

These documents should remain the principal human/product views:

1. `docs/destination/NORTH-STAR.md` — concise destination promise.
2. `docs/destination/FOUNDATIONAL-PRINCIPLES.md` — experience-governing principles.
3. `docs/destination/HUMAN-EXPERIENCE.md` — direct human lifecycle description.
4. `docs/destination/CONCEPTUAL-MODEL.md` — human vocabulary and world/space/surface semantics.
5. `docs/destination/VERTICAL-SLICE-REGISTRY.md` — proof through user outcomes.
6. `omega-baseline/omega-final/docs/forge/OMEGA-ENDSTATE-VISION.md` and ratified Ω decisions — technical/constitutional destination authority within their stated precedence.

## 10.2 Supporting views

These should remain focused supporting views whose subject is narrower than the whole experience:

- `WORLD-WORKSPACE-CANVAS-RECONCILIATION.md`
- `INTERACTION-INTENT-WORK-RECONCILIATION.md`
- `PROVIDER-ACCOUNT-ROUTING-RECONCILIATION.md`
- `AGENCY-BACKGROUND-ATTENTION-RECONCILIATION.md`
- `DATA-MEMORY-CONTEXT-RECONCILIATION.md`
- `EVOLUTION-RECONCILIATION.md`
- `PERSONAL-AGENT-SELF-KNOWLEDGE-AND-COMMAND-LANGUAGE.md`
- `product-instance-core/PRODUCT-INSTANCE-CORE-RESEARCH.md`
- `world-surface-core/RESEARCH-RESULTS.md`
- `self-knowledge-core/RESEARCH.md`
- `agentic-core/`
- Core-vs-Plugin destination views.

These documents own detailed semantic seams, but none should silently become the whole product UX model.

## 10.3 Research inputs

Continue treating the following as research/evidence inputs:

- System Intelligence Passes 1–3;
- `docs/destination/legacy-harvest/`;
- `AGENTS_CONTEXT/PRODUCT_VISION/`;
- `AGENTS_CONTEXT/PERSONAL_AGENT/`;
- `AGENTS_CONTEXT/EVOLUTION/`;
- Legacy implementation/docs;
- `ZAI_BUILD_CONTEXT/`.

The Steward should map their findings into primary/supporting views rather than duplicate their content.

## 10.4 Historical

The following should remain available as historical UX evidence rather than current primary UX authority:

- Legacy `docs/alpha/` landing concepts;
- Legacy `docs/architecture/overview.md` as the old product framing;
- old persona/track taxonomies;
- implementation-specific frontend/surface experiments that no longer match destination semantics.

No deletion is recommended.

## 10.5 Merge only where duplication is demonstrated

No immediate merge is justified by this archaeology.

In particular:

- do not merge all destination reconciliations into one giant product document;
- do not merge System Intelligence findings into destination prose;
- do not merge Legacy evidence into current destination definitions;
- do not merge Personal Agent self-knowledge into a general-purpose ontology document.

A future merge should require demonstrated duplication plus an explicit authority/depth decision.

## 10.6 Proposed missing Steward view

The durable addition created by this task is the **product-experience archaeology / corollary map** itself.

Its role is specifically to answer:

> “What is the experience asking the architecture to make true?”

That makes it a **bridge view**, not another product layer.

---

# 11. Open owner questions

These are questions for product/architecture ownership, not decisions made by this archaeology pass.

1. **What is the exact first-open default experience?** Is first launch primarily a seeded world, a guided setup conversation, a minimal spatial environment, or a context-dependent combination?
2. **What is the exact arrival-selection policy on subsequent opens?** How are last meaningful space, active Work, recent change, attention and standing intent combined, and how is the choice explained?
3. **Is the universal prompt permanently present across all primary surfaces, or may surfaces expose alternate native entry while still lowering to the same intent path?**
4. **What is the final Space vs Workspace contract at product level?** The current model is clear conceptually but needs one explicit user-facing rule for creation, persistence and switching.
5. **How much of the world is automatically organized vs user-organized?** The repository repeatedly says VIVIM should auto-organize ordinary data, but the exact boundary between inferred relationship and user-authored organization is still open.
6. **What provider/account choice must be visible for ordinary actions?** The routing model is clear semantically, but the amount of detail shown by default is not.
7. **What is the user-facing vocabulary for the 18 canonical verbs?** Surface language such as “navigate,” “focus,” “configure” and “forge” is natural, but should remain explicit about how it lowers into the closed Ω algebra.
8. **What is the canonical return surface?** The “Since you left” categories are repeatedly described but have not yet been assembled into one destination surface.
9. **What is the default failure language?** Ω supplies refusal sentences and explicit status distinctions, but the product needs one consistent human grammar for stale, unknown, waiting, disconnected, refused, failed and repairable states.
10. **What is the ordinary-user Forge journey?** The architecture supports Forge/evolution, but the exact product path from request to promotion/rollback remains open.
11. **How should OS-level attention and notifications fit the product world?** The semantic attention model exists; desktop delivery remains a frontier.
12. **What is the minimum universal acquisition experience for “bring my world in”?** Imports for selected domains exist, but no full-world acquisition flow is yet defined.
13. **How should the missing `docs/destination/VIVIM-PRODUCT-INSTANCE-CORE.md` be represented in the primary destination documentation set?** A research package exists, but the expected canonical working view is absent.
14. **How should the owner's newer external symbolic-language material be imported and reconciled?** The repository explicitly records that it is not yet durable.
15. **What is the required UX for live provider/account/resource identity proof?** Pass 3 identifies this as an owner-machine experiment problem, not something documentation alone can settle.

---

# 12. Method and limitations

## Method

The investigation followed the launch prompt and the repository cold-start hierarchy:

1. Read the requested product-experience launch prompt.
2. Read `AGENTS.md`, `BUILD_CONTEXT.md`, `docs/CURRENT-CONTEXT.md`, and `AGENTS_CONTEXT/README.md`.
3. Sampled Product Vision, Personal Agent, Evolution, Architecture Steward and Core-vs-Plugin role context.
4. Sampled the primary destination corpus and focused reconciliations.
5. Sampled System Intelligence Pass 3 plus its dependency/product traces and current findings representing the Pass 1/2 lineage.
6. Sampled Ω end-state vision and relevant decision records.
7. Sampled ZAI build context.
8. Sampled targeted Legacy UX, product, provider, organization, export/recovery and implementation evidence.
9. Distinguished user action, system behavior, semantic operation, surface representation, architectural responsibility and evidence/proof.
10. Produced this bridge without changing production code or reorganizing the repository.

## What was not done

- No production code was changed.
- No Ω law or ratified decision was changed.
- No Legacy artifact was deleted or rewritten.
- No System Intelligence archaeology pass was restarted.
- No new ontology or canonical command language was introduced.
- No task-management system was created.
- No local clone/live browser run was claimed where repository research already records the environment's limitations.

## Search / repository limitations

The repository was inspected through the authenticated GitHub repository interface. GitHub search is useful for corpus discovery but is not equivalent to reading every file.

The following limitations are material:

1. **This is not a claim of semantic completeness.** The inspected scope covers the major destination, Product Vision, Personal Agent, Evolution, Architecture Steward, Core-vs-Plugin, System Intelligence, Ω, ZAI and Legacy UX sources required by the launch prompt, but not every artifact in each corpus.
2. **System Intelligence Pass 1 is represented in current main through its durable findings, indexes, lineage references and Pass 2/3 synthesis.** A separate current-main `pass-1/` directory was not directly relied upon as though it existed as a complete live tree.
3. **`docs/destination/VIVIM-PRODUCT-INSTANCE-CORE.md` is referenced broadly but is absent on current main.** The existing `product-instance-core/` research package was used explicitly as research evidence, not silently promoted to the missing document's authority.
4. **The Product Instance research package records that its own local clone/falsifier execution was blocked by inability to resolve `github.com`.** This archaeology does not claim new owner-machine proof.
5. **Pass 3 E1–E5 remain EXPERIMENT FIRST / unrun** in the durable experiment matrix. In particular, account identity, multi-account isolation, resource concurrency, restart/expiry recovery and materially different-provider behavior remain live-proof questions.
6. The repository explicitly records that the owner's newer symbolic command work outside the repository is not yet durable. Its contents have not been inferred here.
7. Some Legacy documents are detailed implementation-era designs. Their presence is evidence that a behavior was once attempted or implemented, not proof that it remains the correct current product behavior.

## Strongest evidence that the UX mapping remains incomplete

The clearest incompleteness signals are not the existence of more names; they are the repeated gaps across independent current sources:

- Product Vision and Reconciliation repeatedly describe VIVIM as a **persistent environment**, while the assembled start/reopen product loop is not yet complete.
- Account/session/resource identity and routing are repeatedly named as central gaps, with live E1–E5 experiments still required.
- World/Surface research says canonical world projections exist as design, while domain breadth and the daily relationship UX remain unfinished.
- D5 describes the desired background/return loop, but the canonical product surface is not assembled.
- Self-Knowledge research has a clear freshness model, but a complete answer contract and broad self-knowledge basis are still open.
- Product Instance research exists because the Product Instance lifecycle is not yet fully represented in one primary destination artifact.
- The dependency scorecard still lists native shell, OS integration, universal acquisition, resource lifecycle, extension distribution, richer spatial/product surface and diagnostics as frontiers.
- The Legacy mine contains richer UX implementations than current destination assembly in several areas; this is specifically a harvest signal, not evidence that Legacy should become destination authority.

## Final synthesis

The existing repository does **not** present two unrelated products. It presents a large amount of compatible experience evidence whose assembly is incomplete.

The recurring experience can be stated without inventing anything new:

> **VIVIM should feel like entering your own persistent digital environment: you can see and address the things in your world, express intent through whichever surface feels natural, understand what can be done and how it will be realized, delegate durable work under rules you control, leave while authorized work continues, return to truthful continuity, inspect why things happened, repair or evolve the environment without surrendering authority, and export the world so it remains yours.**

The architecture corollary is equally consistent:

> **Address/Context → Intent → Capability → Choice/Routing → Authority → Work → Realization/Execution → Evidence → World/Memory → Surface/Attention → Continuity.**

The repository's existing destination research is sufficient to map this experience. It is **not yet sufficient to claim that the complete experience is assembled, proven, or fully specified at implementation depth**.
