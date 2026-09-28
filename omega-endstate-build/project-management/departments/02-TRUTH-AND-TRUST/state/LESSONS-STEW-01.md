# STEW-01 — Durable Lessons

> Status: ACTIVE
> Purpose: compact cross-session operational memory for the end-state team
> Authority: operational learning only; not Ω law, not architectural authority
> Promotion rule: a lesson belongs here only if it is reusable, behaviour-changing,
> evidence-backed, and not better represented as state or design.

## Operational — opencode mechanics

1. **stdout redirection is not a message bus.** Dispatched `opencode run` output appeared as
   zero bytes for minutes and I concluded the run was silent; it was merely unflushed. Never
   infer progress or failure from a redirected stdout file.

2. **`mode: subagent` cannot be a headless entry point.** `opencode run --agent <subagent>`
   prints `agent "X" is a subagent, not a primary agent. Falling back to default agent` and
   then runs as `default_agent` — in this repo, the *mainline* `architecture-steward`. The work
   completes under the **wrong identity** and looks fine. Verify the resolved agent, and treat
   a fallback as a failure, not a warning.

3. **opencode has no MCP server-push.** Message delivery lands *between turns*. A busy agent
   sees new messages when its turn ends, or mid-turn by polling an inbox. Design the
   coordination model around that boundary rather than fighting it.

4. **Never trust an exit code.** A documented opencode trap returns exit 0 with zero bytes of
   output on an auto-rejected permission. Judge completion by observed output.

5. **`opencode serve` spawns a child that binds the port.** The launcher PID is not the
   listener PID. Record the listener; target that when stopping.

6. **The real introspection surface is HTTP.** Against a running `serve`: `/global/health`,
   `/config` (resolved), `/agent` (all resolved agents, incl. mode/tools/model), `/session`
   (all sessions). Use these instead of guessing config. Note `/doc` is an SSE stream and will
   hang a naive request.

7. **Bounded waits only.** The Steward session must never block on a subagent. Detach the
   work, poll in short increments, set explicit per-task budgets, and kill by recorded PID.

8. **Estimate execution time and set the timeout to it.** Prefer a timeout that is too strict
   (extend iteratively) over one that hangs the session.

## Process safety

9. **Never terminate by process image name.** `Get-Process -Name opencode | Stop-Process -Force`
   killed the owner's interactive sessions and my own session. Always use a specific recorded
   PID. There is no benign blanket kill of a shared CLI.

10. **Prefer `.ps1`/`.bat` for anything that may block.** Moving long-running logic into a
    script and invoking it in one short line keeps the tool call from becoming the hang.

## Evidence discipline

11. **A recorded artifact is a claim, not evidence.** `status.json` advertised 1418 passing
    tests and a green gate; it was generated 2026-09-21 and a breaking commit landed
    2026-09-25. Dates, not presence, decide whether a metric is current.

12. **Distinguish four outcomes, never two:** *not run*, *ran and passed*, *ran and failed*,
    *cannot run here*. Collapsing them is how a team ends up confidently wrong.

13. **The designated proving ground can be broken while documentation says it works.**
    `provider-browser` did not load, on `main` as well as this branch, and its own falsifier
    was red. Verify the thing you are about to build on.

14. **Check whether a break is branch-local before framing it as a redesign.** The duplicate
    binding was an ancestor of `origin/main`; calling it a branch-local architecture problem
    would have been wrong.

15. **Withdraw a hypothesis explicitly when disproved.** A console showed `Ω` as `�`; a byte
    scan found zero `EF BF BD` and a correct U+03A9. It was my own console codepage. Recording
    the withdrawal stops the next agent re-investigating it.

## Design

16. **Delegation prose is not mechanism.** `OWNER-DELEGATION.md` was written for a ChatGPT-webapp
    operating model. It justified *having* a standing delegation; it said nothing about how
    opencode spawns work. Read the actual implementation.

17. **Prefer a proven reference over a fresh invention.** I built a dispatch/poll/serve toolchain
    that was a worse version of an existing opencode plugin, then discovered the plugin while
    still writing it. Check for prior art before building machinery.

18. **Design the runtime from the mechanism, not from the org chart.** Agents-as-sessions with a
    message bus is a different shape from agents-as-config-files, and the shape determines what
    comms are even possible.

## Harness and evidence traps

19. **A green "completed" is not evidence that the agents did anything.** A real 2-agent run
    reported `status: "completed"` while the database held **zero** memory rows and **zero**
    messages: the plugin had never been injected, so the tools the agents were told to use did
    not exist. Nothing errored. Assert on the artifact the task was supposed to produce — rows
    written, files created — never on the orchestrator's own status field.

20. **Taking over a lifecycle the reference owned means inheriting its wiring.** Starting
    `opencode serve` myself and attaching with `--server` silently dropped the
    `OPENCODE_CONFIG_CONTENT` plugin injection that `runSwarm` performs. Bypassing the spawn path
    bypasses the setup that path performs. When replacing a reference's lifecycle, enumerate what
    else that path was doing.

21. **Assert on the observable end-state, not on the kill command's exit code.** `taskkill`
    returned 128 against a server PID and the port kept accepting. Success is "the port is free",
    re-checked with freshly-read listener PIDs, because killing a parent can leave a child holding
    the socket under a PID never targeted.

22. **A detached job needs a completion marker.** Without one, "did that run finish?" is
    unanswerable once the session ends, and the only way to find out is to hunt orphans. Write a
    marker in a `finally`: present means finished and torn down, absent means running or killed.

23. **An un-awaited write before `process.exit()` truncates your durable artifact.** The reference
    `writeReport` calls `Bun.write(...)` without awaiting, and the CLI then calls `process.exit()`;
    the report landed 0 bytes on a completed run. Anything meant to outlive the process must be
    awaited or flushed.
