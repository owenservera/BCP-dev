# CONTEXT — Appendix: full board, ledgers, inboxes, risks, checklists

Written 2026-09-22 by the master agent. Deep reference for `CONTEXT-system.md`
+ `CONTEXT-product.md`. Read those first; this is the lookup layer.

---

## 1. Full capability board (49 caps, live 2026-09-22)

Target vs current. Below-target caps are the only leasable future (plus 006's entry).

| Fam | Cap — name | Depth | Experiment / target | Standing |
|---|---|---|---|---|
| 01 | 01.1 Gate Runner · 01.2 Decisions Board · 01.3 Docscan · 01.4 Status & Brief · 01.5 Round Close | all L2 | 002 / L3 | 5 below target, exp proposed, never leased |
| 02 | 02.1 System Genome · 02.2 Compositions · 02.3 D-Record Checker · 02.4 Current Invariants | all L2 | 002 / L3 | 4 below target, never leased |
| 03 | 03.1 Contracts · 03.2 Host Core · 03.3 Shim · 03.4 Platform | all L2 | 002 / L3 | 4 below target, never leased |
| 04 | 04.1 Plugin Surface L2 · 04.2 Domain Packs L2 · **04.3 Examples L1** | mixed | 002 / L3 | 3 below target, never leased |
| 05 | 05.1 Surfaces · 05.2 SDK · 05.3 Testkit | all L2 | 002 / L3 | 3 below target, never leased |
| 06 | 06.1 Hermetic Boot · 06.2 Session Ledger · 06.3 Accept Ceremony | all L2 | 002 / L3 | 3 below target, never leased |
| 07 | 07.1 Vertical Slice · 07.2 Realization Row · 07.3 Law-Gated Stream · 07.4 Ledger+Query | all L2 | **004 / L2, merging** | AT TARGET. Nothing leasable |
| 08 | 08.1 Intent IR · 08.2 Perception · 08.3 Resolution · 08.4 Mine Assay | all L2 | **005 / L2, merging** | AT TARGET. Nothing leasable |
| 09 | **09.1 Airlock Forge L0** | L0 | 006 / L2, proposed | **THE open entry lease** |
| 10 | 10.1 Provider Graph · 10.2 Capability System · 10.3 Session&State L2 · **10.4 Streaming L1** | mixed | 003 / L2 (10.1/10.2/10.3 also 006 context) | 10.4 below target; 006-context caps held as satisfied requirements, DO NOT lease |
| 11 | 11.1 Storage Contracts · 11.2 Prisma System · 11.3 Prisma User L2 · **11.4 Seeds L1** | mixed | 003 / L2 (11.1 also 006 context) | 11.4 below target |
| 12 | **12.1 Plugin Kernel · 12.2 Intel Substrate · 12.3 IPluginContext · 12.4 Event Bus — all L0** | L0 | 003 / L2 | Kernel migration untouched — the 003 falsifier lives here |
| 13 | 13.1 Web App L2 · **13.2 Tauri Shell L1 · 13.3 Frontend Plugins L1** | mixed | 003 / L2 (13.1 also 006 context) | 13.2/13.3 below target |
| 14 | 14.1 Arch Tests L2 · **14.2 Fuzz Certifier L1 · 14.3 CI Loop L1** | mixed | 003 / L2 | Safety net partially up (arch green per 003 done_when claim; fuzz/CI at L1) |

Below-target count: 5 (L0: 09.1, 12.1–12.4) + L1s (04.3, 10.4, 11.4, 13.2, 13.3, 14.2, 14.3)
= matches live distribution (L2 37 / L1 7 / L0 5). L3 work (002) has never started anywhere.

## 2. Discovery ledger, condensed (21 — institutional memory, read before leasing)

- **001 (a1→07.2): the velocity number.** L1 stub ~0.05d; live 07.1 wiring = days not weeks. Lane C starts here.
- **002 (b1→08.1):** meaning_hash over normalized+action+slots+state+policy; GOLD-09==GOLD-01, GOLD-10==GOLD-02 (same triple, same meaning across UNDERSTOOD/EXECUTED).
- **003/004/006 (b2→08.4):** mine = 59 files → 63 intents, 16 categories, IR-ready; tail = 12 files with gates (det0.3/fuzzy0.7/sem0.6/cls0.55/llm0.5/help0.7); confirmation gate B2-CONF-xx mirrors IR v1.0.0.
- **005 (a1→07.1):** L1 reuses 07.2 handler by import; law/ledger flagged stubs for 07.3/07.4; live page-send deferred.
- **007 (b1→08.2):** longest-trigger-wins + structured-token masking; only L1 narrowing send+email-cue→email.send.
- **008 (a1→07.3):** allowlist 3 ops + forbidden table 8 keys; refusals to refusal-ledger.jsonl.
- **009/010 (b1→08.3): the boundary doctrine.** UNDERSTOOD verbs are NOT executable ops; consent-before-target compile order (gates traverse consent even with no target).
- **011 (coord→08.2): the safety repair.** Classifier rebound LAWFUL_OPS at import (closed-3→66); fixed to local RECOGNIZED_OPS + regression lock. Found by external verification.
- **012 (a1→07.4):** query unifies refusal-ledger + turn stub ts-ordered; every row why+evidence.
- **013 (b1→08.3):** alternatives passthrough (perception ≤3 visible at resolution).
- **014 (a1→07.3):** boundary-aware forbidden match; 20-row battery + ledger-replay.
- **015 (a1→07.4):** malformed input = skip-and-continue; empty = count-0; vault backing still stub.
- **016 (b1→08.2):** canonical normalization (politeness variants share one hash).
- **017 (a1→07.1):** asserts replaced by fail-closed refusals; live Chrome named as only live path.
- **018 (b1→08.1):** stdlib schema validator locks IR semantics; round-trip identity + drift refusal.
- **019 (a1→07.2):** row fence = exact id grammar + profile isolation; live attach needs owner session.
- **020 (b1→08.x): LOOP END.** 08.1/08.2/08.3 all L2 (gates 13/13 + adversarial 23/23 + replay green, cross-regression each bump).
- **021 (a1→07): LOOP END.** 07.1–07.4 all L2 on fixtures; only live work outstanding.
- **FAIL-001 (b2→08.4):** don't assay `src/engines/nlcl` shims as language (~30 re-export stubs + 3 flagged helpers).

## 3. Inbox standing orders (what each file orders right now)

- **W1:** 004 MERGED — stand by, rest state. (History: 07.4 order → LOOP IS LAW → merge notice.)
- **W2:** 005 MERGED — stand by **+ log formal b2-consumption confirm (theirs, still owed).**
- **W3:** hold till 23:04Z/b1 word then release + done. (Lease since expired by sweep — release-by-stall already happened 17:46Z; no action needed.)
- **W4:** bootstrap via lane-c.md, LOOP from first release. Gate OPEN, no amendments. (c1 never spawned.)
- **W5:** triage loop + one-shot idle-lane nudges (b1 L2 backlog — moot now, merged; c1 claim-or-state — still relevant).

## 4. Lease history (8 records, ALL closed — the full arc of the build day)

07.2 a1→released · 08.4 b2→**expired** (stall-freed 17:46Z, no activity 2h) ·
08.1 b1→released · 07.1 a1→released · 08.2 b1→released · 07.3 a1→released ·
08.3 b1→released · 07.4 a1→released. Zero active. Zero conflicts ever.

## 5. Risk register

| Risk | Status | Guard |
|---|---|---|
| Stubbing Compromise (row-green ≠ done) | contained (external-verify rule) | master re-runs every bump from its own shell |
| Constitution-First Stall | contained (2-pass rule) | Pass 1 dumb slice first, law one layer at a time |
| Grammar-Forever | contained (10-golden cap) | corpus capped, tail confidence-attached |
| LLM-in-trusted-path regression | contained (tails rule) | no Ollama/API-native anywhere, verified in suites |
| God-Adapter (adapter becomes product) | OPEN — Path C unstarted | sunset clause |
| Edge-Case Tar Pit (parity treadmill) | OPEN | 3–5 surface cap, poll-sync first |
| Fixture-vs-live gap (all L2s on fixtures) | OPEN — biggest truth-gap | live turn (option A) |
| Automation unstressed under live load | OPEN | shakedown rides first live cycle (option C) |
| Mid-save torn reads (proven 15x) | contained | verify-twice rule in MY-LOOP |

## 6. Checklists

**004 done_when:** fixture turn through law.check@1 streamed+ledgered+queryable + 1
refusal ✅ · live-vs-fixture substitution proven before live Chrome in tests ✅ ·
`omega:gate` green at tip ❌ NEVER CHECKED (owed or explicit deferral).
**005 done_when:** golden corpus deterministic ✅ · ambiguity asks, refusal
code+sentence ✅ · injection battery refused+ledgered ✅ · same intent/state/policy
→ same meaning ✅ (GOLD hashes).
**006 done_when:** counts preserved + searchable ❌ · 1 provider fixture replay ❌ ·
1 forbidden automation refused + no bulk stealth ❌ · all in-scope L2 ❌ (09.1 L0).
**002/003 done_when:** untouched.

## 7. Who's who

a1 = Lane A builder (Chrome skeleton) · b1 = Lane B builder (IR→resolution) ·
b2 = Lane B assay (mine) · c1 = Lane C builder (unspawned) · coord = W5 triage ·
watchdog/supervise/sweep = no-LLM mechanics · master (me) = sweep + verify +
direct + commit + track. AGT-seedprobe = day-one guardrail probe (history only).
