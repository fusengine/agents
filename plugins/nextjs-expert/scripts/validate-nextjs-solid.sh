#!/bin/bash
# validate-nextjs-solid.sh - PostToolUse hook for nextjs-expert
# Validates SOLID principles for Next.js after Write/Edit

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

# Skip if file doesn't exist
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Count lines
LINE_COUNT=$(grep -v '^\s*$' "$FILE_PATH" | grep -v '^\s*//' | grep -v '^\s*\*' | wc -l | tr -d ' ')

# Next.js allows 150 lines for page/layout files
MAX_LINES=100
if [[ "$FILE_PATH" =~ (page|layout|loading|error|not-found)\.(tsx|ts)$ ]]; then
  MAX_LINES=150
fi

if [[ $LINE_COUNT -gt $MAX_LINES ]]; then
  echo "⚠️ SOLID VIOLATION: File has $LINE_COUNT lines (limit: $MAX_LINES)"
  echo "INSTRUCTION: Split this file. Extract logic to lib/, hooks/, or components/"
fi

# Check for interfaces in app/ or components/
if [[ "$FILE_PATH" =~ /app/ ]] || [[ "$FILE_PATH" =~ /components/ ]]; then
  if grep -qE "^(export )?(interface|type) [A-Z]" "$FILE_PATH" 2>/dev/null; then
    echo "⚠️ SOLID VIOLATION: Interface/type in component file"
    echo "INSTRUCTION: Move to modules/cores/interfaces/ or src/types/"
  fi
fi

# Check for 'use client' at top when needed
if grep -qE "(useState|useEffect|useRef|onClick|onChange)" "$FILE_PATH" 2>/dev/null; then
  if ! head -5 "$FILE_PATH" | grep -q "'use client'"; then
    echo "⚠️ Next.js: Client hooks detected but 'use client' directive missing"
  fi
fi

exit 0
