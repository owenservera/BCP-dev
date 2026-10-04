# D-458 — A UI surface may live in `tooling/`: the placement law for the dashboard

> Numbering: D-458 was reserved by the Ω Board session of 2026-09-29 for the dashboard
> placement record (WS-3 entry question BQ-6) and is written here as board entry
> D-TEAM-006 — severity S2, TEAM-DECIDED, effective immediately, OWNER-INFORM. D-459's
> numbering note records the reservation and still reads true.

## Status

RATIFIED

## Context

- `tooling/` has two ratified precedents, and both are command-line rounds: D-414 (the
  round-close automator — one fail-closed ceremony command) and D-422 (the efficiency
  tooling round — brief, failures-only, docscan, entry, ledger). Neither is a UI surface,
  so neither answers whether a UI surface may live there.
- The team dashboard v1 (WS-3, the owner's requirement of 2026-09-29) is a local web
  surface. Board entry D-TEAM-004 chose the standalone-in-`tooling/` host over the Tauri
  OS shell; D-TEAM-005 chose to build it in parallel with gate work. Neither entry
  answers the governance question — WS-3 BQ-6 — that the placement is sanctioned rather
  than merely chosen.
- Without this record the placement is an undocumented convention. In this tree an
  undocumented convention is the drift class the generated-row era exists to kill
  (D-410's hand-typed-row trap, D-413's one-derivation law): the first reader who
  disagrees with the placement has nothing to cite, and the first agent who wants a
  second UI surface has no rule to point at.
- The alternative route — plugin governance — was weighed and rejected at the board: a
  dashboard is not a runtime capability, and a system plugin would hand it exactly the
  authority this placement is meant to withhold.

Blocks: none

## Options

| Criterion | (a) placement law by record, with the authority constraints written down — this record | (b) plugin governance for the dashboard | (c) no record; treat `tooling/` as convention |
|---|---|---|---|
| The placement is law, not taste | Yes — the rule and its constraints are citable from either side | Yes, but at the cost of granting a UI surface runtime standing it must not have | No — the first disagreement has no ruling to cite, and the convention erodes silently |
| Runtime authority | Explicitly zero: no op, no namespace, no import into a runtime compartment | A plugin can grant ops; the constraint becomes "please don't" | Unstated — which is how a UI surface grows an import edge nobody reviewed |
| Precedent | Extends D-414/D-422's tooling lane from CLI to UI, with the constraints named | No precedent for a UI as a plugin; invents a standing the surface does not need | No precedent; D-410's lesson is that conventions without records are the drift class |
| Reversibility | A later dated record narrows or withdraws the placement; the surface directory is removable | Plugin manifest changes ripple through the grant net | Cheap to change and cheap to lose — nobody knows it was ever decided |

## Decision

**Decision:** (a) — a UI surface may live in `tooling/`, and the placement carries three
standing constraints that the surface is falsified by breaking:

- **Authority is zero.** A UI surface in `tooling/` grants no runtime op, registers no
  vault namespace, and is not a capability. It is a reader and a composer over material
  that already exists; it adds nothing to the runtime that a plugin could invoke.
- **The gate-owned tree is off-limits to it.** The surface reads no gate-owned artifact
  and writes none. `tooling/gates/**`, `docs/BUILD-DECISIONS.md`, `build/genome.json`,
  `build/status.json`, and the decision records are its forbidden set. The moment the UI
  reads or mutates one, the parallel-lane premise of D-TEAM-005 and the
  "re-opens nothing" claim of D-TEAM-004 are both falsified, and this record must be
  re-decided rather than stretched.
- **No OS shell.** The surface carries no OS-shell dependency. The Tauri OS shell stays a
  future host for the day the OS lane reopens — not this lane's problem, and not a
  migration this placement schedules.

Naming and file placement follow the existing tooling convention: the surface is a
directory under `tooling/` next to the other tooling lanes, its own `package.json`
workspace where it needs one, and no exemption of its own anywhere.

One honest caveat about enforcement, stated here rather than discovered later: the
`bun-surface`, `os-surface`, and `import-surface` gate stages scan the production
directories only — host, shim, contracts, platform, sdk, testkit, `surfaces/*`,
`plugins/*` — and `tooling/` is **not** in that list (`bun run omega:gate --explain
os-surface` names the scope as "prod */src"). These three constraints are therefore
review-enforced today, not gate-enforced. The mechanical fix belongs to the surface's
own lane: either a `bun test` suite under `tooling/` that fails when a constraint breaks,
or widening the stages' directory list. This record does not change a gate stage.

## Consequences

- WS-3 BQ-6 is discharged by record: the dashboard's placement is law before the surface
  exists, which is the same shape D-459 uses for vocabulary that lands ahead of its
  consumer — commit the rule, let the consumer arrive with its own wave and falsifier.
- What gets harder: any future UI surface in `tooling/` inherits three constraints, and a
  UI surface that genuinely needs runtime authority must go through plugin governance
  instead — the placement is a permission with a boundary, not a general exemption.
- What gets easier: the dashboard lane has no open governance question left to answer, and
  a reviewer of that lane cites this record instead of re-arguing placement.
- What stays weak until the lane acts: the three constraints above are review-enforced,
  because the prod-directory gate stages do not scan `tooling/` (stated in the Decision and
  measured in the Evidence). The record removes the governance question; it does not add a
  mechanical check, and it does not pretend to.
- Revisit trigger: if the surface grows runtime authority, if the owner revives the OS lane,
  or if the enforcement gap above is closed by a widening of the prod-directory scan, a
  later dated record re-decides. This record is superseded, never rewritten (board entry
  D-TEAM-011).
- Out of scope: which panel, which transport, and whether the owner's instruction channel
  ships in v1 — those are board entries D-TEAM-003 and D-TEAM-005 and the WS-3 backlog.

## Evidence

- Falsifiers (named before the flip, per D-364; the named-falsifier form of D-426). This
  is a directive-class record; the checks are mechanical and each names its own command.
  - `F-TOOLING-UI.1` (placement is the only sanctioned one) — every rendered UI surface in
    the tree lives under `tooling/`, and none has appeared under `plugins/`, `surfaces/`,
    `platform/`, or `host/`. Measured at this record's landing: a tree-wide sweep finds
    zero `.html`/`.css`/`.jsx`/`.tsx`/`.vue`/`.svelte` files, and `surfaces/web` is a
    headless HTTP server (774 lines across api/server/events/boot — no HTML rendering, no
    `text/html` content type), so the clause holds by absence today and becomes
    load-bearing the moment the dashboard lands. Check: the asset sweep above plus the
    `import-surface` gate stage.
  - `F-TOOLING-UI.2` (authority stays zero) — no file under `tooling/` that belongs to a
    UI surface is imported by anything under `host/`, `contracts/`, `platform/`, or
    `plugins/`, and the surface registers no vault namespace and grants no op. Trivially
    green at this record's landing (there is no surface yet) and **not** enforced by a
    current stage: `import-surface` and `bun-surface` scan the prod directories, which do
    not include `tooling/`. The check that closes this is the surface's own refusal tests.
  - `F-TOOLING-UI.3` (no shell resurrection) — the surface imports no OS-shell or Tauri
    module and adds no OS dependency: no `process.platform` branch, no `/tmp/` literal, no
    raw permission call, anywhere in its files. Also not stage-enforced today for the same
    reason — `os-surface` scans `prod */src` and `tooling/` is not one of them
    (`bun run tooling/gates/gate.ts --explain os-surface` states the scope). The check that
    closes this is the surface's own tests, or the OS lane reopening and widening the scan.
- Lineage and ratification event: board entry D-TEAM-006 (severity S2, TEAM-DECIDED)
  entered the board ledger at commit `e3f33583` ("policy(decide-and-inform): owner
  directive — no human decision blocks… DECISIONS-POLICY + ledger (D-TEAM-001..014
  converting BQ-1..9…)"). That commit is this record's ratification receipt; the decision is
  effective on its landing.
- Board-ledger reasoning, quoted rather than re-derived: the rejected alternatives were
  plugin governance (rejected: a dashboard is not a runtime capability) and no record at
  all (rejected: drift); the revisit condition is the surface growing runtime authority.
- Precedents extended: D-414 (the CLI ceremony in `tooling/`) and D-422 (the tooling round
  in `tooling/`) are the precedent this record generalizes — both named in the board entry
  as precedents that do not cover a UI surface. Placement of the host itself is board entry
  D-TEAM-004; parallel sequencing is D-TEAM-005.
- Working-set entry question discharged: `.zcode/workstreams/WS-3-dashboard-v1.md` BQ-6
  and backlog item 1, whose recommendation already named this record.

## Index

summary: A UI surface may live in tooling/ — the dashboard placement law, carrying three standing constraints: zero runtime authority, no reading or writing of gate-owned artifacts, and no OS shell
rationale: D-414/D-422 are command-line precedents that do not cover a UI surface, so without a record the placement is an undocumented convention, and an undocumented convention is exactly the drift class a later reader cannot cite a ruling against
class: directive
