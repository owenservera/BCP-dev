# Leaf-Worker Catalog

> Date: 2026-09-28 · Status: ACTIVE (P1 built; P2 spawn proof pending)
> Workers hold no Commons identity and persist nothing. Parents verify everything.

| Worker | Tools | May write | Returns |
|---|---|---|---|
| `work-scout` | read/glob/grep/webfetch/websearch | nothing | locations + summaries + confidence |
| `work-researcher` | read/glob/grep/webfetch/websearch | nothing | cited evidence pack + unknowns |
| `work-drafter` | read/glob/grep + edit (envelope-scoped paths) | draft paths only | draft + diff summary |
| `work-verifier` | read/glob/grep/webfetch | nothing | CONFIRMED / REFUTED / UNRESOLVED + refs |
| `work-runner` | read + scoped shell | nothing | exit codes + verbatim logs |

## Rules (all five)

1. Leaves: no spawn permission, mechanically (`tools.task: false`).
2. No durable writes: no TASKS/RESULTS/Commons/posts. File writes by
   `work-drafter` are draft deliverables, verified by the parent before commit.
3. `work-verifier` is never the producer session of the claim it checks.
4. Envelopes bound each spawn: goal, scope, and (when budgets activate) ceilings.
5. Name-scoped spawn gating is unavailable on opencode 1.18.4 (object-valued
   `task` permission resolves to deny — tested 2026-09-28). CFA→`work-*`
   discipline is therefore prompt-level + delegation text until a version
   supporting it lands. Depth floor and least-privilege remain mechanical.

## Register maintenance

New worker types are added here with prompt, permission profile, and I/O
contract — never as undocumented one-off spawns. Removal requires checking no
envelope template references the name.
