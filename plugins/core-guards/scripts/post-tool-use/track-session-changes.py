#!/usr/bin/env python3
"""PostToolUse hook: Track cumulative code file changes per session."""
import json
import os
import re
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from _shared.state_manager import load_session_state, save_session_state

LOG_DIR = os.path.expanduser('~/.claude/logs')
LOG_FILE = os.path.join(LOG_DIR, 'hooks.log')
CODE_EXT = r'\.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|vue|svelte|astro)$'


def log_hook(msg):
    """Append log entry."""
    try:
        os.makedirs(LOG_DIR, exist_ok=True)
        ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(f'[{ts}] [PostToolUse/track-session-changes] {msg}\n')
    except OSError:
        pass


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        log_hook('ERROR: Invalid JSON')
        sys.exit(0)

    sid = data.get('session_id', '') or 'unknown'
    fp = data.get('tool_input', {}).get('file_path', '')
    if not fp or not re.search(CODE_EXT, fp):
        sys.exit(0)

    log_hook(f'Code file detected: {fp}')
    state = load_session_state(sid)
    changes = state.setdefault('changes', {
        'cumulativeCodeFiles': 0, 'modifiedFiles': [],
    })

    count = changes.get('cumulativeCodeFiles', 0)
    files = changes.get('modifiedFiles', [])
    if fp not in files:
        count += 1
        files.append(fp)
        log_hook(f'Count: {count} (new: {fp})')

    ts = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    changes.update({
        'cumulativeCodeFiles': count,
        'modifiedFiles': files,
        'lastModifiedFile': fp,
        'lastCheck': ts,
    })
    state['changes'] = changes
    save_session_state(sid, state)

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
