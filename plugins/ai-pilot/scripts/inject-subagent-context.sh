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

# Read AGENTS.md content if exists
AGENTS_CONTENT=""
if [[ -f "$AGENTS_FILE" ]]; then
  AGENTS_CONTENT=$(cat "$AGENTS_FILE" | head -100)
fi

# Get task context (completed + pending)
COMPLETED_TASKS="none"; PENDING_TASKS="none"
if [[ -f "$TASK_FILE" ]]; then
  COMPLETED_TASKS=$(jq -r '.tasks|to_entries|map(select(.value.status=="completed"))|sort_by(.value.completed_at)|reverse|.[0:3]|map("#"+.key+": "+.value.subject)|join(", ")' "$TASK_FILE" 2>/dev/null || echo "none")
  PENDING_TASKS=$(jq -r '.tasks|to_entries|map(select(.value.status=="pending"))|map("#"+.key+": "+.value.subject)|join(", ")' "$TASK_FILE" 2>/dev/null || echo "none")
fi

# Build context message
read -r -d '' CONTEXT << 'ENDCONTEXT' || true
## APEX Sub-Agent Instructions

You are a sub-agent in APEX workflow. Follow these rules:

### 1. AGENTS.md Rules (Injected)
${AGENTS_CONTENT}

### 2. Task Context
- Last completed: ${COMPLETED_TASKS}
- Pending: ${PENDING_TASKS}

### 3. Before Starting Work
- Use `TaskUpdate(taskId, status: "in_progress")` before starting

### 4. SOLID Rules
- Files < 100 lines | Interfaces in `src/interfaces/` | JSDoc/PHPDoc required

### 5. Research Before Code
- Use Context7/Exa for docs | Write notes to `.claude/apex/docs/`

### 6. When Done
- `TaskUpdate(taskId, status: "completed")` triggers auto-commit
ENDCONTEXT

# Replace placeholders
CONTEXT="${CONTEXT//\$\{AGENTS_CONTENT\}/$AGENTS_CONTENT}"
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
