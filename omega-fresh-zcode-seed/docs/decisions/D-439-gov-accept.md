# D-439 — Governance validation, architecture metrics, and omega:accept (the capstone)

## Status

RATIFIED

## Context

- The Ω-7.5 spec (paper `D-441`, the delivered upgrade doc
  `omega-upgrades/OMEGA-7.5-DECISION-VALIDATION-ARCH-METRICS.md`) names
  builder gap #10 — the LAST builder gap: the governance program itself is
  hand-operated. Every check the acceptance sweep names exists as a tool
  (the gate, docscan, the falsifier suites, the boot chain); nothing runs
  them as ONE fail-closed command with an exit code.
- The one invariant: **governance that outlives attention.** `gov.validate`
  checks the corpus mechanically (cited falsifiers, evidence on RATIFIED
  rows, supersession integrity, refusal sentences, namespace law);
  `gov.metrics` derives the scorecard from tree + ledger (never stored);
  `omega:accept` runs the whole acceptance sweep — and unmet is a named
  refusal, not a stack of green-ish outputs.

Blocks: none

## Options

| Criterion | (a) gov.validate + gov.metrics folds + the accept orchestrator (injected stages, real CLI) | (b) more CI YAML | (c) the manual sweep, disciplined |
|---|---|---|---|
| Fail-closed, one command | Yes — omega:accept: exit 0 or GOV_ACCEPT_UNMET naming the stage | Partially — YAML rots invisibly | No |
| Record hygiene mechanical | Yes — GOV_FALSIFIER_UNCITED / GOV_GREEN_WITHOUT_EVIDENCE / GOV_SUPERSESSION_BROKEN / GOV_REFUSAL_SENTENCE_MISSING / GOV_NAMESPACE_UNOWNED | No | No |
| Scorecard cannot lie | Yes — derived from the genome fold + the ledger, never stored | No | No |
| Testable headless | Yes — stages injected in tests, real runners in the CLI | Barely | No |

## Decision

**Decision:** (a) — `tooling/gates/gov.ts`, in substance:

- **`gov.validate@1`** (the pure core `validateCorpus`): six checks over the
  decision corpus — (1) every record cites a named falsifier
  (`GOV_FALSIFIER_UNCITED`); (2) every RATIFIED record carries two-green
  evidence (`GOV_GREEN_WITHOUT_EVIDENCE` — the D-364 bar, text-checked for
  the landing-commit + gate-green claims); (3) supersession markers resolve
  (`GOV_SUPERSESSION_BROKEN` — riding docscan S1); (4) directive-class
  records with an OPEN BLOCKING board row refuse
  (`GOV_VISION_CONTRADICTION`); (5) every refusal code a record names
  exists in the tree's source with its sentence
  (`GOV_REFUSAL_SENTENCE_MISSING` — a paper refusal is a promise, not a
  refusal); (6) every namespace a record's ops write appears in
  docs/VAULT-NAMESPACES.md (`GOV_NAMESPACE_UNOWNED`).
- **`gov.metrics@1`** (the pure fold `deriveScorecard`): the layer table
  (from the genome registry: id, status, treeId, specId, falsifier,
  in-flight), coverage ratios (implemented / total, ratified / records,
  falsifier-resolved / implemented), dependency-order health (deps
  satisfied by implemented-or-assumed), and the hand-fix tally (from the
  session ledger's close envelopes, when present). Deterministic: same
  inputs → byte-identical scorecard.
- **`omega:accept`** (the orchestrator): `gov.validate` → the falsifier
  suites (the full test run, injected as a stage result in tests) →
  doctruth (D-437's verdict) → surface parity (D-436's sweep) → perf
  budgets (D-438's assertion over the live fixtures) → archive integrity
  (the ledger bundle sha vs the README row — injected in tests) → board
  freshness (0 open) → status carriage (status.json's head matches) — ONE
  verdict; any red stage is `GOV_ACCEPT_UNMET` naming the stage and its
  first issue. Exit 0 or exit 1. Headless. The command is itself
  record-cited (this record) and falsifiable (F-GOV-CI below).

## Consequences

- The acceptance sweep becomes one command the owner (or any agent, or CI)
  can run; the sweep's stages are the tools this program already trusts —
  the orchestrator adds the fail-closed fold, not new authority.
- As-built honesty: (1) the archive-integrity stage verifies the LAST
  bundle's sha against the README row via an injected checker (the CLI
  wires round-close's own scan; tests inject a fixture); (2) the
  directive-class contradiction check reads the open-questions board's
  blocking rows (empty today — the check exists for the day it is not);
  (3) gov.metrics' hand-fix tally reads the session envelopes' close
  receipts when present, and reports zero honestly when the store is
  absent (CI clones).
- Zero host LOC; no new dependencies; `package.json` gains `omega:accept`
  and `omega:gov`; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-439` generates the RED stub this list resolves to):
  - `F-GOV-CI.1` (smuggled-record) — a record citing no falsifier fails GOV_FALSIFIER_UNCITED naming the record
  - `F-GOV-CI.2` (one-green-flip) — a RATIFIED record without the two-green evidence claims fails GOV_GREEN_WITHOUT_EVIDENCE
  - `F-GOV-CI.3` (mute-refusal) — a refusal code named by a record but absent from the tree's source fails GOV_REFUSAL_SENTENCE_MISSING
  - `F-GOV-CI.4` (metrics-determinism) — two scorecard runs are byte-identical; a mutated input moves exactly the expected cells
  - `F-GOV-CI.5` (clean-acceptance) — the accept orchestrator exits 0 when every stage is green; a seeded red article fails GOV_ACCEPT_UNMET naming the stage
  - `F-GOV-CI.6` (archive-check) — a corrupted bundle byte fails the archive stage with the mismatch named (sha expected vs found)
  - `F-GOV-CI.7` (headless) — the whole ceremony is CLI/daemon-only; the real-tree validate + metrics run green
- Files: `tooling/gates/gov.ts` (validateCorpus, deriveScorecard,
  runAccept, renderScorecard), `package.json` (omega:gov, omega:accept),
  `tooling/gates/test/f-gov-ci.test.ts`.
- Refusal register (exact): GOV_FALSIFIER_UNCITED ·
  GOV_GREEN_WITHOUT_EVIDENCE · GOV_REFUSAL_SENTENCE_MISSING ·
  GOV_NAMESPACE_UNOWNED · GOV_SUPERSESSION_BROKEN ·
  GOV_VISION_CONTRADICTION · GOV_ACCEPT_UNMET.
- Precedents: spec `D-441` (Ω-7.5 — the last builder-gap document);
  `D-422`/`D-415` (the docscan + freshness seeds); `D-436`/`D-437`/`D-438`
  (the parity, doctruth, and perf stages accept runs); `D-425` (the genome
  the scorecard folds); `D-364` (the evidence bar validate enforces).


- Ratified on greens (evidence-class, F-GOV-CI.1-7 green in this record's tree BEFORE the flip per D-364): landing commit 92d8657; full gate green 1306/0 ×2 on the PROPOSED tree (2026-09-21T04:56:32Z and 05:01Z; the prior tip's 1278 + 28 new); zero host LOC; anvil untouched.

## Index

summary: tooling/gates/gov.ts — gov.validate (six mechanical corpus checks: cited falsifiers, two-green evidence claims, supersession, refusal sentences in source, namespace law), gov.metrics (the deterministic scorecard folded from the genome + ledger, never stored), and omega:accept — the one fail-closed command running validate, falsifier suites, doctruth, parity, perf, archive integrity, board freshness, and status carriage, exit 0 or GOV_ACCEPT_UNMET naming the stage
rationale: Governance that outlives attention - the acceptance sweep is one command whose every stage is a tool the program already trusts, because a constitution checked by hand is a constitution checked when someone remembers (Omega-7.5, the decision-validation capstone)
class: evidence
