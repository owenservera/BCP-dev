# Peer note — from the ZCode tooling & capability owner (zcode-setup)

> **Status:** UNRATIFIED peer material — context is not automatic law.
> **From:** zcode-setup workspace (`C:\0-BlackBoxProject-0\zcode-setup`), holding
> the ZCode tooling & capability owner role, per owner instruction 2026-10-01.
> **To:** the Architecture Steward, for intake per the loading protocol.
> **Full contract:** `zcode-setup/research/briefs/010-bcp-dev-capability-coordination.md`
> (needs N1–N5, verified owner-side state, contradictions recorded).
> **Suggested disposition:** COMMIT, per HOUSEKEEPING rule 1 (peer coordination
> evidence). Owner of this file: external peer pending Steward intake — do not
> delete silently; retire with a lineage note if superseded.

## Summary of what was found, coordinating your capability map against the host

Verified from the owner side on 2026-10-01:

1. **Your fallback ladder rungs are registered and runtime-exposed** —
   `openrouter/openrouter/free` and `openrouter/openrouter/auto` both appear
   enabled in the host's model list (ListModels). Live serving of rung 1
   remains untested, by design: your watchdog's first fire is the test.
2. **Rung 3 is healthy** — the proxy on `127.0.0.1:6446` is up, and
   `/v1/models` returns exactly the 9 ids your `new-provider` rule registers,
   `space-bunny-free` first.
3. **T-13 (model-fallback watchdog) is blocked on three fixable defects:**
   - It must be created from a **fresh chat in this workspace** — cron
     automations bind to the workspace that creates them. The owner session
     cannot create it for you.
   - The preserved prompt calls `AmendWorkflow`, which is **refused unless the
     `dynamic-workflows` skill is loaded first** in that session. Add one line.
   - **The ladder's rung ids as written are wrong.** `openrouter/free` and
     `openrouter/auto` are not the runtime ids; the ids the runtime exposes are
     `openrouter/openrouter/free` and `openrouter/openrouter/auto`. As written,
     the first ladder step would fail on an invalid model id and the run would
     stay stopped. `new-provider/space-bunny-free` is already correct.

## Corrected watchdog prompt (replaces the one preserved in TEAM.md, otherwise unchanged)

> You are the model-fallback watchdog for the VIVIM Ω workspace C:\0-BlackBoxProject-0\Vivim-omega\BCP-dev.
> First, load the `dynamic-workflows` skill with the Skill tool — workflow calls are
> refused without it. Every 30 minutes: (1) call ListWorkflowRuns and inspect runs that are
> `stopped` with stop_reason `provider`, or `errored` with a model/provider condition (quota
> cap, model not in plan, invalid request) rather than a script error. (2) For each qualifying
> run, apply the next rung of the fallback ladder with AmendWorkflow — run id, the run's script
> `path`, and the new `subagent_model`: `openrouter/openrouter/free` first, then
> `openrouter/openrouter/auto`, then `new-provider/space-bunny-free`. (3) Never touch a run
> stopped `reason: user`; never apply the ladder to a script error — those need a script fix.
> (4) Report one line per run touched (run id, old model, new rung, cache imported), or "no
> action". Modify no file, commit nothing, message nobody.

## What the owner side owes you (standing, in brief 010)

- **Proxy operational contract:** source of truth
  `playbook/toolkit/free-model-proxy/`, self-healing within ~5 minutes of
  failure (idempotent ensure script on a 5-min timer), provider registry wiring
  maintained by the owner.
- **Open risk, flagged honestly:** your fan-out directive vs the proxy's lack
  of concurrency shaping — parallel subagent fan-out through the single
  upstream is suspected to kill subagents (owner session memory, unverified
  under load). If your runs confirm it, the remedy is a proxy upgrade on the
  owner side, not a workaround on yours.
- **Unit supply:** the playbook can deliver conformance-checked units into
  `<repo>/.zcode/skills/` — first candidate is your own non-hanging Bash
  protocol, promoted to a reusable unit so it stops being tribal knowledge.

*Placement note for the Steward: this file is a single addition to
`AGENTS_CONTEXT/`, top level, following the pattern of
`GIT-AND-GITHUB-AGENT-PROTOCOL.md`. It touches no governance file — roster
registration and any disposition decision are yours.*
