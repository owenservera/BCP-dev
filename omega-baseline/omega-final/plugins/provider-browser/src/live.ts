// plugins/provider-browser — live.ts
// P1-08: minimal real ChatGPT execution path, harvested from MIG-001 and the
// proven VIVIM ChatGPT/composer/CDP behavior.
//
// Boundary law:
// - localhost CDP only; the caller supplies a debug port, never an arbitrary
//   websocket URL or remote host.
// - no credential reads or login automation.
// - the live response is kept in memory long enough to parse, then only
//   non-secret execution metadata crosses the vault boundary.
// - once the send click happens, this function never retries the send intent.
//   Capture/parse failure after that point is a named failure, not a duplicate.
//
// This is deliberately a small port of behavior, not a copy of the VIVIM
// implementation. The VIVIM ChromeGovernor/CDP stack remains historical source
// evidence; Ω keeps the execution inside this plugin because P1-08 cannot add a
// host surface in this round.

import type { ParsedChunk } from "@vivim/omega-contracts";
import { PARSER_VERSION, parseChatGptStream, resolveParser } from "./parsers.ts";
export { parseChatGptStream };

export const CHATGPT_HOME = "https://chatgpt.com/";
export const CHATGPT_COMPOSER_SELECTORS = [
  "#prompt-textarea",
  "textarea[data-testid='prompt-textarea']",
  "div[contenteditable='true'][data-testid='prompt-textarea']",
] as const;
export const CHATGPT_SEND_SELECTORS = [
  "button[data-testid='send-button']",
  "button[aria-label='Send prompt']",
  "form button[type='submit']",
] as const;

export const SELECTOR_WAIT_MS = 10_000;
export const SELECTOR_POLL_MS = 200;
export const NAVIGATE_SETTLE_MS = 3_000;
export const STREAM_TIMEOUT_MS = 60_000;

export interface LiveSessionDescriptor {
  providerId: "chatgpt";
  debugPort: number;
}

export interface LiveSendResult {
  providerMessageId?: string;
  chunks: ParsedChunk[];
  responseUrl: string;
  responseStatus: number;
}

/** Named live-send failure. The code prefix is intentionally stable so callers
 * can classify failures without parsing prose. */
export class LiveSendError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(`${code}: ${message}`);
    this.name = "LiveSendError";
  }
}

export function validateLiveSessionDescriptor(input: unknown): LiveSessionDescriptor {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new LiveSendError("MSG_SEND_LIVE_SESSION_INVALID", "live session descriptor must be an object");
  }
  const p = input as Record<string, unknown>;
  if (p.providerId !== "chatgpt") {
    throw new LiveSendError("MSG_SEND_LIVE_PROVIDER_UNSUPPORTED", "only the ChatGPT realization is implemented in Phase 1");
  }
  if (
    typeof p.debugPort !== "number" ||
    !Number.isInteger(p.debugPort) ||
    p.debugPort < 1024 ||
    p.debugPort > 65535
  ) {
    throw new LiveSendError("MSG_SEND_LIVE_PORT_INVALID", "debugPort must be an integer from 1024 through 65535");
  }
  return { providerId: "chatgpt", debugPort: p.debugPort };
}

interface WebSocketLike {
  readyState: number;
  send(data: string): void;
  close(code?: number, reason?: string): void;
  onopen: (() => void) | null;
  onmessage: ((event: { data: unknown }) => void) | null;
  onerror: (() => void) | null;
  onclose: (() => void) | null;
}

interface Pending {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  timer: ReturnType<typeof setTimeout>;
  method: string;
}

interface CdpEvent {
  method?: string;
  params?: Record<string, unknown>;
  sessionId?: string;
}

interface CdpResult {
  result?: { value?: unknown; description?: string };
  exceptionDetails?: unknown;
}

class LocalCdpClient {
  private ws: WebSocketLike | null = null;
  private nextId = 0;
  private pending = new Map<number, Pending>();
  private handlers = new Set<(event: CdpEvent) => void>();
  private sessionId = "";
  private disconnected = false;

  async connect(debugPort: number): Promise<void> {
    const wsUrl = await this.resolveBrowserWs(debugPort);
    const WebSocketCtor = (globalThis as unknown as {
      WebSocket?: new (url: string) => WebSocketLike;
    }).WebSocket;
    if (!WebSocketCtor) {
      throw new LiveSendError("MSG_SEND_CDP_UNAVAILABLE", "WebSocket is unavailable in the plugin runtime");
    }

    const ws = new WebSocketCtor(wsUrl);
    this.ws = ws;
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new LiveSendError("MSG_SEND_CDP_TIMEOUT", "browser websocket open timed out")), 5_000);
      ws.onopen = () => {
        clearTimeout(timer);
        resolve();
      };
      ws.onerror = () => {
        clearTimeout(timer);
        reject(new LiveSendError("MSG_SEND_CDP_UNAVAILABLE", "browser websocket failed to open"));
      };
    });

    ws.onmessage = (event) => {
      let message: Record<string, unknown>;
      try {
        message = JSON.parse(String(event.data)) as Record<string, unknown>;
      } catch {
        return;
      }
      const id = typeof message.id === "number" ? message.id : undefined;
      if (id !== undefined) {
        const wait = this.pending.get(id);
        if (!wait) return;
        this.pending.delete(id);
        clearTimeout(wait.timer);
        if (message.error) {
          const error = message.error as { message?: string; code?: number };
          wait.reject(new LiveSendError("MSG_SEND_CDP_COMMAND_FAILED", `${wait.method}: ${error.message ?? "unknown CDP error"} (${error.code ?? "unknown"})`));
        } else {
          wait.resolve(message.result);
        }
        return;
      }
      const eventMessage: CdpEvent = {
        method: typeof message.method === "string" ? message.method : undefined,
        params: message.params as Record<string, unknown> | undefined,
        sessionId: typeof message.sessionId === "string" ? message.sessionId : undefined,
      };
      for (const handler of this.handlers) handler(eventMessage);
    };
    ws.onclose = () => {
      this.disconnected = true;
    };
    ws.onerror = () => {
      this.disconnected = true;
    };

    const targets = (await this.call("Target.getTargets")) as {
      targetInfos?: Array<{ targetId?: string; type?: string; url?: string }>;
    };
    const pages = targets.targetInfos?.filter((t) => t.type === "page" && typeof t.targetId === "string") ?? [];
    const target =
      pages.find((t) => String(t.url ?? "").includes("chatgpt.com")) ??
      pages.find((t) => String(t.url ?? "") !== "devtools://devtools/") ??
      pages[0];

    if (!target?.targetId) {
      const created = (await this.call("Target.createTarget", { url: CHATGPT_HOME })) as { targetId?: string };
      if (!created.targetId) throw new LiveSendError("MSG_SEND_CDP_TARGET", "Chrome could not create a page target");
      const attached = (await this.call("Target.attachToTarget", { targetId: created.targetId, flatten: true })) as {
        sessionId?: string;
      };
      this.sessionId = attached.sessionId ?? "";
    } else {
      const attached = (await this.call("Target.attachToTarget", { targetId: target.targetId, flatten: true })) as {
        sessionId?: string;
      };
      this.sessionId = attached.sessionId ?? "";
    }
    if (!this.sessionId) {
      throw new LiveSendError("MSG_SEND_CDP_TARGET", "Chrome did not return a target session id");
    }
  }

  on(handler: (event: CdpEvent) => void): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  async call(method: string, params?: Record<string, unknown>, sessionId = ""): Promise<unknown> {
    if (this.disconnected || !this.ws || this.ws.readyState !== 1) {
      throw new LiveSendError("MSG_SEND_CDP_UNAVAILABLE", "CDP websocket is not connected");
    }
    const id = ++this.nextId;
    const payload: Record<string, unknown> = { id, method };
    if (params) payload.params = params;
    if (sessionId) payload.sessionId = sessionId;

    return new Promise<unknown>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new LiveSendError("MSG_SEND_CDP_TIMEOUT", `${method} timed out`));
      }, 30_000);
      this.pending.set(id, { resolve, reject, timer, method });
      try {
        this.ws!.send(JSON.stringify(payload));
      } catch (error) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(new LiveSendError("MSG_SEND_CDP_UNAVAILABLE", String(error)));
      }
    });
  }

  async evaluate(expression: string): Promise<unknown> {
    const raw = (await this.call(
      "Runtime.evaluate",
      { expression, returnByValue: true, awaitPromise: true },
      this.sessionId,
    )) as CdpResult | undefined;
    if (raw?.exceptionDetails) {
      throw new LiveSendError("MSG_SEND_PAGE_EVALUATION", JSON.stringify(raw.exceptionDetails));
    }
    return raw?.result?.value;
  }

  async pageState(): Promise<{ url: string; title: string; readyState: string }> {
    const value = await this.evaluate(
      "JSON.stringify({url:location.href,title:document.title,readyState:document.readyState})",
    );
    try {
      const state = JSON.parse(String(value ?? "{}")) as Record<string, unknown>;
      return {
        url: typeof state.url === "string" ? state.url : "",
        title: typeof state.title === "string" ? state.title : "",
        readyState: typeof state.readyState === "string" ? state.readyState : "",
      };
    } catch {
      throw new LiveSendError("MSG_SEND_PAGE_EVALUATION", "page state was not valid JSON");
    }
  }

  async navigate(url: string): Promise<void> {
    await this.call("Page.navigate", { url }, this.sessionId);
  }

  async enableNetwork(): Promise<void> {
    await this.call("Network.enable", {}, this.sessionId);
  }

  async captureChatGptStream(timeoutMs: number): Promise<{ body: string; url: string; status: number; headers: Record<string, string> }> {
    const matches = new Map<string, { url: string; status: number; headers: Record<string, string>; contentType: string }>();
    let chosenRequestId: string | null = null;
    let remove = () => {};
    let timer: ReturnType<typeof setTimeout> | undefined;

    const promise = new Promise<{ body: string; url: string; status: number; headers: Record<string, string> }>((resolve, reject) => {
      const cleanup = () => {
        if (timer) clearTimeout(timer);
        remove();
      };
      const fail = (error: unknown) => {
        cleanup();
        reject(error);
      };
      const done = async (requestId: string) => {
        try {
          const match = matches.get(requestId);
          if (!match) return;
          const result = (await this.call("Network.getResponseBody", { requestId }, this.sessionId)) as { body?: string };
          if (typeof result?.body !== "string") {
            throw new LiveSendError("MSG_SEND_STREAM_BODY_UNAVAILABLE", "Chrome returned no response body for the conversation stream");
          }
          cleanup();
          resolve({ body: result.body, url: match.url, status: match.status, headers: match.headers });
        } catch (error) {
          fail(error);
        }
      };
      const handler = (event: CdpEvent) => {
        if (event.sessionId !== this.sessionId) return;
        if (event.method === "Network.responseReceived") {
          const p = event.params ?? {};
          const response = p.response as {
            url?: string;
            status?: number;
            headers?: Record<string, string>;
          } | undefined;
          const url = String(response?.url ?? "");
          if (!isChatGptConversationUrl(url)) return;
          const headers = response?.headers ?? {};
          const contentTypeHeader = Object.entries(headers).find(([k]) => k.toLowerCase() === "content-type")?.[1] ?? "";
          matches.set(String(p.requestId ?? ""), {
            url,
            status: Number(response?.status ?? 0),
            headers,
            contentType: contentTypeHeader,
          });
          if (!chosenRequestId || /text\/event-stream/i.test(contentTypeHeader)) {
            chosenRequestId = String(p.requestId ?? "");
          }
        }
        if (event.method === "Network.loadingFinished") {
          const requestId = String((event.params ?? {}).requestId ?? "");
          if (requestId && requestId === chosenRequestId) void done(requestId);
        }
        if (event.method === "Network.loadingFailed") {
          const requestId = String((event.params ?? {}).requestId ?? "");
          if (requestId && matches.has(requestId)) {
            fail(new LiveSendError("MSG_SEND_STREAM_NETWORK_FAILED", `Chrome reported loadingFailed for ${requestId}`));
          }
        }
      };
      remove = this.on(handler);
      timer = setTimeout(() => {
        fail(new LiveSendError("MSG_SEND_STREAM_TIMEOUT", `no completed ChatGPT conversation response within ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return promise;
  }

  async close(): Promise<void> {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(new LiveSendError("MSG_SEND_CDP_UNAVAILABLE", "CDP client closed"));
    }
    this.pending.clear();
    const ws = this.ws;
    this.ws = null;
    if (ws) {
      try {
        ws.close(1000, "provider-browser live send complete");
      } catch {
        // best effort close
      }
    }
  }

  private async resolveBrowserWs(debugPort: number): Promise<string> {
    let lastError = "";
    for (let attempt = 0; attempt < 20; attempt++) {
      try {
        const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`, {
          signal: AbortSignal.timeout(2_000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as { webSocketDebuggerUrl?: string };
        if (typeof data.webSocketDebuggerUrl === "string") {
          try {
            const ws = new URL(data.webSocketDebuggerUrl);
            if (
              ws.protocol === "ws:" &&
              (ws.hostname === "127.0.0.1" || ws.hostname === "localhost") &&
              Number(ws.port) === debugPort
            ) {
              return data.webSocketDebuggerUrl;
            }
          } catch {
            // Fall through to retry with a named refusal.
          }
        }
        lastError = "Chrome did not advertise a localhost browser websocket";
      } catch (error) {
        lastError = String(error);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new LiveSendError("MSG_SEND_CDP_UNAVAILABLE", `no localhost Chrome websocket on :${debugPort} (${lastError})`);
  }
}

export function isChatGptPage(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "chatgpt.com" && parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isChatGptConversationUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "chatgpt.com" || parsed.protocol !== "https:") return false;
    return /\/(?:backend-api\/)?conversation(?:\/|$)/i.test(parsed.pathname) ||
      /\/api\/conversation(?:\/|$)/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

export function buildTypeExpression(selector: string, text: string): string {
  const safeSelector = JSON.stringify(selector);
  const safeText = JSON.stringify(text);
  return `(() => {
    const el = document.querySelector(${safeSelector});
    if (!el) throw new Error("composer not found");
    el.focus();
    if (el instanceof HTMLTextAreaElement) {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype, "value",
      )?.set;
      if (!setter) throw new Error("textarea value setter unavailable");
      setter.call(el, ${safeText});
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (el instanceof HTMLElement && el.isContentEditable) {
      el.textContent = "";
      document.execCommand("insertText", false, ${safeText});
      el.dispatchEvent(new InputEvent("input", { bubbles: true, data: ${safeText}, inputType: "insertText" }));
    } else {
      throw new Error("unsupported ChatGPT composer element");
    }
    return el instanceof HTMLTextAreaElement ? el.value : (el.textContent ?? "");
  })()`;
}

export function buildReadComposerExpression(selector: string): string {
  const safeSelector = JSON.stringify(selector);
  return `(() => {
    const el = document.querySelector(${safeSelector});
    if (!el) return null;
    return el instanceof HTMLTextAreaElement ? el.value : (el.textContent ?? "");
  })()`;
}

export function buildClickExpression(selector: string): string {
  const safeSelector = JSON.stringify(selector);
  return `(() => {
    const el = document.querySelector(${safeSelector});
    if (!el) throw new Error("send button not found");
    if (el instanceof HTMLButtonElement && el.disabled) throw new Error("send button disabled");
    (el as HTMLElement).click();
    return true;
  })()`;
}

function extractTextBlocks(data: Record<string, unknown>): string[] {
  const out: string[] = [];
  const choices = data.choices;
  if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
    const first = choices[0] as Record<string, unknown>;
    const delta = first.delta;
    if (delta && typeof delta === "object") {
      const content = (delta as Record<string, unknown>).content;
      if (content !== undefined && content !== null) out.push(String(content));
    }
    const message = first.message;
    if (message && typeof message === "object") {
      const parts = (message as Record<string, unknown>).content;
      if (Array.isArray(parts)) out.push(...parts.filter((x) => typeof x === "string").map(String));
      else if (typeof parts === "string") out.push(parts);
    }
  }

  const patch = data.o === "patch" ? data.v : undefined;
  if (Array.isArray(patch)) {
    for (const item of patch) {
      if (!item || typeof item !== "object") continue;
      const p = item as Record<string, unknown>;
      if (
        typeof p.p === "string" &&
        p.p.startsWith("/message/content/parts/") &&
        typeof p.v === "string" &&
        (p.o === "append" || p.o === "add" || p.o === "replace")
      ) {
        out.push(p.v);
      }
    }
  }

  const addMessage = data.o === "add" && data.v && typeof data.v === "object"
    ? data.v as Record<string, unknown>
    : undefined;
  const addInner = addMessage?.message && typeof addMessage.message === "object"
    ? addMessage.message as Record<string, unknown>
    : undefined;
  const addContent = addInner?.content && typeof addInner.content === "object"
    ? addInner.content as Record<string, unknown>
    : undefined;
  if (Array.isArray(addContent?.parts)) {
    out.push(...addContent.parts.filter((x) => typeof x === "string").map(String));
  }

  const directMessage = data.message && typeof data.message === "object"
    ? data.message as Record<string, unknown>
    : undefined;
  const directContent = directMessage?.content && typeof directMessage.content === "object"
    ? directMessage.content as Record<string, unknown>
    : undefined;
  if (Array.isArray(directContent?.parts)) {
    out.push(...directContent.parts.filter((x) => typeof x === "string").map(String));
  }

  return out;
}

function providerMessageIdOf(data: Record<string, unknown>): string | undefined {
  const direct = [data.id, data.message && typeof data.message === "object" ? (data.message as Record<string, unknown>).id : undefined];
  for (const v of direct) if (typeof v === "string" && v.length > 0) return v;
  const add = data.v && typeof data.v === "object" ? data.v as Record<string, unknown> : undefined;
  const nested = add?.message && typeof add.message === "object" ? (add.message as Record<string, unknown>).id : undefined;
  return typeof nested === "string" && nested.length > 0 ? nested : undefined;
}

/** Port of the harvested MIG-001 ChatGPT/OpenAI-delta parse rules. Unlike the
 * historical parser, this live path fails closed on malformed SSE and missing
 * completion instead of falling back to treating the raw body as text. */
export function parseChatGptStream(rawBody: string): { providerMessageId?: string; chunks: ParsedChunk[] } {
  if (!rawBody.includes("data:")) {
    throw new LiveSendError("MSG_SEND_STREAM_FORMAT_UNKNOWN", "response contains no SSE data frames");
  }
  const chunks: ParsedChunk[] = [];
  let providerMessageId: string | undefined;
  let completed = false;
  let deltaCount = 0;

  for (const line of rawBody.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;
    const payload = trimmed.slice(5).trim();
    if (payload === "") continue;
    if (payload === "[DONE]") {
      completed = true;
      break;
    }
    let data: Record<string, unknown>;
    try {
      const parsed = JSON.parse(payload) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("SSE data is not an object");
      }
      data = parsed as Record<string, unknown>;
    } catch (error) {
      throw new LiveSendError("MSG_SEND_STREAM_MALFORMED", String(error));
    }

    providerMessageId = providerMessageId ?? providerMessageIdOf(data);
    const texts = extractTextBlocks(data);
    for (const text of texts) {
      if (text.length === 0) continue;
      chunks.push({
        data: {
          kind: "assistant.delta",
          text,
          ...(providerMessageId ? { providerMessageId } : {}),
        },
        final: false,
      });
      deltaCount += 1;
    }

    const choices = data.choices;
    if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
      const finishReason = (choices[0] as Record<string, unknown>).finish_reason;
      if (finishReason !== null && finishReason !== undefined) completed = true;
    }
    if (Object.prototype.hasOwnProperty.call(data, "finish_reason")) completed = true;
  }

  if (!completed) {
    throw new LiveSendError("MSG_SEND_STREAM_INCOMPLETE", "ChatGPT response did not expose [DONE] or a finish_reason");
  }
  if (deltaCount === 0) {
    throw new LiveSendError("MSG_SEND_STREAM_NO_DELTA", "ChatGPT response completed without any assistant text delta");
  }

  const final: ParsedChunk = {
    data: {
      kind: "assistant.done",
      provider: "chatgpt",
      ...(providerMessageId ? { providerMessageId } : {}),
    },
    final: true,
  };
  chunks.push(final);
  return {
    ...(providerMessageId ? { providerMessageId } : {}),
    chunks,
  };
}

async function waitForSelector(client: LocalCdpClient, selectors: readonly string[], timeoutMs: number): Promise<string | null> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const selector of selectors) {
      try {
        const found = await client.evaluate(`!!document.querySelector(${JSON.stringify(selector)})`);
        if (found === true) return selector;
      } catch {
        // Keep trying the known selector fallback chain; the final miss is named.
      }
    }
    await new Promise((resolve) => setTimeout(resolve, SELECTOR_POLL_MS));
  }
  return null;
}

async function ensureChatGptComposer(client: LocalCdpClient): Promise<string> {
  const state = await client.pageState();
  if (!isChatGptPage(state.url)) {
    await client.navigate(CHATGPT_HOME);
    await new Promise((resolve) => setTimeout(resolve, NAVIGATE_SETTLE_MS));
  }
  let composer = await waitForSelector(client, CHATGPT_COMPOSER_SELECTORS, SELECTOR_WAIT_MS);
  if (composer) return composer;

  const after = await client.pageState();
  if (isChatGptPage(after.url)) {
    throw new LiveSendError("MSG_SEND_COMPOSER_NOT_FOUND", "authenticated ChatGPT composer was not found after selector retries");
  }
  throw new LiveSendError("MSG_SEND_AUTH_REQUIRED", `ChatGPT page is not authenticated (${after.url || "unknown URL"})`);
}

export async function executeChatGptSend(
  input: LiveSessionDescriptor,
  body: string,
): Promise<LiveSendResult> {
  const live = validateLiveSessionDescriptor(input);
  if (typeof body !== "string" || body.length === 0) {
    throw new LiveSendError("MSG_SEND_BODY_EMPTY", "body must be a non-empty string");
  }

  const client = new LocalCdpClient();
  try {
    await client.connect(live.debugPort);
    const composer = await ensureChatGptComposer(client);

    const typed = await client.evaluate(buildTypeExpression(composer, body));
    if (typed !== body) {
      throw new LiveSendError("MSG_SEND_CONTENT_MISMATCH", "composer content was not byte-exactly preserved before submission");
    }
    const readBack = await client.evaluate(buildReadComposerExpression(composer));
    if (readBack !== body) {
      throw new LiveSendError("MSG_SEND_CONTENT_MISMATCH", "composer read-back differed from the requested body");
    }

    const sendSelector = await waitForSelector(client, CHATGPT_SEND_SELECTORS, SELECTOR_WAIT_MS);
    if (!sendSelector) {
      throw new LiveSendError("MSG_SEND_SEND_BUTTON_NOT_FOUND", "known ChatGPT send button selectors all missed");
    }

    // Critical exactly-once point: network observation is armed BEFORE the click.
    await client.enableNetwork();
    const streamPromise = client.captureChatGptStream(STREAM_TIMEOUT_MS);

    await client.evaluate(buildClickExpression(sendSelector));

    const stream: { body: string; url: string; status: number; headers: Record<string, string> } = await streamPromise;

    if (stream.status < 200 || stream.status >= 300) {
      throw new LiveSendError("MSG_SEND_HTTP_ERROR", `ChatGPT conversation endpoint returned HTTP ${stream.status}`);
    }

    // Bar 4 pins this exact parser contribution. There is no second live-only parser.
    const chunks = resolveParser(PARSER_VERSION).transform(stream.body);
    const providerMessageId = chunks
      .map((chunk) => chunk.data)
      .map((data) => data && typeof data === "object" ? (data as Record<string, unknown>).providerMessageId : undefined)
      .find((id): id is string => typeof id === "string" && id.length > 0);
    return {
      ...(providerMessageId ? { providerMessageId } : {}),
      chunks,
      responseUrl: stream.url,
      responseStatus: stream.status,
    };
  } catch (error) {
    if (error instanceof LiveSendError) throw error;
    if (error instanceof Error && error.message.startsWith("MSG_SEND_")) {
      const split = error.message.indexOf(":");
      const code = split > 0 ? error.message.slice(0, split) : "MSG_SEND_LIVE_FAILED";
      const message = split > 0 ? error.message.slice(split + 1).trim() : error.message;
      throw new LiveSendError(code, message);
    }
    throw new LiveSendError("MSG_SEND_LIVE_FAILED", String(error));
  } finally {
    // There is intentionally no resend here. A clicked send is one intent,
    // even when the subsequent capture/parse leg fails.
    await client.close();
  }
}
