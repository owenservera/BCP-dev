# Task 2 RESULT — Register the MCP server with OpenCode

## Status
PASS — 2026-09-22 (opencode 1.18.4, project config precedence confirmed).

## Summary
Project config `opencode.json` registers the Task-1 server as a local MCP
(`bcp`, stdio `python mcp-servers/bcp-mcp/server.py`, `BCP_ROOT` pinned to the
workspace). Tools gated `bcp_* : false` globally, re-enabled per lane agent
(`lane-a/b1/b2/c`). Prompt law appended byte-identical to all four lane
prompts + `agents/lanes.md`: "Use the `bcp_*` tools for all task/lease/log
operations. Never edit YAML under `state/`, `log/`, `views/` directly."
Standing bootstrap rule kept — this makes it tool-enforced habit.

## Files changed
- `opencode.json` (new: mcp.bcp local + tools gate + 4 lane-agent grants)
- `agents/prompts/lane-a.md`, `lane-b1.md`, `lane-b2.md`, `lane-c.md` (+1 law line each)
- `agents/lanes.md` (+1 law line in Universal rules)

## Commands run
- `rg -n "Use the bcp_ tools" agents/prompts/lane-*.md agents/lanes.md` → 5 hits (4 prompts + lanes)
- `python -c "import json; ..."` → mcp [bcp], tools gate, 4 agents
- `opencode mcp list` (from bcp dir) → `bcp connected / python mcp-servers/bcp-mcp/server.py`
- Live-call probe via server `_read_call(['available','--experiment','EXP-2026-006'])` → `FAM-09.1 L0 Airlock Forge`

## Tests run
- Prompt-law presence: 5/5 byte-present. PASS.
- MCP connection: `bcp connected` in project scope. PASS.
- Live `bcp_available` returns real lane cap (`FAM-09.1`). PASS.
- Hand-edit disallow: law line + bootstrap standing rule both explicit. PASS.

## Known issues
- Global `opencode mcp list` also shows unrelated servers (cip failed, zai
  timeout) — pre-existing user scope, not project scope. Project `bcp` is
  independently connected.
- Per-agent `tools` gating follows REDESIGN s3 verbatim; if a future opencode
  renames the key, MCP registration + prompt law still carry the enforcement.
