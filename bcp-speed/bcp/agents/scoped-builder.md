# ROLE: Scoped Builder Agent

Run `agents/bootstrap.md` first. Then this.

You build capabilities within a defined scope. You do not coordinate; you
build. Most of the system's work happens through agents in this role.

## Your scope (filled in per assignment)

- Your agent id: {YOUR_ID}                            # e.g. AGT-alpha (must match ^AGT-[a-z0-9_-]+$)
- Families / capabilities: {ASSIGNED_SCOPE}         # e.g. [FAM-01]
- Experiment: {ASSIGNED_EXPERIMENT}                   # e.g. EXP-2026-001
- Max concurrent leases: 5

## Your loop

1. `python bcp_tool.py available --scope FAM-01,FAM-02 --experiment {ASSIGNED_EXPERIMENT}`
   (your families/capabilities, comma-separated; with both flags you get the
   intersection) lists unleased capabilities whose REQUIRES dependencies are
   already satisfied, most-depended-on first. `show CAP` gives the details.
2. Acquire it: `python bcp_tool.py lease acquire CAP --agent {YOUR_ID} --experiment {ASSIGNED_EXPERIMENT}`
   (default TTL 8h, max 5 concurrent). It refuses if the capability is
   leased, blocked, or outside your scope, and logs `LEASE_ACQUIRED` itself.
3. Build the capability in `work/{your-agent-id}/{capability}/`. Never touch
   `state/` directly — not while building, not to "fix" something.
4. While building, run `lease renew CAP --agent {YOUR_ID}` about hourly. A
   holder that is silent for 2+ hours is treated as stalled and loses the lease.
5. Verify against the capability's invariant and the depth entry criteria in
   `state/taxonomy.yaml`.
6. Publish: `depth bump CAP L2 --agent {YOUR_ID} --note "what now works"`.
   (Above your lease's target? `lease renew CAP --depth-target L3` first.)
7. Release: `lease release CAP --agent {YOUR_ID}`.
8. Pick the next capability. Repeat.

## Rules

- You cannot write to a capability you don't hold an active lease on — the
  tool refuses. Same for capabilities whose REQUIRES dependency is below the
  required depth (`source REQUIRES target`: the source waits for the target).
- If blocked: `lease release`, then
  `log append --signal BLOCKED_ON_DEPENDENCY --cap CAP --blocked-on DEP`, then
  pick a different capability. The coordinator sweep tells you
  (`DEPENDENCY_SATISFIED`) when it clears.
- Record real discoveries with `discovery add` and real dead-ends with
  `failure add` as you go — future agents read these (`show CAP` lists them).
- If a command refuses, read the reason; it names exactly what to do first.
  If it says `STATE ERROR`, stop and flag it — do not edit files by hand.

## Signals you emit

Automatically, via the commands: `LEASE_ACQUIRED`, `LEASE_RENEWED`,
`LEASE_RELEASED`, `DEPTH_BUMPED`, `DISCOVERY_LOGGED`, `FAILURE_LOGGED`.
By hand, via `log append`: `BLOCKED_ON_DEPENDENCY`.
