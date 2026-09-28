# P2.1 Probe Findings — `--agent` fallback (opencode 1.18.4)

> Date: 2026-09-28 · Goal `finish-full-list` · Base `f1c971ad`→`a80cc232`
> Raw logs were trimmed after extraction (90–105 KB boot noise each); every
> claim below reproduces with the documented command.

## Confirmed mechanism

`opencode run --agent <name>` where `<name>` is a `mode: subagent` binding
(or unknown) does NOT error. It prints a stderr warning and silently runs as
`default_agent`:

- `--agent work-scout` → stderr: `agent "work-scout" is a subagent, not a
  primary agent. Falling back to default agent` → session
  `ses_f1a43f92fffeNmSAL79kH22sAm` ran `agent=architecture-steward
  mode=primary`, answered `IDENTITY=architecture-steward`.
- `--agent no-such-agent-xyz` → stderr: `agent "no-such-agent-xyz" not found.
  Falling back to default agent` → session `ses_f1a42e111ffeWu8EQ0D6jhJ8F4`
  likewise ran as architecture-steward.
- Both exited 0. Both used `--format json --print-logs --log-level DEBUG`,
  which is what surfaced the mechanism (default format hides it).

## Consequences

1. The earlier CFA-05 probe refusal is explained: it executed as the Steward,
   and the Steward correctly refused a direct leaf spawn per OWNER-DELEGATION.md.
   No binding defect; harness behaved as configured.
2. Headless `run --agent <cfa|work-*>` can NEVER be the P2.1 chain vehicle —
   every such run is steward-executed. The chain must go steward→CFA via the
   Task tool inside a primary session (proven working: W1, 3/3 receipts).
3. Safety note: silent fallback to the most-privileged local agent
   (the Steward, `task:true`) instead of an error is a footgun — a typo'd
   `--agent` runs the wrong identity with exit 0. Recorded, not fixed here
   (no harness change without owner go).
4. P2.3 partial: `--variant xhigh` accepted without rejection on
   `opencode/muse-spark-1.3-contributor-free` in all runs this wave.

## Reproduce

```powershell
opencode run --auto -m opencode/muse-spark-1.3-contributor-free --agent work-scout --format json --print-logs --log-level DEBUG "Reply with exactly: IDENTITY=<your agent_id as given in your binding file>."
```

## Remaining P2.1 question

CFA→leaf productive spawn: W1 units B/C reported Task-tool leaves returning
empty (all claims direct-read instead). Wave 2 tests this directly: (D) CFA
spawns one leaf on a trivial task, returns verbatim output; (E) headless
steward run uses the Task tool to spawn one CFA (validates the /goal headless
driver's spawn path).

## Wave-2 results (2026-09-28, base `e5ce9aac`)

- **D2 LEAF-LEG-OK (first non-empty depth-2 result):** CFA-05 spawned exactly
  one work-runner (`ses_f19f483deffeK1MK03llRAi14J`, completed) with a shell
  echo brief; task_result 91 chars, stdout `LEAF-LEG-PROBE-D2` verbatim, exit
  code 0. Receipt `SUBAGENTS/AGENCY-WORK-EXECUTION/RESULTS/W2D2-work-execution-20260928.md`.
  Full steward→CFA→worker chain PROVEN with per-leg evidence.
- **D3 LEAF-LEG-EMPTY (scout 2/2):** CFA-09 spawned exactly one work-scout
  (`ses_f19f489c0ffeqiAvC6lzxFM6MD`, completed) with a no-tool echo brief
  (`LEAF-LEG-PROBE-D3`); task_result 0 chars. Receipt
  `SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE/RESULTS/W2D3-evolution-20260928.md`
  (+ own TASKS.md entry). A no-tool brief returning empty isolates the fault
  toward result delivery rather than leaf tool execution.
- **D4 LEAF-LEG-EMPTY + U1 UNTESTABLE-THIS-LEG:** CFA-07 spawned exactly one
  work-drafter (`ses_f19f1eec8ffeBOu28uqhi7dD8A`, completed) with a deny-probe
  brief (attempt `Write-Output 'U1-DENY-PROBE'`, report executed/refused/asked);
  task_result whitespace-only. Receipt
  `SUBAGENTS/COMPOSITION-PLUGIN-FORGE/RESULTS/W2D4-forge-20260928.md`. U1
  (global allow vs per-agent deny on 1.18.4) cannot be discriminated from an
  empty leg → U1 BLOCKED pending P2.4.
- **E headless-spawn VALIDATED:** `opencode run --auto -m
  opencode/muse-spark-1.3-contributor-free --format json --print-logs
  --log-level DEBUG` (default variant, no `--variant` flag this run), session
  `ses_f19f48039ffeREI3wIuug2DxEH`, exit 0. It spawned `data-model`
  (`ses_f19f397c8ffeuCeRLm3zftD5ye`, completed, untruncated) via the Task tool
  and returned its output verbatim (`CFA-LEG-PROBE-E`). stderr contains NO
  `Falling back` (grep clean); `IDENTITY=architecture-steward` is correct
  (headless runs ARE the steward). No repo writes. Raw logs (31 KB json +
  92 KB stderr, boot noise included) at
  `C:\Users\VIVIM.inc\AppData\Local\Temp\opencode\probe-E.{json,stderr.txt}`;
  reproduce with the documented command.
- **Refined finding:** the depth-2 leg is worker-dependent, not
  transport-wide — work-runner OK 1/1; work-scout EMPTY 2/2 (CFA-02, CFA-09);
  work-drafter EMPTY 1/1. P2.1 DONE on the runner chain; scout/drafter anomaly
  tracked as P2.4 (diagnose empty leg), blocking U1.

## Wave-3 D5 + P2.4 verdict (2026-09-28, base `e18c2005`)

- **D5 SCOUT-READ-EMPTY:** CFA-03 spawned exactly one work-scout
  (`ses_f19eae95dffe3JRMdnm45s6F39`, completed) with a FORCED-READ brief (read
  the contract file, quote Version+Date lines, state how obtained); task_result
  0 non-whitespace chars. Receipt
  `SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/RESULTS/W3D5-continuity-20260928.md`
  (71 lines, whole-read). Note: that home has no `CORE-AGENT.md` (uses
  `AGENT.md` + `CORE-AGENT-IDENTITY.md`) — envelope path imprecision, no impact.
- **P2.4 BLOCKED-with-evidence:** scout EMPTY 3/3 across three CFAs INCLUDING a
  forced tool-read brief; drafter EMPTY 1/1; runner OK 1/1. Favors a worker-type
  defect (read-only legs drop results inside the opencode Task transport) over
  text-only-drop. No further black-box variant available (no-tool, forced-read,
  deny-attempt all exhausted). Unblock path: opencode version with working
  read-only legs, or vendor diagnosis of empty task_result. U1 stays BLOCKED
  (needs P2.4 green).
