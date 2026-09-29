# Ω End-State Build — Project Structure

The Omega end-state build separates the build/source surface from the project-management surface.

## Canonical repository placement

The Ω End-State Build is a tracked project rooted at:

`BCP-dev/omega-endstate-build/`

Therefore, when an Ω branch is checked out in the canonical `BCP-dev` checkout, the physical project path is:

`<BCP-dev checkout>/omega-endstate-build/`

An isolated autonomous-agent worktree may materialize the same tracked tree at a different machine-local path. That is Git execution isolation; it does not create a second Ω project root or a second project-management hierarchy.

The canonical project structure is:

```text
BCP-dev/
└── omega-endstate-build/
    │
    ├── Vision.md
    ├── Motivation.md
    ├── Invariants.md
    ├── Anti-Patterns.md
    │
    ├── runtime/                      # OpenCode / agentic-system implementation
    ├── scripts/                      # local development-system tooling
    │
    └── project-management/           # organizational / project-management memory
        │
        └── departments/
            ├── 01-RESEARCH-AND-ALIGNMENT/
            ├── 02-TRUTH-AND-TRUST/
            └── 03-CEO-AND-MVP-BUILDER/
                ├── AGENTS.md
                ├── SITREP.md
                ├── control-plane/
                ├── STEW-01/
                ├── DEVOPS-01/
                ├── team/
                └── roadmap/
```

## Department boundaries

### 01 — Research & Alignment

Discovery, research, architectural reasoning, design, investigation and alignment.

### 02 — Truth & Trust

Evidence, falsification, independent verification, governance safeguards, gates and durable trust/state.

### 03 — CEO & MVP Builder

Founder-level product ownership, MVP delivery, roadmap, team coordination and project-management state.

03 is not the home of the OpenCode/agentic-system implementation.

## Structural rules

Project-management artifacts belong under `project-management/departments/<DEPARTMENT>/`.

Build/runtime implementation belongs under the build root (`runtime/`, `scripts/`, and other source/build surfaces).

Agent identity homes, execution workspaces, worktree registries and machine-local runtime state are not additional project layers.

Do not create `agents/`, `workspaces/`, or agent-specific execution hierarchies inside `omega-endstate-build/` merely to represent autonomous workers.

Concurrent autonomous agents use isolated Git worktrees or clones outside the tracked project directory. Their branch identifies the task/change, not the agent.
