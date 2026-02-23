#!/usr/bin/env python3
"""PreToolUse hook: Block destructive git commands without permission."""
import json
import os
import re
import subprocess
import sys

RALPH_SAFE = ['git add', 'git commit', 'git checkout -b', 'git branch --show-current',
              'git status', 'git diff', 'git log']
BLOCKED = [r'git push.*--force', r'git push.*-f', r'git reset.*--hard',
           r'git clean.*-fd', r'git branch.*-D', r'git rebase.*--force']
ASK = ['git push', 'git checkout', 'git reset', 'git rebase', 'git merge',
       'git stash', 'git clean', 'git rm', 'git mv', 'git restore',
       'git revert', 'git cherry-pick', 'git commit', 'git add', 'git branch -d', 'git branch -D']


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


def output_decision(decision, reason):
    """Output hookSpecificOutput JSON."""
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": decision, "permissionDecisionReason": f"GIT GUARD: {reason}"}}))
    sys.exit(0)


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    cmd = data.get('tool_input', {}).get('command', '')
    if not cmd:
        sys.exit(0)
    if is_ralph_mode():
        for safe in RALPH_SAFE:
            if cmd.startswith(safe):
                sys.exit(0)
    for pat in BLOCKED:
        if re.search(pat, cmd):
            output_decision('deny', f"Destructive command '{pat}' BLOCKED")
    for pat in ASK:
        if pat in cmd:
            output_decision('ask', f"'{pat}' detected. Authorize?")
    sys.exit(0)


if __name__ == '__main__':
    main()
