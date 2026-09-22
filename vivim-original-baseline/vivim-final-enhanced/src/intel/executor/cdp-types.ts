/**
 * VIVIM Intelligence Substrate — CDP Types (K0-L0)
 * @module intel/executor/cdp-types
 * Migrated from src/executor/cdp-types.ts (P0-3).
 */
// Shared types for CDP client

export interface CdpClientOptions {
  timeoutMs?: number
  maxRetries?: number
  retryDelayMs?: number
  pingIntervalMs?: number
}

export interface CommandOptions {
  timeoutMs?: number
  sessionId?: string
  retries?: number
}

