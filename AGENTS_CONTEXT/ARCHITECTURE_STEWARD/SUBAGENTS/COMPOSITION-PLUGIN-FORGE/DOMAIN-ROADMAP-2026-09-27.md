# CFA-07 — Strategic Domain Roadmap
## Composition / Plugin / Forge Steward
### Strategic Roadmap Round 1 — 2026-09-27

> **Planning status:** FIRST-PASS INDEPENDENT ROADMAP
> **Identity:** RATIFIED — OWNER-ALIGNED
> **agent_id:** `composition-plugin-forge`
> **Authority:** CFA-owned strategic planning artifact; not Ω law, not production authorization, not central cross-CFA sequencing.
> **Evidence vocabulary:** OBSERVED / DERIVED / PROPOSED / UNKNOWN / CONFLICTED
> **Freshness:** CURRENT unless explicitly identified otherwise.
>
> This roadmap was formed independently from current repository evidence. Newly-produced Round-1 roadmaps from other CFAs were not used to shape this first pass.

## Strategic Objective

Make VIVIM compositions **first-class governed semantic objects** that can assemble replaceable plugins/capabilities, be inspected and generated, remain understandable and non-privileged across first-party and extension paths, and survive valid replacement/evolution without losing semantic continuity.

The target condition is:

`plugin declaration → composition candidate → governed Recipe → admitted composition → active composition → governed change/replacement`

with these distinctions preserved:

- `Manifest != CompositionSpec != Recipe`
- `candidate != admitted != active`
- `plugin identity != composition identity != canonical data identity`
- `generation != authority`
- `composition membership != capability permission`

Strategically, CFA-07 is successful when composition is no longer merely an implementation format. It becomes the stable membrane through which VIVIM can assemble useful environments, create new compositions, and replace members without creating hidden core paths.

## Responsibility Frontier

### Owns
- composition identity and membership;
- plugin contribution/dependency/assembly semantics;
- Manifest / CompositionSpec / Recipe semantic crosswalk;
- composition-level candidate constraints above K0;
- first-party/system-plugin vs extension-plugin symmetry at the governed boundary;
- Forge candidate generation/proving semantics;
- composition-side replacement continuity;
- composition-specific falsifiers and evidence.

### Does not own
- K0 non-bypassable runtime enforcement;
- live authority/policy/consent;
- capability/provider/realization semantics;
- durable Work lifecycle/execution/outcomes;
- canonical data/persistence/reconstruction;
- global evolution/rollback/self-maintenance governance;
- user-facing composition UX;
- OS/browser product subsystems;
- privileged SDK/developer paths.

## Current Evidence / Maturity

| Area | Current maturity | Evidence-backed read |
|---|---|---|
| Plugin/K1 boundary | **Strong** | Current Core-vs-Plugin distillation keeps meaning/behavior in plugins and minimum non-bypassable enforcement in K0. |
| Manifest / Recipe mechanics | **Strong / proven in Ω baseline** | Current Forge material and composition generator provide concrete declaration/grant machinery. |
| Forge candidate generation | **Strong / proven Wave 0** | `forge-author`, Builder Pack, forge-surface gate, refusal tests and self-hosting proof exist in Ω evidence. |
| Forge non-privilege | **Strong / proven direction** | Forge is modeled as an ordinary plugin; ProposalArtifact uses authority=`none`; generated product membership/signing/grants are refusal cases. |
| Composition identity | **Partial / design-required** | Exact durable semantic composition identity is still an UNKNOWN in CFA-07 state. |
| Composition continuity through replacement | **Partial / unproven** | Survivor properties and cross-peer replacement semantics are not yet empirically closed. |
| First-party/extension symmetry | **Partial / proof gap** | Principle is established; complete empirical symmetry coverage is not. |
| K1 ↔ K0 composition/admission seam | **Strong K0 evidence / incomplete CFA handoff** | K0 proof is strong, but the exact composition-facing handoff remains to be reconciled with CFA-10. |
| User-facing composition editing | **Partial / external owner** | Destination material expects first-class composition editing, but CFA-08 owns the surface. |
| Evolution interaction | **Partial / peer-dependent** | CFA-07 can shape candidates and replacement structure; CFA-09 must own system-wide change governance. |

The strategic implication is important: **do not spend the next major phase rebuilding Forge as if it were immature.** The highest-value architectural work is to close the composition identity, replacement, and peer-boundary contracts that let Forge and plugins operate safely as a durable ecosystem.

---

# Conceptual Roadmap

## M1 — Define the Semantic Composition Identity

### Conceptual outcome
A composition has a minimal, explicit semantic identity independent of plugin implementation identity, storage identity, and any one realization. Membership and state transitions are representable without ambiguity.

### Why it matters
Without a stable composition identity, replacement and evolution cannot distinguish “same composition with changed realization” from “new composition,” and generated artifacts can accidentally become the identity.

### Evidence basis
- CFA-07 owner-aligned scope explicitly marks minimum durable semantic composition identity as UNKNOWN.
- Ω has concrete composition/Recipe machinery, including generated composition specs/matrix paths.
- Core-vs-Plugin evidence separates protocol identity from domain implementation.
- Destination reconciliation treats compositions as executable objects rather than mere build files.

### Current maturity
**Design-required; implementation mechanisms exist, semantic proof does not.**

### Design choices
1. What fields are minimally semantic versus representational?
2. Which membership changes preserve composition identity?
3. Which changes necessarily create a new composition identity?
4. How are candidate, admitted, active and superseded states represented?
5. Which provenance/lineage references belong on the composition versus on members or changes?

### Success criteria
- **Design:** one minimal composition identity model with explicit semantic/representational separation and falsifiable survivor rules.
- **Implementation:** an existing or minimally-extended composition representation can carry the model without a second identity registry.
- **Integration:** a composition can be joined to plugin members and Recipes without conflating identities.
- **Proof:** replacement test fixtures can determine whether continuity is preserved.
- **Product proof:** a user-facing surface can describe “this composition” consistently without exposing storage implementation details.

### Falsifiers / failure conditions
- Composition identity changes merely because a plugin implementation path changes.
- Two independently valid active compositions can claim the same semantic identity without a declared equivalence relation.
- Membership changes require hidden canonical-data mutation.
- Candidate artifacts become the authoritative identity merely by being generated.

### Prerequisites
- Existing Ω composition/Recipe representations.
- Current Core-vs-Plugin/K0 proof.
- Durable data identity rules from CFA-02 when the semantic join becomes concrete.

### Dependencies
The initial semantic model is internally independent. Durable cross-domain identity joins are **conditional dependencies**, not blockers until a concrete composition-to-data continuity question is encountered.

### Tooling / substrate
- **ALREADY EXISTS:** composition matrix/generator and schema validation.
- **NEEDS SMALL EXTENSION:** deterministic composition identity/survivor fixture checks.
- **NOT YET NEEDED:** new runtime infrastructure.

### Peer Intelligence Gate
| Peer CFA | Intelligence / evidence needed | Why | Exact decision informed | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-02 | canonical identity/revision/lineage distinction for durable relationships | Prevent composition identity from becoming a second data identity | Which identity fields must remain data-owned vs composition-owned | Existing canonical identity/revision contract plus one traced example | **HIGH-VALUE — before design lock** |
| CFA-06 | capability/realization identity and replacement distinction | Separate “same capability, new realization” from composition identity | Which member changes can preserve composition identity | One concrete capability→realization replacement trace | **HIGH-VALUE — before design lock** |
| CFA-09 | change/evolution identity semantics | Clarify whether composition continuity belongs to the object or the change event | Identity survivor rule across governed evolution | Existing change/compatibility identity model or explicit UNKNOWN | **HIGH-VALUE — before final survivor contract** |
| CFA-10 | runtime identity/admission inputs | Ensure semantic identity maps cleanly to admitted composition without moving semantics into K0 | Which identity assertions are admission inputs vs plugin semantics | Current admission contract and K0 proof boundary | **CONTEXTUAL — integration stage** |

### Decision Gate
**Decision:** adopt the minimum composition identity and survivor rules.

**Alternatives still open:** identity anchored on Recipe, on a semantic CompositionSpec, or on a distinct composition reference with Recipe as a granted representation.

**Owner intent:** not initially required unless evidence leaves two materially different semantic models unresolved.

---

## M2 — Make the Plugin Boundary an Explicit Composition Membrane

### Conceptual outcome
Plugins declare contributions, dependencies, risk-bearing contracts and composition participation through one governed path. First-party/system plugins and extension plugins are structurally symmetric except where an already-proven constitutional rule requires a distinction.

### Why it matters
The phrase “everything is a plugin” only has architectural value if there is no hidden alternate path for first-party code.

### Evidence basis
- Current Core-vs-Plugin distillation explicitly states `system plugin != optional plugin` and keeps product meaning outside K0.
- Forge evidence includes explicit capability grammar, risk classes, declared seams and composition gates.
- Wave 0 demonstrated contract/catalog parity and forge-surface refusal tests.

### Current maturity
**Strong baseline; symmetry and composition-level constraints need deeper proof.**

### Design choices
1. What is semantic plugin contribution vs implementation packaging?
2. Which dependencies are composition membership dependencies versus capability dependencies?
3. How are namespace writers and conflicting contributions represented?
4. What composition-level constraints belong above generic K0 admission?
5. What evidence is sufficient to claim first-party/extension symmetry?

### Success criteria
- **Design:** a concise composition-facing plugin contract distinguishes declaration, contribution, dependency and admission.
- **Implementation:** manifests/compositions validate against one path without first-party exceptions.
- **Integration:** at least one first-party and one extension-shaped fixture traverse equivalent semantic boundaries.
- **Proof:** refusal tests show no undeclared contribution, hidden privileged capability, or alternate admission route.
- **Product proof:** an installed extension can be inspected as a composition member without a separate “developer” architecture.

### Falsifiers
- First-party code needs an undocumented trust/admission mechanism.
- A plugin can silently widen its contribution set after admission.
- Composition membership is used as implicit permission.
- Namespace ownership requires a hidden global registry outside the governed path.

### Tooling / substrate
- **ALREADY EXISTS:** manifest validator, composition generator, forge-surface gate, contract fixtures.
- **NEEDS SMALL EXTENSION:** first-party/extension symmetry fixture matrix.
- **NEEDS SMALL EXTENSION:** composition contribution/dependency collision checks if existing validators do not cover them.
- **NEW TOOL NOT YET JUSTIFIED:** none.

### Peer Intelligence Gate
| Peer CFA | Intelligence / evidence needed | Why | Exact decision informed | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-06 | capability/realization contribution boundary | Avoid making plugin contributions redefine capability semantics | Which contribution fields CFA-07 may constrain | Capability contract plus one valid realization mapping | **BLOCKING — before boundary lock** |
| CFA-10 | universal admission/integrity rules | Prevent duplicate admission logic | Which checks belong to generic runtime enforcement | Current K0/K1 admission matrix and refusal path | **BLOCKING — before enforcement contract** |
| CFA-04 | authority effect model | Ensure contribution/risk metadata never becomes authority | Which plugin metadata can influence authority vs only describe effects | Authority policy/effect contract | **HIGH-VALUE — before final policy shape** |
| CFA-02 | durable plugin/composition reference rules | Avoid second identity/persistence system | Which identifiers can be persisted and joined | Canonical reference/revision model | **HIGH-VALUE — before durable manifest join** |
| CFA-08 | composition inspection/editing needs | Keep semantic contract sufficient for future user surface without owning UX | Which semantic composition fields must be inspectable/editable | Surface requirements at semantic-object level | **CONTEXTUAL — before product exposure** |

### Decision Gate
**Decision:** freeze the semantic composition/plugin membrane that remains above K0.

**Falsifier:** any required rule can only be enforced safely by making CFA-07 a second K0.

---

## M3 — Prove Forge as an Ordinary Composition-Creation Path

### Conceptual outcome
Forge is demonstrably capable of creating/proving composition and plugin candidates through the same governed path available to ordinary plugins, while generated artifacts remain proposal-only until normal admission/evolution/authority transitions occur.

### Why it matters
Forge is the architectural mechanism that turns “everything is a plugin” from a static packaging rule into an evolving environment.

### Evidence basis
- Ω Forge architecture states “no SDK above Omega; only Forges inside Omega.”
- Wave 0 provides `forge.author`, Builder Pack, forge-surface gate, refusal tests, ProposalArtifact authority=`none`, and self-hosting proof.
- Forge/composition/evolution destination reconciliation defines capability-gap → proposal → verification → promotion.

### Current maturity
**Strong Wave-0 proof; product-grade and promotion semantics remain incomplete.**

### Design choices
1. What exactly is a Forge-generated candidate versus a normal composition candidate?
2. Which generated artifacts are proposal records versus executable composition artifacts?
3. What evidence is mandatory before promotion?
4. Which promotion decisions remain user/authority governed?
5. How is self-hosting maintained as Forge changes?

### Success criteria
- **Design:** Forge remains a normal plugin family with no special trust path.
- **Implementation:** Builder Pack, forge plugin and product composition all use the same admissibility grammar.
- **Integration:** Forge can generate a candidate that passes through normal evidence/proposal/admission pathways.
- **Live/proof:** self-hosting and refusal suites remain green on the current tree.
- **Product proof:** an ordinary user can eventually initiate candidate creation without an expert-only SDK path; the final UX remains CFA-08-owned.

### Falsifiers
- Forge needs privileged filesystem/host authority unavailable to equivalent plugins.
- Generated artifacts can become active without ordinary authority/admission.
- Product compositions can execute Forge-only operations.
- A Forge exception is required for self-hosting.

### Tooling / substrate
- **ALREADY EXISTS:** forge-author, Builder Pack, forge-surface gate, replay/comparison fixtures, proposal namespace.
- **NEEDS SMALL EXTENSION:** promotion evidence matrix covering candidate→evaluated→promoted states.
- **ALREADY EXISTS:** refusal-as-data pattern.
- **NOT YET NEEDED:** second SDK or builder runtime.

### Peer Intelligence Gate
| Peer CFA | Intelligence / evidence needed | Why | Exact decision informed | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-04 | promotion/authority semantics and approval boundary | Generated candidates must not self-authorize | Which transitions require authority/user approval | One documented promotion path with authority inputs | **BLOCKING — before promotion design** |
| CFA-10 | runtime admission behavior for generated compositions | Prove Forge does not bypass runtime controls | Whether candidate generation feeds the same admission route | One generated composition through ordinary admission | **BLOCKING — before proving “ordinary path”** |
| CFA-09 | evolution/change lifecycle for generated candidates | Separate generation from system-wide change governance | When a Forge candidate becomes an evolution/change object | Change lifecycle contract or explicit UNKNOWN | **HIGH-VALUE — before promotion contract** |
| CFA-06 | capability/realization validity of generated members | Prevent Forge from inventing capability semantics | What must be supplied by an existing capability/realization owner | Valid generated composition with peer-owned capability references | **HIGH-VALUE — before broader generation** |
| CFA-03 | Intent/Plan semantic input when Forge is triggered by a user request | Keep requested behavior grounded in canonical intent | How a capability gap becomes a candidate request without changing intent semantics | One traceable request→candidate mapping | **CONTEXTUAL — product integration** |
| CFA-05 | Work impact when a Forge proposal targets an active composition | Prevent generation from silently mutating active Work | When a proposal must expose active-work impact | One affected-work example or explicit deferred rule | **CONTEXTUAL — product integration** |

### Decision Gate
**Decision:** determine the durable promotion-evidence envelope for Forge candidates.

**Owner intent required:** potentially yes for automatic-vs-approval-gated promotion policy. CFA-07 may define evidence requirements but not owner policy.

---

## M4 — Establish Replacement Continuity as a First-Class Composition Property

### Conceptual outcome
A plugin/realization replacement can be characterized as a bounded change with explicit survivor properties: what remains the same composition, what changes, which peers are affected, and when a new composition identity is required.

### Why it matters
This is the unresolved bridge between “replaceable plugins” and a system that can evolve without semantic drift.

### Evidence basis
- CFA-07 state marks survivor properties and replacement continuity as UNKNOWN/DEFERRED.
- Owner alignment defines the intended corridor:
  `composition → capability/realization → Work → evolution → authority → runtime`.
- D7 reconciliation explicitly treats evolution continuity as a critical gap.
- Destination maturity treats rollback/provenance/recoverability as part of evolution quality.

### Current maturity
**Design-required with strong peer seam hypotheses; live proof absent.**

### Design choices
1. What properties must survive member replacement?
2. Which replacement classes preserve composition identity?
3. How is active Work affected?
4. When does provider/realization replacement stay within the same semantic composition?
5. How do rollback and quarantine interact with composition identity?

### Success criteria
- **Design:** replacement classes and survivor properties are enumerated and falsifiable.
- **Implementation:** at least one replacement fixture records old/new member identities and composition continuity.
- **Integration:** CFA-06, CFA-05 and CFA-09 handoffs can be represented without duplicating semantics.
- **Proof:** a replacement test can distinguish continuity-preserving replacement from meaning-changing replacement.
- **Product proof:** the user-facing environment can explain what changed without silently rewriting historical composition identity.

### Falsifiers
- Any valid replacement requires silent rewriting of canonical Work/data semantics.
- Replacement continuity can be determined only from implementation-specific selectors or file paths.
- Rollback loses the identity/lineage needed to reconstruct the prior composition.
- A composition member replacement silently bypasses authority or admission.

### Tooling / substrate
- **NEW TOOL JUSTIFIED:** a small composition-replacement falsifier/fixture harness, preferably built on existing schema/replay/evidence tooling rather than as a new general framework.
- **NEEDS SMALL EXTENSION:** lineage visualization/inspection for composition and member replacement.
- **ALREADY EXISTS:** evidence/refusal/replay foundations.

### Peer Intelligence Gate
| Peer CFA | Intelligence / evidence needed | Why | Exact decision informed | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-06 | realization replacement semantics, validity and external-effect evidence | Determine which member changes preserve capability realization meaning | Replacement equivalence classes | One concrete realization replacement with evidence | **BLOCKING — before survivor rules** |
| CFA-05 | active Work continuity, reconcile/pause/resume/refuse behavior | Composition cannot decide Work semantics | What composition-change information Work requires | One active-Work replacement case | **BLOCKING — before replacement contract** |
| CFA-09 | change identity, compatibility, rollback/quarantine semantics | Prevent composition continuity from becoming a second evolution system | Which replacement dispositions are composition facts vs lifecycle decisions | One compatibility/rollback path | **BLOCKING — before continuity contract** |
| CFA-04 | authority requirements for replacement/promotion | Replacement may alter consequences even when semantics appear stable | Which replacement classes require new authority | Authority treatment of one consequential replacement | **HIGH-VALUE — before final gate** |
| CFA-10 | admission/activation behavior on replacement | Ensure continuity does not weaken runtime safety | Which admission inputs are recomputed on replacement | One replacement admitted through normal K0 route | **HIGH-VALUE — proof stage** |
| CFA-02 | durable lineage/reconstruction semantics | Preserve canonical history independent of composition implementation | Which lineage references must survive | Traceable before/after durable linkage | **HIGH-VALUE — before persistence contract** |

### Decision Gate
**Decision:** freeze the minimum survivor set and replacement classification.

**Owner intent:** required if two semantically different continuity policies remain after peer evidence.

---

## M5 — Close the K1 Composition ↔ K0 Admission Seam

### Conceptual outcome
The composition layer declares what a candidate composition requires and structurally means; K0 enforces universal runtime conditions without importing product/plugin meaning.

### Why it matters
A vague seam creates either K0 leakage or unenforceable composition assumptions.

### Evidence basis
- K0 proof shows Recipe admission and Manifest integrity as universal mechanisms.
- Core-vs-Plugin distillation places composition semantics in K1/plugins and non-bypassable enforcement in K0.
- CFA-07 owner alignment explicitly states `composition semantics != runtime enforcement`.

### Current maturity
**K0 proof strong; exact CFA-facing handoff underdefined.**

### Design choices
1. Which composition properties must be present before admission?
2. Which properties are descriptive only?
3. Which checks are universal versus composition-specific?
4. What does fail-closed behavior mean for incomplete composition metadata?
5. How are candidate/admitted/active states reflected across the seam?

### Success criteria
- **Design:** every proposed composition constraint is classified as semantic, contract-level, or K0 enforcement.
- **Implementation:** one representative candidate reaches normal admission with no alternate path.
- **Integration:** invalid composition conditions fail at the correct owning layer.
- **Proof:** hostile/invalid composition fixtures show no bypass.
- **Product proof:** admission/refusal remains explainable without exposing K0 implementation internals.

### Falsifiers
- CFA-07 needs to verify signatures/content integrity itself.
- K0 needs to understand a product-specific composition rule to remain safe.
- A composition can activate through a non-Recipe/non-standard admission path.

### Tooling / substrate
- **ALREADY EXISTS:** K0 admission proof/gates and composition generators.
- **NEEDS SMALL EXTENSION:** cross-layer contract fixture showing semantic constraint → K0 enforcement handoff.
- **ALREADY EXISTS:** fail-closed/refusal tests.
- **NOT YET NEEDED:** new runtime subsystem.

### Peer Intelligence Gate
| Peer CFA | Intelligence / evidence needed | Why | Exact decision informed | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-10 | exact universal admission/activation invariant set | Runtime owner defines what can never be bypassed | Which candidate checks belong in K0 vs K1 | Current admission proof matrix + one negative fixture | **BLOCKING — before seam lock** |
| CFA-04 | authority boundary at activation | Admission is not authorization | What authority context must be present without moving policy into K0 | One activation authorization path | **HIGH-VALUE — before final seam** |
| CFA-09 | change/rollback interaction | Evolving a composition may change admission inputs | Which lifecycle transitions require re-admission | One replacement/change example | **HIGH-VALUE — integration** |
| CFA-06 | realization/provider constraints | Composition may reference realizations but not own their meaning | Which constraints are safe to express compositionally | One capability/realization constraint example | **CONTEXTUAL — integration** |

### Decision Gate
**Decision:** finalize the K1→K0 handoff contract.

**Escalation:** any proposed K0 expansion must go through the Core-vs-Plugin proof discipline and owner/boundary reconciliation rather than being absorbed by CFA-07.

---

## M6 — Establish Composition as a Product-Grade Semantic Object

### Conceptual outcome
Composition becomes inspectable, configurable and eventually user-creatable through ordinary VIVIM interaction, while CFA-07 supplies the semantic object and lifecycle contracts and CFA-08 owns the surface.

### Why it matters
The destination is not merely a runtime that internally has compositions. A sovereign environment must let the owner understand and shape what is assembled.

### Evidence basis
- D7 reconciliation expects ordinary-user composition editing and capability-gap→proposal flows.
- Destination reconciliation rates “Everything is a plugin” strongly architecturally but notes product expression is incomplete.
- CFA-08 owns presentation/editing while CFA-07 owns semantic composition objects.

### Current maturity
**Semantic foundations strong enough to begin product mapping; final user experience is not CFA-07-owned.**

### Design choices
1. Which composition fields are user-editable?
2. Which changes require a proposal vs direct configuration?
3. How are capabilities, members, dependencies, effects and provenance explained?
4. How does a composition expose current vs proposed state?
5. What is the minimal user-facing representation that does not become a new authority or data store?

### Success criteria
- **Design:** semantic composition object has a stable inspect/edit contract.
- **Implementation:** an existing composition can be round-tripped through semantic representation without changing meaning.
- **Integration:** CFA-08 can bind a surface without making the surface canonical.
- **Proof:** user edits preserve identity/state distinctions and are routed through normal governance/admission.
- **Product proof:** a person can understand what a composition does, what it uses, what it may affect, and whether a change is proposed or active.

### Falsifiers
- The UX needs to own canonical composition truth.
- User editing requires a privileged developer path.
- A “composition editor” becomes an alternate authority store or persistence system.
- Surface configuration silently activates changes that should be proposals.

### Tooling / substrate
- **ALREADY EXISTS:** composition generation/round-trip fixtures.
- **NEEDS SMALL EXTENSION:** semantic composition inspection/round-trip fixture suitable for surface integration.
- **NOT YET NEEDED:** a dedicated composition database/editor backend; surface implementation belongs to CFA-08.

### Peer Intelligence Gate
| Peer CFA | Intelligence / evidence needed | Why | Exact decision informed | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-08 | semantic fields required for inspect/edit workflows | Avoid an underspecified object or a UX-owned canonical model | Which composition properties must be surface-addressable | One surface-neutral inspection/edit contract | **BLOCKING — before product semantic freeze** |
| CFA-04 | approval/consent presentation needs | Changes can have consequential effects | Which states must remain proposed/approved/active | One consent/promotion interaction path | **HIGH-VALUE — before final product contract** |
| CFA-05 | active-work visibility requirements | Composition edits may affect running Work | What impact information surface should expose | One active Work impact example | **HIGH-VALUE — integration** |
| CFA-06 | provider/realization presentation semantics | Users may choose among realizations inside a composition | Which member metadata is composition-facing vs provider-owned | One capability/realization presentation map | **HIGH-VALUE — integration** |
| CFA-09 | change history/rollback presentation | Users need to understand composition evolution | What lifecycle information a composition should expose | One change history/rollback trace | **CONTEXTUAL — product proof** |
| CFA-02 | durable references for inspectable composition history | Surface views must resolve to canonical data | Which durable refs can back composition history | One reconstructable lineage example | **CONTEXTUAL — persistence integration** |

### Decision Gate
**Decision:** define the semantic surface contract for composition editing/inspection.

**Owner intent:** required only where product policy decides which changes may be automatic, approval-gated, or prohibited.

---

# Dependency Model

The roadmap distinguishes **actual prerequisites** from peer information requests.

| Dependency | Kind | Status | Requirement | Confirmation / falsifier |
|---|---|---|---|---|
| Existing Manifest / Recipe / composition machinery | semantic/runtime | CURRENT | Required foundation for M1–M5 | Current Ω contract and composition fixtures |
| K0 admission/integrity proof | authority/runtime/proof | CURRENT | Required boundary anchor for M2/M5 | K0 proof matrix |
| CFA-06 capability/realization semantics | semantic/realization | REQUIRED WHEN CONCRETE | Needed to classify member replacement | Peer contract + traced replacement |
| CFA-05 Work semantics | semantic/execution | REQUIRED WHEN CONCRETE | Needed for active-work impact | Work replacement case |
| CFA-09 evolution/compatibility semantics | lifecycle/evolution | REQUIRED FOR M4+ | Needed for replacement/rollback split | Evolution contract + change example |
| CFA-04 authority semantics | authority | REQUIRED FOR PROMOTION | Needed where a composition change has consequential effects | Authority/promotion path |
| CFA-10 admission handoff | runtime | REQUIRED FOR M5 | Needed to avoid duplicate admission | K1/K0 seam proof |
| CFA-08 semantic surface requirements | surface/UX | REQUIRED FOR M6 | Needed before product semantic freeze | Surface-neutral edit/inspect contract |
| CFA-02 durable identity/lineage | data | CONDITIONAL | Needed when composition history becomes durable canonical data | Reconstructable joined example |
| Commons communication | evidence/communication | NOT REQUIRED | No architecture decision depends on signed Commons for this roadmap | Hosted connector lacks signing key |
| Other CFA Round-1 roadmaps | planning | **NOT A DEPENDENCY** | Independence rule | Do not consume during first-pass planning |

## Dependency discipline

A peer-intelligence request becomes an actual dependency only when:
1. CFA-07 identifies the precise decision it affects;
2. the peer demonstrably owns the needed semantic subject;
3. the evidence need is specific;
4. the dependency is confirmed through later reconciliation or direct evidence.

---

# Tooling / Substrate Summary

| Tool / substrate | Where needed | Status | Strategic purpose |
|---|---|---|---|
| Composition matrix/generator + schema validation | M1–M3, M6 | **ALREADY EXISTS** | Deterministic composition representation and round-trip proof |
| Manifest validator / contribution fixtures | M2 | **ALREADY EXISTS** | Enforce one plugin declaration path |
| Forge-author + Builder Pack | M3 | **ALREADY EXISTS** | Candidate generation/proving and self-hosting |
| Forge-surface/refusal gate | M2–M3 | **ALREADY EXISTS** | Detect privileged/undeclared Forge behavior |
| Evidence/replay/fixture infrastructure | M3–M5 | **ALREADY EXISTS** | Reconstructable falsification |
| Composition identity/survivor fixture checks | M1 | **NEEDS SMALL EXTENSION** | Prove semantic identity continuity |
| First-party/extension symmetry matrix | M2 | **NEEDS SMALL EXTENSION** | Empirically prove one governed boundary |
| Promotion evidence matrix | M3 | **NEEDS SMALL EXTENSION** | Separate candidate generation from authority |
| Composition replacement falsifier harness | M4 | **NEW TOOL JUSTIFIED** | Test survivor properties without a general new framework |
| Composition lineage inspection | M4 | **NEEDS SMALL EXTENSION** | Explain replacement continuity |
| K1→K0 handoff fixture | M5 | **NEEDS SMALL EXTENSION** | Pin semantic/enforcement ownership |
| Surface-neutral inspect/edit round-trip fixture | M6 | **NEEDS SMALL EXTENSION** | Keep UX from becoming canonical composition truth |

No new runtime subsystem, parallel store, universal registry, or second SDK is justified by this roadmap.

---

# Strategic Decision Gates

### DG-1 — Semantic Composition Identity
**Owner:** CFA-07 within delegated composition semantics; escalate if competing identity models remain.
**Must decide:** minimal semantic identity + survivor rules.
**Evidence:** M1 artifacts and peer inputs.

### DG-2 — Composition/K1 Membrane
**Owner:** CFA-07, subject to K0 boundary evidence.
**Must decide:** which plugin/composition constraints are semantic/contractual versus K0-enforced.
**Evidence:** M2 + M5 boundary tests.

### DG-3 — Forge Promotion Policy
**Owner:** CFA-07 defines evidence envelope; CFA-04 owns consequential authority; human owner may need to choose automatic vs approval-gated policy.
**Must decide:** candidate/evaluated/promoted transition semantics.
**Evidence:** M3 Forge path + authority input.

### DG-4 — Replacement Continuity
**Owner:** CFA-07 for composition-side classification; CFA-09 for system-wide lifecycle disposition; CFA-05/CFA-06 retain their semantic domains.
**Must decide:** minimum survivor set and replacement classes.
**Evidence:** M4 cross-peer falsifier.

### DG-5 — K1 ↔ K0 Admission Handoff
**Owner:** CFA-10 for non-bypassable enforcement; CFA-07 for semantic constraints.
**Must decide:** exact handoff contract, not a second enforcement layer.
**Evidence:** M5 proof.

### DG-6 — Product Composition Semantics
**Owner:** CFA-07 for semantic object contract; CFA-08 for presentation/interaction; human owner for product policy choices.
**Must decide:** what can be directly edited vs proposed.
**Evidence:** M6 surface-neutral contract.

---

# Product / Strategic Consequences

1. **Everything-is-a-plugin becomes operationally meaningful.** The product can add and replace capabilities without silently creating a privileged class.
2. **Forge becomes a product capability rather than an SDK dependency.** Users eventually use the same governed machinery to extend the environment that first-party authors use.
3. **Composition becomes an explanation surface.** The system can say what it assembled, why, what it can affect, and what remains only a proposal.
4. **Replacement becomes governable.** Provider or plugin changes can preserve composition continuity where semantics survive and create explicit new identity where they do not.
5. **Product surfaces stay thin.** The semantic composition object remains below UX, avoiding a second canonical editor/data model.
6. **VIVIM can remain dynamic without becoming mysterious.** Generation, admission, authority, execution and evidence remain separately visible.

---

# Deferred / Do Not Do

- Do not build another SDK above Ω; existing Forge architecture already eliminates this need.
- Do not create a second plugin taxonomy merely for Forge.
- Do not move composition semantics into K0.
- Do not make composition membership imply capability permission.
- Do not build a second composition database or universal identity registry.
- Do not make the composition UI authoritative.
- Do not solve provider semantics inside CFA-07.
- Do not solve Work execution/recovery inside CFA-07.
- Do not absorb global rollback/evolution governance from CFA-09.
- Do not consume first-pass Round-1 outputs from peer CFAs and retrofit this roadmap for symmetry.
- Do not turn every milestone into a READY task; only the first bounded work is actionable now.
- Do not treat Cycle 4/5 sequencing or another pre-roadmap product recommendation as a mandate.

---

# Relationship to Existing Program Plans

| Existing plan / evidence | Classification | CFA-07 treatment |
|---|---|---|
| `omega-baseline/omega-final/docs/forge/OMEGA-FORGE-ARCHITECTURE.md` | **ADOPTED WITH MODIFICATION** | Adopt Forge-as-plugin, Builder Contract, composition boundary, proposal-only generation and self-hosting; retain later substrate corrections and current Ω law over era-specific numbers. |
| Ω Forge Wave 0 / D-406 evidence | **ADOPTED** | Treat as strongest existing Forge proof baseline, not as proof that product-grade evolution is solved. |
| `docs/destination/FORGE-COMPOSITION-EVOLUTION-RECONCILIATION.md` | **ADOPTED WITH MODIFICATION** | Retain capability-gap→proposal→verification→promotion vision; move global evolution/rollback authority to CFA-09 and authority decisions to CFA-04. |
| Build-and-Harvest Plan | **ADOPTED WITH MODIFICATION** | Reuse harvest discipline and existing Forge/plugin mechanisms; do not open a new SDK/tooling workstream. |
| P1-08 / Forge and provider-harvest material | **ADOPTED WITH MODIFICATION** | Use Forge evidence and external-reality integration as proof inputs; do not absorb provider reality or live provider ownership. |
| P1-05 runtime/plugin material | **USEFUL INPUT / NOT OWNED** | Consume runtime/composition evidence; CFA-10 owns K0 enforcement and CFA-07 does not replicate it. |
| Destination vertical slices / P1-09 integration view | **ADOPTED AS PROOF TARGET** | Use end-to-end composition in real journeys as integration proof after semantic milestones; not a CFA-07 backlog. |
| Prior Cycle 4 live-Chrome recommendation | **USEFUL INPUT / NOT ADOPTED** | Live Chrome can exercise composition members, but provider realization remains CFA-06; no preselecting product cycle here. |
| Historical factory/SDK sprint material | **USEFUL INPUT / NOT ADOPTED** | Harvest mechanisms and lessons only; standing identity remains broader Composition/Plugin/Forge. |
| Legacy VIVIM plugin registries/builder paths | **USEFUL INPUT / NOT ADOPTED** | Archaeological behavior evidence only; no legacy mechanism becomes destination authority by existence. |

---

# First Bounded Actionable Work

The first actionable body of work is intentionally narrow:

**Composition Identity + Replacement Survivor Proof Pack**

Scope:
1. inventory current Ω composition/Recipe identity fields and representations;
2. propose the smallest semantic identity set;
3. define 3–5 replacement classes;
4. define survivor/falsifier cases for each class;
5. trace one concrete capability/realization replacement with CFA-06 evidence already available in repository artifacts;
6. leave explicit peer requests for CFA-05/CFA-09/CFA-02 rather than inventing their answers;
7. do not change runtime code or Ω law.

This advances M1 and creates the evidence needed to make M4 tractable. No later milestone becomes a READY task yet.

---

# Evidence Index

### Primary current / destination evidence
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/COMPOSITION-PLUGIN-FORGE/CORE-AGENT.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/COMPOSITION-PLUGIN-FORGE/OWNER-ALIGNMENT-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/COMPOSITION-PLUGIN-FORGE/STATE.md`
- `docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md`
- `docs/destination/core-vs-plugin-boundary/K0-FINAL-PROOF-MATRIX.md`
- `docs/destination/CORE-VS-PLUGIN-BOUNDARY-DISTILLATION.md`
- `docs/destination/RECONCILIATION-MAP.md`
- `docs/destination/BUILD-AND-HARVEST-PLAN.md`
- `docs/destination/FORGE-COMPOSITION-EVOLUTION-RECONCILIATION.md`

### Ω Forge evidence
- `omega-baseline/omega-final/docs/forge/OMEGA-FORGE-ARCHITECTURE.md`
- `omega-baseline/omega-final/docs/forge/OMEGA-ENDSTATE-VISION.md`
- `omega-baseline/omega-final/docs/forge/wave0-evidence.md`
- `omega-baseline/omega-final/docs/decisions/D-406-wave0-landing.md`
- `omega-baseline/omega-final/contracts/src/manifest.ts`
- `omega-baseline/omega-final/contracts/src/recipe.ts`
- `omega-baseline/omega-final/packs/builder/plugin.json`
- `omega-baseline/omega-final/compositions/forge-author.json`

### Current program / evidence connections
- `docs/destination/system-intelligence/findings/SI-03/PRODUCT-LINKS.md`
- `docs/destination/system-intelligence/findings/SI-03/EVIDENCE.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CFA-DOMAIN-ROADMAP-FORMATION-PROTOCOL-2026-09-27.md`

---

# Round-1 Conclusion

The first-pass strategic shape is:

`IDENTITY → BOUNDARY → FORGE → REPLACEMENT → ADMISSION → PRODUCT`

The most important unresolved strategic issue is not whether VIVIM can generate plugins; repository evidence already demonstrates substantial Forge machinery. The unresolved issue is whether a generated/assembled environment has a **stable semantic composition identity that survives valid replacement and remains cleanly separated from capability meaning, Work continuity, authority, data lineage, evolution governance and K0 enforcement**.

That is the central design problem this roadmap should force the next evidence cycle to answer.
