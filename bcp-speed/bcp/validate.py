#!/usr/bin/env python3
"""validate — read-only health check of state/ and log/.

Computes what the role files used to ask agents to eyeball: duplicate/expired/
stalled leases, dependency cycles (real topological sort), and whether every
ID, status and signal conforms to state/taxonomy.yaml.

  python validate.py             human-readable report
  python validate.py --json      machine-readable
  python validate.py --strict    warnings also fail the exit code

Exit code: 0 = no errors · 1 = at least one error (or warning with --strict).
"""
import argparse
import datetime as dt
import json
import sys

import bcp_lib as lib

ERROR, WARN = "error", "warn"


def check(ws, entries, log_problems, at, stall_hours=lib.DEFAULT_STALL_HOURS):
    out = []

    def add(sev, code, where, msg):
        out.append({"severity": sev, "code": code, "where": where, "message": msg})

    tax = ws.tax
    # -- 1. files parse, no duplicate keys ---------------------------------
    for name, msg in ws.errors.items():
        add(ERROR, "parse_error", lib.FILES[name][0], msg)
    for name, dups in ws.dupes.items():
        for d in dups:
            if name == "leases" and d["key"] in ws.caps:
                who = ", ".join(str((v or {}).get("leased_to", "?")) if isinstance(v, dict) else "?"
                                for v in d["values"])
                add(ERROR, "lease_conflict", f"leases.yaml:{'/'.join(map(str, d['lines']))}",
                    f"{d['key']} has {len(d['values'])} competing lease entries ({who}); run sweep.py --fix")
            else:
                add(ERROR, "duplicate_key", f"{lib.FILES[name][0]}:{'/'.join(map(str, d['lines']))}",
                    f"key {d['key']!r} is defined {len(d['lines'])} times (YAML silently keeps only one)")
    for p in log_problems:
        add(ERROR, "parse_error", "log", p)
    if "taxonomy" in ws.errors or not tax.depths:
        add(ERROR, "no_taxonomy", "taxonomy.yaml", "cannot validate anything else without a usable taxonomy")
        return out

    def bad_id(where, scheme, value, what):
        add(ERROR, "bad_id", where, f"{what} {value!r} does not match {tax.id_re[scheme].pattern}")

    def check_enum(where, enum, value, what):
        if value not in (tax.enums.get(enum) or []):
            add(ERROR, "bad_enum", where, f"{what} {value!r} is not one of {tax.enums.get(enum)}")

    def check_depth(where, value, what):
        if not tax.valid_depth(value):
            add(ERROR, "bad_depth", where, f"{what} {value!r} is not one of {tax.depths}")
            return False
        return True

    # -- 2. capabilities ---------------------------------------------------
    fams = ws.docs["capabilities"].get("families") if isinstance(ws.docs["capabilities"], dict) else None
    if not isinstance(fams, dict) or not fams:
        add(ERROR, "bad_structure", "capabilities.yaml", "expected a non-empty `families` mapping")
        fams = {}
    for fam_id, fam in fams.items():
        if not tax.ok_id("capability_family", fam_id):
            bad_id("capabilities.yaml", "capability_family", fam_id, "family id")
        caps = fam.get("capabilities") if isinstance(fam, dict) else None
        if not isinstance(caps, dict) or not caps:
            add(ERROR, "bad_structure", f"capabilities.yaml:{fam_id}", "family has no `capabilities` mapping")
            continue
        for cap_id, cap in caps.items():
            where = f"capabilities.yaml:{cap_id}"
            if not tax.ok_id("sub_capability", cap_id):
                bad_id(where, "sub_capability", cap_id, "capability id")
            elif not str(cap_id).startswith(f"{fam_id}."):
                add(ERROR, "bad_id", where, f"{cap_id} is filed under {fam_id}")
            if not isinstance(cap, dict):
                add(ERROR, "bad_structure", where, "capability must be a mapping")
                continue
            check_depth(where, cap.get("depth"), "depth")
            for field in ("name", "invariant"):
                if not (isinstance(cap.get(field), str) and cap[field].strip()):
                    add(ERROR, "missing_field", where, f"`{field}` is missing or empty")

    # -- 3. dependencies ---------------------------------------------------
    seen = set()
    for i, e in enumerate(ws.deps, 1):
        where = f"deps.yaml:edge {i}"
        src, tgt = e.get("source"), e.get("target")
        for role, cid in (("source", src), ("target", tgt)):
            if cid not in ws.caps:
                add(ERROR, "unknown_ref", where, f"{role} {cid!r} is not a known capability")
        check_enum(where, "edge_type", e.get("edge_type"), "edge_type")
        if e.get("edge_type") == "REQUIRES":
            if "required_depth" not in e:
                add(ERROR, "missing_field", where, "REQUIRES edge needs required_depth")
            else:
                check_depth(where, e["required_depth"], "required_depth")
        if src == tgt:
            add(ERROR, "dep_cycle", where, f"{src} depends on itself")
        key = (src, tgt, e.get("edge_type"))
        if key in seen:
            add(WARN, "duplicate_edge", where, f"{src} {e.get('edge_type')} {tgt} is listed more than once")
        seen.add(key)
    edges = lib.requires_edges(ws)
    order, leftover = lib.topo_sort(list(ws.caps), edges)
    cycle = lib.find_cycle(edges, leftover) if leftover else []
    if cycle:
        add(ERROR, "dep_cycle", "deps.yaml", "REQUIRES cycle: " + " -> ".join(cycle) +
            f" ({len(leftover)} capabilities cannot be ordered)")

    # -- 4. leases ---------------------------------------------------------
    per_agent = {}
    for cap, l in ws.leases.items():
        where = f"leases.yaml:{cap}"
        if cap not in ws.caps:
            add(ERROR, "unknown_ref", where, "lease is on a capability that does not exist")
            continue
        if not isinstance(l, dict):
            add(ERROR, "bad_structure", where, "lease must be a mapping")
            continue
        if not tax.ok_id("agent", l.get("leased_to")):
            bad_id(where, "agent", l.get("leased_to"), "leased_to")
        check_enum(where, "lease_status", l.get("status"), "status")
        if l.get("role") is not None:
            check_enum(where, "agent_role", l.get("role"), "role")
        if l.get("experiment") is not None and l["experiment"] not in ws.experiments:
            add(ERROR, "unknown_ref", where, f"experiment {l['experiment']!r} does not exist")
        started, expires = lib.try_ts(l.get("leased_at")), lib.try_ts(l.get("expires_at"))
        for field, t in (("leased_at", started), ("expires_at", expires)):
            if t is None:
                add(ERROR, "bad_timestamp", where, f"{field} is missing or not ISO-8601")
        if started and expires and expires <= started:
            add(ERROR, "bad_timestamp", where, "expires_at is not after leased_at")
        if l.get("status") != "active":
            continue
        cur_depth = ws.caps[cap].get("depth")
        if check_depth(where, l.get("depth_target"), "depth_target") and tax.valid_depth(cur_depth) \
                and tax.rank(l["depth_target"]) <= tax.rank(cur_depth):
            add(WARN, "lease_pointless", where,
                f"depth_target {l['depth_target']} is not above current depth {cur_depth}")
        health, why = lib.lease_health(l, entries, at, stall_hours)
        if health == "expired":
            add(WARN, "lease_expired", where, f"held by {l.get('leased_to')}: {why}; sweep.py --fix will free it")
        elif health == "stalled":
            add(WARN, "lease_stalled", where, f"{why}; sweep.py --fix will free it")
        unmet = ws.unmet(cap)
        if unmet:
            add(WARN, "lease_deps_unmet", where, "active lease but requirements are unmet: " +
                "; ".join(f"{t} needs {n}, is {c}" for t, n, c in unmet))
        per_agent.setdefault(l.get("leased_to"), []).append((cap, l.get("role") or "scoped_builder"))
    for agent, held in per_agent.items():
        role = held[0][1]
        limit = lib.MAX_LEASES.get(role, lib.MAX_LEASES["scoped_builder"])
        if len(held) > limit:
            add(WARN, "lease_overcommit", "leases.yaml",
                f"{agent} holds {len(held)} active leases (max {limit} for {role})")

    # -- 5. experiments ----------------------------------------------------
    for exp_id, exp in ws.experiments.items():
        where = f"experiments.yaml:{exp_id}"
        if not tax.ok_id("experiment", exp_id):
            bad_id(where, "experiment", exp_id, "experiment id")
        if not isinstance(exp, dict):
            add(ERROR, "bad_structure", where, "experiment must be a mapping")
            continue
        check_enum(where, "experiment_status", exp.get("status"), "status")
        if exp.get("target_depth") is not None:
            check_depth(where, exp["target_depth"], "target_depth")
        scope = exp.get("capabilities_in_scope") or []
        for cap in scope:
            if cap not in ws.caps:
                add(ERROR, "unknown_ref", where, f"in-scope capability {cap!r} does not exist")
        for ag in exp.get("agents_assigned") or []:
            if isinstance(ag, dict):
                if not tax.ok_id("agent", ag.get("id")):
                    bad_id(where, "agent", ag.get("id"), "assigned agent id")
                if ag.get("role") is not None:
                    check_enum(where, "agent_role", ag.get("role"), "assigned agent role")
        # Can the scope actually finish? Every requirement of an in-scope
        # capability must be in scope too, or already satisfied.
        for cap in (c for c in scope if c in ws.caps):
            for tgt, need, cur in ws.unmet(cap):
                if tgt not in scope:
                    add(WARN, "experiment_unreachable", where,
                        f"{cap} requires {tgt} >= {need} (now {cur}), which is outside this experiment's scope")

    # -- 6. discoveries / failures ----------------------------------------
    for label, scheme, items in (("discoveries", "discovery", ws.discoveries), ("failures", "failure", ws.failures)):
        ids = set()
        for e in items:
            where = f"{label}.yaml:{e.get('id')}"
            if not tax.ok_id(scheme, e.get("id")):
                bad_id(where, scheme, e.get("id"), "id")
            elif e["id"] in ids:
                add(ERROR, "duplicate_key", where, f"id {e['id']} used twice")
            ids.add(e.get("id"))
            if not tax.ok_id("agent", e.get("agent")):
                bad_id(where, "agent", e.get("agent"), "agent")
            if not (isinstance(e.get("text"), str) and e["text"].strip()):
                add(ERROR, "missing_field", where, "`text` is missing or empty")
            for ref in e.get("applies_to") or []:
                if ref not in ws.caps and ref not in fams:
                    add(ERROR, "unknown_ref", where, f"applies_to {ref!r} is not a known capability/family")

    # -- 7. log events + state/log drift ------------------------------------
    for e in entries:
        where = f"{e['_file']}:{e['_idx'] + 1}"
        if lib.try_ts(e.get("ts")) is None:
            add(ERROR, "bad_timestamp", where, f"ts {e.get('ts')!r} is missing or not ISO-8601")
        if not tax.ok_id("agent", e.get("agent")):
            bad_id(where, "agent", e.get("agent"), "agent")
        if e.get("signal") not in tax.signals:
            add(ERROR, "bad_signal", where, f"signal {e.get('signal')!r} is not in the taxonomy signal list")
        if e.get("cap") is not None and e["cap"] not in ws.caps:
            add(ERROR, "unknown_ref", where, f"cap {e['cap']!r} does not exist")
        if e.get("signal") == "DEPTH_BUMPED" and e.get("cap") in ws.caps and tax.valid_depth(e.get("to")):
            cur = ws.caps[e["cap"]].get("depth")
            if tax.valid_depth(cur) and tax.rank(cur) < tax.rank(e["to"]):
                add(WARN, "depth_drift", where,
                    f"log says {e['cap']} reached {e['to']} but capabilities.yaml has {cur}")

    out.sort(key=lambda f: (f["severity"] != ERROR, f["code"], f["where"]))
    return out


def format_finding(f):
    return f"{f['severity'].upper():5}  {f['code']:22} {f['where']:34} {f['message']}"


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--strict", action="store_true", help="treat warnings as failures")
    ap.add_argument("--stall-hours", type=float, default=lib.DEFAULT_STALL_HOURS)
    ap.add_argument("--days", type=int, default=14, help="how many days of log/ to read")
    args = ap.parse_args(argv)

    at = lib.now()
    ws = lib.Workspace()
    entries, problems = lib.read_logs(since=at - dt.timedelta(days=args.days))
    findings = check(ws, entries, problems, at, args.stall_hours)
    errors = sum(f["severity"] == ERROR for f in findings)
    warns = len(findings) - errors
    if args.json:
        print(json.dumps({"errors": errors, "warnings": warns, "findings": findings}, indent=2))
    else:
        for f in findings:
            print(format_finding(f))
        print(f"validate: {len(ws.caps)} capabilities, {len(ws.leases)} lease records, "
              f"{len(entries)} log events — {errors} error(s), {warns} warning(s)")
    return 1 if errors or (args.strict and warns) else 0


if __name__ == "__main__":
    sys.exit(main())
