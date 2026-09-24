#!/usr/bin/env python3
"""agent_ingest.py - deterministic half of thinker-to-repo ingest.

Stdlib only. For each file in docs/agent-system/context/inbox/:
  1. sha256-hash it;
  2. move it byte-identical to docs/agent-system/transcripts/<date>/
     THINKER-<timestamp>-<slug>.md with the mandatory transcript front-matter;
  3. write an ingest receipt to context/ingest-receipts/;
  4. convert any CONTEXT DEPOSIT v1 blocks into insight files
     (author thinker:<name>, status PROPOSED).

Judgment half (raw chats without a deposit block) stays with the agent - see
context/INGEST.md. The L2 plugin prompts for it after running this script.
"""

import hashlib
import os
import re
import sys
import time

import agent_lint as lint

REPO = lint.REPO
INBOX = os.path.join(lint.CONTEXT, "inbox")
TRANSCRIPTS = lint.TRANSCRIPTS
INSIGHTS = os.path.join(lint.CONTEXT, "insights")
RECEIPTS = os.path.join(lint.CONTEXT, "ingest-receipts")

DEPOSIT_BEGIN = "=== CONTEXT DEPOSIT v1 ==="
DEPOSIT_END = "=== END DEPOSIT ==="


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def slugify(name):
    base = os.path.splitext(os.path.basename(name))[0]
    slug = re.sub(r"[^A-Za-z0-9]+", "-", base).strip("-").lower()
    return slug[:60] or "deposit"


def parse_deposit(text):
    """Parse v1 deposit blocks with a stdlib line parser.

    Returns list of dicts. Continuation lines (indented by >=2 spaces)
    append to the current field.
    """
    items = []
    in_block = False
    block_session = ""
    block_mission = ""
    cur = None
    cur_key = None
    for line in text.splitlines():
        if line.strip() == DEPOSIT_BEGIN:
            in_block = True
            block_session = ""
            block_mission = ""
            continue
        if line.strip() == DEPOSIT_END:
            if cur:
                items.append(cur)
                cur = None
            in_block = False
            continue
        if not in_block:
            continue
        if line.startswith("--- item"):
            if cur:
                items.append(cur)
            cur = {"session": block_session, "mission": block_mission}
            cur_key = None
            continue
        if cur is None:
            # block header lines before the first --- item
            if line.startswith("session:"):
                block_session = line.split(":", 1)[1].strip()
            elif line.startswith("mission:"):
                block_mission = line.split(":", 1)[1].strip()
            continue
        if line.startswith("session:") and not cur:
            cur["session"] = line.split(":", 1)[1].strip()
            continue
        if line.startswith("mission:") and "mission" not in cur:
            cur["mission"] = line.split(":", 1)[1].strip()
            continue
        m = re.match(r"^([a-z]+):\s?(.*)$", line)
        if m and not line.startswith(" ") and not line.startswith("\t"):
            cur_key = m.group(1)
            cur[cur_key] = m.group(2)
            continue
        if cur_key and (line.startswith("  ") or line.startswith("\t")):
            cur[cur_key] = cur.get(cur_key, "") + "\n" + line.strip()
    return [i for i in items if i.get("title") or i.get("claim")]


def insight_filename(ts, title):
    slug = re.sub(r"[^A-Za-z0-9]+", "-", title).strip("-").lower()[:50]
    return "%s-%s.md" % (ts, slug or "insight")


def deposit_to_insight(item, session, ts):
    kind = str(item.get("kind", "FINDING")).upper()
    if kind not in ("DESIGN", "DECISION", "FINDING", "QUESTION", "RISK",
                    "REJECTED"):
        kind = "FINDING"
    thinker = session.split(" ")[0] if session else "unknown"
    mission = item.get("mission", "") or ""
    to = item.get("to", "agent") if kind == "QUESTION" else ""
    conf = str(item.get("confidence", "med")).lower()
    if conf not in ("low", "med", "high"):
        conf = "med"
    iid = "INS-%s" % ts.replace("-", "")
    lines = []
    lines.append("# %s" % item.get("title", "untitled"))
    lines.append("")
    lines.append("> **Classification: PROPOSED - CURRENT**")
    lines.append("")
    lines.append("```yaml")
    lines.append("id: %s" % iid)
    lines.append("date: %s" % ts[:8])
    lines.append("author: thinker:%s" % thinker)
    lines.append("mission: %s" % mission)
    lines.append("kind: %s" % kind)
    lines.append("status: PROPOSED")
    if item.get("answers"):
        lines.append("answers: %s" % item["answers"].strip())
    if to:
        lines.append("to: %s" % to)
    lines.append("confidence: %s" % conf)
    lines.append("sources: thinker deposit %s" % session)
    lines.append("```")
    lines.append("")
    lines.append("## Claim")
    lines.append("")
    lines.append(item.get("claim", "").strip())
    lines.append("")
    lines.append("## Why")
    lines.append("")
    lines.append(item.get("why", "").strip())
    lines.append("")
    lines.append("## Alternatives considered or rejected")
    lines.append("")
    lines.append(item.get("alternatives", "").strip() or "None recorded.")
    lines.append("")
    lines.append("## Consequences")
    lines.append("")
    lines.append("In force for the mission only if a later note supersedes "
                 "this to ADOPTED; never Omega law.")
    lines.append("")
    lines.append("## Evidence")
    lines.append("")
    lines.append("Thinker session deposit; verify against repo before acting.")
    lines.append("")
    return ("\n".join(lines), iid)


def ingest_one(path):
    fname = os.path.basename(path)
    digest = sha256_file(path)
    with open(path, "rb") as f:
        raw = f.read()
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        text = raw.decode("utf-8", errors="replace")
    mtime = os.path.getmtime(path)
    date = time.strftime("%Y-%m-%d", time.localtime(mtime))
    ts = time.strftime("%Y%m%d-%H%M%S", time.localtime())
    slug = slugify(fname)
    dest_dir = os.path.join(TRANSCRIPTS, date)
    os.makedirs(dest_dir, exist_ok=True)
    dest = os.path.join(dest_dir, "THINKER-%s-%s.md" % (ts, slug))
    items = parse_deposit(text)
    session = items[0].get("session", "") if items else ""
    m_ws = re.search(r"WS-\d+", text)
    ws = m_ws.group(0) if m_ws else "UNKNOWN"
    front = []
    front.append("---")
    front.append("session_id: THINKER-%s-%s" % (ts, slug))
    front.append("source: thinker")
    front.append("date: %s" % date)
    front.append("workstreams: [%s]" % ws)
    front.append("repository_tip: unknown")
    front.append("participants: [thinker]")
    front.append("status: ingested")
    front.append("source_file: %s" % fname)
    front.append("source_sha256: %s" % digest)
    front.append("---")
    front.append("")
    with open(dest, "wb") as f:
        f.write(("\n".join(front)).encode("utf-8"))
        f.write(raw)
    os.makedirs(INSIGHTS, exist_ok=True)
    created = []
    for item in items:
        sess = item.get("session", session)
        body, iid = deposit_to_insight(item, sess, ts)
        ipath = os.path.join(INSIGHTS, insight_filename(
            ts, item.get("title", "insight")))
        n = 1
        base = ipath
        while os.path.exists(ipath):
            n += 1
            ipath = base[:-3] + "-%d.md" % n
        with open(ipath, "w", encoding="utf-8") as f:
            f.write(body)
        created.append((ipath, iid))
    os.makedirs(RECEIPTS, exist_ok=True)
    rpath = os.path.join(RECEIPTS, "%s-%s.md" % (ts, slug))
    with open(rpath, "w", encoding="utf-8") as f:
        f.write("# Ingest receipt %s\n\n" % ts)
        f.write("> **Classification: DERIVED - CURRENT**\n\n")
        f.write("- source: context/inbox/%s\n" % fname)
        f.write("- sha256: %s\n" % digest)
        f.write("- archived: %s\n"
                % os.path.relpath(dest, REPO).replace(os.sep, "/"))
        f.write("- deposit items: %d\n" % len(items))
        for ipath, iid in created:
            f.write("- insight: %s (%s)\n"
                    % (os.path.relpath(ipath, REPO).replace(os.sep, "/"),
                       iid))
        if not items:
            f.write("- judgment half owed: raw chat with no deposit block; "
                    "agent must read the transcript and write insights.\n")
    os.remove(path)
    print("ingested %s -> %s (%d insights)" % (
        fname, os.path.relpath(dest, REPO).replace(os.sep, "/"),
        len(created)))
    return len(created)


def main(_argv):
    if not os.path.isdir(INBOX):
        print("inbox: empty (no inbox dir)")
        return 0
    files = sorted(f for f in os.listdir(INBOX)
                   if os.path.isfile(os.path.join(INBOX, f))
                   and not f.startswith("."))
    if not files:
        print("inbox: empty")
        return 0
    total = 0
    for f in files:
        total += ingest_one(os.path.join(INBOX, f))
    print("ingest: %d file(s), %d insight(s)" % (len(files), total))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
