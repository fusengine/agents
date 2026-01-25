#!/bin/bash
# track-skill-read.sh - PostToolUse hook for tracking skill reads
# Detects framework from skill path (not hardcoded)

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only track Read tool
if [[ "$TOOL_NAME" != "Read" ]]; then
  exit 0
fi

FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only track skill files
if [[ ! "$FILE_PATH" =~ skills/.*\.(md|txt)$ ]]; then
  exit 0
fi

# Detect framework from skill path (dynamic, not hardcoded)
FRAMEWORK=""
if [[ "$FILE_PATH" =~ tailwindcss|tailwind ]]; then FRAMEWORK="tailwind"
elif [[ "$FILE_PATH" =~ shadcn ]]; then FRAMEWORK="shadcn"
elif [[ "$FILE_PATH" =~ nextjs|next-expert ]]; then FRAMEWORK="nextjs"
elif [[ "$FILE_PATH" =~ react-expert|react- ]]; then FRAMEWORK="react"
elif [[ "$FILE_PATH" =~ laravel|php ]]; then FRAMEWORK="laravel"
elif [[ "$FILE_PATH" =~ swift|swiftui|apple ]]; then FRAMEWORK="swift"
elif [[ "$FILE_PATH" =~ design-expert ]]; then FRAMEWORK="design"
elif [[ "$FILE_PATH" =~ solid ]]; then FRAMEWORK="solid"
else FRAMEWORK="generic"
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
                  --arg file "$FILE_PATH" \
                  --arg time "$TIMESTAMP" '
  .tasks[$task] //= {} |
  .tasks[$task].doc_consulted //= {} |
  .tasks[$task].doc_consulted[$fw] = {
    "consulted": true,
    "file": $file,
    "source": "skill:Read",
    "timestamp": $time
  }
' "$TASK_FILE")

echo "$UPDATED_JSON" > "$TASK_FILE"
exit 0
