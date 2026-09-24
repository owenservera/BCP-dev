#!/usr/bin/env python3
"""install.py - one-time setup per clone/worktree (stdlib, idempotent).

Sets core.hooksPath to the ABSOLUTE agent-tools/hooks directory, verifies
the hooks exist (and are executable on POSIX), runs a lint smoke check,
and prints the resulting state. Re-run after moving the checkout, since
the stored path is absolute. Relative hooksPath is refused: git silently
skips hooks when it runs outside the repo root.
"""

import os
import stat
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Forward slashes: backslashes in git-config values risk escape mangling,
# and a hooksPath pointing at a missing dir makes git skip hooks SILENTLY
# (proven in close-out). Absolute so any cwd works; re-run after moving.
HOOKS = os.path.join(ROOT, "agent-tools", "hooks").replace(os.sep, "/")


def run(*args):
    p = subprocess.run(list(args), cwd=ROOT, capture_output=True, text=True,
                       timeout=120)
    return (p.returncode, (p.stdout or "").strip(), (p.stderr or "").strip())


def main():
    for name in ("pre-commit", "commit-msg"):
        p = os.path.join(HOOKS, name)
        if not os.path.isfile(p):
            print("install: MISSING hook %s" % p)
            return 1
        if os.name == "posix" and not os.access(p, os.X_OK):
            os.chmod(p, os.stat(p).st_mode | stat.S_IXUSR | stat.S_IXGRP
                     | stat.S_IXOTH)
    code, _, err = run("git", "config", "core.hooksPath", HOOKS)
    if code != 0:
        print("install: REFUSED - git config failed (%s)" % err)
        return 1
    code, current, _ = run("git", "config", "--get", "core.hooksPath")
    print("install: core.hooksPath = %s" % current)
    if os.path.normcase(current) != os.path.normcase(HOOKS):
        print("install: REFUSED - hooksPath did not stick")
        return 1
    code, out, _ = run(sys.executable,
                       os.path.join(ROOT, "agent-tools", "agent_lint.py"))
    smoke = "GREEN" if code == 0 else "RED"
    print("install: lint smoke %s" % smoke)
    print(out.splitlines()[-1] if out else "(no lint output)")
    if smoke == "GREEN":
        print("install: OK - hooks active. Re-run after moving this checkout.")
    else:
        print("install: setup OK (hooksPath stored), but tree lint is RED - "
              "fix the tree separately; hooks themselves are active.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
