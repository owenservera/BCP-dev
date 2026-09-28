# 08 — Testing

## Principle

The orchestrator must be testable **without a model and without a server**. That is achieved by
depending on a *structural* type rather than the concrete SDK client:

```ts
export type SessionClient = {
  session: {
    create(opts: { body: { title: string } }): Promise<{ data?: { id: string }; error?: unknown }>
    prompt(opts: {
      path: { id: string }
      body: {
        model: { providerID: string; modelID: string }
        system?: string
        tools?: Record<string, boolean>
        parts: Array<{ type: "text"; text: string }>
      }
    }): Promise<{ data?: PromptResult; error?: unknown }>
  }
}
```

Two methods. The real SDK client satisfies it structurally; a fake satisfies it in twenty lines.

## The fake client

The fake routes each prompt to a per-agent **script** — an array of handlers, one per turn — and
each handler receives `{ text, swarmId, bus }`. That lets a test script an agent that *actually
uses the bus and memory*, which is what makes delivery testable at all:

```ts
function fakeClient(scripts: Record<string, Turn[]>): SessionClient { … }

fakeClient({
  sender:   [({ swarmId, bus }) => { bus.send("sender", "receiver", "use port 8080"); return "sent" }],
  receiver: [() => "first turn", () => "acted on message"],
})
```

## Unit tests that must exist (no network)

| # | Test | What it protects |
|---|---|---|
| 1 | Two agents run and both results are recorded | Basic fan-out |
| 2 | A message sent in turn 0 arrives as a follow-up prompt | Delivery in-loop |
| 3 | A failing agent marks the run failed; a peer still completes | Failure containment |
| 4 | A model error in `info.error` is retried 3× then surfaced | Retry policy, and reading the right error field |
| 5 | Resume skips agents already `done` | Resume correctness |
| 6 | Final sweep delivers to an already-finished agent | Late delivery |
| 7 | A restrictive `tools` map never strips the swarm tools | **Silent** failure otherwise |
| 8 | Sweep delivery **appends** rather than clobbers a settled result | Courtesy replies cannot destroy answers |
| 9 | System prompt names teammates and tools | Coordination is discoverable |
| 10 | An agent that records no verdict becomes `UNRESOLVED` | VIVIM: absence of verdict is not success |
| 11 | `vivim_swarm_receipt` rejects a verdict with < 10 chars of evidence | VIVIM: verdict without evidence is not recorded |
| 12 | `vivim_swarm_receipt` rejects a verdict outside the three values | VIVIM: no free-form verdicts |
| 13 | Budget exhaustion marks the remainder `UNRESOLVED`, not `done` | VIVIM |
| 14 | `upsertAgent` with a partial update preserves omitted fields | The `excluded` vs raw-param bug |
| 15 | Two runs cannot see each other's memory | Run isolation |
| 16 | A message is delivered exactly once | No replay, no double-spend |
| 17 | `swarm_send` to an unknown agent returns the roster, writes nothing | VIVIM |
| 18 | A tool call from a non-swarm session writes nothing | Identity safety |
| 19 | `round >= 0` on every `agent-turn` and `agent-turn-done` | Guards the final-sweep ordinal regression the reference fixture still exhibits |
| 20 | `agent-settled` cost includes sweep turns; `agent-done` does not | Two distinct cost reports for the same agent |
| 21 | Budget: 4 agents, $1/turn, budget $2, serialised → 2 `done`, 2 `skipped`, status `stopped`, cost exactly $2, **one** `budget-exceeded` | Deterministic brake semantics |
| 22 | `maxConcurrent: 2` with 6 agents never exceeds 2 concurrent prompts; with no cap all 5 run at once | The limiter is real, not decorative |
| 23 | `validateConfig` rejects missing name/model/agents, an agent with no task, duplicate names, and the reserved name `*` | Fail before any session exists |
| 24 | `parseModel` splits on the first slash only, so `modelID` may contain slashes | Provider/model boundary |
| 25 | `migrate()` adds a column to a hand-built legacy table | Additive migration is real, not assumed |
| 26 | The MCP tool surface is asserted as an exact sorted list | A silently-added or renamed tool is a contract change |
| 27 | Broadcast excludes the sender; `inbox(all:true)` keeps history after `markDelivered` | Delivery accounting |

Already passing (12): state isolation between runs, exactly-once delivery, broadcast fan-out,
self/empty message rejection, per-run memory isolation, delivery-prompt rendering, retained
history, verdict storage including `UNRESOLVED`, partial-update no-clobber, status never reset to
the insert default, `findAgentBySession` unambiguous with unknown ids resolving to nothing.

## MCP testing without a subprocess

The reference does not shell out to test its MCP server. It links a real client and server over
an in-memory transport:

```ts
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])
const tools = await client.listTools()
```

That gives real protocol coverage — including `isError` on an unknown swarm and on a bad config —
with no process, port or model. We do the same, and inject a fake runner so `swarm_run` completes
deterministically.

## Do not use the reference's events fixture as a schema

`tests/fixtures/events.sample.jsonl` is **stale**. It was captured before two fixes and contradicts
the current code and its own tests:

- it contains `"round": -1` from a final-sweep delivery, which current code cannot produce and a
  current test explicitly forbids;
- its `tokens` objects carry a `total` field the current `TurnTokens` type does not declare.

Derive the event schema from `orchestrator.ts` and `02-orchestration.md`, never from the fixture.

## Workspace isolation tests

These have real side effects and are separated from the pure unit tests:

- `allocate()` against a real repository, then assert: manifest present, branch matches
  `work/omega-endstate/<agent>/<task>`, base SHA equals the remote `team/omega-endstate` tip,
  `--git-common-dir !== --git-dir`.
- An invalid `agentId` or task slug is rejected before any git operation.
- Allocation refuses to run when the path or branch already exists.
- A negative case: point the allocator at the main checkout and confirm the isolation assertion
  fires.

Verified live once already (2026-09-28): allocation produced an isolated worktree on the expected
branch at the remote tip, clean, and retired with no leftover path, branch or worktree entry.

## E2E — one, gated on auth

Exactly one end-to-end test, because it costs a real model and real time:

```
scout   : store BLUE-42 in shared memory under 'secret-code', then swarm_send it to 'analyst'
analyst : swarm_inbox; when told about a key, swarm_memory_get it and state the exact value
assert  : run completed; analyst's result contains BLUE-42; memory entry exists, updatedBy scout
```

Both agents use `tools: {"*": false}`, which simultaneously proves the force-enable rule at
runtime. Skip automatically when opencode is absent or no auth file exists.

**Acceptance for VIVIM's addition:** the same shape, but each agent also records a receipt, and
the assertions check the verdicts and the receipt files exist with the right workspace identity.

## What is deliberately not tested

- Real provider drift. That is a product experiment (Roadmap F2), not a unit test.
- The live ChatGPT path. It needs the user's authenticated browser and is proven by hand.
- Concurrency timing. Assert on outcomes, never on wall-clock interleaving — a timing assertion
  here would be flaky and would not protect anything.
