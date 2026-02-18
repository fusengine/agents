# fuse-ai-pilot

APEX workflow orchestrator with sniper validation and research capabilities.

## Agents

| Agent | Description |
|-------|-------------|
| `sniper` | 7-phase validation (DRY detection), zero linter errors |
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
| `/code-quality` | Linters, SOLID validation, DRY detection |
| `/elicitation` | Self-review techniques |

## Skills

- `apex` - Full APEX methodology
- `apex-quick` - Quick flow
- `research` - Research methodology
- `exploration` - Discovery techniques
- `code-quality` - Validation with DRY detection (jscpd)
- `elicitation` - Self-review (75 techniques)
- `skill-creator` - Create/restructure skills with SKILL.md + references/
- `agent-creator` - Create expert agents with frontmatter, hooks, skills
- `react-effects-audit` - Audit React useEffect anti-patterns (9 rules from "You Might Not Need an Effect")

## Cache System (fusengine-cache)

4-level persistent cache to reduce redundant operations and save tokens (60-75% savings).

```
~/.claude/fusengine-cache/
├── explore/{project-hash}/    # Architecture snapshots
│   ├── metadata.json
│   └── snapshot.md
├── doc/{project-hash}/        # Documentation cache
│   ├── index.json
│   └── docs/{doc-hash}.md
├── lessons/{project-hash}/    # Sniper error patterns
│   └── {timestamp}.json
├── tests/{project-hash}/      # Test results cache
│   └── results.json
└── analytics/
    └── sessions.jsonl         # Cache hit/miss tracking
```

### Cache Levels

| Cache | Source | TTL | Injection | Savings |
|-------|--------|-----|-----------|---------|
| **Explore** | `explore-codebase` agent | 24h | SubagentStart → explore-codebase | ~85% |
| **Documentation** | Context7/Exa synthesis | 7d | SubagentStart → research-expert | ~90% |
| **Lessons** | Sniper Edit corrections | 30d | SubagentStart → all agents | ~50-70% |
| **Tests** | Sniper test results | 48h | SubagentStart → sniper | ~60% |

### Cache Scripts (TypeScript/Bun)

All scripts are in `scripts/` with shared `lib/` modules.

| Script | Hook | Role |
|--------|------|------|
| `explore-cache-check.ts` | SubagentStart | Inject cached architecture for explore-codebase |
| `doc-cache-inject.ts` | SubagentStart | Inject cached doc summaries for research-expert |
| `cache-doc-from-transcript.ts` | SubagentStop | Extract synthesis from research-expert transcript |
| `lessons-cache-inject.ts` | SubagentStart | Inject known error patterns for all agents |
| `cache-sniper-lessons.ts` | SubagentStop | Extract Edit corrections from sniper transcript |
| `promote-global-lessons.ts` | Background | Promote lessons seen 3+ times to _global/ |
| `test-cache-inject.ts` | SubagentStart | Inject previous test results for sniper |
| `cache-test-results.ts` | SubagentStop | Save sniper test results with file hashes |
| `cache-analytics-save.ts` | SessionEnd | Save cache hit/miss analytics |
| `inject-subagent-context.ts` | SubagentStart | Inject general context to all subagents |
| `inject-apex-context.sh` | PreToolUse | Inject APEX context for Task tool |
| `enforce-apex-phases.ts` | PreToolUse | Enforce APEX phase ordering |
| `detect-and-inject-apex.ts` | UserPromptSubmit | Auto-detect APEX triggers |
| `check-solid-compliance.sh` | PostToolUse | SOLID validation on Write/Edit |
| `check-solid-from-transcript.sh` | SubagentStop | SOLID check from agent transcript |
| `track-doc-consultation.sh` | PostToolUse | Track documentation reads |
| `sync-task-tracking.ts` | PostToolUse | Sync TaskCreate/TaskUpdate |

### Lessons Format (per-timestamp)

Each sniper run creates a `{timestamp}.json` with Edit-extracted corrections:

```json
{
  "project": "/path/to/project",
  "timestamp": "2026-02-09T01:14:44",
  "errors": [
    {"error_type":"missing_directive","pattern":"Component using hooks without 'use client'","fix":"Fix missing_directive in Dashboard.tsx","count":1,"files":["/path/Dashboard.tsx"],"code":{"line":["'use client'","","import React from 'react'"]}}
  ]
}
```

## Hooks (14 entries)

| Hook Type | Count | Scripts |
|-----------|-------|---------|
| UserPromptSubmit | 1 | detect-and-inject-apex |
| SubagentStart | 5 | inject-subagent-context, explore-cache-check, doc-cache-inject, lessons-cache-inject, test-cache-inject |
| PreToolUse | 2 | enforce-apex-phases, inject-apex-context |
| SubagentStop | 4 | cache-sniper-lessons, cache-test-results, cache-doc-from-transcript, check-solid-from-transcript |
| PostToolUse | 3 | check-solid-compliance, track-doc-consultation, sync-task-tracking |
| SessionEnd | 1 | cache-analytics-save |

## MCP Servers

- Context7 (documentation)
- Exa (web search, code context)
- Sequential Thinking (complex reasoning)
