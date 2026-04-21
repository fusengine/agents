#!/usr/bin/env python3
"""PostToolUse hook: Track Agent tool calls for APEX workflow enforcement."""
import json
import os
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from _shared.state_manager import load_session_state, save_session_state


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    tool_name = data.get('tool_name', '')
    if tool_name != 'Agent':
        sys.exit(0)

    sid = data.get('session_id', '') or 'unknown'
    agent_type = (
        data.get('agent_type', '')
        or data.get('tool_input', {}).get('subagent_type', '')
    )
    agent_id = data.get('agent_id', '')
    prompt = (data.get('tool_input', {}).get('prompt') or '')[:100]

    # Extract quality metrics from tool response
    tool_response = data.get('tool_response', '')
    response_length = len(str(tool_response)) if tool_response else 0

    state = load_session_state(sid)
    agents = state.setdefault('agents', [])

    ts = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    agents.append({
        'timestamp': ts,
        'type': agent_type,
        'agent_id': agent_id,
        'prompt_preview': prompt,
        'response_length': response_length,
        'quality': 'sufficient' if response_length > 500 else 'insufficient',
    })

    save_session_state(sid, state)
    sys.exit(0)


if __name__ == '__main__':
    main()
