# CFA-01 — World & Context Steward — Strategic Domain Roadmap

> Date: 2026-09-27
> Classification: first-pass independent strategic roadmap; not Ω law and not implementation authorization.
> Evidence posture: existing repository evidence only for this first pass. Newly-produced Round-1 peer roadmaps are intentionally not used.

## Strategic Objective

Make VIVIM's World a coherent semantic model of what the system can mean about people, things, relationships, states, events, places, resources and other domain subjects, with Context providing bounded, explainable views of that World for reasoning and action.

Success means a user or agent can move from observation/expression to a World referent, from a referent to a justified contextual projection, and from that projection back to durable evidence without silently collapsing:
- World meaning into stored records;
- semantic identity into record identity;
- observation into truth;
- projection into existence;
- addressability into authorization;
- continuity into persistence;
- confidence into proof;
- unknown into failure.

The destination is not a universal ontology. It is a reconstructable semantic world with explicit correspondence, projection, context and evidence boundaries.

## Responsibility Frontier

**Own:** World subject/relationship meaning; semantic identity and correspondence; source identity and alias distinctions; World presence/epistemic state; projection/view meaning; World-side addressability/reference semantics; semantic temporal continuity; Context as bounded World projection; World evidence/basis relationships.

**Do not own:** durable record identity/revision/lineage (CFA-02); semantic continuity through grounding/Intent/Plan (CFA-03); authorization/permission (CFA-04); Work/execution (CFA-05); provider realization (CFA-06); composition/plugin admission (CFA-07); surfaces (CFA-08); evolution implementation (CFA-09); runtime constitution (CFA-10).

## Current Evidence / Maturity

| Area | Status |
|---|---|
| World as distinct semantic responsibility | OBSERVED / CURRENT |
| World/Data seam | DERIVED / CURRENT; not activated |
| World/Semantic Continuity seam | PROPOSED / CURRENT; peer acceptance pending |
| World/Authority seam | PROPOSED / CURRENT; accessibility ownership unresolved |
| World projection/context substrate | OBSERVED / CURRENT |
| Universal identity model | UNKNOWN / CURRENT; deliberately absent |
| Universal Event/State primitive | UNKNOWN / CURRENT; unsupported |
| Canonical-vs-derived field inventory | UNKNOWN / CURRENT |
| Full World reconstruction contract | UNKNOWN / CURRENT |

## Conceptual Roadmap

### M1 — Semantic World Kernel

**Outcome:** bounded semantic vocabulary for subjects, relationships, identity/correspondence, presence and evidence without becoming a universal identity/data schema.

**Strategic decisions:** minimum semantic primitives; orthogonal distinctions; domain vs projection concepts; explicit non-primitives.

**Success criteria:** meaning can be reconstructed without storage schema; identity/correspondence/source/alias/representation stay distinct; presence/observation/projection/authorization stay distinct; claims can retain evidence/basis.

**Falsifiers:** required journeys need storage semantics to express meaning; coherence requires universal identity/data model; destination evidence reveals an indispensable missing primitive.

**Dependencies:** existing World/destination/Ω evidence.

**Tooling:** repository graph/search — ALREADY EXISTS; semantic fixture corpus and invariant checks — NEEDS SMALL EXTENSION.

**Proof layers:** design = vocabulary/invariants; implementation = machine-readable contracts; integration = peers consume semantics without storage ownership; live = observations reconstruct claims; product = journeys remain understandable.

### M2 — Reference, Correspondence & Addressability

**Outcome:** references can resolve, remain ambiguous, become stale, remain unresolvable or conflicted without coercion.

**Strategic decisions:** minimum World reference result; resolution states; correspondence vs proof; alias/source identity; stale/conflict behavior.

**Success criteria:** RESOLVED, AMBIGUOUS, STALE, UNRESOLVABLE and CONFLICTED survive as distinct states; candidates can remain multiple; evidence/basis stays attached; addressability stays separate from authorization.

**Falsifiers:** ambiguity cannot survive; World must assert authority/execution; correspondence cannot be reconstructed from evidence.

**Dependencies:** M1; later CFA-03/CFA-04 reconciliation.

**Tooling:** replay fixtures and graph/query inspection — ALREADY EXISTS; correspondence tests — NEEDS SMALL EXTENSION.

### M3 — Context & World Projection

**Outcome:** Context is a bounded, explainable projection of World/evidence, not a second World or hidden truth store.

**Strategic decisions:** projection/view semantics; viewpoint/principal scoping; visibility vs existence; relevance/boundedness; accessibility vs authorization; freshness/invalidation.

**Success criteria:** every projection has scope/basis; omission does not imply nonexistence; stale projections remain identifiable; reconstruction does not require an opaque context truth store.

**Falsifiers:** context duplicates canonical World meaning; principal views require embedded authority decisions; projection freshness cannot be distinguished.

**Dependencies:** M1/M2; CFA-04 and CFA-03 seam evidence.

**Tooling:** existing context substrate — ALREADY EXISTS; deterministic projection/reconstruction harness — NEEDS SMALL EXTENSION.

### M4 — Temporal World, Continuity & Reconciliation

**Outcome:** World expresses semantic change over time without conflating semantic continuity with record revision or migration.

**Strategic decisions:** continuity across revisions; merge/split meaning; Event/State semantics; external change vs observation; stale/superseded claims; canonical-vs-derived semantics.

**Success criteria:** changing representations do not silently change meaning; merge/split preserves rationale and lineage references; Event/State remain typed concepts rather than universal primitives; conflicts remain reconstructable.

**Falsifiers:** temporal semantics require CFA-01 to own durable lineage; merge/split cannot be explained independently of storage identity; evidence requires a universal Event/State model.

**Dependencies:** M1–M3; CFA-02 and CFA-09 evidence.

**Tooling:** replay/evidence infrastructure — ALREADY EXISTS / SMALL EXTENSION; temporal reconciliation harness — NEW TOOL JUSTIFIED only after contract selection.

### M5 — Queryable, Reconstructable World

**Outcome:** World meaning and bounded Context can be queried, explained and reconstructed from evidence and durable representations without an opaque global semantic database.

**Strategic decisions:** query/addressability contract; evidence-aware retrieval; reconstruction boundary; explanation/provenance; materialization/cache semantics; scale.

**Success criteria:** representative journey can resolve or preserve ambiguity, form context, act through owning authority, and reconstruct the claim; absence/unknown/stale/conflict remain distinct; no hidden provider state is required.

**Falsifiers:** query requires monolithic ontology service; reconstruction loses uncertainty/conflict; journeys couple to storage/provider representation.

**Dependencies:** M1–M4 plus reconciled peer contracts.

**Tooling:** graph/query tooling — ALREADY EXISTS; replay/evidence harness — ALREADY EXISTS / SMALL EXTENSION; scale benchmark — NOT YET NEEDED.

## Dependency Model

| Source | Subject | Kind | Required stage | Status | Evidence needed |
|---|---|---|---|---|---|
| CFA-02 | canonical identity/revision | data/semantic | M1–M4 | PROPOSED | accepted World/Data seam |
| CFA-03 | grounding/continuity | semantic/evidence | M2–M3 | PROPOSED | accepted World reference seam |
| CFA-04 | authority semantics | authority | M2–M3 | PROPOSED | accepted address/access/authorization distinction |
| CFA-05 | Work consumption | execution | M3–M5 | CONTEXTUAL | representative Work inputs |
| CFA-06 | provider/source observation | realization/evidence | M2/M5 | CONTEXTUAL | live source identity evidence |
| CFA-07 | composition needs | composition | M5 | CONTEXTUAL | plugin/composition scenarios |
| CFA-08 | explanation constraints | surface/product | M3/M5 | HIGH-VALUE | representative user journeys |
| CFA-09 | change/replacement semantics | lifecycle | M4–M5 | REQUIRED eventually | temporal/evolution evidence |
| CFA-10 | runtime invariants | runtime | M1/M5 | REQUIRED eventually | constitutional constraints |

A peer request becomes a real dependency only after the consuming decision, peer ownership and evidence are reconciled.

## Tooling / Substrate

- Repository search/graph: ALREADY EXISTS.
- World-object destination artifacts: ALREADY EXISTS.
- Ω evidence/provenance mechanisms: ALREADY EXISTS.
- Context substrate: ALREADY EXISTS.
- Replay fixtures: ALREADY EXISTS.
- Deterministic semantic-contract tests: NEEDS SMALL EXTENSION.
- Temporal reconciliation harness: NEW TOOL JUSTIFIED only after M4 design gate.
- Live provider lab: ALREADY EXISTS / peer-owned.
- Scale benchmark: NOT YET NEEDED.

## Peer Intelligence Gates

### M1
| Peer | Needed intelligence | Decision | Minimum evidence | Timing |
|---|---|---|---|---|
| CFA-02 | durable identity/revision concepts that must be referenceable | semantic-vs-record boundary | concrete durable examples | HIGH-VALUE |
| CFA-03 | meaning that must survive grounding/Intent/Plan | minimum handoff | continuity scenarios | HIGH-VALUE |
| CFA-04 | World states independent of authority | state orthogonality | permission/refusal cases | HIGH-VALUE |
| CFA-05 | World concepts actually consumed by Work | kernel scope | Work inputs | CONTEXTUAL |
| CFA-06 | observable source/provider identity | reference realism | provider evidence | CONTEXTUAL |
| CFA-07 | World meaning needed for composition | plugin boundary | composition scenarios | CONTEXTUAL |
| CFA-08 | distinctions needing user explanation | product scope | surface journeys | CONTEXTUAL |
| CFA-09 | temporal distinctions needed semantically | future-proof scope | change cases | HIGH-VALUE |
| CFA-10 | constitutional semantic/evidence invariants | kernel invariants | runtime-law evidence | HIGH-VALUE |

### M2
| Peer | Needed intelligence | Decision | Minimum evidence | Timing |
|---|---|---|---|---|
| CFA-02 | canonical/source/alias mappings | reference boundary | mapping/revision examples | HIGH-VALUE |
| CFA-03 | accepted grounding + ambiguity semantics | WorldReferenceResult | all five resolution cases | BLOCKING |
| CFA-04 | addressable/access/authorized distinction | authority-safe semantics | scoped access/refusal cases | HIGH-VALUE |
| CFA-06 | real provider/source identity observability | realizable correspondence | live provider evidence | HIGH-VALUE |
| CFA-09 | continuity across changed references | stale/superseded semantics | migration cases | HIGH-VALUE |

### M3
| Peer | Needed intelligence | Decision | Minimum evidence | Timing |
|---|---|---|---|---|
| CFA-03 | continuity requirements for Context | context continuity | multi-turn cases | HIGH-VALUE |
| CFA-04 | principal/view/authority boundary | projection vs authority | scoped access cases | BLOCKING |
| CFA-05 | context required for Work | useful context boundary | missing/unknown input cases | HIGH-VALUE |
| CFA-08 | explanation/surface constraints | projection explanation | user journeys | HIGH-VALUE |
| CFA-10 | runtime constraints on Context | materialization shape | runtime cases | CONTEXTUAL |

### M4
| Peer | Needed intelligence | Decision | Minimum evidence | Timing |
|---|---|---|---|---|
| CFA-02 | merge/split/revision/lineage guarantees | continuity seam | reconstructable histories | BLOCKING |
| CFA-03 | continuity through reinterpretation | semantic identity over time | re-grounding cases | HIGH-VALUE |
| CFA-04 | authority changes over time | temporal separation | revocation/delegation cases | CONTEXTUAL |
| CFA-09 | migration/replacement compatibility | evolution model | change/replacement cases | BLOCKING |
| CFA-10 | historical-state runtime constraints | reconstruction | replay requirements | HIGH-VALUE |

### M5
| Peer | Needed intelligence | Decision | Minimum evidence | Timing |
|---|---|---|---|---|
| CFA-02 | durable reconstruction references | reconstruction boundary | end-to-end reconstruction | BLOCKING |
| CFA-03 | semantic query/grounding handoff | query result semantics | ambiguity/stale/conflict cases | BLOCKING |
| CFA-04 | query/action authority separation | action boundary | authorization/refusal cases | HIGH-VALUE |
| CFA-05 | Work consumption contract | execution usefulness | representative journeys | HIGH-VALUE |
| CFA-06 | live source evidence | external reconstruction | authenticated source cases | HIGH-VALUE |
| CFA-08 | explanation requirements | product proof | user-visible reconstruction | HIGH-VALUE |
| CFA-09 | long-lived compatibility | reconstruction stability | migration cases | HIGH-VALUE |
| CFA-10 | runtime constraints | implementation boundary | runtime proof cases | HIGH-VALUE |

Peer requests are requests, not dependencies, until reconciled.

## Strategic Decision Gates

1. **DG-01:** minimum World semantic kernel — CFA-01, subject to Ω/owner constraints.
2. **DG-02:** World reference/result seam — CFA-01 + CFA-03 reconciliation.
3. **DG-03:** projection/accessibility boundary — CFA-01 + CFA-04 reconciliation.
4. **DG-04:** temporal continuity/merge-split — CFA-01 + CFA-02 + CFA-09.
5. **DG-05:** query/reconstruction boundary — CFA-01 after cross-CFA reconciliation.
6. **DG-06:** any universal primitive or Ω-law change — owner/Ω authority.

Each gate must distinguish design validity, implementation validity, integration, live proof and product proof.

## Product / Strategic Consequences

If successful, provider information becomes evidence about a World rather than a separate implicit world per provider. VIVIM gains explainable grounding, provider-agnostic references, inspectable Context, continuity without making storage the ontology, and a foundation for future self-maintenance.

It constrains VIVIM from treating provider selectors/source IDs as canonical World identity, hiding ambiguity, using authorization as existence, or creating subsystem-specific semantic stores.

## Deferred / Do Not Do

- No universal ontology for every domain.
- No second global identity/data store.
- No universal Event/State primitive without evidence.
- No provider selector/source ID as canonical World identity.
- No second World database hidden inside Context.
- No merge/split implementation before Data + Evolution reconciliation.
- No accessibility/authorization collapse.
- No conversion of every P1 plan into CFA-01 tasks.
- No M2–M5 implementation before their decision gates.
- No consumption of newly-produced peer Round-1 roadmaps before this first-pass roadmap is persisted.

## Relationship to Existing Program Plans

| Existing material | Classification |
|---|---|
| World-object destination taxonomy | ADOPTED WITH MODIFICATION |
| World projection destination work | ADOPTED WITH MODIFICATION |
| Ω evidence/provenance model | ADOPTED |
| Context substrate / vivim.run material | USEFUL INPUT / NOT ADOPTED as authority |
| Prior P1 ontology/world work | USEFUL INPUT / NOT ADOPTED wholesale |
| Build-and-Harvest | USEFUL INPUT / NOT ADOPTED wholesale |
| Provider Lab | CONTEXTUAL INPUT / OUTSIDE CFA-01 execution ownership |
| Vertical slices | USEFUL INPUT / NOT ADOPTED wholesale |
| Round-2 boundary addendum | CURRENT CFA reconciliation input, not shared ACTIVE authority |

## Evidence Index

- BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md
- BOUNDARY-ROUND-2-TASK-2026-09-27.md
- BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md
- docs/destination/world-object-core/OBJECT-TAXONOMY.md
- docs/destination/world-object-core/WORLD-PROJECTION.md
- omega-baseline/omega-final/docs/decisions/D-443-context-substrate.md
- omega-baseline/omega-final/plugins/vivim-run/src/context.ts

## First-Pass Conclusion

The strategic shape is:

SEMANTIC KERNEL → CORRESPONDENCE → PROJECTION/CONTEXT → TEMPORAL RECONCILIATION → RECONSTRUCTABLE QUERY.

Only the first bounded evidence/contract task should become READY now. This roadmap is a strategic planning model, not implementation authorization.
