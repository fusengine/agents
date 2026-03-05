#!/usr/bin/env python3
"""TaskCompleted hook: Validate SOLID rules on modified files."""
import json
import os
import sys

STATE_DIR = os.path.join(os.path.expanduser('~'), '.claude', 'fusengine-cache', 'sessions')
MAX_LINES = 100
CODE_EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.py', '.php', '.swift', '.go', '.rs'}


def main():
    """Check modified files respect SOLID rules (< 100 lines)."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    task_id = data.get('task_id', '')
    task_subject = data.get('task_subject', '')
    session_id = data.get('session_id', 'unknown')

    state_file = os.path.join(STATE_DIR, f'session-{session_id}-changes.json')
    if not os.path.isfile(state_file):
        sys.exit(0)

    try:
        with open(state_file, encoding='utf-8') as f:
            state = json.load(f)
    except (json.JSONDecodeError, OSError):
        sys.exit(0)

    violations = []
    for fp in state.get('modifiedFiles', []):
        ext = os.path.splitext(fp)[1]
        if ext not in CODE_EXTENSIONS:
            continue
        if not os.path.isfile(fp):
            continue
        try:
            with open(fp, encoding='utf-8') as f:
                line_count = sum(1 for _ in f)
            if line_count > MAX_LINES:
                violations.append(f"{os.path.basename(fp)}: {line_count} lines (max {MAX_LINES})")
        except OSError:
            pass

    if violations:
        msg = (f"SOLID VIOLATION in task '{task_subject}' ({task_id}): "
               f"{len(violations)} file(s) exceed {MAX_LINES} lines: "
               + '; '.join(violations[:5]))
        print(json.dumps({"hookSpecificOutput": {
            "hookEventName": "TaskCompleted",
            "additionalContext": msg
        }}))
    sys.exit(0)


if __name__ == '__main__':
    main()
