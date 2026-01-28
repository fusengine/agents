#!/bin/bash
# Enforce: No interfaces/types in component/view files (ALL languages)
# Updated: Uses correct hookSpecificOutput format
# IMPORTANT: exit 0 + JSON stdout = Claude reads JSON

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')

BLOCK_REASON=""

# TypeScript/JavaScript components
if [[ "$FILE_PATH" =~ \.(tsx|jsx|vue|svelte)$ ]]; then
  if echo "$CONTENT" | grep -qE "^(export )?(interface|type) [A-Z]"; then
    BLOCK_REASON="VIOLATION: Interface/type in component file. Move to src/interfaces/"
  fi
fi

# Python - class definitions that are just data classes in view files
if [[ -z "$BLOCK_REASON" && "$FILE_PATH" =~ (views?|controllers?|routes?)/.*\.py$ ]]; then
  if echo "$CONTENT" | grep -qE "^class [A-Z].*\(BaseModel|TypedDict|Protocol\)"; then
    BLOCK_REASON="VIOLATION: Type class in view file. Move to src/interfaces/"
  fi
fi

# Go - interface in handler files
if [[ -z "$BLOCK_REASON" && "$FILE_PATH" =~ (handlers?|controllers?)/.*\.go$ ]]; then
  if echo "$CONTENT" | grep -qE "^type [A-Z].*interface"; then
    BLOCK_REASON="VIOLATION: Interface in handler file. Move to internal/interfaces/"
  fi
fi

# Java/Kotlin - interface in controller files
if [[ -z "$BLOCK_REASON" && "$FILE_PATH" =~ (controllers?|handlers?)/.*\.(java|kt)$ ]]; then
  if echo "$CONTENT" | grep -qE "^(public |private )?(interface|record) [A-Z]"; then
    BLOCK_REASON="VIOLATION: Interface in controller file. Move to interfaces/ package"
  fi
fi

# PHP - interface in controller files
if [[ -z "$BLOCK_REASON" && "$FILE_PATH" =~ (Controllers?|Handlers?)/.*\.php$ ]]; then
  if echo "$CONTENT" | grep -qE "^(interface|class) [A-Z].*(Interface|DTO|Request)"; then
    BLOCK_REASON="VIOLATION: Interface in controller file. Move to Interfaces/ directory"
  fi
fi

# Swift - protocol in view files
if [[ -z "$BLOCK_REASON" && "$FILE_PATH" =~ (Views?|Components?)/.*\.swift$ ]]; then
  if echo "$CONTENT" | grep -qE "^protocol [A-Z]"; then
    BLOCK_REASON="VIOLATION: Protocol in view file. Move to Protocols/ or Models/"
  fi
fi

# Output JSON if blocking, then exit 0 (so Claude reads it)
if [[ -n "$BLOCK_REASON" ]]; then
  cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "🚫 SOLID VIOLATION: $BLOCK_REASON"
  }
}
EOF
fi

exit 0
