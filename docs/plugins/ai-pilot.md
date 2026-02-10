# fuse-ai-pilot

APEX workflow orchestrator with sniper validation and research capabilities.

## Agents

| Agent | Description |
|-------|-------------|
| `sniper` | 6-phase validation, zero linter errors |
| `sniper-faster` | Quick validation, minimal output |
| `explore-codebase` | Architecture discovery |
| `research-expert` | Documentation with Context7/Exa |
| `websearch` | Quick web research |
| `seo-expert` | SEO/SEA/GEO optimization |

## Commands

| Command | Description |
|---------|-------------|
| `/apex` | Full APEX workflow |
| `/apex-quick` | Skip Analyze, direct Execute |
| `/research` | Technical research |
| `/exploration` | Codebase discovery |
| `/code-quality` | Linters, SOLID validation |
| `/elicitation` | Self-review techniques |

## Skills

- `apex` - Full APEX methodology
- `apex-quick` - Quick flow
- `research` - Research methodology
- `exploration` - Discovery techniques
- `code-quality` - Validation
- `elicitation` - Self-review (75 techniques)
- `skill-creator` - Create/restructure skills with SKILL.md + references/
- `agent-creator` - Create expert agents with frontmatter, hooks, skills

## Cache System (fusengine-cache)

3-level persistent cache to reduce redundant operations and save tokens (60-75% savings).

```
~/.claude/fusengine-cache/
├── explore/{project-hash}/    # Architecture snapshots
│   ├── metadata.json
│   └── snapshot.md
├── doc/{project-hash}/        # Documentation cache
│   ├── index.json
│   └── docs/{doc-hash}.md
└── lessons/{project-hash}/    # Sniper error patterns
    └── {timestamp}.json       # Per-run lesson files
```

### Cache Levels

| Cache | Source | TTL | Injection | Savings |
|-------|--------|-----|-----------|---------|
| **Explore** | `explore-codebase` agent | 4h | SubagentStart → explore-codebase | ~85% |
| **Documentation** | Context7/Exa queries | 7d | SubagentStart → research-expert | ~90% |
| **Lessons** | Sniper Edit corrections | 30d | SubagentStart → all agents | ~50-70% |

### Cache Scripts (17 scripts)

| Script | Hook | Role |
|--------|------|------|
| `explore-cache-check.sh` | SubagentStart | Inject cached architecture for explore-codebase |
| `doc-cache-inject.sh` | SubagentStart | Inject cached doc summaries for research-expert |
| `doc-cache-gate.sh` | PreToolUse | Block Context7/Exa if doc already cached |
| `cache-doc-result.sh` | PostToolUse | Save Context7/Exa results to doc cache |
| `cache-doc-from-transcript.sh` | SubagentStop | Extract docs from research-expert transcript |
| `lessons-cache-inject.sh` | SubagentStart | Inject known error patterns for all agents |
| `cache-sniper-lessons.sh` | SubagentStop | Extract Edit corrections from sniper transcript |
| `inject-subagent-context.sh` | SubagentStart | Inject general context to all subagents |
| `inject-apex-context.sh` | PreToolUse | Inject APEX context for Task tool |
| `enforce-apex-phases.sh` | PreToolUse | Enforce APEX phase ordering |
| `detect-and-inject-apex.sh` | UserPromptSubmit | Auto-detect APEX triggers |
| `check-solid-compliance.sh` | PostToolUse | SOLID validation on Write/Edit |
| `check-solid-from-transcript.sh` | SubagentStop | SOLID check from agent transcript |
| `track-doc-consultation.sh` | PostToolUse | Track documentation reads |
| `sync-task-tracking.sh` | PostToolUse | Sync TaskCreate/TaskUpdate |
| `save-doc.sh` | PostToolUse | Save documentation to cache |
| `init-apex-tracking.sh` | - | Initialize APEX tracking state |

### Lessons Format (per-timestamp)

Each sniper run creates a `{timestamp}.json` with Edit-extracted corrections:

```json
{
  "project": "/path/to/project",
  "timestamp": "2026-02-09T01:14:44",
  "errors": [
    {"error_type":"missing_directive","pattern":"Component using hooks without 'use client'","fix":"Fix missing_directive in Dashboard.tsx","count":1,"files":["/path/Dashboard.tsx"],"code":{"line":["'use client'","","import React from 'react'"]}},
    {"error_type":"missing_display_name","pattern":"Code correction in StatsView.tsx","fix":"Fix missing_display_name in StatsView.tsx","count":1,"files":["/path/StatsView.tsx"],"code":{"line":["StatsView.displayName = 'StatsView'"]}}
  ]
}
```

## Hooks (15 entries)

| Hook Type | Count | Scripts |
|-----------|-------|---------|
| UserPromptSubmit | 1 | detect-and-inject-apex |
| SubagentStart | 4 | inject-subagent-context, explore-cache-check, doc-cache-inject, lessons-cache-inject |
| PreToolUse | 3 | enforce-apex-phases, inject-apex-context, doc-cache-gate |
| SubagentStop | 3 | cache-sniper-lessons, cache-doc-from-transcript, check-solid-from-transcript |
| PostToolUse | 4 | check-solid-compliance, track-doc-consultation, cache-doc-result, sync-task-tracking |

## MCP Servers

- Context7 (documentation)
- Exa (web search, code context)
- Sequential Thinking (complex reasoning)
