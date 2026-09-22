# DECISIONS — BCP-SPEED orchestration hardening (ORCHESTRATION-REDESIGN wins on conflict)

- 2026-09-22 / Task 1: brief `task_id`/`lease_id` vocabulary does NOT exist in
  BCP. Mapped: capability ID is the task unit, lease key is the capability ID
  (holder-checked). No invented ID schemes — taxonomy law. (ORCHESTRATION-REDESIGN s2)
- 2026-09-22 / Task 1: no second lease/validation implementation. MCP server
  is subprocess-only over `bcp_tool.py` + post-write `validate.py`. Direct
  state writes refused in review. (Constraint, REDESIGN s1)
- 2026-09-22 / full setup: brief says one numbered task per work session.
  Owner overrode with "fully setup the agentic automation" — all six tasks
  executed sequentially in this master session, each with its own workspace
  RESULT.md. Order 1→2→3→4→5→6 kept; 4+1 parallelization not used (sequential
  proof simpler).

- 2026-09-22 / Task 4: serve HTTP drives sessions, never the CLI (session CLI is list/delete only on 1.18.4). prompt_async body is {parts:[{type:text,text}]} (proven by 400 Missing-key-at-parts then 404 Session-not-found). No LLM fired in tests (cost 0). Registry state/sessions.yaml is master-owned, validators intentionally unextended for v1.
- 2026-09-22 / Task 6: session.idle + client.session.prompt + app.log shapes taken verbatim from current opencode docs (verified, not assumed). Plugin never breaks sessions: all failures log-and-silent. Watchdog remains the only dead-process catcher.
