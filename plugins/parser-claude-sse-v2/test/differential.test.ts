// DIFFERENTIAL PROOF (the substitution contract for parsers):
// v1 and v2 share NO code — this TEST-ONLY relative import is the single
// coupling point, and it exists only to prove byte-identity. Prod code in
// either plugin never imports the other (B2). If this import ever appears
// outside test/, the experiment is void.
import { describe, test, expect } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseClaudeSse as parseV1 } from "../../parser-claude-sse/src/parsers.ts";
import { parseClaudeSse as parseV2 } from "../src/parsers.ts";
import { buildChunkEnvelope } from "@vivim/omega-contracts";

const FIXDIR = join(import.meta.dir, "../../parser-claude-sse/test/fixtures");

// Inline edge-case corpus (self-contained: no fixture-dir dependence).
const DONE_SENTINEL = [
  'data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":"A"}}',
  'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"B"}}',
  'data: [DONE]',
  'data: {"type":"message_stop"}', // must be ignored: [DONE] already terminated
].join("\n");

const MULTI_BLOCK = [
  'data: {"type":"message_start","message":{"id":"m"}}',
  'data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":"t0"}}',
  'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"+t0"}}',
  'data: {"type":"content_block_stop","index":0}',
  'data: {"type":"content_block_start","index":1,"content_block":{"type":"thinking","thinking":"h"}}',
  'data: {"type":"content_block_delta","index":1,"delta":{"type":"thinking_delta","thinking":"+h"}}',
  'data: {"type":"content_block_stop","index":1}',
  'data: {"type":"content_block_start","index":2,"content_block":{"type":"tool_use","name":"calc","input":{"x":1}}}',
  'data: {"type":"content_block_stop","index":2}',
  'data: {"type":"message_stop"}',
].join("\n");

const DELTA_AFTER_META = [
  'data: {"type":"message_start","message":{"id":"m"}}',
  'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"orphan"}}',
  'data: {"type":"message_stop"}',
].join("\n");

const IMAGE_BLOCK = [
  'data: {"type":"content_block_start","index":0,"content_block":{"type":"image","source":{"type":"base64","media_type":"image/png"},"alt":"pic"}}',
  'data: {"type":"message_stop"}',
].join("\n");

describe("differential: v1 ≡ v2 on all in-domain inputs", () => {
  const files = readdirSync(FIXDIR).filter((f) => f.endsWith(".txt") && f !== "unterminated.txt");
  for (const f of files) {
    test(`fixture ${f}: byte-identical rows`, () => {
      const text = readFileSync(join(FIXDIR, f), "utf-8");
      expect(JSON.stringify(parseV2(text))).toBe(JSON.stringify(parseV1(text)));
    });
  }

  for (const [name, text] of [["done-sentinel", DONE_SENTINEL], ["multi-block", MULTI_BLOCK], ["delta-after-meta", DELTA_AFTER_META], ["image-block", IMAGE_BLOCK]] as const) {
    test(`inline ${name}: byte-identical rows + envelope accepts both`, () => {
      const a = parseV1(text);
      const b = parseV2(text);
      expect(JSON.stringify(b)).toBe(JSON.stringify(a));
      expect(buildChunkEnvelope("a", a).length).toBe(buildChunkEnvelope("b", b).length);
    });
  }

  test("refusal law identical: same inputs throw on both", () => {
    const bad = ["", "no sse here", readFileSync(join(FIXDIR, "unterminated.txt"), "utf-8")];
    for (const text of bad) {
      let ea = "", eb = "";
      try { parseV1(text); } catch (e) { ea = String(e); }
      try { parseV2(text); } catch (e) { eb = String(e); }
      expect(eb.length).toBeGreaterThan(0);
      expect(ea.length).toBeGreaterThan(0);
      // same refusal CLASS (drop "Error:" prefix + version tag; compare the rest)
      expect(eb.split(": ").slice(2).join(": ")).toBe(ea.split(": ").slice(2).join(": "));
    }
  });
});
