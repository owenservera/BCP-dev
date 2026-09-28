# Agent Team Upgrade — Goals in Plain Language
## 2026-09-28

> Status: OWNER-FACING GOALS — the non-technical companion to the resident-team
> second-opinion dossier (`resident-team-opencode-second-opinion-2026-09-28/`)
> and the dual-speed ratification. No authority change; no implementation order.
> Technical readers: start with `MASTER-UPGRADE-INDEX-2026-09-28.md`.

## The goal in one sentence

Your computer runs a standing team of ten specialist advisors you can talk to
any time — they remember everything, check each other's work, ask permission
before doing anything consequential, and leave a paper trail.

Today that team assembles when called. The upgrade makes them resident: always
there, instantly available, without losing any safety or record-keeping.

## What "done" looks like

1. **Always-on team.** Open the machine and the team is there — no setup, no
   summoning, no waiting. Each specialist keeps its memory and workspace
   between conversations.
2. **They talk to each other, not just to you.** Specialists question each
   other's proposals, cite evidence, and hand work back and forth directly.
   You see the reasoning, not just the conclusion.
3. **You stay the boss, effortlessly.** Interrupt, redirect, overrule, or move
   work between this chat and your machine mid-task without loss or
   duplication. Nothing important happens outside your authorization path.
4. **No silent mistakes.** The system can never confuse who's who, mistake
   "message received" for "job done," revive a cancelled task, or let two
   copies of the same advisor act at once. Each failure mode has an explicit
   guard, proven before it matters.
5. **Proof, not promises.** Every finished task carries durable evidence —
   what was done, who did it, what was checked — verifiable without trusting
   anyone's word.
6. **It survives real life.** Crashes, restarts, interruptions recover cleanly:
   work resumes where it stopped, nothing executes twice, nothing vanishes.
7. **Affordable and honest about limits.** Ten advisors at once must not burn
   the machine or the budget, and the system must say plainly what it has not
   proven yet.

## Where we are (2026-09-28, plain version)

- **Working today:** on-demand team (assembles per task, ten domains verified),
  full paper-trail discipline, work across this chat and the local machine,
  machine-checked completion gates, a tested two-advisor exchange harness.
- **Designed but not built:** the always-on part. Twelve-document independent
  design + critique exist; none of the always-on machinery is implemented.
- **Known unknowns:** whether the platform reliably wakes idle advisors (the
  #1 flagged risk — tested before building, not after); a display bug where
  two assistant types return empty replies (workarounds exist; root cause
  needs the vendor).

## The decision path

1. **Live two-advisor exchange** (harness ready). Answers: does live teamwork
   actually work on this machine?
2. **Tidying + identity audit** (quick). Answers: is the house clean enough to
   build on?
3. **Platform wake-up test** (small, factual). Answers: can this platform host
   an always-on team, or is another approach needed? This is the go/no-go gate
   for the always-on direction — tested before team machinery is built.
4. **Then, and only then:** build the team layer one step at a time — one
   advisor, then two talking directly, then ten — each step proven first.

## The principle to hold firm

Convenience must never quietly become authority. As the team gets more
autonomous, the system must keep proving — for every task — who decided, who
authorized, and what the evidence is. That standard already runs in how work
is done today; the always-on team must meet it, not lower it.

## Companion assessments

- Independent steward design + approach comparison:
  `AGENT-TEAM-UPGRADE-INDEPENDENT-DESIGN-2026-09-28.md` (setup speed,
  maintenance, value; recommendation with kill criteria).
