# Research Charter — Canonical World / Object Core

## Mission

Determine the smallest durable semantic world model VIVIM needs before the product accumulates ad-hoc records for conversations, files, artifacts, projects, memories, work outputs and future objects.

## Questions

1. What is a canonical World?
2. What is the minimum canonical Object envelope?
3. Which things are semantic object types versus roles/projections?
4. How should Message differ from Document, File and Artifact?
5. What is Project/Workspace/Space semantically?
6. What are canonical relationships and who may create/replace them?
7. How do revisions work?
8. What does archive/delete mean when evidence/revisions must survive?
9. How do imports and external source identities work?
10. How are derived/projection objects represented?
11. How do Work and Evidence reference objects?
12. What does export/restore need to preserve?
13. Can a genuinely new object type be introduced without core redesign?
14. Where does content live: vault, filesystem, content-addressed storage, or references?
15. How do aliases and identity collisions work?
16. How are conflicts represented?
17. What is the minimal query/address model?
18. What is required for deterministic context assembly later?
19. Which Legacy models should be harvested?
20. Which Ω storage primitives should be reused unchanged?

## Required falsifier

Introduce a new durable object type not anticipated by the current model and drive it through:

CREATE → IDENTIFY → RELATE → READ → MODIFY → VERSION → DERIVE → PROJECT → REFERENCE → EXPORT → RESTORE → ARCHIVE/DELETE

A generic model passes only if the new type does not require a second storage truth, bespoke evidence system, or product-wide architectural rewrite.

## Constraints

Do not create another ontology or provenance system. Reuse existing Ω evidence/provenance semantics.

Do not treat UI hierarchy, canvas coordinates, ORM table names or provider payloads as canonical identity.

Separate canonical data from projections and caches.

## Required outputs

Produce:
- RESEARCH-SYNTHESIS.md
- CANONICAL-MODEL.md
- OBJECT-TAXONOMY.md
- RELATIONSHIP-MODEL.md
- REVISION-LIFECYCLE.md
- CONTENT-STORAGE.md
- EXPORT-RESTORE.md
- WORLD-QUERY-ADDRESSING.md
- WORK-EVIDENCE-INTEGRATION.md
- FALSIFIER-REPORT.md
- IMPLEMENTATION-BLUEPRINT.md
- OPEN-FRONTIER.md
- RED-TEAM.md

Machine indexes:
- indexes/OBJECTS.json
- indexes/RELATIONSHIPS.json
- indexes/LIFECYCLES.json
- indexes/EVIDENCE.json
