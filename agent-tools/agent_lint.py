#!/usr/bin/env python3
"""agent_lint.py - deterministic lint/gate for the agent mission system.

Stdlib only. Exit 0 = green. Exit 1 = refused, with the exact reason on stdout
(one `REFUSED: ...` line per violation).

Checks:
  1. banners present and valid (Classification: line) on governed markdown
  2. markdown links resolve to repository paths
  3. immutability (git-based) of context/insights/, transcripts/, packets/
  4. CURRENT.md within its line budget (130 lines)
  5. mission STATE.md required fields + sections
  6. STATE branch matches the actual branch (for mission/* branches)
  7. STATE clean-tree claims flagged when the tracked tree is dirty
  8. charter write_allowlist respected (Tier 0 paths always allowed)
  9. impossible status combinations refused

Modes:
  default        : inspect worktree + HEAD (local gate before commit)
  --pre-commit   : inspect staged changes only (called from the git hook)
  --commit-msg F : L1 message rules (called from commit-msg hook with msg file);
                   also takes --staged-list via git directly
  --mission ID   : restrict mission checks to one mission (default: infer from
                   branch mission/<id>, else check all missions)

Bypass: AMP_HOOK_BYPASS=1 skips ONLY the L1 commit-message rules
(STATE-touch/trailer, Decision-trailer) and is logged with NOTICE.
Immutability, banners, links, allowlist, charter-guard, CURRENT budget,
STATE fields, and clean-claim checks are never bypassed. BCP validate.py
in the hook script is unaffected by the bypass.
"""

import fnmatch
import os
import re
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGENT_SYS = os.path.join(REPO, "docs", "agent-system")
MISSIONS = os.path.join(AGENT_SYS, "missions")
CONTEXT = os.path.join(AGENT_SYS, "context")
TRANSCRIPTS = os.path.join(AGENT_SYS, "transcripts")
PACKETS = os.path.join(AGENT_SYS, "packets")
CURRENT = os.path.join(AGENT_SYS, "CURRENT.md")

CURRENT_LINE_BUDGET = 130
STATE_REQUIRED_SECTIONS = [
    "POSITION", "DONE", "IN_PROGRESS", "NEXT_ACTION", "UNCOMMITTED",
    "DECISIONS_IN_FORCE", "OPEN_QUESTIONS", "ESCALATIONS", "DO_NOT", "RESUME",
]
STATE_REQUIRED_FRONT = [
    "mission_id", "agent_id", "branch", "last_commit_inspected", "updated",
    "status",
]
STATE_STATUSES = {"DRAFT", "ACTIVE", "DONE", "BLOCKED", "PAUSED", "ABANDONED"}
IMMUTABLE_DIRS = [
    os.path.join("docs", "agent-system", "context", "insights"),
    os.path.join("docs", "agent-system", "transcripts"),
    os.path.join("docs", "agent-system", "packets"),
]
# Tier 0: always writable on a mission branch (AUTONOMY.md).
TIER0_ALLOW = [
    "docs/agent-system/context/**",
    "docs/agent-system/missions/**",
]
BANNER_RE = re.compile(r"Classification:\s*([A-Za-z\-]+)(?:\s*[—\-]\s*([A-Za-z]+))?")
BANNER_CLASSES = {
    "AUTHORITATIVE", "CURRENT", "DERIVED", "PROPOSED", "HISTORICAL",
    "ARCHIVED", "TRANSCRIPT", "EXTERNAL-ANALYSIS", "UNKNOWN",
}
LINK_RE = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
TRAILER_STATE_UNCHANGED = re.compile(r"^State-Unchanged:\s*(.+)$", re.M)
TRAILER_DECISION = re.compile(r"^Decision:\s*(\S+)", re.M)
CLEAN_CLAIM_RE = re.compile(
    r"(?i)\btree clean\b|\bnothing uncommitted\b|\bclean tree\b")


def fail(reason):
    print("REFUSED: " + reason)
    return False


def git(*args, cwd=None):
    if cwd is None:
        cwd = REPO
    try:
        p = subprocess.run(
            ["git"] + list(args), cwd=cwd, capture_output=True, text=True,
            timeout=60)
    except Exception as e:
        return (1, "", "git error: %s" % e)
    return (p.returncode, p.stdout, p.stderr)


def repo_rel(path):
    return os.path.relpath(os.path.abspath(path), REPO).replace(os.sep, "/")


def read_text(path):
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()


def parse_front_matter(text):
    """Parse the first ```yaml fenced block or leading --- block.

    Returns dict of scalar key->value plus '_raw' full text. Lists in [...]
    are kept as raw strings; '- ' items under a key are joined.
    """
    m = re.search(r"```yaml\s*\n(.*?)```", text, re.S)
    block = m.group(1) if m else None
    if block is None and text.startswith("---"):
        m2 = re.match(r"---\s*\n(.*?)\n---", text, re.S)
        block = m2.group(1) if m2 else None
    out = {}
    if not block:
        return out
    current_key = None
    items = []
    for line in block.splitlines():
        if re.match(r"^\s*-\s+", line) and current_key:
            items.append(re.sub(r"^\s*-\s+", "", line).strip())
            out[current_key] = items
            continue
        fm = re.match(r"^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$", line)
        if fm:
            current_key = fm.group(1)
            items = []
            out[current_key] = fm.group(2).strip()
    return out


def governed_markdown_files():
    """Files that must carry a Classification banner."""
    roots = [MISSIONS, os.path.join(CONTEXT)]
    skip_dirs = {"evidence", "inbox", "ingest-receipts"}
    files = []
    for root in roots:
        if not os.path.isdir(root):
            continue
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames
                           if d not in skip_dirs and not d.startswith(".")]
            if os.path.basename(dirpath) == "_TEMPLATE":
                pass
            for fn in filenames:
                if fn.endswith(".md"):
                    files.append(os.path.join(dirpath, fn))
    for extra in ("AUTONOMY.md",):
        p = os.path.join(AGENT_SYS, extra)
        if os.path.isfile(p):
            files.append(p)
    for extra in ("INGEST.md", "THINKER-PROTOCOL.md"):
        p = os.path.join(CONTEXT, extra)
        if os.path.isfile(p):
            files.append(p)
    return sorted(files)


def check_banners(ok=True):
    for path in governed_markdown_files():
        try:
            text = read_text(path)
        except OSError as e:
            ok = fail("cannot read %s (%s)" % (repo_rel(path), e)) and ok
            continue
        m = BANNER_RE.search(text)
        if not m:
            ok = fail("missing Classification banner in %s"
                      % repo_rel(path)) and ok
        elif m.group(1) not in BANNER_CLASSES:
            ok = fail("invalid banner class '%s' in %s"
                      % (m.group(1), repo_rel(path))) and ok
    return ok


def check_links(ok=True):
    for path in governed_markdown_files():
        try:
            text = read_text(path)
        except OSError:
            continue
        base = os.path.dirname(path)
        for target in LINK_RE.findall(text):
            t = target.strip()
            if (t.startswith("http://") or t.startswith("https://")
                    or t.startswith("mailto:") or t.startswith("#")
                    or t == ""):
                continue
            t = t.split("#")[0]
            candidates = [
                os.path.normpath(os.path.join(base, t)),
                os.path.normpath(os.path.join(REPO, t)),
            ]
            if not any(os.path.exists(c) for c in candidates):
                ok = fail("broken link '%s' in %s"
                          % (target, repo_rel(path))) and ok
    return ok


def changed_paths(staged_only):
    """Return list of (status, repo_rel_path). Status letter: A/M/D/R/T..."""
    if staged_only:
        args = ["diff", "--cached", "--name-status", "-z"]
    else:
        args = ["diff", "--name-status", "-z", "HEAD"]
    code, out, _ = git(*args)
    entries = []
    if code != 0:
        return entries
    parts = out.split("\0")
    i = 0
    while i < len(parts):
        tok = parts[i]
        i += 1
        if not tok:
            continue
        st = tok[0]
        if st == "R":
            # rename with -z: 'R<score>' NUL old NUL new NUL
            old = parts[i] if i < len(parts) else ""
            i += 1
            new = parts[i] if i < len(parts) else ""
            i += 1
            if new:
                entries.append(("R", new.replace(os.sep, "/")))
            if old:
                entries.append(("D", old.replace(os.sep, "/")))
        else:
            path = parts[i] if i < len(parts) else ""
            i += 1
            if path:
                entries.append((st, path.replace(os.sep, "/")))
    if not staged_only:
        code2, out2, _ = git("status", "--porcelain", "-z")
        if code2 == 0:
            for tok in out2.split("\0"):
                if len(tok) > 3 and tok[:2] == "??":
                    p = tok[3:].strip().replace(os.sep, "/")
                    if p and not any(p == e[1] for e in entries):
                        entries.append(("?", p))
    return entries


def is_immutable_path(rel):
    rel = rel.replace("\\", "/")
    return any(rel == d or rel.startswith(d + "/") for d in
               [d.replace(os.sep, "/") for d in IMMUTABLE_DIRS])


def check_immutability(entries, ok=True):
    code, out, _ = git("ls-files")
    tracked = set(out.splitlines()) if code == 0 else set()
    tracked = set(t.replace(os.sep, "/") for t in tracked)
    for st, rel in entries:
        if st in ("M", "D", "R", "T") and is_immutable_path(rel):
            if rel in tracked:
                ok = fail("immutable path modified: %s (insights/transcripts"
                          "/packets are append-only; supersede, never edit)"
                          % rel) and ok
    return ok


def check_current_budget(ok=True):
    if not os.path.isfile(CURRENT):
        return fail("CURRENT.md missing at docs/agent-system/CURRENT.md")
    with open(CURRENT, "r", encoding="utf-8", errors="replace") as f:
        n = sum(1 for _ in f)
    if n > CURRENT_LINE_BUDGET:
        ok = fail("CURRENT.md has %d lines, budget is %d"
                  % (n, CURRENT_LINE_BUDGET)) and ok
    return ok


def mission_dirs(only=None):
    if not os.path.isdir(MISSIONS):
        return []
    out = []
    for name in sorted(os.listdir(MISSIONS)):
        if name.startswith("_") or name.startswith("."):
            continue
        d = os.path.join(MISSIONS, name)
        if os.path.isdir(d):
            if only is None or name == only:
                out.append((name, d))
    return out


def read_state(mdir):
    p = os.path.join(mdir, "STATE.md")
    if not os.path.isfile(p):
        return (None, None)
    text = read_text(p)
    return (text, parse_front_matter(text))


def read_charter(mdir):
    p = os.path.join(mdir, "CHARTER.md")
    if not os.path.isfile(p):
        return (None, None)
    text = read_text(p)
    return (text, parse_front_matter(text))


def section_present(text, name):
    return re.search(r"^##\s+%s\s*$" % re.escape(name), text, re.M) is not None


def section_body(text, name):
    m = re.search(r"^##\s+%s\s*$\n(.*?)(?=^##\s+|\Z)"
                  % re.escape(name), text, re.M | re.S)
    return m.group(1).strip() if m else ""


def check_states(ok=True, only=None, actual_branch=None):
    for name, mdir in mission_dirs(only):
        text, fm = read_state(mdir)
        rel = "docs/agent-system/missions/%s/STATE.md" % name
        if text is None:
            ok = fail("mission %s has no STATE.md" % name) and ok
            continue
        for key in STATE_REQUIRED_FRONT:
            if key not in fm or not str(fm[key]).strip():
                ok = fail("%s missing front-matter field '%s'"
                          % (rel, key)) and ok
        for sec in STATE_REQUIRED_SECTIONS:
            if not section_present(text, sec):
                ok = fail("%s missing section '%s'" % (rel, sec)) and ok
        status = str(fm.get("status", "")).strip()
        if status and status not in STATE_STATUSES:
            ok = fail("%s has invalid status '%s'" % (rel, status)) and ok
        if status == "DONE":
            esc = section_body(text, "ESCALATIONS")
            if esc and esc.lower() not in ("none.", "none", "-", "—", "n/a"):
                ok = fail("%s is DONE with open ESCALATIONS" % rel) and ok
        if actual_branch and fm.get("branch"):
            if (actual_branch.startswith("mission/")
                    and name == actual_branch.split("/", 1)[1]):
                if str(fm["branch"]).strip() != actual_branch:
                    ok = fail("%s claims branch '%s' but actual branch is"
                              " '%s'" % (rel, fm["branch"], actual_branch)
                              ) and ok
    return ok


def check_clean_claims(ok=True, only=None):
    code, out, _ = git("status", "--porcelain")
    dirty_tracked = False
    if code == 0:
        for line in out.splitlines():
            if line and not line.startswith("??"):
                dirty_tracked = True
                break
    if not dirty_tracked:
        return ok
    for name, mdir in mission_dirs(only):
        text, _ = read_state(mdir)
        if text is None:
            continue
        unc = section_body(text, "UNCOMMITTED")
        if CLEAN_CLAIM_RE.search(unc):
            ok = fail("missions/%s STATE claims a clean tree but the "
                      "tracked tree is dirty" % name) and ok
    return ok


def charter_allowlist(mdir):
    _, fm = read_charter(mdir)
    if not fm:
        return ([], [])
    return (as_str_list(fm.get("write_allowlist", "")),
            as_str_list(fm.get("allowlist_ignore", "")))


def as_str_list(raw):
    if isinstance(raw, list):
        return [str(x).strip() for x in raw if str(x).strip()]
    patterns = []
    for line in str(raw).splitlines():
        line = line.strip().lstrip("- ").strip()
        if line:
            patterns.append(line)
    return patterns


def path_allowed(rel, patterns):
    pats = list(TIER0_ALLOW) + list(patterns)
    rel = rel.replace("\\", "/")
    for pat in pats:
        if pat.endswith("/**") and rel.startswith(pat[:-3] + "/"):
            return True
        if fnmatch.fnmatch(rel, pat):
            return True
    return False


def check_allowlist(entries, ok=True, only=None, actual_branch=None):
    mission = only
    if mission is None and actual_branch and actual_branch.startswith(
            "mission/"):
        mission = actual_branch.split("/", 1)[1]
    if mission is None:
        return ok
    mdir = os.path.join(MISSIONS, mission)
    if not os.path.isdir(mdir):
        return ok
    patterns, ignored = charter_allowlist(mdir)
    for st, rel in entries:
        if st == "D":
            continue
        if path_allowed(rel, ignored):
            continue
        if not path_allowed(rel, patterns):
            ok = fail("path outside charter allowlist for %s: %s"
                      % (mission, rel)) and ok
    return ok


def current_branch():
    code, out, _ = git("branch", "--show-current")
    return out.strip() if code == 0 else ""


def check_l1_message(msg, staged, ok=True):
    """commit-msg rules. staged = list of (st, rel) staged paths."""
    branch = current_branch()
    if not branch.startswith("mission/"):
        return ok
    bypass = os.environ.get("AMP_HOOK_BYPASS", "")
    if bypass:
        print("NOTICE: AMP_HOOK_BYPASS=%s; L1 message rules skipped "
              "(all other gates still ran)" % bypass)
        return ok
    mission = branch.split("/", 1)[1]
    state_rel = "docs/agent-system/missions/%s/STATE.md" % mission
    touches_state = any(rel == state_rel for _, rel in staged)
    m_trailer = TRAILER_STATE_UNCHANGED.search(msg)
    if not touches_state and not m_trailer:
        ok = fail("mission-branch commit touches no STATE.md and carries no"
                  " 'State-Unchanged: <reason>' trailer (branch %s)"
                  % branch) and ok
    for m in TRAILER_DECISION.finditer(msg):
        slug = m.group(1)
        insp = os.path.join(CONTEXT, "insights")
        found = False
        if os.path.isdir(insp):
            for fn in os.listdir(insp):
                if slug in fn:
                    cand = os.path.join(insp, fn)
                    # must be newly added in this commit, not pre-existing
                    if any(rel == repo_rel(cand) for _, rel in staged):
                        found = True
        if not found:
            ok = fail("commit carries 'Decision: %s' but adds no matching"
                      " file under context/insights/" % slug) and ok
    return ok


def charter_text(rel_posix, staged):
    """Current charter text: staged blob in hook modes, else worktree."""
    if staged:
        code, out, _ = git("show", ":" + rel_posix)
        if code == 0:
            return out
    p = os.path.join(REPO, rel_posix.replace("/", os.sep))
    try:
        return read_text(p)
    except OSError:
        return ""


def check_charter_guard(ok=True, staged=False):
    """Refuse charter allowlist widening without owner approval.

    If the current charter adds write_allowlist/allowlist_ignore entries
    over HEAD (or is a new file with entries), the current text must carry
    'approved_by: owner'. Dropping an owner approval while entries exist
    is refused too. Narrowing is always allowed. Draft flow: commit a new
    charter with an empty allowlist, add paths when the owner approves.
    """
    for name, mdir in mission_dirs():
        rel = "docs/agent-system/missions/%s/CHARTER.md" % name
        code, base, _ = git("show", "HEAD:" + rel)
        base = base if code == 0 else ""
        cur = charter_text(rel, staged)
        if not cur:
            continue
        base_fm = parse_front_matter(base) if base else {}
        cur_fm = parse_front_matter(cur)
        base_sets = (set(as_str_list(base_fm.get("write_allowlist", ""))),
                     set(as_str_list(base_fm.get("allowlist_ignore", ""))))
        cur_sets = (set(as_str_list(cur_fm.get("write_allowlist", ""))),
                    set(as_str_list(cur_fm.get("allowlist_ignore", ""))))
        added = (cur_sets[0] - base_sets[0]) | (cur_sets[1] - base_sets[1])
        if added and "approved_by: owner" not in cur:
            ok = fail("mission %s charter widens allowlist without owner "
                      "approval (adds: %s)"
                      % (name, sorted(added))) and ok
        if ("approved_by: owner" in base
                and "approved_by: owner" not in cur
                and (cur_sets[0] or cur_sets[1])):
            ok = fail("mission %s charter drops owner approval while "
                      "allowlist entries exist" % name) and ok
    return ok


def check_hooks_path(ok=True):
    code, out, _ = git("config", "--get", "core.hooksPath")

    def canon(p):
        return os.path.normcase(p.replace("/", os.sep))
    v = out.strip()
    expected_abs = canon(os.path.join(REPO, "agent-tools", "hooks"))
    got_abs = canon(v) if os.path.isabs(v.replace("/", os.sep)) \
        else canon(os.path.join(REPO, v)) if v else ""
    if v != "agent-tools/hooks" and got_abs != expected_abs:
        print("WARNING: core.hooksPath is not the agent hooks dir "
              "(hooks inactive); run python agent-tools/install.py")
    return ok


def main(argv):
    staged_only = "--pre-commit" in argv
    msg_file = None
    only = None
    for i, a in enumerate(argv):
        if a == "--commit-msg" and i + 1 < len(argv):
            msg_file = argv[i + 1]
        if a == "--mission" and i + 1 < len(argv):
            only = argv[i + 1]
    ok = True
    branch = current_branch()
    entries = changed_paths(staged_only or msg_file is not None)
    ok = check_banners(ok)
    ok = check_links(ok)
    ok = check_immutability(entries, ok)
    ok = check_current_budget(ok)
    ok = check_states(ok, only, branch)
    ok = check_clean_claims(ok, only)
    # Allowlist enforced on mission branches (or when --mission given).
    if branch.startswith("mission/") or only:
        ok = check_allowlist(entries, ok, only, branch)
    ok = check_charter_guard(ok, staged_only or msg_file is not None)
    if msg_file is not None:
        try:
            with open(msg_file, "r", encoding="utf-8",
                       errors="replace") as f:
                msg = f.read()
        except OSError as e:
            print("REFUSED: cannot read commit message file (%s)" % e)
            return 1
        ok = check_l1_message(msg, entries, ok)
    ok = check_hooks_path(ok)
    if ok:
        print("agent_lint: GREEN")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
