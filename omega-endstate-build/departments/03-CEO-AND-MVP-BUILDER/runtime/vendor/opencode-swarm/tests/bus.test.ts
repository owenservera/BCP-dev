import { test, expect, beforeEach } from "bun:test"
import { openDb } from "../src/db.ts"
import { MessageBus } from "../src/bus.ts"

let bus: MessageBus

beforeEach(() => {
  bus = new MessageBus(openDb(":memory:"), "sw_test")
})

test("send and read inbox", () => {
  bus.send("researcher", "coder", "the API docs are at /docs/api.md")
  const msgs = bus.inbox("coder")
  expect(msgs.length).toBe(1)
  expect(msgs[0]?.from).toBe("researcher")
  expect(msgs[0]?.body).toContain("API docs")
})

test("inbox only shows my messages", () => {
  bus.send("a", "b", "for b")
  bus.send("a", "c", "for c")
  expect(bus.inbox("b").length).toBe(1)
  expect(bus.inbox("b")[0]?.body).toBe("for b")
})

test("broadcast delivers to every recipient", () => {
  bus.broadcast("lead", ["coder", "reviewer"], "stand-up in memory key 'plan'")
  expect(bus.inbox("coder").length).toBe(1)
  expect(bus.inbox("reviewer").length).toBe(1)
  expect(bus.inbox("lead").length).toBe(0)
})

test("markDelivered removes messages from undelivered view", () => {
  const id = bus.send("a", "b", "hello")
  expect(bus.undelivered().length).toBe(1)
  bus.markDelivered([id])
  expect(bus.undelivered().length).toBe(0)
  // still visible in full inbox history
  expect(bus.inbox("b", { all: true }).length).toBe(1)
  // but not in default (undelivered) inbox
  expect(bus.inbox("b").length).toBe(0)
})

test("messages are isolated per swarm", () => {
  const db = openDb(":memory:")
  const busA = new MessageBus(db, "sw_a")
  const busB = new MessageBus(db, "sw_b")
  busA.send("x", "y", "swarm A internal")
  expect(busB.inbox("y").length).toBe(0)
})
