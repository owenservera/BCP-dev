#!/usr/bin/env python3
"""bcp-mcp — thin MCP transport over bcp_tool.py (Task 1).

Every tool is a 1:1 subprocess call into bcp_tool.py with BCP_ROOT pointed
at the workspace. This module performs no direct state writes of its own —
all persistence goes through the shared tool subprocess.

Vocabulary (taxonomy law wins over the brief):
  task_id  = capability ID (FAM-nn.n)
  lease_id = capability ID (holder-checked by bcp_tool)
  ttl_seconds (brief) -> ttl_hours (tool) = seconds / 3600

Validate-before-commit is INHERITED: bcp_tool validates every write or
refuses. The server additionally runs validate.py after each write and
returns its output verbatim on refusal.
"""
import os
import subprocess
import sys
from pathlib import Path

from mcp.server.fastmcp import FastMCP

SERVER_DIR = Path(__file__).resolve().parent
BCP_ROOT = Path(os.environ.get("BCP_ROOT") or SERVER_DIR.parents[1])
TOOL = BCP_ROOT / "bcp_tool.py"
VALIDATE = BCP_ROOT / "validate.py"

mcp = FastMCP("bcp")


def _env():
    return dict(os.environ, BCP_ROOT=str(BCP_ROOT))


def _run_tool(*args):
    p = subprocess.run(
        [sys.executable, str(TOOL), *args],
        env=_env(), capture_output=True, text=True,
    )
    return p.returncode, (p.stdout or "") + (p.stderr or "")


def _run_validate():
    p = subprocess.run(
        [sys.executable, str(VALIDATE)],
        env=_env(), capture_output=True, text=True,
    )
    return p.returncode, (p.stdout or "") + (p.stderr or "")


def _write_call(args):
    rc, out = _run_tool(*args)
    if rc != 0:
        return f"REFUSED (bcp_tool):\n{out.strip()}"
    vrc, vout = _run_validate()
    if vrc != 0 or "error(s)" in vout and "0 error(s)" not in vout:
        return f"OK (tool) BUT VALIDATE REPORTS:\n{out.strip()}\n--- validate ---\n{vout.strip()}"
    return f"OK:\n{out.strip()}\n--- validate ---\n{vout.strip().splitlines()[-1] if vout.strip() else 'validate clean'}"


def _read_call(args):
    rc, out = _run_tool(*args)
    return out.strip()


@mcp.tool()
def bcp_lease_acquire(capability: str, agent: str, experiment: str = "",
                      depth_target: str = "", ttl_hours: float = 8.0,
                      role: str = "scoped_builder") -> str:
    """Acquire a lease on a capability. capability=FAM-nn.n, agent=AGT-x."""
    args = ["lease", "acquire", capability, "--agent", agent, "--role", role,
            "--ttl-hours", str(ttl_hours)]
    if experiment:
        args += ["--experiment", experiment]
    if depth_target:
        args += ["--depth-target", depth_target]
    return _write_call(args)


@mcp.tool()
def bcp_lease_renew(capability: str, agent: str, ttl_hours: float = 8.0,
                    depth_target: str = "") -> str:
    """Renew a lease (also the heartbeat). Extends TTL."""
    args = ["lease", "renew", capability, "--agent", agent,
            "--ttl-hours", str(ttl_hours)]
    if depth_target:
        args += ["--depth-target", depth_target]
    return _write_call(args)


@mcp.tool()
def bcp_lease_release(capability: str, agent: str, note: str = "") -> str:
    """Release a lease. Brief status done/failed/blocked rides --note."""
    args = ["lease", "release", capability, "--agent", agent]
    if note:
        args += ["--note", note]
    return _write_call(args)


@mcp.tool()
def bcp_available(scope: str = "", experiment: str = "", limit: int = 15) -> str:
    """List leasable capabilities in scope. Maps to brief bcp_task_next."""
    args = ["available", "--limit", str(limit)]
    if scope:
        args += ["--scope", scope]
    if experiment:
        args += ["--experiment", experiment]
    return _read_call(args)


@mcp.tool()
def bcp_task_next(agent_id: str, experiment: str = "", scope: str = "") -> str:
    """Brief alias: next eligible task for an agent. Same as bcp_available."""
    args = ["available", "--limit", "5"]
    eff_scope = scope
    if experiment:
        args += ["--experiment", experiment]
    if eff_scope:
        args += ["--scope", eff_scope]
    out = _read_call(args)
    return f"for {agent_id}:\n{out}"


@mcp.tool()
def bcp_show(capability: str) -> str:
    """Show one capability (depth, lease, requires, discoveries)."""
    return _read_call(["show", capability])


@mcp.tool()
def bcp_depth_get(task_id: str) -> str:
    """Brief alias: get depth. task_id = capability ID."""
    return _read_call(["show", task_id])


@mcp.tool()
def bcp_depth_bump(capability: str, depth: str, agent: str, note: str = "") -> str:
    """Bump a capability to a new depth. Holder-only, validated."""
    args = ["depth", "bump", capability, depth, "--agent", agent]
    if note:
        args += ["--note", note]
    return _write_call(args)


@mcp.tool()
def bcp_depth_set(task_id: str, depth: str, agent_id: str, note: str = "") -> str:
    """Brief alias: set depth. task_id = capability ID."""
    args = ["depth", "bump", task_id, depth, "--agent", agent_id]
    if note:
        args += ["--note", note]
    return _write_call(args)


@mcp.tool()
def bcp_log_append(agent: str, signal: str, cap: str = "", detail: str = "",
                   blocked_on: str = "", required_depth: str = "") -> str:
    """Append a log event. signal must be in taxonomy signal_types."""
    args = ["log", "append", "--agent", agent, "--signal", signal]
    if cap:
        args += ["--cap", cap]
    if detail:
        args += ["--detail", detail]
    if blocked_on:
        args += ["--blocked-on", blocked_on]
    if required_depth:
        args += ["--required-depth", required_depth]
    return _write_call(args)


@mcp.tool()
def bcp_log_write(agent_id: str, message: str, level: str = "INFO",
                  signal: str = "REBALANCE_SUGGESTED", cap: str = "") -> str:
    """Brief alias: level is informational only, prefixed to detail.

    signal must be a taxonomy signal (default REBALANCE_SUGGESTED for
    free-text notes). blocked/failed task outcomes should use
    bcp_lease_release with --note instead.
    """
    detail = f"[{level}] {message}"
    args = ["log", "append", "--agent", agent_id, "--signal", signal]
    if cap:
        args += ["--cap", cap]
    args += ["--detail", detail]
    return _write_call(args)


@mcp.tool()
def bcp_discovery_add(agent: str, applies_to: str, text: str) -> str:
    """Record a discovery (institutional memory)."""
    return _write_call(["discovery", "add", "--agent", agent,
                        "--applies-to", applies_to, "--text", text])


@mcp.tool()
def bcp_failure_add(agent: str, applies_to: str, text: str) -> str:
    """Record a failure (dead end others should not repeat)."""
    return _write_call(["failure", "add", "--agent", agent,
                        "--applies-to", applies_to, "--text", text])


if __name__ == "__main__":
    mcp.run()
