# Architecture Steward — Core Function Area Register

> Status: APPROVED INITIAL SEED — EXPECTED TO EVOLVE — 2026-09-25
> Classification: DERIVED / OWNER-APPROVED DESIGN DIRECTION
> This register describes enduring architectural responsibility areas. It is not Ω law and does not grant semantic authority to any subagent.

## Purpose

The Architecture Steward is progressively establishing a small number of enduring **Core Function Areas** for the VIVIM destination.

A Core Function Area answers:

> **What architectural responsibility must remain continuously coherent, have a durable owner, and maintain explicit boundaries with neighboring responsibilities?**

A Core Function Area is different from an investigation method.

- **Core Function Area** = enduring responsibility / architectural owner.
- **Investigation instrument** = reusable method for discovering, verifying, tracing, falsifying, or reconciling evidence.
- **Campaign / workstream** = bounded instance of work against a particular milestone.

Do not create a permanent agent merely because a useful investigation technique exists.

## Approved initial constellation — provisional seed

| ID | Core Function Area | Primary question | Foundation status |
|---|---|---|---|
| CFA-01 | World / Ontology / Context | What exists in VIVIM's world, what does it mean, how is it related, and how does relevant world state become context? | BOOTSTRAP-READY |
| CFA-02 | Data / Identity / Persistence | How are canonical meanings durably represented, identified, versioned, retained, reconstructed, exported, and evolved? | BOOTSTRAP-READY |
| CFA-03 | Self-Knowledge / Language / Command | How does VIVIM maintain semantic continuity from self-knowledge and grounding through command interpretation, canonical Intent/Plan meaning, evidence, and representation? | RATIFIED — FOUNDATION-SEEDED |
| CFA-04 | Authority / Governance | What may happen, who may authorize it, under what scope, consent, delegation, risk, and revocation rules? | BOOTSTRAP-READY |
| CFA-05 | Agency / Work / Execution | How does an intent become durable work that can execute, recover, produce outcomes, and leave evidence? | BOOTSTRAP-READY |
| CFA-06 | Capability / Provider / Realization | What can VIVIM do, and through which valid interchangeable realizations can those capabilities act on the external world? | BOOTSTRAP-READY |
| CFA-07 | Composition / Plugin / Forge | How does VIVIM assemble, extend, create, replace, and evolve capabilities without recreating a hard-coded monolith? | BOOTSTRAP-READY |
| CFA-08 | Experience / Interaction / Surfaces | How does a person perceive, navigate, manipulate, configure, and act through VIVIM's world and surfaces? | BOOTSTRAP-READY |
| CFA-09 | Evolution / Compatibility / Self-Maintenance | How can VIVIM change, migrate, repair, replace, and maintain itself without losing meaning, authority, evidence, or continuity? | BOOTSTRAP-READY — PREEXISTING PEER RESPONSIBILITY |
| CFA-10 | Runtime Constitution / Core Substrate | What irreducible guarantees must every VIVIM composition and execution obey? | BOOTSTRAP-READY — PREEXISTING PEER RESPONSIBILITY |

## Cross-cutting concern intentionally not instantiated as a separate Core Agent yet

### Epistemic Integrity

Evidence, provenance, verification, freshness, uncertainty, contradiction, and confidence/proof distinctions cross every function area:

`WORLD ↔ DATA ↔ SELF-KNOWLEDGE ↔ AUTHORITY ↔ WORK ↔ PROVIDER ↔ COMPOSITION ↔ EXPERIENCE ↔ EVOLUTION ↔ RUNTIME`

For now, Epistemic Integrity is a **cross-cutting architectural concern**, not a separate permanent agent.

The Architecture Steward should revisit that decision only when recurring evidence shows that the cross-cutting responsibility has become too semantically complex to remain distributed through explicit interfaces.

## Core-agent birth protocol

Every Core Function Area is born through:

`FULL CONTEXT → SELF-DESIGN → OWNER DIALOGUE → ALIGNMENT → CORE AGENT IDENTITY → EXECUTION`

The agent must not infer its final role from its folder name. The register entry itself is also provisional and must not be treated as an anchor.

A preexisting peer responsibility is not the same thing as a ratified Core Agent identity. Legacy/peer architecture may supply evidence for the bootstrap, but the CFA still crosses the self-design and owner-alignment gates.

Its first session is a **bootstrap self-design session**.

The first session must explicitly:

1. inspect how the Architecture Steward itself is organized;
2. inspect the other Core Function Area foundations already established;
3. inspect the relevant peer persistent role, if one exists;
4. read the relevant architectural documentation corpus before proposing a boundary;
5. choose an appropriate durable workspace/folder structure;
6. reason about the smallest coherent responsibility that deserves a standing agent;
7. bring that design to the owner;
8. use dialogue with the owner to bound the problem and resolve intent that repository evidence cannot determine;
9. only then create its durable `CORE-AGENT.md` identity.

### Important bootstrap lesson

The agent is not expected to arrive with a perfect mission merely because its launch prompt names a domain.

The prompt supplies a **domain of investigation and a reason for delegation**. The agent must discover the actual function-area boundary.

The owner dialogue is part of the architecture work, not a formality.

## Boundary and evolution rule

Responsibility boundaries are **living hypotheses**, not permanent constitutional anchors.

The current list is a starting map. As agents read the repository, talk with the owner, and encounter implementation reality, an area may discover that:
- a responsibility belongs elsewhere;
- an adjacent responsibility belongs here;
- two areas should merge;
- one area should split;
- the name is wrong;
- a new area is required;
- an area is no longer justified.

Those changes are expected. They should be made explicit, evidenced, and discussed rather than hidden.

The stable constitutional constraints are different. A Core Function Area must not:
- manufacture Ω law;
- silently create competing authority, ontology, canonical-data, or provenance stores;
- misrepresent proposals or evidence as settled truth;
- erase contradictions or lineage;
- silently take binding authority away from the appropriate owner.

Boundary evolution is part of the architecture work.

## Investigation instruments

Investigation instruments may serve multiple Core Function Areas.

Examples:

- repository discovery;
- reality/proof audit;
- archaeology/harvest;
- invariant drift checking;
- K0 confinement audit;
- plugin symmetry verification;
- deterministic grammar verification;
- self-knowledge auditing;
- schema/migration reconciliation;
- blast-radius analysis;
- journey tracing;
- adversarial falsification;
- convergence synthesis.

These are **methods**, not automatically Core Function Areas.

## Current approved architectural shape

```
ARCHITECTURE STEWARD
│
├── CFA-01 World / Ontology / Context
├── CFA-02 Data / Identity / Persistence
├── CFA-03 Self-Knowledge / Language / Command
├── CFA-04 Authority / Governance
├── CFA-05 Agency / Work / Execution
├── CFA-06 Capability / Provider / Realization
├── CFA-07 Composition / Plugin / Forge
├── CFA-08 Experience / Interaction / Surfaces
├── CFA-09 Evolution / Compatibility / Self-Maintenance
└── CFA-10 Runtime Constitution / Core Substrate
```

The following remain cross-cutting:

```
Evidence / Provenance / Verification / Uncertainty
Identity / Ownership / Temporal continuity
Authority / Security
Compatibility / Recovery
```

The Architecture Steward connects these areas through the architecture graph and documentation model. It does not replace their semantic responsibility.

## Next birth sequence

The recommended next self-design sessions are:

1. World / Ontology / Context
2. Authority / Governance
3. Agency / Work / Execution
4. Capability / Provider / Realization
5. Composition / Plugin / Forge
6. Experience / Interaction / Surfaces
7. Evolution / Compatibility / Self-Maintenance
8. Runtime Constitution / Core Substrate

Data / Identity / Persistence and Self-Knowledge / Language / Command are already in bootstrap/self-design execution and should not be duplicated.


### CFA-03 ratification note — 2026-09-25

CFA-03 is ratified as **Semantic Continuity Steward** (machine-safe slug: semantic-continuity). The original SELF-KNOWLEDGE-COMMAND-COMPILER workspace is retained as lineage. Its enduring responsibility is the coherence of meaning across self-knowledge, grounding, command language, interpretation, canonical Intent/Plan semantics, execution meaning, evidence/provenance, representation and bounded terminology. It does not replace the semantic authority of vivim.mind, NCLL, Intent, Work, Data, Authority, Surfaces, or the Architecture Steward graph.
