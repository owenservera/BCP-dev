# U1 Risk Register — Governed Native Task Delegation

> Status: LIVE DESIGN REGISTER
> Date: 2026-09-28
> Substrate: OpenCode v1.18.4
> Method: identify failure modes before implementation and bind each to an experiment

## Risk severity

- **P0** — can invalidate the delegation/security boundary
- **P1** — can invalidate lineage/recovery or produce unsafe ambiguity
- **P2** — can block reliable operation but is contained by the initial experiment
- **P3** — refinement for later scale

| ID | Severity | Failure point | Why it matters | U1 design response | Proof |
|---|---|---|---|---|---|
| U1-R01 | P0 | `task_id` reuses an unrelated session | Native Task v1.18.4 can reuse an existing session without proving target/parent identity alignment | Ban `task_id` in fresh governed spawns; separate resume qualification | Attempt cross-session resume; prove refusal |
| U1-R02 | P0 | Model-visible Task catalog mistaken for authority | Tool schema may expose targets outside the active allow-list | Treat schema as discovery only; enforce at execution and test actual denial | Disallowed target invocation produces no child |
| U1-R03 | P0 | Worker inherits unintended execution power | Misconfigured/merged permissions could leave Task or consequential tools available | Verify effective child permission after creation; worker also has explicit Task deny | Worker attempts Task and is refused |
| U1-R04 | P0 | Plugin gate becomes advisory rather than blocking | Observability without enforcement leaves governance bypassable | Place preflight in `tool.execute.before`; throw on denial; test no child creation | Denied call has no child |
| U1-R05 | P1 | Same logical request creates two children | Retry after ambiguous transport/observer failure can duplicate work | Require `spawn_id`; reserve/record attempt before execution; reconcile before retry | Replay/interruption test |
| U1-R06 | P1 | Child exists but execution proof is missing | A created session is not proof that the worker actually ran | Separate CREATED from RUNNING/COMPLETED; require observable execution | Child exists with no turn => UNKNOWN |
| U1-R07 | P1 | Lineage exists only in runtime memory | Supervisor/plugin crash destroys the parent-child explanation | Durable spawn receipt and correlation fields | Restart observer; lineage remains |
| U1-R08 | P1 | Resident can exceed intended fan-out | Native depth does not limit sibling count or per-work-item proliferation | Small runtime admission caps | Third spawn is refused |
| U1-R09 | P1 | Worker can become a resident by target naming | Stable identity could be confused with arbitrary agent profile names | Registered target catalog with explicit role class | Resident target request is refused |
| U1-R10 | P1 | Parentage is inferred rather than observed | Prompt text can claim a parent relationship | Verify native child `parentID` against caller session | Mismatched lineage fails proof |
| U1-R11 | P1 | Parent dies while child remains | Orphaned child can later be mistaken for active work | Child remains associated with original spawn; orphan is RECOVERY_REQUIRED, not adopted silently | Kill parent during task |
| U1-R12 | P1 | OpenCode permission and VIVIM permission disagree | Two policy layers can authorize/deny differently and create confusing states | Define VIVIM as narrower policy; native denial is terminal | Matrix of allow/deny combinations |
| U1-R13 | P1 | Session directory is not checked | A reusable session may act in an unintended workspace | Bind directory/worktree to governed spawn and verify after creation | Cross-directory attempt |
| U1-R14 | P2 | Busy parent emits concurrent Task calls | Concurrent tool calls can race admission and receipts | Atomic local admission check around `spawn_id`/active count | Parallel two/three-call test |
| U1-R15 | P2 | Observer event arrives after completion | Async event ordering can make evidence look incomplete | State machine tolerates reordering and reconciles from session state | Delayed-event fixture |
| U1-R16 | P2 | Plugin artifact write is lost on abrupt exit | Fire-and-exit/logging can truncate evidence | Flush durable receipt before considering gate complete; avoid `process.exit` shortcuts in probes | Kill observer during receipt |
| U1-R17 | P2 | Unknown native failure treated as refusal | Refusal, provider failure, and observer failure have different recovery semantics | Preserve distinct terminal states | Inject each failure class |
| U1-R18 | P2 | Task depth is treated as delegation policy | `subagent_depth=2` controls topology depth, not per-agent authority | Keep depth as one defense; use explicit target/capacity policy | Attempt sibling fan-out within depth |
| U1-R19 | P2 | Worker result text becomes authority | LLM output is not canonical evidence | Receipt points to observed artifacts/state, not only text | Worker lies about completion |
| U1-R20 | P2 | Existing `opencode-swarm` tools create a second communication path | Swarm messaging can bypass the new native Task lineage model | U1 worker does not use swarm messaging for control; compatibility only | Inspect tool set used in proof |
| U1-R21 | P2 | Base plugin composition changes hook behavior | Lab plugin wraps `SwarmPlugin`; future hook collisions could change semantics | Keep resident plugin hooks explicit and test loaded hook set | Startup/plugin inspection |
| U1-R22 | P2 | Permission prompts stall a headless child | A worker can enter an `ask` state that no human responds to | U1 worker tool set is explicit and non-interactive; pending permission is not completion | Force an ask condition |
| U1-R23 | P3 | Runtime registry becomes a second task manager | Operational state gradually grows into duplicated orchestration | Keep U1 state limited to spawn admission/lineage/evidence | Review registry fields before expansion |
| U1-R24 | P3 | Long-lived session context contaminates work | A future resident may carry stale instructions into child selection | U1 uses explicit work_item_id and prompt digest; context epochs deferred to resident layer | Context contamination test later |
| U1-R25 | P0 | Worker bypasses Task through another spawn surface | Shell, swarm CLI, or an agent-control MCP can create agents without invoking native Task | U1 leaf profile must have no alternate agent-creation path; treat Task denial alone as insufficient | Worker attempts alternate spawn; prove no child |
| U1-R26 | P1 | Default `ask` permission stalls a headless resident/worker | Subagent can wait for a permission response that no human is servicing | U1 profiles explicitly allow/deny all tools needed by the experiment; no required path depends on `ask` | Exercise every required tool path headlessly |
| U1-R27 | P1 | Overlapping wildcard permission rules change meaning by order | OpenCode permission evaluation is last-match; a later broad rule can reopen a denied target | Treat effective policy as an ordered compiled artifact and test representative overlaps | Swap rule order; expected decision must change/confirm deliberately |
| U1-R28 | P2 | Background Task path introduces different completion semantics | Background execution changes delivery, parent notification, and permission timing | Exclude `background=true` from U1; qualify it separately | Attempt background flag; U1 rejects/not-used |

## Highest-risk deductions

### 1. Resume is a separate product feature

The existence of `task_id` makes the Task API look more complete than it is for governed residency.

Treat resume as a new capability with a new proof gate.

### 2. Native permission is necessary but not sufficient

Native Task answers:

> "May this session invoke this subagent type?"

U1 additionally needs:

> "Is this stable agent, in this team/work item, in this runtime incarnation, allowed to create this exact worker now?"

These are different questions.

### 3. Execution admission is different from intellectual allocation

The resident chooses demand.

The runtime only enforces whether that demand is permitted and affordable.

### 4. Evidence must cross the crash boundary

If the spawn record exists only in memory, the first supervisor crash converts successful delegation into unverifiable ambiguity.

### 5. The first implementation should be deliberately boring

No dynamic scheduler, no message bus redesign, no resident registry service, no custom child process.

The strongest test is a small number of explicit rules around the existing Task primitive.
