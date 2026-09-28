# Provenance — OpenCode Swarm Bootstrap Corpus

> Imported: 2026-09-28
> Import method: content transfer (path-scoped), **not** history merge
> Destination: `omega-endstate` lane (Branch B)

## Why this folder exists here

The `omega-endstate` runtime design set reasons about a "generic bootstrap" proposal in
`omega-endstate-build/departments/03-CEO-AND-MVP-BUILDER/runtime/DOCS/11-bootstrap-reconciliation.md`,
and the runtime vendors an `opencode-swarm` implementation at
`omega-endstate-build/departments/03-CEO-AND-MVP-BUILDER/runtime/vendor/opencode-swarm/`.

The design corpus that documents *why* those things look the way they do was never present in this
lane's tree. It existed only on an orphaned remote ref. This folder closes that lineage gap.

## Source

| Field | Value |
|---|---|
| Source ref | `origin/work/generic-opencode-swarm-bootstrap` |
| Source tip | `6e0e9e5b` |
| Source ref disposition | **retained, not merged, not deleted** |
| Lane split base | `53e0cfb3` (2026-09-28 06:14:19) |
| Byte-identity | verified — `git diff` against source is empty for all 14 files |

## Source commits carried as content (17)

These are the commits that authored this folder. They are listed for lineage. **They are not
ancestors of this branch** — their content was transferred, not their history.

```
6e0e9e5b bootstrap: add Windows guide to corpus map
dbb0b7e5 bootstrap: add Windows operations guide
e0f83032 bootstrap: correct optional config projection example
04436974 bootstrap: add implementation-grade bootstrap contract
e35956b7 bootstrap: include second-pass audit caveats in corpus map
4cb4c026 bootstrap: record reference audit caveats
68d5e637 bootstrap: add generic OpenCode swarm design 09-NON-DECISIONS.md
9f45d6c0 bootstrap: add generic OpenCode swarm design 08-IMPLEMENTATION-ROADMAP.md
f5e8c184 bootstrap: add generic OpenCode swarm design 07-CONFORMANCE.md
641ca519 bootstrap: add generic OpenCode swarm design 06-IMPLEMENTATION-SHAPE.md
2fc26199 bootstrap: add generic OpenCode swarm design 05-OPERATIONS-MAP.md
cbe21a2c bootstrap: add generic OpenCode swarm design 04-CONFIG-PROJECTION.md
f1632cc8 bootstrap: add generic OpenCode swarm design 03-BOOTSTRAP-PROTOCOL.md
60292ce9 bootstrap: add generic OpenCode swarm design 02-BOOTSTRAP-CONTRACT.md
0bba62f3 bootstrap: add generic OpenCode swarm design 01-CORE-PRESERVATION.md
601f80b1 bootstrap: add generic OpenCode swarm design 00-SOURCE-FORENSICS.md
f5188cdd bootstrap: add generic OpenCode swarm design README.md
```

## Why history was NOT merged — the decisive reason

`origin/work/generic-opencode-swarm-bootstrap` is **not** an independent third swimlane. Its 22
commits past the split base decompose as:

- **17** commits authoring this corpus, and
- **5** commits that already exist on Branch A (`main`), namely
  `2b592a77`, `edfe49b1`, `03408b8b`, `119c9f13`, `09f7ed24`.

`git merge-base team/omega-endstate origin/work/generic-opencode-swarm-bootstrap` returns the split
base `53e0cfb3`, which makes the source look like a clean sibling. It is not. Merging it would have
silently transplanted five Branch A commits into Branch B and destroyed the lane separation that
`53e0cfb3` exists to establish.

Additionally, `git merge-base --is-ancestor origin/work/generic-opencode-swarm-bootstrap main`
style reachability checks are misleading here: the source ref's tip is the most recent commit
anywhere in this repository, yet none of its history is in this lane.

**Decision: copy content, preserve history, breach no boundary.** The source ref is left intact and
remains the authoritative record of how this corpus was authored.

## Verification performed

- `git diff origin/work/generic-opencode-swarm-bootstrap -- AGENTS_CONTEXT/OPENCODE-SWARM-BOOTSTRAP`
  → empty (all 14 files byte-identical to source)
- Path overlap between the source ref and `team/omega-endstate` over the corpus path → none
- Path absence check: `AGENTS_CONTEXT/OPENCODE-SWARM-BOOTSTRAP/` did not previously exist in this
  lane → import is purely additive, no duplication

## Maintenance

Edits made in this lane are lane-local and do not flow back to the source ref. If the source ref
is later superseded or closed, this folder plus this file remain the working copy of record.
