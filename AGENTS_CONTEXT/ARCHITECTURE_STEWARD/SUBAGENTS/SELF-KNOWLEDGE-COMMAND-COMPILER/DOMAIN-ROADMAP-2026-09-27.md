# CFA-03 — Semantic Continuity Steward — Strategic Domain Roadmap

> Date: 2026-09-27
> Round: Strategic Roadmap Round 1
> Classification: CFA-owned strategic planning artifact; not Ω law and not central cross-CFA sequencing authority.
> First-pass independence: this roadmap was formed from current repository evidence and pre-existing peer/boundary artifacts. New Round-1 peer roadmap outputs were not consumed before first-pass completion.
> Current `main` verified during drafting: `a21b3489182d749aa8546b20ba44e892e3eb5acc`

## Strategic Objective

Make VIVIM's semantic seam **continuous, inspectable, and reproducible** from self-knowledge and grounding through command interpretation, canonical Intent/Plan meaning, governed Work-facing meaning, evidence/provenance, and human/agent representation—while keeping semantic meaning distinct from World ownership, durable data, authority, execution, realization, surfaces, and runtime law.

The strategic destination is not a larger compiler. It is a bounded continuity system in which:

```
input
→ grounding
→ interpretation
→ canonical semantics
→ Intent / Plan meaning
→ authority-facing meaning
→ Work-facing meaning
→ execution evidence
→ representation / explanation
```

can be traced without silently changing meaning, authority, identity, or epistemic state.

---

## Responsibility Frontier

### CFA-03 owns

- continuity of meaning across the semantic chain;
- interpretation-state semantics and the separation of interpretation from execution;
- grounding semantics at the language ↔ World seam;
- canonical Intent/Plan meaning continuity;
- semantic identity/provenance continuity across independently owned artifacts;
- representation continuity and deterministic round-trip semantics;
- bounded CANON terminology/crosswalk stewardship for this seam;
- falsification of semantic divergence, stale grounding, representation overclaim, and authority/meaning conflation.

### CFA-03 contributes to

- World-side grounding requirements — CFA-01 remains World semantic owner;
- durable semantic/data mapping — CFA-02 remains durable data owner;
- authority-facing semantic packages — CFA-04 remains authorization owner;
- Work-facing semantic handoff — CFA-05 remains Work/execution owner;
- capability/effect semantics — CFA-06 remains capability/realization owner;
- human-facing representation — CFA-08 remains surface/interaction owner;
- continuity/migration semantics — CFA-09 remains evolution owner;
- runtime enforcement constraints — CFA-10 remains runtime owner.

### CFA-03 does not own

- Ω law or K0 runtime constitution;
- canonical World ontology;
- canonical durable storage/data mechanics;
- authorization, consent, delegation, standing, or permission decisions;
- Work lifecycle, scheduling, execution, recovery, or external-effect reconciliation;
- provider/account/session/browser realization;
- UI/surface implementation;
- the Architecture Steward graph;
- a universal identity/provenance database;
- a second command grammar;
- indiscriminate repository terminology renaming.

---

## Current Evidence / Maturity

### OBSERVED / CURRENT

1. **Language is already data-driven.** `contracts/src/lang.ts` defines the 17 core command symbol families, typed frame/slot contribution shapes, and language contributions as data; grammar remains pinned while meanings/lexicon can be extended as data.

2. **The interpreter is already deterministic and traced.** `vivim-nlcl-pure/src/interpret.ts` implements:
   `scan → lex → symbol-parse → recognizers → frame-match → resolve → project`.
   Its output is an `Interpretation` containing canonical form, reading, confidence, effects, suggestions, gaps and stage trace.

3. **Grounding is deterministic but currently bounded to WorldModel.** `ground.ts` ranks exact/prefix/fuzzy/partial matches deterministically, preserves alternatives, supports context references, and applies learned priors only as ranking/tiebreak data.

4. **WorldModel is the current self-knowledge/grounding contract.** `vivim.mind` is a derived, read-only lens that builds a WorldModel from governed evidence and exposes a bounded catalog of operations, entities, lexicon, rules, context and related derived views.

5. **Intent is a persisted canonical artifact.** `contracts/src/intent.ts` defines Intent state, steps, `payloadHash`, optional persisted interpretation, plan reference and evidence references. Current law documentation records D-411 as the canonical-intent seam.

6. **The live web path already exposes the semantic chain.** `surfaces/web/src/api.ts` performs authoritative interpretation, persists the canonical Intent, gates consequential requests with the Intent citation, routes execution, and records terminal resolution.

7. **VisualSpec already exists as projection, not as a second semantic model.** `nlcl-pure/src/types.ts` defines visual projection structures such as slot cards, entity chips, channel picker, risk badges and a full VisualSpec derived from interpretation.

8. **Current evidence shows a general freshness gap.** Existing self-knowledge research identifies freshness as an unresolved cross-cutting concern; current grounding uses a WorldModel version but no general semantic freshness basis spans all relevant knowledge sources.

9. **Boundary Round 2 is intentionally incomplete.** CFA-03 records RP-01 as AGREED on the CFA-03 side, while RP-02 (Authority) and RP-06 (Data) remain UNKNOWN pending peer acceptance. Shared CFA boundaries remain unactivated.

10. **Historical visual-symbolic work remains useful as design evidence, not authority.** The archived SVG research explored the 17-family alphabet, visual states, command DAGs, provenance, confidence/proof distinctions and deterministic symbol composition. It does not supersede current Ω contracts.

### DERIVED / CURRENT

- The highest-value strategic problem is not basic parsing; it is preserving semantic identity and epistemic meaning across the seams that parsing already reaches.
- The existing deterministic NCLL + Intent seam is a viable V1 foundation. Visual compilation must remain downstream of canonical semantics.
- The first implementation work should reduce ambiguity in contracts, tracing, evidence and continuity—not introduce a new runtime semantic store.
- Semantic continuity should be proven with fixtures/replay and cross-plane traces before broader visual or self-description implementation is attempted.

### UNKNOWN

- complete Plan/Work semantic shape for multi-step requests;
- exact live authority citation/re-resolution contract;
- exact durable semantic↔record relation contract;
- generalized freshness semantics;
- final visual write-back contract;
- canonical machine-readable terminology identity beyond the bounded CANON dictionary.

---

# Conceptual Roadmap

## M1 — Semantic Continuity Baseline

### Conceptual outcome

A verified map of the **current end-to-end semantic path** and its state/identity boundaries, with one compact collision map for terms such as meaning, identity, context, grounding, interpretation, confidence, evidence, representation, Intent, Plan and Work.

### Why it matters

Current implementation is strong at local deterministic interpretation, but strategic risk is at cross-plane seams where similar concepts can acquire incompatible meanings or lifecycle assumptions.

### Evidence basis

- `vivim-nlcl-pure` deterministic pipeline and `Interpretation`;
- `WorldModel` and `vivim.mind`;
- D-411 canonical Intent seam;
- current Work/Authority boundary evidence;
- CFA-03 Round-1/Round-2 declarations;
- destination responsibility matrix and system-intelligence findings.

### Current maturity

**PARTIAL / MIXED:** the local language and Intent chain is well characterized; cross-plane continuity is only partially characterized.

### Strategic decisions at this stage

- What are the minimum continuity identities that must survive every semantic handoff?
- Which state dimensions must remain orthogonal?
- Which existing artifacts already carry enough meaning and should simply be cross-linked?
- Which terminology collisions represent actual semantic drift versus legitimate perspective differences?

### Success criteria

**Design validity**
- Every major transformation from raw input to Intent/Plan/Work-facing meaning has an explicit semantic owner and authority source.
- Each identity dimension is separated from the others.

**Integration validity**
- A representative single-step request can be traced across current implementation without inventing missing components.
- Ambiguous, unresolved and refused cases retain their distinct states.

**Proof**
- A deterministic fixture/replay can demonstrate that the same input plus the same grounding basis yields the same semantic result and continuity references.

**Product proof**
- A fresh agent can explain why a command received its meaning and where authority/execution begins without reconstructing the architecture from implementation accidents.

### Falsifiers / failure conditions

- identical concepts require two incompatible canonical meanings to remain operational;
- a representation or parser becomes the only place a semantic distinction exists;
- trace continuity cannot survive a normal Intent/Work handoff;
- a supposed boundary exists only in documentation and not in runtime/data contracts.

### Dependencies

- No new cross-CFA dependency required for the first baseline map.
- Existing Ω contracts/evidence are the primary source.

### Candidate implementation later

A deterministic semantic-continuity fixture/trace analyzer, only if the existing tests cannot express the required cross-plane proof.

### Explicit unresolved

Do not settle final Plan/Work, authority citation, data identity, or visual write-back shape in M1.

### Peer Intelligence Gate

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-01 | World reference/correspondence/result shape and stale/ambiguous handling | Grounding cannot be mapped cleanly without World-side state distinctions | Minimum World → semantic input fields | Current boundary artifact or accepted seam contract | HIGH-VALUE before baseline is finalized |
| CFA-02 | Semantic↔record identity/revision mapping guarantees | Avoid collapsing semantic identity into durable IDs | Minimum identity continuity dimensions | Current durable-data contract or explicit mapping evidence | HIGH-VALUE |
| CFA-04 | Intent/effect/authority citation distinction | Needed to mark where meaning ends and permission begins | Authority-facing semantic package boundary | Current authority boundary + citation/re-resolution evidence | HIGH-VALUE |
| CFA-05 | Work-facing semantic handoff shape | Needed to distinguish semantic Plan meaning from executable Work snapshot | Semantic → Work continuity boundary | Current Work contract or durable handoff evidence | HIGH-VALUE |
| CFA-06 | Capability/effect descriptor shape | Needed to prevent operation/effect/risk terminology collisions | Minimal capability reference in canonical semantics | Current capability contract | CONTEXTUAL |
| CFA-08 | Existing representation/write-back constraints | Prevent visual terminology from becoming a second semantic model | Representation identity boundary | Current surface/representation contract | CONTEXTUAL |
| CFA-09 | Evolution identity/compatibility expectations | Continuity must survive semantic revision later | Revision/compatibility identity policy | Existing evolution boundary evidence | CONTEXTUAL |
| CFA-10 | Runtime invariants around canonical entry/gates | Semantic trace must not imply runtime authority | Runtime handoff boundary | Ratified Ω/K0 invariants | CONTEXTUAL |

### Decision gate

Do not proceed to a new semantic contract merely because a conceptual distinction is useful. Require evidence that the distinction closes a real ambiguity or proof gap.

---

## M2 — Grounding + Self-Knowledge Continuity

### Conceptual outcome

A deterministic, inspectable grounding contract that can preserve **reference identity, resolution state, World meaning, ambiguity/conflict, evidence basis and freshness** without turning the self-knowledge lens into authority.

### Why it matters

The current WorldModel contract is useful and deterministic, but strategic breadth requires explicit treatment of stale, ambiguous and conflicted grounding states and the provenance basis for those states.

### Evidence basis

- `WorldModel`;
- `ground.ts` deterministic match ranking and learned-prior ranking;
- `vivim.mind` derived/read-only contract;
- existing CFA-01 Round-2 WorldReferenceResult proposal;
- self-knowledge research identifying the freshness gap.

### Current maturity

**PARTIAL:** grounding exists and is deterministic; generalized freshness/evidence continuity is incomplete.

### Strategic decisions

- Whether the minimum seam should remain a bounded WorldModel projection or add a separate typed grounding-result contract.
- How freshness is computed from evidence basis rather than trusted from labels.
- How ambiguity, stale and conflict propagate into interpretation and Intent.
- Which learned priors are permissible as ranking inputs without altering semantic authority.

### Success criteria

- Resolved, ambiguous, stale, unresolvable and conflicted cases remain distinguishable.
- The basis for a grounding decision can be reconstructed.
- Learned priors can only rank candidates; they cannot create/remove semantic candidates or bypass gates.
- Stale knowledge cannot silently become current meaning.

### Falsifiers

- freshness requires a hidden semantic database;
- grounding must itself authorize an effect;
- a ranking prior changes canonical meaning without a deterministic/evidence-visible transition.

### Dependencies

- **Conditional external dependency:** CFA-01 acceptance of the World-side contract.
- **Internal dependency:** M1 continuity model.

### Tooling / substrate

- **ALREADY EXISTS:** deterministic NCLL tests and mind tests.
- **NEEDS SMALL EXTENSION:** replay fixtures carrying World evidence basis/version/freshness.
- **NOT YET NEEDED:** a new runtime knowledge store.

### Peer Intelligence Gate

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-01 | Resolved/ambiguous/stale/unresolvable/conflicted World result semantics | World is the semantic source for grounded targets | Grounding input/result shape | Accepted peer-side contract | **BLOCKING** for final seam shape |
| CFA-02 | Durable lineage needed to reconstruct grounding basis | Evidence references must survive persistence | Which grounding references can be durably cited | Record/revision/lineage contract | HIGH-VALUE |
| CFA-04 | Difference between unresolved target and unauthorized target | Prevent semantic refusal from becoming permission state | State propagation after grounding | Authority distinction evidence | CONTEXTUAL |
| CFA-06 | External observation/provider freshness signals | Real-world sources may stale independently | Freshness basis for provider-derived World information | Current realization/session evidence | CONTEXTUAL |
| CFA-09 | Staleness and compatibility implications of changing grounding rules | Grounding behavior may evolve | How rule/schema changes preserve meaning history | Evolution compatibility contract | HIGH-VALUE |
| CFA-10 | Runtime/source constraints for deterministic replay | Proof fixtures must match runtime behavior | What replay can legally observe | Runtime test/proof contract | CONTEXTUAL |

### Decision gate

Choose the smallest grounding contract that preserves evidence and state distinctions; do not create a universal “knowledge” object.

---

## M3 — Intent / Plan Continuity into Authority and Work

### Conceptual outcome

Canonical Intent/Plan meaning remains unchanged and traceable as it is presented to Authority and then to Work, including multi-step requests, live re-authorization, refusal, expiry and revocation.

### Why it matters

D-411 proves a canonical Intent seam, but current architecture breadth requires a durable distinction among semantic Intent/Plan meaning, live authorization and Work/execution state.

### Evidence basis

- `contracts/src/intent.ts`;
- D-411 current invariant;
- `vivim-intent` integration behavior;
- `surfaces/web/src/api.ts`;
- current CFA-04 and CFA-05 boundary evidence;
- `VAULT-NAMESPACES.md` Work/Intent descriptions.

### Current maturity

**PARTIAL:** single-request canonical Intent continuity is strong; full multi-step Plan/Work continuity remains unresolved.

### Strategic decisions

- Minimum semantic package entering live authorization.
- Minimum semantic package entering Work.
- How authority expiry/revocation returns without mutating Intent meaning.
- How Plan step identity relates to Work step/attempt identity.
- Which references are durable citations versus live-resolved state.

### Success criteria

- A refusal/expiry/revocation leaves the request's semantic meaning intact.
- Work can carry semantic references without becoming an authority cache.
- Multi-step plans preserve step identity and causation/provenance.
- Retries/resume re-resolve live authority where required.
- An external mutation is distinguishable from its representation, authorization and execution result.

### Falsifiers

- Work must duplicate semantic meaning as a new source of truth;
- authorization state changes the canonical interpretation of the request;
- a retry executes under stale authority without explicit live resolution;
- step identity is lost between Plan and Work.

### Dependencies

- **Conditional external dependency:** CFA-04 live citation/re-resolution.
- **Conditional external dependency:** CFA-05 Work-facing plan snapshot/attempt contract.
- **Conditional external dependency:** CFA-06 capability/effect identity where realization can change the concrete effect.
- Internal dependency on M1–M2.

### Tooling / substrate

- **ALREADY EXISTS:** D-411 seam tests and live web integration.
- **NEEDS SMALL EXTENSION:** semantic/authority/work cross-plane fixture matrix.
- **NOT YET NEEDED:** new runtime scheduler or authority implementation.

### Peer Intelligence Gate

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-04 | Live authority citation + expiry/revocation/re-check shape | Semantic meaning must remain distinct from live permission | Intent → Authority interface and return-state model | Ratified/accepted authority seam | **BLOCKING** |
| CFA-05 | Work/Plan/Attempt continuity and re-entry semantics | Semantic Plan must survive execution lifecycle | Semantic Plan → Work handoff identity | Accepted Work contract | **BLOCKING** |
| CFA-06 | Stable capability/effect reference across realizations | Provider changes must not change semantic intent | Capability citation in Plan/Intent | Capability/realization contract | HIGH-VALUE |
| CFA-02 | Durable reference/lineage guarantees for Intent/Plan | Historical reconstruction depends on durable citations | Semantic ↔ record/revision mapping | Data contract | HIGH-VALUE |
| CFA-09 | Compatibility behavior for revised Plans/semantic contracts | Long-lived Work may outlive semantic definitions | Versioning/reconstruction policy | Evolution contract | HIGH-VALUE |
| CFA-10 | Gate/enforcement invariants for canonical entry | Continuity must not imply authority | Runtime insertion point for semantic evidence | Ω invariant evidence | CONTEXTUAL |

### Decision gate

No multi-step semantic contract is “final” until the Authority and Work peers have supplied their current seam evidence.

---

## M4 — Representation Continuity + Bidirectional Semantics

### Conceptual outcome

Text, symbolic and visual forms become **projections of the same canonical semantic meaning**, with deterministic write-back for supported edits. V1 remains viable without visual compilation.

### Why it matters

VisualSpec and the historical SVG work show strong opportunity, but a visual surface becomes architecturally dangerous if it invents semantic state or becomes a second command/intent model.

### Evidence basis

- VisualSpec structures in `nlcl-pure/src/types.ts`;
- `project.ts` effect/risk projection;
- symbolic 17-family contract in `lang.ts`;
- archived SVG research;
- CFA-08 surface/interaction boundary evidence.

### Current maturity

**PARTIAL / PROPOSED:** deterministic projection exists; bidirectional semantic editing is not fully characterized.

### Strategic decisions

- What constitutes a semantic edit versus presentation-only edit?
- Minimum canonical form for symbol/visual projections.
- How ambiguity, confidence, evidence, risk, consent and execution state are encoded independently.
- Which visual edits are valid and which must be rejected.
- How representation identity relates to canonical semantic identity.

### Success criteria

- `canonical → projection → parse(canonical(projection))` preserves semantic equivalence.
- Direct manipulation can deterministically write back to canonical meaning for supported edit classes.
- Visual state never upgrades confidence to proof or representation to authority.
- V1 text command semantics remain unchanged by V2 visual projection.
- Execution-time states remain distinguishable from interpretation-time states.

### Falsifiers

- a visual edit cannot be deterministically reduced to canonical semantics;
- visual badges imply verification without evidence;
- visual DAG structure is treated as executable Work;
- a new visual-only grammar is required for core meaning.

### Dependencies

- M1 semantic identity model.
- M3 stable Intent/Plan semantic reference shape.
- Conditional CFA-08 interaction/representation constraints.

### Tooling / substrate

- **ALREADY EXISTS:** VisualSpec, token projection, deterministic interpreter.
- **NEEDS SMALL EXTENSION:** round-trip/property fixtures.
- **LATER / NEW TOOL JUSTIFIED ONLY IF PROVEN:** visual edit fixture harness and SVG projection validator.
- **NOT YET NEEDED:** full canvas implementation.

### Peer Intelligence Gate

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-08 | Interaction, representation and write-back semantics | Surface owns interaction realization | Supported semantic-edit contract | Current surface/interaction contract | **BLOCKING** |
| CFA-01 | World-object projection/edit implications | World meaning must survive visual interaction | World-target edit vs visual-only edit | World representation boundary evidence | HIGH-VALUE |
| CFA-02 | Persistence/identity behavior for representation revisions | Editable representations may be durable | Representation↔record mapping | Data continuity evidence | HIGH-VALUE |
| CFA-04 | Authority implications of semantic visual edits | A visual edit may create a consequential request | Whether edit requires a new authorization step | Authority seam evidence | HIGH-VALUE |
| CFA-05 | Work/progress presentation constraints | Representation may depict live Work state | How execution state projects back | Work state contract | CONTEXTUAL |
| CFA-09 | Representation migration/compatibility rules | Visual schema will evolve | How old representations preserve meaning | Evolution evidence | CONTEXTUAL |

### Decision gate

Do not build the full visual system. First prove one small editable representation round-trip over an already canonical semantic object.

---

## M5 — CANON + Self-Description + Continuity Proof

### Conceptual outcome

A compact terminology/crosswalk and evidence-backed self-description surface allow a fresh human or agent to answer:

- what does this command mean?
- why was it interpreted this way?
- what knowledge/grounding was used?
- what is known versus unresolved?
- what is merely represented versus actually authorized/executed?

### Why it matters

Self-description is currently distributed across manifests, WorldModel, Intent, evidence, current state and destination documents. The strategic role is to make continuity discoverable without creating another ontology or memory database.

### Evidence basis

- existing CANON-DICTIONARY foundation;
- `vivim.mind` self-description contracts;
- `Interpretation.stages`, canonical, reading, confidence, gaps;
- Intent interpretation persistence;
- system-intelligence findings on distributed self-knowledge and freshness.

### Current maturity

**PARTIAL:** bounded self-knowledge and interpretation explainability exist; cross-plane explanation is not yet unified.

### Strategic decisions

- Minimum canonical term record and alias/history treatment.
- Which self-knowledge questions deserve a stable machine-readable contract.
- Which answers must cite evidence directly.
- How freshness/conflict/unknown states appear in self-description.
- How to avoid turning CANON into a universal management taxonomy.

### Success criteria

- Important semantic terms have explicit definitions, owners and contrasts.
- A representative command can be explained from input → grounding → interpretation → Intent → authority/work state without hidden assumptions.
- Self-description never claims more than its evidence supports.
- Historical terms remain retrievable without becoming current canon by accident.
- Any automated maintenance action is clearly separated from descriptive self-knowledge.

### Falsifiers

- self-description requires copying the architecture into a second ontology;
- CANON becomes a universal task/management registry;
- explanation hides evidence basis or freshness;
- terminology cleanup changes semantic behavior accidentally.

### Dependencies

- M1–M4 continuity model and identity crosswalks.
- Conditional CFA-09 compatibility rules for evolving terms/contracts.

### Tooling / substrate

- **ALREADY EXISTS:** `mind.query`, `control.describe`, interpretation trace, existing CANON documentation.
- **NEEDS SMALL EXTENSION:** deterministic semantic explanation fixture set.
- **NOT YET NEEDED:** a standalone runtime knowledge database.

### Peer Intelligence Gate

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-01 | Canonical World terminology/identity boundaries | CANON must not redefine World ontology | Which World terms are referenced vs owned | Accepted World terminology boundary | HIGH-VALUE |
| CFA-02 | Durable identity/revision terminology | Terms need lineage without one universal ID | Representation of record/revision references | Data contract | HIGH-VALUE |
| CFA-04 | Authority vocabulary and refusal/consent states | Self-description must not conflate permission with meaning | Definitions for authority-facing terms | Authority contract | HIGH-VALUE |
| CFA-05 | Work state vocabulary | Explain execution without flattening semantics | Definitions for Work/Attempt/Outcome-facing terms | Work contract | HIGH-VALUE |
| CFA-06 | Capability/operation/effect terminology | Avoid capability-language collisions | Canonical crosswalk for op/capability/effect | Capability contract | CONTEXTUAL |
| CFA-08 | Human-facing terminology/interaction constraints | Terms appear in representations | Human-facing alias/label rules | Surface contract | CONTEXTUAL |
| CFA-09 | Term/schema compatibility and migration semantics | Canon must preserve history through evolution | Terminology lifecycle rules | Evolution contract | HIGH-VALUE |
| CFA-10 | Runtime guarantee vocabulary | Explain runtime state without overclaim | K0/runtime terminology boundaries | Ω invariant vocabulary | CONTEXTUAL |

### Decision gate

The CANON artifact is successful when it reduces ambiguity without becoming the semantic authority of other CFAs.

---

# Dependency Model

## Internal milestone dependencies

```
M1 Semantic Baseline
        ↓
M2 Grounding + Self-Knowledge Continuity
        ↓
M3 Intent / Plan → Authority / Work
        ↓
M4 Representation + Bidirectional Semantics
        ↓
M5 CANON + Self-Description + Proof
```

This is a **conceptual dependency chain**, not permission to serially implement every stage. Individual evidence-gathering tasks can run in parallel when their inputs are independent.

## External dependency classification

| Dependency | Kind | Current status | Confirmation needed |
|---|---|---|---|
| CFA-01 World grounding reference/result | semantic + evidence | Conditional / unactivated | Peer-side accepted seam |
| CFA-02 semantic↔record mapping | data + identity | Conditional / unactivated | Peer-side accepted mapping |
| CFA-04 authorization citation/re-resolution | authority | Conditional / unactivated | Peer-side accepted contract |
| CFA-05 Plan/Work handoff | execution | Conditional / unactivated | Peer-side accepted contract |
| CFA-06 effect/capability identity | realization | Conditional / unactivated | Stable capability/effect contract |
| CFA-08 representation/write-back | surface/UX | Conditional / unactivated | Supported semantic-edit contract |
| CFA-09 semantic evolution compatibility | lifecycle/evolution | Conditional | Compatibility/migration evidence |
| CFA-10 runtime enforcement | runtime/platform | Contextual | Existing Ω invariants, no new runtime ownership |

**Important:** peer intelligence requests in this roadmap are **requests, not dependencies**, until the consumer decision, peer ownership and evidence have been reconciled.

---

# Tooling / Substrate

| Need | Current posture | Strategic role |
|---|---|---|
| GitHub repository search/read/write | ALREADY EXISTS | Evidence and durable artifact maintenance |
| Deterministic NCLL tests | ALREADY EXISTS | Prove interpretation repeatability |
| Mind tests / portrait tests | ALREADY EXISTS | Prove bounded derived self-knowledge |
| D-411 Intent seam tests | ALREADY EXISTS | Prove canonical Intent persistence/citation behavior |
| Semantic continuity fixture pack | NEEDS SMALL EXTENSION | Cross-plane reproducibility |
| Round-trip/property fixture harness | NEEDS SMALL EXTENSION | Prove representation preserves meaning |
| Freshness/evidence-basis fixture support | NEEDS SMALL EXTENSION | Prove stale/conflicted grounding semantics |
| Semantic terminology analyzer | NOT YET NEEDED | Justify only if repeated CANON collision work becomes manual/high-risk |
| Full SVG/canvas implementation | NOT YET NEEDED | Product implementation follows contract proof |
| New runtime knowledge/evidence database | NOT JUSTIFIED | Existing derived and durable structures should be reused |

---

# Strategic Decision Gates

1. **Semantic identity gate:** Do not introduce new identity infrastructure until the M1 crosswalk proves an actual continuity gap that existing relations cannot represent.

2. **Grounding gate:** Choose the smallest World-side result that preserves ambiguity, freshness and evidence; do not create a universal knowledge abstraction.

3. **Intent/Authority/Work gate:** Finalize only after live authority and Work contracts are understood; semantic refusal must remain distinct from semantic reinterpretation.

4. **Visual gate:** Prove one deterministic editable representation round-trip before broad SVG/canvas work.

5. **CANON gate:** Canonicalize terms only where semantic boundaries are understood; retain history and aliases rather than broad renaming.

6. **Self-description gate:** Every consequential self-description claim must expose its basis or clearly report an unresolved/unknown state.

7. **Evolution gate:** Before changing a semantic contract, determine compatibility impact and preserve old meaning/revision lineage.

---

# Product / Strategic Consequences

- A stronger semantic seam supports VIVIM's provider-agnostic interaction model because the same meaning can route through different realizations without changing the user's request.
- Deterministic grounding and explicit uncertainty reduce silent reinterpretation of user commands.
- Canonical Intent continuity enables explanation and recovery without requiring the UI to be the source of meaning.
- Visual projection can become an inspectable “what the machine thinks will happen” surface rather than a separate interaction language.
- Better self-description makes VIVIM more intelligible to both humans and agents without requiring a second architectural ontology.
- The approach preserves V1 compatibility while leaving room for richer symbolic/visual interaction in V2.

---

# Deferred / Do Not Do

- Do not start production implementation during this strategic round.
- Do not activate shared CFA boundaries.
- Do not create a universal semantic/identity/provenance database.
- Do not redesign World ontology.
- Do not invent a second command grammar.
- Do not make visual representation an authority mechanism.
- Do not force V2 visual semantics into V1 runtime behavior.
- Do not equate confidence, representation, or self-description with proof or authority.
- Do not build the full canvas/SVG system before a small round-trip contract is proven.
- Do not perform broad repository renaming merely for terminology cleanliness.
- Do not turn CANON into project management.
- Do not adopt the older Cycle 4 / Live Chrome slice as an automatic semantic-continuity mandate.

---

# Relationship to Existing Program Plans

| Existing material | CFA-03 treatment | Reason |
|---|---|---|
| D-411 canonical-intent seam | **ADOPTED AS CURRENT EVIDENCE** | It is existing Ω canonical evidence for the Intent seam, not a new roadmap mandate. |
| D-410 core-first resequencing | **USEFUL INPUT / NOT ADOPTED AS CFA SEQUENCING AUTHORITY** | Strategic roadmap round supersedes old program ordering as the planning stage. |
| P1-03 / P1-04 / P1-05 / P1-06 / P1-09 references | **USEFUL INPUT / NOT AUTOMATICALLY ADOPTED** | They identify historical/candidate work areas; this roadmap derives milestone order from current semantic evidence. |
| Historical SVG Symbolic Communication Design | **USEFUL INPUT / DEFERRED** | Reuse the deterministic/epistemic/visual ideas after canonical semantics are proven. |
| Cycle 4 — Live Chrome / Accounts | **OUTSIDE CFA-03 SCOPE AS A CURRENT MANDATE** | Provider/account/browser realization is primarily CFA-06; any semantic consequences are peer inputs. |
| Historical compiler/implementation plans in archive | **USEFUL INPUT / NOT ADOPTED** | Preserve lineage; current Ω behavior and current CFA boundaries govern. |

---

# First Bounded Actionable Work

## ROADMAP-M1-SEMANTIC-BASELINE-TRACE-2026-09-27

**Objective:** produce the evidence-backed M1 semantic continuity baseline and terminology collision map.

**Advances:** M1.

**Dependencies:** Current Ω code/contracts and existing CFA-03 boundary evidence only. No new Round-1 peer result is required to begin.

**Peer inputs required:** Existing peer boundary artifacts may be consulted for orientation; new strategic Round-1 peer outputs must not be consumed during the first-pass execution.

**Tooling:** Existing GitHub repository search/read plus existing deterministic tests; add only a small fixture if a concrete gap is demonstrated.

**Write scope:** CFA-03 home only; evidence/design artifacts and task/receipt updates. No production runtime changes.

**Completion condition:** trace the current semantic path; identify authoritative versus derived/proposed/historical artifacts; produce a compact continuity identity/state crosswalk; record concrete unknowns and falsifiers; persist evidence without activating shared boundaries.

**Stop condition:** stop on genuine owner policy, peer ownership conflict, Ω-law collision, or evidence insufficiency.

---

# Evidence Index

### Ω / implementation

- `omega-baseline/omega-final/contracts/src/lang.ts` — language-as-data and 17 family contract.
- `omega-baseline/omega-final/contracts/src/intent.ts` — Intent, IntentStep, IntentState, payloadHash, interpretation and resolution vocabulary.
- `omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/index.ts` — deterministic interpreter export and zero-import boundary.
- `omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/interpret.ts` — current deterministic semantic pipeline.
- `omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/ground.ts` — current deterministic grounding and ranking-only priors.
- `omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/frames.ts` — command frames, 17-family bindings and language data.
- `omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/project.ts` — token/effect projection.
- `omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/types.ts` — WorldModel, Interpretation and VisualSpec contracts.
- `omega-baseline/omega-final/plugins/vivim-mind/plugin.json` — derived/self-knowledge contract.
- `omega-baseline/omega-final/plugins/vivim-intent/src/index.ts` — canonical Intent persistence implementation.
- `omega-baseline/omega-final/surfaces/web/src/api.ts` — live interpret → persist → gate → execute → resolve path.
- `omega-baseline/omega-final/docs/decisions/D-411-intent-seam.md` — ratified canonical Intent seam.
- `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md` — current Ω law snapshot, including D-411.
- `omega-baseline/omega-final/docs/VAULT-NAMESPACES.md` — Intent/Work/evidence durable namespace descriptions.

### Destination / research

- `docs/destination/self-knowledge-core/RESEARCH.md`
- `docs/destination/INTERACTION-INTENT-WORK-RECONCILIATION.md`
- `docs/destination/system-intelligence/pass-2/SA-06-self-knowledge/ATOMS.jsonl`
- `docs/destination/system-intelligence/findings/SI-01/ATOMS.jsonl`
- `docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md`
- `docs/archive/planning/chat-SVG Symbolic Communication Design.txt`

### CFA-03 durable context

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/AGENT.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/CORE-AGENT-IDENTITY.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/CANON-DICTIONARY.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/STATE.md`

## Strategic stopping point

This roadmap is intentionally **not a backlog**. It identifies the conceptual destination, milestone decisions, evidence needed, dependencies, tooling, and the first bounded action. The central Architecture Steward should reconcile all ten local roadmaps before selecting any shared execution frontier.
