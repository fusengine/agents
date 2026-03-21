---
name: map
description: "Refresh and display the ecosystem map of all installed plugins, agents, skills, commands, and hooks."
argument-hint: "[--refresh]"
---

# /map - Ecosystem Map

Regenerate and display the full plugin ecosystem map.

## Steps

1. **Refresh the map** by running the generator script:
   ```bash
   python3 ${CLAUDE_PLUGIN_ROOT}/scripts/generate_map.py ${CLAUDE_PLUGIN_ROOT}/.. ${CLAUDE_PROJECT_DIR}/.cartographer
   ```

2. **Read the generated map** from `.cartographer/ecosystem-map.md`

3. **Display the map** to the user with a summary of:
   - Total plugins found
   - Agents, skills, commands, and hooks counts
   - Full indented tree structure

## Usage

```
/map          — Refresh and display ecosystem map
/map --refresh — Force regeneration even if map exists
```

## Output Location

The generated map is saved to `${CLAUDE_PROJECT_DIR}/.cartographer/ecosystem-map.md`
and is automatically loaded at session start via the cartographer hook.
