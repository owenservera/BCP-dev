# WS-010 Round 1 — Model Delta (required corrections to V0 as written)

> **Classification: DERIVED — PROPOSED (WS-010 research, not authority)**
> **Scope:** changes to WS-010's own PROPOSED files only. No Ω law, BCP
> state, or cooperative canonical file is modified by this document.

## D-ENT — entity-kind reclassification (required research Q4)

Kinds from ER-MODEL §2 sorted into the mandated five buckets:

**A. Genuine source/domain objects (keep, source vocabulary preserved):**
Workstream, Agent (scope-suffixed: coop/BCP/runtime), Session (kind-suffixed:
ledger/BCP-state/drill-label), Branch, Worktree, Repository, Directory,
File, Commit, Pull Request, Decision, Evidence, Packet, Handoff, Transcript,
Experiment, Migration Record, BCP capability (`FAM-nn.n`), genome layer,
`work_item` (defined-but-empty — rendered honestly), Principal (Ω
contract sense: `contracts/src/agent.ts` spawner/actor ids).

**B. Derived observatory objects (keep, marked derived, rule-named):**
Program (reconciliation of AGENTS.md + portfolio + CURRENT-CONTEXT),
Territory (curated grouping, NOT a source container), Subsystem/Area
(grouping over explicit edges), Attention Condition (projection over A2/A3
inputs), Conflict (reified claim-pair, CONFLICT-REGISTER pattern), Unknown
(reified gap with scope + reason).

**C. Relationship assertions, NOT entities (remove as kinds, keep as edges):**
`supersedes` (edge), `duplicate-of` (restricted edge), `derived-from`
(edge + receipt). A "Derivation" is the RULE, stored on the edge and the
`derived-from` receipt — not a node. (V4 in FINDINGS.)

**D. Presentation-only concepts (keep out of the model, keep in views):**
Boundary (a rendering of governance + containment edges), Snapshot
(a timed, tip-pinned projection + rebuild receipt — metadata, not a node).

**E. Unnecessary / remove:**
- `Task` — no source; use `work_item` (source, empty) or derived grouping
  label `work-group`. BCP `work_item` must never silently become `task`.
- `Work` — same reason; same replacement.
- `Gate` as entity — gates are mechanisms (verdicts = evidence), and
  `Blocker`/`Owner` collapse into Attention Condition + A8/A9 assertions.
  (`waiting-on`/`blocks` edges + attention projection cover the use cases.)
- `Claim` as separate kind — claims live inside records/packets/handoffs
  with source ranges; reifying bare claims invites LLM-truth-smuggling.
  (Doctruth `ClaimRow` is Ω-side machinery WS-010 *cites*, not a kind it
  instantiates.)
- `Report`/`Issue` — no instances in V0 corpus readers; add with a reader
  or drop. (`Issue` in particular implies a tracker that does not exist.)
- `Test`/`Build/Gate` as entities — evidence artifacts linked via
  `evidenced-by`, not modeled.
- `Source Reference` as entity — it is the receipt shape on every edge
  (R-GRAPH), not a node.
- `Generated Artifact` as kind — `generated` is an A6 origin VALUE applied
  to File/decision-synthesis nodes, not a kind (prevents a parallel
  generated-world ontology).

## D-REL — relationship fixes

1. `contains` narrowed to true containment (R-ALLOW); zoom ladder uses
   `shown-with`.
2. `owned-by` restricted to OBSERVED ownership; new `associated-with`
   default; new `targets`, `renamed-to` (R-ALLOW).
3. HEURISTIC-vs-EXPLICIT rendering rule mandatory (RELATIONSHIP-MATRIX
   header): dashed + badge + rule id; no silent promotion path (H→E
   requires the named receipt in §R-ROWS).
4. Every edge carries the R-GRAPH receipt; receipt-less edges do not render.

## D-STATE — state-dimension fixes

1. Adopt the 9-axis model (ASSERTION-STATE-MODEL); retire ER-MODEL §3
   six-dimension table to a "superseded by Round 1" note (WS-010 may amend
   its own PROPOSED files).
2. All lifecycle tokens mechanism-suffixed (`merging@sweep-depth-math`);
   all A4 values above `weakly-inferred` require tip-pinned inputs.
3. Ownership default `unknown`; no A8 value without a source cell.
4. Cache/snapshot carries rebuild receipt (inputs + rule versions +
   source tips); deletion-safety restated as rebuild test (PROOF-PLAN #13).

## D-LANG — contextual-language fixes

See CONTEXTUAL-LANGUAGE-CONTRACT.md (binding for Rounds 2–3):
extractive-first wording, `INTERPRETATION REQUIRED` tags, identifier-
secondary layout, nine worked examples, six forbidden patterns.

## D-VIEW — view-spec notes (advisory to external agent)

1. Agent Map chain `person/agent → session → workstream → work → branch →
   evidence` crosses three identity scopes (M-AGENT-*, M-SESSION) — the
   view must scope-switch visibly at each hop, never a single "who" lane.
2. Work Map state families (active/waiting/blocked/completed/proposed/
   historical/unknown-conflicted) must each bind to an axis value
   (A3/A2/A4/A5), not to bare words — mapping table owed in Round 2.
3. Time/Evolution stays V0+ (no event-feed reader exists for branch/GitHub
   sides; log/ covers BCP only).

## D-BOOK — bookkeeping inconsistency (for coordinator at PR #11)

1. `CURRENT.md:31` "The other eight" is wrong under both counts
   (main: nine total, eight non-P1-01 others + P1-01 = nine…
   precisely: nine total → "other eight" correct ON MAIN; on the branch
   with ten total it must read "other nine"). Fix at integration.
2. `CHATGPT-ARCHITECTURAL-CONTEXT.md:39,1526` + `CHATGPT-BOOT.md:27`
   ("nine") go stale if PR #11 lands — coordinator-owned files; WS-010
   must not edit them (only coordinator advances CURRENT/WORKSTREAMS and
   derived context). Flag, don't fix.
3. Sealed directives' "P1-02 through P1-09" scope wording predates P1-10;
   transcripts/directives are immutable — annotate by reference, never edit.
4. Portfolio §12→§13 renumber + P1-10 §12 insert reviewed: structurally
   clean; status REGISTERED consistent with WORKSTREAMS row + README
   banner. No silent promotion found (no PROVEN claim, no ACTIVE
   implementation flag).
