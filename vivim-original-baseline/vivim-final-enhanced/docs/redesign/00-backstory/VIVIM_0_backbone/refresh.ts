#!/usr/bin/env bun
/**
 * Backbone Refresh — single command that runs the full pipeline
 *
 * Usage:
 *   bun .backbone/refresh.ts [track]   # track = all | ship | arch | admit
 *
 * This runs: runner → test-mapper → gate → wave-planner
 * And reports: what changed, what's shippable, what needs arch work
 */

import { spawn } from "bun";

const BACKBONE = "C:\\0-BlackBoxProject-0\\VIVIM_0\\.backbone";
const args = process.argv.slice(2);
const track = (args.find(a => ["all", "ship", "arch", "admit"].includes(a)) || "all") as string;

async function runScript(name: string, extraArgs: string[] = []): Promise<number> {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`RUNNING: ${name} ${extraArgs.join(" ")}`);
  console.log("=".repeat(60));
  const proc = spawn({
    cmd: ["bun", join(BACKBONE, name), ...extraArgs],
    cwd: "C:\\0-BlackBoxProject-0\\VIVIM_0",
    stdout: "inherit",
    stderr: "inherit"
  });
  await proc.exited;
  return proc.exitCode || 0;
}

function join(...parts: string[]): string {
  return parts.join("/").replace(/\//g, "\\");
}

const steps: Array<[string, string[]]> = [];
if (track === "all" || track === "ship") {
  steps.push(["runner.ts", []]);
  steps.push(["test-mapper.ts", []]);
  steps.push(["gate.ts", []]);
  steps.push(["wave-planner.ts", ["ship"]]);
}
if (track === "arch") {
  steps.push(["runner.ts", []]);
  steps.push(["test-mapper.ts", []]);
  steps.push(["gate.ts", []]);
  steps.push(["wave-planner.ts", ["arch"]]);
}
if (track === "admit") {
  console.log("Use 'bun .backbone/admit.ts <command>' for admission flow");
  process.exit(0);
}

const start = Date.now();
let failed = 0;
for (const [name, extraArgs] of steps) {
  const code = await runScript(name, extraArgs);
  if (code !== 0) {
    failed++;
    console.error(`\nFAILED: ${name} exited with code ${code}`);
  }
}
const dur = ((Date.now() - start) / 1000).toFixed(1);

console.log(`\n${"=".repeat(60)}`);
console.log(`REFRESH COMPLETE in ${dur}s (track=${track})`);
console.log(`${steps.length - failed}/${steps.length} steps succeeded`);
console.log("=".repeat(60));

if (failed > 0) process.exit(1);
