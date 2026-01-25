#!/bin/bash
# inject-apex-context.sh - PreToolUse hook for Task (agent launch)
# Forces agents to read AGENTS.md and task.json before starting work

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

# Build context to inject
CONTEXT=""

# Add AGENTS.md content if exists
if [[ -f "$AGENTS_FILE" ]]; then
  AGENTS_CONTENT=$(cat "$AGENTS_FILE")
  CONTEXT+="
## APEX RULES (from .claude/apex/AGENTS.md)
$AGENTS_CONTENT
"
fi

# Add task.json state if exists
if [[ -f "$TASK_FILE" ]]; then
  CURRENT_TASK=$(jq -r '.current_task // "1"' "$TASK_FILE")
  TASK_SUBJECT=$(jq -r --arg t "$CURRENT_TASK" '.tasks[$t].subject // "No subject"' "$TASK_FILE")
  TASK_PHASE=$(jq -r --arg t "$CURRENT_TASK" '.tasks[$t].phase // "analyze"' "$TASK_FILE")
  DOC_STATUS=$(jq -r --arg t "$CURRENT_TASK" '.tasks[$t].doc_consulted | to_entries | map(select(.value.consulted == true) | .key) | join(", ")' "$TASK_FILE" 2>/dev/null || echo "none")

  CONTEXT+="
## CURRENT STATE (from .claude/apex/task.json)
- **Current Task**: #$CURRENT_TASK - $TASK_SUBJECT
- **Phase**: $TASK_PHASE
- **Docs Consulted**: $DOC_STATUS

**READ task.json for full state before proceeding.**
"
fi

# Add expert recommendation based on project
if [[ -f "$PROJECT_ROOT/next.config.js" ]] || [[ -f "$PROJECT_ROOT/next.config.mjs" ]] || [[ -f "$PROJECT_ROOT/next.config.ts" ]]; then
  CONTEXT+="
## RECOMMENDED EXPERT
Use **nextjs-expert** agent for this project (Next.js detected).
"
elif [[ -f "$PROJECT_ROOT/composer.json" ]] && [[ -f "$PROJECT_ROOT/artisan" ]]; then
  CONTEXT+="
## RECOMMENDED EXPERT
Use **laravel-expert** agent for this project (Laravel detected).
"
elif [[ -f "$PROJECT_ROOT/Package.swift" ]] || ls "$PROJECT_ROOT"/*.xcodeproj 1>/dev/null 2>&1; then
  CONTEXT+="
## RECOMMENDED EXPERT
Use **swift-expert** agent for this project (Swift/iOS detected).
"
elif [[ -f "$PROJECT_ROOT/package.json" ]]; then
  if grep -q '"react"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
    CONTEXT+="
## RECOMMENDED EXPERT
Use **react-expert** agent for this project (React detected).
"
  fi
fi

# Output context as informational message (not blocking)
if [[ -n "$CONTEXT" ]]; then
  echo "📋 APEX Context Injected:"
  echo "$CONTEXT"
fi

exit 0
