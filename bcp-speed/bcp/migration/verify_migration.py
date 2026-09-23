#!/usr/bin/env python3
"""verify_migration.py — deterministic, offline verification for BCP migration records.

Enforces Prompt-1 evidence discipline mechanically, generalized per Prompt-2
(migration factory): verifies ONE record by default (MIG-001, back-compat),
any single record via --record, or every record via --all.

  V-1  record conforms to migration-record.schema.json (required keys + enums)
  V-2  every omega_target contract name resolves to a real file under
       omega-baseline/omega-final/contracts/src/
  V-3  (scan assist) lists non-Governor importers of low-level CDP modules —
       INFORMATIVE, global (run once): prints the importer list; never asserts
       exclusivity.
  V-4  no new code imports the VIVIM monolith (adapter is data-only)
  V-5  proof-ladder honesty: live/regression may not claim PROVEN unless a
       live-evidence artifact is present; fixture must never be labeled live.
  V-6  UNKNOWNs are explicit: open_unknowns non-empty and every UNKNOWN
       observation stays UNKNOWN (no silent promotion to PROVEN/OBSERVED).

Exit 0 = all enforced checks green on every record. V-3 always exits 0.
"""
import argparse
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
MIGDIR = Path(__file__).resolve().parent
SCHEMA = json.loads((MIGDIR / "migration-record.schema.json").read_text(encoding="utf-8"))

failures = []
infos = []


def load_records(args):
    if args.all:
        recs = sorted((MIGDIR).glob("MIG-[0-9][0-9][0-9]-*/migration-record.json"))
        if not recs:
            print("FAIL no-records found under migration/")
            sys.exit(1)
        return [json.loads(p.read_text(encoding="utf-8")) for p in recs]
    rec_path = Path(args.record) if args.record else (MIGDIR / "MIG-001-chatgpt-send-message" / "migration-record.json")
    if not rec_path.is_file():
        rec_path = MIGDIR / rec_path  # allow relative names
    return [json.loads(rec_path.read_text(encoding="utf-8"))]


def verify_record(RECORD, tag):
    local_failures = []

    def check(name, cond, detail=""):
        if cond:
            print(f"PASS [{tag}] {name}")
        else:
            print(f"FAIL [{tag}] {name} {detail}")
            local_failures.append(f"{tag}:{name}")

    # V-1: required keys + enums -----------------------------------------
    required = SCHEMA.get("required", [])
    missing = [k for k in required if k not in RECORD]
    check("V-1a required-keys", not missing, f"missing={missing}")
    obs_conf = {"PROVEN", "OBSERVED", "STRONGLY_INFERRED", "WEAKLY_INFERRED", "UNKNOWN"}
    bad_conf = [o for o in RECORD.get("observations", []) if o.get("confidence") not in obs_conf]
    check("V-1b observation-confidence-enum", not bad_conf, f"bad={bad_conf}")
    canon = RECORD.get("canonicality", {}).get("verdict")
    check("V-1c canonicality-enum", canon in {"PRESERVE", "TRANSFORM", "REIMPLEMENT", "REPLACE", "DEPRECATE", "DISCARD", "UNKNOWN"}, f"got={canon}")
    disp = RECORD.get("disposition")
    check("V-1d disposition-enum", disp in {"Preserved", "Transformed", "Reimplemented", "IntentionallyDiscarded", "Unresolved", "Blocked"}, f"got={disp}")
    mig_id = RECORD.get("migration_id", "")
    check("V-1e migration-id-shape", bool(re.match(r"^MIG-[0-9]{3}-[a-z0-9-]+$", mig_id)), f"got={mig_id}")

    # V-2: contract names resolve ------------------------------------------
    contracts_dir = REPO / "omega-baseline" / "omega-final" / "contracts" / "src"
    contract_files = {p.stem for p in contracts_dir.glob("*.ts")} if contracts_dir.is_dir() else set()
    touched = RECORD.get("omega_target", {}).get("contracts_touched", [])
    unresolved = [c for c in touched if c.replace(".ts", "") not in contract_files]
    check("V-2 contracts-resolve", not unresolved, f"unresolved={unresolved} known={sorted(contract_files)[:8]}...")
    new_contracts = RECORD.get("omega_target", {}).get("new_contracts", [])
    check("V-2b no-new-contracts-this-slice", new_contracts == [], f"new={new_contracts}")

    # V-4: no monolith import in new code ------------------------------------
    # NOTE: the checker's own regex literals name these modules; a bare substring
    # match would flag the checker itself. Only real import/require statements count,
    # and lines that define the check pattern (re.search / PATTERN) are excluded.
    new_py = list((MIGDIR).rglob("*.py"))
    bad_imports = []
    import_stmt = re.compile(r"^\s*(import|from|require\(|}\s*from)\s+.*(vivim-original-baseline|vivim_final|src\.engines|chrome-governor|cdp-transport|BunCdpClient)")
    for p in new_py:
        for n, line in enumerate(p.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            if "re.search" in line or "PATTERN" in line or "import_stmt" in line:
                continue
            if import_stmt.search(line):
                bad_imports.append(f"{p}:{n}:{line.strip()[:100]}")
    check("V-4 no-monolith-import", not bad_imports, f"bad={bad_imports}")

    # V-5: proof-ladder honesty -----------------------------------------------
    ladder = RECORD.get("proof_ladder", {})
    live = ladder.get("live", "")
    check("V-5a live-not-overclaimed", "PROVEN" not in live or "UNVERIFIED" in live or "live-evidence" in " ".join(RECORD.get("evidence", [])).lower(), f"live={live!r}")
    check("V-5b live-explicitly-unverified", "UNVERIFIED" in live, f"live={live!r}")
    all_evidence_text = " ".join(RECORD.get("evidence", [])).lower()
    check("V-5c fixture-never-called-live", not ("fixture" in all_evidence_text and "live proof" in all_evidence_text and "unverified" not in all_evidence_text), "fixture/live conflation")

    # V-6: UNKNOWNs explicit ---------------------------------------------------
    open_unks = RECORD.get("open_unknowns", [])
    check("V-6a open-unknowns-nonempty", len(open_unks) >= 1, "open_unknowns must stay non-empty until proven")
    unk_obs = [o for o in RECORD.get("observations", []) if o.get("confidence") == "UNKNOWN"]
    check("V-6b unknowns-stay-unknown", len(unk_obs) >= 1, "at least one UNKNOWN observation must remain")

    print(f"[{tag}] verify_migration: {'GREEN' if not local_failures else 'RED'} ({len(local_failures)} failures)")
    return local_failures


def scan_governor_exclusivity():
    # V-3: Governor-exclusivity scan (INFORMATIVE, global — run once) ---------
    viv_root = REPO / "vivim-original-baseline" / "vivim-final-enhanced" / "src"
    importers = []
    if viv_root.is_dir():
        for p in viv_root.rglob("*.ts"):
            if p.name in {"chrome-governor.ts"}:
                continue
            try:
                text = p.read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue
            if re.search(r"from\s+['\"].*(cdp-transport|executor/cdp|BunCdpClient|chrome/cdp-proxy)['\"]|require\(['\"].*(cdp-transport)['\"]", text):
                importers.append(str(p.relative_to(REPO)))
    print(f"INFO V-3 low-level-CDP importers (non-governor): {len(importers)}")
    for imp in importers[:30]:
        print(f"INFO   - {imp}")
    infos.append(f"V-3 importer count={len(importers)} (informative, exclusivity NOT asserted)")


def main():
    ap = argparse.ArgumentParser(description="Deterministic offline verification for BCP migration records.")
    ap.add_argument("--record", default=None, help="Path to one migration-record.json (default: MIG-001 record).")
    ap.add_argument("--all", action="store_true", help="Verify every MIG-NNN-*/migration-record.json under migration/.")
    args = ap.parse_args()

    for RECORD in load_records(args):
        tag = RECORD.get("migration_id", "?")
        failures.extend(verify_record(RECORD, tag))

    scan_governor_exclusivity()

    print(f"\nverify_migration: {'GREEN' if not failures else 'RED'} ({len(failures)} failures)")
    for i in infos:
        print(f"INFO {i}")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
