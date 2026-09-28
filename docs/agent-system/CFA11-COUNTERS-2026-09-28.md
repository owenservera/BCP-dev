# CFA-11 Counters — Quantitative Review Triggers, Automated

> Date: 2026-09-28 · Owner: `evolution-compatibility-self-maintenance` (CFA-09)
> Wave: W1 `finish-full-list`, unit C · Base ref: `f1c971ad` (main)
> Authority: research/doc + bounded tooling only; not Ω law, not semantic
> authority, not a boundary activation. Trigger source definitions live in
> `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md`
> ("Quantitative review trigger"); this file automates them, it does not amend them.
> Triggers are **review triggers, not automatic birth conditions**: the Steward
> records the evidence and the owner decides whether Epistemic Integrity becomes
> a dedicated Core Function Area (CFA-11).

## What each counter scans

| # | Counter | Canonical source scanned | Row/record rule |
|---|---|---|---|
| 1 | PENDING receipts simultaneously indexed | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/RECEIPTS.md`, index table | STATUS cell exactly `PENDING` (status model `PENDING → VERIFIED → RECONCILED`, header of same file) |
| 2 | Open contradictions in active reconciliation state | **No canonical registry designated** — see §2 | UNKNOWN (not 0); override only via Steward-designated file + marker |
| 3 | Age of oldest pending receipt | Same RECEIPTS.md table, DATE column of PENDING rows | Calendar days: run-date UTC minus DATE (`yyyy-MM-dd`); N/A when zero pending |

Script: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE/TOOLS/cfa11-counters/Get-CFA11Counters.ps1`
(run: `pwsh -NoProfile -File <script>`; single-host, read-only, exit 0 = scan
succeeded, non-zero = scan failure).

## Definitions

- **PENDING**: a receipt row whose STATUS cell in the RECEIPTS.md index table
  reads `PENDING` — present and awaiting repository verification. `VERIFIED`
  (checked at recorded ref) and `RECONCILED` (Steward incorporated downstream
  updates) rows do not count.
- **Open (contradiction)**: a contradiction record in the Steward's designated
  active reconciliation state that is not marked resolved, reconciled, or
  closed. No file on this tree is designated as that state (candidates checked
  listed in verbatim output §4), so the counter is **UNKNOWN**. Reporting 0
  would assert "no contradictions exist" — an invented semantic. UNKNOWN
  preserves CFA-09's invariant that unknown impact remains UNKNOWN.
- **Oldest (pending receipt)**: the maximum calendar-day age over PENDING rows.
  Timezone rule: UTC date arithmetic; a same-day pending receipt has age 0.
  With zero pending rows the age is N/A and trigger 3 evaluates NOT-TRIGGERED
  with that note.

## §2 — Counter-2 unblock path (for the Steward)

Counter 2 becomes a number when the Steward designates, in the register or a
ratified note: (a) the canonical active-reconciliation file, and (b) the
countable open-marker convention (e.g. a table STATUS value or line marker).
The script already accepts both:

`pwsh -File Get-CFA11Counters.ps1 -ContradictionsFile '<rel-path>' -OpenMarker '<regex>'`

Until then, any session re-running the script with no arguments reproduces
`open_contradictions = UNKNOWN` with the checked-candidate list as evidence.

## Falsifiers

- F1: a `PENDING` row exists in RECEIPTS.md that the script missed
  → hand-check `Select-String -Pattern '\|\s*PENDING\s*\|'` must equal counter 1.
- F2: a Steward-designated canonical contradiction registry exists that §2
  claims is absent → counter 2 UNKNOWN is refuted; re-run with the override.
- F3: RECEIPTS.md DATE values not in `yyyy-MM-dd` → script exits non-zero
  rather than guessing (observed 2026-09-28: all dates parse).
- F4: clock skew — run_utc is printed in every output; ages are UTC calendar
  days, reproducible by any second session same-day.

## §4 — Verbatim run output (2026-09-28, tree at f1c971ad)

Hand-check (same tree): `PENDING` grep hits = 0; total `^|` table lines = 11
(1 header + 1 separator + 9 VERIFIED rows). Matches counter 1.

```text
CFA-11 review-trigger counters
run_utc: 2026-09-28 01:48:57Z
repo_root: C:\0-BlackBoxProject-0\Vivim-omega\BCP-dev
source_receipts: AGENTS_CONTEXT/ARCHITECTURE_STEWARD/RECEIPTS.md
counter[1] pending_receipts = 0
counter[2] open_contradictions = UNKNOWN (no Steward-designated canonical active-reconciliation registry on this tree; reporting UNKNOWN (not 0) per no-invented-semantics rule)
counter[2] candidates_checked:
  - AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OWNER-DIGEST.md [present, no canonical open-contradiction registry]
  - AGENTS_CONTEXT/ARCHITECTURE_STEWARD/STATE.md [present, no canonical open-contradiction registry]
  - AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CURRENT-MISSION.md [present, no canonical open-contradiction registry]
  - AGENTS_CONTEXT/ARCHITECTURE_STEWARD/MASTER-PORTFOLIO-STATE-RECONCILIATION-2026-09-27.md [present, no canonical open-contradiction registry]
  - AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CFA-STRATEGIC-ROADMAP-CENTRAL-2026-09-27.md [present, no canonical open-contradiction registry]
counter[3] oldest_pending_age_days = N/A (zero pending receipts)
trigger[1] (pending > 10): NOT-TRIGGERED
trigger[2] (open contradictions > 5): UNDETERMINED
trigger[3] (oldest pending > 7d): NOT-TRIGGERED (no pending receipts)
verdict: INDETERMINATE (counter 2 unresolved; known counters fire no trigger)
EXIT=0
```

## Reading of the result

Known counters fire no trigger (0 pending ⇒ oldest age N/A). Overall verdict
is INDETERMINATE solely because counter 2 awaits Steward designation — this is
a documentation/provenance gap, not evidence of contradiction load. H.3
remaining work: Steward designates the counter-2 source (§2); then any session
re-runs one command and the verdict becomes fully mechanical.
