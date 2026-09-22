#!/usr/bin/env python3
"""Task 1 acceptance: two concurrent acquires of one capability -> exactly one OK.

Uses the real lock file via bcp_tool.py subprocess (same path the MCP server
uses). Runs against a throwaway BCP_ROOT copy so live state is untouched.
"""
import os
import shutil
import subprocess
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

SRC = Path(__file__).resolve().parents[2]
CAP = "FAM-09.1"


def setup_root():
    root = Path(tempfile.mkdtemp(prefix="bcp-mcp-test-"))
    shutil.copytree(SRC / "state", root / "state")
    (root / "state" / "leases.yaml").write_text("version: 1\nleases: {}\n", encoding="utf-8")
    return root


def acquire(root, agent):
    env = dict(os.environ, BCP_ROOT=str(root))
    p = subprocess.run(
        [sys.executable, str(SRC / "bcp_tool.py"), "lease", "acquire", CAP,
         "--agent", agent, "--experiment", "EXP-2026-006", "--depth-target", "L1"],
        env=env, capture_output=True, text=True,
    )
    return agent, p.returncode, (p.stdout or "") + (p.stderr or "")


def main():
    try:
        from mcp.server.fastmcp import FastMCP  # noqa: F401
        print("MCP SDK import: OK")
    except Exception as e:
        print(f"MCP SDK import FAILED: {e}")
        return 1
    root = setup_root()
    try:
        with ThreadPoolExecutor(max_workers=2) as ex:
            results = list(ex.map(lambda a: acquire(root, a), ["AGT-test1", "AGT-test2"]))
        oks = [r for r in results if r[1] == 0]
        print(f"concurrent acquire: {len(oks)} OK of 2 (expect exactly 1)")
        for agent, rc, out in results:
            print(f"  {agent} rc={rc}: {out.strip().splitlines()[0][:120] if out.strip() else '(empty)'}")
        env = dict(os.environ, BCP_ROOT=str(root))
        v = subprocess.run([sys.executable, str(SRC / "validate.py")],
                           env=env, capture_output=True, text=True)
        print(f"validate after writes: rc={v.returncode} {(v.stdout or '').strip().splitlines()[-1] if (v.stdout or '').strip() else ''}")
        grep = subprocess.run(["rg", "-n", r"yaml|open\s*\(", "mcp-servers/bcp-mcp/server.py"],
                              capture_output=True, text=True, cwd=str(SRC))
        code_hits = [l for l in (grep.stdout or "").splitlines()
                     if not l.strip().startswith("#") and "BCP_ROOT" not in l
                     and "subprocess" not in l and '"""' not in l]
        # Filter to real write calls: yaml import/dump or open-for-write.
        hits = [l for l in code_hits if "safe_dump" in l or "safe_load" in l
                or ("open(" in l and ("\"w\"" in l or "'w'" in l or "w)" in l))]
        print(f"direct-YAML-write grep on state paths: {len(hits)} hit(s) (expect 0)")
        ok = len(oks) == 1 and v.returncode == 0 and len(hits) == 0
        print("ACCEPTANCE: PASS" if ok else "ACCEPTANCE: FAIL")
        return 0 if ok else 1
    finally:
        shutil.rmtree(root, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
