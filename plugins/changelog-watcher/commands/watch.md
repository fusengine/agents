---
description: Check for Claude Code updates, detect breaking changes, analyze plugin compatibility, and optionally gather community pulse via Exa.
argument-hint: "[--pulse] [--since <version>]"
---

# Watch - Claude Code Update Tracker

Monitor Claude Code releases and verify plugin ecosystem compatibility.

## Usage

- `/watch` - Technical changelog scan + compatibility check
- `/watch --pulse` - Full scan + community sentiment analysis
- `/watch --since 1.5.0` - Check changes since specific version

## Modes

### Default Mode (Technical)

1. **Fetch** latest changelog from code.claude.com
2. **Compare** against known API surface (api-surface.md)
3. **Scan** plugin files for impacted APIs
4. **Report** with [BREAKING], [DEPRECATED], [NEW] tags

### Pulse Mode (--pulse)

Everything in default mode, plus:
1. **Search** community feedback via Exa web_search
2. **Analyze** sentiment via Exa deep_researcher
3. **Gather** real-world usage patterns
4. **Compare** with competitor tools

## Data Sources

| Source | Method | Mode |
|--------|--------|------|
| Changelog | WebFetch code.claude.com | Default |
| Docs index | WebFetch llms.txt | Default |
| Hook/Plugin API | Grep local files | Default |
| Community blogs | Exa web_search | --pulse |
| Deep analysis | Exa deep_researcher | --pulse |
| Code patterns | Exa get_code_context | --pulse |

## Report Format

```
# Claude Code Update Report
Date: {date}
Latest Version: {version}
New Since Last Check: {count}

## [BREAKING] Changes
- {description} → Impact: {affected_files}

## [DEPRECATED] APIs
- {api} → Migration: {alternative}

## [NEW] Features
- {feature} → Opportunity: {how_to_leverage}

## [COMMUNITY] Pulse (--pulse only)
- Sentiment: {positive/neutral/negative}
- Key Topics: {list}
- Notable Feedback: {quotes_with_sources}
```

## Arguments

- `$ARGUMENTS` specifies mode and version filter
