# D-460 — D-409 SF2 decided: CAS blobs as `cas:` rows in vault ns `proposal`, written by the capture seam

## Status

PROPOSED

## Context

- D-409 split the mine family and left four sub-forks named (SF1–SF4). **SF2** —
  "CAS blobs vs rows; incremental hashing budget" — was the storage question the
  `casRef` on every receipt row had been carefully avoiding.
- The avoidance was load-bearing at the time. `casRefFor` returns `cas:<hash>`, a
  pure function of the content, so the address encodes no storage decision and SF2
  could land without re-capturing any mine.
- **What the seam actually did until this record landed:** nothing wrote the bytes.
  `admit()` read a file, called `hashFileBytes`, pushed `{path, hash, bytes,
  casRef}` and dropped the buffer. Every `casRef` was an address with no store
  behind it, and a consumer built to the scope line alone would have resolved every
  one of them to nothing.
- D-TEAM-023 (board DECISIONS.md) settled the sub-fork by OPTION, and the option it
  reached — CAS blobs written by the capture seam, addressed by the receipt's
  existing `casRef` — needed no gate amendment and zero `host/src` LOC.
- `WS-5-core-build.md:83-84`: the ratified `docs/decisions/` record is written by
  the implementing corridor, carrying the CAS location and the incremental-hashing
  budget as its evidence. This is that record.

Blocks: Wave 1

## Options

| Criterion | (a) `cas:` rows in ns `proposal`, written by the capture seam | (b) Capture emits inventory rows directly | (c) `forge.survey` re-walks the mine tree |
|---|---|---|---|
| Where the bytes live | one governed row per DISTINCT content address, in the namespace the receipt already uses | the receipt itself carries file content | nowhere — the survey op reads the foreign tree |
| Gate impact | none: the class-span rule reads declared contributions (one class per plugin), and the catalog is unaffected because no op is added or renamed | none mechanically — the surviving objection is design: it duplicates `forge.survey.run@1`'s own declared result | **violates the class-span rule's stated intent and no check catches it** |
| Effect on the ratified invariants | none — ns `proposal` stays the only forge ns and the frozen 24-op wire is untouched | none | the READ class would perform the highest-risk act in the system, ungated |
| Reversibility | one revert; nothing ratified is amended | one revert | one revert, but the class split has to be re-cut |
| What it costs | ~120 fsynced appends per capture on Windows; base64 inflates payloads ~33% | the frozen capture-receipt schema is a `strictObject` and would need amending — amendment-class | the "no gate checks this" gap stays open and unmechanised |

## Decision

**Decision:** (a) — CAS blobs are governed rows in vault ns `proposal`, one per
DISTINCT content address, row id `cas:<sha256hex>` **identical to the receipt's own
`casRef`**, payload `{schemaVersion, op, casRef, hash, bytes, encoding:"base64",
data}` carrying base64 of the **NORMALISED** bytes, written and read back by
`forge.mine.capture@1` **before** the receipt row is appended. This is why: the
address a receipt cites is the address the bytes live at, so there is no second
naming scheme to drift, no new namespace to own, and no frozen rule to amend.

## Consequences

- **The payload is the normalised buffer, never the raw on-disk bytes.** Load-
  bearing, not stylistic: the capture's declared hash domain is
  `sha256(CRLF→LF-normalised bytes)`, so raw bytes do not re-hash to the receipt's
  hash on a CRLF checkout — and this checkout IS CRLF. Storing raw bytes would make
  every consumer's `hashBytes(decoded) === row.hash` check fail on every affected
  file, and it would have presented as a consumer bug.
- **Order is the fail-closed law.** No receipt is emitted for a snapshot that is not
  fully materialised. The converse is safe: orphan blob rows are inert, because
  nothing cites them except a receipt, and a receipt is only returned once every
  blob it cites read back byte-identical.
- **One rule, two paths.** The CAS-path and receipt-path failures both refuse
  `CAPTURE_LEDGER_REFUSED`, and the **detail names the offending row** — the
  `cas:<sha256hex>` id or the `mine:<repo>/<rootHash>` id. Under one shared rule the
  two ledger paths would otherwise be indistinguishable; the detail is the
  discriminator, and the refusal suite pins that it is there.
- **`forge.survey.run@1` re-verifies before it reports.** Each blob is decoded
  strictly (a lenient base64 decoder would turn corruption into a plausible buffer)
  and re-hashed against the address the receipt cited. A mismatch is a named
  refusal, because the frozen inventory-row schema is a `strictObject` with nowhere
  to record an unverified row.
- **GENERALITY DIVERGENCE, recorded rather than left as prose drift.**
  `docs/forge/OMEGA-FORGE-ARCHITECTURE.md:649-651` predicts `generic` for
  `forge.survey.run@1` and `harvested` for `forge.survey.render@1`. **This landing
  ships `speculative` for both.** `generic` requires ≥2 resolvable evidence refs
  with at least one independent of the declared mine (`sdk/src/validate.ts`), which a
  first landing cannot honestly evidence; `harvested` requires a pinned `mine`, real
  `originPaths` and a harvest class, and this op generalises past
  `fixtures/mines/synthetic-v0` — claiming that fixture as its origin would be a
  claim about provenance it does not have. Promoting either is a separate decision
  with evidence behind it. The manifest, the plugin README and this record say the
  same thing about which.
- **The "no gate checks this" gap stays OPEN and this decision does not close it.**
  No gate stops a READ-class forge op from touching the filesystem; the class-span
  rule reads the manifest's declared contributions. What holds `plugins/forge-survey/`
  honest is an import-**specifier** scan in its happy suite — evidence about this
  plugin, not a mechanical guarantee about the class. Do not read a green
  forge-surface stage as proof that a READ op is pure.
- **NOT SOLVED HERE — the incremental-hashing budget.** A re-capture of an unchanged
  mine still **reads and re-hashes every file**: the walk is the evidence, and
  skipping it would make the receipt a claim rather than a measurement. Only the
  **writes** dedupe, because the row id is the content address and append is
  latest-wins per id. A path+mtime+size cache is a separate decision with its own
  evidence cycle.
- **Rollback:** one revert. Nothing ratified is amended — the invariants hold
  throughout (host LOC untouched; the frozen 24-op wire untouched; ns `proposal`
  remains the only forge ns).

## Evidence

- **F-CAS** — the falsifier: capture, then read every `cas:` row back and assert each
  decoded blob re-hashes to the receipt row's hash, its length matches, and its
  bytes equal the mine's own CRLF→LF-normalised bytes, including the CRLF files,
  which is the case that goes red if raw bytes were stored.
  Executed: `bun test plugins/forge-mine-capture --max-concurrency 1` → 54 pass /
  0 fail, logging `[cas] 41/41 distinct casRefs resolved to a ledger row whose
  decoded bytes re-hash to the receipt's hash` over the pinned 42-file mine (41
  distinct addresses — one byte-identical pair shares a row, which is content
  addressing working, not a miss).
- **F-CAS-ORDER** — the fail-closed ordering is pinned, not incidental: with the
  append capability withheld the refusal detail names a `cas:sha256:` row and NOT
  the `mine:` receipt id; with the batched-read capability withheld it names the
  blob READ-BACK. Both asserted inside `expect()` in
  `plugins/forge-mine-capture/test/refusal/capture-refusals.test.ts`.
- **F-SURVEY-CONSUMER** — `bun test plugins/forge-survey --max-concurrency 1` →
  85 pass / 0 fail. Every inventory row validates against the frozen
  `InventoryRowSchema`; the atlas is byte-identical across two calls (11,767 bytes
  over 42 sections); survey's mirrored row-id derivation, sha256 and base64 decoder
  each agree with the capture's own on the LIVE receipt and every live blob; the
  mine tree and the ledger are byte-identical before and after.
- **THE PREMISE WAS WRONG AND IS CORRECTED HERE.** The lane's own scope line said
  "CAS blobs are written by the existing `forge.mine.capture@1` seam". They were
  not: the capture read, hashed and pushed a row per file, and the op's only
  mutation was the receipt append. A survey built to that premise alone would have
  refused on every real file — a shipped op that cannot succeed.
- **Measured cost, and which budget is real.** The pinned 42-file mine now issues 41
  blob appends plus the receipt append, each a two-phase fsyncing vault write (~120
  fsyncs on Windows). Measured ~1.2 s on a fresh vault and over 5 s on one that has
  already absorbed several captures. The manifest's `runtime.budget.cpuMs` is left at
  4000 because that is the honest number for the CPU this op spends **and because
  nothing in `host/src` reads that field** (only `maxConcurrentCalls` is enforced,
  `host/src/ports.ts:315`). The bound that actually fires is the CALLER's
  `deadlineMs`, default 5000 (`host/src/ports.ts:438`), so both suites declare
  `CAPTURE_DEADLINE_MS = 60_000` with the measurement in a comment. Before this
  change the default was sufficient; with the CAS producer in place the refusal suite
  went red on it (`BUDGET: deadline 5000ms exceeded`).
- **A zero-byte file is legal.** The pinned mine contains one; its payload is the
  empty string, which is strict base64 by every rule the decoders apply. An earlier
  draft of the decoder rejected an empty payload and refused that row — caught by
  the suite, fixed, and recorded because "empty means malformed" is the kind of
  assumption that looks like a check.
- **A claim this record does not make:** that the ledger cost is free. Base64
  inflates each payload ~33%, and `vault.compact@1` has no id-prefix logic, so these
  rows are compacted as ordinary objects. Accepted for a first landing; a real
  mine's row count is a separate measurement nobody has taken yet.

## Index

summary: CAS blobs live as cas:sha256hex rows in vault ns proposal, one per distinct content address, written and read back by forge.mine.capture@1 before the receipt is emitted
rationale: D-TEAM-023 settled the sub-fork by option, not by gate: the address was already a pure function of the content, the seam was already the one place allowed to touch a mine, and no frozen rule actually blocked it
class: evidence
