#!/bin/bash
# validate-design.sh - PostToolUse hook for design-expert
# Validates design best practices after Write/Edit

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
[[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]] && exit 0

# Only check component files
[[ ! "$FILE_PATH" =~ \.(tsx|jsx)$ ]] && exit 0

# Skip if file doesn't exist
[[ ! -f "$FILE_PATH" ]] && exit 0

WARNINGS=""

# Check for accessibility issues
if grep -qE "<(button|a|input|img)" "$FILE_PATH" 2>/dev/null; then
  # Check for missing aria labels on icon buttons
  if grep -qE "<button[^>]*>" "$FILE_PATH" && ! grep -qE "aria-label|aria-labelledby" "$FILE_PATH"; then
    ICON_BUTTONS=$(grep -c "<button[^>]*>[^<]*<.*Icon" "$FILE_PATH" 2>/dev/null || true)
    if [[ ${ICON_BUTTONS:-0} -gt 0 ]]; then
      WARNINGS+="Accessibility: Icon buttons need aria-label. "
    fi
  fi

  # Check for missing alt on images
  if grep -qE '<img[^>]*src=' "$FILE_PATH" && grep -qE '<img[^>]*(?!alt=)' "$FILE_PATH" 2>/dev/null; then
    WARNINGS+="Accessibility: Images need alt attribute. "
  fi
fi

# Check for design anti-patterns
if grep -qE "border-l-[0-9]+ border-l-(blue|green|red|purple)" "$FILE_PATH" 2>/dev/null; then
  WARNINGS+="Design: Avoid colored left borders - use shadow or gradient. "
fi

# Check for purple gradients (AI slop)
if grep -qE "from-purple|to-purple|via-purple|from-pink.*to-purple" "$FILE_PATH" 2>/dev/null; then
  WARNINGS+="Design: Avoid purple/pink gradients (AI slop) - use brand colors. "
fi

# Check for emoji as icons
if grep -qE ">[🎯🚀💡🔥⚡️✨🎨📊💼🏆]<" "$FILE_PATH" 2>/dev/null; then
  WARNINGS+="Design: Avoid emojis as icons - use Lucide React. "
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
