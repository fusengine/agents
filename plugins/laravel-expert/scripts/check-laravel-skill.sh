#!/bin/bash
# check-laravel-skill.sh - PreToolUse hook for laravel-expert
# BLOCKS Write/Edit if documentation not consulted

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check .php files
if [[ ! "$FILE_PATH" =~ \.php$ ]]; then
  exit 0
fi

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(vendor|storage|bootstrap/cache)/ ]]; then
  exit 0
fi

# Get project root from FILE_PATH
find_project_root() {
  local dir="$1"
  while [[ "$dir" != "/" ]]; do
    if [[ -f "$dir/composer.json" ]] || [[ -f "$dir/artisan" ]] || [[ -d "$dir/.git" ]]; then
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
  '.tasks[$task].doc_consulted.laravel.consulted // false' "$TASK_FILE")

if [[ "$DOC_CONSULTED" == "true" ]]; then
  exit 0
fi

# APEX mode + documentation NOT consulted - BLOCK
PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
REASON="🚫 LARAVEL: Documentation not consulted! "
REASON+="Before writing Laravel code, you MUST read skills. "
REASON+="Read: $PLUGINS_DIR/laravel-expert/skills/laravel-eloquent/SKILL.md or solid-php/SKILL.md. "
REASON+="After reading, retry Write/Edit."

jq -n --arg reason "$REASON" '{"decision": "block", "reason": $reason}'
exit 2
