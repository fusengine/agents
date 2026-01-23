#!/bin/bash
# check-tailwind-skill.sh - PreToolUse hook for tailwindcss
# Blocks Write/Edit on CSS/config files if no skill was consulted

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Check Tailwind config or CSS files
if [[ "$FILE_PATH" =~ tailwind\.config\.(js|ts|mjs)$ ]] || [[ "$FILE_PATH" =~ \.css$ ]]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

  # Check for Tailwind v4 patterns
  if echo "$CONTENT" | grep -qE "(@theme|@utility|@variant|@import|@config|--tw-)"; then
    cat << 'EOF'
{
  "decision": "block",
  "reason": "⚠️ SKILL REQUIRED: Before writing Tailwind CSS v4 code, you MUST consult a skill first.\n\nINSTRUCTION: Read one of these skills:\n- skills/tailwindcss-v4/SKILL.md (v4 core features)\n- skills/tailwindcss-core/SKILL.md (@theme, directives)\n- skills/tailwindcss-custom-styles/SKILL.md (@utility, @variant)\n- skills/tailwindcss-responsive/SKILL.md (breakpoints)\n\nThen retry your Write/Edit operation."
}
EOF
    exit 2
  fi
fi

exit 0
