# authority-pointer — P1-02 pilot slice v0.1.0

> **Classification: DERIVED — CURRENT (pilot)**
> **Scope rule:** working vocabulary only. Not Ω law, not BCP state, not ontology.
> **Properties:** read-only · deterministic · stable ordering · report-only · stdlib only.

## What it does

Evaluates authority-pointer claims ("X is canonical/current/authoritative")
over a frozen bounded corpus:

* `README.md`, `AGENTS.md`, `BUILD_CONTEXT.md`, `docs/CURRENT-CONTEXT.md`,
  `docs/agent-system/CURRENT.md`, `docs/cleanup/AUTHORITY-MAP.md`,
  `docs/cleanup/CONFLICT-REGISTER.md`
* plus explicitly referenced target `ORCHESTRATION-REDESIGN.md`

Findings:

| ID | Case | Expected |
|---|---|---|
| FINDING-001 | `README.md:17` claims `ORCHESTRATION-REDESIGN.md` canonical while target + `AGENTS.md` / `CURRENT-CONTEXT.md` / `AUTHORITY-MAP.md` say historical | `contradiction`, report-only |
| FINDING-002 | `docs/agent-system/CURRENT.md` substantive tip vs literal HEAD | `consistent-semantic-tip`, never stale on literal diff |
| FINDING-003/004/005 | C8 / C11 / C12 in `CONFLICT-REGISTER.md` | `unresolved-preserved`, no winner |

## Run

```powershell
# from repository root
python docs/agent-system/workstreams/WS-002/authority-pointer/check.py
python docs/agent-system/workstreams/WS-002/authority-pointer/check.py --output docs/agent-system/workstreams/WS-002/work/authority-pointer-report.json
echo $LASTEXITCODE  # 0 = all required gates hold
```

```powershell
# tests (stdlib unittest, no deps)
python -m unittest discover -s docs/agent-system/workstreams/WS-002/authority-pointer -p "test_*.py" -v
```

## Determinism

* Sorted corpus, sorted findings, `json.dumps(sort_keys=True, indent=2)`, LF + trailing newline.
* No timestamps in output. `head_observed` is the only environment input and is
  overridable via `--head` for hermetic tests.
* Same tree + same `--head` ⇒ byte-identical bytes (covered by `test_determinism`).

## Read-only guarantee

* The checker opens corpus files for reading only and writes solely to `--output`
  (or stdout). It never edits `README.md`, `CURRENT.md`, BCP `state/`, Ω records,
  or any other repository file.
* `test_read_only` hashes the corpus before/after a run and asserts equality.

## Reuse (no duplication)

* Consumes existing banners and registers: `ORCHESTRATION-REDESIGN.md:1-7`
  STATUS banner, `AGENTS.md` historical list, `CURRENT-CONTEXT.md` historical
  section, `AUTHORITY-MAP.md` automation row, `CONFLICT-REGISTER.md` C-statuses,
  `CURRENT.md` semantic-tip convention.
* Implements no second parser for BCP `validate.py`/`sweep.py` or Ω
  `decisions`/`docscan`/`doctruth`/`genome`/`surfacesync` domains.
