#!/bin/bash
# Enforce: Files must be <100 lines (ALL languages)
# Exit 2 = Block with user prompt

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Skip if no file path
[[ -z "$FILE_PATH" ]] && exit 0

# Skip non-code files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte)$ ]]; then
  exit 0
fi

# Skip if file doesn't exist
[[ ! -f "$FILE_PATH" ]] && exit 0

# Count lines
LINES=$(wc -l < "$FILE_PATH" | tr -d ' ')

if (( LINES > 150 )); then
  # exit 0 + JSON stdout = Claude lit le JSON
  # exit 2 ignore stdout et lit stderr uniquement
  cat << EOF
{"decision":"block","reason":"VIOLATION: $FILE_PATH exceeds 100 lines ($LINES). Split into smaller modules (<90 lines each)."}
EOF
fi

exit 0
