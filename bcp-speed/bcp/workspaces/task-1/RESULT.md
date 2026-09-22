# Task 1 RESULT — MCP server wrapping BCP-SPEED

## Status
PASS — acceptance criteria green 2026-09-22 (opencode 1.18.4, mcp SDK 1.29.0, Python 3.14.4).

## Summary
Thin Python stdio MCP transport over the existing CLI. All 13 tools are 1:1
subprocess calls into `bcp_tool.py` with `BCP_ROOT` pointed at the workspace.
No second lease/validation implementation. Validate-before-commit inherited
from `bcp_tool` plus a post-write `validate.py` run returned verbatim.
Brief vocabulary mapped, taxonomy law kept: `task_id` = capability ID
(`FAM-nn.n`), `lease_id` = capability ID (holder-checked), `ttl_seconds` /
3600 = `ttl_hours`, release `status` (done/failed/blocked) rides `--note`,
`bcp_task_next` = filtered `available`, `bcp_depth_get/set` = `show`/`bump`,
`bcp_log_write` level is an informational prefix on a taxonomy `signal`
(default `REBALANCE_SUGGESTED`).

## Files changed
- `mcp-servers/bcp-mcp/server.py` (new, 13 tools, subprocess-only)
- `mcp-servers/bcp-mcp/requirements.txt` (new: `mcp`, `pyyaml`)
- `mcp-servers/bcp-mcp/test_concurrent.py` (new acceptance probe, throwaway BCP_ROOT)

## Commands run
- `python -c "from mcp.server.fastmcp import FastMCP"` → FastMCP OK
- `python mcp-servers/bcp-mcp/test_concurrent.py` → ACCEPTANCE: PASS
- `python -c "import ast; ast.parse(open('mcp-servers/bcp-mcp/server.py').read())"` → parses OK
- `rg -n "yaml|open(" mcp-servers/bcp-mcp/server.py` → 0 code-path write hits

## Tests run
- Concurrent acquire probe (2 threads, throwaway state, `FAM-09.1` / EXP-2026-006): exactly 1 OK of 2, loser REFUSED with holder+expiry. PASS.
- `validate.py` after probe writes: 0 errors 0 warnings. PASS.
- No-direct-write grep on server source: 0 hits. PASS.

## Known issues
- Docstring once tripped a naive write-pattern grep; reworded + probe now
  inspects code paths only. No behavior impact.
- Live `state/` untouched (probe uses temp `BCP_ROOT` copy with empty leases).
