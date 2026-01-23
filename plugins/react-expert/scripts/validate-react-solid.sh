#!/bin/bash
# validate-react-solid.sh - PostToolUse hook for react-expert
# Validates SOLID principles after Write/Edit on React files

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

# Skip non-component directories for interface check
IS_COMPONENT_DIR=false
if [[ "$FILE_PATH" =~ /components/ ]]; then
  IS_COMPONENT_DIR=true
fi

# Count lines (excluding empty lines and comments)
LINE_COUNT=$(grep -v '^\s*$' "$FILE_PATH" | grep -v '^\s*//' | grep -v '^\s*\*' | wc -l | tr -d ' ')

# Check file size limit (applies to all files)
if [[ $LINE_COUNT -gt 100 ]]; then
  echo "⚠️ SOLID: $LINE_COUNT lines (limit: 100) - Split file"
fi

# Check for inline interfaces only in component files
if [[ "$IS_COMPONENT_DIR" == true ]]; then
  if grep -qE "^(export )?(interface|type) [A-Z]" "$FILE_PATH" 2>/dev/null; then
    echo "⚠️ SOLID: Interface in component - Move to interfaces/"
  fi
fi

exit 0
