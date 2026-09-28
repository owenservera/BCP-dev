# Phase-3 Inputs — Mined from CFA Roadmaps + M1 Evidence Packets

> Date: 2026-09-28 · Owner-led pass: CFA-06 `capability-provider-realization`
> Goal: `finish-full-list`, wave W1, unit B (task N.3)
> Classification: bounded research/mining only. Not Ω law, not a boundary
> activation, not implementation authorization.
> Gate: Phase 3 does NOT start before P2/S.3 green + explicit owner go
> (`docs/agent-system/FULL-INTEGRATION-TASK-LIST.md`, Phase 3 section).
> N.3 is INDEPENDENT of P2.1 — this mining pass proceeds without waiting.

## Phase-3 rows (from FULL-INTEGRATION-TASK-LIST.md + SETUP-REQUIREMENTS-2026-09-27.md)

| Row | Item | Owner |
|---|---|---|
| 3-A | A2A-live adapter (`runtime/src/transports/a2a-live.ts`, AgentCards, SSE + resubscribe + push, Git fallback) | `runtime-constitution-core-substrate` (CFA-10) |
| 3-B | Presence-loop daemon (register `commons-daemon` first: roster row + home, then loop + `who-needs-attention`) | `runtime-constitution-core-substrate` (CFA-10) |
| 3-C | MCP mesh: `mcp-commons`, `mcp-machine`, `mcp-web`, `mcp-memory` + manifests / redaction / budgets | CFA-10 operates; CFA-04 gates; CFA-06 advises |
| 3-D | Waiting-policy file + scenario tests (TTL, contention, detach, STATUS, human door, runaway bounds, team view) | Steward drafts; CFA-04/CFA-09 ratify safety parts |

Master requirement sources (exact bill of materials, not roadmap wishes):
`docs/agent-system/SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 items 4–7;
`docs/agent-system/REMAINING-SETUP-WORK-2026-09-27.md` §Phase 3 items 4–7;
`docs/agent-system/AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §5/§6/§7/§8/§9;
`docs/agent-system/AUTONOMOUS-TEAM-ARCHITECTURE-2026-09-28.md` §7/§9;
`docs/agent-system/FULL-SYSTEM-TEST-GAPS-AND-PREP-2026-09-28.md` gaps 6–8, prep P5/P6/P7.

---

## Row 3-A — A2A-live adapter

### Mined requirements / constraints

- A2A is a live transport adapter, never a second protocol: implements the
  existing `CommonsTransport` interface; no new message kinds, no schema
  change; same signed envelope, hash chain, validation.
  (`docs/agent-system/AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §5;
  `docs/agent-system/SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 item 4;
  `docs/agent-system/CURRENT-RECONCILIATION-2026-09-28.md` §6.)
- AgentCard per agent at `/.well-known/agent.json`; 10 cards until daemon
  registers, 11 after. Task states map onto existing Handoff states
  (OFFERED/ACCEPTED/IN_PROGRESS/REPORTED/CLOSED + DECLINED/EXPIRED/CLOSED).
  `message/send` → durable append; `message/stream` (SSE) → `sync`/`readSince`;
  resubscribe over cursors; push webhooks → attention URGENT.
  (`AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §5; `SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 item 4;
  `REMAINING-SETUP-WORK-2026-09-27.md` §Phase 3 item 4.)
- Router ships via A2A-live if peer online, else GitBranch; fallback is
  mandatory, proven by killing the live channel mid-test. Any event validating
  over one transport must validate over all three; divergence fails the build.
  (`AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §7; `SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 item 4.)
- Conformance: the 10 v0 points over SSE + resubscribe + one push-webhook
  round-trip. Verify: `bun test` full suite green + mid-test kill fallback leg.
  (`SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 item 4; `AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §9.)
- Adapter must not bypass the Authority gate: provider/capability selection
  bypassing authority is an explicit falsifier; risky effective ops route
  through `law.check@1` (K0-4).
  (`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/DOMAIN-ROADMAP-2026-09-27.md` §M3 Falsifiers;
  `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/M1-K0-EVIDENCE-FALSIFIER-MATRIX-2026-09-27.md` §2 K0-4.)
- Adapter must not reinterpret semantics: addressability ≠ authorization;
  accessibility/visibility ≠ authorization (M1-I13/M1-I14); routing selects,
  never authorizes; transport carries meaning owned elsewhere.
  (`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/M1-SEMANTIC-KERNEL-EVIDENCE-2026-09-27.md` §3;
  `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CAPABILITY-PROVIDER-REALIZATION/CORE-AGENT.md` §Routing semantics.)
- SSE break mid-task → `tasks/resubscribe` over `readSince` cursors; duplicate
  delivery deduped on stable event/message id (at-least-once preserved).
  (`AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §8.)

### Open unknowns (named owner)

- Multi-step/batched authorization across retried/resubscribed delivery —
  owner CFA-04 + CFA-05 (Authority M4 / Work M3 peer gates).
- Active-Work replacement across a transport break (who resumes the Attempt) —
  owner CFA-05 + CFA-10 (Work M3; K0 M3 peer gate BLOCKING).
- Whether push-webhook attention-URGENT needs CFA-08 presentation constraints —
  owner CFA-08 (M4 peer gate).

### Explicit non-inputs (Phase 3 does NOT need)

- No new message kinds, schema change, second registry, scheduler-as-authority
  (`AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §6; `CURRENT-RECONCILIATION-2026-09-28.md` §6).
- No universal Event/State primitive, universal identity model, or temporal
  reconciliation harness (CFA-01 roadmap §Deferred; CFA-02 roadmap §Deferred).
- No K0 expansion or Ω-law change for the adapter (CFA-10 roadmap §Deferred).

---

## Row 3-B — Presence-loop daemon

### Mined requirements / constraints

- Registration BEFORE any spawn-list edit: `commons-daemon` roster row + home
  first, thendelegation amendment adding the name.
  (`SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 item 5;
  `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OWNER-DELEGATION.md` §Who may be spawned —
  daemon deferred, enters only after registration.)
- Loop behavior only, no new semantics: re-emit existing `presence(state, ttl)`
  before `expires_at`; schedule `who-needs-attention`. The emitter exists; the
  loop does not.
  (`REMAINING-SETUP-WORK-2026-09-27.md` §Phase 3 item 5;
  `AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §5 Missing practices.)
- Correctness never depends on presence: kill-daemon test — two runtimes
  observe fresh presence; killed daemon visibly expires; sync still converges
  via Git.
  (`SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 item 5; `FULL-SYSTEM-TEST-GAPS-AND-PREP-2026-09-28.md` prep P6.)
- Presence is observation state, not truth: existent / non-existent /
  not-observed / unknown stay distinct; observation ≠ World truth; projection
  omission ≠ nonexistence; unknown ≠ failure.
  (`WORLD-ONTOLOGY-CONTEXT/M1-SEMANTIC-KERNEL-EVIDENCE-2026-09-27.md` §2–§3,
  invariants M1-I10/M1-I12/M1-I17.)
- Presence must never imply permission or capability availability: visible ≠
  authorized (M1-I14); routing chooses only among valid candidates and cannot
  invent availability.
  (`M1-SEMANTIC-KERNEL-EVIDENCE-2026-09-27.md` §3 M1-I14;
  `CAPABILITY-PROVIDER-REALIZATION/CORE-AGENT.md` §Routing semantics.)
- Daemon must not become a scheduler/authority: scheduler/worker are mechanisms,
  never durable truth; scheduler state never becomes authorization state.
  (`AGENCY-WORK-EXECUTION/DOMAIN-ROADMAP-2026-09-27.md` §M4 Falsifiers;
  `AUTHORITY-GOVERNANCE/DOMAIN-ROADMAP-2026-09-27.md` §Deferred.)

### Open unknowns (named owner)

- Durable presence/attention state envelope if any presence fact must survive
  restart — owner CFA-02 (CFA-08 roadmap §M1 peer gate HIGH-VALUE; CFA-02
  provisional).
- Semantic Attention owner/policy for `who-needs-attention` ranking —
  owner unresolved by design (CFA-08 roadmap §UNKNOWN; CFA-08 M4 unresolved).
- Cross-device presence continuity — explicitly deferred (CFA-08 roadmap
  §Deferred / Do Not Do).

### Explicit non-inputs (Phase 3 does NOT need)

- No new presence semantics, no second task/work database, no scheduler service
  as a new architectural layer (CFA-05 roadmap §Deferred; design v2 §6).
- No cross-device prototype, no attention-policy engine (CFA-08 roadmap
  §Tooling: NOT YET NEEDED).
- No CFA-11 birth — counters first (design v2 §6 Dependency Model; current
  delegation roster).

---

## Row 3-C — MCP mesh (4 servers + manifests / redaction / budgets)

### Mined requirements / constraints

- Server split (fixed): `mcp-commons` wraps `runtime/src/cli.ts` verbs only;
  `mcp-machine` (`bash`/`git`/`gh` allowlist); `mcp-web` (fetch/search/browser);
  `mcp-memory` (scoped TASKS/STATE/LESSONS read-write per owning agent).
  (`SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 item 6.)
- Each server: versioned manifest, least-privilege tool list, per-call
  authorization hook, secret-redaction filter (deny keys/tokens/credentials,
  tested with canary values), idempotency-key support, per-Work-item
  cost/latency budget fields.
  (`SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 item 6;
  `AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §5 MCP discipline.)
- Verify: redaction test (canary never in any emitted event); budget-exceeded
  test (refuses with receipt, does not execute); duplicate tool-call test
  (same idempotency key, one effect). Accept: all green; no credential bytes
  in any Commons event ever (standing falsifier).
  (`SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 item 6 + §Standing falsifiers.)
- Per-call authorization survives sandboxing; approving a script never
  blanket-approves its calls; tool annotations treated as untrusted; explicit
  state handles (UUIDv4, server-bound, expiring); `ttlMs`/`cacheScope` honored;
  W3C trace on `causation_id`/`correlation_id`.
  (`AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §5 MCP discipline.)
- Capability discovery via existing `SessionCapabilityProfile`
  (LOCAL_RUNTIME vs WEBAPP vs HYBRID); progressive discovery (1–5% context
  threshold before eager→search switch).
  (`AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §5.)
- Tool-gate tests: authority deny/quarantine paths, redaction, budget exceeded.
  (`AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §9.)
- MCP servers are compositions through the ordinary admission path: no
  privileged tool path; composition membership ≠ capability permission; Forge
  non-privilege precedent (ProposalArtifact authority=`none`).
  (`COMPOSITION-PLUGIN-FORGE/DOMAIN-ROADMAP-2026-09-27.md` §M2/M3.)
- Realization seams: CFA-06 advises (provider/account/session/realization
  identity, effect/risk metadata crossing the authority seam); capability
  contribution boundary must not let plugin metadata redefine capability
  semantics.
  (`REMAINING-SETUP-WORK-2026-09-27.md` §Phase 3 item 6;
  `AUTHORITY-GOVERNANCE/DOMAIN-ROADMAP-2026-09-27.md` §M1 peer gate CFA-06 BLOCKING;
  `COMPOSITION-PLUGIN-FORGE/DOMAIN-ROADMAP-2026-09-27.md` §M2 peer gate CFA-06 BLOCKING.)
- Budgets attach per Work item: Work envelope carries optional `budgetRef`
  (consumed reference, policy owned outside CFA-05); tool failure → Work
  UNKNOWN + reconciliation path, no unsafe retry.
  (`AGENCY-WORK-EXECUTION/M1-WORK-ENVELOPE-CHARACTERIZATION-2026-09-27.md` §3;
  design v2 §8.)
- K0 egress posture for tool dispatch: host-side token checks (ownership/scope/
  revocation-generation) before dispatch (K0-3); risky effective ops through
  the Authority gate (K0-4); B5 1500-LOC cap constrains host-side additions.
  (`RUNTIME-CONSTITUTION-CORE-SUBSTRATE/M1-K0-EVIDENCE-FALSIFIER-MATRIX-2026-09-27.md` §2.)

### Open unknowns (named owner)

- Exact authority-facing risk vocabulary tools must carry — owner CFA-06
  (descriptor) + CFA-04 (interpretation); both list it UNKNOWN
  (Authority roadmap §Current Evidence UNKNOWN; CFA-06 roadmap §M1 peer gate).
- `mcp-memory` durable join: which TASKS/STATE/LESSONS refs are durable vs
  derived — owner CFA-02 (CFA-08 roadmap §M1 peer gate; CFA-02 provisional).
- Tool-call idempotency vs Work effect-identity: same key/one effect is the
  mesh rule, but stable effect identity across restart per realization class is
  still open — owner CFA-05 (Work) + CFA-06 (realization meaning)
  (CFA-05 roadmap §M2 decision G3).
- Surface-visible capability/choice boundary for tool exposure — owner CFA-08
  + CFA-06 (CFA-08 roadmap §M5 peer gate HIGH-VALUE).

### Explicit non-inputs (Phase 3 does NOT need)

- `mcp-machine` / `mcp-web` / `mcp-memory` do not exist yet and nothing in
  earlier phases may reference them as live (design v2 §6; reconciliation §4).
- No generic authorization/policy engine, universal permissions DB, or second
  authority store (CFA-04 roadmap §Tooling not justified; §Deferred).
- No universal provider abstraction; no second Account/Session store
  (CFA-06 roadmap §Deferred / Do Not Do).
- No AI-API/local-model tool substrate in the v1 path (D-456 Chrome-only;
  CFA-10 roadmap §Deferred).

---

## Row 3-D — Waiting-policy file + scenario tests

### Mined requirements / constraints

- One policy file in `AGENTS_CONTEXT/AGENT-COMMONS/` (name TBC by Steward)
  fixing: default handoff TTL + escalation path; first-accept-wins with
  loser-reason; detach-on-wait (resumption is always a new session);
  STATUS-progress format; human-question routing; max-attempts/backoff/
  quarantine; team-view projection fields.
  (`SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 item 7.)
- Verify: scenario tests for expiry-escalation, double-claim, runaway
  (bounded loop quarantines by attempt N, asserted). Accept: file exists,
  tests green, CFA-04/CFA-09 sign-off recorded.
  (`SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 item 7;
  `FULL-SYSTEM-TEST-GAPS-AND-PREP-2026-09-28.md` prep P5.)
- The 8 gaps closed: handoff TTLs + escalation, contention rule,
  detach-on-wait, STATUS-progress, human door (digest path until real UI),
  anti-runaway rule, derived team-view projection; mostly policy + daemon
  behavior, not protocol.
  (`REMAINING-SETUP-WORK-2026-09-27.md` §Phase 3 item 7.)
- Detach maps to the Work model: WAITING = paused on an explicit
  reconstructable condition; resumption re-resolves live authority (historical
  citation is never current permission); worker disappearance must not lose
  Work ("the worker may disappear; the Work must remain").
  (`AGENCY-WORK-EXECUTION/M1-WORK-ENVELOPE-CHARACTERIZATION-2026-09-27.md` §4;
  `AGENCY-WORK-EXECUTION/DOMAIN-ROADMAP-2026-09-27.md` §Round-1 Conclusion;
  CFA-04 D-452 live re-resolution.)
- STATUS-progress is presentation, not truth: `canonical semantic state !=
  presentation state`; refusal/expiry states stay explainable; UI badges never
  imply authority; stale never presented as current.
  (`EXPERIENCE-INTERACTION-SURFACES/DOMAIN-ROADMAP-2026-09-27.md` §Responsibility
  Frontier invariants; §M4 Success criteria/Falsifiers.)
- Team-view is a derived projection with evidence basis, not a second store;
  unknown/conflicted states preserved, never filled by inference.
  (CFA-04 roadmap §M1 Success criteria; CFA-02 Continuity Corridor §2
  continuityState; CFA-08 roadmap §M4.)
- Contention/duplicate-claim maps to existing Handoff lifecycle + stable-id
  dedupe (first-accept-wins with recorded loser-reason; duplicate delivery
  deduped on stable id).
  (Design v2 §7–§8; `SETUP-REQUIREMENTS-2026-09-27.md` §Phase 3 item 7.)
- Long waits always detach; resumption = new session
  (`AUTONOMOUS-TEAM-ARCHITECTURE-2026-09-28.md` §7).

### Open unknowns (named owner)

- Exact TTL values, backoff schedule, quarantine threshold N, escalation path
  targets — owner Steward (draft) + CFA-04/CFA-09 (safety ratification).
- STATUS-progress exact format and team-view projection fields — owner
  Steward + CFA-08 (presentation) with CFA-05 (Work projection refs).
- Human-door routing until real UI (digest path shape) — owner Steward;
  surface constraints CFA-08 (M4 peer gate).
- Max-attempts vs standing-expiry interaction for long-lived waits — owner
  CFA-04 (standing D-453: renewal is a fresh grant, never silent extension).

### Explicit non-inputs (Phase 3 does NOT need)

- No protocol change: policy + daemon behavior, not a new Handoff protocol
  (`REMAINING-SETUP-WORK-2026-09-27.md` §Phase 3 item 7).
- No semantic-Attention ownership decision; final Attention owner stays
  unresolved (CFA-08 roadmap §UNKNOWN; §M4 Remain unresolved).
- No multi-device/cross-session continuity semantics (CFA-08 roadmap
  §Deferred; CFA-05 roadmap §M4 Must remain unresolved).
- No universal scheduler or temporal substrate (CFA-05 roadmap §Deferred;
  §M4 Must remain unresolved).

---

## Cross-cutting inputs (apply to all four rows)

- Standing falsifiers (any phase): transport-divergent event fails build;
  consequential effect without gate-time Authority result + receipt is a
  defect; credential bytes in any event invalidates the slice; lineage break
  without additive repair blocks integration.
  (`FULL-INTEGRATION-TASK-LIST.md` §Standing falsifiers;
  `SETUP-REQUIREMENTS-2026-09-27.md` §Standing falsifiers.)
- Change discipline: Phase 3 is itself a consequential change — needs CFA-09
  change-contract shape (ChangeEnvelope, dimensioned compatibility, UNKNOWN≠0,
  promotion≠authority, rollback preserves history) and CFA-04 gate where
  consequential; rollback plan mandatory.
  (`EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE/M1-MINIMUM-CHANGE-CONTRACT-CHARACTERIZATION-2026-09-27.md` §2–§4;
  `REMAINING-SETUP-WORK-2026-09-27.md` §Phase 4 item 8 precedent.)
- Evidence posture for mined items: OBSERVED (ratified law, merged code/tests),
  DERIVED (roadmap reasoning from evidence), PROPOSED (candidate contracts),
  UNKNOWN (explicit gaps above). Freshness CURRENT unless noted. Do not promote
  PROPOSED/UNKNOWN to build requirements without the owning CFA + gate.
- CFA-06 standing inputs reused: ProviderRealization BasisRef
  (`vault.providers.provider-realization`, `realization:<archetype>:<provider>`,
  rev + cid; 7-step resolution rule; no timestamp/route fallback) and the M2
  typed join projection (relationship view, not a new entity).
  (`CAPABILITY-PROVIDER-REALIZATION/STAGE-E-L2-CFA06-CAPABILITY-REALIZATION-BASIS-ADAPTER-2026-09-27.md` §1–§4;
  `CAPABILITY-PROVIDER-REALIZATION/M2-MINIMUM-JOIN-SHAPE-RESEARCH-2026-09-27.md` §Executive conclusion.)

## Sources mined (all verified by direct read this session)

Roadmaps (10): CFA-01, CFA-02, CFA-03, CFA-04, CFA-05, CFA-06, CFA-07, CFA-08,
CFA-09, CFA-10 `DOMAIN-ROADMAP-2026-09-27.md` in each
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/*/` home.
M1/evidence packets: CFA-01 `M1-SEMANTIC-KERNEL-EVIDENCE-2026-09-27.md`;
CFA-02 `CONTINUITY-CORRIDOR-1-EVIDENCE-2026-09-27.md`; CFA-03
`RESULTS/CFA03-20260927-M1-SEMANTIC-BASELINE-TRACE.md`; CFA-04
`AUTHORITY-CORRIDOR-EVIDENCE-PACK-2026-09-27.md`; CFA-05
`M1-WORK-ENVELOPE-CHARACTERIZATION-2026-09-27.md`; CFA-06
`M2-MINIMUM-JOIN-SHAPE-RESEARCH-2026-09-27.md` +
`STAGE-E-L2-CFA06-CAPABILITY-REALIZATION-BASIS-ADAPTER-2026-09-27.md`;
CFA-08 `RESULTS/CFA08-SURFACE-VIEW-CONTRACT-20260927-0721.md`; CFA-09
`M1-MINIMUM-CHANGE-CONTRACT-CHARACTERIZATION-2026-09-27.md`; CFA-10
`M1-K0-EVIDENCE-FALSIFIER-MATRIX-2026-09-27.md`.
Phase-3 masters: `docs/agent-system/SETUP-REQUIREMENTS-2026-09-27.md`,
`REMAINING-SETUP-WORK-2026-09-27.md`,
`AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md`,
`AUTONOMOUS-TEAM-ARCHITECTURE-2026-09-28.md`,
`FULL-SYSTEM-TEST-GAPS-AND-PREP-2026-09-28.md`,
`FULL-INTEGRATION-TASK-LIST.md`, `CURRENT-RECONCILIATION-2026-09-28.md`.
Note: 3 `work-scout`/`work-researcher` leaves spawned for parallel mining
returned empty and were NOT relied upon; every claim above was verified by
direct CFA-06 read of the cited file + section.
