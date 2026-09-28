# Ω End-State Build — Project Structure

The Omega end-state build separates the build/source surface from the project-management surface.

```text
omega-endstate-build/
│
├── Vision.md
├── Motivation.md
├── Invariants.md
├── Anti-Patterns.md
│
├── runtime/                         # OpenCode / agentic-system implementation
├── scripts/                         # local development-system tooling
│
└── project-management/             # organizational / project-management memory
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

## Structural rule

Project-management artifacts belong under `project-management/departments/<DEPARTMENT>/`.

Build/runtime implementation belongs under the build root (`runtime/`, `scripts/`, and other source/build surfaces).

Do not create additional execution-workspace hierarchies inside the project-management tree.
