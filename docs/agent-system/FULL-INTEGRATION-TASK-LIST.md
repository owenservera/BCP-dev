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
| P2.1 | Steward→CFA→worker run with --auto | DONE | D2 full chain (steward→CFA-05→work-runner, verbatim stdout + exit 0, ses_f19f483de) + E headless steward→data-model spawn (verbatim echo, no stderr fallback, exit 0, ses_f19f48039/ses_f19f397c8). Chain vehicle = Task tool, never headless --agent |
| P2.2 | Verify chain evidence + record | DONE | PROBE-FINDINGS Wave-2 section + 4 CFA receipts (W2-D/D2/D3/D4) + validator PASS at delivery ref |
| P2.3 | Validate `--variant xhigh` on contributor-free | DONE (caveat) | xhigh accepted without rejection (probe 1); semantic effect UNKNOWN; E ran default variant |
| P2.4 | Diagnose work-scout/work-drafter empty leaf leg | BLOCKED | D5 forced-read scout EMPTY (scouts 3/3, drafter 1/1; runner 1/1 OK) → worker-type defect favored, cause inside opencode; unblock = version with working read-only legs or vendor diagnosis; U1 stays BLOCKED |

## S — Parallel opencode sessions

| # | Task | Status | Notes |
|---|---|---|---|
| S.1 | Topology rules (own copy, one writer, main rendezvous) | DONE | architecture doc §6 |
| S.2 | Two-process procedure (shell A/B, clones, identities, remote) | DONE | TWO-PROCESS-PROCEDURE-2026-09-28.md (CFA-10, W1-A) |
| S.3 | Two-process 10-point exchange run | TODO | needs S.2; same bar as v0 + cross-process attention. W3: full-scope attempt owner-terminated (no residue); re-scoped → S.3a harness DONE (s3-procA/B/lib.ts test-only, CFA-10, 245-line receipt) → S.3b steward-run next per receipt §4 commands (re-point $SHA to delivery HEAD) |
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
- 2026-09-28 M0/M1 wave (prompt `LOCAL-AGENT-M0-M1-UPGRADE-PROMPT-2026-09-28`,
  base `e1818205` == design baseline; delegation↔register↔roster 10/10, no
  drift): 4/4 CFA evidence units INVESTIGATED + steward-verified whole-read
  (CFA-10 runtime ledger; CFA-04 authority P1–P8; CFA-02 data extension; CFA-09
  compat envelope). Contract v1.1→v1.2 additive + `Validate-Receipt.ps1`
  (C1–C9, fail-closed, PROCEDURAL labels) implemented as corridor
  M0M1-CORRIDOR-01 (MODE=EXECUTION, SURFACE=LOCAL, one writer). Pre-commit
  validator: 4/4 C1+C3+C9 PASS, C8 FAIL-expected (uncommitted). Post-commit
  re-runs pending. P2.1 still DOING (Wave-2 D/E leaf-leg test next).
- 2026-09-28 W2 (base `e5ce9aac`, clean): D2 CFA-05→work-runner LEAF-LEG-OK
  (91 chars, exit 0 — full chain proven); D3 CFA-09→work-scout EMPTY;
  D4 CFA-07→work-drafter EMPTY, U1 UNTESTABLE-THIS-LEG; E headless
  steward→data-model spawn VALIDATED (verbatim echo, no fallback, exit 0, no
  writes). P2.1 DONE, P2.2 DONE, P2.3 DONE-caveat, new P2.4 TODO (empty-leg
  diagnosis, blocks U1). U1 BLOCKED. Next: S.3 Wave-3 + P2.4.
- 2026-09-28 W3 (base `e18c2005`, delivery on fresh main past sibling toolset
  wave): D5 forced-read scout EMPTY → P2.4 BLOCKED-with-evidence, U1 stays
  BLOCKED. S.3 full-scope attempt terminated (zero residue) → S.3a harness
  DONE (s3-procA/B/lib.ts + 245-line receipt; imports/src/origin clean).
  Sibling wave landed 30+ disjoint CFA-home files mid-turn (validator reuse
  observed); shared-main rule applied, no contention. Next: S.3b run.
- 2026-09-28 UPGRADE-DOCS (owner-directed, base `53e0cfb3`): non-technical
  goals doc + solo independent steward design doc committed (no CFA
  delegation — independence is the point). Findings: residency = cache, not
  identity (miss cost already low via proven spawns; M2 envelopes cut it
  further); `run -c/-s/--fork/--attach` + `session/export/stats` OBSERVED on
  1.18.4 → cheap continuity path (resume probe still open); dossier §04
  splits into adopt-now inbox-at-boot vs deferred no-spawn. Verdict: ratify
  warm-standby now, gate residency behind R0-serve probe + caps; B faster to
  set up, easier to maintain; A wins only on interactive latency if it
  qualifies. Next: S.3b run.
- 2026-09-28 MERGE-ALL (owner-directed, base `986c7d9c`): 3 reviewed merges,
  all docs-only, zero dry-run conflicts, zero dangerous paths (no Ω/src/
  config): (1) origin/main sync `afd6a1e1` (6 test-doc commits, 4 files);
  (2) design master-upgrade `3b617e9f` (29 commits, 19 files — dual-speed
  ratification + M0/M1 prompt + resident-team second opinion now on main);
  (3) test branch `28850105` (2 commits, fixture alignment). 25 stale
  coord/research branches surveyed and LEFT as lineage (ahead-counts are not
  merge signals; many already integrated via different SHAs). Receipt:
  `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/RESULTS/STEWARD-20260928-MERGE-ALL-01.md`.
