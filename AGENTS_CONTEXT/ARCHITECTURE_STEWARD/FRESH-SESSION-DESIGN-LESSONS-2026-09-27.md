# Fresh-Session Design Lessons — 2026-09-27

> Status: OBSERVED → DERIVED → PROTOCOLIZED
> Scope: independent ChatGPT web-app conversations acting as BCP-dev agents.
> Authority: Steward process-learning artifact; not Ω law.

## What failed

A fresh conversation correctly read a task prompt but assumed that repository execution had to be delegated to an external implementation agent.

That assumption was wrong for this operating model.

The human owner is launching independent ChatGPT conversations as agent sessions. When the current ChatGPT surface has repository read/write capability, the conversation itself must execute the assigned repository task.

## Durable lessons

### 1. Conversation = agent session

A new ChatGPT conversation is an independent agent execution surface.

No external OpenCode agent should be assumed to exist.

If required capability is unavailable, report the exact environment limitation instead of inventing a handoff.

### 2. Prompt ≠ context

A launch prompt identifies the task, but it cannot safely carry the agent's entire architectural memory.

Every agent home therefore needs a small:

```
SESSION-CONTEXT.md
```

It is a navigation layer pointing to the real identity, state, alignment, history and task artifacts.

### 3. Identity must be durable

Ratified agents use `CORE-AGENT.md` where that is the established convention.

Existing ratified legacy identity artifacts such as CFA-03 `AGENT.md` remain valid when explicitly established; do not manufacture duplicate identities merely for naming consistency.

Provisional agents use their seed/design artifact until owner alignment is complete.

### 4. Reports are inputs, not truth

A report returned from another ChatGPT conversation is a claim.

The next session must:

```
report
→ verify SHA on current main
→ inspect expected artifacts
→ continue from observed repository state
```

This prevents the conversation chain from becoming a second source of truth.

### 5. Prompt chaining needs explicit prerequisites

When one session depends on another, the next launch prompt must contain:

- predecessor condition;
- expected SHA when useful;
- required repository artifacts to inspect;
- hard stop if the prerequisite is absent or contradictory.

### 6. Fresh sessions should load progressively

Use:

```
global repository rules
→ local SESSION-CONTEXT
→ durable identity/seed
→ STATE
→ owner alignment/history
→ relevant peers
→ task
→ evidence as needed
```

Do not solve context loss by making prompts enormous.

### 7. Parallel conversations need a shared synchronization point

Parallel sessions may coexist only when their write surfaces and authority dependencies permit it.

`main` plus durable repository artifacts are the synchronization point.

No session should assume another session's uncommitted work exists.

### 8. Honest capability reporting matters

Repository read/write, Commons signing, network access and other tools are session capabilities, not permanent architectural facts.

A capability limitation is an environment fact unless repeated evidence demonstrates an architecture gap.

Never fabricate execution, signatures, IDs, commits or proof.

## Protocol consequence

These lessons are now encoded in:

- `CHATGPT-FRESH-SESSION-PROTOCOL.md`
- `CHATGPT-FRESH-SESSION-PROMPT-TEMPLATE.md`
- per-home `SESSION-CONTEXT.md`
- the upgraded CFA-02 Owner Alignment prompt.

## Validation target

CFA-02 is the first real test of this protocol.

A new ChatGPT conversation should be able to:

1. identify itself as `data-model`;
2. load its own `SESSION-CONTEXT.md`;
3. verify CFA-01's ratified commit on current `main`;
4. load the existing Data seed/state;
5. conduct explicit Owner Dialogue;
6. stop before self-ratification;
7. continue after the owner's decision;
8. persist/commit the result;
9. return the standard completion contract.

