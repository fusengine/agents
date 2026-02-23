#!/bin/bash

FILE_PATHS="${CLAUDE_FILE_PATHS:-}"

for file in $FILE_PATHS; do
  if [[ "$file" =~ \.(ts|tsx)$ ]]; then
    # Silent formatting - no output
    if command -v prettier &> /dev/null; then
      prettier --write "$file" >/dev/null 2>&1 || true
    fi

    if command -v eslint &> /dev/null; then
      eslint --fix "$file" >/dev/null 2>&1 || true
    fi
  fi
done

exit 0
