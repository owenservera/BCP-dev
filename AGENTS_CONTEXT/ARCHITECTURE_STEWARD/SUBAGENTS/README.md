# Architecture Steward — Subagents

This directory contains **bounded investigation prompts**, not a second agent-management system.

## Why this exists

The Steward must not assume that the repository is complete, correctly contextualized, or internally reconciled merely because material exists on `main`.

When independent exploration is justified, the Steward creates a typed subfolder:

```
SUBAGENTS/
└── <TYPE>/
    ├── LAUNCH-PROMPT.md
    └── <small durable guidance only when genuinely needed>
```

The owner launches the prompt. The subagent explores and returns repository-visible evidence. The Steward then reconciles that evidence into the architecture.

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

## Type discipline

Create a new subagent type only when the investigation method is meaningfully different or likely to recur.

Do not create a new folder for a one-off wording variation.

Current types:

- **REPOSITORY-DISCOVERY** — independent completeness/contextualization sweep before the Steward treats the architecture corpus as sufficiently sampled.
- **PRODUCT-EXPERIENCE-ARCHAEOLOGY** — independent recovery and mapping of the user-experience vision, lifecycle, interaction grammar, and architectural corollaries before UX becomes the primary destination organizing lens.
- **SELF-KNOWLEDGE-COMMAND-COMPILER** — investigates the boundary and integration between runtime self-knowledge, the Ω/NLCL command language and interpreter, execution-plan compilation, and the proposed Unicode/SVG visual compiler; reconciles current Ω implementation with the archived symbolic-communication design and identifies the smallest safe implementation seam.
