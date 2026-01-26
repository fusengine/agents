#!/bin/bash
# validate-swift-solid.sh - PreToolUse hook for swift-apple-expert
# Validates SOLID principles BEFORE Write/Edit on Swift files
# Uses official Claude Code hook format with permissionDecision

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

# Skip build directories
if [[ "$FILE_PATH" =~ /(\.build|DerivedData|Pods)/ ]]; then
  exit 0
fi

# Get content that WILL BE written
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

if [[ -z "$CONTENT" ]]; then
  exit 0
fi

# Count lines
LINE_COUNT=$(echo "$CONTENT" | grep -v '^\s*$' | grep -v '^\s*//' | wc -l | tr -d ' ')

# Swift allows 150 lines for Views
MAX_LINES=100
if [[ "$FILE_PATH" =~ (View|Screen)\.swift$ ]]; then
  MAX_LINES=150
fi

VIOLATIONS=()

# Check file size
if [[ $LINE_COUNT -gt $MAX_LINES ]]; then
  VIOLATIONS+=("File has $LINE_COUNT lines (limit: $MAX_LINES). Extract to ViewModels, Services, or subviews.")
fi

# Check for protocols outside Protocols/
if echo "$CONTENT" | grep -qE "^protocol "; then
  if [[ ! "$FILE_PATH" =~ /Protocols/ ]]; then
    VIOLATIONS+=("Protocol defined outside Protocols/ directory. Move to Protocols/.")
  fi
fi

# Check for @MainActor on ViewModels
if [[ "$FILE_PATH" =~ ViewModel\.swift$ ]]; then
  if ! echo "$CONTENT" | grep -q "@MainActor"; then
    VIOLATIONS+=("ViewModel missing @MainActor annotation for Swift 6 concurrency.")
  fi
fi

# Check for Sendable compliance
if echo "$CONTENT" | grep -qE "^(class|struct) .* \{"; then
  if echo "$CONTENT" | grep -q "async " && ! echo "$CONTENT" | grep -qE "(Sendable|@unchecked Sendable)"; then
    VIOLATIONS+=("Type uses async but doesn't conform to Sendable (Swift 6 requirement).")
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
