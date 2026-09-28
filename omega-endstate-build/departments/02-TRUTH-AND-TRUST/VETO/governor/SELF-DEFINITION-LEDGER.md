# VETO-01 Self-Definition Ledger

> Status: LIVE
> Purpose: durable memory of recurring limitations that may justify changing the department.

Record observations before structural changes. A single observation normally justifies only a repair or experiment; recurrence can justify specialization or machinery.

## Entry format
- ID:
- Date:
- Observation:
- Evidence:
- Recurrence:
- Affected boundary:
- Candidate response:
- Status: OBSERVED | HYPOTHESIS | EXPERIMENT | ACCEPTED | REJECTED | RETIRED
- Result/evidence:
- Lineage:

## Initial bootstrap entries

### SD-001 — Disposition vocabulary drift
- Date: 2026-09-28
- Observation: COLD-START-PROMPT.md and RESULT-TEMPLATE.md used REQUEST-EVIDENCE while VETO-PROTOCOL.md previously listed only NO_VETO and VETO_PROPOSED.
- Evidence: direct inspection of current department files.
- Status: ACCEPTED
- Candidate response: normalize the decision vocabulary and retain REQUEST-EVIDENCE as an explicit non-veto state.
- Result/evidence: VETO-PROTOCOL.md normalized in this bootstrap.

### SD-002 — Queue status parser defect
- Date: 2026-09-28
- Observation: Get-VetoQueue.ps1 contains a malformed regular expression for extracting task status.
- Evidence: direct source inspection.
- Status: ACCEPTED
- Candidate response: correct the parser; add execution coverage later.
- Result/evidence: parser corrected in this bootstrap.

### SD-003 — Self-integrity checking is weaker than the governance model
- Date: 2026-09-28
- Observation: Check-VetoDepartment.ps1 validates file presence and JSON parsing but not cross-file contract/reference integrity.
- Evidence: direct source inspection.
- Status: ACCEPTED
- Candidate response: add a durable self-audit protocol and ledger now; evolve the executable checker later through a bounded experiment.
- Result/evidence: protocol and ledger activated; checker expansion remains proposed.

### SD-004 — Concurrent task mutation risk
- Date: 2026-09-28
- Observation: task IDs are derived by scanning files and task claiming has no dedicated atomic command.
- Evidence: Add-VetoTask.ps1 and QUEUE-RUNBOOK.md.
- Status: HYPOTHESIS
- Candidate response: measure actual concurrent usage before adding locking or transactional storage.
- Result/evidence: no runtime concurrency test in this session.

## Rule
Do not convert a one-off discomfort into a new permanent organizational boundary.
