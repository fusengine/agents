#!/usr/bin/env python3
"""Session state helpers - standalone Python version (not imported)."""
import json
import os
import re
import sys
from datetime import datetime, timezone

STATE_DIR = '/tmp/claude-code-sessions'
LOG_DIR = os.path.expanduser('~/.claude/logs')
LOG_FILE = os.path.join(LOG_DIR, 'hooks.log')
CODE_EXT = r'\.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|vue|svelte)$'


def init_dirs():
    """Create state and log directories."""
    os.makedirs(STATE_DIR, exist_ok=True)
    os.makedirs(LOG_DIR, exist_ok=True)


def log_hook(msg):
    """Append a log entry."""
    try:
        ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(f'[{ts}] [PostToolUse/track-session-changes] {msg}\n')
    except OSError:
        pass


def get_state_file(session_id):
    """Return path to session state file."""
    return os.path.join(STATE_DIR, f'session-{session_id}-changes.json')


def load_state(state_file):
    """Load session state from JSON."""
    if os.path.isfile(state_file):
        try:
            with open(state_file, encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            pass
    return {'cumulativeCodeFiles': 0, 'modifiedFiles': []}


def save_state(state_file, count, files, last_file, session_id):
    """Save session state to JSON."""
    ts = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    state = {
        'cumulativeCodeFiles': count,
        'modifiedFiles': files,
        'lastModifiedFile': last_file,
        'lastCheck': ts,
        'sessionId': session_id,
    }
    try:
        with open(state_file, 'w', encoding='utf-8') as f:
            json.dump(state, f)
    except OSError:
        pass


def is_code_file(file_path):
    """Check if file is a code file by extension."""
    return bool(re.search(CODE_EXT, file_path))


def main():
    """Standalone: print helper info when run directly."""
    print('session-state-helpers: standalone Python helper (no-op when run directly)', file=sys.stderr)
    sys.exit(0)


if __name__ == '__main__':
    main()
