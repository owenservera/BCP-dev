# Ω End-State Build — Roadmap V1

> Owner: STEW-01
> Date: 2026-09-28
> Status: ACTIVE (supersedes the deliberately-empty seed `ROADMAP.md`)
> Evidence base: `state/REALITY-AUDIT-STEW-01.md`
> Authority: branch-local strategy for `team/omega-endstate`. Not mainline policy, not Ω law.

## 0. The one-sentence route

Make **one real, authenticated, browser-mediated conversation** work end to end — through the
user's existing ChatGPT web session, into `ns "chat"` in the user's vault, through the pinned
parser, with evidence — then generalise the mechanism to Claude and Gemini, then to non-AI web
applications.

Everything else is either a prerequisite of that sentence or a distraction until it is true.

## 1. Why this route

From the audit:

- the browser/CDP substrate is **real** and fail-closed by design → keep it;
- the chat vocabulary (`chat.open/append/history/resolve`, `ns "chat"`) is **real** → keep it;
- the two are **not connected**, and the only chat realization is sim-only and needs an API key
  no composition grants → this is the gap;
- ChatGPT is the only provider with any live path, and it is currently architected as *email*.

So the product is not "missing breadth". It is missing **one join**. Breadth before the join
would multiply an unproven mechanism.

## 2. Frontier ordering

### F0 — Make the substrate load again (blocking, small)

`provider-browser/src/live.ts` does not compile; the browser composition's own M0 falsifier is
red; the recorded 1418-green gate is a stale artifact from 2026-09-21.

- Execute `decisions/STEW-D-001-browser-live-parser-reconciliation.md`.
- Re-derive the real test baseline on this tree. Do not cite inherited metrics.
- Add a mechanical guard against duplicate module-scope bindings (the project already owns
  `tooling/gates/`, so this is a small, idiomatic addition).

**Exit:** `bun test plugins/provider-browser` green; a trustworthy current pass/fail count exists.

**Why first:** every subsequent claim about browser behaviour is unverifiable while the module
does not load. This is not bookkeeping — it is the precondition for evidence.

### F1 — Close the browser↔chat seam (the real product work)

Introduce a **browser-mediated chat archetype** so the CDP substrate can carry a conversation,
not an email.

Design questions, in order:
1. Is the archetype a new op (`chat.send`?) or a browser-side realization of existing
   `chat.append`? — *Prefer a realization of the existing `chat.*` vocabulary over a parallel
   one; the vocabulary is sound and duplicating it would be the "collection of adapters" failure
   the complexity map warns about.*
2. What is the provider-neutral request/response shape, and what stays ChatGPT-specific?
3. Conversation identity: how does VIVIM's `conversationId` map to a provider thread URL, and
   how is "continue the conversation I had with Claude yesterday" expressed?
4. Streaming: reuse the SSE capture + pinned-parser path already proven for `message.send@1`.
5. Safety: preserve the exact-outgoing-value verification and single-submit-click discipline for
   multi-turn sends, where partial-send risk is higher than for a single email.

**Exit:** a real authenticated ChatGPT conversation opened, streamed, parsed, and persisted to
`ns "chat"` — with evidence, repeatedly, not once.

**Falsifier:** if conversation state cannot be reliably re-entered through the browser, the
"existing web relationship" premise weakens and the route must be reconsidered before
generalising.

### F2 — Prove repeatability, then drift

One success is a demo. The product claim is resilience.

- Repeat F1 across many runs and days (the complexity map's §18 ladder, honestly climbed).
- Then break it deliberately: change a selector, rename a control, and demonstrate
  detect → diagnose → repair → verify → promote → rollback.
- Only after *observed* drift do we design the healer. Designing a healer against an imagined
  failure mode will produce a healer that does not heal.

**Exit:** a demonstrated repair cycle, not a designed one.

### F3 — Second and third provider (Claude, then Gemini)

The mechanism must generalise or it is not an architecture — it is a ChatGPT integration.

- Claude first: a `parser.claude.sse.v1` **and** `parser.claude.sse.v2` already exist and nothing
  consumes them. Reconcile that duplication as part of the first real Claude step.
- Gemini last (no artifact of any kind today).
- The generalisation test: *adding a provider is configuration + provider knowledge, not a new
  system.*

**Exit:** third provider added without a new architecture.

### F4 — Single pane of glass

Only now is a product surface worth building. The surface is where the abstraction is either
honoured or flattened, and it cannot be judged until F1–F3 show what must be normalised versus
preserved.

### F5 — The wider environment

Durable work, background continuity, authority, world model, self-healing at environment scale,
export/recovery, non-AI applications. Sequenced by what F1–F4 actually exposed, not by the
complexity map's numbering.

## 3. Explicit non-goals for now

- **Not** widening the kernel. The LOC budget regime is a strength; leave it alone.
- **Not** the ten-CFA programme, the P1 task queue, or the mainline roadmap. Not imported.
- **Not** API-key provider paths. `provider.llm` stays sim; the owner's promise not to require
  provider keys is a product constraint, not a phase.
- **Not** speculative self-healing infrastructure.
- **Not** an architecture document. The seam will teach us the architecture.

## 4. Development organization (smallest that scales)

Evidence currently supports a small team with distinct coordination, live-environment, verification and development-tooling ownership.

| Role | Why it earns its place | Workspace |
|---|---|---|
| **STEW-01** Steward | Team-level strategy, evidence standards and integration in the current bootstrap shape | `work/omega-endstate/STEW-01/*` |
| **DEVOPS-01** agentic tooling owner | Seeded resident owner for the development-system machinery; its workload will determine whether it decomposes further | `work/omega-endstate/DEVOPS-01/*` |
| **PROV-01** provider investigator | Live browser work is serial, session-bound and slow; isolating it protects Steward context and lets it run while the Steward thinks | `work/omega-endstate/PROV-01/*` |
| **VER-01** independent verifier | A self-verifying Steward verifies its own assumptions. Real friction, small cost | `work/omega-endstate/VER-01/*` |

DEVOPS-01 is seeded/proposed, not yet a claim of active runtime provisioning.

Architecture, evolution, product/journey and context-specialist roles remain deliberately unseeded unless recurring workload earns them. The complexity map is a map of the *product's* difficulty, not a staffing table.

`COORD-01` already exists on `work/omega-endstate/COORD-01/opencode-research`; treat it as a peer, inspect its ref directly, and do not merge to converse.

## 5. Tooling that earns its place

DEVOPS-01 owns evaluation and implementation of this tooling frontier, but it must revalidate the candidates against current runtime/workload before committing to them.

The initial candidates remain:

1. **`truth.sh` / a current-evidence probe** — runs the scoped test targets and emits a
   *fresh* pass/fail count with toolchain and SHA. Directly fixes the failure mode in audit §3,
   where a four-day-stale artifact was readable as current truth.
2. **Duplicate-binding / module-load guard** — prevents the F0 class of break recurring silently.

Explicitly deferred as permanent machinery unless workload re-justifies them: task graphs, dependency analysis, context generators, drift dashboards and broad roadmap tooling.

The tooling owner should favor small, measurable improvements over building an agent-management framework for its own sake.

## 6. Change triggers

This roadmap is wrong — and must be rewritten — if any of these occur:

| Trigger | Consequence |
|---|---|
| F1 conversation re-entry proves unreliable | The "existing web relationship" route is weakened; revisit the substrate choice (CDP vs. other) before F3. |
| CDP cannot meet the reliability bar at production depth | Reconsider the browser substrate, not the chat seam. The seam is substrate-independent. |
| F2 shows repairs are cheap and rare | Downgrade self-healing; it may be a maintenance chore, not an architecture. |
| F3 needs a new architecture per provider | Stop. That is the "collection of adapters" failure; the abstraction boundary is wrong and must be redesigned before continuing. |
| A second concurrent agent proves unsafe under the current workspace regime | Fix the workspace/Git machinery before adding a third role. Safety precedes throughput. |
| The inherited gate is re-derived and the real baseline is materially worse than 1418 | Re-scope everything; the substrate is weaker than believed. |

## 7. Success criterion for V1

A person, on their own machine, with their own existing ChatGPT account, opens VIVIM, has a real
multi-turn conversation through their existing web session, sees it persist in their own vault,
returns later and continues it — and can see evidence of what was observed versus inferred.

That single sentence is worth more than the entire inherited 125-row responsibility matrix, and
it is currently **zero percent achieved** while being the precondition for all of it.
