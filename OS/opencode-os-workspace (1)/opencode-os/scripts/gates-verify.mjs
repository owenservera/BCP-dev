#!/usr/bin/env node
// Gate scoreboard runner — executes every proof layer and prints the
// G1/G2/G3 table from GATES.md. Exits non-zero if any layer fails.

import { execSync, spawnSync } from "node:child_process";
import path from "node:path";
import url from "node:url";
import fs from "node:fs";

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const run = (cmd, opts = {}) => {
  console.log(`\n$ ${cmd}`);
  return execSync(cmd, { cwd: ROOT, stdio: "inherit", encoding: "utf8", ...opts });
};

const layers = [];
function layer(name, fn) {
  console.log(`\n=== ${name} ===`);
  try {
    fn();
    layers.push([name, true, ""]);
  } catch (e) {
    layers.push([name, false, String(e.message).split("\n")[0]]);
    console.error(`LAYER FAILED: ${e.message}`);
  }
}

layer("Rust core (opencode-core)", () => {
  run("cargo test -p opencode-core --manifest-path src-tauri/crates/opencode-core/Cargo.toml");
});

layer("Frontend + bridge unit tests", () => {
  run("node --test tests/unit.test.mjs tests/bridge.test.mjs");
});

layer("Browser end-to-end (Scenarios A + B + C)", () => {
  const r = spawnSync("node", ["e2e/run.mjs"], { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) throw new Error("e2e suite failed");
});

console.log("\n================ GATE SCOREBOARD ================");
let allOk = true;
for (const [name, ok, note] of layers) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${note ? ` — ${note}` : ""}`);
  if (!ok) allOk = false;
}
console.log("=================================================");
console.log("Gate mapping: G1.1–G1.10 → e2e Scenario A · G2.1–G2.7 → core tests + bridge + e2e · G3.1–G3.6 → core + e2e Scenario B + CI workflows · G4.1–G4.7 → host.rs + bridge host tests + e2e Scenario C");
if (!allOk) process.exit(1);
