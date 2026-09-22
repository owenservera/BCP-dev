# D-435 — Execution debugging & capability deprecation: the visible plan, the gated intervention, the retiring door (Ω-3.5)

## Status

RATIFIED

## Context

- The Ω-3.5 spec (builder-gap #5, scenarios #44/#46/#99 — debug a stuck
  ActionPlan IR with manual intervention · execute a deprecated capability →
  route to migration shim or refuse · deprecate a core capability → flag all
  dependent compositions before ratification) lands here as tree record
  D-435; the paper lineage is the ratified upgrade doc
  `omega-upgrades/OMEGA-3.5-EXECUTION-DEBUG-DEPRECATION.md` (reserved slot
  `D-436` — paper ids are mention-only when backticked, the `D-431` rule).
- The one invariant this record exists to protect, verbatim from the spec:
  **no plan may hang silently, and no capability may vanish without a named
  successor path. Debugging goes through the same law gate as everything
  else — there is no out-of-band kill switch, because a kill switch is a
  privileged path wearing a toolbelt.**
- What the execution tier has today: `vivim.run` executes bounded one-shot
  tasks (`run.submit@1` through the priority TaskPool — budgets from
  submission, freshness contract, saturation as explicit rejection), watches
  compartments (health.ts: crash counters, quarantine ledger, event ring),
  and brokers OS-process lanes (D-374: declared pools, ndjson wire, deadline
  kills that settle BUDGET). What it lacks: any multi-step plan surface — a
  plan blocked on a dead realization is INVISIBLE (no registry, no derived
  state, no stall event, nothing for scenario #44's `inspect` to read); the
  only "fix" for a hang is an out-of-band kill, which bypasses law and
  leaves no row; and capability evolution has no retirement ceremony — an op
  vanishes, dependents break at their next invocation, and the postmortem
  finds the announcement in a changelog nobody read (evidence after the
  funeral).
- Recon facts that shape the mechanism: the runner already keeps evidence
  rows (the health event ring, the queue's per-task accounting, the broker's
  journaled lane lifecycle) — the plan state can DERIVE from rows the runner
  keeps rather than from a second source of truth; the vault accepts
  ns-scoped appends through granted port capabilities (the `vivim.agent`
  pattern: `port:vault.append/get/query@1`); `law.check@1` is the gate
  (allow | deny | require-consent, journaled); the shim's `CallMeta`
  carries the calling principal; the spec itself resolves the placement
  question — the intervention semantics and the capability lifecycle are
  execution-tier duties, and in THIS tree the execution tier is the
  `vivim.run` spine (zero host LOC, the B5 fence untouched).
Blocks: none

## Options

| Criterion | (a) in-plugin plan registry + gated intervene ops + vault-cited lifecycle, all in vivim.run | (b) host-level debugger: new host surface owning plan state + a kill API | (c) defer to Ω-14/Ω-8 (liveness + chaos own debugging later) |
|---|---|---|---|
| The visible hang (scenario #44) | Yes — a minimal plan registry (registered plans + heartbeats) whose `plan.state` view derives from evidence rows: graph, typed blockedOn (liveness \| budget \| consent \| dependency), budgetTrace, lastProgress; past the declared stall deadline → EXEC_PLAN_STALLED, a ledgered event, not a spinner | Partial — the host sees compartments, not plans; plan shape would leak into the host (B5 surface growth) | No — Ω-14 scores realization health, Ω-8 injects stalls; neither surfaces the plan's side of a block |
| The gated intervention | Yes — pause/step/resume/cancel as ops through the SAME law gate (grant + consent where the plan is another principal's); refusals carry sentences; cancel is EXTERNAL_MUTATION; no SIGKILL in the API surface | A host kill API is exactly the out-of-band kill the spec refuses — a privileged path wearing a toolbelt | No |
| The retiring door (scenarios #46/#99) | Yes — the deprecation ceremony: vault-cited dependents census BEFORE ratification with flag rows, successor-or-explicit-none, badged time-boxed migration shims, sunset refusals naming the way forward, retired rows persisting forever | Wrong owner — package-management reflexes in the host; the capability graph is not the host's to retire | No — every evolution until then breaks dependents in the dark |
| Zero host LOC / B5 | Yes — plugins/vivim-run only; the ops ride the existing manifest/router discipline | No — new host surface | Yes |
| Falsifiable now (D-364) | Yes — six clause lines, RED stub → green before the flip | n/a | n/a |

## Decision

**Decision:** (a) — `plugins/vivim-run/src/planstate.ts` +
`intervene.ts` + `capability.ts`, wired into the spine, in substance:

- **planstate.ts — the plan registry and the derived view.** The runner
  gains the minimal in-plugin plan registry it lacked (an as-built, not a
  pretense: registration is a module-level seam — `PlanRegistry.register`
  — for the orchestration lane to compose; the four OPS below are the
  inspect/intervene surface). A plan is `{planRef, principal, steps[]:
  {id, op, capabilityRef, dependsOn?, budgetMs?, requiresConsent?,
  compensation?}, contract: {cancelPolicy}, stallDeadlineMs}`. Every
  registry happening is an EVIDENCE ROW (ns `exec.state`, retention
  `exec-state-90d`): plan-registered, plan-state, step-dispatched,
  step-settled, step-blocked (typed reason), step-unblocked, progress
  (heartbeat), plan-stalled. The rows live in an append-only in-plugin
  ring (the `D-423` discipline, the health.ts precedent) mirrored
  best-effort to the vault — a failed mirror is ITSELF a ledgered row
  (mirror-failed) and surfaces in every inspect (zero silent paths; the
  ring is the derivation source, the vault is the durable copy).
  `derivePlanState(rows)` is a PURE fold: `{planRef, principal, state,
  stalled, graph, blockedOn[]: {step, capabilityRef, reason:
  liveness|budget|consent|dependency, detail}, budgetTrace (burn vs
  declared, per step — the Ω-2 seam), lastProgress}`. Stall detection
  (`poll`): no progress for the declared stall deadline while steps remain
  → one `EXEC_PLAN_STALLED` row per episode (re-armed on progress) — the
  budget-exhaustion stall (a running step past its declared budget) and
  the wall-clock stall are different diseases with the same symptom, and
  `blockedOn.reason` distinguishes them. `renderPlanState` renders the
  view as headless text — the exact renderer the future `omega:exec ps`
  CLI and the canvas inspector will both call (surface parity by
  construction: one fold, N surfaces). Inspection of a plan whose rows
  cannot carry the derivation (no rows, or structurally inconsistent — a
  settled step never dispatched) REFUSES `EXEC_PLAN_OPAQUE`: an execution
  the system cannot explain is an execution it should not be running, and
  inspection refuses to fabricate.
- **intervene.ts — the four verbs as law-gated ledgered ops.**
  `exec.intervene@1 {planRef, verb: pause|step|resume|cancel, principal,
  consentId?}`: the gate is a `law.check@1` round trip (allow = the grant;
  require-consent satisfied only by a presented consentId — and consent is
  REQUIRED where the plan is another principal's); denied, consentless, or
  an unreachable law gate → `EXEC_INTERVENE_UNGATED`, refused AND ledgered
  (the attempt row is the evidence). `pause` halts step dispatch and keeps
  state (in-flight steps settle per their own pool deadlines — the
  registry owns dispatch decisions, the pool owns in-flight settlement,
  stated, not hidden); `resume` re-arms; `step` executes exactly one ready
  step and awaits it, its dispatch row citing the intervention; `cancel`
  is an orderly teardown — non-started steps cancel, declared
  compensation steps run, in-flight steps settle per their own contracts —
  and the row carries class EXTERNAL_MUTATION; a plan whose contract
  forbids mid-flight cancel refuses `EXEC_CANCEL_FORBIDDEN_BY_CONTRACT`
  (it may be paused, stepped, or waited out, but not torn down against its
  own word). **No SIGKILL path exists in the API surface.** The OS-level
  last resort is break-glass: when the process broker observes a child die
  by an externally-delivered kill signal it did not initiate (an operator
  reaching past the API), the scar row `EXEC_BREAKGLASS_EMPLOYED` lands in
  ns `exec.intervene` naming the pool, pid, signal, and time — the
  constitution was suspended and the scar records exactly when and by
  whom. The broker's OWN kills (deadline, malformed-bound, shutdown) stay
  the lawful documented BUDGET path of `D-374`/`D-366` — they are
  refusals with sentences, not break-glass, and the boundary is tested.
- **capability.ts — the deprecation lifecycle.** Lifecycle rows in vault
  ns `capability.lifecycle` (forever): `{capabilityRef, state:
  active|deprecated|sunset|retired, successor? (or explicit none),
  dependents[] (the vault-cited census, inputHash-pinned),
  migrationShim? {realizationRef, expiryAt, badge}, sunsetAt, decisionRef}`
  — append-only, one id per capability, a new rev per transition; retired
  rows persist forever (the op becomes unresolvable, never unremembered).
  The ceremony (`capability.deprecate@1`, EXTERNAL_MUTATION): successor
  XOR explicit-none is REQUIRED (`CAP_DEPRECATE_WITHOUT_SUCCESSOR` — doors
  may close, but not silently); the dependents census is counted from the
  vault BEFORE ratification — the op re-scans the usage rows, folds
  `{dependents, inputHash}` (sha256 over the canonical census input), and
  a missing or stale citation REFUSES `CAP_DEPRECATE_CENSUS_UNCITED` (you
  cannot retire a door without counting who still walks through it; a
  census over the scan bound refuses the same way — uncountable is not
  countable); every dependent is FLAGGED IN PLACE (a first-class notice
  row per dependent principal, appended BEFORE the lifecycle row — the
  flag precedes the ratification it warns about, scenario #99); then the
  lifecycle row lands (state deprecated, the sunset window starts).
  Invocation routing (`routeCall`, the pure gate the plan dispatcher and
  the future router seam both consult): deprecated within an unexpired
  shim window → the call ROUTES through the shim and the row carries the
  shim badge (scenario #46); deprecated with an expired shim →
  `CAP_SHIM_EXPIRED` (extend it with a decision record or migrate the
  caller — expired tissue does not keep executing); deprecated with no
  shim → `CAP_DEPRECATED` naming the sunset date and the successor; past
  sunset → `CAP_SUNSET_BREACH` naming the successor (or the explicit
  none) — the map forward; a caller migrated before sunset never sees the
  refusal. Shim extension is mechanical: a new lifecycle rev whose
  decisionRef equals the old one REFUSES `CAP_SHIM_EXPIRED` — extension
  requires a NEW decision record, checked, not remembered.
  `capability.lifecycle.read@1` (READ) returns the rows with their
  effective states (sunset derived from sunsetAt) plus a fresh census so a
  principal can cite what it must count.
- **Ops + namespaces.** New ops: `exec.inspect@1` (live view; `--history`
  replays any past plan's stalls, interventions, and resolution — paired
  with Ω-2.6's intent traces, "wrong read or wrong run?" becomes two
  diffs), `exec.intervene@1`, `capability.deprecate@1`,
  `capability.lifecycle.read@1`. New namespaces: `exec.state`
  (exec-state-90d), `exec.intervene` (forever), `capability.lifecycle`
  (forever) — rows land through `port:vault.append@1` (the manifest
  requests the vault/law port capabilities; the composition grant is the
  integration step, named in Evidence). Badges on every row; migration
  shims carry GEN_SPECULATIVE-style generality labels and hard expiry.

## Consequences

- Every registered plan is inspectable live and historically: a hang
  becomes a typed `blockedOn` plus a ledgered `EXEC_PLAN_STALLED` within
  the declared stall deadline, rendered headless as text — the spinner
  dies. Long-running automation becomes trustworthy because its stuck
  states are VISIBLE.
- The debugger is a citizen, not a king: interventions pay the same toll
  as doing (grant + consent through law), refusals carry sentences, cancel
  scars EXTERNAL_MUTATION, and the only out-of-band kill is
  unconstitutional-but-survivable WITH a scar row — emergencies no longer
  suspend the constitution, they pay for themselves in evidence.
- Capability evolution gains a ceremony instead of a delete key:
  dependents counted and flagged before ratification, successors named or
  explicitly none, shims badged and time-boxed, sunsets refusing with the
  map forward, history never deleted. The frozen op catalog gains its
  retirement path — the D-409 lesson (no unowned compatibility tissue)
  restated as law.
- Zero host LOC; the B5 fence, the anvil, and the compositions are
  untouched; the ops ride the existing manifest/router discipline. A
  composition that wants live ledgering grants vivim.run the vault/law
  port capabilities (the manifest requests them; the run.json grant list
  is a composition edit this wave does not make).
- Honest limits, stated: the registry is the minimal in-plugin plan
  registry (single-compartment scope — cross-compartment plan execution
  arrives with the orchestration lane that composes `register`); the
  vault mirror is best-effort with loud failure (the ring is the
  derivation source); realization liveness maps a step's capabilityRef to
  the compartment snapshot (Ω-14 owns the deeper stethoscope); a shim
  routes, it never rewrites the caller (migration is the dependent
  principal's decision, proposed at most); intent-level debugging stays
  Ω-2.6's.
- The falsifier-first loop (D-426) rides this record: the six clause lines
  below generate the RED stub, the implementation turns them green BEFORE
  the flip, and the D-364 evidence class holds.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-435` generates the RED stub this list resolves
  to):
  - `F-EXEC-DEBUG.1` (visible-hang) — a plan blocked on a dead realization reports blockedOn: liveness with an EXEC_PLAN_STALLED ledgered event; the state renders headlessly as text (plan.state view)
  - `F-EXEC-DEBUG.2` (gated-intervention) — pause/step/resume/cancel run as law-gated ledgered ops; an ungated intervention refuses EXEC_INTERVENE_UNGATED; cancel marks EXTERNAL_MUTATION
  - `F-EXEC-DEBUG.3` (honest-census) — capability deprecation counts dependents from the vault BEFORE ratification and flags them; a census-less ratification refuses CAP_DEPRECATE_CENSUS_UNCITED
  - `F-EXEC-DEBUG.4` (sunset-road) — post-sunset use refuses CAP_SUNSET_BREACH naming the successor (or explicit none); the shim window routes with a shim badge
  - `F-EXEC-DEBUG.5` (shim-expiry) — an expired migration shim refuses CAP_SHIM_EXPIRED; extension mechanically requires a new decision record
  - `F-EXEC-DEBUG.6` (headless-and-loud) — inspect/intervene/lifecycle are CLI/daemon ops; zero silent-failure paths (every anomaly is a named refusal or ledgered event)
- Files: `plugins/vivim-run/src/planstate.ts` (new — the registry, the
  row vocabulary, the pure derive/render folds, stall detection,
  EXEC_PLAN_OPAQUE), `plugins/vivim-run/src/intervene.ts` (new — the four
  verbs, the law-gate seam, the refusal register,
  EXEC_BREAKGLASS_EMPLOYED via the broker's external-kill observation),
  `plugins/vivim-run/src/capability.ts` (new — the lifecycle, the census
  fold, the routing gate, the CAP register), `plugins/vivim-run/src/
  index.ts` (the four ops wired: the executor seam on the REAL TaskPool,
  liveness fed from the health monitor's compartment snapshot, the
  capability route consulted at step dispatch, the broker's scar sink),
  `plugins/vivim-run/src/process-broker.ts` (additive: the external-kill
  seam + livePids process accounting), `plugins/vivim-run/plugin.json`
  (four contract contributions — exec.inspect READ, exec.intervene
  MUTATION, capability.deprecate EXTERNAL_MUTATION, capability.lifecycle
  read READ — plus the vault/law port capability requests with
  justification), `tooling/gates/test/f-exec-debug.test.ts` (the
  falsifier).
- Integration needs named for the wave close: the `docs/VAULT-NAMESPACES.md`
  registry gains the three ns rows (exec.state · exec.intervene ·
  capability.lifecycle — this lane does not edit the shared registry); the
  generated `docs/BUILD-DECISIONS.md` index row lands through the row
  regeneration ceremony from this record's `
- Ratified on greens (evidence-class, F-EXEC-DEBUG.1-6 green in this record's tree BEFORE the flip per D-364): landing commit 362c690; full gate green 1278/0 ×2 on the PROPOSED tree (2026-09-21T04:20:10Z and 04:25Z; the prior tip's 1253 + 25 new); zero host LOC; anvil untouched.

## Index` section; a
  composition that wants live exec-debug ledgering grants vivim.run
  `port:vault.append@1`/`port:vault.get@1`/`port:vault.query@1` and
  `port:law.check@1`; the `omega:exec ps` CLI renders
  `renderPlanState` (the surfaces lane's call).
- Precedents: the Ω-3.5 spec
  (`omega-upgrades/OMEGA-3.5-EXECUTION-DEBUG-DEPRECATION.md`, reserved
  `D-436` — the §10 record text this tree record translates); `D-374`
  (the process tier whose kill path now scars external kills and whose
  lawful BUDGET kills stay documented); the Ω3 spine decisions (the pool,
  budgets, and quarantine the verbs drive); `D-327`/`D-328` (the
  agent-exec ledger discipline — refused-and-ledgered is legitimate);
  `D-409` (one risk class per plugin — the shim discipline inherits its
  lesson); `D-364` (the evidence class this record ratifies under);
  `D-426` (the falsifier-first loop this record rides).

## Index

summary: vivim.run gains the execution-debug tier: a minimal plan registry whose derived plan.state view (graph, typed blockedOn, budgetTrace, EXEC_PLAN_STALLED within the stall deadline) renders headless, the four intervention verbs as law-gated ledgered ops with the OS break-glass scar, and the capability deprecation lifecycle (vault-cited dependents census flagged pre-ratification, successor-or-explicit-none, badged time-boxed migration shims, sunset refusals naming the way forward)
rationale: No plan may hang silently and no capability may vanish without a named successor path - debugging goes through the same law gate as everything else, because a kill switch is a privileged path wearing a toolbelt (Omega-3.5, the execution-debugging and capability-deprecation spec)
class: evidence
