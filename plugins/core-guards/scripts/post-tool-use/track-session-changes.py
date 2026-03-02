#!/usr/bin/env python3
"""PostToolUse hook: Track cumulative code file changes per session."""
import json
import os
import re
import sys
from datetime import datetime, timezone

STATE_DIR = os.path.join(os.path.expanduser('~'), '.claude', 'fusengine-cache', 'sessions')
LOG_DIR = os.path.expanduser('~/.claude/logs')
LOG_FILE = os.path.join(LOG_DIR, 'hooks.log')
CODE_EXT = r'\.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|vue|svelte)$'


def log_hook(msg):
    """Append log entry."""
    try:
        ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(f'[{ts}] [PostToolUse/track-session-changes] {msg}\n')
    except OSError:
        pass


def load_state(sf):
    """Load session state from JSON file."""
    if os.path.isfile(sf):
        try:
            with open(sf, encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            pass
    return {'cumulativeCodeFiles': 0, 'modifiedFiles': []}


def main():
    os.makedirs(STATE_DIR, exist_ok=True)
    os.makedirs(LOG_DIR, exist_ok=True)
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        log_hook('ERROR: Invalid JSON')
        sys.exit(0)
    sid = data.get('session_id', '') or f'unknown-{int(datetime.now().timestamp())}'
    fp = data.get('tool_input', {}).get('file_path', '')
    if not fp:
        sys.exit(0)
    sf = os.path.join(STATE_DIR, f'session-{sid}-changes.json')
    if not re.search(CODE_EXT, fp):
        sys.exit(0)
    log_hook(f'Code file detected: {fp}')
    state = load_state(sf)
    count = state.get('cumulativeCodeFiles', 0)
    files = state.get('modifiedFiles', [])
    if fp not in files:
        count += 1
        files.append(fp)
        log_hook(f'Count: {count} (new: {fp})')
    ts = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    new_state = {'cumulativeCodeFiles': count, 'modifiedFiles': files,
                 'lastModifiedFile': fp, 'lastCheck': ts, 'sessionId': sid}
    try:
        with open(sf, 'w', encoding='utf-8') as f:
            json.dump(new_state, f)
    except OSError:
        pass
    log_hook(f'State saved: {count} file(s)')
    fname = os.path.basename(fp)
    print(f"sniper required: {fname}", file=sys.stderr)
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PostToolUse",
        "additionalContext": f"SNIPER VALIDATION REQUIRED: Code file '{fname}' was modified. "
        f"You MUST now run the sniper agent (fuse-ai-pilot:sniper) to validate "
        f"this modification before continuing. This is mandatory per CLAUDE.md rules."}}))
    sys.exit(0)


if __name__ == '__main__':
    main()
