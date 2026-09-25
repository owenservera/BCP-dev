# LAUNCH PROMPT — VIVIM Core vs Plugin Boundary Distillation

You are opening a dedicated deep research/design pass for VIVIM.

Repository:
`https://github.com/owenservera/BCP-dev`

Branch:
`research/core-vs-plugin-boundary`

## Mission

Derive the smallest irreducible Ω Core and the correct boundaries for shared contracts, first-party system plugins, extension plugins, and tooling.

Do this from evidence already accumulated across VIVIM archaeology, Ω migration archaeology, current Ω law, destination reconciliation, Everything-is-a-Plugin, and Evolution/Reconciliation/Self-Maintenance.

Do not implement production code during this research pass.

## First read

1. `/AGENTS.md`
2. `/BUILD_CONTEXT.md`
3. `/docs/CURRENT-CONTEXT.md`
4. `/AGENTS_CONTEXT/README.md`
5. `/AGENTS_CONTEXT/PRODUCT_VISION/STATE.md`
6. `/AGENTS_CONTEXT/PERSONAL_AGENT/STATE.md`
7. `/AGENTS_CONTEXT/EVOLUTION/STATE.md`
8. this folder in order: `STATE.md`, `VISION.md`, `CANONICAL-MODEL.md`, `RESEARCH-SCOPE.md`, `OUTPUT-EXPECTATIONS.md`, `OPEN-FRONTIER.md`
9. `/docs/destination/CORE-VS-PLUGIN-BOUNDARY-DISTILLATION.md`
10. `/docs/destination/EVERYTHING-IS-A-PLUGIN-EVOLUTION-CONSTITUTION.md`
11. `/docs/destination/EVOLUTION-RECONCILIATION.md`
12. `/docs/destination/RECONCILIATION-MAP.md`
13. `/docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md`
14. `/docs/destination/BUILD-AND-HARVEST-PLAN.md`
15. `/docs/agent-system/PROGRAM-COMPLETENESS-AND-CONTROLS.md`
16. current Ω `CURRENT-INVARIANTS.md`, `BUILD-DECISIONS.md`, Layered Cake / migration boundary artifacts, and the Plugin Kernel workstream evidence
17. legacy plugin-boundary archaeology, especially `BOUNDARY-CONSTITUTION.md`, `ATOMIC-INVENTORY.md`, `FALSE-CORE-AND-MISSING.md`, and `AT-FORENSIC-VERDICT.md`.

## Core research questions

### A. Minimum Core
What responsibilities are genuinely non-bypassable and domain-neutral?

### B. Contract layer
Which meanings must be shared between plugins while remaining implementation-agnostic?

### C. System plugins
Which first-party components are essential but should remain replaceable plugins?

### D. Extension symmetry
Can first-party and third-party plugins actually use the same boundary?

### E. False Core
For every proposed K0 responsibility, attempt to move it outward. Record the concrete reason it cannot.

### F. Mixed boundaries
Identify responsibilities that must split across Core enforcement, contract vocabulary, and plugin-owned semantics.

### G. Dynamic data
Determine how object, relationship, schema, evidence, Work, and Product Instance semantics interact with plugin ownership.

### H. Evolution
Determine how plugin replacement, capability evolution, provider healing, Forge-generated plugins, migration, rollback, and retirement cross the Core boundary.

### I. Zero-plugin bootstrap
Characterize what the environment can and must do when no first-party product plugins are installed.

### J. Dependency and impact
Determine whether the plugin graph can become the structural basis for change-impact analysis without putting the whole graph into Core.

## Mandatory stress cases

1. remove `vivim.chat`;
2. replace `vivim-nlcl`;
3. replace `vivim-vault`;
4. replace browser/provider realization;
5. replace Work implementation while Work is active;
6. add a new object-domain plugin;
7. add a third-party UI/surface plugin;
8. add a Forge-generated plugin;
9. evolve a shared contract;
10. change a constitutional invariant;
11. boot with zero VIVIM system plugins;
12. upgrade a system plugin while preserving canonical user history.

## Required completion gate

The pass is complete only when:

- every major destination responsibility has a classification;
- every K0 item has a why-not-plugin argument;
- every K1 item has an explicit protocol rationale;
- system plugins have explicit replacement seams;
- mixed responsibilities are decomposed rather than forced into one layer;
- Legacy and Ω evidence are mapped;
- false-Core candidates are documented;
- plugin/first-party symmetry is evaluated;
- evolution and active-Work consequences are mapped;
- trust and authority boundaries are explicit;
- implementation/migration sequencing is defined;
- falsifiers and unresolved experiments are explicit;
- all outputs are committed on this branch.

Return:
`branch`, `commit SHA`, `PR`, package root, final K0/K1/plugin classification, principal boundary decisions, false-Core findings, unresolved experiments, and blockers.