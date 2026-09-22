# D-445 — The analytics substrate: retention-lawed observation and regenerable counters

## Status

RATIFIED

## Context

- The Ω-5 spec (paper `D-429`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — the transcript original is not
  on disk; THIS tree's D-429 is Ω-DEV.5, the collision recorded in the genome
  lineage note) names the honest instrument: system events and per-namespace
  counters as retention-lawed vault rows — regenerable by replay, attributed
  for accountability, and constitutionally barred from measuring human
  attention (§29). Without retention laws on observation the vault becomes
  its own landfill, and "no telemetry" (§29) erodes one "just one more
  counter" at a time.
- The one invariant: **the fold is the truth, never stored.** Counters are
  deterministic folds over event rows; a stored summary that diverges from its
  replay is a lie with a chart — the drift is a ledgered finding, never an
  overwrite.

Blocks: none

## Options

| Criterion | (a) observation rows + regenerable counter folds in vivim-run | (b) stored scorecards as truth | (c) log lines + plugin-memory counters |
|---|---|---|---|
| Survives restart with evidence | Yes — rows are the evidence plane | Yes, but lies drift | No — amnesia |
| The attention wall (§29) | Yes — refused AT WRITE, named | No | No — policy page |
| Retention honesty | Yes — per-class rules, tombstoned shreds | No | No |
| Zero host LOC | Yes | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-run/src/analytics.ts`, in substance:

- **Observation rows** (ns `analytics.event`): `{eventNs, kind, principal?,
  at, payloadDigest}` — attribution for accountability, never interaction
  cadence; the typed SYSTEM-event vocabulary (invoked · refused · quarantined ·
  budget-exhausted · suspended · rotated · paired · flagged) is the only door.
- **Retention-declared event families**: a family row carries its retention
  class (system-events-90d default; ceremony and governor events forever); an
  event whose family cannot say what it forgets refuses
  ANALYTICS_RETENTION_UNDECLARED; an unknown eventNs or kind refuses
  ANALYTICS_NS_UNKNOWN — a namespace that cannot say what it forgets is
  refused (§29's namespace law, load-bearing not decorative).
- **The attention wall**: an event whose subject is a human's attention, gaze,
  or cadence refuses ANALYTICS_ATTENTION_REFUSED at the sink — the register's
  crown refusal, mechanically enforced; the refusal itself lands as a SYSTEM
  event (kind `refused`), never as an attention row.
- **The counter fold per namespace** (ns `analytics.counter`,
  analytics-counters-1y): counters are folds over event rows, each carrying
  `basis {from, to, inputHash}` — a cache of the fold, never authority; a
  stored counter that disagrees with its own replay (digest mismatch) names
  ANALYTICS_DIGEST_MISMATCH — the drift is a ledgered finding, never an
  overwrite.
- **The shred** (Ω-0.5 tombstone discipline): aged event classes shred on
  schedule into tombstones — never deletes; post-shred folds return
  defined-absence, never fabricated zeros.

## Consequences

- As-built: the ops (analytics.record@1 MUTATION, analytics.query@1 READ,
  analytics.counters@1 READ) land in vivim-run's lane; the paper register's
  ANALYTICS_COUNTER_DRIFT lands as ANALYTICS_DIGEST_MISMATCH (drift detected
  as a digest disagreement) and ANALYTICS_CLASS_UNKNOWN/SOURCE_UNKNOWN fold
  into ANALYTICS_NS_UNKNOWN — one code per door, the sentences kept.
- ANALYTICS_EMIT_UNBUDGETED rides the Ω-2 budget seam (the sink rides the
  emitter's declared budget) — cited here, not rebuilt; spec §5's replay op is
  the counters read (the fold IS the replay, on demand).
- Consumers that exist today (run.stats/run.health mirrors, perf result rows,
  the session bottleneck report) can migrate onto the substrate without
  re-typing: the rows are the seam. Zero host LOC; no new dependencies;
  existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-445` generates the RED stub this list resolves to):
  - `F-ANALYTICS.1` (replay-equality) — fold 10,000 recorded events → counters; delete the counter rows; refold → byte-identical results, ×50
  - `F-ANALYTICS.2` (the-attention-wall) — gaze/cadence-shaped events refuse with the sentence; nothing lands; the refusal itself is logged as a SYSTEM event, not as an attention event
  - `F-ANALYTICS.3` (retention-honesty) — aged event classes shred on schedule with tombstones (Ω-0.5); post-shred folds return defined-absence, never fabricated zeros
  - `F-ANALYTICS.4` (drift-is-a-finding) — tamper a stored counter → the next read names the drift (ANALYTICS_DIGEST_MISMATCH) rather than serving it
  - `F-ANALYTICS.5` (refusal-proves) — each register code fired by a planted violation
  - `F-ANALYTICS.6` (headless) — 1–5 daemon-only; counters render as text
  - `F-ANALYTICS.7` (loud-failure) — zero unledgered drops — a failed emit is a named refusal or a mirror-failed row
- Files: `plugins/vivim-run/src/analytics.ts`, ops in `src/index.ts`,
  `tooling/gates/test/f-analytics.test.ts`.
- Refusal register (exact): ANALYTICS_ATTENTION_REFUSED ·
  ANALYTICS_RETENTION_UNDECLARED · ANALYTICS_DIGEST_MISMATCH ·
  ANALYTICS_NS_UNKNOWN.
- Precedents: the re-materialized Ω-5 spec (paper `D-429`); the gov.metrics
  posture (the fold is the truth, never stored); `D-438` (environment-pinned
  result rows); `D-435` (loud-failure law); `D-441` (the substrate-module +
  registry pattern); `D-364`.


- Ratified on greens (evidence-class, F-ANALYTICS.1-7 green in this record's tree BEFORE the flip per D-364): landing commit e2dff6f; full gate green 1362/0 ×2 on the PROPOSED tree (2026-09-21T06:37:56Z and 06:43Z; the prior tip's 1320 + 42 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-run/src/analytics.ts — the analytics substrate: observation rows over a typed system-event vocabulary with retention-declared families, the attention wall refused at write (§29's crown refusal, logged as a system event), per-namespace counter folds with basis inputHash (regenerable caches, drift-is-a-finding via ANALYTICS_DIGEST_MISMATCH), and tombstoned shreds that fold to defined-absence
rationale: Observation without surveillance - counters that live in plugin memory are amnesia, stored scorecards that drift from their replay are lies with charts, and observation without retention law is a landfill, so the events are rows, the fold is the truth, and the constitution's refusal to measure gazes is a gate at the sink (Omega-5, the analytics substrate, re-materialized spec)
class: evidence
