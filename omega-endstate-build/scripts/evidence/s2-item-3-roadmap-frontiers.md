# S2 Item 3 — Roadmap Frontiers (F0–F5)

| Field | Value |
| --- | --- |
| Item | `registry/item-3` (title: `roadmap-frontiers`) |
| Extraction by | `ver-01` |
| File materialized by | `prov-01` (ver-01 has no write/edit/bash tool) |
| Date (UTC) | 2026-09-29T11:08:38Z |
| Git SHA | f523b11b4f66151e9ee5e1a3b0c6dc764415d63a |
| Source file | `omega-endstate-build/project-management/departments/03-CEO-AND-MVP-BUILDER/roadmap/ROADMAP-V1.md` |
| Source section | `## 2. Frontier ordering` |
| Source status | ACTIVE — Owner STEW-01, Date 2026-09-28, 169 lines |

## Frontier ordering

| ID | Title | Line | Priority note |
| --- | --- | --- | --- |
| F0 | Make the substrate load again (blocking, small) | 33 | blocking, small |
| F1 | Close the browser↔chat seam (the real product work) | 48 | the real product work |
| F2 | Prove repeatability, then drift | 72 | — |
| F3 | Second and third provider (Claude, then Gemini) | 84 | — |
| F4 | Single pane of glass | 96 | — |
| F5 | The wider environment | 102 | — |

## Source headings as they appear

```text
33:### F0 — Make the substrate load again (blocking, small)
48:### F1 — Close the browser↔chat seam (the real product work)
72:### F2 — Prove repeatability, then drift
84:### F3 — Second and third provider (Claude, then Gemini)
96:### F4 — Single pane of glass
102:### F5 — The wider environment
```

## Verification

Every line number above was re-derived directly from `ROADMAP-V1.md` via
`grep -nE '^### F[0-9]'` and confirmed to match the staged extraction
(`evidence/item-3-frontiers`) exactly: 33, 48, 72, 84, 96, 102. That grep returns
exactly six `### F#` headings, so F0–F5 is the complete frontier set in this
source section — no frontiers were omitted. F1–F5 also appear in prose at lines
76, 99, 105, 143, 155, 157, 158; those are cross-references inside F0/F1–F4
bodies, not additional frontier definitions, and are excluded from the table.

## Transcription note (deviation from the staged spec)

The staged extraction recorded F1's title as `browser<->chat` using ASCII
`<->`. The source file uses the Unicode LEFT RIGHT ARROW `↔` (U+2194), verified
at byte level (`0xE2 0x86 0x94` in `od -c` output). This receipt follows the
source file, not the staged spec. Any ASCII `<->` rendering downstream is a
display normalization, not the source text.

## Attribution

The domain extraction, frontier identifiers, titles, and line numbers are
ver-01's work. This file was written by prov-01 solely because ver-01 has no
write/edit/bash tool. The attribution line below is preserved verbatim as
required.

item-3 executed by ver-01
