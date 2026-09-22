/**
 * VIVIM Plugin-Kernel — Simulator Adapter
 * @module plugin-kernel/adapter/impl/simulator/adapter
 *
 * Implements IProviderAdapter for testing without a GPU or real LLM. Yields
 * fake AIEvent streams (text deltas, tool calls) with configurable artificial
 * delay, and supports injectable failure modes.
 *
 * Two modes:
 *   - happy (default): no failures, normal streaming
 *   - chaos: configurable failure rate (timeout, crash, cancellation)
 *
 * Migrated from src/ai/protocol/simulator-adapter.ts. Imports kept at the
 * pre-split K1 paths; will collapse when K-011 (contract split) and
 * K-012 (types.ts SPLIT) land.
 */

import { AI_ERRORS } from '../../../../ai/core/errors.js'
import type {
  AIEvent,
  AIRequest,
  ModelDescriptor,
  ProviderHealth,
  ProviderId,
  ProviderManifest,
  RequestId,
} from '../../../../ai/core/types.js'
import { createEventId, modelId, providerId, VIVIM_AI_PROTOCOL } from '../../../../ai/core/types.js'
import type { IProviderAdapter, ProviderAdapterFactory, ProviderConnection } from '../../../../ai/protocol/adapter.js'

export interface SimulatorConfig {
  readonly providerId: ProviderId
  readonly displayName?: string
  readonly artificialDelayMs?: number
  readonly mode?: 'happy' | 'chaos'
  readonly chaosFailureRate?: number // 0..1
  readonly responseText?: string // pre-canned response
  readonly emitToolCall?: { readonly name: string; readonly arguments: unknown }
}

// Re-exported as part of the adapter's public surface for the src/ai/index.ts
// barrel. They were previously defined as file-local consts in the K1 location.
export const SIMULATOR_PROVIDER_ID = providerId('simulator')
export const SIMULATOR_MODEL_ID = modelId('simulator:default')

export const SIMULATOR_MANIFEST: ProviderManifest = {
  id: SIMULATOR_PROVIDER_ID,
  pluginId: 'simulator:simulator' as never,
  name: 'Simulator',
  version: '1.0.0',
  protocolVersion: VIVIM_AI_PROTOCOL.version,
  kind: 'simulator',
  trust: 'first-party',
  description: 'In-process simulator for testing without a real LLM.',
  capabilities: {
    'chat': { supported: true, level: 'basic' },
    'stream': { supported: true, level: 'basic' },
    'tool_use': { supported: true, level: 'basic' },
  },
}

export class SimulatorAdapter implements IProviderAdapter {
  private connection?: ProviderConnection
  private failureCounter = 0

  constructor(private readonly config: SimulatorConfig = { providerId: SIMULATOR_PROVIDER_ID }) {}

  get providerId(): ProviderId {
    return this.config.providerId
  }

  get manifest(): ProviderManifest {
    return SIMULATOR_MANIFEST
  }

  async initialize(connection: ProviderConnection): Promise<void> {
    this.connection = connection
  }

  async health(): Promise<ProviderHealth> {
    return {
      status: 'healthy',
      state: 'active',
      checkedAt: new Date().toISOString(),
    }
  }

  async listModels(): Promise<readonly ModelDescriptor[]> {
    return [
      {
        id: SIMULATOR_MODEL_ID,
        providerId: SIMULATOR_PROVIDER_ID,
        name: 'Simulator Default',
        modalities: { input: ['text'], output: ['text'] },
        capabilities: {
          'chat': { supported: true, level: 'basic' },
          'stream': { supported: true, level: 'basic' },
          'tool_use': { supported: true, level: 'basic' },
        },
      },
    ]
  }

  async *execute(request: AIRequest, signal?: AbortSignal): AsyncIterable<AIEvent> {
    const requestId = request.requestId
    const delay = this.config.artificialDelayMs ?? 20
    const mode = this.config.mode ?? 'happy'
    const failureRate = this.config.chaosFailureRate ?? 0
    const text = this.config.responseText ?? 'Hello from the simulator.'

    // Chaos mode: randomly fail
    if (mode === 'chaos' && Math.random() < failureRate) {
      throw AI_ERRORS.runtimeCrash(SIMULATOR_PROVIDER_ID, new Error('Simulated crash'))
    }

    // request.started
    yield {
      eventId: createEventId(),
      requestId,
      sequence: this.failureCounter++,
      timestamp: new Date().toISOString(),
      type: 'request.started',
    } as AIEvent

    if (signal?.aborted) {
      throw AI_ERRORS.cancelled('Request aborted before start')
    }

    // response.started
    yield {
      eventId: createEventId(),
      requestId,
      sequence: this.failureCounter++,
      timestamp: new Date().toISOString(),
      type: 'response.started',
      providerId: SIMULATOR_PROVIDER_ID,
      modelId: SIMULATOR_MODEL_ID,
    } as AIEvent

    // Optional tool call
    if (this.config.emitToolCall) {
      const tc = this.config.emitToolCall
      const tcId = `tc-sim-${Date.now()}`
      yield {
        eventId: createEventId(),
        requestId,
        sequence: this.failureCounter++,
        timestamp: new Date().toISOString(),
        type: 'tool.call.created',
        toolCallId: tcId as never,
        name: tc.name,
      } as AIEvent
      yield {
        eventId: createEventId(),
        requestId,
        sequence: this.failureCounter++,
        timestamp: new Date().toISOString(),
        type: 'tool.call.completed',
        toolCallId: tcId as never,
        arguments: tc.arguments,
      } as AIEvent
    }

    // Stream text in chunks
    const chunks = text.match(/.{1,8}/g) ?? [text]
    for (const chunk of chunks) {
      if (signal?.aborted) {
        throw AI_ERRORS.cancelled('Request aborted mid-stream')
      }
      yield {
        eventId: createEventId(),
        requestId,
        sequence: this.failureCounter++,
        timestamp: new Date().toISOString(),
        type: 'output.text.delta',
        text: chunk,
      } as AIEvent
      if (delay > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  async cancel(_requestId: RequestId): Promise<void> {
    // Simulator doesn't have server-side cancel; AbortSignal handles it
  }

  async shutdown(): Promise<void> {
    this.connection = undefined
  }
}

/** Factory for creating a simulator adapter. */
export const simulatorAdapterFactory: ProviderAdapterFactory = () => new SimulatorAdapter()

/** Check if a manifest is the simulator manifest. */
export function isSimulatorManifest(manifest: ProviderManifest): boolean {
  return manifest.id === SIMULATOR_PROVIDER_ID
}
