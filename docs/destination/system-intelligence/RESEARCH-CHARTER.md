# System Intelligence Research Charter

> **Classification: DERIVED — PROPOSED · Pre-build research charter**

## Mission

Build an evidence-backed, atomic-resolution understanding of:

- Legacy VIVIM;
- standalone vivim-omega;
- current BCP-integrated Ω;

and connect that understanding directly to the existing VIVIM destination model and program controls.

The purpose is not to document everything equally.

The purpose is to discover the smallest set of product/system atoms and relationships required to safely choose the next build sequence.

## Questions for important atoms

1. What is it?
2. Why does the destination need it?
3. Where does it exist?
4. Which lineage produced it?
5. What does it depend on?
6. What depends on it?
7. What evidence proves its existence or behavior?
8. What is only proposed or inferred?
9. What conflicts with it?
10. What is missing?
11. Which destination requirements, journeys, slices, and keystones does it affect?
12. Which workstream owns the next decision or action?

## Research boundary

### Current BCP Ω — deep structural reconstruction

Investigate deeply:

- identity and contracts;
- runtime and plugin boundaries;
- composition;
- boot and recovery;
- vault and persistence;
- evidence/provenance;
- law/authority;
- execution;
- event/state semantics;
- platform seams;
- surfaces where they expose canonical contracts.

### Legacy VIVIM — broad then deep

Investigate broadly:

- product shell;
- Canvas/LivingCanvas;
- UnifiedEntry;
- workspaces/projects;
- conversations;
- providers/accounts/sessions;
- configuration;
- algorithms;
- fixtures/tests;
- discovery/healing machinery.

Go deep where evidence shows reusable value, hidden product knowledge, or high downstream impact.

### Standalone vivim-omega — historical reconstruction

Investigate:

- original architectural intent;
- decision history;
- additions/removals between standalone Ω and BCP;
- rationale for changed direction;
- capabilities that may have been lost or evolved.

Standalone material is historical/reference evidence, not current BCP authority.

## Research funnel

### Pass A — inventory
Broad, shallow coverage. Find candidate atoms, source locations, lineage, relationships, uncertainty, and likely product relevance.

### Pass B — normalize
Convert findings into the common atom/edge/evidence shape.

### Pass C — centrality
Calculate impact from observed relationships:

- downstream dependents;
- destination journeys;
- requirements;
- vertical slices;
- workstreams;
- proof dependencies;
- provider/external-reality reach;
- uncertainty.

### Pass D — deep dive
Only high-impact/high-uncertainty items receive deeper investigation.

### Pass E — boundaries
Explicitly investigate seams such as Provider/Account, Account/Session, Session/Browser, Capability/Realization, Capability/Authority, Intent/Capability, Work/Evidence, World/Surface, Plugin/Runtime, and Product Instance/Persistence.

### Pass F — reconciliation
Map findings to the existing destination/program documents.

### Pass G — adversarial review
Attempt to falsify the resulting model. Unknown is an acceptable result.

## Integrity rules

- Prefer exact source references.
- Preserve lineage.
- Separate observed fact from interpretation.
- Never turn UNKNOWN into an assumption.
- Do not collapse Provider, Account, Session, Model, and Realization.
- Do not treat selectors as canonical truth.
- Do not treat LLM output as authority.
- Do not equate implementation maturity with product maturity.
- Do not modify production code during archaeology.
- Existing tests/scripts may be run to establish evidence.

## Deliverable principle

A useful finding is a trace, not an essay:

source → finding → atom/edge → product link → program link → evidence/status
