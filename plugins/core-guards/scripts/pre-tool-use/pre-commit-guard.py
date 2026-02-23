#!/usr/bin/env python3
"""PreToolUse hook: Validate linters before git commit (standalone)."""
import json
import os
import shutil
import subprocess
import sys


def run_eslint():
    """Run ESLint if config exists."""
    configs = ['.eslintrc.json', '.eslintrc.js', 'eslint.config.js']
    if any(os.path.isfile(c) for c in configs) and shutil.which('bunx'):
        r = subprocess.run(['bunx', 'eslint', '.', '--max-warnings', '0'],
                           capture_output=True, text=True, check=False)
        return r.returncode == 0
    return True


def run_typescript():
    """Run TypeScript compiler check."""
    if os.path.isfile('tsconfig.json') and shutil.which('bunx'):
        r = subprocess.run(['bunx', 'tsc', '--noEmit'], capture_output=True, text=True, check=False)
        return r.returncode == 0
    return True


def run_prettier():
    """Run Prettier check and auto-fix."""
    for cfg in ['.prettierrc', '.prettierrc.json']:
        if os.path.isfile(cfg) and shutil.which('bunx'):
            r = subprocess.run(['bunx', 'prettier', '--check', '.'],
                               capture_output=True, text=True, check=False)
            if r.returncode != 0:
                subprocess.run(['bunx', 'prettier', '--write', '.'], stderr=subprocess.DEVNULL, check=False)
            break


def run_python_linters():
    """Run Ruff if Python project."""
    if (os.path.isfile('requirements.txt') or os.path.isfile('pyproject.toml')) and shutil.which('ruff'):
        r = subprocess.run(['ruff', 'check', '.'], capture_output=True, text=True, check=False)
        return r.returncode == 0
    return True


def run_tests():
    """Run project tests."""
    if os.path.isfile('package.json'):
        try:
            with open('package.json', encoding='utf-8') as f:
                if '"test"' in f.read() and shutil.which('bun'):
                    r = subprocess.run(['bun', 'test'], capture_output=True, text=True, check=False)
                    return r.returncode == 0
        except OSError:
            pass
    return True


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    cmd = data.get('tool_input', {}).get('command', '')
    if not cmd.startswith('git') or 'commit' not in cmd:
        sys.exit(0)
    print('PRE-COMMIT GUARD ACTIVATED', file=sys.stderr)
    errors = 0
    print('Running linters...', file=sys.stderr)
    if os.path.isfile('package.json'):
        if not run_eslint():
            errors += 1
        if not run_typescript():
            errors += 1
        run_prettier()
    if not run_python_linters():
        errors += 1
    if errors > 0:
        print(f'COMMIT BLOCKED: {errors} linter(s) failed', file=sys.stderr)
        print(json.dumps({"decision": "block", "reason": "Linter errors. Fix before committing."}))
        sys.exit(0)
    print('Running tests...', file=sys.stderr)
    if not run_tests():
        print('Tests failed (warning)', file=sys.stderr)
    r = subprocess.run(['git', 'diff', '--cached', '--stat'], capture_output=True, text=True, check=False)
    print(f'Changes:\n{r.stdout}', file=sys.stderr)
    print(json.dumps({"decision": "block", "reason": "Pre-commit OK. Confirm to proceed."}))
    sys.exit(0)


if __name__ == '__main__':
    main()
