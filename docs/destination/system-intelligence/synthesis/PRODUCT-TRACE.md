# Product Trace

| Atom | Capability / boundary | Product requirement or journey | Vertical slices | Implementation evidence | Proof state |
|---|---|---|---|---|---|
| SI-010101 | Recipe authority | Composition; Authority | VS1, VS6, VS8 | omega-baseline/omega-final/contracts/src/recipe.ts<br>omega-baseline/omega-final/contracts/src/manifest.ts | VERIFIED |
| SI-010102 | µhost / Port Protocol | Ω Runtime; Capability; Evidence | VS1, VS3, VS4, VS6 | omega-baseline/omega-final/host/src/index.ts<br>omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md | VERIFIED |
| SI-010103 | Vault durability and revisioned evidence | Vault; Evidence; Memory; Product Instance | VS1, VS2, VS3, VS4, VS5, VS6, VS7, VS8 | omega-baseline/omega-final/plugins/vivim-vault/plugin.json<br>omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md | VERIFIED |
| SI-010104 | Law / authority gate | Law; Authority; Consent; Evidence | VS0, VS3, VS4, VS6, VS7 | omega-baseline/omega-final/plugins/vivim-law/plugin.json<br>omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md | VERIFIED |
| SI-010105 | Canonical intent persistence | Intent; Capability; Evidence | VS0, VS3, VS4, VS6 | omega-baseline/omega-final/contracts/src/intent.ts<br>omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md | VERIFIED |
| SI-010106 | Execution/context substrate | Work; Execution; Context; Liveness | VS3, VS4, VS5, VS6 | omega-baseline/omega-final/plugins/vivim-run/src/index.ts<br>omega-baseline/omega-final/plugins/vivim-run/plugin.json | CODE |
| SI-010107 | Derived self-knowledge lens | World; Evidence; Self-Knowledge | VS1, VS3, VS5, VS6 | omega-baseline/omega-final/plugins/vivim-mind/plugin.json<br>omega-baseline/omega-final/plugins/vivim-mind/src/index.ts | CODE |
| SI-020101 | Legacy capability resolution/execution | Capability; Intent; Provider | VS3 | vivim-original-baseline/vivim-final-enhanced/docs/architecture/overview.md<br>vivim-original-baseline/vivim-final-enhanced/src/engines/capability-resolution.ts | DOCUMENTED |
| SI-020102 | Legacy Provider Account model | Provider; Account; Identity | VS3, VS5, VS8 | vivim-original-baseline/vivim-final-enhanced/prisma/schema.prisma | CODE |
| SI-020103 | Legacy ProviderSession/ProfileSession chain | Session; Account; Browser | VS3, VS5 | vivim-original-baseline/vivim-final-enhanced/prisma/schema.prisma | CODE |
| SI-020104 | Legacy conversation/message persistence | Conversation; Message; World | VS2, VS3, VS5, VS8 | vivim-original-baseline/vivim-final-enhanced/prisma/schema.prisma<br>vivim-original-baseline/vivim-final-enhanced/docs/architecture/data-model.md | CODE |
| SI-020105 | ChromeGovernor as historical browser authority | Browser; Provider; Execution | VS3, VS7 | vivim-original-baseline/vivim-final-enhanced/docs/architecture/overview.md<br>vivim-original-baseline/vivim-final-enhanced/docs/architecture/backend.md | DOCUMENTED |
| SI-020106 | Discovery/healing/semantic browser machinery | Provider; Healing; Discovery | VS7 | vivim-original-baseline/vivim-final-enhanced/docs/architecture/backend.md<br>vivim-original-baseline/vivim-final-enhanced/docs/runbooks/providers.md | DOCUMENTED |
| SI-020107 | Legacy canvas/workspace/unified-entry behavior | World; Workspace; Canvas; Universal Entry | VS1, VS2, VS3, VS5 | docs/destination/WORLD-WORKSPACE-CANVAS-RECONCILIATION.md<br>docs/destination/VIVIM-PRODUCT-INSTANCE-CORE.md | DOCUMENTED |
| SI-030101 | Standalone Ω all-plugin baseline | Plugin; Ω Runtime; Composition | VS1, VS3, VS6, VS8 | README.md | DOCUMENTED |
| SI-030102 | Standalone provider-browser was fixture-first | Provider; Session; Realization | VS3, VS7 | plugins/provider-browser/src/index.ts<br>plugins/provider-browser/plugin.json | CODE |
| SI-030103 | D-418 / D-456 Chrome-only v1 sequencing | Provider; Realization; Routing | VS3, VS7 | omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md<br>docs/decisions/CURRENT-INVARIANTS.md | VERIFIED |
| SI-030104 | D-411 intent evolution | Intent; Evidence | VS0, VS3, VS4, VS6 | omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md<br>omega-baseline/omega-final/contracts/src/intent.ts | VERIFIED |
| SI-030105 | Ω evolution from core seam laws to substrate chain | Evolution; Law; Evidence; Plugin | VS1, VS4, VS6, VS8 | docs/decisions/CURRENT-INVARIANTS.md<br>omega-baseline/omega-final/genome/layers.json | DOCUMENTED |
| SI-030106 | BCP provider-browser live divergence | Provider; Session; Realization; Evidence | VS3, VS7 | omega-baseline/omega-final/plugins/provider-browser/plugin.json<br>omega-baseline/omega-final/plugins/provider-browser/src/index.ts | CODE+TEST;NO-LIVE-RUN |
| SI-030107 | Ω Forge mine/harvest boundary | Forge; Evidence; Evolution | VS6, VS7, VS8 | omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md<br>omega-baseline/omega-final/genome/layers.json | VERIFIED |
| SI-040101 | VIVIM Product Instance | see destination docs | VS1, VS5, VS8 | docs/destination/VIVIM-PRODUCT-INSTANCE-CORE.md §1–4 | DOCUMENTED |
| SI-040102 | World projection | see destination docs | VS1, VS2, VS3, VS5 | docs/destination/WORLD-WORKSPACE-CANVAS-RECONCILIATION.md §2–5, §11 | DOCUMENTED |
| SI-040103 | Space / workspace / canvas projection | see destination docs | VS1, VS3, VS5 | docs/destination/WORLD-WORKSPACE-CANVAS-RECONCILIATION.md §2, §7–8, §17 | DOCUMENTED |
| SI-040104 | Universal interaction surface | see destination docs | VS3, VS4, VS6 | docs/destination/VIVIM-PRODUCT-INSTANCE-CORE.md §9 / destination interaction docs | DOCUMENTED |
| SI-040105 | Durable work and continuity | see destination docs | VS4, VS5, VS6, VS7 | docs/destination/MATURITY-AND-GAPS.md §4 G6–G8; VIVIM-PRODUCT-INSTANCE-CORE.md §6, §11 | DOCUMENTED |
| SI-040106 | Provider/account user journey | see destination docs | VS3, VS5, VS8 | docs/destination/PROVIDER-ACCOUNT-ROUTING-RECONCILIATION.md §1–3; VIVIM-PRODUCT-INSTANCE-CORE.md §10 | DOCUMENTED |
| SI-040107 | Vertical-slice convergence bridge | see destination docs | VS0, VS1, VS2, VS3, VS4, VS5, VS6, VS7, VS8 | docs/destination/VERTICAL-SLICE-REGISTRY.md §2–4 | DOCUMENTED |
| SI-050101 | Provider ↔ Account | see destination docs | VS3, VS5, VS8 | vivim-original-baseline/vivim-final-enhanced/prisma/schema.prisma<br>docs/destination/PROVIDER-ACCOUNT-ROUTING-RECONCILIATION.md | CODE+DOCUMENTED |
| SI-050102 | Account ↔ Session ↔ Browser | see destination docs | VS3, VS7 | vivim-original-baseline/vivim-final-enhanced/prisma/schema.prisma<br>omega-baseline/omega-final/plugins/provider-browser/src/index.ts | CODE+DOCUMENTED |
| SI-050103 | Capability ↔ Realization | see destination docs | VS3, VS7 | omega-baseline/omega-final/contracts/src/provider.ts<br>omega-baseline/omega-final/plugins/provider-browser/src/index.ts | CODE |
| SI-050104 | Intent ↔ Capability ↔ Authority | see destination docs | VS0, VS3, VS4, VS6 | omega-baseline/omega-final/contracts/src/intent.ts<br>omega-baseline/omega-final/plugins/vivim-law/plugin.json | CODE |
| SI-050105 | Work ↔ Evidence | see destination docs | VS4, VS5, VS6, VS7 | omega-baseline/omega-final/plugins/vivim-run/plugin.json<br>omega-baseline/omega-final/plugins/vivim-vault/plugin.json | CODE+DOCUMENTED |
| SI-050106 | World ↔ Surface | see destination docs | VS1, VS2, VS3, VS5 | omega-baseline/omega-final/plugins/vivim-mind/plugin.json<br>docs/destination/WORLD-WORKSPACE-CANVAS-RECONCILIATION.md | CODE+DOCUMENTED |
| SI-050107 | Product Instance ↔ Persistence | see destination docs | VS1, VS8 | docs/destination/VIVIM-PRODUCT-INSTANCE-CORE.md<br>omega-baseline/omega-final/plugins/vivim-vault/plugin.json | CODE+DOCUMENTED |
| SI-050108 | Provider ↔ Routing | see destination docs | VS3, VS5, VS8 | vivim-original-baseline/vivim-final-enhanced/docs/architecture/overview.md<br>docs/destination/PROVIDER-ACCOUNT-ROUTING-RECONCILIATION.md | CODE+DOCUMENTED |
| SI-060101 | Implementation is not product proof | see destination docs | VS1, VS8 | docs/destination/system-intelligence | DOCUMENTED |
| SI-060102 | Provider live code still needs live proof | see destination docs | VS3, VS7 | docs/destination/system-intelligence | NO-LIVE-RUN |
| SI-060103 | Account/routing canonical gap | see destination docs | VS3, VS5, VS8 | docs/destination/system-intelligence | DOCUMENTED |
| SI-060104 | World projection breadth | see destination docs | VS1, VS2, VS3, VS5 | docs/destination/system-intelligence | DOCUMENTED |
| SI-060105 | Product shell / lifecycle | see destination docs | VS1, VS8 | docs/destination/system-intelligence | DOCUMENTED |
| SI-060106 | Desktop and external-world substrate | see destination docs | VS4, VS7 | docs/destination/system-intelligence | DOCUMENTED |
| SI-060107 | Continuity / attention | see destination docs | VS4, VS5, VS7 | docs/destination/system-intelligence | DOCUMENTED |
| SI-060108 | Governor vs plugin-local CDP | see destination docs | VS3, VS7 | docs/destination/system-intelligence | DOCUMENTED |