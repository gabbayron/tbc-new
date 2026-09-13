# Redesign process and evidence

This is the implementation record for the first local deliverable, based on the accepted redesign plan. It explains the decisions and checks without replacing the upstream contributor guides. The starting point was upstream commit `0d942e68c48ed87405814ca3a7313ed5dd7e84c0`; the initial redesign was committed as `6848d5de9` on `ui-redesign` and pushed to [gabbayron/tbc-new](https://github.com/gabbayron/tbc-new). The fork has `upstream` and `origin` remotes for future merges. No public site was deployed.

## Scope and decisions

The `grill-me` interview and accepted plan established two priorities: modernize the experience for regular players and keep all existing simulator capabilities. React or Vue was allowed, but the existing TypeScript/`tsx-vanilla` component layer already contained the gear, talent, rotation, result, save, and import/export behavior. We therefore retained it and changed shared composition and styling. [ADR 0001](adr/0001-retain-the-upstream-runtime-and-ui-stack.md) records that trade-off.

The redesign maps existing tabs into Build, Setup, Results, and Batch and keeps run controls and a compact character summary accessible. Mobile uses the same tab instances through a native select. `ui-ux-pro-max` guidance informed the homepage and spec-page design tokens, dark/light themes, typography, semantic focus states, responsive layouts, and reduced-motion handling. These choices are captured in [ADR 0003](adr/0003-one-workspace-shell-for-all-specs.md) and [ADR 0004](adr/0004-isolate-the-design-system-from-simulation-state.md).

Compatibility was a constraint from the start. We left Go simulation rules, protobuf files, spec paths, saved-data keys, share-link encoding, and import/export formats alone. The theme key is separate from simulation settings. The three healing specs marked Unlaunched remain so; adding their engines or a separate raid-builder page was excluded. [ADR 0002](adr/0002-preserve-simulator-and-sharing-contracts.md) describes this boundary.

The fork uses its own GitHub and issue links, displays a link to the original project and MIT notice, removes the upstream analytics tags, and leaves binary downloads pointed at upstream until fork binaries exist. “WoW Sims” is temporary display copy. [ADR 0005](adr/0005-fork-identity-with-upstream-credit.md) explains that ownership choice.

## Implementation sequence

1. Inspected the Go, protobuf, worker, Vite, shared UI, and spec-page paths; recorded the 17 routes and their launch states.
2. Built the shared workspace header and sidebar shell around existing tabs and actions, then redesigned the homepage. This avoided duplicating controls in each spec.
3. Added semantic SCSS tokens and responsive styles. Browser inspection at desktop, 768px, and 375px led to fixes for mobile toolbar overflow, the navigation drawer, and wide result tables.
4. Added the isolated theme preference and bundled visual assets; removed upstream analytics loading while keeping tracking helper calls safe.
5. Added a native Windows script to generate protobuf bindings, build Go/WASM and workers, run TypeScript checking, and start the Vite preview. Docker Desktop was installed, but its engine could not start before the machine enables WSL 2.

The exact owner for each step is in the [code and decision index](code-index.md). [Windows preview and upstream sync](ui-redesign.md) has the runnable commands.

## Validation performed

| Check | Result |
| --- | --- |
| `npm ci`, `npm run type-check`, `npm run lint`, `npm run test:locales`, `npx vite build` | Passed. Lint reported existing JavaScript warnings; the production build generated all 17 spec pages. |
| Changed-file format check and `git diff --check` | Passed. The whole-repository `npm run fmt` still reports hundreds of pre-existing formatting differences, so unrelated files were not rewritten. |
| `go test --tags=with_db ./sim/...` | Only `TestProtoVersioning` failed with a schema-version discrepancy; this redesign did not edit `proto/`. The same suite with `-skip '^TestProtoVersioning$'` passed. |
| Browser routes and accessibility inspection | All 17 routes opened; 14 displayed Alpha and three healing routes displayed Not Yet Supported. Dark/light and 375px, 768px, and desktop layouts were checked, including keyboard skip-link access, contrast, and reduced motion. |
| Representative user flows | Local Go-backed Hunter, DPS Warrior, and Protection Warrior runs completed. Hunter detailed results, stat weights, Batch comparison, and a byte-identical JSON export/import/re-export round trip completed. |
| Browser-only simulation | A Protection Warrior run completed through the Go/WASM worker with the local server stopped. |
| Docker production build | Not run: Docker Desktop is installed, but WSL 2 and the engine were unavailable without an elevated Windows setup and reboot. |

The Go schema-version failure and repository-wide formatting differences are current baseline issues to reassess when upstream changes. The native preview remains usable without Docker. To enable the container path, run `wsl --install --no-distribution` in an elevated terminal, reboot if requested, start Docker Desktop, and then run the commands in [ui-redesign.md](ui-redesign.md).

## Continuing the fork

Keep simulator changes upstream-friendly. Fetch `upstream/master` into `ui-redesign`, resolve shared UI conflicts deliberately, and verify the contract and route rows in the [code index](code-index.md). If a future redesign changes a recorded architectural choice, add a superseding ADR and update the index; keep the original record as the reason the first implementation took this shape.
