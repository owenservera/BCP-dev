# Factory UX Invariants

> Classification: DERIVED — CODING-READINESS RECONCILIATION
> Date: 2026-09-25
> Scope: stable UX obligations of the compositional factory.
> Authority: Product Experience Archaeology + destination model + Ω evidence.

## Factory versus instance

### Factory UX is stable

The factory is responsible for making the environment understandable and shapeable:

1. **Discover** — what pieces/capabilities exist?
2. **Address** — what is the person talking to?
3. **Understand** — what does the piece/composition do and require?
4. **Compose** — what can be combined?
5. **Configure** — how is the combination shaped?
6. **Govern** — what may it access/do?
7. **Inspect** — what happened, why, and with what evidence?
8. **Create** — how can an ordinary person make a piece?
9. **Replace** — how can a piece be swapped without losing the world?
10. **Evolve** — how can a piece/set be tested, promoted, rolled back or repaired?
11. **Remove** — how can a contribution be removed while preserving recoverable user state?

These are factory affordances, not a fixed dashboard.

### Instance UX is variable

A person's instance may contain:
- a particular world;
- spaces/workspaces;
- projects;
- conversations;
- chosen pieces;
- routing rules;
- surfaces;
- work;
- attention;
- personalized compositions.

Those are outcomes of composition and configuration.

## Stable interaction invariants

### 1. One semantic interaction model

Natural language, symbolic commands and spatial/direct manipulation should converge on the same deterministic semantic path:

Address → Intent → Context → Capability → Choice/Routing → Authority → Work → Execution → Evidence → World/Memory update.

Source:
- `docs/destination/DESTINATION-MASTER-MAP.md`
- `docs/destination/INTERACTION-INTENT-WORK-RECONCILIATION.md`
- `docs/destination/architecture/research/JOURNEY-ARCHITECTURE-MAPPING.md`.

### 2. No privileged creator mode

Creating a piece or set is an ordinary governed capability.

The Personal Agent may explain complexity, but:
- it is not a super-user;
- it cannot grant authority to the thing it creates;
- system, third-party and user-created contributions enter through the same governed conceptual path.

Source:
`AGENTS_CONTEXT/PERSONAL_AGENT/AGENT.md`
and `docs/destination/EVERYTHING-IS-A-PLUGIN-EVOLUTION-CONSTITUTION.md`.

### 3. Capability choice is inspectable

When realization choice matters, the user can understand:
- available realizations;
- applicable account/session;
- why a route was chosen;
- what policy constrained the choice;
- whether the action requires approval.

The product need not expose routing machinery by default.

Source:
`docs/destination/PROVIDER-ACCOUNT-ROUTING-RECONCILIATION.md`.

### 4. Authority is visible at consequential boundaries

The UI should make clear when the environment is:
- reading;
- mutating local state;
- leaving the local world;
- waiting for approval;
- refusing.

Evidence and authority are not collapsed.

Source:
`docs/destination/FOUNDATIONAL-PRINCIPLES.md`;
Ω B1–B4 law.

### 5. Composition is inspectable

A composition should be understandable as:
- pieces;
- contributions;
- dependencies;
- required grants;
- contracts;
- lifecycle;
- version;
- evidence;
- active/inactive state.

This does not require a developer-oriented graph as the normal surface.

### 6. Replacement preserves identity

Replacing a plugin/realization should not silently create a new Product Instance or rewrite canonical World history.

The person should be able to understand:
- what changed;
- what was replaced;
- what remains;
- whether active Work is affected;
- what can be rolled back.

Source:
`docs/destination/EVOLUTION-RECONCILIATION.md`;
`docs/destination/EVERYTHING-IS-A-PLUGIN-EVOLUTION-CONSTITUTION.md`.

### 7. The environment explains itself

The person can ask:
- what is installed?
- what can this piece do?
- why is this unavailable?
- why did this realization run?
- what changed?
- what evidence supports the result?

Self-Knowledge is a projection, not a second authority/database.

### 8. Failures remain legible

Unknown, stale, refused, waiting, failed and unavailable are meaningful states.

Never turn “we do not know” into “not found” or “success with low confidence”.

This follows the repository epistemic guardrails:
- confidence ≠ proof;
- candidate ≠ realization;
- evidence ≠ authority;
- unknown ≠ failure.

## Creator/composer affordance path

The eventual ordinary-user creation journey should be:

```text
discover gap
  ↓
describe desired capability/composition
  ↓
construct candidate
  ↓
inspect dependencies + authority + effects
  ↓
test/falsify
  ↓
promotion
  ↓
use as ordinary piece/set
  ↓
inspect
  ↓
replace/evolve/remove
```

The creation path is therefore an extension of the normal product path, not a separate developer application.

## Legacy UX to retain selectively

The experience archaeology identifies mature behavior worth harvesting:

- guided landing / progressive orientation;
- adaptive workspaces and presets;
- project/conversation organization;
- provider selection/multiplexing;
- browser onboarding/discovery;
- semantic grounding and guided interaction probing;
- repair/healing feedback;
- replayable provider evidence.

These are behavioral inputs. They must be rebuilt under current World/Authority/Evidence/Plugin rules rather than imported as architecture.

Source:
`docs/destination/product-experience/research/PRODUCT-EXPERIENCE-ARCHAEOLOGY.md` on `research/steward-product-experience`.

## UX falsifier for the factory boundary

A user who has never entered a “developer mode” should be able to:

1. discover an available capability;
2. inspect what it needs and may affect;
3. add it to a composition;
4. save/use that composition;
5. inspect its behavior/evidence;
6. replace or modify the composition;
7. later create a new piece/set through the same governed experience.

The first implementation does not need to finish this whole journey. It must avoid architectural choices that make it impossible without a privileged subsystem.

ROUND 1 FINDING: READY