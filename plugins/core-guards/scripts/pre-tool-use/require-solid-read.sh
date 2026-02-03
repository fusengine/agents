#!/bin/bash
# require-solid-read.sh - PreToolUse hook (v4.0)
# READS: ~/.claude/logs/00-apex/solid-reads.json
# CHECKS: last entry for framework+session < 2 minutes

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')

[[ -z "$FILE_PATH" ]] && exit 0

# Only check code files
[[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte)$ ]] && exit 0

# Detect framework
get_framework() {
  local ext="${1##*.}"
  case "$ext" in
    ts|tsx|js|jsx|vue|svelte)
      if [[ -f "$(dirname "$1")/next.config.js" ]] || \
         [[ -f "$(dirname "$1")/next.config.ts" ]] || \
         [[ -f "$(dirname "$1")/next.config.mjs" ]]; then
        echo "nextjs"
      else
        echo "react"
      fi ;;
    php) echo "php" ;;
    swift) echo "swift" ;;
    *) echo "" ;;
  esac
}

FRAMEWORK=$(get_framework "$FILE_PATH")
[[ -z "$FRAMEWORK" ]] && exit 0

# Find project root
find_project_root() {
  local dir="$1"
  while [[ "$dir" != "/" ]]; do
    [[ -f "$dir/package.json" || -f "$dir/composer.json" || -d "$dir/.git" ]] && { echo "$dir"; return; }
    dir=$(dirname "$dir")
  done
  echo "${PWD}"
}

PROJECT_ROOT=$(find_project_root "$(dirname "$FILE_PATH")")

# Files
LOG_DIR="$HOME/.claude/logs/00-apex"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/solid-reads.json"
TODAY=$(date +%Y-%m-%d)
STATE_FILE="$LOG_DIR/${TODAY}-state.json"

# Check last read for framework + session in JSON
VALID="false"
if [[ -f "$LOG_FILE" ]]; then
  # Get last entry matching framework and session
  LAST_TS=$(jq -r --arg fw "$FRAMEWORK" --arg sess "$SESSION_ID" \
    '[.reads[] | select(.framework == $fw and .session == $sess)] | last | .timestamp // empty' \
    "$LOG_FILE" 2>/dev/null)

  if [[ -n "$LAST_TS" && "$LAST_TS" != "null" ]]; then
    # Check if less than 2 minutes (120 seconds)
    READ_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$LAST_TS" "+%s" 2>/dev/null)
    NOW_EPOCH=$(date "+%s")
    if [[ -n "$READ_EPOCH" ]]; then
      DIFF=$((NOW_EPOCH - READ_EPOCH))
      [[ $DIFF -lt 120 ]] && VALID="true"
    fi
  fi
fi

[[ "$VALID" == "true" ]] && exit 0

# BLOCKED - Write target info to state file
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%SZ)
DEFAULT_STATE='{"$schema":"apex-state-v1","target":{}}'

if [[ -f "$STATE_FILE" ]] && jq -e . "$STATE_FILE" >/dev/null 2>&1; then
  STATE=$(cat "$STATE_FILE")
else
  STATE="$DEFAULT_STATE"
fi

STATE=$(echo "$STATE" | jq \
  --arg proj "$PROJECT_ROOT" \
  --arg fw "$FRAMEWORK" \
  --arg ts "$TIMESTAMP" \
  '.target = {"project": $proj, "framework": $fw, "set_by": "require-solid-read.sh", "set_at": $ts}')
echo "$STATE" > "$STATE_FILE"

# Map framework to skill path
case "$FRAMEWORK" in
  react) SKILL_PATH="react-expert/skills/solid-react" ;;
  nextjs) SKILL_PATH="nextjs-expert/skills/solid-nextjs" ;;
  php) SKILL_PATH="laravel-expert/skills/solid-php" ;;
  swift) SKILL_PATH="swift-apple-expert/skills/solid-swift" ;;
esac

REASON="BLOCKED: Read SOLID first (expires every 2min): ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/${SKILL_PATH}/SKILL.md"

cat << EOF
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"$REASON"}}
EOF
exit 0
