#!/usr/bin/env python3
"""PreToolUse: Block Edit/Write if explore-codebase + research-expert not called (2min TTL)."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from apex_agent_helpers import (  # pylint: disable=wrong-import-position
    check_brainstorm_done,
    check_required_agents,
)

CODE_EXT = r'\.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte|astro)$'
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
    # Lead satisfies via Agent tool; subagents via direct MCP/Glob/Grep calls
    # Both paths tracked in session-{SID}-agents.json by track-subagent-research.py
    if not fp or not re.search(CODE_EXT, fp):
        sys.exit(0)
    if any(re.search(p, fp) for p in EXEMPT_PATTERNS):
        sys.exit(0)
    # Brainstorming check — lead only, subagents inherit lead's decision
    # Edit targets existing files only — skip brainstorm (only Write can create new files)
    is_edit = data.get('tool_name') == 'Edit'
    if not is_edit and not data.get('agent_id') and not check_brainstorm_done(sid):
        print(json.dumps({"hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": (
                "BLOCKED: Brainstorming required for new feature/creation task. "
                "Launch brainstorming agent BEFORE writing code."),
        }}))
        return

    satisfied, missing = check_required_agents(sid)
    if satisfied:
        sys.exit(0)
    missing_str = ' + '.join(missing)
    if data.get('agent_id'):
        hints = []
        for m in missing:
            if 'explore' in m:
                hints.append('Glob/Grep (codebase exploration)')
            if 'research' in m:
                hints.append('Context7/Exa/WebSearch (research)')
        reason = (
            f"BLOCKED: APEX workflow required (2min TTL). "
            f"Missing: {missing_str}. "
            f"Use {' and '.join(hints)} BEFORE editing code.")
    else:
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
