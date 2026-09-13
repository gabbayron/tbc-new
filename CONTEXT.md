# WoW TBC simulator language

This glossary names the player-facing concepts used by the simulator and its forked interface. It describes the domain, not the code that implements it.

## Language

**Spec**:
A playable class specialization with its own configuration and simulation behavior. A spec can have a page before its simulator is launched.

**Launch status**:
The readiness label for a spec: Unlaunched, Alpha, Beta, or Launched. It describes availability, not the accuracy of a particular run.

**Build**:
The player's selected gear, talents, and rotation. _Avoid_: using “build” to mean the compiled application.

**Setup**:
The encounter and supporting player, consumable, buff, and debuff choices used with a build.

**Simulation**:
A repeated combat calculation for the current build and setup, producing performance estimates and detailed results. _Avoid_: “sim” when it could mean the spec page or the whole project.

**Stat weights**:
Estimated relative values of character stats for the current build and setup; the UI also calls these EP weights.

**Batch**:
A comparison workflow that evaluates multiple gear alternatives against a common configuration. The source UI also calls this Bulk.

**Preset**:
A supplied, reusable configuration for part of a build or setup.

**Saved setup**:
A player-named configuration retained in the browser for later reuse. It is distinct from a share link or exported file.
