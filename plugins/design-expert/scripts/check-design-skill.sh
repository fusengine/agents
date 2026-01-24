#!/bin/bash
# check-design-skill.sh - PreToolUse hook for design-expert
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

# Only check .tsx/.jsx/.css files
if [[ ! "$FILE_PATH" =~ \.(tsx|jsx|css)$ ]]; then
  exit 0
fi

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(node_modules|dist|build|\.next)/ ]]; then
  exit 0
fi

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# SMART DETECTION: UI/Design code
if echo "$CONTENT" | grep -qE "(className=|class=|cn\(|cva\(|clsx\()" || \
   echo "$CONTENT" | grep -qE "(flex|grid|bg-|text-|p-[0-9]|m-[0-9]|w-|h-|rounded|shadow|border)" || \
   echo "$CONTENT" | grep -qE "(forwardRef|displayName|variants|motion\.|animate|framer-motion)" || \
   echo "$CONTENT" | grep -qE "(@apply|@layer|@tailwind|--tw-)" || \
   echo "$CONTENT" | grep -qE "(Button|Card|Dialog|Modal|Input|Select|Dropdown|Menu|Toast|Alert)" || \
   [[ "$FILE_PATH" =~ \.(css)$ ]]; then

  REASON="📚 UI/DESIGN CODE DETECTED - Documentation required.\n\n"
  REASON+="Consult ONE of these sources FIRST:\n\n"
  REASON+="LOCAL SKILLS:\n"
  REASON+="  • skills/designing-systems/SKILL.md (design tokens, theming)\n"
  REASON+="  • skills/generating-components/SKILL.md (component patterns)\n"
  REASON+="  • skills/adding-animations/SKILL.md (Framer Motion)\n"
  REASON+="  • skills/validating-accessibility/SKILL.md (WCAG 2.2)\n\n"
  REASON+="ONLINE TOOLS:\n"
  REASON+="  • mcp__shadcn__search_items_in_registries (existing components)\n"
  REASON+="  • mcp__magic__21st_magic_component_builder (AI component builder)\n\n"
  REASON+="ONLINE DOCUMENTATION:\n"
  REASON+="  • mcp__context7__query-docs (Tailwind, Framer Motion docs)\n"
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

exit 0
