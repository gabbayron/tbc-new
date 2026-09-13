# UI redesign fork

This fork starts from upstream `wowsims/tbc-new` commit `0d942e68c48ed87405814ca3a7313ed5dd7e84c0`. The redesign is kept on `ui-redesign`; `upstream` points to `https://github.com/wowsims/tbc-new.git` and `origin` to `https://github.com/gabbayron/tbc-new.git`.

The Go simulation engine, protobuf schemas, saved-data keys, share-link routes, and import/export formats are unchanged. The UI still uses the upstream TypeScript/`tsx-vanilla` components. The shared workspace shell in `ui/core/components/sim_header.tsx` presents Build (Gear, Talents, Rotation), Setup (Settings), Results, and Batch. The same tabs are offered through a native select on narrow screens. Shared visual changes live in `ui/scss/shared/_modern_theme.scss`, `ui/scss/core/individual_sim_ui/_modern_workspace.scss`, and `ui/scss/homepage/_modern_homepage.scss` so spec logic can continue to merge from upstream.

The theme preference uses its own `__tbc_new_theme` local-storage key. Inter and Font Awesome are bundled locally. Upstream Google Analytics tags were removed; existing tracking helpers safely do nothing without `gtag`. The fork retains visible links to the original project and MIT license. “WoW Sims” remains temporary display branding. Until this fork publishes binaries, download links still go to upstream releases.

## Windows local preview

Install Node 22+, Go 1.25+, and Docker Desktop. Docker on Windows also needs WSL 2 enabled from an elevated terminal and usually a reboot (`wsl --install --no-distribution`); Docker cannot build images until its engine is running.

For a native browser preview, run `pwsh -NoProfile -File .\scripts\dev-windows.ps1` from the repository root, then open `http://127.0.0.1:5173/tbc/`. The script generates TypeScript and Go protobufs, builds the browser WASM and workers, checks TypeScript, and starts Vite with the WASM worker. Pass `-BuildOnly` to prepare and check the project without starting Vite. It requires Node 22+ and Go 1.25+; Docker is optional for this preview.

For the documented container build, once Docker Desktop is running, use `docker build --target prod -t wowsimtbc .` and `docker run --rm -p 8080:8080 wowsimtbc`. The development target and commands remain in [installation.md](installation.md).

## Validation notes

The production Vite bundle contains all 17 spec routes. Fourteen display Alpha; Restoration Druid, Holy Paladin, and Restoration Shaman display Not Yet Supported. Local Go-backed browser runs completed Hunter, DPS Warrior, and Protection Warrior simulations; Hunter detailed results, stat weights, Batch comparison, and a byte-identical JSON export/import/re-export round trip also completed. A browser WASM Protection Warrior run completed with the local Go server stopped. The UI was inspected at 375px, 768px, and desktop widths in both themes; wide result tables scroll within their panel.

TypeScript, CSS lint, locale tests, and the Vite production build pass. The upstream Go suite with `--tags=with_db` passes except `TestProtoVersioning`, which reports schema differences even though this fork does not modify `proto/`. The repository-wide `npm run fmt` also reports hundreds of pre-existing files; changed files are formatted individually to avoid unrelated churn.

## Updating from upstream

Keep `master` as an upstream baseline. From `ui-redesign`, run `git fetch upstream` and merge `upstream/master`, resolve conflicts in the shared UI files, then repeat the validation above. Preserve the `__tbc_new_theme` key and original-project credit when updating the header or templates.
