# CFA-07 — Boundary Baseline Declaration
## 2026-09-27

> Status: CURRENT / BOUNDARY-BASELINE COMPLETE
> CFA: CFA-07 — Composition / Plugin / Forge
> agent_id: composition-plugin-forge
> Planning/identity status: RATIFIED — OWNER-ALIGNED
> Purpose: Wave 1 independent boundary baseline under the CFA-05–10 Boundary Baseline & Reconciliation protocol.
> Authority: CFA-local boundary declaration; not Ω law, not shared-boundary activation, not a cross-CFA semantic authority.

## Identity

CFA-07 is the Composition / Plugin / Forge Steward. Its responsibility is the semantic and structural membrane by which VIVIM assembles governed, replaceable capabilities/plugins into compositions, generates and proves candidates through Forge, and represents composition-side replacement continuity.

Current main verified before this declaration: 93c373c8863b92329cf7b646c20afff422a8c10c.

## Current Responsibility

CFA-07 owns the composition/plugin/Forge semantic boundary while preserving the following separations:

- plugin identity != composition identity != canonical data identity;
- candidate != admitted != active;
- composition membership != capability permission;
- Forge generation != authority;
- composition semantics != K0 runtime enforcement;
- exact installed Recipe identity != logical composition lineage.

The last distinction is an evidence-backed clarification from the M1 identity/replacement work: current Recipe/manifest/content evidence identifies the exact admitted installed representation, while stable logical composition lineage remains an explicitly bounded semantic question rather than an existing canonical wire field.

## OWNS / CONTRIBUTES / CONSULTS / OUT-OF-SCOPE

| Set | Responsibility | Boundary statement |
|---|---|---|
| OWNS | Composition identity/membership semantics | Defines composition-side identity, membership, dependency and lineage concepts without becoming canonical Data identity. |
| OWNS | Plugin assembly/dependency semantics | Defines how declared plugin contributions participate in a composition and how composition-level structural constraints are characterized. |
| OWNS | Manifest / CompositionSpec / Recipe semantic distinction | Keeps declaration, human-authored composition description, and signed/grant-bearing representation distinct. |
| OWNS | Forge candidate generation/proving semantics | Generates/proves candidates and proposals; does not confer authority or bypass admission. |
| OWNS | Composition-side replacement continuity | Describes old/new member lineage, composition survivor properties and peer handoffs. |
| CONTRIBUTES | Capability / Realization seam | Supplies composition membership/assembly context to CFA-06 without defining Capability or Realization meaning. |
| CONTRIBUTES | Work replacement impact | Supplies composition-change facts to CFA-05; does not own Work state, recovery or Outcome. |
| CONTRIBUTES | Evolution/change lifecycle | Supplies candidate composition/member change structure and lineage to CFA-09; does not own compatibility, migration, rollback or quarantine policy. |
| CONTRIBUTES | Runtime admission seam | Supplies composition structure and semantic constraints to CFA-10; does not implement K0 admission/enforcement. |
| CONTRIBUTES | Experience/surface semantics | Supplies semantic composition objects/contracts to CFA-08; the surface remains non-canonical. |
| CONSULTS | CFA-02 Data | Durable composition references, revisions, lineage and reconstruction semantics. |
| CONSULTS | CFA-03 Semantic Continuity | Intent/Plan meaning when a composition is created/edited from semantic requests. |
| CONSULTS | CFA-04 Authority | Consequential promotion/change authority and live authorization implications. |
| CONSULTS | CFA-05 Work | Active Work impact and continuity on composition replacement. |
| CONSULTS | CFA-06 Capability/Provider/Realization | Capability meaning and realization replacement semantics. |
| CONSULTS | CFA-08 Experience | User-facing inspection/editing requirements for semantic composition objects. |
| CONSULTS | CFA-09 Evolution | Generic compatibility/change/promotion/rollback semantics. |
| CONSULTS | CFA-10 Runtime | K0 admission, integrity, activation and fencing boundaries. |
| OUT-OF-SCOPE | K0 constitutional enforcement | Non-bypassable admission, integrity, isolation, Port, token/egress enforcement, activation and runtime recovery. |
| OUT-OF-SCOPE | Authority | Permission, consent, delegation, standing, scope, expiry and live authorization verdicts. |
| OUT-OF-SCOPE | Capability/Provider meaning | Capability, Provider, Account, Model, Realization, Session, Resource and Routing semantics. |
| OUT-OF-SCOPE | Work execution | Work, Step, Attempt, scheduling semantics, reconciliation, recovery and Outcome. |
| OUT-OF-SCOPE | Canonical Data | Durable record identity, persistence, revisions, lineage, reconstruction and canonical storage. |
| OUT-OF-SCOPE | Global Evolution | Cross-system compatibility, migration, rollback, quarantine, retirement and self-maintenance governance. |
| OUT-OF-SCOPE | Surface/UX | Presentation, interaction, editing UX, navigation and surface-local state. |
| OUT-OF-SCOPE | Second registries/stores | No second ontology, authority store, data store, identity registry, provenance authority, graph or privileged SDK. |

## Primary Seams

### S1 — Composition identity/member semantics ↔ Capability / Realization

**Counterpart:** CFA-06.

**Subject crossing the seam:** a composition member and its capability/realization participation.

**Current claim:** CFA-07 decides whether a capability/realization participates in the composition; CFA-06 decides what the capability/realization means and whether the realization is valid.

**Inputs required:** capability/operation reference, realization eligibility/identity, replacement evidence, selected member context.

**Outputs provided:** composition membership, assembly/dependency context, replacement lineage and composition-level candidate constraints.

**Invariants:** membership does not imply permission; routing does not authorize; provider/realization replacement does not automatically create a new Capability or Composition identity.

**Falsifier:** a valid composition requires CFA-07 to define provider-specific capability meaning, or membership becomes an implicit grant.

**Evidence:** CFA-06 Owner Alignment; CFA-06 state/roadmap; CFA-07 identity/replacement proof pack.

**Freshness:** CURRENT, except explicit UNKNOWN items below.

**Unknowns:** exact capability-to-composition representation; concrete live realization replacement proof.

### S2 — Plugin / Forge candidate generation ↔ Runtime admission

**Counterpart:** CFA-10.

**Subject crossing the seam:** a candidate composition moving toward an admitted installed representation.

**Current claim:** CFA-07 generates/structures candidates and proposals. CFA-10 performs non-bypassable admission, integrity and activation enforcement.

**Inputs required:** composition structure, member manifests, candidate provenance, semantic constraints.

**Outputs provided:** candidate composition, expected grants/contributions, lineage/proposal context and semantic constraints requiring runtime enforcement.

**Invariants:** Forge has no privileged trust path; Manifest is declaration/request; Recipe is grant-bearing; changed installed representations re-enter normal admission.

**Falsifier:** a Forge-generated artifact can activate without the normal admission boundary, or composition semantics have to be implemented inside K0 to remain safe.

**Evidence:** current Ω Manifest/Recipe contracts; D-433 composition scan; CFA-10 M1 K0 evidence matrix; Core-vs-Plugin responsibility matrix.

**Freshness:** CURRENT. B1 executable-entry confinement remains UNDERPROVEN, so exact byte-binding claims must stay bounded.

**Unknowns:** exact K1 composition-admission handoff; final B1 closure.

### S3 — Composition replacement ↔ Work continuity

**Counterpart:** CFA-05.

**Subject crossing the seam:** a member/realization replacement affecting active Work.

**Current claim:** CFA-07 supplies composition-side replacement structure and survivor information. CFA-05 decides Work pause/reconcile/resume/refuse behavior.

**Inputs required:** old/new member identities, semantic contract continuity, affected composition revision/representation, expected impact.

**Outputs provided:** replacement lineage, composition survivor classification, affected-Work signal.

**Invariants:** Work remains its own durable execution subject; composition replacement does not silently mutate Work; external effect uncertainty remains explicit.

**Falsifier:** composition replacement forces CFA-07 to own Work state/recovery, or a composition change silently creates a second Work root.

**Evidence:** CFA-05 M1 Work envelope; CFA-07 replacement proof pack/reconciliation; destination evolution evidence.

**Freshness:** CURRENT for ownership; LIVE/active replacement proof remains UNKNOWN.

**Unknowns:** active Work replacement/fencing; exact impact payload/cardinality.

### S4 — Promotion / rollback ↔ Evolution

**Counterpart:** CFA-09.

**Subject crossing the seam:** a candidate composition/member change that may become active.

**Current claim:** CFA-07 provides candidate structure and composition-side lineage. CFA-09 governs cross-system change, compatibility, migration, promotion/rollback/quarantine.

**Inputs required:** candidate state, semantic delta, prior/current composition representations, member lineage, evidence.

**Outputs provided:** candidate lineage, composition-side survivor facts, candidate promotion context.

**Invariants:** generation is not authority; compatibility is not authorization; rollback is not deletion; history remains reconstructable.

**Falsifier:** CFA-07 must implement a second global Change system or independently decide compatibility/rollback policy.

**Evidence:** CFA-09 M1 peer reconciliation; CFA-09 owner alignment; CFA-07 peer reconciliation.

**Freshness:** CURRENT.

**Unknowns:** exact generic Change reference shape at the composition seam; exact activation/rollback contract.

### S5 — Composition presentation ↔ Experience / Interaction

**Counterpart:** CFA-08.

**Subject crossing the seam:** semantic composition objects exposed for inspection/editing.

**Current claim:** CFA-07 owns the semantic object/contract; CFA-08 owns presentation, interaction and editing UX.

**Inputs required:** composition identity/revision/member/dependency/proposal state.

**Outputs provided:** surface-neutral semantic object data and allowed semantic mutation targets.

**Invariants:** presentation is not canonical composition truth; editing does not bypass governance/admission; surface-local state does not become semantic identity.

**Falsifier:** the composition editor must become a second canonical store or direct authority path.

**Evidence:** CFA-07 Owner Alignment; central roadmap synthesis; CFA-08 responsibility boundary.

**Freshness:** CURRENT.

**Unknowns:** final inspect/edit field set; proposed-vs-active presentation state semantics.

## Crosses the Boundary

CFA-07 crosses its responsibility boundary only through explicit semantic handoffs:

1. membership/assembly facts → CFA-06;
2. composition-change impact → CFA-05;
3. candidate/change lineage → CFA-09;
4. composition constraints/admission inputs → CFA-10;
5. semantic composition object → CFA-08;
6. durable reference/lineage requirements → CFA-02;
7. semantic request/Intent/Plan relationship → CFA-03;
8. authority implications → CFA-04.

A handoff transfers information, not ownership or authority.

## Must Not Cross

CFA-07 must not:
- turn composition membership into permission;
- create or own a second canonical identity/data registry;
- infer semantic equivalence from plugin IDs, filenames, selectors, Recipe hashes or display names alone;
- treat a generated proposal as authorized or active;
- bypass K0 admission/integrity or create an alternate trust root;
- silently mutate Work because a composition member changed;
- become the global evolution/change/rollback authority;
- make the user-facing surface canonical;
- interpret provider-specific capability meaning;
- change Ω law inside a domain artifact.

## Inputs Required

| Input | Source | Current status |
|---|---|---|
| CompositionSpec / Recipe contract | Ω contracts/schema | OBSERVED / CURRENT |
| Plugin Manifest declaration semantics | Ω manifest contract | OBSERVED / CURRENT |
| Exact installed composition identity responsibility | Core-vs-Plugin R-001 | OBSERVED / CURRENT |
| Composition security scan / compositionRef behavior | D-433 / compose-scan.ts | OBSERVED / CURRENT |
| Capability/realization replacement semantics | CFA-06 | OBSERVED / CURRENT; live proof open |
| Work replacement impact semantics | CFA-05 M1 | OBSERVED / CURRENT; active replacement proof open |
| Generic Change relation semantics | CFA-09 M1 reconciliation | OBSERVED / CURRENT; final evaluator open |
| Runtime admission/integrity boundary | CFA-10 M1 | OBSERVED / CURRENT; B1 underproven |
| Durable continuity references | CFA-02 corridor 1 | OBSERVED / CURRENT; physical join open |
| Intent/Plan relation | CFA-03 / Round-2 audit | OBSERVED / CURRENT |
| Surface composition semantics | CFA-08 owner boundary | OBSERVED / CURRENT; final UI contract open |

## Outputs Provided

| Output | Recipient | Form |
|---|---|---|
| Composition membership/assembly | CFA-06, CFA-10 | semantic/reference input |
| Candidate/member replacement structure | CFA-05, CFA-09 | lineage + impact input |
| Forge candidate/proposal context | CFA-04, CFA-09, CFA-10 | proposal/change/admission input |
| Composition semantic identity/revision candidate | CFA-08, CFA-02 | reference-oriented semantic object |
| Composition falsifiers/evidence | Steward + peer CFAs | evidence packet |

## Invariants

1. plugin identity != composition identity != canonical data identity.
2. candidate != admitted != active.
3. composition membership != capability permission.
4. Forge generation != authority.
5. Composition semantics != K0 enforcement.
6. Recipe/admission identity for the exact installed representation must not be conflated with logical composition lineage.
7. A valid member/realization replacement may preserve composition lineage when semantic composition meaning is preserved.
8. Changed installed representation must traverse ordinary runtime admission.
9. Work impact remains a peer-owned execution concern.
10. Change compatibility/promotion/rollback remain peer-owned evolution concerns.
11. Unknown, stale and conflicted evidence remains explicit.

## Evidence and Freshness

| Evidence class | Current finding | Freshness |
|---|---|---|
| Ω Manifest / Recipe contracts | Manifest is request; Recipe is grant-bearing; entries pin member hashes and grants | CURRENT |
| Ω composition generator/matrix | deterministic composition source plus byte-identity drift check | CURRENT |
| Ω compose.scan | scan reference uses composition name; scan result pins exact manifest hash | CURRENT |
| Ω replacement model | routed op is the current tested stability unit; contract-compatible implementation replacement has explicit taxonomy | CURRENT, semantic composition identity still broader |
| Core-vs-Plugin R-001 | exact installed composition identity is a named responsibility tied to signed Recipe | CURRENT |
| CFA-06 | Capability identity survives compatible realization replacement; provider-specific repair remains distinct from generic evolution | CURRENT |
| CFA-05 | Work is durable execution root and replacement impact remains Work-owned | CURRENT |
| CFA-09 | Change is a cross-domain relation over peer-owned subjects/states | CURRENT |
| CFA-10 | K0 admission/integrity is mechanical and domain-neutral; B1 remains underproven | CURRENT |
| CFA-02 | continuity reference core is relation-oriented; no universal semantic identity justified | CURRENT / provisional peer |

Current evidence does not justify a production CompositionId field, identity registry, or Recipe-schema amendment.

## Falsifiers

| Falsifier | Boundary under test | Current state |
|---|---|---|
| Composition membership implies permission | CFA-07 ↔ CFA-04/10 | MUST REFUSE / not an allowed design |
| Forge artifact activates without ordinary admission | CFA-07 ↔ CFA-10 | MUST REFUSE |
| Provider/realization replacement silently changes Capability meaning | CFA-07 ↔ CFA-06 | MUST REMAIN EXPLICIT |
| Composition replacement silently mutates active Work | CFA-07 ↔ CFA-05 | MUST REFUSE / EXPLICIT IMPACT |
| Composition change requires CFA-07 to own global Change/rollback | CFA-07 ↔ CFA-09 | BOUNDARY INVALID |
| Surface becomes canonical composition store | CFA-07 ↔ CFA-08 | BOUNDARY INVALID |
| Rename-only change is silently treated as logical identity replacement | identity seam | NOT YET RUN |
| Member implementation replacement cannot preserve logical lineage despite unchanged semantic contract | identity seam | NOT YET RUN |
| Contract-version change is treated as ordinary implementation replacement | identity/evolution seam | NOT YET RUN |

## UNKNOWN / CONFLICTED / DEFERRED

### UNKNOWN
- Exact logical Composition identity field/representation.
- Exact semantic Composition revision discriminator.
- Rename semantics for logical identity.
- Membership-change semantics and threshold for new lineage.
- Contract-version-change continuity rule.
- Active Work replacement behavior.
- Exact durable composition-to-Data lineage join.
- Exact K1→K0 composition admission handoff.
- Complete first-party/extension symmetry proof.
- Full Forge tiering/promotion semantics.

### CONFLICTED
None materially identified.

### DEFERRED
- Production schema/wire changes until the shared boundary reconciliation and falsifier gates are satisfied.
- Live replacement proof until an owner-machine/runtime execution path is available and the required peer seams are ready.
- User-facing composition editor semantics to CFA-08's dedicated reconciliation.
- Any stronger K0/runtime claim beyond current proven mechanisms and explicit B1 gaps.

## Handoff Proposals

| From CFA-07 | To | Handoff | Status |
|---|---|---|---|
| composition member/replacement facts | CFA-06 | member/realization continuity and capability context | READY FOR PEER RECONCILIATION |
| composition replacement impact | CFA-05 | affected Work + survivor properties | READY FOR PEER RECONCILIATION |
| candidate/change lineage | CFA-09 | composition-side subject/state lineage for Change | READY FOR PEER RECONCILIATION |
| composition candidate/admission constraints | CFA-10 | semantic input to K0 admission, never K0 implementation | READY FOR PEER RECONCILIATION |
| semantic composition object | CFA-08 | inspect/edit field requirements | READY FOR PEER RECONCILIATION |
| durable composition references | CFA-02 | persistence/reconstruction join | READY FOR PEER RECONCILIATION |
| Intent/Plan-originating composition request | CFA-03 | semantic source relationship | CONTEXTUAL |
| consequential composition change | CFA-04 | authority implication / live gate | CONTEXTUAL |

## Non-Authority Statement

This declaration does not:
- activate any shared CFA boundary;
- amend Ω law;
- authorize production implementation;
- ratify another CFA's internal semantics;
- create a second ontology, identity registry, data store, authority store, provenance authority, architecture graph or privileged Forge SDK.

It records CFA-07's current owner-aligned boundary and the explicit evidence/unknown state required for later Steward reconciliation.

## Evidence Index

- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/BOUNDARY-PROTOCOL.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/CFA-05-10-BOUNDARY-BASELINE-AND-RECONCILIATION-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-2-COMPLETION-AUDIT-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/COMPOSITION-PLUGIN-FORGE/CORE-AGENT.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/COMPOSITION-PLUGIN-FORGE/OWNER-ALIGNMENT-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/COMPOSITION-PLUGIN-FORGE/DOMAIN-ROADMAP-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/COMPOSITION-PLUGIN-FORGE/COMPOSITION-IDENTITY-SURVIVOR-PROOF-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/COMPOSITION-PLUGIN-FORGE/COMPOSITION-IDENTITY-PEER-RECONCILIATION-2026-09-27.md
- omega-baseline/omega-final/contracts/src/manifest.ts
- omega-baseline/omega-final/contracts/src/recipe.ts
- omega-baseline/omega-final/sdk/src/schema.ts
- omega-baseline/omega-final/compositions/_matrix.json
- omega-baseline/omega-final/plugins/vivim-law/src/compose-scan.ts
- omega-baseline/omega-final/docs/architecture/OMEGA_REPLACEMENT_MODEL.md
- omega-baseline/omega-final/docs/decisions/D-433-policy-coherence.md
- docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md
- CFA-02 DATA-CONTINUITY-CORRIDOR-1 evidence and completion receipt
- CFA-05 M1-WORK-ENVELOPE-CHARACTERIZATION and completion receipt
- CFA-06 OWNER-ALIGNMENT-2026-09-27.md
- CFA-09 M1-PEER-RECONCILIATION and completion receipt
- CFA-10 M1-K0-EVIDENCE-FALSIFIER-MATRIX and completion receipt

## Baseline Conclusion

Boundary baseline is COMPLETE for CFA-07 at the Wave 1 characterization level.

The boundary is owner-aligned and internally coherent. The most important unresolved seam is the distinction between exact installed composition identity and stable logical composition lineage. The current repository proves the former through the governed Recipe/admission path but has not yet proven the latter as a first-class durable semantic field.

No shared boundary is activated. Ω law remains unchanged. Production implementation is not authorized by this declaration.