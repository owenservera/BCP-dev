# U1 OpenCode Experiment Queue

> Order follows dependency strength rather than implementation convenience.

## E-U1-01 — Permission reality

**Maps to:** CP-01

Exercise the actual V1.18.4 lab config with:

- root -> allowed resident;
- root -> denied worker;
- resident -> allowed worker;
- worker -> denied target.

Capture the actual permission result and whether a child session exists.

**Stop condition:** tool-schema inspection alone is being used as evidence.

## E-U1-02 — Fresh resident -> worker

**Maps to:** CP-02

Have a real resident invoke native Task with:

- explicit worker target;
- fresh creation;
- no `task_id`;
- foreground execution.

Capture parent/child relationship and child agent identity.

**Stop condition:** a claimed result is accepted without session evidence.

## E-U1-03 — Plugin denial seam

**Maps to:** CP-03

Change the lab plugin from observation-only behavior to the smallest test gate needed for one forbidden target.

Prove the hook fires and refusal prevents native child creation.

**Stop condition:** plugin becomes a task scheduler rather than a narrow preflight boundary.

## E-U1-04 — Leaf worker audit

**Maps to:** CP-04

From the worker, test:

- native Task;
- any enabled custom tool that could launch an agent;
- shell path for invoking external OpenCode/swarm tooling;
- MCP agent-control surface, if present.

**Stop condition:** worker is called a leaf while another unrestricted creation surface remains reachable.

## E-U1-05 — Resident chooses capacity

**Maps to:** CP-05

Give the resident genuinely separable research work with no instruction to use a fixed worker count.

Record whether it chooses one or two workers and why.

The runtime should only enforce the declared cap.

**Stop condition:** infrastructure dictates the decomposition.

## E-U1-06 — Duplicate logical request

**Maps to:** CP-06

Repeat an equivalent spawn request or interrupt observation around child creation.

Use a stable correlation identifier to distinguish a retry of the same logical attempt from a deliberate new request.

**Stop condition:** two children exist with no unambiguous relationship to one logical request.

## E-U1-07 — Resume trap

**Maps to:** CP-07

Supply a real existing session ID as `task_id` while requesting a different governed target.

Expected outcome: refusal before cross-owned execution.

**Stop condition:** existing session is reused solely because the ID exists.

## E-U1-08 — Evidence survives turn

**Maps to:** CP-08

Complete a worker, stop/restart the observer if practical, then reconstruct the spawn from durable evidence.

**Stop condition:** proof exists only in process memory or model text.

## E-U1-09 — Negative/failure matrix

**Maps to:** CP-09

Exercise:

- permission denied;
- unknown target;
- creation failure;
- child execution failure;
- timeout;
- incomplete/unknown observation.

**Stop condition:** any one is collapsed into `completed`.

## E-U1-10 — Promotion review

**Maps to:** CP-10

Promote only after CP-01 through CP-09 are evidenced in the installed environment.

The result should record:

- OpenCode version;
- launch surface;
- config;
- exact experiment;
- artifacts;
- unresolved deviations.

## Wave sequencing rule

Do not begin U2 implementation because U1 documentation looks complete.

U2 begins only when the capability U1 claims has been demonstrated on the actual target substrate.
