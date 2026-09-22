#!/usr/bin/env python3
"""sweep — the mechanical parts of the coordinator and maintainer roles.

  python sweep.py                 dry run: report what would change
  python sweep.py --fix           apply it (this is what maintain.ps1 runs)
  python sweep.py --fix --views   ...and regenerate views/*.html afterwards

What it does, deterministically (no judgment calls):
  1. Lease conflicts   competing entries for one capability -> earliest wins
                       (tie: higher depth_target), losers dropped, event logged
  2. Expired / stalled leases past expires_at, or holder silent for
                       --stall-hours (default 2) -> status: expired, freed
  3. Unblocking        BLOCKED_ON_DEPENDENCY whose dependency is now satisfied
                       -> DEPENDENCY_SATISFIED addressed to that agent
  4. Integration       active experiment with every in-scope capability at its
                       target_depth -> status: merging + INTEGRATION_READY
  5. Signals           dependency cycles, taxonomy violations and depth drift
                       found by validate.py are emitted (once, not every sweep)
  6. Metrics           state/metrics.yaml recomputed from real data

Judgment calls stay with the agents: rebalancing, drift against invariants,
abandoning experiments, anything require_human.

Exit code: 1 if error-level findings remain afterwards, else 0.
"""
import argparse
import contextlib
import datetime as dt
import sys

import bcp_lib as lib
import validate

AGENT_DEFAULT = "AGT-sweep"
TAXONOMY_CODES = {"bad_id", "bad_enum", "bad_depth", "bad_signal", "unknown_ref",
                  "missing_field", "bad_structure", "bad_timestamp", "duplicate_key"}


def run(fix, agent, stall_hours, days, views):
    at = lib.now()
    with (lib.state_lock() if fix else contextlib.nullcontext()):
        ws = lib.Workspace()
        entries, log_problems = lib.read_logs(since=at - dt.timedelta(days=days))
        for name in ("taxonomy", "capabilities", "leases", "deps"):
            if name in ws.errors:
                print(f"STATE ERROR: {ws.errors[name]}", file=sys.stderr)
                return 1
        if not ws.tax.ok_id("agent", agent):
            print(f"REFUSED: agent id {agent!r} does not match the taxonomy agent regex", file=sys.stderr)
            return 1

        actions, pending = [], []
        tag = "fix  " if fix else "would"

        def act(text):
            actions.append(text)
            print(f"[{tag}] {text}")

        def emit(signal, detail, cap=None, once_hours=None, **extra):
            entry = {"agent": agent, "signal": signal, **({"cap": cap} if cap else {}), **extra, "detail": detail}
            if once_hours:
                cutoff = at - dt.timedelta(hours=once_hours)
                for e in [*entries, *pending]:
                    t = lib.try_ts(e.get("ts")) or at
                    if e.get("signal") == signal and e.get("detail") == detail and t > cutoff:
                        return False
            pending.append({**entry, "ts": lib.fmt_ts(at)})
            return True

        leases_changed = False
        rank = ws.tax.rank

        # 1. competing lease entries for the same capability ----------------
        for d in ws.dupes.get("leases", []):
            cands = [v for v in d["values"] if isinstance(v, dict)]
            if d["key"] not in ws.caps or not cands:
                continue
            far = dt.datetime.max.replace(tzinfo=lib.UTC)
            winner = min(cands, key=lambda v: (
                lib.try_ts(v.get("leased_at")) or far,
                -(rank(v["depth_target"]) if ws.tax.valid_depth(v.get("depth_target")) else -1)))
            losers = [v for v in cands if v is not winner]
            detail = (f"{d['key']}: kept {winner.get('leased_to')} (leased {winner.get('leased_at')}); dropped "
                      + ", ".join(f"{v.get('leased_to')} (leased {v.get('leased_at')})" for v in losers))
            act(f"lease conflict on {detail}")
            emit("LEASE_CONFLICT_DETECTED", detail, d["key"])
            if fix:
                ws.leases[d["key"]] = winner
                leases_changed = True
        if fix and leases_changed:
            ws.dupes.pop("leases", None)

        # 2. expired / stalled leases ----------------------------------------
        for cap, l in ws.leases.items():
            if not (isinstance(l, dict) and l.get("status") == "active"):
                continue
            health, why = lib.lease_health(l, entries, at, stall_hours)
            if health == "ok":
                continue
            act(f"free {cap} from {l.get('leased_to')} ({why})")
            emit("STALLED_LEASE_RELEASED", f"{l.get('leased_to')}: {why}", cap)
            if fix:
                l["status"] = "expired"
                l["expired_at"] = lib.fmt_ts(at)
                l["expired_reason"] = why
                leases_changed = True
        if fix and leases_changed:
            ws.save_leases(at)

        # 3. blocked agents whose dependency is now satisfied ------------------
        latest = {}
        for e in entries:
            if e.get("signal") == "BLOCKED_ON_DEPENDENCY" and e.get("cap") in ws.caps \
                    and e.get("blocked_on") in ws.caps and ws.tax.valid_depth(e.get("required_depth")):
                t = lib.try_ts(e.get("ts"))
                key = (e.get("agent"), e["cap"], e["blocked_on"])
                if t and (key not in latest or t > latest[key][0]):
                    latest[key] = (t, e["required_depth"])
        for (who, cap, dep), (t0, need) in sorted(latest.items(), key=lambda kv: kv[1][0]):
            cur = ws.depth_of(dep)
            if not (ws.tax.valid_depth(cur) and rank(cur) >= rank(need)):
                continue
            told = any(e.get("signal") == "DEPENDENCY_SATISFIED" and e.get("addressed_to") == who
                       and e.get("cap") == cap and e.get("blocked_on") == dep
                       and (lib.try_ts(e.get("ts")) or at) >= t0 for e in [*entries, *pending])
            if not told:
                act(f"tell {who}: {dep} is now {cur} (>= {need}), {cap} is unblocked")
                emit("DEPENDENCY_SATISFIED", f"{dep} reached {need}; {cap} is unblocked",
                     cap, blocked_on=dep, addressed_to=who)

        # 4. experiments ready to integrate --------------------------------
        for exp_id, exp in ws.experiments.items():
            if not (isinstance(exp, dict) and exp.get("status") == "active"):
                continue
            scope = [c for c in (exp.get("capabilities_in_scope") or []) if c in ws.caps]
            target = exp.get("target_depth")
            if scope and ws.tax.valid_depth(target) and all(
                    ws.tax.valid_depth(ws.depth_of(c)) and rank(ws.depth_of(c)) >= rank(target) for c in scope):
                act(f"{exp_id}: all {len(scope)} in-scope capabilities are at {target}+ -> merging")
                emit("INTEGRATION_READY", f"{exp_id}: all in-scope capabilities at {target}+")
                if fix:
                    path = lib.STATE / lib.FILES["experiments"][0]
                    text, nl = lib.read_text(path)
                    new = lib.set_experiment_status(text, exp_id, "merging")
                    check, dups = lib.parse_yaml(new, "experiments.yaml (edited)")
                    if dups or check["experiments"][exp_id].get("status") != "merging":
                        raise lib.StateError("experiments.yaml edit failed verification; nothing written")
                    lib.atomic_write(path, new, nl)

        # 5. findings -> signals ----------------------------------------------
        fresh = lib.Workspace() if fix else ws
        findings = validate.check(fresh, entries, log_problems, at, stall_hours)
        window = days * 24
        for f in findings:
            if f["code"] == "dep_cycle":
                emit("CYCLE_DETECTED", f["message"], once_hours=24)
            elif f["severity"] == validate.ERROR and f["code"] in TAXONOMY_CODES:
                emit("TAXONOMY_VIOLATION", f"{f['where']}: {f['message']}", once_hours=window)
            elif f["code"] == "depth_drift":
                emit("DRIFT_DETECTED", f"{f['where']}: {f['message']}", once_hours=window)
        new_signals = [p for p in pending if p["signal"] in ("CYCLE_DETECTED", "TAXONOMY_VIOLATION", "DRIFT_DETECTED")]
        for p in new_signals:
            act(f"signal {p['signal']}: {p['detail']}")

        # 6. metrics, log flush ------------------------------------------------
        if fix:
            for p in pending:
                lib.append_log({k: v for k, v in p.items() if k != "ts"}, at)
            if actions:
                lib.append_log({"agent": agent, "signal": "MAINTENANCE_SWEEP",
                                "detail": f"{len(actions)} action(s): " + "; ".join(actions)[:400]}, at)
            fresh = lib.Workspace()
            entries, log_problems = lib.read_logs(since=at - dt.timedelta(days=days))
            metrics, wrote = lib.write_metrics(fresh, entries, at, stall_hours=stall_hours)
            findings = validate.check(fresh, entries, log_problems, at, stall_hours)

        errors = [f for f in findings if f["severity"] == validate.ERROR]
        warns = [f for f in findings if f["severity"] == validate.WARN]
        for f in findings:
            print(validate.format_finding(f))
        verb = "applied" if fix else "pending (re-run with --fix)"
        print(f"sweep: {len(actions)} action(s) {verb}; {len(errors)} error(s), {len(warns)} warning(s) remain")

    if fix and views:
        import generate_views
        generate_views.main()
    return 1 if errors else 0


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--fix", action="store_true", help="apply changes (default is a dry run)")
    ap.add_argument("--views", action="store_true", help="regenerate views/*.html after a --fix sweep")
    ap.add_argument("--agent", default=AGENT_DEFAULT, help=f"id used in log events (default {AGENT_DEFAULT})")
    ap.add_argument("--stall-hours", type=float, default=lib.DEFAULT_STALL_HOURS)
    ap.add_argument("--days", type=int, default=14, help="how many days of log/ to consider")
    a = ap.parse_args(argv)
    try:
        return run(a.fix, a.agent, a.stall_hours, a.days, a.views)
    except (lib.StateError, lib.Refused, ValueError) as e:
        print(f"STATE ERROR: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"STATE ERROR: unexpected {type(e).__name__}: {e} — run: python validate.py", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
