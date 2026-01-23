#!/bin/bash
# enforce-apex-phases.sh - PreToolUse hook for ai-pilot
# BLOCKS direct Write/Edit if documentation not consulted for current task
# Checks .claude/apex/task.json for doc_consulted status

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check code files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java|vue|svelte|css)$ ]]; then
  exit 0
fi

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(node_modules|vendor|dist|build|\.next|DerivedData|Pods|\.build)/ ]]; then
  exit 0
fi

# Allow if running inside a subagent (expert-agent context)
if [[ -f "/tmp/.claude-expert-active" ]]; then
  exit 0
fi

# Get project root and task file
PROJECT_ROOT="${PWD}"
TASK_FILE="$PROJECT_ROOT/.claude/apex/task.json"

# Detect framework from file path and content
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')
FRAMEWORK=""

# Detect framework
if [[ "$FILE_PATH" =~ \.(tsx|jsx)$ ]] || echo "$CONTENT" | grep -qE "(from ['\"]react|useState|useEffect|className=)"; then
  if [[ "$FILE_PATH" =~ (page|layout|loading|error|route)\.(ts|tsx)$ ]] || echo "$CONTENT" | grep -qE "(use client|use server|NextRequest)"; then
    FRAMEWORK="nextjs"
  else
    FRAMEWORK="react"
  fi
elif [[ "$FILE_PATH" =~ \.swift$ ]]; then
  FRAMEWORK="swift"
elif [[ "$FILE_PATH" =~ \.php$ ]]; then
  FRAMEWORK="laravel"
elif [[ "$FILE_PATH" =~ \.css$ ]] || echo "$CONTENT" | grep -qE "(@tailwind|@apply|@theme)"; then
  FRAMEWORK="tailwind"
elif echo "$CONTENT" | grep -qE "(className=|cn\(|cva\()"; then
  FRAMEWORK="design"
else
  FRAMEWORK="generic"
fi

# Check if APEX tracking is initialized
APEX_DIR="$PROJECT_ROOT/.claude/apex"
if [[ ! -d "$APEX_DIR" ]]; then
  cat << EOF
{
  "decision": "block",
  "reason": "🚫 APEX: Tracking not initialized!\n\nBefore writing code, initialize APEX tracking:\n\n  bash ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/ai-pilot/scripts/init-apex-tracking.sh\n\nOr manually:\n  mkdir -p .claude/apex/docs\n  echo '{\"current_task\":\"1\",\"tasks\":{\"1\":{\"status\":\"in_progress\",\"doc_consulted\":{}}}}' > .claude/apex/task.json\n\nThen consult documentation for $FRAMEWORK before writing code."
}
EOF
  exit 2
fi

# Check if task.json exists and doc was consulted
if [[ -f "$TASK_FILE" ]]; then
  CURRENT_TASK=$(jq -r '.current_task // "1"' "$TASK_FILE")
  DOC_CONSULTED=$(jq -r --arg task "$CURRENT_TASK" --arg fw "$FRAMEWORK" \
    '.tasks[$task].doc_consulted[$fw].consulted // false' "$TASK_FILE")

  if [[ "$DOC_CONSULTED" == "true" ]]; then
    # Documentation was consulted, allow write
    exit 0
  fi
fi

# Documentation NOT consulted - BLOCK
REASON="🚫 APEX: Documentation not consulted for $FRAMEWORK!\n\n"
REASON+="Before writing $FRAMEWORK code, you MUST consult documentation.\n\n"
REASON+="STEP 1 - Consult ONE of these sources:\n"

case "$FRAMEWORK" in
  react)
    REASON+="  • mcp__context7__query-docs (libraryId: '/vercel/react')\n"
    REASON+="  • mcp__exa__get_code_context_exa (query: 'react hooks patterns')\n"
    REASON+="  • Read skills/react-*/SKILL.md\n"
    ;;
  nextjs)
    REASON+="  • mcp__context7__query-docs (libraryId: '/vercel/next.js')\n"
    REASON+="  • mcp__exa__get_code_context_exa (query: 'nextjs app router')\n"
    REASON+="  • Read skills/nextjs-*/SKILL.md\n"
    ;;
  swift)
    REASON+="  • mcp__apple-docs__search_apple_docs\n"
    REASON+="  • mcp__context7__query-docs (Swift/SwiftUI)\n"
    REASON+="  • Read skills/swift-*/SKILL.md\n"
    ;;
  laravel)
    REASON+="  • mcp__context7__query-docs (libraryId: '/laravel/laravel')\n"
    REASON+="  • mcp__exa__get_code_context_exa (query: 'laravel')\n"
    REASON+="  • Read skills/laravel-*/SKILL.md\n"
    ;;
  tailwind)
    REASON+="  • mcp__context7__query-docs (libraryId: '/tailwindlabs/tailwindcss')\n"
    REASON+="  • mcp__exa__get_code_context_exa (query: 'tailwind css')\n"
    REASON+="  • Read skills/tailwindcss-*/SKILL.md\n"
    ;;
  design)
    REASON+="  • mcp__shadcn__search_items_in_registries\n"
    REASON+="  • mcp__magic__21st_magic_component_builder\n"
    REASON+="  • Read skills/design-*/SKILL.md\n"
    ;;
  *)
    REASON+="  • mcp__context7__query-docs\n"
    REASON+="  • mcp__exa__get_code_context_exa\n"
    ;;
esac

REASON+="\nSTEP 2 - After consulting, retry your Write/Edit.\n"
REASON+="\nThe system will track your consultation in:\n"
REASON+="  .claude/apex/task.json\n"
REASON+="  .claude/apex/docs/task-{ID}-${FRAMEWORK}.md"

cat << EOF
{
  "decision": "block",
  "reason": "$REASON"
}
EOF
exit 2
