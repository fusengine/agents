#!/bin/bash
# track-solid-reads.sh - PostToolUse hook (v4.0)
# APPENDS to JSON array: ~/.claude/logs/00-apex/solid-reads.json
# FORMAT: {"reads": [{...}, {...}]}

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')

[[ "$TOOL_NAME" != "Read" ]] && exit 0
[[ -z "$FILE_PATH" ]] && exit 0

# Only track SOLID files (skills/solid-*/SKILL.md or skills/solid-*/references/)
[[ ! "$FILE_PATH" =~ solid-[^/]+/(references/|SKILL\.md) ]] && exit 0

# Detect framework
FRAMEWORK=""
[[ "$FILE_PATH" =~ solid-nextjs ]] && FRAMEWORK="nextjs"
[[ "$FILE_PATH" =~ solid-react ]] && FRAMEWORK="react"
[[ "$FILE_PATH" =~ solid-php ]] && FRAMEWORK="php"
[[ "$FILE_PATH" =~ solid-swift ]] && FRAMEWORK="swift"
[[ -z "$FRAMEWORK" ]] && exit 0

# Log file
LOG_DIR="$HOME/.claude/logs/00-apex"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/solid-reads.json"
LOCK_DIR="$LOG_DIR/.reads.lock"
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%SZ)

# Get project from state file if exists
STATE_FILE="$LOG_DIR/$(date +%Y-%m-%d)-state.json"
PROJECT=""
if [[ -f "$STATE_FILE" ]]; then
  PROJECT=$(jq -r '.target.project // empty' "$STATE_FILE" 2>/dev/null)
fi
[[ -z "$PROJECT" ]] && PROJECT="unknown"

# Lock
acquire_lock() {
  local max_wait=5 waited=0
  while ! mkdir "$LOCK_DIR" 2>/dev/null; do
    sleep 0.1
    waited=$((waited + 1))
    [[ $waited -gt $((max_wait * 10)) ]] && return 1
  done
  trap 'rmdir "$LOCK_DIR" 2>/dev/null' EXIT
  return 0
}

acquire_lock || exit 0

# Load or create JSON
DEFAULT='{"reads":[]}'
if [[ -f "$LOG_FILE" ]] && jq -e . "$LOG_FILE" >/dev/null 2>&1; then
  DATA=$(cat "$LOG_FILE")
else
  DATA="$DEFAULT"
fi

# Append new entry
DATA=$(echo "$DATA" | jq \
  --arg ts "$TIMESTAMP" \
  --arg fw "$FRAMEWORK" \
  --arg sess "$SESSION_ID" \
  --arg proj "$PROJECT" \
  --arg file "$FILE_PATH" \
  '.reads += [{"timestamp": $ts, "framework": $fw, "session": $sess, "project": $proj, "file": $file}]')

echo "$DATA" > "$LOG_FILE"
exit 0
