# CFA-08 — Session Context

> Protocol: FSSP-1.0
> Status: RATIFIED — OWNER-ALIGNED
> Navigation aid only; not authority itself.

## Identity
- CFA: CFA-08 — Experience / Interaction / Surfaces
- identity: Experience / Interaction / Surfaces Steward
- agent_id: `experience-interaction-surfaces`
- workspace: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/`
- durable identity: `CORE-AGENT.md`
- state: `STATE.md`

## Mission
Human-facing representation, navigation, manipulation, configuration and re-entry across World, Context, Intent, Work, capabilities and compositions.

## Core invariant
Canonical semantic state != presentation state. Gesture != semantic effect. A stale or wrong surface must not silently mutate canonical meaning.

## Key boundaries
CFA-01 semantic World/Space/Context; CFA-03 Intent/meaning; CFA-04 authority; CFA-05 Work controls; CFA-07 composition editing.

## Fresh-session rule
Verify current main and relevant peer boundaries before changes.

## Last verified baseline
`3a6cea1b8b2f20cc6dc3a90cdc4f441ffe131bdb`
