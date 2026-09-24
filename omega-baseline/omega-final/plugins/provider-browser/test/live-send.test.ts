// plugins/provider-browser/test/live-send.test.ts
// P1-08 M4 pre-live contract/unit evidence. These tests exercise the
// deterministic pieces of the real execution path without pretending that a
// Chrome instance is attached. Live M4 remains owner-run: bun test + omega:gate.
import { describe, test, expect } from "bun:test";
import {
  CHATGPT_COMPOSER_SELECTORS,
  CHATGPT_SEND_SELECTORS,
  buildClickExpression,
  buildReadComposerExpression,
  buildTypeExpression,
  isChatGptConversationUrl,
  isChatGptPage,
  parseChatGptStream,
  validateLiveSessionDescriptor,
} from "../src/live.ts";
import { buildSessionRecord, asSessionRecord, sessionId } from "../src/session.ts";

describe("P1-08 live ChatGPT execution — migrated behavior", () => {
  test("fixed selector order matches the proven MIG-001/VIVIM source", () => {
    expect([...CHATGPT_COMPOSER_SELECTORS]).toEqual([
      "#prompt-textarea",
      "textarea[data-testid='prompt-textarea']",
      "div[contenteditable='true'][data-testid='prompt-textarea']",
    ]);
    expect([...CHATGPT_SEND_SELECTORS]).toEqual([
      "button[data-testid='send-button']",
      "button[aria-label='Send prompt']",
      "form button[type='submit']",
    ]);
  });

  test("typing expression uses the HTMLTextAreaElement native setter and emits input/change", () => {
    const expression = buildTypeExpression("#prompt-textarea", "Hello — exact");
    expect(expression).toContain('HTMLTextAreaElement.prototype');
    expect(expression).toContain('setter.call(el');
    expect(expression).toContain('new Event("input"');
    expect(expression).toContain('new Event("change"');
    expect(expression).toContain("Hello — exact");
  });

  test("content read-back and submit expressions are explicit", () => {
    expect(buildReadComposerExpression("#prompt-textarea")).toContain("el.value");
    expect(buildClickExpression("button[data-testid='send-button']")).toContain(".click()");
  });

  test("outgoing body survives JSON embedding exactly, including quotes and unicode", () => {
    const body = 'Line 1\n"quotes" / emoji 🚀 / café / \\';
    const expression = buildTypeExpression("#prompt-textarea", body);
    expect(expression).toContain(JSON.stringify(body));
  });

  test("live session descriptors are localhost-port-shaped and fail closed", () => {
    expect(validateLiveSessionDescriptor({ providerId: "chatgpt", debugPort: 9222 })).toEqual({
      providerId: "chatgpt",
      debugPort: 9222,
    });
    expect(() => validateLiveSessionDescriptor({ providerId: "claude", debugPort: 9222 })).toThrow(/only the ChatGPT realization/);
    expect(() => validateLiveSessionDescriptor({ providerId: "chatgpt", debugPort: 80 })).toThrow(/debugPort/);
    expect(() => validateLiveSessionDescriptor({ providerId: "chatgpt", debugPort: "9222" })).toThrow(/debugPort/);
  });

  test("page and stream URL classification stays on real ChatGPT localhost-substrate targets", () => {
    expect(isChatGptPage("https://chatgpt.com/chat/c_test")).toBe(true);
    expect(isChatGptPage("https://claude.ai/chat")).toBe(false);
    expect(isChatGptConversationUrl("https://chatgpt.com/backend-api/conversation")).toBe(true);
    expect(isChatGptConversationUrl("https://chatgpt.com/api/conversation")).toBe(true);
    expect(isChatGptConversationUrl("https://example.test/backend-api/conversation")).toBe(false);
  });

  test("MIG-001 OpenAI delta stream maps to ordered chunks and exactly one final", () => {
    const raw = [
      'data: {"id":"msg-real","choices":[{"delta":{"content":"Hello "},"finish_reason":null}]}',
      'data: {"choices":[{"delta":{"content":"world"},"finish_reason":null}]}',
      'data: {"choices":[{"delta":{},"finish_reason":"stop"}]}',
      "data: [DONE]",
    ].join("\n");
    const result = parseChatGptStream(raw);
    expect(result.providerMessageId).toBe("msg-real");
    expect(result.chunks.slice(0, 2).map((c) => c.data)).toEqual([
      { kind: "assistant.delta", text: "Hello ", providerMessageId: "msg-real" },
      { kind: "assistant.delta", text: "world", providerMessageId: "msg-real" },
    ]);
    expect(result.chunks.filter((c) => c.final)).toHaveLength(1);
    expect(result.chunks.at(-1)?.final).toBe(true);
  });

  test("harvested ChatGPT patch rules are preserved", () => {
    const raw = [
      'data: {"o":"patch","v":[{"p":"/message/content/parts/0","o":"append","v":"part A"},{"p":"/other","o":"append","v":"ignored"}]}',
      'data: {"o":"add","v":{"message":{"id":"msg-parts","content":{"parts":["part B"]}}}}',
      "data: [DONE]",
    ].join("\n");
    const result = parseChatGptStream(raw);
    expect(result.providerMessageId).toBe("msg-parts");
    expect(result.chunks.filter((c) => !c.final).map((c) => c.data)).toEqual([
      { kind: "assistant.delta", text: "part A", providerMessageId: "msg-parts" },
      { kind: "assistant.delta", text: "part B", providerMessageId: "msg-parts" },
    ]);
  });

  test("malformed or incomplete streams refuse by named failure; raw text is never silently accepted", () => {
    expect(() => parseChatGptStream("data: {broken")).toThrow(/MSG_SEND_STREAM_MALFORMED/);
    expect(() => parseChatGptStream('data: {"choices":[{"delta":{"content":"x"}}]}')).toThrow(/MSG_SEND_STREAM_INCOMPLETE/);
    expect(() => parseChatGptStream("plain text")).toThrow(/MSG_SEND_STREAM_FORMAT_UNKNOWN/);
  });

  test("live session record is not mislabeled as a fixture", () => {
    const captureRef = { ns: "providers", id: "capture:c_live", rev: 1 };
    const row = buildSessionRecord({
      sessionId: sessionId("live_abc"),
      archetypeSlug: "message.send",
      parserVersion: "1",
      captureRef,
      live: { providerId: "chatgpt", debugPort: 9222 },
    });
    expect(row.sim).toBe(false);
    expect(row.live).toEqual({ providerId: "chatgpt", debugPort: 9222 });
    expect(asSessionRecord(structuredClone(row))).toEqual(row);
    expect(asSessionRecord({ ...row, sim: true })).toBeNull();
  });
});
