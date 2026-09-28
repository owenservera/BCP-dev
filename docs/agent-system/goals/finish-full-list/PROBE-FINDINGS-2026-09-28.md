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
