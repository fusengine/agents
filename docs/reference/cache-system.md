# Cache System (fusengine-cache)

3-level persistent cache system that eliminates redundant operations across sessions.

## Overview

```
~/.claude/fusengine-cache/
├── explore/{project-hash}/    # Architecture snapshots
├── doc/{project-hash}/        # Documentation cache
└── lessons/{project-hash}/    # Sniper error patterns
```

Each project gets a unique hash (first 16 chars of SHA-256 of the project path).

## Token Savings

| Cache Level | Before | After | Savings |
|-------------|--------|-------|---------|
| Explore | ~15K tokens/scan | ~2K injected | ~85% |
| Documentation | ~10K tokens/query | ~1K summary | ~90% |
| Lessons | Repeated errors | Pre-warned | ~50-70% |
| **Compound** | - | - | **60-75%** |

## Level 1: Explore Cache

**Purpose**: Cache architecture snapshots from `explore-codebase` agent.

| Property | Value |
|----------|-------|
| TTL | 4 hours |
| Location | `~/.claude/fusengine-cache/explore/{hash}/` |
| Capture | SubagentStart (explore-cache-check.sh) |
| Format | `metadata.json` + `snapshot.md` |

**Flow**:
1. `explore-codebase` starts → SubagentStart fires `explore-cache-check.sh`
2. If cache hit (< 4h old) → inject snapshot via `additionalContext`, agent skips scan
3. If cache miss → agent runs normally, saves result for next time

## Level 2: Documentation Cache

**Purpose**: Cache Context7/Exa documentation queries for `research-expert`.

| Property | Value |
|----------|-------|
| TTL | 7 days |
| Location | `~/.claude/fusengine-cache/doc/{hash}/` |
| Capture | PostToolUse (`cache-doc-result.sh`) + SubagentStop (`cache-doc-from-transcript.sh`) |
| Gate | PreToolUse (`doc-cache-gate.sh`) blocks duplicate queries |
| Inject | SubagentStart (`doc-cache-inject.sh`) |
| Format | `index.json` manifest + `docs/{doc-hash}.md` files |
| Limits | Max 15 docs, max 20KB/doc |

**Flow**:
1. `research-expert` starts → `doc-cache-inject.sh` injects cached doc summaries
2. Agent queries Context7 → `doc-cache-gate.sh` blocks if doc already cached
3. New docs saved by `cache-doc-result.sh` (PostToolUse) and `cache-doc-from-transcript.sh` (SubagentStop)

**index.json**:
```json
{
  "project": "/path/to/project",
  "docs": [
    {
      "hash": "a1b2c3d4",
      "library": "/vercel/next.js",
      "topic": "app router server components",
      "timestamp": "2026-02-08T22:14:13",
      "size_kb": 8
    }
  ]
}
```

## Level 3: Lessons Cache

**Purpose**: Capture sniper Edit corrections as reusable error patterns.

| Property | Value |
|----------|-------|
| TTL | 30 days |
| Location | `~/.claude/fusengine-cache/lessons/{hash}/` |
| Capture | SubagentStop (`cache-sniper-lessons.sh`) |
| Inject | SubagentStart (`lessons-cache-inject.sh`) → ALL agents |
| Format | Per-timestamp JSON files (`{timestamp}.json`) |
| Limits | Auto-cleanup files > 30 days, top 10 injected |

**Flow**:
1. Sniper finishes → SubagentStop fires `cache-sniper-lessons.sh`
2. Script reads `agent_transcript_path` (JSONL)
3. Extracts all Edit tool_use entries (file, old_string, new_string)
4. Categorizes errors by code diff analysis (missing_directive, type_any, etc.)
5. Saves as `{timestamp}.json` with one error per line
6. Next agent start → `lessons-cache-inject.sh` aggregates all files, injects top 10

**Lesson file format** (`2026-02-09T01-14-44.json`):
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

**Error categories** (auto-detected from code diff):

| Category | Detection Pattern |
|----------|-------------------|
| `type_any` | old_string contains `any` |
| `missing_directive` | new_string contains `use client` |
| `missing_display_name` | new_string contains `displayName` |
| `missing_a11y` | new_string contains `onKeyDown\|tabIndex\|role=` |
| `missing_error_handling` | new_string contains `try\|catch` |
| `null_safety` | new_string contains `if.*null\|??` |
| `code_fix` | Default fallback |

## Injection Format

When agents start, `lessons-cache-inject.sh` outputs:

```
## KNOWN PROJECT ISSUES (from previous sniper validations)
These errors have been found and fixed before. AVOID them:
1. [5x] Missing 'use client' on components using hooks → Add directive
     Code: 'use client' | import React from 'react'
2. [3x] Import from '../' instead of '@/modules/' → Use alias
3. [2x] displayName missing → Add Component.displayName

INSTRUCTION: Check your code against these known issues BEFORE submitting.
```

## Scripts Reference

| Script | Hook Type | Trigger |
|--------|-----------|---------|
| `explore-cache-check.sh` | SubagentStart | explore-codebase agent |
| `doc-cache-inject.sh` | SubagentStart | research-expert agent |
| `doc-cache-gate.sh` | PreToolUse | Context7/Exa tool calls |
| `cache-doc-result.sh` | PostToolUse | Context7/Exa tool results |
| `cache-doc-from-transcript.sh` | SubagentStop | research-expert agent |
| `lessons-cache-inject.sh` | SubagentStart | All agents |
| `cache-sniper-lessons.sh` | SubagentStop | sniper agent |
| `save-doc.sh` | PostToolUse | Documentation saves |

## Troubleshooting

### Check cache contents
```bash
# List cached lessons for current project
ls ~/.claude/fusengine-cache/lessons/

# View latest lesson file
cat ~/.claude/fusengine-cache/lessons/*/$(ls -t ~/.claude/fusengine-cache/lessons/*/ | head -1)

# Check doc cache index
cat ~/.claude/fusengine-cache/doc/*/index.json | jq .
```

### Clear cache
```bash
# Clear all caches
rm -rf ~/.claude/fusengine-cache/

# Clear only lessons
rm -rf ~/.claude/fusengine-cache/lessons/

# Clear only doc cache
rm -rf ~/.claude/fusengine-cache/doc/
```
