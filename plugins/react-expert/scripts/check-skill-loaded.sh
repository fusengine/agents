#!/bin/bash
# check-skill-loaded.sh - PreToolUse hook for react-expert
# Marks expert context + Forces documentation consultation (smart detection)

set -e

# Mark that we're in expert agent context (allows bypass of ai-pilot block)
touch /tmp/.claude-expert-active

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

# SMART DETECTION: Only block if it's actual React code
if echo "$CONTENT" | grep -qE "(from ['\"]react['\"]|useState|useEffect|useRef|useMemo|useCallback|useContext|useReducer)" || \
   echo "$CONTENT" | grep -qE "(<[A-Z][a-zA-Z]*|<div|<span|<button|<input|<form|<section|<article)" || \
   echo "$CONTENT" | grep -qE "(React\.|jsx|tsx|className=)"; then

  PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
  REASON="📚 REACT CODE DETECTED. Read skills from: $PLUGINS_DIR/react-expert/skills/ (react-19, react-hooks, react-state, react-forms, react-testing, solid-react). Then retry Write/Edit."
  jq -n --arg reason "$REASON" '{"decision": "continue", "reason": $reason}'
  exit 0
fi

# Not React code - allow
exit 0
