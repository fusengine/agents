vueoui #!/bin/bash
# track-mcp-research.sh - PostToolUse hook for tracking MCP documentation calls
# Tracks Context7 and Exa research and updates task.json

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

# Detect framework from query - default to agent's framework
FRAMEWORK="react"
if [[ "$QUERY" =~ next ]]; then FRAMEWORK="nextjs"
elif [[ "$QUERY" =~ tailwind ]]; then FRAMEWORK="tailwind"
elif [[ "$QUERY" =~ laravel|php ]]; then FRAMEWORK="laravel"
elif [[ "$QUERY" =~ swift|swiftui|ios ]]; then FRAMEWORK="swift"
elif [[ "$QUERY" =~ design|shadcn|ui|component ]]; then FRAMEWORK="design"
fi

# Get project root
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-${PWD}}"
TASK_FILE="$PROJECT_ROOT/.claude/apex/task.json"

# Only update if task.json exists (APEX mode)
if [[ ! -f "$TASK_FILE" ]]; then
  exit 0
fi

CURRENT_TASK=$(jq -r '.current_task // "1"' "$TASK_FILE")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Update task.json
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
exit 0
