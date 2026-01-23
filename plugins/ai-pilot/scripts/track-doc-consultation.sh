#!/bin/bash
# track-doc-consultation.sh - PostToolUse hook for ai-pilot
# Tracks documentation consultation and creates summary files
# Updates .claude/apex/task.json when Context7, Exa, or skills are consulted

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
TOOL_OUTPUT=$(echo "$INPUT" | jq -r '.tool_output // empty' | head -c 5000)

# Only track doc consultation tools
case "$TOOL_NAME" in
  mcp__context7__query-docs|mcp__context7__resolve-library-id)
    FRAMEWORK=$(echo "$INPUT" | jq -r '.tool_input.libraryId // .tool_input.libraryName // empty' | tr '[:upper:]' '[:lower:]')
    SOURCE="context7"
    ;;
  mcp__exa__get_code_context_exa|mcp__exa__web_search_exa)
    QUERY=$(echo "$INPUT" | jq -r '.tool_input.query // empty' | tr '[:upper:]' '[:lower:]')
    SOURCE="exa"
    # Detect framework from query
    if [[ "$QUERY" =~ react ]]; then FRAMEWORK="react"
    elif [[ "$QUERY" =~ next ]]; then FRAMEWORK="nextjs"
    elif [[ "$QUERY" =~ tailwind ]]; then FRAMEWORK="tailwind"
    elif [[ "$QUERY" =~ laravel ]]; then FRAMEWORK="laravel"
    elif [[ "$QUERY" =~ swift ]]; then FRAMEWORK="swift"
    elif [[ "$QUERY" =~ design|ui|component ]]; then FRAMEWORK="design"
    else FRAMEWORK="generic"
    fi
    ;;
  Read)
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
    if [[ "$FILE_PATH" =~ skills/.*\.md$ ]]; then
      SOURCE="skill"
      # Extract framework from skill path
      if [[ "$FILE_PATH" =~ react ]]; then FRAMEWORK="react"
      elif [[ "$FILE_PATH" =~ next ]]; then FRAMEWORK="nextjs"
      elif [[ "$FILE_PATH" =~ tailwind ]]; then FRAMEWORK="tailwind"
      elif [[ "$FILE_PATH" =~ laravel ]]; then FRAMEWORK="laravel"
      elif [[ "$FILE_PATH" =~ swift ]]; then FRAMEWORK="swift"
      elif [[ "$FILE_PATH" =~ design ]]; then FRAMEWORK="design"
      else FRAMEWORK="generic"
      fi
    else
      exit 0
    fi
    ;;
  *)
    exit 0
    ;;
esac

# Normalize framework name
case "$FRAMEWORK" in
  *react*) FRAMEWORK="react" ;;
  *next*) FRAMEWORK="nextjs" ;;
  *tailwind*) FRAMEWORK="tailwind" ;;
  *laravel*) FRAMEWORK="laravel" ;;
  *swift*) FRAMEWORK="swift" ;;
  *design*|*shadcn*|*ui*) FRAMEWORK="design" ;;
  *) FRAMEWORK="generic" ;;
esac

# Get project root (current working directory)
PROJECT_ROOT="${PWD}"
APEX_DIR="$PROJECT_ROOT/.claude/apex"
DOCS_DIR="$APEX_DIR/docs"
TASK_FILE="$APEX_DIR/task.json"

# Create directories if needed
mkdir -p "$DOCS_DIR"

# Get current task ID (from task.json or default to "current")
if [[ -f "$TASK_FILE" ]]; then
  CURRENT_TASK=$(jq -r '.current_task // "1"' "$TASK_FILE")
else
  CURRENT_TASK="1"
  # Initialize task.json
  cat > "$TASK_FILE" << EOF
{
  "current_task": "1",
  "tasks": {}
}
EOF
fi

# Create doc summary file
DOC_FILE="$DOCS_DIR/task-${CURRENT_TASK}-${FRAMEWORK}.md"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > "$DOC_FILE" << EOF
# Task $CURRENT_TASK - ${FRAMEWORK^} Documentation

## Consulted at
$TIMESTAMP

## Source
- Tool: $TOOL_NAME
- Provider: $SOURCE

## Query/Input
$(echo "$INPUT" | jq -r '.tool_input | to_entries | map("\(.key): \(.value)") | join("\n")' 2>/dev/null | head -20)

## Key Information Extracted
$(echo "$TOOL_OUTPUT" | head -50)

## Patterns to Apply
- [ ] Follow SOLID principles
- [ ] Keep files < 100 lines
- [ ] Add JSDoc/comments
- [ ] Separate interfaces
EOF

# Update task.json
UPDATED_JSON=$(jq --arg task "$CURRENT_TASK" \
                  --arg fw "$FRAMEWORK" \
                  --arg file "docs/task-${CURRENT_TASK}-${FRAMEWORK}.md" \
                  --arg source "$SOURCE:$TOOL_NAME" \
                  --arg time "$TIMESTAMP" '
  .tasks[$task] //= {} |
  .tasks[$task].doc_consulted //= {} |
  .tasks[$task].doc_consulted[$fw] = {
    "consulted": true,
    "file": $file,
    "source": $source,
    "timestamp": $time
  }
' "$TASK_FILE")

echo "$UPDATED_JSON" > "$TASK_FILE"

exit 0
