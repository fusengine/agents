#!/usr/bin/env python3
"""PreToolUse hook: Validate dangerous commands via security rules (native Python)."""
import json
import os
import sys

# Add _shared/scripts to path for security module import
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '_shared', 'scripts'))
from security_rules import validate_command  # pylint: disable=wrong-import-position


def output_decision(decision, reason):
    """Output hookSpecificOutput JSON for PreToolUse."""
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": decision,
        "permissionDecisionReason": f"SECURITY: {reason}",
    }}))
    sys.exit(0)


def main():
    """Entry point: read stdin JSON, validate command, output decision."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    if data.get('tool_name') != 'Bash':
        sys.exit(0)

    cmd = data.get('tool_input', {}).get('command', '')
    if not cmd:
        sys.exit(0)

    is_valid, violations = validate_command(cmd)
    if not is_valid:
        has_critical = any(
            'CRITICAL' in v or 'DANGEROUS PATTERN' in v or 'PRIVILEGE ESCALATION' in v
            for v in violations
        )
        reason = ', '.join(violations)
        output_decision('deny' if has_critical else 'ask', reason)

    sys.exit(0)


if __name__ == '__main__':
    main()
