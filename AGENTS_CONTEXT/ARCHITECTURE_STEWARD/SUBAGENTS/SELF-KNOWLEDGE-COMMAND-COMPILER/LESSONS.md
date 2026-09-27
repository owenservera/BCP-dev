# CFA-03 — Semantic Continuity Steward — Durable Lessons

> Operating layer: ChatGPT Agent Operating Model 1.0 / FSSP-1.3
> Status: ACTIVE
> Purpose: compact cross-session operational memory.
> Authority: operational learning only; not Ω law, semantic authority, or current state.

## Rules

Record only lessons that materially improve future sessions and are supported by a verified repository event or repeated experience.

Do not use this file as a transcript, task tracker, architecture authority, or copy of `STATE.md`.

## Durable lessons

### L-2026-09-27-01 — Local protocol references can drift while identity remains valid
A ratified agent home can retain a valid identity and still fail a clean cold start when `SESSION-CONTEXT.md` or `LESSONS.md` points to an obsolete FSSP version. Future home validation must reconcile local protocol references against the current shared FSSP before declaring the front door healthy.

Evidence: repository FSSP-1.3 and Session Result Contract 1.1 on current `main`, versus the pre-upgrade CFA-03 front-door files labelled FSSP-1.1.

## Promotion rule

A session may add a lesson when the lesson is:
- reusable across future sessions;
- specific enough to change agent behavior;
- evidence-backed;
- not better represented as ordinary state, owner alignment, or architecture documentation.
