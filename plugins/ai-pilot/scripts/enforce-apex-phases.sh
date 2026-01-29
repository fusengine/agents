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

# Get project root from FILE_PATH (not PWD)
# Walk up from file to find project root (has package.json, composer.json, etc.)
find_project_root() {
  local dir="$1"
  while [[ "$dir" != "/" ]]; do
    if [[ -f "$dir/package.json" ]] || [[ -f "$dir/composer.json" ]] || \
       [[ -f "$dir/Cargo.toml" ]] || [[ -f "$dir/go.mod" ]] || \
       [[ -f "$dir/Package.swift" ]] || [[ -d "$dir/.git" ]]; then
      echo "$dir"
      return
    fi
    dir=$(dirname "$dir")
  done
  echo "${PWD}"  # Fallback to PWD
}

PROJECT_ROOT=$(find_project_root "$(dirname "$FILE_PATH")")
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

# Check if APEX tracking is initialized - AUTO-INIT if missing
APEX_DIR="$PROJECT_ROOT/.claude/apex"
# Always ensure docs directory exists
mkdir -p "$APEX_DIR/docs"

if [[ ! -f "$TASK_FILE" ]]; then
  # Auto-initialize task.json
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  cat > "$TASK_FILE" << INITEOF
{
  "current_task": "1",
  "created_at": "$TIMESTAMP",
  "tasks": {
    "1": {
      "status": "in_progress",
      "started_at": "$TIMESTAMP",
      "doc_consulted": {}
    }
  }
}
INITEOF
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
REASON="🚫 APEX: Documentation not consulted for $FRAMEWORK! "
REASON+="Before writing $FRAMEWORK code, you MUST consult documentation. "
REASON+="STEP 1 - Consult ONE of these sources: "

PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
case "$FRAMEWORK" in
  react) SOURCES="Read $PLUGINS_DIR/react-expert/skills/react-19/SKILL.md" ;;
  nextjs) SOURCES="Read $PLUGINS_DIR/nextjs-expert/skills/nextjs-16/SKILL.md" ;;
  swift) SOURCES="Read $PLUGINS_DIR/swift-apple-expert/skills/swiftui-components/SKILL.md" ;;
  laravel) SOURCES="Read $PLUGINS_DIR/laravel-expert/skills/laravel-eloquent/SKILL.md" ;;
  tailwind) SOURCES="Read $PLUGINS_DIR/tailwindcss/skills/tailwindcss-v4/SKILL.md" ;;
  design) SOURCES="Read $PLUGINS_DIR/design-expert/skills/designing-systems/SKILL.md" ;;
  *) SOURCES="mcp__context7__query-docs, mcp__exa__get_code_context_exa" ;;
esac

REASON+="Sources: $SOURCES. After consulting, retry Write/Edit."

# Use hookSpecificOutput format
jq -n --arg reason "$REASON" '{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": $reason
  }
}'
exit 0
