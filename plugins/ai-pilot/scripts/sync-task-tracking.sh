#!/bin/bash
# sync-task-tracking.sh - PostToolUse hook for TaskCreate and TaskUpdate
# Synchronizes Claude's task tools with APEX task.json tracking
# Also auto-commits when a task is completed

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only handle TaskCreate and TaskUpdate
if [[ "$TOOL_NAME" != "TaskCreate" && "$TOOL_NAME" != "TaskUpdate" ]]; then
  exit 0
fi

# Find project root
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-${PWD}}"
TASK_FILE="$PROJECT_ROOT/.claude/apex/task.json"

# No task.json = not in APEX mode
if [[ ! -f "$TASK_FILE" ]]; then
  exit 0
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# ============================================
# Handle TaskCreate - Add new task to task.json
# ============================================
if [[ "$TOOL_NAME" == "TaskCreate" ]]; then
  TASK_SUBJECT=$(echo "$INPUT" | jq -r '.tool_input.subject // empty')
  TASK_DESCRIPTION=$(echo "$INPUT" | jq -r '.tool_input.description // empty')

  # Get task ID from tool result (Claude assigns it)
  TASK_ID=$(echo "$INPUT" | jq -r '.tool_result.id // empty')

  # If no ID in result, try to find next available ID
  if [[ -z "$TASK_ID" ]]; then
    TASK_ID=$(jq -r '[.tasks | keys[] | tonumber] | max + 1 // 1' "$TASK_FILE")
  fi

  # Add task to task.json
  UPDATED_JSON=$(jq --arg task "$TASK_ID" \
                    --arg time "$TIMESTAMP" \
                    --arg subject "$TASK_SUBJECT" \
                    --arg desc "$TASK_DESCRIPTION" '
    .tasks[$task] = {
      "subject": $subject,
      "description": $desc,
      "status": "pending",
      "phase": "pending",
      "created_at": $time,
      "doc_consulted": {},
      "files_modified": [],
      "blockedBy": []
    }
  ' "$TASK_FILE")
  echo "$UPDATED_JSON" > "$TASK_FILE"

  exit 0
fi

# ============================================
# Handle TaskUpdate - Update existing task
# ============================================
# Get task details from tool input
TASK_ID=$(echo "$INPUT" | jq -r '.tool_input.taskId // empty')
NEW_STATUS=$(echo "$INPUT" | jq -r '.tool_input.status // empty')
TASK_SUBJECT=$(echo "$INPUT" | jq -r '.tool_input.subject // empty')
TASK_DESCRIPTION=$(echo "$INPUT" | jq -r '.tool_input.description // empty')
BLOCKED_BY=$(echo "$INPUT" | jq -r '.tool_input.addBlockedBy // [] | join(",")')

if [[ -z "$TASK_ID" ]]; then
  exit 0
fi

# Handle task starting (in_progress)
if [[ "$NEW_STATUS" == "in_progress" ]]; then
  # Get existing subject if not provided
  if [[ -z "$TASK_SUBJECT" ]]; then
    TASK_SUBJECT=$(jq -r --arg task "$TASK_ID" '.tasks[$task].subject // "Task #" + $task' "$TASK_FILE")
  fi

  UPDATED_JSON=$(jq --arg task "$TASK_ID" \
                    --arg time "$TIMESTAMP" \
                    --arg subject "$TASK_SUBJECT" \
                    --arg desc "$TASK_DESCRIPTION" \
                    --arg blocked "$BLOCKED_BY" '
    .current_task = $task |
    .tasks[$task] //= {
      "subject": "",
      "description": "",
      "status": "in_progress",
      "phase": "analyze",
      "started_at": $time,
      "doc_consulted": {},
      "files_modified": [],
      "blockedBy": []
    } |
    .tasks[$task].status = "in_progress" |
    .tasks[$task].phase = "analyze" |
    .tasks[$task].started_at = $time |
    (if $subject != "" then .tasks[$task].subject = $subject else . end) |
    (if $desc != "" then .tasks[$task].description = $desc else . end) |
    (if $blocked != "" then .tasks[$task].blockedBy = ($blocked | split(",")) else . end)
  ' "$TASK_FILE")
  echo "$UPDATED_JSON" > "$TASK_FILE"
fi

# Handle task completed - auto-commit REQUIRED
if [[ "$NEW_STATUS" == "completed" ]]; then
  # Get task subject from task.json
  SAVED_SUBJECT=$(jq -r --arg task "$TASK_ID" '.tasks[$task].subject // empty' "$TASK_FILE")
  if [[ -z "$TASK_SUBJECT" ]]; then
    TASK_SUBJECT="${SAVED_SUBJECT:-Task #$TASK_ID}"
  fi

  cd "$PROJECT_ROOT"

  # Check if there are changes to commit
  if [[ -z $(git status --porcelain 2>/dev/null) ]]; then
    # NO CHANGES = BLOCK completion
    REASON="🚫 TASK COMPLETION BLOCKED: No changes to commit! "
    REASON+="Task #$TASK_ID cannot be marked as completed without code changes. "
    REASON+="Either: 1) Write code for this task, or 2) Skip this task if not needed."

    jq -n --arg reason "$REASON" '{"decision": "block", "reason": $reason}'
    exit 2
  fi

  # Stage all changes
  git add -A

  # Create commit with task reference
  COMMIT_MSG="feat(task-$TASK_ID): $TASK_SUBJECT"
  if git commit -m "$COMMIT_MSG" --no-verify 2>/dev/null; then
    # Commit succeeded - update task.json
    UPDATED_JSON=$(jq --arg task "$TASK_ID" \
                      --arg time "$TIMESTAMP" '
      .tasks[$task].status = "completed" |
      .tasks[$task].phase = "completed" |
      .tasks[$task].completed_at = $time
    ' "$TASK_FILE")
    echo "$UPDATED_JSON" > "$TASK_FILE"

    echo "✅ Auto-committed: $COMMIT_MSG"
  else
    # Commit failed - block
    REASON="🚫 COMMIT FAILED: Could not commit changes for task #$TASK_ID. "
    REASON+="Check git status and resolve any issues."

    jq -n --arg reason "$REASON" '{"decision": "block", "reason": $reason}'
    exit 2
  fi
fi

exit 0
