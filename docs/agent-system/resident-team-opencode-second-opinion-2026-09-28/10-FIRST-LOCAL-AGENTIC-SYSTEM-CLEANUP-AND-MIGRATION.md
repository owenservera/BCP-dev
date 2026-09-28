# First Local Agentic System — Cleanup, Reconciliation and Migration Plan

**Date:** 2026-09-28  
**Status:** PROPOSED PRE-ACTIVATION WORK  
**Scope:** First/local agentic implementation already present in BCP-dev and transition to the resident ten-CFA runtime.

## 1. Purpose

Before activating a resident runtime, perform a truth-preserving cleanup and reconciliation pass. The goal is one unambiguous active operating path while preserving historical evidence, proven findings, receipts, falsifiers, superseded designs, and reusable implementation pieces.

Use: **PRESERVE → CLASSIFY → RECONCILE → RETIRE → VERIFY**.

Never delete historical material merely because it is old.

## 2. Classification

Every candidate artifact or runtime object should be classified as:

- ACTIVE
- REQUIRED SUPPORTING ARTIFACT
- HISTORICAL / LINEAGE
- SUPERSEDED
- REDUNDANT
- DANGEROUS IF EXECUTED
- NEEDS AUDIT
- UNKNOWN

UNKNOWN is not permission to remove it.

## 3. Preserve evidence

Do not clean away architecture findings, probe findings, failure evidence, receipts, falsifiers, owner decisions, ratification records, historical baselines, migration/archaeology records, or evidence explaining current invariants.

If an old receipt contains assumptions that are no longer current, preserve it and add a reconciliation note rather than rewriting history.

## 4. Inventory the first local runtime

On the actual target Windows machine, capture:

- exact OpenCode version;
- `.opencode/opencode.json`;
- `.opencode/agents/*`;
- all OpenCode commands used for agent launch/control;
- local scripts that launch or supervise agents;
- environment variables relevant to OpenCode, Commons and runtime supervision;
- local OpenCode sessions and session state;
- running OpenCode servers/services and listeners/ports;
- scheduled/background launchers;
- Git worktrees and branches associated with agent sessions;
- Commons identity/key material locations;
- relevant logs and runtime traces.

The inventory is itself evidence.

## 5. Agent-pack reconciliation

Audit the current Steward binding, ten CFA bindings and worker bindings against `PEER-ROSTER.md`, the CFA register, `OWNER-DELEGATION.md`, the worker catalog, and the installed OpenCode configuration schema.

For each binding verify:

- exact stable `agent_id`;
- intended CFA home;
- no obsolete identity naming;
- no retired agent remains executable;
- no worker can spawn;
- no CFA unexpectedly has CFA-spawn capability under the resident model;
- no stale permission broadening;
- explicit agent selection cannot silently resolve to another principal.

## 6. The silent-fallback issue is a hard cleanup item

The repository's 2026-09-28 probe records silent `--agent` fallback on OpenCode 1.18.4, including fallback to the most-privileged local agent.

This is not merely stale configuration. It is a safety boundary defect.

Before resident activation, exact-agent resolution must be proven or the team runtime must block the affected path.

Do not operate ten resident agents while an explicit request can silently become a different, more privileged principal.

## 7. Spawn-model migration

The current `OWNER-DELEGATION.md` explicitly uses a spawn-on-demand CFA model: a CFA sends a Commons REQUEST/HANDOFF and the Steward turns that into a spawned CFA session.

The resident target requires a documented migration:

**Old:** CFA needs peer → Steward spawns peer.

**Target:** CFA needs resident peer → direct Commons REQUEST/HANDOFF to that already-resident peer.

Steward intervention remains appropriate for authority escalation, boundary reconciliation, sequencing, resource arbitration, cross-domain conflict, owner decisions and recovery.

Do not leave both models looking equally active.

## 8. Steward must not be replaced by the new supervisor

Steward owns architecture coordination, owner-goal synthesis, cross-CFA reconciliation and architectural escalation.

Team Runtime Supervisor owns lifecycle infrastructure: server lifecycle, session lifecycle, stable-agent/session mapping, delivery, observation, queueing, recovery and runtime evidence.

Commons owns communication.

Repository owns durable state.

The supervisor must not become a second Steward by accumulating task, authority or semantic decision responsibilities.

## 9. Retire duplicate control paths

Search for every prior mechanism that can independently launch agents, route peer requests, track sessions, maintain an active-agent registry, declare completion, create task state, or supervise the team.

For each one, mark it ACTIVE, REQUIRED SUPPORTING, HISTORICAL, SUPERSEDED, REDUNDANT, or DANGEROUS IF EXECUTED.

Eventually there must be one documented active path for each operational responsibility.

Historical implementations may remain in the repo when their lineage value is high, but they must not look like co-equal live systems.

## 10. Existing documents requiring audit

At minimum audit:

- `docs/agent-system/AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27*.md`;
- `docs/agent-system/REMAINING-SETUP-WORK-2026-09-27.md`;
- `docs/agent-system/FULL-INTEGRATION-TASK-LIST.md`;
- `docs/agent-system/FULL-SYSTEM-TEST-GAPS-AND-PREP-2026-09-28.md`;
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OWNER-DELEGATION.md`;
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/TASKS.md`;
- `.opencode/opencode.json`;
- `.opencode/agents/*`;
- `AGENTS_CONTEXT/AGENT-COMMONS/*`;
- prior local runtime probe findings;
- historical Cycle 4, harness, sandbox and execution packets.

## 11. Cleanup of sessions and processes

Before the resident runtime starts, identify all agent-related OpenCode sessions, processes, servers and services.

For every session:

- identify owning stable agent if possible;
- identify purpose;
- classify active/inactive/orphaned;
- preserve useful history;
- terminate/archive only after evidence is preserved.

For every process/server:

- identify owner;
- identify listener/port;
- identify launch source;
- determine whether it belongs to the new active runtime or an older attempt.

Do not start a new server while an unknown prior server is still listening.

## 12. Git/worktree cleanup

Identify:

- active agent worktrees;
- stale branches;
- unfinished work;
- completed commits lacking receipts;
- duplicate implementation branches;
- historical branches that must be retained.

Do not mass-delete branches. Retire them only after their result is represented durably or their historical purpose is explicitly preserved.

## 13. Task and receipt reconciliation

The first implementation accumulated several generations of task and receipt artifacts.

Before resident activation establish:

- one current task authority;
- one current receipt contract;
- explicit classification of legacy task/receipt documents;
- no active work hidden only in historical docs;
- no duplicate CURRENT status across incompatible trackers.

Legacy receipts stay available as evidence.

## 14. Commons reconciliation

Do not create a second Commons.

Audit the existing Commons runtime for resident-model assumptions, stale identity state, stale cursor state, peer-spawn assumptions, delivery duplication, dead-letter behavior, stream ownership, validation gaps, fold/replay behavior, and transport error visibility.

The resident runtime should consume Commons, not replace it.

## 15. Permission/capability cleanup

Produce a machine-readable capability inventory for Steward, each CFA, leaves, and the Team Runtime Supervisor.

Specifically audit:

- generic shell/batch execution;
- generic edit capability;
- task spawning;
- server lifecycle control;
- cross-home writes;
- unrestricted repository writes;
- GitHub credentials;
- Commons signing keys.

A capability present in configuration is a real capability until proven otherwise. Prompt text is not a technical permission boundary.

## 16. Stale dangerous instructions

Flag stale instructions that could cause:

- automatic peer spawning;
- mandatory Steward relay;
- alternate task creation;
- silent agent fallback;
- automatic production writes;
- automatic boundary activation;
- Ω-law modifications;
- force pushes;
- peer-home editing;
- unbounded peer wake loops.

Where the old behavior is no longer desired, retire or mechanically block it.

## 17. Historical launch prompts

Keep valuable launch prompts for lineage.

Every historical executable-looking prompt should clearly identify:

- whether it is executable today;
- target stable agent identity;
- assumed OpenCode version;
- topology assumptions;
- replacement document.

Historical prompts that could accidentally be pasted into a live session should carry an explicit HISTORICAL / SUPERSEDED warning.

## 18. Runtime-service cleanup

Before enabling an always-on background service, determine:

- old `opencode serve` processes;
- old `opencode service` instances;
- listeners and ports;
- stale supervisor processes;
- scheduled tasks;
- stale lock/state files;
- log locations.

The initial proof should begin from a controlled local runtime state.

## 19. One authoritative startup path

After cleanup, the active system should have one documented startup sequence, for example:

```text
team-runtime start
  |
  +-- verify repository
  +-- verify OpenCode version
  +-- start/attach OpenCode server
  +-- establish event monitor
  +-- bind Steward
  +-- bind CFA-01 ... CFA-10
  +-- verify identity
  +-- initialize Commons cursors
  +-- mark TEAM_READY
```

Historical launch mechanisms may remain as lineage but should not be presented as equivalent active paths.

## 20. Cleanup acceptance criteria

Cleanup is complete only when:

1. every active agent binding has one unambiguous identity;
2. every retired binding is explicitly classified;
3. peer-CFA communication is no longer dependent on accidental spawn behavior;
4. duplicate task stores have been identified and reconciled;
5. duplicate completion stores have been identified and reconciled;
6. stale session/runtime state has been classified;
7. dangerous obsolete instructions are retired or clearly historical;
8. exact local OpenCode version/schema has been recorded;
9. old evidence and receipts remain recoverable;
10. the resident runtime has one documented startup path;
11. no hidden old agent/supervisor process remains active;
12. repository/worktree state is clean enough for R0 proof.

## 21. Cleanup sequence

```text
C0  Freeze current local runtime
C1  Inventory agents/config/scripts/sessions/processes
C2  Inventory task/receipt/state sources
C3  Classify active vs historical vs superseded
C4  Audit OpenCode bindings and permissions
C5  Retire stale execution paths
C6  Reconcile Commons assumptions
C7  Reconcile Steward delegation model
C8  Verify Git/worktree/session cleanliness
C9  Record machine-readable cleanup receipt
C10 Start resident-runtime R0 from the clean state
```

## 22. Boundary

Cleanup is not permission to redesign architecture opportunistically.

If the audit discovers a semantic question, return to DELIBERATE reasoning.
If it discovers a runtime safety defect, fix it or block the affected path.
If it discovers obsolete documentation, retire it without rewriting the domain.

## 23. End state

The first local agentic system should become:

> **history and evidence + selected reusable machinery + explicitly retired obsolete paths**

rather than a second live agent system running beside the resident runtime.

Target:

```text
ONE ACTIVE AGENTIC RUNTIME
        |
        +-- Steward
        +-- CFA-01 ... CFA-10
        +-- bounded leaves
        +-- Commons
        +-- durable repository
```