# Cache System (fusengine-cache)

4-level persistent cache system that eliminates redundant operations across sessions.

## Overview

```
~/.claude/fusengine-cache/
├── explore/{project-hash}/    # Architecture snapshots
├── doc/{project-hash}/        # Documentation cache
├── lessons/{project-hash}/    # Sniper error patterns
│   └── _global/{stack}.json   # Cross-project promoted lessons
├── tests/{project-hash}/      # Test results cache
└── analytics/
    └── sessions.jsonl         # Cache hit/miss tracking
```

Each project gets a unique hash (first 16 chars of SHA-256 of the project path).

## Token Savings

| Cache Level | Before | After | Savings |
|-------------|--------|-------|---------|
| Explore | ~15K tokens/scan | ~2K injected | ~85% |
| Documentation | ~10K tokens/query | ~1K summary | ~90% |
| Lessons | Repeated errors | Pre-warned | ~50-70% |
| Tests | Re-run all tests | Skip unchanged | ~60% |
| **Compound** | - | - | **60-75%** |

## Level 1: Explore Cache

**Purpose**: Cache architecture snapshots from `explore-codebase` agent.

| Property | Value |
|----------|-------|
| TTL | 24 hours |
| Location | `~/.claude/fusengine-cache/explore/{hash}/` |
| Capture | SubagentStart (`explore-cache-check.ts`) |
| Format | `metadata.json` + `snapshot.md` |

**Flow**:
1. `explore-codebase` starts → SubagentStart fires `explore-cache-check.ts`
2. If cache hit (< 24h old) → inject snapshot via `additionalContext`, agent skips scan
3. If cache miss → agent runs normally, saves result for next time

## Level 2: Documentation Cache

**Purpose**: Cache Context7/Exa documentation synthesis for `research-expert`.

| Property | Value |
|----------|-------|
| TTL | 7 days |
| Location | `~/.claude/fusengine-cache/doc/{hash}/` |
| Capture | SubagentStop (`cache-doc-from-transcript.ts`) |
| Inject | SubagentStart (`doc-cache-inject.ts`) |
| Format | `index.json` manifest + `docs/{doc-hash}.md` synthesis files |
| Limits | Max 15 docs, max 20KB/doc |

**Flow**:
1. `research-expert` starts → `doc-cache-inject.ts` injects cached doc summaries (soft guidance)
2. Agent queries Context7/Exa freely (no blocking gate)
3. When agent completes → `cache-doc-from-transcript.ts` extracts full synthesis from transcript

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
| Capture | SubagentStop (`cache-sniper-lessons.ts`) |
| Inject | SubagentStart (`lessons-cache-inject.ts`) → ALL agents |
| Promotion | `promote-global-lessons.ts` → `_global/{stack}.json` (3+ occurrences) |
| Format | Per-timestamp JSON files (`{timestamp}.json`) |
| Limits | Auto-cleanup files > 30 days, top 10 injected |

**Flow**:
1. Sniper finishes → SubagentStop fires `cache-sniper-lessons.ts`
2. Script reads `agent_transcript_path` (JSONL)
3. Extracts all Edit tool_use entries (file, old_string, new_string)
4. Categorizes errors by code diff analysis (missing_directive, type_any, etc.)
5. Saves as `{timestamp}.json` with one error per line
6. Runs `promote-global-lessons.ts` in background (promotes errors seen 3+ times to `_global/`)
7. Next agent start → `lessons-cache-inject.ts` aggregates local + global lessons, injects top 10

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

## Level 4: Tests Cache

**Purpose**: Cache test results from sniper validation runs.

| Property | Value |
|----------|-------|
| TTL | 48 hours |
| Location | `~/.claude/fusengine-cache/tests/{hash}/` |
| Capture | SubagentStop (`cache-test-results.ts`) |
| Inject | SubagentStart (`test-cache-inject.ts`) → sniper |
| Format | `results.json` with file checksums |

**Flow**:
1. Sniper completes → `cache-test-results.ts` saves test results with file hashes
2. Next sniper start → `test-cache-inject.ts` injects previous results
3. Sniper can skip re-testing unchanged files

## Analytics

**Purpose**: Track cache hit/miss rates across sessions.

| Property | Value |
|----------|-------|
| Location | `~/.claude/fusengine-cache/analytics/` |
| Capture | SessionEnd (`cache-analytics-save.ts`) |
| Format | `sessions.jsonl` (one event per line) |

**Event format**:
```json
{"ts":"2026-02-10T15:42:36","session":"1770738156","type":"explore","action":"hit","project_hash":"caad47f308f6a24d"}
```

## Injection Format

When agents start, `lessons-cache-inject.ts` outputs:

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

All scripts are TypeScript (Bun runtime) with shared `lib/` modules.

| Script | Hook Type | Trigger |
|--------|-----------|---------|
| `explore-cache-check.ts` | SubagentStart | explore-codebase agent |
| `doc-cache-inject.ts` | SubagentStart | research-expert agent |
| `cache-doc-from-transcript.ts` | SubagentStop | research-expert agent |
| `lessons-cache-inject.ts` | SubagentStart | All agents |
| `cache-sniper-lessons.ts` | SubagentStop | sniper agent |
| `promote-global-lessons.ts` | Background | After sniper lessons capture |
| `test-cache-inject.ts` | SubagentStart | sniper agent |
| `cache-test-results.ts` | SubagentStop | sniper agent |
| `cache-analytics-save.ts` | SessionEnd | All sessions |

## Shared Library (`lib/`)

```
plugins/ai-pilot/scripts/lib/
├── core.ts                        # readStdin, outputHookResponse, env helpers
├── json.ts                        # safeJsonParse
├── analytics.ts                   # logCacheEvent
├── cache/
│   ├── project-detect.ts          # getProjectHash, computeProjectHash
│   ├── lesson-helpers.ts          # categorizeError, formatLessonEntry
│   ├── lesson-aggregator.ts       # dedupLessons, aggregateLocal, loadGlobal, merge
│   └── source-collector.ts        # collectSources from transcript
├── apex/
│   ├── detection.ts               # detectApexTrigger
│   ├── state.ts                   # readApexState, writeApexState
│   ├── enforce-helpers.ts         # checkPhaseAllowed
│   └── task-helpers.ts            # syncTaskState
└── interfaces/
    ├── hook.interface.ts           # HookInput, HookResponse types
    ├── cache.interface.ts          # CacheIndex, LessonEntry types
    └── apex.interface.ts           # ApexState, ApexPhase types
```

## Troubleshooting

### Check cache contents
```bash
# List cached lessons for current project
ls ~/.claude/fusengine-cache/lessons/

# View latest lesson file
cat ~/.claude/fusengine-cache/lessons/*/$(ls -t ~/.claude/fusengine-cache/lessons/*/ | head -1)

# Check doc cache index
cat ~/.claude/fusengine-cache/doc/*/index.json | jq .

# View analytics
cat ~/.claude/fusengine-cache/analytics/sessions.jsonl
```

### Clear cache
```bash
# Clear all caches
rm -rf ~/.claude/fusengine-cache/

# Clear only lessons
rm -rf ~/.claude/fusengine-cache/lessons/

# Clear only doc cache
rm -rf ~/.claude/fusengine-cache/doc/

# Clear only tests cache
rm -rf ~/.claude/fusengine-cache/tests/
```
