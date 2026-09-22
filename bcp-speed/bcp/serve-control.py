#!/usr/bin/env python3
"""serve-control — master HTTP control plane over `opencode serve` (Task 4).

Stdlib only (urllib + json). No new framework. Drives the serve HTTP API,
never the CLI (`opencode session` cannot message or kill — list/delete only).

Endpoints (verified against opencode 1.18.4 `serve --help`; full surface in
/dev: GET /doc on the live server):
  create   POST /session {"title": agent_id}
  message  POST /session/:id/prompt_async
  status   GET /session/status
  abort    POST /session/:id/abort
  destroy  DELETE /session/:id
  watch    GET /event (SSE)

Registry `state/sessions.yaml` ({agent_id: {session_id, serve_url,
updated_at}}) is owned by the master on create/destroy; the watchdog reads
it. validate.py / sweep.py ignore unknown state files (fixed FILES map).
"""
import base64
import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

HERE = Path(__file__).resolve().parent
STATE_SESSIONS = HERE / "state" / "sessions.yaml"
BASE = os.environ.get("BCP_SERVE_URL", "http://127.0.0.1:4096")


def _headers():
    h = {"Content-Type": "application/json"}
    user = os.environ.get("OPENCODE_SERVER_USERNAME", "")
    pw = os.environ.get("OPENCODE_SERVER_PASSWORD", "")
    if user or pw:
        tok = base64.b64encode(f"{user}:{pw}".encode()).decode()
        h["Authorization"] = f"Basic {tok}"
    return h


def _req(method, path, body=None, timeout=30):
    url = BASE.rstrip("/") + path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers=_headers(), method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read().decode("utf-8", "replace")
            return r.status, (json.loads(raw) if raw.strip() else None)
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", "replace")
        return e.code, {"http_error": e.code, "body": raw[:500]}
    except Exception as e:
        return -1, {"transport_error": f"{type(e).__name__}: {e}"}


def list_sessions():
    for p in ("/session/status", "/session"):
        code, out = _req("GET", p)
        if code == 200:
            return code, out
    return code, out


def create_session(title):
    return _req("POST", "/session", {"title": title})


def message_session(session_id, text):
    return _req("POST", f"/session/{session_id}/prompt_async",
                {"parts": [{"type": "text", "text": text}]})


def abort_session(session_id):
    return _req("POST", f"/session/{session_id}/abort", {})


def destroy_session(session_id):
    return _req("DELETE", f"/session/{session_id}")


# ---------------------------------------------------------- registry ----
def _load_registry():
    import yaml
    doc = yaml.safe_load(STATE_SESSIONS.read_text(encoding="utf-8")) or {}
    return doc


def registry_set(agent_id, session_id):
    import datetime as dt
    import yaml
    doc = _load_registry()
    doc.setdefault("sessions", {})[agent_id] = {
        "session_id": session_id,
        "serve_url": BASE,
        "updated_at": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    doc["version"] = doc.get("version", 1)
    text = STATE_SESSIONS.read_text(encoding="utf-8")
    header = "".join(l for l in text.splitlines(True) if l.startswith("#"))
    STATE_SESSIONS.write_text(header + yaml.safe_dump(doc, sort_keys=True), encoding="utf-8")
    print(f"OK registry: {agent_id} -> {session_id}")


def registry_delete(agent_id):
    import yaml
    doc = _load_registry()
    doc.get("sessions", {}).pop(agent_id, None)
    text = STATE_SESSIONS.read_text(encoding="utf-8")
    header = "".join(l for l in text.splitlines(True) if l.startswith("#"))
    STATE_SESSIONS.write_text(header + yaml.safe_dump(doc, sort_keys=True), encoding="utf-8")
    print(f"OK registry: {agent_id} removed")


def main(argv):
    if len(argv) < 2:
        print("usage: serve-control.py list|create TITLE|message SID TEXT|abort SID|destroy SID|reg-set AGENT SID|reg-del AGENT")
        return 2
    cmd = argv[1]
    if cmd == "list":
        print(json.dumps(list_sessions(), indent=1)[:2000])
    elif cmd == "create" and len(argv) >= 3:
        print(json.dumps(create_session(argv[2]), indent=1)[:2000])
    elif cmd == "message" and len(argv) >= 4:
        print(json.dumps(message_session(argv[2], argv[3]), indent=1)[:500])
    elif cmd == "abort" and len(argv) >= 3:
        print(json.dumps(abort_session(argv[2]), indent=1)[:500])
    elif cmd == "destroy" and len(argv) >= 3:
        print(json.dumps(destroy_session(argv[2]), indent=1)[:500])
    elif cmd == "reg-set" and len(argv) >= 4:
        registry_set(argv[2], argv[3])
    elif cmd == "reg-del" and len(argv) >= 3:
        registry_delete(argv[2])
    else:
        print("bad usage")
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
