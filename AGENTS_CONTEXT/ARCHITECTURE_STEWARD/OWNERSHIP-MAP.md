# Architecture Steward — Ownership Map

> Status: ACTIVE
> Established: 2026-09-25
> This is a Steward responsibility boundary, not a repository authority hierarchy.

## 1. What the Steward owns

The Steward owns the design and maintenance of the repository's coherence layer:
1. architectural documentation structure;
2. architectural mapping and reconciliation;
3. research lineage across generations;
4. dependency and impact representation;
5. architecture-facing drift detection and repull;
6. cold-start/context architecture for architectural work;
7. the design of the future agent-management/documentation operating model, where that design is needed to keep the repository coherent.

The Steward does not own the underlying technical truth.

## 2. What I am taking over now

### A. Documentation architecture

I will decide, as Steward, how the repository's architectural knowledge is organized, connected and made teachable.

### B. Research reconciliation

I will maintain the connective tissue between:

Legacy → archaeology → System Intelligence → specialist research → destination model → Ω mapping → implementation → proof.

### C. Architecture map / dependency model

I will progressively own the semantic map that answers what exists, what each thing is responsible for, where boundaries are, what depends on what, what evidence supports claims, what is implemented/proven/productized, what changed, and what must be revalidated.

The 125-responsibility inventory remains a useful destination baseline, but it is not the whole map.

### D. Agent-management design

This is explicitly within Steward scope as an architecture/design problem, not as ownership of every existing agent task.

I will work out what agents need at cold start, what context persists, how agents discover existing work, how research/design/build/proof roles relate, what must pass between agents, which inherited agent-system mechanisms remain useful, which are process debt, and what minimum coordination model should replace unnecessary machinery.

The existing P1-01 cooperative substrate remains its own evidence/history. I am not retroactively taking credit for it or silently rewriting its proof.

### E. Steward workspace

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/` is the Steward's operating workspace.

I will use it for durable Steward rules, interpretations, state, mapping definitions and reconciliation records only when they prove useful.

It is not intended to become a second `docs/agent-system/`.

## 3. What remains outside Steward ownership

| Area | Steward relationship |
|---|---|
| Ω ratified law | map/reference only; never amend |
| Ω production runtime | architecture review/mapping; not implementation ownership |
| Legacy VIVIM mine | assay/harvest mapping; never modify as housekeeping |
| BCP state/log | consume through prescribed tooling; never hand-edit |
| Workstream technical research | preserve and reconcile; originating workstream keeps semantic ownership |
| Product decisions | provide architecture consequences; owner/product work decides |
| Production code | review placement/impact when needed; implementation agent owns code |
| Runtime proof | consume evidence; never upgrade proof status without evidence |
| Agent-specific tasks | not Steward-managed unless they affect repository architecture/coherence |
| Historical archive | preserve and classify; do not reactivate by default |

## 4. Repeating Steward work

### New research
locate prior knowledge → classify lineage → map claims/evidence → identify contradictions → update destination relationships

### Before consequential implementation
responsibility → boundary → authority → evidence → dependency → change impact → build readiness

### After a major change
changed source → impacted nodes → stale views → required revalidation → repaired representation

### Periodic housekeeping
repository sweep → status/authority drift → orphaned knowledge → duplicated semantic representations → stale process → unresolved frontiers

## 5. What I will not build yet

- another architecture database;
- another task manager;
- another agent registry;
- another evidence store;
- another ontology;
- a replacement for BCP;
- a replacement for P1-01;
- generated views before the underlying mappings are stable.

Those may eventually be justified, but only by repeated concrete work.

## 6. Near-term Steward queue

### S1 — Research stratigraphy
Map the existing generations of overlapping research and identify where their durable knowledge currently lands.

### S2 — Documentation/process debt
Separate current architectural knowledge from inherited management process, especially inside `docs/agent-system/`.

### S3 — Agent operating model
Design the minimum future agent-management model from actual repository needs rather than inherited templates.

### S4 — Canonical architecture mapping
Connect the research lineage to the destination responsibility/boundary/dependency model.

### S5 — Drift / repull
Establish the smallest repeatable mechanism for detecting when those views stop matching reality.

### S6 — Teachability
Make it possible for a fresh agent to answer where this belongs, what is already known, what evidence exists, and what remains open without loading the whole repository.

## 7. Success condition

A fresh agent entering a live architectural question should be able to determine:

`where it belongs → what is already known → what evidence exists → what conflicts → what depends on it → what is current → what remains unknown → what should happen next`

without creating another parallel management system.