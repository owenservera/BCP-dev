# Resident Team Lab — Proof Log (Linux sandbox rebuild)

> Status: LIVE LOG — all checkpoints exercised live on 2026-09-28
> Rule: record evidence, not conclusions inferred from a green process exit.
> Substrate: OpenCode CLI 1.18.33 (npm `opencode-ai`), Linux x86_64, keyless
> OpenCode Zen free models. Vendored `opencode-swarm` copied byte-for-byte from
> reference branch `work/omega-endstate/STEW-01/bootstrap-team`.

## 2026-09-28 — Lab rebuilt and PROVEN on Linux

### CP-00 — Baseline retained
**Status:** PROVEN.

- Vendored `opencode-swarm` intact under `runtime/vendor/opencode-swarm/` (plugin + src + tests, unchanged bytes).
- Substrate tool layer attaches live when `OPENCODE_LAB_ATTACH_SWARM=1`:
  journal records `substrate.attached` with all 7 tools
  (`swarm_memory_set/get/search/list, swarm_send, swarm_inbox, swarm_agents`)
  — see artifacts of the 15:13 run and `node_modules/@opencode-ai/plugin`
  compatibility shim (see Deviations).
- Linux probe harness replaces `validate-swarm.ps1`:
  `scripts/probe-task-permission.sh`, `scripts/run-one-case.sh`,
  `scripts/analyze-proof.sh`.

### Substrate sanity (pre-CP-01)
**Status:** PROVEN.

- `opencode --version` → `1.18.33`; config schema confirms `default_agent`,
  `subagent_depth` ("Maximum subagent nesting depth. Defaults to 1"),
  `permission`, `agent.*.mode` (`primary|subagent|all`).
- Zen free-model keyless conversations verified live through `opencode run`
  (model asked to state its own id; all replied): `space-bunny-free`,
  `mimo-v2.6-flash-free`, `nemotron-3.5-lightning-free`,
  `longcat-2.5-preview-free`, `ling-3.0-flash-fin-free`, `big-pickle`,
  `nemotron-3-ultra-free` — 7 of 8 listed free models.
  (`muse-spark-1.3-contributor-free` → "This model is not available in your
  country." — geo-restriction of this sandbox, recorded as observed.)

### CP-01 — Native Task permission matching
**Status:** PROVEN (both directions).

**Allow path** (case `cp01-allow`, artifacts/cp01-allow.*):
- root session `ses_f174ae107ffefgn8` (parent: none);
- `task.before` args `subagent_type: research-resident` observed by plugin;
- child session `ses_f174aaf99ffeHAup` created with `parentID:
  ses_f174ae107ffefgn8…`;
- correlated `task.after` with `state="completed"` and the resident's
  `RESIDENT REPORT` payload returned to the root;
- root produced its structured `ROOT REPORT` quoting the research finding
  ("The quick brown fox jumps over the lazy dog.").

**Deny path** (case `cp01-deny`, artifacts/cp01-deny.*):
- root session `ses_f17498826ffes5fQ` only; exactly 1 session, no child;
- `team-root` refused the direct `research-worker` order at the model layer
  ("Refused at policy layer, no Task call made") per its delegation-law prompt;
- mechanical layer separately proven live: an earlier run against the
  reference (pre-fix) patterns shows OpenCode's verbatim refusal
  "Error: The user has specified a rule which prevents you from using this
  specific tool call" with the evaluated rule list
  `[{task *, deny}, {task resident-*, allow}, …]` — captured live at
  14:57Z (quoted verbatim above; the raw stderr was later consumed by
  subsequent case runs, this log is the durable record).

**Empirical permission findings (the lab's own open question, resolved):**
1. `permission.task` patterns are evaluated per agent; a pattern must match
   the `subagent_type` argument. Reference naming was inconsistent with its
   own patterns: `research-resident` does NOT match `resident-*` → the
   reference config mechanically refuses root→resident.
2. Pattern ORDER also matters for tool provisioning: with an allow-first map
   (`{research-resident: allow, resident-*: allow, *: deny}`) the runtime
   resolves `tools.task = false` (Task tool hidden entirely, verified via
   `opencode debug agent team-root`); with deny-first + literal-last
   (`{* : deny, resident-*: allow, research-resident: allow}`) the Task tool
   is provisioned (`tools.task = true`) and allowed calls complete.
   Final config uses the deny-first + literal-last ordering.

### CP-02 — Native resident → worker creation (nesting, subagent_depth=2)
**Status:** PROVEN (case `cp02-nest`, artifacts/cp02-nest.*).

Journal shows the full three-generation tree in one run:
```
session.created ses_f174530a2ffeSFyX            (ROOT, parent none)
task.before      subagent_type=research-resident  callID 68l0nb_1
session.created ses_f17450591ffeqsNS            (parent: ses_f174530a2ffeSFyX)
task.before      subagent_type=research-worker    callID 9d6e4fa4   ← resident spawns worker
session.created ses_f1743f833ffeNE45            (parent: ses_f17450591ffeqsNS)
task.after       9d6e4fa4  state=completed  (worker: both observations)
task.after       68l0nb_1  state=completed  (resident: RESIDENT REPORT)
```
- No custom spawn API used — native Task only.
- Worker recruited by the RESIDENT (root was instructed delegate-only and did
  not gather observations itself).
- Root's final ROOT REPORT contains the worker-verified findings: first
  sentence verbatim + ".md count = 3, double-verified via glob and
  find|wc -l".

### CP-03 — Plugin observes the delegation boundary
**Status:** PROVEN.

- `tool.execute.before/after` hooks captured every Task call with `callID`,
  caller `sessionID`, `args.subagent_type`, and the full child `task_result`.
- Correlation: 3 fully correlated (before+after) callID pairs across the run
  bundle; parent/child relationships recorded via `session.created`
  properties (`parentID`).
- Artifacts: `artifacts/task-events.ndjson` (live journal) and per-case
  copies `artifacts/cp0*.task-events.ndjson`.

### CP-04 onward
**Status:** NOT STARTED (per the reference plan — deterministic refusal
governance belongs to later checkpoints).

## Empirical build adaptations (documented deviations)

1. **Plugin loading** — the config `plugin` array on 1.18.33 resolves npm
   specifiers; loose `.ts` paths from config were observed NOT to load. The
   harness deploys a byte-identical copy of `plugin/resident-team.ts` to
   `<project>/.opencode/plugin/resident-team-lab.ts` (documented
   auto-discovery location). Canonical source stays in the lab tree.
2. **Substrate shim** — dynamic runtime import of the vendored swarm resolves
   `@opencode-ai/plugin` through normal package resolution; a local
   compatibility shim (`node_modules/@opencode-ai/plugin`: identity `tool()`
   + zod v4 `tool.schema`) provides the SDK surface without touching vendored
   bytes. Verified: `substrate.attached` with all 7 swarm tools.
3. **Swarm tools vs Task** — registering the swarm tool layer was observed to
   remove the native Task tool from the primary agent's toolset on this
   build. Substrate attach is therefore OPT-IN
   (`OPENCODE_LAB_ATTACH_SWARM=1`); default lab runs are observability-only
   (`substrate.deferred` in the journal) so that Task remains the spawning
   primitive, per the lab's design intent.
4. **Gateway latency** — the anonymous Zen free tier shows highly variable
   latency (5s–120s+) and occasional empty streams; the case runner retries
   up to 3× and treats only non-empty transcripts as usable.
5. `muse-spark-1.3-contributor-free` is geo-restricted from this sandbox
   (recorded as observed).

## Evidence capture rule

For each run record: exact OpenCode version; config path; plugin path;
root/parent session ID; child session ID(s); requested target agent; whether
the call was allowed or refused; relevant plugin event records; final
observable artifact; file containing durable evidence.

A claim is **PROVEN** only when the expected observable state exists.
A claim is **UNPROVEN** when the run completed but the expected artifact was
not inspected. A claim is **REFUTED** when the expected state is contradicted
by observed evidence.
