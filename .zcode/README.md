# .zcode/ — ZCode-native dev system for the VIVIM Ω core

This folder holds the ZCode-resident agent infrastructure. See [TEAM.md](TEAM.md) for the
team charter: roles, responsibilities, delegation grants, and scheduled duties.

## Contents

- `TEAM.md` — team charter (roles, workers, grants, rhythm).
- `workflows/*.dwf.ts` — the saved workflows (the team's operational units). Each runs with
  `CreateWorkflow` using `saved: { name: "<workflow>" }`; these files are committed with the
  repository so any session can run them.

## Workflows

| Workflow | Args | Does |
|---|---|---|
| `omega-reality-check` | — | Five-area standing-state sweep with confirmed drift |
| `omega-boundary-audit` | `section?` | Responsibility-matrix vs implementation audit |
| `omega-research` | `question` | Lens-decomposed research with confirmed findings |
| `omega-build` | `task` | Plan → review → implement → gates → verify corridor |
| `omega-verify` | `claim` | Durable completion gate over a receipt/report/text |

Cron automations live in the session host (Automations page), not in this folder:
daily standup 09:00, completion-gate audit Mondays 09:30.

## Lane

VIVIM Ω core is the active lane. `OS/` phase specs and the opencode resident-team lab are on
hold. Path A (BCP/Steward on `main`) and Path B (`team/omega-endstate`) continue per
AGENTS_CONTEXT; this system serves whichever lane the owner points it at.
## Strategy layer

- `CAPABILITY-MAP.md` — ZCode mastery-gate deliverable: verified capability inventory,
  precedence/limits, and team dispositions.
- `board/CHARTER.md` — the Ω Board (CEO-01/RESEARCH-01/GOVERNOR-01/DELIVERY-01 + Steward):
  the strategy team that proposes, debates, challenges and gap-scans; the owner ratifies.
  Convene with "convene the board" (saved workflow `omega-board`).
- `workstreams/` — standing work lanes (WS-1..WS-5) with lifecycle and evidence rules.
- `ROSTER.md` — the member registry deliberation panels are picked from per task
  (hard cap: 3 deliberating agents; read-only investigation may fan out).
