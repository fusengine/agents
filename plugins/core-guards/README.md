# Core Guards

Security guards and SOLID enforcement hooks for Claude Code.

## Features

### PreToolUse Guards

| Guard | Description |
|-------|-------------|
| **git-guard** | Blocks destructive git commands (push --force, reset --hard). Asks confirmation for others. |
| **install-guard** | Asks confirmation before package installations (npm, pip, brew, etc.) |
| **security-guard** | Validates dangerous bash commands via security rules |
| **pre-commit-guard** | Runs linters (ESLint, TypeScript, Prettier, Ruff) before git commit |
| **enforce-interfaces** | Blocks interfaces/types in component files - must be in `src/interfaces/` |

### PostToolUse Guards

| Guard | Description |
|-------|-------------|
| **enforce-file-size** | Blocks files > 100 lines - must split into modules |
| **track-session-changes** | Tracks cumulative code changes for sniper trigger |

### SessionStart

| Script | Description |
|--------|-------------|
| **inject-claude-md** | Injects CLAUDE.md content into session context |
| **load-dev-context** | Loads git status, detects project type |
| **cleanup-session-states** | Cleans up stale session state files from /tmp |

### UserPromptSubmit

| Script | Description |
|--------|-------------|
| **read-claude-md** | Reads CLAUDE.md + auto-triggers APEX for dev tasks |

### SubagentStop

| Script | Description |
|--------|-------------|
| **track-agent-memory** | Tracks agent completion for context persistence |

### Stop

| Event | Sound | Description |
|-------|-------|-------------|
| **Task complete** | `finish.mp3` | Plays when Claude finishes responding |

### Notification

| Matcher | Sound | Description |
|---------|-------|-------------|
| **permission_prompt** | `permission-need.mp3` | Permission request (Bash, Write, Edit) |
| **idle_prompt** | `need-human.mp3` | Claude waiting for user input (60+ sec) |
| **elicitation_dialog** | `need-human.mp3` | MCP tool input required |

### Statusline

Modular SOLID statusline for Claude Code terminal.

| Segment | Description |
|---------|-------------|
| **claude** | Claude version |
| **directory** | Path + git (branch, dirty, staged/unstaged) |
| **model** | Model name + tokens |
| **context** | Context usage progress bar |
| **cost** | Session cost |
| **limits** | 5h/7d limits with reset time |
| **dailySpend** | Daily spending |
| **node** | Node.js version |
| **edits** | Edit counter |

## Installation

### 1. Install Plugin

```bash
/plugin install core-guards
```

### 2. Install Hooks + Statusline

```bash
~/.claude/plugins/marketplaces/fusengine-plugins/setup.sh
```

This script will:
- Install hooks loader in `~/.claude/settings.json`
- Install statusline bun dependencies
- Configure `statusLine` in `~/.claude/settings.json`
- Create a backup of your settings

### 3. Configure Statusline Options

Edit `statusline/config.json` to enable/disable segments:

```json
{
  "claude": { "enabled": true },
  "directory": { "enabled": true, "showGit": true },
  "model": { "enabled": true, "showTokens": true },
  "context": { "enabled": true, "progressBar": { "style": "blocks" } },
  "cost": { "enabled": true },
  "limits": { "enabled": true, "show5h": true, "show7d": true }
}
```

Or use the interactive configurator:

```bash
bun run config        # Web configurator
bun run config:term   # Terminal configurator
```

## Configuration

The guards are automatically loaded via the hooks system. No additional configuration required.

### Ralph Mode

Git and install guards support **Ralph Mode** for autonomous development:
- Set `RALPH_MODE=1` environment variable
- Or create `.claude/ralph/prd.json` in project
- Or work on a `feature/*` branch

In Ralph mode, safe git commands and project-level installs are auto-approved.

## License

MIT
