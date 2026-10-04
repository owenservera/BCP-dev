// parser.claude.sse.v1 — unit + envelope + refusal tests (synthetic fixtures,
// recorded-grammar-faithful; fixture proof, never live proof).
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseClaudeSse, resolveParser, CLAUDE_SSE_PARSER_VERSION } from "../src/parsers.ts";
import { buildChunkEnvelope } from "@vivim/omega-contracts";
import { runConformance } from "@vivim/omega-testkit";
import { join } from "node:path";

const fx = (n: string) => readFileSync(join(import.meta.dir, "fixtures", n), "utf-8");

describe("claude-sse v1 — rows", () => {
  test("text stream → meta + text + stopped-meta + done-final", () => {
    const rows = parseClaudeSse(fx("text-stream.txt"));
    expect(rows.map((r) => (r.data as { kind: string }).kind)).toEqual([
      "claude.meta", "claude.text", "claude.meta", "claude.done",
    ]);
    expect((rows[0]!.data as { key: string; value: unknown }).value).toBe("msg_01");
    expect((rows[1]!.data as { text: string }).text).toBe("Hello world");
    expect((rows[2]!.data as { key: string }).key).toBe("stopped");
    const done = rows[3]!.data as { kind: string; blocks: number; terminator: string; skippedLines: number };
    expect(done.blocks).toBe(3);
    expect(done.terminator).toBe("message_stop");
    expect(done.skippedLines).toBe(0);
    expect(rows[3]!.final).toBe(true);
  });

  test("thinking stream keeps the reasoning channel typed", () => {
    const rows = parseClaudeSse(fx("thinking-stream.txt"));
    const kinds = rows.map((r) => (r.data as { kind: string }).kind);
    expect(kinds).toEqual(["claude.meta", "claude.reasoning", "claude.text", "claude.meta", "claude.done"]);
    expect((rows[1]!.data as { text: string }).text).toBe("Let me think twice");
    expect((rows[2]!.data as { text: string }).text).toBe("Answer");
  });

  test("tool_use start → tool-call row with tc_ id grammar", () => {
    const rows = parseClaudeSse(fx("tool-stream.txt"));
    const tool = rows[1]!.data as { kind: string; toolCallId: string; toolName: string };
    expect(tool.kind).toBe("claude.tool_use");
    expect(tool.toolCallId).toMatch(/^tc_\d+$/);
    expect(tool.toolName).toBe("get_weather");
  });

  test("malformed data line is counted, not silent", () => {
    const rows = parseClaudeSse(fx("malformed-line.txt"));
    const done = rows[rows.length - 1]!.data as { skippedLines: number };
    expect(done.skippedLines).toBe(1);
    expect((rows[0]!.data as { text: string }).text).toBe("Hi");
  });

  test("envelope law: buildChunkEnvelope accepts (exactly-one-final)", () => {
    const chunks = buildChunkEnvelope("stream-test", parseClaudeSse(fx("text-stream.txt")));
    expect(chunks.length).toBe(4);
    expect(chunks[chunks.length - 1]!.final).toBe(true);
    expect(chunks.map((c) => c.seq)).toEqual([1, 2, 3, 4]);
  });

  test("refusals: empty / no-data / unterminated", () => {
    expect(() => parseClaudeSse("")).toThrow("empty-stream");
    expect(() => parseClaudeSse("just prose, no sse")).toThrow("no-data-lines");
    expect(() => parseClaudeSse(fx("unterminated.txt"))).toThrow("unterminated-stream");
  });

  test("resolveParser: pinned version resolves, unknown refuses", () => {
    expect(resolveParser(CLAUDE_SSE_PARSER_VERSION).version).toBe("1");
    expect(() => resolveParser("999")).toThrow("no parser pinned at version");
  });
});
