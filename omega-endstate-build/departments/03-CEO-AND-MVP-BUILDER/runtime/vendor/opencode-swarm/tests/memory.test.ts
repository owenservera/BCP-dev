import { test, expect, beforeEach } from "bun:test"
import { openDb } from "../src/db.ts"
import { SwarmMemory } from "../src/memory.ts"

let mem: SwarmMemory
let other: SwarmMemory

beforeEach(() => {
  const db = openDb(":memory:")
  mem = new SwarmMemory(db, "sw_test")
  other = new SwarmMemory(db, "sw_other")
})

test("set and get a value", () => {
  mem.set("api-design", "REST with cursor pagination", { updatedBy: "architect" })
  const entry = mem.get("api-design")
  expect(entry?.value).toBe("REST with cursor pagination")
  expect(entry?.updatedBy).toBe("architect")
})

test("get returns null for missing key", () => {
  expect(mem.get("nope")).toBeNull()
})

test("set overwrites existing key", () => {
  mem.set("k", "v1")
  mem.set("k", "v2", { updatedBy: "coder" })
  expect(mem.get("k")?.value).toBe("v2")
  expect(mem.list().length).toBe(1)
})

test("memory is isolated per swarm", () => {
  mem.set("k", "mine")
  expect(other.get("k")).toBeNull()
})

test("search matches key, value, and tags", () => {
  mem.set("auth-decision", "use JWT tokens", { tags: ["security"] })
  mem.set("db-choice", "postgres 16", { tags: ["infra"] })
  expect(mem.search("auth").map((e) => e.key)).toEqual(["auth-decision"])
  expect(mem.search("postgres").map((e) => e.key)).toEqual(["db-choice"])
  expect(mem.search("security").map((e) => e.key)).toEqual(["auth-decision"])
  expect(mem.search("zzz")).toEqual([])
})

test("list returns all entries with tags round-tripped", () => {
  mem.set("a", "1", { tags: ["x", "y"] })
  mem.set("b", "2")
  const entries = mem.list()
  expect(entries.length).toBe(2)
  expect(entries.find((e) => e.key === "a")?.tags).toEqual(["x", "y"])
  expect(entries.find((e) => e.key === "b")?.tags).toEqual([])
})
