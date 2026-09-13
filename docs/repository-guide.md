# Repository guide

This fork of [WoWSims TBC](https://github.com/wowsims/tbc-new) helps players evaluate Burning Crusade Classic character configurations. A player chooses gear, talents, rotation, encounter conditions, buffs/debuffs, and consumables; runs repeated combat simulations; and inspects summary and detailed results. Stat weights estimate the relative value of attributes, while Batch compares gear alternatives. Presets, browser-saved setups, JSON import/export, and share links support reuse.

The fork's first deliverable is a locally runnable UI redesign. The simulation engine and data formats remain upstream-compatible. See [the glossary](../CONTEXT.md) for the player-facing terms and [the ADRs](adr/README.md) for the lasting decisions.

## Architecture at a glance

```text
Spec URL and page template
  → spec entry point + spec configuration
  → shared IndividualSimUI, Player, Raid, Encounter
  → protobuf request through WorkerPool
  → browser Go/WASM worker or local Go HTTP worker
  → Go simulation core
  → protobuf result → summary, detailed results, stat weights, Batch
```

- **Simulation engine:** [sim/core](../sim/core), class/spec packages under [sim](../sim), and shared request/response definitions under [proto](../proto). [sim/wasm/main.go](../sim/wasm/main.go) exposes the Go engine to a browser worker; [sim/web/main.go](../sim/web/main.go) exposes it through a local server and can serve an embedded web build.
- **Web application:** [ui/index.html](../ui/index.html) is the landing page. [ui/index_template.html](../ui/index_template.html) is rendered for each spec by [tools/vite/spec_pages.mts](../tools/vite/spec_pages.mts). Each `ui/<class>/<spec>/index.ts` creates a player and spec UI; its `sim.ts`, `inputs.ts`, and `presets.ts` supply spec-specific behavior and defaults. [ui/core/individual_sim_ui.tsx](../ui/core/individual_sim_ui.tsx) assembles the common controls.
- **Worker boundary:** [ui/core/sim.ts](../ui/core/sim.ts) builds requests and manages runs; [ui/core/worker_pool.ts](../ui/core/worker_pool.ts) routes them to browser or local workers in [ui/worker](../ui/worker). [vite.config.mts](../vite.config.mts) supplies the `/tbc/` base path and worker assets during development.
- **Build assets:** [Makefile](../Makefile) is the upstream build orchestration; [Dockerfile](../Dockerfile) has development and production targets. [scripts/dev-windows.ps1](../scripts/dev-windows.ps1) provides a native Windows preview path. Generated protobuf code, WASM, workers, and output under `dist/tbc` are build artifacts rather than hand-edited source.

## What the UI contains

Every supported spec page uses the same workspace. **Build** contains Gear, Talents, and Rotation. **Setup** contains encounter, player, consumables, buffs/debuffs, and other settings. **Results** contains the detailed report; the run controls and compact character summary remain accessible beside the workspace. **Batch** contains the existing bulk gear-comparison workflow. Import/export and saved setups remain in their existing components.

The route shape is `/tbc/<class>/<spec>/`. The Vite page-discovery plugin builds a page when a spec has both an `index.ts` entry and a matching spec stylesheet. [Launch status](../ui/core/launched_sims.tsx) remains authoritative; a page can exist without an active simulator.

| Class | Page directories | Current status |
| --- | --- | --- |
| Druid | balance, feralcat, feralbear, restoration | First three Alpha; restoration Unlaunched |
| Hunter | dps | Alpha |
| Mage | dps | Alpha |
| Paladin | holy, protection, retribution | Holy Unlaunched; others Alpha |
| Priest | dps | Alpha |
| Rogue | dps | Alpha |
| Shaman | elemental, enhancement, restoration | Restoration Unlaunched; others Alpha |
| Warlock | dps | Alpha |
| Warrior | dps, protection | Alpha |

That is 17 routes: 14 Alpha and three Unlaunched. The spec pages expose raid/party-related settings; this repository does not provide a separate raid-builder page.

## Configuration and results contracts

The shared UI serializes an `IndividualSimSettings` protobuf for local settings and JSON. Saved presets use per-spec browser storage keys in [ui/core/individual_sim_ui.tsx](../ui/core/individual_sim_ui.tsx) and [ui/core/components/saved_data_manager.tsx](../ui/core/components/saved_data_manager.tsx). Share links encode selected categories of the same settings as compressed protobuf bytes in the URL hash; the existing [link importer](../ui/core/components/individual_sim_ui/importers/individual_link_importer.tsx) and [link exporter](../ui/core/components/individual_sim_ui/exporters/individual_link_exporter.tsx) own that format. The new theme preference has its own key and does not enter these exports.

For work on simulation rules, edit the relevant [Go spec package](../sim) and its tests. For new spec inputs or presets, follow [adding a sim](adding_sim.md). For shared presentation, start with the [code and decision index](code-index.md); it identifies the smallest files to change without duplicating controls across specs.
