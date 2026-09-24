# WS-010 Round 2 — Corpus (exact adversarial set, evidence-pinned)

> **Classification: DERIVED — PROPOSED (WS-010 research, not authority)**
> **Branch:** `coord/p1-10-program-observatory-v0` @ `94cd43d` · **Main:** `fbef973`
> **Method:** every object below was re-read from source this round. Nine
> axes per object use source-native values only; no cross-domain enums
> invented. `N/A` = axis categorically inapplicable to the kind (applicability
> rules in ASSERTION-FALSIFIER-MATRIX §X-APPL). `UNKNOWN` = applicable but
> unsourced. `CONFLICTED` = two sourced values disagree.

## C1. P1-01 / WS-001 — Cooperative Agent System

- Identity: compound `P1-01` + `WS-001`, co-occurring in WORKSTREAMS row.
- Axes: authority supporting (derived procedure, never law) · lifecycle
  proven@coordinator-verdict (registry: ACTIVE; proof: PROVEN) · operational
  idle (Phase 2 closed, DIR-003 reserved elsewhere) · epistemic observed ·
  freshness current (CURRENT.md 2026-09-24) · origin authored+derived
  (charter + closers) · visibility tracked · ownership owner/COORD-01
  (OBSERVED, ROSTER+CURRENT) · governance tool-governed (SYSTEM §13).
- Relationships: --evidenced-by--> PKT-001/002/004/005, HANDOFF-001/004…
  (EXPLICIT evidence-chain rows); --contains--> launch folder (real containment).

## C2. P1-02 / WS-002 — Repository Truth, Cleanup & Drift

- Identity: compound `P1-02` + `WS-002`.
- Axes: authority supporting · lifecycle registered@registry-row +
  charter-proposed@charter-banner (TWO lifecycle assertions, different
  scopes — A-MULTI pattern) · operational parked (launch pending owner)
  · epistemic observed · freshness current · origin authored+derived ·
  visibility tracked · ownership UNKNOWN (TBD — owner/coordinator launch
  decision pending) · governance owner-required.
- Relationships: pilot branch --evidence-toward--> P1-02 (EXPLICIT README
  wording: "evidence toward, not proof of"); PR #8 --evidences--> drift work.

## C3. BCP capability FAM-09.1 — Airlock Forge

- Identity: `FAM-09.1` (`^FAM-\d{2}\.\d$`), member of FAM-09, never the
  family id. Verified this round: name "Airlock Forge", depth **L0**,
  invariant "Import preserves counts and writes harvested rows, or it
  rolls back" (`capabilities.yaml`).
- Axes: authority supporting (tool-gated state) · lifecycle L0@depth-scale
  (a *depth*, not a lifecycle — depth and lifecycle stay separate; no
  experiment-status applies: Path C's experiment is C4) · operational idle
  (no lease ever; c1 unspawned) · epistemic observed · freshness current
  (`updated_at 2026-09-22T16:46:16Z`, validate green) · origin authored
  (seed) · visibility tracked · ownership UNKNOWN (no lease holder, no
  directive assignee — activity-based guessing forbidden) · governance
  tool-governed + owner-required (Path-C start owns reconciliation per C8).
- Relationships: --requires(L1)--> FAM-11.1 (EXPLICIT, C13).

## C4. BCP experiment EXP-2026-006 — Path C Airlock

- Identity: `EXP-2026-006` (`^EXP-\d{4}-\d{3}$`).
- Axes: authority supporting · lifecycle proposed@experiments.yaml ·
  operational parked (gate OPEN + c1 unspawned = recorded wait, not motion)
  · epistemic observed · freshness current · origin authored (owner-directed
  seed 2026-09-22) · visibility tracked · ownership UNKNOWN · governance
  owner-required (coordinator re-issues before resume).
- Relationships: --in-scope--> FAM-09.1 (+ FAM-11.1 via the requires edge);
  --blocked-on--> nothing recorded (OPEN gate ≠ block; no BLOCKS edge, no
  BLOCKED_ON signal — waiting-on with no object renders as unassigned wait).

## C5. Ω decision D-456 — Chrome-only v1 substrate

- Identity: tree-lineage `D-456` + record file (re-read this round: Status
  RATIFIED, class directive, six sections + matrix + `**Decision:** (a)`).
- Axes: authority authoritative · lifecycle ratified@record-Status ·
  operational N/A (law is not operated; enforcement is gate machinery's
  state, not the record's) · epistemic observed · freshness current
  (no supersession marker; invariants-freshness would report staleness) ·
  origin authored · visibility tracked · ownership N/A (law has
  ratifiers, not owners — Evidence names them) · governance protected
  (supersede-only).
- Relationships: --removes-concept--> Ollama-first sequencing (EXPLICIT
  Decision+Consequences inventory); --paired-with--> D-418 (cite jointly).

## C6. Ω genome layer Ω-0 — Hermetic bootstrap

- Identity: layer `id: "Ω-0"` in `layers.json` v1 (verified this round:
  status implemented, treeId 431, specId "D-449", falsifier F-BOOT,
  dependsOn [CORE]). NOT tree D-431, NOT spec D-449.
- Axes: authority supporting (derived fold over law) · lifecycle
  implemented@registry-status · operational N/A (layer is structural) ·
  epistemic observed (dual-report rule would show here if assumed) ·
  freshness current (fold byte-verified; drift = gate failure) · origin
  derived (fold; hand-authored input = registry ONLY) · visibility tracked
  · ownership N/A (constitutional structure) · governance
  generator-only (fold writes `build/`, never the registry).
- Relationships: --depends-on--> CORE (EXPLICIT); --recorded-by--> tree
  D-431; --specified-by--> spec D-449 (three nodes, two assertions).
- Noted this round: registry vocabulary lists four statuses but all 32
  rows are `implemented` — vocabulary-with-empty-extension (same pattern
  as BCP `work_item`). Rule: vocabulary ≠ population; empty sets render
  honestly (see FINDINGS §N-VOCAB).

## C7. Commit / PR — PR #8 merge `537d987`

- Identity: three nodes — PR `(BCP-dev, #8)`, head branch
  `chore/p1-02-doc-drift-sweep`, merge commit
  `537d987723c72377ee5c11baa80d221ed6024fd6` (full SHA verified in log).
- Axes (merge commit): authority supporting (history, append-only) ·
  lifecycle merged@log · operational N/A · epistemic observed · freshness
  tip-pinned (ancestor of current tip) · origin authored · visibility
  tracked · ownership associated (author row, not owner) · governance
  protected (history never rewritten).
- Axes (PR #8 object): lifecycle merged/closed@GitHub-state (GitHub-side;
  no V0 reader — UNKNOWN from static reads, honestly labeled).
- Relationships: merge commit --closes--> PR (MECHANICALLY DERIVED,
  message parse); PR --proposes--> branch tip (EXPLICIT GitHub object).

## C8. Cooperative agent IMPL-03

- Identity: `IMPL-03` (ROSTER). Re-verified: STANDBY, verification
  delivered, branch `impl-03/p1-01-independent-verification` deleted
  2026-09-24, deposits on main.
- Axes: authority supporting · lifecycle standby@ROSTER · operational idle
  · epistemic observed · freshness current (tip `5d25664` marker rolled;
  markerchk: ROSTER tip vs main tip is itself an A5 input) · origin
  authored · visibility tracked · ownership N/A (agents are not owned;
  tasked: --holds-task--> none currently) · governance tool-governed.
- Relationships: --authored--> PKT-005/HANDOFF-009/ITEM-001 (EXPLICIT);
  --branched-as--> deleted branch (EXPLICIT row + ABSENT object — Q4 case).

## C9. Packet PKT-002

- Identity: `PKT-002` (no -vN; STANDS, extended not replaced).
  Re-read header: classification DERIVED-CURRENT, sources HANDOFF-002/
  003/004 + three outbox items, base `43c4400`, SHA256 provenance pins.
- Axes: authority non-authoritative · lifecycle current@banner ·
  operational N/A · epistemic observed (fact table with per-row status) ·
  freshness stale-relative-to-tip (base `43c4400` ≠ tip; content stands
  per CURRENT evidence chain — staleness ≠ falsehood, shown with age) ·
  origin derived (named sources + extraction session) · visibility tracked ·
  ownership associated (IMPL-02 extraction) · governance cleanup-safe.
- Relationships: --ingests--> handoffs/outbox (EXPLICIT ranges);
  --extends--> PKT-001 (not --supersedes--; the distinction matters).

## C10. Migration record MIG-001

- Identity: `MIG-001-chatgpt-send-message` agreeing across index row +
  record JSON `migration_id` + directory (V-1 check).
- Axes: authority supporting · lifecycle verified@index-status; proof-quad
  static PROVEN / integration PROVEN-recorded-fixture / live UNVERIFIED /
  regression UNVERIFIED (four epistemic values, one object — A-MULTI) ·
  operational N/A (record is evidence, not activity) · epistemic
  mixed (per-observation confidences OBSERVED→UNKNOWN) · freshness current
  (pinned, immutable) · origin derived (assay→spec→mapping→verification) ·
  visibility tracked · ownership associated (agent assay; product-intent
  confirmation open) · governance protected (VERIFIED immutable).
- Relationships: --sources--> 16 VIVIM/Ω paths @sha256 (EXPLICIT);
  --targets--> `message.send@1` + provider-browser (EXPLICIT omega_target);
  --discards--> monolith import / Prisma port / selector port (negative
  provenance, first-class).

## C11. MIG-003 orphan / unresolved fixture

- Identity: directory `MIG-003-claude-sse-parser/` ONLY. No record JSON,
  no index row. Re-read this round: assay (OBSERVED hashes, gaps named:
  silent line-skip, `input_json_delta` unhandled), behavior-spec,
  `omega-mapping.json` with `unresolved_semantics: [input_json_delta
  streaming, multi-message bodies, reasoning-block vocabulary]`.
- Axes: authority non-authoritative (unindexed work-in-progress) ·
  lifecycle unindexed-work (NOT a lifecycle enum value — an honesty label;
  no enum invented) · operational in-progress-or-parked UNKNOWN (no lease,
  no signal — cannot tell; rendered UNKNOWN, not guessed) · epistemic
  mixed-per-section (assay OBSERVED, semantics UNRESOLVED) · freshness
  tip-pinned, unindexed · origin authored (assay) + derived (mapping) ·
  visibility tracked · ownership UNKNOWN · governance cleanup-safe.
- Relationships: assay --cites--> MIG-002 shared legs (EXPLICIT "shared
  legs cited from MIG-002"); mapping --targets--> parser contribution
  (PROPOSED, unratified — renders dashed). NO --evidenced-by--> record;
  NO index membership. Index absence is data.

## C12. "Ten" registration vs surrounding "nine" statements

- Identity: a proposition-pair, not an object: (a) branch CURRENT.md:17
  "ten P1 workstreams" + portfolio §12 + WORKSTREAMS P1-10 row vs
  (b) branch CURRENT.md:31 "other eight", BOOT:27 "nine", architectural
  context "nine", sealed directives' "P1-02 through P1-09" scope.
- Axes: (a) proposed@branch (PR #11 OPEN — proposal, not law); (b) items
  individually: CURRENT.md:31 stale-on-branch (would be wrong if #11
  lands); BOOT/context historically-correct-on-main (stale only
  post-merge); directives immutable history (correct-at-issue forever).
- Same proposition, three different temporal truth values — the corpus's
  hardest freshness case. Resolution: per-source A5 + temporal scoping,
  never a single "correct count" node (see Q6, FINDINGS §Q).
- Relationship: (a) --conflicts-with--> (b-subset) with resolution
  OWNED by PR #11 integration (recorded wait, not observatory verdict).

## C13. Explicit dependency — FAM-09.1 requires FAM-11.1 @ L1

- Identity: the `deps.yaml` row itself (source/target/edge_type/
  required_depth). Only cross-track edge into the prototype side.
- Classification EXPLICIT. Renders solid with cell citation.
- Note: target FAM-11.1 is prototype-side (EXP-003 scope, proposed) —
  the edge is real while both endpoints' *progress* is parked. Edge truth
  ≠ endpoint motion (tests Grouping/State separation).

## C14. Heuristic candidate — provider-llm vs provider-browser

- Identity: two sibling plugin dirs, both with `src/`, `test/`,
  `plugin.json` (verified on disk this round).
- Name similarity (`provider-*`) + topical overlap (both provider-shaped)
  suggest kinship; D-456 + D-420 fence + D-418 markers state they are
  semantically distinct: browser ships, llm is fenced proving/cited-history
  only. Classification: HEURISTIC kinship (`H-PATHSIM`), EXPLICIT
  distinction. The inferred edge (--supersedes--/--duplicate-of--) is
  REJECTED and preserved as rejected-candidate (Q8) — deletion would lose
  the knowledge that the confusion was considered.
- Renders: two nodes, dashed gray candidate edge tagged
  `H-PATHSIM · rejected by D-456/D-420`, plus the EXPLICIT
  --fenced-by--> D-420 edge on provider-llm.

## C15. Genuinely unresolved — owner of FAM-09.1 / Path-C bridge economics

- Identity: a gap with scope: "who decides Path-C start, and under what
  bridge economics" (CURRENT-CONTEXT unresolved list: God-Adapter/parity-
  tar-pit guards, sunset clause, 3–5 cap; C8 reconciliation owned by
  Path-C start).
- Axes: ownership UNKNOWN (no directive assignee; AGT history ≠ ownership);
  governance owner-required (the only sourced claim: sunset clause stands
  guard). All other axes N/A-or-UNKNOWN, never filled.
- No relationship rendered except --gated-by--> sunset-clause record
  (EXPLICIT guard). The wait has no object and no owner: renders as
  "recorded open question, owner pending" — attention without instruction.
