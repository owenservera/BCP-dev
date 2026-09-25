# VIVIM V1 Implementation Slices

> Small product-shaped slices. Each slice should traverse enough of the spine to expose hidden coupling.

## S0 — Protect Ω
No new semantic architecture. Verify the current gate and isolate bridge work.

## S1 — One real governed provider turn
Instance → Account → Session → BrowserResource → Routing → Realization → Effect → Result → Evidence

Target: one authenticated account, one intended resource, one governed send, one attributable receipt.

Depends on D1 + E1.

## S2 — Two-account isolation
Account A → Resource A
Account B → Resource B

Target: alternating and concurrent requests, explicit ownership, no account substitution.

Depends on E2.

## S3 — Recovery
Close/restart browser and VIVIM; safely exercise auth expiry where possible; reconstruct.

Target: same relationship recovered when provable, otherwise explicit refusal/re-auth.

Depends on E4.

## S4 — Canonical object
Create a new durable typed object and take it through:
Create → Identify → Relate → Modify → Version → Project → Reference → Export → Restore

Target: one stable identity; no duplicate truth.

Depends on D2 + E6.

## S5 — Durable Work
Run a multi-step Work that survives process restart.

Target: checkpoint, effect receipt, explicit interruption, safe continuation.

Depends on D3 + E7.

## S6 — Provider knowledge
Assemble current provider knowledge from existing evidence without creating a second authority store.

Target: explainable current knowledge, provider-specific extension boundary, drift state.

Depends on D4.

## S7 — Fresh self-knowledge
Change a canonical basis and prove derived views transition from CURRENT to STALE or recompute.

Depends on D5 + E8.

## S8 — Third-provider falsifier
Add a materially different provider through the existing capability semantics.

Target: no product-level branch for incidental provider behavior.

Depends on E5.

## S9 — Legacy behavioral floor
Integrate account-aware provider use, conversation continuity, workspace/project/canvas organization, background work, export/recovery, discovery/healing.

Target: behavior parity through destination contracts, not code parity.

## S10 — Product Instance continuity
Start → Initialize → Useful action → Close → Reopen → Same world/continuity

Then add product shell concerns separately.
