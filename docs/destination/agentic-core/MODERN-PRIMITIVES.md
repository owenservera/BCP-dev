# Modern Primitives

## Temporal / Durable Task

**OBSERVED / EVIDENCE-SUPPORTED:** Microsoft documents durable orchestration with persisted/checkpointed progress, long-running execution, durable timers, external events and retries. Durable orchestration history is the reusable primitive.

**Harvest:** durable wait, orchestration history, event wakeup, retry policy.

## AWS Step Functions

**OBSERVED / EVIDENCE-SUPPORTED:** task states expose Retry/Catch, explicit timeouts and heartbeat concepts; AWS also documents human approval by pausing execution for a response.

**Harvest:** timeout, heartbeat, retry/catch, callback wait.

## OpenAI Agents

**OBSERVED / EVIDENCE-SUPPORTED:** current OpenAI documentation describes tools, handoffs, session/state continuation, tracing, guardrails and human approval interruptions with resumable state. Approval pauses a run and later resumes its state.

**Harvest:** resumable review, tool-level controls, bounded delegation, traces.

**Do not harvest:** provider hosting/model ownership as VIVIM kernel architecture.

## General convergence

Modern systems reinforce a common primitive:

**durable coordinator + bounded activities + explicit state + external-event waits + policy/approval + retry/timeout + observability.**

VIVIM should put that coordinator below AI:

`Work → deterministic Plan → governed Capability → Attempt → checkpoint → verify`.

Framework APIs are evidence of useful mechanisms, not VIVIM authority.
