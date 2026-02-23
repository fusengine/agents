#!/bin/bash
# check-solid-compliance.sh - PostToolUse hook for ai-pilot
# Validates SOLID compliance after any code modification

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check code files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java)$ ]]; then
  exit 0
fi

# Skip if file doesn't exist
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

VIOLATIONS=""

# Count lines (excluding empty and comments)
LINE_COUNT=$(grep -v '^\s*$' "$FILE_PATH" | grep -v '^\s*//' | grep -v '^\s*#' | grep -v '^\s*\*' | wc -l | tr -d ' ')

if [[ $LINE_COUNT -gt 100 ]]; then
  VIOLATIONS="${VIOLATIONS}❌ FILE SIZE: $LINE_COUNT lines (max: 100)\n"
fi

if [[ $LINE_COUNT -gt 90 ]] && [[ $LINE_COUNT -le 100 ]]; then
  VIOLATIONS="${VIOLATIONS}⚠️ FILE SIZE WARNING: $LINE_COUNT lines (split at 90)\n"
fi

# Check interface location based on file type
case "$FILE_PATH" in
  *components/*|*pages/*|*views/*)
    if grep -qE "^(export )?(interface|type) [A-Z]" "$FILE_PATH" 2>/dev/null; then
      VIOLATIONS="${VIOLATIONS}❌ INTERFACE LOCATION: Move to src/interfaces/\n"
    fi
    ;;
  *Controllers/*|*Models/*|*Services/*)
    if grep -qE "^interface " "$FILE_PATH" 2>/dev/null; then
      VIOLATIONS="${VIOLATIONS}❌ INTERFACE LOCATION: Move to app/Contracts/\n"
    fi
    ;;
esac

# Output violations if any
if [[ -n "$VIOLATIONS" ]]; then
  FILENAME=$(basename "$FILE_PATH")
  echo "solid: violations in ${FILENAME}" >&2
  CONTENT="🔍 SOLID COMPLIANCE CHECK: ${FILENAME}\n\n${VIOLATIONS}\nINSTRUCTION: Fix violations before continuing.\nRun sniper agent for full validation."
  ESCAPED=$(printf '%b' "$CONTENT" | jq -Rs .)
  cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": $ESCAPED
  }
}
EOF
fi

exit 0
