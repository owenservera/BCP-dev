# 02 — Orchestration

## The unit of concurrency

A **prompt**. `client.session.prompt()` blocks for the duration of one turn and returns that
turn's result. Agents are concurrent because their prompt calls are issued concurrently
(`Promise.all`, gated by a limiter), each against a different session. There is no background
job, no poll loop, and no idle detection.

```
Promise.all(agents.map(a => limit(() => runAgent(ctx, a))))
```

`runAgent` is:

```
1. skip if over budget
2. create session if we do not already have one   (resume path reuses it)
3. turn 0:  prompt(agent.task)
4. for round in 1..maxRounds:
     msgs = bus.claim(agent)          # claim = read + mark delivered, atomically enough
     if msgs is empty: break
     if over budget: break
     prompt(formatDelivery(msgs))
5. status = done, result = last text
   on throw: status = failed, result = error message   (the run continues)
```

## Delivery semantics, stated precisely

opencode has no MCP server-push: a running session cannot be interrupted mid-turn. Therefore:

- **In-loop delivery.** After its own turn, an agent drains its inbox and, if anything is
  waiting, is prompted with it. This is a normal prompt, so it is serialised by the session
  naturally.
- **Final sweep.** After every agent's loop ends, messages addressed to agents that already
  finished are delivered in up to `maxRounds` additional rounds. The reaction is **appended** to
  the existing result (`[update after message] …`) so a courtesy reply cannot clobber a settled
  answer.
- **Ping-pong guard.** After the sweep, anything still undelivered is deliberately marked
  delivered and dropped. Two agents politely acknowledging each other must not loop forever.
- **Claim on read, not on send.** A message is marked delivered when the orchestrator claims it.
  If the subsequent prompt fails, we do not redeliver — otherwise a transport failure causes
  infinite replay. The full history is retained, so an undelivered tail is still inspectable.

The agent-initiated `vivim_swarm_inbox` is **read-only**. The orchestrator owns delivery; two
consumers of the same `delivered_at` column would race and silently drop messages.

## Limits, and why each exists

| Limit | Default | Rationale |
|---|---|---|
| `maxConcurrent` | 4 | Caps simultaneous turns. A free local model still has real CPU/RAM cost, and 25 agents at once is a self-DoS. |
| `maxRounds` | 6 | Hard guard on the in-loop + sweep message cycles. Bounds total turns per agent. |
| `budgetSeconds` (per run) | 1200 | **Wall clock.** The reference's `budgetUsd` cannot protect us: a free provider reports zero cost, so a hung run is unbounded. Wall clock is the limit that actually binds. |
| `budgetSeconds` (per agent) | 600 | An individual agent that is wedged fails alone. |
| `budgetUsd` | unset | Carried for parity and future paid models. Reported per turn. |
| retries | 3, quadratic backoff | Transient provider errors are common; three attempts with `500ms·(n+1)²` recovers the common cases without masking a real failure. |

**Budget semantics:** exceeding a limit is `UNRESOLVED`, not failure and not success. In-flight
turns are allowed to finish; no new turns are issued. A run that hits its budget still produces
receipts and a report.

## Failure handling

| Failure | Behaviour |
|---|---|
| `swarm.json` invalid | Reject before any session exists. No partial run. |
| Worktree allocation fails | That agent is `failed` with the allocator's own message. Other agents proceed. |
| `session.create` fails | That agent is `failed`. Others proceed. |
| Prompt fails 3× | That agent is `failed`. Others proceed. |
| One agent is `failed` | Run status is `failed`, exit code 1, **but every other agent still completes and is still receipted**. |
| Budget exhausted | Remaining agents `UNRESOLVED`. Run status `stopped`. |
| Orchestrator itself throws | Receipts already written stay written. The DB keeps the partial run for `status` / `resume`. |

Resume skips agents already marked `done`, reusing their stored `sessionId`.

## The swarm system prompt

Appended to every agent's turn, after the agent's own `system` text:

```
You are agent "<name>" in the swarm "<swarm>", collaborating with:
- <peer>: <first 120 chars of their task>
...
Tools:
- vivim_swarm_memory_set/get/search/list  shared key-value memory
- vivim_swarm_send   message a peer by name, or "*" to broadcast
- vivim_swarm_inbox  read messages addressed to you
- vivim_swarm_roster roster + status
- vivim_swarm_receipt  record your verdict and evidence  <- VIVIM addition
Coordinate through these tools instead of assuming what others did.
Never send acknowledgement-only messages — only message a peer when you carry
information they do not have.
```

The `vivim_swarm_receipt` line and the evidence bar are VIVIM's. The rest follows the reference.

## Least privilege, and the one override

A per-agent `tools` map is passed straight through to `session.prompt`. A restrictive map such
as `{"*": false}` must **never** strip the coordination tools, or agents become mute. So the
orchestrator force-enables them on top of whatever the map says:

```ts
const tools = userTools
  ? { ...userTools, ...Object.fromEntries(SWARM_TOOLS.map((t) => [t, true])) }
  : undefined
```

This is covered by a test, because getting it wrong is silent: the run completes, the agents
simply never talk.

## Events

Every state change emits a typed event, written as JSONL with a flush per line, and terminated by
a `cli-exit` sentinel:

```
run-start
agent-allocated { agent, branch, baseSha, workspace }
agent-session  { agent, sessionId }
agent-turn     { agent, round }
agent-turn-done{ agent, round, model, costUsd, tokens }
messages-delivered { agent, count }
agent-verdict  { agent, verdict }
agent-failed   { agent, error }
budget-exceeded
swarm-done     { runId, status }
cli-exit       { code }
```

The `cli-exit` sentinel exists so a consumer can distinguish "the run finished and the process is
exiting" from "the writer hung". Without it, an events-file tailer has no way to tell those apart
— which is the same class of problem as trusting an exit code.
