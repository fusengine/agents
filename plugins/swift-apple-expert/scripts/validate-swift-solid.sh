#!/bin/bash
# validate-swift-solid.sh - PostToolUse hook for swift-apple-expert
# Validates SOLID principles for Swift after Write/Edit

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check Swift files
if [[ ! "$FILE_PATH" =~ \.swift$ ]]; then
  exit 0
fi

# Skip if file doesn't exist
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Count lines
LINE_COUNT=$(grep -v '^\s*$' "$FILE_PATH" | grep -v '^\s*//' | wc -l | tr -d ' ')

# Swift allows 150 lines for Views
MAX_LINES=100
if [[ "$FILE_PATH" =~ View\.swift$ ]] || [[ "$FILE_PATH" =~ Screen\.swift$ ]]; then
  MAX_LINES=150
fi

if [[ $LINE_COUNT -gt $MAX_LINES ]]; then
  echo "⚠️ SOLID VIOLATION: File has $LINE_COUNT lines (limit: $MAX_LINES)"
  echo "INSTRUCTION: Extract to ViewModels, Services, or subviews"
fi

# Check for protocols outside Protocols/
if grep -qE "^protocol " "$FILE_PATH" 2>/dev/null; then
  if [[ ! "$FILE_PATH" =~ /Protocols/ ]]; then
    echo "⚠️ SOLID VIOLATION: Protocol defined outside Protocols/ directory"
    echo "INSTRUCTION: Move protocol to Protocols/ directory"
  fi
fi

# Check for @MainActor on ViewModels
if [[ "$FILE_PATH" =~ ViewModel\.swift$ ]]; then
  if ! grep -q "@MainActor" "$FILE_PATH" 2>/dev/null; then
    echo "⚠️ Swift 6: ViewModel missing @MainActor annotation"
    echo "INSTRUCTION: Add @MainActor to ViewModel class"
  fi
fi

# Check for Sendable compliance
if grep -qE "^(class|struct) .* {" "$FILE_PATH" 2>/dev/null; then
  if grep -q "async " "$FILE_PATH" && ! grep -qE "(Sendable|@unchecked Sendable)" "$FILE_PATH"; then
    echo "⚠️ Swift 6: Type uses async but doesn't conform to Sendable"
  fi
fi

exit 0
