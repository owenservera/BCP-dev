# AGENTS.md — BCP-dev repository working agreements

## Repository purpose

BCP-dev is the migration, reconciliation, proof, and destination-development repository for VIVIM.

VIVIM legacy source mine → BCP control/migration substrate → Ω destination → final VIVIM product.

The legacy tree is evidence and is read-only. Ω ratified law is technical authority. Destination docs define the working end-state. AGENTS_CONTEXT defines durable agent roles/context. Archive material is genealogy only.

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
5. AGENTS_CONTEXT durable role context.
6. docs/archive historical genealogy.

A document's folder does not make it authoritative.

## Current cold start

Read /AGENTS.md → /BUILD_CONTEXT.md → /docs/CURRENT-CONTEXT.md → /AGENTS_CONTEXT/README.md → the relevant peer-agent context → current Ω/destination authority.

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
