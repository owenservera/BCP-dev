# LAUNCH PROMPT — VIVIM Evolution, Reconciliation & Self-Maintenance

You are opening a dedicated deep research + design workstream for VIVIM.

Repository:
https://github.com/owenservera/BCP-dev

Branch:
`research/evolution-reconciliation-self-maintenance`

## Mission

Determine and design the smallest coherent system VIVIM needs to:

- maintain itself;
- detect and characterize drift;
- evolve its data model and ontology;
- reconcile identity and relationships;
- evolve/replace capabilities and realizations;
- migrate and recover durable state;
- preserve continuity and evidence;
- extend itself safely through Forge;
- repair external integrations;
- and remain governed while doing so.

This is a research/design task first. Do not implement production code until the model is reconciled and its falsifiers are explicit.

## First read

1. `AGENTS.md`
2. `BUILD_CONTEXT.md`
3. `docs/CURRENT-CONTEXT.md`
4. `AGENTS_CONTEXT/README.md`
5. `AGENTS_CONTEXT/PRODUCT_VISION/STATE.md`
6. `AGENTS_CONTEXT/PERSONAL_AGENT/STATE.md`
7. this directory's `STATE.md`, `VISION.md`, `CANONICAL-MODEL.md`, `CONSTITUTION.md`, `RECONCILIATION-SCOPE.md`, `OPEN-FRONTIER.md`
8. `docs/destination/README.md`
9. `docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md`
10. `docs/destination/FORGE-COMPOSITION-EVOLUTION-RECONCILIATION.md`
11. `docs/destination/MATURITY-AND-GAPS.md`
12. `docs/agent-system/PROGRAM-COMPLETENESS-AND-CONTROLS.md`
13. `docs/agent-system/PROGRAM-BOARD.md`

Then inspect actual Ω code and ratified decisions for:

- vault revisions, migration, export/import, quarantine;
- ontology/object/relationship;
- Product Instance;
- plugin/contract/version semantics;
- behavior staging/activation/quarantine/rollback;
- Forge;
- discovery/provider healing;
- Work/Plan/Attempt/recovery;
- law/authority;
- evidence/provenance/freshness;
- self-knowledge/context;
- language/intent/spatial intent;
- composition/resource lifecycle.

Use legacy VIVIM only as behavioral/evidence source.

## Core research questions

### A. Dynamic data and ontology evolution
Find the minimum model for schema/ontology evolution without endless forks.

Distinguish shape change, semantic change, identity change, relationship change, and projection change.

### B. Identity reconciliation
Design external↔local correspondence, merges, splits, aliases, uncertainty, and provenance.

### C. Compatibility
Develop a composable compatibility model. Distinguish:
structural, semantic, behavioral, identity, relationship, authority, evidence, persistence, projection, resource compatibility.

### D. Temporal and causal continuity
Represent historical truth, current truth, effective time, revision time, supersession, causation, and support.

### E. Change impact
Determine whether dependency/relationship graphs can derive impact from canonical references, including active Work and external effects.

### F. Migration and recovery
Reconcile dry-run migration, rollback points, quarantine, versioned execution, Product Instance continuity, and reconstruction.

### G. Self-maintenance
Define the safe automation envelope and the boundary between automatic maintenance, governed evolution, and constitutional evolution.

### H. Self-extension and Forge
Show that generated/repaired/third-party capabilities use the ordinary plugin/capability/authority path.

### I. Evidence
Ensure evidence remains attributable across capability versions, data migrations, provider changes, and semantic reinterpretation.

### J. Resource economics
Determine how system maintenance/evolution competes for governed CPU/GPU/network/storage/browser/session resources.

## Required output

Create a full research/design package under:

`docs/destination/evolution/`

Required at minimum:

1. `README.md`
2. `RESEARCH-SYNTHESIS.md`
3. `CANONICAL-EVOLUTION-MODEL.md`
4. `DATA-AND-ONTOLOGY-EVOLUTION.md`
5. `IDENTITY-AND-RECONCILIATION.md`
6. `RELATIONSHIP-EVOLUTION.md`
7. `COMPATIBILITY-AND-IMPACT.md`
8. `TEMPORAL-CONTINUITY.md`
9. `MIGRATION-RECOVERY-ROLLBACK.md`
10. `SELF-MAINTENANCE-CONSTITUTION.md`
11. `FORGE-AND-EXTENSION-EVOLUTION.md`
12. `EVIDENCE-ACROSS-VERSIONS.md`
13. `RESOURCE-ECONOMICS.md`
14. `IMPLEMENTATION-BLUEPRINT.md`
15. `FALSIFIERS.md`
16. `OPEN-FRONTIER.md`
17. `EVIDENCE-INDEX.md`
18. `DECISIONS.md`

## Required artifacts

Include diagrams for:

1. the three change classes;
2. evolution state machine;
3. data/object/relationship versioning;
4. identity reconciliation;
5. compatibility + impact graph;
6. migration/rollback/recovery;
7. Forge/repair/promotion;
8. evidence continuity across versions;
9. constitutional boundary.

For every proposed rule include at least one falsifier.

## Mandatory falsifier themes

- a benign projection rebuild cannot damage canonical truth;
- an object semantic migration preserves historical interpretation;
- a relationship merge does not silently fabricate provenance;
- an uncertain identity match remains visibly uncertain;
- active Work retains the versioned contract it was authorized against;
- a replaced capability can be rolled back without losing user history;
- provider healing cannot silently promote an unverified realization;
- a generated plugin receives no authority that a hand-created plugin would not receive;
- impact analysis identifies affected Work or explicitly reports unknown impact;
- evidence from an old version remains attributable;
- constitutional rules cannot be bypassed by Forge, Personal Agent, or model output.

## Research discipline

Distinguish:

- CURRENT — observed repository behavior;
- RATIFIED — existing Ω authority;
- HARVEST — legacy evidence;
- PROPOSED — destination design;
- EXPERIMENT-REQUIRED — unresolved empirical question;
- BLOCKED — missing prerequisite.

Do not let a repeated design phrase become a ratified law without evidence.

## Completion gate

Complete only when:

- the dynamic data model is characterized;
- identity and relationship evolution are explicit;
- compatibility and impact are defined;
- migration/recovery is reconciled;
- self-maintenance boundaries are explicit;
- Forge/provider healing fit one evolution model;
- evidence continuity across change is defined;
- constitutional evolution is separated;
- exact Ω/legacy implementation seams are mapped;
- falsifiers and experiments are explicit;
- all outputs are committed on this branch.

Return branch, commit SHA, PR, package root, principal conclusions, and unresolved experiments/blockers.


## Critical architectural framing

Do not model this research as a generic “evolution engine” sitting beside Ω.

Treat the destination relation as:

```text
EVERYTHING-IS-A-PLUGIN
        +
GOVERNED EVOLUTION
        +
CANONICAL DATA / WORLD
        +
DURABLE WORK
        +
EVIDENCE
        +
SELF-KNOWLEDGE
```

The plugin boundary is the primary extensibility/replacement seam for capabilities and product behavior. Evolution governance determines which changes cross that seam, what they affect, how compatibility is established, how active Work is protected, and how rollback/recovery works.

`docs/destination/EVERYTHING-IS-A-PLUGIN-EVOLUTION-CONSTITUTION.md` is part of the required reading for the research pass.
