# Vivim Redesign Workspace & Blueprint Center

> **Clean-room architectural redesign, end-state specification, and implementation blueprint for Vivim.**  
> Grounded in real codebase intelligence, free from mock automation, and engineered for modularity, natural language reprogrammability, and native self-description.

---

## 📁 Directory Topology & Scope of Work

```
docs/redesign/
├── 00-backstory/                       # Complete preserved historical documentation & audits
│   ├── architecture/                   # Evolution journal, dual-DB design, historical decisions
│   ├── end-state/                      # Previous migration plan, 5-zone theory, 2,398-file catalog
│   ├── genome/                         # Repository census, git archaeology, D-001 decisions
│   ├── kernel-plugins/                 # 44 contracts, 30 invariants, ADRs 001-008, I-2 index run
│   ├── librarian-v3/                   # Living Librarian wiki generator, auto-discover, manifest specs
│   └── reprogrammability-source-ref/   # 8-op mutation grammar, version store, surface contract
│
├── 01-end-state-architecture/          # Master architectural specifications (5 pure zones, boot order)
├── 02-kernel-contracts/                # Pure, closed TypeScript contracts (C-01..C-44, IPluginContext)
├── 03-intelligence-substrate/          # Layer 0 deterministic intelligence, 6-tier pipeline, local NLU
├── 04-reprogrammability/               # ReprogrammableSurface, 8-op Mutation DSL, Time-Machine Versioning
├── 05-self-knowledge-mlayer/           # M-Layer (M1 Identity, M2 Provenance, M3 Rationale, M4 Graph, IWhy)
├── 06-plugins-catalog/                 # K1 first-party plugins, K3 UI slots, provider integrations
└── 07-prioritization-matrix-pmm/       # AST dependency depth, migration waves, PMM prioritization
```

---

## 🏛️ Architectural Pillars

1. **Clean Kernel Isolation ($K0$):**
   A minimal, closed kernel substrate ($<15$ core tables, zero product vocabulary) that boots without any external services or plugins.
2. **Deterministic Layer 0 Intelligence ($K0(L0)$):**
   Hot-swappable, 6-tier command resolution pipeline with zero-AI deterministic regex/keyword fallbacks, local embeddings, and optional LLM-slave escalation.
3. **Deep Natural Language Reprogrammability:**
   Every visible and controllable surface implements `ReprogrammableSurface`, manipulated through an 8-op atomic mutation grammar (`replace`, `insert`, `remove`, `reorder`, `restyle`, `rebind`, `set_property`, `set_slot`) with cryptographic provenance and instant time-machine rollbacks.
4. **Native Self-Knowledge Engine ($M$-Layer & Living Wiki):**
   Self-referential, self-descriptive kernel answering the $M$-Quadruple ($M1$ Identity, $M2$ Provenance, $M3$ Rationale, $M4$ Graph) with an automated AST-driven Living Librarian wiki database.
5. **No Special Fast Paths for First-Party Code:**
   Vivim’s own features (Chat, Memory, Canvas, Workflows, Providers) are structured as first-party plugins ($K1$) consuming the exact same closed `IPluginContext` available to third-party developers.
