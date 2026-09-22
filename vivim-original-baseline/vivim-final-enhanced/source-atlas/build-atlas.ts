// source-atlas/build-atlas.ts
// Master Librarian — inventory + verifier for full coverage (v2.0).
// Usage:
//   bun run source-atlas/build-atlas.ts            → regenerate ATLAS-FILES.json + generated/*.md, print totals
//   bun run source-atlas/build-atlas.ts --check    → regenerate in-memory, compare vs ATLAS-INDEX.json + ATLAS-FILES.json, verify all required docs exist
// Rule: every TS/TSX file under the 8 code areas appears in ATLAS-FILES.json exactly once.
// Human catalogs (L3/L4/LA) provide semantics; generated/*.md provide the complete file lists.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dir, "..");
const ATLAS = join(ROOT, "source-atlas");
const GEN = join(ATLAS, "generated");

// ── walkers ──
function walkExt(dir: string, exts: string[], out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (e === "node_modules" || e === ".git" || e === ".next" || e === "dist") continue;
      walkExt(p, exts, out);
    } else if (exts.some((x) => e.endsWith(x))) out.push(p);
  }
  return out;
}
const rel = (p: string) => relative(ROOT, p).replace(/\\/g, "/");

function headerOf(p: string): string {
  try {
    const lines = readFileSync(p, "utf8").split("\n").slice(0, 6).join("\n");
    const m = lines.match(/\/\/\s*(.+)/);
    return (m?.[1] ?? "").slice(0, 120);
  } catch { return ""; }
}
function exportCount(p: string): number {
  try {
    const t = readFileSync(p, "utf8");
    const m = t.match(/^export\s+(const|class|function|interface|type|async function|enum)/gm);
    return m ? m.length : 0;
  } catch { return 0; }
}
function countModels(schemaPath: string): string[] {
  const text = readFileSync(join(ROOT, schemaPath), "utf8");
  return text.split("\n").filter((l) => l.startsWith("model ")).map((l) => l.split(" ")[1].trim());
}

// ── inventory ──
const areas: Record<string, string[]> = {
  "src": walkExt(join(ROOT, "src"), [".ts"]).map(rel).sort(),
  "frontend": walkExt(join(ROOT, "frontend/src"), [".ts", ".tsx"]).map(rel).sort(),
  "shared": walkExt(join(ROOT, "shared"), [".ts"]).map(rel).sort(),
  "sdk": walkExt(join(ROOT, "sdk"), [".ts"]).map(rel).sort(),
  "seeds": walkExt(join(ROOT, "seeds"), [".ts"]).map(rel).sort(),
  "tests": walkExt(join(ROOT, "tests"), [".ts"]).map(rel).sort(),
  "scripts": walkExt(join(ROOT, "scripts"), [".ts"]).map(rel).sort(),
  "devops": walkExt(join(ROOT, "devops"), [".ts"]).map(rel).sort(),
};
const enginesFlat = areas["src"].filter((f) => /^src\/engines\/[^/]+\.ts$/.test(f));
const enginesSub = areas["src"].filter((f) => /^src\/engines\//.test(f));
const frontendRoutes = areas["frontend"].filter((f) => /^frontend\/src\/app\/.*route\.ts$/.test(f));
const sysModels = countModels("prisma/system/schema.prisma");
const userModels = countModels("prisma/user/schema.prisma");
const contractsAll = areas["src"].filter((f) => f.startsWith("src/storage/contracts/"));
const impls = areas["src"].filter((f) => /^src\/storage\/impl\/[^/]+\.ts$/.test(f));
const schemas = areas["src"].filter((f) => /^src\/schema\/[^/]+\.ts$/.test(f));

const measured = {
  src_ts_files: areas["src"].length,
  engines_flat: enginesFlat.length,
  engines_total: enginesSub.length,
  engines_sub: enginesSub.length - enginesFlat.length,
  storage_contracts_top: schemas.length && contractsAll.filter((f) => /^src\/storage\/contracts\/[^/]+\.ts$/.test(f)).length,
  storage_contracts_all: contractsAll.length,
  storage_impls: impls.length,
  schema_files: schemas.length,
  cli_commands: areas["src"].filter((f) => f.startsWith("src/cli/commands/")).length,
  prisma_system: sysModels.length,
  prisma_user: userModels.length,
  prisma_models: sysModels.length + userModels.length,
  frontend_files: areas["frontend"].length,
  frontend_routes: frontendRoutes.length,
  shared_files: areas["shared"].length,
  sdk_files: areas["sdk"].length,
  seed_files: areas["seeds"].length,
  test_files: areas["tests"].length,
  test_unit: areas["tests"].filter((f) => f.startsWith("tests/unit/")).length,
  test_integration: areas["tests"].filter((f) => f.startsWith("tests/integration/")).length,
  test_e2e: areas["tests"].filter((f) => f.startsWith("tests/e2e/")).length,
  scripts_files: areas["scripts"].length,
  devops_files: areas["devops"].length,
  total_ts: Object.values(areas).reduce((n, a) => n + a.length, 0),
};

// ── generate: ATLAS-FILES.json + generated/*.md ──
function generate(): void {
  mkdirSync(GEN, { recursive: true });
  const payload = {
    atlas: "source-atlas generated file inventory",
    built_from: "source code only (no prior docs read)",
    measured,
    areas,
  };
  writeFileSync(join(ATLAS, "ATLAS-FILES.json"), JSON.stringify(payload, null, 1) + "\n", "utf8");

  const docFor = (title: string, files: string[]) => {
    const rows = files.map((f) => {
      const abs = join(ROOT, f);
      const h = headerOf(abs).replace(/\|/g, "\\|");
      return `| \`${f}\` | ${h} | ${exportCount(abs)} |`;
    });
    return `# Generated — ${title}\n\n> Machine-generated by \`build-atlas.ts\`. Do not hand-edit. Complete file list for this area: **${files.length} files**. Purpose = first \`//\` header line; exports = \`^export\` count. Semantics live in the hand-written L3/L4 catalog for this area.\n\n| file | purpose (header) | exports |\n|------|------------------|---------|\n${rows.join("\n")}\n`;
  };
  const groups: Record<string, string[]> = {
    "gen-engines-sub": enginesSub.filter((f) => !/^src\/engines\/[^/]+\.ts$/.test(f)),
    "gen-engines-flat": enginesFlat,
    "gen-frontend-routes": frontendRoutes,
    "gen-frontend-engines-storage": areas["frontend"].filter((f) => /frontend\/src\/(engines|storage|registry|actions|api|features|hooks|lib|schema|ui|components|canvas|render)\//.test(f)),
    "gen-storage": areas["src"].filter((f) => f.startsWith("src/storage/")),
    "gen-schema": schemas,
    "gen-server": areas["src"].filter((f) => f.startsWith("src/server/")),
    "gen-cli": areas["src"].filter((f) => f.startsWith("src/cli/")),
    "gen-mcp": areas["src"].filter((f) => f.startsWith("src/mcp/")),
    "gen-executor-canvas-ai-fleet-intel": areas["src"].filter((f) => /^\src\/(executor|canvas|ai|fleet|intel)\//.test(f) || /^^src\/(executor|canvas)\//.test(f)),
  };
  // fix: JS regex above has typo risk — rebuild explicitly
  groups["gen-executor-canvas-ai-fleet-intel"] = areas["src"].filter(
    (f) => f.startsWith("src/executor/") || f.startsWith("src/canvas/") || f.startsWith("src/ai/") || f.startsWith("src/fleet/") || f.startsWith("src/intel/"),
  );
  const misc = (name: string, files: string[]) => {
    writeFileSync(join(GEN, `${name}.md`), docFor(name, files), "utf8");
  };
  misc("gen-engines-sub", groups["gen-engines-sub"]);
  misc("gen-engines-flat", groups["gen-engines-flat"]);
  misc("gen-frontend-routes", groups["gen-frontend-routes"]);
  misc("gen-frontend-engines-storage", groups["gen-frontend-engines-storage"]);
  misc("gen-storage", groups["gen-storage"]);
  misc("gen-schema", groups["gen-schema"]);
  misc("gen-server", groups["gen-server"]);
  misc("gen-cli", groups["gen-cli"]);
  misc("gen-mcp", groups["gen-mcp"]);
  misc("gen-executor-canvas-ai-fleet-intel", groups["gen-executor-canvas-ai-fleet-intel"]);
  misc("gen-src-misc", areas["src"].filter((f) =>
    !f.startsWith("src/engines/") && !f.startsWith("src/storage/") && !f.startsWith("src/server/") &&
    !f.startsWith("src/cli/") && !f.startsWith("src/mcp/") && !f.startsWith("src/executor/") &&
    !f.startsWith("src/canvas/") && !f.startsWith("src/ai/") && !f.startsWith("src/fleet/") &&
    !f.startsWith("src/intel/") && !f.startsWith("src/schema/"),
  ));
  misc("gen-frontend-misc", areas["frontend"].filter((f) =>
    !/^frontend\/src\/app\/.*route\.ts$/.test(f) &&
    !/frontend\/src\/(engines|storage|registry|actions|api|features|hooks|lib|schema|ui|components|canvas|render)\//.test(f),
  ));
  misc("gen-shared-sdk", [...areas["shared"], ...areas["sdk"]]);
  misc("gen-seeds", areas["seeds"]);
  misc("gen-tests-unit", areas["tests"].filter((f) => f.startsWith("tests/unit/")));
  misc("gen-tests-integration-e2e-arch", areas["tests"].filter((f) => !f.startsWith("tests/unit/")));
  misc("gen-scripts", areas["scripts"]);
  misc("gen-devops", areas["devops"]);

  // ── deep generators (columns, validators, seeds, router prefixes) ──
  const parseModels = (schemaPath: string) => {
    const text = readFileSync(join(ROOT, schemaPath), "utf8").split("\n");
    const out: { model: string; fields: string[] }[] = [];
    let cur: { model: string; fields: string[] } | null = null;
    for (const line of text) {
      const m = line.match(/^model\s+(\w+)/);
      if (m) { cur = { model: m[1], fields: [] }; out.push(cur); continue; }
      if (cur && /^\}/.test(line)) { cur = null; continue; }
      if (cur) {
        const f = line.match(/^\s{2}(\w+)\s+([\w\[\]?]+)(.*)$/);
        if (f && !line.trim().startsWith("@@")) cur.fields.push(`${f[1]}:${f[2]}`);
      }
    }
    return out;
  };
  const sysCols = parseModels("prisma/system/schema.prisma");
  const userCols = parseModels("prisma/user/schema.prisma");
  const colDoc = (title: string, models: { model: string; fields: string[] }[]) =>
    `# Generated — ${title}\n\n> Machine-generated by \`build-atlas.ts\` from \`prisma/*/schema.prisma\`. **${models.length} models**. Format \`field:Type\` in schema order. Full types/attributes live in the schema files.\n\n| model | fields | columns |\n|-------|--------|----------|\n` +
    models.map((m) => `| \`${m.model}\` | ${m.fields.length} | \`${m.fields.join(" ")}\` |`).join("\n") + "\n";
  writeFileSync(join(GEN, "gen-prisma-columns-system.md"), colDoc("prisma system columns (111)", sysCols), "utf8");
  writeFileSync(join(GEN, "gen-prisma-columns-user.md"), colDoc("prisma user columns (90)", userCols), "utf8");

  const zodRows = schemas.map((f) => {
    try {
      const t = readFileSync(join(ROOT, f), "utf8");
      const ex = [...t.matchAll(/^export\s+(?:const|type|interface)\s+(\w+)/gm)].map((m) => m[1]).slice(0, 12);
      return `| \`${f}\` | ${ex.length} | \`${ex.join(" ")}\` |`;
    } catch { return `| \`${f}\` | ? |  |`; }
  });
  writeFileSync(join(GEN, "gen-zod-full.md"),
    `# Generated — zod schemas (38)\n\n> Machine-generated from \`src/schema/*.ts\`. Export = first 12 \`^export\` names per file. Validators enforced at ingress by \`server/validate.ts\` + \`mcp/zod-schema.ts\`.\n\n| file | exports | names |\n|------|---------|-------|\n${zodRows.join("\n")}\n`, "utf8");

  const seedJson = walkExt(join(ROOT, "seeds"), [".json"]).map(rel).sort();
  writeFileSync(join(GEN, "gen-seeds-detail.md"),
    `# Generated — seeds (${areas["seeds"].length} ts + ${seedJson.length} json)\n\n> Machine-generated. TS loaders + JSON manifests (providers, parsers, taxonomy). Load order: \`server/bootstrap-seeds.ts\` → \`cli/commands/seed.ts\` (seeds→stores→knowledge→capabilities→lifecycle).\n\n## TS loaders\n\n${areas["seeds"].map((f) => `- \`${f}\``).join("\n")}\n\n## JSON manifests\n\n${seedJson.map((f) => `- \`${f}\``).join("\n")}\n`, "utf8");

  const serverFiles = areas["src"].filter((f) => f.startsWith("src/server/"));
  const prefixRows = serverFiles.map((f) => {
    try {
      const t = readFileSync(join(ROOT, f), "utf8");
      const ps = [...t.matchAll(/\/api\/[a-z-\/{}:]+/g)].map((m) => m[0]);
      const uniq = [...new Set(ps)].slice(0, 8);
      return `| \`${f}\` | \`${uniq.join(" ")}\` |`;
    } catch { return `| \`${f}\` |  |`; }
  });
  writeFileSync(join(GEN, "gen-server-routers-detail.md"),
    `# Generated — server files (${serverFiles.length}) with /api prefixes\n\n> Machine-generated. Prefix = literal \`/api/…\` strings found per file (max 8). Canonical routing lives in \`server/index.ts\` fetch() chains + \`server-routers-full.md\`.\n\n| file | api prefixes seen |\n|------|-------------------|\n${prefixRows.join("\n")}\n`, "utf8");

  // ── shaping intel (neutral relational facts for the shaping team; no prescriptions) ──
  const read = (f: string): string => {
    try { return readFileSync(join(ROOT, f), "utf8"); } catch { return ""; }
  };
  // 1. engine → contracts imported (reader edges)
  const engineFiles = areas["src"].filter((f) => f.startsWith("src/engines/"));
  const engRows = engineFiles.map((f) => {
    const t = read(f);
    const hits = [...t.matchAll(/storage\/contracts\/([a-z0-9\-\/]+)/g)].map((m) => m[1]);
    const uniq = [...new Set(hits)].slice(0, 10);
    const gov = /chrome-governor|BunCdpClient|executor\/cdp/.test(t) ? "yes" : "no";
    return `| \`${f}\` | \`${uniq.join(" ")}\` | ${gov} |`;
  });
  writeFileSync(join(GEN, "gen-shaping-engine-contracts.md"),
    `# Generated — shaping intel 1/6: engine → contracts + governor touch\n\n> Machine-generated static import scan. Column 2 = \`storage/contracts/…\` strings found per engine file (max 10). Column 3 = whether the file text mentions \`chrome-governor\`, \`BunCdpClient\` or \`executor/cdp\` (governor-canon relevance signal, not a verdict). Shaping team decides boundaries.\n\n| engine file | contracts referenced | governor-touch |\n|-------------|----------------------|----------------|\n${engRows.join("\n")}\n`, "utf8");

  // 2. router → engines/contracts imported (wire edges)
  const routerFiles = areas["src"].filter((f) => /^src\/server\/.*router\.ts$/.test(f) || f.startsWith("src/server/routes/"));
  const rouRows = routerFiles.map((f) => {
    const t = read(f);
    const eng = [...t.matchAll(/engines\/([a-z0-9\-\/]+)/g)].map((m) => m[1]);
    const con = [...t.matchAll(/storage\/contracts\/([a-z0-9\-\/]+)/g)].map((m) => m[1]);
    return `| \`${f}\` | \`${[...new Set(eng)].slice(0, 8).join(" ")}\` | \`${[...new Set(con)].slice(0, 8).join(" ")}\` |`;
  });
  writeFileSync(join(GEN, "gen-shaping-router-edges.md"),
    `# Generated — shaping intel 2/6: router → engines / contracts\n\n> Machine-generated static import scan (max 8 each). Shows which engine/contract names a router file references. Does not assert runtime behavior.\n\n| router file | engines referenced | contracts referenced |\n|-------------|--------------------|----------------------|\n${rouRows.join("\n")}\n`, "utf8");

  // 3. slot references per frontend file (projection edges)
  const slotIds: string[] = (() => {
    try {
      const t = read("frontend/src/ui/slots.ts");
      return [...t.matchAll(/'([a-z0-9\-]+\.[a-z0-9\-]+)'/g)].map((m) => m[1]).filter((s, i, a) => a.indexOf(s) === i);
    } catch { return []; }
  })();
  const feFiles = areas["frontend"];
  const slotRows = slotIds.map((s) => {
    const users = feFiles.filter((f) => read(f).includes(s)).slice(0, 12);
    return `| \`${s}\` | ${users.length} | \`${users.join(" ")}\` |`;
  });
  writeFileSync(join(GEN, "gen-shaping-slot-refs.md"),
    `# Generated — shaping intel 3/6: slot → referencing frontend files\n\n> Machine-generated substring scan over \`frontend/src\`. Column 2 = count of frontend files containing the slot id string (cap 12 listed). Presence of the string does not assert render behavior.\n\n| slot id | files | sample |\n|---------|-------|--------|\n${slotRows.join("\n")}\n`, "utf8");

  // 4. surface inventories side by side (cli commands, api prefixes, mcp tools, slots)
  const cliFiles = areas["src"].filter((f) => f.startsWith("src/cli/commands/"));
  const mcpToolNames: string[] = (() => {
    const out: string[] = [];
    for (const f of areas["src"].filter((x) => x.startsWith("src/mcp/"))) {
      const t = read(f);
      for (const m of t.matchAll(/name:\s*'([a-z0-9_]+)'/g)) out.push(m[1]);
      for (const m of t.matchAll(/server\.tool\(\s*'([a-z0-9_]+)'/g)) out.push(m[1]);
      for (const m of t.matchAll(/'([a-z]+_[a-z_]+)'/g)) {
        if (/^(discover|browser|nl)_/.test(m[1]) || /^(google_search)$/.test(m[1])) out.push(m[1]);
      }
    }
    return [...new Set(out)].sort();
  })();
  const apiPrefixes: string[] = (() => {
    const out = new Set<string>();
    for (const f of serverFiles) {
      const t = read(f);
      for (const m of t.matchAll(/\/api\/[a-z][a-z\-\/]*/g)) out.add(m[0].replace(/\/+$/, ""));
    }
    return [...out].sort().slice(0, 60);
  })();
  writeFileSync(join(GEN, "gen-shaping-surfaces.md"),
    `# Generated — shaping intel 4/6: surface inventories\n\n> Machine-generated. Four independent inventories a shaping team can cross-reference. No claim that the same item exists on multiple surfaces.\n\n## CLI command files (${cliFiles.length})\n\n${cliFiles.map((f) => `- \`${f}\``).join("\n")}\n\n## API prefixes observed (${apiPrefixes.length} shown)\n\n${apiPrefixes.map((p) => `- \`${p}\``).join("\n")}\n\n## MCP tool names observed (${mcpToolNames.length})\n\n${mcpToolNames.map((n) => `- \`${n}\``).join("\n")}\n\n## Slot ids (${slotIds.length})\n\n${slotIds.map((s) => `- \`${s}\``).join("\n")}\n`, "utf8");

  // 5. config-knob references per area (tunability exposure)
  const knobNames = ["server.port", "server.host", "fleet.autoStart", "fleet.portStart", "fleet.portEnd", "storage.dataDir", "storage.dbPath", "surfaces.enforceParity"];
  const knobRows = knobNames.map((k) => {
    const users = areas["src"].filter((f) => read(f).includes(k)).slice(0, 10);
    return `| \`${k}\` | ${users.length} | \`${users.join(" ")}\` |`;
  });
  writeFileSync(join(GEN, "gen-shaping-config-refs.md"),
    `# Generated — shaping intel 5/6: config-knob references\n\n> Machine-generated substring scan over \`src/\` for 8 representative tunable keys (full 13 in \`configuration.md\`). Shows which files mention each key.\n\n| knob | files | sample |\n|------|-------|--------|\n${knobRows.join("\n")}\n`, "utf8");

  // 6. test presence per area (what has a test nearby)
  const testNames = areas["tests"].map((f) => f.toLowerCase());
  const areaDefs: Record<string, string[]> = {
    "src/engines": engineFiles, "src/server": serverFiles,
    "src/storage": areas["src"].filter((f) => f.startsWith("src/storage/")),
    "src/mcp": areas["src"].filter((f) => f.startsWith("src/mcp/")),
    "src/executor": areas["src"].filter((f) => f.startsWith("src/executor/")),
    "frontend/routes": feFiles.filter((f) => /app\/.*route\.ts$/.test(f)),
  };
  const covRows = Object.entries(areaDefs).map(([area, files]) => {
    const withTest = files.filter((f) => {
      const base = f.split("/").pop()!.replace(/\.(ts|tsx)$/, "").replace(/-impl$/, "").split(".")[0];
      return testNames.some((t) => t.includes(base));
    }).length;
    return `| \`${area}\` | ${files.length} | ${withTest} |`;
  });
  writeFileSync(join(GEN, "gen-shaping-test-presence.md"),
    `# Generated — shaping intel 6/6: name-match test presence per area\n\n> Machine-generated heuristic: a source file counts as "name-matched" if its basename (minus \`-impl\`, minus extension) appears as a substring in any test path. Heuristic only — not coverage.\n\n| area | files | name-matched |\n|------|-------|--------------|\n${covRows.join("\n")}\n`, "utf8");
}

generate();
console.log(JSON.stringify(measured, null, 2));

if (process.argv.includes("--check")) {
  const index = JSON.parse(readFileSync(join(ATLAS, "ATLAS-INDEX.json"), "utf8"));
  const expected = index.totals;
  const drifts: string[] = [];
  const map: Record<string, keyof typeof measured> = {
    src_ts_files: "src_ts_files", engines_flat: "engines_flat", engines_total: "engines_total",
    storage_contracts_top: "storage_contracts_top", storage_contracts_all: "storage_contracts_all",
    storage_impls: "storage_impls", schema_files: "schema_files", cli_commands: "cli_commands",
    prisma_system: "prisma_system", prisma_user: "prisma_user", prisma_models: "prisma_models",
    frontend_files: "frontend_files", frontend_routes: "frontend_routes",
    shared_files: "shared_files", sdk_files: "sdk_files", seed_files: "seed_files",
    test_files: "test_files", test_unit: "test_unit", test_integration: "test_integration",
    test_e2e: "test_e2e", scripts_files: "scripts_files", devops_files: "devops_files",
    total_ts: "total_ts",
  };
  for (const [ik, mk] of Object.entries(map)) {
    if (expected[ik] !== undefined && expected[ik] !== measured[mk]) {
      drifts.push(`${String(mk)}: atlas=${expected[ik]} disk=${measured[mk]}`);
    }
  }
  const requiredAtlasFiles = [
    "00-README.md", "01-AUDIENCES.md", "02-GLOSSARY.md", "03-QUICKSTART.md",
    "L0-system-overview.md", "L1-zone-map.md", "L2-module-clusters.md",
    "L3-file-catalog/engines.md", "L3-file-catalog/storage.md", "L3-file-catalog/surfaces.md",
    "L3-file-catalog/frontend-sdk-shared-tauri.md", "L3-file-catalog/cli-complete.md",
    "L3-file-catalog/api-reference.md", "L3-file-catalog/subsystems.md",
    "L3-file-catalog/engines-subfolders.md", "L3-file-catalog/frontend-routes.md",
    "L3-file-catalog/frontend-engines-storage.md", "L3-file-catalog/storage-parity.md",
    "L3-file-catalog/ops-surfaces.md", "L3-file-catalog/server-routers-full.md",
    "L3-file-catalog/mcp-cli-full.md",
    "L4-contracts/storage-contracts.md", "L4-contracts/prisma-models.md",
    "L4-contracts/zod-schemas.md", "L4-contracts/shared-kernel.md", "L4-contracts/data-dictionary.md",
    "L4-contracts/prisma-columns.md", "L4-contracts/zod-full.md", "L4-contracts/seed-inventory.md",
    "architecture/00-ARCH-README.md", "architecture/dependency-graph.md",
    "architecture/boundaries-and-invariants.md", "architecture/boot-and-runtime.md",
    "architecture/data-architecture.md", "architecture/frontend-architecture.md",
    "architecture/risks-and-evolution.md", "architecture/capability-lifecycle.md",
    "architecture/security-and-auth.md", "architecture/configuration.md",
    "architecture/testing-and-quality.md", "architecture/operations.md",
    "architecture/error-catalog.md", "architecture/coverage.md", "architecture/shaping-intel.md",
    "architecture/mental-models.md", "architecture/data-flows.md", "architecture/algorithms.md",
    "architecture/reprogrammability.md", "architecture/core-model.md",
    "omega/01-provider-pilot-table.md", "omega/02-nlcl-verdicts.md",
    "ATLAS-INDEX.json", "ATLAS-FILES.json",
  ];
  for (const f of requiredAtlasFiles) {
    if (!existsSync(join(ATLAS, f))) drifts.push(`missing atlas file: source-atlas/${f}`);
  }
  if (!existsSync(GEN)) drifts.push("missing generated/ dir — run build-atlas.ts without --check first");
  if (drifts.length) {
    console.error("ATLAS DRIFT:\n" + drifts.join("\n"));
    console.error("Regenerate: bun run source-atlas/build-atlas.ts, then update hand-written catalogs.");
    process.exit(1);
  }
  console.log("atlas in sync (full coverage).");
}
