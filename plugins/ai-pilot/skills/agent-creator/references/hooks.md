---
name: hooks
description: Pre/Post tool validation hooks for agents
when-to-use: Configuring automatic validation on tool usage
keywords: hooks, pretooluse, posttooluse, validation, scripts
priority: medium
related: frontmatter.md, architecture.md
---

# Agent Hooks

## Overview

Hooks run scripts before or after tool execution to enforce rules.

---

## Hook Types

| Type | When | Purpose |
|------|------|---------|
| `PreToolUse` | Before tool runs | Validate, block if invalid |
| `PostToolUse` | After tool runs | Track, analyze, notify |

---

## Frontmatter Configuration

```yaml
hooks:
  PreToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate-solid.sh"
  PostToolUse:
    - matcher: "Read"
      hooks:
        - type: command
          command: "bash ${CLAUDE_PLUGIN_ROOT}/scripts/track-reads.sh"
```

---

## Matcher Patterns

| Pattern | Matches |
|---------|---------|
| `Write` | Write tool only |
| `Write\|Edit` | Write OR Edit |
| `Read` | Read tool only |
| `Bash` | Bash tool only |

---

## Common Hooks

### SOLID Validation (PreToolUse)

```yaml
PreToolUse:
  - matcher: "Write|Edit"
    hooks:
      - type: command
        command: "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate-solid.sh"
```

**Purpose**: Check file size, interface location before writing.

### Skill Tracking (PostToolUse)

```yaml
PostToolUse:
  - matcher: "Read"
    hooks:
      - type: command
        command: "bash ${CLAUDE_PLUGIN_ROOT}/scripts/track-skill-read.sh"
```

**Purpose**: Track which skills are being consulted.

---

## Environment Variables

| Variable | Value |
|----------|-------|
| `$CLAUDE_PLUGIN_ROOT` | Plugin directory path |
| `$TOOL_NAME` | Name of tool being used |
| `$FILE_PATH` | Target file path (if applicable) |

---

## Script Requirements

| Requirement | Description |
|-------------|-------------|
| Executable | `chmod +x scripts/*.sh` |
| Exit codes | 0 = success, non-zero = block |
| Location | `plugins/<name>/scripts/` |

---

## Best Practices

| DO | DON'T |
|----|-------|
| Use `$CLAUDE_PLUGIN_ROOT` | Hard-code paths |
| Keep scripts fast | Long-running validations |
| Exit 0 on success | Swallow errors silently |
| Log issues clearly | Cryptic error messages |

→ See [templates/hook-scripts.md](templates/hook-scripts.md) for script examples
