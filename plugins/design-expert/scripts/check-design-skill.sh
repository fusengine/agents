#!/bin/bash
# check-design-skill.sh - PreToolUse hook for design-expert
# BLOCKS Write/Edit if documentation not consulted

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check .tsx/.jsx/.css files
if [[ ! "$FILE_PATH" =~ \.(tsx|jsx|css)$ ]]; then
  exit 0
fi

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(node_modules|dist|build|\.next)/ ]]; then
  exit 0
fi

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# SMART DETECTION: UI/Design code
if ! echo "$CONTENT" | grep -qE "(className=|class=|cn\(|cva\(|clsx\()" && \
   ! echo "$CONTENT" | grep -qE "(flex|grid|bg-|text-|p-[0-9]|m-[0-9]|w-|h-|rounded|shadow|border)" && \
   ! echo "$CONTENT" | grep -qE "(forwardRef|displayName|variants|motion\.|animate|framer-motion)" && \
   ! echo "$CONTENT" | grep -qE "(@apply|@layer|@tailwind|--tw-)" && \
   ! echo "$CONTENT" | grep -qE "(Button|Card|Dialog|Modal|Input|Select|Dropdown|Menu|Toast|Alert)" && \
   ! [[ "$FILE_PATH" =~ \.(css)$ ]]; then
  # Not design code - allow
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
  '.tasks[$task].doc_consulted.design.consulted // false' "$TASK_FILE")

if [[ "$DOC_CONSULTED" == "true" ]]; then
  exit 0
fi

# APEX mode + documentation NOT consulted - BLOCK
PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
REASON="🚫 DESIGN: Documentation not consulted! "
REASON+="Before writing UI code, you MUST read skills. "
REASON+="Read: $PLUGINS_DIR/design-expert/skills/designing-systems/SKILL.md or generating-components/SKILL.md. "
REASON+="After reading, retry Write/Edit."

jq -n --arg reason "$REASON" '{"decision": "block", "reason": $reason}'
exit 2
