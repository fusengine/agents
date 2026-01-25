#!/bin/bash
# inject-apex-context.sh - PreToolUse hook for Task (agent launch)
# Injects APEX rules into agent prompt via structured instruction

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only handle Task (agent launch)
if [[ "$TOOL_NAME" != "Task" ]]; then
  exit 0
fi

# Find project root
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-${PWD}}"
APEX_DIR="$PROJECT_ROOT/.claude/apex"
TASK_FILE="$APEX_DIR/task.json"
AGENTS_FILE="$APEX_DIR/AGENTS.md"

# No APEX structure = not in APEX mode
if [[ ! -d "$APEX_DIR" ]]; then
  exit 0
fi

# Get current task state
CURRENT_TASK="1"
TASK_SUBJECT=""
TASK_PHASE="analyze"
DOC_STATUS="none"

if [[ -f "$TASK_FILE" ]]; then
  CURRENT_TASK=$(jq -r '.current_task // "1"' "$TASK_FILE")
  TASK_SUBJECT=$(jq -r --arg t "$CURRENT_TASK" '.tasks[$t].subject // ""' "$TASK_FILE")
  TASK_PHASE=$(jq -r --arg t "$CURRENT_TASK" '.tasks[$t].phase // "analyze"' "$TASK_FILE")
  DOC_STATUS=$(jq -r --arg t "$CURRENT_TASK" '.tasks[$t].doc_consulted | to_entries | map(select(.value.consulted == true) | .key) | join(", ")' "$TASK_FILE" 2>/dev/null || echo "none")
fi

# Output instruction for agent
cat << EOF
⚠️ APEX MODE - Read .claude/apex/AGENTS.md for rules

Current: Task #$CURRENT_TASK - $TASK_SUBJECT (Phase: $TASK_PHASE)
Docs consulted: $DOC_STATUS

Agent must:
1. Read task.json → find last 3 completed tasks
2. Read their notes in docs/ (task-{ID}-{subject}.md)
3. TaskList → see pending tasks
4. TaskUpdate(in_progress) → before starting
5. Apply SOLID (files < 100 lines)
6. Write notes to docs/task-{ID}-{subject}.md
7. TaskUpdate(completed) → triggers auto-commit
EOF

exit 0
