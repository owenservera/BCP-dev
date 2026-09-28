#!/usr/bin/env bash
# Build the release artifacts:
#   dist/swarm            — self-contained binary (no bun needed at runtime)
#   dist/swarm-plugin.js  — bundled swarm plugin (auto-discovered next to the binary,
#                           or pointed at via OPENCODE_SWARM_PLUGIN)
#   dist/notify-plugin.js — bundled standalone notify plugin
#   dist/opencode-swarm-<version>-linux-x64.tar.gz
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION=$(bun -e 'console.log((await Bun.file("package.json").json()).version)')
rm -rf dist && mkdir -p dist

bun build plugin/swarm.ts --target bun --outfile dist/swarm-plugin.js
bun build plugin/notify.ts --target bun --outfile dist/notify-plugin.js
bun build --compile src/cli.ts --outfile dist/swarm

tar -czf "dist/opencode-swarm-${VERSION}-linux-x64.tar.gz" -C dist swarm swarm-plugin.js notify-plugin.js -C .. README.md LICENSE
echo "built dist/opencode-swarm-${VERSION}-linux-x64.tar.gz"
