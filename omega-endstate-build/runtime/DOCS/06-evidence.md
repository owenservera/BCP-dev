# 06 — Evidence, Verdicts, Receipts

## The failure this prevents

The first real failure in this project was not architectural. A generated artifact
(`omega-baseline/omega-final/build/status.json`) advertised `1418 pass / 0 fail` and a fully
green gate. It was generated `2026-09-21`. A commit on `2026-09-25` introduced a hard `SyntaxError`
in the module that was supposed to be the proving ground, and the artifact kept reading as
current truth for four days — on `main` as well as this branch.

The generalisation: **a recorded artifact is a claim, not evidence.** Unearned green is worse than
a red test, because it removes the pressure to look.

## Verdicts

Every agent ends with exactly one:

| Verdict | Means |
|---|---|
| `CONFIRMED` | I re-derived it myself, on this tree, with the commands shown. |
| `REFUTED` | I tried to break it and it broke. Counter-evidence included. |
| `UNRESOLVED` | I could not determine it. This is a **legitimate, recorded outcome.** |

Rules, all enforced in code:

- `UNRESOLVED` with a reason is success. A swarm that returns three `UNRESOLVED` results and
  three reasons has produced something; a swarm that returns three confident paragraphs and no
  evidence has produced a liability.
- A turn that ends **without** a recorded verdict becomes `UNRESOLVED`. Absence of a verdict is
  never read as success.
- Verdict is recorded only together with evidence. Evidence below a minimum length is rejected
  at the tool boundary.
- Only `CONFIRMED` and `REFUTED` require real evidence. `UNRESOLVED` requires a *reason*, which is
  the same field.

## Evidence quality bar

Per-agent `evidenceBar` text, stored with the agent and reprinted in its receipt. The default:

```
CONFIRMED | REFUTED | UNRESOLVED — a recorded metric is a claim, not evidence.
Distinguish not-run / ran-and-passed / ran-and-failed / cannot-run-here.
```

The four-way distinction is deliberate. Collapsing "not run" into "passed" is how a team ends up
confidently wrong, and it is the specific confusion that produced this project's first real
failure.

The verifier bar adds one more rule that is the entire point of having a verifier:

```
Form your own conclusion before reading the author's argument.
A CONFIRMED you cannot personally re-derive is UNRESOLVED.
```

## Receipts

One markdown file per agent, written to `omega-endstate-build/runs/<runId>/RECEIPT-<agent>.md`:

```markdown
# Receipt — <agent>

run: sw_...
verdict: **UNRESOLVED**

## Workspace
- branch: `work/omega-endstate/base-01/sw_abc123`
- base SHA: `ff8e141a...`
- worktree: `C:\...\base-01-sw_abc123`

## Evidence
```
<the exact commands run and what they showed>
```

## Final message
```
<the agent's last text, captured verbatim>
```
```

Plus `RUN.md`: the swarm, every agent's verdict, the isolation table (branch + base SHA + status
per agent), the full message log, and an explicit statement of the Steward's verification duty.

**`runs/` is gitignored; receipts are the durable evidence and are committed by the Steward**
after review. The DB is disposable transport. A fresh Steward must be able to reconstruct the run
from committed files, which is why the receipt carries the workspace identity and not just the
answer.

## The Steward's duty, stated in every run report

> A verdict above is a subagent's claim. STEW-01 must independently re-verify against the
> repository before treating it as established.

The runtime records claims. It does not launder them. A `CONFIRMED` from a subagent that the
Steward cannot re-derive is, operationally, `UNRESOLVED`.

## Self-evolution

An agent may write `SELF-PROPOSAL.md` into its run directory proposing:

- a tool it kept hand-rolling and should not have;
- scope drift it noticed in its own role;
- a responsibility that should be split, merged, created or retired;
- a change to the roadmap (a Roadmap V1 change trigger fired).

The Steward accepts or rejects **with a recorded reason** in `team/ROSTER-LEDGER.md`. An
organisation that can only grow has stopped learning, so retirement is a first-class outcome and
a proposal to delete a role is as valuable as a proposal to add one.

## Anti-patterns this design refuses

| Anti-pattern | Why it is refused |
|---|---|
| Treating a non-empty agent response as a result | Length is not evidence. |
| "Ran and passed" reported for something not run | The four-way distinction exists for this. |
| A verdict with no commands | `vivim_swarm_receipt` rejects it. |
| Steward accepting its own subagent's `CONFIRMED` unverified | The verifier exists precisely to prevent this. |
| Recording `DONE` because the process exited cleanly | Exit code is not evidence; observed output is. |
| An agent declaring its own work complete | Completion is recorded by the orchestrator from the receipt, not self-asserted. |
