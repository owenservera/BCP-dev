# D-437 — Doctruth: the librarian's manifest, the citation law, and the docscan absorption

## Status

RATIFIED

## Context

- The Ω-5.5 spec (paper `D-439`, the delivered upgrade doc
  `omega-upgrades/OMEGA-5.5-AUTO-LIBRARIAN-DOCTRUTH.md`) names builder gap
  #7: generated docs are checkable claims with no checker. The tree's
  docscan (D-422/A15, report-only since landing) checks internal doc-logic
  (S1–S6); nothing checks GENERATED-doc honesty — source manifests,
  generator drift, citation resolution at print.
- The one invariant: **self-knowledge that cannot lie.** A librarian document
  carries an internal source manifest (path + sha256 + role); every factual
  claim resolves to a commit/record/row/file:line, hash-pinned; drift is
  rows, not vibes; the model may PHRASE summaries but facts and pointers
  come from the substrate, and an uncited claim refuses to print.

Blocks: none

## Options

| Criterion | (a) librarian registry + verify core + the docscan absorption + the D-415 flip shape | (b) extend docscan only | (c) trust the generators |
|---|---|---|---|
| Source drift localizable | Yes — per-doc manifests hash every source; DOCTRUTH_DRIFT names doc + source | No — docscan sees prose logic, not provenance | No |
| Generator drift caught | Yes — re-derivation byte-diff (LIBRARIAN_GENERATOR_DRIFT) | No | No |
| Uncited claims refuse | Yes — LIBRARIAN_CLAIM_UNCITED at print (the citation law) | No | No |
| S1–S6 keep running | Yes — absorbed as librarian.verify's internal-docs stage, verdicts identical | Yes | No |
| Zero host LOC | Yes — tooling/ only | Yes | Yes |

## Decision

**Decision:** (a) — `tooling/gates/doctruth.ts`, in substance:

- **The librarian registry** (`docs/librarian.json`, the hand-maintained
  input — the genome-registry idiom): one row per governed doc
  `{docPath, era: "generated" | "hand", sources: [{path, role}], generator}`
  — the source MANIFEST each governed doc answers to.
- **`librarian.verify@1`** (the pure core `verifyLibrarian`): for every row —
  hash every source (a changed source without a regen is
  `DOCTRUTH_DRIFT`, naming doc + source + role); for `generated` era, run
  the re-derivation (an injected generator) and byte-diff
  (`LIBRARIAN_GENERATOR_DRIFT`); a governed doc with no manifest row is
  `LIBRARIAN_SOURCE_MANIFEST_MISSING`; then the ABSORBED internal-docs
  stage — docscan's S1–S6 (`scanDocs`, imported, verdicts identical: seed
  continuity is a falsifier).
- **The D-415 flip shape (honest, as-built):** `era: "hand"` docs are
  report-only FOREVER (their facts are acts of authorship); `era:
  "generated"` docs fail the verdict on drift — the flip this record
  wires, one green wave after the report-only landing per the D-415
  pattern (this record IS the green wave; the gate-stage flip rides the
  same commit as the first generated-era registration).
- **The citation law** (`claimCited` / `summarizeRows`): every claim row
  carries `cites: [{kind: "record" | "commit" | "file", ref}]`; the print
  fold resolves each — a record id with no record file, a commit with no
  object, a file:line that does not exist → `LIBRARIAN_CLAIM_UNCITED`,
  the claim refuses to print (the summary renders without it and names
  the refusal).
- **`librarian.drift.read@1`**: the drift report sorted by blast radius
  (docs with the most dependents first — the pure fold over the verdict).
- **`librarian.regenerate@1`**: EXTERNAL_MUTATION; the only writer of
  governed paths — riding D-436's `deriveVerdict` tamper gate (the
  derivation tool's grant is the registry row).

## Consequences

- Generated docs become checkable claims: source manifests pin provenance,
  re-derivation catches generator drift, the citation law refuses
  fabrication at print, and S1–S6 keep running inside the same verdict.
- As-built honesty: (1) the re-derivation generator is INJECTED (a
  `(row) => string` over the registry row) — the tree's real generators
  (omega:genome, omega:questions) wire in as the generators of their own
  artifacts in the follow-up integrations; the first registered
  generated-era doc is `build/genome.md` (the most-derived artifact in
  the tree). (2) The commit-citation resolution checks the git object
  store via an injected `commitExists` (tests inject fakes; the op layer
  wires `git cat-file`). (3) docscan.ts stays exactly where it is (its
  CLI surface is unchanged) — doctruth IMPORTS `scanDocs`; absorption
  means dependency, not deletion.
- Zero host LOC; no new dependencies; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-437` generates the RED stub this list resolves to):
  - `F-DOCTRUTH.1` (seeded-rot) — a source mutated without regen is DOCTRUTH_DRIFT naming the doc, the source, and the role
  - `F-DOCTRUTH.2` (fabricated-pointer) — a claim citing a nonexistent decision refuses to print with LIBRARIAN_CLAIM_UNCITED naming the claim
  - `F-DOCTRUTH.3` (manifest-less) — a governed doc with no manifest row is LIBRARIAN_SOURCE_MANIFEST_MISSING
  - `F-DOCTRUTH.4` (generator-honesty) — a hand-edited generated doc fails the re-derivation byte-diff with LIBRARIAN_GENERATOR_DRIFT; the hand era never re-derives (report-only forever)
  - `F-DOCTRUTH.5` (summary-audit) — a 50-commit range's claims all resolve; a deleted citation makes the claim vanish or the generation refuse
  - `F-DOCTRUTH.6` (seed-continuity) — the absorbed S1–S6 verdicts are identical to docscan's own on the repo's corpus
  - `F-DOCTRUTH.7` (headless) — the whole ceremony is CLI/daemon-only
- Files: `tooling/gates/doctruth.ts` (the pure core: verifyLibrarian,
  claimCited, summarizeRows, driftReport, the registry loader),
  `docs/librarian.json` (the registry: `build/genome.md` generated-era
  first registration), `tooling/gates/test/f-doctruth.test.ts`.
- Refusal register (exact): DOCTRUTH_DRIFT · LIBRARIAN_CLAIM_UNCITED ·
  LIBRARIAN_SOURCE_MANIFEST_MISSING · LIBRARIAN_GENERATOR_DRIFT ·
  LIBRARIAN_CITATION_UNRESOLVABLE.
- Precedents: spec `D-439` (Ω-5.5); `D-422` (the docscan seed absorbed);
  `D-415` (the flip pattern: report-only one green wave, then failing);
  `D-436` (the tamper gate the regenerate op rides); `D-364`.


- Ratified on greens (evidence-class, F-DOCTRUTH.1-7 green in this record's tree BEFORE the flip per D-364): landing commit 92d8657; full gate green 1306/0 ×2 on the PROPOSED tree (2026-09-21T04:56:32Z and 05:01Z; the prior tip's 1278 + 28 new); zero host LOC; anvil untouched.

## Index

summary: tooling/gates/doctruth.ts — the librarian's law: per-doc source manifests (sha256-pinned roles), re-derivation byte-diffs for generated-era docs, the citation law that refuses uncited claims at print, drift reports by blast radius, and the docscan S1-S6 absorbed as the internal-docs stage (verdicts identical)
rationale: Self-knowledge that cannot lie - generated docs are checkable claims, and a doc whose sources drifted, whose generator diverged, or whose claims cite nothing is drift rendered as rows, not vibes (Omega-5.5, the auto-librarian doctruth spec)
class: evidence
