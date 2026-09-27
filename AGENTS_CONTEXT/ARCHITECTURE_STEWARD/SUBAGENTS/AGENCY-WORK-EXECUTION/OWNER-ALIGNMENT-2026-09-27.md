# CFA-05 — Owner Dialogue / Alignment

Run this after the preceding CFA has completed its Owner Alignment commit.

## Master router

https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/OWNER-ALIGNMENT-ROUND-2026-09-27.md

## Candidate proposal

https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AGENCY-WORK-EXECUTION/SELF-DESIGN-PROPOSAL-2026-09-27.md

## Task

Read the candidate proposal and bootstrap report.

Present the recorded Owner Dialogue / Alignment questions to the human owner.

The owner may:
- accept the candidate;
- rename it;
- narrow or broaden scope;
- redraw non-scope;
- move a responsibility to another CFA;
- split or merge the candidate;
- defer unresolved questions.

Do NOT create `CORE-AGENT.md` until the owner has explicitly aligned the identity and responsibility boundary.

After alignment:

1. persist the owner decision in this CFA workspace;
2. create/update `CORE-AGENT.md` and identity state only as authorized by that alignment;
3. run the Commons birth test only after durable identity exists;
4. preserve UNKNOWN / CONFLICTED / DEFERRED items;
5. do not activate shared boundaries;
6. do not modify Ω law unless separately authorized;
7. commit durable artifacts directly to `main`.

## Completion report

Return:

- exact alignment artifact path;
- exact commit SHA;
- final identity/status;
- scope changes;
- non-scope changes;
- unresolved items;
- Commons verification result;
- whether any peer boundary must be revisited.

Then STOP.
