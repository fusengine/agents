#!/bin/bash
# check-nextjs-skill.sh - PreToolUse hook for nextjs-expert
# Forces documentation consultation (smart detection)

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
if [[ "$FILE_PATH" =~ /(node_modules|\.next|dist|build)/ ]]; then
  exit 0
fi

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# SMART DETECTION
IS_NEXTJS=false
IS_REACT=false

if echo "$CONTENT" | grep -qE "(use client|use server|generateMetadata|generateStaticParams|NextRequest|NextResponse)" || \
   echo "$CONTENT" | grep -qE "(from ['\"]next/|@next/)" || \
   [[ "$FILE_PATH" =~ /(page|layout|loading|error|not-found|route)\.(tsx|ts)$ ]]; then
  IS_NEXTJS=true
fi

if echo "$CONTENT" | grep -qE "(from ['\"]react['\"]|useState|useEffect|useRef|useMemo|useCallback|useContext|useReducer)" || \
   echo "$CONTENT" | grep -qE "(<[A-Z][a-zA-Z]*|<div|<span|<button|<input|<form)" || \
   echo "$CONTENT" | grep -qE "(React\.|jsx|tsx|className=)"; then
  IS_REACT=true
fi

if [[ "$IS_NEXTJS" == "false" && "$IS_REACT" == "false" ]]; then
  exit 0
fi

REASON="📚 "
if [[ "$IS_NEXTJS" == "true" ]]; then
  REASON+="NEXT.JS CODE DETECTED"
else
  REASON+="REACT CODE DETECTED"
fi
REASON+=" - Documentation required.\n\n"
REASON+="Consult ONE of these sources FIRST:\n\n"
PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
REASON+="Read skills from: "

if [[ "$IS_NEXTJS" == "true" ]]; then
  REASON+="$PLUGINS_DIR/nextjs-expert/skills/ (nextjs-16, nextjs-stack, solid-nextjs, prisma-7, better-auth, nextjs-zustand)"
fi
if [[ "$IS_REACT" == "true" ]]; then
  REASON+=" $PLUGINS_DIR/react-expert/skills/ (react-19, react-hooks, react-state, react-forms)"
fi

REASON+=". Then retry Write/Edit."

jq -n --arg reason "$REASON" '{"decision": "continue", "reason": $reason}'
exit 0
