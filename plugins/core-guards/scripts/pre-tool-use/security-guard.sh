#!/bin/bash
# Security Guard - Validates dangerous commands
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
[[ "$TOOL_NAME" != "Bash" ]] && exit 0
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "$INPUT" | node "$SCRIPT_DIR/../security/validate-command.js"
