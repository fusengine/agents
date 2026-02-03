#!/bin/bash
# track-doc-consultation.sh - PostToolUse hook
# WRITES: authorizations.{framework}.doc_consulted + session
# FILE: ~/.claude/logs/00-apex/YYYY-MM-DD-state.json

set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')

# Determine source and query
case "$TOOL_NAME" in
  *context7__query-docs|*context7__resolve-library-id)
    QUERY=$(echo "$INPUT" | jq -r '.tool_input.libraryId // .tool_input.libraryName // empty')
    SOURCE="context7" ;;
  *exa__get_code_context_exa|*exa__web_search_exa)
    QUERY=$(echo "$INPUT" | jq -r '.tool_input.query // empty')
    SOURCE="exa" ;;
  Read)
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
    [[ ! "$FILE_PATH" =~ skills/.*\.md$ ]] && exit 0
    # Skip SOLID files - handled by track-solid-reads.sh
    [[ "$FILE_PATH" =~ solid-[^/]+/ ]] && exit 0
    QUERY="$FILE_PATH"
    SOURCE="skill" ;;
  *) exit 0 ;;
esac

# Detect framework from query
FRAMEWORK="generic"
[[ "$QUERY" =~ (next|nextjs|Next) ]] && FRAMEWORK="nextjs"
[[ "$QUERY" =~ (react|React) ]] && FRAMEWORK="react"
[[ "$QUERY" =~ (laravel|Laravel|php|PHP) ]] && FRAMEWORK="laravel"
[[ "$QUERY" =~ (swift|Swift|swiftui|SwiftUI) ]] && FRAMEWORK="swift"
[[ "$QUERY" =~ (tailwind|Tailwind) ]] && FRAMEWORK="tailwind"

# State file
STATE_DIR="$HOME/.claude/logs/00-apex"
mkdir -p "$STATE_DIR"
TODAY=$(date +%Y-%m-%d)
STATE_FILE="$STATE_DIR/${TODAY}-state.json"
LOCK_DIR="$STATE_DIR/.state.lock"
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%SZ)

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

acquire_lock || exit 0

# Load or create state (validate JSON)
DEFAULT_STATE='{"$schema":"apex-state-v1","description":"État APEX/SOLID - session + 2min expiry","target":{},"authorizations":{}}'
if [[ -f "$STATE_FILE" ]] && jq -e . "$STATE_FILE" >/dev/null 2>&1; then
  STATE=$(cat "$STATE_FILE")
else
  STATE="$DEFAULT_STATE"
fi

# Update: mark doc as consulted with session
STATE=$(echo "$STATE" | jq \
  --arg fw "$FRAMEWORK" \
  --arg ts "$TIMESTAMP" \
  --arg src "$SOURCE:$TOOL_NAME" \
  --arg sess "$SESSION_ID" \
  '.authorizations[$fw].doc_consulted = $ts | .authorizations[$fw].source = $src | .authorizations[$fw].session = $sess')

echo "$STATE" > "$STATE_FILE"
exit 0
