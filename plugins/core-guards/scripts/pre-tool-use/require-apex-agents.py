#!/usr/bin/env python3
"""PreToolUse: Block Edit/Write if explore-codebase + research-expert not called (2min TTL)."""
import json
import os
import re
import sys
import time
from datetime import datetime, timezone

STATE_DIR = os.path.join(os.path.expanduser('~'), '.claude', 'fusengine-cache', 'sessions')
AGENT_TTL_SECONDS = 120
CODE_EXT = r'\.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte)$'
REQUIRED_AGENTS = ['explore-codebase', 'research-expert']
EXEMPT_PATTERNS = [
    r'\.claude-plugin/',
    r'CHANGELOG\.md$',
    r'marketplace\.json$',
    r'/\.claude/(apex|memory|logs|fusengine-cache)/',
]


def is_exempt(fp):
    """Check if file is exempt from APEX enforcement."""
    for pattern in EXEMPT_PATTERNS:
        if re.search(pattern, fp):
            return True
    return False


def check_required_agents(sid):
    """Check if BOTH explore-codebase AND research-expert were called within TTL."""
    sf = os.path.join(STATE_DIR, f'session-{sid}-agents.json')
    if not os.path.isfile(sf):
        return False, REQUIRED_AGENTS[:]
    try:
        with open(sf, encoding='utf-8') as f:
            state = json.load(f)
        agents = state.get('agents', [])
        if not agents:
            return False, REQUIRED_AGENTS[:]
        now = time.time()
        found = set()
        for entry in reversed(agents):
            if not isinstance(entry, dict):
                continue
            ts = entry.get('timestamp', '')
            dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
            if (now - dt.timestamp()) > AGENT_TTL_SECONDS:
                break
            agent_type = entry.get('type', '')
            for req in REQUIRED_AGENTS:
                if req in agent_type:
                    found.add(req)
        missing = [r for r in REQUIRED_AGENTS if r not in found]
        return len(missing) == 0, missing
    except (json.JSONDecodeError, OSError, ValueError, AttributeError, TypeError, OverflowError):
        return False, REQUIRED_AGENTS[:]


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    # Subagents exempt — APEX enforcement is the lead's responsibility
    if data.get('agent_id'):
        sys.exit(0)

    fp = data.get('tool_input', {}).get('file_path', '')
    sid = data.get('session_id', '') or 'unknown'

    if not fp or not re.search(CODE_EXT, fp):
        sys.exit(0)
    if is_exempt(fp):
        sys.exit(0)

    satisfied, missing = check_required_agents(sid)
    if satisfied:
        sys.exit(0)

    missing_str = ' + '.join(missing)
    reason = (
        f"BLOCKED: APEX workflow required (2min TTL). "
        f"Missing agents: {missing_str}. "
        f"Launch BOTH explore-codebase AND research-expert BEFORE editing code."
    )
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }}))


if __name__ == '__main__':
    main()
