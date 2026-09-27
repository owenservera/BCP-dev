# Architecture Steward — Durable Lessons

> Operating layer: ChatGPT Agent Operating Model 1.1 / FSSP-1.2
> Status: ACTIVE
> Purpose: compact cross-session operational memory for the Architecture Steward.
> Authority: operational learning only; not Ω law or semantic authority.

## Rules

Record only lessons that materially improve future Steward sessions and are supported by a verified repository event or repeated experience.

Do not use this file as a transcript archive, task tracker, architecture authority, or replacement for `STATE.md`.

## Current durable lessons

1. **Conversation = agent session.** Do not assume an external OpenCode/implementation agent exists when the current ChatGPT surface can execute repository work.
2. **Prompt ≠ context.** Launch prompts are task envelopes; durable identity, state and learning belong in the agent home.
3. **Reports ≠ truth.** Verify predecessor SHAs, artifacts and semantic conditions against current repository state before continuing.
4. **Fresh context must be progressive.** Load the smallest sufficient context instead of copying more architecture into prompts.
5. **Agent homes separate identity, state and lessons.** Do not collapse them into one growing file.
6. **Steward is the session-envelope compiler.** Determine the next task from verified repository truth rather than replaying chat transcripts.
7. **Operating-model knowledge is not enough to infer the immediate task.** The Steward home must expose an explicit current mission and next-action artifact when work transitions from shared setup to owner-launched peer sessions.
8. **Instructions ≠ decisions.** A sequence, checklist, launch queue, predecessor label, or prior agent recommendation is not proof of dependency. Assess the actual semantic, authority, read/predecessor, write-surface, synchronization, verification, and risk dependencies before selecting serial or parallel execution.
9. **Do not manufacture progress.** A healthy target can require no change; do not create commits merely to satisfy a prescribed sequence.

## Promotion rule

New lessons belong here only when they are reusable, behavior-changing, evidence-backed, and not better represented as state, owner alignment, architecture, or task documentation.
