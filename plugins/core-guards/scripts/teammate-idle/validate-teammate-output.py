#!/usr/bin/env python3
"""TeammateIdle hook: Suggest sniper validation when teammate modified code."""
import json
import os
import sys

STATE_DIR = os.path.join(os.path.expanduser('~'), '.claude', 'fusengine-cache', 'sessions')


def main():
    """Check if teammate modified code files and suggest sniper."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    teammate_name = data.get('teammate_name', 'unknown')
    session_id = data.get('session_id', 'unknown')

    state_file = os.path.join(STATE_DIR, f'session-{session_id}-changes.json')
    if not os.path.isfile(state_file):
        sys.exit(0)

    try:
        with open(state_file, encoding='utf-8') as f:
            state = json.load(f)
        count = state.get('cumulativeCodeFiles', 0)
        if count > 0:
            files = ', '.join(state.get('modifiedFiles', [])[:5])
            print(json.dumps({"hookSpecificOutput": {
                "hookEventName": "TeammateIdle",
                "additionalContext": f"Teammate '{teammate_name}' going idle after modifying "
                    f"{count} code file(s): {files}. Consider running sniper validation."
            }}))
    except (json.JSONDecodeError, OSError):
        pass
    sys.exit(0)


if __name__ == '__main__':
    main()
