# CFA-05 — Receipt Index

> Agent: `agency-work-execution`
> Purpose: durable verification cursor for session receipts.
> Authority: operational index only; not Ω law, semantic authority, or proof.

LAST_VERIFIED_RECEIPTS_SHA: a854e792284aa29360ee1f6fa66b5205ce84c57e

## Receipts

| Session ID | Status | Receipt | Recorded commit | Verified |
|---|---|---|---|---|
| `CFA05-HOME-UPGRADE-20260927-0645CEST` | VERIFIED | `RESULTS/CFA05-HOME-UPGRADE-20260927-0645CEST.md` | `a854e792284aa29360ee1f6fa66b5205ce84c57e` | 2026-09-27 |

The recorded commit is the home-upgrade changeset. Future sessions must independently resolve current `main` and verify any receipt whose recorded commit is newer than this cursor before advancing it.
