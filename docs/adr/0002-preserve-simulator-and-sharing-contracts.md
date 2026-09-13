# Preserve simulator and sharing contracts

Status: accepted

The redesign changes presentation without changing Go simulation logic, protobuf schemas, spec URLs, saved-data keys, share-link encoding, or existing import/export formats. A new UI data model or new serialization format could simplify a rewrite, but would break existing setups and links and make upstream parity much harder to prove. Unlaunched healing specs remain Unlaunched; building their simulation engines or a separate raid builder is outside this fork's redesign scope. New display preferences therefore use storage separate from simulation settings.

See [the code index](../code-index.md#configuration-sharing-and-simulation) for the contract owners.
