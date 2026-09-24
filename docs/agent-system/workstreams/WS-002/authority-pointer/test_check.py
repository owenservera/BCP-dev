"""Tests for P1-02 authority-pointer pilot (stdlib unittest only)."""

import hashlib
import io
import json
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]  # repository root (HERE is already authority-pointer/)

sys.path.insert(0, str(HERE))
import check as ap


def run_report(head=None):
    return ap.build_report(ROOT, head)


def corpus_paths():
    return [ROOT / Path(*rel.split("/")) for rel in (ap.CORPUS + [ap.TARGET_DOC])]


def hash_corpus():
    h = hashlib.sha256()
    for p in sorted(corpus_paths(), key=lambda x: x.as_posix()):
        h.update(p.read_bytes())
        h.update(b"\n")
    return h.hexdigest()


class TestAuthorityPointer(unittest.TestCase):
    def test_corpus_integrity(self):
        for p in corpus_paths():
            self.assertTrue(p.is_file(), f"missing corpus file: {p}")

    def test_positive_contradiction_detected(self):
        rep = run_report()
        self.assertEqual(rep.get("status"), "OK")
        f1 = next(f for f in rep["findings"] if f["finding_id"] == "FINDING-001")
        self.assertEqual(f1["verdict"], "contradiction")
        self.assertEqual(f1["source"], "README.md")
        self.assertEqual(f1["target"], "ORCHESTRATION-REDESIGN.md")
        self.assertEqual(f1["target_classification"], "historical")
        self.assertIn("AGENTS.md", f1["governing_authority"])
        self.assertEqual(f1["action"], "report-only")
        self.assertEqual(f1["confidence"], "deterministic")

    def test_negative_freshness_head_equal(self):
        rep = run_report(head="de147d6")
        f2 = next(f for f in rep["findings"] if f["finding_id"] == "FINDING-002")
        self.assertEqual(f2["verdict"], "consistent-semantic-tip")

    def test_negative_freshness_head_moved(self):
        # HEAD has moved past the substantive tip (real main: ef26df8).
        # The semantic-tip convention must still prevent a stale verdict.
        rep = run_report(head="ef26df862aed16475d901840fce734f22a5e530a")
        f2 = next(f for f in rep["findings"] if f["finding_id"] == "FINDING-002")
        self.assertEqual(f2["verdict"], "consistent-semantic-tip")
        self.assertTrue(f2["literal_differs"])
        self.assertTrue(f2["semantic_convention_present"])

    def test_negative_freshness_live_head(self):
        rep = run_report()  # uses real git HEAD
        f2 = next(f for f in rep["findings"] if f["finding_id"] == "FINDING-002")
        self.assertEqual(f2["verdict"], "consistent-semantic-tip")

    def test_unresolved_preserved(self):
        rep = run_report()
        for fid, cid in (
            ("FINDING-003", "C8"),
            ("FINDING-004", "C11"),
            ("FINDING-005", "C12"),
        ):
            with self.subTest(cid=cid):
                f = next(x for x in rep["findings"] if x["finding_id"] == fid)
                self.assertEqual(f["conflict"], cid)
                self.assertEqual(f["status"], "OPEN")
                self.assertEqual(f["verdict"], "unresolved-preserved")
                self.assertEqual(f["action"], "report-only")

    def test_determinism(self):
        a = ap.build_report(ROOT, "ef26df862aed16475d901840fce734f22a5e530a")
        b = ap.build_report(ROOT, "ef26df862aed16475d901840fce734f22a5e530a")
        pa = json.dumps(a, indent=2, sort_keys=True, ensure_ascii=False) + "\n"
        pb = json.dumps(b, indent=2, sort_keys=True, ensure_ascii=False) + "\n"
        self.assertEqual(pa, pb)
        # CLI stdout path is also deterministic.
        buf1, buf2 = io.StringIO(), io.StringIO()
        with redirect_stdout(buf1):
            rc1 = ap.main(["--root", str(ROOT), "--head", "ef26df8"])
        with redirect_stdout(buf2):
            rc2 = ap.main(["--root", str(ROOT), "--head", "ef26df8"])
        self.assertEqual(rc1, 0)
        self.assertEqual(rc2, 0)
        self.assertEqual(buf1.getvalue(), buf2.getvalue())

    def test_read_only(self):
        before = hash_corpus()
        with tempfile.TemporaryDirectory() as td:
            out = Path(td) / "report.json"
            rc = ap.main(["--root", str(ROOT), "--output", str(out)])
            self.assertEqual(rc, 0)
            self.assertTrue(out.is_file())
        after = hash_corpus()
        self.assertEqual(before, after)

    def test_exit_code_gates(self):
        rep = run_report()
        self.assertTrue(rep["gates"]["positive_contradiction_detected"])
        self.assertTrue(rep["gates"]["negative_freshness_ignored"])
        self.assertTrue(rep["gates"]["unresolved_preserved"])
        self.assertTrue(rep["gates"]["all_required_hold"])

    def test_ordering_stable(self):
        rep = run_report()
        ids = [f["finding_id"] for f in rep["findings"]]
        self.assertEqual(ids, sorted(ids))
        self.assertEqual(rep["corpus"], sorted(rep["corpus"]))


if __name__ == "__main__":
    unittest.main()
