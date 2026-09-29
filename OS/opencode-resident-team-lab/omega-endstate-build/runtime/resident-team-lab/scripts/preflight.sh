#!/usr/bin/env bash
# Ω Resident Team Lab — shared preflight (sourced by the case runners).
# Deploys the plugin byte-identically, provisions the substrate shim,
# prepares evidence targets, and defines run_case().
LAB_DIR="${LAB_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
PROJECT_ROOT="$(cd "$LAB_DIR/../../.." && pwd)"
CONFIG_PATH="$LAB_DIR/config/opencode.team-lab.jsonc"
ARTIFACTS="$LAB_DIR/artifacts"
EVENTS="$ARTIFACTS/task-events.ndjson"
EVIDENCE="$PROJECT_ROOT/sandbox-evidence"

export OPENCODE_CONFIG="$CONFIG_PATH"

# --- plugin deployment (empirically required on OpenCode 1.18.33) ----------
DEPLOYED="$PROJECT_ROOT/.opencode/plugin/resident-team-lab.ts"
mkdir -p "$PROJECT_ROOT/.opencode/plugin"
cp -f "$LAB_DIR/plugin/resident-team.ts" "$DEPLOYED"
cmp -s "$LAB_DIR/plugin/resident-team.ts" "$DEPLOYED" || { echo "[FAIL] plugin deployment mismatch"; exit 1; }

# --- substrate shim (idempotent; AFTER any npm install) ---------------------
mkdir -p "$ARTIFACTS" "$EVIDENCE"
if [ ! -f "$PROJECT_ROOT/node_modules/zod/package.json" ]; then
  (cd "$PROJECT_ROOT" && npm install zod@^4 --no-save --silent >/dev/null 2>&1)
fi
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
fi

# --- sandbox-evidence targets ------------------------------------------------
opencode --version > "$EVIDENCE/opencode-version.txt" 2>&1
printf '%s\n' "opencode-ai npm package, installed $(date -u +%FT%TZ)" >> "$EVIDENCE/opencode-version.txt"
printf '%s\n' "The quick brown fox jumps over the lazy dog." > "$EVIDENCE/sample-observation.txt"
printf '%s\n' "- alpha marker file" > "$EVIDENCE/marker-alpha.md"
printf '%s\n' "- beta marker file"  > "$EVIDENCE/marker-beta.md"

# --- case runner --------------------------------------------------------------
# Anonymous free-tier gateway latency is highly variable (5s-120s+) and
# occasionally returns empty streams; retry until a non-empty transcript.
run_case() { # <name> <timeout_sec> <prompt>
  local name="$1" tmo="$2"; shift 2
  local prompt="$*"
  local out="$ARTIFACTS/$name.stdout.log" err="$ARTIFACTS/$name.stderr.log"
  local attempt rc
  for attempt in 1 2 3; do
    echo "[Ω] case '$name' attempt $attempt (timeout ${tmo}s)"
    ( cd "$PROJECT_ROOT" && setsid timeout -k 5 "$tmo" opencode run --agent team-root "$prompt" >"$out" 2>"$err" </dev/null )
    rc=$?
    if [ "$rc" -eq 0 ] && [ -s "$out" ]; then
      echo "[Ω] case '$name' exit=$rc (attempt $attempt ok)"
      break
    fi
    echo "[Ω] case '$name' attempt $attempt unusable (rc=$rc, $(wc -c <"$out") bytes) — retrying"
  done
  cp -f "$EVENTS" "$ARTIFACTS/$name.task-events.ndjson" 2>/dev/null
}
