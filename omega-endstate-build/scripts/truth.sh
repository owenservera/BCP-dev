#!/usr/bin/env bash
#
# truth.sh — truth probe for omega-endstate-build.
#
# Runs the vendored opencode-swarm test suite, counts pass/fail from its own
# summary output, captures toolchain facts, and writes a markdown receipt.
#
# This probe REPORTS truth; it does not gate. Exit status is 0 whenever the
# count extraction succeeds, even if the suite has failing tests. A non-zero
# exit means the probe itself could not produce counts.
#
# Usage: bash omega-endstate-build/scripts/truth.sh
#
# Exit codes:
#   0  counts extracted (passes and/or failures reported as they are)
#   2  precondition missing (bun, or the target test directory)
#   3  test run produced no recognizable pass/fail summary
#   4  receipt could not be written

set -u

# --- paths ------------------------------------------------------------------
# Derived from this script's location so the probe works from the project
# root or anywhere else.
SCRIPT_DIR=$(cd "$(dirname "$0")" 2>/dev/null && pwd) || exit 4
TARGET_DIR="$SCRIPT_DIR/../runtime/vendor/opencode-swarm"
EVIDENCE_DIR="$SCRIPT_DIR/evidence"

# --- preconditions ----------------------------------------------------------
if ! command -v bun >/dev/null 2>&1; then
    echo "truth.sh: precondition failed: 'bun' not found on PATH" >&2
    exit 2
fi
if [ ! -d "$TARGET_DIR" ]; then
    echo "truth.sh: precondition failed: target dir not found: $TARGET_DIR" >&2
    exit 2
fi

# Evidence directory the receipt is written into.
mkdir -p "$EVIDENCE_DIR" || exit 4

# --- toolchain facts --------------------------------------------------------
BUN_VERSION=$(bun --version 2>/dev/null) || BUN_VERSION="unknown"
GIT_SHA=$(git -C "$TARGET_DIR" rev-parse HEAD 2>/dev/null) || GIT_SHA="unknown"
GIT_ROOT=$(git -C "$TARGET_DIR" rev-parse --show-toplevel 2>/dev/null) || GIT_ROOT="unknown"

# --- run the tests ----------------------------------------------------------
TS=$(date -u +%Y%m%dT%H%M%SZ)
RUN_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

LOG=$(mktemp) || exit 4
# cd into the target so `bun test` resolves the vendored suite. Exit status is
# captured, not propagated: a failing suite is a reportable result, not a
# probe failure.
( cd "$TARGET_DIR" && bun test ) >"$LOG" 2>&1
TEST_EXIT=$?

# --- count pass / fail ------------------------------------------------------
# bun test prints a trailing summary of the form:
#     50 pass
#      1 fail
#     137 expect() calls
#   Ran 51 tests across 10 files. [15.15s]
if grep -Eq '^[[:space:]]*[0-9]+[[:space:]]+(pass|fail)([[:space:]]|$)' "$LOG"; then
    PASS_COUNT=$(awk '$1 ~ /^[0-9]+$/ && $2 == "pass" { v = $1 } END { print (v == "" ? 0 : v) }' "$LOG")
    FAIL_COUNT=$(awk '$1 ~ /^[0-9]+$/ && $2 == "fail" { v = $1 } END { print (v == "" ? 0 : v) }' "$LOG")
    _pass_line=$(grep -E '^[[:space:]]*[0-9]+[[:space:]]+pass' "$LOG" | tail -n 1 | sed 's/^[[:space:]]*//')
    _fail_line=$(grep -E '^[[:space:]]*[0-9]+[[:space:]]+fail' "$LOG" | tail -n 1 | sed 's/^[[:space:]]*//')
    [ -n "$_pass_line" ] || _pass_line="no pass summary line"
    [ -n "$_fail_line" ] || _fail_line="no fail summary line"
    SUMMARY_LINE="$_pass_line, $_fail_line"
    RAN_LINE=$(grep -E '^Ran [0-9]+ tests?' "$LOG" | tail -n 1 | sed 's/^[[:space:]]*//')
    [ -n "$RAN_LINE" ] || RAN_LINE="(no 'Ran N tests' line)"
else
    echo "truth.sh: count extraction failed: no pass/fail summary in test output" >&2
    echo "truth.sh: --- test output ---" >&2
    cat "$LOG" >&2
    rm -f "$LOG"
    exit 3
fi

# --- live-provider e2e caveat inputs ----------------------------------------
# The vendored suite contains one test that calls a live external model
# provider (tests/e2e.test.ts). Its skip gate tests only that the auth store
# FILE exists -- never that the file holds an OpenRouter credential -- so on a
# host with no such credential the test executes and then fails deterministically.
# We observe the gate's preconditions here and report them. The conclusion
# written into the receipt is stated conditionally on those observations, so the
# receipt stays honest on any host, credentialed or not.
E2E_TITLE="two agents share memory and pass messages through a real swarm"
if grep -E "^\(fail\).*$E2E_TITLE" "$LOG" >/dev/null 2>&1; then
    E2E_FAILED="yes"
else
    E2E_FAILED="no"
fi

AUTH_STORE="$HOME/.local/share/opencode/auth.json"
if command -v opencode >/dev/null 2>&1; then
    COND_OPENCODE="present ($(command -v opencode))"
else
    COND_OPENCODE="absent"
fi
if [ -f "$AUTH_STORE" ]; then
    COND_AUTH_FILE="present ($AUTH_STORE)"
else
    COND_AUTH_FILE="absent"
fi
# Key names only; credential values are never read or printed.
if [ ! -f "$AUTH_STORE" ]; then
    COND_OPENROUTER="absent (no auth store file to inspect)"
elif grep -qE '"openrouter"[[:space:]]*:' "$AUTH_STORE" 2>/dev/null; then
    COND_OPENROUTER="present"
else
    COND_OPENROUTER="absent"
fi
if [ -z "${SWARM_E2E:-}" ]; then
    COND_SWARM_E2E="unset"
else
    COND_SWARM_E2E="set to '$SWARM_E2E'"
fi

# The conclusion is derived, not asserted: it fires only when the e2e test
# actually failed AND the missing-credential preconditions actually held.
# ARTIFACT_APPLIES gates the count arithmetic below, so the caveat can never
# absorb a failure it does not actually explain.
ARTIFACT_APPLIES="no"
if [ "$E2E_FAILED" = "no" ]; then
    CAVEAT_VERDICT="The live-provider e2e test did not fail on this run. This section is recorded as standing background for future runs, and none of the preconditions below were exercised as a failure cause."
elif [ "$COND_OPENROUTER" = "absent" ] && [ "$COND_OPENCODE" != "absent" ] && [ "$COND_SWARM_E2E" != "set to '0'" ]; then
    ARTIFACT_APPLIES="yes"
    CAVEAT_VERDICT="The live-provider e2e test failed on this run and the missing-credential preconditions above all held. **Under exactly these conditions the failure is an environment artifact, not a code regression in the vendored suite, and must not be filed as one.**"
else
    CAVEAT_VERDICT="The live-provider e2e test failed on this run, but NOT all of the preconditions above held, so the missing-credential explanation does not cover it. Treat this failure as real and investigate."
fi

# How many failures remain unexplained. Only a failure the caveat actually
# explains is subtracted; every other failure stays flagged.
if [ "$ARTIFACT_APPLIES" = "yes" ]; then
    UNEXPLAINED=$((FAIL_COUNT - 1))
else
    UNEXPLAINED=$FAIL_COUNT
fi
if [ "$UNEXPLAINED" -gt 0 ]; then
    UNEXPLAINED_LINE="$UNEXPLAINED failure(s) on this run are **not** accounted for by the live-provider caveat below. Treat them as real and investigate."
elif [ "$FAIL_COUNT" -gt 0 ]; then
    UNEXPLAINED_LINE="All $FAIL_COUNT failure(s) on this run are accounted for by the live-provider caveat below."
else
    UNEXPLAINED_LINE="No failures on this run."
fi

# Static caveat text, read verbatim so its backticks are not expanded.
CAVEAT_TEXT=$(cat <<'CAVEAT_EOF'
The vendored suite contains one test that calls a live external model provider:
`tests/e2e.test.ts` — "two agents share memory and pass messages through a real
swarm". Its skip gate (`e2e.test.ts:16-18`) is:

    hasOpencode && existsSync(~/.local/share/opencode/auth.json) && SWARM_E2E !== "0"

The gate tests only that an auth store *file exists* — never that the file
contains an OpenRouter credential. **If** those gate conditions hold on a host
whose auth store has no `openrouter` entry, the test executes instead of
skipping and then fails deterministically, because the body requests
`model: "openrouter/openai/gpt-4o-mini"`, which cannot be served without one.

**The documented way to obtain a credential-free run is `SWARM_E2E=0 bun test`,
which skips the live-provider test.**
CAVEAT_EOF
)

# --- write receipt ----------------------------------------------------------
RECEIPT="$EVIDENCE_DIR/truth-receipt-$TS.md"
cat >"$RECEIPT" <<EOF
# Truth Probe Receipt

Generated by \`omega-endstate-build/scripts/truth.sh\`. The probe reports truth
and does not gate: a non-zero \`bun test\` exit with successfully extracted
counts is still a successful probe run.

| Field | Value |
| --- | --- |
| Date (UTC) | $RUN_DATE |
| Bun version | $BUN_VERSION |
| Git SHA | $GIT_SHA |
| Pass count | $PASS_COUNT |
| Fail count | $FAIL_COUNT |

## Run detail

- Test command: \`bun test\`
- Test directory: \`omega-endstate-build/runtime/vendor/opencode-swarm\`
- Git repo root: \`$GIT_ROOT\`
- \`bun test\` exit status: $TEST_EXIT
- Test summary: $SUMMARY_LINE
- Tests run: $RAN_LINE

## Interpretation

$PASS_COUNT passing and $FAIL_COUNT failing test(s) were observed at the
recorded SHA. Counts are transcribed from the runner's own summary; they are not
independently re-derived.

$UNEXPLAINED_LINE

## Known caveat: the live-provider e2e test

This section is emitted by \`truth.sh\` on every run so that no receipt is read
cold without it. The statement below is **conditional** and is not an assertion
about any particular host.

$CAVEAT_TEXT

### Preconditions observed on this run

| Precondition | Observed |
| --- | --- |
| \`opencode\` on PATH (\`hasOpencode\`) | $COND_OPENCODE |
| Auth store file exists (\`hasAuth\`) | $COND_AUTH_FILE |
| \`SWARM_E2E\` (\`!== "0"\` to enable) | $COND_SWARM_E2E |
| \`openrouter\` credential in auth store | $COND_OPENROUTER |
| Live-provider e2e test failed this run | $E2E_FAILED |

### Verdict for this run

$CAVEAT_VERDICT
EOF

if [ ! -s "$RECEIPT" ]; then
    echo "truth.sh: failed to write receipt: $RECEIPT" >&2
    rm -f "$LOG"
    exit 4
fi

rm -f "$LOG"

# --- report -----------------------------------------------------------------
echo "truth.sh: bun version    : $BUN_VERSION"
echo "truth.sh: git SHA        : $GIT_SHA"
echo "truth.sh: pass count     : $PASS_COUNT"
echo "truth.sh: fail count     : $FAIL_COUNT"
echo "truth.sh: bun test exit  : $TEST_EXIT"
echo "truth.sh: receipt        : $RECEIPT"

# Extraction succeeded: the probe ran, regardless of failures. Exit 0.
exit 0
