---
description: Memory optimization - removes duplicates, consolidates knowledge, and cleans memory banks for better performance.
---

# Cleanup Context

Executes the automatic cleanup script for Claude Code context.

## Script Automatique

Run complete cleanup:

```bash
~/.claude/scripts/cleanup-context.sh
```

## What Gets Cleaned (PERMANENT DELETION):

1. **file-history/** - Files >7 days deleted
2. **history.jsonl** - Deleted and reset
3. **hook-debug.log** - Deleted and reset
4. **security.log** - Deleted and reset
5. **session-env/** - Sessions >30 days deleted
6. **projects/** - Files >60 days deleted
7. **statsig/** - Completely emptied
8. **todos/** - Files >30 days deleted

⚠️ **No backup** - Permanent deletion

## Cleanup Report

The script displays:
- BEFORE state (number of files, lines, size)
- Actions performed
- AFTER state
- Summary of deletions/archives

## Example output:

```
🧹 Claude Code context cleanup

📊 BEFORE cleanup state:
  File history: 1234 files
  History.jsonl: 5678 lines
  Sessions: 89 files
  Total size: 245MB

🗑️ Cleaning file-history (>7 days)...
  ✓ 856 files deleted

🗑️ Deleting history.jsonl...
  ✓ Deleted and reset

✅ Cleanup complete!

📈 Summary:
  File history: 856 files deleted
  Sessions deleted: 34
  Logs deleted: hook-debug.log, security.log, history.jsonl
```

**Example Usage**:
- `/cleanup-context` → Run complete cleanup
