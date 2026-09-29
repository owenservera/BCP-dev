#!/usr/bin/env bash
# Ω Resident Team Lab — native Task permission probe (Linux rebuild).
#
# Linux/bash adaptation of scripts/probe-task-permission.ps1 from reference
# branch work/omega-endstate/STEW-01/bootstrap-team.
#
# This is an evidence probe, not a full team run. It validates that the
# isolated config/plugin files exist, prints the configured Task policy, and
# then launches OpenCode against exactly that configuration.
#
# Modes:
#   ./probe-task-permission.sh                # headless CP-01 assertions
#   ./probe-task-permission.sh --interactive  # drop into the TUI as team-root
#
# The repository previously carried a conflicting conclusion about name-scoped
# task permission. This probe exists to reconcile source-level evidence with
# live behavior on the installed build.
#
# A green process exit alone is not a proof: check artifacts/task-events.ndjson
# and the captured transcripts against docs/CHECKPOINTS.md CP-01.

set -u

LAB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_ROOT="$(cd "$LAB_DIR/../../.." && pwd)"
CONFIG_PATH="$LAB_DIR/config/opencode.team-lab.jsonc"
PLUGIN_PATH="$LAB_DIR/plugin/resident-team.ts"

B="\033[1;35m"; G="\033[1;32m"; R="\033[1;31m"; N="\033[0m"
say()  { printf "${B}[Ω]${N} %s\n" "$*"; }
pass() { printf "${G}[PASS]${N} %s\n" "$*"; }
bail() { printf "${R}[FAIL]${N} %s\n" "$*"; exit 1; }

say "Ω Resident Team Lab — native Task permission probe"
say "Project root : $PROJECT_ROOT"
say "Config       : $CONFIG_PATH"
say "Plugin       : $PLUGIN_PATH"
say "OpenCode     : $(opencode --version 2>/dev/null || echo 'NOT FOUND')"

[ -f "$CONFIG_PATH" ] || bail "Config not found: $CONFIG_PATH"
[ -f "$PLUGIN_PATH" ] || bail "Plugin not found: $PLUGIN_PATH"
[ -f "$LAB_DIR/../vendor/opencode-swarm/plugin/swarm.ts" ] || bail "Vendored swarm substrate missing (CP-00 broken)"

export OPENCODE_CONFIG="$CONFIG_PATH"

say ""
say "Configured Task policy:"
say "  team-root         -> resident-* allowed"
say "  team-root         -> worker-* denied"
say "  research-resident -> worker-* allowed"
say "  research-worker   -> all Task denied"
say ""

if [ "${1:-}" = "--interactive" ]; then
  say "Launching interactive TUI as team-root. Exercise CP-01 from docs/CHECKPOINTS.md."
  say "Expected evidence is a real allow/refusal plus child-session presence/absence."
  cd "$PROJECT_ROOT" && exec opencode
fi

say "Running headless CP-01 assertions (transcripts + events captured under artifacts/)..."
cd "$PROJECT_ROOT" && exec "$LAB_DIR/scripts/run-team-proof.sh" --cp01-only
