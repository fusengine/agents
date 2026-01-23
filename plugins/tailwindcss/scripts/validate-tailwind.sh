#!/bin/bash
# validate-tailwind.sh - PostToolUse hook for tailwindcss
# Validates Tailwind CSS best practices after Write/Edit

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Skip if file doesn't exist
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Check CSS files
if [[ "$FILE_PATH" =~ \.css$ ]]; then
  # Check for deprecated Tailwind v3 patterns
  if grep -qE "@tailwind (base|components|utilities)" "$FILE_PATH" 2>/dev/null; then
    echo "⚠️ Tailwind v4: @tailwind directives are deprecated"
    echo "INSTRUCTION: Use @import 'tailwindcss' instead"
  fi

  # Check for @apply overuse
  APPLY_COUNT=$(grep -c "@apply" "$FILE_PATH" 2>/dev/null || echo 0)
  if [[ $APPLY_COUNT -gt 10 ]]; then
    echo "⚠️ Tailwind: Excessive @apply usage ($APPLY_COUNT occurrences)"
    echo "INSTRUCTION: Prefer utility classes directly in HTML/JSX"
  fi
fi

# Check TSX/JSX files for long class strings
if [[ "$FILE_PATH" =~ \.(tsx|jsx)$ ]]; then
  # Find lines with very long className strings
  LONG_CLASSES=$(grep -n 'className="[^"]\{150,\}"' "$FILE_PATH" 2>/dev/null | head -3)
  if [[ -n "$LONG_CLASSES" ]]; then
    echo "⚠️ Tailwind: Very long className strings detected"
    echo "INSTRUCTION: Extract to @utility or use cn() helper with clsx"
    echo "$LONG_CLASSES"
  fi
fi

exit 0
