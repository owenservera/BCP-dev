# WS-010 Round 2 — Identity Falsifier Matrix

> **Classification: DERIVED — PROPOSED (WS-010 research, not authority)**
> Rule: identity without display names. Every row gives the non-name key and
> the merge test that keeps scopes apart.

## Z-KEYS — non-name identity keys (corpus-verified)

| Object | Identity key (no display name) | Scope | Merge test |
|---|---|---|---|
| P1-01 | (`P1-01`,`WS-001`) co-occurrence | WORKSTREAMS registry | both halves present in one row |
| P1-02 | (`P1-02`,`WS-002`) co-occurrence | WORKSTREAMS registry | same; status from row, charter-state from banner (separate) |
| FAM-09.1 | `FAM-09.1` regex match | capabilities.yaml | exact sub-cap id; ≠ family, ≠ work_item |
| EXP-2026-006 | `EXP-2026-006` regex match | experiments.yaml | exact exp id |
| D-456 | (`D-456`, tree-lineage) + record file | tree ledger | lineage tag + resolvable file + SHA-cited Evidence |
| Ω-0 | layer `id` in registry v1 | layers.json | equal id + registry version; ≠ treeId ≠ specId |
| Commit | full 40-hex SHA | repo object store | byte equality |
| PR | (repo, number) | GitHub repo | repo-qualified; ≠ branch ≠ merge commit |
| IMPL-03 | `agentId` | ROSTER | exact id; statuses roll, ids never reused |
| PKT-002 | (`PKT-002`, version ∅) | packets/ | id + version; -vN is a different node |
| MIG-001 | id agreeing in 3 places | migration/ (index+record+dir) | triple agreement (V-1) |
| MIG-003 dir | path only (NO record identity) | working tree | absence of record/index = absence of record-object |
| Ten/nine pair | (source-cell, tip, temporal scope) per side | per-source | sides never fused into one count node |
| Dep row C13 | (source,target,edge_type,depth) tuple | deps.yaml | full-tuple equality |
| provider plugins | `(repo,path,tip,sha256)` per dir | working tree @ tip | content-hash; same path + new hash = changed node |
| C15 gap | (question text, scope, guard-record) | unresolved-list scope | gaps merge only on identical scope+guard |

## Z-TRAPS — cross-scope separation tests (all PASS: remain separate)

- Z1. `AGT-b1` vs `IMPL-02` vs `agent:…` runtime rows: three namespaces,
  no bridge source. A join on "b1"/"02"/substring is forbidden by key
  shape (regex scopes differ).
- Z2. `AGT-coordinator` vs `COORD-01`: name-similarity lure; keys live in
  disjoint files with disjoint regexes. No edge, not even heuristic
  (similarity of ROLE WORDS is not even H-PATHSIM-grade — roles are
  cheap words; rejected at candidacy).
- Z3. Tree `D-449` (spec paper id cited inside Ω-0's row) vs any tree
  `D-449` record: lineage tag decides; the registry's collision note is
  the explicit bridge format. A bare-`D-NNN` reference renders
  lineage-ambiguous until resolved (docscan S4 enforces resolvability).
- Z4. PKT-004/HANDOFF-007 @ `3867963` (originating bytes) vs canonical
  PKT-005/HANDOFF-009: byte-identity does NOT confer registry-identity;
  only the CURRENT/WORKSTREAMS mapping row bridges. (Generalizes Y6-duplicate
  rule: content equality ≠ object equality.)
- Z5. Packet extraction-session strings vs ledger session ids: timestamp
  overlap is coincidence until a handoff records the link. (M-SESSION.)
- Z6. `vivim.self`-era "WS-002" vs current WS-002: era tag part of key
  (folded-into P1-04 recorded in WORKSTREAMS).
- Z7. Deleted branch (`impl-03/…`) referenced by live rows: key resolves
  to ABSENT object; reference preserved, target marked absent (Q4) —
  identity of the REFERENCE survives the death of the REFERENT.
- Z8. `FAM-09` vs `FAM-09.1` vs hypothetical `WRK-FAM09-014`: set vs
  member vs targeting-work — three keys, `part-of` / `targets` edges,
  never fusion.
- Z9. `main`-tip file vs branch-tip file (PR #11 WS-010 files): same path,
  different tips = different pinned nodes; branch node carries PROPOSED
  status, never main truth.

## Z-NAME — display-name independence audit

All 15 corpus cards (ROUND-2-CORPUS + language contract E1–E9) were
re-checked: every card's technical-refs field contains the full key from
Z-KEYS, and removing the display-name field leaves a uniquely addressable
node. Two cards needed no repair; the audit's standing rule (added to the
language contract by reference): **name-stripping test passes before any
card template is accepted** (implementation-feasibility item B6).
