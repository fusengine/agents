#!/bin/bash
# Validate SOLID principles before writing files

source "$CLAUDE_ENV_FILE" 2>/dev/null || true

# Skip if unknown project
[ "$SOLID_PROJECT_TYPE" = "unknown" ] && exit 0
[ -z "$SOLID_PROJECT_TYPE" ] && exit 0

# Read file path from stdin (JSON)
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty' 2>/dev/null)

[ -z "$FILE_PATH" ] && exit 0

# Get new content if available
NEW_CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty' 2>/dev/null)

# Helper function to deny with hookSpecificOutput
deny_solid() {
  local reason="$1"
  cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "$reason"
  }
}
EOF
  exit 0
}

# Validation based on project type
case "$SOLID_PROJECT_TYPE" in
  nextjs)
    # Block interfaces in components
    if [[ "$FILE_PATH" == *"/components/"* ]] && echo "$NEW_CONTENT" | grep -qE "^(export )?(interface|type) "; then
      deny_solid "SOLID: Interfaces must be in modules/cores/interfaces/, not components"
    fi
    # Block interfaces in pages
    if [[ "$FILE_PATH" == *"/app/"* ]] && [[ "$FILE_PATH" == *".tsx" ]] && echo "$NEW_CONTENT" | grep -qE "^(export )?(interface|type) "; then
      deny_solid "SOLID: Interfaces must be in modules/cores/interfaces/, not app/"
    fi
    ;;

  laravel)
    # Block interfaces outside Contracts
    if [[ "$FILE_PATH" == *".php" ]] && [[ "$FILE_PATH" != *"/Contracts/"* ]] && echo "$NEW_CONTENT" | grep -q "^interface "; then
      deny_solid "SOLID: Interfaces must be in app/Contracts/"
    fi
    ;;

  swift)
    # Block protocols outside Protocols
    if [[ "$FILE_PATH" == *".swift" ]] && [[ "$FILE_PATH" != *"/Protocols/"* ]] && echo "$NEW_CONTENT" | grep -q "^protocol "; then
      deny_solid "SOLID: Protocols must be in Protocols/"
    fi
    ;;

  go)
    # Block interfaces outside interfaces directory
    if [[ "$FILE_PATH" == *".go" ]] && [[ "$FILE_PATH" != *"/interfaces/"* ]] && echo "$NEW_CONTENT" | grep -q "^type.*interface {"; then
      deny_solid "SOLID: Interfaces must be in internal/interfaces/"
    fi
    ;;

  python)
    # Block ABC classes outside interfaces
    if [[ "$FILE_PATH" == *".py" ]] && [[ "$FILE_PATH" != *"/interfaces/"* ]] && echo "$NEW_CONTENT" | grep -q "class.*ABC"; then
      deny_solid "SOLID: Abstract classes must be in src/interfaces/"
    fi
    ;;
esac

exit 0
