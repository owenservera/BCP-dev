# WS-010 Round 1 — Relationship Matrix

> **Classification: DERIVED — PROPOSED (WS-010 research, not authority)**
> **Tests:** V0-BLUEPRINT §11 vocabulary (16 predicates) against the Round-1
> sample corpus. Classes: EXPLICIT | MECHANICALLY DERIVED | HEURISTIC |
> UNRESOLVED. **Display rule:** HEURISTIC edges never render identically to
> EXPLICIT ones (dashed + `heuristic` badge + rule id, minimum).

## R-ALLOW — predicate dispositions

| Predicate | Disposition | Allowed subject → object | Fix vs V0 |
|---|---|---|---|
| `contains` | ALLOW, narrowed | repo→dir→file; composition→spec; workstream→launch-folder files | true containment only (MODEL-DELTA §D-REL) |
| `part-of` | ALLOW | sub-cap→family; layer→genome; record→ledger wave | inverse of `contains`, same receipts |
| `depends-on` / `requires` | ALLOW | cap→cap @ depth (`deps.yaml`); layer→layer | keep source verb `requires` alongside |
| `owned-by` | RESTRICT | only OBSERVED ownership (A8) | else `associated-with` |
| `associated-with` | ALLOW (new) | agent↔work; lease-holder↔cap; author↔handoff | the honest default |
| `worked-by` | ALLOW, narrowed | lease/agent-assignment rows only | never activity-inferred |
| `produces` | ALLOW, narrowed | generator→artifact where librarian/banner says so | else `derived-from` |
| `evidenced-by` | ALLOW | claim→test/run/record/packet/handoff/commit | the primary V0 predicate |
| `derived-from` | ALLOW | projection→sources + rule/generator id (mandatory) | bare `derived-from` invalid |
| `implements` | ALLOW, narrowed | realization→contract/capability where migration or code edge says so | similarity is not implementation |
| `supersedes` | ALLOW | record→record via S1/S2 markers; packet `-v2` chains | EXPLICIT markers only |
| `conflicts-with` | ALLOW | claim↔claim via CONFLICT-REGISTER or open contradiction | symmetric; resolution separate |
| `duplicate-of` | RESTRICT | byte-identical + registry mapping (PKT-004→005 case) | near-duplicates are NOT `duplicate-of` |
| `blocks` | ALLOW | BLOCKS edges; gate-red→landing; ratify-barriers | source or gate verdict only |
| `waiting-on` | ALLOW | BLOCKED_ON_DEPENDENCY signals; recorded owner gates | recorded waits only, never advised next-actions |
| `changes` | ALLOW, narrowed | commit→file (diff); PR→base (merge) | not agent→file ("touched") |
| `references` | ALLOW | citations, index rows, evidence links | weakest predicate; never upgraded silently |
| `shown-with` | ALLOW (new) | presentation grouping incl. zoom ladder | never a semantic edge |
| `targets` | ALLOW (new) | work_item→capability/depth | separates M-WRK from M-CAP |
| `renamed-to` | ALLOW (new) | file→file across rename commits | git-detected only |

## R-ROWS — corpus classifications

### EXPLICIT (in-source assertions, cite the cell)

- R1. `FAM-07.1 --requires(L1)--> FAM-07.2` — `deps.yaml` row.
- R2. `FAM-09.1 --requires(L1)--> FAM-11.1` — `deps.yaml` row (the only
  cross-track edge into the prototype side).
- R3. `Ω-0 --depends-on--> CORE` — `genome/layers.json`.
- R4. `MIG-001 --sources--> seeds/providers/manifests.ts@sha256…` (×16) —
  migration-record `source_locations[]`.
- R5. Lease rows: `AGT-a1 --leased--> FAM-07.2` (`leases.yaml:7-15`).
- R6. `D-456 --supersedes-concept--> Ollama-first sequencing` — record
  Decision + Consequences sweep inventory (concept-removal, markered).
- R7. PKT-002 `--ingests--> HANDOFF-002/003/004` + outbox items — packet header.
- R8. CURRENT/WORKSTREAMS `--evidence-linked-->` PKT-004/HANDOFF-007 and
  the PKT-005/HANDOFF-009 remap — mapping rows (D-DOG-01).
- R9. `IMPL-02 --holds-task--> P1-01-final-integration` — ROSTER row.
- R10. PR #8 merge commit `--closes--> PR #8`; `--lands--> c624cf1 tree`.
- R11. Conflict pairs C1–C13 `Claim A --conflicts-with--> Claim B` (+
  resolution where recorded) — CONFLICT-REGISTER.
- R12. `vivim.self proposal --folded-into--> P1-04` — WORKSTREAMS P1-04 row.

### MECHANICALLY DERIVED (named rule over explicit inputs, rule id stored)

- M1. Sweep expiry: lease past `expires_at` → `expired` + freed
  (`sweep.py` §2; live case: `FAM-08.4`/AGT-b2 stall-free 17:46Z).
- M2. Sweep merging: experiment all-in-scope @ target depth → `merging` +
  `INTEGRATION_READY` (`sweep.py` §4; EXP-004/005). Render ONLY as
  `merging@sweep-depth-math`.
- M3. Commit `--parent-->` links (object headers); `Merge pull request
  #N` → `--closes-->` PR (message parse).
- M4. Abbreviated-SHA → full-SHA resolution (unique-prefix rule).
- M5. Banner/freshness rollup: file banner + tip vs base → A5 value
  (comparison function, inputs stored).
- M6. Librarian/docscanstyle checks re-run read-only (S1/S2 marker
  well-formedness, citation resolvability) — WS-010 reuses the *parsers*,
  never forks them (`process.ts` precedent).

### HEURISTIC (dashed rendering, rule id, never fact)

- H1. Path-similarity grouping (`provider-*.ts` families) — `H-PATHSIM`.
- H2. Transcript-topic → workstream routing — `H-TOPICROUTE`.
- H3. Near-duplicate/duplicate candidacy (composition eras 16/17/18,
  host-LOC eras, `provider.llm` vs `provider.browser`) — `H-NEARDUP`.
  Promotion to `duplicate-of` requires byte-identity + registry mapping;
  promotion to resolved requires an authority record (D-403, C4/C5).
- H4. VIVIM-file → P1-08 relevance outside migration records — `H-MINEFIT`.
- H5. Rename detection across tips without explicit `git mv` record —
  `H-RENAME` (upgradable to DERIVED on git similarity confirmation).
- H6. Stale-probability scoring (old `updated_at`, no tip movement) —
  `H-STALE`; displayed suggestion only, never an A5 value.

### UNRESOLVED (rendered as unknown/gap, worked example: MIG-003)

- U1. MIG-003 directory ↔ migration-record object: no record JSON, no
  index row → NO `evidenced-by`, NO lifecycle beyond `unindexed-work`.
- U2. Artifact ↔ owner for ~all files outside ROSTER/leases/directives.
- U3. Workstream ↔ territory membership (no source asserts it).
- U4. VIVIM-file ↔ Ω-decision links beyond MIG-001/002 record pins.
- U5. Branch-ahead-of-main truth value (no branch feed in V0 corpus).
- U6. Generated-vs-source for unregistered, unbannered files.
- U7. Cross-kind session continuity (M-SESSION).
- U8. GitHub-side review/CI state (no V0 reader).

## R-GRAPH — minimum edge receipt (every edge stores)

`subject | predicate | object | class(E|MD|H|U) | source-cell-or-rule-id |
tip-pinned-at | epistemic qualifier | temporal validity | conflict state`.

Edges missing source-cell-or-rule-id are invalid and must not render.
Adjacency, co-occurrence, and shared-folder residence create NO edge
(V0-BLUEPRINT §11 + O4 hold; PROOF-PLAN adversarial #15).
