#!/bin/bash
# validate-swift-solid.sh - SOLID validation for Swift/SwiftUI
set -euo pipefail

SHARED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../_shared/scripts" && pwd)"
source "$SHARED_DIR/validate-solid-common.sh"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]] && exit 0
[[ ! "$FILE_PATH" =~ \.swift$ ]] && exit 0
[[ "$FILE_PATH" =~ /(\.build|DerivedData|Pods)/ ]] && exit 0

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')
[[ -z "$CONTENT" ]] && exit 0

LINE_COUNT=$(count_code_lines "$CONTENT")
MAX_LINES=100
[[ "$FILE_PATH" =~ (View|Screen)\.swift$ ]] && MAX_LINES=150

VIOLATIONS=()

# Swift specific rules
[[ $LINE_COUNT -gt $MAX_LINES ]] && VIOLATIONS+=("File has $LINE_COUNT lines (limit: $MAX_LINES). Extract to ViewModels, Services, or subviews.")

if echo "$CONTENT" | grep -qE "^protocol "; then
  [[ ! "$FILE_PATH" =~ /Protocols/ ]] && \
    VIOLATIONS+=("Protocol defined outside Protocols/ directory. Move to Protocols/.")
fi

if [[ "$FILE_PATH" =~ ViewModel\.swift$ ]]; then
  echo "$CONTENT" | grep -q "@MainActor" || \
    VIOLATIONS+=("ViewModel missing @MainActor annotation for Swift 6 concurrency.")
fi

if echo "$CONTENT" | grep -qE "^(class|struct) .* \{"; then
  if echo "$CONTENT" | grep -q "async " && ! echo "$CONTENT" | grep -qE "(Sendable|@unchecked Sendable)"; then
    VIOLATIONS+=("Type uses async but doesn't conform to Sendable (Swift 6 requirement).")
  fi
fi

[[ ${#VIOLATIONS[@]} -gt 0 ]] && { deny_solid_violation "$FILE_PATH" "${VIOLATIONS[@]}"; exit 0; }
exit 0
