# V1 Experiment Board

> Operational wrapper around Pass 3 E1–E8. No experiment is claimed complete here.

| ID | Objective | Prereq | Evidence required | Blocks | Status |
|---|---|---|---|---|---|
| E1 | One real account chain | D1 | attributable account/session/resource/effect/evidence chain | account/resource identity | UNRUN |
| E2 | Two-account isolation | E1 | independent identity proofs, no cross-use | isolation/ownership | UNRUN |
| E3 | Concurrent resource work | E1+E2 | lease ownership, no contamination, recovery state | concurrency | UNRUN |
| E4 | Expiry/restart/recovery | E1 | recover same identity or explicit refusal | lifecycle/reconnect | UNRUN |
| E5 | Materially different provider | D4 + working slice | semantic contract survives; provider details stay at realization | provider generality | UNRUN |
| E6 | New durable object lifecycle | D2+D3 | world→surface→work→evidence→export→restore | object generality | UNRUN |
| E7 | Restart durable Work | D3 | identity/checkpoint/recovery/no silent duplicate effect | continuity | UNRUN |
| E8 | Self-knowledge freshness | D5 | basis change yields stale/recomputed view | trustworthy introspection | UNRUN |

## E1–E4 external gate
The sequence is intentional: E1 → E2 → E3 → E4.

Do not parallelize assumptions about ownership that E1 has not established.

## Falsifiers
- E1: locator/debugPort cannot prove intended account/resource chain.
- E2: any cross-account target ambiguity or effect.
- E3: resource ownership/locking cannot be made observable.
- E4: restart/expiry permits silent best-effort reattachment to another identity.
- E5: second provider requires a product-level semantic fork for an incidental difference.
- E6: new object needs a second storage/evidence/surface authority.
- E7: interrupted process leaves Work identity or effect status unknowable.
- E8: derived view remains CURRENT after authoritative basis revision.

## Required record
EXP-ID / hypothesis / setup / environment / inputs / observed trace / evidence / falsifier result / decision / code impact / next gate

Live evidence must identify the actual account/session/resource chain without exposing secrets.
