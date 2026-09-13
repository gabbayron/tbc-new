# Code and decision index

Use this map to find the owner of a behavior before editing. ADRs explain why the redesign chose its boundaries; the linked source files show how those choices are implemented. For an overview of the full runtime, start with the [repository guide](repository-guide.md).

## Runtime and spec pages

| Concern | Source of truth | Decision |
| --- | --- | --- |
| Go combat rules and spec implementations | [sim/core](../sim/core), [sim](../sim) | [ADR 0001](adr/0001-retain-the-upstream-runtime-and-ui-stack.md) |
| Request/response and UI schemas | [proto](../proto) | [ADR 0001](adr/0001-retain-the-upstream-runtime-and-ui-stack.md), [ADR 0002](adr/0002-preserve-simulator-and-sharing-contracts.md) |
| Browser and local Go entry points | [sim/wasm/main.go](../sim/wasm/main.go), [sim/web/main.go](../sim/web/main.go) | [ADR 0001](adr/0001-retain-the-upstream-runtime-and-ui-stack.md) |
| Spec route discovery and shared HTML | [tools/vite/spec_pages.mts](../tools/vite/spec_pages.mts), [ui/index_template.html](../ui/index_template.html), [vite.config.mts](../vite.config.mts) | [ADR 0002](adr/0002-preserve-simulator-and-sharing-contracts.md) |
| One spec's entry/configuration/presets (Hunter example) | [index.ts](../ui/hunter/dps/index.ts), [sim.ts](../ui/hunter/dps/sim.ts), [inputs.ts](../ui/hunter/dps/inputs.ts), [presets.ts](../ui/hunter/dps/presets.ts) | [ADR 0001](adr/0001-retain-the-upstream-runtime-and-ui-stack.md) |
| Launch readiness and disabled spec behavior | [ui/core/launched_sims.tsx](../ui/core/launched_sims.tsx), [ui/core/sim_ui.tsx](../ui/core/sim_ui.tsx) | [ADR 0002](adr/0002-preserve-simulator-and-sharing-contracts.md) |

## Configuration, sharing, and simulation

| Concern | Source of truth | Decision |
| --- | --- | --- |
| Shared spec UI, tab creation, state serialization, and per-spec storage keys | [ui/core/individual_sim_ui.tsx](../ui/core/individual_sim_ui.tsx) | [ADR 0002](adr/0002-preserve-simulator-and-sharing-contracts.md), [ADR 0003](adr/0003-one-workspace-shell-for-all-specs.md) |
| Gear, talents, rotation, settings, and Batch controls | [gear tab](../ui/core/components/individual_sim_ui/gear_tab.ts), [talents tab](../ui/core/components/individual_sim_ui/talents_tab.tsx), [rotation tab](../ui/core/components/individual_sim_ui/rotation_tab.tsx), [settings tab](../ui/core/components/individual_sim_ui/settings_tab.tsx), [bulk tab](../ui/core/components/individual_sim_ui/bulk_tab.tsx) | [ADR 0003](adr/0003-one-workspace-shell-for-all-specs.md) |
| Run actions, results, and stat weights | [sim action](../ui/core/components/sim_action.tsx), [results viewer](../ui/core/components/results_viewer.tsx), [detailed results](../ui/core/components/detailed_results.tsx), [stat weights action](../ui/core/components/stat_weights_action.tsx) | [ADR 0002](adr/0002-preserve-simulator-and-sharing-contracts.md) |
| Browser-saved setups | [ui/core/components/saved_data_manager.tsx](../ui/core/components/saved_data_manager.tsx), [ui/core/individual_sim_ui.tsx](../ui/core/individual_sim_ui.tsx) | [ADR 0002](adr/0002-preserve-simulator-and-sharing-contracts.md) |
| JSON and link import/export | [importers](../ui/core/components/individual_sim_ui/importers), [exporters](../ui/core/components/individual_sim_ui/exporters) | [ADR 0002](adr/0002-preserve-simulator-and-sharing-contracts.md) |
| Request creation, worker routing, and transport | [ui/core/sim.ts](../ui/core/sim.ts), [ui/core/worker_pool.ts](../ui/core/worker_pool.ts), [ui/worker](../ui/worker) | [ADR 0001](adr/0001-retain-the-upstream-runtime-and-ui-stack.md) |

## Redesigned interface

| Concern | Source of truth | Decision |
| --- | --- | --- |
| Landing page layout, class cards, mobile navigation, and credits | [ui/index.html](../ui/index.html), [ui/scss/homepage/_modern_homepage.scss](../ui/scss/homepage/_modern_homepage.scss) | [ADR 0003](adr/0003-one-workspace-shell-for-all-specs.md), [ADR 0005](adr/0005-fork-identity-with-upstream-credit.md) |
| Shared Build/Setup/Results/Batch navigation and mobile select | [ui/core/components/sim_header.tsx](../ui/core/components/sim_header.tsx) | [ADR 0003](adr/0003-one-workspace-shell-for-all-specs.md) |
| Sidebar, compact stats, run-control placement, and attribution | [ui/core/sim_ui.tsx](../ui/core/sim_ui.tsx), [ui/scss/core/individual_sim_ui/_modern_workspace.scss](../ui/scss/core/individual_sim_ui/_modern_workspace.scss) | [ADR 0003](adr/0003-one-workspace-shell-for-all-specs.md), [ADR 0005](adr/0005-fork-identity-with-upstream-credit.md) |
| Semantic dark/light tokens, form states, focus, reduced motion | [ui/scss/shared/_modern_theme.scss](../ui/scss/shared/_modern_theme.scss) | [ADR 0004](adr/0004-isolate-the-design-system-from-simulation-state.md) |
| Theme storage, initialization, and chart colors | [ui/shared/theme.ts](../ui/shared/theme.ts), [ui/index.ts](../ui/index.ts), [ui/index.html](../ui/index.html), [ui/index_template.html](../ui/index_template.html) | [ADR 0004](adr/0004-isolate-the-design-system-from-simulation-state.md) |
| Self-hosted font/icons and translated workspace labels | [package.json](../package.json), [ui/index.ts](../ui/index.ts), [assets/locales/en/translation.json](../assets/locales/en/translation.json) | [ADR 0004](adr/0004-isolate-the-design-system-from-simulation-state.md) |

## Fork identity and maintenance

| Concern | Source of truth | Decision |
| --- | --- | --- |
| Fork links, upstream releases, and stable `/tbc/` route name | [ui/core/constants/other.ts](../ui/core/constants/other.ts) | [ADR 0002](adr/0002-preserve-simulator-and-sharing-contracts.md), [ADR 0005](adr/0005-fork-identity-with-upstream-credit.md) |
| Removed analytics loader and safe tracking calls | [ui/index.html](../ui/index.html), [ui/index_template.html](../ui/index_template.html), [ui/tracking/utils.ts](../ui/tracking/utils.ts) | [ADR 0005](adr/0005-fork-identity-with-upstream-credit.md) |
| Build and preview paths | [Makefile](../Makefile), [Dockerfile](../Dockerfile), [scripts/dev-windows.ps1](../scripts/dev-windows.ps1), [vite.config.mts](../vite.config.mts) | [ADR 0001](adr/0001-retain-the-upstream-runtime-and-ui-stack.md) |

After a change to a contract row, validate saved setups, JSON and link round trips, and both browser and local simulation paths. After a shared UI change, check a ranged, melee, and tank spec plus the three Unlaunched pages. The completed baseline checks and current exceptions are in the [redesign process](redesign-process.md).
