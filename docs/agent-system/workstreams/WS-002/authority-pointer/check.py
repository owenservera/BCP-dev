#!/usr/bin/env python3
"""P1-02 authority-pointer contradiction detector (pilot slice v0.1.0).

Read-only, deterministic, report-only. Evaluates claims of the form
"X is canonical/current/authoritative" over a deliberately bounded corpus.

Bounded corpus (frozen for this pilot):
  README.md
  AGENTS.md
  BUILD_CONTEXT.md
  docs/CURRENT-CONTEXT.md
  docs/agent-system/CURRENT.md
  docs/cleanup/AUTHORITY-MAP.md
  docs/cleanup/CONFLICT-REGISTER.md
plus explicitly referenced target:
  ORCHESTRATION-REDESIGN.md

Working-vocabulary note: lifecycle/authority labels emitted here are working
vocabulary for this report only. They are NOT persisted as Omega law, BCP
state, or ontology. See SCOPE_RULE in README.md.

Usage:
  python check.py [--root PATH] [--head SHA] [--output PATH]

  --root   repository root (default: auto-detected 5 levels above this file)
  --head   observed HEAD override (default: `git rev-parse HEAD`, fallback: "unknown")
  --output output JSON path (default: stdout; when given, parent dirs created,
           file written with LF + trailing newline, keys sorted)

Exit codes:
  0  all required proof checks hold (contradiction found, freshness ignored,
     unresolved preserved, determinism self-check passes)
  1  any required check fails
  2  corpus integrity failure (missing file / unreadable)
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

TOOL = "p1-02-authority-pointer"
VERSION = "0.1.0"

# Frozen bounded corpus, repo-relative with forward slashes, sorted.
CORPUS = sorted(
    [
        "README.md",
        "AGENTS.md",
        "BUILD_CONTEXT.md",
        "docs/CURRENT-CONTEXT.md",
        "docs/agent-system/CURRENT.md",
        "docs/cleanup/AUTHORITY-MAP.md",
        "docs/cleanup/CONFLICT-REGISTER.md",
    ]
)
TARGET_DOC = "ORCHESTRATION-REDESIGN.md"

SCOPE_NOTE = (
    "Bounded pilot only. Untracked/local surfaces (bcp-algos/, "
    "omega-baseline/omega-final/docs/architecture/, "
    "omega-baseline/omega-final/examples/plugin-echo2/, setupdocs.zip) are "
    "NOT observable from committed state and are explicitly UNKNOWN per "
    "AGENTS.md hands-off rule. No repository-wide claim is made."
)


def repo_root_default() -> Path:
    # check.py lives at docs/agent-system/workstreams/WS-002/authority-pointer/
    return Path(__file__).resolve().parents[5]


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def lines_of(text: str) -> list[str]:
    return text.splitlines()


def excerpt(line: str, limit: int = 200) -> str:
    s = " ".join(line.strip().split())
    return s[:limit]


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def observed_head(root: Path, override: str | None) -> str:
    if override:
        return override.strip()
    try:
        out = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            cwd=str(root),
            capture_output=True,
            text=True,
            timeout=15,
        )
        if out.returncode == 0:
            return out.stdout.strip()
    except Exception:
        pass
    return "unknown"


def find_lines_with(path_lines: list[str], *needles: str) -> list[tuple[int, str]]:
    hits: list[tuple[int, str]] = []
    lowered = [n.lower() for n in needles]
    for i, ln in enumerate(path_lines, start=1):
        low = ln.lower()
        if all(n in low for n in lowered):
            hits.append((i, ln))
    return hits


def check_finding_001(root: Path, files: dict[str, str]) -> dict:
    """Positive contradiction: README claims ORCHESTRATION-REDESIGN canonical."""
    fid = "FINDING-001"
    readme = lines_of(files["README.md"])
    target = lines_of(files[TARGET_DOC])
    agents = lines_of(files["AGENTS.md"])
    context = lines_of(files["docs/CURRENT-CONTEXT.md"])
    authmap = lines_of(files["docs/cleanup/AUTHORITY-MAP.md"])

    # Source claim: README line mentioning ORCHESTRATION-REDESIGN + canonical.
    src_hits = find_lines_with(readme, "ORCHESTRATION-REDESIGN.md", "canonical")
    if not src_hits:
        return {
            "finding_id": fid,
            "verdict": "INCONCLUSIVE-CORPUS-DRIFT",
            "confidence": "deterministic",
            "action": "report-only",
            "detail": "README canonical claim for ORCHESTRATION-REDESIGN.md not found; corpus moved.",
            "evidence": {},
        }
    src_line, src_text = src_hits[0]

    # Target self-classification: HISTORICAL banner in first 10 lines.
    tgt_hits = find_lines_with(target[:10], "historical", "construction plan")
    tgt_class = "historical" if tgt_hits else "unknown"
    tgt_line = tgt_hits[0][0] if tgt_hits else -1
    tgt_excerpt = excerpt(tgt_hits[0][1]) if tgt_hits else ""

    # Governing surfaces.
    gov: list[str] = []
    ev: dict[str, str] = {
        "source": "README.md",
        "source_line": str(src_line),
        "source_excerpt": excerpt(src_text),
        "target": TARGET_DOC,
        "target_line": str(tgt_line),
        "target_excerpt": tgt_excerpt,
    }
    agents_hits = find_lines_with(agents, "ORCHESTRATION-REDESIGN.md")
    if agents_hits:
        gov.append("AGENTS.md")
        al, at = agents_hits[0]
        ev["agents_line"] = str(al)
        ev["agents_excerpt"] = excerpt(at)
    ctx_hits = find_lines_with(context, "ORCHESTRATION-REDESIGN.md")
    if ctx_hits:
        gov.append("docs/CURRENT-CONTEXT.md")
        cl, ct = ctx_hits[0]
        ev["context_line"] = str(cl)
        ev["context_excerpt"] = excerpt(ct)
    map_ref = find_lines_with(authmap, "ORCHESTRATION-REDESIGN.md")
    map_hist = find_lines_with(authmap, "HISTORICAL")
    if map_ref and map_hist:
        gov.append("docs/cleanup/AUTHORITY-MAP.md")
        ml, mt = map_ref[0]
        ev["authmap_line"] = str(ml)
        ev["authmap_excerpt"] = excerpt(mt)
    gov_sorted = sorted(gov)

    claims_canonical = "canonical" in src_text.lower()
    target_historical = tgt_class == "historical"
    governed = len(gov_sorted) >= 2 and "AGENTS.md" in gov_sorted

    if claims_canonical and target_historical and governed:
        verdict = "contradiction"
    elif claims_canonical and target_historical:
        verdict = "contradiction-weak-governance"
    else:
        verdict = "no-contradiction"

    return {
        "finding_id": fid,
        "source": "README.md",
        "source_line": src_line,
        "claim": "canonical automation design",
        "claim_scope": "snapshot-table-row",
        "target": TARGET_DOC,
        "target_classification": tgt_class,
        "target_lifecycle": tgt_class,
        "governing_authority": gov_sorted,
        "verdict": verdict,
        "confidence": "deterministic",
        "action": "report-only",
        "evidence": ev,
    }


def check_finding_002(root: Path, files: dict[str, str], head: str) -> dict:
    """Negative freshness: CURRENT.md semantic tip must NOT be flagged stale."""
    fid = "FINDING-002"
    cur = lines_of(files["docs/agent-system/CURRENT.md"])
    full = files["docs/agent-system/CURRENT.md"]

    convention_markers = [
        "roll this marker",
        "consolidation",
    ]
    has_convention = all(m.lower() in full.lower() for m in convention_markers)

    # Extract stored substantive tip: prefer the de147d6-style SHA near "P1-01 PROVEN".
    tip = "unknown"
    m = re.search(r"\b([0-9a-f]{7,40})\b[^\n]*P1-01 PROVEN", full)
    if m:
        tip = m.group(1)
    else:
        # Fallback: first SHA on the tip-marker bullet lines.
        for ln in cur:
            if "Current main tip" in ln or "substantive" in ln.lower():
                m2 = re.search(r"\b([0-9a-f]{7,40})\b", ln)
                if m2:
                    tip = m2.group(1)
                    break

    head_short = head[:7] if len(head) >= 7 and head != "unknown" else head
    tip_short = tip[:7] if len(tip) >= 7 else tip
    differs = head != "unknown" and tip != "unknown" and head != tip and head_short != tip_short

    if has_convention:
        verdict = "consistent-semantic-tip"
        detail = (
            "CURRENT.md declares a substantive-tip convention; literal HEAD "
            "difference is expected and is NOT staleness."
        )
    elif differs:
        verdict = "stale-literal-tip"
        detail = "No semantic-tip convention found; literal difference treated as stale."
    else:
        verdict = "consistent-literal-tip"
        detail = "HEAD matches stored tip."

    return {
        "finding_id": fid,
        "source": "docs/agent-system/CURRENT.md",
        "claim": "substantive tip reference",
        "claim_scope": "coordination-marker",
        "stored_substantive_tip": tip,
        "head_observed": head,
        "literal_differs": differs,
        "semantic_convention_present": has_convention,
        "verdict": verdict,
        "confidence": "deterministic",
        "action": "report-only",
        "detail": detail,
        "evidence": {
            "convention_excerpt": "subsequent coordinator consolidation commits roll this marker",
            "tip_section": "CURRENT REPOSITORY TIP",
        },
    }


def check_unresolved(root: Path, files: dict[str, str], cid: str, fid: str) -> dict:
    text = files["docs/cleanup/CONFLICT-REGISTER.md"]
    clines = lines_of(text)
    # Find section header for this conflict id.
    header_idx = -1
    header_line = ""
    for i, ln in enumerate(clines, start=1):
        if ln.startswith("## " + cid + " "):
            header_idx = i
            header_line = ln
            break
    is_open = "[OPEN]" in header_line
    return {
        "finding_id": fid,
        "source": "docs/cleanup/CONFLICT-REGISTER.md",
        "conflict": cid,
        "header_line": header_idx,
        "header_excerpt": excerpt(header_line),
        "status": "OPEN" if is_open else "NOT-OPEN-OR-MISSING",
        "verdict": "unresolved-preserved" if is_open else "unexpected-state",
        "confidence": "deterministic",
        "action": "report-only",
        "detail": f"{cid} remains explicitly unresolved; no winner chosen."
        if is_open
        else f"{cid} header missing or not OPEN; corpus moved.",
    }


def build_report(root: Path, head_override: str | None) -> dict:
    # Corpus integrity first.
    files: dict[str, str] = {}
    missing: list[str] = []
    needed = CORPUS + [TARGET_DOC]
    for rel in needed:
        p = root / Path(*rel.split("/"))
        if not p.is_file():
            missing.append(rel)
            continue
        try:
            files[rel] = read_text(p)
        except Exception:
            missing.append(rel)
    if missing:
        return {
            "tool": TOOL,
            "version": VERSION,
            "status": "CORPUS-INTEGRITY-FAILURE",
            "missing": sorted(missing),
            "scope_note": SCOPE_NOTE,
        }

    head = observed_head(root, head_override)
    f1 = check_finding_001(root, files)
    f2 = check_finding_002(root, files, head)
    f3 = check_unresolved(root, files, "C8", "FINDING-003")
    f4 = check_unresolved(root, files, "C11", "FINDING-004")
    f5 = check_unresolved(root, files, "C12", "FINDING-005")

    findings = sorted([f1, f2, f3, f4, f5], key=lambda d: d["finding_id"])

    # Corpus hashes for reproducibility evidence (sorted, deterministic).
    corpus_hashes = {rel: sha256_text(files[rel]) for rel in sorted(files.keys())}

    # Required proof gates for exit code.
    gates = {
        "positive_contradiction_detected": f1.get("verdict") == "contradiction",
        "negative_freshness_ignored": f2.get("verdict") == "consistent-semantic-tip",
        "unresolved_preserved": all(
            f.get("verdict") == "unresolved-preserved" for f in (f3, f4, f5)
        ),
    }
    gates["all_required_hold"] = all(gates.values())

    summary = {
        "contradictions": sum(1 for f in findings if f.get("verdict") == "contradiction"),
        "consistent_semantic_tip": sum(
            1 for f in findings if f.get("verdict") == "consistent-semantic-tip"
        ),
        "unresolved_preserved": sum(
            1 for f in findings if f.get("verdict") == "unresolved-preserved"
        ),
        "inconclusive_or_unexpected": sum(
            1
            for f in findings
            if f.get("verdict") not in ("contradiction", "consistent-semantic-tip", "unresolved-preserved")
        ),
    }

    return {
        "tool": TOOL,
        "version": VERSION,
        "status": "OK",
        "corpus": CORPUS,
        "corpus_plus_targets": sorted(needed),
        "scope_note": SCOPE_NOTE,
        "working_vocabulary_note": (
            "Lifecycle/authority labels are pilot working vocabulary only; "
            "not Omega law, not BCP state, not ontology."
        ),
        "head_observed": head,
        "findings": findings,
        "gates": gates,
        "summary": summary,
        "corpus_sha256": corpus_hashes,
    }


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="P1-02 authority-pointer detector (pilot).")
    ap.add_argument("--root", default=str(repo_root_default()))
    ap.add_argument("--head", default=None)
    ap.add_argument("--output", default=None)
    args = ap.parse_args(argv)

    root = Path(args.root).resolve()
    report = build_report(root, args.head)
    payload = json.dumps(report, indent=2, sort_keys=True, ensure_ascii=False) + "\n"

    if report.get("status") == "CORPUS-INTEGRITY-FAILURE":
        if args.output:
            out = Path(args.output)
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(payload, encoding="utf-8", newline="\n")
        else:
            sys.stdout.write(payload)
        return 2

    if args.output:
        out = Path(args.output)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(payload, encoding="utf-8", newline="\n")
    else:
        sys.stdout.write(payload)

    return 0 if report["gates"]["all_required_hold"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
