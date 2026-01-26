#!/bin/bash
# validate-nextjs-solid.sh - PreToolUse hook for nextjs-expert
# Validates SOLID principles BEFORE Write/Edit on Next.js files
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

# Get content that WILL BE written
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

if [[ -z "$CONTENT" ]]; then
  exit 0
fi

# Count lines
LINE_COUNT=$(echo "$CONTENT" | grep -v '^\s*$' | grep -v '^\s*//' | grep -v '^\s*\*' | wc -l | tr -d ' ')

# Next.js allows 150 lines for page/layout files
MAX_LINES=100
if [[ "$FILE_PATH" =~ (page|layout|loading|error|not-found)\.(tsx|ts)$ ]]; then
  MAX_LINES=150
fi

VIOLATIONS=()

# Check file size
if [[ $LINE_COUNT -gt $MAX_LINES ]]; then
  VIOLATIONS+=("File has $LINE_COUNT lines (limit: $MAX_LINES). Split to lib/, hooks/, or components/.")
fi

# Check for interfaces in app/ or components/
if [[ "$FILE_PATH" =~ /(app|components|modules)/ ]]; then
  if echo "$CONTENT" | grep -qE "^(export )?(interface|type) [A-Z]"; then
    VIOLATIONS+=("Interface/type in component. Move to modules/cores/interfaces/ or src/types/.")
  fi
fi

# Check for 'use client' when needed
if echo "$CONTENT" | grep -qE "(useState|useEffect|useRef|onClick|onChange)"; then
  if ! echo "$CONTENT" | head -5 | grep -q "'use client'"; then
    VIOLATIONS+=("Client hooks detected but 'use client' directive missing at top.")
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
