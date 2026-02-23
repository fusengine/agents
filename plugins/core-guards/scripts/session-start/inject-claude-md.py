#!/usr/bin/env python3
"""SessionStart hook: Inject CLAUDE.md via hookSpecificOutput."""
import json
import os
import sys
from datetime import datetime

LOG_DIR = os.path.expanduser('~/.claude/logs')
LOG_FILE = os.path.join(LOG_DIR, 'hooks.log')


def log(msg):
    """Log with timestamp."""
    try:
        os.makedirs(LOG_DIR, exist_ok=True)
        ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(f'[{ts}] [SessionStart/inject-claude-md] {msg}\n')
    except OSError:
        pass


def main():
    claude_md = os.path.expanduser('~/.claude/CLAUDE.md')
    if not os.path.isfile(claude_md):
        log(f'ERROR: CLAUDE.md not found at {claude_md}')
        sys.exit(0)

    try:
        with open(claude_md, encoding='utf-8') as f:
            content = f.read()
    except OSError:
        log('ERROR: Cannot read CLAUDE.md')
        sys.exit(0)

    lines = content.count('\n') + 1
    log('Injecting CLAUDE.md into session context')
    print(f'CLAUDE.md loaded ({lines} lines)', file=sys.stderr)

    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "SessionStart",
        "additionalContext": content
    }}))

    log(f'CLAUDE.md injected successfully ({lines} lines)')
    sys.exit(0)


if __name__ == '__main__':
    main()
