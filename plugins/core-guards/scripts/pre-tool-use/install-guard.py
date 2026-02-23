#!/usr/bin/env python3
"""PreToolUse hook: Ask confirmation before installing packages."""
import json
import os
import subprocess
import sys

SYSTEM_PATTERNS = ['brew install', 'brew upgrade', 'brew cask', 'apt install', 'apt-get install']
PROJECT_PATTERNS = [
    'npm install', 'npm i ', 'yarn add', 'pnpm add', 'pip install', 'pip3 install',
    'composer require', 'bun add', 'bun install', 'cargo install', 'go install',
    'gem install', 'pipx install',
]


def is_ralph_mode():
    """Check if Ralph mode is active."""
    if os.environ.get('RALPH_MODE') == '1':
        return True
    if os.path.isfile('.claude/ralph/prd.json'):
        return True
    try:
        branch = subprocess.check_output(
            ['git', 'branch', '--show-current'], stderr=subprocess.DEVNULL, text=True
        ).strip()
        return branch.startswith('feature/')
    except (subprocess.SubprocessError, FileNotFoundError):
        return False


def output_ask(reason):
    """Output ask decision."""
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "ask", "permissionDecisionReason": reason}}))
    sys.exit(0)


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    tool = data.get('tool_name', '')
    cmd = data.get('tool_input', {}).get('command', '')
    if tool != 'Bash' or not cmd:
        sys.exit(0)
    for pat in SYSTEM_PATTERNS:
        if pat in cmd:
            output_ask(f"SYSTEM INSTALL: '{pat}' requires confirmation")
    for pat in PROJECT_PATTERNS:
        if pat in cmd:
            if is_ralph_mode():
                sys.exit(0)
            output_ask(f"INSTALL GUARD: '{pat}' detected. Authorize?")
    sys.exit(0)


if __name__ == '__main__':
    main()
