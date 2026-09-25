# BCP-SPEED — Build Control Plane

BCP-SPEED is a lightweight, file-based control plane for parallel autonomous development. It tracks capabilities, leases, dependencies, experiments, discoveries, failures and generated views. **BCP tracks; Ω is the product.**

## Authority

Current BCP state lives under `state/` and `log/` and must be changed through the prescribed BCP tooling. Do not infer current maturity from historical documentation.

## Quick start

Windows:
```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
powershell -ExecutionPolicy Bypass -File verify.ps1
```

Validation:
```powershell
python validate.py
python sweep.py
python -m unittest discover -s tests -v
```

State-changing operations go through `bcp_tool.py`; `state/`, `log/` and generated views are not hand-edited.

## Layout

- `state/` — capabilities, taxonomy, leases, dependencies, experiments, metrics, discoveries and failures.
- `log/` — append-only event history.
- `agents/` — BCP-local role/bootstrap material.
- `work/` — lane scratch.
- `views/` — generated, non-authoritative views.
- `tests/` — BCP control-plane tests.

Historical build-day context and experimental sequencing documents were retired after harvest. Current sequencing/maturity comes from live BCP state, current repository evidence and governing Ω/destination documents.

The Architecture Steward owns repository-level documentation coherence; it does not own BCP state semantics.
