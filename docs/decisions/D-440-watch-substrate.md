# D-440 — The watch substrate: namespaced process/signal/heartbeat watches with proofs

## Status

RATIFIED

## Context

- The Ω-1 spec (paper `D-425`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — the transcript original is
  not on disk; this tree record lands the re-materialized spec's mechanism)
  names the substrate tier's first layer: a NAMESPACED watch — one
  registration discipline over processes, signals, and heartbeats, with
  typed predicates, the watcher's own lease, and observations as evidence.
- The one invariant: **watching is proving, not polling vibes.** A watch is
  a declared registration (scope, subject, predicate, budget); its verdicts
  are pure folds over observation rows; a watcher that stops heartbeating
  is itself watched (the lease); every anomaly is a named refusal or a
  ledgered observation.

Blocks: none

## Options

| Criterion | (a) pure watch core in vivim-run (typed predicates + lease + observations) | (b) more ad-hoc pollers per subsystem | (c) the OS watchdog only |
|---|---|---|---|
| One discipline, three scopes | Yes — process/signal/heartbeat share registration + evaluation | No — each subsystem grows its own | No |
| The late observer is honest | Yes — first-sight flagging (the D-331 rule generalized) | No — every poller re-learns it | No |
| The watcher is watched | Yes — WATCH_LEASE_EXPIRED lands when the watcher goes silent | No | No |
| Zero host LOC | Yes — plugins/vivim-run pure core + ops | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-run/src/watch.ts`, in substance:

- **Registrations** (ns `watch`): `{watchId, principal, scope:
  process|signal|heartbeat, subject, predicate, heartbeatMs?, budgetRef,
  action}` — validated at the door (WATCH_SCOPE_INVALID on bad scope,
  WATCH_SUBJECT_UNKNOWN on empty subject, WATCH_BUDGET_UNDECLARED when
  budgetRef is absent, WATCH_DUPLICATE on re-registration).
- **Typed predicates** (pure folds over observation rows): process → the
  windowed crash rule (crashDelta ≥ 2 within 3 polls, the health.ts law)
  with the late-observer first-sight rule (a watch registered AFTER the
  subject is already degraded flags on first sight); signal → version-bump
  (a watched ns/signal version changes); heartbeat → no-progress-for
  stallDeadlineMs (the D-435 plan-registry rule generalized).
- **The lease:** a registration with heartbeatMs declares its OWN watch —
  a watcher silent past its lease lands a WATCH_LEASE_EXPIRED observation
  and the subject renders flagged.
- **Observations** (ns `watch`): `{watchId, at, observed, verdict:
  quiet|flagged|escalated, refs}` — the evidence rows; `watch.list@1`
  renders headless text.

## Consequences

- The detection machinery the tree already proved (health.ts windowed
  counters, D-331 first-sight, D-435 stall) becomes ONE substrate with
  three scopes and one refusal register.
- As-built: the ops land in vivim-run (watch.register@1 MUTATION,
  watch.observe@1 MUTATION — the evaluation record, watch.list@1 READ);
  the vault mirror rides the run plugin's port caps when present, the
  in-plugin registry is the derivation source (the ring-first precedent).
- Zero host LOC; no new dependencies; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-440` generates the RED stub this list resolves to):
  - `F-WATCH.1` (deterministic-replay) — 1,000 recorded observation sequences through the predicate evaluators replay identical verdicts; no verdict depends on poll order within the window
  - `F-WATCH.2` (the-late-observer) — a watch registered after the subject is already degraded flags on FIRST SIGHT
  - `F-WATCH.3` (refusal-proves) — bad scope, empty subject, missing budget, duplicate id: four distinct named refusals, nothing registers
  - `F-WATCH.4` (the-lease) — a watcher silent past its lease lands WATCH_LEASE_EXPIRED and the subject renders flagged
  - `F-WATCH.5` (signal-process-parity) — the same crash predicate over a process watch and a signal-fed watch reach the same verdict from the same evidence
  - `F-WATCH.6` (headless) — the ceremony is daemon/CLI-only; watch.list renders text
  - `F-WATCH.7` (loud-failure) — every anomaly is a named refusal or a ledgered observation
- Files: `plugins/vivim-run/src/watch.ts` (the pure core), wiring in
  `plugins/vivim-run/src/index.ts`, `tooling/gates/test/f-watch.test.ts`.
- Refusal register (exact): WATCH_SCOPE_INVALID · WATCH_SUBJECT_UNKNOWN ·
  WATCH_BUDGET_UNDECLARED · WATCH_DUPLICATE · WATCH_LEASE_EXPIRED.
- Precedents: the re-materialized Ω-1 spec (paper `D-425`); `D-360`/health.ts
  (the windowed crash rule); `D-331` (first-sight late observer); `D-435`
  (the stall rule and the registry idiom); `D-364`.


- Ratified on greens (evidence-class, F-WATCH.1-7 green in this record's tree BEFORE the flip per D-364): landing commit 0dd62fb; full gate green 1320/0 ×2 on the PROPOSED tree (2026-09-21T05:49Z and 05:54Z; the prior tip's 1306 + 14 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-run/src/watch.ts — the watch substrate: namespaced registrations (process/signal/heartbeat scopes, typed predicates, the watcher's own lease, budget-seamed), pure-fold verdicts over observation rows, first-sight late-observer honesty, WATCH_LEASE_EXPIRED when the watcher goes silent, and headless listing
rationale: Watching is proving, not polling vibes - one registration discipline over three scopes with typed predicates and evidence rows, because a watcher nobody watches is a monitor that fails silently exactly when it matters (Omega-1, the watch substrate, re-materialized spec)
class: evidence
