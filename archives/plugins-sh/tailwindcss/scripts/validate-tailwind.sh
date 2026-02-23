#!/bin/bash
# validate-tailwind.sh - PostToolUse hook for tailwindcss
# Validates Tailwind CSS best practices after Write/Edit

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
[[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]] && exit 0

# Skip if file doesn't exist
[[ ! -f "$FILE_PATH" ]] && exit 0

WARNINGS=""

# Check CSS files
if [[ "$FILE_PATH" =~ \.css$ ]]; then
  # Check for deprecated Tailwind v3 patterns
  if grep -qE "@tailwind (base|components|utilities)" "$FILE_PATH" 2>/dev/null; then
    WARNINGS+="Tailwind v4: @tailwind directives are deprecated - use @import 'tailwindcss'. "
  fi

  # Check for @apply overuse
  APPLY_COUNT=$(grep -c "@apply" "$FILE_PATH" 2>/dev/null || true)
  if [[ ${APPLY_COUNT:-0} -gt 10 ]]; then
    WARNINGS+="Excessive @apply usage ($APPLY_COUNT) - prefer utility classes directly. "
  fi
fi

# Check TSX/JSX files for long class strings
if [[ "$FILE_PATH" =~ \.(tsx|jsx)$ ]]; then
  LONG_CLASSES=$(grep -c 'className="[^"]\{150,\}"' "$FILE_PATH" 2>/dev/null || true)
  if [[ ${LONG_CLASSES:-0} -gt 0 ]]; then
    WARNINGS+="Very long className ($LONG_CLASSES lines) - extract to @utility or use cn(). "
  fi
fi

# Output warnings as hookSpecificOutput if any
if [[ -n "$WARNINGS" ]]; then
  ESCAPED=$(echo "$WARNINGS" | jq -Rs '.')
  cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": $ESCAPED
  }
}
EOF
fi

exit 0
