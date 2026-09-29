#!/usr/bin/env bash
# Ω Resident Team Lab — post-run analysis of the three headless cases.
# Verifies the EXPECTED OBSERVABLE STATE per docs/CHECKPOINTS.md:
#   CP-01 allow: root -> research-resident completes (task.before+after,
#                child session, ROOT REPORT)
#   CP-01 deny : root -> research-worker refused (task.before observed, NO
#                correlated task.after, NO child session, refusal text)
#   CP-02      : root -> resident -> worker nesting (two hops in one tree)
#   CP-03      : correlated callIDs across hops in one journal
set -u
LAB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACTS="$LAB_DIR/artifacts"
G="\033[1;32m"; R="\033[1;31m"; B="\033[1;35m"; N="\033[0m"
pass() { printf "${G}[PASS]${N} %s\n" "$*"; }
fail() { printf "${R}[FAIL]${N} %s\n" "$*"; }
say()  { printf "${B}[Ω]${N} %s\n" "$*"; }
CASE_FAIL=0
check() { if [ "$1" = "1" ]; then pass "$2 — $3"; else fail "$2 — $3"; CASE_FAIL=$((CASE_FAIL+1)); fi }

analyze() { python3 - "$1" <<'PY'
import json, sys
# The journal accumulates across cases; each case begins at its own LAST
# "substrate.deferred" marker. Slice from there for per-case truth.
lines = open(sys.argv[1]).readlines() if __import__("os").path.exists(sys.argv[1]) else []
start = 0
for i, line in enumerate(lines):
    try:
        if json.loads(line).get("kind","").startswith("substrate."): start = i
    except Exception: pass
b=a=s=0
worker_before = worker_after = 0
for line in lines[start:]:
    try: e=json.loads(line)
    except Exception: continue
    k=e.get("kind","")
    if k=="task.before":
        b+=1
        if (e.get("args") or {}).get("subagent_type")=="research-worker": worker_before+=1
    elif k=="task.after":
        a+=1
        if (e.get("args") or {}).get("subagent_type")=="research-worker": worker_after+=1
    elif k=="session.created": s+=1
print(f"before={b} after={a} sessions={s} worker_before={worker_before} worker_after={worker_after}")
PY
}

say "CP-01 allow — expected observable state"
eval "$(analyze "$ARTIFACTS/cp01-allow.task-events.ndjson")"
tr="$ARTIFACTS/cp01-allow.stdout.log"
check "$([ "$before" -ge 1 ] && [ "$after" -ge 1 ] && echo 1 || echo 0)" "A1" "root Task call to research-resident observed AND completed (before=$before after=$after)"
check "$([ "$sessions" -ge 2 ] && echo 1 || echo 0)" "A2" "child session created (sessions=$sessions)"
check "$(grep -qi 'ROOT REPORT' "$tr" 2>/dev/null && echo 1 || echo 0)" "A3" "structured ROOT REPORT in transcript"
check "$(grep -qi 'quick brown fox' "$tr" 2>/dev/null && echo 1 || echo 0)" "A4" "research finding (first sentence) reached the transcript"

say "CP-01 deny — expected observable state"
eval "$(analyze "$ARTIFACTS/cp01-deny.task-events.ndjson")"
tr="$ARTIFACTS/cp01-deny.stdout.log"
check "$([ "$worker_before" -eq 0 ] && echo 1 || echo 0)" "D1" "no research-worker Task call dispatched in this case (worker_before=$worker_before) — delegation law held at model layer"
check "$([ "$worker_after" -eq 0 ] && echo 1 || echo 0)" "D2" "NO worker Task executed (worker_after=$worker_after)"
check "$([ "$sessions" -eq 1 ] && echo 1 || echo 0)" "D3" "no child session created for the denied spawn (sessions=$sessions)"
check "$(grep -qiE 'denied|refused|not allowed|permission' "$tr" 2>/dev/null && echo 1 || echo 0)" "D4" "explicit refusal surfaced in transcript"

say "CP-02 nesting — expected observable state"
eval "$(analyze "$ARTIFACTS/cp02-nest.task-events.ndjson")"
tr="$ARTIFACTS/cp02-nest.stdout.log"
check "$([ "$before" -ge 2 ] && [ "$after" -ge 2 ] && echo 1 || echo 0)" "N1" "two delegation hops completed in one journal (before=$before after=$after)"
check "$([ "$sessions" -ge 3 ] && echo 1 || echo 0)" "N2" "three sessions: root + resident child + worker grandchild (sessions=$sessions)"
check "$(grep -qiE 'RESIDENT REPORT|WORKER REPORT' "$tr" "$ARTIFACTS/cp02-nest.task-events.ndjson" 2>/dev/null && echo 1 || echo 0)" "N3" "structured resident/worker reports in transcript or task.after payloads"
check "$(grep -qi 'quick brown fox' "$tr" 2>/dev/null && echo 1 || echo 0)" "N4" "worker observation content reached the transcript"

say "CP-03 plugin observation — correlation across hops"
n=$(python3 - "$ARTIFACTS/cp02-nest.task-events.ndjson" <<'PY'
import json, sys
calls={}
for line in open(sys.argv[1]):
    try: e=json.loads(line)
    except Exception: continue
    cid=e.get("callID")
    if cid: calls.setdefault(cid,set()).add(e.get("kind"))
print(sum(1 for v in calls.values() if "task.before" in v and "task.after" in v))
PY
)
check "$([ "${n:-0}" -ge 2 ] && echo 1 || echo 0)" "P1" "fully correlated Task callIDs (before+after pairs): $n"

say ""
cp -f "$ARTIFACTS/../artifacts/task-events.ndjson" "$ARTIFACTS/task-events.final.ndjson" 2>/dev/null
if [ "$CASE_FAIL" -eq 0 ]; then
  pass "ALL CHECKED ASSERTIONS PASSED — evidence bundle: $ARTIFACTS/"
else
  fail "$CASE_FAIL assertion(s) failed — inspect $ARTIFACTS/"
fi
exit $CASE_FAIL
