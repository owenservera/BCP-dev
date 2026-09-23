# LANES — first-lease brief for fresh parallel sessions
# STATUS (cleanup 2026-09-23): the UNIVERSAL RULES + LOOP PROTOCOL + COORDINATOR
# sections below remain current operating law. The LANE A/B/C FIRST-LEASE
# SEQUENCES are STALE (EXP-2026-004/005 are MERGING at L2; 006 never started) —
# do NOT take the leases named below without a fresh coordinator directive.
# Hand this file (plus agents/bootstrap.md) to each new agent session.
# Hand this file (plus agents/bootstrap.md) to each new agent session.
# Source of truth for state: state/*.yaml via bcp_tool.py ONLY. Never hand-edit.
# Plan context: docs/EXPERIMENTAL-PATHS.md (BCP-dev). Chrome-only per D-418/D-456.

## Universal rules (all lanes)
- Bootstrap first: agents/bootstrap.md (7 reads) + your role file.
- ALWAYS pass --experiment on acquire. Cross-scope leases are REFUSED.
- Blocked leases are REFUSED — that is the system telling you the order. Read `show <cap>`, build the requirement first.
- Standing autonomy (owner grant 2026-09-22, also in each experiment's standing_orders): you decide HOW (approach, tools, tests, layout). Installing packages, launching processes/browsers, and running real live tests — including live Chrome on owner-owned sessions — are PRE-APPROVED inside your experiment's scope. Stop and flag only for: new caps/edges/invariants, cross-lane changes, production auto-publish, anything outside Chrome-only law (D-418/D-456).
- Inbox protocol: between leases and at every heartbeat, read `agents/inbox/<your-window>.md` (W1/W2/W3/W4). Directives there from the coordinator/owner override prior lane text within scope. Newest entry wins.
- Use the `bcp_*` tools for all task/lease/log operations. Never edit YAML under `state/`, `log/`, `views/` directly.
- LOOP PROTOCOL (no user in the loop): after every lease release, in the SAME session: re-read inbox + lanes.md, run `available --experiment <your-exp>`, and immediately acquire the next leasable cap. Never end your session with unclaimed leasable work and no STOP directive. Report progress ONLY in state (evidence-noted bumps, discoveries, failures) — the user is never a step in any lane; do not message them for orders, confirmations, or next-steps. STOP conditions, and only these, end the loop: (a) a STOP directive in your inbox; (b) zero leasable caps in your experiment — log BLOCKED_ON_DEPENDENCY naming the blocker, keep heartbeat 3 cycles, then report done and stand by; (c) a REFUSED lease you cannot resolve within scope — flag require_human, keep heartbeat, stand by.
- Coordinator (W5, AGT-coord): triages, never builds. Runs sweep --fix --views + validate on cadence, reads inbox/W5.md, releases gates per standing rules, nudges hygiene via routine inbox entries (marked `via AGT-coord`). Escalates by parking (log + stand by), never by messaging the user. Spawn: `agents/prompts/w5-coordinator.md`.
- Heartbeat: `lease renew <cap> --agent <you>` about hourly — call `bcp_lease_renew` after every discrete unit of work (TTL 8h, stall 2h — sweep frees the stalled).
- Publish with evidence: `depth bump <cap> <L> --agent <you> --note "<what was proven>"`.
- Log lessons: `discovery add` for what worked, `failure add` for dead ends (applies-to your cap).
- Limits: 5 live leases per scoped_builder, 3 per fullscope_builder. One live lease per capability, globally.
- Coordinator/maintainer run on schedule (maintain.ps1 → sweep.py --fix --views every 5 min).

## LANE A — Chrome skeleton (1 agent: AGT-a1, scoped_builder)
Experiment: EXP-2026-004 (target L2). Chain only — one lease at a time:
1. `python bcp_tool.py available --experiment EXP-2026-004` → expect FAM-07.2
2. `python bcp_tool.py lease acquire FAM-07.2 --agent AGT-a1 --experiment EXP-2026-004 --depth-target L1`
   Build: Chrome-master/slave realization row + handler + stream config, realizationRef stamped, attach-only. No Ollama, no API-native, no local model. CLI only. Fixtures replay; live Chrome is the only live path.
3. `python bcp_tool.py depth bump FAM-07.2 L1 --agent AGT-a1 --note "<evidence>"` + `lease release FAM-07.2 --agent AGT-a1`
   Then, in order: FAM-07.1 (end-to-end CLI turn) → FAM-07.3 (one forbidden op refused + ledgered) → FAM-07.4 (ledger + headless query).
Pass-1 rule: dumbest honest slice first (message in → real response out, no law/provenance yet) to learn the true time-cost in days. Log the days-cost as a discovery on FAM-07.2 — Lane C starts on that number.

## LANE B — Intent fabric (2 agents: AGT-b1 + AGT-b2, scoped_builder)
Experiment: EXP-2026-005 (target L2). Two parallel roots day one:
- AGT-b1: `lease acquire FAM-08.1 --agent AGT-b1 --experiment EXP-2026-005 --depth-target L1`
  Build: Canonical Intent IR schema (typed, inspectable, versioned) + 10 golden intents (UNDERSTOOD / AMBIGUOUS / REFUSED / EXECUTED). Cap the corpus at 10 — grammar-forever is the named risk.
  Then: FAM-08.2 (classifier + lexicon, ambiguous tail confidence-attached, never silent) → FAM-08.3 (resolution → law/consent → op plan, injection battery green).
- AGT-b2: `lease acquire FAM-08.4 --agent AGT-b2 --experiment EXP-2026-005 --depth-target L1`
  Build: NLCL mine assay (60 legacy files as assay input, re-expressed fresh — nothing ports). Independent root; no dependency on b1.
Offline-testable except the ambiguous-tail battery, which replays from Chrome fixtures. Chrome-harvested intelligence on the tail ONLY — no Ollama, no API-native anywhere.

## LANE C — Strangler airlock (1 agent: AGT-c1, scoped_builder) — GATED, DO NOT START EARLY
Experiment: EXP-2026-006 (target L2). Entry gate (coordinator checks): FAM-07.2 ≥ L1 AND the Pass-1 days-cost discovery exists. Until then, this lane stays empty.
1. `lease acquire FAM-09.1 --agent AGT-c1 --experiment EXP-2026-006 --depth-target L1`
   Build: model→namespace map + count-preservation probe (201 Prisma models → ~16 vault namespaces, harvested rows or rollback).
   FAM-10.1/11.1/10.2/10.3/13.1 are already L2 — read them as context and satisfied requirements; do NOT lease them (pointless-lease warning).
2. Adapter work rides FAM-09.1 L1→L2: one browser surface behind the adapter, fixture replay, import searchable. Sunset clause stands: the adapter dies when its provider goes Chrome-canonical.
Depth discipline: pull/import + search deep first; live sync polling first; parity top 3–5 by value÷fragility; intelligence deferred; automation single explicit user-triggered actions only.

## Lane interaction map
- A feeds C (Chrome-canonical target) and B (execution target). B feeds A (intent entry) and C (same op vocab). C feeds A (proving ground) and B (real utterances).
- Kill lines (coordinator calls): A red (constitution can't carry 1 turn) → freeze B/C scope growth. B red (NL must stay LLM-driven) → intent stays adapter-only. C red (bridge costs > fresh build) → cut parity, keep airlock only.
- Shared collisions: none by construction — lanes hold disjoint lease sets; the single bridge edge (FAM-09.1 → FAM-11.1) is already satisfied (FAM-11.1 at L2).
