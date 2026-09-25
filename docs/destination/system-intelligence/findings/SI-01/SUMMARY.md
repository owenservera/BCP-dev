# SI-01 — Ω Runtime

> Wave 1 archaeology. Research bookkeeping only; not Ω law.

## Question
What computational primitives actually exist in current Ω, what are their invariants, and what do they depend on?

## Finding
Current Ω provides a substantial governed runtime spine: signed compositions and host enforcement, durable vault/evidence, law, canonical intent, bounded execution/context, and a read-only self-knowledge lens. The central limitation is assembly: these are strong primitives, not yet a complete VIVIM product instance.

## High-value atoms
- **SI-010101 — Recipe authority** — Current Ω defines the signed Recipe as the only grantor: manifests request capabilities, while the recipe grants capabilities and routed contracts. [VERIFIED]
- **SI-010102 — µhost / Port Protocol** — The current µhost verifies manifests, recipe/content hashes, spawns isolated worker compartments, verifies host-side capability tokens, and refuses invalid compositions. [VERIFIED]
- **SI-010103 — Vault durability and revisioned evidence** — vivim.vault is a current Ω plugin with append, revisioned objects, provenance refs, verify, compaction, recovery, migration, export and import contracts; D-432 adds crash/recovery discipline. [VERIFIED]
- **SI-010104 — Law / authority gate** — Current Ω law owns consent, forbidden overlays, policy conflict, privacy taint, invocation frames, standing and audit; external mutations are governed through law-side checks rather than host policy. [VERIFIED]
- **SI-010105 — Canonical intent persistence** — Ω has an Intent contract with payloadHash, interpretation, explicit lifecycle states and four-state resolution semantics; D-411 requires one canonical writer path and law decisions may cite intentRef + payloadHash. [VERIFIED]
- **SI-010106 — Execution/context substrate** — vivim.run currently contains bounded task execution, health, process brokering, plan inspection/intervention, watches, budgets, context assembly, badges, simulation, trust, analytics, layout, partial evaluation and liveness. [OBSERVED]
- **SI-010107 — Derived self-knowledge lens** — vivim.mind derives a read-only WorldModel and control portrait from live law registry plus bounded vault reads; it holds no write capability and fails closed on malformed evidence. [VERIFIED]
