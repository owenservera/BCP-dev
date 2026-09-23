# docs/archive — retained history, not authority

Moved here during the 2026-09-23 repository cleanup so a fresh agent can tell
CURRENT apart from HISTORY at a glance. Nothing under `docs/archive/` guides
current implementation. Current truth lives in:

- `/AGENTS.md`, `/BUILD_CONTEXT.md` (repo root)
- `docs/CURRENT-CONTEXT.md`
- `docs/CONTEXT-system.md`, `docs/CONTEXT-product.md`, `docs/CONTEXT-appendix.md`

| Subdir | What it holds | Period | Authoritative? | Replaced by |
|---|---|---|---|---|
| `sessions/` | Past agent session logs (`master-.md`, `session-ses_f371.md`) | 2026-09-22 build day | No — raw research | `docs/CONTEXT-*.md` synthesis |
| `conversations/` | Exported chat transcripts + notes (`chat-*.txt`, `Untitled.txt`, `Thoughts on a response.txt`) | 2026-09-16 – 09-21 | No — raw research | `docs/EXPERIMENTAL-PATHS.md`, Ω vision records |
| `planning/` | Reserved for retired planning docs (empty at cleanup) | — | No | — |

Original filenames preserved. Do not move files back without a cleanup-record entry.
