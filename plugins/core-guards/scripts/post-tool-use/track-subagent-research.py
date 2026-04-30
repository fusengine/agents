#!/usr/bin/env python3
"""PostToolUse: Track sub-agent MCP/exploration calls for APEX compliance.

Records APEX phase completions when sub-agents use MCP tools, native exploration
tools, exploration via Bash, or read cached MCP results from context/mcp/.
"""
import json
import os
import shlex
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from _shared.state_manager import load_session_state, save_session_state
from _shared.apex_constants import (
    CACHE_READ_RE,
    EXPLORE_BASH_CMDS,
    EXPLORE_TOOLS,
    RESEARCH_TOOLS,
)


def _bash_executable(cmd: str) -> str:
    """Return first non-assignment token of a shell command, or '' on failure."""
    if not cmd:
        return ''
    try:
        tokens = shlex.split(cmd, posix=True)
    except ValueError:
        return ''
    for token in tokens:
        if '=' not in token.split('/')[-1]:
            return os.path.basename(token)
    return ''


def _classify(tool_name: str, tool_input: dict):
    """Map (tool_name, tool_input) to (phase, cache_hit) or None to skip."""
    if tool_name in RESEARCH_TOOLS:
        return 'subagent-research-expert', False
    if tool_name in EXPLORE_TOOLS:
        return 'subagent-explore-codebase', False
    if tool_name == 'Read':
        path = tool_input.get('file_path', '')
        if path and CACHE_READ_RE.search(path):
            return 'subagent-research-expert', True
        return None
    if tool_name == 'Bash':
        cmd = tool_input.get('command', '').strip()
        if _bash_executable(cmd) in EXPLORE_BASH_CMDS:
            return 'subagent-explore-codebase', False
    return None


def main():
    """Entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    if not data.get('agent_id'):
        sys.exit(0)

    classified = _classify(data.get('tool_name', ''), data.get('tool_input') or {})
    if classified is None:
        sys.exit(0)
    phase, cache_hit = classified

    sid = data.get('session_id', '') or 'unknown'
    state = load_session_state(sid)
    agents = state.setdefault('agents', [])
    tool_response = data.get('tool_response', '')
    response_length = len(str(tool_response)) if tool_response else 0
    quality = 'sufficient' if (cache_hit or response_length > 50) else 'insufficient'

    agents.append({
        'timestamp': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'type': phase,
        'agent_id': data.get('agent_id', ''),
        'tool_name': data.get('tool_name', ''),
        'response_length': response_length,
        'quality': quality,
    })
    save_session_state(sid, state)
    sys.exit(0)


if __name__ == '__main__':
    main()
