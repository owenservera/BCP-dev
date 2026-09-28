# Full Integration — Master Task List

> Date: 2026-09-28 · Baseline: `main`
> This file is the durable master list. Every Steward working session updates it
> every turn (status flips + line per turn in §9 log). Session-local mirrors
> (todowrite etc.) are disposable; this file wins.
> Authority: task memory only; not Ω law or semantic authority.

## Status key

`DONE` verified on current tree · `DOING` active this turn · `TODO` queued ·
`BLOCKED` with reason + unblock path · `PARKED` deliberately deferred.

## G0 — Shared baseline (DONE)

| # | Task | Status | Evidence |
|---|---|---|---|
| G0.1 | Sandbox → main integration (PR #68) | DONE | merge a3b86ff, receipt da40571f |
| G0.2 | Gate B local readiness | DONE | RESULTS/LOCAL-20260928-GATEB-READINESS.md, 6/6 suite |
| G0.3 | Consolidated architecture doc | DONE | AUTONOMOUS-TEAM-ARCHITECTURE-2026-09-28.md |
| G0.4 | Gaps + prep docs | DONE | FULL-SYSTEM-TEST-GAPS-AND-PREP-2026-09-28.md |

## P1 — Worker tier (DONE)

| # | Task | Status | Evidence |
|---|---|---|---|
| P1.1 | Five `work-*` bindings (leaf floor) | DONE | `.opencode/agents/work-*.md`, all resolve |
| P1.2 | Worker catalog register | DONE | WORKER-CATALOG-2026-09-28.md |
| P1.3 | CFA flip task:false→true + work-only rule | DONE | 10 files, spot-verified |
| P1.4 | Delegation amendment (leaf rule, budgets deferred) | DONE | OWNER-DELEGATION.md |
| P1.5 | `subagent_depth: 2` set + documented | DONE | `.opencode/opencode.json`, docs-confirmed semantics |
| P1.6 | Name-scope impossibility proven on 1.18.4 | DONE | probe → task:false; catalog rule 5 |

## P2 — Live spawn proof (DOING)

| # | Task | Status | Notes |
|---|---|---|---|
| P2.1 | Steward→CFA→worker run with --auto | DOING | first attempts hit depth-1 limit (fixed), permission auto-reject (fixed via --auto), then owner-interrupted |
| P2.2 | Verify chain evidence + record | TODO | needs P2.1 full transcript |
| P2.3 | Validate `--variant xhigh` on contributor-free | TODO | validity unknown; fallback plain model |

## S — Parallel opencode sessions

| # | Task | Status | Notes |
|---|---|---|---|
| S.1 | Topology rules (own copy, one writer, main rendezvous) | DONE | architecture doc §6 |
| S.2 | Two-process procedure (shell A/B, clones, identities, remote) | DONE | TWO-PROCESS-PROCEDURE-2026-09-28.md (CFA-10, W1-A) |
| S.3 | Two-process 10-point exchange run | TODO | needs S.2; same bar as v0 + cross-process attention |
| S.4 | Multi-session standing practice (N sessions, steward each) | TODO | needs S.3 green |

## N — Setup-needs identification (continuous)

| # | Task | Status | Notes |
|---|---|---|---|
| N.1 | Worker needs (5 types + contracts) | DONE | catalog |
| N.2 | Remaining-needs docs (roadmap + requirements + gaps) | DONE | three docs on main |
| N.3 | Mine roadmaps/M1 packets for Phase 3 inputs | DONE | PHASE3-INPUTS-2026-09-28.md (CFA-06-led, W1-B; 10/10 roadmaps + 10 packets) |
| N.4 | Re-identify needs after each phase | TODO | standing rule, not one-off |

## Phase 2b — Harden

| # | Task | Status | Notes |
|---|---|---|---|
| H.1 | Two-host v0 evidence | BLOCKED | no second machine; needs S.3 first anyway |
| H.2 | Rotation operation + drill | BLOCKED | needs real rotation op (CFA-04) |
| H.3 | CFA-11 counters automated | DONE | CFA11-COUNTERS-2026-09-28.md + Get-CFA11Counters.ps1 (CFA-09, W1-C; re-run green by steward; trigger-2 awaits contradiction-registry designation — owner question, not automation gap) |

## Phase 3 — Realtime + tools (all TODO, gated)

A2A-live adapter · presence-loop daemon (register first) · MCP mesh (4 servers +
manifests/redaction/budgets) · waiting-policy file + scenario tests. None start
before P2/S.3 green and an explicit owner go.

## Phase 4–5 — Dogfood + operations (PARKED)

Self-rebase slice · digest automation · receipt sweep · Cycle 4 re-evaluation ·
integration PRs. Parked behind Phase 3.

## Standing falsifiers

Transport-divergent event fails build · gateless consequential effect is a
defect · credential bytes in any event invalidates slice · lineage break
without additive repair blocks integration.

## 9. Turn log (append-only, newest last)

- 2026-09-28: list created from architecture+gaps+Gate-B evidence; P1 DONE;
  P2 DOING (depth + auto fixes landed, full-chain run pending).
- 2026-09-28 W1 (`finish-full-list`, base f1c971ad): 3/3 CFA units PARTIAL→
  steward-verified. S.2 DONE (two-process procedure, CFA-10). N.3 DONE
  (Phase-3 inputs mined, CFA-06; leaves returned empty, all claims direct-read).
  H.3 DONE (counters automated + steward re-run green; counter-2 UNKNOWN pending
  registry designation). P2.1 still DOING (steward CLI probe next).
