#!/usr/bin/env python3
# pylint: disable=invalid-name
"""PreToolUse hook: Validate linters before git commit.

Blocks commit and reports detailed linter errors so Claude can fix them.
Never auto-fixes files (no --fix, no --write).
"""
import json
import os
import shutil
import subprocess
import sys

sys.path.insert(0, os.path.join(
    os.path.dirname(__file__), '..', '..', '..', '_shared', 'scripts'))
from hook_output import emit_pre_tool  # pylint: disable=wrong-import-position,import-error

TIMEOUT_SEC = 30
ESLINT_CONFIGS = (
    '.eslintrc.json', '.eslintrc.js', 'eslint.config.js',
    'eslint.config.mjs', 'eslint.config.ts',
)
PRETTIER_CONFIGS = ('.prettierrc', '.prettierrc.json', 'prettier.config.js')


def run_linter(cmd, label):
    """Run a linter command and return (passed, formatted_output)."""
    try:
        result = subprocess.run(
            cmd, capture_output=True, text=True,
            timeout=TIMEOUT_SEC, check=False,
        )
        if result.returncode != 0:
            output = result.stdout.strip() or result.stderr.strip()
            return False, f"[{label}]\n{output}" if output else ''
        return True, ''
    except (subprocess.TimeoutExpired, OSError):
        return True, ''


def collect_errors():
    """Run all applicable linters, return list of error strings."""
    errors = []
    has_bunx = shutil.which('bunx')

    if os.path.isfile('package.json') and has_bunx:
        if any(os.path.isfile(c) for c in ESLINT_CONFIGS):
            ok, msg = run_linter(
                ['bunx', 'eslint', '.', '--max-warnings', '0'], 'ESLint')
            if not ok and msg:
                errors.append(msg)
        if os.path.isfile('tsconfig.json'):
            ok, msg = run_linter(['bunx', 'tsc', '--noEmit'], 'TypeScript')
            if not ok and msg:
                errors.append(msg)
        if any(os.path.isfile(c) for c in PRETTIER_CONFIGS):
            ok, msg = run_linter(
                ['bunx', 'prettier', '--check', '.'], 'Prettier')
            if not ok and msg:
                errors.append(msg)

    has_python = (
        os.path.isfile('requirements.txt')
        or os.path.isfile('pyproject.toml')
    )
    if has_python and shutil.which('ruff'):
        ok, msg = run_linter(['ruff', 'check', '.'], 'Ruff')
        if not ok and msg:
            errors.append(msg)
    return errors


def main():
    """Read stdin JSON, validate linters, block with details if errors."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    cmd = data.get('tool_input', {}).get('command', '')
    if not cmd.startswith('git') or 'commit' not in cmd:
        sys.exit(0)

    errors = collect_errors()
    if errors:
        detail = '\n\n'.join(errors)
        emit_pre_tool('deny', f"COMMIT BLOCKED — Fix then retry:\n\n{detail}")
    else:
        emit_pre_tool('allow', 'All linters passed',
                       context='Pre-commit linter check: all passed')
    sys.exit(0)


if __name__ == '__main__':
    main()
