# Resident-Team Research Library

> Status: ACTIVE RESEARCH
> Date: 2026-09-28
> Scope: external research informing the Ω resident-team evolution

This folder is evidence and synthesis material. It is not Ω law and does not automatically become implementation guidance.

## Purpose

Collect research on long-lived resident teams, heterogeneous agent organization, autonomous delegation, coordination protocols, self-evolution, role/skill portability, execution isolation, task dependencies, and quality gates.

## Source set

- R-01 Meta-Team
- R-02 OneManCompany
- R-03 Swarm Skills
- R-04 SwarmAgentic
- R-05 ClawTeam

See `00-SOURCE-INDEX.md` for primary links.

## Extraction model

Each source is read at four levels:

1. **Mechanism** — what it actually specifies or implements.
2. **Reason** — the problem that mechanism addresses.
3. **Transferable practice** — the part that appears framework-independent.
4. **Ω translation** — compatibility with identity, authority, evidence, locality, and native OpenCode execution.

The synthesis is `LAYERED-INSIGHTS.md`.

## Research discipline

A finding can progress through:

`OBSERVED -> CANDIDATE PRACTICE -> Ω HYPOTHESIS -> EXPERIMENT -> PROVEN / REFUTED`

It does not jump directly from publication to implementation.

## Initial cross-source conclusion

The strongest convergence is not simply "use more agents." It is:

> **Make organization, execution context, coordination history, evaluation, and evolution explicit enough that the team can improve without repeatedly reconstructing how it worked.**

The key Ω tension is that external systems often give a supervisor or optimizer broad control over allocation and evolution. Ω needs that power split carefully between resident judgment, governed authorization, native execution, and durable evidence.

## Explicit anti-pattern layer

The library maintains an explicit catalog of failure patterns:

`09-ANTI-PATTERN-CATALOG.md`

Anti-patterns are treated as reusable design intelligence. They should be checked before a research conclusion becomes a design proposal and should grow when new evidence reveals a recurring failure mode.

The catalog currently covers identity, delegation, alternate spawn surfaces, work graphs, acceptance, persistence, recovery, self-evolution, research methodology, and observability.

## Seeded resident: resident-research

This research directory is also the seed/home-in-formation of a proposed resident agent:

`research/agent/`

The seed contains:

- `CORE-IDENTITY.md`
- `BOOTSTRAP-PROMPT.md`
- `RESEARCH-CONTRACT.md`
- `RUNBOOK.md`
- `STATE.md`
- `TASKS.md`
- `LESSONS.md`

Its responsibility is to perform the research loop that created this library and keep the knowledge surface current.

The seed is deliberately **not** added to the ratified Commons roster yet. Agent creation, identity ratification, runtime qualification, and Commons registration remain separate governance steps.
