# CFA-04 Authority / Governance — Strategic Domain Roadmap
## 2026-09-27 — Independent Round 1

> Status: FIRST-PASS / PROPOSED
> Owner: `authority-governance`
> Planning layer: CFA strategic roadmap; not Ω law, not implementation authorization.
> Independence: This roadmap was formed without consuming any newly-produced Round-1 roadmap from another CFA.

## Strategic Objective

Make VIVIM able to explain and govern, for every consequential effect, **who may cause it, for whom, what effect is requested, what authority basis permits it, what scope/conditions/time/delegation/consent apply, whether that authority is live now, where the decision is enforced, and how the result can be reconstructed** — while keeping authority semantically distinct from World truth, Data, Intent, Capability/Provider/Realization, Work, Experience, Evolution, Runtime enforcement, and evidence.

Destination-grade Authority is therefore not "a permissions table" or "vivim-law ownership". It is a durable semantic corridor:

```
principal / behalf
  → requested effect + target
  → capability / realization context
  → authority basis
  → consent / standing / delegation
  → scope / conditions / expiry / revocation
  → live invocation decision
  → runtime enforcement
  → effect / observation
  → reconstructable evidence
```

Success is reached when the corridor remains explicit and re-resolvable across ordinary user actions, delegated/background work, provider changes, and consequential self-change.

## Responsibility Frontier

### Own

- authority/permission semantics and authority-basis vocabulary;
- principal/actor/behalf/deputy relationships at the authorization boundary;
- consent, standing, delegation and attenuation semantics;
- scope, conditions, duration, expiry and revocation;
- authority-to-invocation binding and gate-time re-resolution requirements;
- authority-facing risk interpretation;
- authorization conditions for consequential composition/evolution/self-change;
- authority-facing references required for reconstruction;
- cross-domain invariants preventing permission from being inferred from capability, identity, intent, evidence, execution, representation or communication.

### Explicitly do not own

- Ω law as an independently alterable authority source;
- K0 enforcement implementation or security/secret primitives;
- canonical identity/data storage or revision mechanics;
- Intent/Plan construction;
- Work lifecycle, scheduling or execution;
- Capability/Provider/Account/Session/Realization semantics or routing mechanics;
- UI/surface realization;
- Forge/composition mechanics;
- generic migration/compatibility/rollback lifecycle;
- general evidence/provenance architecture;
- unilateral owner policy.

## Current Evidence / Maturity

### OBSERVED / CURRENT

1. D-412 establishes principal records with non-reuse semantics, without turning them into a full cryptographic identity constitution.
2. D-452 ratifies explicit invocation frames, live authority re-resolution at every check, deputy handling, scope enforcement and invocation/effect pairing.
3. D-453 ratifies bounded standing with required expiry, explicit revocation, inspection, fresh renewal and no perpetual authority.
4. D-454 ratifies vault-resolved delegation, per-hop attenuation, expiry/revocation cascade and protection against unverified carried claims.
5. D-455 ratifies governed adaptation with blast-radius census, treaty checks, rollback point and signed ratification.
6. The Ω genome records Ω-12/13/15 and related authority mechanisms as implemented evidence-class layers.
7. The current destination reconciliation map describes authority/rules as architecturally strong, while delegation/agents and background work remain partial.
8. P1-06 contains a deliberately narrow governed-action wire/data shape around `message.send@1`; its own code comments explicitly state that it is not the semantic owner of the authorization verdict.

### DERIVED

- The largest remaining strategic problem is not missing primitive authority mechanisms; it is **cross-CFA coherence and proof across real work/effects**.
- Authority must become inspectable and reconstructable without creating a second authority store.
- The first useful proof vehicle should remain thin and real; the strategic destination should not be constrained to `message.send@1`.
- Provider/account/realization changes, durable Work, delegation, and self-change are the main contexts in which stale or implicit authority can reappear.

### UNKNOWN / DEFERRED

- exact durable AuthorityCitation storage/join with CFA-02;
- final World accessible/visible/authorized composite semantics;
- multi-step and batched authorization with CFA-05;
- precise authority-facing risk vocabulary with CFA-06;
- exact runtime/evidence join for an eventual Authority Trace;
- future cross-provider, sharing/treaty and self-change authority corridors.

## Conceptual Roadmap

### M1 — Cross-CFA Authority Contract Convergence

**Conceptual outcome**

A minimal, shared authority-facing vocabulary and corridor contract exists at the seams where permission is currently most likely to be conflated with World visibility, Intent, Capability, Work, realization, and Runtime enforcement.

**Why it matters**

The Ω mechanisms are individually strong, but the remaining risk is semantic drift between the owners that supply facts to or consume authority decisions.

**Evidence basis**

D-412 through D-455; CFA-04 CORE-AGENT; peer relationship atlas; Round-1/2 boundary artifacts; destination responsibility matrix; current CFA-01/03/05/06/09/10 boundaries.

**Current maturity**

FOUNDATION-STRONG / CROSS-CFA CONTRACTS PARTIAL.

**Design choices**

- minimum `authorityRef` / citation shape;
- effect/operation/scope vocabulary boundary;
- principal/behalf representation at the authorization seam;
- accessible vs authorized distinction;
- authority-facing risk descriptor;
- live-vs-historical authority reference semantics;
- re-resolution trigger semantics.

**Success criteria**

- Every consequential corridor can name the authority input, current decision, and enforcing owner without semantic role confusion.
- A stale/historical citation cannot be mistaken for live permission.
- The contract does not require a universal authority graph or duplicate canonical store.
- UNKNOWN/CONFLICTED fields remain explicit instead of being filled by inference.

**Falsifiers**

- a peer contract still requires CFA-04 to define another domain's canonical meaning;
- a capability, Work record, UI event or evidence record is sufficient by itself to imply permission;
- a cached authority verdict survives a required live re-check;
- two incompatible meanings of the same authority-facing field are silently normalized.

**Prerequisites**

Existing ratified identity and current Ω authority mechanisms.

**Dependencies**

Semantic/data/Work/Capability/Runtime cross-CFA evidence; not yet all confirmed as architectural dependencies.

**Candidate implementation later**

A compact contract package and deterministic trace checks; no generic authorization engine.

**Must remain unresolved**

Anything requiring owner policy, Ω-law amendment, or a peer's semantic ownership decision.

#### Peer Intelligence Gate — M1

| Peer CFA | Intelligence / evidence needed | Why | Exact decision | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-01 | final World-side distinction among existent/addressable/visible/accessible and proposed authority-facing result | prevents Authority from becoming World ontology | define World→Authority target/visibility input | explicit current contract or evidence-backed unresolved state | **BLOCKING** before contract freeze |
| CFA-02 | minimum durable identity/reference and AuthorityCitation storage/join semantics | avoids creating an authority store | determine which fields are references vs durable records | current Data contract + reconstruction example | **BLOCKING** |
| CFA-03 | minimum semantic Intent/Plan payload handed to authorization | avoids intent becoming permission | define authorization handoff without importing interpretation ownership | one concrete Intent→Authority handoff | **HIGH-VALUE** |
| CFA-05 | Work/Attempt authority reference and retry/resume re-check requirements | avoids Work becoming authority cache | define Work↔Authority citation/re-resolution contract | one Work/Attempt example with retry semantics | **BLOCKING** |
| CFA-06 | canonical capability/effect/risk descriptor crossing the seam | separates "can" from "may" | define authority input without importing realization semantics | one capability with provider-independent effect/risk data | **BLOCKING** |
| CFA-10 | exact mechanical gate inputs/outputs and observable enforcement evidence | keeps semantic and runtime claims separate | define semantic→runtime handoff | one enforcement trace or current contract | **HIGH-VALUE** |
| CFA-09 | change-driven reauthorization triggers | prevents semantic continuity from preserving stale authority | define change events that force authority re-resolution | current compatibility/change boundary example | **HIGH-VALUE** |

### M2 — Reconstructable Authority State Without a Second Authority Store

**Conceptual outcome**

Authority becomes reconstructable as a distributed semantic relationship over existing principal, consent, standing, delegation, invocation and evidence records, with clear ownership of each durable fact.

**Why it matters**

The main unresolved design question is not whether authority exists, but how a future system can reconstruct *why an action was or was not authorized* without duplicating law, identity, data or evidence.

**Evidence basis**

D-412, D-452, D-453, D-454; Authority Trace design; Authority Case Template; destination evidence/reconstruction model.

**Current maturity**

STRONG IMPLEMENTED PRIMITIVES / DURABLE CROSS-RECORD RECONSTRUCTION PARTIAL.

**Design choices**

- canonical citation granularity;
- authority-state reference versus copied snapshot;
- reconstruction-time live resolution versus historical replay;
- retention/expiry/revocation representation;
- provenance/evidence references without evidence becoming authority.

**Success criteria**

- One authority decision can be reconstructed from identified durable facts and current resolution rules.
- Historical authorization is distinguishable from current permission.
- Revocation and expiry leave reconstructable history without becoming implicit permission.
- No duplicate authority/security/data store is required.

**Falsifiers**

- reconstruction requires a hidden permissions database;
- a copied authorization verdict is treated as canonical current state;
- deleting or compacting a source record changes historical authority meaning contrary to Ω retention;
- evidence provenance becomes the decision source.

**Prerequisites**

M1 contract convergence.

**Dependencies**

CFA-02 persistence/revision/reference model; evidence/provenance mechanisms; Ω authority row semantics.

**Candidate implementation later**

A read-only Authority Trace dossier and deterministic reconstruction fixtures.

**Must remain unresolved**

Whether every authority-adjacent object deserves a first-class durable record.

#### Peer Intelligence Gate — M2

| Peer CFA | Intelligence / evidence needed | Why | Exact decision | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-02 | record identity, revision, retention and reference rules | determines storage/join boundary | authority citation persistence shape | one replayable multi-record example | **BLOCKING** |
| CFA-03 | Intent/Plan references required for replay versus semantics | prevents semantic duplication | minimum intent citation set | one canonical reference example | **CONTEXTUAL** |
| CFA-05 | Work/Attempt retention and outcome/evidence separation | reconstruction spans execution history | Work-side citation minimum | one attempted + completed/refused case | **HIGH-VALUE** |
| CFA-10 | runtime evidence granularity and event retention | distinguishes enforcement evidence from authority | enforcement evidence reference shape | one gate trace | **HIGH-VALUE** |
| CFA-01 | World target correspondence and projection references | reconstruction must identify the intended target without redefining it | target reference boundary | one target/ref example | **HIGH-VALUE** |

### M3 — Live Authority Corridor and Negative Proof

**Conceptual outcome**

A real consequential corridor demonstrates that authority is resolved at the point of invocation, enforced mechanically by the correct runtime seam, and reconstructable afterward, with a paired negative corridor for expiry/revocation/out-of-scope conditions.

**Why it matters**

This is the transition from coherent design to evidence of live behavior.

**Evidence basis**

D-452/D-453/D-454 falsifiers; P1-06 governed-action proof vehicle; destination vertical-slice principle; current Runtime/Capability/Work boundaries.

**Current maturity**

Ω AUTHORITY MECHANISMS PROVEN IN THEIR OWN EVIDENCE TREE / DESTINATION-GRADE CROSS-CFA LIVE CORRIDOR NOT YET PROVEN.

**Design choices**

- first proof effect/capability;
- authority basis used (consent, standing or delegation);
- live re-resolution observation point;
- negative corridor selection;
- evidence bundle sufficient for reconstruction.

**Success criteria**

Design:
- corridor fields map cleanly to the M1 contract.

Implementation/integration:
- a real governed action reaches the Authority gate before effect.

Live proof:
- the same action is accepted when authority is live and refused after expiry/revocation/out-of-scope change.

Reconstruction:
- the decision and enforcement evidence can be replayed without relying on chat memory.

Product proof:
- a human can understand what VIVIM was allowed to do and why without seeing internal authorization machinery.

**Falsifiers**

- provider/capability selection bypasses authority;
- cached consent survives expiry/revocation;
- refusal cannot distinguish authority absence from unrelated execution failure;
- successful execution is treated as proof of authorization.

**Prerequisites**

M1; sufficient M2 citation semantics.

**Dependencies**

CFA-06 realization/effect evidence; CFA-05 Work/Attempt semantics; CFA-10 runtime gate observation; likely CFA-02 reconstruction support.

**Candidate implementation later**

Authority Trace read path and a thin corridor harness around an existing governed action. No expansion to a generic policy engine.

**Must remain unresolved**

Broad multi-action authorization until one corridor establishes the needed abstraction.

#### Peer Intelligence Gate — M3

| Peer CFA | Intelligence / evidence needed | Why | Exact decision | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-05 | exact Attempt boundary and retry/recovery behavior | tests live re-check semantics | where/when authorization is re-resolved | one real attempt lifecycle | **BLOCKING** |
| CFA-06 | actual realized capability/effect and external-effect evidence | proves the corridor crossed from semantic request to real effect | first live proof vehicle | attributable live realization evidence | **BLOCKING** |
| CFA-10 | exact gate/enforcement observation and refusal propagation | proves enforcement is distinct from semantic authorization | runtime proof surface | one accepted + one refused gate trace | **BLOCKING** |
| CFA-02 | reconstruction refs/retention | proves after-the-fact explanation | evidence join | replayable source records | **HIGH-VALUE** |
| CFA-08 | human-readable consent/refusal presentation constraints | product proof depends on understandable governance | explanation surface contract | one representative UX/surface mapping | **CONTEXTUAL** |

### M4 — Delegated, Standing, and Long-Lived Work Authority

**Conceptual outcome**

Standing and delegation become safe foundations for durable/background Work: authority remains bounded, attenuated, expiring and revocable across retries, resumption and provider changes.

**Why it matters**

VIVIM's "while you were away" experience requires authority that survives time without becoming perpetual or detached from live conditions.

**Evidence basis**

D-453, D-454, current Work and Capability boundaries, destination D3/D4/D5 tracks.

**Current maturity**

AUTHORITY PRIMITIVES STRONG / DURABLE-WORK CORRIDOR PARTIAL.

**Design choices**

- minimum standing carried across Work;
- delegation-chain citation in Work/Attempt;
- re-resolution points for resumed work;
- multi-step/batched authorization model;
- authority behavior across provider/realization change;
- escalation semantics when an action leaves its authority radius.

**Success criteria**

- A resumed Work attempt never assumes that prior authorization remains live when re-check is required.
- Delegation narrows at every hop and revocation/expiry propagates deterministically.
- Standing is never perpetual and renewal is a fresh authority act.
- A provider/realization change cannot silently widen authority.
- Human escalation is explicit when the authority radius is exceeded.

**Falsifiers**

- retries execute after authority has expired/revoked;
- delegated child scope exceeds parent;
- provider swap silently grants additional authority;
- background work treats historical consent as standing without a governed basis.

**Prerequisites**

M3 live corridor; multi-step Work/Authority decision.

**Dependencies**

CFA-05 strongly; CFA-06; CFA-09 for change events; CFA-08 for escalation presentation.

**Candidate implementation later**

Bounded Work↔Authority references, delegation/standing resolution checks, and one background proof corridor.

**Must remain unresolved**

Large-scale policy automation until multi-step proof demonstrates the correct abstraction.

#### Peer Intelligence Gate — M4

| Peer CFA | Intelligence / evidence needed | Why | Exact decision | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-05 | multi-step Work/Attempt semantics, retry/resume boundaries | authority must bind to durable work safely | per-step vs whole-work reauthorization | one multi-step/retry case | **BLOCKING** |
| CFA-06 | provider/realization substitution semantics and external effect continuity | provider change may alter effect | re-authorization trigger set | one controlled realization substitution case | **HIGH-VALUE** |
| CFA-09 | change/compatibility events that invalidate prior authority assumptions | continuity cannot equal permission | re-resolution trigger taxonomy | one change-impact case | **HIGH-VALUE** |
| CFA-08 | escalation/consent UX for out-of-radius work | bounded autonomy needs a human-facing stop | escalation surface | one non-auto-approval interaction mapping | **CONTEXTUAL** |
| CFA-02 | durable Work-linked citation/ref lifecycle | keeps Work from becoming authority store | reference persistence semantics | one retained Work + authority citation chain | **HIGH-VALUE** |

### M5 — Consequential Change, Sharing, and Continuous Authority Governance

**Conceptual outcome**

Authority remains coherent when the system changes itself, crosses sovereignty boundaries, or maintains long-lived delegated relationships.

**Why it matters**

The difficult authority problem moves from "may this operation run?" to "may this authority model, realization, treaty or governed behavior change?"

**Evidence basis**

D-454 treaty shape; D-455 adaptation governance; destination sharing/evolution frontiers; current CFA-09/CFA-07 boundaries.

**Current maturity**

FOUNDATION RATIFIED / CROSS-INSTANCE AND SELF-CHANGE PRODUCT PROOF OPEN.

**Design choices**

- authority implications of self-change proposals;
- treaty/delegation crossing semantics;
- re-authorization after capability/realization changes;
- authority impact of owner/device/account lifecycle changes;
- rollback and revocation interaction;
- continuous monitoring/drift boundary.

**Success criteria**

- Every consequential self-change has an explicit authority basis and named ratification path.
- Cross-principal/cross-instance authority is bounded, expiring, attributable and revocable.
- Adaptation cannot self-authorize or silently widen its own permissions.
- Rollback/replacement cannot resurrect revoked authority.
- Authority drift is detectable as an explicit state rather than silently normalized.

**Falsifiers**

- self-healing can ratify its own permission expansion;
- treaty/delegation authority survives beyond its declared expiry;
- rollback reactivates dead authority;
- compatibility preservation is mistaken for authorization preservation.

**Prerequisites**

M4 plus mature change/evidence boundaries.

**Dependencies**

CFA-07 composition/Forge; CFA-09 change lifecycle; CFA-02 identity/persistence; CFA-10 enforcement; owner decisions for sovereignty/policy questions.

**Candidate implementation later**

Authority-facing adaptation/treaty checks and cross-instance proof, only after the preceding corridors establish the required contracts.

**Must remain unresolved**

Owner-specific policy and constitutional changes outside the delegated CFA boundary.

#### Peer Intelligence Gate — M5

| Peer CFA | Intelligence / evidence needed | Why | Exact decision | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-07 | composition/promotion/change semantics and authority crossing | self-change must be governed without absorbing Forge ownership | where authority ratification attaches | one consequential promotion case | **BLOCKING** |
| CFA-09 | compatibility, rollback, migration and impact semantics | authority must survive/renew correctly through change | authority invalidation/re-resolution policy | one rollback/change-impact case | **BLOCKING** |
| CFA-02 | principal/device/account persistence and cross-instance reference semantics | sovereignty crossings need stable identity references | treaty/principal linkage | one cross-principal identity chain | **HIGH-VALUE** |
| CFA-10 | atomic activation/recovery behavior for governed changes | proves no unauthorized half-state | enforcement/recovery boundary | one failed activation/recovery case | **HIGH-VALUE** |
| CFA-08 | user-visible change consent / explanation / rollback surfaces | signed governance must remain comprehensible | human ratification presentation | one representative change journey | **CONTEXTUAL** |
| CFA-06 | realization replacement evidence | model/provider changes can alter effects | reauthorization trigger | one replacement case with effect diff | **HIGH-VALUE** |

## Dependency Model

| Dependency | Kind | Current state | Directness | Required? | Evidence to confirm/falsify |
|---|---|---|---|---|---|
| CFA-01 target/visibility/accessibility boundary | semantic | OPEN | direct | Required for M1 | accepted World→Authority handoff contract |
| CFA-02 AuthorityCitation/reference model | data | UNKNOWN | direct | Required for M1/M2/M3 | replayable persisted citation example |
| CFA-03 Intent→Authority handoff | semantic | PARTIAL | direct | Preferred, potentially required for M1 | one canonical intent/authorization handoff |
| CFA-05 Work/Attempt authorization boundary | authority/execution | OPEN | direct | Required for M3/M4 | live retry/resume authority case |
| CFA-06 effect/risk/realization seam | realization | OPEN | direct | Required for M3 | attributable live realization proof |
| CFA-10 semantic→runtime enforcement seam | runtime | PARTIAL/KNOWN | direct | Required for M3 | accepted/refused gate observation |
| CFA-09 change-driven reauthorization | lifecycle/evolution | OPEN | direct | Required for M4/M5 | change-impact case showing authority re-resolution |
| CFA-07 consequential composition authorization | authority/composition | PROPOSED | direct | Required for M5 | governed promotion case |
| General evidence/provenance substrate | evidence/proof | STRONG | transitive | Required for reconstruction | reproducible source/effect/enforcement lineage |
| Provider Lab / live external proof | realization/evidence | EXISTING PROGRAM CAPABILITY | transitive | Required for real-effect proof | live authenticated operation with attributable effect |
| Ω law D-412/452/453/454/455 | authority/law | RATIFIED | direct | Required | ratified records + existing falsifiers |
| Existing P1-06 proof vehicle | execution/proof | CURRENT EVIDENCE | transitive | Preferred for M3 only | live extension beyond its existing thin scope |

**Dependency discipline:** Peer Intelligence Gates are evidence requests, not automatically accepted architectural dependencies. A request becomes a confirmed dependency only when the consuming decision is demonstrated to require it and the source peer owns the requested semantic.

## Tooling / Substrate

| Milestone | Needed tooling | Status | Purpose |
|---|---|---|---|
| M1 | repository search, boundary/graph views, deterministic contract diff/reconciliation | **ALREADY EXISTS / SMALL EXTENSION** | compare peer seam claims and detect vocabulary drift |
| M2 | replayable citation fixtures, Authority Trace read prototype, source-lineage/query tooling | **SMALL EXTENSION** | reconstruct decisions without a duplicate store |
| M3 | falsifier harness + live governed-action harness + runtime gate observation | **ALREADY EXISTS / SMALL EXTENSION** | positive/negative live corridor proof |
| M4 | durable Work replay, clock-pinned expiry/revocation tests, delegation-chain fixture suite | **SMALL EXTENSION** | prove long-lived authority safely |
| M5 | adaptation/treaty impact analysis, rollback/revival falsifiers, cross-instance trace/replay | **NEW TOOL JUSTIFIED LATER** | only after M4 exposes exact evidence shape |

### Tooling not justified by this roadmap

- a second authorization engine;
- a universal permissions database;
- another provider/router architecture;
- a generic authority graph;
- broad policy DSL work before corridor evidence;
- UI-heavy governance tooling before semantic contracts stabilize.

## Strategic Decision Gates

| Gate | Decision | Alternatives still open | Decision owner | Owner intent required? | Falsifier |
|---|---|---|---|---|---|
| G1 | Freeze minimum cross-CFA authority seam contract | narrow citation vs richer handoff; exact accessible mapping | CFA-04 + affected peer owners through established boundary process | **Yes** if sovereignty/control semantics are implicated | any corridor still needs implicit permission inference |
| G2 | Freeze durable AuthorityCitation boundary | reference-only vs bounded durable relation | CFA-02 with CFA-04 authority-facing requirements | **Potentially** for retention/ownership policy | reconstruction forces duplicate store or copied verdict |
| G3 | Select first real proof corridor | existing P1-06 `message.send@1` vs another already-governed real effect | CFA-04 after peer evidence; integration owners own realization | **No** unless product/policy choice is involved | selected corridor cannot be live/attributable |
| G4 | Freeze multi-step/resume reauthorization semantics | per-step, boundary-step, or bounded whole-work contract | CFA-05/CFA-04 | **Yes** when user autonomy radius is product policy | retries violate live authority |
| G5 | Freeze change/treaty authority boundary | reuse existing D-455/D-454 mechanisms vs bounded extensions | CFA-04 + CFA-07/CFA-09; owner for sovereignty changes | **Yes** for cross-principal sovereignty policy | change or treaty can widen/revive authority silently |

## Product / Strategic Consequences

- **Trustworthy automation:** background work can be inspectable as authorized work rather than an opaque agent action.
- **Human control without constant prompting:** bounded standing/delegation can reduce unnecessary prompts while retaining expiry, scope and revocation.
- **Provider independence:** changing provider/account/realization does not silently change what the user authorized.
- **Explainability:** a refusal or approval can be reconstructed as a chain of facts and current rules rather than a UI impression.
- **Safer self-maintenance:** system repair/evolution cannot quietly promote its own authority.
- **Sovereignty:** cross-principal or cross-instance actions can be treated as explicit governed relationships rather than implicit trust.

These are product consequences, not a product-policy decision by CFA-04.

## Deferred / Do Not Do

- Do not turn P1-06 `message.send@1` into the permanent authority domain model.
- Do not build a generic authorization/policy engine before proving a real corridor.
- Do not create a second authority or security store to simplify reconstruction.
- Do not let Work cache live permission.
- Do not let provider/account/session state imply authorization.
- Do not merge World accessibility and Authority permission into one semantic object.
- Do not let Commons identity, signatures, communications or messages become authority merely by attribution.
- Do not redesign Ω law in the roadmap.
- Do not select a shared implementation cycle from this local roadmap.
- Do not turn every future milestone into a ready task.
- Do not consume another CFA's fresh Round-1 roadmap to reduce independent divergence.

## Relationship to Existing Program Plans

| Existing plan / evidence | Classification | CFA-04 interpretation |
|---|---|---|
| Ω D-412 principal seam | **ADOPTED** | Current law/evidence constraint; not a new project task. |
| Ω D-452 invocation | **ADOPTED** | Current constitutional evidence for live re-resolution and explicit frames. |
| Ω D-453 standing | **ADOPTED** | Current bounded-standing semantics; roadmap tests the cross-CFA destination use. |
| Ω D-454 delegation | **ADOPTED** | Current attenuation/revocation evidence; treaty transport remains later. |
| Ω D-455 adaptation governance | **ADOPTED** | Current governed self-change constraint. |
| P1-06 Phase-1 governed action chain | **USEFUL INPUT / NOT ADOPTED AS DESTINATION MODEL** | Thin proof vehicle; preserve its narrow scope and use it only where it provides evidence. |
| Build-and-Harvest Wave C — Interaction / Work | **ADOPTED WITH MODIFICATION** | Use its Authority integration as a destination dependency view, but choose the actual corridor only after CFA reconciliation. |
| Build-and-Harvest Wave D — Live Chrome / Accounts | **USEFUL INPUT / NOT AUTOMATICALLY ADOPTED** | Useful realization proof context; not an authority sequencing mandate. |
| Build-and-Harvest Wave E — Delegated Work / Attention / Evolution | **ADOPTED WITH MODIFICATION** | Validates M4/M5 product consequences, but authority contracts precede delivery sequencing. |
| Provider/Account/Routing reconciliation | **USEFUL INPUT / NOT AUTOMATICALLY ADOPTED** | Supplies capability/realization seam evidence; does not determine authorization. |
| Cycle 4 / Cycle 5 program labels | **DEFERRED AS CFA MANDATE** | Sequence positions remain program views until the central roadmap reconciliation. |
| Legacy VIVIM authority/security behavior | **USEFUL INPUT / HISTORICAL EVIDENCE** | Harvest only where empirical behavior or falsifiers are still valuable; never inherit as destination law. |

## First Bounded Actionable Work

### AUTHORITY-CORRIDOR-EVIDENCE-PACK-2026-09-27

**Objective:** turn the M1/M3 strategy into one bounded, implementation-independent evidence package around an existing governed consequential action.

**Advances:** M1 → M3.

**Required peer inputs:**

- CFA-05: exact Attempt/Work boundary and re-check semantics.
- CFA-06: attributable capability/effect/realization evidence.
- CFA-10: gate-time enforcement observation and refusal propagation.
- CFA-02: minimum reconstruction reference set.
- CFA-03: Intent reference requirement only where the chosen corridor originates in canonical Intent.

**Tooling:** existing repository/query and Ω falsifier evidence; small fixture/replay extension only if required.

**Write scope:** CFA-04 home only.

**Next action:** instantiate one Authority Case using the current `message.send@1` proof vehicle (or another already-governed effect if repository evidence shows it is more complete), map each corridor field to its owning CFA, identify the minimum missing evidence, and write explicit positive/negative proof criteria. Do not modify Ω law or production implementation.

**Completion condition:** one fully mapped positive corridor + one negative corridor, with evidence ownership, live re-resolution point, runtime seam, reconstruction requirement, and unresolved gaps explicit.

**Stop condition:** stop at a material cross-CFA ownership conflict, owner-policy question, Ω-law collision, or missing live-evidence capability; record the blocker instead of designing around it.

## Evidence Index

1. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/CORE-AGENT.md` — ratified semantic responsibility contract.
2. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/STATE.md` — active authority frontier and unresolved seams.
3. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/AUTHORITY-MODEL.md` — working authority semantic model.
4. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/CORE-TOOL-DESIGN.md` — proposed Authority Trace and thin proof strategy.
5. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/PEER-RELATIONSHIP-ATLAS.md` — supplier/customer and seam map.
6. `omega-baseline/omega-final/docs/decisions/D-412-principal-seam.md` — principal identity seam.
7. `omega-baseline/omega-final/docs/decisions/D-452-invocation.md` — explicit invocation frame and live re-resolution.
8. `omega-baseline/omega-final/docs/decisions/D-453-standing.md` — bounded standing.
9. `omega-baseline/omega-final/docs/decisions/D-454-delegation.md` — attenuating delegation.
10. `omega-baseline/omega-final/docs/decisions/D-455-adaptation-governance.md` — governed system change.
11. `omega-baseline/omega-final/plugins/vivim-agent/src/governance.ts` — narrow P1-06 governed-action proof vehicle.
12. `docs/destination/RECONCILIATION-MAP.md` — current destination maturity and program relationships.
13. `docs/destination/BUILD-AND-HARVEST-PLAN.md` — candidate delivery evidence, explicitly not CFA mandate.
14. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CFA-DOMAIN-ROADMAP-FORMATION-PROTOCOL-2026-09-27.md` — strategic roadmap contract.

## Planning Notes

- This is a **first-pass independent model**, not a consensus document.
- The five milestones are architectural states; they are not a backlog.
- Peer Intelligence Gates identify evidence requests. They do not themselves establish dependency.
- The roadmap intentionally preserves unresolved boundaries rather than forcing closure.
