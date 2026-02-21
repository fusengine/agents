# fuse-changelog

Claude Code update watcher and plugin compatibility analyzer.

## Overview

Monitors Claude Code releases, detects breaking changes affecting the plugin ecosystem, and gathers community feedback via Exa.

## Agent

| Agent | Description |
|-------|-------------|
| `changelog-watcher` | 4-phase update tracking: FETCH, DIFF, IMPACT, REPORT |

## Skills (3)

| Skill | Description |
|-------|-------------|
| `changelog-scan` | Fetch and parse official Claude Code changelog |
| `breaking-changes` | Detect API surface changes affecting plugins |
| `community-pulse` | Gather community sentiment via Exa search |

## Commands (1)

| Command | Description |
|---------|-------------|
| `/watch` | Check for Claude Code updates and compatibility |

## Modes

- `/watch` - Technical: changelog + API diff + compatibility check
- `/watch --pulse` - Full: adds community sentiment + real-world usage
- `/watch --since 1.5.0` - Filter changes since specific version

## Workflow

```
Phase 1: FETCH   → WebFetch changelog, docs index, Exa search
Phase 2: DIFF    → Compare against api-surface.md
Phase 3: IMPACT  → Grep plugins for affected APIs
Phase 4: REPORT  → [BREAKING], [DEPRECATED], [NEW], [COMMUNITY]
```

## Data Sources

| Source | Method | Mode |
|--------|--------|------|
| Official changelog | WebFetch | Default |
| Docs index (llms.txt) | WebFetch | Default |
| Local plugin files | Grep | Default |
| Community blogs/forums | Exa web_search | --pulse |
| Deep analysis | Exa deep_researcher | --pulse |

## MCP Servers

- **Exa** - Web search, deep research, code context
- **Sequential Thinking** - Structured analysis

## Hooks

- **PostToolUse** (exa/WebFetch/WebSearch) - Track research queries
