#!/bin/bash
# validate-react-solid.sh - PreToolUse hook for react-expert
# Validates SOLID principles BEFORE Write/Edit on React files
# Uses official Claude Code hook format with permissionDecision

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check TypeScript/JavaScript files
if [[ ! "$FILE_PATH" =~ \.(tsx|ts|jsx|js)$ ]]; then
  exit 0
fi

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(node_modules|dist|build|\.next)/ ]]; then
  exit 0
fi

# Get content that WILL BE written (not file on disk)
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# Skip if no content to analyze
if [[ -z "$CONTENT" ]]; then
  exit 0
fi

# Count lines in content (excluding empty lines and comments)
LINE_COUNT=$(echo "$CONTENT" | grep -v '^\s*$' | grep -v '^\s*//' | grep -v '^\s*\*' | wc -l | tr -d ' ')

VIOLATIONS=()

# Check file size limit
if [[ $LINE_COUNT -gt 100 ]]; then
  VIOLATIONS+=("File has $LINE_COUNT lines (limit: 100). Split into smaller modules.")
fi

# Check for inline interfaces in component directories
if [[ "$FILE_PATH" =~ /(components|modules)/ ]]; then
  if echo "$CONTENT" | grep -qE "^(export )?(interface|type) [A-Z]"; then
    VIOLATIONS+=("Interface/type in component file. Move to src/interfaces/ directory.")
  fi
fi

# If violations found, BLOCK with official format
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
