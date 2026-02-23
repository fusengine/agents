#!/usr/bin/env python3
"""PostToolUse hook: Track SOLID principle reads in JSON log."""
import json
import os
import re
import sys
from datetime import datetime, timezone


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    tool_name = data.get('tool_name', '')
    file_path = data.get('tool_input', {}).get('file_path', '')
    session_id = data.get('session_id', '')

    if tool_name != 'Read' or not file_path:
        sys.exit(0)
    if not re.search(r'solid-[^/]+/(references/|SKILL\.md)', file_path):
        sys.exit(0)

    framework = ''
    if 'solid-nextjs' in file_path:
        framework = 'nextjs'
    elif 'solid-react' in file_path:
        framework = 'react'
    elif 'solid-php' in file_path:
        framework = 'php'
    elif 'solid-swift' in file_path:
        framework = 'swift'
    if not framework:
        sys.exit(0)

    log_dir = os.path.expanduser('~/.claude/logs/00-apex')
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, 'solid-reads.json')
    timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    state_file = os.path.join(log_dir, f'{datetime.now().strftime("%Y-%m-%d")}-state.json')
    project = 'unknown'
    if os.path.isfile(state_file):
        try:
            with open(state_file, encoding='utf-8') as f:
                project = json.load(f).get('target', {}).get('project', 'unknown')
        except (json.JSONDecodeError, OSError):
            pass

    reads_data = {'reads': []}
    if os.path.isfile(log_file):
        try:
            with open(log_file, encoding='utf-8') as f:
                reads_data = json.load(f)
        except (json.JSONDecodeError, OSError):
            pass

    reads_data['reads'].append({
        'timestamp': timestamp,
        'framework': framework,
        'session': session_id,
        'project': project,
        'file': file_path,
    })

    try:
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(reads_data, f, indent=2)
    except OSError:
        pass

    sys.exit(0)


if __name__ == '__main__':
    main()
