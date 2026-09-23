# workstreams/ — Workstream Allocation, Setup Prompts & Launch Folders

> **Classification: DERIVED — CURRENT** · Coordinator-owned (COORD-01) · Loose governance v1

## What this directory is

Each subdirectory `WS-NNN/` is the **launch folder** for one workstream: everything
an owner-launched agent needs *beyond* its setup prompt to start with correct
fresh context. The setup prompt carries the mission particulars; the launch
folder carries the living repository context (which the prompt, frozen at
write time, cannot).

## Loose governance (v1 — deliberately light)

```text
owner hands coordinator a setup prompt
        ↓
coordinator SAVES it verbatim → workstreams/<WS>/SETUP-PROMPT-<agent>.md
        ↓
coordinator ROUTES it → reserves agent id in ROSTER.md, links workstream row
in WORKSTREAMS.md, creates inbox/outbox dirs on first use
        ↓
coordinator STRUCTURES the launch folder → workstreams/<WS>/README.md (card)
+ LAUNCH-<agent>.md (read order + deliverables + output paths) + work/ scratch
        ↓
owner launches the agent pointed at TWO things:
  1. the SETUP-PROMPT file (mission particulars)
  2. the workstreams/<WS>/ folder (fresh context)
        ↓
agent works → deposits transcript + packet (+ handoff) → outbox item
        ↓
coordinator integrates → CURRENT advances
```

Rules:

- Setup prompts are stored **verbatim** (frozen mission text). A wrapper header
  records saver, date, routed agent, workstream, and relation to any existing
  transcript — the wrapper is DERIVED, the body is the owner's word.
- Never rewrite a saved setup prompt. Superseded prompts get `-v2` succession
  like packets.
- One workstream = one folder. One launched agent = one SETUP-PROMPT + one
  LAUNCH file. Shared context stays in `CURRENT.md` / packets / handoffs —
  never copied into launch folders (link, don't duplicate).
- ROSTER status `RESERVED` = registered for an owner launch that has not
  happened yet. On launch the agent reports in and becomes ACTIVE; if the
  owner never launches, the coordinator parks it.
- This governance stays loose on purpose: it routes and structures, it does
  not command. Ω law, BCP leases, and coordinator integration discipline are
  unchanged and outrank anything here.
