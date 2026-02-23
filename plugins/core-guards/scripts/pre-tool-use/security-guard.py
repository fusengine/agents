#!/usr/bin/env python3
"""PreToolUse hook: Validate dangerous commands via security rules (delegates to JS)."""
import json
import os
import subprocess
import sys


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    if data.get('tool_name') != 'Bash':
        sys.exit(0)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    validate_js = os.path.join(script_dir, '..', 'security', 'validate-command.js')

    if not os.path.isfile(validate_js):
        sys.exit(0)

    try:
        result = subprocess.run(
            ['node', validate_js],
            input=json.dumps(data), capture_output=True, text=True, timeout=10,
            check=False,
        )
        if result.stdout.strip():
            print(result.stdout.strip())
    except (subprocess.SubprocessError, FileNotFoundError):
        pass

    sys.exit(0)


if __name__ == '__main__':
    main()
