#!/bin/bash
# validate-laravel-solid.sh - PreToolUse hook for laravel-expert
# Validates SOLID principles BEFORE Write/Edit on Laravel files
# Uses official Claude Code hook format with permissionDecision

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check PHP files
if [[ ! "$FILE_PATH" =~ \.php$ ]]; then
  exit 0
fi

# Skip vendor directory
if [[ "$FILE_PATH" =~ /vendor/ ]]; then
  exit 0
fi

# Get content that WILL BE written
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

if [[ -z "$CONTENT" ]]; then
  exit 0
fi

# Count lines
LINE_COUNT=$(echo "$CONTENT" | grep -v '^\s*$' | grep -v '^\s*//' | grep -v '^\s*\*' | wc -l | tr -d ' ')

VIOLATIONS=()

# Check file size
if [[ $LINE_COUNT -gt 100 ]]; then
  VIOLATIONS+=("File has $LINE_COUNT lines (limit: 100). Split using Services, Actions, or Traits.")
fi

# Check for interfaces outside Contracts/
if echo "$CONTENT" | grep -qE "^interface "; then
  if [[ ! "$FILE_PATH" =~ /Contracts/ ]]; then
    VIOLATIONS+=("Interface defined outside app/Contracts/. Move to app/Contracts/ directory.")
  fi
fi

# Check for fat controllers
if [[ "$FILE_PATH" =~ /Controllers/ ]]; then
  if [[ $LINE_COUNT -gt 80 ]]; then
    VIOLATIONS+=("Fat controller ($LINE_COUNT lines). Extract logic to Services or Actions.")
  fi
fi

# If violations found, BLOCK
if [[ ${#VIOLATIONS[@]} -gt 0 ]]; then
  REASON="SOLID VIOLATION in $FILE_PATH: "
  for v in "${VIOLATIONS[@]}"; do
    REASON+="$v "
  done

  cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "$REASON"
  }
}
EOF
  exit 0
fi

exit 0
