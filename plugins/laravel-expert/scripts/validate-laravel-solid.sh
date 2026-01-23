#!/bin/bash
# validate-laravel-solid.sh - PostToolUse hook for laravel-expert
# Validates SOLID principles for Laravel after Write/Edit

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

# Skip if file doesn't exist
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Count lines
LINE_COUNT=$(grep -v '^\s*$' "$FILE_PATH" | grep -v '^\s*//' | grep -v '^\s*\*' | wc -l | tr -d ' ')

if [[ $LINE_COUNT -gt 100 ]]; then
  echo "⚠️ SOLID VIOLATION: File has $LINE_COUNT lines (limit: 100)"
  echo "INSTRUCTION: Split this file using Services, Actions, or Traits"
fi

# Check for interfaces outside Contracts/
if grep -qE "^interface " "$FILE_PATH" 2>/dev/null; then
  if [[ ! "$FILE_PATH" =~ /Contracts/ ]]; then
    echo "⚠️ SOLID VIOLATION: Interface defined outside app/Contracts/"
    echo "INSTRUCTION: Move interface to app/Contracts/ directory"
  fi
fi

# Check for missing PHPDoc
if grep -qE "^(public|protected|private) function" "$FILE_PATH" 2>/dev/null; then
  FUNCTIONS_WITHOUT_DOC=$(grep -B1 "^\s*(public|protected|private) function" "$FILE_PATH" | grep -v "/\*\*" | grep -c "function" || true)
  if [[ $FUNCTIONS_WITHOUT_DOC -gt 0 ]]; then
    echo "⚠️ PHPDoc missing on $FUNCTIONS_WITHOUT_DOC function(s)"
    echo "INSTRUCTION: Add PHPDoc to all public/protected functions"
  fi
fi

# Check for fat controllers
if [[ "$FILE_PATH" =~ /Controllers/ ]]; then
  if [[ $LINE_COUNT -gt 80 ]]; then
    echo "⚠️ Fat controller detected ($LINE_COUNT lines)"
    echo "INSTRUCTION: Extract logic to Services or Actions"
  fi
fi

exit 0
