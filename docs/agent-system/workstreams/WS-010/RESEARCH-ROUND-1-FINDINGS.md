# WS-010 Round 1 — Findings (local repository research)

> **Classification: DERIVED — PROPOSED (WS-010 research, not authority)**
> **Branch:** `coord/p1-10-program-observatory-v0` @ `94cd43d` (base `main` @ `fbef973`, PR #11 OPEN, not accepted)
> **Role:** local repository research agent · **Round:** 1 — semantic model
> **Date:** 2026-09-24 · **No source authority modified; no UI built.**

## 0. Research frame correction (binding for this round)

1. All WS-010 material lives on the proposal branch, one commit (`94cd43d`)
   ahead of `main`. PR #11 is OPEN. Nothing in `WS-010/` is current-`main`
   authority, and this round treats it strictly as PROPOSED design input.
2. **Bookkeeping inconsistency recorded, not silently merged.** The branch
   updates `CURRENT.md` ("ten P1 workstreams") and adds P1-10 to the
   portfolio and registry, but stale "nine" language survives elsewhere:
   - `CURRENT.md:31` still reads "The other eight are registered boundaries"
     (eight is wrong under either count: 10 − 1 proven = nine remaining).
   - `CHATGPT-ARCHITECTURAL-CONTEXT.md:39,1526`, `CHATGPT-BOOT.md:27` still
     say "nine P1 workstreams".
   - Sealed directives `DIRECTIVE-001` (:52), `DIRECTIVE-002` (:84),
     `DIRECTIVE-003` (:234) say "Do not implement P1-02 through P1-09" —
     historically correct, but their scope wording predates P1-10.
   Correction belongs to the coordinator at PR #11 integration, not to this
   research round. Listed in `MODEL-DELTA.md` §D-BOOK.
3. The architectural hypothesis under test:
   > The observatory renders source-backed assertions about typed observatory
   > objects. The observatory model is a rebuildable projection; it does not
   > own program truth.
   **Verdict for Round 1: SUPPORTED with mandatory deltas.** The repository
   already contains every mechanism the hypothesis needs (federated
   authorities, closed status vocabularies, hash-pinned provenance, a
   rebuildable-projection precedent in `process.ts`/genome fold), but the V0
   entity/relationship/state vocabularies as written would violate the
   hypothesis in at least five places (details §4, full deltas in
   `MODEL-DELTA.md`).

## 1. What was tested and how

- Full WS-010 corpus on the proposal branch (README, V0-BLUEPRINT,
  ENTITY-RELATIONSHIP-MODEL, DESIGN-DECISIONS, VIEW-SPEC,
  AGENT-PAIR-CONTRACT, PROOF-PLAN, RESEARCH-AGENDA, both setup prompts)
  plus the branch diff to `main` (13 files, +1250/−3).
- Concrete source mechanisms, read-only: BCP `taxonomy.yaml`,
  `capabilities.yaml` (14 fams/49 subcaps), `experiments.yaml` (6),
  `leases.yaml` (8 closed), `deps.yaml` (42 edges), `discoveries.yaml` (27),
  `sessions.yaml` (empty), `log/` (105 events), `validate.py` (0 errors),
  `sweep.py` (dry-run semantics only); migration `index.json` (2 indexed) +
  unindexed `MIG-003-claude-sse-parser/` on disk; Ω `genome/layers.json`,
  `contracts/src/agent.ts` + `lifecycle.ts`, gates `doctruth.ts`,
  `docscan.ts` (S1–S6), `process.ts`, `aperture.ts`, `apertureprivacy.ts`,
  `vivim-mind` ops (`mind.snapshot/query/portrait@1`), `kernel-lens`,
  portrait emitter, D-443/D-448/D-451 records; cooperative ROSTER (11
  agents), WORKSTREAMS, CURRENT, 6 packets, 9 handoffs, 2 transcripts;
  git tip/PRs/status; VIVIM provider-plugin samples.
- Deterministic extraction runs (stdout only, nothing written to state).

## 2. Proven findings (repository evidence, reproducible)

- **P1.** Federated authority is real and machine-checkable: Ω law
  (136 `D-*.md`, gate arbiter), BCP vocabulary/state (tool-gated writes),
  migration registry + `verify_migration.py`, librarian/doctruth
  (hash-pinned source manifests, byte-exact regeneration, citation
  resolution), genome fold (hand-authored `layers.json` → derived
  `build/genome.json`, byte-verified). WS-010 consumes; it must not re-own.
- **P2.** Closed status vocabularies exist for every state axis WS-010
  needs: `taxonomy.yaml` enums (work_item/experiment/lease/agent/edge/
  autonomy), Ω `LifecycleState`
  (staged|verified|active|degraded|quarantined|retired), genome layer
  statuses (implemented|external-assumed|ratified-unimplemented|queued),
  banner classes + freshness, migration proof-quad, librarian eras
  (generated|hand). Full per-axis mapping in `ASSERTION-STATE-MODEL.md`.
- **P3.** The rebuildable-projection pattern already exists twice:
  genome fold and `deriveProcessModel` (`process.ts`: "One pure function,
  one shape… REPORT-ONLY… does not create a new authority"). WS-010's
  reconciler has a precedent to copy, including the "only mechanical
  breakage fails" discipline.
- **P4.** Provenance with teeth exists: migration `source_locations[]`
  (path+lines+sha256+role), doctruth `SourceRef` (path+role+sha256),
  D-443 assemblies (deterministic digest over sorted refs + eviction
  rules; `CTX_DIGEST_DIVERGENCE` refuses loudly), packet provenance pins
  (PKT-002 closes PKT-001's hash gap with SHA256 block).
- **P5.** Unknown/conflict are already first-class somewhere: migration
  observation confidences
  (OBSERVED/STRONGLY_INFERRED/WEAKLY_INFERRED/UNKNOWN), genome
  `external-assumed` honest dual-reporting, aperture fail-closed codes
  (`DISCLOSURE_SCOPE_UNKNOWN`, `TARGET_UNRESOLVED`, …), `CONFLICT-REGISTER`
  (C1–C13 with OPEN items), process.ts stale-reporting without failing.
- **P6.** 42 dependency edges are EXPLICIT data (`deps.yaml`:
  source/target/edge_type/required_depth). Sweep rules (conflict,
  expiry, unblock, merging) are deterministic derivations WS-010 can
  re-implement read-only instead of inventing state logic.

## 3. Derived findings (need coordinator/owner confirmation)

- **D1.** The V0 "Program → Territory → … → Source" ladder is a
  presentation ordering, not a containment chain — no source states that a
  workstream is *contained in* a territory. Territories classify as
  **presentation-only** (MODEL-DELTA §D-ENT).
- **D2.** Nine assertion axes are supportable, but WS-010's six ER
  dimensions under-specify three of them (operational state, epistemic
  state, freshness split out of lifecycle). See ASSERTION-STATE-MODEL.
- **D3.** `MIG-003-claude-sse-parser/` (assay + behavior-spec +
  omega-mapping, no record JSON, absent from `index.json`) is the correct
  canonical fixture for UNRESOLVED/derived-only observatory objects.
- **D4.** `sessions.yaml` is empty (`{}`); live session truth for BCP
  agents is in `leases.yaml` + `log/`, for cooperative agents in ROSTER +
  handoffs, for Ω sessions in the ledger (D-430, environment-local). No
  single "session object" exists — session identity is scope-relative
  (IDENTITY-MATRIX §M-SESSION).

## 4. Hypothesis violations found in V0 as written (must fix before Round 3)

- **V1. `Task` + `Work` + BCP `work_item` triple vocabulary.** `work_item`
  is a taxonomy-defined term ("atomic unit of build work targeting a
  depth", `WRK-FAMnn-nnn`) with **zero instances** in state. `Task` and
  `Work` are WS-010 inventions with no source. Keeping all three lets the
  observatory mint work semantics — a second task system by vocabulary.
  Fix: source objects use `work_item` (and show its empty set honestly);
  observatory grouping uses one derived label, never `Task`.
- **V2. `owned-by` in the V0 predicate list.** Ownership has almost no
  source (ROSTER covers agents, not artifacts). A first-class `owned-by`
  predicate invites inference-from-activity. Fix: demote to
  `associated-with` (sourced) + `owner-required` governance flag; `owned-by`
  only where a source literally records an owner.
- **V3. Six ER state dimensions vs nine required axes.** Collapsing
  operational, epistemic, and freshness into lifecycle/authority repeats
  the exact failure O5 forbids. Fix: adopt the 9-axis assertion model.
- **V4. `Snapshot`/`Derivation` as entity kinds.** Both are observatory
  machinery (a Derivation is the rule; a Snapshot is a timed projection),
  not program objects. As entity kinds they invite storing truth in the
  cache. Fix: reclassify as derived-object + presentation metadata.
- **V5. `contains` without containment sources.** No source asserts
  workstream∈territory or file∈subsystem containment. Rendering the zoom
  ladder as `contains` edges fabricates structure. Fix: ladder = `shown-
  with` presentation grouping; `contains` only for real containment
  (repo→directory→file, composition→spec).

## 5. Heuristics used (flagged, none rendered as fact)

- Path-similarity grouping (e.g. provider plugin families) — HEURISTIC.
- Transcript-topic → workstream routing — HEURISTIC.
- "Same concept, two docs" duplicate detection (composition eras, host LOC
  eras) — HEURISTIC unless a record (D-403, C4/C5) resolves it, then
  EXPLICIT-resolution over HEURISTIC-candidate.
- VIVIM-file → P1-08 relevance — HEURISTIC outside migration records.

## 6. Unknowns (preserved, not resolved)

- Contents of `bcp-algos/`, `setupdocs.zip`, `REPO-CLEANUP-PROMPT-V2.md`
  (hands-off; not inspected for classification).
- Artifact ownership for ~everything outside ROSTER/agent assignment.
- VIVIM↔Ω links beyond the two indexed migration records.
- Whether Time/Evolution belongs in V0 (already open in DESIGN-DECISIONS).
- Rendering technology, shell, storage, update frequency (already open).

## 7. Contradictions met

- Branch says ten workstreams; `CURRENT.md:31` ("other eight"),
  architectural context ("nine"), BOOT ("nine") disagree → recorded §0.2,
  fix assigned to PR #11 integration, not to research.
- `index.json` (2 migrations) vs disk (MIG-003 present, unindexed,
  record-less) → classified as UNRESOLVED/derived-only fixture, not a
  registry error to fix unilaterally.
- Tree decision ids vs external spec ids collide by design
  (`layers.json` lineage note) → identity rule: never equate `D-NNN`
  across lineages without the registry row.

## 8. Rejected assumptions

- R1. That WS-010 files existed on `main` (Round-0 finding; corrected —
  they exist only on the proposal branch).
- R2. That BCP `work_item` is a populated source object (zero instances;
  vocabulary without extension).
- R3. That one session/agent/owner identity spans BCP, cooperative, and Ω
  scopes (three disjoint namespaces + ledger; see IDENTITY-MATRIX).
- R4. That the zoom ladder is a containment hierarchy (no source; it is
  presentation grouping).
- R5. That attention can be ranked (no source priority; unranked
  conditions only — V0 already states this; Round 1 confirms no source
  exists to tempt otherwise).

## 9. Recommended next research gate (Round 2 entry criteria)

1. Coordinator rules on MODEL-DELTA §D-BOOK (nine/ten cleanup at PR #11)
   and §D-ENT/§D-REL/§D-STATE (vocabulary and axis fixes) — WS-010 edits
   its own PROPOSED files; no other authority touched.
2. External agent reconciles the corrected model against UX/semantic goals;
   any predicate it needs beyond RELATIONSHIP-MATRIX §R-ALLOW must arrive
   with a named source or stay HEURISTIC-tagged.
3. Round 3 thin slice stays frozen at RESEARCH-AGENDA's 9-object corpus
   (program/territories, P1-01, P1-02, one decision, one BCP item, one
   agent, one commit/PR, one evidence artifact, one unknown/conflict) and
   adds MIG-003 as the mandatory UNRESOLVED fixture.
4. No implementation gate opens before ROUND-1-FALSIFIERS.md rows F-01…
   F-15 all pass against the corrected model on paper.
