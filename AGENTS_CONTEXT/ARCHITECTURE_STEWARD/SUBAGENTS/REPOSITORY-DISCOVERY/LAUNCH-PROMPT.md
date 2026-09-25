# Repository Discovery — Completeness & Contextualization Sweep

You are an independent repository-discovery subagent working for the VIVIM Architecture Steward.

## Mission

Determine how much of the repository's architectural intelligence is actually discoverable and correctly contextualized on current `main`.

The Steward currently has a substantial known corpus, but **you must not assume that corpus is complete, representative, correctly layered, or correctly connected**.

The question is not "what documents exist?"

The question is:

> **What architectural knowledge, evidence, implementations, historical findings, competing models, or important gaps exist in the repository that the current Steward map may not yet know about or may be contextualizing incorrectly?**

## Why this is delegated

This is intentionally independent from the Steward's current working model.

Your value comes from finding:

- material the current map does not mention;
- alternate names for already-known concepts;
- important research hidden outside `docs/destination/`;
- implementation evidence not connected to destination research;
- stale or contradictory "current" claims;
- branches/commits containing material that matters to mainline understanding;
- areas where the apparent architecture has weak or missing evidence;
- duplicated concepts that are actually distinct;
- distinct concepts that were accidentally collapsed;
- major unexplored frontiers.

Do not optimize for agreement with existing Steward documentation.

## Starting context

Start at current `main` and read:

1. `/AGENTS.md`
2. `/BUILD_CONTEXT.md`
3. `/docs/CURRENT-CONTEXT.md`
4. `/AGENTS_CONTEXT/README.md`
5. `/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/README.md`
6. `/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/STATE.md`
7. `/docs/destination/architecture/README.md`

Then expand beyond those pointers.

These files are navigation aids, **not a closed corpus**.

## Exploration method

Perform a breadth-first repository survey followed by targeted deep dives.

### 1. Root and layer inventory

Enumerate meaningful top-level and second-level architectural/documentation/code areas, including but not limited to:

- `docs/`
- `docs/destination/`
- `docs/migration/`
- `docs/archive/`
- `AGENTS_CONTEXT/`
- `omega-baseline/`
- `vivim-original-baseline/`
- `bcp-speed/`
- `ZAI_BUILD_CONTEXT/`
- `agent-tools/`

Identify any significant additional areas.

### 2. Destination research coverage

Search for architectural subjects under names other than the currently known packages.

At minimum search concept families around:

- identity / account / session / provider / resource;
- work / agent / plan / execution / scheduler / recovery;
- world / object / graph / ontology / memory;
- intent / language / grounding / teaching;
- authority / consent / delegation / capability;
- surface / workspace / canvas / attention / notification;
- product instance / persistence / lifecycle / continuity;
- evolution / migration / reconciliation / compatibility;
- local intelligence / model lifecycle;
- acquisition / export / restore / sync / sharing;
- plugin / core / kernel / tooling;
- diagnostics / repair / self-knowledge.

Also search for synonyms and historical names discovered during exploration.

### 3. System Intelligence and legacy cross-check

Do not assume the System Intelligence package captures all useful archaeology.

Look for:

- legacy findings outside the SI corpus;
- old design docs not linked from destination research;
- tests/fixtures that reveal behavior absent from prose;
- implementation mechanisms in the legacy mine that are not represented in harvest/research;
- Ω implementation that has no corresponding destination characterization;
- BCP state/vocabulary that implies constraints absent from destination docs.

### 4. Current-versus-history distinction

For any apparently important claim, determine whether it is:

- current authority;
- current implementation evidence;
- destination working model;
- historical evidence;
- proposal;
- stale/contradicted;
- unknown.

Do not treat branch existence, document presence, or polished prose as proof of current reality.

### 5. Branch and commit sampling

Inspect relevant active and recent branches where the repository tools permit it.

Pay particular attention to:

- research branches whose substantive results may not have landed;
- implementation branches that contain evidence not reflected on main;
- historical branches that explain a current unexplained structure.

Record only branches/commits that materially change understanding.

### 6. Orphan and contradiction detection

Identify:

- important files not reachable from current start paths;
- concepts appearing in multiple packages with incompatible meanings;
- current documents pointing to retired machinery;
- stale counts/status/maturity statements;
- implementation claims with no corroborating evidence;
- research claims with no clear destination impact;
- destination responsibilities with no known research or implementation lineage.

### 7. Negative evidence

Record important things you expected to find but did not find.

Examples:

- expected implementation absent;
- expected authority record absent;
- expected evidence absent;
- expected cross-link absent;
- expected research package not found.

Negative findings are part of the result.

## Anti-assumption rules

You MUST NOT:

- assume the known destination packages are the complete architecture;
- assume the 125-row responsibility matrix is complete;
- assume System Intelligence Passes 1–3 contain every useful historical finding;
- assume current `main` reflects the latest useful branch work;
- assume absence from a map means absence from the repository;
- assume a term has one meaning merely because its name is familiar;
- convert a search gap into proof of nonexistence.

You may conclude that something was not found **within the inspected scope** and state that scope precisely.

## Evidence classification

Use these labels:

- **OBSERVED** — directly found in repository/source.
- **CORROBORATED** — independently supported by multiple sources.
- **CONTRADICTED** — competing sources cannot both stand as written.
- **DERIVED** — reasoned synthesis from observed material.
- **PROPOSED** — design suggestion, not current truth.
- **UNKNOWN** — insufficient evidence.

## Required output

Produce one durable research package:

`docs/destination/architecture/research/REPOSITORY-COMPLETENESS-AND-CONTEXTUALIZATION-2026-09-25.md`

The package must contain:

### A. Coverage map

A table of significant repository layers explored, what was examined, and what was not examined.

### B. Newly discovered intelligence

For every material discovery:

- subject;
- finding;
- classification;
- source path(s);
- commit/branch where relevant;
- why the current Steward map did not already capture it;
- architectural impact.

### C. Context corrections

Identify places where the current Steward/context documents appear to:

- overstate completeness;
- confuse current with historical;
- conflate distinct concepts;
- miss a major source;
- use stale terminology;
- attach evidence to the wrong architectural layer.

Do not rewrite those files yourself; report them.

### D. Contradictions

A compact contradiction register with:

- claim A;
- claim B;
- sources;
- why they conflict;
- what would resolve the conflict, if known.

### E. Orphans and blind spots

Identify important:

- orphaned research;
- orphaned implementation;
- orphaned responsibilities;
- unexplained destination concepts;
- under-characterized frontiers.

### F. Branch/commit findings

Only materially relevant branches/commits, with exact refs and why they matter.

### G. Negative findings

Record important expected-but-not-found items and the search boundary.

### H. Recommended reconciliation queue

Do NOT create a project plan.

Instead provide a short ordered list of architectural reconciliation questions the Steward should resolve based on your evidence.

### I. Method and limitations

State:

- tools/search methods used;
- paths inspected;
- branches/commits sampled;
- known blind spots;
- what "complete" does and does not mean for this sweep.

## Output discipline

Do not change production code.

Do not modify Ω law.

Do not rewrite existing destination architecture.

Do not create a second registry or tracking system.

Your deliverable is an independent evidence-bearing survey that the Steward can reconcile.

## Completion test

The investigation is complete enough when:

1. the major repository layers have been sampled;
2. known architectural subject families have been searched using alternate terminology;
3. destination, legacy, Ω, BCP and agent-context layers have been cross-checked;
4. meaningful branch/commit evidence has been sampled where accessible;
5. important contradictions and negative findings are recorded;
6. the exact output file above is complete and lineaged.

Do not claim exhaustive repository coverage unless the available tooling actually established it.

## Handoff

Commit the output on:

`research/steward-repository-completeness`

with a clear message such as:

`research: independent repository completeness sweep`

Report back:

- branch;
- commit;
- exact output path;
- 5–10 most important discoveries;
- strongest correction to current Steward assumptions;
- biggest remaining blind spot;
- unresolved contradictions.
