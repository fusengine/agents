#!/usr/bin/env python3
"""SubagentStop hook: Track agent executions and trigger sniper."""
import json
import os
import re
import sys
from datetime import datetime, timezone

STATE_DIR = '/tmp/claude-code-sessions'
MEMORY_DIR = os.path.expanduser('~/.claude/memory/agents')
SKIP_AGENTS = r'(sniper|sniper-faster|explore-codebase|research-expert|claude-code-guide|Explore|Plan)'


def main():
    os.makedirs(STATE_DIR, exist_ok=True)
    os.makedirs(MEMORY_DIR, exist_ok=True)

    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        print(json.dumps({"message": "Invalid input"}))
        sys.exit(0)

    agent_type = data.get('subagent_type', data.get('agent_id', 'unknown'))
    session_id = data.get('session_id', 'unknown')
    timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    memory_file = os.path.join(MEMORY_DIR, 'agent-history.jsonl')
    try:
        with open(memory_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps({"agentType": agent_type, "completedAt": timestamp}) + '\n')
    except OSError:
        pass

    if re.search(SKIP_AGENTS, agent_type):
        print(json.dumps({"message": f"Agent {agent_type} completed"}))
        sys.exit(0)

    state_file = os.path.join(STATE_DIR, f'session-{session_id}-changes.json')
    if os.path.isfile(state_file):
        try:
            with open(state_file, encoding='utf-8') as f:
                state = json.load(f)
            count = state.get('cumulativeCodeFiles', 0)
            if count > 0:
                files = ', '.join(state.get('modifiedFiles', []))
                state['cumulativeCodeFiles'] = 0
                with open(state_file, 'w', encoding='utf-8') as f:
                    json.dump(state, f)
                print(json.dumps({"hookSpecificOutput": {"hookEventName": "SubagentStop",
                    "additionalContext": f"SNIPER VALIDATION REQUIRED: Agent '{agent_type}' "
                    f"modified {count} code file(s): {files}. Run sniper agent now."}}))
                sys.exit(0)
        except (json.JSONDecodeError, OSError):
            pass

    print(json.dumps({"message": f"Agent {agent_type} completed (no code changes)"}))
    sys.exit(0)


if __name__ == '__main__':
    main()
