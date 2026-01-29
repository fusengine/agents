#!/bin/bash
# SessionStart: Inject CLAUDE.md as PLAIN TEXT (mandatory instructions)

CLAUDE_MD="$HOME/.claude/CLAUDE.md"
[[ ! -f "$CLAUDE_MD" ]] && exit 0

# Output as PLAIN TEXT (visible in transcript, treated as instruction)
echo "=== MANDATORY INSTRUCTIONS (from ~/.claude/CLAUDE.md) ==="
cat "$CLAUDE_MD"
echo "=== END MANDATORY INSTRUCTIONS ==="

exit 0
