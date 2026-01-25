#!/bin/bash
# check-nextjs-skill.sh - PreToolUse hook for nextjs-expert
# BLOCKS Write/Edit if documentation not consulted

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check .tsx/.ts/.jsx/.js files
if [[ ! "$FILE_PATH" =~ \.(tsx|ts|jsx|js)$ ]]; then
  exit 0
fi

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(node_modules|dist|build|\.next)/ ]]; then
  exit 0
fi

# Get content for smart detection
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# SMART DETECTION: Only block if it's actual Next.js code
if ! echo "$CONTENT" | grep -qE "(use client|use server|NextRequest|NextResponse)" && \
   ! echo "$CONTENT" | grep -qE "(from ['\"]next|getServerSideProps|getStaticProps)" && \
   ! [[ "$FILE_PATH" =~ (page|layout|loading|error|route|middleware)\.(ts|tsx)$ ]]; then
  # Not Next.js code - allow
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
  '.tasks[$task].doc_consulted.nextjs.consulted // false' "$TASK_FILE")

if [[ "$DOC_CONSULTED" == "true" ]]; then
  exit 0
fi

# APEX mode + documentation NOT consulted - BLOCK
PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
REASON="🚫 NEXT.JS: Documentation not consulted! "
REASON+="Before writing Next.js code, you MUST read skills. "
REASON+="Read: $PLUGINS_DIR/nextjs-expert/skills/nextjs-16/SKILL.md or solid-nextjs/SKILL.md. "
REASON+="After reading, retry Write/Edit."

jq -n --arg reason "$REASON" '{"decision": "block", "reason": $reason}'
exit 2
