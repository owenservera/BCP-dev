# CFA-05 — Receipt Index

> Agent: `agency-work-execution`
> Purpose: durable verification cursor for session receipts.
> Authority: operational index only; not Ω law, semantic authority, or proof.

LAST_VERIFIED_RECEIPTS_SHA: e29cd3068d67ce273a869bdc390afc8f45a12243

## Receipts

No prior CFA-05 session receipt was present in this home when the home-upgrade session started.

This index is maintained according to FSSP-1.3 / Session Result Contract v1.1. Future sessions must verify receipts whose recorded commit is newer than `LAST_VERIFIED_RECEIPTS_SHA` before advancing the cursor.
