#!/usr/bin/env bash
# Live check: verify a zen API key can round-trip through the installed
# OpenCode CLI. Used by consumers (and CI smoke) after first-run setup.
#
# Usage: OPENCODE_API_KEY=sk-... bash scripts/zen-check.sh [model]
set -euo pipefail

MODEL="${1:-opencode/space-bunny-free}"

if [ -z "${OPENCODE_API_KEY:-}" ]; then
  echo "OPENCODE_API_KEY is not set. Get a free key at https://opencode.ai/auth"
  exit 2
fi

export OPENCODE_API_KEY
echo "Model: $MODEL"
echo "Asking the model to identify itself..."
timeout 90 opencode run -m "$MODEL" "Reply with exactly: ZEN_OK" 2>&1 | tail -5

echo "If the output above contains ZEN_OK, your zen key works."
