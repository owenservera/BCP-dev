# S2 Item 2 — Repo Inventory (`omega-endstate-build` / `project-management`)

| Field | Value |
| --- | --- |
| Item | `registry/item-2` (title: `repo-inventory`) |
| Assignee | `prov-01` |
| Date (UTC) | 2026-09-29T11:06:09Z |
| Git SHA | f523b11b4f66151e9ee5e1a3b0c6dc764415d63a |
| Repo root | `/home/z/my-project/BCP-dev` |
| Scope | Read-only inventory; no files modified other than this receipt |

## Command 1 — `ls omega-endstate-build`

```text
Anti-Patterns.md
Invariants.md
Motivation.md
Vision.md
project-management
runtime
scripts
```

## Command 2 — `ls omega-endstate-build/project-management`

```text
departments
swarm-evolution
```

## Command 3 — `find omega-endstate-build/project-management -maxdepth 2 -name '*.md' | wc -l`

```text
2
```

The two counted files are:

```text
omega-endstate-build/project-management/swarm-evolution/SWARM-END-STATE.md
omega-endstate-build/project-management/swarm-evolution/OMEGA-BUILD-MILESTONES-AND-SWARM-EVOLUTION.md
```

## Observation

`omega-endstate-build` is flat at its top level — four root
narrative documents (`Vision`, `Motivation`, `Invariants`, `Anti-Patterns`)
sitting beside exactly three subtrees (`project-management`, `runtime`,
`scripts`) — and `project-management` is a directory-of-directories that holds
no markdown of its own, so all of its `.md` content (2 files) sits one level
down inside `swarm-evolution/`, with `departments/` contributing none at
`-maxdepth 2`.

## Caveat on the count

The `2` above is bounded by `-maxdepth 2` and reflects only `*.md`; it is not a
total file count and not a recursive inventory. Deeper markdown under
`departments/`, or non-markdown files, are outside this probe and unmeasured.

item-2 executed by prov-01
