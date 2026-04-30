#!/usr/bin/env python3
"""PostToolUse: Track sub-agent MCP/exploration calls for APEX compliance.

When a sub-agent uses MCP tools (Context7, Exa) or exploration tools (Glob, Grep),
these are recorded as APEX phase completions — equivalent to the lead calling
Agent(explore-codebase) or Agent(research-expert).

Type names use 'subagent-' prefix but contain the required substrings
('explore-codebase', 'research-expert') so _scan_agents() matches them.
"""
import json
import os
import shlex
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from _shared.state_manager import load_session_state, save_session_state

# MCP tools that count as research-expert equivalent
RESEARCH_TOOLS = {
    'mcp__context7__query-docs',
    'mcp__context7__resolve-library-id',
    'mcp__exa__web_search_exa',
    'mcp__exa__get_code_context_exa',
    'mcp__exa__deep_researcher_start',
    'WebSearch',
    'WebFetch',
}

# Tools that count as explore-codebase equivalent
EXPLORE_TOOLS = {'Glob', 'Grep'}

# Bash command names that count as exploration (first non-assignment token).
# Subagents lacking native Glob/Grep rely on Bash for codebase scanning.
EXPLORE_BASH_CMDS = {'grep', 'rg', 'find', 'ls', 'fd', 'ast-grep', 'tree', 'cat', 'head', 'tail'}


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


def main():
    """Entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    # Only track in sub-agent context (agent_id present)
    if not data.get('agent_id'):
        sys.exit(0)

    tool_name = data.get('tool_name', '')
    if tool_name in RESEARCH_TOOLS:
        phase = 'subagent-research-expert'
    elif tool_name in EXPLORE_TOOLS:
        phase = 'subagent-explore-codebase'
    elif tool_name == 'Bash':
        cmd = (data.get('tool_input') or {}).get('command', '').strip()
        if _bash_executable(cmd) in EXPLORE_BASH_CMDS:
            phase = 'subagent-explore-codebase'
        else:
            sys.exit(0)
    else:
        sys.exit(0)

    sid = data.get('session_id', '') or 'unknown'
    state = load_session_state(sid)
    agents = state.setdefault('agents', [])

    tool_response = data.get('tool_response', '')
    response_length = len(str(tool_response)) if tool_response else 0

    agents.append({
        'timestamp': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'type': phase,
        'agent_id': data.get('agent_id', ''),
        'tool_name': tool_name,
        'response_length': response_length,
        'quality': 'sufficient' if response_length > 50 else 'insufficient',
    })

    save_session_state(sid, state)
    sys.exit(0)


if __name__ == '__main__':
    main()
