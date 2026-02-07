#!/bin/bash
# validate-setup.sh - First-run validation
# Hook: Setup - Triggered on plugin installation

MISSING=()

# Check required API keys
[ -z "$CONTEXT7_API_KEY" ] && MISSING+=("CONTEXT7_API_KEY")
[ -z "$EXA_API_KEY" ] && MISSING+=("EXA_API_KEY")

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "Missing API keys: ${MISSING[*]}. Run setup.sh to configure." >&2
fi

# Check bun is available
if ! command -v bun &>/dev/null; then
  echo "Bun runtime not found. Install: curl -fsSL https://bun.sh/install | bash" >&2
fi

exit 0
