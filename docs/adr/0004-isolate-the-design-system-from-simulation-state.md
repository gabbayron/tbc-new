# Isolate the design system from simulation state

Status: accepted

The fork uses shared semantic CSS tokens for graphite/brass dark mode and warm-stone light mode, while retaining class/spec color styling. The theme preference lives in `__tbc_new_theme`, outside the simulator's serialized and per-spec settings. Inserting appearance fields into simulation protobufs or restyling every spec independently would increase compatibility and merge costs. Bundled Inter and Font Awesome assets, early theme initialization, and chart color updates keep both themes coherent across routes.

See [the code index](../code-index.md#redesigned-interface) for the token, theme, and asset entry points.
