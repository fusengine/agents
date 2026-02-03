#!/bin/bash
# enforce-apex-phases.sh - PreToolUse hook
# READS: authorizations.{framework}.doc_consulted + session + timestamp
# VALIDITY: same session + less than 2 minutes old
# FILE: ~/.claude/logs/00-apex/YYYY-MM-DD-state.json

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')

[[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]] && exit 0
[[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java|vue|svelte|css)$ ]] && exit 0
[[ "$FILE_PATH" =~ /(node_modules|vendor|dist|build|\.next|DerivedData)/ ]] && exit 0

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

# Detect framework
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')
FRAMEWORK="generic"

if [[ "$FILE_PATH" =~ \.(tsx|jsx)$ ]] || echo "$CONTENT" | grep -qE "(from ['\"]react|useState|className=)"; then
  if [[ "$FILE_PATH" =~ (page|layout|loading|error|route)\.(ts|tsx)$ ]] || echo "$CONTENT" | grep -qE "(use client|use server)"; then
    FRAMEWORK="nextjs"
  else
    FRAMEWORK="react"
  fi
elif [[ "$FILE_PATH" =~ \.swift$ ]]; then FRAMEWORK="swift"
elif [[ "$FILE_PATH" =~ \.php$ ]]; then FRAMEWORK="laravel"
elif [[ "$FILE_PATH" =~ \.css$ ]] || echo "$CONTENT" | grep -qE "(@tailwind|@apply)"; then FRAMEWORK="tailwind"
fi

# State file
STATE_DIR="$HOME/.claude/logs/00-apex"
mkdir -p "$STATE_DIR"
TODAY=$(date +%Y-%m-%d)
STATE_FILE="$STATE_DIR/${TODAY}-state.json"
LOCK_DIR="$STATE_DIR/.state.lock"
DEFAULT_STATE='{"$schema":"apex-state-v1","description":"État APEX/SOLID - session + 2min expiry","target":{},"authorizations":{}}'

# Portable lock using mkdir (atomic on all POSIX systems including macOS)
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

# Acquire lock BEFORE reading state (fix race condition)
acquire_lock || exit 0

# Load state (now protected by lock)
if [[ -f "$STATE_FILE" ]] && jq -e . "$STATE_FILE" >/dev/null 2>&1; then
  STATE=$(cat "$STATE_FILE")
else
  STATE="$DEFAULT_STATE"
fi

# Check if doc was consulted (same session + less than 2 min)
VALID="false"
STORED_SESSION=$(echo "$STATE" | jq -r --arg fw "$FRAMEWORK" '.authorizations[$fw].session // empty')
DOC_CONSULTED=$(echo "$STATE" | jq -r --arg fw "$FRAMEWORK" '.authorizations[$fw].doc_consulted // empty')

if [[ -n "$DOC_CONSULTED" && "$STORED_SESSION" == "$SESSION_ID" ]]; then
  # Check if less than 2 minutes (120 seconds) - macOS compatible
  READ_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$DOC_CONSULTED" "+%s" 2>/dev/null)
  NOW_EPOCH=$(date "+%s")
  if [[ -n "$READ_EPOCH" ]]; then
    DIFF=$((NOW_EPOCH - READ_EPOCH))
    [[ $DIFF -lt 120 ]] && VALID="true"
  fi
fi

[[ "$VALID" == "true" ]] && exit 0

# BLOCKED - Write target (lock already acquired)
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%SZ)
STATE=$(echo "$STATE" | jq \
  --arg proj "$PROJECT_ROOT" \
  --arg fw "$FRAMEWORK" \
  --arg ts "$TIMESTAMP" \
  '.target = {"project": $proj, "framework": $fw, "set_by": "enforce-apex-phases.sh", "set_at": $ts}')
echo "$STATE" > "$STATE_FILE"

PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
case "$FRAMEWORK" in
  react) SRC="$PLUGINS_DIR/react-expert/skills/react-19/SKILL.md" ;;
  nextjs) SRC="$PLUGINS_DIR/nextjs-expert/skills/nextjs-16/SKILL.md" ;;
  swift) SRC="$PLUGINS_DIR/swift-apple-expert/skills/swiftui-components/SKILL.md" ;;
  laravel) SRC="$PLUGINS_DIR/laravel-expert/skills/laravel-eloquent/SKILL.md" ;;
  tailwind) SRC="$PLUGINS_DIR/tailwindcss/skills/tailwindcss-v4/SKILL.md" ;;
  *) SRC="mcp__context7__query-docs" ;;
esac

REASON="🚫 APEX: Read doc first (expires every 2min) for $FRAMEWORK! Source: $SRC"

# Output JSON - Claude Code interprets permissionDecision:"deny"
jq -n --arg reason "$REASON" '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":$reason}}'
exit 0
