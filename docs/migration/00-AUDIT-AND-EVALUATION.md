# Prompt-1 Steps 2+7 — Migration Capability Audit + First-Migration Evaluation

## STEP 2 — BCP migration-capability audit (with source evidence)

Scale for the 13 lifecycle stages in Master Prompt §5:

| # | Stage | Verdict | Evidence |
|---|---|---|---|
| 1 | Discover legacy capability | YELLOW | `state/discoveries.yaml` + `bcp_tool discovery add` work (DISC-022/023 this slice); but no assay-targeted discovery type — findings are free text, not capability-shaped. |
| 2 | Capture evidence about it | YELLOW | `log/*.yaml` signals + discovery rows persist; no evidenceREF shape (`{ns,id,rev}`), no hash-pinned source refs — MIG-001 carries hashes in its own record, not in BCP state. |
| 3 | Define observable behavior | RED | No behavior-spec object in BCP; MIG-001's spec lives in the migration dir as markdown. BCP cannot answer "what does X do" today. |
| 4 | Determine canonicality | RED | No disposition field anywhere in state; PRESERVE/TRANSFORM/… verdicts exist only in MIG-001's record. |
| 5 | Represent behavior w/o legacy code | RED | No behavior-model concept; taxonomy.yaml holds process taxonomy, not capability semantics. |
| 6 | Map to an Ω capability | RED | No mapping object; `deps.yaml` tracks capability→capability blocks, not legacy→Ω semantic links. |
| 7 | Create Ω implementation task | YELLOW | Lease machinery (`lease acquire --depth-target`) creates tracked work with TTL/heartbeat — usable as the task vehicle, but carries no semantic payload (no contract/invariant/test refs). |
| 8 | Track dependencies | GREEN | `state/deps.yaml` + topological-sort cycle detection in `validate.py` + sweep unblocking — mechanically supported (OBSERVED). |
| 9 | Require implementation evidence | YELLOW | `depth bump` requires agent note and is log-backed, but nothing enforces WHAT evidence (no proof-ladder, no artifact refs). Convention-dependent. |
| 10 | Independently verify | RED | No verifier role separation; implementing agent self-reports via depth bump. MIG-001's `verify_migration.py` is the first independent check and lives outside BCP's loop. |
| 11 | Record preservation/discard decisions | RED | No decision/disposition store; silent disappearance is currently undetectable. |
| 12 | Integrate the result | YELLOW | Sweep integration step (experiment all-at-target → merging + INTEGRATION_READY) exists for depth work, but knows nothing of migration semantics. |
| 13 | Continue autonomously | GREEN | Agent loop (leases/TTL/stall/available/show) + sweep + validate + views is a working autonomous coordination substrate (OBSERVED: 49 caps, 8 leases, 101 events, validate/sweep green). |

Summary: coordination substrate GREEN (7/8/13 + partial 12); migration
semantics RED (3/4/5/6/10/11); evidence/task partially YELLOW (1/2/7/9).
The gap is exactly what the Master Prompt predicted: BCP orchestrates agents
but does not yet understand migration state. MIG-001's record schema is the
seed of that understanding — deliberately minimal (one JSON schema + one
record + one checker), promoted only after Migration #2 proves reuse.

Concrete implementation plan for the missing pieces (ordered, smallest first):
1. `state/migrations.yaml` (record registry: id → status lifecycle) — after #2.
2. Disposition enum on migration records (PRESERVE/…/UNKNOWN) with sweep guard
   against silent disappearance — after #2.
3. `verify` step wired into depth-bump for migration leases (checker must pass
   before L2→L3 on migration work) — after #2 validates the checker generalizes.
4. Dependency edges legacy→Ω in deps.yaml (new edge kind, same topo sort) — with #3.
5. Assay/behavior-spec templates as BCP-managed artifacts (not free markdown) —
   only when two migrations show the same shape.

## STEP 7 — Evaluation of Migration #1

- What worked: forensic assay from executable sources produced a real,
  falsifiable behavior spec; the Ω target needed zero new contracts; the
  verify script caught a real checker bug (V-4 self-match) before claiming green;
  BCP state integration went through the tool (no hand edits), validate+sweep green.
- What was manual: source selection, confidence tagging, canonicality verdict,
  Ω mapping judgments, risk severity calls — all agent reasoning, correctly so.
- What was ambiguous: manifest-vs-plugin authority (kept UNKNOWN); Governor
  exclusivity (scan informative only); identity/dedup semantics (deferred).
- What the agent had to infer: turn lifecycle order, exactly-once intent,
  profile/slave determinism — all labeled STRONGLY/WEAKLY_INFERRED, none promoted.
- What BCP failed to represent: behavior specs, canonicality, Ω mappings,
  verification separation, dispositions (the six REDs above).
- What evidence was difficult: live proof (no authenticated profile/Chrome in
  this environment — honestly recorded UNVERIFIED, not worked around).
- What should become deterministic: record-schema conformance, contract-name
  resolution, proof-ladder honesty checks, monolith-import refusal (all now in
  `verify_migration.py`); sequential-ID test assumptions (maintainer loop).
- What should remain agent judgment: assay interpretation, canonicality
  verdicts, mapping choices, risk severity — with provenance, never as fiat.
- What should become reusable BCP capability: the migration record + lifecycle
  + verify-gate (plan items 1–3 above), but ONLY after Migration #2 (Claude)
  proves the shape generalizes — per Master Prompt 2, which is the next order.
