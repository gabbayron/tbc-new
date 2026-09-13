# Architecture decision records

These records explain durable choices made for the UI fork. Each has a corresponding code map in the [code and decision index](../code-index.md).

| ADR | Decision |
| --- | --- |
| [0001](0001-retain-the-upstream-runtime-and-ui-stack.md) | Retain the Go engine and TypeScript/`tsx-vanilla` UI stack |
| [0002](0002-preserve-simulator-and-sharing-contracts.md) | Preserve simulation, persistence, sharing, and route contracts |
| [0003](0003-one-workspace-shell-for-all-specs.md) | Use one workspace shell for every spec page |
| [0004](0004-isolate-the-design-system-from-simulation-state.md) | Keep theme and visual tokens separate from sim data |
| [0005](0005-fork-identity-with-upstream-credit.md) | Identify the fork while crediting upstream |

When a decision changes, add a new ADR and mark the old one superseded rather than rewriting its history.
