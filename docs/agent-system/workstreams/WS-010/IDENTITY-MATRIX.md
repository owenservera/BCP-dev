# WS-010 Round 1 — Identity Matrix

> **Classification: DERIVED — PROPOSED (WS-010 research, not authority)**
> **Base:** `coord/p1-10-program-observatory-v0` @ `94cd43d` · **Tip check:** `main` @ `fbef973`
> **Rule under test:** V0-BLUEPRINT §10 + ER-MODEL §6 — never merge on
> similar names; ambiguity yields unresolved identity, not a guessed merge.

How to read a row: **Source identity** = the canonical identifier in its
home system. **Scope** = the namespace it is unique inside. **Stable** =
whether the identifier survives time/edits. **Same-object test** = what must
hold before two references may render as one node. Anything weaker renders
as two nodes plus a relationship assertion (or UNRESOLVED).

## M-WS — P1-01 / WS-001

- Source identity: `P1-01` (portfolio) + `WS-001` (registry/launch folder).
  The pair is the identity; neither half alone is unique across systems.
- Scope: `docs/agent-system/` cooperative scope.
- Stable: yes (portfolio ids are append-only; folders persist).
- Same-object test: `P1-NN` + `WS-NNN` co-occur in WORKSTREAMS.md row.
  `P1-01` without `WS-001` (or vice versa) is a *reference*, not an object.
- Non-identity relations: `P1-01 --evidenced-by--> PKT-00N / HANDOFF-00N`;
  `WS-001 --contains-->` launch-folder files (real containment).
- UNKNOWN: none structural. Note: earlier proposed `vivim.self` WS-002 is
  folded into P1-04 (WORKSTREAMS P1-04 row) — a same-name search for "WS-002"
  hits two eras; era-tag required.

## M-WS2 — P1-02 / WS-002

- Source identity: `P1-02` + `WS-002`, same compound rule as M-WS.
- Scope: cooperative scope. Stable: yes as identifiers.
- Same-object test: same as M-WS. Status comes from the registry row
  (REGISTERED), charter state from the charter banner (PROPOSED) — two
  different assertions about one object (see ASSERTION-STATE-MODEL §A-MULTI).
- Non-identity relations: pilot branch `impl-04/p1-02-authority-pointer-slice`
  is *evidence toward* P1-02, not P1-02 itself; PR #8 is *evidence of*
  drift-sweep work, not the workstream.
- UNKNOWN: owner (TBD), proof boundary.

## M-CAP — BCP capability (FAM-nn.n)

- Source identity: `FAM-07.2` etc. (`taxonomy.yaml` `sub_capability` regex
  `^FAM-\d{2}\.\d$`); family `FAM-07` groups, never identifies alone.
- Scope: `bcp-speed/bcp/state/capabilities.yaml`. Stable: yes (seeded
  2026-09-22; sweep preserves records, never deletes).
- Same-object test: identical sub-capability id. `FAM-07.2` ≠ `FAM-07`
  (member vs set) ≠ `WRK-FAM07-xxx` (work targeting it, none recorded).
- Non-identity relations: `--requires-->` target capability at a depth
  (EXPLICIT, `deps.yaml`); `--leased-under-->` lease row; `--in-scope-of-->`
  experiment.
- UNKNOWN: realization identity (code paths in `work/`+`workspaces/` are
  agent-workspace claims, not capability-scoped ids).

## M-WRK — BCP work_item (WRK-FAMnn-nnn)

- Source identity: scheme defined (`^WRK-FAM\d{2}-\d{3}$`), **zero
  instances** in `state/` (verified by grep over `state/*.yaml`).
- Scope: BCP state scope (empty extension).
- Stable: n/a — vocabulary without referents.
- Same-object test: cannot arise until an instance is tool-written.
- Observatory consequence: `work_item` renders as a *defined-but-empty*
  source kind. Any populated "work" node in V0 is a DERIVED grouping, never
  a `work_item`. This is the load-bearing reason `Task`/`Work` must not
  enter the source vocabulary (MODEL-DELTA §D-ENT).

## M-GENOME — Ω genome layer (Ω-N / CORE)

- Source identity: layer `id` in `genome/layers.json` (`CORE`, `Ω-0`,
  `Ω-DEV.1`, …). **Not** the tree decision number, **not** the spec paper
  id — the registry's own lineage note keeps three namespaces distinct
  (`id` vs `treeId` vs `specId`), including a recorded tree/spec collision.
- Scope: genome registry. Stable: yes (append-only layers; drift = edit).
- Same-object test: equal layer `id` in the same registry version.
  `Ω-0` ≠ tree `D-431` ≠ spec `D-449` — three nodes, two
  `--recorded-by / --specified-by-->` assertions.
- Non-identity relations: `--depends-on-->` layer id (EXPLICIT);
  `--falsified-by-->` falsifier id.
- UNKNOWN: none structural; `external-assumed` layers carry honest
  dual-state (directive recorded, tree evidence null) — not unknown, but
  two-valued (ASSERTION-STATE-MODEL §A-EPI).

## M-DEC — Ω decision (D-NNN)

- Source identity: `D-NNN` + lineage tag (tree ledger `docs/decisions/` vs
  external spec paper). Bare `D-449` is ambiguous across lineages.
- Scope: tree ledger by default; spec lineage only when backticked/cited.
- Stable: yes for RATIFIED (supersede-only, never edit); PROPOSED may amend
  pre-ratification.
- Same-object test: equal `D-NNN` + equal lineage + resolvable record file
  (the D-record checker's own rule: RATIFIED requires resolvable commit
  SHA in Evidence).
- Non-identity relations: `--supersedes / --superseded-by-->` (EXPLICIT via
  docscan S1/S2 markers); `--evidenced-by-->` falsifier test / gate run;
  `--index-row-->` BUILD-DECISIONS row (derived mirror, not the record).
- UNKNOWN: none structural. Caution: CURRENT-INVARIANTS pass headers
  ("as-of D-431") are freshness pointers, not decision identity.

## M-FILE — Git file (repo path)

- Source identity: repository-relative path + repository identity
  (BCP-dev vs omega-final subtree vs VIVIM subtree). Path alone is not
  identity: same relative path can exist under `omega-baseline/` history
  vs current tree; renames (`git mv`, 8 in cleanup) break naive path keys.
- Scope: single repo @ single tip. Stable: no — renames, moves, deletions.
  Identity must be tip-pinned: `(repo, path, tip-SHA)`.
- Same-object test: equal path + overlapping tip ranges with no rename
  commit between; otherwise `--renamed-to-->` (HEURISTIC unless git
  rename detection confirms, then MECHANICALLY DERIVED).
- Non-identity relations: `--generated-by-->` generator (only where
  librarian registry, `docs/librarian.json` (Ω-side), or file banner
  states it); `--hashed-as-->` sha256 (migration/doctruth pins).
- UNKNOWN: generated-vs-source for unbannered, unregistered files.

## M-COMMIT — Git commit

- Source identity: full SHA (`fbef973c443b…`, never the 7-char prefix as
  identity — prefix is a display abbreviation).
- Scope: repo object store. Stable: yes (content-addressed; history
  rewrite would be a new object, and rewrite is forbidden by convention).
- Same-object test: equal full SHA in the same repo.
- Non-identity relations: `--parent-->` (EXPLICIT, object header);
  `--landed-by-->` PR merge (MECHANICALLY DERIVED from merge commit
  message `Merge pull request #N`); `--evidences-->` decision SHA cited
  in a ratify message (EXPLICIT citation, not proof — D-362 discipline).
- UNKNOWN: none structural. Note: abbreviated SHAs in prose must resolve
  before they identify.

## M-PR — GitHub PR (#N)

- Source identity: `(repo, PR number)` — `owenservera/BCP-dev#11`.
  Bare `#11` collides across repos (`vivim-omega` PRs share numbers).
- Scope: GitHub repo. Stable: number stable; *state* (OPEN/MERGED) is
  temporal — PR #11 OPEN means its branch content is PROPOSED, a fact
  about the PR, not about the files.
- Same-object test: equal repo + number. PR ≠ head branch ≠ merge commit
  (three nodes: PR node, branch node, commit node).
- Non-identity relations: PR `--proposes-->` branch tip;
  `--merges-to-->` base; merge commit `--closes-->` PR.
- UNKNOWN: review/CI state is GitHub-side, not yet sourced into any
  WS-010 reader (out of V0 corpus; would be a new reader, not inference).

## M-AGENT-COOP — Cooperative agent (COORD-01, IMPL-0N, …)

- Source identity: `agentId` in ROSTER.md (`COORD-01`, `IMPL-02`, …).
- Scope: cooperative system. Stable: yes; status rolls ACTIVE/STANDBY/
  RESERVED/PARKED/RETIRED, ids never reused (IMPL-03 keeps history while
  PARKED/branch-deleted).
- Same-object test: equal agentId. Cross-scope joins forbidden by default:
  `IMPL-03` ≠ originating content IDs `PKT-004/HANDOFF-007 @ 3867963`
  remap note — same bytes, different registry slots; the mapping row in
  CURRENT/WORKSTREAMS is the EXPLICIT bridge.
- Non-identity relations: `--holds-task-->` (ROSTER row);
  `--authored-->` handoff/outbox item; `--branched-as-->` git branch.
- UNKNOWN: none structural. Owner vs agent vs human principal stays
  separated (M-AGENT-RT).

## M-AGENT-BCP — BCP agent (AGT-name)

- Source identity: `AGT-a1` etc. (`^AGT-[a-z0-9_-]+$`), appearing in
  leases/log/discoveries.
- Scope: BCP state scope. Stable: yes as strings; liveness from
  `agent_status` (active/idle/stalled/terminated) is temporal.
- Same-object test: equal `AGT-` id. **Never equal to a cooperative id**:
  `AGT-b1` ≠ `IMPL-0N`; `AGT-coordinator` ≠ `COORD-01` (name similarity is
  the trap — SEPARATE namespaces, no bridge source exists).
- Non-identity relations: `--leased-->` capability; `--emitted-->` signal;
  `--logged-->` discovery/failure.
- UNKNOWN: human behind the agent; agent continuity across experiments.

## M-AGENT-RT — Ω runtime AgentIdentity

- Source identity: `agent:<name>-<hex>` vault object id
  (`contracts/src/agent.ts`); agents are DATA (vault rows), not processes.
- Scope: Ω vault namespace. Stable: persistent record; `state` follows
  `LifecycleState`; lineage via `parentId`.
- Same-object test: equal vault id + rev. No instances observable from
  BCP-dev static reads (runtime state needs a booted vault) — V0 renders
  the *kind* (contract shape) with zero runtime rows, or reads
  `build/self-portrait.json` if present (generated, tip-pinned).
- Non-identity relations: `--governed-by-->` BehaviorContract id;
  `--spawned-by-->` principal.
- UNKNOWN: all live rows from static repo reads (boundary honestly kept:
  `process.ts` header confirms compartments cannot see dev-side evidence
  and vice versa — the same discipline applies to WS-010 readers).

## M-SESSION — Session (three disjoint kinds, no universal session object)

- **Ω ledger session** (`20260923-222400-…`, chain-witnessed, D-430):
  identity = ledger session id; scope = ledger home (environment-local,
  never committed). Stable while retained.
- **BCP session row** (`state/sessions.yaml`): currently EMPTY (`{}`).
  Identity scheme exists, extension does not.
- **Packet "extraction session" strings** (e.g. PKT-002's
  `20260923-222400-dir-001-…`): local drill labels, pre-ledger convention
  ("date + mission until the ledger session exists" — ROSTER rules).
- Same-object test: only within one kind, on exact id. A packet's
  extraction-session string ≠ a ledger session id even when the timestamps
  match — different authorities, no bridge.
- UNKNOWN: cross-kind continuity ("was drill X the same sitting as ledger
  session Y") is UNRESOLVED unless a handoff explicitly records the link.

## M-PKT / M-HANDOFF — Packet / handoff

- Source identity: `PKT-NNN(-slug)(-vN)` / `HANDOFF-NNN`; version suffix
  is part of identity (PKT-001 ≠ PKT-001-v2; superseded versions persist
  with forward links).
- Scope: `docs/agent-system/packets/` | `handoffs/`. Stable: immutable
  once written (new derivation → new version, never in-place rewrite).
- Same-object test: equal id + version. The IMPL-03 remap
  (originating PKT-004/HANDOFF-007 @ `3867963` → canonical PKT-005/
  HANDOFF-009) is the cautionary case: byte-identical content, different
  registry identity; only the CURRENT/WORKSTREAMS mapping row bridges them.
- Non-identity relations: packet `--ingests-->` transcript sections
  (EXPLICIT source ranges); handoff `--continues-from-->` packet;
  CURRENT rows `--evidence-linked-->` packets/handoffs (D-DOG-01).
- UNKNOWN: none structural.

## M-MIG — Migration record (MIG-NNN-slug)

- Source identity: `MIG-001-chatgpt-send-message` (directory + record JSON
  `migration_id` must agree; `index.json` row must agree — three places,
  all checked by `verify_migration.py` V-1).
- Scope: `bcp-speed/bcp/migration/`. Stable: VERIFIED records immutable;
  unindexed dirs are work-in-progress.
- Same-object test: equal migration id across index row + record JSON +
  directory. **MIG-003 exists on disk but has no record JSON and no index
  row** — it is *not* a migration-record object; it is an assay-stage
  directory (UNRESOLVED/derived-only fixture). Index absence is data.
- Non-identity relations: `--sources-->` VIVIM files (sha256-pinned);
  `--targets-->` Ω contract ops; `--verdict-->` canonicality rationale.
- UNKNOWN: live proof (explicitly UNVERIFIED in both indexed records).

## M-VIVIM — VIVIM artifact (mine evidence)

- Source identity: `(vivim-final-enhanced-relative-path, sha256, role)` as
  pinned inside a migration record. Raw path alone is weak identity (mine
  is read-only but unversioned from WS-010's viewpoint; no per-file ledger).
- Scope: migration-record citation scope. Stable: content-hash stable;
  path stable in practice (READ-ONLY mine) but not guaranteed by mechanism.
- Same-object test: equal sha256. Same path + different hash = changed
  content (mine drift — reportable, since mine is supposed to be read-only).
- Non-identity relations: `--assayed-as-->` observation claims with
  confidence vocabulary; `--discarded-as-->` transformation exclusions
  (e.g. "wholesale Prisma port" — first-class negative provenance).
- UNKNOWN: which of manifest-vs-plugin drives the live turn (MIG-001
  records this as UNKNOWN — the model preserves the question, not an answer).

## Cross-scope non-merge table (the traps)

| A | B | Verdict | Reason |
|---|---|---|---|
| `AGT-b1` | `IMPL-02` | DISTINCT, no bridge | disjoint namespaces |
| `AGT-coordinator` | `COORD-01` | DISTINCT, no bridge | name similarity only |
| `IMPL-03` content @ `3867963` | PKT-005/HANDOFF-009 | DISTINCT registry slots, bridged | explicit mapping row only |
| tree `D-449` | spec `D-449` | DISTINCT lineages | recorded collision in `layers.json` |
| `Ω-0` layer | tree `D-431` | DISTINCT, asserted | `--recorded-by-->` link |
| packet session string | ledger session id | DISTINCT | different authorities |
| PR #11 | branch `coord/…` | DISTINCT | PR `--proposes-->` tip |
| branch tip | merge commit | DISTINCT | merge creates new object |
| `FAM-07` | `FAM-07.2` | SET vs MEMBER | `part-of`, not identity |
| `WRK-FAM07-014` (hypothetical) | `FAM-07.x` | TARGET vs OBJECT | `targets`, not identity |
| MIG-003 dir | migration record | STAGE vs OBJECT | no record JSON, no index row |
| portrait JSON | runtime state | PROJECTION vs SOURCE | generated, tip-pinned |
| index row (BUILD-DECISIONS) | decision record | MIRROR vs SOURCE | checker parses loosely; record wins |
