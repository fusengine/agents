---
name: map
description: "Refresh and display the ecosystem map of all installed plugins, agents, skills, commands, and hooks."
argument-hint: "[--enrich]"
---

# /map — Ecosystem Map

Refresh the cartography and optionally enrich descriptions.

## Usage

```
/map          — Display current ecosystem map
/map --enrich — Enrich descriptions from source frontmatter
```

## Steps

1. **Ask the user** what to enrich:
   - "Tu veux enrichir la cartographie du **projet** (.cartographer/project/) ?"
   - "Tu veux aussi enrichir la cartographie des **plugins** (~/.claude/plugins/.../fusengine-plugins/.cartographer/) ?"
2. **Read** the relevant map(s):
   - Project: `.cartographer/project/index.md`
   - Plugins: `${CLAUDE_PLUGIN_ROOT}/../.cartographer/index.md`
3. **Display** the map with plugin count, agents, skills summary
4. If `--enrich` or user confirms: launch the cartographer agent to replace truncated descriptions with full frontmatter descriptions on the selected scope(s)

## Output

The auto-generated map is refreshed at every SessionStart by the Python script. This command displays it and optionally enriches it.
