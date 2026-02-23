#!/usr/bin/env python3
"""Linter checks helper - standalone Python version (data only, no-op when run)."""
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
        r = subprocess.run(['bunx', 'tsc', '--noEmit'],
                           capture_output=True, text=True, check=False)
        return r.returncode == 0
    return True


def run_prettier():
    """Run Prettier check and auto-fix."""
    configs = ['.prettierrc', '.prettierrc.json']
    if any(os.path.isfile(c) for c in configs) and shutil.which('bunx'):
        r = subprocess.run(['bunx', 'prettier', '--check', '.'],
                           capture_output=True, text=True, check=False)
        if r.returncode != 0:
            subprocess.run(['bunx', 'prettier', '--write', '.'],
                           stderr=subprocess.DEVNULL, check=False)
    return True


def run_python_linters():
    """Run Ruff if Python project."""
    if (os.path.isfile('requirements.txt') or os.path.isfile('pyproject.toml')) and shutil.which('ruff'):
        r = subprocess.run(['ruff', 'check', '.'], capture_output=True, text=True, check=False)
        return r.returncode == 0
    return True


def run_tests():
    """Run tests if available."""
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
    """No-op: helper module converted to standalone."""
    print('linter-checks: standalone Python helper (no-op)', file=sys.stderr)
    sys.exit(0)


if __name__ == '__main__':
    main()
