# S2 Parallel Registry + Flywheel Loop — Run Evidence (2026-09-29)

Swarm: `sw_a15cc607a15d4d83` (omega-team-s2-parallel), model `opencode/space-bunny-free`,
config `omega-endstate-build/runtime/team/swarm-team-s2-parallel.json`,
DB `omega-endstate-build/runtime/.swarm-s2/swarm.db`, events `.swarm-s2/run.jsonl`.
Base SHA at run start: `f523b11b4f66151e9ee5e1a3b0c6dc764415d63a`.

## 1. What was attempted (S2 remainder)

The prior campaign (commit f523b11b) left two S2 items open: parallel workers
(maxConcurrent > 2) and a memory-backed work-item registry with an explicit
claim → execute → DONE protocol. This run exercised both in a single 4-agent
swarm: stew-01 as registry coordinator, devops-01 / prov-01 / ver-01 as three
parallel workers over three small, real, verifiable work items (env manifest,
repo inventory, roadmap frontiers F0–F5).

## 2. Mechanical outcomes

- All four agents reached `done` (orchestrator bookkeeping row remains
  `[running]` after the operator time budget — known condition from the prior
  campaign, recorded honestly).
- Registry final states (read directly from `.swarm-s2/swarm.db` `memory`
  table):
  - `registry/item-1` → `DONE`, assignee `devops-01`, result
    `s2-item-1-env-manifest.md written`
  - `registry/item-2` → `DONE`, assignee `prov-01`, result
    `s2-item-2-repo-inventory.md written`
  - `registry/item-3` → `DONE`, assignee `ver-01`, `materialized_by`
    `prov-01` (see §3.1)
- Steward verdict key `s2-parallel-verdict`:
  `PARALLEL-PROVEN 3/3 items DONE via maxConcurrent=3 registry protocol`.
- Steward detail key records that all three artifacts were verified on disk
  **by reading the actual files, not the reports**, at SHA f523b11b.
- Artifacts: `omega-endstate-build/scripts/evidence/s2-item-{1,2,3}-*.md`
  (env manifest with exact bun/node/git/uname outputs; repo inventory with
  tree observation; F0–F5 frontier table extracted from ROADMAP-V1.md).

## 3. Emergent findings (observed, not scripted)

### 3.1 Capability-gap materialization handoff

ver-01 completed the item-3 domain work (F0–F5 extraction) but could not
write the artifact file. Without any instruction to do so, the content was
handed to prov-01, which wrote the file to the agreed path; the registry
record then gained a `materialized_by: prov-01` field that the agents invented
on their own. This is exactly the kind of emergent division of labour the
S-ladder expects at S2→S3: a blocked capability routed around through the
messaging layer instead of failing the item.

### 3.2 Dispute → annotation → correction → revision protocol

The run surfaced a claim/write race during registry claiming (two workers
interacting with the same item near-simultaneously). The swarm then conducted
a multi-record epistemic exchange in shared memory:

- `protocol-findings/claim-and-write-races` (prov-01's write-up of the races)
- `protocol-findings/stew-01-annotation` (steward corrections, evidence cited,
  explicitly NOT overwriting prov-01's record)
- `protocol-findings/prov-01-dispute` (point-by-point response, partial concession)
- `protocol-findings/stew-01-sequencing-correction` (one prov-01 claim shown
  factually wrong; rest conceded as plausible)
- `protocol-findings/prov-01-sequencing-amendment` (prov-01 amends its own
  record, marking one claim as factually wrong)
- `protocol-findings/claim-and-write-races` final state: RECORD REVISED by
  prov-01 after stew-01's annotation, annotation preserved separately.

No record was overwritten at any point; every correction became a new key
referencing its predecessor. Supersession semantics emerged without being
specified — the same pattern stew-01 exhibited in the prior campaign's final
verdict.

### 3.3 Tool-capability gap finding

`finding/tool-capability-gap`: swarm agents do NOT have uniform tool access;
ver-01's toolset (read/grep/glob + swarm_*) blocked artifact materialization.
Recorded by the swarm itself as a first-class finding.

## 4. Flywheel closure: USE → OBSERVE → EVOLVE

- **USE (swarm output on Ω, live):** `bash omega-endstate-build/scripts/truth.sh`
  was executed live on the Ω tree after this run. Result: bun 1.3.14, git SHA
  f523b11b, pass 50 / fail 1 (the known vendored-suite openrouter-credential
  condition — the probe reports truth, it does not gate), probe exit 0, receipt
  `omega-endstate-build/scripts/evidence/truth-receipt-20260929T111555Z.md`.
  The tooling the swarm delivered in the prior campaign is now in active use.
- **OBSERVE:** §3 above — races, handoff, supersession, capability gaps, all
  captured by the swarm in its own memory as durable findings.
- **EVOLVE (codified):** the emergent behaviors are now protocol, not accident:
  `omega-endstate-build/runtime/team/swarm-team-s2-parallel-v2.json` adds
  (a) CLAIM PROTOCOL v2 — claim-then-proceed with no re-check fight, and an
  explicit on-call materializer role for capability-gap handoffs;
  (b) SUPERSESSION PROTOCOL — corrections/annotations must be new keys that
  reference their predecessors, never overwrites;
  (c) registry records that must carry `materialized_by` whenever an agent
  other than the domain worker wrote the artifact.
  The improved config is ready to be exercised by the next loop iteration
  (S3 candidates: multi-round self-correction, recovery drills).

## 5. Honest limitations

- maxConcurrent=3 parallelism is evidenced by the config plus interleaved
  turn logs and all-agents-done status; per-turn wall-clock overlap was not
  separately instrumented.
- The claim/write race was observed and reported by the agents; the exact
  interleaving lives in `.swarm-s2/run.jsonl` (event log committed alongside
  this doc's commit message references; DB retained in the repo working tree).
- All runs cost $0.0000 (zen free tier); no spend evidence exists to fake.
