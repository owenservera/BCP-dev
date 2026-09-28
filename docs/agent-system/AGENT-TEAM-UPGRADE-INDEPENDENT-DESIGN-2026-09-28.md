# Agent Team Upgrade — Independent Steward Design
## 2026-09-28 · DELIBERATE session, solo (no CFA delegation — independence is the point)

> Status: PROPOSAL / DESIGN OPINION — not implementation authority, not Ω law.
> Lineage: second-opinion dossier (`resident-team-opencode-second-opinion-2026-09-28/`,
> all 12 files read whole from main); dual-speed ratification; M0/M1 prompt;
> P2 leaf-leg evidence (D2–D5, probe E); installed CLI facts below (OBSERVED,
> not inferred). It agrees with the dossier where evidence agrees and
> disagrees where evidence suggests a cheaper path. Both designs answer to the
> same goals (`AGENT-TEAM-UPGRADE-GOALS-2026-09-28.md`).

## 1. The premise challenge

The dossier treats **residency as the target state of each CFA**. I claim
residency is a *cache*, not an identity, and caches must earn their keep:

- CFA identity already lives in durable homes (`CORE-AGENT`/`STATE`/`TASKS`/
  `LESSONS` + receipts), not in runtime sessions. A runtime session is hot
  context + position — execution cache.
- Cache economics: `(hit rate × miss cost)` vs `holding cost`.
  - **Miss cost (spawn a CFA):** OBSERVED across W1/W2/M0M1/W3 waves — one Task
    call, full home context via read-first, completes in-turn, 10/10 domains.
    M2 generated envelopes (master upgrade, already planned) cut it further.
  - **Holding cost (residency):** eleven live sessions + server + supervisor +
    the dossier's entire cost schedule — 5 P0 + 11 P1 + 11 P2 + 5 P3 findings,
    9 reconciliation items, G0–G10 gates, wake-loop fencing, lease/epoch
    machinery, presence/privacy design, registry schema + migrations.
- The dossier's finding count IS residency's price tag. It never prices the
  alternative: what if miss cost is already low enough that the cache isn't
  worth it?

## 2. Design B — warm standby (what we mostly already have, ratified as a choice)

- **B1 — durable homes stay the identity.** True today. No change.
- **B2 — fast spawn via generated envelopes.** M2 of the master upgrade;
  routine EXECUTION uses 1–2 KB envelopes (charter + state + envelope + refs),
  not full-home loads. Cuts the dominant term of miss cost.
- **B3 — session resume/continue instead of serve/supervisor.** OBSERVED on
  installed opencode 1.18.4 (`opencode run --help`, this machine, 2026-09-28):
  `-c/--continue`, `-s/--session <id>`, `--fork`, `--attach <url>`,
  `--dir`, plus `opencode session|export|import|stats|serve|web|db`. A
  multi-turn deliberation can *continue* a prior session (`-s ses_…`) or fork
  it — cheap continuity with zero new infrastructure. OPEN PROBE: whether
  Task-transport session IDs are resumable the same way (5-minute probe, not
  done here).
- **B4 — peer back-and-forth without residents.** Commons already IS the
  mailbox (`commons-sync` command exists). Protocol today: CFA-A writes
  REQUEST; Steward spawns CFA-B with "read inbox first"; B reads A's message
  and responds in its receipt. Alternating spawns + inbox reads = genuine
  back-and-forth (higher per-turn latency, zero new infrastructure). The
  dossier's §04 correction splits in two: (i) *content needn't route through
  the Steward* — ADOPTABLE NOW via inbox-at-boot discipline; (ii) *no spawn
  needed* — needs residents, deferred.
- **B5 — session topology per S.1/S.2 rules** (own copy, one writer, main
  rendezvous). True today.

## 3. What to adopt from the dossier immediately (no residency required)

- Evidence hierarchy + falsifier lists (`05` §16–17, `08` findings, `11`
  gates) as *requirements language* for all future proofs — its enduring
  value independent of approach.
- Workload test L0–L5/F1–F8 (`09`) runnable under Design B: "local team" =
  spawned CFAs on the isolated test branch; comparison model unchanged.
- Cleanup acceptance criteria (`10` §20) as the hygiene bar.
- Inbox-at-boot discipline (04-i): spawned CFAs read their Commons inbox
  before reasoning — one binding-line change, no runtime.

## 4. Comparison

| Dimension | A — dossier resident + supervisor | B — warm standby (this design) |
|---|---|---|
| Setup speed | Weeks: supervisor, serve qualification, R0–R9, G-gates, fencing/lease/registry machinery | Days: ~80% exists (homes, delegation, envelopes in flight, inbox commands, validator, receipts); remaining = M2 envelopes + inbox-at-boot line + resume probe |
| Maintenance burden | New long-lived subsystem to operate: supervisor singleton, SSE monitoring, wake lifecycle, registry schema/migrations (P2-10 problem exists only here), presence/privacy ops | No new processes; failure modes = today's understood set; upgrades = opencode upgrades |
| Value, DELIBERATE work | Equal outcomes (same minds, evidence, receipts) | Equal outcomes — deep work is infrequent and high-value; per-turn latency irrelevant |
| Value, EXECUTION bursts | Highest with residents (instant wake, peer consult) | Sufficient with envelopes + resume; per-task minutes not seconds |
| Value, interactive feel | Unique to A ("team is ON") | Absent — the honest gap |
| Risk | HIGH-RISK items open (async-wake reliability #46842-class, ten-session cost unmeasured, impersonation/fencing to build) | Near-zero new risk; every mechanism already demonstrated on this machine |
| Kill condition | R0-serve probe fails → A infeasible on this platform version, not just expensive | N/A (already running) |

## 5. Recommendation (with kill criteria)

1. **Ratify B as the operating architecture now** — as a deliberate choice,
   not a poor man's residency. It meets goals 2–6 and 7 today (see goals doc).
2. **Gate A as an experiment behind the R0-serve probe** (`01` §12 list on
   this machine). Probe fails → park A explicitly, B *is* the architecture.
   Probe passes → fund R1→R3 slice only (`06` §17), with budget caps: wake
   p95 latency, ten-session RAM/CPU/token cost via `opencode stats`, zero
   silent-fallback/impersonation findings. Any cap breached → park A.
3. **Keep the dossier as A's living spec** — its gates and falsifiers are the
   acceptance suite if A ever proceeds. Nothing written there is wasted.
4. The decision between "seconds-fast team" (A) and "minutes-fast team" (B)
   is an owner latency-taste decision, to be made with R0 numbers in hand —
   not an architectural inevitability.

## 6. Open probes (ordered, bounded, none started here)

1. Resume probe (5 min): `run -s <prior-session-id>` / `--fork` behavior +
   whether Task-issued `ses_` IDs are resumable. Decides B3's ceiling.
2. Latency/cost baseline (one wave): per-CFA spawn turn time + token cost via
   `opencode stats`. Prices miss cost honestly; feeds the A/B latency-taste call.
3. R0-serve probe (`01` §12). Go/no-go for A.
4. U1 + P2.4 location note: the empty-leg defect (scout/drafter) affects B's
   leaf tier, not CFA spawn; runner leg proven OK. Tracked separately.

## 7. Falsifiers for this design

- B is wrong if measured spawn+envelope latency blocks a real owner workflow
  that residents would unblock (then fund A through its gates).
- B is wrong if session resume proves unavailable AND multi-turn deliberation
  degrades without it (then price A sooner).
- This comparison is wrong if serve qualification passes cheaply AND
  ten-session cost is trivial (then A's price collapses and residency wins).
