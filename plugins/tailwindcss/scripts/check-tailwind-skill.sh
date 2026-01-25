#!/bin/bash
# check-tailwind-skill.sh - PreToolUse hook for tailwindcss-expert
# BLOCKS Write/Edit if documentation not consulted

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(node_modules|dist|build|\.next)/ ]]; then
  exit 0
fi

# Check Tailwind config files
if [[ "$FILE_PATH" =~ tailwind\.config\.(js|ts|mjs)$ ]]; then
  # Always check for Tailwind config
  :
elif [[ "$FILE_PATH" =~ \.css$ ]]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')
  # SMART DETECTION: Tailwind CSS
  if ! echo "$CONTENT" | grep -qE "(@theme|@utility|@variant|@import|@config|--tw-)" && \
     ! echo "$CONTENT" | grep -qE "(@tailwind|@apply|@layer|@screen)" && \
     ! echo "$CONTENT" | grep -qE "(theme\(|config\()"; then
    # Not Tailwind code - allow
    exit 0
  fi
else
  # Not a CSS or config file - allow
  exit 0
fi

# Get project root from FILE_PATH
find_project_root() {
  local dir="$1"
  while [[ "$dir" != "/" ]]; do
    if [[ -f "$dir/package.json" ]] || [[ -d "$dir/.git" ]]; then
      echo "$dir"
      return
    fi
    dir=$(dirname "$dir")
  done
  echo "${PWD}"
}

PROJECT_ROOT=$(find_project_root "$(dirname "$FILE_PATH")")
TASK_FILE="$PROJECT_ROOT/.claude/apex/task.json"

# No task.json = not in APEX mode = allow freely
if [[ ! -f "$TASK_FILE" ]]; then
  exit 0
fi

# In APEX mode - check if doc was consulted
CURRENT_TASK=$(jq -r '.current_task // "1"' "$TASK_FILE")
DOC_CONSULTED=$(jq -r --arg task "$CURRENT_TASK" \
  '.tasks[$task].doc_consulted.tailwind.consulted // false' "$TASK_FILE")

if [[ "$DOC_CONSULTED" == "true" ]]; then
  exit 0
fi

# APEX mode + documentation NOT consulted - BLOCK
PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
DOCS_DIR="$PROJECT_ROOT/.claude/apex/docs"
REASON="🚫 APEX BLOCK: Tailwind documentation not consulted! "
REASON+="CONSULT ONE: "
REASON+="A) Read: $PLUGINS_DIR/tailwindcss/skills/tailwindcss-v4/SKILL.md | "
REASON+="B) MCP: mcp__context7__query-docs (topic: tailwind) | "
REASON+="C) MCP: mcp__exa__web_search_exa (query: tailwind css docs). "
REASON+="THEN: Write learnings to $DOCS_DIR/task-${CURRENT_TASK}-research.md. "
REASON+="Auto-tracked in: $TASK_FILE. Retry after consulting."

jq -n --arg reason "$REASON" '{"decision": "block", "reason": $reason}'
exit 2
