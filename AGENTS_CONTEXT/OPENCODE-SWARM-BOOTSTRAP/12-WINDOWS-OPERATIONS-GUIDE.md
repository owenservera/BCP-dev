# Windows Operations Guide

Purpose: run the unchanged reference opencode-swarm core reliably on Windows, including the desired long-lived opencode serve plus TUI/attach topology.

Core rule: this guide changes deployment and operations only. It does not change the reference swarm core.

## 1. Recommended Windows topology

OpenCode's current Windows documentation recommends WSL for the best experience, while direct Windows execution is also supported.

Preferred:

    Windows Terminal
      |
      +-- WSL2
           |
           +-- opencode serve
           +-- opencode attach
           +-- generic bootstrap / swarm CLI

Native Windows is also valid:

    Windows Terminal / PowerShell 7
      |
      +-- opencode serve
      +-- opencode attach
      +-- Bun + swarm tooling

For the first Windows compatibility target, use an explicitly started server and the reference --server path. This avoids relying on the reference runner's Unix-oriented owned-server shutdown path.

## 2. Native Windows prerequisites

Verify:

    bun --version
    opencode --version
    git --version

Authenticate the provider(s):

    opencode auth login

OpenCode's current CLI documentation stores provider credentials in its local OpenCode data directory.

## 3. WSL prerequisites

Install OpenCode inside WSL using the current official installer:

    curl -fsSL https://opencode.ai/install | bash
    opencode --version

For the smoothest filesystem behavior, OpenCode currently recommends keeping the repository in the WSL filesystem. Windows drives are also accessible through /mnt/c, /mnt/d, and so on.

## 4. Install the reference swarm

From a Windows PowerShell checkout:

    git clone https://github.com/ibraheem-111/opencode-swarm.git
    cd opencode-swarm
    bun install
    bun link
    swarm --help

The package can also be installed from the published npm package with Bun.

## 5. Persistent-server plugin prerequisite

This is the most important deployment distinction.

When the reference runner starts its own server, it injects the swarm plugin into that server process.

When the reference runner connects with:

    swarm run swarm.json --server http://127.0.0.1:4096

it only connects to the existing server. It does not retroactively install the swarm plugin into that server.

Therefore the long-lived OpenCode server must already be configured to load the reference swarm plugin.

A project configuration may reference the real plugin path, for example:

    {
      "plugin": [
        "C:/work/opencode-swarm/plugin/swarm.ts"
      ]
    }

Use a real path on the machine. Package-export or bundled-plugin forms are also valid when installed according to the reference project.

## 6. Shared swarm database

The reference default is:

    .swarm/swarm.db

The environment override is:

    OPENCODE_SWARM_DB

Native PowerShell example:

    $env:OPENCODE_SWARM_DB = "C:\work\project\.swarm\swarm.db"

WSL example:

    export OPENCODE_SWARM_DB=/mnt/c/work/project/.swarm/swarm.db

The OpenCode server process running the plugin must resolve the same database used by the swarm controller.

Do not accidentally create one DB for the server and another for the CLI.

## 7. Start the long-lived server

Native Windows:

    $env:OPENCODE_SERVER_PASSWORD = "local-development-secret"
    $env:OPENCODE_SWARM_DB = "C:\work\project\.swarm\swarm.db"

    cd C:\work\project
    opencode serve --hostname 127.0.0.1 --port 4096

WSL:

    export OPENCODE_SERVER_PASSWORD='local-development-secret'
    export OPENCODE_SWARM_DB=/mnt/c/work/project/.swarm/swarm.db

    cd /mnt/c/work/project
    opencode serve --hostname 0.0.0.0 --port 4096

When binding beyond loopback, protect the server with OPENCODE_SERVER_PASSWORD.

## 8. Attach the TUI

Native Windows:

    cd C:\work\project
    $env:OPENCODE_SERVER_PASSWORD = "local-development-secret"
    opencode attach http://127.0.0.1:4096

WSL:

    cd /mnt/c/work/project
    export OPENCODE_SERVER_PASSWORD='local-development-secret'
    opencode attach http://127.0.0.1:4096

The current OpenCode CLI explicitly supports attach for an already-running serve or web backend.

Useful flags include:

    --dir
    --continue / -c
    --session / -s
    --fork
    --password / -p
    --username / -u

## 9. Run the unchanged swarm core

In another terminal:

    cd C:\work\project
    swarm run swarm.json --server http://127.0.0.1:4096

Ownership is then:

    opencode serve
          |
          | externally owned
          v
    swarm run --server
          |
          v
    reference Orchestrator

When this run ends, the reference runner does not own or shut down the externally supplied server.

## 10. Why this is the Windows-first mode

The reference runner's automatic server mode starts opencode serve itself and later uses Unix-style negative-PID process-group signaling to stop the process tree.

That source path has not been established as Windows-safe.

Therefore:

    explicitly started opencode serve
              +
    swarm run --server

is the correct first Windows deployment profile.

This is a deployment choice, not a change to the swarm core.

## 11. Current Windows interrupt caveat

A current upstream OpenCode issue reports a Windows failure mode in which an attached TUI can cause a Windows opencode serve process to terminate with STATUS_CONTROL_C_EXIT when certain interrupt or exit paths send console control events.

The reported environment used OpenCode v1.18.16. The issue describes Escape/session interruption and Ctrl+C as affected paths and reports Ctrl+X, Q as a workaround for TUI exit without terminating the server.

Until the behavior is verified fixed in the installed version, prefer a graceful TUI exit and verify the server afterward:

    curl http://127.0.0.1:4096/global/health

Treat this as an upstream runtime caveat, not a swarm semantic.

## 12. Windows path rules

JSON configuration paths should preferably use forward slashes:

    C:/work/project/.swarm/swarm.db
    C:/work/opencode-swarm/plugin/swarm.ts

PowerShell can use normal Windows paths.

WSL uses translated paths:

    C:  ->  /mnt/c
    D:  ->  /mnt/d

Do not pass a WSL-only path to a native Windows OpenCode process or vice versa.

## 13. Notifications

The reference notification helper uses notify-send for desktop notifications and optionally ntfy for push delivery.

notify-send is not a native Windows assumption.

The reference helper deliberately catches notification failures, so missing desktop notification support must not wedge the swarm.

For push notifications, the existing environment contract can be used:

    $env:OPENCODE_NOTIFY_NTFY_TOPIC = "my-swarm-topic"

A native Windows desktop notification adapter belongs outside the frozen swarm core.

## 14. Optional background server service

Current OpenCode documentation also exposes a background service:

    opencode service start
    opencode service status
    opencode service stop
    opencode service restart

This may be useful when the server should survive terminal closure.

The swarm plugin still has to be available to that server, and the swarm DB must resolve correctly in the service process.

For first compatibility testing, an explicit foreground serve process is easier to observe and troubleshoot.

## 15. Persistent-topology test

Terminal A:

    $env:OPENCODE_SERVER_PASSWORD = "local-development-secret"
    $env:OPENCODE_SWARM_DB = "C:\work\project\.swarm\swarm.db"
    cd C:\work\project
    opencode serve --hostname 127.0.0.1 --port 4096

Terminal B:

    cd C:\work\project
    $env:OPENCODE_SERVER_PASSWORD = "local-development-secret"
    opencode attach http://127.0.0.1:4096

Terminal C:

    cd C:\work\project
    swarm run swarm.json --server http://127.0.0.1:4096

Then verify:

1. the server remains running after the swarm completes;
2. the TUI can disconnect and reconnect;
3. swarm status and logs remain available;
4. shared memory remains available;
5. messages are delivered;
6. the swarm DB remains at the expected path;
7. resume works against that DB.

## 16. Windows conformance checklist

- [ ] opencode --version works.
- [ ] swarm --help works.
- [ ] opencode serve stays running.
- [ ] the health endpoint responds.
- [ ] the TUI attaches.
- [ ] the swarm plugin is loaded by the long-lived server.
- [ ] all seven swarm coordination tools are available.
- [ ] the server/plugin and controller use the same DB.
- [ ] swarm run --server executes normally.
- [ ] shared memory works.
- [ ] direct and broadcast messaging work.
- [ ] status and logs work.
- [ ] a TUI disconnect does not destroy swarm state.
- [ ] an externally owned server remains alive after swarm completion.
- [ ] resume works.
- [ ] missing Windows desktop notification support does not break execution.

## 17. External references

Official Windows guidance:
https://opencode.ai/docs/windows-wsl

Official CLI:
https://dev.opencode.ai/docs/cli/

Official server:
https://dev.opencode.ai/docs/server/

Relevant current upstream Windows issue:
https://github.com/anomalyco/opencode/issues/41878
