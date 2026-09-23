// parser.claude.sse.v2 — unit tests (fixtures read from v1's fixtures dir:
// TEST-ONLY file reads of data files, never code coupling — v2 shares no
// code with v1; the differential suite proves the independence).
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseClaudeSse, resolveParser } from "../src/parsers.ts";
import { buildChunkEnvelope } from "@vivim/omega-contracts";

const fx = (n: string) => readFileSync(join(import.meta.dir, "../../parser-claude-sse/test/fixtures", n), "utf-8");

describe("claude-sse v2 — rows (same grammar as v1)", () => {
  test("text stream → meta + text + stopped-meta + done-final", () => {
    const rows = parseClaudeSse(fx("text-stream.txt"));
    expect(rows.map((r) => (r.data as { kind: string }).kind)).toEqual([
      "claude.meta", "claude.text", "claude.meta", "claude.done",
    ]);
    expect((rows[1]!.data as { text: string }).text).toBe("Hello world");
    const done = rows[3]!.data as { blocks: number; terminator: string; skippedLines: number };
    expect(done).toMatchObject({ blocks: 3, terminator: "message_stop", skippedLines: 0 });
  });

  test("thinking + tool streams keep typed channels", () => {
    const t = parseClaudeSse(fx("thinking-stream.txt"));
    expect((t[1]!.data as { text: string }).text).toBe("Let me think twice");
    const u = parseClaudeSse(fx("tool-stream.txt"));
    expect((u[1]!.data as { toolName: string }).toolName).toBe("get_weather");
  });

  test("malformed line counted; envelope accepts; refusals identical", () => {
    const rows = parseClaudeSse(fx("malformed-line.txt"));
    expect((rows[rows.length - 1]!.data as { skippedLines: number }).skippedLines).toBe(1);
    const chunks = buildChunkEnvelope("v2", rows);
    expect(chunks[chunks.length - 1]!.final).toBe(true);
    expect(() => parseClaudeSse("")).toThrow("empty-stream");
    expect(() => parseClaudeSse(fx("unterminated.txt"))).toThrow("unterminated-stream");
    expect(resolveParser("1").version).toBe("1");
    expect(() => resolveParser("2")).toThrow("no parser pinned at version");
  });
});
