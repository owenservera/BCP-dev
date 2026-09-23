# PKT-002 — P1-01 dogfood findings (DIR-001 execution)

> **Classification: DERIVED — CURRENT**
> **packet id:** PKT-002 · **workstream:** WS-001 (P1-01)
> **source transcripts:** none new (local-agent drill; drill exchanges are
> handoffs/envelopes, preserved as such, not re-narrated here)
> **source handoffs:** HANDOFF-002/003/004 · **source evidence:**
> `outbox/IMPL-02/ITEM-001-directive-accept.md`,
> `outbox/TEST-01/ITEM-001-proof-table.md`,
> `outbox/DOC-01/ITEM-001-packet-qa.md`
> **extraction session:** `20260923-222400-dir-001-finish-p1-01-cooperative-agent-d`
> (Ω ledger) · **base:** `43c4400` · **branch:** `impl-02/p1-01-dogfood`
> **freshness:** CURRENT · **supersedes:** — (extends PKT-001, does not replace)

## Facts

| # | Claim | Source | Status |
|---|---|---|---|
| F1 | Proof table: 7 GREEN, 2 PARTIAL, 1 NOT-PROVEN across F-AGENT-* | TEST-01 evidence item (mechanical checks enumerated) | DERIVED-CURRENT |
| F2 | PKT-001 STANDS post-rewrite; no claim changed; no `-v2` warranted | DOC-01 QA item (claim-by-claim) | DERIVED-CURRENT |
| F3 | U-ledger (HANDOFF-001 open question) RESOLVED yes — ledger opens/streams for agent-system docs work | ledger session `20260923-222400-…` (this drill) | DERIVED-CURRENT |
| F4 | D-DOG-01: owner rewrite dropped packet/handoff backward links from CURRENT, WORKSTREAMS P1-01 row, WS-001 card | TEST-01 compaction check (grep + link audit) | DERIVED-CURRENT (defect, fix split below) |
| F5 | Tip-marker churn: every commit stales `Tip:` headers in DERIVED files | IMPL-01/IMPL-02 experience (two rolls in two commits) | DERIVED-CURRENT (defect, rule fix below) |
| F6 | Directive cited tip `f0685ed`, executed at `43c4400`; delta = directive file only | `git show 43c4400 --stat` | DERIVED-CURRENT (no scope drift) |
| F7 | No P1-02..P1-09, vivim.self, RATIFIED, BCP-state, or baseline contact | drill file inventory (all paths under `docs/agent-system/`) | DERIVED-CURRENT (constraint compliance) |

## Provenance pins (closes PKT-001 hash gap, SHA256, 2026-09-24, on branch)

- Charter transcript: `72E41969EAFD6280D04404E76D03BAD1EAD9ED2595E1B97A1012574329A477C7`
- PKT-001: `6D9F2F65DF73B90768C3B1EE68EC51997755982F447D5587A113935D79CA1528`
- DIR-001: `5E22E44F4E777E25441D0D926443866CD7CA3F22679AC7E850E1DF9901EBA9AA`

## Discovered concepts

- **Coordinator-advance link maintenance:** canonical files can move while
  derived chains rot. Compaction layers need a link-preservation invariant at
  integration time, not just at creation time.
- **Freshness precedent:** dated-but-accurate packets get reader-mappings in
  newer packets (§7), never silent patches; new versions are for changed claims.
- **Acceptance-via-outbox:** directive lifecycle closes its loop without
  touching the owner's file — agent signals ACCEPT in outbox, owner flips
  status. No new channel machinery needed (lighter than a README).

## Proposals (defect fixes)

- P-FIX-1 (on branch): WS-001 card evidence-chain section — restores launch-folder links.
- P-FIX-2 (on branch, flagged for review): SYSTEM.md update-rules amendment — (a) `Tip:` headers rolled at coordinator integration only; handoffs cite branch+commit as live tip; (b) every CURRENT/WORKSTREAMS integration preserves or refreshes packet/handoff backward links.
- P-PROP-1 (MERGE_REQUEST, coordinator-owned): ROSTER IMPL-02→ACTIVE; CURRENT + WORKSTREAMS P1-01 row regain packet/handoff links.
- P-PROP-2 (for owner): closers for the two open proofs — second agent from HANDOFF-004 alone (MULTI-AGENT independence); P1-01 ChatGPT conversation on boot+CURRENT only (CROSS-CHATGPT).

## Contradictions

- None new. C1/C2 verified intact post-rewrite (TEST-01).

## Unknowns (still open, owned)

- U1 packet-schema sufficiency for cross-ChatGPT continuity — needs the ChatGPT closer.
- U2 envelope sufficiency for true multi-thread dogfood — needs the second agent.
- U3 CURRENT budget under multi-workstream load — revisit when P1-02+ opens.

## Reasoning lineage

- **Why three identities on one thread:** directive asks "where practical" — the
  artifact chain (envelopes, handoffs, packets) is fully exercisable
  single-threaded and was; thread-independence is explicitly out of reach and
  marked PARTIAL rather than simulated. Theater was rejected in favor of a
  bounded honest claim.
- **Why PKT-001 stands:** DOC-01 walked all eight facts against the rewritten
  tree — aging is in forward pointers, not claims. The version rule (versions
  for changed claims) is itself a finding worth preserving.
- **Why the owner rewrite is evidence, not damage:** it was the first live
  coordinator-advance and it worked (orientation survived via boot path) while
  exposing exactly one gap class (D-DOG-01). The protocol learned more from
  this rewrite than from a clean drill.
- **Explicitly rejected:** cross-ChatGPT simulation (would be theater);
  PKT-001-v2 (no changed claims); directives/README (duplicates SYSTEM +
  ENVELOPE notes); touching coordinator-owned files in flight.

## §7 — Reading PKT-001 after the portfolio (reader mapping)

- "WS-002 blocked-next" → P1-04 / WS-004 (fold: CURRENT 2026-09-24, WORKSTREAMS lineage).
- "TEST-01 wall tests owed" → executed this drill (proof table).
- "U-ledger open" → RESOLVED yes (this session).
- ROSTER/WORKSTREAMS/CURRENT rows cited → superseded by 2026-09-24 coordinator versions; PKT-001's claims about them remain accurate *as of extraction*.

## Recommended reads

1. TEST-01 proof table + DOC-01 QA items (signed results — cite, don't re-run).
2. HANDOFF-004 (verdict inputs, changed files, next action).
3. Final MERGE_REQUEST (coordinator rulings owed).
