#!/bin/bash
# check-nextjs-skill.sh - PreToolUse hook for nextjs-expert
# Blocks Write/Edit on Next.js files if no skill was consulted

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check Next.js/TypeScript files
if [[ ! "$FILE_PATH" =~ \.(tsx|ts|jsx|js)$ ]]; then
  exit 0
fi

# Check if file is in app/ or pages/ directory (Next.js specific)
if [[ "$FILE_PATH" =~ /app/ ]] || [[ "$FILE_PATH" =~ /pages/ ]]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

  # Check for Next.js specific patterns
  if echo "$CONTENT" | grep -qE "(use client|use server|generateMetadata|generateStaticParams|export.*default.*function|next/|@next/)"; then
    cat << 'EOF'
{
  "decision": "block",
  "reason": "⚠️ SKILL REQUIRED: Before writing Next.js code, you MUST consult a skill first.\n\nINSTRUCTION: Read one of these skills:\n- skills/nextjs-app-router/SKILL.md (App Router)\n- skills/nextjs-server-components/SKILL.md (Server Components)\n- skills/nextjs-data-fetching/SKILL.md (Data fetching)\n- skills/solid-nextjs/SKILL.md (architecture)\n\nThen retry your Write/Edit operation."
}
EOF
    exit 2
  fi
fi

exit 0
