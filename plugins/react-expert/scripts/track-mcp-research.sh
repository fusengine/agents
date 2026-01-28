vueoui #!/bin/bash
# track-mcp-research.sh - PostToolUse hook for tracking MCP documentation calls
# Tracks Context7 and Exa research - WORKS ALWAYS (session-based + APEX)

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only track MCP documentation tools
case "$TOOL_NAME" in
  mcp__context7__query-docs|mcp__context7__resolve-library-id)
    QUERY=$(echo "$INPUT" | jq -r '.tool_input.libraryId // .tool_input.topic // empty' | tr '[:upper:]' '[:lower:]')
    SOURCE="context7"
    ;;
  mcp__exa__web_search_exa|mcp__exa__get_code_context_exa)
    QUERY=$(echo "$INPUT" | jq -r '.tool_input.query // empty' | tr '[:upper:]' '[:lower:]')
    SOURCE="exa"
    ;;
  *)
    exit 0
    ;;
esac

# Detect framework from query - default to "generic" if no match
FRAMEWORK="generic"
if [[ "$QUERY" =~ react ]]; then FRAMEWORK="react"
elif [[ "$QUERY" =~ next ]]; then FRAMEWORK="nextjs"
elif [[ "$QUERY" =~ tailwind ]]; then FRAMEWORK="tailwind"
elif [[ "$QUERY" =~ laravel|php ]]; then FRAMEWORK="laravel"
elif [[ "$QUERY" =~ swift|swiftui|ios ]]; then FRAMEWORK="swift"
elif [[ "$QUERY" =~ design|shadcn|ui|component ]]; then FRAMEWORK="design"
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# SESSION-BASED TRACKING (extract session_id from JSON stdin)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
[[ -z "$SESSION_ID" ]] && SESSION_ID="fallback-$$"
TRACKING_DIR="/tmp/claude-skill-tracking"
mkdir -p "$TRACKING_DIR"
TRACKING_FILE="$TRACKING_DIR/$FRAMEWORK-$SESSION_ID"
echo "$TIMESTAMP $SOURCE:$TOOL_NAME $QUERY" >> "$TRACKING_FILE"

# Also track "generic" for any MCP research (allows general-purpose agent)
if [[ "$FRAMEWORK" != "generic" ]]; then
  GENERIC_FILE="$TRACKING_DIR/generic-$SESSION_ID"
  echo "$TIMESTAMP $SOURCE:$TOOL_NAME $QUERY" >> "$GENERIC_FILE"
fi

# APEX tracking (bonus - if task.json exists)
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-${PWD}}"
TASK_FILE="$PROJECT_ROOT/.claude/apex/task.json"

if [[ -f "$TASK_FILE" ]]; then
  CURRENT_TASK=$(jq -r '.current_task // "1"' "$TASK_FILE")
  UPDATED_JSON=$(jq --arg task "$CURRENT_TASK" \
                    --arg fw "$FRAMEWORK" \
                    --arg source "$SOURCE:$TOOL_NAME" \
                    --arg query "$QUERY" \
                    --arg time "$TIMESTAMP" '
    .tasks[$task] //= {} |
    .tasks[$task].doc_consulted //= {} |
    .tasks[$task].doc_consulted[$fw] = {
      "consulted": true,
      "source": $source,
      "query": $query,
      "timestamp": $time
    }
  ' "$TASK_FILE")
  echo "$UPDATED_JSON" > "$TASK_FILE"
fi

exit 0
