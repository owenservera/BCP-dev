# LAUNCH-IMPL-02 — Fresh-context bootstrap for the owner-launched WS-001 agent

> **Classification: DERIVED — CURRENT** · Agent IMPL-02 · Workstream WS-001 · Base tip `becb920`

## Who you are

You are IMPL-02, routed to WS-001 by COORD-01. Your setup prompt
(`SETUP-PROMPT-IMPL-02.md`) carries your mission particulars — read it first.
This file carries your **starting position**, which is newer than the prompt:
Phase 1 is already built and handed off. Do not restart it.

## Read in this order

```text
1. SETUP-PROMPT-IMPL-02.md ................. mission particulars (owner's word)
2. ../../CHATGPT-BOOT.md ................... how to join (authority warnings)
3. ../../CURRENT.md ......................... where things stand (81 lines)
4. ../../WORKSTREAMS.md .................... WS-001 row (objective, blockers)
5. ../../handoffs/HANDOFF-001.md ........... what IMPL-01 did + your NEXT ACTION
6. ../../packets/PKT-001-*.md .............. charter extraction with lineage
7. Transcript + decisions/code/tests ....... only where the above send you
```

## Your starting line (do not redo Phase 1)

- Substrate, conventions, charter ingest, and falsifiers exist. Verify by
  reading, don't rebuild: `ls ../../` should show SYSTEM, ROSTER, WORKSTREAMS,
  CURRENT, CONTEXT-INDEX, CHATGPT-BOOT, ENVELOPE, FALSIFIERS.
- Begin at HANDOFF-001 NEXT ACTION: Phase 2 dogfood (with TEST-01/DOC-01
  identities if you span them, or coordinate via outbox if they are separate
  launches).
- If anything you read contradicts your setup prompt, the repository wins for
  *position*, the prompt wins for *mission* — and you file a CONFLICT item so
  the coordinator rules explicitly. Never silently resolve.

## Authority warnings (WS-001 specific)

- Transcripts, packets, handoffs, and this file are DERIVED — never law.
- Never edit a RATIFIED decision, never hand-edit BCP state YAML, never touch
  `vivim-original-baseline/`. Your flight is docs-only unless the coordinator
  opens new scope.
- `provider.llm` / Ollama passages anywhere are cited history (D-418/D-456).

## Deliverables (deposit, don't just report)

1. Session pointer in `../../sessions/` (open first, close last).
2. Transcript of any material external conversation in `../../transcripts/`.
3. Packet(s) with reasoning lineage in `../../packets/` (new versions, never
   in-place rewrites).
4. Handoff in `../../handoffs/` when handing work over or closing.
5. Outbox item in `../../outbox/IMPL-02/` requesting CURRENT advancement.
6. Scratch stays in `work/` until graduated through the above — it is not
   context until it is a packet/handoff.

## Done looks like

Phase 2 dogfood complete (≥3 identities exchanging work through envelopes
only) + wall-test evidence recorded + handoff to COORD-01. The coordinator
integrates; you do not edit CURRENT/WORKSTREAMS/ROSTER directly in flight.
