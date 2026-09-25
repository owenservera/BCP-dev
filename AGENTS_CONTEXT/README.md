# AGENTS_CONTEXT

> Cold-start context for future agents working on BCP-dev.

## Loading protocol

1. Read AGENTS_CONTEXT/PRODUCT_VISION/STATE.md first.
2. Read AGENTS_CONTEXT/PRODUCT_VISION/SESSION-2026-09-25.json when the reasoning behind the state matters.
3. Read docs/destination/README.md and its linked destination artifacts.
4. Read docs/agent-system/PROGRAM-COMPLETENESS-AND-CONTROLS.md and the destination dependency, traceability, and vertical-slice artifacts.
5. Then inspect the current P1/workstream files relevant to the task.

## Authority hierarchy

- Repository code and explicit current evidence are implementation truth.
- Explicitly canonical Ω decisions/contracts remain technical authority where applicable.
- docs/destination is the working destination/product model; it is not automatically Ω law.
- AGENTS_CONTEXT/PRODUCT_VISION/STATE.md is a session handoff, not architecture law.
- SESSION-2026-09-25.json is source/rationale, not authority.

## Cold-start rule

Do not restart destination design from scratch. Reconcile new work against this package and the linked destination/program artifacts.

When current repository state differs from this handoff, prefer current repository evidence and update the handoff through an explicit change.

## Verified baseline

main HEAD at package creation: cd7b9054d04c70dc816986b4ae9abf0e0d89ba6d (2026-09-25).

## Folder convention

Future durable context packages belong under AGENTS_CONTEXT/<CONTEXT_NAME>/.
Each package should normally contain STATE.md plus source/session material where useful.
## Specialized context packages

- `AGENTS_CONTEXT/PERSONAL_AGENT/` — Personal Agent, self-describing system, deterministic command language, symbolic command system, and the design frontier connecting them.
