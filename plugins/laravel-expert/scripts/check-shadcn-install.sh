#!/bin/bash
# check-shadcn-install.sh - PreToolUse hook
# BLOCKS manual writing of shadcn components - forces CLI installation

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write tool (not Edit - Edit is for modifications)
if [[ "$TOOL_NAME" != "Write" ]]; then
  exit 0
fi

# Only check component files
if [[ ! "$FILE_PATH" =~ components/ui/.*\.(tsx|jsx)$ ]]; then
  exit 0
fi

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')

# List of shadcn component signatures to detect
SHADCN_SIGNATURES=(
  "from \"@radix-ui"
  "from '@radix-ui"
  "cva("
  "VariantProps<"
  "cn("
  "forwardRef<.*HTMLButtonElement"
  "forwardRef<.*HTMLInputElement"
  "forwardRef<.*HTMLTextAreaElement"
  "data-slot="
  "Slot"
  "asChild"
)

# Check if content contains shadcn signatures
for sig in "${SHADCN_SIGNATURES[@]}"; do
  if echo "$CONTENT" | grep -qE "$sig"; then
    # Extract component name from path
    COMPONENT_NAME=$(basename "$FILE_PATH" .tsx | tr '[:upper:]' '[:lower:]')

    REASON="🚫 SHADCN: Do NOT write components manually! "
    REASON+="Use the CLI to install: npx shadcn@latest add $COMPONENT_NAME "
    REASON+="Or use mcp__shadcn__get_add_command_for_items to get the install command. "
    REASON+="shadcn components must be installed, not written."

    jq -n --arg reason "$REASON" '{"decision": "block", "reason": $reason}'
    exit 2
  fi
done

# Not a shadcn component - allow
exit 0
