#!/bin/bash
# check-design-skill.sh - PreToolUse hook for design-expert
# Blocks Write/Edit on UI components if no skill was consulted

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check component files
if [[ ! "$FILE_PATH" =~ \.(tsx|jsx)$ ]]; then
  exit 0
fi

# Check if file is in components/ or ui/ directory
if [[ "$FILE_PATH" =~ /components/ ]] || [[ "$FILE_PATH" =~ /ui/ ]]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

  # Check for UI patterns
  if echo "$CONTENT" | grep -qE "(className=|tailwind|Button|Card|Modal|Dialog|Form|Input)"; then
    cat << 'EOF'
{
  "decision": "block",
  "reason": "⚠️ SKILL REQUIRED: Before writing UI components, you MUST consult design skills.\n\nINSTRUCTION: Read one of these skills:\n- skills/design-system/SKILL.md (design tokens)\n- skills/accessibility/SKILL.md (WCAG 2.2)\n- skills/animations/SKILL.md (Framer Motion)\n\nAlso consider using:\n- mcp__shadcn__search_items_in_registries for existing components\n- mcp__magic__21st_magic_component_builder for inspiration\n\nThen retry your Write/Edit operation."
}
EOF
    exit 2
  fi
fi

exit 0
