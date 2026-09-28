# U1 OpenCode Evidence Matrix

> Version boundary: OpenCode v1.18.4
> Updated: 2026-09-28

| Checkpoint | Mechanism | Evidence source | Required observable proof | Current state | Primary anti-pattern |
|---|---|---|---|---|---|
| CP-01 | `permission.task` target matching | v1.18.4 permission evaluator + Task source | allow intended target; refuse disallowed target; no denied child | LIVE-PROOF-REQUIRED | AP-06 |
| CP-02 | native Task fresh child | v1.18.4 Task + Session | real child, parentID, agent, result, no task_id | LIVE-PROOF-REQUIRED | AP-09 |
| CP-03 | plugin `tool.execute.before` | v1.18.4 plugin/tool path | explicit refusal before native child creation | LIVE-PROOF-REQUIRED | hidden scheduler / advisory gate |
| CP-04 | worker Task denial + alternate-surface closure | agent permissions + execution surface audit | no grandchild and no equivalent external spawn route | LIVE-PROOF-REQUIRED | AP-08 |
| CP-05 | resident task decomposition | native Task + resident behavior | resident independently chooses one/two bounded workers | LIVE-PROOF-REQUIRED | AP-12 |
| CP-06 | correlation/idempotency | lab design + durable receipt | repeated logical request cannot create ambiguous lineage | LIVE-PROOF-REQUIRED | AP-21 |
| CP-07 | `task_id` resume | native Task reuse path | unrelated session reuse rejected | LIVE-PROOF-REQUIRED | AP-11 |
| CP-08 | session/evidence persistence | Session model + lab artifacts | receipt survives completion/observer restart | LIVE-PROOF-REQUIRED | AP-20 |
| CP-09 | controlled failures | Task/permission/session semantics | refusal, creation failure, failure, timeout, unknown stay distinct | LIVE-PROOF-REQUIRED | AP-19 |
| CP-10 | U1 promotion | all above | CP-01..09 all satisfied | BLOCKED BY PROOF | AP-35 |

## Version-sensitive claims

The following must be rechecked after relevant OpenCode upgrades:

- Task permission evaluation;
- Task fresh/resume behavior;
- child permission derivation;
- plugin hook ordering;
- session parent/agent/directory fields;
- background semantics;
- command-created subagents.

## Evidence rule

"Task returned text" is not sufficient.

At minimum the U1 proof should be able to reconstruct:

`spawn_id + parent_session_id + child_session_id + child_agent_id + lifecycle + evidence reference`

The OpenCode session tree is one evidence source.

It is not the complete Ω Work graph.
