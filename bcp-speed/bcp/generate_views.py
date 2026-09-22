#!/usr/bin/env python3
"""
BCP-SPEED view generator.

Reads state/*.yaml, writes views/*.html + recomputes state/metrics.yaml
(via bcp_lib.compute_metrics — conflicts and stalled leases are computed, not
hardcoded).
Run manually (`python generate_views.py`) or from maintain.ps1 / a cron-style
loop. Requires PyYAML: pip install pyyaml

This replaces regex-based YAML scraping with a real parser — regex against
YAML is fragile the moment a name contains a colon or a multiline string.
"""
import sys
import datetime

try:
    import yaml
except ImportError:
    print("Missing dependency. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

import bcp_lib as lib

ROOT = lib.ROOT
STATE = lib.STATE
VIEWS = ROOT / "views"


def stamp():
    return lib.fmt_ts(lib.now())

DEPTH_COLOR = {"L0": "#9ca3af", "L1": "#3b82f6", "L2": "#22c55e", "L3": "#f59e0b"}
DEPTH_LABEL = {"L0": "Spec", "L1": "Stub", "L2": "Works", "L3": "Hardened"}


def load(name, default):
    p = STATE / name
    if not p.exists():
        return default
    with open(p, encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data if data is not None else default


def flatten_capabilities(caps_doc):
    rows = []
    for fam_code, fam in caps_doc.get("families", {}).items():
        for cap_code, cap in fam.get("capabilities", {}).items():
            rows.append({
                "family": fam_code,
                "family_name": fam.get("name", ""),
                "code": cap_code,
                "name": cap.get("name", ""),
                "depth": cap.get("depth", "L0"),
                "invariant": cap.get("invariant", ""),
            })
    return rows


def active_leases(leases_doc):
    leases = leases_doc.get("leases", {}) or {}
    return {k: v for k, v in leases.items() if v.get("status", "active") == "active"}


def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;"))


def write_map_html(caps, leases):
    by_family = {}
    for c in caps:
        by_family.setdefault(c["family"], []).append(c)

    legend = "".join(
        f'<span style="background:{DEPTH_COLOR[d]}"></span>{DEPTH_LABEL[d]}'
        for d in ["L0", "L1", "L2", "L3"]
    )

    fam_blocks = []
    for fam_code in sorted(by_family):
        rows = sorted(by_family[fam_code], key=lambda c: c["code"])
        fam_name = rows[0]["family_name"]
        cells = []
        for c in rows:
            color = DEPTH_COLOR.get(c["depth"], "#9ca3af")
            lease = leases.get(c["code"])
            owner = f' <span class="owner">{esc(lease["leased_to"])}</span>' if lease else ""
            cells.append(
                f'<div class="cap" style="background:{color}" '
                f'title="{esc(c["invariant"])}">{esc(c["code"])}<br>{esc(c["name"])}{owner}</div>'
            )
        fam_blocks.append(
            f'<div class="fam"><h2>{esc(fam_code)}<br>{esc(fam_name)}</h2>{"".join(cells)}</div>'
        )

    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>BCP Capability Map</title>
<style>
body {{ font-family: system-ui, sans-serif; margin: 20px; background: #0f172a; color: #e2e8f0; }}
h1 {{ font-size: 20px; }}
.grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }}
.fam {{ background: #1e293b; border-radius: 8px; padding: 8px; }}
.fam h2 {{ font-size: 12px; margin: 0 0 6px 0; color: #94a3b8; }}
.cap {{ padding: 6px; margin: 3px 0; border-radius: 4px; font-size: 10px; cursor: default; color: #0f172a; }}
.cap:hover {{ outline: 1px solid #fff; }}
.owner {{ display: block; font-weight: 600; }}
.legend {{ margin: 12px 0; font-size: 12px; }}
.legend span {{ display: inline-block; width: 14px; height: 14px; margin-right: 4px; vertical-align: middle; border-radius: 3px; }}
.stamp {{ color: #64748b; font-size: 11px; margin-top: 20px; }}
</style></head><body>
<h1>BCP Capability Map</h1>
<div class="legend">{legend}</div>
<div class="grid">{"".join(fam_blocks)}</div>
<div class="stamp">Generated {stamp()}</div>
</body></html>"""
    (VIEWS / "map.html").write_text(html, encoding="utf-8")


def write_workspace_html(caps, leases, health):
    dist = {"L0": 0, "L1": 0, "L2": 0, "L3": 0}
    for c in caps:
        dist[c["depth"]] = dist.get(c["depth"], 0) + 1

    lease_rows = "".join(
        f'<tr><td>{esc(code)}</td><td>{esc(l.get("leased_to",""))}</td>'
        f'<td>{esc(l.get("experiment",""))}</td><td>{esc(l.get("depth_target",""))}</td>'
        f'<td>{esc(l.get("expires_at",""))}</td>'
        f'<td style="color:{"#f87171" if health.get(code, ("ok",))[0] != "ok" else "#4ade80"}">'
        f'{esc(health.get(code, ("ok", ""))[0])}</td></tr>'
        for code, l in leases.items()
    ) or '<tr><td colspan="6" style="color:#64748b">No active leases</td></tr>'

    dist_row = "".join(
        f'<div class="bar" style="background:{DEPTH_COLOR[d]}">{d}: {dist[d]}</div>'
        for d in ["L0", "L1", "L2", "L3"]
    )

    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>BCP Workspace</title>
<style>
body {{ font-family: system-ui, sans-serif; margin: 20px; background: #0f172a; color: #e2e8f0; }}
h1 {{ font-size: 20px; }}
table {{ width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }}
th, td {{ text-align: left; padding: 6px 8px; border-bottom: 1px solid #1e293b; }}
th {{ color: #94a3b8; font-weight: 600; }}
.dist {{ display: flex; gap: 8px; margin: 12px 0; }}
.bar {{ padding: 8px 12px; border-radius: 6px; color: #0f172a; font-weight: 600; font-size: 12px; }}
.stamp {{ color: #64748b; font-size: 11px; margin-top: 20px; }}
</style></head><body>
<h1>BCP Workspace — Live State</h1>
<div class="dist">{dist_row}</div>
<h2 style="font-size:14px">Active Leases</h2>
<table><tr><th>Capability</th><th>Agent</th><th>Experiment</th><th>Target</th><th>Expires</th><th>Health</th></tr>
{lease_rows}</table>
<div class="stamp">Generated {stamp()}</div>
</body></html>"""
    (VIEWS / "workspace.html").write_text(html, encoding="utf-8")


def write_graph_html(caps, deps_doc):
    """Simple dependency list view (force-directed graph is a later upgrade;
    this keeps the generator dependency-free — no JS graph library required
    to stay self-contained and offline)."""
    edges = deps_doc.get("dependencies", []) or []
    edge_rows = "".join(
        f'<tr><td>{esc(e["source"])}</td><td>{esc(e["edge_type"])}</td>'
        f'<td>{esc(e["target"])}</td><td>{esc(e.get("required_depth",""))}</td></tr>'
        for e in edges
    ) or '<tr><td colspan="4" style="color:#64748b">No dependencies recorded</td></tr>'

    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>BCP Dependency Graph</title>
<style>
body {{ font-family: system-ui, sans-serif; margin: 20px; background: #0f172a; color: #e2e8f0; }}
table {{ width: 100%; border-collapse: collapse; font-size: 12px; }}
th, td {{ text-align: left; padding: 6px 8px; border-bottom: 1px solid #1e293b; }}
th {{ color: #94a3b8; }}
.stamp {{ color: #64748b; font-size: 11px; margin-top: 20px; }}
</style></head><body>
<h1 style="font-size:20px">Dependency Edges</h1>
<table><tr><th>Source</th><th>Edge</th><th>Target</th><th>Required Depth</th></tr>
{edge_rows}</table>
<div class="stamp">Generated {stamp()}</div>
</body></html>"""
    (VIEWS / "graph.html").write_text(html, encoding="utf-8")


def main():
    VIEWS.mkdir(exist_ok=True)
    caps_doc = load("capabilities.yaml", {"families": {}})
    leases_doc = load("leases.yaml", {"leases": {}})
    deps_doc = load("deps.yaml", {"dependencies": []})
    experiments_doc = load("experiments.yaml", {"experiments": {}})

    caps = flatten_capabilities(caps_doc)
    leases = active_leases(leases_doc)

    print(f"parsed {len(caps)} capabilities, {len(leases)} active leases")

    write_map_html(caps, leases)
    at = lib.now()
    ws = lib.Workspace()
    entries, _ = lib.read_logs(since=at - datetime.timedelta(days=14))
    health = {c: lib.lease_health(l, entries, at) for c, l in leases.items()}
    write_workspace_html(caps, leases, health)
    write_graph_html(caps, deps_doc)
    lib.write_metrics(ws, entries, at)

    dist = {}
    for c in caps:
        dist[c["depth"]] = dist.get(c["depth"], 0) + 1
    print("depth distribution:", dist)
    print("wrote views/map.html, views/workspace.html, views/graph.html")
    print("state/metrics.yaml recomputed (open_conflicts / stalled_leases are real numbers)")


if __name__ == "__main__":
    main()
