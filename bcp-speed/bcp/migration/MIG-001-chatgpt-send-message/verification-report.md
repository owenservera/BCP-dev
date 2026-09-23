# Verification Report — MIG-001 (independent re-run record)

> Builder and verifier are separated: this report is produced by re-running
> deterministic checks, not by trusting the builder transcript.

## V-1 Record conformance — GREEN
`verify_migration.py` V-1a..V-1e all PASS: required keys present, confidence
enum clean, canonicality TRANSFORM, disposition Transformed, id shape valid.

## V-2 Contract resolution — GREEN
All 7 touched contracts resolve to real files under
`omega-baseline/omega-final/contracts/src/`; zero new contracts introduced.

## V-3 Governor-exclusivity scan — INFORMATIVE (not asserted)
Pattern: non-`chrome-governor.ts` files under VIVIM `src/` with
from/require statements naming `cdp-transport`, `executor/cdp`,
`BunCdpClient`, or `chrome/cdp-proxy`. Result: **0 importers**.
Limits (explicit): `*.ts` only; no dynamic-import analysis; re-export-through-
Governor (`./chrome-governor.js`) correctly NOT counted as bypass; per-method
proxy audit still outstanding. Exclusivity remains DOCUMENTARY (G-1/G-2).

## V-4 No monolith import — GREEN
No real import/require of VIVIM sources in new migration code (checker
self-reference excluded by construction, documented in-script).

## V-5 Proof-ladder honesty — GREEN
Record labels live UNVERIFIED with a named unblock; no fixture-as-live
conflation detected mechanically.

## V-6 UNKNOWN discipline — GREEN
8 open unknowns carried; UNKNOWN observations remain UNKNOWN.

## BCP state health
- `validate.py`: GREEN — 49 capabilities, 8 lease records, 101 log events,
  0 errors, 0 warnings (run 2026-09-23 after DISC-022/023).
- `sweep.py` dry run: GREEN — 0 actions pending, 0 errors, 0 warnings.
- BCP `tests/test_bcp.py`: 26/28 pass. The 2 failures are PRE-EXISTING and
  reproduce identically with HEAD `state/discoveries.yaml` (verified by
  restore-and-rerun 2026-09-23):
  - `test_discoveries_and_failures_get_sequential_ids_and_show_up` hardcodes
    DISC-001/FAIL-001 but the seed state now holds 23+ discoveries
    (DISC-024/FAIL-002 observed) — stale test assumption from seed-state
    growth, not a regression from MIG-001.
  - `test_parallel_writers_lose_nothing` asserts a fixed discovery-ID list;
    same stale-assumption class.
  Both are recorded, not hidden, and not "fixed" by fiat — they belong to the
  BCP maintainer loop (stale-assumption test bug, not migration machinery).

## Overall verdict
STATIC: PROVEN. INTEGRATION: PROVEN-recorded-fixture (W1 harness pattern).
LIVE: UNVERIFIED. REGRESSION: UNVERIFIED.
Migration verdict: INTENTIONALLY_TRANSFORMED. Disposition: Transformed.
