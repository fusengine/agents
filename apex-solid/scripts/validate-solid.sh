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

# Validation based on project type
case "$SOLID_PROJECT_TYPE" in
  nextjs)
    # Block interfaces in components
    if [[ "$FILE_PATH" == *"/components/"* ]] && echo "$NEW_CONTENT" | grep -qE "^(export )?(interface|type) "; then
      echo "❌ SOLID: Interfaces must be in modules/cores/interfaces/, not components" >&2
      exit 2
    fi
    # Block interfaces in pages
    if [[ "$FILE_PATH" == *"/app/"* ]] && [[ "$FILE_PATH" == *".tsx" ]] && echo "$NEW_CONTENT" | grep -qE "^(export )?(interface|type) "; then
      echo "❌ SOLID: Interfaces must be in modules/cores/interfaces/, not app/" >&2
      exit 2
    fi
    ;;

  laravel)
    # Block interfaces outside Contracts
    if [[ "$FILE_PATH" == *".php" ]] && [[ "$FILE_PATH" != *"/Contracts/"* ]] && echo "$NEW_CONTENT" | grep -q "^interface "; then
      echo "❌ SOLID: Interfaces must be in app/Contracts/" >&2
      exit 2
    fi
    ;;

  swift)
    # Block protocols outside Protocols
    if [[ "$FILE_PATH" == *".swift" ]] && [[ "$FILE_PATH" != *"/Protocols/"* ]] && echo "$NEW_CONTENT" | grep -q "^protocol "; then
      echo "❌ SOLID: Protocols must be in Protocols/" >&2
      exit 2
    fi
    ;;

  go)
    # Block interfaces outside interfaces directory
    if [[ "$FILE_PATH" == *".go" ]] && [[ "$FILE_PATH" != *"/interfaces/"* ]] && echo "$NEW_CONTENT" | grep -q "^type.*interface {"; then
      echo "❌ SOLID: Interfaces must be in internal/interfaces/" >&2
      exit 2
    fi
    ;;

  python)
    # Block ABC classes outside interfaces
    if [[ "$FILE_PATH" == *".py" ]] && [[ "$FILE_PATH" != *"/interfaces/"* ]] && echo "$NEW_CONTENT" | grep -q "class.*ABC"; then
      echo "❌ SOLID: Abstract classes must be in src/interfaces/" >&2
      exit 2
    fi
    ;;
esac

exit 0
