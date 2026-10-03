# Board session — 2026-10-03 · state assessment and swarm definition

> Status: COMPLETE · **convened by:** Steward (assessment session, not an owner-convened board)
> **Decisions produced:** D-TEAM-017, D-TEAM-018, D-TEAM-019
> **Authority note:** per [../DECISIONS-POLICY.md](../../DECISIONS-POLICY.md) every decision below
> is effective immediately and the owner is **informed**, not asked. The owner may override any of
> them at any time; silence means they stand.

## Panel composition and why each member was picked

This was not a deliberation panel — it was a measurement session, and the cap in
[../../ROSTER.md](../../ROSTER.md) binds deliberation, not investigation. Composition:

| Actor | Kind | Why it was here |
|---|---|---|
| Steward (this session) | chair + measurer | ran the gates; did not implement |
| Recon subagent | read-only investigator | the WS-5 corridor queue is a wide read; one bounded question, one agent — per D-TEAM-015, not a fan-out |
| Recon subagent (second pass) | read-only investigator | independently re-read the cited paths after the tree changed under it |

**No deliberating panel was seated**, because no option was being chosen. Picking a panel to
ratify a measurement would have been the ceremony METHODS-01 exists to prevent.

## Ground truth established (measured, not read from the board)

1. **`omega:quick` is RED.** `ok:false, failed:2, hostLoc:1500`. `forge-surface` reports
   `FORGE_NO_REFUSAL_TEST` three times for `forge-mine`; `genome` reports `GENOME_HAND_EDIT` on
   both artifacts. One root cause, proven from source: `tooling/gates/forge-surface.ts:216`
   auto-discovers every `forge-*` directory and `tooling/gates/genome.ts:442` counts
   `readdirSync(plugins)`, so the untracked directory moved the tree from the fold's 28 to 29.
2. **Correction to a belief held earlier in this session:** `forge-surface` runs in
   `omega:quick`. The `--quick` comment at `gate.ts:309-310` lists six stages and omits six
   others that actually run. Recorded as D-TEAM-019; the gate comment is annotated, not
   rewritten (D-TEAM-011).
3. **An unattributed writer was live.** `plugins/forge-mine/` grew across six files between
   12:25 and 12:31, plus `compositions/forge-mine.json` and an 82-line `_matrix.json` edit. No
   workflow run (all 15 terminal, Sept 29–30), no automation, and no opencode session accounts
   for it. It was building exactly what the board had named as next.
4. **The charter named two artifacts that did not exist**: `SESSIONS/` and `GAP-LEDGER.md`.
   Sixteen TEAM-DECIDED entries were recorded with no minutes file anywhere (G-00).

## What the board decided

| Entry | One line | Severity |
|---|---|---|
| D-TEAM-017 | A writer corridor registers before it writes; a gate run with a corridor live is CONTAMINATED, not a measurement | S2 |
| D-TEAM-018 | The swarm grows by capability, not by seat — two workflows added, zero roster members | S2 |
| D-TEAM-019 | `forge-surface` runs in `omega:quick`; the gate's own comment under-describes its stage list | S1 |

Full reasoning, evidence, alternatives, rollback and revisit conditions are in
[../DECISIONS.md](../DECISIONS.md).

## Gaps recorded

Seven rows in [../GAP-LEDGER.md](../GAP-LEDGER.md): G-00 (missing session artifacts), G-01
(unregistered corridors), G-02 (contaminated gate results), G-03 (**SF2 — the binding blocker on
`forge-survey`**), G-04 (composition count pins), G-05 (no red-fixture falsifier), G-06 (no
second corpus), G-07 (no live/external integration — deliberately deferred).

**No roster seat was added.** Both expansion proposals raised by this ledger were mechanised
instead of staffed: G-01 became a table in TRACKING.md, G-05 became a workflow. Seating an
officer for either would have put an execution role into a deliberation registry.

## Dissenting and dissent

None recorded.

## OWNER-INFORM items

1. **A red gate and a live unknown writer.** Neither is visible in the board's own summary rows
   before this session, which had them as green. The owner should know a corridor is running in
   the worktree that no one can name.
2. **The board had been asserting a green gate that was not green.** This is the second time
   this repository's tracker has claimed green on a gate that was red — the first was WS-1
   items 1/2 at `08ddf708`. The standing practice of *running* the gate rather than reading it
   is what caught it both times, and it is now written into the corridor registry's validity
   rule rather than left to habit.
3. **The Steward disrupted a live writer's working files during this session.** Recorded in full
   in [../../TRACKING.md](../../TRACKING.md) and [../../HOUSEKEEPING.md](../../HOUSEKEEPING.md).
   The files were restored intact and no work was lost, but the rule the incident teaches —
   never move a live corridor's files, even to prove something about them — is now written down.

## Where the corpus is silent (not filled in by inference)

- The ranking **within** the six Wave 1+ forge lanes. D-417 states the lanes can open in any
  order the program schedules; the board ranked only the first lane (D-TEAM-016).
- Whether the CDP substrate lane needs `host/src` LOC. D-419's "zero code" claim is true of the
  record, not of the lane, and no browser port exists in `HOST_OP_TO_CAP`.
- Whether `synthetic-v0` is sufficient for `forge.proof.secondmine@1`.
- The correct resolution of **SF2** — the one that gates `forge-survey`, and the next decision
  the board owes.
