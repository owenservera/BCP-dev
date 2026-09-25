# Architecture Steward — Initial Repository Baseline

> Classification: DERIVED — STEWARD OBSERVATION
> Observation date: 2026-09-25
> Main observed at: 90d7b9d0f8211da88d8f4f14ed9dfcf79b07fe1a
> Purpose: durable cold-start snapshot for the first Steward cycle

## 1. Authority map

| Layer | Current source | Steward treatment |
|---|---|---|
| Ω technical law | `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md` + D-records | authoritative; never rewritten as a derived view |
| BCP control state | `bcp-speed/bcp/state/` + prescribed tooling | controlled; do not hand-edit |
| Destination model | `docs/destination/` | current working architecture/product model |
| Program governance | `docs/agent-system/` | current program/workstream authority |
| Cold-start context | `AGENTS_CONTEXT/` | durable operating context |
| Historical material | `docs/archive/` | genealogy only |

## 2. Existing architecture views

The repository already has a coherent set of partial views. The Steward should connect them before creating replacements.

- broad destination structure: `docs/destination/DESTINATION-MASTER-MAP.md`
- reconciliation: `docs/destination/RECONCILIATION-MAP.md`
- responsibility universe: `docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md`
- Core boundary package: `docs/destination/core-vs-plugin-boundary/`
- keystone/dependency view: `docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md`
- System Intelligence dependency view: `docs/destination/system-intelligence/synthesis/DEPENDENCY-MAP.md`
- requirement/evidence traceability: `docs/destination/REQUIREMENT-EVIDENCE-TRACEABILITY.md`
- vertical slices: `docs/destination/VERTICAL-SLICE-REGISTRY.md`
- evolution/impact: `docs/destination/EVOLUTION-RECONCILIATION.md`
- architecture navigation home: `docs/destination/architecture/README.md`

Current observation: `docs/destination/architecture/README.md` already names the intended future Steward registry surfaces. The first cycle should therefore consolidate and connect existing views rather than establish a competing architecture tree.

## 3. Current destination responsibility baseline

The canonical adequacy baseline is the expanded 125-row inventory at:

`docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md`

It explicitly separates runtime mechanisms, contracts, system/domain semantics, external realizations, tooling and cross-cutting responsibilities.

The Steward will treat this as the starting responsibility universe, not as a reason to immediately redraw the model.

## 4. System Intelligence baseline

Mainline System Intelligence currently records:

- 44 atoms;
- 65 edges;
- 99 unique evidence records;
- explicit uncertainty and proof-limit information;
- deep-dive subjects spanning Provider/Account/Session/Browser, Product Instance/Persistence, Intent/Capability/Authority, Vault/Work/Evidence, World/Surface, Durable Work/Attention, and AI conversation translation.

Status remains research/derived. No production implementation is authorized merely by its inclusion in main.

The Steward's job is to map these research atoms/edges into existing destination responsibilities, boundaries, evidence, frontiers and journeys while preserving research lineage.

## 5. Current Core boundary state

The current narrow K0 nucleus is documented as proven in several areas, while the following remain explicitly open/underproven:

- B1 executable-entry confinement;
- generic zero-plugin/bootstrap semantics;
- minimum State/Graph/Grant/Generation mechanisms;
- first-party/third-party symmetry;
- active Work continuation across implementation replacement.

The Steward must not accidentally convert the 125-row adequacy inventory into a K0 mandate.

## 6. Program state relevant to Steward

The program currently has ten P1 workstreams. The board identifies P1-02 as the repository-truth/drift function, while the Architecture Steward is the broader architectural representation/documentation role.

This is complementary rather than duplicative:

- P1-02 establishes repository truth/cleanup/drift evidence.
- The Steward consumes that evidence and maintains the architectural representation, mappings, dependencies, views and lineage.

No new project-management board should be created by the Steward.

## 7. Branch topology snapshot

At observation time the repository has many retained topic branches and no open pull requests.

Before this bootstrap branch was created there were 40 branches:
- 16 `coord/*`;
- 15 `research/*`;
- 4 `product-vision/*`;
- 2 `build/*`;
- 1 `design/*`;
- 1 `pack/*`;
- 1 `main`.

The new Steward bootstrap branch brings the observed branch count to 41.

This is a housekeeping signal, not a deletion order. The first branch task is classification by lineage, recency, evidence and promotion state—not mass cleanup.

## 8. First known reconciliation pressure

The repository contains several layers that can legitimately describe overlapping concepts from different perspectives. The immediate risk is not document count; it is semantic divergence between:

- the 125-row responsibility universe;
- System Intelligence atoms/edges;
- the keystone dependency projection;
- requirement/evidence traceability;
- vertical-slice dependencies;
- Core-vs-Plugin boundary research;
- program/workstream state;
- existing destination reconciliation maps.

The first Steward cycle should therefore establish cross-reference integrity before expanding the graph.

## 9. Initial frontier

The Steward's first unresolved surfaces are:

1. machine-readable registry location and schema;
2. exact mapping from 125 responsibilities to canonical node classes;
3. responsibility ↔ System Intelligence mapping;
4. direct versus transitive dependency semantics;
5. evidence/authority links for consequential claims;
6. stale-view detection and repair triggers;
7. branch-local research promotion/archive rules.

These are Steward work items, not product implementation tasks.

## 10. Baseline conclusion

The repository already contains substantial architectural memory. The missing layer is systematic reconciliation.

The correct first move is:

OBSERVE → REGISTER EXISTING VIEWS → SEED RESPONSIBILITIES → MAP SYSTEM INTELLIGENCE → RECONCILE → GRAPH → DRIFT → REPAIR

not:

REWRITE → RECLASSIFY EVERYTHING → GENERATE A NEW GIANT DOCUMENT.
