# ROSTER.md — Participating Agent Registry

> **Classification: DERIVED — CURRENT**
> **Authority:** coordination mirror only. Confers no Ω permission and overrides
> no runtime identity (`vivim-agent` plugin + D-452..D-455 govern the runtime).
> **Maintainer:** COORD-01 · **Updated:** 2026-09-24 · **Tip:** `d70fadd`

| agentId | role | status | specialization | current workstream | current task | branch / worktree | last session | handoff |
|---|---|---|---|---|---|---|---|---|
| COORD-01 | workstream coordination / integration | ACTIVE | routing, conflict detection, CURRENT consolidation, gates | WS-001 | own WS-001 integration + gate status | `owner-wave-001` (Ω line; this task works at BCP-dev root, docs-only) | — (owner channel) | — |
| IMPL-01 | implementation agent (first builder) | RETIRED | cooperative substrate construction (Phase 1) | WS-001 | Phase 1 minimal substrate + ingest + falsifiers | BCP-dev working tree, docs-only, base `becb920` | local session 2026-09-23 | HANDOFF-001 |
| IMPL-02 | implementation agent (owner-launched continuation) | ACTIVE | cooperative-system dogfood + wall-test evidence | WS-001 | DIR-001 complete; P1-01 integration/closure | `impl-02/p1-01-dogfood` | 2026-09-24 · DIR-001 session | HANDOFF-004 |
| ARCH-01 | architecture and ontology | STANDBY | Ω law, invariants, composition fence | — | unassigned | — | — | — |
| ARCHAEOLOGY-01 | historical VIVIM/Ω extraction | STANDBY | legacy mine assay, genealogy | — | unassigned | — | — | — |
| CODE-01 | source semantics / code indexing | STANDBY | contracts, surfaces, import discipline | — | unassigned | — | — | — |
| RUNTIME-01 | runtime self-model / vault / law / agent | STANDBY | session ledger, dev-vault, agent plugin, aperture | — | unassigned | — | — | — |
| CONTEXT-01 | context compiler / aperture / progressive disclosure | STANDBY | D-443 substrate, packet lineage, compaction | — | unassigned | — | — | — |
| TEST-01 | falsifiers / adversarial verification | STANDBY | falsifier-first loop (D-426), gate evidence | WS-001 (completed drill) | proof table delivered; no new task assigned | — | 2026-09-24 · DIR-001 drill | outbox/TEST-01/ITEM-001-proof-table.md |
| DOC-01 | context packets / documentation lineage | STANDBY | packets, doctruth-compatible provenance | WS-001 (completed drill) | PKT-001 QA + lineage delivered; no new task assigned | — | 2026-09-24 · DIR-001 drill | outbox/DOC-01/ITEM-001-packet-qa.md |

## Registration rules

- New agents choose the next free id in their family (`IMPL-02`, `ARCH-02`,
  …) or a purpose-built id (`RESEARCH-07`). Coordinator registers before first
  session open — no id, no task.
- Status is one of ACTIVE / STANDBY / RESERVED / PARKED / RETIRED. RESERVED =
  registered for an owner launch not yet happened (setup prompt + launch folder
  staged; flips ACTIVE on first report, PARKED if never launched). PARKED ids keep history
  but take no tasks (cf. parked 2026-09-22 lane entries — same discipline).
- Exactly one ACTIVE task row per agent. Concurrent tasks need distinct ids.
- `last session` names the Ω session-ledger session id once opened; local
  pre-ledger work cites date + mission until the ledger session exists.
- This file is updated by the coordinator on every session open/close. Agents
  request changes via outbox, never by direct edit during concurrent flight.
