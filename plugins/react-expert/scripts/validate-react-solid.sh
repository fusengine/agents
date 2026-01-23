#!/bin/bash
# validate-react-solid.sh - PostToolUse hook for react-expert
# Validates SOLID principles after Write/Edit

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

# Count lines (excluding empty lines and comments)
LINE_COUNT=$(grep -v '^\s*$' "$FILE_PATH" | grep -v '^\s*//' | grep -v '^\s*\*' | wc -l | tr -d ' ')

# Check file size limit
if [[ $LINE_COUNT -gt 100 ]]; then
  echo "⚠️ SOLID VIOLATION: File has $LINE_COUNT lines (limit: 100)"
  echo "INSTRUCTION: Split this file immediately. Target: 50-80 lines per file."
  echo "Strategy: Extract to separate files (types.ts, utils.ts, constants.ts)"
fi

# Check for inline interfaces in components
if [[ "$FILE_PATH" =~ /components/ ]]; then
  if grep -qE "^(export )?(interface|type) " "$FILE_PATH"; then
    echo "⚠️ SOLID VIOLATION: Interface/type defined in component file"
    echo "INSTRUCTION: Move interfaces to src/interfaces/ directory"
  fi
fi

# Check for missing JSDoc on exports
EXPORTS_WITHOUT_JSDOC=$(grep -B1 "^export " "$FILE_PATH" | grep -v "/\*\*" | grep "^export " | head -3)
if [[ -n "$EXPORTS_WITHOUT_JSDOC" ]]; then
  echo "⚠️ JSDoc missing on exports:"
  echo "$EXPORTS_WITHOUT_JSDOC"
  echo "INSTRUCTION: Add JSDoc comments to all exported functions/components"
fi

exit 0
