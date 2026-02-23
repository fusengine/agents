#!/bin/bash
# save-apex-state.sh - Save APEX state before context compression
# Hook: PreCompact - Triggered before Claude compresses conversation context

PROJECT_ROOT="${PWD}"
APEX_DIR="${PROJECT_ROOT}/.claude/apex"
STATE_FILE="${APEX_DIR}/task.json"
BACKUP_DIR="${APEX_DIR}/backups"

# Only run if APEX state exists
if [ ! -f "$STATE_FILE" ]; then
  exit 0
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Save timestamped backup
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
cp "$STATE_FILE" "${BACKUP_DIR}/task-${TIMESTAMP}.json"

# Keep only last 5 backups
ls -t "${BACKUP_DIR}"/task-*.json 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null

echo '{"additionalContext": "APEX state saved before compaction. Previous task state preserved in .claude/apex/backups/"}'
exit 0
