#!/usr/bin/env python3
"""Git guard patterns - standalone Python version (data only, no-op when run)."""
import sys

RALPH_SAFE_COMMANDS = [
    'git add', 'git commit', 'git checkout -b', 'git branch --show-current',
    'git status', 'git diff', 'git log',
]

BLOCKED_GIT_PATTERNS = [
    r'git push.*--force', r'git push.*-f', r'git reset.*--hard',
    r'git clean.*-fd', r'git branch.*-D', r'git rebase.*--force',
]

ASK_GIT_PATTERNS = [
    'git push', 'git checkout', 'git reset', 'git rebase', 'git merge',
    'git stash', 'git clean', 'git rm', 'git mv', 'git restore',
    'git revert', 'git cherry-pick', 'git commit', 'git add',
    'git branch -d', 'git branch -D',
]


def main():
    """No-op: data-only helper converted to standalone."""
    print('git-guard-patterns: standalone Python data module (no-op)', file=sys.stderr)
    sys.exit(0)


if __name__ == '__main__':
    main()
