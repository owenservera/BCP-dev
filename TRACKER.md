# BCP LANES TRACKER — owner view
> STATUS NOTE (cleanup 2026-09-23): parked-snapshot. Time-bound orders below
> (holds till 23:04Z, expiries 23:18Z on 2026-09-22) are expired. Board state —
> Paths A+B merging at L2, Path C released but unstarted, automation Tasks 1–6
> PASS — is confirmed current by `docs/CONTEXT-appendix.md` §3–§4. Anything
> below that contradicts `docs/CURRENT-CONTEXT.md` loses to it.
# Updated: agentic automation full setup landed (5n + follow, all 6 tasks PASS).
# Board still parked clean (0 actives). Resume order when ready: W0 loop +
# BCP-Serve + BCP-Supervise (run ops-install.ps1), then lanes by inbox with
# BCP_LANE_CAP/BCP_AGENT set (ralph armed). Ping me and I sweep.

## ✅ YOUR ACTIONS — nothing. System runs itself.
# (All windows live or directed. Ping me anytime and I sweep.)

## 📨 INBOX STATUS (what each file currently orders)
- **W1**: EXP-004 MERGED — stand by, rest state.
- **W2**: EXP-005 MERGED — stand by + log formal b2-ledger consumption confirm (theirs).
- **W3**: hold till 23:04Z+/b1 word, then release + done.
- **W4**: bootstrap via lane-c.md, LOOP from first release.
- **W5**: triage loop (nudges tasked for b1-quiet/c1-unclaimed if still so).

## ⏳ WHAT I'M WAITING ON — nobody. Full rest, all windows stopped (verified).
- Builders: released everywhere except b2's 08.4 hold (active till 23:18Z, no heartbeat — sweep frees on stall/expiry at W0 resume; harmless, nothing else wants 08.4).
- Owed on resume: b1's formal consumption word (releases b2), c1's 09.1 claim.
- W0 loop down: views/metrics frozen at last regen; refresh on resume. Resume order: W0 first, then lanes by inbox.

## 🗺️ BOARD IN PLAIN WORDS
| Window | Who | Job | Status |
|--------|-----|-----|--------|
| W0 | maintenance + timers | keeps the board clean | STOPPED — restart to refresh views/metrics |
| W1 | a1 | Path A (07.1–07.4) | ALL L2 ✅ verified | EXP-004 MERGING, standing by |
| W2 | b1 | Path B (08.1–08.4) | ALL L2 ✅ verified | EXP-005 MERGING, owes b2-consumption word |
| W3 | b2 | Mine assay hold | holding 08.4 (expires 23:18Z) |
| W4 | c1 | Airlock (09.1) | subscribed, unclaimed — W5 nudged once |
| W5 | coord | triage | LIVE |

## 🔬 VERIFIED SO FAR (my shell, not their word)
- 07.2 + 07.1: tests green, real CLI turns stream, refusals honest, single shared handler (no duplicate architecture).
- 07.3: 5/5 green, refusals exit 2 with code+sentence ledgered, allowed turns exit 0 stamped+ledgered (my probes included).
- 08.2: battery 43/20 zero wrong-op — mine-verb UNDERSTOOD actions carry op_plan=None; verb→lawful-op map explicitly 08.3 scope; lawful-set contamination FOUND + FIXED (classifier rebinding → local RECOGNIZED_OPS, regression test, 8/8).
- 08.3: battery 8/8, map 63 rows (2 direct + 61 clarify with basis), closed-3 intact, hash recipe runtime-identical B1==B2. L2: adversarial 10/10 + gate 8/8 re-verified (first run caught b1 mid-save — verify-twice rule now law).
- 07.4: tests green, headless query returns refusal rows with code+sentence+why+evidence.
- 08.4: confirmation gate 8/8, assay battery 4/4, all 59 files accounted for.
- B1↔B2 handoff: proven at runtime — both sides compute byte-identical hashes; the 63-verb mapping is scoped to b1's current job, the 5 confirmation cases to the job after.
