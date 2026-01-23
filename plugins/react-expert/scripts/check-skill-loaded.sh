#!/bin/bash
# check-skill-loaded.sh - PreToolUse hook for react-expert
# Blocks Write/Edit on React files if no skill was consulted

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check React/TypeScript files
if [[ ! "$FILE_PATH" =~ \.(tsx|ts|jsx|js)$ ]]; then
  exit 0
fi

# Check if file contains React code
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# If it's a React component file, enforce skill check
if echo "$CONTENT" | grep -qE "(import.*React|from 'react'|from \"react\"|useState|useEffect|export.*function|export.*const.*=)"; then

  # Output instruction to load skill first
  cat << 'EOF'
{
  "decision": "block",
  "reason": "⚠️ SKILL REQUIRED: Before writing React code, you MUST consult a skill first.\n\nINSTRUCTION: Read one of these skills:\n- skills/solid-react/SKILL.md (architecture)\n- skills/react-19/SKILL.md (React 19 features)\n- skills/react-hooks/SKILL.md (hooks patterns)\n\nThen retry your Write/Edit operation."
}
EOF
  exit 2
fi

exit 0
