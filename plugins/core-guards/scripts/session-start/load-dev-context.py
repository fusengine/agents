#!/usr/bin/env python3
"""SessionStart hook: Load development context (git, project type)."""
import json
import os
import subprocess
import sys


def main():
    parts = []

    if os.path.isdir('.git'):
        try:
            branch = subprocess.check_output(
                ['git', 'branch', '--show-current'], stderr=subprocess.DEVNULL, text=True
            ).strip()
        except (subprocess.SubprocessError, FileNotFoundError):
            branch = 'unknown'
        parts.append(f'Git branch: {branch}')
        try:
            status = subprocess.check_output(
                ['git', 'status', '--porcelain'], stderr=subprocess.DEVNULL, text=True
            ).strip()
            if status:
                lines = status.splitlines()[:5]
                parts.append('Modified files:\n' + '\n'.join(lines))
        except (subprocess.SubprocessError, FileNotFoundError):
            pass

    for cfg in ['next.config.js', 'next.config.ts', 'next.config.mjs']:
        if os.path.isfile(cfg):
            parts.append('Project: Next.js')
            break
    else:
        if os.path.isfile('package.json'):
            parts.append('Project: Node.js')

    if os.path.isfile('composer.json') and os.path.isfile('artisan'):
        parts.append('Project: Laravel')
    if os.path.isfile('Package.swift'):
        parts.append('Project: Swift')

    if parts:
        context = '\n'.join(parts)
        print(json.dumps({"hookSpecificOutput": {
            "hookEventName": "SessionStart",
            "additionalContext": context
        }}))

    sys.exit(0)


if __name__ == '__main__':
    main()
