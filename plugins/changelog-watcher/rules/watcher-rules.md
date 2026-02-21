---
description: Rules for changelog watching and compatibility analysis
alwaysApply: true
---

# Watcher Rules

## Core Principles

1. **Read-only** - NEVER modify plugin files during watch
2. **Source-backed** - Every finding must include a URL
3. **Versioned state** - Track what was last checked
4. **Actionable output** - Clear next steps per finding

## Severity Classification

| Tag | Meaning | Action Required |
|-----|---------|-----------------|
| `[BREAKING]` | API changed, plugins may break | Immediate fix |
| `[DEPRECATED]` | API still works but will be removed | Plan migration |
| `[NEW]` | New capability available | Evaluate adoption |
| `[INFO]` | General update, no impact | Note for reference |
| `[COMMUNITY]` | Community feedback/pattern | Consider for roadmap |

## API Surface Tracking

The `api-surface.md` file is the single source of truth for:
- Hook types we use (PreToolUse, PostToolUse, etc.)
- Frontmatter fields in agent .md files
- Plugin manifest schema (plugin.json)
- Skill SKILL.md format and frontmatter
- MCP server configuration format
- CLI flags used in scripts

After each watch, update api-surface.md if new APIs discovered.

## Exa Query Best Practices

- Always include year in queries (2025, 2026)
- Use quotes around "Claude Code" for exact match
- Combine with specific terms (hooks, plugins, breaking)
- Limit deep_researcher to --pulse mode (expensive)

## Report Requirements

Every report MUST include:
1. Current Claude Code version detected
2. Number of new versions since last check
3. Breaking changes with affected file list
4. New features with adoption recommendation
5. Source URLs for every finding

## State Management

- State stored in `~/.claude/logs/00-changelog/`
- One state file per day: `{date}-state.json`
- Research log: `{date}-research.json`
- Never delete previous state files (history)
