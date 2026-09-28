# U1 — Governed Native Task Delegation

> OpenCode target: v1.18.4
> Status: ACTIVE / PROPOSED
> Primary question: can a resident autonomously request bounded worker capacity through native OpenCode Task while Ω retains a narrow governance boundary?

## Canonical U1 documents

The primary U1 design remains in the resident-team lab docs:

- [Design](../../../docs/FIRST-MAJOR-UPGRADE-DESIGN.md)
- [Research basis](../../../docs/FIRST-MAJOR-UPGRADE-RESEARCH-BASIS.md)
- [Checkpoints](../../../docs/CHECKPOINTS.md)
- [Risk register](../../../docs/FIRST-MAJOR-UPGRADE-RISK-REGISTER.md)
- [Proof log](../../../docs/PROOF-LOG.md)

The OpenCode-specific lane here is a **research index and evidence bridge**, not a duplicate law.

## U1 topology

```
team-root
    |
    v
research-resident
    |
    v
research-worker
```

The resident decides demand.

The runtime/plugin evaluates whether that demand is authorized and admitted.

OpenCode native Task performs the actual child creation/execution.

## U1 OpenCode assumptions under test

- V1.18.4 native Task creates fresh child sessions with parentage.
- target-specific Task permission is effective at execution time.
- `subagent_depth = 2` supports root -> resident -> worker.
- worker Task denial can establish a mechanical leaf boundary.
- plugin `tool.execute.before` can provide a narrow preflight gate.
- `task_id` is not admitted for fresh U1 spawning.
- foreground Task is used before asynchronous/background behavior is qualified.

## U1 non-claims

U1 does **not** establish:

- safe arbitrary Task resume;
- a general scheduler;
- resident-to-resident Commons;
- ten-resident concurrency;
- live self-evolution;
- acceptance semantics;
- Ω constitutional authority encoded by OpenCode.

## Evidence bridge

| U1 checkpoint | OpenCode research reference |
|---|---|
| CP-01 permission matching | [01-NATIVE-SUBSTRATE.md](../../01-NATIVE-SUBSTRATE.md), OC-S02/OC-S03 |
| CP-02 fresh native child | [01-NATIVE-SUBSTRATE.md](../../01-NATIVE-SUBSTRATE.md), OC-S01/OC-S06 |
| CP-03 plugin preflight | [01-NATIVE-SUBSTRATE.md](../../01-NATIVE-SUBSTRATE.md), OC-S04/OC-S05 |
| CP-04 leafness | [01-NATIVE-SUBSTRATE.md](../../01-NATIVE-SUBSTRATE.md), alternate-surface section |
| CP-05 demand choice | broader resident-team design + native Task |
| CP-06 idempotency | [05-EVIDENCE-AND-GAPS.md](../../05-EVIDENCE-AND-GAPS.md) |
| CP-07 unsafe resume | OC-S01 + issue #41681 watch |
| CP-08 durable evidence | local lab artifacts + U1 design |
| CP-09 failures | [04-WINDOWS-AND-HEADLESS.md](../../04-WINDOWS-AND-HEADLESS.md) + checkpoints |

## Current research posture

The strongest external implementation reference remains the locally vendored `opencode-swarm`.

The strongest native orchestration comparison is `oh-my-opencode`.

The U1 objective is not to choose between them abstractly. It is to determine, with live evidence, how much of the resident model can be carried by native OpenCode Task + plugin hooks while keeping the VIVIM authority/evidence boundary explicit.
