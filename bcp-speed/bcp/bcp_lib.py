#!/usr/bin/env python3
"""bcp_lib — shared plumbing for bcp_tool.py, validate.py, sweep.py and
generate_views.py.

Everything that reads or writes state/ and log/ goes through here so that:

  * writes are atomic (temp file + os.replace) — a crash never leaves a
    half-written YAML file;
  * concurrent commands are serialized by a lock file — two agents running
    the CLI at the same moment cannot lose each other's update;
  * every load detects duplicate YAML keys (PyYAML silently keeps the last
    one, which is exactly how two hand-appended leases on the same
    capability would vanish without an error);
  * hand-curated files keep their comments and formatting — depth bumps are
    surgical one-line edits, verified by re-parsing before anything is saved.

Set BCP_ROOT to point at a different workspace (used by the tests) and
BCP_NOW to freeze the clock.
"""
import contextlib
import copy
import datetime as dt
import os
import re
import time
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    raise SystemExit("Missing dependency. Run: pip install pyyaml")

ROOT = Path(os.environ.get("BCP_ROOT") or Path(__file__).resolve().parent)
STATE = ROOT / "state"
LOG = ROOT / "log"
LOCK = ROOT / ".bcp.lock"

UTC = dt.timezone.utc
DEFAULT_TTL_HOURS = 8
DEFAULT_STALL_HOURS = 2
MAX_LEASES = {"scoped_builder": 5, "fullscope_builder": 3}
BUILDER_ROLES = tuple(MAX_LEASES)
# Signals that always accompany a state change. They are only ever emitted by
# the command that makes the change, so state and log cannot drift apart.
COMMAND_OWNED_SIGNALS = {
    "LEASE_ACQUIRED", "LEASE_RELEASED", "LEASE_RENEWED", "DEPTH_BUMPED",
    "DISCOVERY_LOGGED", "FAILURE_LOGGED", "STALLED_LEASE_RELEASED",
}

FILES = {  # name -> (filename, default document)
    "taxonomy": ("taxonomy.yaml", {}),
    "capabilities": ("capabilities.yaml", {"families": {}}),
    "leases": ("leases.yaml", {"leases": {}}),
    "deps": ("deps.yaml", {"dependencies": []}),
    "experiments": ("experiments.yaml", {"experiments": {}}),
    "discoveries": ("discoveries.yaml", {"discoveries": []}),
    "failures": ("failures.yaml", {"failures": []}),
    "metrics": ("metrics.yaml", {}),
}


class Refused(Exception):
    """A rule was violated; nothing was changed."""


class StateError(Exception):
    """A state file is unreadable or inconsistent; nothing was changed."""


# ---------------------------------------------------------------- time ----
def now():
    override = os.environ.get("BCP_NOW")
    if override:
        return parse_ts(override)
    return dt.datetime.now(UTC).replace(microsecond=0)


def fmt_ts(t):
    return t.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def parse_ts(v):
    """Accept a datetime (PyYAML parses bare timestamps) or a string.
    Also tolerates the '+00:00Z' form older generate_views.py wrote and the
    7-digit fractions PowerShell's Get-Date -Format o emits."""
    if isinstance(v, dt.datetime):
        t = v
    elif isinstance(v, dt.date):
        t = dt.datetime(v.year, v.month, v.day)
    elif isinstance(v, str):
        s = v.strip()
        s = re.sub(r"\+00:00Z$", "Z", s)
        s = s[:-1] + "+00:00" if s.endswith("Z") else s
        s = re.sub(r"(\.\d{6})\d+", r"\1", s)
        try:
            t = dt.datetime.fromisoformat(s)
        except ValueError:
            raise ValueError(f"not an ISO-8601 timestamp: {v!r}") from None
    else:
        raise ValueError(f"not a timestamp: {v!r}")
    return t.replace(tzinfo=UTC) if t.tzinfo is None else t.astimezone(UTC)


def try_ts(v):
    try:
        return parse_ts(v)
    except ValueError:
        return None


# ---------------------------------------------------------------- yaml ----
class BcpLoader(yaml.SafeLoader):
    """SafeLoader that records duplicate mapping keys instead of silently
    letting the last one win. The FIRST occurrence is kept in the data."""

    def __init__(self, stream):
        super().__init__(stream)
        self.duplicates = []

    def construct_mapping(self, node, deep=False):
        self.flatten_mapping(node)
        out, lines, values = {}, {}, {}
        for key_node, value_node in node.value:
            key = self.construct_object(key_node, deep=deep)
            value = self.construct_object(value_node, deep=deep)
            lines.setdefault(key, []).append(key_node.start_mark.line + 1)
            values.setdefault(key, []).append(value)
            out.setdefault(key, value)
        for key, ls in lines.items():
            if len(ls) > 1:
                self.duplicates.append({"key": key, "lines": ls, "values": values[key]})
        return out


def read_text(path):
    """-> (text with \\n newlines, original newline style)."""
    raw = Path(path).read_bytes().decode("utf-8-sig")
    nl = "\r\n" if "\r\n" in raw else "\n"
    return raw.replace("\r\n", "\n"), nl


def parse_yaml(text, label="<text>"):
    """-> (data, duplicates). Raises StateError on invalid YAML."""
    loader = BcpLoader(text)
    try:
        data = loader.get_single_data()
    except yaml.YAMLError as e:
        msg = str(e).replace("\n", " ")
        raise StateError(f"{label}: invalid YAML — {msg}") from None
    finally:
        loader.dispose()
    return data, loader.duplicates


def atomic_write(path, text, nl="\n"):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    try:
        with open(tmp, "w", encoding="utf-8", newline=nl) as f:
            f.write(text)
            f.flush()
            os.fsync(f.fileno())
        for _ in range(40):
            try:
                os.replace(tmp, path)
                return
            except PermissionError:  # Windows: a reader/antivirus briefly holds the target
                time.sleep(0.05)
        os.replace(tmp, path)
    finally:
        with contextlib.suppress(FileNotFoundError):
            tmp.unlink()


@contextlib.contextmanager
def state_lock(timeout=20.0, stale_after=60.0):
    """Cross-process mutex (works on Windows and POSIX). A lock older than
    stale_after seconds is assumed to belong to a crashed process."""
    start = time.monotonic()
    while True:
        try:
            fd = os.open(LOCK, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
            os.write(fd, f"{os.getpid()} {fmt_ts(now())}\n".encode())
            os.close(fd)
            break
        except (FileExistsError, PermissionError):
            # PermissionError happens on Windows when another process is
            # creating/deleting the lock file at this exact moment; it is
            # contention, not a real failure, so retry like FileExistsError.
            try:
                if time.time() - LOCK.stat().st_mtime > stale_after:
                    LOCK.unlink()
                    continue
            except (FileNotFoundError, PermissionError):
                continue
            if time.monotonic() - start > timeout:
                raise StateError(f"could not acquire {LOCK.name} within {timeout:.0f}s "
                                 f"(another command is running, or delete a stale lock)")
            time.sleep(0.03)
    try:
        yield
    finally:
        # On Windows an unlink can hit PermissionError if another process just
        # opened/statted the file; retry briefly so no stale lock is left.
        deadline = time.monotonic() + 2.0
        while True:
            try:
                LOCK.unlink()
                break
            except FileNotFoundError:
                break
            except PermissionError:
                if time.monotonic() > deadline:
                    break
                time.sleep(0.01)


def header_comment(text):
    """The leading block of comment/blank lines of a file, kept on rewrite."""
    out = []
    for line in text.split("\n"):
        if line.startswith("#") or not line.strip():
            out.append(line)
        else:
            break
    while out and not out[-1].strip():
        out.pop()
    return "\n".join(out) + "\n" if out else ""


def dump_preserving_header(path, doc):
    """Rewrite a small, tool-owned YAML file (leases, discoveries, failures,
    metrics), keeping its leading comment block and line-ending style."""
    path = Path(path)
    old, nl = read_text(path) if path.exists() else ("", "\n")
    body = yaml.safe_dump(doc, sort_keys=False, allow_unicode=True, width=1000,
                          default_flow_style=False)
    atomic_write(path, header_comment(old) + body, nl)


# ------------------------------------------------- surgical text edits ----
def set_top_level_scalar(text, key, value):
    pat = re.compile(rf"^({re.escape(key)}:[ \t]*)([^\s#]+)([ \t]*(?:#.*)?)$", re.M)
    return pat.sub(lambda m: m.group(1) + value + m.group(3), text, count=1)


def set_cap_depth(text, cap, new_depth):
    """Change one capability's depth in place, preserving everything else.
    Handles flow style ({ name: .., depth: L0, .. }) and block style."""
    key = re.escape(cap)
    flow = re.compile(rf"^(\s*{key}:\s*\{{.*?\bdepth:\s*)(L\d)(?=\s*[,}}])", re.M)
    new, n = flow.subn(lambda m: m.group(1) + new_depth, text, count=1)
    if n:
        return new
    lines = text.split("\n")
    for i, line in enumerate(lines):
        m = re.match(rf"^(\s*){key}:\s*(#.*)?$", line)
        if not m:
            continue
        indent = len(m.group(1))
        for j in range(i + 1, len(lines)):
            cur = lines[j]
            if cur.strip() and len(cur) - len(cur.lstrip()) <= indent:
                break
            m2 = re.match(r"^(\s+depth:\s*)(L\d)(.*)$", cur)
            if m2:
                lines[j] = m2.group(1) + new_depth + m2.group(3)
                return "\n".join(lines)
    raise StateError(f"could not locate the depth field of {cap} in capabilities.yaml")


def set_experiment_status(text, exp_id, new_status):
    lines = text.split("\n")
    for i, line in enumerate(lines):
        m = re.match(rf"^(\s*){re.escape(exp_id)}:\s*(#.*)?$", line)
        if not m:
            continue
        parent = len(m.group(1))
        child = None
        for j in range(i + 1, len(lines)):
            cur = lines[j]
            if not cur.strip() or cur.lstrip().startswith("#"):
                continue
            ind = len(cur) - len(cur.lstrip())
            if ind <= parent:
                break
            child = ind if child is None else child
            m2 = re.match(r"^(\s+status:\s*)([A-Za-z_]+)(.*)$", cur)
            if m2 and ind == child:
                lines[j] = m2.group(1) + new_status + m2.group(3)
                return "\n".join(lines)
    raise StateError(f"could not locate status of {exp_id} in experiments.yaml")


# ------------------------------------------------------------ taxonomy ----
class Taxonomy:
    def __init__(self, doc):
        doc = doc if isinstance(doc, dict) else {}
        schemes = doc.get("id_schemes") or {}
        self.id_re = {k: re.compile(v["regex"]) for k, v in schemes.items()
                      if isinstance(v, dict) and "regex" in v}
        self.depths = [d["code"] for d in (doc.get("depth_levels") or []) if isinstance(d, dict)]
        self.enums = doc.get("enums") or {}
        self.signals = set(doc.get("signal_types") or [])

    def ok_id(self, scheme, value):
        rx = self.id_re.get(scheme)
        return bool(rx and isinstance(value, str) and rx.match(value))

    def rank(self, depth):
        return self.depths.index(depth)

    def valid_depth(self, depth):
        return depth in self.depths


# ----------------------------------------------------------- workspace ----
class Workspace:
    """Parsed snapshot of state/. Parse problems are collected, not raised,
    so validate.py can report them; mutating commands call require_healthy()."""

    def __init__(self):
        self.docs, self.errors, self.dupes = {}, {}, {}
        for name, (fname, default) in FILES.items():
            path = STATE / fname
            if not path.exists():
                self.docs[name] = copy.deepcopy(default)
                if name in ("taxonomy", "capabilities", "leases", "deps"):
                    self.errors[name] = f"state/{fname}: file is missing"
                continue
            try:
                data, dups = parse_yaml(read_text(path)[0], f"state/{fname}")
            except StateError as e:
                self.errors[name] = str(e)
                self.docs[name] = copy.deepcopy(default)
                continue
            self.docs[name] = data if data is not None else copy.deepcopy(default)
            if dups:
                self.dupes[name] = dups
        self.tax = Taxonomy(self.docs["taxonomy"])
        self._index()

    def _index(self):
        self.caps = {}
        fams = self.docs["capabilities"].get("families") if isinstance(self.docs["capabilities"], dict) else None
        for fam_id, fam in (fams.items() if isinstance(fams, dict) else []):
            caps = fam.get("capabilities") if isinstance(fam, dict) else None
            for cap_id, cap in (caps.items() if isinstance(caps, dict) else []):
                if isinstance(cap, dict):
                    self.caps[cap_id] = {"family": fam_id, **cap}

        def section(name, key, kind):
            doc = self.docs[name]
            val = doc.get(key) if isinstance(doc, dict) else None
            if val is None:
                return kind()
            return val if isinstance(val, kind) else kind()

        # A well-formed YAML file with the wrong shape is as dangerous as a
        # malformed one (a rewrite would silently discard it): flag it.
        for name, key, kind in (("leases", "leases", dict), ("deps", "dependencies", list),
                                ("experiments", "experiments", dict), ("discoveries", "discoveries", list),
                                ("failures", "failures", list)):
            doc = self.docs[name]
            raw = doc.get(key) if isinstance(doc, dict) else "<not a mapping>"
            if name not in self.errors and raw is not None and not isinstance(raw, kind):
                self.errors[name] = (f"state/{FILES[name][0]}: expected `{key}:` to be a "
                                     f"{'mapping' if kind is dict else 'list'}")

        self.leases = section("leases", "leases", dict)
        self.deps = [e for e in section("deps", "dependencies", list) if isinstance(e, dict)]
        self.experiments = section("experiments", "experiments", dict)
        self.discoveries = [e for e in section("discoveries", "discoveries", list) if isinstance(e, dict)]
        self.failures = [e for e in section("failures", "failures", list) if isinstance(e, dict)]

    # -- health
    def require_healthy(self, *names):
        for name in names:
            if name in self.errors:
                raise StateError(f"{self.errors[name]} — run: python validate.py")
            for d in self.dupes.get(name, []):
                raise StateError(
                    f"state/{FILES[name][0]} defines {d['key']!r} more than once "
                    f"(lines {', '.join(map(str, d['lines']))}) — run: python sweep.py --fix "
                    f"(leases) or fix by hand")

    # -- capabilities & dependencies
    def depth_of(self, cap):
        c = self.caps.get(cap)
        return c.get("depth") if c else None

    def requirements(self, cap):
        """[(target, required_depth)] that `cap` REQUIRES (source REQUIRES target)."""
        return [(e.get("target"), e.get("required_depth", self.tax.depths[0] if self.tax.depths else "L0"))
                for e in self.deps if e.get("edge_type") == "REQUIRES" and e.get("source") == cap]

    def dependents(self, cap):
        return [e.get("source") for e in self.deps
                if e.get("edge_type") == "REQUIRES" and e.get("target") == cap]

    def unmet(self, cap):
        """[(target, required_depth, current_depth)] still below the bar."""
        out = []
        for target, need in self.requirements(cap):
            cur = self.depth_of(target)
            if cur is None or not (self.tax.valid_depth(cur) and self.tax.valid_depth(need)) \
                    or self.tax.rank(cur) < self.tax.rank(need):
                out.append((target, need, cur))
        return out

    # -- leases
    def lease_expiry(self, lease):
        return try_ts(lease.get("expires_at")) if isinstance(lease, dict) else None

    def live_lease(self, cap, at):
        """The lease on `cap` if it is active and not past expires_at."""
        lease = self.leases.get(cap)
        if isinstance(lease, dict) and lease.get("status") == "active":
            exp = self.lease_expiry(lease)
            if exp and exp > at:
                return lease
        return None

    def live_leases_of(self, agent, at):
        return [c for c, l in self.leases.items()
                if isinstance(l, dict) and l.get("leased_to") == agent and self.live_lease(c, at)]

    def save_leases(self, at):
        doc = self.docs["leases"] if isinstance(self.docs["leases"], dict) else {}
        doc["version"] = doc.get("version", 1)
        doc["updated_at"] = fmt_ts(at)
        doc["leases"] = self.leases
        dump_preserving_header(STATE / FILES["leases"][0], doc)


# ----------------------------------------------------------- graph ops ----
def topo_sort(nodes, edges):
    """Kahn's algorithm. edges are (a, b) meaning a depends on b, so b is built
    first. Returns (build_order, leftover) — leftover nodes sit on a cycle."""
    deps = {n: set() for n in nodes}
    users = {n: set() for n in nodes}
    for a, b in edges:
        if a in deps and b in deps and a != b:
            deps[a].add(b)
            users[b].add(a)
    ready = sorted(n for n, d in deps.items() if not d)
    order = []
    while ready:
        n = ready.pop(0)
        order.append(n)
        for u in sorted(users[n]):
            deps[u].discard(n)
            if not deps[u] and u not in order and u not in ready:
                ready.append(u)
    return order, sorted(n for n in nodes if n not in order)


def find_cycle(edges, within):
    """One concrete cycle (as a node path) among the nodes in `within`."""
    graph = {n: [] for n in within}
    for a, b in edges:
        if a in graph and b in graph:
            graph[a].append(b)
    color, stack = {}, []

    def dfs(n):
        color[n] = 1
        stack.append(n)
        for m in graph[n]:
            if color.get(m) == 1:
                return stack[stack.index(m):] + [m]
            if m not in color:
                found = dfs(m)
                if found:
                    return found
        color[n] = 2
        stack.pop()
        return None

    for n in sorted(graph):
        if n not in color:
            found = dfs(n)
            if found:
                return found
    return []


def requires_edges(ws):
    return [(e.get("source"), e.get("target")) for e in ws.deps
            if e.get("edge_type") == "REQUIRES" and e.get("source") in ws.caps
            and e.get("target") in ws.caps]


# ----------------------------------------------------------------- log ----
def log_path(day):
    return LOG / f"{day}.yaml"


def append_log(entry, at):
    """Append one event to today's log. Caller should hold state_lock()."""
    entry = {"ts": fmt_ts(at), **entry}
    path = log_path(at.strftime("%Y-%m-%d"))
    text = yaml.safe_dump([entry], sort_keys=False, allow_unicode=True, width=1000,
                          default_flow_style=False)
    LOG.mkdir(exist_ok=True)
    prefix = ""
    if path.exists():
        existing = path.read_bytes()
        if existing and not existing.endswith(b"\n"):
            prefix = "\n"
    with open(path, "a", encoding="utf-8", newline="\n") as f:
        f.write(prefix + text)
        f.flush()
        os.fsync(f.fileno())


def read_logs(since=None):
    """-> (entries, problems). since: only files dated on/after that date.
    Each entry gets '_file' added for reporting."""
    entries, problems = [], []
    if not LOG.exists():
        return entries, problems
    for path in sorted(LOG.glob("*.yaml")):
        if since and path.stem < since.strftime("%Y-%m-%d"):
            continue
        rel = f"log/{path.name}"
        try:
            data, dups = parse_yaml(read_text(path)[0], rel)
        except StateError as e:
            problems.append(str(e))
            continue
        if data is None:
            continue
        if not isinstance(data, list):
            problems.append(f"{rel}: expected a list of events")
            continue
        for i, e in enumerate(data):
            if isinstance(e, dict):
                entries.append({**e, "_file": rel, "_idx": i})
            else:
                problems.append(f"{rel}: entry {i + 1} is not a mapping")
    return entries, problems


# -------------------------------------------------------- lease health ----
def last_activity(lease, entries):
    """Most recent moment the lease holder did anything (any logged event by
    that agent, or acquiring the lease)."""
    best = try_ts(lease.get("leased_at"))
    for e in entries:
        if e.get("agent") == lease.get("leased_to"):
            t = try_ts(e.get("ts"))
            if t and (best is None or t > best):
                best = t
    return best


def lease_health(lease, entries, at, stall_hours=DEFAULT_STALL_HOURS):
    """-> ('ok'|'expired'|'stalled', human-readable reason)."""
    exp = try_ts(lease.get("expires_at"))
    if exp is None:
        return "expired", "expires_at missing or unreadable"
    if exp <= at:
        return "expired", f"ttl expired {fmt_age(at - exp)} ago"
    last = last_activity(lease, entries)
    if last is not None and at - last > dt.timedelta(hours=stall_hours):
        return "stalled", f"no activity from {lease.get('leased_to')} for {fmt_age(at - last)}"
    return "ok", ""


def fmt_age(delta):
    mins = int(delta.total_seconds() // 60)
    return f"{mins // 60}h{mins % 60:02d}m" if mins >= 60 else f"{mins}m"


def compute_metrics(ws, entries, at, unresolved_conflicts=None, stall_hours=DEFAULT_STALL_HOURS):
    """The numbers metrics.yaml reports — computed, never hardcoded."""
    dist = {d: 0 for d in ws.tax.depths or ["L0", "L1", "L2", "L3"]}
    for c in ws.caps.values():
        dist[c.get("depth")] = dist.get(c.get("depth"), 0) + 1
    active = {c: l for c, l in ws.leases.items() if isinstance(l, dict) and l.get("status") == "active"}
    stalled = sum(1 for l in active.values() if lease_health(l, entries, at, stall_hours)[0] != "ok")
    if unresolved_conflicts is None:
        unresolved_conflicts = sum(
            1 for d in ws.dupes.get("leases", []) if isinstance(d["key"], str) and d["key"] in ws.caps)
    cycles = 1 if find_cycle(requires_edges(ws),
                             topo_sort(list(ws.caps), requires_edges(ws))[1]) else 0
    return {
        "version": 1,
        "updated_at": fmt_ts(at),
        "depth_distribution": dist,
        "active_experiments": sum(1 for e in ws.experiments.values()
                                  if isinstance(e, dict) and e.get("status") == "active"),
        "active_leases": len(active),
        "open_conflicts": unresolved_conflicts + cycles,
        "stalled_leases": stalled,
    }


def write_metrics(ws, entries, at, **kw):
    """Recompute state/metrics.yaml. Skips the write when nothing but the
    timestamp changed, so a 5-minute loop does not churn git."""
    m = compute_metrics(ws, entries, at, **kw)
    old = ws.docs.get("metrics")
    strip = lambda d: {k: v for k, v in d.items() if k != "updated_at"}
    if isinstance(old, dict) and strip(old) == strip(m):
        return m, False
    dump_preserving_header(STATE / FILES["metrics"][0], m)
    return m, True
