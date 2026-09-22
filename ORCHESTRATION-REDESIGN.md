# BCP-SPEED Orchestration Redesign — setup plan (researched 2026-09-22, opencode 1.18.4)
# Status: DESIGN. Nothing below is built yet. Hand tasks to builders in order.
# Source brief: user's 6-task hardening brief. This doc keeps its goal
# (no-idle lanes, supervised master, external watchdog) and redesigns the
# mechanics to fit what actually exists. Where they conflict, this doc wins.

## 0. Gap map — what the brief gets wrong (with evidence)

| # | Brief claims | Reality (verified) | Consequence |
|---|---|---|---|
| 1 | Agents edit YAML directly; no atomicity, no heartbeat | FALSE. `bcp_tool.py` is the only write path: atomic locked read-modify-write, validates against taxonomy + deps, refuses invalid transitions, writes the log event in the same step. Heartbeat = `lease renew` (~hourly); sweep frees stalled (2h) / expired (8h TTL). | Task 1 shrinks from "fix integrity" to "add an MCP transport over the existing CLI". No lease logic is reimplemented, ever. |
| 2 | No watchdog | FALSE. `sweep.py --fix --views` + scheduled timers (BCP-Maintain 5m, BCP-Commit 1h, BCP-Watchdog 15m, all in Task Scheduler, all proven live) + git pre-commit validate gate. | Task 5 shrinks to "add session restart via serve API". Polling + lease-timestamp liveness already exist. |
| 3 | Confirm `opencode serve` syntax (flags differ) | CONFIRMED present: `opencode serve [--port] [--hostname] [--cors]`, headless HTTP + OpenAPI at `/doc`, basic auth via `OPENCODE_SERVER_PASSWORD`/`OPENCODE_SERVER_USERNAME`. BUT the CLI has no send-message/kill: `opencode session` only lists/deletes. | Task 4 drives the **HTTP API**, not the CLI: `POST /session` (create, body `{title}`), `POST /session/:id/prompt_async` (message, 204), `POST /session/:id/abort`, `DELETE /session/:id`, `GET /session/status`, SSE `GET /event`. CLI-only control is impossible — do not build against it. |
| 4 | Master supervision paradox unsolved | SOLVED BY CONSTRUCTION: the watchdog is a Windows scheduled task (OS-supervised, needs no LLM, needs no session). Master liveness = fresh log activity (any signal), NOT a lease (coordinators never hold build leases — role law). The master is just another watched process; the watchdog answers to the OS scheduler, not to itself. | No infinite regress. The buck stops at Task Scheduler. |
| 5 | "Ralph loop — verify hook API" | CONFIRMED available: project plugins (`.opencode/plugins/`, JS/TS, Bun runtime) with a `session.idle` event + SDK `client` + `$` shell. | Task 6 builds a `session.idle` plugin that shells out to `bcp_tool.py`: lease still active + work unfinished → re-prompt continuation; else stay quiet. The watchdog (dead processes) stays the only dead-process catcher, as the brief says. |

## 1. Standing constraints (from the brief, kept)
- Do not modify VIVIM-Omega code or its repo. BCP-SPEED's YAML-first state (`state/`, `log/`, `views/`) stays the source of truth; everything below wraps it.
- Reuse `bcp_tool.py` / `bcp_lib.py` / `validate.py` by import or subprocess. Second implementations of lease/validation logic are refused in review.
- One numbered task per work session. Every task ends with `RESULT.md` in its workspace (Status / Summary / Files changed / Commands run / Tests run / Known issues) + `DECISIONS.md` entry on convention change + one-line status to `STATE.json`.

## 2. Task 1 (rescoped) — thin MCP transport over bcp_tool
Build `bcp-speed/bcp/mcp-servers/bcp-mcp/` — a Python stdio MCP server (needs `mcp` pip package; stdlib everything else). Each tool is a 1:1 subprocess call into `bcp_tool.py` with `BCP_ROOT` pointed at the workspace (no direct YAML writes anywhere in the server):
- `bcp_lease_acquire(capability, agent, experiment?, depth_target?, ttl_hours?)`, `bcp_lease_renew`, `bcp_lease_release`, `bcp_available(scope?, experiment?)`, `bcp_show(capability)`, `bcp_depth_bump(capability, depth, note)`, `bcp_log_append(agent, signal, cap?, detail?)`, `bcp_discovery_add`, `bcp_failure_add`.
- The brief's `task_id`/`lease_id` vocabulary does NOT exist in BCP — capabilities (`FAM-nn.n`) are the task unit, leases are `(capability → holder)` rows, there are no lease IDs. Map: `task_id` = capability ID; `lease_id` = capability ID (holder-checked). Do not invent ID schemes — taxonomy law.
- Validate-before-commit is INHERITED (bcp_tool validates every write or refuses). The server additionally runs `validate.py` after each write and returns its output verbatim on refusal. Double-gated, single implementation.
- Acceptance (kept from brief, translated): two concurrent acquires of one capability → exactly one OK (lock file already proves this — test it, don't rebuild it); `validate.py` green after every write; grep-proven: zero `yaml.safe_dump`/`open(*w*)` on state paths in the server source.

## 3. Task 2 (confirmed mechanism) — register + scope + prompt law
- Project config `bcp-speed/bcp/opencode.json` (new file; project config coexists with the user's global config per precedence): `mcp: { bcp: { type: local, command: ["python", "mcp-servers/bcp-mcp/server.py"], cwd: <bcp dir>, enabled: true } }` + `tools: { "bcp_*": false }` globally, re-enabled per lane-agent: `agent: { "lane-a": { tools: { "bcp_*": true } } }` (per-agent gating per MCP docs; tool names arrive prefixed `bcp_`).
- Lane prompts (already exist: `agents/prompts/lane-*.md`, `agents/lanes.md`) gain exactly one law line: "Use the `bcp_*` tools for all task/lease/log operations. Never edit YAML under `state/`, `log/`, `views/` directly." (Already the standing rule via bootstrap.md — this makes it tool-enforced habit.)
- Acceptance: a live lane session calls `bcp_available` and gets its real lane caps; the prompt law is byte-present in all four lane prompts + lanes.md.

## 4. Task 3 (already true — one-line ratification, not a build)
Heartbeat already IS lease renewal (hourly renew, 2h stall, 8h TTL, sweep frees). The only delta the brief actually needs: the lane prompts' heartbeat line reads "call `bcp_lease_renew` after every discrete unit of work". Append that clause to the four lane prompts + lanes.md. No code. Acceptance: watchdog (Task 5) reads liveness SOLELY from lease timestamps — assert by code search that no other liveness signal is consulted.

## 5. Task 4 (corrected) — serve + HTTP control plane + session registry
- `opencode serve --port 4096 --hostname 127.0.0.1` (fixed port, basic auth env per Server docs) as a scheduled task (BCP-Serve) or supervised process. Serve the BCP workspace dir so project config (Task 2's MCP) loads.
- Master drives HTTP (from Task-1-style Python, no new framework): create (`POST /session`, `title` = agent ID e.g. `AGT-a1`), message (`POST /session/:id/prompt_async`), list/status (`GET /session/status`), abort (`POST /session/:id/abort`), destroy (`DELETE /session/:id`), watch (`GET /event` SSE).
- NEW file `state/sessions.yaml` (proposed shape: `{agent_id: {session_id, serve_url, updated_at}}`) maintained by the master on create/destroy. `validate.py`/`sweep.py` ignore unknown state files (they read a fixed FILES map) — confirm by test, do not extend the validators for v1.
- Do NOT build CLI control: `opencode session` cannot message or kill (list/delete only) — verified 1.18.4. Any task proposing CLI control fails review.
- Acceptance: master lists sessions, messages one, aborts + deletes + recreates it, all over HTTP with zero window handling; kill the serve process and the watchdog (Task 5) + timers keep state safe (leases expire, sweep frees).

## 6. Task 5 (narrowed) — watchdog gains session restart, nothing else
- Keep the existing BCP-Watchdog timer (validate gate + transition alerts) untouched.
- New `ops-supervise.ps1` (second timer, 2 min): for each ACTIVE lease past 2x expected-cycle without renew, and for master inactivity (no log signal from AGT-coord/master IDs within N): (a) `bcp_lease_release` the stale lease as failed (tool path, validated), (b) requeue per existing failure policy (failure entry, applies_to the cap), (c) resolve agent→session via `state/sessions.yaml`, abort + delete + recreate via serve API, re-issue the lane's inbox pointer as the first message.
- Master-is-watched rule: the master's own session ID is registered in `sessions.yaml` under its agent ID like any worker; staleness uses the same timestamp math. No exemptions, no self-supervision.
- Acceptance (kept): kill a worker process → detected + restarted + task requeued without loss or duplication within the cycle budget; kill the master → restarted, resumes from state (leases + inbox + discoveries — the `RESUME.md` the brief asks for IS this state, no new file).

## 7. Task 6 (confirmed) — session.idle ralph plugin (only after 1–5 stable)
- `bcp-speed/bcp/.opencode/plugins/bcp-ralph.{js,ts}`: on `session.idle`, shell to `python bcp_tool.py show <lane cap>` (lane pinned per session via env `BCP_LANE_CAP`); if a lease is held by this session's agent and depth < target → re-prompt continuation through the client; else stay silent. Never re-prompts a released/merged lane. Uses the SDK `client` + `$` shell per Plugins docs; no new protocol invented.
- Acceptance: a session that stops mid-lease resumes on idle without any human message; a session with nothing leasable stays silent (idle storm = failure).

## 8. Build order + what NOT to do
Order: 1 → 2 → 3 (one-liner) → 4 (serve + registry) → 5 (restart timer) → 6 (plugin, gated on 1–5 stable). 3 may ride any session. 4 and 1 are independent — may parallelize.
Do NOT: invent IDs/signals/statuses outside taxonomy.yaml (validate fails the tree); hand-edit state (tool or MCP only — the pre-commit hook now refuses corrupt commits); port Omega code; promise CLI session control; add a second heartbeat, lease, or validation implementation; run two writers of `sessions.yaml` (master owns it, watchdog reads it).
