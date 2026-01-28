#!/bin/bash
# sync-task-tracking.sh - PostToolUse hook for TaskCreate/TaskUpdate
# Synchronizes Claude's task tools with APEX task.json + auto-commit on complete
set -euo pipefail

SHARED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../_shared/scripts" && pwd)"
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
  if [[ -z $(git status --porcelain 2>/dev/null) ]]; then
    echo '{"decision":"block","reason":"No changes to commit for task completion"}' && exit 2
  fi
  SUBJECT=$(jq -r --arg t "$TASK_ID" '.tasks[$t].subject // "Task"' "$TASK_FILE")
  git add -A
  if git commit -m "feat(task-$TASK_ID): $SUBJECT" --no-verify 2>/dev/null; then
    apex_task_complete "$TASK_FILE" "$TASK_ID"
    echo "✅ Auto-committed: feat(task-$TASK_ID): $SUBJECT"
  else
    echo '{"decision":"block","reason":"Git commit failed"}' && exit 2
  fi
fi

exit 0
