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

  REASON="📚 REACT CODE DETECTED - Documentation required.\n\n"
  REASON+="Consult ONE of these sources FIRST:\n\n"
  REASON+="LOCAL SKILLS:\n"
  REASON+="  • skills/react-19/SKILL.md (React 19 features)\n"
  REASON+="  • skills/react-hooks/SKILL.md (hooks patterns)\n"
  REASON+="  • skills/react-state/SKILL.md (state management)\n"
  REASON+="  • skills/solid-react/SKILL.md (architecture SOLID)\n"
  REASON+="  • skills/react-forms/SKILL.md (forms handling)\n"
  REASON+="  • skills/react-testing/SKILL.md (testing)\n"
  REASON+="  • skills/react-performance/SKILL.md (optimization)\n"
  REASON+="  • skills/react-tanstack-router/SKILL.md (routing)\n"
  REASON+="  • skills/react-shadcn/SKILL.md (UI components)\n"
  REASON+="  • skills/react-i18n/SKILL.md (internationalization)\n\n"
  REASON+="ONLINE DOCUMENTATION:\n"
  REASON+="  • mcp__context7__resolve-library-id + mcp__context7__query-docs\n"
  REASON+="  • mcp__exa__get_code_context_exa (code examples)\n\n"
  REASON+="After consulting documentation, retry your Write/Edit."

  cat << EOF
{
  "decision": "continue",
  "reason": "$REASON"
}
EOF
  exit 0
fi

# Not React code - allow
exit 0
