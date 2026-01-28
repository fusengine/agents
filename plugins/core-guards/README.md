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

## Installation

```bash
/plugin install core-guards
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
