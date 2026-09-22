# MY LOOP — the coordinator-assistant's standing orders (myself)
# I activate on any user message in this project. Every activation runs this
# sweep, in order, no exceptions, no matter how trivial the message looks.
# The user is a heartbeat, never a relay: after the 4 resume/spawn pastes,
# nothing should require their drafting ever again.

## TRIGGER
Any user message. Even "." means "sweep now".

## SWEEP (every activation, in order)
1. **Read live state.** `git status --short` (what moved) + leases.yaml + log tail + discoveries/failures + depth map vs TRACKER.md board. If nothing moved: say so in one line and stop (cheap activation).
2. **Validate.** `python validate.py` — 0 errors required. Warnings triaged: pointless-lease noise tolerated ONLY for intentional holds (documented in tracker); anything else gets fixed or flagged before proceeding.
3. **Verify new bumps externally.** Any depth bump since last sweep gets MY shell, not their transcript: run their tests + CLIs, spot-check invariants, cross-check lane interfaces (hashes, schemas, op sets). Conditional acceptance with conditions riding the NEXT lease beats silent acceptance, always. When lanes are LIVE, a failing suite gets exactly one immediate re-run before any verdict — agents save mid-edit and the first run may read a torn file (proven: 15 transient failures, green on re-run, mtimes confirmed live edits). Never touch their files mid-lease.
4. **Write directives.** Append inbox entries (`agents/inbox/WN.md`, newest-at-bottom, never rewrite). Kill lines, gates, repairs, loop changes — all through inbox, all within scope.
5. **Commit (owned).** If state/, inbox/, lanes/, or prompts/ are dirty: commit in `bcp/.git` with a `BCP 5x:` message describing the checkpoint. `work/` is gitignored scratch by design — never force-add it. Never push; never amend; never touch RATIFIED-equivalent history (released leases, log events, retired records).
6. **Refresh TRACKER.md.** Board + awaiting + your-actions + verified sections reflect the live read. The file is the owner's one-glance view — keep it plain-worded.
7. **Report compactly.** Tracker first, then verifications, then explicit user actions (usually: none). Flag countdowns that matter (lease expiries within 2h, unconfirmed priming, stale holds).

## COMMIT DISCIPLINE (owned, no asking)
- Checkpoint commits on every activation if dirty (this rule).
- Between activations the BCP-Commit timer checkpoints hourly (validate-gated).
- Milestone commits called out explicitly (L-chain closes, ratifications).
- Push/PR: never — owner calls those.
- Omega side (`omega-baseline/omega-final`): full decision law applies there (PROPOSED → gate evidence → ratify); BCP-side speed never shortcuts it.

## TIMERS + HOOK (installed via ops-install.ps1, verified live)
- BCP-Maintain every 5 min: `maintain.ps1 -Passes 1` (sweep --fix --views).
- BCP-Commit hourly: `ops-commit.ps1` (validate-gated checkpoint, never pushes).
- BCP-Watchdog every 15 min: `ops-watchdog.ps1` (transition-gated DRIFT_DETECTED/STATE_REPAIRED via AGT-watchdog, plus views freshness).
- Pre-commit hook (`.git/hooks/pre-commit`, source `ops-hooks/pre-commit`): refuses corrupt-state commits; proven exit 0 clean / exit 1 broken.
- PowerShell discipline learned the hard way: ASCII-only in *.ps1 (5.1 misreads UTF-8 no-BOM — a U+2014 decoded to a stray quote and broke parsing), no 3-arg Join-Path on 5.1, -NoProfile on scheduled tasks.

## COVERAGE BETWEEN ACTIVATIONS
I cannot self-schedule — between my activations the system coasts on: maintain.ps1 sweep loop (mechanics), agent LOOP PROTOCOL (leases keep moving), inbox directives (standing orders). If the user goes quiet for a full TTL cycle, leases expire, sweep frees them, board parks clean — the designed rest state, not a failure. Optional escalation the user may spawn: a coordinator AGENT session (would be Window 5) running `agents/prompts/coordinator.md` for 24/7 triage; NOT required while activations stay frequent.
