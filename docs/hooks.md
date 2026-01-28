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
scripts/hooks-loader.sh  ← Single entry point
       │
       ▼
plugins/*/hooks/hooks.json  ← Auto-detected
       │
       ▼
plugins/*/scripts/*.sh  ← Executed per plugin
```

## Installation

```bash
cd /path/to/claude-plugins
./scripts/install-hooks.sh
```

This installs the hooks loader in `~/.claude/settings.json`. All plugin hooks are automatically detected and loaded.

## Hook Types

| Hook | Trigger | Purpose |
|------|---------|---------|
| **SessionStart** | Session starts | Load context, inject CLAUDE.md, cleanup states |
| **UserPromptSubmit** | User sends message | Detect project type, inject APEX instruction |
| **PreToolUse** | Before Write/Edit/Bash | Block if skill not consulted, validate git/install commands |
| **PostToolUse** | After Write/Edit | Validate SOLID compliance, track changes |
| **SubagentStop** | Subagent completes | Track agent memory for context persistence |
| **Stop** | Claude finishes responding | Play completion sound notification |
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

## Hook Scripts

### ai-pilot

| Script | Purpose |
|--------|---------|
| `detect-and-inject-apex.sh` | Detects project type (Next.js, Laravel, Swift, React) and injects APEX methodology |
| `enforce-apex-phases.sh` | Reminds to follow APEX phases before coding |
| `check-solid-compliance.sh` | Validates file size < 100 lines, interface location |

### core-guards

| Script | Hook | Purpose |
|--------|------|---------|
| `git-guard.sh` | PreToolUse | Blocks destructive git commands (push --force, reset --hard), asks for confirmation on others |
| `install-guard.sh` | PreToolUse | Asks confirmation before package installations (npm, pip, brew, etc.) |
| `security-guard.sh` | PreToolUse | Validates dangerous bash commands via security rules |
| `pre-commit-guard.sh` | PreToolUse | Runs linters (ESLint, TypeScript, Prettier, Ruff) before git commit |
| `enforce-interfaces.sh` | PreToolUse | Blocks interfaces/types in component files - must be in `src/interfaces/` |
| `enforce-file-size.sh` | PostToolUse | Blocks files > 100 lines - must split into modules |
| `track-session-changes.sh` | PostToolUse | Tracks cumulative code changes for sniper trigger |
| `inject-claude-md.sh` | SessionStart | Injects CLAUDE.md content into session context |
| `load-dev-context.sh` | SessionStart | Loads git status, detects project type |
| `cleanup-session-states.sh` | SessionStart | Cleans up stale session state files |
| `read-claude-md.sh` | UserPromptSubmit | Reads CLAUDE.md + auto-triggers APEX for dev tasks |
| `track-agent-memory.sh` | SubagentStop | Tracks agent completion for context persistence |

#### Sound Notifications

| Sound | Hook | Matcher | Trigger |
|-------|------|---------|---------|
| `finish.mp3` | Stop | - | Claude finishes responding |
| `permission-need.mp3` | Notification | `permission_prompt` | Permission request (Bash, Write, Edit) |
| `need-human.mp3` | Notification | `idle_prompt` | Claude waiting for user (60+ sec) |
| `need-human.mp3` | Notification | `elicitation_dialog` | MCP tool input required |

### Expert Agents (react, nextjs, laravel, swift)

| Script | Purpose |
|--------|---------|
| `check-*-skill.sh` | **BLOCKS** Write/Edit if no skill was consulted first |
| `validate-*-solid.sh` | Validates framework-specific SOLID rules |

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
cat << 'EOF'
{
  "decision": "block",
  "reason": "Your message here"
}
EOF
exit 2
```

### To Warn (exit 0 with message)
```bash
echo "⚠️ Warning: Your message here"
exit 0
```

## Validation Rules by Framework

### React / Next.js
- Files < 100 lines (150 for page/layout)
- Interfaces in `src/interfaces/` or `modules/cores/interfaces/`
- JSDoc on exports
- `'use client'` directive when using hooks

### Laravel
- Files < 100 lines
- Interfaces in `app/Contracts/`
- PHPDoc on functions
- Controllers < 80 lines (extract to Services/Actions)

### Swift
- Files < 100 lines (150 for Views)
- Protocols in `Protocols/` directory
- `@MainActor` on ViewModels
- Sendable compliance for async types

### Tailwind CSS
- No deprecated `@tailwind` directives
- Limited `@apply` usage (< 10)
- Extract long className to utilities

### Design
- Accessibility: `aria-label`, `alt` attributes
- No colored left borders as indicators
- No purple gradients (AI slop)
- No emojis as icons

## Troubleshooting

### Hooks not loading
```bash
# Check if hooks-loader.sh is in settings.json
cat ~/.claude/settings.json | jq '.hooks'

# Re-run installation
./scripts/install-hooks.sh
```

### Hook not executing
```bash
# Test the hook manually
echo '{"tool_name":"Write","tool_input":{"file_path":"test.tsx"}}' | \
  bash plugins/react-expert/scripts/check-skill-loaded.sh
```

### Debug mode
Add to your hook script:
```bash
echo "[DEBUG] Hook triggered: $TOOL_NAME on $FILE_PATH" >&2
```
