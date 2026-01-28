#!/bin/bash
# validate-react-solid.sh - SOLID validation for React
set -euo pipefail

SHARED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../_shared/scripts" && pwd)"
source "$SHARED_DIR/validate-solid-common.sh"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]] && exit 0
[[ ! "$FILE_PATH" =~ \.(tsx|ts|jsx|js)$ ]] && exit 0
[[ "$FILE_PATH" =~ /(node_modules|dist|build)/ ]] && exit 0

# Skip if Next.js code (handled by nextjs-expert)
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')
echo "$CONTENT" | grep -qE "(use client|use server|NextRequest|NextResponse|from ['\"]next)" && exit 0
[[ -z "$CONTENT" ]] && exit 0

LINE_COUNT=$(count_code_lines "$CONTENT")
VIOLATIONS=()

# React specific rules
[[ $LINE_COUNT -gt 100 ]] && VIOLATIONS+=("File has $LINE_COUNT lines (limit: 100). Split to hooks/, components/, or utils/.")

if [[ "$FILE_PATH" =~ /components/ ]]; then
  echo "$CONTENT" | grep -qE "^(export )?(interface|type) [A-Z]" && \
    VIOLATIONS+=("Interface/type in component. Move to src/interfaces/ or src/types/.")
fi

# Check hooks are in hooks/ directory
if echo "$CONTENT" | grep -qE "^export (function|const) use[A-Z]"; then
  [[ ! "$FILE_PATH" =~ /hooks/ ]] && \
    VIOLATIONS+=("Custom hook defined outside hooks/ directory. Move to hooks/.")
fi

[[ ${#VIOLATIONS[@]} -gt 0 ]] && { deny_solid_violation "$FILE_PATH" "${VIOLATIONS[@]}"; exit 0; }
exit 0
