# LAUNCH PROMPT — VIVIM Personal Agent / Self-Knowledge / Command Language

You are opening a dedicated deep research + design workstream for VIVIM.

Repository:
https://github.com/owenservera/BCP-dev

## Mission

Design the product-level **Personal Agent + Self-Knowledge + Symbolic Command Language** system that VIVIM needs.

The core product proposition is:

> VIVIM should be able to explain itself to its user. The user should be able to ask about the system's identity, state, capabilities, configuration, dependencies, history, decisions, evidence, current Work, and behavior, and receive answers grounded in canonical system reality.

The Personal Agent is the user's principal-facing intelligence over that reality.

The command system is not a separate feature: **Natural Language ↔ Symbolic Command Language ↔ structured Intent** should form one semantic operating interface.

Do not begin by implementing production code.

First establish the canonical design and the exact seams where implementation belongs.

## First read

Read in this order:

1. `AGENTS.md`
2. `BUILD_CONTEXT.md`
3. `AGENTS_CONTEXT/README.md`
4. `AGENTS_CONTEXT/PRODUCT_VISION/STATE.md`
5. `AGENTS_CONTEXT/PERSONAL_AGENT/README.md`
6. `AGENTS_CONTEXT/PERSONAL_AGENT/STATE.md`
7. `AGENTS_CONTEXT/PERSONAL_AGENT/VISION.md`
8. `AGENTS_CONTEXT/PERSONAL_AGENT/CANONICAL-MODEL.md`
9. `AGENTS_CONTEXT/PERSONAL_AGENT/COMMAND-SYMBOL-SYSTEM.md`
10. `AGENTS_CONTEXT/PERSONAL_AGENT/OPEN-FRONTIER.md`
11. `docs/destination/PERSONAL-AGENT-SELF-KNOWLEDGE-AND-COMMAND-LANGUAGE.md`
12. `docs/destination/README.md`

Then inspect current implementation and ratified decisions relevant to:

- `vivim.mind`
- `vivim.nlcl`
- `plugins/vivim-nlcl-pure`
- the 17 symbolic families
- `vivim.intent`
- Intent trace/debug
- `control.bootstrap` / `control.describe`
- `vivim.agent`
- `vivim.law`
- `vivim.run`
- canonical World/Object/Relationship
- durable Work
- Product Instance
- freshness/self-knowledge
- manifest contributions / `lang`
- surfaces and projections
- Forge/plugin evolution.

Use repository code and ratified decisions as implementation authority.

## Critical external input

The owner has continued designing an expanded symbolic command paradigm outside the repository.

That material is NOT yet canonical merely because the owner has described it.

Locate any supplied external symbolic-command material available to you in the repository/context/files. If it is not present, explicitly record that gap and do not invent its contents.

Reconcile external material with the existing Ω 17-family system rather than creating a competing command language.

## Central questions

Answer these rigorously:

### A. What is Self-Knowledge?

Define the canonical ontology of knowledge about the running VIVIM instance.

It must cover, at minimum where applicable:

- Product Instance
- Composition
- Plugin
- Contribution
- Capability
- Contract
- Configuration
- Canonical Object
- Relationship
- Revision
- Source identity
- Account
- Session
- Browser/resource
- Work / Plan / Step / Attempt
- Law / Authority / Consent
- Evidence / Provenance
- Surface / Projection
- language / symbolic semantics
- Personal Agent itself.

Distinguish canonical truth from descriptions, projections, caches, and AI-generated explanations.

### B. How does the user query it?

Design a query model that can answer questions such as:

- What is this?
- What can I do?
- What is running?
- What is configured?
- Why is this unavailable?
- What depends on this?
- What would break if I changed/removed this?
- What changed?
- Why did the system make this decision?
- What evidence supports that?
- What does this command mean?
- What did the parser think I meant?
- What can this plugin do?
- How does the Personal Agent itself work?

Classify query semantics such as describe, inspect, list, find, explain, trace, compare, diff, dependency, impact, history, status, configure, and repair.

Do not assume every concept needs a dedicated opcode. Derive the smallest coherent semantic query vocabulary.

### C. What is the Personal Agent?

Reconcile:

- Personal Agent
- user principal
- Product Instance
- `vivim.agent`
- AgentDefinition
- Work
- AI model/provider.

Determine identity, lifecycle, persistence, authority, memory, attention, and relationship to Work.

The Personal Agent must not become a hidden second authority model or a second durable database.

### D. How does plugin-native self-description work?

A newly installed plugin should naturally become understandable without a bespoke Personal-Agent integration.

Determine the minimum generic contribution surface needed to expose:

- identity/version
- capabilities/contracts
- configuration schema
- dependencies
- lifecycle/state
- resources
- language contributions
- supported object kinds
- evidence/provenance expectations
- human-readable descriptions where useful.

Reuse existing manifest/contribution mechanisms wherever possible.

### E. How does symbolic language fit?

Treat the existing 17 symbolic families as a foundation, not an obsolete feature.

Reconcile:

Natural language
↔ symbolic representation
↔ structured Intent.

Determine how symbolic forms support both ACTIONS and SELF-KNOWLEDGE queries.

Examples of conceptual intent include:

`/send @this → @peter`
`? capabilities @vivim.run`
`? dependencies @provider`
`∆ @rule → @sarah`

Do not claim exact syntax is implemented unless evidence supports it.

Determine which semantics are stable grammar, which are plugin/lang data, and which are principal-owned personalization.

### F. How does self-knowledge improve the deterministic core?

Model the reinforcing loop:

Self-Knowledge → grounding → Intent → Capability → Authority → Work → Evidence → Self-Knowledge.

Determine which self-knowledge projections must be available to NCLL at parse time and which can remain deeper query/inspection services.

### G. How are answers made trustworthy?

Design a canonical answer envelope capable of carrying, where relevant:

- claim
- basis
- freshness
- authority
- evidence
- optional action.

Reconcile existing Evidence, Provenance, refusal, Intent trace, and freshness work.

Preserve:

EVIDENCE ≠ REPRESENTATION ≠ DESCRIPTION ≠ AUTHORITY
confidence ≠ proof
candidate ≠ realization
LLM output ≠ authority
unknown ≠ failure.

### H. What are the minimum implementation seams?

Map the design to existing Ω code.

Explicitly identify:

- preserve
- extend
- replace
- new plugin
- new contract
- new projection
- research/experiment first.

Do not create a second database or duplicate canonical storage.

## Required output

Create a complete research/design package in:

`docs/destination/personal-agent/`

At minimum include:

1. `README.md`
2. `RESEARCH-SYNTHESIS.md`
3. `CANONICAL-ONTOLOGY.md`
4. `PERSONAL-AGENT-MODEL.md`
5. `SELF-KNOWLEDGE-QUERY-MODEL.md`
6. `ANSWER-AND-EVIDENCE-MODEL.md`
7. `PLUGIN-SELF-DESCRIPTION.md`
8. `SYMBOLIC-LANGUAGE-INTEGRATION.md`
9. `DEPENDENCY-AND-IMPACT-MODEL.md`
10. `IMPLEMENTATION-BLUEPRINT.md`
11. `FALSIFIERS.md`
12. `OPEN-FRONTIER.md`
13. `EVIDENCE-INDEX.md`
14. `DECISIONS.md`

The package must clearly distinguish:

- CURRENT / existing implementation
- RATIFIED / existing design authority
- PROPOSED / new design
- EXPERIMENT-REQUIRED / unresolved empirical question
- BLOCKED / missing prerequisite.

## Required canonical diagrams

Include text diagrams for:

1. Self-Knowledge architecture
2. Personal Agent semantic loop
3. Natural ↔ Symbolic ↔ Intent path
4. Plugin installation → self-description propagation
5. dependency/impact derivation
6. answer evidence chain.

## Research requirements

Use current repository evidence first.

For modern external research, investigate relevant contemporary approaches to:

- system/self introspection
- knowledge graphs and typed dependency graphs
- agent memory and self-models
- tool/capability discovery
- explainable command systems
- structured command languages
- plugin ecosystems
- durable agent/workflow state
- provenance/evidence-backed answering.

External research informs design; it does not override VIVIM constitutional rules.

## Falsifier-first requirement

Every major proposed abstraction needs at least one falsifier.

Examples:

- new plugin becomes self-describing without a bespoke adapter;
- a user can ask “what can I do?” and receive a grounded answer from live state;
- dependency impact is reconstructible from canonical references;
- removing a disposable projection does not destroy truth;
- a self-answer cites current evidence and exposes stale/conflicted state;
- symbolic and natural representations resolve to the same Intent;
- Personal Agent cannot bypass Authority;
- the agent can explain its own reasoning path without claiming hidden authority.

## Explicit non-goals

Do NOT:

- build a separate knowledge database;
- make the Personal Agent the source of truth;
- make the LLM the parser/resolver of record;
- replace the existing 17-family symbolic system without evidence;
- create plugin-specific hard-coded Personal-Agent adapters as the normal extension path;
- turn UI/wiki pages into canonical storage;
- implement production code before the ontology/contracts/design are reconciled.

## Repository landing is mandatory

The research package is not complete until it is in the repository.

You MUST:

1. write the complete package under `docs/destination/personal-agent/`;
2. include the full synthesis, canonical model, diagrams, evidence index, decisions, and falsifiers;
3. update `STATE.md` with current status and exact package location;
4. commit all work to your dedicated branch;
5. return the commit SHA and exact paths;
6. update the PR with the final commit and package summary.

Do not return a ZIP or external-only package as the canonical deliverable.

## Branch

Create a dedicated research/design branch from current `main`:

`research/personal-agent-self-knowledge`

Do not mix unrelated implementation work into this branch.

## Completion gate

You are complete only when:

- every required output exists in-repo;
- current implementation vs proposal is explicit;
- the external symbolic-language gap is explicit;
- Personal Agent identity is reconciled with existing agent/work/principal concepts;
- plugin-native self-description is defined;
- the query model is defined;
- answer/evidence/freshness semantics are defined;
- symbolic integration is reconciled with the existing 17 families;
- implementation seams are mapped to actual repository paths;
- falsifiers are defined;
- open questions and experiments are explicit;
- branch is committed;
- PR is updated with final evidence.

Return:

- branch
- commit SHA
- PR number/URL
- package root
- concise list of the principal conclusions
- unresolved experiments/blockers.
