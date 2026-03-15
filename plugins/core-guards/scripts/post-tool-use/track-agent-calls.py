#!/usr/bin/env python3
"""PostToolUse hook: Track Agent tool calls for APEX workflow enforcement."""
import json
import os
import sys
from datetime import datetime, timezone

STATE_DIR = os.path.join(os.path.expanduser('~'), '.claude', 'fusengine-cache', 'sessions')


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    tool_name = data.get('tool_name', '')
    if tool_name != 'Agent':
        sys.exit(0)

    sid = data.get('session_id', '') or 'unknown'
    agent_type = data.get('agent_type', '') or data.get('tool_input', {}).get('subagent_type', '')
    agent_id = data.get('agent_id', '')
    prompt = (data.get('tool_input', {}).get('prompt') or '')[:100]

    os.makedirs(STATE_DIR, exist_ok=True)
    sf = os.path.join(STATE_DIR, f'session-{sid}-agents.json')

    state = {'agents': []}
    if os.path.isfile(sf):
        try:
            with open(sf, encoding='utf-8') as f:
                state = json.load(f)
        except (json.JSONDecodeError, OSError):
            pass

    # Extract quality metrics from tool response
    tool_response = data.get('tool_response', '')
    response_length = len(str(tool_response)) if tool_response else 0

    ts = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    state['agents'].append({
        'timestamp': ts,
        'type': agent_type,
        'agent_id': agent_id,
        'prompt_preview': prompt,
        'response_length': response_length,
        'quality': 'sufficient' if response_length > 200 else 'insufficient',
    })

    try:
        with open(sf, 'w', encoding='utf-8') as f:
            json.dump(state, f, indent=2)
    except OSError:
        pass

    sys.exit(0)


if __name__ == '__main__':
    main()
