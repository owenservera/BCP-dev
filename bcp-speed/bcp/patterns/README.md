# Pattern Library

Reusable implementation templates. One markdown file per pattern:
`PAT-{name}.md` (see `state/taxonomy.yaml` for the ID scheme).

Each pattern file should have:
- **When to use it** — which capability shapes it fits
- **Template** — the starting-point code/structure
- **Common pitfalls** — what goes wrong when people wing it
- **Example** — at least one real implementation that used it

Agents check this directory for a matching pattern before building a
capability from scratch. An empty directory is fine at the start — this
compounds in value as experiments complete and patterns get extracted.

Link a capability to a pattern by adding it to that capability's context
card in `caps/` once you write one, e.g. `caps/FAM-09.3.md`.
