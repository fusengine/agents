#!/bin/bash
# check-tailwind-skill.sh - PreToolUse hook for tailwindcss
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

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(node_modules|dist|build|\.next)/ ]]; then
  exit 0
fi

# Check Tailwind config files
if [[ "$FILE_PATH" =~ tailwind\.config\.(js|ts|mjs)$ ]]; then
  REASON="📚 TAILWIND CONFIG DETECTED - Documentation required.\n\n"
  REASON+="Consult ONE of these sources FIRST:\n\n"
  REASON+="LOCAL SKILLS:\n"
  REASON+="  • skills/tailwindcss-v4/SKILL.md (v4 migration)\n"
  REASON+="  • skills/tailwindcss-core/SKILL.md (@theme, directives)\n"
  REASON+="  • skills/tailwindcss-custom-styles/SKILL.md (@utility, @variant)\n\n"
  REASON+="ONLINE DOCUMENTATION:\n"
  REASON+="  • mcp__context7__resolve-library-id + mcp__context7__query-docs\n"
  REASON+="  • mcp__exa__get_code_context_exa (Tailwind examples)\n\n"
  REASON+="After consulting documentation, retry your Write/Edit."

  cat << EOF
{
  "decision": "block",
  "reason": "$REASON"
}
EOF
  exit 2
fi

# Check CSS files
if [[ "$FILE_PATH" =~ \.css$ ]]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

  # SMART DETECTION: Tailwind CSS
  if echo "$CONTENT" | grep -qE "(@theme|@utility|@variant|@import|@config|--tw-)" || \
     echo "$CONTENT" | grep -qE "(@tailwind|@apply|@layer|@screen)" || \
     echo "$CONTENT" | grep -qE "(theme\(|config\()"; then

    REASON="📚 TAILWIND CSS DETECTED - Documentation required.\n\n"
    REASON+="Consult ONE of these sources FIRST:\n\n"
    REASON+="LOCAL SKILLS:\n"
    REASON+="  • skills/tailwindcss-v4/SKILL.md (v4 core features)\n"
    REASON+="  • skills/tailwindcss-core/SKILL.md (@theme, directives)\n"
    REASON+="  • skills/tailwindcss-custom-styles/SKILL.md (@utility, @variant)\n"
    REASON+="  • skills/tailwindcss-responsive/SKILL.md (breakpoints)\n"
    REASON+="  • skills/tailwindcss-layout/SKILL.md (flex, grid)\n"
    REASON+="  • skills/tailwindcss-typography/SKILL.md (text, fonts)\n\n"
    REASON+="ONLINE DOCUMENTATION:\n"
    REASON+="  • mcp__context7__resolve-library-id + mcp__context7__query-docs\n"
    REASON+="  • mcp__exa__get_code_context_exa (Tailwind examples)\n\n"
    REASON+="After consulting documentation, retry your Write/Edit."

    cat << EOF
{
  "decision": "block",
  "reason": "$REASON"
}
EOF
    exit 2
  fi
fi

exit 0
