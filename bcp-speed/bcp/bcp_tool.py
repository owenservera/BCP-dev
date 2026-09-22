#!/usr/bin/env python3
"""bcp_tool — the only way agents change BCP state.

Agents never hand-edit state/*.yaml or log/*.yaml. Each command below does an
atomic read-modify-write under a lock, checks the change against
state/taxonomy.yaml and the dependency graph, refuses invalid transitions,
and writes the matching log event in the same step (so state and log cannot
drift apart).

  lease acquire CAP --agent AGT-x [--role scoped_builder|fullscope_builder]
                    [--experiment EXP-...] [--depth-target L2] [--ttl-hours 8]
  lease renew   CAP --agent AGT-x [--ttl-hours 8] [--depth-target L3]   (also the heartbeat)
  lease release CAP --agent AGT-x [--note TEXT]
  depth bump    CAP L2 --agent AGT-x [--note TEXT]
  log append    --agent AGT-x --signal SIGNAL [--cap CAP] [--detail TEXT]
                [--blocked-on CAP --required-depth L2]
  discovery add --agent AGT-x --applies-to CAP[,CAP|FAM-nn...] --text TEXT
  failure add   --agent AGT-x --applies-to CAP[,...] --text TEXT
  available     [--scope FAM-01,FAM-02.3] [--experiment EXP-...] [--limit 15]
  show CAP

Exit codes: 0 ok · 1 refused / state problem (nothing was changed) · 2 bad usage.
"""
import argparse
import datetime as dt
import sys

import bcp_lib as lib
from bcp_lib import Refused, StateError, STATE, FILES


# ------------------------------------------------------------ validators ----
def need_agent(ws, agent):
    if not ws.tax.ok_id("agent", agent):
        raise Refused(f"agent id {agent!r} does not match the taxonomy agent id format (e.g. AGT-alpha)")
    return agent


def need_cap(ws, cap):
    if not ws.tax.ok_id("sub_capability", cap):
        raise Refused(f"{cap!r} is not a capability id (expected form FAM-09.3)")
    if cap not in ws.caps:
        raise Refused(f"{cap} does not exist in state/capabilities.yaml")
    return cap


def need_depth(ws, depth):
    if not ws.tax.valid_depth(depth):
        raise Refused(f"{depth!r} is not a depth level (allowed: {', '.join(ws.tax.depths)})")
    return depth


def need_ref(ws, ref):
    """A capability id or a family id."""
    if ws.tax.ok_id("sub_capability", ref) and ref in ws.caps:
        return ref
    fams = {c["family"] for c in ws.caps.values()}
    if ws.tax.ok_id("capability_family", ref) and ref in fams:
        return ref
    raise Refused(f"{ref!r} is not a known capability or family id")


def held_lease(ws, cap, agent, at, allow_expired=False):
    """The active lease on `cap`, which must belong to `agent`."""
    lease = ws.leases.get(cap)
    if not isinstance(lease, dict) or lease.get("status") != "active":
        raise Refused(f"you do not hold a lease on {cap} (run: lease acquire {cap} --agent {agent})")
    if lease.get("leased_to") != agent:
        raise Refused(f"{cap} is leased to {lease.get('leased_to')}, not {agent}")
    exp = ws.lease_expiry(lease)
    if not allow_expired and (exp is None or exp <= at):
        raise Refused(f"your lease on {cap} expired at {lib.fmt_ts(exp) if exp else '?'} — "
                      f"run: lease renew {cap} --agent {agent}")
    return lease


def check_ttl(hours):
    if not (0 < hours <= 24):
        raise Refused("--ttl-hours must be between 0 and 24")
    return hours


def next_depth(ws, cap):
    cur = ws.depth_of(cap)
    i = ws.tax.rank(cur)
    if i + 1 >= len(ws.tax.depths):
        raise Refused(f"{cap} is already at {cur}, the top depth")
    return ws.tax.depths[i + 1]


def describe_unmet(unmet):
    return "; ".join(f"{t} must be >= {need} (now {cur or 'missing'})" for t, need, cur in unmet)


# -------------------------------------------------------------- commands ----
def lease_acquire(ws, a):
    at = lib.now()
    ws.require_healthy("taxonomy", "capabilities", "leases", "deps", "experiments")
    agent, cap = need_agent(ws, a.agent), need_cap(ws, a.cap)
    if a.role not in lib.BUILDER_ROLES:
        raise Refused(f"role must be one of {', '.join(lib.BUILDER_ROLES)} (coordinators and maintainers never hold build leases)")
    cur = ws.depth_of(cap)
    target = need_depth(ws, a.depth_target) if a.depth_target else next_depth(ws, cap)
    if ws.tax.rank(target) <= ws.tax.rank(cur):
        raise Refused(f"{cap} is already at {cur}; depth target must be above it")
    if a.experiment:
        if not ws.tax.ok_id("experiment", a.experiment) or a.experiment not in ws.experiments:
            raise Refused(f"unknown experiment {a.experiment!r}")
        scope = (ws.experiments[a.experiment] or {}).get("capabilities_in_scope") or []
        if scope and cap not in scope:
            raise Refused(f"{cap} is not in the scope of {a.experiment} ({', '.join(scope)})")
    unmet = ws.unmet(cap)
    if unmet:
        raise Refused(f"{cap} is blocked: {describe_unmet(unmet)}")
    ttl = check_ttl(a.ttl_hours)

    existing, takeover = ws.leases.get(cap), None
    if isinstance(existing, dict) and existing.get("status") == "active":
        exp = ws.lease_expiry(existing)
        if exp and exp > at:
            if existing.get("leased_to") == agent:
                raise Refused(f"you already hold {cap} until {lib.fmt_ts(exp)} (use: lease renew)")
            raise Refused(f"{cap} is leased to {existing.get('leased_to')} until {lib.fmt_ts(exp)}")
        takeover = existing  # holder let it lapse

    limit = lib.MAX_LEASES[a.role]
    held = [c for c in ws.live_leases_of(agent, at) if c != cap]
    if len(held) >= limit:
        raise Refused(f"{agent} already holds {len(held)} leases (max {limit} for {a.role}): {', '.join(held)}")

    lease = {"leased_to": agent, "status": "active", "role": a.role}
    if a.experiment:
        lease["experiment"] = a.experiment
    lease.update(depth_target=target, leased_at=lib.fmt_ts(at),
                 expires_at=lib.fmt_ts(at + dt.timedelta(hours=ttl)))
    ws.leases[cap] = lease
    ws.save_leases(at)
    if takeover:
        lib.append_log({"agent": agent, "signal": "STALLED_LEASE_RELEASED", "cap": cap,
                        "detail": f"ttl expired; previously held by {takeover.get('leased_to')}"}, at)
    lib.append_log({"agent": agent, "signal": "LEASE_ACQUIRED", "cap": cap,
                    "detail": f"target {target}, expires {lease['expires_at']}"}, at)
    print(f"OK leased {cap} to {agent}: {cur} -> target {target}, expires {lease['expires_at']}")


def lease_renew(ws, a):
    at = lib.now()
    ws.require_healthy("taxonomy", "capabilities", "leases")
    agent, cap = need_agent(ws, a.agent), need_cap(ws, a.cap)
    lease = held_lease(ws, cap, agent, at, allow_expired=True)
    lease["expires_at"] = lib.fmt_ts(at + dt.timedelta(hours=check_ttl(a.ttl_hours)))
    if a.depth_target:
        target = need_depth(ws, a.depth_target)
        if ws.tax.rank(target) <= ws.tax.rank(ws.depth_of(cap)):
            raise Refused(f"{cap} is already at {ws.depth_of(cap)}; target must be above it")
        lease["depth_target"] = target
    ws.save_leases(at)
    lib.append_log({"agent": agent, "signal": "LEASE_RENEWED", "cap": cap,
                    "detail": f"expires {lease['expires_at']}, target {lease.get('depth_target')}"}, at)
    print(f"OK renewed {cap} until {lease['expires_at']}")


def lease_release(ws, a):
    at = lib.now()
    ws.require_healthy("taxonomy", "capabilities", "leases")
    agent, cap = need_agent(ws, a.agent), need_cap(ws, a.cap)
    lease = ws.leases.get(cap)
    if isinstance(lease, dict) and lease.get("leased_to") == agent \
            and lease.get("status") in ("released", "expired", "reassigned"):
        print(f"OK {cap} lease already ended ({lease['status']})")
        return
    lease = held_lease(ws, cap, agent, at, allow_expired=True)
    lease["status"] = "released"
    lease["released_at"] = lib.fmt_ts(at)
    ws.save_leases(at)
    entry = {"agent": agent, "signal": "LEASE_RELEASED", "cap": cap}
    if a.note:
        entry["detail"] = a.note
    lib.append_log(entry, at)
    print(f"OK released {cap}")


def depth_bump(ws, a):
    at = lib.now()
    ws.require_healthy("taxonomy", "capabilities", "leases", "deps")
    agent, cap, new = need_agent(ws, a.agent), need_cap(ws, a.cap), need_depth(ws, a.depth)
    lease = held_lease(ws, cap, agent, at)
    cur = ws.depth_of(cap)
    rank = ws.tax.rank
    if rank(new) <= rank(cur):
        raise Refused(f"{cap} is already at {cur}; depth only moves up (asked for {new})")
    target = lease.get("depth_target")
    if target and rank(new) > rank(target):
        raise Refused(f"your lease targets {target}; to go to {new} first run: "
                      f"lease renew {cap} --agent {agent} --depth-target {new}")
    unmet = ws.unmet(cap)
    if unmet:
        raise Refused(f"cannot advance {cap}: {describe_unmet(unmet)}")

    path = STATE / FILES["capabilities"][0]
    text, nl = lib.read_text(path)
    new_text = lib.set_cap_depth(text, cap, new)
    new_text = lib.set_top_level_scalar(new_text, "updated_at", lib.fmt_ts(at))
    # Safety net: the edited file must parse, add no duplicate keys, and differ
    # from the original in exactly one place — this capability's depth.
    before, _ = lib.parse_yaml(text, "capabilities.yaml")
    after, dups = lib.parse_yaml(new_text, "capabilities.yaml (edited)")
    if dups:
        raise StateError("edit would introduce duplicate keys; nothing written")
    for doc in (before, after):
        doc.pop("updated_at", None)
    node = after["families"][ws.caps[cap]["family"]]["capabilities"][cap]
    if node.get("depth") != new:
        raise StateError("edit did not take effect; nothing written")
    node["depth"] = cur
    if before != after:
        raise StateError("edit changed more than the one depth field; nothing written")
    lib.atomic_write(path, new_text, nl)
    entry = {"agent": agent, "signal": "DEPTH_BUMPED", "cap": cap, "from": cur, "to": new}
    if a.note:
        entry["detail"] = a.note
    lib.append_log(entry, at)
    msg = f"OK {cap}: {cur} -> {new}"
    if target and new == target:
        msg += f" (lease target reached; free it with: lease release {cap} --agent {agent})"
    print(msg)


def log_append(ws, a):
    at = lib.now()
    ws.require_healthy("taxonomy", "capabilities", "deps")
    agent = need_agent(ws, a.agent)
    if a.signal not in ws.tax.signals:
        raise Refused(f"{a.signal!r} is not in the taxonomy signal list (adding one is require_human)")
    if a.signal in lib.COMMAND_OWNED_SIGNALS:
        raise Refused(f"{a.signal} is emitted automatically by its own command "
                      f"(lease/depth/discovery/failure ...); do not log it by hand")
    entry = {"agent": agent, "signal": a.signal}
    if a.cap:
        entry["cap"] = need_cap(ws, a.cap)
    if a.signal == "BLOCKED_ON_DEPENDENCY":
        if not (a.cap and a.blocked_on):
            raise Refused("BLOCKED_ON_DEPENDENCY needs --cap (what you wanted) and --blocked-on (what is missing)")
        entry["blocked_on"] = need_cap(ws, a.blocked_on)
        req = a.required_depth
        if not req:
            req = next((n for t, n in ws.requirements(a.cap) if t == a.blocked_on), None)
        if not req:
            raise Refused("give --required-depth (no REQUIRES edge found for that pair)")
        entry["required_depth"] = need_depth(ws, req)
    elif a.blocked_on or a.required_depth:
        raise Refused("--blocked-on/--required-depth only apply to BLOCKED_ON_DEPENDENCY")
    if a.detail:
        entry["detail"] = a.detail
    lib.append_log(entry, at)
    print(f"OK logged {a.signal}")


def _add_note(ws, a, kind):
    at = lib.now()
    name, scheme, fname, signal, prefix = {
        "discovery": ("discoveries", "discovery", "discoveries", "DISCOVERY_LOGGED", "DISC"),
        "failure": ("failures", "failure", "failures", "FAILURE_LOGGED", "FAIL"),
    }[kind]
    ws.require_healthy("taxonomy", "capabilities", name)
    agent = need_agent(ws, a.agent)
    refs = [need_ref(ws, r.strip()) for r in a.applies_to.split(",") if r.strip()]
    if not refs:
        raise Refused("--applies-to needs at least one capability or family id")
    if not a.text.strip():
        raise Refused("--text is empty")
    items = getattr(ws, name)
    if len(items) != len(ws.docs[name].get(name) or []):
        raise StateError(f"state/{FILES[name][0]} has entries that are not mappings — run: python validate.py")
    seq = 1 + max([int(e["id"][-3:]) for e in items
                   if ws.tax.ok_id(scheme, e.get("id"))] or [0])
    if seq > 999:
        raise Refused(f"{prefix} ids are exhausted (max 999); archive old entries (require_human)")
    item = {"id": f"{prefix}-{seq:03d}", "ts": lib.fmt_ts(at), "agent": agent,
            "applies_to": refs, "text": a.text.strip()}
    items.append(item)
    doc = ws.docs[name]
    doc["version"] = doc.get("version", 1)
    doc[name] = items
    lib.dump_preserving_header(STATE / FILES[name][0], doc)
    lib.append_log({"agent": agent, "signal": signal, "detail": item["id"],
                    **({"cap": refs[0]} if ws.tax.ok_id("sub_capability", refs[0]) else {})}, at)
    print(f"OK {item['id']} recorded for {', '.join(refs)}")


def discovery_add(ws, a):
    _add_note(ws, a, "discovery")


def failure_add(ws, a):
    _add_note(ws, a, "failure")


def available(ws, a):
    at = lib.now()
    ws.require_healthy("taxonomy", "capabilities", "leases", "deps", "experiments")
    allowed, ceiling = None, "L3"
    if a.scope:
        tokens = [need_ref(ws, t.strip()) for t in a.scope.split(",") if t.strip()]
        allowed = {c for c, v in ws.caps.items() if c in tokens or v["family"] in tokens}
    if a.experiment:
        exp = ws.experiments.get(a.experiment)
        if not isinstance(exp, dict):
            raise Refused(f"unknown experiment {a.experiment!r}")
        in_exp = set(exp.get("capabilities_in_scope") or [])
        allowed = in_exp if allowed is None else allowed & in_exp   # both flags -> intersection
        ceiling = exp.get("target_depth") or ceiling
    rows = []
    for cap, c in ws.caps.items():
        if allowed is not None and cap not in allowed:
            continue
        depth = c.get("depth")
        if not ws.tax.valid_depth(depth) or ws.tax.rank(depth) >= ws.tax.rank(ceiling):
            continue
        if ws.live_lease(cap, at) or ws.unmet(cap):
            continue
        rows.append((-len(ws.dependents(cap)), cap, depth, c.get("name", "")))
    rows.sort()
    if not rows:
        print("none available (everything in scope is leased, blocked, or at target depth)")
        return
    print(f"{len(rows)} available, most-depended-on first:")
    for neg, cap, depth, name in rows[:a.limit]:
        print(f"  {cap}  {depth}  needed-by={-neg}  {name}")


def show(ws, a):
    at = lib.now()
    ws.require_healthy("taxonomy", "capabilities", "leases", "deps")
    cap = need_cap(ws, a.cap)
    c = ws.caps[cap]
    print(f"{cap}  {c.get('name', '')}  [{c.get('depth')}]")
    print(f"invariant: {c.get('invariant', '')}")
    lease = ws.leases.get(cap)
    if isinstance(lease, dict) and lease.get("status") == "active":
        live = "live" if ws.live_lease(cap, at) else "EXPIRED"
        print(f"lease: {lease.get('leased_to')} ({live}, target {lease.get('depth_target')}, "
              f"expires {lease.get('expires_at')})")
    else:
        print("lease: none")
    reqs = ws.requirements(cap)
    if reqs:
        bad = {t for t, _, _ in ws.unmet(cap)}
        print("requires: " + ", ".join(f"{t} >= {n} ({ws.depth_of(t)}{', UNMET' if t in bad else ''})" for t, n in reqs))
    else:
        print("requires: nothing")
    users = ws.dependents(cap)
    print("required by: " + (", ".join(users) if users else "nothing"))
    for label, items in (("discoveries", ws.discoveries), ("failures", ws.failures)):
        for e in items:
            if cap in (e.get("applies_to") or []) or c["family"] in (e.get("applies_to") or []):
                print(f"{label[:-1]} {e.get('id')}: {e.get('text')}")


# ------------------------------------------------------------------ main ----
def build_parser():
    p = argparse.ArgumentParser(prog="bcp_tool.py", description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="group", required=True)

    def agent_arg(sp):
        sp.add_argument("--agent", required=True, help="your agent id, e.g. AGT-alpha")

    lease = sub.add_parser("lease").add_subparsers(dest="action", required=True)
    sp = lease.add_parser("acquire"); sp.set_defaults(fn=lease_acquire)
    sp.add_argument("cap"); agent_arg(sp)
    sp.add_argument("--role", default="scoped_builder")
    sp.add_argument("--experiment"); sp.add_argument("--depth-target")
    sp.add_argument("--ttl-hours", type=float, default=lib.DEFAULT_TTL_HOURS)
    sp = lease.add_parser("renew"); sp.set_defaults(fn=lease_renew)
    sp.add_argument("cap"); agent_arg(sp); sp.add_argument("--depth-target")
    sp.add_argument("--ttl-hours", type=float, default=lib.DEFAULT_TTL_HOURS)
    sp = lease.add_parser("release"); sp.set_defaults(fn=lease_release)
    sp.add_argument("cap"); agent_arg(sp); sp.add_argument("--note")

    depth = sub.add_parser("depth").add_subparsers(dest="action", required=True)
    sp = depth.add_parser("bump"); sp.set_defaults(fn=depth_bump)
    sp.add_argument("cap"); sp.add_argument("depth"); agent_arg(sp); sp.add_argument("--note")

    lg = sub.add_parser("log").add_subparsers(dest="action", required=True)
    sp = lg.add_parser("append"); sp.set_defaults(fn=log_append)
    agent_arg(sp); sp.add_argument("--signal", required=True); sp.add_argument("--cap")
    sp.add_argument("--detail"); sp.add_argument("--blocked-on"); sp.add_argument("--required-depth")

    for word, fn in (("discovery", discovery_add), ("failure", failure_add)):
        g = sub.add_parser(word).add_subparsers(dest="action", required=True)
        sp = g.add_parser("add"); sp.set_defaults(fn=fn)
        agent_arg(sp); sp.add_argument("--applies-to", required=True); sp.add_argument("--text", required=True)

    sp = sub.add_parser("available"); sp.set_defaults(fn=available, read_only=True)
    sp.add_argument("--scope"); sp.add_argument("--experiment"); sp.add_argument("--limit", type=int, default=15)
    sp = sub.add_parser("show"); sp.set_defaults(fn=show, read_only=True)
    sp.add_argument("cap")
    return p


def main(argv=None):
    args = build_parser().parse_args(argv)
    try:
        if getattr(args, "read_only", False):
            args.fn(lib.Workspace(), args)
        else:
            with lib.state_lock():
                args.fn(lib.Workspace(), args)
    except Refused as e:
        print(f"REFUSED: {e}", file=sys.stderr)
        return 1
    except (StateError, ValueError) as e:
        print(f"STATE ERROR: {e}", file=sys.stderr)
        return 1
    except Exception as e:  # malformed state we did not anticipate: fail closed, readable
        print(f"STATE ERROR: unexpected {type(e).__name__}: {e} — run: python validate.py", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
