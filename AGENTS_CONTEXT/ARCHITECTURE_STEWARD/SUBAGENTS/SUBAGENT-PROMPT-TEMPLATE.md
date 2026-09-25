# Architecture Steward — Subagent Prompt Template

Copy this template into a typed subfolder as `LAUNCH-PROMPT.md`.

> This is a launch contract, not a project-management template. Keep it bounded.

# <TYPE> — <INVESTIGATION NAME>

## Mission

Determine:

- <exact uncertainty/question>

## Why this is delegated

The Steward needs independent:

- <breadth / historical reconstruction / source comparison / empirical characterization / contradiction checking>

Do not assume the Steward's current map is complete.

## Starting context

Begin from:

1. `/AGENTS.md`
2. `/BUILD_CONTEXT.md`
3. `/docs/CURRENT-CONTEXT.md`
4. <relevant authority>
5. <relevant destination package>
6. <relevant historical/research material>

These are starting points, not the complete search boundary.

## Exploration method

Perform an explicit repository/source exploration.

At minimum:

1. enumerate the relevant current paths;
2. search for alternate terminology and historical names;
3. inspect both destination and evidence-bearing sources;
4. trace references rather than trusting summaries;
5. compare current mainline with relevant branches/commits when needed;
6. identify duplicates, contradictions, stale claims, missing context, and unexamined areas;
7. record negative findings and search limitations.

Do not infer completeness from a directory's existence.

## Evidence discipline

Classify findings as appropriate:

- OBSERVED
- DERIVED
- CORROBORATED
- CONTRADICTED
- PROPOSED
- UNKNOWN

Never upgrade an implementation, document, test, or agent assertion into proof without evidence.

## Required outputs

Produce exactly:

1. <artifact>
2. <artifact>
3. <optional artifact>

For each significant finding include:

- statement;
- classification;
- source path/ref;
- relevant commit or version where material;
- confidence/limitations;
- architectural impact, if any.

## Output locations

Write durable outputs to:

- `<exact repository path>`
- `<exact repository path>`

Do not scatter output across unrelated folders.

## Lineage

Record:

- starting commit/branch;
- paths searched;
- major alternate terms searched;
- relevant branches/commits inspected;
- sources intentionally excluded and why;
- unresolved questions.

## Completion test

The investigation is complete enough only when:

- <coverage condition>;
- <comparison condition>;
- <uncertainty condition>;
- <output condition>.

Do not claim "complete" when the repository or tooling prevented complete inspection. Say exactly what was sampled and what remains unknown.

## Non-goals

Do not:

- implement production features;
- alter Ω law;
- silently modify destination architecture;
- invent missing evidence;
- create a parallel task/ontology/authority system;
- rewrite source research merely to make it fit the Steward's preferred format.

## Handoff

Commit the research package on the assigned branch and report:

- branch + commit;
- outputs and exact paths;
- strongest findings;
- contradictions;
- major blind spots;
- what the Steward must reconcile next.
