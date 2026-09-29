import { test, expect } from "bun:test"
import { resolve } from "node:path"

const CLI = resolve(import.meta.dir, "../src/cli.ts")

async function run(...args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  const proc = Bun.spawn(["bun", CLI, ...args], { stdout: "pipe", stderr: "pipe" })
  const [stdout, stderr] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()])
  return { code: await proc.exited, stdout, stderr }
}

test("--help and --version exit 0 (Docker smoke checks rely on this)", async () => {
  for (const flag of ["--help", "-h", "help"]) {
    const r = await run(flag)
    expect(r.code).toBe(0)
    expect(r.stdout).toContain("usage:")
  }
  const v = await run("--version")
  expect(v.code).toBe(0)
  expect(v.stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/)
})

test("bare invocation prints usage and exits 0", async () => {
  const r = await run()
  expect(r.code).toBe(0)
  expect(r.stdout).toContain("usage:")
})

test("unknown commands exit 1", async () => {
  const r = await run("frobnicate")
  expect(r.code).toBe(1)
  expect(r.stderr).toContain("unknown command")
})
