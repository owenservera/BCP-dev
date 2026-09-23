# sessions/ — Ledger Pointer Records (not a second ledger)

> **Classification: convention (DERIVED — CURRENT)**

The Ω session ledger (D-430) is the system of record for sessions. This
directory stores only **pointers**: `sessions/SESSION-<ledger-id>.md` with
agent, mission, workstream, ledger bundle ref, open/close timestamps, close
digest, graduated-lesson refs, and linked handoffs/packets. Never commit
`dev-vault/` or raw ledger memory here — link it.
