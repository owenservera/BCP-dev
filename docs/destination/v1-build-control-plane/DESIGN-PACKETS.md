# V1 Design Packets

> Minimum designs required before corresponding implementation broadens.

| ID | Packet | Closes | Depends on | Exit |
|---|---|---|---|---|
| D1 | Account / Session / Browser Resource / Routing | identity, ownership, lifecycle, route policy | Ω realization | executable candidate contract; E1–E4 close its unresolved physical semantics |
| D2 | Canonical Object / Relationship / Lifecycle | object identity, typed payloads, revision, projection, export/restore | Ω vault/evidence | E6-ready data contract |
| D3 | Durable Work | outcome identity, checkpoint, plan/intent linkage, recovery | D2 + evidence | E7-ready work contract |
| D4 | Provider Knowledge | derived aggregation, evidence basis, extensions, drift | provider discovery/realization | E5-ready knowledge boundary |
| D5 | Self-Knowledge Freshness | basis/digest, invalidation, recomputation | D2 + D4 | E8-ready freshness contract |

## D1 — candidate before experiments
Must define Account as a first-class user-owned relationship to Provider; Session as execution state; BrowserResource as leaseable/recoverable substrate; debugPort as locator only; routing as policy over valid candidates; selection as reconstructable evidence.

Do not decide from assumption:
- minimum account proof;
- safe resource granularity;
- profile/process/target ownership;
- concurrency semantics;
- recovery behavior.

Those belong to E1–E4. D1 becomes implementation-ready only after those experiments close or explicitly narrow the candidate.

## D2
Define shared object envelope metadata, typed semantics, Relationship identity, lifecycle/revision, projection boundary, export/restore identity preservation.

Reject universal semantic superclass, UI-as-truth, and duplicated Work copies.

## D3
Define durable Work identity; Intent=request; Plan=procedure; execution/session=current mechanism; checkpoint boundaries; duplicate-effect protection; terminal outcome + evidence.

## D4
Define source inputs, derived view shape, provider vs extension, evidence basis, freshness inputs, drift/repair/probation. It must not become a second authority database.

## D5
Define basisRefs, basisDigest, dependency versions, CURRENT / STALE / UNRESOLVABLE / CONFLICTED, invalidation/recompute, authority separation.

## Packet completion
A packet is complete when semantics are explicit, falsifiers named, acceptance testable, implementation can begin without inventing a second model, and remaining unknowns have a named experiment or owner decision.
