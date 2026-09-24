#!/usr/bin/env python3
"""Unit tests for agent_lint / agent_views / agent_ingest / agent_wip.

Stdlib unittest only. Each test builds a throwaway git repo under
tempfile and repoints the tools at it, so every refusal path is exercised
without touching the real repository.
"""

import os
import shutil
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(HERE)
sys.path.insert(0, TOOLS)

import agent_ingest as ingest
import agent_lint as lint
import agent_views as views
import agent_wip as wip

GOOD_STATE = """# STATE.md

> **Classification: DERIVED - CURRENT**

```yaml
mission_id: demo
agent_id: IMPL-04
branch: mission/demo
last_commit_inspected: abc123
updated: 2026-09-24
status: ACTIVE
```

## POSITION

Somewhere.

## DONE

- Nothing yet.

## IN_PROGRESS

- Testing.

## NEXT_ACTION

Run the tests.

## UNCOMMITTED

None.

## DECISIONS_IN_FORCE

None.

## OPEN_QUESTIONS

None.

## ESCALATIONS

None.

## DO_NOT

- Touch anything Tier 2.

## RESUME

1. Read this file.
2. Continue.
"""

GOOD_CHARTER = """# CHARTER.md

> **Classification: DERIVED - CURRENT**

```yaml
mission_id: demo
goal: Test mission.
done_criteria:
  - Tests pass.
write_allowlist:
  - docs/agent-system/**
  - agent-tools/**
budget:
  wall_hours: 8
  commits: 60
escalation_triggers:
  - Tier 2 action needed.
tier_ceiling: 1
approved_by: owner (chat, 2026-09-24)
approved_on: 2026-09-24
status: ACTIVE
```

## Goal

Test.

## Non-goals

None.
"""


class Harness(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="amp-test-")
        self.ggit("init")
        self.ggit("config", "user.email", "test@example.com")
        self.ggit("config", "user.name", "Test")
        self.ggit("config", "commit.gpgsign", "false")
        # Point every tool module at the throwaway repo.
        agent_sys = os.path.join(self.tmp, "docs", "agent-system")
        missions = os.path.join(agent_sys, "missions")
        context = os.path.join(agent_sys, "context")
        for mod in (lint, views, ingest, wip):
            mod.REPO = self.tmp
        lint.AGENT_SYS = agent_sys
        lint.MISSIONS = missions
        lint.CONTEXT = context
        lint.TRANSCRIPTS = os.path.join(agent_sys, "transcripts")
        lint.PACKETS = os.path.join(agent_sys, "packets")
        lint.CURRENT = os.path.join(agent_sys, "CURRENT.md")
        views.MISSIONS = missions
        views.CONTEXT = context
        views.INSIGHTS = os.path.join(context, "insights")
        views.INBOX = os.path.join(context, "inbox")
        ingest.INBOX = os.path.join(context, "inbox")
        ingest.TRANSCRIPTS = os.path.join(agent_sys, "transcripts")
        ingest.INSIGHTS = os.path.join(context, "insights")
        ingest.RECEIPTS = os.path.join(context, "ingest-receipts")
        os.makedirs(os.path.join(missions, "demo"), exist_ok=True)
        os.makedirs(os.path.join(context, "insights"), exist_ok=True)
        os.makedirs(os.path.join(context, "inbox"), exist_ok=True)
        os.makedirs(os.path.join(agent_sys, "transcripts"), exist_ok=True)
        os.makedirs(lint.PACKETS, exist_ok=True)
        self.write("docs/agent-system/CURRENT.md", "# CURRENT\n\n"
                   "> **Classification: DERIVED - CURRENT**\n")
        self.write("docs/agent-system/missions/demo/CHARTER.md", GOOD_CHARTER)
        self.write("docs/agent-system/missions/demo/STATE.md", GOOD_STATE)
        self.ggit("add", "-A")
        self.ggit("commit", "-m", "init\n\nState-Unchanged: scaffold")

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def ggit(self, *args):
        p = subprocess.run(["git"] + list(args), cwd=self.tmp,
                           capture_output=True, text=True, timeout=60)
        return p

    def write(self, rel, text):
        p = os.path.join(self.tmp, rel.replace("/", os.sep))
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            f.write(text)

    def read(self, rel):
        with open(os.path.join(self.tmp, rel.replace("/", os.sep)), "r",
                  encoding="utf-8") as f:
            return f.read()

    def commit_all(self, msg):
        self.ggit("add", "-A")
        return self.ggit("commit", "-m", msg)


class TestBannersAndLinks(Harness):
    def test_banner_missing_refused(self):
        self.write("docs/agent-system/missions/demo/STATE.md",
                   "# no banner here\n")
        self.assertFalse(lint.check_banners(True))

    def test_banner_invalid_class_refused(self):
        self.write("docs/agent-system/missions/demo/STATE.md",
                   "> **Classification: BOGUS - CURRENT**\n")
        self.assertFalse(lint.check_banners(True))

    def test_banner_good_passes(self):
        self.assertTrue(lint.check_banners(True))

    def test_broken_link_refused(self):
        self.write("docs/agent-system/missions/demo/STATE.md",
                   GOOD_STATE + "\n[nope](does/not-exist.md)\n")
        self.assertFalse(lint.check_links(True))

    def test_current_budget_refused(self):
        self.write("docs/agent-system/CURRENT.md",
                   "\n".join("line %d" % i for i in range(200)) + "\n")
        self.assertFalse(lint.check_current_budget(True))


class TestImmutability(Harness):
    def seed_tracked(self, rel, text):
        self.write(rel, text)
        self.commit_all("seed %s\n\nState-Unchanged: seed" % rel)

    def test_insight_edit_refused(self):
        rel = "docs/agent-system/context/insights/20260924-120000-test.md"
        self.seed_tracked(rel, "> **Classification: PROPOSED - CURRENT**\n")
        self.write(rel, "> **Classification: PROPOSED - CURRENT**\nchanged\n")
        self.ggit("add", "-A")
        entries = lint.changed_paths(True)
        self.assertFalse(lint.check_immutability(entries, True))

    def test_transcript_edit_refused(self):
        rel = "docs/agent-system/transcripts/2026-09-24/CHAT-x.md"
        self.seed_tracked(rel, "transcript\n")
        self.write(rel, "transcript edited\n")
        self.ggit("add", "-A")
        entries = lint.changed_paths(True)
        self.assertFalse(lint.check_immutability(entries, True))

    def test_packet_edit_refused(self):
        rel = "docs/agent-system/packets/PKT-999-test.md"
        self.seed_tracked(rel, "packet\n")
        self.write(rel, "packet edited\n")
        self.ggit("add", "-A")
        entries = lint.changed_paths(True)
        self.assertFalse(lint.check_immutability(entries, True))

    def test_new_insight_allowed(self):
        self.write("docs/agent-system/context/insights/20260924-120001-n.md",
                   "> **Classification: PROPOSED - CURRENT**\n")
        self.ggit("add", "-A")
        entries = lint.changed_paths(True)
        self.assertTrue(lint.check_immutability(entries, True))


class TestState(Harness):
    def test_missing_field_refused(self):
        bad = GOOD_STATE.replace("agent_id: IMPL-04\n", "")
        self.write("docs/agent-system/missions/demo/STATE.md", bad)
        self.assertFalse(lint.check_states(True))

    def test_missing_section_refused(self):
        bad = GOOD_STATE.replace("## RESUME", "## GONE")
        self.write("docs/agent-system/missions/demo/STATE.md", bad)
        self.assertFalse(lint.check_states(True))

    def test_branch_mismatch_refused(self):
        self.ggit("checkout", "-b", "mission/demo")
        bad = GOOD_STATE.replace("branch: mission/demo",
                                 "branch: mission/other")
        self.write("docs/agent-system/missions/demo/STATE.md", bad)
        self.assertFalse(lint.check_states(True, None, "mission/demo"))

    def test_branch_match_passes(self):
        self.ggit("checkout", "-b", "mission/demo")
        self.assertTrue(lint.check_states(True, None, "mission/demo"))

    def test_clean_claim_over_dirty_tree_refused(self):
        self.write("docs/agent-system/missions/demo/extra.txt", "x")
        bad = GOOD_STATE.replace("## UNCOMMITTED\n\nNone.",
                                 "## UNCOMMITTED\n\ntree clean")
        self.write("docs/agent-system/missions/demo/STATE.md", bad)
        self.assertFalse(lint.check_clean_claims(True))

    def test_done_with_escalations_refused(self):
        bad = GOOD_STATE.replace("status: ACTIVE", "status: DONE")
        bad = bad.replace("## ESCALATIONS\n\nNone.",
                          "## ESCALATIONS\n\n- Tier 2 needed, still open.")
        self.write("docs/agent-system/missions/demo/STATE.md", bad)
        self.assertFalse(lint.check_states(True))

    def test_done_without_escalations_passes(self):
        bad = GOOD_STATE.replace("status: ACTIVE", "status: DONE")
        self.write("docs/agent-system/missions/demo/STATE.md", bad)
        self.assertTrue(lint.check_states(True))


class TestAllowlist(Harness):
    def test_outside_allowlist_refused(self):
        entries = [("M", "omega-baseline/omega-final/some-file.txt")]
        self.assertFalse(lint.check_allowlist(entries, True, "demo",
                                              "mission/demo"))

    def test_inside_allowlist_passes(self):
        entries = [("M", "docs/agent-system/missions/demo/STATE.md"),
                   ("A", "agent-tools/agent_x.py")]
        self.assertTrue(lint.check_allowlist(entries, True, "demo",
                                             "mission/demo"))

    def test_tier0_always_allowed(self):
        entries = [("M", "docs/agent-system/context/DIGEST.md")]
        self.assertTrue(lint.check_allowlist(entries, True, "demo",
                                             "mission/demo"))

    def test_allowlist_ignore_covers_preexisting(self):
        charter = GOOD_CHARTER.replace(
            "tier_ceiling: 1",
            "allowlist_ignore:\n  - hands-off/**\ntier_ceiling: 1")
        self.write("docs/agent-system/missions/demo/CHARTER.md", charter)
        entries = [("?", "hands-off/legacy.bin")]
        self.assertTrue(lint.check_allowlist(entries, True, "demo",
                                             "mission/demo"))
        entries = [("?", "elsewhere/new-file.txt")]
        self.assertFalse(lint.check_allowlist(entries, True, "demo",
                                              "mission/demo"))


class TestL1Message(Harness):
    def test_no_state_no_trailer_refused(self):
        self.ggit("checkout", "-b", "mission/demo")
        staged = [("M", "agent-tools/agent_lint.py")]
        self.assertFalse(lint.check_l1_message("do stuff", staged, True))

    def test_trailer_excuses_state_touch(self):
        self.ggit("checkout", "-b", "mission/demo")
        staged = [("M", "agent-tools/agent_lint.py")]
        self.assertTrue(lint.check_l1_message(
            "do stuff\n\nState-Unchanged: docs-only fix", staged, True))

    def test_state_touch_passes(self):
        self.ggit("checkout", "-b", "mission/demo")
        staged = [("M", "docs/agent-system/missions/demo/STATE.md")]
        self.assertTrue(lint.check_l1_message("progress", staged, True))

    def test_decision_without_insight_refused(self):
        self.ggit("checkout", "-b", "mission/demo")
        staged = [("M", "docs/agent-system/missions/demo/STATE.md")]
        self.assertFalse(lint.check_l1_message(
            "progress\n\nDecision: my-slug", staged, True))

    def test_decision_with_insight_passes(self):
        self.ggit("checkout", "-b", "mission/demo")
        rel = "docs/agent-system/context/insights/20260924-120000-my-slug.md"
        self.write(rel, "> **Classification: PROPOSED - CURRENT**\n")
        self.ggit("add", "-A")
        staged = [("A", rel.replace(os.sep, "/")),
                  ("M", "docs/agent-system/missions/demo/STATE.md")]
        self.assertTrue(lint.check_l1_message(
            "progress\n\nDecision: my-slug", staged, True))


DEPOSIT_FIXTURE = """hello thinker session about WS-001

=== CONTEXT DEPOSIT v1 ===
session: tester 2026-09-24
mission: demo
--- item
kind: DECISION
title: Use stdlib only
claim: Tools use only the standard library.
why: No new dependencies allowed.
  Keeps the gate runnable everywhere.
alternatives: Allow pip packages.
confidence: high
--- item
kind: QUESTION
title: Hook order
claim: Should flush run before ralph?
why: Both react to idle.
alternatives: Either order.
to: thinker
confidence: med
=== END DEPOSIT ===
"""


class TestIngest(Harness):
    def test_deposit_ingest(self):
        before = "fixture body\n"
        self.write("docs/agent-system/context/inbox/chat.md",
                   before + DEPOSIT_FIXTURE)
        src = os.path.join(self.tmp, "docs", "agent-system", "context",
                           "inbox", "chat.md")
        with open(src, "rb") as f:
            raw = f.read()
        import hashlib
        digest = hashlib.sha256(raw).hexdigest()
        rc = ingest.main([])
        self.assertEqual(rc, 0)
        # inbox drained
        self.assertFalse(os.path.exists(src))
        # transcript archived byte-identical after front-matter
        tdir = os.path.join(self.tmp, "docs", "agent-system", "transcripts")
        found = []
        for dp, _, fns in os.walk(tdir):
            for fn in fns:
                if fn.startswith("THINKER-"):
                    found.append(os.path.join(dp, fn))
        self.assertEqual(len(found), 1)
        with open(found[0], "rb") as f:
            content = f.read()
        self.assertTrue(content.endswith(raw))
        self.assertIn(digest.encode("utf-8"), content)
        # two insights created, thinker author, PROPOSED
        idir = os.path.join(self.tmp, "docs", "agent-system", "context",
                            "insights")
        insights = [f for f in os.listdir(idir) if f.endswith(".md")]
        self.assertEqual(len(insights), 2)
        bodies = []
        for fn in insights:
            with open(os.path.join(idir, fn), encoding="utf-8") as f:
                bodies.append(f.read())
        self.assertTrue(any("author: thinker:tester" in b for b in bodies))
        self.assertTrue(all("status: PROPOSED" in b for b in bodies))
        self.assertTrue(any("to: thinker" in b for b in bodies))
        self.assertTrue(any("Keeps the gate runnable everywhere." in b
                            for b in bodies))

    def test_raw_ingest_judgment_owed(self):
        self.write("docs/agent-system/context/inbox/raw.md",
                   "just a chat export, no deposit block\n")
        rc = ingest.main([])
        self.assertEqual(rc, 0)
        rdir = os.path.join(self.tmp, "docs", "agent-system", "context",
                            "ingest-receipts")
        receipts = os.listdir(rdir)
        self.assertEqual(len(receipts), 1)
        with open(os.path.join(rdir, receipts[0]),
                  encoding="utf-8") as f:
            self.assertIn("judgment half owed", f.read())


class TestWip(Harness):
    def test_snapshot_without_touching_branch(self):
        self.ggit("checkout", "-b", "mission/demo")
        head_before = self.ggit("rev-parse", "HEAD").stdout.strip()
        self.write("work.txt", "uncommitted work\n")
        self.write("docs/agent-system/missions/demo/STATE.md",
                   GOOD_STATE + "\n")
        rc = wip.snapshot("demo")
        self.assertEqual(rc, 0)
        # branch, index, worktree untouched
        self.assertEqual(self.ggit("rev-parse", "HEAD").stdout.strip(),
                         head_before)
        self.assertEqual(self.ggit("branch", "--show-current").stdout.strip(),
                         "mission/demo")
        with open(os.path.join(self.tmp, "work.txt"),
                  encoding="utf-8") as f:
            self.assertEqual(f.read(), "uncommitted work\n")
        code = self.ggit("diff", "--cached", "--quiet").returncode
        self.assertEqual(code, 0)
        refs = self.ggit("for-each-ref", "refs/wip/demo/",
                        "--format=%(refname)").stdout.strip()
        self.assertTrue(refs.startswith("refs/wip/demo/"))
        # snapshot commit contains the uncommitted file
        tree = self.ggit("ls-tree", refs, "--name-only").stdout
        self.assertIn("work.txt", tree)


class TestViews(Harness):
    def seed_insight(self, fn, kind, status, to=None):
        fm = ("id: X\ndate: 20260924\nauthor: IMPL-04\nmission: demo\n"
              "kind: %s\nstatus: %s\n" % (kind, status))
        if to:
            fm += "to: %s\n" % to
        fm += "confidence: high\nsources: test\n"
        body = ("# T\n\n> **Classification: PROPOSED - CURRENT**\n\n"
                "```yaml\n%s```\n\n## Claim\n\nClaim text.\n" % fm)
        self.write("docs/agent-system/context/insights/" + fn, body)

    def test_digest_brief_line_limits(self):
        for i in range(20):
            self.seed_insight("20260924-1200%02d-i.md" % i, "FINDING",
                              "PROPOSED")
        self.seed_insight("20260924-130000-d.md", "DECISION", "ADOPTED")
        self.seed_insight("20260924-130001-q.md", "QUESTION", "PROPOSED",
                          "thinker")
        self.assertEqual(views.cmd_digest([]), 0)
        with open(os.path.join(self.tmp, "docs", "agent-system", "context",
                               "DIGEST.md"), encoding="utf-8") as f:
            self.assertLessEqual(sum(1 for _ in f), views.DIGEST_BUDGET)
        self.assertEqual(views.cmd_brief([]), 0)
        with open(os.path.join(self.tmp, "docs", "agent-system", "context",
                               "THINKER-BRIEF.md"), encoding="utf-8") as f:
            self.assertLessEqual(sum(1 for _ in f), views.BRIEF_BUDGET)
        self.assertEqual(views.cmd_index([]), 0)
        self.assertTrue(os.path.isfile(os.path.join(
            self.tmp, "docs", "agent-system", "missions", "INDEX.md")))

    def test_resume_flags(self):
        self.ggit("checkout", "-b", "mission/demo")
        # branch mismatch
        bad = GOOD_STATE.replace("branch: mission/demo",
                                 "branch: mission/other")
        self.write("docs/agent-system/missions/demo/STATE.md", bad)
        import io
        from contextlib import redirect_stdout
        buf = io.StringIO()
        with redirect_stdout(buf):
            views.cmd_resume(["demo"])
        self.assertIn("FLAG: branch mismatch", buf.getvalue())
        # stale tip: point at a commit that is not an ancestor
        self.write("docs/agent-system/missions/demo/STATE.md", GOOD_STATE)
        orphan = self.ggit("rev-parse", "HEAD").stdout.strip()
        self.write("more.txt", "x")
        self.commit_all("second\n\nState-Unchanged: test")
        bad2 = GOOD_STATE.replace("last_commit_inspected: abc123",
                                  "last_commit_inspected: deadbee")
        self.write("docs/agent-system/missions/demo/STATE.md", bad2)
        buf2 = io.StringIO()
        with redirect_stdout(buf2):
            views.cmd_resume(["demo"])
        self.assertIn("FLAG: stale tip", buf2.getvalue())
        self.assertIn("NEXT_ACTION", buf2.getvalue())
        self.assertNotIn(orphan + " AncestorProblem", buf2.getvalue())


if __name__ == "__main__":
    unittest.main()
