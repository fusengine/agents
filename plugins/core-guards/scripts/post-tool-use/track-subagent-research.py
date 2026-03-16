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
import sys
from datetime import datetime, timezone

STATE_DIR = os.path.join(
    os.path.expanduser('~'), '.claude', 'fusengine-cache', 'sessions'
)

# MCP tools that count as research-expert equivalent
RESEARCH_TOOLS = {
    'mcp__context7__query-docs',
    'mcp__context7__resolve-library-id',
    'mcp__exa__web_search_exa',
    'mcp__exa__get_code_context_exa',
    'mcp__exa__deep_researcher_start',
}

# Tools that count as explore-codebase equivalent
EXPLORE_TOOLS = {'Glob', 'Grep'}


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
    else:
        sys.exit(0)

    sid = data.get('session_id', '') or 'unknown'
    os.makedirs(STATE_DIR, exist_ok=True)
    sf = os.path.join(STATE_DIR, f'session-{sid}-agents.json')

    state = {'agents': []}
    if os.path.isfile(sf):
        try:
            with open(sf, encoding='utf-8') as f:
                state = json.load(f)
        except (json.JSONDecodeError, OSError):
            pass

    tool_response = data.get('tool_response', '')
    response_length = len(str(tool_response)) if tool_response else 0

    state['agents'].append({
        'timestamp': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'type': phase,
        'agent_id': data.get('agent_id', ''),
        'tool_name': tool_name,
        'response_length': response_length,
        'quality': 'sufficient' if response_length > 50 else 'insufficient',
    })

    try:
        with open(sf, 'w', encoding='utf-8') as f:
            json.dump(state, f, indent=2)
    except OSError:
        pass

    sys.exit(0)


if __name__ == '__main__':
    main()
