#!/bin/bash
# Pre-commit guard: Validates linters before git commit
# Refactored for SOLID compliance

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/linter-checks.sh"

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only intercept git commit
[[ ! "$COMMAND" =~ ^git[[:space:]]+commit ]] && exit 0

echo "🛡️  PRE-COMMIT GUARD ACTIVATED" >&2
LINTER_ERRORS=0

# Run linters
echo "📋 Running linters..." >&2
if [ -f "package.json" ]; then
    run_eslint || ((LINTER_ERRORS++))
    run_typescript || ((LINTER_ERRORS++))
    run_prettier
fi
run_python_linters || ((LINTER_ERRORS++))

# Block if errors
if [ $LINTER_ERRORS -gt 0 ]; then
    echo "❌ COMMIT BLOCKED: $LINTER_ERRORS linter(s) failed" >&2
    echo '{"decision":"block","reason":"Linter errors. Fix before committing."}'
    exit 0
fi

# Run tests (warning only)
echo "🧪 Running tests..." >&2
run_tests || echo "  ⚠️  Tests failed (warning)" >&2

# Show diff summary
echo "📊 Changes:" >&2
git diff --cached --stat >&2

# Ask confirmation
COMMIT_MSG=$(echo "$COMMAND" | sed -n 's/.*-m[[:space:]]*"\([^"]*\)".*/\1/p')
echo "⚠️  Confirm commit: $COMMIT_MSG" >&2
echo '{"decision":"block","reason":"Pre-commit OK. Confirm to proceed."}'
exit 0
