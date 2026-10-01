#!/usr/bin/env node
// agent-observatory MCP server (v0.1.0)
// Realtime observatory over runtime agents: reads the local ZCode/OpenCode
// runtime store read-only (SQLite) and answers MCP tool calls over stdio.
// Zero external dependencies: uses node:sqlite (Node >= 22.5).

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SERVER_VERSION = '0.1.0';
const DEFAULT_ACTIVE_WINDOW_MS = 120_000;

// ---------------------------------------------------------------------------
// Runtime store discovery
// ---------------------------------------------------------------------------

function dbCandidates() {
  const out = [];
  if (process.env.AGENT_OBSERVATORY_DB) out.push(process.env.AGENT_OBSERVATORY_DB);
  const dataHome =
    process.env.XDG_DATA_HOME || path.join(os.homedir(), '.local', 'share');
  const apps = ['opencode', 'zcode'];
  for (const app of apps) {
    out.push(path.join(dataHome, app, 'opencode.db'));
    out.push(path.join(dataHome, app, 'zcode.db'));
  }
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    for (const app of apps) {
      out.push(path.join(process.env.LOCALAPPDATA, app, 'opencode.db'));
      out.push(path.join(process.env.LOCALAPPDATA, app, 'zcode.db'));
    }
  }
  return [...new Set(out)];
}

let db = null;
let dbPath = null;

function openDb() {
  if (db) return db;
  const errors = [];
  for (const candidate of dbCandidates()) {
    try {
      if (!fs.existsSync(candidate)) continue;
      db = new DatabaseSync(candidate, { readOnly: true });
      dbPath = candidate;
      return db;
    } catch (err) {
      errors.push(`${candidate}: ${err.message}`);
    }
  }
  const err = new Error(
    `No readable runtime store found. Looked at:\n${errors.join('\n')}` +
      `\nSet AGENT_OBSERVATORY_DB to the database path to override.`
  );
  err.code = 'OBSERVATORY_NO_DB';
  throw err;
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

function parseJson(value) {
  if (value == null) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function modelInfo(raw) {
  const parsed = parseJson(raw);
  if (!parsed) return { id: raw ?? null, providerID: null, variant: null };
  return {
    id: parsed.id ?? null,
    providerID: parsed.providerID ?? parsed.providerId ?? null,
    variant: parsed.variant ?? null,
  };
}

function statusOf(row, activeWindowMs) {
  if (row.time_archived != null) return 'archived';
  const now = Date.now();
  const updated = row.time_updated ?? row.time_created ?? 0;
  return now - updated <= activeWindowMs ? 'active' : 'idle';
}

function iso(ms) {
  return ms == null ? null : new Date(ms).toISOString();
}

function summarizeSessions(rows, activeWindowMs) {
  const totals = {
    sessions: rows.length,
    active: 0,
    subagents: 0,
    tokens_input: 0,
    tokens_output: 0,
    tokens_reasoning: 0,
    tokens_cache_read: 0,
    tokens_cache_write: 0,
    cost: 0,
  };
  for (const r of rows) {
    const s = statusOf(r, activeWindowMs);
    if (s === 'active') totals.active++;
    if (r.parent_id != null) totals.subagents++;
    totals.tokens_input += r.tokens_input || 0;
    totals.tokens_output += r.tokens_output || 0;
    totals.tokens_reasoning += r.tokens_reasoning || 0;
    totals.tokens_cache_read += r.tokens_cache_read || 0;
    totals.tokens_cache_write += r.tokens_cache_write || 0;
    totals.cost += r.cost || 0;
  }
  totals.cost = Math.round(totals.cost * 1e6) / 1e6;
  return totals;
}

function sessionRow(row, childCounts, activeWindowMs) {
  return {
    id: row.id,
    parent_id: row.parent_id,
    is_subagent: row.parent_id != null,
    child_sessions: childCounts.get(row.id) || 0,
    status: statusOf(row, activeWindowMs),
    agent: row.agent ?? null,
    model: modelInfo(row.model),
    tokens: {
      input: row.tokens_input || 0,
      output: row.tokens_output || 0,
      reasoning: row.tokens_reasoning || 0,
      cache_read: row.tokens_cache_read || 0,
      cache_write: row.tokens_cache_write || 0,
    },
    cost: row.cost ?? null,
    directory: row.directory ?? null,
    title: row.title ?? null,
    slug: row.slug ?? null,
    created: iso(row.time_created),
    updated: iso(row.time_updated),
    archived: iso(row.time_archived),
  };
}

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

const SELECT_SESSION =
  `SELECT id, parent_id, slug, directory, title, agent, model, cost,
          tokens_input, tokens_output, tokens_reasoning,
          tokens_cache_read, tokens_cache_write,
          time_created, time_updated, time_archived, permission
   FROM session`;

function toolAgentsLive(args) {
  const scope = args.scope ?? 'all';
  const activeWindowMs = args.active_window_ms ?? DEFAULT_ACTIVE_WINDOW_MS;
  const limit = Math.min(args.limit ?? 50, 200);

  const where = ['time_archived IS NULL'];
  const params = [];
  if (scope === 'roots') where.push('parent_id IS NULL');
  if (scope === 'subagents') where.push('parent_id IS NOT NULL');
  if (scope === 'active') {
    where.push('time_updated >= ?');
    params.push(Date.now() - activeWindowMs);
  }
  if (args.directory) {
    where.push("directory LIKE ? ESCAPE '\\'");
    params.push(`%${args.directory.replace(/[%_\\]/g, (c) => '\\' + c)}%`);
  }

  const db = openDb();
  const rows = db
    .prepare(
      `${SELECT_SESSION} WHERE ${where.join(' AND ')} ORDER BY time_updated DESC LIMIT ?`
    )
    .all(...params, limit);

  const childCounts = new Map();
  for (const r of db
    .prepare(
      'SELECT parent_id, COUNT(*) AS c FROM session WHERE parent_id IS NOT NULL GROUP BY parent_id'
    )
    .all()) {
    childCounts.set(r.parent_id, r.c);
  }

  const filtered = args.directory
    ? rows.filter((r) => (r.directory || '').toLowerCase().includes(args.directory.toLowerCase()))
    : rows;

  return {
    db: dbPath,
    now: new Date().toISOString(),
    active_window_ms: activeWindowMs,
    scope,
    summary: summarizeSessions(filtered, activeWindowMs),
    agents: filtered.map((r) => sessionRow(r, childCounts, activeWindowMs)),
  };
}

function toolAgentsEvents(args) {
  const limit = Math.min(args.limit ?? 25, 200);
  const type = args.type ?? null;
  const db = openDb();
  let rows;
  if (type) {
    rows = db
      .prepare('SELECT id, aggregate_id, seq, type, data FROM event WHERE type = ? ORDER BY id DESC LIMIT ?')
      .all(type, limit);
  } else {
    rows = db
      .prepare('SELECT id, aggregate_id, seq, type, data FROM event ORDER BY id DESC LIMIT ?')
      .all(limit);
  }
  return {
    db: dbPath,
    events: rows.map((r) => {
      const data = parseJson(r.data);
      return {
        id: r.id,
        aggregate_id: r.aggregate_id,
        seq: r.seq,
        type: r.type,
        session_id: data?.sessionID ?? null,
        data: data ?? r.data,
      };
    }),
  };
}

function toolAgentsTokens(args) {
  const windowHours = args.window_hours ?? 24;
  const groupBy = args.group_by ?? 'model';
  const since = Date.now() - windowHours * 3_600_000;
  const groupCol = {
    model: "COALESCE(model, '{}')",
    agent: "COALESCE(agent, '(none)')",
    directory: "COALESCE(directory, '(none)')",
  };
  const expr = groupCol[groupBy] ?? groupCol.model;

  const db = openDb();
  const sql =
    `SELECT ${expr} AS g, COUNT(*) AS sessions,
            SUM(tokens_input) AS tokens_input,
            SUM(tokens_output) AS tokens_output,
            SUM(tokens_reasoning) AS tokens_reasoning,
            SUM(tokens_cache_read) AS tokens_cache_read,
            SUM(tokens_cache_write) AS tokens_cache_write,
            SUM(cost) AS cost
     FROM session
     WHERE time_updated >= ? AND time_archived IS NULL
     GROUP BY g
     ORDER BY tokens_input DESC`;

  const rows = db.prepare(sql).all(since);
  const groups = rows.map((r) => {
    let key = r.g;
    if (groupBy === 'model') {
      const m = modelInfo(r.g);
      key = m.variant ? `${m.providerID}/${m.id} (${m.variant})` : `${m.providerID}/${m.id}`;
    }
    return {
      group: key,
      sessions: r.sessions,
      tokens: {
        input: r.tokens_input || 0,
        output: r.tokens_output || 0,
        reasoning: r.tokens_reasoning || 0,
        cache_read: r.tokens_cache_read || 0,
        cache_write: r.tokens_cache_write || 0,
      },
      cost: Math.round((r.cost || 0) * 1e6) / 1e6,
    };
  });

  const total = groups.reduce(
    (acc, g) => {
      acc.sessions += g.sessions;
      acc.tokens.input += g.tokens.input;
      acc.tokens.output += g.tokens.output;
      acc.tokens.reasoning += g.tokens.reasoning;
      acc.tokens.cache_read += g.tokens.cache_read;
      acc.tokens.cache_write += g.tokens.cache_write;
      acc.cost += g.cost;
      return acc;
    },
    { sessions: 0, tokens: { input: 0, output: 0, reasoning: 0, cache_read: 0, cache_write: 0 }, cost: 0 }
  );

  return {
    db: dbPath,
    window_hours: windowHours,
    group_by: groupBy,
    total,
    groups,
  };
}

function toolAgentsRules(args) {
  const limit = Math.min(args.limit ?? 20, 200);
  const db = openDb();

  let rows;
  if (args.session_id) {
    rows = db
      .prepare(
        `${SELECT_SESSION} WHERE id = ? OR parent_id = ? ORDER BY time_updated DESC LIMIT ?`
      )
      .all(args.session_id, args.session_id, limit);
  } else {
    rows = db
      .prepare(
        `${SELECT_SESSION} WHERE permission IS NOT NULL ORDER BY time_updated DESC LIMIT ?`
      )
      .all(limit);
  }

  return {
    db: dbPath,
    rules: rows.map((r) => ({
      session_id: r.id,
      parent_id: r.parent_id,
      agent: r.agent ?? null,
      title: r.title ?? null,
      directory: r.directory ?? null,
      updated: iso(r.time_updated),
      rules: parseJson(r.permission) ?? [],
    })),
  };
}

// ---------------------------------------------------------------------------
// Tool registry — extend here for new observatory capabilities
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: 'agents_live',
    description:
      'Realtime snapshot of runtime agents (ZCode/OpenCode sessions): agent name, model (provider/id/variant), token spend by type, cost, lifecycle status (active/idle/archived), subagent parent linkage, and directory. Active = session updated within active_window_ms.',
    inputSchema: {
      type: 'object',
      properties: {
        scope: {
          type: 'string',
          enum: ['all', 'roots', 'subagents', 'active'],
          description: "Which sessions to include. Default 'all'.",
        },
        active_window_ms: {
          type: 'number',
          description: `Window for 'active' status and 'active' scope. Default ${DEFAULT_ACTIVE_WINDOW_MS}.`,
        },
        directory: {
          type: 'string',
          description: 'Case-insensitive substring filter on working directory.',
        },
        limit: { type: 'number', description: 'Max sessions returned. Default 50, max 200.' },
      },
    },
    handler: toolAgentsLive,
  },
  {
    name: 'agents_events',
    description:
      'Recent runtime event stream tail (session created/updated, message updated/part updated, model/agent switches). Newest first. For a coarse realtime pulse of what agents are doing right now.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max events. Default 25, max 200.' },
        type: {
          type: 'string',
          description: 'Filter by event type, e.g. message.part.updated.1.',
        },
      },
    },
    handler: toolAgentsEvents,
  },
  {
    name: 'agents_tokens',
    description:
      'Token/cost aggregation across runtime agents over a time window, grouped by model, agent, or directory.',
    inputSchema: {
      type: 'object',
      properties: {
        window_hours: { type: 'number', description: 'Lookback window in hours. Default 24.' },
        group_by: {
          type: 'string',
          enum: ['model', 'agent', 'directory'],
          description: "Aggregation key. Default 'model'.",
        },
      },
    },
    handler: toolAgentsTokens,
  },
  {
    name: 'agents_rules',
    description:
      'Permission rules currently attached to runtime agent sessions (allow/deny patterns per permission action). Lists recent rule-bearing sessions, or one session plus its subagents.',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'Show rules for this session and its subagents. Omit to list recent rule-bearing sessions.',
        },
        limit: { type: 'number', description: 'Max sessions. Default 20, max 200.' },
      },
    },
    handler: toolAgentsRules,
  },
];

// ---------------------------------------------------------------------------
// JSON-RPC / MCP stdio transport (newline-delimited JSON)
// ---------------------------------------------------------------------------

function toolCallResult(args, extra) {
  const parsed = args ?? {};
  const data = extra.handler(parsed);
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }], isError: false };
}

function dispatch(request) {
  const { id, method, params } = request;
  let result;
  try {
    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: params?.protocolVersion || '2025-06-18',
          capabilities: { tools: { listChanged: false } },
          serverInfo: {
            name: 'agent-observatory',
            version: SERVER_VERSION,
            description:
              'Realtime observatory over runtime agents: live sessions, models, tokens, rules.',
          },
        };
        break;
      case 'ping':
        result = {};
        break;
      case 'tools/list':
        result = {
          tools: TOOLS.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
          })),
        };
        break;
      case 'tools/call': {
        const tool = TOOLS.find((t) => t.name === params?.name);
        if (!tool) {
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: `Unknown tool: ${params?.name}` },
          };
        }
        result = toolCallResult(params?.arguments, tool);
        break;
      }
      default:
        if (method.startsWith('notifications/')) return null; // no response for notifications
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        };
    }
    return { jsonrpc: '2.0', id, result };
  } catch (err) {
    if (method === 'tools/call') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: `agent-observatory error: ${err.message}` }],
          isError: true,
        },
      };
    }
    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32603, message: err.message },
    };
  }
}

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    let request;
    try {
      request = JSON.parse(line);
    } catch {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32700, message: 'Parse error' },
        }) + '\n'
      );
      continue;
    }
    const response = dispatch(request);
    if (response) process.stdout.write(JSON.stringify(response) + '\n');
  }
});
process.stdin.on('end', () => process.exit(0));
process.stdin.resume();