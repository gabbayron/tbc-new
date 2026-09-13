# Retain the upstream runtime and UI stack

Status: accepted

The fork keeps the Go simulation engine, protobuf boundary, browser workers, and TypeScript/`tsx-vanilla` components. Rebuilding the UI in React or Vue was permitted, but would require replacing mature pickers, tabs, import/export flows, and state wiring across every spec. Keeping the existing stack lets the redesign live mainly in shared components and styles, reduces behavioral regression risk, and makes simulation updates from upstream practical to merge. The cost is working within Bootstrap and the existing component conventions.

See [the code index](../code-index.md#runtime-and-spec-pages) for the implementing files.
