#!/bin/bash
# track-skill-read.sh - PostToolUse hook for tracking skill reads
# WORKS ALWAYS (session-based + APEX)

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
FRAMEWORK="generic"
if [[ "$FILE_PATH" =~ tailwindcss|tailwind ]]; then FRAMEWORK="tailwind"
elif [[ "$FILE_PATH" =~ shadcn ]]; then FRAMEWORK="shadcn"
elif [[ "$FILE_PATH" =~ nextjs|next-expert ]]; then FRAMEWORK="nextjs"
elif [[ "$FILE_PATH" =~ react-expert|react- ]]; then FRAMEWORK="react"
elif [[ "$FILE_PATH" =~ laravel|php ]]; then FRAMEWORK="laravel"
elif [[ "$FILE_PATH" =~ swift|swiftui|apple ]]; then FRAMEWORK="swift"
elif [[ "$FILE_PATH" =~ design-expert ]]; then FRAMEWORK="design"
elif [[ "$FILE_PATH" =~ solid ]]; then FRAMEWORK="solid"
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# SESSION-BASED TRACKING (extract session_id from JSON stdin)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
[[ -z "$SESSION_ID" ]] && SESSION_ID="fallback-$$"
TRACKING_DIR="/tmp/claude-skill-tracking"
mkdir -p "$TRACKING_DIR"
TRACKING_FILE="$TRACKING_DIR/$FRAMEWORK-$SESSION_ID"
echo "$TIMESTAMP skill:Read $FILE_PATH" >> "$TRACKING_FILE"

# Also track "generic" for any skill read (allows general-purpose agent)
if [[ "$FRAMEWORK" != "generic" ]]; then
  GENERIC_FILE="$TRACKING_DIR/generic-$SESSION_ID"
  echo "$TIMESTAMP skill:Read $FILE_PATH" >> "$GENERIC_FILE"
fi

# APEX tracking (bonus - if task.json exists)
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-${PWD}}"
TASK_FILE="$PROJECT_ROOT/.claude/apex/task.json"

if [[ -f "$TASK_FILE" ]]; then
  CURRENT_TASK=$(jq -r '.current_task // "1"' "$TASK_FILE")
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
fi

exit 0
