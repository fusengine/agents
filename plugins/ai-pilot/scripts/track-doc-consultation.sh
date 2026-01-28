#!/bin/bash
# track-doc-consultation.sh - PostToolUse hook for doc consultation tracking
# Updates .claude/apex/task.json when Context7, Exa, or skills are consulted
set -euo pipefail

SHARED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../_shared/scripts" && pwd)"
source "$SHARED_DIR/framework-detection.sh"
source "$SHARED_DIR/check-skill-common.sh"
source "$SHARED_DIR/apex-task-helpers.sh"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Determine source and framework based on tool
case "$TOOL_NAME" in
  mcp__context7__query-docs|mcp__context7__resolve-library-id)
    FRAMEWORK=$(echo "$INPUT" | jq -r '.tool_input.libraryId // .tool_input.libraryName // empty')
    FRAMEWORK=$(detect_framework_from_string "$FRAMEWORK")
    SOURCE="context7"
    ;;
  mcp__exa__get_code_context_exa|mcp__exa__web_search_exa)
    QUERY=$(echo "$INPUT" | jq -r '.tool_input.query // empty')
    FRAMEWORK=$(detect_framework_from_string "$QUERY")
    SOURCE="exa"
    ;;
  Read)
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
    [[ ! "$FILE_PATH" =~ skills/.*\.md$ ]] && exit 0
    FRAMEWORK=$(detect_framework_from_string "$FILE_PATH")
    SOURCE="skill"
    ;;
  *) exit 0 ;;
esac

# Find project root
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
if [[ -n "$FILE_PATH" ]]; then
  PROJECT_ROOT=$(find_project_root "$(dirname "$FILE_PATH")" "package.json" "composer.json" ".git")
else
  PROJECT_ROOT="${PWD}"
fi

APEX_DIR="$PROJECT_ROOT/.claude/apex"
DOCS_DIR="$APEX_DIR/docs"
TASK_FILE="$APEX_DIR/task.json"
mkdir -p "$DOCS_DIR"

# Get or init current task
if [[ -f "$TASK_FILE" ]]; then
  CURRENT_TASK=$(jq -r '.current_task // "1"' "$TASK_FILE")
else
  CURRENT_TASK="1"
  echo '{"current_task":"1","tasks":{}}' > "$TASK_FILE"
fi

# Create doc summary
DOC_FILE="$DOCS_DIR/task-${CURRENT_TASK}-${FRAMEWORK}.md"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TOOL_OUTPUT=$(echo "$INPUT" | jq -r '.tool_output // empty' | head -c 3000)

cat > "$DOC_FILE" << EOF
# Task $CURRENT_TASK - ${FRAMEWORK^} Documentation
## Consulted: $TIMESTAMP | Source: $SOURCE:$TOOL_NAME
## Key Info
$(echo "$TOOL_OUTPUT" | head -30)
EOF

# Update task.json
apex_task_doc_consulted "$TASK_FILE" "$CURRENT_TASK" "$FRAMEWORK" "$SOURCE:$TOOL_NAME" "docs/task-${CURRENT_TASK}-${FRAMEWORK}.md"

exit 0
