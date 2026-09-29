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