/**
 * Unit tests for the runtime's pure logic. No network, no model, no side effects.
 * These cover the parts that must be correct before any agent is trusted:
 * durable state, and between-turns message delivery.
 */

import { test, expect } from "bun:test";
import { Store } from "../src/db.ts";
import { Bus, renderDeliveryPrompt } from "../src/bus.ts";

function freshStore() {
  return new Store(":memory:");
}

test("runs and agents persist with workspace and verdict fields", () => {
  const s = freshStore();
  s.createRun("r1", "test-run", "{}", "C:/repo");

  s.upsertAgent({
    runId: "r1",
    name: "ver-01",
    sessionId: null,
    workspace: "C:/ws/ver-01-task",
    branch: "work/omega-endstate/ver-01/task",
    baseSha: "abc123",
    task: "falsify the claim",
    evidenceBar: "CONFIRMED | REFUTED | UNRESOLVED",
    tools: JSON.stringify({ read: true }),
    status: "allocated",
    verdict: null,
    receipt: null,
    error: null,
    updatedAt: "",
  });

  const a = s.getAgent("r1", "ver-01");
  expect(a).not.toBeNull();
  expect(a!.workspace).toBe("C:/ws/ver-01-task");
  expect(a!.baseSha).toBe("abc123");
  // An unverified agent must not be able to look finished.
  expect(a!.verdict).toBeNull();
  s.close();
});

test("UNRESOLVED is a storable, legitimate verdict", () => {
  const s = freshStore();
  s.createRun("r2", "n", "{}", "C:/repo");
  s.upsertAgent({
    runId: "r2", name: "base-01", sessionId: null, workspace: null, branch: null,
    baseSha: null, task: "t", evidenceBar: "bar", tools: "{}", status: "done",
    verdict: "UNRESOLVED", receipt: null, error: null, updatedAt: "",
  });
  expect(s.getAgent("r2", "base-01")!.verdict).toBe("UNRESOLVED");
  s.close();
});

test("agent upsert updates in place and does not duplicate", () => {
  const s = freshStore();
  s.createRun("r3", "n", "{}", "C:/repo");
  const base = {
    runId: "r3", name: "arch-01", sessionId: null, workspace: null, branch: null,
    baseSha: null, task: "t", evidenceBar: "bar", tools: "{}", status: "running",
    verdict: null, receipt: null, error: null, updatedAt: "",
  };
  s.upsertAgent(base);
  s.upsertAgent({ ...base, status: "done", sessionId: "ses_1" });
  const all = s.listAgents("r3");
  expect(all.length).toBe(1);
  expect(all[0].status).toBe("done");
  expect(all[0].sessionId).toBe("ses_1");
  s.close();
});

test("messages deliver once and are not redelivered", () => {
  const s = freshStore();
  const bus = new Bus(s);
  s.createRun("r4", "n", "{}", "C:/repo");

  const r = bus.post("r4", "arch-01", "seam-01", "found a provider healer dead end");
  expect(r.delivered).toBe(1);

  expect(bus.hasPending("r4", "seam-01")).toBe(true);
  const claimed = bus.claim("r4", "seam-01");
  expect(claimed.length).toBe(1);
  expect(claimed[0].from).toBe("arch-01");
  expect(claimed[0].body).toContain("healer dead end");

  // A second claim must be empty: no double delivery, no infinite replay.
  expect(bus.claim("r4", "seam-01").length).toBe(0);
  expect(bus.hasPending("r4", "seam-01")).toBe(false);
  s.close();
});

test("broadcast reaches every other agent exactly once", () => {
  const s = freshStore();
  const bus = new Bus(s);
  s.createRun("r5", "n", "{}", "C:/repo");
  const stub = (name: string) => ({
    runId: "r5", name, sessionId: null, workspace: null, branch: null, baseSha: null,
    task: "t", evidenceBar: "b", tools: "{}", status: "allocated", verdict: null,
    receipt: null, error: null, updatedAt: "",
  });
  s.upsertAgent(stub("stew-01"));
  s.upsertAgent(stub("base-01"));
  s.upsertAgent(stub("ver-01"));

  const r = bus.post("r5", "stew-01", "*", "stop using inherited metrics");
  expect(r.delivered).toBe(2); // everyone except the sender
  expect(bus.claim("r5", "base-01").length).toBe(1);
  expect(bus.claim("r5", "ver-01").length).toBe(1);
  s.close();
});

test("self-messaging and empty bodies are rejected, not silently dropped", () => {
  const s = freshStore();
  const bus = new Bus(s);
  s.createRun("r6", "n", "{}", "C:/repo");
  s.upsertAgent({
    runId: "r6", name: "seam-01", sessionId: null, workspace: null, branch: null,
    baseSha: null, task: "t", evidenceBar: "b", tools: "{}", status: "allocated",
    verdict: null, receipt: null, error: null, updatedAt: "",
  });
  expect(bus.post("r6", "seam-01", "seam-01", "hello").rejected).toMatch(/yourself/);
  expect(bus.post("r6", "seam-01", "base-01", "   ").rejected).toMatch(/empty/);
  s.close();
});

test("shared memory is per-run and searchable by key, value or tag", () => {
  const s = freshStore();
  s.createRun("r7", "n", "{}", "C:/repo");
  s.createRun("r8", "n", "{}", "C:/repo");

  s.memorySet("r7", "architecture/browser-seam", "cdp realizes email archetype", "arch-01", "finding");
  s.memorySet("r8", "architecture/browser-seam", "different run, isolated", "arch-01", "finding");

  expect(s.memoryGet("r7", "architecture/browser-seam")!.value).toBe("cdp realizes email archetype");
  // Runs must not see each other's memory.
  expect(s.memoryGet("r8", "architecture/browser-seam")!.value).toBe("different run, isolated");
  expect(s.memorySearch("r7", "email").length).toBe(1);
  expect(s.memorySearch("r7", "finding").length).toBe(1);
  expect(s.memorySearch("r7", "nonexistent").length).toBe(0);

  s.memorySet("r7", "architecture/browser-seam", "updated value", "ver-01");
  expect(s.memoryGet("r7", "architecture/browser-seam")!.value).toBe("updated value");
  s.close();
});

test("delivery prompt names the sender and is empty for no messages", () => {
  expect(renderDeliveryPrompt("seam-01", [])).toBe("");
  const p = renderDeliveryPrompt("seam-01", [
    { id: 1, from: "arch-01", to: "seam-01", body: "selector healer died in 2019" },
  ]);
  expect(p).toContain("arch-01");
  expect(p).toContain("selector healer died in 2019");
  expect(p).toContain("seam-01");
});

test("message history is retained after delivery, so a run is auditable", () => {
  const s = freshStore();
  const bus = new Bus(s);
  s.createRun("r9", "n", "{}", "C:/repo");
  bus.post("r9", "a", "b", "one");
  bus.claim("r9", "b");
  bus.post("r9", "a", "b", "two");
  bus.claim("r9", "b");
  const hist = bus.history("r9");
  expect(hist.length).toBe(2);
  // deliveredAt is set, but the record survives for the run report.
  expect(hist.every((m) => m.deliveredAt !== null)).toBe(true);
  s.close();
});
