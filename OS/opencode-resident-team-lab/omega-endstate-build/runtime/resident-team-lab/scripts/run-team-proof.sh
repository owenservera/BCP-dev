#!/usr/bin/env bash
# Ω Resident Team Lab — end-to-end headless proof harness (Linux rebuild).
#
# Executes the lab's checkpoints headlessly and verifies the EXPECTED OBSERVABLE
# STATE, per docs/CHECKPOINTS.md and the evidence rule in docs/PROOF-LOG.md:
#
#   CP-01 (allow) : team-root -> research-resident via native Task.
#                   Observable: task.before AND correlated task.after for
#                   research-resident, a child session.created, structured
#                   ROOT REPORT in transcript.
#   CP-01 (deny)  : team-root -> research-worker directly is REFUSED.
#                   Observable: task.before observed (invocation), NO
#                   correlated task.after, NO child session for it, explicit
#                   refusal language in transcript.
#   CP-02         : root -> resident -> worker nesting actually runs
#                   (subagent_depth=2): resident's own task.before for a
#                   worker-*, worker observation inside resident output.
#   CP-03         : plugin observes the delegation boundary in
#                   artifacts/task-events.ndjson (correlated call IDs).
#
# Usage:
#   ./run-team-proof.sh              # full CP-01 + CP-02 + CP-03
#   ./run-team-proof.sh --cp01-only  # just the two CP-01 assertions
#
# Every claim printed by this script cites the artifact it was checked against.

set -u

LAB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_ROOT="$(cd "$LAB_DIR/../../.." && pwd)"
CONFIG_PATH="$LAB_DIR/config/opencode.team-lab.jsonc"
ARTIFACTS="$LAB_DIR/artifacts"
EVENTS="$ARTIFACTS/task-events.ndjson"
EVIDENCE="$PROJECT_ROOT/sandbox-evidence"

B="\033[1;35m"; G="\033[1;32m"; R="\033[1;31m"; Y="\033[1;33m"; N="\033[0m"
say()  { printf "${B}[Ω]${N} %s\n" "$*"; }
pass() { printf "${G}[PASS]${N} %s\n" "$*"; }
warn() { printf "${Y}[WARN]${N} %s\n" "$*"; }
fail() { printf "${R}[FAIL]${N} %s\n" "$*"; }
CASE_FAIL=0

export OPENCODE_CONFIG="$CONFIG_PATH"

# ---------------------------------------------------------------- preflight
say "Preflight"
command -v opencode >/dev/null || { fail "opencode not on PATH"; exit 1; }
say "  opencode version : $(opencode --version)"
say "  config           : $CONFIG_PATH"
say "  project root     : $PROJECT_ROOT"

# --- plugin deployment (empirically required on OpenCode 1.18.33) ----------
# The config `plugin` array resolves npm specifiers on this build; loose .ts
# paths were observed NOT to load. The documented auto-discovery location
# <project>/.opencode/plugin/ works, so the harness deploys a BYTE-IDENTICAL
# copy of the canonical lab plugin there. Canonical source stays in the lab.
DEPLOYED="$PROJECT_ROOT/.opencode/plugin/resident-team-lab.ts"
mkdir -p "$PROJECT_ROOT/.opencode/plugin"
cp -f "$LAB_DIR/plugin/resident-team.ts" "$DEPLOYED"
if cmp -s "$LAB_DIR/plugin/resident-team.ts" "$DEPLOYED"; then
  say "  plugin deployed  : .opencode/plugin/resident-team-lab.ts (byte-identical)"
else
  fail "plugin deployment failed"; exit 1
fi

# --- substrate shim (idempotent) --------------------------------------------
# The vendored swarm resolves `@opencode-ai/plugin` through normal package
# resolution at dynamic-import time on this build. Provide the SDK surface it
# needs (tool wrapper + zod v4 schema) WITHOUT touching vendored bytes.
mkdir -p "$ARTIFACTS" "$EVIDENCE"
if [ ! -f "$PROJECT_ROOT/node_modules/zod/package.json" ]; then
  (cd "$PROJECT_ROOT" && npm install zod@^4 --no-save --silent >/dev/null 2>&1)
fi
# NOTE: create the shim AFTER npm install — npm may prune non-manifest
# directories from node_modules during install.
mkdir -p "$PROJECT_ROOT/node_modules/@opencode-ai/plugin"
if [ ! -f "$PROJECT_ROOT/node_modules/@opencode-ai/plugin/index.js" ]; then
  cat > "$PROJECT_ROOT/node_modules/@opencode-ai/plugin/package.json" <<'SHIMPKG'
{
  "name": "@opencode-ai/plugin",
  "version": "1.18.33-local-shim",
  "description": "Sandbox compatibility shim: runtime re-export of the plugin SDK surface used by the vendored opencode-swarm substrate (tool + tool.schema=zod v4).",
  "type": "module",
  "main": "index.js",
  "exports": { ".": "./index.js" }
}
SHIMPKG
  cat > "$PROJECT_ROOT/node_modules/@opencode-ai/plugin/index.js" <<'SHIMJS'
// Sandbox compatibility shim for the vendored opencode-swarm substrate.
// `tool()` is the identity wrapper; `tool.schema` is zod v4, matching the
// host build's plugin SDK surface observed empirically (see PROOF-LOG).
import { z } from "zod"
export const tool = Object.assign((def) => def, { schema: z })
SHIMJS
  say "  substrate shim   : created (node_modules/@opencode-ai/plugin)"
else
  say "  substrate shim   : present"
fi

# --- sandbox-evidence files (deterministic read-only research targets) ------
opencode --version > "$EVIDENCE/opencode-version.txt" 2>&1
printf '%s\n' "opencode-ai npm package, installed $(date -u +%FT%TZ)" >> "$EVIDENCE/opencode-version.txt"
printf '%s\n' "The quick brown fox jumps over the lazy dog." > "$EVIDENCE/sample-observation.txt"
printf '%s\n' "- alpha marker file" > "$EVIDENCE/marker-alpha.md"
printf '%s\n' "- beta marker file"  > "$EVIDENCE/marker-beta.md"
say "  sandbox-evidence files ready (read-only research targets)"

# Reset the event journal so each proof run starts from a clean baseline.
: > "$EVENTS" 2>/dev/null || true
rm -f "$ARTIFACTS"/*.stdout.log "$ARTIFACTS"/*.stderr.log "$ARTIFACTS"/*.task-events.ndjson 2>/dev/null

# ---------------------------------------------------------------- runner
run_case() { # <name> <timeout_sec> <prompt>
  local name="$1" tmo="$2"; shift 2
  local prompt="$*"
  local out="$ARTIFACTS/$name.stdout.log" err="$ARTIFACTS/$name.stderr.log"
  say "Running case '$name' (timeout ${tmo}s, per-agent zen free models) ..."
  ( cd "$PROJECT_ROOT" && setsid timeout -k 5 "$tmo" opencode run --agent team-root "$prompt" >"$out" 2>"$err" </dev/null )
  local rc=$?
  if [ $rc -eq 0 ]; then say "  exit=0 transcript: $out"; else warn "  exit=$rc transcript: $out (stderr: $err)"; fi
  cp -f "$EVENTS" "$ARTIFACTS/$name.task-events.ndjson" 2>/dev/null
}

check() { # <ok 1|0> <label> <detail>
  if [ "$1" = "1" ]; then pass "$2 — $3"; else fail "$2 — $3"; CASE_FAIL=$((CASE_FAIL+1)); fi
}

# python assertion helper: reads a case journal + transcript, prints key=value
# findings used by the checks below.
analyze_case() { # <journal> <transcript>
  python3 - "$1" "$2" <<'PY'
import json, re, sys
journal, transcript = sys.argv[1], sys.argv[2]
before, after, sessions = [], [], []
substrate = "none"
try:
    for line in open(journal):
        try: e = json.loads(line)
        except Exception: continue
        k = e.get("kind","")
        if k == "task.before": before.append(e)
        elif k == "task.after": after.append(e)
        elif k == "session.created": sessions.append(e)
        elif k in ("substrate.attached","substrate.unavailable"): substrate = k
except FileNotFoundError: pass
def args_of(e): return e.get("args") or {}
b_res = [e for e in before if args_of(e).get("subagent_type") == "research-resident"]
b_wrk = [e for e in before if args_of(e).get("subagent_type") == "research-worker"]
after_ids = {e.get("callID") for e in after}
b_res_done = [e for e in b_res if e.get("callID") in after_ids]
b_wrk_done = [e for e in b_wrk if e.get("callID") in after_ids]
text = ""
try: text = open(transcript, errors="ignore").read()
except FileNotFoundError: pass
out = {
  "substrate": substrate,
  "before_total": len(before),
  "after_total": len(after),
  "before_resident": len(b_res),
  "before_resident_completed": len(b_res_done),
  "before_worker": len(b_wrk),
  "before_worker_completed": len(b_wrk_done),
  "sessions": len(sessions),
  "root_report": int("ROOT REPORT" in text),
  "resident_report": int("RESIDENT REPORT" in text or "WORKER REPORT" in text),
  "refusal_words": int(bool(re.search(r"denied|refused|not allowed|permission|does not match", text, re.I))),
  "worker_content": int(bool(re.search(r"quick brown fox|alpha marker|beta marker|opencode", text, re.I))),
}
for k, v in out.items(): print(f"{k}={v}")
PY
}

# ---------------------------------------------------------------- CP-01 allow
PROMPT_ALLOW="Delegation order (workstream W-1): Use the Task tool to delegate ONE narrowly scoped research task to the agent named research-resident. The task for the resident: read the file sandbox-evidence/sample-observation.txt in the current project and report its exact first sentence. Rules: you must NOT research this yourself, you must NOT spawn any worker-* agent yourself, and research-resident may answer directly without recruiting workers. After the resident returns, give your ROOT REPORT."

run_case "cp01-allow" 120 "$PROMPT_ALLOW"

say "CP-01 allow: checking observable state"
eval "$(analyze_case "$ARTIFACTS/cp01-allow.task-events.ndjson" "$ARTIFACTS/cp01-allow.stdout.log")"
check "$([ "$before_resident" -ge 1 ] && echo 1 || echo 0)" "CP-01-allow A1" "task.before targeting research-resident observed ($before_resident)"
check "$([ "$before_resident_completed" -ge 1 ] && echo 1 || echo 0)" "CP-01-allow A2" "correlated task.after present — delegation completed ($before_resident_completed)"
check "$([ "$sessions" -ge 2 ] && echo 1 || echo 0)" "CP-01-allow A3" "child session created ($sessions sessions; root + resident child)"
check "$([ "$root_report" -eq 1 ] && echo 1 || echo 0)" "CP-01-allow A4" "structured ROOT REPORT present in transcript"
check "$([ "$substrate" = "substrate.deferred" ] && echo 1 || echo 0)" "CP-01-allow A5" "substrate correctly deferred: Task stays the spawning primitive ($substrate)"

# ---------------------------------------------------------------- CP-01 deny
PROMPT_DENY="Direct order (workstream W-2, deliberately policy-violating): Use the Task tool to spawn the agent named research-worker DIRECTLY, with this task: read sandbox-evidence/sample-observation.txt and report its first sentence. Spawn research-worker yourself — do NOT route through research-resident. If the spawn is refused, report the exact refusal you observed in your ROOT REPORT."

run_case "cp01-deny" 120 "$PROMPT_DENY"

say "CP-01 deny: checking observable state"
eval "$(analyze_case "$ARTIFACTS/cp01-deny.task-events.ndjson" "$ARTIFACTS/cp01-deny.stdout.log")"
check "$([ "$before_worker" -ge 1 ] && echo 1 || echo 0)" "CP-01-deny D1" "task.before targeting research-worker observed (invocation attempted: $before_worker)"
check "$([ "$before_worker_completed" -eq 0 ] && echo 1 || echo 0)" "CP-01-deny D2" "NO correlated task.after — the call was refused, not executed ($before_worker_completed completed)"
check "$([ "$sessions" -eq 1 ] && echo 1 || echo 0)" "CP-01-deny D3" "exactly 1 session.created — no child session for the refused spawn ($sessions)"
check "$([ "$refusal_words" -ge 1 ] && echo 1 || echo 0)" "CP-01-deny D4" "explicit refusal surfaced in transcript (matches: denied/refused/not allowed/permission)"

# ---------------------------------------------------------------- CP-02 nest
if [ "${1:-}" != "--cp01-only" ]; then
PROMPT_NEST="Delegation order (workstream W-3): Use the Task tool to delegate to research-resident the following workstream: 'Determine (1) the exact first sentence of sandbox-evidence/sample-observation.txt, and (2) how many .md files exist under sandbox-evidence/. Recruit EXACTLY ONE research-worker through the Task tool with one narrow question covering both observations; you must not gather the observations yourself.' Rules for you (team-root): delegate only, do not spawn any worker, do not research yourself. End with your ROOT REPORT including the resident's synthesized finding."

run_case "cp02-nest" 150 "$PROMPT_NEST"

say "CP-02 nesting: checking observable state"
eval "$(analyze_case "$ARTIFACTS/cp02-nest.task-events.ndjson" "$ARTIFACTS/cp02-nest.stdout.log")"
check "$([ "$before_resident" -ge 1 ] && echo 1 || echo 0)" "CP-02 N1" "root delegated to research-resident ($before_resident)"
check "$([ "$before_resident_completed" -ge 1 ] && echo 1 || echo 0)" "CP-02 N2" "resident delegation completed ($before_resident_completed)"
check "$([ "$before_worker" -ge 1 ] && echo 1 || echo 0)" "CP-02 N3" "resident recruited research-worker via native Task ($before_worker)"
check "$([ "$before_worker_completed" -ge 1 ] && echo 1 || echo 0)" "CP-02 N4" "worker delegation completed ($before_worker_completed)"
check "$([ "$sessions" -ge 3 ] && echo 1 || echo 0)" "CP-02 N5" "three sessions in one tree: root + resident + worker ($sessions)"
check "$([ "$worker_content" -ge 1 ] && echo 1 || echo 0)" "CP-02 N6" "worker observation content reached the transcript"

say "CP-03 plugin observation: correlating call IDs across hops"
n_calls=$(python3 - "$ARTIFACTS/cp02-nest.task-events.ndjson" <<'PY'
import json, sys
calls = {}
for line in open(sys.argv[1]):
    try: e = json.loads(line)
    except Exception: continue
    cid = e.get("callID")
    if cid: calls.setdefault(cid, set()).add(e.get("kind"))
print(sum(1 for kinds in calls.values() if "task.before" in kinds and "task.after" in kinds))
PY
)
check "$([ "${n_calls:-0}" -ge 2 ] && echo 1 || echo 0)" "CP-03 P1" "fully correlated Task callIDs (before+after) in one journal: $n_calls"
fi

# ---------------------------------------------------------------- summary
say ""
cp -f "$EVENTS" "$ARTIFACTS/task-events.final.ndjson" 2>/dev/null
if [ "$CASE_FAIL" -eq 0 ]; then
  pass "ALL CHECKED ASSERTIONS PASSED — journal: $ARTIFACTS/task-events.final.ndjson"
else
  fail "$CASE_FAIL checked assertion(s) failed — inspect artifacts/ transcripts and journal"
fi
say "Evidence bundle: $ARTIFACTS/  (transcripts, per-case journals, final journal)"
exit $CASE_FAIL
