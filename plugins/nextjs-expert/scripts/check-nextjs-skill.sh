#!/bin/bash
# check-nextjs-skill.sh - PreToolUse hook for nextjs-expert
# BLOCKS Write/Edit if skill not consulted - WORKS ALWAYS (no APEX dependency)

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check .tsx/.ts/.jsx/.js files
if [[ ! "$FILE_PATH" =~ \.(tsx|ts|jsx|js)$ ]]; then
  exit 0
fi

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(node_modules|dist|build|\.next)/ ]]; then
  exit 0
fi

# Get content for smart detection
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# SMART DETECTION: Only block if it's actual Next.js code
if ! echo "$CONTENT" | grep -qE "(use client|use server|NextRequest|NextResponse)" && \
   ! echo "$CONTENT" | grep -qE "(from ['\"]next|getServerSideProps|getStaticProps)" && \
   ! [[ "$FILE_PATH" =~ (page|layout|loading|error|route|middleware)\.(ts|tsx)$ ]]; then
  # Not Next.js code - allow
  exit 0
fi

# Session-based tracking (extract session_id from JSON stdin)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
[[ -z "$SESSION_ID" ]] && SESSION_ID="fallback-$$"
TRACKING_DIR="/tmp/claude-skill-tracking"
TRACKING_FILE="$TRACKING_DIR/nextjs-$SESSION_ID"

# Check if skill was read in this session
if [[ -f "$TRACKING_FILE" ]]; then
  exit 0
fi

# Also check APEX task.json if it exists (bonus)
find_project_root() {
  local dir="$1"
  while [[ "$dir" != "/" ]]; do
    if [[ -f "$dir/package.json" ]] || [[ -d "$dir/.git" ]]; then
      echo "$dir"
      return
    fi
    dir=$(dirname "$dir")
  done
  echo "${PWD}"
}

PROJECT_ROOT=$(find_project_root "$(dirname "$FILE_PATH")")
TASK_FILE="$PROJECT_ROOT/.claude/apex/task.json"

if [[ -f "$TASK_FILE" ]]; then
  CURRENT_TASK=$(jq -r '.current_task // "1"' "$TASK_FILE")
  DOC_CONSULTED=$(jq -r --arg task "$CURRENT_TASK" \
    '.tasks[$task].doc_consulted.nextjs.consulted // false' "$TASK_FILE")

  if [[ "$DOC_CONSULTED" == "true" ]]; then
    exit 0
  fi
fi

# NOT consulted - BLOCK with official format
PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
REASON="BLOCKED: Next.js skill not consulted. "
REASON+="READ ONE: "
REASON+="1) $PLUGINS_DIR/nextjs-expert/skills/solid-nextjs/SKILL.md | "
REASON+="2) $PLUGINS_DIR/nextjs-expert/skills/nextjs-16/SKILL.md | "
REASON+="3) Use mcp__context7__query-docs (topic: nextjs). "
REASON+="After reading, retry your Write/Edit."

cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "$REASON"
  }
}
EOF
exit 0
