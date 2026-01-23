#!/bin/bash
# check-nextjs-skill.sh - PreToolUse hook for nextjs-expert
# Forces documentation consultation before writing Next.js/React code (smart detection)

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

# Get content for smart detection
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# SMART DETECTION: Only block if it's actual Next.js or React code
IS_NEXTJS=false
IS_REACT=false

# Detect Next.js specific patterns
if echo "$CONTENT" | grep -qE "(use client|use server|generateMetadata|generateStaticParams|NextRequest|NextResponse)" || \
   echo "$CONTENT" | grep -qE "(from ['\"]next/|@next/)" || \
   [[ "$FILE_PATH" =~ /(page|layout|loading|error|not-found|route)\.(tsx|ts)$ ]]; then
  IS_NEXTJS=true
fi

# Detect React patterns
if echo "$CONTENT" | grep -qE "(from ['\"]react['\"]|useState|useEffect|useRef|useMemo|useCallback|useContext|useReducer)" || \
   echo "$CONTENT" | grep -qE "(<[A-Z][a-zA-Z]*|<div|<span|<button|<input|<form)" || \
   echo "$CONTENT" | grep -qE "(React\.|jsx|tsx|className=)"; then
  IS_REACT=true
fi

# If neither Next.js nor React code detected, allow
if [[ "$IS_NEXTJS" == "false" && "$IS_REACT" == "false" ]]; then
  exit 0
fi

# Build block message with relevant skills
REASON="📚 "
if [[ "$IS_NEXTJS" == "true" ]]; then
  REASON+="NEXT.JS CODE DETECTED"
elif [[ "$IS_REACT" == "true" ]]; then
  REASON+="REACT CODE DETECTED"
fi
REASON+=" - Documentation required.\n\n"
REASON+="Consult ONE of these sources:\n\n"
REASON+="LOCAL SKILLS:\n"

if [[ "$IS_NEXTJS" == "true" ]]; then
  REASON+="  • skills/nextjs-16/SKILL.md (App Router, Server Components)\n"
  REASON+="  • skills/nextjs-stack/SKILL.md (full stack patterns)\n"
  REASON+="  • skills/solid-nextjs/SKILL.md (architecture SOLID)\n"
  REASON+="  • skills/prisma-7/SKILL.md (database)\n"
  REASON+="  • skills/better-auth/SKILL.md (authentication)\n"
  REASON+="  • skills/nextjs-zustand/SKILL.md (state management)\n"
  REASON+="  • skills/nextjs-tanstack-form/SKILL.md (forms)\n"
  REASON+="  • skills/nextjs-shadcn/SKILL.md (UI components)\n"
  REASON+="  • skills/nextjs-i18n/SKILL.md (internationalization)\n"
fi

if [[ "$IS_REACT" == "true" ]]; then
  REASON+="  • skills/react-19/SKILL.md (React 19 features)\n"
  REASON+="  • skills/react-hooks/SKILL.md (hooks patterns)\n"
  REASON+="  • skills/react-state/SKILL.md (state management)\n"
fi

REASON+="\nONLINE DOCUMENTATION:\n"
REASON+="  • mcp__context7__resolve-library-id + mcp__context7__query-docs\n"
REASON+="  • mcp__exa__get_code_context_exa (code examples)\n"
REASON+="  • mcp__exa__web_search_exa (latest docs)\n\n"
REASON+="After consulting documentation, retry your Write/Edit."

cat << EOF
{
  "decision": "block",
  "reason": "$REASON"
}
EOF

exit 2
