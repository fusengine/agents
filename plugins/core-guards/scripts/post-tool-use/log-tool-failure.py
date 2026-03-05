#!/usr/bin/env python3
"""PostToolUseFailure hook: Log tool execution failures."""
import json
import os
import sys
from datetime import datetime, timezone

LOG_DIR = os.path.expanduser('~/.claude/logs')


def main():
    """Log failed tool executions to session log."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    tool_name = data.get('tool_name', 'unknown')
    error = data.get('error', 'unknown error')
    is_interrupt = data.get('is_interrupt', False)
    session_id = data.get('session_id', 'unknown')

    if is_interrupt:
        sys.exit(0)

    ts = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    log_entry = f"[{ts}] TOOL_FAILURE session={session_id} tool={tool_name} error={error}\n"

    try:
        os.makedirs(LOG_DIR, exist_ok=True)
        log_file = os.path.join(LOG_DIR, 'tool-failures.log')
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(log_entry)
    except OSError:
        pass

    sys.exit(0)


if __name__ == '__main__':
    main()
