#!/usr/bin/env python3
"""PreToolUse: Block Edit/Write if explore-codebase + research-expert not called (2min TTL)."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from apex_agent_helpers import (  # pylint: disable=wrong-import-position
    check_required_agents,
    increment_trivial_edit_counter,
)

CODE_EXT = r'\.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte)$'
EXEMPT_PATTERNS = [
    r'\.claude-plugin/', r'CHANGELOG\.md$', r'marketplace\.json$',
    r'/\.claude/(apex|memory|logs|fusengine-cache)/',
]


def main():
    """Entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    tool_input = data.get('tool_input', {})
    fp = tool_input.get('file_path', '')
    sid = data.get('session_id', '') or 'unknown'
    # Subagents: same TTL 2min check as lead — no exceptions
    # If lead's APEX agents expired, subagent is blocked too
    if not fp or not re.search(CODE_EXT, fp):
        sys.exit(0)
    if any(re.search(p, fp) for p in EXEMPT_PATTERNS):
        sys.exit(0)
    # Trivial edits: replace_all is NEVER trivial
    if tool_input.get('replace_all'):
        pass  # Fall through to APEX check
    elif data.get('tool_name') == 'Edit' and tool_input.get('new_string', '').count('\n') < 5:
        count = increment_trivial_edit_counter(sid)
        if count < 5:
            sys.exit(0)
        # 5+ trivial edits in 2 min -> require full APEX

    satisfied, missing = check_required_agents(sid)
    if satisfied:
        sys.exit(0)
    missing_str = ' + '.join(missing)
    reason = (
        f"BLOCKED: APEX workflow required (2min TTL). "
        f"Missing agents: {missing_str}. "
        f"Launch BOTH explore-codebase AND research-expert BEFORE editing code.")
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }}))


if __name__ == '__main__':
    main()
