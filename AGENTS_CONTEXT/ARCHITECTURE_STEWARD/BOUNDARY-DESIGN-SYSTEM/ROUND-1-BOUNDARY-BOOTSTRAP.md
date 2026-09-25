# Round 1 — CFA Boundary Bootstrap

> Audience: every Core Function Area agent
> Router: human owner/communication router
> Coordinator: Architecture Steward
> Date basis: 2026-09-26
> Output: one durable boundary declaration in your own CFA folder

## Why you are receiving this

The CFA constellation has now independently bootstrapped enough domain knowledge to begin interoperability work.

This round is **not** asking you to redesign your mission and not asking you to agree with the other agents.

It asks you to make your own responsibility legible at the seams.

Read first:

1. your existing CFA bootstrap/identity/current-state artifacts;
2. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/BOUNDARY-PROTOCOL.md`;
3. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-CFA-MATRIX.md`;
4. the Architecture Steward README and Core Function Area Register;
5. the most relevant peer artifacts for your assigned seam(s).

## Your task

Produce a **Boundary Declaration**, not an implementation plan.

### Step A — Position yourself

State:
- CFA ID;
- current working/rationalized name;
- identity status (proposed / ratified / other);
- the responsibility you believe must remain continuously coherent;
- what you explicitly do not own.

Do not inherit ownership merely from folder names or historical implementation structure.

### Step B — Declare your responsibility

Write an OWNS / CONTRIBUTES / CONSULTS / OUT-OF-SCOPE table.

For each item, classify the claim as OBSERVED, DERIVED, PROPOSED, UNKNOWN, or CONFLICTED and indicate freshness where useful.

### Step C — Analyze your assigned seams

For each assigned seam from the matrix, answer:

1. What is the seam's subject?
2. What do I believe my CFA owns?
3. What do I believe the peer owns?
4. What crosses the boundary?
5. What must not cross?
6. What inputs do I require?
7. What outputs do I provide?
8. What invariants must hold?
9. What evidence currently supports the claim?
10. What would falsify it?
11. What is unknown?
12. What appears duplicated or overlapping?
13. What question must the peer answer before the seam can be considered aligned?

Do not resolve the peer's semantics for them.

### Step D — Identify boundary hazards

Explicitly identify:
- responsibility overlap;
- missing responsibility;
- authority confusion;
- evidence/representation confusion;
- implementation leakage;
- stale assumptions;
- terminology collisions;
- likely future drift.

### Step E — Record your proposed handoffs

Suggest concrete Handoffs that would make the seam operational.

A handoff is a proposed transfer of information/work across the boundary, not a transfer of authority.

### Step F — Stop at the correct level

Do not:
- redesign Ω;
- create new permanent CFAs;
- refactor implementation;
- build the shared boundary tool;
- decide cross-CFA disputes unilaterally;
- replace your local research methodology with this prompt.

### Required output

Create:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/<YOUR-CFA-FOLDER>/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`

Use this heading structure:

```
# <CFA> — Boundary Round 1 Declaration

## Identity
## Responsibility
## OWNS / CONTRIBUTES / CONSULTS / OUT-OF-SCOPE
## Assigned Seams
### Seam 1
### Seam 2
### Seam 3
## Handoff Proposals
## Boundary Hazards
## Unresolved Questions for Peers
## Non-Authority Statement
## Evidence Index
```

### Completion message to the human router

After persisting the file, report only:

- file path;
- the 3 most important boundary claims;
- the 3 most important uncertainties/conflicts;
- the peer questions that need routing;
- whether you believe any claim requires human owner intervention.

The human router will relay needed peer questions. Do not assume peer agreement because the router summarized it.

## Important distinction

Your declaration is **your CFA's current claim**.

It is not yet a shared boundary.

The Architecture Steward will compare all declarations and produce the cross-CFA seam records.
