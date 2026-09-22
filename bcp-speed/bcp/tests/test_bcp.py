"""End-to-end tests for bcp_tool.py, validate.py and sweep.py.

Run from the workspace root:   python -m unittest discover -s tests -v

Each test gets a throwaway copy of state/ (BCP_ROOT) and a frozen clock
(BCP_NOW), and drives the real scripts as subprocesses — the same way agents do.
The throwaway's leases.yaml starts EMPTY: live lease records (the normal
operating condition once builders arrive) must never leak into assertions.
"""
import difflib
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SRC = Path(__file__).resolve().parents[1]
T0 = "2026-09-21T12:00:00Z"
EMPTY_LEASES = "version: 1\nleases: {}\n"


class BcpCase(unittest.TestCase):
    def setUp(self):
        self.root = Path(tempfile.mkdtemp(prefix="bcp-test-"))
        shutil.copytree(SRC / "state", self.root / "state")
        # Hermetic leases: each test builds exactly the leases it asserts.
        (self.root / "state" / "leases.yaml").write_text(EMPTY_LEASES, encoding="utf-8")
        self.addCleanup(shutil.rmtree, self.root, ignore_errors=True)

    # -- helpers ---------------------------------------------------------
    def env(self, now=T0):
        return dict(os.environ, BCP_ROOT=str(self.root), BCP_NOW=now)

    def run_script(self, script, *args, now=T0):
        p = subprocess.run([sys.executable, str(SRC / script), *args], env=self.env(now),
                           capture_output=True, text=True)
        return p.returncode, p.stdout, p.stderr

    def tool(self, *args, now=T0):
        return self.run_script("bcp_tool.py", *args, now=now)

    def ok(self, *args, now=T0, script="bcp_tool.py"):
        rc, out, err = self.run_script(script, *args, now=now)
        self.assertEqual(rc, 0, f"{script} {' '.join(args)}\n{out}\n{err}")
        return out

    def refused(self, *args, now=T0, expect=None):
        rc, out, err = self.tool(*args, now=now)
        self.assertEqual(rc, 1, f"expected refusal: {' '.join(args)}\n{out}\n{err}")
        if expect:
            self.assertIn(expect, err)
        return err

    def state(self, name):
        return (self.root / "state" / name).read_text(encoding="utf-8")

    def write_state(self, name, text):
        (self.root / "state" / name).write_text(text, encoding="utf-8")

    def log_entries(self):
        import yaml
        out = []
        for p in sorted((self.root / "log").glob("*.yaml")):
            out += yaml.safe_load(p.read_text(encoding="utf-8")) or []
        return out

    def signals(self):
        return [e["signal"] for e in self.log_entries()]

    def validate_json(self, now=T0):
        rc, out, err = self.run_script("validate.py", "--json", now=now)
        return rc, json.loads(out)

    def snapshot(self):
        h = hashlib.sha256()
        for p in sorted(self.root.rglob("*")):
            if p.is_file():
                h.update(p.read_bytes())
        return h.hexdigest()

    def lease(self, cap, agent="AGT-alpha", now=T0, *extra):
        return self.ok("lease", "acquire", cap, "--agent", agent, *extra, now=now)


class SeedIsValid(BcpCase):
    def test_pristine_seed_has_no_errors(self):
        rc, report = self.validate_json()
        self.assertEqual(rc, 0, report)
        self.assertEqual(report["errors"], 0)

    def test_seed_experiments_are_reachable(self):
        _, report = self.validate_json()
        codes = {f["code"] for f in report["findings"]}
        self.assertNotIn("experiment_unreachable", codes)
        self.assertEqual(report["errors"], 0)


class Leases(BcpCase):
    def test_dependency_gate_blocks_acquire(self):
        self.refused("lease", "acquire", "FAM-12.2", "--agent", "AGT-alpha", expect="FAM-12.1 must be >= L1")

    def test_full_cycle_touches_one_line_and_logs_everything(self):
        before = self.state("capabilities.yaml")
        self.lease("FAM-12.1", "AGT-alpha")
        self.ok("depth", "bump", "FAM-12.1", "L1", "--agent", "AGT-alpha", "--note", "stub")
        self.ok("lease", "release", "FAM-12.1", "--agent", "AGT-alpha")
        after = self.state("capabilities.yaml")
        changed = [l for l in difflib.unified_diff(before.splitlines(), after.splitlines(), lineterm="", n=0)
                   if l[:1] in "+-" and l[:3] not in ("+++", "---")]
        self.assertEqual(len(changed), 4, changed)  # depth line + updated_at line, each -/+
        self.assertTrue(any("FAM-12.1" in l and "depth: L1" in l for l in changed))
        self.assertIn("# BCP-SPEED Capability Map", after)  # comments survive
        self.assertEqual(self.signals(), ["LEASE_ACQUIRED", "DEPTH_BUMPED", "LEASE_RELEASED"])
        # unblocked now
        self.lease("FAM-12.2", "AGT-alpha")

    def test_rules_refuse_bad_transitions(self):
        self.lease("FAM-12.1", "AGT-alpha")
        self.refused("lease", "acquire", "FAM-12.1", "--agent", "AGT-beta", expect="leased to AGT-alpha")
        self.refused("lease", "acquire", "FAM-12.1", "--agent", "AGT-alpha", expect="already hold")
        self.refused("depth", "bump", "FAM-12.1", "L1", "--agent", "AGT-beta", expect="not AGT-beta")
        self.refused("depth", "bump", "FAM-12.1", "L2", "--agent", "AGT-alpha", expect="targets L1")
        self.refused("depth", "bump", "FAM-12.1", "L0", "--agent", "AGT-alpha", expect="only moves up")
        self.refused("depth", "bump", "FAM-12.1", "L9", "--agent", "AGT-alpha", expect="not a depth level")
        self.refused("lease", "acquire", "FAM-99.9", "--agent", "AGT-alpha", expect="does not exist")
        self.refused("lease", "acquire", "FAM-01.1", "--agent", "alpha", expect="does not match")
        self.refused("lease", "acquire", "FAM-01.1", "--agent", "AGT-alpha", "--role", "coordinator",
                     expect="never hold build leases")
        # raising the target is explicit, then allowed
        self.ok("lease", "renew", "FAM-12.1", "--agent", "AGT-alpha", "--depth-target", "L2")
        self.ok("depth", "bump", "FAM-12.1", "L2", "--agent", "AGT-alpha")
        self.assertIn("depth: L2", self.state("capabilities.yaml"))
        # nobody else's state was touched by refusals
        self.assertEqual(self.signals().count("DEPTH_BUMPED"), 1)

    def test_no_lease_no_bump_and_release_is_idempotent(self):
        self.refused("depth", "bump", "FAM-01.1", "L1", "--agent", "AGT-alpha", expect="do not hold a lease")
        self.lease("FAM-01.1")
        self.ok("lease", "release", "FAM-01.1", "--agent", "AGT-alpha")
        out = self.ok("lease", "release", "FAM-01.1", "--agent", "AGT-alpha")
        self.assertIn("already", out)
        self.refused("depth", "bump", "FAM-01.1", "L1", "--agent", "AGT-alpha", expect="do not hold a lease")

    def test_max_five_leases_for_scoped_builder(self):
        for n in range(1, 6):
            self.lease(f"FAM-01.{n}")
        self.refused("lease", "acquire", "FAM-02.1", "--agent", "AGT-alpha", expect="max 5")
        self.lease("FAM-02.2", "AGT-beta")  # someone else is fine

    def test_expired_lease_can_be_taken_over(self):
        self.lease("FAM-01.1", "AGT-alpha", T0, "--ttl-hours", "1")
        self.refused("lease", "acquire", "FAM-01.1", "--agent", "AGT-beta", now="2026-09-21T12:30:00Z")
        self.ok("lease", "acquire", "FAM-01.1", "--agent", "AGT-beta", now="2026-09-21T13:30:00Z")
        self.assertEqual(self.signals(), ["LEASE_ACQUIRED", "STALLED_LEASE_RELEASED", "LEASE_ACQUIRED"])
        self.refused("depth", "bump", "FAM-01.1", "L1", "--agent", "AGT-alpha", now="2026-09-21T13:31:00Z")

    def test_expired_holder_must_renew_before_bumping(self):
        self.lease("FAM-01.1", "AGT-alpha", T0, "--ttl-hours", "1")
        self.refused("depth", "bump", "FAM-01.1", "L1", "--agent", "AGT-alpha",
                     now="2026-09-21T14:00:00Z", expect="expired")
        self.ok("lease", "renew", "FAM-01.1", "--agent", "AGT-alpha", now="2026-09-21T14:00:00Z")
        self.ok("depth", "bump", "FAM-01.1", "L3", "--agent", "AGT-alpha", now="2026-09-21T14:01:00Z")

    def test_experiment_scope_is_enforced(self):
        self.refused("lease", "acquire", "FAM-12.1", "--agent", "AGT-alpha", "--experiment", "EXP-2026-002",
                     expect="not in the scope")
        self.refused("lease", "acquire", "FAM-01.1", "--agent", "AGT-alpha", "--experiment", "EXP-2026-999",
                     expect="unknown experiment")

    def test_crlf_files_stay_crlf(self):
        raw = (self.root / "state" / "capabilities.yaml").read_bytes().replace(b"\n", b"\r\n")
        (self.root / "state" / "capabilities.yaml").write_bytes(raw)
        self.lease("FAM-01.1")
        self.ok("depth", "bump", "FAM-01.1", "L3", "--agent", "AGT-alpha")
        out = (self.root / "state" / "capabilities.yaml").read_bytes()
        self.assertEqual(out.count(b"\n"), out.count(b"\r\n"))
        self.assertIn(b"depth: L3", out)


class Concurrency(BcpCase):
    def spawn(self, *args):
        return subprocess.Popen([sys.executable, str(SRC / "bcp_tool.py"), *args], env=self.env(),
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    @staticmethod
    def finish(proc):
        proc.communicate()
        return proc.returncode

    def test_race_for_one_capability_has_exactly_one_winner(self):
        procs = [self.spawn("lease", "acquire", "FAM-01.1", "--agent", f"AGT-r{i}") for i in range(8)]
        codes = sorted(self.finish(p) for p in procs)
        self.assertEqual(codes, [0] + [1] * 7)
        self.assertEqual(self.signals(), ["LEASE_ACQUIRED"])

    def test_parallel_writers_lose_nothing(self):
        procs = [self.spawn("lease", "acquire", cap, "--agent", f"AGT-p{i}")
                 for i, cap in enumerate(["FAM-10.1", "FAM-10.2", "FAM-10.3", "FAM-10.4", "FAM-11.1", "FAM-11.2"])]
        procs += [self.spawn("discovery", "add", "--agent", f"AGT-d{i}", "--applies-to", "FAM-01",
                             "--text", f"note {i}") for i in range(8)]
        self.assertEqual([self.finish(p) for p in procs], [0] * 14)
        import yaml
        leases = yaml.safe_load(self.state("leases.yaml"))["leases"]
        self.assertEqual(len(leases), 6)
        ids = sorted(d["id"] for d in yaml.safe_load(self.state("discoveries.yaml"))["discoveries"])
        self.assertEqual(ids, [f"DISC-{n:03d}" for n in range(1, 9)])
        self.assertEqual(self.validate_json()[1]["errors"], 0)


class LogAndNotes(BcpCase):
    def test_log_append_rules(self):
        self.refused("log", "append", "--agent", "AGT-alpha", "--signal", "LEASE_ACQUIRED", "--cap", "FAM-01.1",
                     expect="emitted automatically")
        self.refused("log", "append", "--agent", "AGT-alpha", "--signal", "MADE_UP", expect="not in the taxonomy")
        self.refused("log", "append", "--agent", "AGT-alpha", "--signal", "BLOCKED_ON_DEPENDENCY",
                     "--cap", "FAM-02.1", expect="needs --cap")
        self.ok("log", "append", "--agent", "AGT-alpha", "--signal", "REBALANCE_SUGGESTED", "--detail", "hi")
        self.ok("log", "append", "--agent", "AGT-alpha", "--signal", "BLOCKED_ON_DEPENDENCY",
                "--cap", "FAM-12.2", "--blocked-on", "FAM-12.1")
        entry = self.log_entries()[-1]
        self.assertEqual((entry["blocked_on"], entry["required_depth"]), ("FAM-12.1", "L1"))

    def test_discoveries_and_failures_get_sequential_ids_and_show_up(self):
        self.refused("discovery", "add", "--agent", "AGT-a", "--applies-to", "FAM-77", "--text", "x",
                     expect="not a known")
        self.ok("discovery", "add", "--agent", "AGT-a", "--applies-to", "FAM-02.1,FAM-03", "--text", "use fsync")
        self.ok("failure", "add", "--agent", "AGT-a", "--applies-to", "FAM-02.1", "--text", "mmap corrupted on kill")
        out = self.ok("show", "FAM-02.1")
        self.assertIn("DISC-001", out)
        self.assertIn("FAIL-001", out)
        self.assertIn("# Shared discovery log", self.state("discoveries.yaml"))  # header comment kept
        self.assertEqual(self.signals(), ["DISCOVERY_LOGGED", "FAILURE_LOGGED"])

    def test_available_skips_leased_and_blocked(self):
        self.lease("FAM-12.1")
        out = self.ok("available", "--scope", "FAM-11,FAM-12", "--limit", "50")
        self.assertNotIn("FAM-12.1 ", out)      # leased
        self.assertNotIn("FAM-12.2 ", out)      # blocked on FAM-12.1 >= L1
        self.assertIn("FAM-11.1 ", out)
        # scope + experiment = intersection (EXP-2026-002 is omega-only)
        self.assertIn("none available", self.ok("available", "--scope", "FAM-12", "--experiment", "EXP-2026-002"))


class Validator(BcpCase):
    def codes(self, now=T0):
        rc, report = self.validate_json(now)
        return rc, {f["code"] for f in report["findings"]}, report

    def test_hand_written_duplicate_lease_is_a_conflict_and_blocks_the_cli(self):
        self.write_state("leases.yaml", """version: 1
leases:
  FAM-01.1:
    leased_to: AGT-alpha
    status: active
    depth_target: L1
    leased_at: '2026-09-21T10:30:00Z'
    expires_at: '2026-09-21T18:30:00Z'
  FAM-01.1:
    leased_to: AGT-beta
    status: active
    depth_target: L1
    leased_at: '2026-09-21T11:00:00Z'
    expires_at: '2026-09-21T19:00:00Z'
""")
        rc, codes, _ = self.codes()
        self.assertEqual(rc, 1)
        self.assertIn("lease_conflict", codes)
        self.refused("lease", "acquire", "FAM-01.2", "--agent", "AGT-gamma", expect="more than once")
        # sweep resolves it deterministically: earlier lease wins
        self.ok("--fix", now=T0, script="sweep.py")
        import yaml
        leases = yaml.safe_load(self.state("leases.yaml"))["leases"]
        self.assertEqual(leases["FAM-01.1"]["leased_to"], "AGT-alpha")
        self.assertIn("LEASE_CONFLICT_DETECTED", self.signals())
        self.assertEqual(self.codes()[0], 0)
        self.lease("FAM-01.2", "AGT-gamma")

    def test_dependency_cycle_is_found_with_its_path(self):
        self.write_state("deps.yaml", self.state("deps.yaml") +
                         "  - { source: FAM-02.1, target: FAM-02.4, edge_type: REQUIRES, required_depth: L1 }\n")
        rc, codes, report = self.codes()
        self.assertEqual(rc, 1)
        cyc = next(f for f in report["findings"] if f["code"] == "dep_cycle")
        self.assertIn("FAM-02.1", cyc["message"])
        self.assertIn("FAM-02.4", cyc["message"])

    def test_taxonomy_violations_by_hand_edit(self):
        self.write_state("capabilities.yaml", self.state("capabilities.yaml")
                         .replace("FAM-03.1:", "FAM-3.1:").replace('name: "Host Core", depth: L2',
                                                                    'name: "Host Core", depth: L7'))
        rc, codes, _ = self.codes()
        self.assertEqual(rc, 1)
        self.assertLessEqual({"bad_id", "bad_depth", "unknown_ref"}, codes)

    def test_bad_log_entries_are_flagged_and_drift_is_reported(self):
        (self.root / "log").mkdir()
        (self.root / "log" / "2026-09-21.yaml").write_text(
            "- ts: 2026-09-21T11:00:00Z\n  agent: maintainer\n  signal: MADE_UP\n"
            "- ts: 2026-09-21T11:05:00Z\n  agent: AGT-alpha\n  signal: DEPTH_BUMPED\n"
            "  cap: FAM-01.1\n  to: L3\n", encoding="utf-8")
        rc, codes, _ = self.codes()
        self.assertEqual(rc, 1)
        self.assertLessEqual({"bad_id", "bad_signal", "depth_drift"}, codes)

    def test_wrong_shape_is_refused_not_overwritten(self):
        self.write_state("leases.yaml", "version: 1\nleases:\n  - FAM-01.1\n")
        rc, codes, _ = self.codes()
        self.assertEqual(rc, 1)
        self.assertIn("parse_error", codes)
        self.refused("lease", "acquire", "FAM-01.2", "--agent", "AGT-alpha", expect="mapping")
        self.assertIn("- FAM-01.1", self.state("leases.yaml"))  # untouched

    def test_malformed_yaml_is_reported_not_crashed(self):
        self.write_state("deps.yaml", "dependencies: [\n")
        rc, codes, _ = self.codes()
        self.assertEqual(rc, 1)
        self.assertIn("parse_error", codes)
        self.refused("lease", "acquire", "FAM-01.1", "--agent", "AGT-alpha", expect="invalid YAML")


class Sweep(BcpCase):
    def test_dry_run_changes_nothing(self):
        self.lease("FAM-01.1", "AGT-alpha", T0, "--ttl-hours", "1")
        before = self.snapshot()
        out = self.ok(now="2026-09-21T15:00:00Z", script="sweep.py")
        self.assertIn("would", out)
        self.assertEqual(self.snapshot(), before)

    def test_expired_and_stalled_leases_are_freed_and_metrics_are_real(self):
        self.lease("FAM-01.1", "AGT-alpha", T0, "--ttl-hours", "1")     # will expire
        self.lease("FAM-01.2", "AGT-beta", T0)                           # 8h ttl, goes silent
        self.lease("FAM-01.3", "AGT-gamma", T0)                          # heartbeats
        self.ok("lease", "renew", "FAM-01.3", "--agent", "AGT-gamma", now="2026-09-21T14:00:00Z")
        rc, out, _ = self.run_script("generate_views.py", now="2026-09-21T14:30:00Z")
        import yaml
        m = yaml.safe_load(self.state("metrics.yaml"))
        self.assertEqual((m["active_leases"], m["stalled_leases"]), (3, 2))
        self.ok("--fix", now="2026-09-21T14:30:00Z", script="sweep.py")
        leases = yaml.safe_load(self.state("leases.yaml"))["leases"]
        self.assertEqual({c: l["status"] for c, l in leases.items()},
                         {"FAM-01.1": "expired", "FAM-01.2": "expired", "FAM-01.3": "active"})
        m = yaml.safe_load(self.state("metrics.yaml"))
        self.assertEqual((m["active_leases"], m["stalled_leases"]), (1, 0))
        self.assertEqual(self.signals().count("STALLED_LEASE_RELEASED"), 2)
        # nothing left to do -> idempotent
        before = self.signals()
        out = self.ok("--fix", now="2026-09-21T14:31:00Z", script="sweep.py")
        self.assertIn("0 action(s)", out)
        self.assertEqual(self.signals(), before)

    def test_unblock_notification_is_sent_once(self):
        self.ok("log", "append", "--agent", "AGT-alpha", "--signal", "BLOCKED_ON_DEPENDENCY",
                "--cap", "FAM-12.2", "--blocked-on", "FAM-12.1")
        self.ok("--fix", now="2026-09-21T12:05:00Z", script="sweep.py")
        self.assertNotIn("DEPENDENCY_SATISFIED", self.signals())
        self.lease("FAM-12.1", "AGT-beta", "2026-09-21T12:10:00Z")
        self.ok("depth", "bump", "FAM-12.1", "L1", "--agent", "AGT-beta", now="2026-09-21T12:20:00Z")
        self.ok("--fix", now="2026-09-21T12:30:00Z", script="sweep.py")
        self.ok("--fix", now="2026-09-21T12:35:00Z", script="sweep.py")
        sat = [e for e in self.log_entries() if e["signal"] == "DEPENDENCY_SATISFIED"]
        self.assertEqual(len(sat), 1)
        self.assertEqual((sat[0]["addressed_to"], sat[0]["cap"]), ("AGT-alpha", "FAM-12.2"))

    def test_integration_trigger_flips_status_and_keeps_comments(self):
        exp = self.state("experiments.yaml")
        exp = exp.replace("status: abandoned", "status: active")
        exp = exp.replace("capabilities_in_scope: []", "capabilities_in_scope: [FAM-14.1]")
        self.write_state("experiments.yaml", exp)
        self.ok("--fix", now="2026-09-21T12:10:00Z", script="sweep.py")
        text = self.state("experiments.yaml")
        self.assertIn("status: merging", text)
        self.assertIn("# retired seed record", text)
        self.assertIn("INTEGRATION_READY", self.signals())

    def test_cycle_signal_emitted_once(self):
        self.write_state("deps.yaml", self.state("deps.yaml") +
                         "  - { source: FAM-02.1, target: FAM-02.4, edge_type: REQUIRES, required_depth: L1 }\n")
        rc, out, _ = self.run_script("sweep.py", "--fix", now="2026-09-21T12:10:00Z")
        self.assertEqual(rc, 1)  # error remains: humans must break the cycle
        self.run_script("sweep.py", "--fix", now="2026-09-21T12:15:00Z")
        self.assertEqual(self.signals().count("CYCLE_DETECTED"), 1)

    def test_sweep_log_is_itself_valid(self):
        self.lease("FAM-01.1", "AGT-alpha", T0, "--ttl-hours", "1")
        self.ok("--fix", now="2026-09-21T15:00:00Z", script="sweep.py")
        rc, report = self.validate_json("2026-09-21T15:01:00Z")
        self.assertEqual(rc, 0, report)


if __name__ == "__main__":
    unittest.main()
