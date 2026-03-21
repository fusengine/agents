---
name: map-ecosystem
description: "Generate indented markdown map of the plugin ecosystem. Use when navigating skills, finding agents, or locating commands."
argument-hint: "[plugins_dir] [output_dir]"
context: fork
user-invocable: false
---

# Map Ecosystem

Generate an indented markdown tree of all plugins, agents, skills, commands, and hooks.

## When to Use

- Agent needs to find the right skill or command
- Navigating the plugin ecosystem
- Understanding which agent handles what
- Lost or unsure about available capabilities

## When NOT to Use

- Code generation or debugging
- Research or documentation lookup
- Direct file editing

## Steps

1. Run the generator script:
   ```bash
   python3 ${CLAUDE_PLUGIN_ROOT}/scripts/generate_map.py [plugins_dir] [output_dir]
   ```
2. Read the generated `.cartographer/ecosystem-map.md`
3. Use the map to locate the target skill/agent/command

## Output Format

Indented tree with Unicode connectors:

```
fuse-ai-pilot/ (v1.2.14)
├── agents/
│   ├── sniper — 7-phase code quality validation
│   ├── explore-codebase — Architecture discovery
│   └── research-expert — Documentation and best practices
├── skills/
│   ├── apex/ — APEX methodology
│   ├── tdd/ — RED-GREEN-REFACTOR cycle
│   └── verification/ — Functional check
├── commands/
│   ├── /apex — Full APEX flow
│   └── /commit — Smart conventional commit
└── hooks: SessionStart, PreToolUse, PostToolUse
```

## Parameters

| Param | Default | Description |
|-------|---------|-------------|
| plugins_dir | Auto-detect via CLAUDE_PLUGIN_ROOT | Path to plugins directory |
| output_dir | .cartographer/ | Where to write the map |

## Forbidden Behaviors

- Do not modify any plugin files
- Do not assume plugin structure without scanning
- Do not generate partial maps without error reporting
