#!/usr/bin/env python3
"""agent_wip.py - snapshot uncommitted work without touching branch/index/worktree.

Stdlib only. Uses a temporary GIT_INDEX_FILE plus plumbing (read-tree,
write-tree, commit-tree, update-ref) so the mission branch, the real index,
and the worktree are never modified.

  python agent_wip.py snapshot <mission>   snapshot; prints the wip ref
  python agent_wip.py list <mission>       list wip refs (newest last)
  python agent_wip.py prune <mission>      keep last 20 refs, delete older

Refs live at refs/wip/<mission>/<UTC-timestamp>. Record the latest ref in the
mission STATE UNCOMMITTED section.
"""

import os
import subprocess
import sys
import tempfile
import time

import agent_lint as lint

REPO = lint.REPO
KEEP = 20


def run_git(env, *args):
    e = dict(os.environ)
    e.update(env)
    p = subprocess.run(["git"] + list(args), cwd=REPO, capture_output=True,
                       text=True, env=e, timeout=120)
    return (p.returncode, p.stdout.strip(), p.stderr.strip())


def snapshot(mission):
    fd, tmp_index = tempfile.mkstemp(prefix="amp-wip-index-")
    os.close(fd)
    env = {"GIT_INDEX_FILE": tmp_index}
    try:
        code, head, _ = run_git({}, "rev-parse", "HEAD")
        parent = head if code == 0 else None
        if parent:
            code, _, err = run_git(env, "read-tree", "HEAD")
            if code != 0:
                print("REFUSED: wip read-tree failed (%s)" % err)
                return 1
        else:
            code, empty, _ = run_git({}, "hash-object", "-t", "tree",
                                     "/dev/null")
            if code == 0:
                run_git(env, "read-tree", empty)
        # Stage everything (tracked + untracked) into the TEMP index only.
        code, _, err = run_git(env, "add", "-A")
        if code != 0:
            print("REFUSED: wip stage failed (%s)" % err)
            return 1
        code, tree, err = run_git(env, "write-tree")
        if code != 0:
            print("REFUSED: wip write-tree failed (%s)" % err)
            return 1
        ts = time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())
        branch = lint.current_branch()
        msg = "wip %s %s (branch %s)" % (mission, ts, branch)
        args = ["commit-tree", tree, "-m", msg]
        if parent:
            args += ["-p", parent]
        code, commit, err = run_git({}, *args)
        if code != 0:
            print("REFUSED: wip commit-tree failed (%s)" % err)
            return 1
        ref = "refs/wip/%s/%s" % (mission, ts)
        code, _, err = run_git({}, "update-ref", ref, commit)
        if code != 0:
            print("REFUSED: wip update-ref failed (%s)" % err)
            return 1
        print(ref)
        return 0
    finally:
        try:
            os.remove(tmp_index)
        except OSError:
            pass


def list_refs(mission):
    code, out, _ = run_git({}, "for-each-ref",
                           "refs/wip/%s/" % mission,
                           "--format=%(refname)")
    if code != 0 or not out.strip():
        print("(no wip refs for %s)" % mission)
        return 0
    for line in sorted(out.splitlines()):
        print(line)
    return 0


def prune(mission):
    code, out, _ = run_git({}, "for-each-ref",
                           "refs/wip/%s/" % mission,
                           "--format=%(refname)")
    if code != 0 or not out.strip():
        print("prune: nothing for %s" % mission)
        return 0
    refs = sorted(out.splitlines())
    doomed = refs[:-KEEP] if len(refs) > KEEP else []
    for r in doomed:
        run_git({}, "update-ref", "-d", r)
    print("prune: kept %d, deleted %d for %s"
          % (len(refs) - len(doomed), len(doomed), mission))
    return 0


def main(argv):
    if len(argv) < 2:
        print("usage: agent_wip.py snapshot|list|prune <mission>")
        return 2
    cmd, mission = argv[0], argv[1]
    if not re_match_mission(mission):
        print("REFUSED: bad mission id '%s'" % mission)
        return 1
    if cmd == "snapshot":
        rc = snapshot(mission)
        if rc == 0:
            prune(mission)
        return rc
    if cmd == "list":
        return list_refs(mission)
    if cmd == "prune":
        return prune(mission)
    print("unknown subcommand '%s'" % cmd)
    return 2


def re_match_mission(mission):
    import re
    return re.match(r"^[A-Za-z0-9][A-Za-z0-9\-]*$", mission) is not None


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
