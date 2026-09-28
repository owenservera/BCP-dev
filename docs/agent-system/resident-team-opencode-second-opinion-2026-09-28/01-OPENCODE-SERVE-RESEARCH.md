# OpenCode Serve — Current Research

**Research date:** 2026-09-28  
**Primary source freshness:** OpenCode server documentation last updated 2026-09-26  
**Purpose:** Establish what `opencode serve` and the current OpenCode client/server architecture actually provide before designing resident CFA runtime machinery.

## 1. What `opencode serve` is

Current OpenCode documentation states that the `opencode serve` command runs a **headless HTTP server** and exposes an OpenAPI endpoint that an OpenCode client can use.

Documented usage:

```
opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]
```

Documented defaults:

- port: 4096
- hostname: 127.0.0.1
- mDNS: disabled
- additional CORS origins: none

Source: https://dev.opencode.ai/docs/server/

## 2. It is not a hypothetical external wrapper

The OpenCode documentation explicitly describes a client/server architecture in which running OpenCode normally starts a TUI and a server; the TUI acts as a client to that server. The server's programmatic interface is also used to support multiple clients.

That matters architecturally.

We do not need to invent an external "model daemon" abstraction to speak to OpenCode. The supported server interface is already the intended programmatic seam.

Source: https://dev.opencode.ai/docs/server/

## 3. OpenAPI is a first-class interface

The server publishes an OpenAPI 3.1 specification at:

```
http://<hostname>:<port>/doc
```

The documentation explicitly says this spec can be used to generate clients or inspect request/response types.

### Implication for BCP-dev

The resident-team supervisor should use the API contract rather than scraping CLI output where possible.

Recommended architectural dependency:

```
Team Runtime
    |
    +-- generated/typed OpenCode client
    |
    +-- health/status/events
    |
    +-- session lifecycle
    |
    +-- prompt/message delivery
```

CLI commands can remain useful for bootstrap and process lifecycle, but the supervisor should not treat terminal text as the primary session protocol.

## 4. Relevant APIs

The current server documentation exposes the following especially relevant surfaces.

### Global

```
GET /global/health
GET /global/event
```

`/global/health` returns health/version information.

`/global/event` is an SSE stream.

### Sessions

```
GET    /session
POST   /session
GET    /session/status
GET    /session/:id
DELETE /session/:id
PATCH  /session/:id
GET    /session/:id/children
GET    /session/:id/todo
POST   /session/:id/fork
POST   /session/:id/abort
POST   /session/:id/share
DELETE /session/:id/share
GET    /session/:id/diff
POST   /session/:id/summarize
POST   /session/:id/revert
POST   /session/:id/unrevert
```

### Messages

```
GET  /session/:id/message
POST /session/:id/message
GET  /session/:id/message/:messageID
POST /session/:id/prompt_async
POST /session/:id/command
POST /session/:id/shell
```

The synchronous message route waits for the response.

The asynchronous route returns HTTP `204 No Content` without waiting for the inference result.

### Agents

```
GET /agent
```

This is useful for runtime discovery of what the target OpenCode server actually exposes.

### Events

```
GET /event
```

The current docs say the first event is `server.connected`, followed by bus events.

Source: https://dev.opencode.ai/docs/server/

## 5. Why `prompt_async` is attractive to the resident-team design

The resident CFA does not need to sit in a blocking HTTP request while another agent thinks.

Conceptually:

```
Commons REQUEST
      |
      v
Team Supervisor
      |
      v
POST /session/{cfa-session}/prompt_async
      |
      +---- returns 204
      |
      v
CFA session performs its turn
      |
      v
OpenCode events/status/messages
      |
      v
Team Supervisor
      |
      v
Commons delivery / durable result
```

This is exactly the kind of wake-up mechanism a resident waiting agent needs.

## 6. Critical caveat: HTTP 204 is not proof

Public issue reports document multiple historical/current failure modes in which `prompt_async` returned 204 but the expected assistant turn did not happen.

Examples:

### Issue #21524

Reported in 2026 that `prompt_async` could return 204 without reliably waking an idle session.

https://github.com/anomalyco/opencode/issues/21524

### Issue #26635

Reported a regression where `prompt_async` accepted requests with 204 but inference did not start and SSE events did not appear.

https://github.com/anomalyco/opencode/issues/26635

### Issue #32010

Reported that a persisted asynchronous prompt could exist while an idle session loop never scheduled the assistant turn.

https://github.com/anomalyco/opencode/issues/32010

### Issue #33394

Reported startup failures where `prompt_async` returned 204 even though the child session ultimately remained empty/frozen, including a Windows report against a later 1.18.x release.

https://github.com/anomalyco/opencode/issues/33394

These reports are not proof that the target version is currently broken. They are proof that **our design cannot equate transport acceptance with execution completion**.

## 7. Required supervisor postcondition model

For an async wakeup, success should be:

```
REQUESTED
  |
  v
HTTP ACCEPTED
  |
  v
EXECUTION OBSERVED
  |
  v
ASSISTANT/STATE PROGRESS OBSERVED
  |
  v
TURN COMPLETED OR EXPLICITLY FAILED
  |
  v
RESULT READ-BACK
```

Not:

```
HTTP 204
  =
DONE
```

## 8. Health and observability

The current server API provides:

```
GET /global/health
GET /global/event
GET /session/status
GET /session/:id
GET /session/:id/message
```

These should form the initial evidence set for the supervisor.

A robust async delivery receipt should include at least:

- team_session_id;
- target agent_id;
- OpenCode session_id;
- runtime_instance_id;
- request correlation ID;
- message/event ID;
- timestamp sent;
- HTTP acceptance result;
- first execution-progress observation;
- terminal observation;
- read-back evidence;
- final outcome.

## 9. Foreground `serve` vs background `service`

Current OpenCode docs distinguish:

`opencode serve`

- foreground server;
- explicit hostname/port control;
- useful under an external supervisor;
- useful for always-on/shared/remote hosts.

`opencode service`

- manages the background server;
- supports start/stop/restart/status;
- intended as the shared background-server mechanism.

Source: https://opencode.ai/v2/docs/cli/web
Source: https://opencode.ai/v2/docs/cli/commands/

### Recommended development sequence

Start with:

```
opencode serve
      |
      v
team supervisor
```

because it makes lifecycle/logging/proof easy.

Then consider:

```
opencode service start
      |
      v
team supervisor
```

once the resident-team protocol is proven.

Do not use `service` convenience as a substitute for proving lifecycle recovery.

## 10. Server security

Current documentation states that `OPENCODE_SERVER_PASSWORD` protects the server with HTTP Basic authentication; the username defaults to `opencode` unless overridden.

The server defaults to loopback binding for `serve`, which is safer than exposing it to the network by default.

Source: https://dev.opencode.ai/docs/server/

### Design rule

The team supervisor should connect through loopback unless remote operation is explicitly required.

Do not bind `0.0.0.0` merely because the API supports it.

## 11. Current Web/Pairing model

Current OpenCode web documentation describes a web UI served by the same server and one-time pairing links that establish a browser session.

This reinforces that the server is not only a CLI implementation detail; it is the shared session/service substrate.

Source: https://opencode.ai/v2/docs/cli/web

## 12. Local-proof requirements

Before depending on any of the above operationally, the local Windows proof should capture:

- exact `opencode --version`;
- `opencode serve --help`;
- successful server start;
- `/global/health`;
- `/doc`;
- `/agent`;
- create one session;
- synchronous prompt;
- async prompt;
- SSE event observation;
- idle-session async wake test;
- abort;
- server restart;
- session read-back after restart;
- ten-session creation/readiness experiment.

The local proof must be retained as a receipt, not merely described in chat.

