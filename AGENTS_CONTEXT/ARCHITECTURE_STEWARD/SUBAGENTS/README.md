# Architecture Steward — Subagents

This directory contains two related but distinct things: **durable Core Function Area bootstrap agents** and **bounded investigation prompts/instruments**. It is not a second coordinator or authority system.

## Why this exists

The Steward must not assume that the repository is complete, correctly contextualized, or internally reconciled merely because material exists on `main`.

When independent exploration is justified, the Steward creates a typed investigation subfolder. Core Function Areas use their named durable workspaces and the Core Function Area bootstrap template; they are not merely investigation types.

```
SUBAGENTS/
└── <TYPE>/
    ├── LAUNCH-PROMPT.md
    └── <small durable guidance only when genuinely needed>
```

The owner launches the prompt. The subagent explores and returns repository-visible evidence. The Steward then reconciles that evidence into the architecture.

## Template split

There are two distinct prompt contracts:

- `CORE-FUNCTION-AREA-BOOTSTRAP-TEMPLATE.md` — birth protocol for an enduring Core Function Area: full context, self-design, owner dialogue, alignment, durable identity, execution, boundary evolution, and Commons birth test.
- `SUBAGENT-PROMPT-TEMPLATE.md` — investigation-instrument template for bounded/reusable research. It must not create a permanent agent identity or responsibility owner.

A launch prompt may be self-contained, but it must clearly belong to one of these two classes. Do not mix permanent-agent birth responsibilities into an investigation instrument.

## Prompt contract

Every launch prompt must answer all of these:

| Field | Required meaning |
|---|---|
| Mission | Exact question or uncertainty |
| Why delegated | Why independent/broad/deep exploration is useful |
| Starting context | Minimum authorities and paths |
| Exploration method | What to inspect, search, compare, trace, test, or enumerate |
| Anti-assumption rule | Assume the existing corpus may be incomplete or miscontextualized |
| Evidence discipline | Separate observed evidence, derivation, proposal, and unknown |
| Outputs | Exact artifacts/findings to produce |
| Output locations | Exact repository paths |
| Lineage | Paths, refs, commits, sources, exclusions |
| Completion | What constitutes an adequate exploration |
| Non-goals | What the subagent must not silently expand into |

## Lifecycle

```
UNCERTAINTY
   ↓
STEWARD WRITES PROMPT
   ↓
OWNER LAUNCHES
   ↓
SUBAGENT EXPLORES
   ↓
OUTPUTS LAND IN REPO
   ↓
STEWARD VALIDATES LINEAGE
   ↓
STEWARD RECONCILES
   ↓
CANONICAL VIEWS CHANGE ONLY IF JUSTIFIED
```

Subagent findings never become authority merely because an agent produced them.

## Core Function Areas vs investigation instruments

A **Core Function Area** is an enduring architectural responsibility with a durable identity, boundary, interfaces and operating loop. An **investigation instrument** is a reusable method such as discovery, proof audit, archaeology, falsification, journey tracing or convergence synthesis.

Core Function Areas are deliberately self-designed in bootstrap sessions before their durable identities are created. Investigation instruments may be reused across multiple Core Function Areas and must not be promoted into permanent responsibility merely because they are useful.

The approved Core Function Area constellation is recorded in `CORE-FUNCTION-AREA-REGISTER.md`.

## Type discipline

Create a new subagent type only when the investigation method is meaningfully different or likely to recur.

Do not create a new folder for a one-off wording variation.

Current investigation types:

- **REPOSITORY-DISCOVERY** — independent completeness/contextualization sweep before the Steward treats the architecture corpus as sufficiently sampled.
- **PRODUCT-EXPERIENCE-ARCHAEOLOGY** — independent recovery and mapping of the user-experience vision, lifecycle, interaction grammar, and architectural corollaries before UX becomes the primary destination organizing lens.
- **SELF-KNOWLEDGE-COMMAND-COMPILER** — workspace slug for **CFA-03 Semantic Continuity Steward**; stewards the semantic continuity boundary between runtime self-knowledge, grounding, command language/interpreter, canonical Intent/Plan meaning, execution semantics, evidence/provenance, representation, and bounded terminology/CANON. The slug preserves delegation lineage.
- **DATA-MODEL-STEWARD** — independently reconstructs the future Ω/VIVIM data model across semantic records, vault persistence, identity/revision, events, provenance/evidence, runtime state, projections, external state, representation, schema evolution, and VIVIM→Ω reconciliation. It prevents the historical Prisma/data-sprawl model from silently becoming the future model.



## Durable Core Function Area workspaces

The current CFA workspaces are recorded in the register rather than treated as investigation types. A born CFA may contain additional durable identity/state artifacts because its lifecycle is different from a bounded investigation.

Lifecycle distinction:

```
LAUNCH-PROMPT.md       = birth protocol / bootstrap procedure
CORE-AGENT.md          = durable responsibility contract
STATE.md               = current operational state, when needed
identity history       = evolution of the responsibility contract
```

Do not rewrite a launch prompt merely because a born agent's identity evolves. Change the launch prompt when the birth protocol itself needs correction; record subsequent identity evolution in the durable identity/state artifacts.

## Delivery rule

Durable Core Function Area artifacts and bounded investigation artifacts are committed directly to `main` unless the owner explicitly assigns another delivery mechanism. Git branches are not communication channels, and no branch/PR should be created merely to stage ordinary agent bootstrap or communication artifacts.
## Communication bootstrap seeds

Every durable Core Function Area workspace has a dedicated `COMMUNICATION-HOW-TO.md` seed. It is a practical guide, not a second protocol. It points agents to the shared Commons capability/transport contract and the existing communication guidance.
