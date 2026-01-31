#!/bin/bash
# sync-task-tracking.sh - PostToolUse hook for TaskCreate/TaskUpdate
# Synchronizes Claude's task tools with APEX task.json + auto-commit on complete
set -euo pipefail

# Resolve shared scripts: try marketplace first, fallback to relative path
MARKETPLACE_SHARED="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins/_shared/scripts"
RELATIVE_SHARED="$(dirname "${BASH_SOURCE[0]}")/../../_shared/scripts"
if [[ -d "$MARKETPLACE_SHARED" ]]; then
  SHARED_DIR="$MARKETPLACE_SHARED"
elif [[ -d "$RELATIVE_SHARED" ]]; then
  SHARED_DIR="$(cd "$RELATIVE_SHARED" && pwd)"
else
  echo "Warning: _shared scripts not found" >&2
  exit 0
fi
source "$SHARED_DIR/locking-core.sh"
source "$SHARED_DIR/apex-task-helpers.sh"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

[[ "$TOOL_NAME" != "TaskCreate" && "$TOOL_NAME" != "TaskUpdate" ]] && exit 0

PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-${PWD}}"
TASK_FILE="$PROJECT_ROOT/.claude/apex/task.json"
[[ ! -f "$TASK_FILE" ]] && exit 0

# Use shared locking
LOCKS_DIR="$PROJECT_ROOT/.claude/apex"
trap 'release_lock "apex-task"' EXIT
acquire_lock "apex-task" 10 || exit 0

# Handle TaskCreate
if [[ "$TOOL_NAME" == "TaskCreate" ]]; then
  SUBJECT=$(echo "$INPUT" | jq -r '.tool_input.subject // empty')
  DESC=$(echo "$INPUT" | jq -r '.tool_input.description // empty')
  TASK_ID=$(echo "$INPUT" | jq -r '.tool_response.id // empty')
  [[ -z "$TASK_ID" ]] && TASK_ID=$(jq -r '[.tasks | keys[] | tonumber] | max + 1 // 1' "$TASK_FILE")
  apex_task_create "$TASK_FILE" "$TASK_ID" "$SUBJECT" "$DESC"
  exit 0
fi

# Handle TaskUpdate
TASK_ID=$(echo "$INPUT" | jq -r '.tool_input.taskId // empty')
NEW_STATUS=$(echo "$INPUT" | jq -r '.tool_input.status // empty')
SUBJECT=$(echo "$INPUT" | jq -r '.tool_input.subject // empty')
DESC=$(echo "$INPUT" | jq -r '.tool_input.description // empty')
BLOCKED=$(echo "$INPUT" | jq -r '.tool_input.addBlockedBy // [] | join(",")')

[[ -z "$TASK_ID" ]] && exit 0

if [[ "$NEW_STATUS" == "in_progress" ]]; then
  [[ -z "$SUBJECT" ]] && SUBJECT=$(jq -r --arg t "$TASK_ID" '.tasks[$t].subject // "Task #" + $t' "$TASK_FILE")
  apex_task_start "$TASK_FILE" "$TASK_ID" "$SUBJECT" "$DESC" "$BLOCKED"
fi

if [[ "$NEW_STATUS" == "completed" ]]; then
  cd "$PROJECT_ROOT"

  # Mark task as completed in task.json
  apex_task_complete "$TASK_FILE" "$TASK_ID"

  # Check if there are changes to commit
  if [[ -z $(git status --porcelain 2>/dev/null) ]]; then
    cat << 'EOF'
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"✅ Task completed. No changes to commit."}}
EOF
    exit 0
  fi

  # Request Claude to run smart commit via /fuse-commit-pro:commit
  SUBJECT=$(jq -r --arg t "$TASK_ID" '.tasks[$t].subject // "Task"' "$TASK_FILE")
  cat << EOF
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"✅ Task #$TASK_ID completed: $SUBJECT\n\n📦 Changes detected. MANDATORY: Run /fuse-commit-pro:commit to commit with smart detection."}}
EOF
fi

exit 0
