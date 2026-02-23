#!/bin/bash
# check-shadcn-install.sh - Wrapper calling shared shadcn check
set -euo pipefail

# Resolve shared scripts: try marketplace first, fallback to relative path
MARKETPLACE_SHARED="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins/_shared/scripts"
RELATIVE_SHARED="$(dirname "${BASH_SOURCE[0]}")/../../_shared/scripts"
if [[ -d "$MARKETPLACE_SHARED" ]]; then
  SHARED_DIR="$MARKETPLACE_SHARED"
elif [[ -d "$RELATIVE_SHARED" ]]; then
  SHARED_DIR="$(cd "$RELATIVE_SHARED" && pwd)"
else
  echo "Warning: _shared scripts not found" >&2
  exit 0
fi
source "$SHARED_DIR/shadcn-check.sh"

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[[ -z "$FILE_PATH" ]] && exit 0

# Find project root from file path
PROJECT_ROOT="."
DIR=$(dirname "$FILE_PATH")
while [[ "$DIR" != "/" && "$DIR" != "." ]]; do
  [[ -f "$DIR/package.json" ]] && { PROJECT_ROOT="$DIR"; break; }
  DIR=$(dirname "$DIR")
done

check_shadcn_installed "$PROJECT_ROOT" && exit 0
exit 0
