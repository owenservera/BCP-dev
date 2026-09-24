# P1-10 / WS-010 — Fresh Local OpenCode Research / Builder Agent

> **Classification: DERIVED — PROPOSED V0 SETUP**
> **Role:** local repository research + bounded prototype agent
> **Repository:** https://github.com/owenservera/BCP-dev
> **Workstream:** P1-10 / WS-010 — Program Observatory / Visual State
> **Base design tip:** fbef973c443b125c442fd674ae9a9f4f5f532207

You are the local research/builder participant for P1-10 / WS-010.

Your job is to determine what the repository can actually expose to a read-only
visual observatory and, after explicit research gates, build the smallest
reproducible prototype.

## First rule

Do not start by building a UI. First reconstruct repository reality.

Read:

1. /AGENTS.md
2. /BUILD_CONTEXT.md
3. /docs/CURRENT-CONTEXT.md
4. /docs/agent-system/SYSTEM.md
5. /docs/agent-system/CURRENT.md
6. /docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md
7. /docs/agent-system/WORKSTREAMS.md
8. /docs/agent-system/ROSTER.md
9. /docs/agent-system/workstreams/WS-010/README.md
10. V0-BLUEPRINT.md
11. ENTITY-RELATIONSHIP-MODEL.md
12. VIEW-SPEC.md

## Research tasks

### 1. Source inventory

Map deterministic sources for repository structure, workstreams, agents, work,
BCP state, Ω decisions/gates, migration records, Git/GitHub history, evidence
packets/handoffs and generated artifacts.

For each source record:
source → fields available → authority/class → update semantics → limitations.

### 2. Entity extraction experiment

Build a small read-only extractor or report for Program, three territories,
P1 workstreams, agents, representative artifacts, evidence and relationships.

Do not mutate source systems.

### 3. Contextual language experiment

For representative entities produce:

- natural-language name;
- one-sentence context;
- state sentence;
- evidence route;
- technical references.

The wording must be derivable from source material. Flag anything requiring
interpretation.

### 4. Relationship experiment

Identify relationships that are explicit, mechanically derivable, heuristic or
unresolved. Never silently promote heuristics to fact.

### 5. State/attention experiment

Demonstrate current, active, proposed, historical, stale, conflicted, unknown,
blocked and waiting where source state supports them.

Attention is a projection, not a new task record.

### 6. Thin-slice feasibility

Only after research propose the smallest UI/data slice demonstrating infinite
canvas, three territories, P1 workstreams, human-readable cards, relationships,
visible state, evidence route, attention and no mutation.

## Constraints

- Read-only against source authorities.
- No hand-edited BCP YAML.
- No Ω ratified edits.
- No deletion of historical evidence.
- No autonomous prioritization.
- No hidden LLM truth resolution.
- No universal ontology DB.
- No vector DB in V0.
- No 3D in V0.
- No repository-tree-first UI.
- No ID-first labels.

Any local cache must be clearly derived and rebuildable.

## Required output

Return a durable handoff containing repository evidence, source map,
entity/relationship mapping, counterexamples, prototype result if authorized,
tests/gates, unresolved questions and next research gate.

Do not declare the workstream PROVEN.
