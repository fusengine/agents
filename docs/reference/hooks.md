# Hooks System

Automatic enforcement of APEX methodology and SOLID principles through Claude Code hooks.

## Overview

The hooks system ensures that agents:
1. **Consult skills** before writing code
2. **Follow APEX methodology** (Analyze → Plan → Execute → eXamine)
3. **Respect SOLID principles** (files < 100 lines, interfaces separated)

## Architecture

```
~/.claude/settings.json
       │
       ▼
scripts/hooks-loader.ts  ← Bun + SOLID (10x faster)
       │
       ▼
plugins/*/hooks/hooks.json  ← Auto-detected
       │
       ▼
plugins/*/scripts/*.sh  ← Executed in parallel
```

## Installation

### macOS / Linux
```bash
~/.claude/plugins/marketplaces/fusengine-plugins/setup.sh
```

### Windows (PowerShell)
```powershell
~\.claude\plugins\marketplaces\fusengine-plugins\setup.ps1
```

This installs:
- **Hooks loader** in `~/.claude/settings.json`
- **API keys** configuration (interactive prompts)
- **Shell config** (bash/zsh/fish/PowerShell)

All plugin hooks are automatically detected and loaded.

## Hook Types

| Hook | Trigger | Purpose |
|------|---------|---------|
| **SessionStart** | Session starts | Load context, inject CLAUDE.md, cleanup states |
| **UserPromptSubmit** | User sends message | Detect project type, inject APEX instruction |
| **PreToolUse** | Before Write/Edit/Bash | Block if skill not consulted, validate git/install commands |
| **PostToolUse** | After Write/Edit | Validate SOLID compliance, track changes |
| **SubagentStop** | Subagent completes | Track agent memory for context persistence |
| **Stop** | Claude finishes responding | Play completion sound notification |
| **PermissionRequest** | Permission dialog shown | Play sound for ALL permission prompts |
| **Notification** | Permission/idle/elicitation | Play sound alerts for user attention |

## Plugins with Hooks

| Plugin | PreToolUse | PostToolUse | UserPromptSubmit | SessionStart | SubagentStop | Stop | Notification |
|--------|------------|-------------|------------------|--------------|--------------|------|--------------|
| **ai-pilot** | APEX reminder | SOLID check | Project detection + APEX injection | - | - | - | - |
| **core-guards** | Git, Install, Security guards | File size, Session tracking | CLAUDE.md injection | Context, Cleanup | Memory | Sound | Sounds |
| **react-expert** | Block without skill | React SOLID validation | - | - | - | - | - |
| **nextjs-expert** | Block without skill | Next.js SOLID validation | - | - | - | - | - |
| **laravel-expert** | Block without skill | Laravel SOLID validation | - | - | - | - | - |
| **swift-apple-expert** | Block without skill | Swift SOLID validation | - | - | - | - | - |
| **tailwindcss** | Block without skill | Tailwind best practices | - | - | - | - | - |
| **design-expert** | Block without skill | Accessibility check | - | - | - | - | - |

## Loader Architecture (v2.0 - Bun + SOLID)

```
scripts/
├── hooks-loader.ts            ← Entry point
├── install-hooks.ts           ← Installation + API keys
├── package.json
├── src/
│   ├── interfaces/
│   │   ├── hooks.ts           ← Hook interfaces
│   │   └── env.ts             ← EnvKey interface
│   ├── config/
│   │   └── api-keys.ts        ← API keys configuration
│   ├── services/
│   │   ├── plugin-scanner.ts  ← Scan plugins, extract hooks
│   │   ├── hook-executor.ts   ← Execute hooks in PARALLEL
│   │   ├── settings-manager.ts← Manage settings.json
│   │   └── env-manager.ts     ← API keys & shell config
│   └── __tests__/
│       ├── api-keys.test.ts
│       ├── env-manager.test.ts
│       ├── fs-helpers.test.ts
│       ├── hook-executor.test.ts
│       ├── install-hooks.test.ts
│       ├── plugin-scanner.test.ts
│       └── settings-manager.test.ts
└── env-shell/
    ├── claude-env.bash
    ├── claude-env.zsh
    ├── claude-env.fish
    └── claude-env.ps1
```

### Testing

```bash
bun test           # Run 81 tests
bun test --watch   # Watch mode
```

### Performance

| Version | Execution | Speed |
|---------|-----------|-------|
| v1.0 (bash+jq) | Sequential | 280ms |
| **v2.0 (Bun)** | **Parallel** | **100ms** |

## Adding Hooks to a New Plugin

1. Create the hooks directory:
```bash
mkdir -p plugins/my-plugin/hooks plugins/my-plugin/scripts
```

2. Create `hooks/hooks.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/my-check.sh"
          }
        ]
      }
    ]
  }
}
```

3. Create your script in `scripts/my-check.sh`

4. Make it executable:
```bash
chmod +x plugins/my-plugin/scripts/*.sh
```

The hooks loader will automatically detect and load your new hooks.

## Script Input Format

Hooks receive JSON input via stdin:

```json
{
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.tsx",
    "content": "file content..."
  }
}
```

## Script Output

### To Allow (exit 0)
```bash
exit 0
```

### To Block (exit 2)
```bash
echo "Your blocking message here" >&2
exit 2
```

### To Add Context (exit 0 with JSON)
```bash
echo '{"additionalContext": "Your context here"}'
exit 0
```

## Troubleshooting

### Hooks not loading
```bash
# Check if hooks-loader.ts is in settings.json
cat ~/.claude/settings.json | jq '.hooks.PreToolUse'

# Re-run installation (macOS/Linux)
~/.claude/plugins/marketplaces/fusengine-plugins/setup.sh

# Re-run installation (Windows PowerShell)
~\.claude\plugins\marketplaces\fusengine-plugins\setup.ps1
```

### Hook not executing
```bash
# Test the hook manually
echo '{"tool_name":"Write","tool_input":{"file_path":"test.tsx"}}' | \
  bun ~/.claude/plugins/marketplaces/fusengine-plugins/scripts/hooks-loader.ts PreToolUse
```

### Debug mode
Add to your hook script:
```bash
echo "[DEBUG] Hook triggered: $TOOL_NAME on $FILE_PATH" >&2
```
