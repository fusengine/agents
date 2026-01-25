#!/bin/bash
# inject-subagent-context.sh - SubagentStart hook
# Injects APEX rules into sub-agent prompt via additionalContext

set -e

INPUT=$(cat)
HOOK_EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // empty')

# Only handle SubagentStart
if [[ "$HOOK_EVENT" != "SubagentStart" ]]; then
  exit 0
fi

# Get agent info
AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // empty')
AGENT_ID=$(echo "$INPUT" | jq -r '.agent_id // empty')

# Find project root
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-${PWD}}"
APEX_DIR="$PROJECT_ROOT/.claude/apex"
TASK_FILE="$APEX_DIR/task.json"
AGENTS_FILE="$APEX_DIR/AGENTS.md"

# No APEX structure = no injection needed
if [[ ! -d "$APEX_DIR" ]]; then
  exit 0
fi

# Get last 3 completed tasks for context
COMPLETED_TASKS=""
if [[ -f "$TASK_FILE" ]]; then
  COMPLETED_TASKS=$(jq -r '
    .tasks | to_entries
    | map(select(.value.status == "completed"))
    | sort_by(.value.completed_at)
    | reverse
    | .[0:3]
    | map("#" + .key + ": " + .value.subject)
    | join(", ")
  ' "$TASK_FILE" 2>/dev/null || echo "none")
fi

# Get pending tasks
PENDING_TASKS=""
if [[ -f "$TASK_FILE" ]]; then
  PENDING_TASKS=$(jq -r '
    .tasks | to_entries
    | map(select(.value.status == "pending"))
    | map("#" + .key + ": " + .value.subject)
    | join(", ")
  ' "$TASK_FILE" 2>/dev/null || echo "none")
fi

# Build context message
read -r -d '' CONTEXT << 'ENDCONTEXT' || true
## APEX Sub-Agent Instructions

You are a sub-agent in APEX workflow. Follow these rules:

### 1. Read Context First
- Read `.claude/apex/AGENTS.md` for full rules
- Read `.claude/apex/task.json` for task state

### 2. Check Completed Tasks
Last 3 completed: ${COMPLETED_TASKS}
- Read their notes in `.claude/apex/docs/task-{ID}-{subject}.md`

### 3. Available Tasks
Pending: ${PENDING_TASKS}

### 4. Before Starting Work
- Use `TaskList` to see all tasks
- Use `TaskUpdate(taskId, status: "in_progress")` before starting
- Read your agent skills and SOLID principles

### 5. SOLID Rules (Mandatory)
- Files < 100 lines (split at 90)
- Interfaces in `src/interfaces/`
- JSDoc/PHPDoc on every function

### 6. Research Before Code
- Use Context7 for official docs
- Use Exa for patterns/examples
- Write notes to `.claude/apex/docs/task-{ID}-{subject}.md`

### 7. When Done
- Use `TaskUpdate(taskId, status: "completed")`
- This triggers auto-commit
ENDCONTEXT

# Replace placeholders
CONTEXT="${CONTEXT//\$\{COMPLETED_TASKS\}/$COMPLETED_TASKS}"
CONTEXT="${CONTEXT//\$\{PENDING_TASKS\}/$PENDING_TASKS}"

# Escape for JSON
CONTEXT_ESCAPED=$(echo "$CONTEXT" | jq -Rs '.')

# Return JSON with additionalContext
cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SubagentStart",
    "additionalContext": $CONTEXT_ESCAPED
  }
}
EOF

exit 0
