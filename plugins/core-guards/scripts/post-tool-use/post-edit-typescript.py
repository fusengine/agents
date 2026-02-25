#!/usr/bin/env python3
"""PostToolUse hook: Report eslint/prettier issues on edited TS/TSX files.

Reports lint errors as additionalContext so Claude can fix them.
Never modifies files (no --fix, no --write).
"""
import json
import os
import shutil
import subprocess
import sys

TS_EXTENSIONS = ('.ts', '.tsx')
TIMEOUT_SEC = 10


def main():
    """Read stdin JSON, run linters in report mode, output issues."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    file_path = data.get('tool_input', {}).get('file_path', '')
    if not file_path or not file_path.endswith(TS_EXTENSIONS):
        sys.exit(0)
    if not os.path.isfile(file_path):
        sys.exit(0)

    issues = []

    if shutil.which('eslint'):
        try:
            result = subprocess.run(
                ['eslint', '--no-fix', '--format', 'compact', file_path],
                capture_output=True, text=True, timeout=TIMEOUT_SEC,
                check=False,
            )
            if result.returncode != 0 and result.stdout.strip():
                issues.append(f"ESLint:\n{result.stdout.strip()}")
        except (subprocess.TimeoutExpired, OSError):
            pass

    if shutil.which('prettier'):
        try:
            result = subprocess.run(
                ['prettier', '--check', file_path],
                capture_output=True, text=True, timeout=TIMEOUT_SEC,
                check=False,
            )
            if result.returncode != 0:
                issues.append(
                    f"Prettier: {os.path.basename(file_path)} needs formatting"
                )
        except (subprocess.TimeoutExpired, OSError):
            pass

    if issues:
        report = ' | '.join(issues)
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": (
                    f"Lint issues in {os.path.basename(file_path)}: {report}"
                )
            }
        }))

    sys.exit(0)


if __name__ == '__main__':
    main()
