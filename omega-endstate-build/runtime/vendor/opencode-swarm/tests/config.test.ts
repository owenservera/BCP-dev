import { test, expect } from "bun:test"
import { parseModel, validateConfig } from "../src/config.ts"

test("parseModel splits on the first slash only", () => {
  expect(parseModel("openrouter/openai/gpt-4o-mini")).toEqual({
    providerID: "openrouter",
    modelID: "openai/gpt-4o-mini",
  })
  expect(parseModel("anthropic/claude-sonnet-4-6")).toEqual({
    providerID: "anthropic",
    modelID: "claude-sonnet-4-6",
  })
})

test("parseModel rejects malformed model strings", () => {
  expect(() => parseModel("no-slash")).toThrow()
  expect(() => parseModel("/leading")).toThrow()
  expect(() => parseModel("trailing/")).toThrow()
})

const base = {
  name: "s",
  model: "openrouter/openai/gpt-4o-mini",
  agents: [{ name: "a", task: "do things" }],
}

test("validateConfig accepts a minimal valid config", () => {
  expect(validateConfig(base).name).toBe("s")
})

test("validateConfig rejects missing pieces", () => {
  expect(() => validateConfig({})).toThrow()
  expect(() => validateConfig({ ...base, agents: [] })).toThrow()
  expect(() => validateConfig({ ...base, agents: [{ name: "a" }] })).toThrow(/task/)
  expect(() => validateConfig({ ...base, model: "bad" })).toThrow(/model/)
})

test("validateConfig rejects duplicate and reserved agent names", () => {
  expect(() =>
    validateConfig({ ...base, agents: [{ name: "a", task: "t" }, { name: "a", task: "t" }] }),
  ).toThrow(/duplicate/)
  expect(() => validateConfig({ ...base, agents: [{ name: "*", task: "t" }] })).toThrow(/reserved/)
})
