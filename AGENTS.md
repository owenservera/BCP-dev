# AGENTS.md — BCP-dev repository working agreements

## Repository purpose

BCP-dev is the migration, reconciliation, proof, and destination-development repository for VIVIM.

VIVIM legacy source mine → BCP control/migration substrate → Ω destination → final VIVIM product.

The legacy tree is evidence and is read-only. Ω ratified law is technical authority. Destination docs define the working end-state. Agent-system docs define program governance. Archive material is genealogy only.

## Current boundary

K0 Ω Core = minimum non-bypassable, domain-neutral runtime mechanism.
K1 = shared boundary protocol/reference vocabulary.
System plugins = first-party VIVIM capabilities and semantics.
Extension plugins = user/third-party capabilities through the same governed path.
Tooling = authoring, analysis, diagnostics and CI outside runtime authority.

Fundamental to VIVIM does not imply fundamental to K0.

The current destination responsibility baseline is the expanded 125-row inventory in docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md.

Before substantive implementation, classify the responsibility and record its invariant, semantic owner, canonical data owner, authority boundary, evidence, dependencies, replacement seam, and falsifier.

## Authority hierarchy

1. Ω ratified law — omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md, docs/BUILD-DECISIONS.md and D-records.
2. BCP enforced state/vocabulary — bcp-speed/bcp/state, log, taxonomy and reconciliation tooling.
3. Current repository code/tests/evidence.
4. docs/destination working product/architecture model.
5. docs/agent-system program governance.
6. AGENTS_CONTEXT durable cold-start context.
7. docs/archive historical genealogy.

A document's folder does not make it authoritative.

## Top-level boundaries

| Area | Role | Rule |
|---|---|---|
| vivim-original-baseline/ | behavioral/implementation mine | read, assay, cite; never modify |
| bcp-speed/bcp/state + log | BCP control-plane truth | use BCP tooling; do not hand-edit state |
| bcp-speed/bcp/migration/ | migration records | follow migration model and evidence rules |
| omega-baseline/omega-final/ | destination runtime | change only through Ω law; preserve B5 |
| docs/destination/ | current destination/product model | update when destination understanding changes |
| docs/agent-system/ | governance/program authority | preserve workstream semantics |
| AGENTS_CONTEXT/ | durable cold-start context | refresh when durable state changes |
| docs/archive/ | retained history | never use as current authority |

## Current Core-vs-Plugin state

Pass 3 adversarial closure is complete as research, but current K0 implementation is not fully closed.

Open boundary obligations:
- B1 executable-entry confinement;
- generic zero-plugin/bootstrap-role proof;
- minimum State primitive;
- minimum Graph/Grant provenance primitive;
- generation pin/lifetime primitive;
- first-party/third-party privilege symmetry;
- active Work continuation across implementation replacement.

No production code was added by the Core-vs-Plugin research package.

## Current cold start

Read /AGENTS.md → /BUILD_CONTEXT.md → /docs/CURRENT-CONTEXT.md → /docs/agent-system/CURRENT.md → /AGENTS_CONTEXT/README.md → the relevant mission STATE.md → current Ω/destination authority.

## Historical project material

The former root construction/project-management layer is archived under docs/archive/project-history/.

Do not execute archived prompts or trackers.

## Agent operating rule

For substantive changes:
1. identify governing authority;
2. preserve evidence and lineage;
3. update durable context;
4. keep research/documentation and production-code changes explicit;
5. commit coherent changes with a clear status.
